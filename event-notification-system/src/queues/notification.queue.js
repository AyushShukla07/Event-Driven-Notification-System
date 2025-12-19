import { Queue } from "bullmq";
import redis from "../config/redis";

export const emailQueue = new Queue('email', { connection: redis });
export const smsQueue = new Queue('sms', { connection: redis });
export const pushQueue = new Queue('push', { connection: redis });