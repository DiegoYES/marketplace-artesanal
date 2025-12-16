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
        newProduct.creador = req.user.id; // Vinculación Usuario-Producto
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
 * Incluye validación de seguridad: Solo el dueño puede editar.
 */
exports.updateProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, imagenUrl, stock } = req.body;
        
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Verificación de Propiedad (Seguridad)
        if (product.creador.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado para editar este producto' });
        }

        const nuevoProducto = {};
        if (nombre) nuevoProducto.nombre = nombre;
        if (descripcion) nuevoProducto.descripcion = descripcion;
        if (precio) nuevoProducto.precio = precio;
        if (categoria) nuevoProducto.categoria = categoria;
        if (imagenUrl) nuevoProducto.imagenUrl = imagenUrl;
        if (stock) nuevoProducto.stock = stock;

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
 * Incluye validación de seguridad: Solo el dueño puede borrar.
 */
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Verificación de Propiedad (Seguridad)
        if (product.creador.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado para eliminar este producto' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Producto eliminado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};