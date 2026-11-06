const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();


app.use(cors());
app.use(express.json());

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


const authRoutes = require('./api/auth')(db);
const usuariosRoutes = require('./api/usuarios')(db);


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});