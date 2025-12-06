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

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API del Marketplace Artesanal funcionando 🚀');
});

// Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});