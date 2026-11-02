const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a la Base de Datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_convenios'
});

db.connect(err => {
    if (err) throw err;
    console.log('¡Conexión exitosa a gestion_convenios!');
});

// 2. IMPORTAMOS NUESTRAS RUTAS SEPARADAS
// IMPORTAMOS LAS RUTAS (Agregá la línea de usuarios)
const authRoutes = require('./api/auth')(db);
const unidadesRoutes = require('./api/unidades')(db); 
const usuariosRoutes = require('./api/usuarios')(db); // Línea nueva

// LE DECIMOS A NODE DÓNDE USARLAS (Agregá la ruta de users)
app.use('/api/auth', authRoutes);
app.use('/api/units', unidadesRoutes); 
app.use('/api/users', usuariosRoutes); 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});