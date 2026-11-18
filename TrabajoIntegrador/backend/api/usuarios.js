// 1. IMPORTACIONES
// Importamos Express para manejar las rutas y el Router para empaquetar los endpoints.
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // <-- IMPORTAMOS LA LIBRERÍA DE SEGURIDAD
const verificarToken = require('../verificarToken');
// 2. EXPORTACIÓN RECIBIENDO LA CONEXIÓN DB DE MYSQL
module.exports = (db) => {

    // Roles que pueden cambiar roles (coinciden con los del JWT y del ENUM).
    const ROLES_CON_PERMISO = ['administracion', 'gestion'];
    const ROLES_VALIDOS = ['administracion', 'gestion', 'revision', 'consulta'];

    // Autorización: verificarToken ya puso req.usuario con el rol del token.
    function soloGestionOAdministracion(req, res, next) {
        const rolActor = String(req.usuario?.rol || '').trim().toLowerCase();

        if (!ROLES_CON_PERMISO.includes(rolActor)) {
            return res.status(403).json({
                status: 403,
                mensaje: "No tenés permiso para cambiar roles."
            });
        }
        next();
    }

    // Normaliza y valida el rol pedido. Lo deja en req.rolNormalizado.
    function rolValido(req, res, next) {
        const rolNuevo = String(req.body?.rol || '').trim().toLowerCase();

        if (!ROLES_VALIDOS.includes(rolNuevo)) {
            return res.status(400).json({
                status: 400,
                mensaje: "Rol inválido."
            });
        }

        // Regla extra: Gestión no puede otorgar el rol de Administración.
        const rolActor = String(req.usuario?.rol || '').trim().toLowerCase();
        if (rolActor === 'gestion' && rolNuevo === 'administracion') {
            return res.status(403).json({
                status: 403,
                mensaje: "Gestión no puede otorgar el rol Administración."
            });
        }

        req.rolNormalizado = rolNuevo;
        next();
    }


    
    // ENDPOINT 1: OBTENER TODOS LOS USUARIOS 
    
   router.get('/', verificarToken, (req, res) => {
        const query = 'SELECT id, dni, legajo, nombre_completo, rol, id_unidad, activo FROM usuarios';

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

    
    // ENDPOINT 2: REGISTRAR UN NUEVO USUARIO 
    
    router.post('/', verificarToken, (req, res) => {
        const { dni, legajo, contrasena, nombre_completo, id_unidad } = req.body || {};

        // Validar que los campos obligatorios existan
        if (!dni || !legajo || !contrasena || !nombre_completo) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "Faltan datos obligatorios (DNI, legajo, contraseña y nombre completo)." 
            });
        }

        // Sanitización
        const dniLimpio = String(dni).trim();
        const legajoLimpio = String(legajo).trim();

        // VALIDACIÓN DE DNI
        const regexDni = /^\d{7,8}$/;
        if (!regexDni.test(dniLimpio)) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "El DNI debe contener 7 u 8 dígitos numéricos." 
            });
        }

        // VALIDACIÓN DE LEGAJO
        const regexLegajo = /^\d{4}$/;
        if (!regexLegajo.test(legajoLimpio)) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "El legajo debe contener exactamente 4 dígitos numéricos (ej: 0012, 1045)." 
            });
        }

        // PASO A: Comprobar que el DNI y el legajo no estén registrados en la BD
        const checkQuery = 'SELECT id, dni, legajo FROM usuarios WHERE dni = ? OR legajo = ?';
        
        // Le agregamos 'async' a este callback para poder usar await con bcrypt
        db.query(checkQuery, [dniLimpio, legajoLimpio], async (checkErr, results) => {
            if (checkErr) {
                console.error("Error validando DNI/legajo duplicado:", checkErr);
                return res.status(500).json({ status: 500, mensaje: "Error interno en el servidor." });
            }

            const dniDuplicado = results.some((usuario) => String(usuario.dni) === dniLimpio);
            if (dniDuplicado) {
                return res.status(400).json({ status: 400, mensaje: "El DNI ingresado ya se encuentra registrado." });
            }

            const legajoDuplicado = results.some((usuario) => String(usuario.legajo) === legajoLimpio);
            if (legajoDuplicado) {
                return res.status(400).json({ status: 400, mensaje: "El legajo ingresado ya se encuentra registrado." });
            }

            try {
                // PASO INTERMEDIO: ENCRIPTAR LA CONTRASEÑA
                
                const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

                // PASO B: Insertar el usuario con la contraseña ya encriptada
                const insertQuery = `
                    INSERT INTO usuarios (dni, legajo, contrasena, nombre_completo, rol, id_unidad, activo) 
                    VALUES (?, ?, ?, ?, ?, ?, 1)
                `;

                const rolDefault = 'consulta';
                const unidadId = id_unidad ? parseInt(id_unidad) : null;

               // Mandamos 'contrasenaHasheada' en vez de 'contrasena'
                db.query(insertQuery, [dniLimpio, legajoLimpio, contrasenaHasheada, nombre_completo.trim(), rolDefault, unidadId], (error, resultados) => {
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
                            dni: dniLimpio,
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

    
    router.put('/:id', verificarToken, soloGestionOAdministracion, rolValido, (req, res) => {
        const idUsuario = req.params.id; 
        const { id_unidad, activo } = req.body; 
        const rol = req.rolNormalizado; 

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

    // ENDPOINT NUEVO: cambia SOLO el rol (no toca id_unidad ni activo).
    router.put('/:id/rol', verificarToken, soloGestionOAdministracion, rolValido, (req, res) => {
        const idUsuario = req.params.id;
        const rolNuevo = req.rolNormalizado;

        db.query(
            'UPDATE usuarios SET rol = ? WHERE id = ?',
            [rolNuevo, idUsuario],
            (error, resultados) => {
                if (error) {
                    console.error("Error actualizando rol en MySQL:", error);
                    return res.status(500).json({
                        status: 500,
                        mensaje: "Error interno al actualizar el rol."
                    });
                }

                if (resultados.affectedRows === 0) {
                    return res.status(404).json({
                        status: 404,
                        mensaje: "No se encontró ningún usuario con ese ID."
                    });
                }

                res.json({
                    status: 200,
                    mensaje: "Rol actualizado correctamente.",
                    datosActualizados: { id: idUsuario, rol: rolNuevo }
                });
            }
        );
    });

    return router;
};