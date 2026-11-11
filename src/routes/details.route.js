import express from 'express';
import detailsController from '../controllers/details.controller.js';

const router = express.Router();


router.get('/', detailsController);

export default router;
