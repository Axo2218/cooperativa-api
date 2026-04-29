const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde React
app.use(express.json()); // Permite entender formato JSON

// Rutas base
app.use('/api', require('./routes/categoria.routes'));
app.use('/api', require('./routes/viaje.routes'));
app.use('/api', require('./routes/catalogo.routes'));

// Prueba de vida del servidor
app.get('/', (req, res) => {
    res.send('📡 API del ERP Pesquero operando al 100%');
});

// Arranque del motor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor central activo en el puerto ${PORT}`);
});