const Order = require('../models/Order');

/*
 * ------------------------------------------------------------------
 * CONTROLADOR: CREAR NUEVA ORDEN
 * ------------------------------------------------------------------
 * Recibe los items y el total del carrito de compras.
 * Genera un registro en la base de datos vinculando la orden
 * con el ID del usuario autenticado (req.user.id).
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, total } = req.body;

        // Validación de carrito vacío
        if (items && items.length === 0) {
            return res.status(400).json({ msg: 'No hay productos en la orden' });
        }

        // Instancia del modelo Order
        const order = new Order({
            usuario: req.user.id,
            items,
            total,
            estado: 'Completado'
        });

        // Guardado en Base de Datos
        const createdOrder = await order.save();
        
        console.log(`Orden procesada para usuario: ${req.user.id} - Total: $${total}`);
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al procesar la orden' });
    }
};

/*
 * ------------------------------------------------------------------
 * CONTROLADOR: OBTENER HISTORIAL DE ÓRDENES
 * ------------------------------------------------------------------
 * Consulta la base de datos para recuperar todas las órdenes
 * asociadas al usuario actual, ordenadas por fecha descendente.
 */
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ usuario: req.user.id }).sort({ fecha: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener órdenes' });
    }
};