const mongoose = require('mongoose');

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
        enum: ['Textiles', 'Cerámica', 'Madera', 'Joyería', 'Pintura', 'Otros'] // Categorías fijas
    },
    imagenUrl: {
        type: String,
        default: 'https://via.placeholder.com/150' // Imagen por defecto si no suben una
    },
    stock: {
        type: Number,
        default: 1,
        min: 0
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Relación con el usuario (vendedor)
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);