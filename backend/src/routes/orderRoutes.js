const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth'); // ¡Protegido! Solo usuarios logueados

// POST /api/orders -> Crear orden
router.post('/', auth, orderController.createOrder);

// GET /api/orders/myorders -> Ver mis compras
router.get('/myorders', auth, orderController.getMyOrders);

module.exports = router;