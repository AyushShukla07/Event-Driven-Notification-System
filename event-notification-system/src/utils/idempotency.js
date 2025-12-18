import redis from '../config/redis.js';

export const isDuplicateEvent = async (key) => {
    const exists = await redis.get(key);
    return exists !== null;
};

export const markEventProcessed = async (key) => {
    await redis.set(key, 'processed', 'EX', 60 * 60);
};