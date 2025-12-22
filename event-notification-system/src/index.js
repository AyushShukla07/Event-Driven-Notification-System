import dotenv from 'dotenv';
dotenv.config();
import './config/env.js';
import app from './app.js';
import { initRedis} from './queues/queue.connection.js';
import redis from './config/redis.js';
import { connectMongo } from './config/mongoDB.js';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectMongo();
    await initRedis();

    await import('./workers/dlq.worker.js');
    await import('./workers/email.worker.js');
    await import('./workers/sms.worker.js');
    await import('./workers/push.worker.js');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

// import './queues/event.worker.js';

startServer();

let isShuttingDown = false;

const shutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('Shutting down gracefully...');
  try {
    await redis.quit();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
