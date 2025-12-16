const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

/*
 * ------------------------------------------------------------------
 * RUTAS DE PRODUCTOS
 * ------------------------------------------------------------------
 * Definición de endpoints para la gestión del inventario.
 */

/*
 * GET /api/products
 * (PÚBLICO) Recupera el catálogo completo de artesanías.
 * Accesible para visitantes y usuarios registrados.
 */
router.get('/', productController.getProducts);

/*
 * ------------------------------------------------------------------
 * ZONA PROTEGIDA (Requiere Token JWT)
 * ------------------------------------------------------------------
 * Las siguientes operaciones modifican la base de datos y
 * requieren autenticación obligatoria.
 */

/*
 * POST /api/products
 * Crea una nueva publicación de venta.
 */
router.post('/', auth, productController.createProduct);

/*
 * PUT /api/products/:id
 * Actualiza la información de un producto existente.
 */
router.put('/:id', auth, productController.updateProduct);

/*
 * DELETE /api/products/:id
 * Elimina un producto de la base de datos.
 */
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;