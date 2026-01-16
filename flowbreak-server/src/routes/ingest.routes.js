import express from 'express';
import { ingestEvents, endSession } from '../controllers/ingest.controller.js';

const router = express.Router();

router.post('/events', ingestEvents);
router.post('/sessions/:sessionId/end', endSession);

export default router;
