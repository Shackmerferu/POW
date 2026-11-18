const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { PUERTO, DB_HOST, DB_USUARIO, DB_CONTRASENA, DB_NOMBRE } = require('./config');

const app = express();


app.use(cors());
app.use(express.json());

// Usamos un pool en lugar de una conexión única: si MySQL cierra una conexión
// inactiva, el pool la descarta y abre otra en la próxima consulta. Con
// createConnection, ese cierre emitía un error no manejado y tumbaba Node.
// Las credenciales vienen del entorno (.env); sin .env se usan las de desarrollo.
const db = mysql.createPool({
    host: DB_HOST,
    user: DB_USUARIO,
    password: DB_CONTRASENA,
    database: DB_NOMBRE,
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
const unidadesRoutes = require('./api/unidades')(db);
const conveniosRoutes = require('./api/convenios')(db);
const partesRoutes = require('./api/partes')(db);
const personasRoutes = require('./api/personas')(db);
const documentosRoutes = require('./api/documentos')(db);
const dashboardRoutes = require('./api/dashboard')(db);

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/units', unidadesRoutes);
app.use('/api/agreements', conveniosRoutes);
app.use('/api/parties', partesRoutes);
app.use('/api/people', personasRoutes);
app.use('/api/documents', documentosRoutes);
app.use('/api/dashboard', dashboardRoutes);


const PORT = 8000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});