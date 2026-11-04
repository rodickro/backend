import server from './server.js';
import router from './routes/routes.js';
import dotenv from 'dotenv';
import './database.js';

dotenv.config();

server.app.use('/ecommer', router);


const iniciarServidor = async () => {
    try {
        server.startServer();
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

iniciarServidor();