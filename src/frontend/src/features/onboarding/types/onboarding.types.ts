import type { IllustrationKey } from '../illustrations/registry';

/**
 * Onboarding question schema.
 *
 * The UI renders entirely from this shape — adding a question means appending
 * an object to `data/fitnessQuestions.ts`, never touching a component.
 */


/**
 * The types the questionnaire needs today.
 * `slider | text | date | boolean` are planned but deliberately unimplemented
 * until a question actually requires them.
 */
export type QuestionType = 'single' | 'multiple' | 'measure';

export interface QuestionOption {
  id: string;
  title: string;
  description: string;
  illustration: IllustrationKey;
  /** Multi-select only: choosing this clears every other selection. */
  exclusive?: boolean;
}

/** A selectable unit for a  question, with its own valid range. */
export interface MeasureUnit {
  id: string;
  /** Short suffix shown beside the field, e.g. "cm". */
  label: string;
  min: number;
  max: number;
  placeholder: string;
}

export interface MeasureConfig {
  /** Units the user can switch between. A single entry renders no toggle. */
  units: MeasureUnit[];
  /** Whole numbers only (age, cm, lb) versus one decimal (kg). */
  step?: number;
}

export interface Question {
  /** Also the URL segment: /gym/onboarding/:id */
  id: string;
  question: string;
  helper?: string;
  type: QuestionType;
  /** Absent for `measure` questions, which render a field rather than choices. */
  options?: QuestionOption[];
  /** Multi-select only: how many picks before Continue enables. Defaults to 1. */
  minSelections?: number;
  /** Desktop column hint. Mobile is always a single column. */
  columns?: 2 | 3;
  /** Required when `type` is `measure`. */
  measure?: MeasureConfig;
}

/** Answers are keyed by question id; values are arrays even for single-choice
 *  so that both question types share one storage shape. */
export type AnswerMap = Record<string, string[]>;

export interface OnboardingSession {
  version: number;
  answers: AnswerMap;
  updatedAt: string;
}
