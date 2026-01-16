import { timeDifferenceInSeconds } from '../utils/time.utils.js';

/**
 * Detect attention breaks in a session
 * Returns array of attention break objects with reason and time range
 */
export function detectAttentionBreaks(events) {
  if (!events || events.length === 0) return [];

  const attentionBreaks = [];
  const tabSwitchEvents = events.filter(e =>
    e.event_type?.toLowerCase() === 'tab_switch' ||
    e.event_type?.toLowerCase() === 'navigation'
  );

  // Rule 0: Immediate rapid switch (<= 5 seconds)
  for (let i = 1; i < tabSwitchEvents.length; i++) {
    const prev = tabSwitchEvents[i - 1];
    const curr = tabSwitchEvents[i];

    const diff = timeDifferenceInSeconds(prev.timestamp, curr.timestamp);

    if (diff <= 5) {
      attentionBreaks.push({
        start_time: prev.timestamp,
        end_time: curr.timestamp,
        reason: "Rapid tab switch",
        domains: [prev.domain, curr.domain].filter(Boolean),
      });
    }
  }


  // Rule 1: Rapid Context Switching
  // Check for 5+ tab switches in last 60 seconds
  for (let i = 0; i < tabSwitchEvents.length; i++) {
    const currentEvent = tabSwitchEvents[i];
    const windowStart = new Date(currentEvent.timestamp);
    windowStart.setSeconds(windowStart.getSeconds() - 60);

    const switchesInWindow = tabSwitchEvents.filter(e => {
      const eventTime = new Date(e.timestamp);
      return eventTime >= windowStart && eventTime <= new Date(currentEvent.timestamp);
    });

    if (switchesInWindow.length >= 5) {
      // Check if we already detected this break
      const existingBreak = attentionBreaks.find(
        ab => ab.start_time === switchesInWindow[0].timestamp &&
              ab.reason === 'High context switching'
      );

      if (!existingBreak) {
        attentionBreaks.push({
          start_time: switchesInWindow[0].timestamp,
          end_time: currentEvent.timestamp,
          reason: 'High context switching',
          domains: [...new Set(switchesInWindow.map(e => e.domain).filter(Boolean))],
        });
      }
    }
  }

  // Rule 2: Domain Loop Detection
  // Check for navigation loops (same 2 domains repeatedly)
  for (let i = 4; i < tabSwitchEvents.length; i++) {
    const last5Domains = tabSwitchEvents
      .slice(i - 4, i + 1)
      .map(e => e.domain)
      .filter(Boolean);

    const uniqueDomains = new Set(last5Domains);

    if (uniqueDomains.size <= 2 && last5Domains.length === 5) {
      // Check if we already detected this break
      const existingBreak = attentionBreaks.find(
        ab => ab.start_time === tabSwitchEvents[i - 4].timestamp &&
              ab.reason === 'Navigation loop detected'
      );

      if (!existingBreak) {
        attentionBreaks.push({
          start_time: tabSwitchEvents[i - 4].timestamp,
          end_time: tabSwitchEvents[i].timestamp,
          reason: 'Navigation loop detected',
          domains: Array.from(uniqueDomains),
        });
      }
    }
  }

  // Rule 3: Idle Spike Detection
  // Check for gaps > 120 seconds between events
  for (let i = 1; i < events.length; i++) {
    const prevEvent = events[i - 1];
    const currentEvent = events[i];
    
    const gapSeconds = timeDifferenceInSeconds(prevEvent.timestamp, currentEvent.timestamp);

    if (gapSeconds > 120) {
      // Check if we already detected this break
      const existingBreak = attentionBreaks.find(
        ab => ab.start_time === prevEvent.timestamp &&
              ab.reason === 'Attention idle spike'
      );

      if (!existingBreak) {
        attentionBreaks.push({
          start_time: prevEvent.timestamp,
          end_time: currentEvent.timestamp,
          reason: 'Attention idle spike',
          idle_seconds: gapSeconds,
        });
      }
    }
  }

  // Sort breaks by start time
  return attentionBreaks.sort((a, b) => 
    new Date(a.start_time) - new Date(b.start_time)
  );
}

/**
 * Calculate total idle time in a session
 */
export function calculateIdleTime(events) {
  if (!events || events.length < 2) return 0;

  let totalIdleSeconds = 0;

  for (let i = 1; i < events.length; i++) {
    const prevEvent = events[i - 1];
    const currentEvent = events[i];
    
    const gapSeconds = timeDifferenceInSeconds(prevEvent.timestamp, currentEvent.timestamp);
    
    // Count gaps > 30 seconds as idle time
    if (gapSeconds > 30) {
      totalIdleSeconds += gapSeconds - 30; // Subtract 30s threshold
    }
  }

  return totalIdleSeconds;
}

const DOMAIN_LABELS = {
  productive: [
    "github.com",
    "stackoverflow.com",
    "localhost"
  ],
  neutral: [
    "chatgpt.com",
    "newtab"
  ],
  distracting: [
    "youtube.com"
  ]
};

export function classifyDomain(domain) {
  if (!domain) return "neutral";

  if (DOMAIN_LABELS.productive.includes(domain)) return "productive";
  if (DOMAIN_LABELS.distracting.includes(domain)) return "distracting";

  return "neutral";
}

export function getDomainSummary(events) {
  const summary = {
    productive: 0,
    neutral: 0,
    distracting: 0,
  };

  for (const event of events) {
    const label = classifyDomain(event.domain);
    summary[label]++;
  }

  return summary;
}

