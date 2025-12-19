import { Worker, QueueScheduler } from 'bullmq';
import { sendEmail } from '../services/email.service.js';
import NotificationLog from '../models/NotificationLog.js';
import redis from '../config/redis.js';

const queueName = 'email';

new QueueScheduler(queueName, { connection: redis });

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
        await log.save();
        console.log(`Email sent successfully for event ${eventId}`);
    } catch (err) {
        console.log(`Email failed for event ${eventId}`, err);
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
        await log.save();
        throw err;
    }
}, { connection: redis, attempts: 5, backoff: { type: 'exponential', delay: 1000 } });

export default worker;