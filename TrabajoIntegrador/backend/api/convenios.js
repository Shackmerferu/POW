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
            SELECT c.*, d.id as doc_id, d.tipo_documento, d.ruta_archivo, d.fecha_subida
            FROM convenios c
            LEFT JOIN documentos d ON c.id = d.id_convenio
        `;

    // Autorización por unidad: si el usuario tiene unidad asignada, solo ve
    // los convenios de ESA unidad. Sin unidad asignada (administración), ve todo.
    const valores = [];
    if (
      req.usuario.id_unidad !== null &&
      req.usuario.id_unidad !== undefined
    ) {
      query += " WHERE c.id_unidad_responsable = ?";
      valores.push(req.usuario.id_unidad);
    }

    db.query(query, valores, (error, resultados) => {
      if (error)
        return res
          .status(500)
          .json({ status: 500, mensaje: "Error en el servidor" });

      // Magia de JavaScript para agrupar las filas de SQL en un objeto prolijo
      const conveniosAgrupados = {};

      resultados.forEach((row) => {
        if (!conveniosAgrupados[row.id]) {
          // Si el convenio no existe en nuestro objeto, lo creamos
          conveniosAgrupados[row.id] = {
            id: row.id,
            codigo_unico: row.codigo_unico,
            titulo: row.titulo,
            tipo: row.tipo,
            estado: row.estado,
            objeto: row.objeto,
            marco_legal: row.marco_legal,
            confidencialidad: row.confidencialidad,
            fecha_firma: row.fecha_firma,
            fecha_inicio: row.fecha_inicio,
            fecha_vencimiento: row.fecha_vencimiento,
            dias_preaviso: row.dias_preaviso,
            id_unidad_responsable: row.id_unidad_responsable,
            id_antecedente: row.id_antecedente,
            documentos: [], // Array vacío listo para llenarse
          };
        }
        // Si esta fila trajo un documento asociado, lo metemos en el array
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

  // ENDPOINT PARA GUARDAR UN CONVENIO NUEVO
  // Acepta multipart/form-data: los campos del formulario + un PDF
  // opcional (campo "archivo") que se guarda como documento "principal"
  // con su hash SHA-256 de integridad.
  router.post("/", verificarToken, (req, res) => {
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
      // Estos son opcionales (permiten NULL)
      estado,
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

      // Si no mandan estado, tu base usa 'borrador' por defecto. El alta
      // desde el panel manda 'revision' para entrar al circuito de revisión.
      const estadoFinal = estado || "borrador";
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

  router.put("/:id/estado", verificarToken, (req, res) => {
    const idConvenio = req.params.id;
    const { estado_nuevo, observacion, fecha_actualizacion_cliente } = req.body;
    const idResponsable = req.usuario.id;

    if (!estado_nuevo || !observacion) {
      return res
        .status(400)
        .json({
          status: 400,
          mensaje: "El nuevo estado y el fundamento son obligatorios.",
        });
    }

    db.query(
      "SELECT estado FROM convenios WHERE id = ?",
      [idConvenio],
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
            mensaje: `Tu rol (${
              req.usuario.rol ?? "desconocido"
            }) no permite mover el instrumento de "${estadoPrevio}" a "${estado_nuevo}".`,
          });
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
          let updateQuery =
            "UPDATE convenios SET estado = ?, fecha_actualizacion = NOW() WHERE id = ?";
          let valoresUpd = [estado_nuevo, idConvenio];

          if (fecha_actualizacion_cliente) {
            updateQuery =
              "UPDATE convenios SET estado = ?, fecha_actualizacion = NOW() WHERE id = ? AND fecha_actualizacion = ?";
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
      WHERE a.id_convenio = ?
      ORDER BY a.fecha_registro ASC, a.id ASC
    `;

    db.query(query, [idConvenio], (error, resultados) => {
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
    const query =
      "SELECT id, codigo_unico, titulo, tipo, estado FROM convenios WHERE id_antecedente = ?";

    db.query(query, [idConvenio], (error, resultados) => {
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
