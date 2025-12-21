import express from 'express';
import { traceEvent } from '../controllers/debug.controller.js';

const router = express.Router();

router.get('/trace/:correlationId', traceEvent);

export default router;