
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionEntry } from '../types';

interface HistoryScreenProps {
  entries: EmotionEntry[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ entries = [] }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Todo');

  const filteredEntries = filter === 'Todo' 
    ? entries 
    : entries.filter(e => e.mood.includes(filter) || filter.includes(e.mood));

  return (
    <div className="flex flex-col h-full bg-beige-warm dark:bg-background-dark relative">
      <header className="sticky top-0 z-20 bg-beige-warm/95 dark:bg-background-dark/95 backdrop-blur-sm px-6 pt-12 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text-main dark:text-text-dark-main">Tu Diario</h1>
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm mt-1">Reflexiona sobre tus momentos pasados.</p>
          </div>
          
          <button 
            onClick={() => navigate('/menu')}
            className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-sm flex items-center justify-center text-primary dark:text-purple-300 hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['Todo', 'Feliz', 'Calma', 'Bajo/a', 'Cansado/a', 'Inquieto/a'].map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setFilter(cat)}
              className={`h-9 shrink-0 px-5 rounded-full text-sm font-semibold shadow-sm transition-all ${
                filter === cat 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary border border-transparent dark:border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>
      
      <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-32 no-scrollbar">
        {filteredEntries && filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-soft border border-transparent hover:border-primary/10 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${entry.color}`}>
                    <span className="material-symbols-outlined">{entry.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary">{entry.date}</span>
                    <span className="text-sm font-semibold text-text-main dark:text-text-dark-main">{entry.mood}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">more_horiz</span>
              </div>
              <p className="text-text-secondary dark:text-text-dark-secondary text-[15px] leading-relaxed line-clamp-2">
                {entry.text}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">history_edu</span>
            <p className="text-lg">No hay registros que coincidan</p>
          </div>
        )}
      </main>
      
      <button 
        onClick={() => navigate('/checkin')} 
        className="absolute bottom-28 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30"
      >
        <span className="material-symbols-outlined text-3xl">edit</span>
      </button>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-gray-100 dark:border-white/5 pb-6 pt-3 px-6 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate('/chat')} 
            className="flex flex-col items-center gap-1 w-16 text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">chat_bubble_outline</span>
            <span className="text-[10px] font-medium">Chat</span>
          </button>
          <button 
            onClick={() => navigate('/history')}
            className="flex flex-col items-center gap-1 w-16 text-primary"
          >
            <span className="material-symbols-outlined text-[28px] fill-current">history_edu</span>
            <span className="text-[10px] font-bold">Historial</span>
          </button>
          <button 
            onClick={() => navigate('/insights')}
            className="flex flex-col items-center gap-1 w-16 text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">insights</span>
            <span className="text-[10px] font-medium">Insights</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default HistoryScreen;
