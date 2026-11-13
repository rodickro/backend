import express from 'express';
import carritoController from '../controllers/carrito.controller.js';

import verificarToken from '../middlewares/verificarToken.js';

const router = express.Router();


router.post('/', verificarToken, carritoController.INcarritoController);
router.get('/', verificarToken, carritoController.OUTcarritoController);


export default router;
