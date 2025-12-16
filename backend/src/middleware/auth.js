const jwt = require('jsonwebtoken');

/*
 * ------------------------------------------------------------------
 * MIDDLEWARE DE AUTENTICACIÓN
 * ------------------------------------------------------------------
 * Intercepta las peticiones a rutas protegidas para verificar
 * la identidad del usuario mediante JWT.
 * * 1. Busca el token en el header 'x-auth-token'.
 * 2. Verifica la firma criptográfica usando la clave secreta.
 * 3. Inyecta el usuario decodificado en la petición (req.user).
 */
module.exports = function (req, res, next) {
    // Extracción del token del header
    const token = req.header('x-auth-token');

    // Validación de existencia
    if (!token) {
        return res.status(401).json({ msg: 'Acceso denegado: No hay token de autorización' });
    }

    // Verificación de integridad del token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Inyección de usuario en la request para uso posterior
        req.user = decoded.user;
        
        next(); // Continuar al siguiente middleware o controlador
        
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido o expirado' });
    }
};