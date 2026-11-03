
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import 'dotenv/config';
import router from './routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

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
        secure: false, // Solo para localhost
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(router);

function startServer() {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

export default { app, startServer };
