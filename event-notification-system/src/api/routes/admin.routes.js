import express from 'express';
import { retryFailedNotification } from '../controllers/admin.controllers.js';

const router = express.Router();

router.post('/retry', retryFailedNotification);

export default router;