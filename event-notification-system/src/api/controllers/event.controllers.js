import { eventQueue } from "../../queues/queue.connection.js";
import { isDuplicateEvent, markEventProcessed } from "../../utils/idempotency.js";
import { v4 as uuidv4 } from 'uuid';

export const ingestEvent = async (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
        return res.status(400).json({ error: 'Idempotency-Key required' });
    }

    if (await isDuplicateEvent(idempotencyKey)) {
        return res.status(409).json({ error: 'Duplicate event' });
    }

    const { eventType, userId, data } = req.body;

    if (!eventType || !userId || !data) {
        return res.status(400).json({ error: 'Invalid event payload' });
    }

    const event = {
        eventId: idempotencyKey || uuidv4(),
        eventType,
        userId,
        data,
        timestamp: new Date()
    };

    try {
        await eventQueue.add(eventType, event, {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });
        await markEventProcessed(idempotencyKey);

        return res.status(202).json({
            message: 'Event accepted',
            eventId: event.eventId
        });
    } catch (err) {
        console.error('Queue error: ', err);
        return res.status(500).json({ error: 'Failed to enqueue event' });
    }
};
