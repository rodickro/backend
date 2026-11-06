
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Obtener la ruta de la carpeta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaUploads = path.join(__dirname, '../uploads');

const app = express();

// Permitir la conexión con nuestro frontend React
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Mostrar las solicitudes HTTP en la terminal
app.use(morgan('dev'));

// Permitir recibir datos en formato JSON
app.use(express.json());

// Verificar la clave necesaria para las sesiones
if (!process.env.SESSION_SECRET) {
    throw new Error('Falta SESSION_SECRET en .env');
}

// Configurar las sesiones de los usuarios
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Para desarrollo local
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Permitir acceder a las imágenes guardadas en uploads
app.use('/uploads', (req, res, next) => {
    console.log(`Solicitud de imagen: ${req.url}`);
    next();
}, express.static(rutaUploads));

// Iniciar el servidor
function startServer() {
    app.listen(3001, () => {
        console.log('Servidor ejecutándose en el puerto 3001');
    });
}

export default { app, startServer };
