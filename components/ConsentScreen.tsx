
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsent } from '../state/useConsent';

const ConsentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { autoSaveEnabled, setConsent, hasDecided, loading } = useConsent();

  /**
   * If the user already made a decision (stored in Supabase),
   * skip this screen and go straight to the next onboarding step.
   */
  useEffect(() => {
    if (!loading && hasDecided) {
      navigate('/safety', { replace: true });
    }
  }, [loading, hasDecided, navigate]);

  const handleToggle = () => {
    setConsent(autoSaveEnabled === null ? true : !autoSaveEnabled);
  };

  // ── Loading state: checking DB ───────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f3f2f8] dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
    );
  }

  // ── Already decided → redirecting (avoid flash) ──────────────────
  if (hasDecided) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-[#f3f2f8] dark:bg-background-dark p-6 pt-safe pb-safe">
      <div className="h-4 w-full"></div>
      <div className="flex justify-center mb-8">
        <div className="size-16 rounded-full bg-gaia-lavender-100 dark:bg-gaia-lavender-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[38px]">shield_with_heart</span>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-surface-dark backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/20">
        <h1 className="text-text-main dark:text-text-dark-main tracking-tight text-[32px] font-extrabold leading-tight text-center mb-6">
          Sobre tus conversaciones
        </h1>
        <div className="space-y-4 text-lg font-medium leading-relaxed text-[#4e4b52] dark:text-text-dark-secondary">
          <p>En GAIA puedes escribir libremente en el chat. Este espacio está pensado para expresarte sin presión.</p>
          <p>El chat no guarda todo lo que escribes. Si lo permites, GAIA puede identificar momentos importantes —como emociones o situaciones que se repiten— a medida que la conversación avanza, y guardar un breve resumen en tu historial.</p>
          <p>Esto es completamente opcional.</p>
          <p>Tu registro emocional se guarda por separado y no depende de esta decisión.</p>
          <p>Tu información se mantiene protegida y encriptada, y se utiliza únicamente para ayudarte a reconocer patrones y darte una mejor experiencia dentro de GAIA.</p>
          <p>Tus textos no se venden ni se comparten.</p>
        </div>

        <div className="mt-10 pt-8 border-t border-gaia-lavender-100 dark:border-white/5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[15px] font-semibold text-text-main dark:text-text-dark-main">Permitir que GAIA guarde momentos importantes en mi historial</span>
            <div
              className={`relative inline-block w-12 h-6 align-middle select-none transition-all duration-300 ease-in cursor-pointer rounded-full ${autoSaveEnabled === true ? 'shadow-[0_0_20px_rgba(167,139,250,0.8)]' : ''}`}
              onClick={handleToggle}
            >
              <div
                className={`block overflow-hidden h-6 rounded-full transition-colors duration-300 ${autoSaveEnabled === true ? 'bg-gaia-purple-vibrant' : 'bg-gaia-lavender-200'}`}
              >
                <div
                  className={`block w-6 h-6 rounded-full bg-white border-2 transition-all duration-300 ${autoSaveEnabled === true ? 'translate-x-6 border-gaia-purple-vibrant' : 'translate-x-0 border-gaia-lavender-100'}`}
                ></div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-center opacity-60 text-text-secondary dark:text-text-dark-secondary">Puedes cambiar esta decisión cuando quieras desde el menú.</p>
        </div>
      </div>

      <div className="mt-auto pt-12">
        <button
          onClick={async () => {
            // If user hasn't explicitly toggled, default to false (opted out)
            if (!hasDecided) {
              await setConsent(autoSaveEnabled ?? false);
            }
            navigate('/safety');
          }}
          disabled={loading}
          className={`w-full h-14 rounded-full text-white text-lg font-bold shadow-lg transition-all active:scale-[0.98] bg-gaia-purple-vibrant hover:brightness-110`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ConsentScreen;
