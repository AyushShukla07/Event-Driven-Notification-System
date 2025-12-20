import redis from "../config/redis";

export const incrementMetric = async (key) => {
    await redis.incr(key);
};

export const getMetric = async (key) => {
    const val = await redis.get(key);
    return Number(val || 0);
}