import express from 'express';
import eventRoutes from './api/routes/event.routes.js';
import adminRoutes from './api/routes/admin.routes.js';
import metricsRoutes from './api/routes/metrics.routes.js';
import dlqRoutes from './api/routes/dlq.routes.js';
import healthRoutes from './api/routes/health.routes.js';

const app = express();

app.use(express.json());
app.use('/api', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', metricsRoutes);
app.use('/api', dlqRoutes);
app.use('/', healthRoutes);

// app.get('/health', (_, res) => {
//     res.json({ status: 'ok' });
// });

export default app;   
