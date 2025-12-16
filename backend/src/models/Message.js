const mongoose = require('mongoose');

/*
 * ------------------------------------------------------------------
 * MODELO: MENSAJE DE CHAT
 * ------------------------------------------------------------------
 * Estructura para almacenar el historial de conversaciones.
 * - room: ID del producto (actúa como identificador de sala).
 * - author: Nombre del usuario que envía.
 * - time: Hora legible para mostrar en el frontend.
 * - createdAt: Timestamp para ordenamiento cronológico.
 */
const MessageSchema = new mongoose.Schema({
    room: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Message', MessageSchema);