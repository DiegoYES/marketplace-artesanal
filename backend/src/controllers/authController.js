const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
 * ------------------------------------------------------------------
 * CONTROLADOR: REGISTRO DE NUEVO USUARIO
 * ------------------------------------------------------------------
 * Recibe datos del formulario, encripta la contraseña y genera
 * un token JWT inicial.
 */
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Validación de usuario existente
        let usuario = await User.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe con ese email' });
        }

        // Creación de instancia de usuario
        usuario = new User({ nombre, email, password, rol });

        // Encriptado de contraseña (Hashing)
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // Guardado en Base de Datos
        await usuario.save();

        // Generación de Payload para JWT
        const payload = {
            user: {
                id: usuario.id
            }
        };

        // Firma del Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (error, token) => {
                if (error) throw error;
                res.json({ token, nombre: usuario.nombre, _id: usuario.id, rol: usuario.rol });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error en el servidor');
    }
};

/*
 * ------------------------------------------------------------------
 * CONTROLADOR: AUTENTICACIÓN (LOGIN)
 * ------------------------------------------------------------------
 * Verifica credenciales (email y password hash) y devuelve token.
 */
exports.autenticarUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificación de existencia del usuario
        let usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Comparación de contraseña encriptada
        const passCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // Generación de Payload
        const payload = {
            user: {
                id: usuario.id
            }
        };

        // Firma del Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (error, token) => {
                if (error) throw error;
                res.json({ token, nombre: usuario.nombre, _id: usuario.id, rol: usuario.rol });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error en el servidor');
    }
};