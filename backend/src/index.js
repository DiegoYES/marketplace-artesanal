require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Inicializar app
const app = express();

// Conectar a Base de Datos
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Ruta de prueba (la que ya tenías)
app.get('/', (req, res) => {
    res.send('API del Marketplace Artesanal funcionando 🚀');
});

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
    });
}

// --- VITAL: EXPORTAR LA APP PARA JEST ---
module.exports = app;