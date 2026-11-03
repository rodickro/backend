import express from 'express';

const app = express();

app.use(express.json());

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