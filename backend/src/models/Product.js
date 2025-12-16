const mongoose = require('mongoose');

/*
 * ------------------------------------------------------------------
 * MODELO: PRODUCTO (ARTESANÍA)
 * ------------------------------------------------------------------
 * Define la estructura de los artículos en venta.
 * - Validaciones: Precios no negativos, campos obligatorios.
 * - Categorización: Lista cerrada (Enum) de tipos de artesanía.
 * - Relación: Vinculación con el Usuario (Vendedor) vía ObjectId.
 */
const ProductSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la artesanía es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: 0
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Textiles', 'Cerámica', 'Madera', 'Joyería', 'Pintura', 'Otros']
    },
    imagenUrl: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    stock: {
        type: Number,
        default: 1,
        min: 0
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);