const express = require('express');
const router = express.Router();
const detalleVentasController = require('../controllers/detalleVentas.controller');

router.get('/', detalleVentasController.getDetallesVentas);
router.get('/venta/:ventaId', detalleVentasController.getDetallesByVentaId);
router.get('/:id', detalleVentasController.getDetalleVentaById);
router.post('/', detalleVentasController.createDetalleVenta);
router.put('/:id', detalleVentasController.updateDetalleVenta);
router.delete('/:id', detalleVentasController.deleteDetalleVenta);

module.exports = router;
