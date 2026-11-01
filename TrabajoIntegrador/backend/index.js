const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Configuraciones para que entienda JSON y permita conexiones externas
app.use(cors());
app.use(express.json());

// 1. Conexión a tu base de datos (XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Usuario por defecto de XAMPP
    password: '', // Clave por defecto (vacía)
    database: 'gestion_convenios' // Tu base de datos
});

// Comprobamos si logra conectarse
db.connect(err => {
    if (err) {
        console.error('Error fatal conectando a MySQL:', err);
        return;
    }
    console.log('¡Conexión exitosa a la base de datos gestion_convenios!');
});

// 2. Primer Endpoint: Prueba de Autenticación
// Endpoint REAL para Iniciar Sesión (Login)
app.post('/api/auth', (req, res) => {
    // 1. Atrapamos los datos que nos va a mandar el frontend (React o App Móvil)
    const { legajo, contrasena } = req.body;

    // 2. Si faltan datos, frenamos acá
    if (!legajo || !contrasena) {
        return res.status(400).json({ status: 400, mensaje: "Completá el legajo y la contraseña" });
    }

    // 3. Buscamos en la base de datos exactamente ese usuario
    // Usamos los "?" por seguridad, para evitar que nos hackeen con Inyección SQL
    const query = 'SELECT * FROM usuarios WHERE legajo = ? AND contrasena = ?';
    
    db.query(query, [legajo, contrasena], (error, resultados) => {
        if (error) {
            console.error("Error en la base de datos:", error);
            return res.status(500).json({ status: 500, mensaje: "Error en el servidor" });
        }

        // 4. Si el array de resultados tiene al menos 1 fila, el usuario existe
        if (resultados.length > 0) {
            const usuarioEncontrado = resultados[0];
            
            // Devolvemos el ÉXITO y un Token (que después haremos real para React)
            res.json({
                status: 200,
                mensaje: "Login correcto",
                token: "token-secreto-unlpam-12345", 
                usuario: {
                    nombre: usuarioEncontrado.nombre_completo,
                    rol: usuarioEncontrado.rol
                }
            });
        } else {
            // Si el array está vacío, le erró a la clave o al legajo
            res.status(401).json({ status: 401, mensaje: "Legajo o contraseña incorrectos" });
        }
    });
});

// 3. Encender el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});