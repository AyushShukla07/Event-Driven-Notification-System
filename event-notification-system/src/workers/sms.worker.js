import pkg from 'bullmq';
import { sendSMS } from '../services/sms.service.js';
import NotificationLog from '../models/NotificationLog.js';
import redis from '../config/redis.js';

const {Worker}=pkg;

const queueName = 'sms';
// new QueueScheduler(queueName, { connection: redis });

const worker = new Worker(queueName, async job => {
    const { eventId, userId, data, eventType } = job.data;

    let log = await NotificationLog.findOne({
        eventId, userId, channel: 'sms'
    });

    if (log?.status === 'sent') return;

    try {
        await sendSMS({ userId, data });

        if (!log) log = new NotificationLog({ eventId, userId, eventType, channel: 'sms', status: 'sent' });
        else log.status = 'sent';
        await log.save();
        console.log(`SMS sent successfully for event ${eventId}`);
    } catch (err) {
        if (!log) log = new NotificationLog({ eventId, userId, eventType, channel: 'sms', status: 'failed', error: err.message });
        else {
            log.status = 'failed';
            log.error = err.message;
        }
        await log.save();
        throw err;
    }
}, { connection: redis, attempts: 5, backoff: { type: 'exponential', delay: 1000 } });

export default worker;