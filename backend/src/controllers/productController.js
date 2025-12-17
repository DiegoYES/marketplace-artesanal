const Product = require('../models/Product');

/*
 * ------------------------------------------------------------------
 * CONTROLADOR: OBTENER CATÁLOGO DE PRODUCTOS
 * ------------------------------------------------------------------
 * Recupera todos los productos de la base de datos.
 * Utiliza .populate() para obtener el nombre del vendedor asociado.
 */
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('creador', 'nombre');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener los productos' });
    }
};

/*
 * ------------------------------------------------------------------
 * CONTROLADOR: CREAR NUEVO PRODUCTO
 * ------------------------------------------------------------------
 * Recibe los datos del formulario y asigna el ID del usuario
 * autenticado como el 'creador' del producto.
 */
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        newProduct.creador = req.user.id; 
        await newProduct.save();
        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al crear el producto' });
    }
};

/*
 * ------------------------------------------------------------------
 * CONTROLADOR: EDITAR PRODUCTO EXISTENTE
 * ------------------------------------------------------------------
 * Permite actualizar campos específicos.
 * Validación de seguridad: 
 * - Permite editar si el usuario es el Creador (Dueño).
 * - Permite editar si el usuario es Admin (Superusuario).
 */
exports.updateProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, imagenUrl, stock } = req.body;
        
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // --- LÓGICA DE PERMISOS SUPERIOR ---
        // 1. Verificación de Rol Admin
        const esAdmin = req.user.rol === 'admin';
        
        // 2. Verificación de Propiedad (Dueño)
        // Se valida que product.creador exista para evitar errores en productos antiguos
        const esDuenio = product.creador && product.creador.toString() === req.user.id;

        // Si NO es Admin Y TAMPOCO es el dueño -> Error 401
        if (!esAdmin && !esDuenio) {
            return res.status(401).json({ msg: 'No autorizado para editar este producto' });
        }

        const nuevoProducto = {};
        if (nombre) nuevoProducto.nombre = nombre;
        if (descripcion) nuevoProducto.descripcion = descripcion;
        if (precio) nuevoProducto.precio = precio;
        if (categoria) nuevoProducto.categoria = categoria;
        if (imagenUrl) nuevoProducto.imagenUrl = imagenUrl;
        if (stock) nuevoProducto.stock = stock;

        // new: true devuelve el producto ya actualizado para reflejarlo en el frontend
        product = await Product.findByIdAndUpdate(req.params.id, { $set: nuevoProducto }, { new: true });
        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

/*
 * ------------------------------------------------------------------
 * CONTROLADOR: ELIMINAR PRODUCTO
 * ------------------------------------------------------------------
 * Borra permanentemente un producto.
 * Validación de seguridad: 
 * - Permite el borrado si el usuario es el Creador.
 * - Permite el borrado si el usuario es Admin (Superusuario).
 */
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // 1. Verificación de Rol Admin
        const esAdmin = req.user.rol === 'admin';

        // 2. Verificación de Propiedad (Dueño)
        const esDuenio = product.creador && product.creador.toString() === req.user.id;

        // Si no cumple ninguna de las dos condiciones, se rechaza
        if (!esAdmin && !esDuenio) {
            return res.status(401).json({ msg: 'No autorizado para eliminar este producto' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Producto eliminado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};