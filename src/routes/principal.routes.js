import express from 'express';
import principalController from '../controllers/principal.controller.js';


const routes = express.Router();

routes.get('/', principalController.getPrincipal);
export default  routes;