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
        unique: true, // No puede haber dos usuarios con el mismo correo
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    registro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);