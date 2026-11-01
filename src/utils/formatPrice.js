/**
 * NEXORA — Format Price Utility
 */

/**
 * Format a number as USD currency string
 * @param {number} amount
 * @param {string} currency
 */
export function formatPrice(amount, currency = 'USD') {
  if (typeof amount !== 'number' || isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a compact number (e.g. 1200 → 1.2K)
 * @param {number} n
 */
export function formatCompact(n) {
  if (typeof n !== 'number') return '—';
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n);
}

