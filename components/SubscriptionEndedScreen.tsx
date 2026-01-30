
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionEndedScreen: React.FC = () => {
  const navigate = useNavigate();

  // Colores específicos para esta pantalla (Sage & Lavender vibe)
  const colors = {
    primary: '#60df20',
    background: '#fdfaf5',
    sage: '#e8f2e6',
    lavender: '#f3effa'
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#fdfaf5] dark:bg-[#162111] text-[#131711] dark:text-white transition-colors duration-300 animate-sweep font-display">
      {/* Top Navigation */}
      <div className="flex items-center px-6 pt-10 pb-4 justify-between w-full">
        <button 
          onClick={() => navigate('/chat')}
          className="text-[#131711] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-white/50 dark:bg-white/10 hover:bg-white transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-[#131711] dark:text-white text-lg font-extrabold tracking-[0.2em] flex-1 text-center pr-10">GAIA</h2>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 w-full px-6 flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
        {/* Header Illustration (Abstract and Calm) */}
        <div className="w-full aspect-square max-w-[260px] mb-8 relative">
          <div 
            className="absolute inset-0 rounded-full opacity-60"
            style={{ background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.lavender} 100%)` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-44 h-44 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-xl shadow-green-900/5">
              <span className="material-symbols-outlined text-[#60df20] !text-7xl animate-breathe" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#f3effa] rounded-full opacity-80 blur-sm"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-[#e8f2e6] rounded-full opacity-80 blur-sm"></div>
        </div>

        {/* Headline */}
        <h1 className="text-[#131711] dark:text-white tracking-tight text-3xl font-extrabold leading-tight text-center pb-4">
          Tu suscripción terminó
        </h1>

        {/* Reassuring Body Text */}
        <p className="text-[#131711]/70 dark:text-white/70 text-[16px] font-medium leading-relaxed text-center px-2 mb-8">
          Todo está bien. Puedes seguir usando GAIA en su versión gratuita para cuidar de tu mente. <span className="font-bold text-[#60df20]">Tus registros siguen siendo tuyos.</span> Nada se borra.
        </p>

        {/* Feature Continuity Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-10">
          <div className="flex flex-col gap-2 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 items-center text-center shadow-soft">
            <div className="text-[#60df20] p-2 bg-[#60df20]/10 rounded-full mb-1">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            </div>
            <h3 className="text-[#131711] dark:text-white text-xs font-bold leading-tight">Registros seguros</h3>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 items-center text-center shadow-soft">
            <div className="text-[#131711] dark:text-white p-2 bg-[#f3effa] rounded-full mb-1">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </div>
            <h3 className="text-[#131711] dark:text-white text-xs font-bold leading-tight">Diario básico</h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-3 mb-8">
          <button 
            onClick={() => navigate('/chat')}
            className="w-full py-4.5 px-6 rounded-full border-2 border-[#60df20]/20 bg-[#60df20]/10 text-[#131711] dark:text-white font-bold text-base hover:bg-[#60df20]/20 active:scale-[0.98] transition-all"
          >
            Seguir con versión gratuita
          </button>
          <button 
            onClick={() => navigate('/subscription')}
            className="w-full py-4.5 px-6 rounded-full border-2 border-[#60df20] bg-[#60df20] text-black font-extrabold text-base hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
          >
            <span className="material-symbols-outlined">bolt</span>
            Volver a premium
          </button>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="w-full px-6 pb-12 text-center mt-auto">
        <p className="text-[10px] text-[#131711]/40 dark:text-white/40 uppercase tracking-[0.25em] font-extrabold">
          GAIA · Siempre aquí para ti
        </p>
      </footer>
    </div>
  );
};

export default SubscriptionEndedScreen;
