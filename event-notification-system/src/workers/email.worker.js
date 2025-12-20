import { Worker } from 'bullmq';
import { sendEmail } from '../services/email.service.js';
import NotificationLog from '../models/NotificationLog.js';
import redis from '../config/redis.js';
import { dlqQueue } from '../queues/dlq.queue.js';
import { logger } from '../utils/logger.js';
import { incrementMetric } from '../utils/metrics.js';

// const { Worker } = pkg;

const queueName = 'email';

// new QueueScheduler(queueName, { connection: redis });

const worker = new Worker(queueName, async job => {
    const { eventId, userId, data, eventType } = job.data;

    let log = await NotificationLog.findOne({
        eventId,
        userId,
        channel: 'email'
    });

    if (log?.status === 'sent') return;

    try {
        await sendEmail({ userId, data });

        if (!log) {
            log = new NotificationLog({
                eventId,
                userId,
                eventType,
                channel: 'email',
                status: 'sent'
            });
        } else {
            log.status = 'sent';
        }

        log.attempt = job.attemptsMade + 1;
        await log.save();

        // console.log(`Email sent successfully for event ${eventId}`);
        logger.info('Email sent', { eventId, userId });

        await incrementMetric('metrics:email:success');

    } catch (err) {
        // console.log(`Email failed for event ${eventId}`, err);
        logger.error('Email failed', { eventId, error: err.message });
        if (!log) {
            log = new NotificationLog({
                eventId,
                userId,
                eventType,
                channel: 'email',
                status: 'failed',
                error: err.message
            })
        } else {
            log.status = 'failed';
            log.error = err.message;
        }

        log.attempt = job.attemptsMade + 1;

        await log.save();

        if (job.attemptsMade + 1 >= job.opts.attempts) {
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
}, { connection: redis });

worker.on('completed', job => {
    logger.info('Email job completed', { jobId: job.id });
});
worker.on('failed', (job, err) => {
    logger.error('Email job failed', {
        jobId: job?.id,
        error: err.message
    });
});

export default worker;