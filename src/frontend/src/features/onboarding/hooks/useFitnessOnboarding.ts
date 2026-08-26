import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { fitnessQuestions, getQuestionIndex } from '../data/fitnessQuestions';
import type { AnswerMap, Question } from '../types/onboarding.types';
import { clearAnswers, loadAnswers, saveAnswers } from '../utils/onboardingStorage';

type Action =
  | { type: 'set'; questionId: string; values: string[] }
  | { type: 'reset' };

function reducer(state: AnswerMap, action: Action): AnswerMap {
  switch (action.type) {
    case 'set':
      return { ...state, [action.questionId]: action.values };
    case 'reset':
      return {};
  }
}

/**
 * Single source of truth for the onboarding session.
 *
 * Deliberately a hook over useReducer + localStorage rather than a global
 * store: five questions of local, single-consumer state do not justify one.
 * If this grows (cross-feature reads, server sync), the internals can move to
 * Zustand behind this same signature.
 */
export function useFitnessOnboarding() {
  const [answers, dispatch] = useReducer(reducer, undefined, loadAnswers);

  useEffect(() => {
    saveAnswers(answers);
  }, [answers]);

  const setAnswer = useCallback((questionId: string, values: string[]) => {
    dispatch({ type: 'set', questionId, values });
  }, []);

  const reset = useCallback(() => {
    clearAnswers();
    dispatch({ type: 'reset' });
  }, []);

  /**
   * Toggle one option for a multi-select question, honouring `exclusive`
   * options (which clear everything else, and are cleared by anything else).
   */
  const toggleAnswer = useCallback(
    (question: Question, optionId: string) => {
      const current = answers[question.id] ?? [];
      const options = question.options ?? [];
      const option = options.find((o) => o.id === optionId);
      const isSelected = current.includes(optionId);

      if (isSelected) {
        dispatch({ type: 'set', questionId: question.id, values: current.filter((v) => v !== optionId) });
        return;
      }

      if (option?.exclusive) {
        dispatch({ type: 'set', questionId: question.id, values: [optionId] });
        return;
      }

      // Adding a normal option drops any exclusive ones already chosen.
      const exclusiveIds = new Set(options.filter((o) => o.exclusive).map((o) => o.id));
      const kept = current.filter((v) => !exclusiveIds.has(v));
      dispatch({ type: 'set', questionId: question.id, values: [...kept, optionId] });
    },
    [answers],
  );

  const isAnswered = useCallback(
    (question: Question): boolean => {
      const value = answers[question.id] ?? [];

      if (question.type === 'measure') {
        const raw = value[0];
        const unit =
          question.measure?.units.find((u) => u.id === value[1]) ?? question.measure?.units[0];
        const n = Number(raw);
        return (
          !!raw && !!unit && Number.isFinite(n) && n >= unit.min && n <= unit.max
        );
      }

      const min = question.type === 'multiple' ? (question.minSelections ?? 1) : 1;
      return value.length >= min;
    },
    [answers],
  );

  /** First question the user has not satisfactorily answered — where a bare
   *  /gym/onboarding or an out-of-order deep link should land them. */
  const firstUnansweredId = useMemo(() => {
    const next = fitnessQuestions.find((q) => !isAnswered(q));
    return next?.id ?? null;
  }, [isAnswered]);

  const answeredCount = useMemo(
    () => fitnessQuestions.filter((q) => isAnswered(q)).length,
    [isAnswered],
  );

  /**
   * A deep link is only allowed if every earlier question is answered —
   * otherwise the URL could be used to skip the flow.
   */
  const canVisit = useCallback(
    (questionId: string): boolean => {
      const index = getQuestionIndex(questionId);
      if (index < 0) return false;
      return fitnessQuestions.slice(0, index).every((q) => isAnswered(q));
    },
    [isAnswered],
  );

  return {
    answers,
    setAnswer,
    toggleAnswer,
    reset,
    isAnswered,
    canVisit,
    firstUnansweredId,
    answeredCount,
    total: fitnessQuestions.length,
  };
}
