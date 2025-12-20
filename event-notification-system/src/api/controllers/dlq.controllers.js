import { dlqQueue } from "../../queues/dlq.queue.js";

export const getDLQJobs = async (_, res) => {
    const jobs = await dlqQueue.getJobs(['waiting', 'failed']);
    res.json(jobs);
};