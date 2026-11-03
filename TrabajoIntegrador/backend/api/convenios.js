// 1. IMPORTACIONES BÁSICAS
const express = require('express');
const router = express.Router(); // Creamos el "mini-semáforo" para las rutas de convenios

// 2. EXPORTAMOS LA LÓGICA
module.exports = (db) => {
    
    // 3. ENDPOINT PARA LISTAR TODOS LOS CONVENIOS (GET /api/agreements)
    // Usamos GET porque el frontend de tu compañero solo necesita LEER la tabla.
    router.get('/', (req, res) => {
        
        // Escribimos la consulta SQL. 
        // Apuntamos a la tabla 'convenios' que tenés en tu base de datos[cite: 26].
        const query = 'SELECT * FROM convenios'; 
        
        // 4. EJECUTAMOS LA CONSULTA
        db.query(query, (error, resultados) => {
            
            // Si hay un error (por ejemplo, si escribimos mal el nombre de la tabla)
            if (error) {
                console.error("Error consultando convenios:", error);
                // Le mandamos al frontend un código 500 (Error interno del servidor)
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor al traer los convenios" });
            }
            
            // Si todo salió perfecto, armamos el paquete JSON de respuesta
            res.json({ 
                status: 200, // 200 significa "OK / Éxito"
                total: resultados.length, // Le decimos al frontend cuántos convenios hay en total
                data: resultados // Mandamos todas las filas de la tabla
            });
        });
    });

    return router; // Devolvemos el router configurado
};