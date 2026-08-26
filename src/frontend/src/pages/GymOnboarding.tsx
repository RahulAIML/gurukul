import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { OnboardingLayout } from '../features/onboarding/components/OnboardingLayout';
import { PreparingScreen } from '../features/onboarding/components/PreparingScreen';
import { QuestionCard } from '../features/onboarding/components/QuestionCard';
import {
  PREPARING_STEP,
  fitnessQuestions,
  getQuestionById,
  getQuestionIndex,
} from '../features/onboarding/data/fitnessQuestions';
import { useFitnessOnboarding } from '../features/onboarding/hooks/useFitnessOnboarding';
import { useReducedMotion } from '../features/onboarding/hooks/useReducedMotion';

/** Beat between selecting a single-choice option and advancing, so the user
 *  sees the selection land before the screen changes. */
const AUTO_ADVANCE_MS = 260;

export function GymOnboarding() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const {
    answers,
    setAnswer,
    toggleAnswer,
    reset,
    canVisit,
    firstUnansweredId,
    total,
  } = useFitnessOnboarding();

  const [direction, setDirection] = useState<1 | -1>(1);
  const advanceTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    },
    [],
  );

  const goTo = useCallback(
    (id: string, dir: 1 | -1) => {
      setDirection(dir);
      navigate(`/gym/onboarding/${id}`);
    },
    [navigate],
  );

  const advanceFrom = useCallback(
    (index: number) => {
      const next = fitnessQuestions[index + 1];
      goTo(next ? next.id : PREPARING_STEP, 1);
    },
    [goTo],
  );

  /* ── terminal step ── */
  if (questionId === PREPARING_STEP) {
    return (
      <OnboardingLayout>
        <PreparingScreen
          onRestart={() => {
            reset();
            navigate('/gym/onboarding/' + fitnessQuestions[0].id);
          }}
        />
      </OnboardingLayout>
    );
  }

  const question = questionId ? getQuestionById(questionId) : undefined;

  // Unknown id, or a deep link that skips ahead of unanswered questions.
  if (!question || !canVisit(question.id)) {
    return <Navigate to={`/gym/onboarding/${firstUnansweredId ?? fitnessQuestions[0].id}`} replace />;
  }

  const index = getQuestionIndex(question.id);
  const selectedIds = answers[question.id] ?? [];

  const handleSelect = (optionId: string) => {
    if (question.type === 'multiple') {
      toggleAnswer(question, optionId);
      return;
    }

    setAnswer(question.id, [optionId]);

    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(
      () => advanceFrom(index),
      reduced ? 0 : AUTO_ADVANCE_MS,
    );
  };

  return (
    <OnboardingLayout
      step={index + 1}
      total={total}
      onBack={
        index === 0
          ? () => navigate('/')
          : () => goTo(fitnessQuestions[index - 1].id, -1)
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <QuestionCard
          key={question.id}
          question={question}
          selectedIds={selectedIds}
          stepIndex={index}
          total={total}
          direction={direction}
          onSelect={handleSelect}
          onMeasureChange={(next) => setAnswer(question.id, next)}
          onContinue={() => advanceFrom(index)}
        />
      </AnimatePresence>
    </OnboardingLayout>
  );
}
