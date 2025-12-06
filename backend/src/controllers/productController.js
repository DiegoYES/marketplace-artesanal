const Product = require('../models/Product');

// OBTENER todos los productos
exports.getProducts = async (req, res) => {
    try {
        // .populate('campo', 'datos_que_quiero')
        // Esto busca al usuario por su ID y nos trae su nombre
        const products = await Product.find().populate('creador', 'nombre');
        
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener los productos' });
    }
};

// CREAR un nuevo producto
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);

        // --- LÍNEA NUEVA: ASIGNAR EL DUEÑO ---
        // req.user viene del middleware 'auth' que configuramos ayer
        newProduct.creador = req.user.id; 

        await newProduct.save();
        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al crear el producto' });
    }
};