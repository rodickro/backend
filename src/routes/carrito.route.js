import { Router } from 'express';
import { obtenerCarrito } from '../controllers/carrito.controller.js';



const router = Router();

router.get('/', obtenerCarrito); 

export default router;