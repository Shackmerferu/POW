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

    //CAMBIAR ESTADO Y AGREGAR OBSERVACIÓN
   // =========================================================================
    // CAMBIAR ESTADO Y AGREGAR OBSERVACIÓN (PUT /api/agreements/:id/estado)
    // =========================================================================
    router.put('/:id/estado', verificarToken, (req, res) => {
        const idConvenio = req.params.id;
        const { estado_nuevo, observacion, fecha_actualizacion_cliente } = req.body;
        const idResponsable = req.usuario.id; 

        if (!estado_nuevo || !observacion) {
            return res.status(400).json({ status: 400, mensaje: "El nuevo estado y el fundamento son obligatorios." });
        }

        db.query('SELECT estado FROM convenios WHERE id = ?', [idConvenio], (err, resConv) => {
            if (err || resConv.length === 0) {
                return res.status(404).json({ status: 404, mensaje: "Convenio no encontrado." });
            }

            const estadoPrevio = resConv[0].estado;

            if (estado_nuevo === 'aprobado') {
                db.query('SELECT COUNT(*) as cantidad FROM convenio_partes WHERE id_convenio = ?', [idConvenio], (errCount, resCount) => {
                    if (resCount[0].cantidad < 2) {
                        return res.status(400).json({ status: 400, mensaje: "Bloqueado: Debe tener al menos 2 partes." });
                    }
                    ejecutarActualizacion(); 
                });
            } else {
                ejecutarActualizacion(); 
            }

            function ejecutarActualizacion() {
                // Si el front manda la fecha, exigimos que coincida (Concurrencia Optimista). Si no, actualizamos igual.
                let updateQuery = 'UPDATE convenios SET estado = ? WHERE id = ?';
                let valoresUpd = [estado_nuevo, idConvenio];

                if (fecha_actualizacion_cliente) {
                    updateQuery = 'UPDATE convenios SET estado = ? WHERE id = ? AND fecha_actualizacion = ?';
                    valoresUpd.push(fecha_actualizacion_cliente);
                }
                
                db.query(updateQuery, valoresUpd, (errUpd, resultados) => {
                    if (errUpd) return res.status(500).json({ status: 500, mensaje: "Error actualizando estado." });

                    if (resultados.affectedRows === 0 && fecha_actualizacion_cliente) {
                        return res.status(409).json({ status: 409, mensaje: "Conflicto: Otro usuario modificó este convenio." });
                    }

                    const auditQuery = `
                        INSERT INTO auditoria_observaciones (id_convenio, id_usuario, observacion, estado_previo, estado_nuevo) 
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    db.query(auditQuery, [idConvenio, idResponsable, observacion, estadoPrevio, estado_nuevo], (errAud) => {
                        res.json({ status: 200, mensaje: "¡Estado actualizado y auditoría guardada!" });
                    });
                });
            }
        });
    });

    return router; // Devolvemos el router configurado
};