import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const emailQueue = new Queue('email', { connection: redis ,
    defaultJobOptions:{
        attempts:5,
        backoff:{
            type:'exponential',
            delay:1000
        }
    }
});
export const smsQueue = new Queue('sms', { connection: redis });
export const pushQueue = new Queue('push', { connection: redis });