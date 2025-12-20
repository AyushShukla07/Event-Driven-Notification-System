import { Worker } from "bullmq";
import { emailQueue, smsQueue, pushQueue } from "./notification.queue.js";
import redis from "../config/redis.js";

const worker = new Worker('event-queue', async job => {
    const { eventId, userId, data, eventType } = job.data;

    await Promise.all([
        emailQueue.add('send_email', { eventId, userId, data, eventType }, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } }),
        smsQueue.add('send_sms', { eventId, userId, data, eventType }, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } }),
        pushQueue.add('send_push', { eventId, userId, data, eventType }, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } })
    ]);
}, { connection: redis });