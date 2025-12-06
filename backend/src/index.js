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

// --- RUTAS (Aquí conectamos lo que acabas de crear) ---
// NUEVO: Importar y usar las rutas de productos
app.use('/api/products', require('./routes/productRoutes'));

app.use('/api/products', require('./routes/productRoutes'));
// NUEVA RUTA:
app.use('/api/auth', require('./routes/authRoutes'));

// ... (resto del código)

// Ruta de prueba (la que ya tenías)
app.get('/', (req, res) => {
    res.send('API del Marketplace Artesanal funcionando 🚀');
});

// Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});