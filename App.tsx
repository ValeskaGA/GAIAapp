
import React, { useEffect } from 'react';
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
import { emotionalMemoryService } from './services/emotionalMemoryService';

// Componente para proteger rutas que requieren onboarding completado
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isOnboardingCompleted } = useOnboarding();

  if (!isOnboardingCompleted) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App: React.FC = () => {
  const { entries: history, addEntry } = useHistory();

  // === PRUEBA TEMPORAL: verificar conexión Supabase ===
  // NOTA: Esta prueba requiere un user_id válido (UUID de auth.users).
  // Descomentar y reemplazar el UUID cuando se tenga un usuario autenticado.
  /*
  useEffect(() => {
    const testSupabase = async () => {
      console.log("🧪 Enviando registro de prueba a Supabase...");
      const result = await emotionalMemoryService.saveEntry({
        user_id: 'REEMPLAZAR-CON-UUID-REAL',
        emotion: 'calma',
        intensity: 5,
        place: 'prueba GAIA',
        cause: 'test sistema',
        consequence: null,
        note_brief: 'primera memoria emocional',
        source: 'chat',
      });
      if (result) {
        console.log("✅ Registro enviado exitosamente:", result);
      } else {
        console.log("❌ Error al enviar registro. Revisa la consola.");
      }
    };
    testSupabase();
  }, []);
  */
  // === FIN PRUEBA TEMPORAL ===


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
        <Route path="/history" element={<ProtectedRoute><HistoryScreen entries={history} /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><InsightsScreen entries={history} /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
