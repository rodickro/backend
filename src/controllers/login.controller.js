import database from '../database.js';
import queryUsers from '../sql/users.js';


import bcrypt from 'bcrypt';

const loginController = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {

        const [correos] = await database.promise().query(
            'SELECT * FROM usuario WHERE correo = ?',
            [correo]
        );

        if (correos.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(
            contraseña,
            correos[0].contraseña
        );

        if (!passwordMatch) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error del servidor' });
    }




}

const registerController = (req, res) => {

    const { nombres, apellidos, dni, telefono } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(contraseña, salt);

    database.query(queryUsers.insertClient, [nombres, apellidos, dni, telefono], (error, results) => {
        if (error) {
            console.error('Error inserting client:', error);
            res.status(500).json({ error: 'Error inserting client' });
        } else {
            res.status(201).json({ message: 'Client registered successfully', clientId: results.insertId });
        }
    });

}

export default {
    loginController,
    registerController
};