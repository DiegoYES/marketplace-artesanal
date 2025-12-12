const Order = require('../models/Order');

// CREAR NUEVA ORDEN
exports.createOrder = async (req, res) => {
    try {
        const { items, total } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ msg: 'No hay productos en la orden' });
        }

        const order = new Order({
            usuario: req.user.id,
            items,
            total,
            estado: 'Completado'
        });

        const createdOrder = await order.save();
        
        console.log(`✅ Orden creada por ${req.user.id}: $${total}`);
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al procesar la orden' });
    }
};

// OBTENER MIS ÓRDENES (Historial)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ usuario: req.user.id }).sort({ fecha: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener órdenes' });
    }
};