import IORedis from 'ioredis';

const redis = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

export default redis;