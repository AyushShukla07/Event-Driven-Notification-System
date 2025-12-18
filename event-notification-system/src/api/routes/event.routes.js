import express from 'express';
import { ingestEvent } from '../controllers/event.controllers.js';
import { rateLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.post('/events', rateLimiter, ingestEvent);

export default router;