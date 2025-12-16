const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
const Message = require('./models/Message');
require('dotenv').config();

/*
 * ------------------------------------------------------------------
 * CONFIGURACIÓN DEL SERVIDOR Y SOCKETS
 * ------------------------------------------------------------------
 * Inicialización de Express y envoltura en servidor HTTP
 * para soportar comunicación en tiempo real (WebSockets).
 */
const app = express();
const server = http.createServer(app);

// Configuración de CORS para Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

/*
 * ------------------------------------------------------------------
 * MIDDLEWARES Y RUTAS REST
 * ------------------------------------------------------------------
 * Configuración de seguridad (CORS), parseo de JSON y definición
 * de endpoints de la API.
 */
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

/*
 * ------------------------------------------------------------------
 * LÓGICA DE CHAT EN TIEMPO REAL (WEBSOCKETS)
 * ------------------------------------------------------------------
 * Gestión de eventos de conexión, salas (rooms) y mensajería.
 */
io.on('connection', (socket) => {
    
    // EVENTO: UNIRSE A SALA DE PRODUCTO
    socket.on('join_room', async (room) => {
        socket.join(room);
        console.log(`Socket ID: ${socket.id} unido a sala: ${room}`);
        
        // Recuperación de historial de chat
        try {
            const history = await Message.find({ room: room }).sort({ createdAt: 1 });
            socket.emit('load_history', history);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        }
    });

    // EVENTO: ENVÍO Y DIFUSIÓN DE MENSAJES
    socket.on('send_message', async (data) => {
        try {
            // 1. Persistencia en Base de Datos
            const newMessage = new Message({
                room: data.room,
                author: data.author,
                message: data.message,
                time: data.time
            });
            await newMessage.save();
            
            // 2. Broadcast a la sala específica
            socket.to(data.room).emit('receive_message', data);
            
        } catch (error) {
            console.error("Error al guardar mensaje:", error);
        }
    });

    // EVENTO: DESCONEXIÓN
    socket.on('disconnect', () => {
        console.log('Cliente desconectado del socket');
    });
});

/*
 * ------------------------------------------------------------------
 * CONEXIÓN A BASE DE DATOS E INICIO
 * ------------------------------------------------------------------
 */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Conectado Exitosamente'))
    .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});