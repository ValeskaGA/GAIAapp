
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeIntroScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#fbfaf7] dark:bg-background-dark font-display antialiased transition-colors duration-300 animate-sweep">
      {/* Top App Bar / Branding */}
      <div className="flex items-center p-4 pt-12 justify-center">
        <h2 className="text-[#141117] dark:text-white text-[13px] font-extrabold tracking-[0.25em] uppercase opacity-60">GAIA</h2>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center px-8 relative">
        {/* Abstract Background Decoration */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 -z-10 opacity-40 dark:opacity-10"
          style={{
            background: 'linear-gradient(135deg, rgba(140, 54, 226, 0.15) 0%, rgba(245, 245, 240, 0) 100%)',
            borderRadius: '60% 40% 70% 30% / 40% 50% 60% 50%'
          }}
        ></div>

        <div className="space-y-6 text-center">
          <h1 className="text-[#141117] dark:text-white tracking-tight text-[36px] font-extrabold leading-[1.15]">
            Hola. Este es un espacio para ti.
          </h1>

          <p className="text-[#4a454e] dark:text-[#c5c0c9] text-lg font-medium leading-relaxed px-2 opacity-90">
            GAIA no viene a decirte qué sentir ni a arreglarte la vida. Está aquí para acompañarte cuando la mente está cansada y ayudarte a ordenar un poco lo que llevas dentro.
          </p>
        </div>
      </div>

      {/* Footer Area */}
      <div className="pb-16 px-8 flex flex-col gap-8">
        {/* Page Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-2.5">
          <div className="h-1.5 w-7 rounded-full bg-primary"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/20 dark:bg-primary/40"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/20 dark:bg-primary/40"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/20 dark:bg-primary/40"></div>
        </div>

        {/* Action Button */}
        <div className="flex w-full">
          <button
            onClick={() => navigate('/ethics')}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-15 px-5 flex-1 bg-primary hover:bg-primary-dark text-white text-lg font-bold transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
          >
            <span className="truncate">Continuar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeIntroScreen;
