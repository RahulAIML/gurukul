import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthProvider';
import { fitnessQuestions } from '../features/onboarding/data/fitnessQuestions';
import { I18nProvider } from '../i18n';
import { Account } from '../pages/Account';
import { Analysis } from '../pages/Analysis';
import { AuthPage } from '../pages/AuthPage';
import { GymLanding } from '../pages/GymLanding';
import { GymOnboarding } from '../pages/GymOnboarding';
import { IllustrationReview } from '../pages/IllustrationReview';

/**
 * One parameterised onboarding route rather than thirteen hardcoded ones, so
 * adding a question needs no routing change.
 */
export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<GymLanding />} />
          <Route
            path="/gym/onboarding"
            element={<Navigate to={`/gym/onboarding/${fitnessQuestions[0].id}`} replace />}
          />
          <Route path="/gym/onboarding/analysis" element={<Analysis />} />
          <Route path="/gym/onboarding/:questionId" element={<GymOnboarding />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/reset-password" element={<AuthPage mode="reset" />} />
          <Route path="/account" element={<Navigate to="/account/profile" replace />} />
          <Route path="/account/:section" element={<Account />} />
          {/* design-review surface, not part of the funnel */}
          <Route path="/design/illustrations" element={<IllustrationReview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </I18nProvider>
  );
}
