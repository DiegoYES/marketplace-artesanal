const mongoose = require('mongoose');

/*
 * ------------------------------------------------------------------
 * MODELO: USUARIO (AUTENTICACIÓN Y ROLES)
 * ------------------------------------------------------------------
 * Define la estructura de las cuentas de acceso.
 * - email: Debe ser único en todo el sistema.
 * - rol: Define los permisos (ACL). 
 * Valores permitidos: 'comprador', 'vendedor', 'admin'.
 */
const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['comprador', 'vendedor', 'admin'],
        default: 'comprador'
    },
    registro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);