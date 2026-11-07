const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();


app.use(cors());
app.use(express.json());

// Usamos un pool en lugar de una conexión única: si MySQL cierra una conexión
// inactiva, el pool la descarta y abre otra en la próxima consulta. Con
// createConnection, ese cierre emitía un error no manejado y tumbaba Node.
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_convenios',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probamos una conexión al arrancar para detectar credenciales o base inválidas.
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a gestion_convenios');
    connection.release();
});


const authRoutes = require('./api/auth')(db);
const usuariosRoutes = require('./api/usuarios')(db);


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});