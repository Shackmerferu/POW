// 1. IMPORTACIONES BÁSICAS
const express = require('express');
const router = express.Router(); // Creamos el "mini-semáforo" para las rutas de convenios
const verificarToken = require('../verificarToken');

module.exports = (db) => {
    
    // 3. ENDPOINT PARA LISTAR TODOS LOS CONVENIOS 
    
    router.get('/', verificarToken, (req, res) => {
        
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
    // ENDPOINT PARA GUARDAR UN CONVENIO NUEVO 

    router.post('/', verificarToken, (req, res) => {
        
        // 1. Atrapamos los datos con los nombres EXACTOS de tu base de datos
        const { 
            codigo_unico, 
            titulo, 
            tipo, 
            objeto, 
            id_unidad_responsable, 
            // Estos son opcionales (permiten NULL)
            estado, marco_legal, confidencialidad, fecha_firma, fecha_inicio, fecha_vencimiento, dias_preaviso, id_antecedente 
        } = req.body;

        // 2. Control estricto: exigimos los que dicen "No" en Nulo en phpMyAdmin
        if (!codigo_unico || !titulo || !tipo || !objeto || !id_unidad_responsable) {
            return res.status(400).json({ status: 400, mensaje: "Faltan datos obligatorios (código, título, tipo, objeto o unidad)" });
        }

        // 3. Preparamos la consulta SQL
        const query = `
            INSERT INTO convenios (
                codigo_unico, titulo, tipo, estado, objeto, marco_legal, confidencialidad, 
                fecha_firma, fecha_inicio, fecha_vencimiento, dias_preaviso, id_unidad_responsable, id_antecedente
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Si no mandan estado, tu base usa 'borrador' por defecto. Si no mandan confidencialidad, va 0.
        const estadoFinal = estado || 'borrador';
        const confFinal = confidencialidad !== undefined ? confidencialidad : 0;

        // 4. Mapeamos los valores (reemplazando undefined por null para que MySQL no se queje)
        const valores = [
            codigo_unico, 
            titulo, 
            tipo, 
            estadoFinal, 
            objeto, 
            marco_legal || null, 
            confFinal,
            fecha_firma || null, 
            fecha_inicio || null, 
            fecha_vencimiento || null, 
            dias_preaviso || null, 
            id_unidad_responsable, 
            id_antecedente || null
        ];

        // 5. Ejecutamos la inserción
        db.query(query, valores, (error, resultados) => {
            if (error) {
                console.error("Error guardando convenio:", error);
                return res.status(500).json({ status: 500, mensaje: "Error interno al intentar guardar en la base de datos" });
            }
            
            res.json({ 
                status: 201, 
                mensaje: "¡Convenio creado con éxito!",
                nuevoId: resultados.insertId 
            });
        });
    });// ENDPOINT PARA GUARDAR UN CONVENIO NUEVO (POST /api/agreements)
    router.post('/', verificarToken, (req, res) => {
        
        // 1. Atrapamos los datos con los nombres EXACTOS de tu base de datos
        const { 
            codigo_unico, 
            titulo, 
            tipo, 
            objeto, 
            id_unidad_responsable, 
            // Estos son opcionales (permiten NULL)
            estado, marco_legal, confidencialidad, fecha_firma, fecha_inicio, fecha_vencimiento, dias_preaviso, id_antecedente 
        } = req.body;

        // 2. Control estricto: exigimos los que dicen "No" en Nulo en phpMyAdmin
        if (!codigo_unico || !titulo || !tipo || !objeto || !id_unidad_responsable) {
            return res.status(400).json({ status: 400, mensaje: "Faltan datos obligatorios (código, título, tipo, objeto o unidad)" });
        }

        // 3. Preparamos la consulta SQL
        const query = `
            INSERT INTO convenios (
                codigo_unico, titulo, tipo, estado, objeto, marco_legal, confidencialidad, 
                fecha_firma, fecha_inicio, fecha_vencimiento, dias_preaviso, id_unidad_responsable, id_antecedente
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Si no mandan estado, tu base usa 'borrador' por defecto. Si no mandan confidencialidad, va 0.
        const estadoFinal = estado || 'borrador';
        const confFinal = confidencialidad !== undefined ? confidencialidad : 0;

        // 4. Mapeamos los valores (reemplazando undefined por null para que MySQL no se queje)
        const valores = [
            codigo_unico, 
            titulo, 
            tipo, 
            estadoFinal, 
            objeto, 
            marco_legal || null, 
            confFinal,
            fecha_firma || null, 
            fecha_inicio || null, 
            fecha_vencimiento || null, 
            dias_preaviso || null, 
            id_unidad_responsable, 
            id_antecedente || null
        ];

        // 5. Ejecutamos la inserción
        db.query(query, valores, (error, resultados) => {
            if (error) {
                console.error("Error guardando convenio:", error);
                return res.status(500).json({ status: 500, mensaje: "Error interno al intentar guardar en la base de datos" });
            }
            
            res.json({ 
                status: 201, 
                mensaje: "¡Convenio creado con éxito!",
                nuevoId: resultados.insertId 
            });
        });
    });

    return router; // Devolvemos el router configurado
};