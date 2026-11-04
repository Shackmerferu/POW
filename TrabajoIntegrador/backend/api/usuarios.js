// 1. IMPORTACIONES
// Traemos Express, que es el motor principal de nuestro servidor web.
const express = require('express'); 

// Creamos un "Router". Imaginate que es un mini-semáforo exclusivo para los usuarios.
// Nos permite manejar las rutas sin tener que meter todo en el index.js principal.
const router = express.Router();

// 2. EXPORTACIÓN
// module.exports permite que este archivo "exponga" su código para que el index.js lo pueda usar.
// La función recibe (db), que es la conexión a la base de datos MySQL que le pasamos desde index.js.
module.exports = (db) => {
    
    // 3. DEFINICIÓN DEL ENDPOINT (MÉTODO GET)
    // router.get significa que esta ruta solo sirve para LEER datos (como entrar a una URL en el navegador).
    // '/' representa la ruta base de este archivo (que en index.js definiremos como /api/users).
    // (req, res) son los dos actores principales de Node:
    // - req (Request / Petición): Tiene todo lo que manda el usuario/React (ej: variables por URL, tokens).
    // - res (Response / Respuesta): Tiene las herramientas para contestarle al usuario (ej: enviar un JSON).
    router.get('/', (req, res) => {
        
        // Guardamos en una constante de texto la consulta SQL exacta que queremos hacer.
        const query = 'SELECT * FROM usuarios'; 
        
        // 4. EJECUCIÓN EN LA BASE DE DATOS
        // db.query manda la consulta a MySQL. 
        // Cuando MySQL termina, nos devuelve dos cosas: un 'error' (si falló) o los 'resultados' (si funcionó).
        db.query(query, (error, resultados) => {
            
            // Si la variable 'error' tiene algo adentro, significa que la base de datos se quejó (ej: tabla no existe).
            if (error) {
                console.error("Error consultando usuarios:", error);
                // res.status(500) le avisa al navegador que el servidor interno falló, y cortamos la ejecución con 'return'.
                return res.status(500).json({ status: 500, mensaje: "Error en el servidor" });
            }
            
            // Si llegamos acá, salió todo bien en la base de datos. 
            // res.json() empaqueta nuestros resultados de MySQL en el formato universal JSON y se los manda a React.
            res.json({ 
                status: 200, 
                total: resultados.length, // Contamos cuántas filas trajo
                data: resultados // Mandamos el array con toda la info de los usuarios
            });
        });
    });
    // ENDPOINT PARA REGISTRAR UN USUARIO NUEVO (POST /api/users)
   router.post('/', (req, res) => {
        const { legajo, contrasena, nombre_completo, id_unidad } = req.body;

        if (!legajo || !contrasena || !nombre_completo) {
            return res.status(400).json({ status: 400, mensaje: "Faltan datos obligatorios del usuario" });
        }

        // Validación nueva: comprobamos que sea un número y que tenga exactamente 4 caracteres
        const legajoStr = legajo.toString();
        if (isNaN(legajo) || legajoStr.length !== 4) {
            return res.status(400).json({ status: 400, mensaje: "El legajo debe contener exactamente 4 números (ej: 1234)" });
        }

        const query = 'INSERT INTO usuarios (legajo, contrasena, nombre_completo, rol, id_unidad, activo) VALUES (?, ?, ?, ?, ?, ?)';
        
        db.query(query, [legajo, contrasena, nombre_completo, 'visitante', id_unidad || null, 1], (error, resultados) => {
            if (error) {
                console.error("Error creando usuario:", error);
                return res.status(500).json({ status: 500, mensaje: "Error interno al registrar usuario" });
            }
            
            res.json({ status: 201, mensaje: "¡Usuario registrado con éxito como VISITANTE!", nuevoId: resultados.insertId });
        });
    });

    // Al final, devolvemos el mini-semáforo configurado para que index.js lo reciba.
    return router;
};