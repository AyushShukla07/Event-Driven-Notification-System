import redis from "../../config/redis";

export const healthCheck = async (_, res) => {
    try {
        await redis.ping();
        res.json({
            status: 'ok',
            redis: 'connected',
            timestamp: new Date()
        });
    } catch {
        res.status(500).json({
            status: 'degraded',
            redis: 'down'
        });
    }
};