import server from './server.js';
import dotenv from 'dotenv';
import './database.js';

dotenv.config();

const iniciarServidor = async () => {
    try {

        server.startServer();

    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};

iniciarServidor(); 