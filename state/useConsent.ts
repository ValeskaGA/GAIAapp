import { useState } from 'react';

const CONSENT_KEY = 'gaia_auto_save_consent';

/**
 * Hook para persistir la decisión de consentimiento de guardado automático.
 *
 * - null  = no ha decidido aún (primera visita)
 * - true  = permite guardado automático
 * - false = no permite, GAIA preguntará antes de guardar
 */
export const useConsent = () => {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean | null>(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === null) return null;
      return stored === 'true';
    } catch {
      return null;
    }
  });

  const setConsent = (value: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, String(value));
    } catch (error) {
      console.error('Failed to save consent state:', error);
    }
    setAutoSaveEnabled(value);
  };

  /** true si el usuario ya pasó por la pantalla de consentimiento */
  const hasDecided = autoSaveEnabled !== null;

  return { autoSaveEnabled, setConsent, hasDecided };
};
