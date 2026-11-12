import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta de la carpeta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaUploads = path.join(__dirname, '../uploads');

const app = express();

// Permitir conexiones desde el frontend
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Mostrar solicitudes en la terminal
app.use(morgan('dev'));

// Recibir datos JSON
app.use(express.json());

// Exponemos la carpeta uploads y registramos cada petición en la terminal
app.use('/uploads', (req, res, next) => {
    console.log(`📥 [LOG DE IMAGEN] Alguien intentó ver: ${req.url}`);
    next();
}, express.static(rutaUploads));

// Iniciar servidor
async function startServer() {
    try {
        app.listen(3001, () => {
            console.log('Servidor ejecutándose en el puerto 3001');
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

export default { app, startServer };