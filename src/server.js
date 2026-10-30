import express from 'express';


const app = express();




async function startServer() {

    try {
        await app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });

    } catch (error) {
        console.error('Error starting server:', error);
    }
}


export default { app, startServer };