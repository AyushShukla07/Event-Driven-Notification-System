import express from 'express';
import eventRoutes from './api/routes/event.routes.js';

const app = express();

app.use(express.json());

app.use('/api', eventRoutes);

app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
});

export default app;   
