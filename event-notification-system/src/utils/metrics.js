import redis from "../config/redis.js";

export const incrementMetric = async (key) => {
    await redis.incr(key);
};

export const getMetric = async (key) => {
    const val = await redis.get(key);
    return Number(val || 0);
}