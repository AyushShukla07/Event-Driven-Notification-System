import express from 'express';
import eventRoutes from './api/routes/event.routes.js';
import adminRoutes from './api/routes/admin.routes.js';
import dlqRoutes from './api/routes/dlq.routes.js';

const app = express();

app.use(express.json());
app.use('/api', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', dlqRoutes);

app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
});

export default app;   
