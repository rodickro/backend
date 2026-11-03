
import { registrarCliente, iniciarSesion } from './services.js';

// Controlador para registrar clientes
export async function register(req, res) {
    try {
        // Recibir los datos enviados por el frontend
        const datos = req.body;

        // Llamar al servicio de registro
        const usuario = await registrarCliente(datos);

        // Responder cuando el registro sea exitoso
        return res.status(201).json({
            mensaje: 'Cliente registrado correctamente',
            usuario
        });

    } catch (error) {

        // Correo o DNI duplicado
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El correo o DNI ya está registrado'
            });
        }

        // Errores de validación
        if (
            error.message === 'Todos los campos son obligatorios' ||
            error.message === 'El DNI debe tener 8 dígitos' ||
            error.message === 'La contraseña debe tener entre 8 y 72 bytes'
        ) {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        console.error('Error al registrar cliente:', error.code || error.message);

        // Otros errores del servidor
        return res.status(500).json({
            mensaje: 'No se pudo completar el registro'
        });
    }
}

export async function login(req, res) {
    try {
        // Recibir las credenciales del usuario
        const datos = req.body ?? {};

        // Verificar las credenciales mediante el servicio
        const usuario = await iniciarSesion(datos);
        req.session.usuario = usuario;
        // Responder cuando las credenciales son correctas
        return res.status(200).json({
            mensaje: 'Inicio de sesión correcto',
            usuario
        });

    } catch (error) {

        // Faltan datos obligatorios
        if (error.message === 'Correo y contraseña obligatorios') {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        // Correo o contraseña incorrectos
        if (error.message === 'Credenciales incorrectas') {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        console.error('Error al iniciar sesión:', error.code || error.message);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
}

export function obtenerSesion(req, res) {
    if (req.session.usuario) {
        return res.status(200).json({
            autenticado: true,
            usuario: req.session.usuario
        });
    }

    return res.status(200).json({
        autenticado: false,
        usuario: null
    });
}

export function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al cerrar sesión'
            });
        }

        res.clearCookie('connect.sid');

        return res.status(200).json({
            mensaje: 'Sesión cerrada correctamente'
        });
    });
}
