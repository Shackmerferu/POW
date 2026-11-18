const express = require('express');
const router = express.Router();
const verificarToken = require('../verificarToken'); // El patovica

module.exports = (db) => {

    // 0. LISTADO GLOBAL DE PERSONAS Y PASANTÍAS
    // Une cada persona con su convenio (código y título) para alimentar la
    // tabla "Personas y pasantías" del panel y la métrica de personas únicas.
    // Respeta el alcance: si el usuario tiene unidad asignada (id_unidad),
    // solo ve personas de convenios de ESA unidad; si no, ve todo.

    router.get('/', verificarToken, (req, res) => {
        let query = `
            SELECT p.id, p.id_convenio, p.nombre_completo, p.rol, p.carrera,
                   p.carga_horaria, p.periodo, p.tutoria, p.asignacion, p.seguro,
                   c.codigo_unico, c.titulo AS convenio_titulo,
                   c.id_unidad_responsable
            FROM personas_pasantias p
            INNER JOIN convenios c ON c.id = p.id_convenio
        `;
        const valores = [];
        const filtros = [];

        if (req.usuario.rol === "consulta") {
            filtros.push("c.estado IN ('aprobado', 'firmado')");
        }
        if (req.usuario.id_unidad !== null && req.usuario.id_unidad !== undefined) {
            filtros.push("c.id_unidad_responsable = ?");
            valores.push(req.usuario.id_unidad);
        }
        if (filtros.length > 0) query += ` WHERE ${filtros.join(" AND ")}`;

        query += " ORDER BY p.nombre_completo ASC, c.codigo_unico ASC";

        db.query(query, valores, (error, resultados) => {
            if (error) {
                console.error("Error consultando personas:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor." });
            }
            res.json({ status: 200, total: resultados.length, data: resultados });
        });
    });

    // 1. VER PERSONAS/PASANTES DE UN CONVENIO 
   
    router.get('/convenio/:id', verificarToken, (req, res) => {
        const idConvenio = req.params.id;
        
        let query = `SELECT p.id, p.id_convenio, p.nombre_completo, p.rol, p.carrera,
            p.carga_horaria, p.periodo, p.tutoria, p.asignacion, p.seguro
            FROM personas_pasantias p INNER JOIN convenios c ON c.id = p.id_convenio
            WHERE p.id_convenio = ?`;
        const valores = [idConvenio];
        if (req.usuario.rol === "consulta") query += " AND c.estado IN ('aprobado', 'firmado')";
        if (req.usuario.id_unidad != null) {
            query += " AND c.id_unidad_responsable = ?";
            valores.push(req.usuario.id_unidad);
        }

        db.query(query, valores, (error, resultados) => {
            if (error) {
                console.error("Error consultando personas:", error);
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor." });
            }
            res.json({ status: 200, total: resultados.length, data: resultados });
        });
    });

    
    // 2. VINCULAR UNA PERSONA/PASANTE A UN CONVENIO 
    
    router.post('/', verificarToken, (req, res) => {
        if (req.usuario?.rol === 'consulta') return res.status(403).json({ status: 403, mensaje: 'El rol consulta solo tiene permiso de lectura.' });
        const { id_convenio, nombre_completo, rol, carrera, carga_horaria,
                periodo, tutoria, asignacion, seguro } = req.body;

        // Validación estricta de los datos mínimos
        if (!id_convenio || !nombre_completo || !rol) {
            return res.status(400).json({ 
                status: 400, 
                mensaje: "El convenio, el nombre de la persona y su rol son obligatorios." 
            });
        }

        const query = `
            INSERT INTO personas_pasantias (id_convenio, nombre_completo, rol, carrera, carga_horaria, periodo, tutoria, asignacion, seguro) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [
            id_convenio,
            nombre_completo,
            rol,
            carrera || null,
            carga_horaria ? Number(carga_horaria) : null,
            periodo || null,
            tutoria || null,
            asignacion || null,
            seguro || null,
        ], (error, resultados) => {
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
        if (req.usuario?.rol === 'consulta') return res.status(403).json({ status: 403, mensaje: 'El rol consulta solo tiene permiso de lectura.' });
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