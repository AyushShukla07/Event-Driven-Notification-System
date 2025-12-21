import NotificationLog from "../../models/NotificationLog.js";

export const traceEvent = async (req, res) => {
    const { correlationId } = req.params;

    const logs = await NotificationLog.find({ correlationId });

    res.json({
        correlationId,
        logs
    });
};