import database from '../database.js';
import queryUsers from '../sql/users.js';
import jwt from 'jsonwebtoken';


import bcrypt from 'bcrypt';

const loginController = async (req, res) => {

    const { correo, contraseña } = req.body;
    console.log(contraseña)

    try {

        const [correos] = await database.promise().query(
            'SELECT * FROM cliente WHERE correo = ?',
            [correo]
        );

        if (correos.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const passwordMatch = await bcrypt.compare(
            contraseña,
            correos[0].contrasenia
        );

        if (!passwordMatch) {
            return res.status(401).json({
                mensaje: 'Contraseña incorrecta'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id_cliente: correos[0].id_cliente
            },
            "wefgdserwrwerwerw",
            {
                expiresIn: '2h'
            }
        );

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token: token
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: 'Error del servidor'
        });
    }
};
const registerController = async (req, res) => {

    const { nombres, apellidos, dni, telefono, correo, contraseña } = req.body;
    console.log(contraseña)

    try {

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        const [resultado] = await database.promise().query(
            queryUsers.insertClient,
            [nombres, apellidos, dni, telefono, correo, hashedPassword]
        );


        res.status(201).json({
            message: 'Cliente registrado correctamente',
            resultad: resultado
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export default {
    loginController,
    registerController
};