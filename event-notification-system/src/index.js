import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { initRedis, redis } from './queues/queue.connection.js';

import './workers/dlq.worker.js';
import './workers/email.worker.js';
import './workers/sms.worker.js';
import './workers/push.worker.js';
import './queues/event.worker.js';



const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await initRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

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
