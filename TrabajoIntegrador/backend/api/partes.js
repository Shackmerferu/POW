const express = require('express');
const router = express.Router();
const verificarToken = require('../verificarToken'); // <-- El patovica de seguridad

module.exports = (db) => {

  
    // 1. LISTAR TODAS LAS INSTITUCIONES (GET /api/partes)
   
   
    router.get('/', verificarToken, (req, res) => {
        const query = 'SELECT id, nombre, cuit, representante, tipo_institucion FROM partes_firmantes';
        
        db.query(query, (error, resultados) => {
            if (error) {
                console.error("Error consultando partes:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor." });
            }
            res.json({ status: 200, total: resultados.length, data: resultados });
        });
    });

   
    // 2. CREAR UNA NUEVA INSTITUCIÓN 
   
    router.post('/', verificarToken, (req, res) => {
        // Ajustá estos nombres según las columnas de tu tabla "partes"
        const { nombre, cuit, representante, tipo_institucion } = req.body;

        if (!nombre || !representante) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "El nombre de la institución y el representante son obligatorios." 
            });
        }

        const query = `INSERT INTO partes_firmantes (nombre, cuit, representante, tipo_institucion) VALUES (?, ?, ?, ?)`;
        
        db.query(query, [nombre, cuit || null, representante, tipo_institucion || 'Otra'], (error, resultados) => {
            if (error) {
                console.error("Error guardando parte:", error);
                return res.status(500).json({ status: 500, mensaje: "Error al guardar en la base de datos." });
            }
            res.status(201).json({ 
                status: 201, 
                mensaje: "Institución registrada con éxito.",
                nuevoId: resultados.insertId 
            });
        });
    });

    
    // 3. ASOCIAR UNA PARTE A UN CONVENIO ESPECÍFICO (POST /api/parties/asociar)
    

    router.post('/asociar', verificarToken, (req, res) => {
        const { id_convenio, id_parte, rol_parte } = req.body;

        if (!id_convenio || !id_parte) {
             return res.status(400).json({ 
                 status: 400, 
                 mensaje: "Faltan el ID del convenio o el ID de la parte." 
             });
        }

        // Tabla intermedia que une el convenio con la institución
        const query = 'INSERT INTO convenio_partes (id_convenio, id_parte) VALUES (?, ?)';
        
        db.query(query, [id_convenio, id_parte], (error) => {
            if (error) {
                console.error("Error asociando parte al convenio:", error);
                return res.status(500).json({ status: 500, mensaje: "Error asociando la parte." });
            }
            res.status(201).json({ status: 201, mensaje: "Parte asociada al convenio con éxito." });
        });
    });

    // =========================================================================
    // 4. VER LAS PARTES DE UN CONVENIO (GET /api/parties/convenio/:id)
    // Trae quiénes firmaron el convenio X
    // =========================================================================
    router.get('/convenio/:id', verificarToken, (req, res) => {
        const idConvenio = req.params.id;
        
        // Hacemos un JOIN para traer el nombre de la institución cruzando las tablas
        const query = `
            SELECT p.id, p.nombre, p.cuit, p.representante 
            FROM partes_firmantes p
            INNER JOIN convenio_partes cp ON p.id = cp.id_parte
            WHERE cp.id_convenio = ?
        `;
        
        db.query(query, [idConvenio], (error, resultados) => {
            if (error) {
                console.error("Error consultando partes del convenio:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor." });
            }
            res.json({ status: 200, total: resultados.length, data: resultados });
        });
    });

    return router;
};