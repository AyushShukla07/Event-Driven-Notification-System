import IORedis from 'ioredis';

const redis = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null
});

redis.on('connect', () => {
    console.log('Redis Connected via Redis.js');
});
redis.on('erroe', (err) => {
    console.error('Redis error', err);
});

export default redis;