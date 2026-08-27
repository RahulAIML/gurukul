/**
 * SERVER-SIDE BMI. The client's value is never trusted.
 *
 * The frontend computes BMI for instant feedback, which makes it a display
 * value. This is the authoritative one, derived from canonical height and
 * weight, and it is what gets stored.
 */
export type BmiCategory = 'under' | 'healthy' | 'over' | 'high';

export interface BmiResult {
  value: number;
  category: BmiCategory;
}

export function categoriseBmi(value: number): BmiCategory {
  if (value < 18.5) return 'under';
  if (value < 25) return 'healthy';
  if (value < 30) return 'over';
  return 'high';
}

/** Returns null for unusable input — never NaN, never a guess. */
export function calculateBmi(heightCm: number, weightKg: number): BmiResult | null {
  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) return null;
  if (heightCm < 50 || heightCm > 300) return null;
  if (weightKg < 20 || weightKg > 400) return null;
  const m = heightCm / 100;
  const raw = weightKg / (m * m);
  if (!Number.isFinite(raw)) return null;
  const value = Math.round(raw * 10) / 10;
  return { value, category: categoriseBmi(value) };
}
