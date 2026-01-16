/**
 * Convert seconds to minutes
 */
export function secondsToMinutes(seconds) {
  return Math.floor(seconds / 60);
}

/**
 * Format timestamp to readable string
 */
export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

/**
 * Calculate time difference in seconds
 */
export function timeDifferenceInSeconds(start, end) {
  return Math.floor((new Date(end) - new Date(start)) / 1000);
}

/**
 * Check if timestamp is within last N seconds
 */
export function isWithinLastSeconds(timestamp, seconds) {
  const now = new Date();
  const eventTime = new Date(timestamp);
  const diffSeconds = (now - eventTime) / 1000;
  return diffSeconds <= seconds;
}

/**
 * Get time range string for display
 */
export function getTimeRangeString(start, end) {
  const startTime = new Date(start).toLocaleTimeString();
  const endTime = new Date(end).toLocaleTimeString();
  return `${startTime} - ${endTime}`;
}
