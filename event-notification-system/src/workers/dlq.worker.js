import { Worker } from "bullmq";
import NotificationLog from '../models/NotificationLog.js';
import redis from "../config/redis.js";
import { logger } from '../utils/logger.js';

const dlqWorker = new Worker(
    'dlq',
    async job => {
        const { eventId, userId, eventType, channel, error } = job.data;

        logger.error('DLQ recieved job', {
            eventId,
            userId,
            channel,
            error
        });

        await NotificationLog.findOneAndUpdate(
            { eventId, userId, channel },
            {
                status: 'failed',
                error,
                $inc: { attempt: 1 }
            },
            { upsert: true }
        );
    },
    { connection: redis }
);