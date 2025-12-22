import { Queue } from 'bullmq';
import redis from '../config/redis.js';

export const eventQueue = new Queue('event-queue', {
  connection: redis
});

export const initRedis = async () => {
  try {
    await redis.ping();
    console.log('Redis connected');
  } catch (err) {
    console.error('Redis connection failed', err);
    throw err;
  }
};

