const express = require('express');
const router = express.Router();
const verificarToken = require('../verificarToken'); // El patovica

module.exports = (db) => {

    // 1. VER PERSONAS/PASANTES DE UN CONVENIO 
   
    router.get('/convenio/:id', verificarToken, (req, res) => {
        const idConvenio = req.params.id;
        
        const query = 'SELECT id, id_convenio, nombre_completo, rol, carrera, carga_horaria FROM personas_pasantias WHERE id_convenio = ?';
        
        db.query(query, [idConvenio], (error, resultados) => {
            if (error) {
                console.error("Error consultando personas:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor." });
            }
            res.json({ status: 200, total: resultados.length, data: resultados });
        });
    });

    
    // 2. VINCULAR UNA PERSONA/PASANTE A UN CONVENIO 
    
    router.post('/', verificarToken, (req, res) => {
        const { id_convenio, nombre_completo, rol, carrera, carga_horaria } = req.body;

        // Validación estricta de los datos mínimos
        if (!id_convenio || !nombre_completo || !rol) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "El convenio, el nombre de la persona y su rol son obligatorios." 
            });
        }

        const query = `
            INSERT INTO personas_pasantias (id_convenio, nombre_completo, rol, carrera, carga_horaria) 
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(query, [id_convenio, nombre_completo, rol, carrera || null, carga_horaria || null], (error, resultados) => {
            if (error) {
                console.error("Error guardando persona:", error);
                return res.status(500).json({ status: 500, mensaje: "Error al guardar en la base de datos." });
            }
            res.status(201).json({ 
                status: 201, 
                mensaje: "Persona vinculada al convenio con éxito.",
                nuevoId: resultados.insertId 
            });
        });
    });

    
    // 3. ELIMINAR O DAR DE BAJA UNA PERSONA 
   
    router.delete('/:id', verificarToken, (req, res) => {
        const idPersona = req.params.id;
        
        const query = 'DELETE FROM personas_pasantias WHERE id = ?';
        
        db.query(query, [idPersona], (error, resultados) => {
            if (error) {
                console.error("Error eliminando persona:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor." });
            }
            if (resultados.affectedRows === 0) {
                return res.status(404).json({ status: 404, mensaje: "Persona no encontrada." });
            }
            res.json({ status: 200, mensaje: "Persona desvinculada del convenio." });
        });
    });

    return router;
};