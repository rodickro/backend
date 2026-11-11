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

// Mostrar las imágenes de productos
app.use('/uploads', express.static(rutaUploads));

// Iniciar servidor
function startServer() {
    app.listen(3001, () => {
        console.log('Servidor ejecutándose en el puerto 3001');
    });
}

export default { app, startServer };