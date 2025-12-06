const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔥 MongoDB Conectado Exitosamente');
    } catch (error) {
        console.error(`❌ Error de conexión: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;