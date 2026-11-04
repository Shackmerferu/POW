const express = require('express');
const router = express.Router();

// Recibimos la conexión a la base de datos (se la pasamos desde index.js)
module.exports = (db) => {
    
    // Endpoint GET /api/auth/verify
    // Sirve para que el frontend valide si el token guardado sigue siendo válido
    router.get('/verify', (req, res) => {
        const token = (req.headers.authorization || '').replace('Bearer ', '');

        if (token && token === 'token-secreto-unlpam-12345') {
            return res.json({ status: 200, mensaje: "Sesión válida" });
        }

        res.status(401).json({ status: 401, mensaje: "Sesión inválida o expirada" });
    });

    // Endpoint POST /api/auth
    router.post('/', (req, res) => {
        const { legajo, contrasena } = req.body;

        if (!legajo || !contrasena) {
            return res.status(400).json({ status: 400, mensaje: "Completá el legajo y la contraseña" });
        }

        const query = 'SELECT * FROM usuarios WHERE legajo = ? AND contrasena = ?';
        db.query(query, [legajo, contrasena], (error, resultados) => {
            if (error) {
                console.error("Error BD:", error);
                return res.status(500).json({ status: 500, mensaje: "Error servidor" });
            }

            if (resultados.length > 0) {
                const usuario = resultados[0];
                res.json({
                    status: 200,
                    mensaje: "Login correcto",
                    token: "token-secreto-unlpam-12345", 
                    usuario: { nombre: usuario.nombre_completo, rol: usuario.rol }
                });
            } else {
                res.status(401).json({ status: 401, mensaje: "Credenciales incorrectas" });
            }
        });
    });

    return router;
};