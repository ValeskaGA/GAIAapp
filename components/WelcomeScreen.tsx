
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center pt-safe bg-sage-gradient dark:bg-background-dark overflow-hidden"
    >
      <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] bg-white/60 dark:bg-white/5 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] bg-primary/10 dark:bg-primary/5 rounded-full blur-[80px] pointer-events-none animate-breathe"></div>

      <div
        className="relative z-10 flex flex-col items-center justify-center text-center space-y-10 max-w-md w-full cursor-pointer"
        onClick={() => navigate('/intro')}
      >
        <div className="relative">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10 ring-1 ring-white/50">
            <span className="material-symbols-outlined text-5xl text-primary/80 dark:text-primary/90" style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}>spa</span>
          </div>
          <span className="absolute -top-2 -right-1 material-symbols-outlined text-2xl text-[#6B9080] dark:text-[#88AA99] animate-bounce" style={{ animationDuration: '3s', fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>

        <div className="space-y-5">
          <h1 className="text-[#1A332A] dark:text-[#E2ECE6] tracking-tight text-[32px] sm:text-[40px] font-extrabold leading-[1.15] drop-shadow-sm">
            Bienvenida/o<br />a tu espacio
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="h-1 w-12 bg-primary/20 rounded-full mb-2"></div>
            <h2 className="text-[#4A6359] dark:text-[#9FB3A8] text-lg font-medium leading-relaxed tracking-wide px-4">
              <span className="text-primary font-bold">GAIA</span> — Un espacio tranquilo para ordenar lo que pasa por dentro
            </h2>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center justify-center space-y-4 pb-safe">
        <div
          className="flex flex-col items-center opacity-60 animate-pulse cursor-pointer"
          onClick={() => navigate('/intro')}
        >
          <span className="text-xs font-semibold text-[#4A6359] dark:text-[#9FB3A8] tracking-[0.2em] uppercase">Toca para continuar</span>
          <span className="material-symbols-outlined text-[#4A6359] dark:text-[#9FB3A8] text-sm">keyboard_arrow_down</span>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="text-primary text-sm font-bold hover:underline py-2"
        >
          Ya tengo una cuenta
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
