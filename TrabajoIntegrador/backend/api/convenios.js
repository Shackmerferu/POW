// 1. IMPORTACIONES BÁSICAS
const express = require("express");
const router = express.Router(); // Creamos el "mini-semáforo" para las rutas de convenios
const verificarToken = require("../verificarToken");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Carpeta donde quedan los PDF subidos (no accesibles por URL directa:
// el frontend los pide por la API, protegiendo el acceso directo).
const CARPETA_SUBIDAS = path.join(__dirname, "..", "uploads", "documentos");
fs.mkdirSync(CARPETA_SUBIDAS, { recursive: true });

// Subida de PDF: máximo 20 MB y solo ese tipo.
const subida = multer({
  storage: multer.diskStorage({
    destination: (req, archivo, cb) => cb(null, CARPETA_SUBIDAS),
    filename: (req, archivo, cb) => {
      const seguro = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
      const limpio = archivo.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${seguro}-${limpio}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, archivo, cb) => {
    if (archivo.mimetype !== "application/pdf") {
      return cb(new Error("Solo se aceptan archivos PDF"));
    }
    cb(null, true);
  },
});

module.exports = (db) => {
  // 3. ENDPOINT PARA LISTAR TODOS LOS CONVENIOS (CON SUS DOCUMENTOS)
  router.get("/", verificarToken, (req, res) => {
  let query = `
    SELECT c.*, d.id AS doc_id, d.tipo_documento,
           d.ruta_archivo, d.fecha_subida,
           DATE_FORMAT(c.fecha_actualizacion, '%Y-%m-%d %H:%i:%s') AS fecha_actualizacion_version
    FROM convenios c
    LEFT JOIN documentos d ON c.id = d.id_convenio
  `;

  const valores = [];
  const filtros = [];

  // El rol consulta solo puede recibir convenios aprobados o firmados.
  if (req.usuario.rol === "consulta") {
    filtros.push("c.estado IN ('aprobado', 'firmado')");
  }
  if (req.usuario.id_unidad !== null && req.usuario.id_unidad !== undefined) {
    filtros.push("c.id_unidad_responsable = ?");
    valores.push(req.usuario.id_unidad);
  }
  if (filtros.length > 0) query += ` WHERE ${filtros.join(" AND ")}`;

  db.query(query, valores, (error, resultados) => {
    if (error) {
      console.error("Error consultando convenios:", error);
      return res.status(500).json({
        status: 500,
        mensaje: "Error en el servidor.",
      });
    }

    const conveniosAgrupados = {};

    resultados.forEach((row) => {
      if (!conveniosAgrupados[row.id]) {
        conveniosAgrupados[row.id] = {
          id: row.id,
          codigo_unico: row.codigo_unico,
          titulo: row.titulo,
          tipo: row.tipo,
          estado: row.estado,
          objeto: row.objeto,
          obligaciones: row.obligaciones,
          condiciones_rescision: row.condiciones_rescision,
          condiciones_renovacion: row.condiciones_renovacion,
          marco_legal: row.marco_legal,
          resolucion: row.resolucion,
          expediente: row.expediente,
          notas: row.notas,
          confidencialidad: row.confidencialidad,
          fecha_firma: row.fecha_firma,
          fecha_inicio: row.fecha_inicio,
          fecha_vencimiento: row.fecha_vencimiento,
          dias_preaviso: row.dias_preaviso,
          fecha_actualizacion: row.fecha_actualizacion,
          fecha_actualizacion_version: row.fecha_actualizacion_version,
          id_unidad_responsable: row.id_unidad_responsable,
          id_antecedente: row.id_antecedente,
          documentos: [],
        };
      }

      if (row.doc_id) {
        conveniosAgrupados[row.id].documentos.push({
          id: row.doc_id,
          tipo_documento: row.tipo_documento,
          ruta_archivo: row.ruta_archivo,
          fecha_subida: row.fecha_subida,
        });
      }
    });

    res.json({
      status: 200,
      total: Object.keys(conveniosAgrupados).length,
      data: Object.values(conveniosAgrupados),
    });
  });
});

  // Alta de convenio con PDF opcional.
  router.post("/", verificarToken, (req, res) => {
    if (req.usuario?.rol === "consulta") {
      return res.status(403).json({ status: 403, mensaje: "El rol consulta solo tiene permiso de lectura." });
    }
    subida.single("archivo")(req, res, (errorSubida) => {
      if (errorSubida) {
        const mensaje =
          errorSubida.code === "LIMIT_FILE_SIZE"
            ? "El PDF supera el máximo de 20 MB."
            : `Archivo inválido: ${errorSubida.message}`;
        return res.status(400).json({ status: 400, mensaje });
      }

      crearConvenio(req, res);
    });
  });
function crearConvenio(req, res) {
  // 1. Atrapamos los datos con los nombres EXACTOS de tu base de datos
  const {
    codigo_unico,
    titulo,
    tipo,
    objeto,
    id_unidad_responsable,
    // Estos son opcionales (permiten NULL). El estado inicial siempre es borrador.
    marco_legal,
    confidencialidad,
    fecha_firma,
    fecha_inicio,
    fecha_vencimiento,
    dias_preaviso,
    id_antecedente,
  } = req.body;

  // 2. Control estricto: exigimos los que dicen "No" en Nulo en phpMyAdmin
  if (!titulo || !tipo || !objeto || !id_unidad_responsable) {
    return res
      .status(400)
      .json({
        status: 400,
        mensaje: "Faltan datos obligatorios (título, tipo, objeto o unidad)",
      });
  }

  // 3. Si el formulario no manda código único, lo generamos:
  //    UNLPAM-{FI|R}-{año}-{consecutivo} según la unidad responsable.
  if (codigo_unico) {
    insertarConvenio(codigo_unico);
  } else {
    const prefijo = Number(id_unidad_responsable) === 2 ? "R" : "FI";
    const anio = new Date().getFullYear();
    db.query(
      "SELECT COUNT(*) AS total FROM convenios",
      (errConteo, resConteo) => {
        const consecutivo = String((resConteo?.[0]?.total ?? 0) + 1).padStart(
          3,
          "0",
        );
        insertarConvenio(`UNLPAM-${prefijo}-${anio}-${consecutivo}`);
      },
    );
  }

  function insertarConvenio(codigoFinal) {
    // 4. Preparamos la consulta SQL
    const query = `
                INSERT INTO convenios (
                    codigo_unico, titulo, tipo, estado, objeto, marco_legal, confidencialidad,
                    fecha_firma, fecha_inicio, fecha_vencimiento, dias_preaviso, id_unidad_responsable, id_antecedente
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

    // El estado inicial es borrador. El envío a revisión requiere los datos obligatorios y un PDF.
    const estadoFinal = "borrador";
    const confFinal =
      confidencialidad === true ||
        confidencialidad === "true" ||
        confidencialidad === "1"
        ? 1
        : 0;
    const preaviso = dias_preaviso ? Number(dias_preaviso) : null;

    // 5. Mapeamos los valores (reemplazando undefined por null para que MySQL no se queje)
    const valores = [
      codigoFinal,
      titulo,
      tipo,
      estadoFinal,
      objeto,
      marco_legal || null,
      confFinal,
      fecha_firma || null,
      fecha_inicio || null,
      fecha_vencimiento || null,
      preaviso,
      id_unidad_responsable,
      id_antecedente || null,
    ];

    // 6. Ejecutamos la inserción
    db.query(query, valores, (error, resultados) => {
      if (error) {
        console.error("Error guardando convenio:", error);
        if (error.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({
              status: 400,
              mensaje: "El código único ya existe en la base",
            });
        }
        return res
          .status(500)
          .json({
            status: 500,
            mensaje: "Error interno al intentar guardar en la base de datos",
          });
      }

      const nuevoId = resultados.insertId;

      // 7. Si el formulario incluyó un PDF, se registra como documento
      //    principal con su SHA-256 de integridad.
      if (req.file) {
        const hash = crypto
          .createHash("sha256")
          .update(fs.readFileSync(req.file.path))
          .digest("hex");
        db.query(
          "INSERT INTO documentos (id_convenio, tipo_documento, ruta_archivo, hash_sha256) VALUES (?, ?, ?, ?)",
          [nuevoId, "principal", req.file.filename, hash],
          (errDoc) => {
            if (errDoc) console.error("Error registrando documento:", errDoc);
            registrarAuditoria(nuevoId, estadoFinal);
          },
        );
      } else {
        registrarAuditoria(nuevoId, estadoFinal);
      }
    });
  }

  // 8. Auditoría del alta: quién creó el instrumento y a qué estado entró.
  function registrarAuditoria(nuevoId, estadoFinal) {
    const observacionAlta = req.file
      ? "Alta del instrumento con documento principal adjunto (formulario web)."
      : "Alta del instrumento mediante el formulario web.";
    db.query(
      "INSERT INTO auditoria_observaciones (id_convenio, id_usuario, observacion, estado_previo, estado_nuevo) VALUES (?, ?, ?, NULL, ?)",
      [nuevoId, req.usuario.id, observacionAlta, estadoFinal],
      () => {
        res.json({
          status: 201,
          mensaje: "¡Convenio creado con éxito!",
          nuevoId: nuevoId,
        });
      },
    );
  }
}

//CAMBIAR ESTADO Y AGREGAR OBSERVACIÓN

// EDICI?N DE LA FICHA DEL CONVENIO.
// Solo administraci?n y gesti?n pueden modificar sus datos descriptivos.
// ALERTAS DE VENCIMIENTO Y PREAVISO PARA EL PANEL WEB.
router.get('/alerts', verificarToken, (req, res) => {
  let query = `
    SELECT id, codigo_unico, titulo,
           DATEDIFF(fecha_vencimiento, CURDATE()) AS dias_restantes,
           fecha_vencimiento, dias_preaviso
    FROM convenios
    WHERE fecha_vencimiento IS NOT NULL
      AND estado NOT IN ('rescindido', 'archivado')
      AND fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL COALESCE(dias_preaviso, 0) DAY)
  `;
  if (req.usuario.rol === "consulta") {
    query += " AND estado IN ('aprobado', 'firmado')";
  }
  const valores = [];
  if (req.usuario.id_unidad !== null && req.usuario.id_unidad !== undefined) {
    query += ' AND id_unidad_responsable = ?';
    valores.push(req.usuario.id_unidad);
  }
  query += ' ORDER BY fecha_vencimiento ASC';

  db.query(query, valores, (error, resultados) => {
    if (error) {
      console.error('Error consultando alertas de vencimiento:', error);
      return res.status(500).json({ status: 500, mensaje: 'No se pudieron cargar las alertas.' });
    }
    return res.json({ status: 200, total: resultados.length, data: resultados });
  });
});

router.put('/:id', verificarToken, (req, res) => {
  const { rol, id_unidad } = req.usuario || {};
  if (!['administracion', 'gestion'].includes(rol)) {
    return res.status(403).json({ status: 403, mensaje: 'Tu rol no puede editar la ficha del convenio.' });
  }

  const camposPermitidos = [
    'titulo', 'objeto', 'obligaciones', 'condiciones_rescision',
    'condiciones_renovacion', 'marco_legal', 'resolucion', 'expediente',
    'notas', 'fecha_inicio', 'fecha_firma', 'fecha_vencimiento',
    'dias_preaviso', 'confidencialidad',
  ];
  const cambios = camposPermitidos.filter((campo) =>
    Object.prototype.hasOwnProperty.call(req.body, campo),
  );

  if (cambios.length === 0) {
    return res.status(400).json({ status: 400, mensaje: 'No se recibieron campos para actualizar.' });
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'titulo') && !String(req.body.titulo || '').trim()) {
    return res.status(400).json({ status: 400, mensaje: 'El t?tulo es obligatorio.' });
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'objeto') && !String(req.body.objeto || '').trim()) {
    return res.status(400).json({ status: 400, mensaje: 'El objeto es obligatorio.' });
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'dias_preaviso') && req.body.dias_preaviso !== null && (!Number.isInteger(Number(req.body.dias_preaviso)) || Number(req.body.dias_preaviso) < 0)) {
    return res.status(400).json({ status: 400, mensaje: 'Los d?as de preaviso deben ser un entero igual o mayor a cero.' });
  }

  const idConvenio = req.params.id;
  const fechaCliente = req.body.fecha_actualizacion_cliente;
  const asignaciones = cambios.map((campo) => `${campo} = ?`);
  const valores = cambios.map((campo) => {
    const valor = req.body[campo];
    if (campo === 'confidencialidad') return valor === true || valor === 1 || valor === '1' || valor === 'true' ? 1 : 0;
    if (campo === 'dias_preaviso') return valor === '' ? null : valor;
    return valor === '' ? null : valor;
  });
  asignaciones.push('fecha_actualizacion = NOW()');

  let query = `UPDATE convenios SET ${asignaciones.join(', ')} WHERE id = ?`;
  valores.push(idConvenio);
  if (id_unidad !== null && id_unidad !== undefined) {
    query += ' AND id_unidad_responsable = ?';
    valores.push(id_unidad);
  }
  if (fechaCliente) {
    query += " AND DATE_FORMAT(fecha_actualizacion, '%Y-%m-%d %H:%i:%s') = ?";
    valores.push(fechaCliente);
  }

  db.query(query, valores, (error, resultado) => {
    if (error) {
      console.error('Error editando ficha del convenio:', error);
      return res.status(500).json({ status: 500, mensaje: 'Error actualizando la ficha.' });
    }
    if (resultado.affectedRows === 0) {
      const consultaActual = `SELECT id, id_unidad_responsable,
        DATE_FORMAT(fecha_actualizacion, '%Y-%m-%d %H:%i:%s') AS fecha_actualizacion_version
        FROM convenios WHERE id = ?`;
      return db.query(consultaActual, [idConvenio], (errExiste, filas) => {
        if (errExiste || !filas.length) {
          return res.status(404).json({ status: 404, mensaje: 'Convenio no encontrado.' });
        }
        if (id_unidad !== null && id_unidad !== undefined && Number(filas[0].id_unidad_responsable) !== Number(id_unidad)) {
          return res.status(403).json({ status: 403, mensaje: 'El convenio está fuera del alcance de tu unidad.' });
        }
        const versionActual = filas[0].fecha_actualizacion_version;
        if (fechaCliente && String(fechaCliente) !== String(versionActual)) {
          return res.status(409).json({ status: 409, mensaje: 'El convenio cambió en el servidor. Actualizá la ficha e intentá nuevamente.' });
        }
        // MySQL informa affectedRows=0 también cuando el formulario se guardó sin cambios.
        return res.json({ status: 200, sin_cambios: true, mensaje: 'La ficha ya tenía esos datos; no se realizaron cambios.' });
      });
    }

    const observacion = `Se actualizaron los datos de la ficha: ${cambios.join(', ')}.`;
    db.query(
      'INSERT INTO auditoria_observaciones (id_convenio, id_usuario, observacion, estado_previo, estado_nuevo) VALUES (?, ?, ?, NULL, NULL)',
      [idConvenio, req.usuario.id, observacion],
      () => res.json({ status: 200, mensaje: 'Ficha actualizada correctamente.' }),
    );
  });
});

router.put("/:id/estado", verificarToken, (req, res) => {
  const idConvenio = req.params.id;
  const { estado_nuevo, observacion, fecha_firma, fecha_actualizacion_cliente } = req.body;
  const idResponsable = req.usuario.id;

  if (estado_nuevo === 'firmado' && !fecha_firma) {
    return res.status(400).json({ status: 400, mensaje: 'La fecha de firma es obligatoria.' });
  }

  if (!estado_nuevo || !observacion) {
    return res
      .status(400)
      .json({
        status: 400,
        mensaje: "El nuevo estado y el fundamento son obligatorios.",
      });
  }

  let consultaConvenio = `
    SELECT c.estado, c.titulo, c.tipo, c.objeto, c.id_unidad_responsable,
           (SELECT COUNT(*) FROM documentos d WHERE d.id_convenio = c.id) AS cantidad_documentos
    FROM convenios c
    WHERE c.id = ?
  `;
  const valoresConvenio = [idConvenio];
  if (req.usuario.id_unidad != null) {
    consultaConvenio += " AND c.id_unidad_responsable = ?";
    valoresConvenio.push(req.usuario.id_unidad);
  }

  db.query(
    consultaConvenio,
    valoresConvenio,
    (err, resConv) => {
      if (err || resConv.length === 0) {
        return res
          .status(404)
          .json({ status: 404, mensaje: "Convenio no encontrado." });
      }

      const estadoPrevio = resConv[0].estado;

      // Transiciones válidas por rol, validadas EN EL SERVIDOR (no se
      // confía en el front): consulta no puede mover estados; revisión
      // aprueba o devuelve; gestión envía a revisión y firma; administración
      // todas. Cualquier otra transición se rechaza con 403.
      const TRANSICIONES_SERVIDOR = {
        administracion: {
          borrador: ["revision", "archivado"],
          revision: ["aprobado", "borrador"],
          aprobado: ["firmado"],
          firmado: ["rescindido", "archivado"],
        },
        gestion: {
          borrador: ["revision"],
          aprobado: ["firmado"],
          firmado: ["rescindido", "archivado"],
        },
        revision: {
          revision: ["aprobado", "borrador"],
        },
      };

      const permitidas =
        (TRANSICIONES_SERVIDOR[req.usuario.rol] ?? {})[estadoPrevio] ?? [];

      if (!permitidas.includes(estado_nuevo)) {
        return res.status(403).json({
          status: 403,
          mensaje: `Tu rol (${req.usuario.rol ?? "desconocido"
            }) no permite mover el instrumento de "${estadoPrevio}" a "${estado_nuevo}".`,
        });
      }

      if (estado_nuevo === "revision") {
        const convenioActual = resConv[0];
        const faltanDatos =
          !String(convenioActual.titulo ?? "").trim() ||
          !String(convenioActual.tipo ?? "").trim() ||
          !String(convenioActual.objeto ?? "").trim() ||
          !convenioActual.id_unidad_responsable;
        const tienePdf = Number(convenioActual.cantidad_documentos) > 0;
        if (faltanDatos || !tienePdf) {
          return res.status(400).json({
            status: 400,
            mensaje: "Para enviar el convenio a revisión, completá título, tipo, unidad responsable y objeto, y cargá al menos un PDF.",
          });
        }
      }

      if (estado_nuevo === "aprobado") {
        db.query(
          "SELECT COUNT(*) as cantidad FROM convenio_partes WHERE id_convenio = ?",
          [idConvenio],
          (errCount, resCount) => {
            if (resCount[0].cantidad < 2) {
              return res
                .status(400)
                .json({
                  status: 400,
                  mensaje: "Bloqueado: Debe tener al menos 2 partes.",
                });
            }
            ejecutarActualizacion();
          },
        );
      } else {
        ejecutarActualizacion();
      }

      function ejecutarActualizacion() {
        // Concurrencia optimista: si el cliente manda la fecha de
        // actualización que leyó, se exige que coincida (409 si otro
        // usuario movió el convenio primero). Cada transición estampa
        // fecha_actualizacion = NOW() para la próxima edición.
        const registrarFirma = estado_nuevo === 'firmado';
        let updateQuery = registrarFirma
          ? 'UPDATE convenios SET estado = ?, fecha_firma = ?, fecha_actualizacion = NOW() WHERE id = ?'
          : 'UPDATE convenios SET estado = ?, fecha_actualizacion = NOW() WHERE id = ?';
        let valoresUpd = registrarFirma
          ? [estado_nuevo, fecha_firma, idConvenio]
          : [estado_nuevo, idConvenio];

        if (fecha_actualizacion_cliente) {
          updateQuery += " AND DATE_FORMAT(fecha_actualizacion, '%Y-%m-%d %H:%i:%s') = ?";
          valoresUpd.push(fecha_actualizacion_cliente);
        }

        db.query(updateQuery, valoresUpd, (errUpd, resultados) => {
          if (errUpd)
            return res
              .status(500)
              .json({ status: 500, mensaje: "Error actualizando estado." });

          if (resultados.affectedRows === 0 && fecha_actualizacion_cliente) {
            return res
              .status(409)
              .json({
                status: 409,
                mensaje: "Conflicto: Otro usuario modificó este convenio.",
              });
          }

          const auditQuery = `
                        INSERT INTO auditoria_observaciones (id_convenio, id_usuario, observacion, estado_previo, estado_nuevo) 
                        VALUES (?, ?, ?, ?, ?)
                    `;
          db.query(
            auditQuery,
            [
              idConvenio,
              idResponsable,
              observacion,
              estadoPrevio,
              estado_nuevo,
            ],
            (errAud) => {
              res.json({
                status: 200,
                mensaje: "¡Estado actualizado y auditoría guardada!",
              });
            },
          );
        });
      }
    },
  );
});

// TRAZABILIDAD DEL TRÁMITE (AUDITORÍA)
// Devuelve el historial completo del convenio: altas, cambios de estado,
// observaciones y accesos a documentos, con el responsable de cada acción.

router.get("/:id/auditoria", verificarToken, (req, res) => {
  const idConvenio = req.params.id;

  const query = `
      SELECT a.id, a.id_usuario, u.nombre_completo, a.observacion,
             a.estado_previo, a.estado_nuevo, a.fecha_registro
      FROM auditoria_observaciones a
      LEFT JOIN usuarios u ON u.id = a.id_usuario
      INNER JOIN convenios c ON c.id = a.id_convenio
      WHERE a.id_convenio = ?
      ${req.usuario.rol === "consulta" ? "AND c.estado IN ('aprobado', 'firmado')" : ""}
      ${req.usuario.id_unidad != null ? "AND c.id_unidad_responsable = ?" : ""}
      ORDER BY a.fecha_registro ASC, a.id ASC
    `;

  const valoresAuditoria = [idConvenio];
  if (req.usuario.id_unidad != null) valoresAuditoria.push(req.usuario.id_unidad);

  db.query(query, valoresAuditoria, (error, resultados) => {
    if (error) {
      console.error("Error consultando auditoría:", error);
      return res
        .status(500)
        .json({ status: 500, mensaje: "Error en el servidor." });
    }
    res.json({ status: 200, total: resultados.length, data: resultados });
  });
});

// VER INSTRUMENTOS VINCULADOS
// Trae las adendas o convenios específicos que nacieron de este convenio

router.get("/:id/links", verificarToken, (req, res) => {
  const idConvenio = req.params.id;

  // Busca convenios cuyo "padre" sea el ID actual
  let query = `
    SELECT hijo.id, hijo.codigo_unico, hijo.titulo, hijo.tipo, hijo.estado
    FROM convenios hijo
    INNER JOIN convenios padre ON padre.id = ?
    WHERE hijo.id_antecedente = padre.id
  `;
  const valoresLinks = [idConvenio];
  if (req.usuario.rol === "consulta") {
    query += " AND padre.estado IN ('aprobado', 'firmado') AND hijo.estado IN ('aprobado', 'firmado')";
  }
  if (req.usuario.id_unidad != null) {
    query += " AND hijo.id_unidad_responsable = ? AND padre.id_unidad_responsable = ?";
    valoresLinks.push(req.usuario.id_unidad, req.usuario.id_unidad);
  }

  db.query(query, valoresLinks, (error, resultados) => {
    if (error) {
      console.error("Error consultando links:", error);
      return res
        .status(500)
        .json({ status: 500, mensaje: "Error en el servidor." });
    }
    res.json({ status: 200, total: resultados.length, data: resultados });
  });
});

// REGISTRAR LA RELACIÓN ENTRE INSTRUMENTOS
// Define el antecedente de un instrumento (renovación, sustitución o
// adenda). Validaciones: el antecedente debe existir, no puede apuntar a
// sí mismo y, si el usuario opera por unidad, debe ser de la misma unidad.
// Enviar id_antecedente = null desvincula.

router.put("/:id/links", verificarToken, (req, res) => {
  if (req.usuario?.rol === "consulta") {
    return res.status(403).json({ status: 403, mensaje: "El rol consulta solo tiene permiso de lectura." });
  }
  const idConvenio = req.params.id;
  const { id_antecedente } = req.body;

  function auditarRelacion(antecedenteFinal, callback) {
    const texto = antecedenteFinal
      ? `Vinculación de antecedente: instrumento #${antecedenteFinal}.`
      : "Desvinculación del antecedente.";
    db.query(
      "INSERT INTO auditoria_observaciones (id_convenio, id_usuario, observacion, estado_previo, estado_nuevo) VALUES (?, ?, ?, NULL, NULL)",
      [idConvenio, req.usuario.id, texto],
      () => callback(),
    );
  }

  // Desvincular: id_antecedente null/""/0 borra la relación.
  if (!id_antecedente || id_antecedente === "null") {
    db.query(
      "UPDATE convenios SET id_antecedente = NULL WHERE id = ?",
      [idConvenio],
      (error) => {
        if (error) {
          console.error("Error desvinculando antecedente:", error);
          return res
            .status(500)
            .json({ status: 500, mensaje: "Error en el servidor." });
        }
        auditarRelacion(null, () =>
          res.json({
            status: 200,
            mensaje: "Relación desvinculada.",
          }),
        );
      },
    );
    return;
  }

  const antecedenteId = Number(id_antecedente);

  db.query(
    "SELECT id, id_unidad_responsable FROM convenios WHERE id IN (?, ?)",
    [idConvenio, antecedenteId],
    (error, resultados) => {
      if (error) {
        console.error("Error validando la relación:", error);
        return res
          .status(500)
          .json({ status: 500, mensaje: "Error en el servidor." });
      }

      if (resultados.length < 2) {
        return res.status(404).json({
          status: 404,
          mensaje: "No se encontró el instrumento antecedente.",
        });
      }

      if (antecedenteId === Number(idConvenio)) {
        return res.status(400).json({
          status: 400,
          mensaje: "Un instrumento no puede ser su propio antecedente.",
        });
      }

      // Alcance: si el usuario tiene unidad asignada, el antecedente debe
      // pertenecer a la misma unidad que el instrumento a vincular.
      if (req.usuario.id_unidad !== null && req.usuario.id_unidad !== undefined) {
        const propio = resultados.find(
          (c) => Number(c.id) === Number(idConvenio),
        );
        const antecedente = resultados.find(
          (c) => Number(c.id) === antecedenteId,
        );
        if (
          propio &&
          antecedente &&
          Number(propio.id_unidad_responsable) !==
          Number(antecedente.id_unidad_responsable)
        ) {
          return res.status(403).json({
            status: 403,
            mensaje:
              "Solo podés vincular antecedentes de tu misma unidad responsable.",
          });
        }
      }

      db.query(
        "UPDATE convenios SET id_antecedente = ? WHERE id = ?",
        [antecedenteId, idConvenio],
        (errorUpd) => {
          if (errorUpd) {
            console.error("Error vinculando antecedente:", errorUpd);
            return res
              .status(500)
              .json({ status: 500, mensaje: "Error en el servidor." });
          }
          auditarRelacion(antecedenteId, () =>
            res.json({
              status: 200,
              mensaje: "Antecedente vinculado con éxito.",
            }),
          );
        },
      );
    },
  );
});

return router; // Devolvemos el router configurado
};
