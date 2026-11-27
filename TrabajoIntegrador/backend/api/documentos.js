const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const verificarToken = require('../verificarToken');
const { PDFDocument } = require('pdf-lib');

//  CONFIGURACIÓN DE MULTER

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../backend/uploads/documentos');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // Límite estricto de 20 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten archivos PDF."));
        }
    }
});

module.exports = (db) => {

    // AUDITORÍA DE ACCESOS
    // Registra en la trazabilidad del convenio cada descarga o vista previa
    // de un documento (requisito: registrar acciones relevantes y descargas).
    // Los errores de auditoría no interrumpen la descarga: solo se loguean.

    function registrarAcceso(idConvenio, idUsuario, texto) {
        const query = `
            INSERT INTO auditoria_observaciones
                (id_convenio, id_usuario, observacion, estado_previo, estado_nuevo)
            VALUES (?, ?, ?, NULL, NULL)
        `;
        db.query(query, [idConvenio, idUsuario, texto], (error) => {
            if (error) {
                console.error("Error registrando el acceso en auditoría:", error);
            }
        });
    }

    // ==========================================
    // 1. RUTA ESPECÍFICA DE CONVENIO (SIEMPRE ARRIBA)
    // ==========================================
    router.get('/convenio/:id_convenio', verificarToken, (req, res) => {
        const idConvenio = req.params.id_convenio;
        db.query('SELECT id, tipo_documento, ruta_archivo, hash_sha256 FROM documentos WHERE id_convenio = ?', [idConvenio], (error, resultados) => {
            if (error) {
                console.error("Error buscando documentos del convenio:", error);
                return res.status(500).json({ status: 500, mensaje: "Error al buscar documentos." });
            }
            res.json({ status: 200, documentos: resultados });
        });
    });


    // ==========================================
    // 2. SUBIR DOCUMENTO Y CALCULAR SHA-256 
    // ==========================================
     router.post('/', verificarToken,async (req, res, next) => {
        if (req.usuario?.rol === 'consulta') {
            return res.status(403).json({ status: 403, mensaje: 'El rol consulta solo tiene permiso de lectura.' });
        }
        next();
    }, upload.single('archivo'), async (req, res) => {
        const { id_convenio, tipo_documento } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ status: 400, mensaje: "No se envió archivo o superó los 20 MB." });
        }

        if (!id_convenio || !tipo_documento) {
            fs.unlinkSync(file.path); 
            return res.status(400).json({ status: 400, mensaje: "Falta el ID del convenio o el tipo de documento." });
        }

        try {
            let fileBuffer = fs.readFileSync(file.path);

            // Estampamos la marca en los metadatos del PDF si viene de la app (o siempre)
            const origen = req.body.origen || 'App Móvil Convenios UNLPam';
            const fechaMarca = new Date().toISOString();
            const marcaObj = {
                origen,
                usuario_id: req.usuario.id,
                usuario_rol: req.usuario.rol,
                id_convenio: Number(id_convenio),
                tipo_documento,
                fecha_hora: fechaMarca
            };

            const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
            pdfDoc.setAuthor(`Usuario #${req.usuario.id} (${req.usuario.rol})`);
            pdfDoc.setCreator(origen);
            pdfDoc.setProducer('API Convenios UNLPam');
            pdfDoc.setSubject(JSON.stringify(marcaObj));
            pdfDoc.setKeywords([
                `convenio:${id_convenio}`,
                `usuario:${req.usuario.id}`,
                `fecha:${fechaMarca}`,
                'verificado_app_movil'
            ]);

            const pdfMarcadoBytes = await pdfDoc.save();
            fs.writeFileSync(file.path, pdfMarcadoBytes);
            fileBuffer = Buffer.from(pdfMarcadoBytes);

            // Generamos el Hash SHA-256 sobre el PDF ya marcado
            const hashSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

            const query = `
                INSERT INTO documentos (id_convenio, tipo_documento, ruta_archivo, hash_sha256)
                VALUES (?, ?, ?, ?)
            `;

            db.query(query, [id_convenio, tipo_documento, file.filename, hashSha256], (error, resultados) => {
                if (error) {
                    console.error("Error en DB:", error);
                    fs.unlinkSync(file.path);
                    return res.status(500).json({ status: 500, mensaje: "Error guardando en la base de datos." });
                }

                res.status(201).json({
                    status: 201,
                    mensaje: "Documento subido y marcado con éxito.",
                    nuevoId: resultados.insertId,
                    hash: hashSha256,
                    marca: marcaObj
                });
            });
        } catch (error) {
            console.error("Error procesando PDF:", error);
            res.status(500).json({ status: 500, mensaje: "Error interno procesando el PDF." });
        }
    });

   
    // ==========================================
    // 3. DESCARGAR DOCUMENTO SEGURO (/:id/download)
    // ==========================================
    router.get('/:id/download', verificarToken, (req, res) => {
        const idDoc = req.params.id;
        
        db.query('SELECT d.id_convenio, d.ruta_archivo, d.tipo_documento, c.estado, c.id_unidad_responsable FROM documentos d INNER JOIN convenios c ON c.id = d.id_convenio WHERE d.id = ?', [idDoc], (error, resultados) => {
            if (error || resultados.length === 0) {
                return res.status(404).json({ status: 404, mensaje: "Documento no encontrado en la base de datos." });
            }

            const documento = resultados[0];
            if (req.usuario?.rol === 'consulta' && !['aprobado', 'firmado'].includes(documento.estado)) {
                return res.status(404).json({ status: 404, mensaje: 'Documento no encontrado.' });
            }
            if (req.usuario?.id_unidad != null && Number(req.usuario.id_unidad) !== Number(documento.id_unidad_responsable)) {
                return res.status(404).json({ status: 404, mensaje: 'Documento no encontrado.' });
            }
            const archivoFisico = documento.ruta_archivo;
            const rutaCompleta = path.join(__dirname, '../../backend/uploads/documentos', archivoFisico);

            if (fs.existsSync(rutaCompleta)) {
                registrarAcceso(
                    documento.id_convenio,
                    req.usuario.id,
                    `Descarga del documento "${documento.tipo_documento}" (ID #${idDoc}).`
                );
                res.download(rutaCompleta); 
            } else {
                res.status(404).json({ status: 404, mensaje: "El archivo físico no existe en el disco." });
            }
        });
    });


    // ==========================================
    // 4. VISTA PREVIA DE DOCUMENTO (/:id/view)
    // ==========================================
    router.get('/:id/view', verificarToken, (req, res) => {
        const idDoc = req.params.id;
        
        db.query('SELECT d.id_convenio, d.ruta_archivo, c.estado, c.id_unidad_responsable FROM documentos d INNER JOIN convenios c ON c.id = d.id_convenio WHERE d.id = ?', [idDoc], (error, resultados) => {
            if (error || resultados.length === 0) {
                return res.status(404).json({ status: 404, mensaje: "Documento no encontrado." });
            }

            const documento = resultados[0];
            if (req.usuario?.rol === 'consulta' && !['aprobado', 'firmado'].includes(documento.estado)) {
                return res.status(404).json({ status: 404, mensaje: 'Documento no encontrado.' });
            }
            if (req.usuario?.id_unidad != null && Number(req.usuario.id_unidad) !== Number(documento.id_unidad_responsable)) {
                return res.status(404).json({ status: 404, mensaje: 'Documento no encontrado.' });
            }

            const rutaCompleta = path.join(__dirname, '../../backend/uploads/documentos', documento.ruta_archivo);

            if (fs.existsSync(rutaCompleta)) {
                registrarAcceso(
                    documento.id_convenio,
                    req.usuario.id,
                    `Vista previa del documento (ID #${idDoc}).`
                );
                res.sendFile(rutaCompleta); 
            } else {
                res.status(404).json({ status: 404, mensaje: "El archivo físico no existe en el disco." });
            }
        });
    });

    // ==========================================
    // 5. LEER METADATOS / MARCA DEL PDF (/:id/metadata)
    // ==========================================
    router.get('/:id/metadata', verificarToken, (req, res) => {
        const idDoc = req.params.id;
        db.query('SELECT ruta_archivo, tipo_documento, hash_sha256 FROM documentos WHERE id = ?', [idDoc], async (error, resultados) => {
            if (error || resultados.length === 0) {
                return res.status(404).json({ status: 404, mensaje: "Documento no encontrado." });
            }

            const rutaCompleta = path.join(__dirname, '../../backend/uploads/documentos', resultados[0].ruta_archivo);
            if (!fs.existsSync(rutaCompleta)) {
                return res.status(404).json({ status: 404, mensaje: "Archivo físico no encontrado." });
            }

            try {
                const bytes = fs.readFileSync(rutaCompleta);
                const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
                let marca = null;
                try { marca = JSON.parse(pdfDoc.getSubject() || 'null'); } catch {}

                return res.json({
                    status: 200,
                    metadata: {
                        autor: pdfDoc.getAuthor() || 'Sin marca',
                        creador: pdfDoc.getCreator() || 'Desconocido',
                        productor: pdfDoc.getProducer() || 'Desconocido',
                        keywords: pdfDoc.getKeywords() || '',
                        hash_sha256: resultados[0].hash_sha256,
                        marca
                    }
                });
            } catch (e) {
                return res.status(500).json({ status: 500, mensaje: "No se pudieron leer los metadatos del PDF." });
            }
        });
    });

    return router;
};