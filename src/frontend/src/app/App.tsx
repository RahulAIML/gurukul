import { Navigate, Route, Routes } from 'react-router-dom';
import { GymLanding } from '../pages/GymLanding';
import { GymOnboarding } from '../pages/GymOnboarding';
import { IllustrationReview } from '../pages/IllustrationReview';
import { fitnessQuestions } from '../features/onboarding/data/fitnessQuestions';

/**
 * One parameterised onboarding route rather than five hardcoded ones, so
 * adding a question needs no routing change.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GymLanding />} />
      <Route path="/gym/onboarding" element={<Navigate to={`/gym/onboarding/${fitnessQuestions[0].id}`} replace />} />
      <Route path="/gym/onboarding/:questionId" element={<GymOnboarding />} />
      {/* design-review surface, not part of the funnel */}
      <Route path="/design/illustrations" element={<IllustrationReview />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
