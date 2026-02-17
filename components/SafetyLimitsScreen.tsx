
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SafetyLimitsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-[#141117] dark:text-white transition-colors duration-300 animate-sweep pt-safe pb-safe">
      {/* TopAppBar / Progress */}
      <div className="flex items-center justify-between p-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-primary/10 transition-colors text-text-main dark:text-text-dark-main"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <div className="flex-1 px-4">
          <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/3 rounded-full transition-all duration-500"></div>
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="relative w-full aspect-square flex items-center justify-center mb-8">
          {/* Abstract "Safe Space" Illustration */}
          <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-full animate-pulse"></div>
          <div className="relative z-10 w-48 h-48 flex items-center justify-center bg-white dark:bg-surface-dark rounded-xl shadow-xl shadow-primary/5 border border-primary/10">
            <span className="material-symbols-outlined text-primary text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
          </div>
          {/* Floating decorative circles */}
          <div className="absolute top-10 right-10 w-4 h-4 bg-primary/30 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-6 h-6 bg-primary/20 rounded-full"></div>
        </div>

        <div className="space-y-4">
          <h1 className="text-primary tracking-tight text-3xl sm:text-[40px] font-extrabold leading-tight">
            Antes de seguir
          </h1>
          <div className="space-y-4">
            <p className="text-[#4e4b52] dark:text-white/70 text-lg font-medium leading-relaxed">
              GAIA no es terapia y no reemplaza ayuda profesional. No diagnostica, no etiqueta, no promete resultados rápidos.
            </p>
            <p className="text-[#4e4b52] dark:text-white/70 text-lg font-medium leading-relaxed">
              Es solo un <span className="text-primary font-bold">espacio seguro</span> para registrar lo que sientes y mirarte con más claridad.
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Navigation */}
      <div className="px-8 pb-12 pt-6">
        {/* PageIndicators */}
        <div className="flex w-full flex-row items-center justify-center gap-2 mb-10">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/20"></div>
          <div className="h-1.5 w-4 rounded-full bg-primary"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/20"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/20"></div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/rhythm')}
          className="w-full bg-primary text-white text-lg font-bold py-5 rounded-full shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Entiendo
        </button>
        <button
          onClick={() => navigate('/ethics')}
          className="w-full mt-4 text-[#141117]/50 dark:text-white/40 text-sm font-bold hover:text-primary transition-colors"
        >
          Más información sobre seguridad
        </button>
      </div>

      {/* Visual texture */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default SafetyLimitsScreen;
