import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchAutoSavePreference,
  saveAutoSavePreference,
} from '../services/userPreferencesService';

const LOCAL_CONSENT_KEY = 'gaia_auto_save_consent';

/**
 * Hook para persistir la decisión de consentimiento de guardado automático.
 *
 * Prioridad de persistencia:
 *   1. Supabase (fuente de verdad cuando hay sesión activa)
 *   2. localStorage (caché local / fallback sin sesión)
 *
 * Valores de autoSaveEnabled:
 *   - null  → no ha decidido aún (primera visita)
 *   - true  → permite guardado automático
 *   - false → no permite; GAIA preguntará antes de guardar
 *
 * Valores de loading:
 *   - true  → todavía verificando en Supabase (mostrar spinner)
 *   - false → dato listo
 */
export const useConsent = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  // ── Local state ──────────────────────────────────────────────────
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean | null>(() => {
    // Seed from localStorage synchronously to avoid flash
    try {
      const stored = localStorage.getItem(LOCAL_CONSENT_KEY);
      if (stored === null) return null;
      return stored === 'true';
    } catch {
      return null;
    }
  });

  // True while we wait for the Supabase fetch to complete
  const [loading, setLoading] = useState(true);

  // ── Fetch from Supabase on mount / user change ──────────────────
  useEffect(() => {
    let cancelled = false;

    const loadFromSupabase = async () => {
      setLoading(true);

      if (!userId) {
        // Not authenticated — keep localStorage value, no remote fetch
        setLoading(false);
        return;
      }

      const remote = await fetchAutoSavePreference(userId);

      if (cancelled) return;

      if (remote !== null) {
        // Supabase has a value → use it and sync local cache
        setAutoSaveEnabled(remote);
        try {
          localStorage.setItem(LOCAL_CONSENT_KEY, String(remote));
        } catch (_) { /* ignore */ }
      }
      // If remote is null → no row in DB, user hasn't decided yet
      // Keep whatever came from localStorage (possibly null too)

      setLoading(false);
    };

    loadFromSupabase();

    return () => { cancelled = true; };
  }, [userId]);

  // ── Persist decision ─────────────────────────────────────────────
  const setConsent = useCallback(async (value: boolean) => {
    setAutoSaveEnabled(value);

    // Always write to localStorage as a fast local cache
    try {
      localStorage.setItem(LOCAL_CONSENT_KEY, String(value));
    } catch (error) {
      console.error('Failed to save consent to localStorage:', error);
    }

    // Write to Supabase if authenticated
    if (userId) {
      await saveAutoSavePreference(userId, value);
    }
  }, [userId]);

  /** true if the user has already made a decision (any value stored in DB) */
  const hasDecided = autoSaveEnabled !== null;

  return { autoSaveEnabled, setConsent, hasDecided, loading };
};
