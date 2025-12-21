import pkg from 'bullmq';
import { sendSMS } from '../services/sms.service.js';
import NotificationLog from '../models/NotificationLog.js';
import redis from '../config/redis.js';
import { dlqQueue } from '../queues/dlq.queue.js';
import { incrementMetric } from '../utils/metrics.js';

const { Worker } = pkg;

const queueName = 'sms';
// new QueueScheduler(queueName, { connection: redis });

const worker = new Worker(queueName, async job => {
    const { correlationId, userId, data, eventType } = job.data;

    let log = await NotificationLog.findOne({
        correlationId, userId, channel: 'sms'
    });

    if (log?.status === 'sent') return;

    try {
        await sendSMS({ userId, data });

        if (!log) log = new NotificationLog({ correlationId, userId, eventType, channel: 'sms', status: 'sent' });
        else log.status = 'sent';

        log.attempt = job.attemptsMade + 1;

        await log.save();
        console.log(`SMS sent successfully for event ${correlationId}`);

        await incrementMetric('metrics:sms:success');

    } catch (err) {
        if (!log) log = new NotificationLog({ correlationId, userId, eventType, channel: 'sms', status: 'failed', error: err.message });
        else {
            log.status = 'failed';
            log.error = err.message;
        }

        log.attempt = job.attemptsMade + 1;

        await log.save();

        if (job.attemptsMade + 1 >= job.opts.attempts) {
            await dlqQueue.add('email_failed', {
                correlationId,
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