const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para Registrarse
router.post('/registro', authController.registrarUsuario);

router.post('/login', authController.autenticarUsuario);

module.exports = router;