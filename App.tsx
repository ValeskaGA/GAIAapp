
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import WelcomeIntroScreen from './components/WelcomeIntroScreen';
import SafetyLimitsScreen from './components/SafetyLimitsScreen';
import RhythmScreen from './components/RhythmScreen';
import SubscriptionScreen from './components/SubscriptionScreen';
import SubscriptionEndedScreen from './components/SubscriptionEndedScreen';
import EthicsScreen from './components/EthicsScreen';
import ConsentScreen from './components/ConsentScreen';
import ChatScreen from './components/ChatScreen';
import MenuScreen from './components/MenuScreen';
import CheckinScreen from './components/CheckinScreen';
import HistoryScreen from './components/HistoryScreen';
import InsightsScreen from './components/InsightsScreen';
import LoginScreen from './components/LoginScreen';
import { useHistory } from './state/useHistory';
import { useOnboarding } from './state/useOnboarding';
import { useAuth } from './state/AuthContext';

/**
 * ProtectedRoute validates BOTH:
 *  1. Supabase session (real authentication) — REQUIRED
 *  2. Onboarding completed (localStorage flag) — OR Supabase session exists
 *
 * Logic:
 *  - While loading the session → show nothing (prevent flash)
 *  - If no Supabase user → redirect to /login
 *  - If Supabase user exists → allow access (even without onboarding flag,
 *    because a returning user who logs in directly should not be forced
 *    through onboarding again)
 */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const { isOnboardingCompleted } = useOnboarding();

  // Still determining auth state — show a brief loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
    );
  }

  // No authenticated user → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated user → allow access
  return children;
};

const App: React.FC = () => {
  const { entries: history, addEntry, loadingHistory } = useHistory();

  return (
    <div className="max-w-md mx-auto h-full shadow-2xl relative overflow-hidden bg-background-light dark:bg-background-dark">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/intro" element={<WelcomeIntroScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/ethics" element={<EthicsScreen />} />
        <Route path="/consent" element={<ConsentScreen />} />
        <Route path="/safety" element={<SafetyLimitsScreen />} />
        <Route path="/rhythm" element={<RhythmScreen />} />
        <Route path="/chat" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
        <Route path="/subscription" element={<SubscriptionScreen />} />
        <Route path="/subscription-ended" element={<SubscriptionEndedScreen />} />
        <Route path="/menu" element={<ProtectedRoute><MenuScreen /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><CheckinScreen onSave={addEntry} /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryScreen entries={history} loading={loadingHistory} /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><InsightsScreen entries={history} /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
