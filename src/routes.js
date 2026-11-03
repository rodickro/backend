

import { Router } from 'express';
import {
    register,
    login,
    obtenerSesion,
    logout
} from './controllers.js';

const router = Router();

// Registrar un cliente
router.post('/register', register);

// Iniciar sesión
router.post('/login', login);

// Consultar si hay un usuario conectado
router.get('/session', obtenerSesion);

// Cerrar sesión
router.post('/logout', logout);

export default router;
