// 1. IMPORTACIONES
const express = require('express');
const router = express.Router();

// 2. EXPORTACIÓN RECIBIENDO LA CONEXIÓN DB DE MYSQL
module.exports = (db) => {

    // =========================================================================
    // ENDPOINT 1: OBTENER TODOS LOS USUARIOS (GET /api/usuarios)
    // =========================================================================
    router.get('/', (req, res) => {
        const query = 'SELECT id, legajo, nombre_completo, rol, id_unidad, activo FROM usuarios';

        db.query(query, (error, resultados) => {
            if (error) {
                console.error("Error consultando usuarios:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor al consultar usuarios" });
            }

            res.json({
                status: 200,
                total: resultados.length,
                data: resultados
            });
        });
    });

    // =========================================================================
    // ENDPOINT 2: REGISTRAR UN NUEVO USUARIO (POST /api/usuarios)
    // =========================================================================
    router.post('/', (req, res) => {
        const { legajo, contrasena, nombre_completo, id_unidad } = req.body;

        // Validar que los campos obligatorios existan
        if (!legajo || !contrasena || !nombre_completo) {
            return res.status(400).json({ status: 400, mensaje: "Faltan datos obligatorios (legajo, contraseña y nombre completo)." });
        }

        // Sanitización: aseguramos que legajo sea string y quitamos espacios
        const legajoLimpio = String(legajo).trim();

        // VALIDACIÓN DE LEGAJO: Debe tener exactamente 4 números y preservar ceros (VARCHAR(4))
        const regexLegajo = /^\d{4}$/;
        if (!regexLegajo.test(legajoLimpio)) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "El legajo debe contener exactamente 4 dígitos numéricos (ej: 0012, 1045)." 
            });
        }

        // PASO A: Comprobar que el legajo no esté registrado en la BD (Evita error por UNIQUE KEY)
        const checkQuery = 'SELECT id FROM usuarios WHERE legajo = ?';
        db.query(checkQuery, [legajoLimpio], (checkErr, results) => {
            if (checkErr) {
                console.error("Error validando legajo duplicado:", checkErr);
                return res.status(500).json({ status: 500, mensaje: "Error interno en el servidor." });
            }

            if (results.length > 0) {
                return res.status(400).json({ status: 400, mensaje: "El legajo ingresado ya se encuentra registrado." });
            }

            // PASO B: Insertar el usuario con rol de solo lectura/consulta por defecto ('consulta')
            const insertQuery = `
                INSERT INTO usuarios (legajo, contrasena, nombre_completo, rol, id_unidad, activo) 
                VALUES (?, ?, ?, ?, ?, 1)
            `;

            const rolDefault = 'consulta'; // Rol enum válido en la base de datos
            const unidadId = id_unidad ? parseInt(id_unidad) : null;

            db.query(insertQuery, [legajoLimpio, contrasena, nombre_completo.trim(), rolDefault, unidadId], (error, resultados) => {
                if (error) {
                    console.error("Error creando usuario en MySQL:", error);
                    return res.status(500).json({ status: 500, mensaje: "Error interno al registrar usuario." });
                }

                res.status(201).json({
                    status: 201,
                    mensaje: "¡Usuario registrado con éxito con el rol de CONSULTA!",
                    nuevoId: resultados.insertId,
                    usuario: {
                        id: resultados.insertId,
                        legajo: legajoLimpio,
                        nombre_completo: nombre_completo.trim(),
                        rol: rolDefault,
                        id_unidad: unidadId
                    }
                });
            });
        });
    });

    return router;
};