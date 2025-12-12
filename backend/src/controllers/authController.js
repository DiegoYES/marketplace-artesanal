const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRAR UN NUEVO USUARIO
exports.registrarUsuario = async (req, res) => {
    try {
        // Recibimos el rol del formulario
        const { nombre, email, password, rol } = req.body;

        let usuario = await User.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe con ese email' });
        }

        // Creamos el usuario con el rol (si no viene, usa el default del modelo)
        usuario = new User({ nombre, email, password, rol });

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save();

        const payload = {
            user: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (error, token) => {
                if (error) throw error;
                // Enviamos el rol al frontend
                res.json({ token, nombre: usuario.nombre, _id: usuario.id, rol: usuario.rol });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error en el servidor');
    }
};

// LOGIN DE USUARIO
exports.autenticarUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        let usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        const passCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const payload = {
            user: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (error, token) => {
                if (error) throw error;
                // Enviamos el rol al frontend también en el login
                res.json({ token, nombre: usuario.nombre, _id: usuario.id, rol: usuario.rol });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error en el servidor');
    }
};