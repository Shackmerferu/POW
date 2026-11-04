const express = require('express');
const router = express.Router();

module.exports = (db) => {
    
    // POST /api/auth
    router.post('/', (req, res) => {
        const { legajo, contrasena } = req.body || {};

        if (!legajo || !contrasena) {
            return res.status(400).json({ status: 400, mensaje: "Completá el legajo y la contraseña." });
        }

        // 1. Sanitizar legajo: Asegurar string de 4 dígitos (rellena ceros a la izquierda si ingresan ej: "15" -> "0015")
        const legajoLimpio = String(legajo).trim().padStart(4, '0');

        // 2. Consulta SQL
        const query = 'SELECT * FROM usuarios WHERE legajo = ? AND contrasena = ?';
        db.query(query, [legajoLimpio, contrasena], (error, resultados) => {
            if (error) {
                console.error("Error BD:", error);
                return res.status(500).json({ status: 500, mensaje: "Error interno del servidor." });
            }

            if (resultados.length > 0) {
                const usuario = resultados[0];
                
                // Verificar si la cuenta está activa
                if (!usuario.activo) {
                    return res.status(403).json({ status: 403, mensaje: "El usuario se encuentra inactivo." });
                }

                // Respuesta exitosa
                res.json({
                    status: 200,
                    mensaje: "Login correcto",
                    token: "token-secreto-unlpam-12345", 
                    usuario: { 
                        id: usuario.id,
                        legajo: usuario.legajo,
                        nombre: usuario.nombre_completo, 
                        rol: usuario.rol,
                        id_unidad: usuario.id_unidad
                    }
                });
            } else {
                res.status(401).json({ status: 401, mensaje: "Credenciales incorrectas." });
            }
        });
    });

    return router;
};