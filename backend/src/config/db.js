const { Pool } = require('pg');
// Corregimos la ruta para que lea directamente de la carpeta actual
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Forzamos un "ping" a la base de datos para asegurar el perímetro al arrancar
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error fatal al conectar con Navicat/PostgreSQL:', err.message);
    } else {
        console.log('🔗 Conexión táctica establecida con PostgreSQL.');
    }
});

module.exports = pool;