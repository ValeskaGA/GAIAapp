
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsentScreen: React.FC = () => {
  const navigate = useNavigate();
  const [saveHistory, setSaveHistory] = useState<boolean | null>(null);

  const handleToggle = () => {
    setSaveHistory(prev => (prev === null ? true : !prev));
  };

  const isDecided = saveHistory !== null;

  return (
    <div className="flex flex-col h-full bg-[#f3f2f8] dark:bg-background-dark p-6">
      <div className="h-12 w-full"></div>
      <div className="flex justify-center mb-8">
        <div className="size-16 rounded-full bg-gaia-lavender-100 dark:bg-gaia-lavender-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-gaia-lavender-400 text-[32px]">shield_with_heart</span>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-surface-dark backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/20">
        <h1 className="text-2xl font-bold text-center mb-6 text-text-main dark:text-text-dark-main">Sobre guardar tus escritos</h1>
        <div className="space-y-4 text-[15px] leading-relaxed text-[#4a4a4e] dark:text-text-dark-secondary">
          <p>En GAIA puedes escribir libremente. Si quieres, puedes permitir que tus conversaciones se guarden como parte de tu historial personal.</p>
          <p>Esta opción es voluntaria. Tus textos no se venden ni se comparten.</p>
        </div>

        <div className="mt-10 pt-8 border-t border-gaia-lavender-100 dark:border-white/5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[15px] font-semibold text-text-main dark:text-text-dark-main">Guardar mis conversaciones en mi historial</span>
            <div
              className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in cursor-pointer"
              onClick={handleToggle}
            >
              <div
                className={`block overflow-hidden h-6 rounded-full transition-colors duration-300 ${saveHistory === true ? 'bg-gaia-lavender-400' : 'bg-gaia-lavender-200'}`}
              >
                <div
                  className={`block w-6 h-6 rounded-full bg-white border-2 transition-all duration-300 ${saveHistory === true ? 'translate-x-6 border-gaia-lavender-400' : 'translate-x-0 border-gaia-lavender-100'} ${saveHistory === true ? 'shadow-[0_0_10px_rgba(180,160,255,0.5)]' : ''}`}
                ></div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-center opacity-60 text-text-secondary dark:text-text-dark-secondary">Puedes cambiar esta decisión cuando quieras desde el menú.</p>
        </div>
      </div>

      <div className="mt-auto pt-12">
        <button
          onClick={() => isDecided && navigate('/safety')}
          disabled={!isDecided}
          className={`w-full h-14 rounded-full text-white text-lg font-bold shadow-lg transition-all active:scale-[0.98] ${isDecided
              ? 'bg-gaia-purple-vibrant hover:brightness-110'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            } ${saveHistory === true
              ? 'ring-4 ring-gaia-lavender-400/30 shadow-[0_0_25px_rgba(180,160,255,0.4)]'
              : ''
            }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ConsentScreen;
