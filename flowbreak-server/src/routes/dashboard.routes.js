import express from 'express';
import {
  getDashboardAnalytics,
  getSessionAnalyticsController,
} from '../controllers/analytics.controller.js';
import {
  analyzeSession,
  chatWithAgent,
} from '../controllers/agent.controller.js';

const router = express.Router();

router.get('/users/:email/analytics', getDashboardAnalytics);
router.get('/sessions/:sessionId/analytics', getSessionAnalyticsController);

// Agent endpoints
router.post('/agent/analyze/:sessionId', analyzeSession);
router.post('/agent/chat', chatWithAgent);

export default router;
