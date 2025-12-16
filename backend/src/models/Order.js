const mongoose = require('mongoose');

/*
 * ------------------------------------------------------------------
 * MODELO: ORDEN DE COMPRA
 * ------------------------------------------------------------------
 * Estructura para registrar transacciones finalizadas.
 * - usuario: Referencia al cliente que realizó la compra.
 * - items: Arreglo de sub-documentos con detalles de los productos.
 * - total: Monto final de la transacción.
 * - estado: Status del pedido (Ej. Pagado, Pendiente).
 */
const OrderSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            nombre: { 
                type: String, 
                required: true 
            },
            cantidad: { 
                type: Number, 
                required: true, 
                default: 1 
            },
            precio: { 
                type: Number, 
                required: true 
            },
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
        default: 'Pagado'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);