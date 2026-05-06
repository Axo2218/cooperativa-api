const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde React
app.use(express.json()); // Permite entender formato JSON

// Rutas base - Catálogos y Entidades Base
app.use('/api/cooperativas', require('./routes/cooperativa.routes'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/especies', require('./routes/especies.routes'));
app.use('/api/categoria-especie', require('./routes/categoriaEspecie.routes'));
app.use('/api/insumos', require('./routes/insumos.routes'));
app.use('/api/categoria-insumo', require('./routes/categoria.routes'));
app.use('/api/unidades-medida', require('./routes/unidadMedida.routes'));
app.use('/api/embarcaciones', require('./routes/embarcacion.routes'));
app.use('/api/personal', require('./routes/personal.routes'));
app.use('/api/roles', require('./routes/rol.routes'));
app.use('/api/instalaciones', require('./routes/instalacion.routes'));

// Rutas - Viajes y Operaciones Marítimas
app.use('/api/viajes', require('./routes/viaje.routes')); // Compatibilidad con dashboard
app.use('/api/viaje', require('./routes/viaje.routes'));
app.use('/api/viajePersonal', require('./routes/viajePersonal.routes'));
app.use('/api/viajes-personal', require('./routes/viajePersonal.routes')); // Alias para estandarización plural
app.use('/api/viajeDetalleCaptura', require('./routes/viajeDetalleCaptura.routes'));
app.use('/api/viajeGasto', require('./routes/viajeGasto.routes'));
app.use('/api/pesca-historico', require('./routes/pescaHistorico.routes'));
app.use('/api/zonas', require('./routes/zonaPesca.routes'));
app.use('/api/viaje-insumos', require('./routes/viajeInsumo.routes'));

// Rutas - Ventas y Finanzas
app.use('/api/ventas', require('./routes/venta.routes'));
app.use('/api/detalleVentas', require('./routes/detalleVentas.routes'));
app.use('/api/compras-insumos', require('./routes/comprasInsumos.routes'));
app.use('/api/detalle-compra-insumos', require('./routes/detalleCompraInsumos.routes'));
app.use('/api/cuotas', require('./routes/cuotas.routes'));
app.use('/api/facturacion', require('./routes/facturacion.routes'));
app.use('/api/pagos-nomina', require('./routes/pagosNomina.routes'));

// Rutas - Mantenimiento y Activos
app.use('/api/mantenimiento-embarcacion', require('./routes/mantenimientoEmbarcacion.routes'));
app.use('/api/activos-fijos', require('./routes/activosFijos.routes'));
app.use('/api/cat-tipo-activo', require('./routes/catTipoActivo.routes'));
app.use('/api/cat-tipo-instalacion', require('./routes/catTipoInstalacion.routes'));
app.use('/api/bitacora-mantenimiento', require('./routes/bitacoraMantenimiento.routes'));

// Rutas - Sistema
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/alertas-sistema', require('./routes/alertaSistema.routes'));
app.use('/api/catalogo', require('./routes/catalogo.routes'));

// Prueba de vida del servidor
app.get('/', (req, res) => {
    res.send('📡 API del ERP Pesquero operando al 100%');
});

// Arranque del motor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor central activo en el puerto ${PORT}`);
});