const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const verificarToken = require('../verificarToken');

// =========================================================================
// 1. CONFIGURACIÓN DE MULTER
// =========================================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads/documentos');
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

    // =========================================================================
    // 2. SUBIR DOCUMENTO Y CALCULAR SHA-256 (POST /api/documents)
    // =========================================================================
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

    return router;
};