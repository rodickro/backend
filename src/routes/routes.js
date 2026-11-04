
import express from 'express';
import principalRoutes from './principal.routes.js';
import LoginRoutes from './Login.routes.js';

const router = express.Router();

// Rutas de la página principal
router.use('/principal', principalRoutes);

// Rutas de autenticación
router.use('/', LoginRoutes);

export default router;
