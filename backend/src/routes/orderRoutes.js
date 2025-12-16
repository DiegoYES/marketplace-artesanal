const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

/*
 * ------------------------------------------------------------------
 * RUTAS DE ÓRDENES (PROTEGIDAS)
 * ------------------------------------------------------------------
 * Endpoints para la gestión de transacciones y compras.
 * IMPORTANTE: Todas las rutas implementan el middleware 'auth',
 * requiriendo un JWT válido para acceder.
 */

/*
 * POST /api/orders
 * Procesa el carrito de compras y genera una nueva orden en la base de datos.
 */
router.post('/', auth, orderController.createOrder);

/*
 * GET /api/orders/myorders
 * Recupera el historial de compras asociado al usuario autenticado.
 */
router.get('/myorders', auth, orderController.getMyOrders);

module.exports = router;