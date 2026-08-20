/**
 * Centralized formatting utilities with strict null/missing-data safety.
 * When data is null, undefined, or NaN, formatters return a specified fallback (default: "N/A").
 */

export function formatCurrency(
  val: number | null | undefined,
  fallback: string = 'N/A'
): string {
  if (val === null || val === undefined || isNaN(val)) {
    return fallback;
  }
  return new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 0,
  }).format(val) + ' میلیون ریال';
}

export function formatPercent(
  val: number | null | undefined,
  fallback: string = 'N/A'
): string {
  if (val === null || val === undefined || isNaN(val)) {
    return fallback;
  }
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

export function formatNumber(
  val: number | null | undefined,
  fallback: string = 'N/A'
): string {
  if (val === null || val === undefined || isNaN(val)) {
    return fallback;
  }
  return new Intl.NumberFormat('fa-IR').format(val);
}

export function formatRials(
  amount: number | null | undefined,
  fallback: string = 'N/A'
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return fallback;
  }
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2)} میلیارد ریال`;
  }
  if (abs >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)} میلیون ریال`;
  }
  return `${amount.toLocaleString('fa-IR')} ریال`;
}

export function formatDays(
  val: number | null | undefined,
  fallback: string = 'N/A'
): string {
  if (val === null || val === undefined || isNaN(val)) {
    return fallback;
  }
  return `${val} روز`;
}
