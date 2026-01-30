
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { EmotionEntry } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<EmotionEntry[]>([
    { 
      id: '1',
      date: '24 Oct • 10:30 AM', 
      mood: 'Feliz', 
      icon: 'sentiment_satisfied', 
      color: 'bg-purple-100 text-primary', 
      text: 'Hoy tuve una conversación excelente con Sarah. Hablamos de todo y finalmente me sentí conectado...',
      timestamp: new Date(2024, 9, 24),
      intensity: 5
    },
    { 
      id: '2',
      date: '23 Oct • 8:15 PM', 
      mood: 'Cansado/a', 
      icon: 'bedtime', 
      color: 'bg-orange-100 text-orange-500', 
      text: 'Hoy fue un día largo en el trabajo. Me sentí abrumado con los plazos acumulándose...',
      timestamp: new Date(2024, 9, 23),
      intensity: 3
    },
    { 
      id: '3',
      date: '22 Oct • 6:00 PM', 
      mood: 'Calma', 
      icon: 'spa', 
      color: 'bg-indigo-100 text-indigo-500', 
      text: 'Una tarde tranquila leyendo. Hacía tiempo que no lograba apagar el ruido mental.',
      timestamp: new Date(2024, 9, 22),
      intensity: 4
    }
  ]);
  
  const addHistoryEntry = (entrada?: any) => {
    if (!entrada) return;

    const safeEntry: EmotionEntry = {
      id: entrada.id ?? String(Date.now()),
      date: entrada.date ?? new Date().toLocaleString(),
      mood: entrada.mood ?? 'Sin nombre',
      icon: entrada.icon ?? 'sentiment_neutral',
      color: entrada.color ?? 'bg-purple-100 text-primary',
      text: entrada.text ?? '',
      timestamp: entrada.timestamp ?? new Date(),
      intensity: entrada.intensity ?? 3,
    };

    setHistory((prev) => [safeEntry, ...prev]);
  };

  return (
    <div className="max-w-md mx-auto h-full shadow-2xl relative overflow-hidden bg-background-light dark:bg-background-dark">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/intro" element={<WelcomeIntroScreen />} />
        <Route path="/safety" element={<SafetyLimitsScreen />} />
        <Route path="/rhythm" element={<RhythmScreen />} />
        <Route path="/subscription" element={<SubscriptionScreen />} />
        <Route path="/subscription-ended" element={<SubscriptionEndedScreen />} />
        <Route path="/ethics" element={<EthicsScreen />} />
        <Route path="/consent" element={<ConsentScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/menu" element={<MenuScreen />} />
        <Route path="/checkin" element={<CheckinScreen onSave={addHistoryEntry} />} />
        <Route path="/history" element={<HistoryScreen entries={history} />} />
        <Route path="/insights" element={<InsightsScreen entries={history} />} />
      </Routes>
    </div>
  );
};

export default App;
