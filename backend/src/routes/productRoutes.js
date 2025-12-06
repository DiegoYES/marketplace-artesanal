const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth'); // <--- IMPORTAR EL GUARDIA

// GET /api/products -> Obtener todos (PÚBLICA)
router.get('/', productController.getProducts);

// POST /api/products -> Crear uno (PRIVADA - Aquí ponemos al guardia)
router.post('/', auth, productController.createProduct);

module.exports = router;