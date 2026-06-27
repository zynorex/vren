/**
 * VREN — Shared Utility Functions
 * Pure functions. No external dependencies. Works in browser and Node.
 */

/** Truncate an EVM address: 0xABCD...1234 */
export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address || address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/** Format a USDC amount stored as 6-decimal integer string → human-readable "$X.XX" */
export function formatUSDC(amount: string | number | bigint): string {
  const num = Number(amount) / 1_000_000;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/** Parse a human-readable USDC price (e.g., "19.00" or 19) → 6-decimal integer string */
export function parseUSDC(amount: string | number): string {
  return String(Math.round(Number(amount) * 1_000_000));
}

/** Format a USD number to currency string (for computed values already in USD) */
export function formatUSD(amount: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/** Format plan duration (seconds) to human-readable label for pricing display */
export function getDurationLabel(seconds: number): string {
  const secsInDay = 24 * 3600;
  if (seconds <= secsInDay) return `/ day`;
  if (seconds === 7 * secsInDay) return `/ week`;
  if (seconds === 30 * secsInDay) return `/ month`;
  if (seconds === 90 * secsInDay) return `/ 3 months`;
  if (seconds === 180 * secsInDay) return `/ 6 months`;
  if (seconds === 365 * secsInDay) return `/ year`;
  const days = Math.round(seconds / secsInDay);
  const months = Math.round(days / 30);
  return months >= 1 ? `/ ${months} month${months > 1 ? "s" : ""}` : `/ ${days} days`;
}

/** Format a Date to "Oct 12, 2025" */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/** Format a Date to "Today, 14:32" or "Yesterday, 09:00" or "Oct 12, 14:32" */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const timeStr = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  return `${formatDate(d)}, ${timeStr}`;
}

/** Format a Date to relative time: "2 mins ago", "3 hours ago", "5 days ago" */
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return formatDate(d);
}

/**
 * Calculate Monthly Recurring Revenue from a list of active subscriptions.
 * @param subs - Array of { price: string (6-decimal USDC), duration: number (seconds) }
 * @returns MRR in USD
 */
export function calcMRR(subs: Array<{ price: string; duration: number }>): number {
  return subs.reduce((total, s) => {
    const priceUsd = Number(s.price) / 1_000_000;
    const monthlyFraction = (30 * 24 * 3600) / s.duration;
    return total + priceUsd * monthlyFraction;
  }, 0);
}

/** Format a percentage with sign: +14.2% or -3.1% */
export function formatDelta(value: number, decimals = 1): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/** Return growth rate as percentage: ((current - prev) / prev) * 100 */
export function growthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
