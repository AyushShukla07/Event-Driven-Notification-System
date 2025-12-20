import express from 'express';
import { ingestEvent } from '../controllers/event.controllers.js';
import { rateLimiter } from '../middlewares/rateLimit.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/events', auth, rateLimiter, ingestEvent);

export default router;