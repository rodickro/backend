
import express from 'express';
import {
    login,
    register,
    obtenerSesion,
    logout
} from '../controllers.js';

const router = express.Router();

// Registrar un usuario
router.post('/register', register);

// Iniciar sesión
router.post('/login', login);

// Consultar sesión activa
router.get('/session', obtenerSesion);

// Cerrar sesión
router.post('/logout', logout);

export default router;
