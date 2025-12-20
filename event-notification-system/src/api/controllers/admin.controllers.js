import NotificationLog from "../../models/NotificationLog.js";
import { emailQueue, smsQueue, pushQueue } from '../../queues/notification.queue.js'

export const retryFailedNotification = async (req, res) => {
    const { eventId, channel } = req.body;

    if (!eventId || !channel) {
        return res.status(400).json({ error: 'eventId and channel reuired' });
    }

    const log = await NotificationLog.findOne({ eventId, channel });

    if (!log) {
        return res.status(404).json({ error: 'Notification not found' });
    }

    const payLoad = {
        eventId: log.eventId,
        userId: log.userId,
        eventType: log.eventType,
        data: {},
    };

    const queueMap = {
        email: emailQueue,
        sms: smsQueue,
        push: pushQueue
    };

    await queueMap[channel].add('retry', payLoad, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 }
    });

    log.status = 'pending';
    log.error = null;
    log.attempt = 0;
    await log.save();

    return res.json({ message: 'Retry triggered' });
};