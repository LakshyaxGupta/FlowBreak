import {
  detectAttentionBreaks,
  calculateIdleTime,
  getDomainSummary
} from './attention.service.js';

import { secondsToMinutes } from '../utils/time.utils.js';

/**
 * Calculate focus score for a session
 * max_score = 100
 * penalty = (attention_breaks * 8) + (idle_minutes * 2)
 * focus_score = max(0, max_score - penalty)
 */
export function calculateFocusScore(events) {
  const maxScore = 100;
  
  const attentionBreaks = detectAttentionBreaks(events);
  const idleSeconds = calculateIdleTime(events);
  const idleMinutes = secondsToMinutes(idleSeconds);

  const domainSummary = getDomainSummary(events);

  const breakPenalty = Math.min(attentionBreaks.length * 5, 40);
  const idlePenalty = Math.min(idleMinutes * 0.5, 30);
  const distractingPenalty = Math.min(domainSummary.distracting * 2, 30);

  const penalty = breakPenalty + idlePenalty + distractingPenalty;

  const focusScore = Math.max(0, maxScore - penalty);

  return {
    score: Math.round(focusScore),
    maxScore,
    penalty,
    attentionBreaks: attentionBreaks.length,
    idleMinutes: Math.round(idleMinutes * 10) / 10,
    domainSummary,
    details: {
      attentionBreakPenalty: attentionBreaks.length * 8,
      idlePenalty: idleMinutes * 2,
      distractionPenalty: domainSummary.distracting * 3,
    },
  };
}

/**
 * Generate explanations for attention breaks
 */
export function generateExplanations(attentionBreaks) {
  return attentionBreaks.map(break_ => {
    let explanation = `Between the detected time window, `;

    if (break_.reason === 'High context switching') {
      const domains = break_.domains || [];
      explanation += `frequent switching between ${domains.join(', ')} caused loss of focus.`;
    } 
    else if (break_.reason === 'Navigation loop detected') {
      const domains = break_.domains || [];
      explanation += `repeated navigation between ${domains.join(' and ')} disrupted focus.`;
    } 
    else if (break_.reason === 'Attention idle spike') {
      const idleMinutes = Math.round((break_.idle_seconds || 0) / 60);
      explanation += `an idle period of ${idleMinutes} minutes indicated a loss of attention.`;
    }

    return {
      ...break_,
      explanation,
    };
  });
}


/**
 * Get comprehensive analytics for a session
 */
export function getSessionAnalytics(events) {
  const focusScore = calculateFocusScore(events);
  const attentionBreaks = detectAttentionBreaks(events);
  const explanations = generateExplanations(attentionBreaks);

  return {
    focusScore: focusScore.score,
    maxScore: focusScore.maxScore,
    penalty: focusScore.penalty,
    attentionBreaks: focusScore.attentionBreaks,
    idleMinutes: focusScore.idleMinutes,
    attentionBreakDetails: explanations,
    domainSummary: focusScore.domainSummary,
    totalEvents: events.length,
  };
}
