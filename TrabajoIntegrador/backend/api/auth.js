const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Importamos la librería de JWT
const bcrypt = require('bcrypt'); // <-- Importamos la librería de seguridad

module.exports = (db) => {
    // Verifica que el token enviado por el frontend siga siendo válido.
    router.get('/verify', (req, res) => {
        const autorizacion = req.headers.authorization || '';
        const token = autorizacion.startsWith('Bearer ')
            ? autorizacion.slice(7)
            : null;

        if (!token) {
            return res.status(401).json({ status: 401, mensaje: "Token no proporcionado." });
        }

        try {
            const datos = jwt.verify(token, 'EL_VIP');
            return res.json({ status: 200, usuario: datos });
        } catch (error) {
            return res.status(401).json({ status: 401, mensaje: "Token inválido o vencido." });
        }
    });

    router.post('/', (req, res) => {
        const { dni, contrasena } = req.body;

        if (!dni || !contrasena) {
            return res.status(400).json({ status: 400, mensaje: "Faltan datos." });
        }

        const dniLimpio = String(dni).trim();

        if (!/^\d{7,8}$/.test(dniLimpio)) {
            return res.status(400).json({ status: 400, mensaje: "El DNI debe contener 7 u 8 dígitos numéricos." });
        }

        // Buscamos al usuario por DNI y traemos la contraseña encriptada para compararla con bcrypt
        const query = 'SELECT id, dni, legajo, contrasena, nombre_completo, rol, id_unidad FROM usuarios WHERE dni = ? AND activo = 1';
        
        // Agregamos "async" acá para poder esperar a bcrypt
        db.query(query, [dniLimpio], async (error, resultados) => {
            if (error) {
                console.error("Error en login:", error);
                return res.status(500).json({ status: 500, mensaje: "Error interno del servidor." });
            }

            // Si no encuentra el DNI
            if (resultados.length === 0) {
                return res.status(401).json({ status: 401, mensaje: "DNI o contraseña incorrectos." });
            }

            const usuario = resultados[0];

            try {
                // COMPARACIÓN BCRYPT: Chequea la contraseña plana vs el hash de MySQL
                const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

                if (!contrasenaValida) {
                    return res.status(401).json({ status: 401, mensaje: "DNI o contraseña incorrectos." });
                }

                // 1. FABRICAMOS EL TOKEN (La "pulsera VIP")
            const token = jwt.sign(
                { 
                    id: usuario.id, 
                    rol: usuario.rol, 
                    id_unidad: usuario.id_unidad 
                },
                'EL_VIP', 
                    { expiresIn: '2h' } // El token vence en 2 horas por seguridad
            );

                // Por seguridad, eliminamos la contraseña encriptada del objeto antes de mandarlo al front
                delete usuario.contrasena;
          
                // 2. DEVOLVEMOS EL TOKEN AL FRONTEND
            res.json({
                status: 200,
                mensaje: "Login exitoso",
                usuario: usuario,
                token: token 
            });

            } catch (compareError) {
                console.error("Error al comparar contraseñas:", compareError);
                return res.status(500).json({ status: 500, mensaje: "Error de seguridad en el login." });
            }
        });
    });

    return router;
};