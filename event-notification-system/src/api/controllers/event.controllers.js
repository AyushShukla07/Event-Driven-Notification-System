// import { eventQueue } from "../../queues/queue.connection.js";
import { isDuplicateEvent, markEventProcessed } from "../../utils/idempotency.js";
import { v4 as uuidv4 } from 'uuid';
import { emailQueue, smsQueue, pushQueue } from "../../queues/notification.queue.js";
import { logger } from "../../utils/logger.js";


export const ingestEvent = async (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
        return res.status(400).json({ error: 'Idempotency-Key required' });
    }

    if (await isDuplicateEvent(idempotencyKey)) {
        return res.status(409).json({ error: 'Duplicate event' });
    }

    const { eventType, data } = req.body;
    const userId = req.user.userId;

    if (!eventType || !userId || !data) {
        return res.status(400).json({ error: 'Invalid event payload' });
    }

    const correlationId = idempotencyKey || uuidv4();

    const event = {
        correlationId,
        eventType,
        userId,
        data,
        timestamp: new Date()
    };

    try {
        // await eventQueue.add(eventType, event, {
        //     attempts: 5,
        //     backoff: {
        //         type: 'exponential',
        //         delay: 1000
        //     }
        // });

        await Promise.all([
            emailQueue.add('send_email', event, {
                attempts: 5,
                backoff: { type: 'exponential', delay: 1000 }
            }),
            smsQueue.add('send_sms', event, {
                attempts: 5,
                backoff: { type: 'exponential', delay: 1000 }
            }),
            pushQueue.add('send_push', event, {
                attempts: 5,
                backoff: { type: 'exponential', delay: 1000 }
            })
        ]);

        await markEventProcessed(idempotencyKey);

        logger.info('Event ingested', {
            correlationId,
            eventType,
            userId
        });

        return res.status(202).json({
            message: 'Event accepted',
            correlationId: event.correlationId
        });

    } catch (err) {
        console.error('Queue error: ', err);
        return res.status(500).json({ error: 'Failed to enqueue event' });
    }
};


