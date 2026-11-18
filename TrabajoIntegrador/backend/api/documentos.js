const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const verificarToken = require('../verificarToken');

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


    //  SUBIR DOCUMENTO Y CALCULAR SHA-256 
    
    router.post('/', verificarToken, upload.single('archivo'), (req, res) => {
        
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
            // Generamos el Hash SHA-256
            const fileBuffer = fs.readFileSync(file.path);
            const hashSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

            // Adaptado EXACTAMENTE a las columnas de tu imagen
            const query = `
                INSERT INTO documentos (id_convenio, tipo_documento, ruta_archivo, hash_sha256) 
                VALUES (?, ?, ?, ?)
            `;

            const valores = [
                id_convenio, 
                tipo_documento, 
                file.filename, 
                hashSha256
            ];

            db.query(query, valores, (error, resultados) => {
                if (error) {
                    console.error("Error en DB:", error);
                    fs.unlinkSync(file.path); 
                    return res.status(500).json({ status: 500, mensaje: "Error guardando en la base de datos." });
                }

                res.status(201).json({
                    status: 201,
                    mensaje: "Documento subido con éxito.",
                    nuevoId: resultados.insertId,
                    hash: hashSha256
                });
            });

        } catch (error) {
            console.error("Error procesando:", error);
            res.status(500).json({ status: 500, mensaje: "Error interno con el archivo." });
        }
    });

   
    //  DESCARGAR DOCUMENTO SEGURO 
    
    router.get('/:id/download', verificarToken, (req, res) => {
        const idDoc = req.params.id;
        
        db.query('SELECT id_convenio, ruta_archivo, tipo_documento FROM documentos WHERE id = ?', [idDoc], (error, resultados) => {
            if (error || resultados.length === 0) {
                return res.status(404).json({ status: 404, mensaje: "Documento no encontrado en la base de datos." });
            }

            // Buscamos el archivo físico en la carpeta protegida
            const documento = resultados[0];
            const archivoFisico = documento.ruta_archivo;
            const rutaCompleta = path.join(__dirname, '../../backend/uploads/documentos', archivoFisico);

            if (fs.existsSync(rutaCompleta)) {
                // Trazabilidad: quién descargó qué documento y cuándo.
                registrarAcceso(
                    documento.id_convenio,
                    req.usuario.id,
                    `Descarga del documento "${documento.tipo_documento}" (ID #${idDoc}).`
                );
                // Express fuerza la descarga con el nombre encriptado
                res.download(rutaCompleta); 
            } else {
                res.status(404).json({ status: 404, mensaje: "El archivo físico no existe en el disco." });
            }
        });
    });
        //VISTA PREVIA DE DOCUMENTO
    router.get('/:id/view', verificarToken, (req, res) => {
        const idDoc = req.params.id;
        
        db.query('SELECT id_convenio, ruta_archivo FROM documentos WHERE id = ?', [idDoc], (error, resultados) => {
            if (error || resultados.length === 0) {
                return res.status(404).json({ status: 404, mensaje: "Documento no encontrado." });
            }

            const rutaCompleta = path.join(__dirname, '../../backend/uploads/documentos', resultados[0].ruta_archivo);

            if (fs.existsSync(rutaCompleta)) {
                // Trazabilidad: quién consultó la vista previa y cuándo.
                registrarAcceso(
                    resultados[0].id_convenio,
                    req.usuario.id,
                    `Vista previa del documento (ID #${idDoc}).`
                );
                // sendFile le dice al navegador "mostralo si podés", ideal para PDFs
                res.sendFile(rutaCompleta); 
            } else {
                res.status(404).json({ status: 404, mensaje: "El archivo físico no existe en el disco." });
            }
        });
    });

    return router;
};