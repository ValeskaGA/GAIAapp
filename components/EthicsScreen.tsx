
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EthicsScreen: React.FC = () => {
  const navigate = useNavigate();

  // Estados para controlar la visibilidad de las secciones
  const [isWhatIsExpanded, setIsWhatIsExpanded] = useState(true);
  const [isWhatIsNotExpanded, setIsWhatIsNotExpanded] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex-none p-4 pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-text-main dark:text-text-dark-main flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-text-main dark:text-text-dark-main text-lg font-bold flex-1 text-center pr-10">Ética y Límites</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24">
        <div className="pt-4 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>verified_user</span>
            </div>
            <span className="text-primary font-bold text-[11px] tracking-widest uppercase">Transparencia</span>
          </div>
          <h1 className="text-primary tracking-tight text-[32px] font-extrabold leading-tight mb-4">Tu espacio seguro comienza con confianza</h1>
          <p className="text-[#4e4b52] dark:text-text-dark-secondary text-lg font-medium leading-relaxed">Antes de comenzar tu viaje, queremos ser totalmente transparentes sobre cómo funciona GAIA.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Card 1: Qué es GAIA */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-soft border border-transparent dark:border-white/5 overflow-hidden transition-all duration-300">
            <button
              onClick={() => setIsWhatIsExpanded(!isWhatIsExpanded)}
              className="w-full flex cursor-pointer items-center gap-4 p-6 text-left focus:outline-none"
            >
              <div className="size-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>sentiment_satisfied</span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[17px] font-bold text-text-main dark:text-text-dark-main">Qué es GAIA</span>
              </div>
              <span className={`material-symbols-outlined text-text-secondary transition-transform duration-300 ${isWhatIsExpanded ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {isWhatIsExpanded && (
              <div className="px-6 pb-6 animate-sweep">
                <div className="text-[14px] leading-relaxed text-text-secondary dark:text-text-dark-secondary space-y-4 pr-2 pl-14">
                  <p>
                    GAIA es un diario emocional conversacional. Un espacio tranquilo y sin juicios para escribir, pensar y acompañarte en tu bienestar emocional cotidiano.
                  </p>
                  <p>
                    Puedes usar GAIA a tu ritmo: hablar por el chat, registrar cómo te sientes o simplemente estar un momento en silencio. Nada es obligatorio.
                  </p>
                  <p>
                    Si lo deseas, puedes permitir que tus conversaciones en el chat se guarden como parte de tu historial personal, para que puedas volver a ellas y ver tu propio recorrido emocional. Esta opción es voluntaria. Tú decides si se guarda o no.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Qué NO es GAIA */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-soft border border-transparent dark:border-white/5 overflow-hidden transition-all duration-300">
            <button
              onClick={() => setIsWhatIsNotExpanded(!isWhatIsNotExpanded)}
              className="w-full flex cursor-pointer items-center gap-4 p-6 text-left focus:outline-none"
            >
              <div className="size-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>medical_services</span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[17px] font-bold text-text-main dark:text-text-dark-main">Qué NO es GAIA</span>
              </div>
              <span className={`material-symbols-outlined text-text-secondary transition-transform duration-300 ${isWhatIsNotExpanded ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {isWhatIsNotExpanded && (
              <div className="px-6 pb-6 animate-sweep">
                <div className="text-[14px] leading-relaxed text-text-secondary dark:text-text-dark-secondary pr-2 pl-14">
                  <p>GAIA no es un sustituto de la terapia profesional ni un servicio de emergencias.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-black/5 max-w-md mx-auto translate-x-0 sm:left-1/2 sm:-translate-x-1/2">
        <button
          onClick={() => navigate('/consent')}
          className="w-full flex items-center justify-center rounded-2xl h-14 bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg active:scale-[0.98] gap-3"
        >
          <span className="text-[15px]">He leído y comprendo los límites</span>
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>check_circle</span>
        </button>
      </div>
    </div>
  );
};

export default EthicsScreen;
