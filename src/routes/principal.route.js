import express from 'express';
import principalController from '../controllers/principal.controller.js';


const routes = express.Router();

routes.get('/', principalController.callAllProducts);


export default  routes;