/**
 * Money helpers. All server-side math is done in integer **cents** to avoid
 * floating-point drift; conversion to/from the DB's numeric(12,2) happens here.
 */

/** Parse a numeric/decimal DB value (string|number|null) into integer cents. */
export function toCents(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

/** Format integer cents as a fixed 2-dp string for DB numeric columns. */
export function centsToDecimalString(cents: number): string {
  return (Math.round(cents) / 100).toFixed(2);
}

/** Format integer cents as a major-unit number (for JSON responses). */
export function centsToMajor(cents: number): number {
  return Math.round(cents) / 100;
}
