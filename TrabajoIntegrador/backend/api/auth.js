const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Importamos la librería de JWT

module.exports = (db) => {
    router.post('/', (req, res) => {
        const { legajo, contrasena } = req.body;

        if (!legajo || !contrasena) {
            return res.status(400).json({ status: 400, mensaje: "Faltan datos." });
        }

        const query = 'SELECT id, legajo, nombre_completo, rol, id_unidad FROM usuarios WHERE legajo = ? AND contrasena = ? AND activo = 1';
        
        db.query(query, [legajo, contrasena], (error, resultados) => {
            if (error) {
                console.error("Error en login:", error);
                return res.status(500).json({ status: 500, mensaje: "Error interno del servidor." });
            }

            if (resultados.length === 0) {
                return res.status(401).json({ status: 401, mensaje: "Legajo o contraseña incorrectos." });
            }

            const usuario = resultados[0];

            // 1. FABRICAMOS EL TOKEN (La "pulsera VIP")
            // Guardamos el id, rol y unidad adentro del token para usarlos después
            const token = jwt.sign(
                { 
                    id: usuario.id, 
                    rol: usuario.rol, 
                    id_unidad: usuario.id_unidad 
                },
                'EL_VIP', 
                { expiresIn: '2h' } // El token vence en 2 horas por seguridad
            );

            // 2. DEVOLVEMOS EL TOKEN AL FRONTEND
            res.json({
                status: 200,
                mensaje: "Login exitoso",
                usuario: usuario,
                token: token 
            });
        });
    });

    return router;
};