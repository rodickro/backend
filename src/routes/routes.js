import express from 'express';
import principalRoute from './principal.route.js';
import LoginRoute from './Login.route.js';
import RegisterRoute from './register.route.js';
import detailsRoute from './details.route.js';
import carritoRoute from './carrito.route.js';

const router = express.Router();

router.use('/principal', principalRoute);
router.use('/login', LoginRoute);
router.use('/register', RegisterRoute);
router.use('/details', detailsRoute )
router.use('/carrito' , carritoRoute)


export default router;