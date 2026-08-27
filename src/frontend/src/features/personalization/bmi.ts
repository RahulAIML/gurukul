/**
 * BMI, and only BMI.
 *
 * Kept as a standalone pure function so the backend can recalculate it from
 * canonical height/weight and compare — a client-supplied BMI must never be
 * trusted as authoritative.
 */

export type BmiCategory = 'under' | 'healthy' | 'over' | 'high';

export interface BmiInput {
  heightCm: number;
  weightKg: number;
}

export interface BmiResult {
  value: number;
  category: BmiCategory;
}

/**
 * WHO adult cut-points. These describe populations, not individuals — see the
 * disclaimer rendered alongside every result. No diagnosis is implied and none
 * should be added here.
 */
const CUT_POINTS = { under: 18.5, healthy: 25, over: 30 } as const;

export function categoriseBmi(value: number): BmiCategory {
  if (value < CUT_POINTS.under) return 'under';
  if (value < CUT_POINTS.healthy) return 'healthy';
  if (value < CUT_POINTS.over) return 'over';
  return 'high';
}

/**
 * Returns `null` rather than NaN for unusable input, so an invalid measurement
 * can never reach the recommendation engine as a number.
 */
export function calculateBmi({ heightCm, weightKg }: BmiInput): BmiResult | null {
  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) return null;
  if (heightCm <= 0 || weightKg <= 0) return null;
  // Guard against transposed or nonsensical values reaching the formula.
  if (heightCm < 50 || heightCm > 300) return null;
  if (weightKg < 20 || weightKg > 400) return null;

  const metres = heightCm / 100;
  const raw = weightKg / (metres * metres);
  if (!Number.isFinite(raw)) return null;

  const value = Math.round(raw * 10) / 10;
  return { value, category: categoriseBmi(value) };
}
