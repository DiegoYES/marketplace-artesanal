const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true, default: 1 },
            precio: { type: Number, required: true },
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        default: 'Pagado', // Para simplificar, asumimos que pagan al instante
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);