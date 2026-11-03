const express = require('express');
const router = express.Router();

module.exports = (db) => {
    
    // Endpoint GET /api/units
    router.get('/', (req, res) => {
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