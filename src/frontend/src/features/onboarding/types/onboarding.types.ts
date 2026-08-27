import type { TranslationKey } from '../../../i18n';
import type { IllustrationKey } from '../illustrations/registry';

/**
 * Onboarding question schema.
 *
 * The UI renders entirely from this shape — adding a question means appending
 * an object to `data/fitnessQuestions.ts`, never touching a component.
 *
 * Text lives in translation KEYS, never as literal strings, so a question is
 * translatable the moment it is defined.
 */

/** Logical grouping, used for the section label above each question and for
 *  grouping the analysis summary. */
export type QuestionSection =
  | 'profile'
  | 'goal'
  | 'experience'
  | 'environment'
  | 'equipment'
  | 'time'
  | 'preference'
  | 'motivation'
  | 'lifestyle'
  | 'measurements';

/**
 * `slider | text | date | boolean` are planned but deliberately unimplemented
 * until a question actually requires them.
 */
export type QuestionType = 'single' | 'multiple' | 'measure';

export interface QuestionOption {
  /** Stable enum-style id. This is what is stored and what the personalization
   *  engine matches on — never the display label. */
  id: string;
  labelKey: TranslationKey;
  descriptionKey?: TranslationKey;
  illustration: IllustrationKey;
  /** Multi-select only: choosing this clears every other selection. */
  exclusive?: boolean;
}

/** A selectable unit for a `measure` question. */
export interface MeasureUnit {
  id: string;
  labelKey: TranslationKey;
  /** Valid range IN THIS UNIT. */
  min: number;
  max: number;
  placeholder: string;
  /**
   * Converts a value in this unit to the question's canonical unit.
   * Identity for the canonical unit itself.
   */
  toCanonical: (value: number) => number;
  /** Inverse of `toCanonical`, so a stored canonical value can be redisplayed
   *  in whichever unit the user picked. */
  fromCanonical: (canonical: number) => number;
}

export interface MeasureConfig {
  /** Units the user can switch between. A single entry renders no toggle. */
  units: MeasureUnit[];
  /** The unit values are stored in, regardless of what the user typed. */
  canonicalUnit: 'years' | 'cm' | 'kg';
  /** Whole numbers only (age, cm, lb) versus one decimal (kg). */
  step?: number;
  /** Reject non-integers even if step allows them. */
  integerOnly?: boolean;
  /**
   * Composite input: height in ft+in needs two fields. When set, the unit
   * renders as two inputs and combines them via `toCanonical` on the total.
   */
  compositeUnitId?: string;
}

export interface Question {
  /** Stable id. Also the URL segment: /gym/onboarding/:id */
  id: string;
  section: QuestionSection;
  titleKey: TranslationKey;
  helperKey?: TranslationKey;
  type: QuestionType;
  /** Absent for `measure` questions, which render a field rather than choices. */
  options?: QuestionOption[];
  /** Multi-select only: how many picks before Continue enables. Defaults to 1. */
  minSelections?: number;
  /** Desktop column hint. Mobile is always a single column. */
  columns?: 2 | 3;
  /** Required when `type` is `measure`. */
  measure?: MeasureConfig;
  /**
   * Why this question exists. Not rendered — it is here so that every question
   * has to justify itself in review, per the brief's rule that a question
   * which does not improve personalization, safety or UX should be cut.
   */
  rationale: string;
}

/**
 * Answers are keyed by question id. Values are always `string[]` so single,
 * multiple and measure questions share one storage shape.
 *
 * For `measure` questions the array is `[canonicalValue, enteredUnitId]` —
 * the canonical value is what everything downstream reads, and the unit id is
 * kept only so the field can be redisplayed in the unit the user chose.
 */
export type AnswerMap = Record<string, string[]>;

export interface OnboardingSession {
  version: number;
  answers: AnswerMap;
  updatedAt: string;
  locale?: string;
}

/** Structured record of one answer, for analytics and future backend sync. */
export interface OnboardingResponse {
  questionId: string;
  section: QuestionSection;
  type: QuestionType;
  /** Option ids for choice questions; a single numeric string for measures. */
  value: string[];
  /** Present for measures only. */
  canonicalUnit?: string;
}
