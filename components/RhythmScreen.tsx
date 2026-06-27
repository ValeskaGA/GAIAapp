
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../state/useOnboarding';

const RhythmScreen: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();

  const handleStart = () => {
    completeOnboarding();
    navigate('/chat');
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-[#141117] dark:text-white transition-colors duration-300 animate-sweep font-display pt-safe pb-safe">
      {/* Top Header */}
      <div className="flex items-center p-6 pt-6 justify-center">
        <h2 className="text-[#141117] dark:text-white text-lg font-extrabold tracking-tight">Tu Ritmo</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 relative">
        {/* Breathing Orb Visualization */}
        <div className="flex w-full p-4 mb-8 items-center justify-center relative">
          <div className="absolute w-[80%] h-[80%] bg-primary/20 rounded-full animate-glow-slow blur-[60px]"></div>
          <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center">
            <div className="w-full h-full rounded-full organic-gradient animate-breathe shadow-[0_0_50px_rgba(140,54,226,0.15)] opacity-90 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
            </div>
            <div className="absolute w-1/3 h-1/3 bg-white/40 dark:bg-lavender-muted/20 blur-2xl rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-primary tracking-tight text-3xl sm:text-[40px] font-extrabold leading-tight">
            No hay una forma correcta
          </h1>
          <p className="text-[#4e4b52] dark:text-gray-300 text-lg font-medium leading-relaxed">
            Puedes escribir mucho o poco. Usarla todos los días o solo cuando lo necesites. GAIA no se enoja si desapareces. Aquí estará cuando vuelvas.
          </p>
        </div>

        {/* Page Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-10">
          <div className="h-2 w-2 rounded-full bg-primary/20"></div>
          <div className="h-2 w-2 rounded-full bg-primary/20"></div>
          <div className="h-2 w-10 rounded-full bg-primary"></div>
        </div>
      </div>

      <div className="p-8 pb-12">
        <button
          onClick={handleStart}
          className="w-full py-5 px-6 bg-lavender-muted dark:bg-primary/30 text-primary dark:text-white font-extrabold rounded-full text-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Empezar
        </button>
      </div>
    </div>
  );
};

export default RhythmScreen;
