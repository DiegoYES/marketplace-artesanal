const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// GET /api/products -> Obtener todos (PÚBLICA)
router.get('/', productController.getProducts);

// POST /api/products -> Crear uno (PRIVADA)
router.post('/', auth, productController.createProduct);

// PUT /api/products/:id -> Editar (PRIVADA)
router.put('/:id', auth, productController.updateProduct);

// DELETE /api/products/:id -> Eliminar (PRIVADA) <-- NUEVA
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;