const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/*
 * ------------------------------------------------------------------
 * RUTAS DE AUTENTICACIÓN
 * ------------------------------------------------------------------
 * Endpoints públicos para la gestión de acceso de usuarios.
 * No requieren token para ser consumidos.
 */

/*
 * POST /api/auth/registro
 * Crea un nuevo usuario (Comprador o Vendedor) en la base de datos.
 */
router.post('/registro', authController.registrarUsuario);

/*
 * POST /api/auth/login
 * Verifica credenciales y devuelve un token JWT de sesión.
 */
router.post('/login', authController.autenticarUsuario);

module.exports = router;