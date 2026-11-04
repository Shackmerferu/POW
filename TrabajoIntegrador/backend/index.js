const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// Conexión a la base de datos MySQL en XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_convenios'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a gestion_convenios');
});

// Importar rutas pasando la conexión db
const authRoutes = require('./api/auth')(db);
const usuariosRoutes = require('./api/usuarios')(db);

// Prefijos base de las rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

// El servidor debe escuchar en el puerto 8000
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});