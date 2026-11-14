const express = require('express');
const router = express.Router();
const verificarToken = require('../verificarToken');
module.exports = (db) => {
    
    // Endpoint GET 
    router.get('/', verificarToken, (req, res) => {
        const query = 'SELECT * FROM unidades_academicas'; 
        
        db.query(query, (error, resultados) => {
            if (error) {
                console.error("Error consultando unidades:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor" });
            }
            // Devolvemos el array con las facultades
            res.json({ status: 200, total: resultados.length, data: resultados });
        });
    });

    return router;
};