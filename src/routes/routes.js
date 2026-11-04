import express from 'express';
import principalRoutes from './principal.routes.js';


const router = express.Router();

router.use('/principal', principalRoutes);
// router.use('/login', LoginRoutes);
// router.use('/register', RegisterRoutes);


export default router;