import express from 'express';
import { getDLQJobs } from '../controllers/dlq.controllers.js';

const router = express.Router();
router.get('/dlq', getDLQJobs);

export default router;