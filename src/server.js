
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import 'dotenv/config';

const app = express();

// Permitir la conexión con React
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Verificar la clave de sesiones
if (!process.env.SESSION_SECRET) {
    throw new Error('Falta SESSION_SECRET en .env');
}

// Configurar las sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

function startServer() {
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    });
}

export default { app, startServer };
