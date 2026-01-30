
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#fdfbf7] dark:bg-background-dark text-[#141117] dark:text-white transition-colors duration-300 animate-sweep font-display">
      {/* Top Navigation */}
      <div className="flex items-center p-4 pt-10 justify-between">
        <button 
          onClick={() => navigate('/ethics')}
          className="text-[#141117] dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="text-[#8c36e2] font-extrabold text-lg tracking-widest">GAIA</div>
        <div className="size-12"></div>
      </div>

      <main className="flex-1 flex flex-col px-6 pb-12 w-full overflow-y-auto no-scrollbar">
        {/* Header Section */}
        <div className="pt-6 pb-4">
          <h1 className="text-[#141117] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight text-left">
            GAIA puede acompañarte un poco más
          </h1>
        </div>

        {/* Body Text */}
        <div className="pb-6">
          <p className="text-[#141117]/80 dark:text-white/80 text-lg font-medium leading-relaxed">
            Queremos apoyarte en tu camino hacia el bienestar con herramientas diseñadas para profundizar en tu autoconocimiento.
          </p>
        </div>

        {/* Illustration Area */}
        <div className="w-full h-44 mb-8 rounded-[2rem] bg-gradient-to-br from-[#8c36e2]/10 to-[#8c36e2]/30 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          <span className="material-symbols-outlined text-[#8c36e2] text-7xl opacity-50 animate-breathe">spa</span>
          {/* Decorative shapes */}
          <div className="absolute -top-4 -right-4 size-20 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-primary/20 blur-xl"></div>
        </div>

        {/* Checklist Section */}
        <div className="space-y-1 mb-8">
          {[
            { icon: 'insights', text: 'Patrones detallados de tu estado de ánimo' },
            { icon: 'auto_awesome', text: 'Resúmenes suaves de tus semanas' },
            { icon: 'palette', text: 'Personalización profunda de tu espacio' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-x-4 py-4 border-b border-[#e0dce5]/40 dark:border-white/10 last:border-0">
              <div className="bg-[#8c36e2]/10 dark:bg-[#8c36e2]/20 p-2.5 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[#8c36e2] text-[22px]">{item.icon}</span>
              </div>
              <p className="text-[#141117] dark:text-white text-[15px] font-bold leading-tight">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Privacy Panel */}
        <div className="mb-10">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-[#e0dce5] dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-soft">
            <div className="flex flex-col gap-2">
              <p className="text-[#141117] dark:text-white text-base font-extrabold leading-tight">Tu bienestar es lo primero</p>
              <p className="text-[#756487] dark:text-white/60 text-[13px] font-medium leading-relaxed">
                La versión gratuita siempre será suficiente para tu diario. Tus datos están protegidos y nunca serán vendidos.
              </p>
            </div>
            <button className="text-xs font-extrabold leading-normal tracking-wide flex items-center gap-1 text-[#8c36e2] hover:underline">
              Más sobre nuestra privacidad
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
          <button 
            onClick={() => navigate('/ethics')}
            className="w-full bg-[#8c36e2]/10 border-2 border-[#8c36e2] text-[#8c36e2] font-extrabold py-4 px-6 rounded-full hover:bg-[#8c36e2]/20 active:scale-[0.98] transition-all text-center text-base"
          >
            Probar versión premium
          </button>
          <button 
            onClick={() => navigate('/ethics')}
            className="w-full bg-transparent border-2 border-[#e0dce5] dark:border-white/20 text-[#141117] dark:text-white font-extrabold py-4 px-6 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all text-center text-base"
          >
            Seguir con versión gratuita
          </button>
        </div>
        <div className="h-6 shrink-0"></div>
      </main>
    </div>
  );
};

export default SubscriptionScreen;
