import pkg from 'bullmq';
import { sendPush } from '../services/push.service.js';
import NotificationLog from '../models/NotificationLog.js';
import redis from '../config/redis.js';
import { dlqQueue } from '../queues/dlq.queue.js';
import { incrementMetric } from '../utils/metrics.js';

const { Worker } = pkg;

const queueName = 'push';
// new QueueScheduler(queueName, { connection: redis });

const worker = new Worker(queueName, async job => {
    const { eventId, userId, data, eventType } = job.data;

    let log = await NotificationLog.findOne({ eventId, userId, channel: 'push' });
    if (log?.status === 'sent') return;

    try {
        await sendPush({ userId, data });

        if (!log) log = new NotificationLog({ eventId, userId, eventType, channel: 'push', status: 'sent' });
        else log.status = 'sent';

        log.attempt = job.attemptsMade + 1;

        await log.save();
        console.log(`Push notification sent successfully for event ${eventId}`);

        await incrementMetric('metrics:push:success');

    } catch (err) {
        if (!log) log = new NotificationLog({ eventId, userId, eventType, channel: 'push', status: 'failed', error: err.message });
        else {
            log.status = 'failed';
            log.error = err.message;
        }

        log.attempt = job.attemptsMade + 1;

        await log.save();

        if (job.attemptsMade+1 >= job.opts.attempts) {
            await dlqQueue.add('email_failed', {
                eventId,
                userId,
                eventType,
                channel: 'email',
                error: err.message
            });
        }

        throw err;
    }
}, { connection: redis, attempts: 5, backoff: { type: 'exponential', delay: 1000 } });

export default worker;
