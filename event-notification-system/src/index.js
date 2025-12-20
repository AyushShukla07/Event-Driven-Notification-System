import dotenv from 'dotenv';
import app from './app.js';
import { initRedis } from './queues/queue.connection.js';
import './workers/dlq.worker.js';
import './workers/email.worker.js';
import './workers/sms.worker.js';
import './workers/push.worker.js';
import './queues/event.worker.js';

dotenv.config();

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
