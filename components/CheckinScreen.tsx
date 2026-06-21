
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionEntry } from '../types';
import { analyzeMessage } from '../services/emotionalMomentDetector';

interface CheckinScreenProps {
  onSave: (entry: EmotionEntry) => void;
}

const CheckinScreen: React.FC<CheckinScreenProps> = ({ onSave }) => {
  const navigate = useNavigate();
  const [selectedMoodLabel, setSelectedMoodLabel] = useState('En calma');
  const [notes, setNotes] = useState('');

  // Custom moods state
  const [customMoods, setCustomMoods] = useState<string[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [tempCustomMood, setTempCustomMood] = useState('');

  const predefinedEmotions = [
    { icon: 'sentiment_satisfied', label: 'En calma', color: 'bg-purple-50 text-primary' },
    { icon: 'trending_down', label: 'Un poco bajo/a', color: 'bg-blue-50 text-blue-500' },
    { icon: 'bedtime', label: 'Cansado/a', color: 'bg-orange-50 text-orange-500' },
    { icon: 'air', label: 'Inquieto/a', color: 'bg-yellow-50 text-yellow-600' }
  ];

  const handleAddCustomMood = () => {
    const trimmed = tempCustomMood.trim();
    if (trimmed) {
      if (!customMoods.includes(trimmed)) {
        setCustomMoods([...customMoods, trimmed]);
      }
      setSelectedMoodLabel(trimmed);
      setTempCustomMood('');
      setIsAddingCustom(false);
    }
  };

  const handleSave = () => {
    // Find matching emotion to get icon and color, default to a neutral one for custom moods
    const matchedPredefined = predefinedEmotions.find(e => e.label === selectedMoodLabel);

    // Analizar las notas para extraer causa y consecuencia (lógica 'manual')
    const analysis = notes.trim() ? analyzeMessage(notes) : null;
    const detectedCause = analysis?.cause ?? null;
    const detectedConsequence = analysis?.consequence ?? null;

    const entry: EmotionEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + ' • ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMoodLabel,
      icon: matchedPredefined?.icon || 'mood',
      color: matchedPredefined?.color || 'bg-gaia-lavender-50 text-primary',
      text: notes || 'Sin notas adicionales.',
      timestamp: new Date(),
      cause: detectedCause,
      consequence: detectedConsequence,
      intensity: analysis?.intensity ?? 3,
      source: 'manual',
    };
    onSave(entry);
    navigate('/history');
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pt-safe pb-safe">
      <header className="flex items-center justify-between p-4 pt-2 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-text-dark-main"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Check-in</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-4 pb-24 overflow-y-auto no-scrollbar">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center size-12 mb-4 rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[28px]">self_improvement</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main dark:text-text-dark-main">¿Cómo te sientes ahora?</h1>
          <p className="mt-2 text-slate-500">Tómate un momento para conectar contigo.</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold mb-4 px-1 text-text-main dark:text-text-dark-main">Selecciona una emoción</label>

          {/* Main Emotions Grid */}
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Predefined emotions */}
            {predefinedEmotions.map((e, idx) => (
              <button
                key={`pre-${idx}`}
                onClick={() => setSelectedMoodLabel(e.label)}
                className={`flex h-12 items-center gap-x-2 rounded-full border-2 px-5 transition-all ${selectedMoodLabel === e.label
                  ? 'border-primary bg-primary text-white shadow-md'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-text-main dark:text-text-dark-main'
                  }`}
              >
                <span className="material-symbols-outlined">{e.icon}</span>
                <p className="text-sm font-bold">{e.label}</p>
              </button>
            ))}

            {/* Custom emotions already added */}
            {customMoods.map((mood, idx) => (
              <button
                key={`custom-${idx}`}
                onClick={() => setSelectedMoodLabel(mood)}
                className={`flex h-12 items-center gap-x-2 rounded-full border-2 px-5 transition-all ${selectedMoodLabel === mood
                  ? 'border-primary bg-primary text-white shadow-md'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-text-main dark:text-text-dark-main'
                  }`}
              >
                <span className="material-symbols-outlined">mood</span>
                <p className="text-sm font-bold">{mood}</p>
              </button>
            ))}
          </div>

          {/* Secondary Action Row: Centered "+" Button or Custom Input */}
          <div className="flex justify-center mt-6">
            {isAddingCustom ? (
              <div className="flex h-12 items-center gap-x-1 rounded-full border-2 border-primary bg-white dark:bg-surface-dark px-2 animate-sweep shadow-soft">
                <input
                  autoFocus
                  type="text"
                  className="bg-transparent border-0 focus:ring-0 text-sm font-bold text-text-main dark:text-text-dark-main w-48 px-2"
                  placeholder="Escribe tu propia emoción..."
                  value={tempCustomMood}
                  onChange={(e) => setTempCustomMood(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCustomMood();
                    if (e.key === 'Escape') setIsAddingCustom(false);
                  }}
                />
                <button
                  onClick={handleAddCustomMood}
                  className="flex size-8 items-center justify-center rounded-full bg-primary text-white hover:brightness-110"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                </button>
                <button
                  onClick={() => setIsAddingCustom(false)}
                  className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCustom(true)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-400 hover:text-primary hover:border-primary transition-colors shadow-sm"
                title="Agregar emoción personalizada"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2 px-1 text-text-main dark:text-text-dark-main">Notas (opcional)</label>
          <div className="relative">
            <textarea
              className="w-full h-40 rounded-2xl border-0 bg-white dark:bg-surface-dark p-4 shadow-sm focus:ring-primary/20 text-text-main dark:text-text-dark-main"
              placeholder="Escribe aquí si quieres profundizar en cómo te sientes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            <div className="absolute bottom-4 right-4 text-slate-400">
              <span className="material-symbols-outlined">edit</span>
            </div>
          </div>
        </div>
      </main>

      <div className="p-6 pb-8 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent max-w-md mx-auto w-full fixed bottom-0 left-0 right-0 pb-safe">
        <button
          onClick={handleSave}
          className="w-full h-14 rounded-full bg-primary text-white text-lg font-bold shadow-lg flex items-center justify-center gap-2 group hover:brightness-110 active:scale-95 transition-all"
        >
          <span>Guardar registro</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default CheckinScreen;
