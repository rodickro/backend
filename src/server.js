import express from 'express';
import cors from 'cors';
import session from 'express-session';

const app = express();



app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'mi_clave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

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