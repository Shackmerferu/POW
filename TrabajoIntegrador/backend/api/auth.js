const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Importamos la librería de JWT
const bcrypt = require('bcrypt'); // <-- Importamos la librería de seguridad

module.exports = (db) => {
    router.post('/', (req, res) => {
        const { legajo, contrasena } = req.body;

        if (!legajo || !contrasena) {
            return res.status(400).json({ status: 400, mensaje: "Faltan datos." });
        }

        // CAMBIO CLAVE: Sacamos el "AND contrasena = ?" y pedimos que nos traiga la contrasena encriptada
        const query = 'SELECT id, legajo, contrasena, nombre_completo, rol, id_unidad FROM usuarios WHERE legajo = ? AND activo = 1';
        
        // Agregamos "async" acá para poder esperar a bcrypt
        db.query(query, [legajo], async (error, resultados) => {
            if (error) {
                console.error("Error en login:", error);
                return res.status(500).json({ status: 500, mensaje: "Error interno del servidor." });
            }

            // Si no encuentra el legajo
            if (resultados.length === 0) {
                return res.status(401).json({ status: 401, mensaje: "Legajo o contraseña incorrectos." });
            }

            const usuario = resultados[0];

            try {
                // COMPARACIÓN BCRYPT: Chequea la contraseña plana vs el hash de MySQL
                const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

                if (!contrasenaValida) {
                    return res.status(401).json({ status: 401, mensaje: "Legajo o contraseña incorrectos." });
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