import mongoose from 'mongoose';

const NotificationLogSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    eventType: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        enum: ["'email", 'sms', 'push'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    attempt: {
        type: Number,
        default: 0
    },
    error: {
        type: String,
        default: null
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('NotificationLog', NotificationLogSchema);