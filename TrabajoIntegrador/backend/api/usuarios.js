// 1. IMPORTACIONES
// Importamos Express para manejar las rutas y el Router para empaquetar los endpoints.
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // <-- IMPORTAMOS LA LIBRERÍA DE SEGURIDAD

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
                return res.status(500).json({ 
                    status: 500, 
                    mensaje: "Error en el servidor al consultar usuarios." 
                });
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
        const { legajo, contrasena, nombre_completo, id_unidad } = req.body || {};

        // Validar que los campos obligatorios existan
        if (!legajo || !contrasena || !nombre_completo) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "Faltan datos obligatorios (legajo, contraseña y nombre completo)." 
            });
        }

        // Sanitización
        const legajoLimpio = String(legajo).trim();

        // VALIDACIÓN DE LEGAJO
        const regexLegajo = /^\d{4}$/;
        if (!regexLegajo.test(legajoLimpio)) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "El legajo debe contener exactamente 4 dígitos numéricos (ej: 0012, 1045)." 
            });
        }

        // PASO A: Comprobar que el legajo no esté registrado en la BD
        const checkQuery = 'SELECT id FROM usuarios WHERE legajo = ?';
        
        // Le agregamos 'async' a este callback para poder usar await con bcrypt
        db.query(checkQuery, [legajoLimpio], async (checkErr, results) => {
            if (checkErr) {
                console.error("Error validando legajo duplicado:", checkErr);
                return res.status(500).json({ status: 500, mensaje: "Error interno en el servidor." });
            }

            if (results.length > 0) {
                return res.status(400).json({ status: 400, mensaje: "El legajo ingresado ya se encuentra registrado." });
            }

            try {
                // PASO INTERMEDIO: ENCRIPTAR LA CONTRASEÑA
                // El número 10 es el "salt rounds" (nivel de complejidad del algoritmo)
                const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

                // PASO B: Insertar el usuario con la contraseña ya encriptada
                const insertQuery = `
                    INSERT INTO usuarios (legajo, contrasena, nombre_completo, rol, id_unidad, activo) 
                    VALUES (?, ?, ?, ?, ?, 1)
                `;

                const rolDefault = 'consulta';
                const unidadId = id_unidad ? parseInt(id_unidad) : null;

                // ATENCIÓN ACÁ: Mandamos 'contrasenaHasheada' en vez de 'contrasena'
                db.query(insertQuery, [legajoLimpio, contrasenaHasheada, nombre_completo.trim(), rolDefault, unidadId], (error, resultados) => {
                    if (error) {
                        console.error("Error creando usuario en MySQL:", error);
                        return res.status(500).json({ status: 500, mensaje: "Error interno al registrar usuario en la base de datos." });
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
            } catch (hashError) {
                console.error("Error al hashear la contraseña:", hashError);
                return res.status(500).json({ status: 500, mensaje: "Error de seguridad al procesar la cuenta." });
            }
        });
    });

    
    router.put('/:id', (req, res) => {
        const idUsuario = req.params.id; 
        const { rol, id_unidad, activo } = req.body; 

        if (!rol) {
            return res.status(400).json({ status: 400, mensaje: "El campo 'rol' es obligatorio para la actualización." });
        }

        const estadoActivo = activo !== undefined ? activo : 1;
        const unidadId = id_unidad ? parseInt(id_unidad) : null;

        const updateQuery = `
            UPDATE usuarios 
            SET rol = ?, id_unidad = ?, activo = ? 
            WHERE id = ?
        `;

        db.query(updateQuery, [rol, unidadId, estadoActivo, idUsuario], (error, resultados) => {
            if (error) {
                console.error("Error actualizando usuario en MySQL:", error);
                return res.status(500).json({ status: 500, mensaje: "Error interno al actualizar el usuario." });
            }

            if (resultados.affectedRows === 0) {
                return res.status(404).json({ status: 404, mensaje: "No se encontró ningún usuario con ese ID." });
            }

            res.json({
                status: 200,
                mensaje: "¡Usuario actualizado correctamente!",
                datosActualizados: { id: idUsuario, rol: rol, id_unidad: unidadId, activo: estadoActivo }
            });
        });
    });

    return router;
};