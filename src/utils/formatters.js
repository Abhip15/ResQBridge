/**
 * Format a number with leading zero for time display.
 * @param {number} n
 * @returns {string}
 */
export function padTime(n) {
  return String(n).padStart(2, '0');
}

/**
 * Convert a decimal confidence score to percentage string.
 * @param {number} score - 0 to 1
 * @returns {string} e.g. "91%"
 */
export function formatConfidence(score) {
  return `${Math.round(score * 100)}%`;
}

/**
 * Calculate SVG circle dashoffset for a given progress percentage.
 * @param {number} percentage - 0 to 100
 * @param {number} circumference - Circle circumference (2πr)
 * @returns {number}
 */
export function calculateDashOffset(percentage, circumference) {
  return circumference - (percentage / 100) * circumference;
}
