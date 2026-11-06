import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaUploads = path.join(__dirname, '../uploads');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Exponemos la carpeta uploads y registramos cada petición en la terminal
app.use('/uploads', (req, res, next) => {
    console.log(`📥 [LOG DE IMAGEN] Alguien intentó ver: ${req.url}`);
    next();
}, express.static(rutaUploads));

async function startServer() {
    try {
        app.listen(3001, () => {
            console.log('Server is running on port 3001');
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

export default { app, startServer };