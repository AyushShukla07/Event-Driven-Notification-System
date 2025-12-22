import express from 'express';
import { retryFailedNotification } from '../controllers/admin.controllers.js';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/retry', authMiddleware, requireAdmin, retryFailedNotification);

export default router;