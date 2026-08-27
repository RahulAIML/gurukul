import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { track } from '../features/analytics';
import { OnboardingLayout } from '../features/onboarding/components/OnboardingLayout';
import { QuestionCard } from '../features/onboarding/components/QuestionCard';
import {
  ANALYSIS_STEP,
  fitnessQuestions,
  getQuestionById,
  getQuestionIndex,
} from '../features/onboarding/data/fitnessQuestions';
import { useFitnessOnboarding } from '../features/onboarding/hooks/useFitnessOnboarding';
import { useReducedMotion } from '../features/onboarding/hooks/useReducedMotion';
import { useTranslation } from '../i18n';

/** Beat between selecting a single-choice option and advancing, so the user
 *  sees the selection land before the screen changes. */
const AUTO_ADVANCE_MS = 260;

export function GymOnboarding() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { locale } = useTranslation();
  const { answers, setAnswer, toggleAnswer, canVisit, firstUnansweredId, total } =
    useFitnessOnboarding();

  const [direction, setDirection] = useState<1 | -1>(1);
  const advanceTimer = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track({ name: 'onboarding_started', locale });
  }, [locale]);

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
      if (next) {
        goTo(next.id, 1);
      } else {
        track({ name: 'onboarding_completed', questionCount: fitnessQuestions.length });
        goTo(ANALYSIS_STEP, 1);
      }
    },
    [goTo],
  );

  const question = questionId ? getQuestionById(questionId) : undefined;

  // Unknown id, or a deep link that skips ahead of unanswered questions.
  const allowed = question ? canVisit(question.id) : false;

  useEffect(() => {
    if (question && allowed) {
      track({
        name: 'question_viewed',
        questionId: question.id,
        section: question.section,
        index: getQuestionIndex(question.id),
      });
    }
  }, [question, allowed]);

  if (!question || !allowed) {
    return (
      <Navigate
        to={`/gym/onboarding/${firstUnansweredId ?? fitnessQuestions[0].id}`}
        replace
      />
    );
  }

  const index = getQuestionIndex(question.id);
  const selectedIds = answers[question.id] ?? [];

  const handleSelect = (optionId: string) => {
    if (question.type === 'multiple') {
      toggleAnswer(question, optionId);
      track({
        name: 'question_answered',
        questionId: question.id,
        section: question.section,
        valueIds: [optionId],
      });
      return;
    }

    setAnswer(question.id, [optionId]);
    track({
      name: 'question_answered',
      questionId: question.id,
      section: question.section,
      valueIds: [optionId],
    });

    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(
      () => advanceFrom(index),
      reduced ? 0 : AUTO_ADVANCE_MS,
    );
  };

  const handleBack = () => {
    track({ name: 'question_back', questionId: question.id, fromIndex: index });
    if (index === 0) navigate('/');
    else goTo(fitnessQuestions[index - 1].id, -1);
  };

  return (
    <OnboardingLayout step={index + 1} total={total} onBack={handleBack}>
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
