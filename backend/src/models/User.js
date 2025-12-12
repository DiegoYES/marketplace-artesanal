const mongoose = require('mongoose');

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
        enum: ['comprador', 'vendedor'], // Solo permite estos dos valores
        default: 'comprador' // Si no eligen, son compradores por defecto
    },
    registro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);