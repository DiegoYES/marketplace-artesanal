const Product = require('../models/Product');
const User = require('../models/User');

/*
 * ------------------------------------------------------------------
 * OBTENER TODOS LOS PRODUCTOS
 * ------------------------------------------------------------------
 * Retorna el catálogo completo.
 * Incluye los datos del usuario creador (nombre) usando populate.
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
 * CREAR UN PRODUCTO
 * ------------------------------------------------------------------
 * Guarda un nuevo producto en la base de datos.
 * Asigna automáticamente al usuario autenticado como creador.
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
 * EDITAR PRODUCTO (CON VERIFICACIÓN EN TIEMPO REAL)
 * ------------------------------------------------------------------
 * Actualiza la información de un producto existente.
 * Consulta la base de datos para verificar si el usuario es Admin
 * o el dueño original, garantizando permisos actualizados.
 */
exports.updateProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, imagenUrl, stock } = req.body;
        
        // Buscar el producto objetivo
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Consultar el usuario actual en la BD para obtener su rol real
        const userDb = await User.findById(req.user.id);
        
        // Validación de permisos (Admin Global o Dueño del producto)
        const esAdmin = userDb.rol === 'admin';
        const esDuenio = product.creador && product.creador.toString() === req.user.id;

        if (!esAdmin && !esDuenio) {
            return res.status(401).json({ msg: 'No autorizado para editar este producto' });
        }

        // Construir objeto con los nuevos datos
        const nuevoProducto = {};
        if (nombre) nuevoProducto.nombre = nombre;
        if (descripcion) nuevoProducto.descripcion = descripcion;
        if (precio) nuevoProducto.precio = precio;
        if (categoria) nuevoProducto.categoria = categoria;
        if (imagenUrl) nuevoProducto.imagenUrl = imagenUrl;
        if (stock) nuevoProducto.stock = stock;

        // Actualizar y retornar el nuevo documento
        product = await Product.findByIdAndUpdate(req.params.id, { $set: nuevoProducto }, { new: true });
        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

/*
 * ------------------------------------------------------------------
 * ELIMINAR PRODUCTO (CON VERIFICACIÓN EN TIEMPO REAL)
 * ------------------------------------------------------------------
 * Elimina un producto de la base de datos.
 * Requiere permisos de Administrador o ser el creador del ítem.
 */
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Consultar el usuario actual en la BD para obtener su rol real
        const userDb = await User.findById(req.user.id);

        // Validación de permisos
        const esAdmin = userDb.rol === 'admin';
        const esDuenio = product.creador && product.creador.toString() === req.user.id;

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