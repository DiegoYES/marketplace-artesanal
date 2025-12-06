const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Leer el token del header de la petición
    // El estándar es mandarlo en un header llamado 'x-auth-token' o 'Authorization'
    const token = req.header('x-auth-token');

    // 2. Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }

    // 3. Validar el token
    try {
        // Verificamos que el token sea real usando la firma secreta
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        
        // Si es válido, guardamos el usuario en la petición para usarlo después
        req.user = cifrado.user;
        next(); // Dejamos pasar a la siguiente función (el controlador)
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};