const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRAR UN NUEVO USUARIO
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // 1. Verificar si el usuario ya existe
        let usuario = await User.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe con ese email' });
        }

        // 2. Crear el nuevo usuario (todavía no se guarda)
        usuario = new User(req.body);

        // 3. Encriptar la contraseña (Hashing) - Punto 6 de la rúbrica
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // 4. Guardar en base de datos
        await usuario.save();

        // 5. Crear y firmar el JWT (Json Web Token) - Punto 1 de la rúbrica
        const payload = {
            user: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // El token dura 1 hora
            (error, token) => {
                if (error) throw error;
                // Devolvemos el token al frontend
                res.json({ token, nombre: usuario.nombre });
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

        // 1. Verificar si el usuario existe
        let usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // 2. Verificar la contraseña (comparar la que escriben con la encriptada)
        const passCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // 3. Si todo está bien, crear y devolver el Token
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
                res.json({ token, nombre: usuario.nombre }); // También mandamos el nombre
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error en el servidor');
    }
};