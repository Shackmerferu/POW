const express = require('express');
const router = express.Router();
const verificarToken = require('../verificarToken');

module.exports = (db) => {

   
    // MÉTRICAS PARA EL TABLERO
    // Devuelve cuántos convenios hay en cada estado 
   
    router.get('/', verificarToken, (req, res) => {
        const query = 'SELECT estado, COUNT(*) as cantidad FROM convenios GROUP BY estado';
        
        db.query(query, (error, resultados) => {
            if (error) {
                console.error("Error consultando dashboard:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor." });
            }
            res.json({ status: 200, data: resultados });
        });
    });

   
    // ALERTAS DE VENCIMIENTO 
    // Trae convenios que vencen en los próximos 30 días o ya vencieron

    router.get('/alerts', verificarToken, (req, res) => {
        const query = `
            SELECT id, codigo_unico, titulo, estado, fecha_vencimiento 
            FROM convenios 
            WHERE fecha_vencimiento IS NOT NULL 
            AND fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
            AND estado NOT IN ('archivado', 'rescindido')
            ORDER BY fecha_vencimiento ASC
        `;
        
        db.query(query, (error, resultados) => {
            if (error) {
                console.error("Error consultando alertas:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor." });
            }
            res.json({ status: 200, total: resultados.length, data: resultados });
        });
    });

    return router;
};