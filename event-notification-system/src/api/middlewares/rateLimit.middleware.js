import redis from '../../config/redis.js';

export const rateLimiter = async (req, res, next) => {
    const userId = req.body.userId;
    const key = `rate:${userId}`;

    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, 60);
    }

    if (count > 20) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    next();
};