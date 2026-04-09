import { useState, useEffect, useRef } from 'react';
import { EmotionEntry, EmotionalEntry } from '../types';
import { emotionalMemoryService } from '../services/emotionalMemoryService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

export type EmotionEntryInput = Partial<Omit<EmotionEntry, 'timestamp' | 'intensity'>> & {
    timestamp?: Date | string | number;
    intensity?: number;
};

const GAIA_HISTORY_V1 = 'gaia_emotion_history_v1';

// ─── Mapeo de emociones a iconos y colores ─────────────────────────
const EMOTION_ICON_MAP: Record<string, { icon: string; color: string }> = {
    'En calma':       { icon: 'sentiment_satisfied',  color: 'bg-purple-50 text-primary' },
    'Feliz':          { icon: 'sentiment_satisfied',  color: 'bg-purple-100 text-primary' },
    'Cansado/a':      { icon: 'bedtime',              color: 'bg-orange-100 text-orange-500' },
    'Un poco bajo/a': { icon: 'trending_down',        color: 'bg-blue-50 text-blue-500' },
    'Inquieto/a':     { icon: 'air',                  color: 'bg-yellow-50 text-yellow-600' },
    'Calma':          { icon: 'spa',                   color: 'bg-indigo-100 text-indigo-500' },
    'Triste':         { icon: 'sentiment_dissatisfied', color: 'bg-blue-100 text-blue-500' },
    'Ansioso/a':      { icon: 'psychology',            color: 'bg-red-50 text-red-400' },
};

const DEFAULT_ICON  = 'mood';
const DEFAULT_COLOR = 'bg-purple-100 text-primary';

// ─── Conversiones DB ↔ UI ──────────────────────────────────────────

/**
 * Convierte un registro de Supabase (EmotionalEntry) al formato de UI (EmotionEntry).
 * DB.intensity es 1-10, UI.intensity es 1-5.
 */
function dbEntryToUI(db: EmotionalEntry): EmotionEntry {
    const createdAt = new Date(db.created_at);
    const mapped = EMOTION_ICON_MAP[db.emotion];

    return {
        id: db.id,
        date: createdAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
              + ' • '
              + createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        mood: db.emotion,
        icon: mapped?.icon ?? DEFAULT_ICON,
        color: mapped?.color ?? DEFAULT_COLOR,
        text: db.note_brief ?? '',
        timestamp: createdAt,
        intensity: Math.max(1, Math.min(5, Math.round(db.intensity / 2))),
    };
}

/**
 * Convierte un EmotionEntry (UI, 1-5) al payload de insert en Supabase (1-10).
 */
function uiEntryToDbPayload(entry: EmotionEntry, userId: string) {
    const intensity = entry.intensity
        ? Math.min(10, Math.max(1, entry.intensity * 2))
        : 5;

    return {
        user_id: userId,
        emotion: entry.mood,
        intensity,
        place: null,
        cause: null,
        consequence: null,
        note_brief: entry.text || null,
        source: 'manual' as string,
    };
}

// ─── LocalStorage helpers ──────────────────────────────────────────

function loadHistoryFromStorage(): EmotionEntry[] {
    try {
        const stored = localStorage.getItem(GAIA_HISTORY_V1);
        if (!stored) return [];

        const parsed = JSON.parse(stored) as Array<Omit<EmotionEntry, 'timestamp'> & { timestamp: string }>;
        return parsed.map((entry) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
        }));
    } catch {
        return [];
    }
}

function saveHistoryToStorage(entries: EmotionEntry[]): void {
    try {
        const serialized = entries.map((entry) => ({
            ...entry,
            timestamp: entry.timestamp.toISOString(),
        }));
        localStorage.setItem(GAIA_HISTORY_V1, JSON.stringify(serialized));
    } catch (error) {
        console.error('Failed to save history to localStorage:', error);
    }
}

// ─── Hook principal ────────────────────────────────────────────────

export const useHistory = () => {
    const { user } = useAuth();
    const [entries, setEntries] = useState<EmotionEntry[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const hasFetchedRef = useRef<string | null>(null); // Track which user we fetched for

    // ── Efecto: cargar historial cuando cambia el usuario ──────────
    useEffect(() => {
        // If no user, load from localStorage as fallback
        if (!user) {
            console.log('📂 [useHistory] Sin usuario — usando localStorage como fuente');
            const local = loadHistoryFromStorage();
            setEntries(local);
            setLoadingHistory(false);
            hasFetchedRef.current = null;
            return;
        }

        // Avoid re-fetching for the same user
        if (hasFetchedRef.current === user.id) {
            return;
        }

        let cancelled = false;

        async function fetchFromSupabase() {
            console.log('📥 [useHistory] Cargando historial desde Supabase para user:', user!.id);
            setLoadingHistory(true);

            try {
                const dbEntries = await emotionalMemoryService.getEntries(user!.id);
                
                if (cancelled) return;

                if (dbEntries.length > 0) {
                    const uiEntries = dbEntries.map(dbEntryToUI);
                    console.log(`📥 [useHistory] ${uiEntries.length} entradas cargadas desde Supabase`);
                    setEntries(uiEntries);
                    // Sync to localStorage as cache
                    saveHistoryToStorage(uiEntries);
                } else {
                    console.log('📥 [useHistory] 0 entradas en Supabase — historial vacío');
                    setEntries([]);
                    saveHistoryToStorage([]);
                }

                hasFetchedRef.current = user!.id;
            } catch (err) {
                console.error('❌ [useHistory] Error cargando desde Supabase — fallback a localStorage:', err);
                if (!cancelled) {
                    const local = loadHistoryFromStorage();
                    setEntries(local);
                }
            } finally {
                if (!cancelled) {
                    setLoadingHistory(false);
                }
            }
        }

        fetchFromSupabase();

        return () => { cancelled = true; };
    }, [user]);

    // ── Sincronizar localStorage cuando cambian las entries ────────
    useEffect(() => {
        if (!loadingHistory && entries.length >= 0) {
            saveHistoryToStorage(entries);
        }
    }, [entries, loadingHistory]);

    // ── addEntry: guarda local + Supabase ──────────────────────────
    const addEntry = (entrada?: EmotionEntryInput) => {
        console.log('🟡 [addEntry] INVOCADO — entrada:', entrada);
        if (!entrada) {
            console.warn('🟡 [addEntry] entrada es undefined/null, saliendo.');
            return;
        }

        let timestamp: Date;
        if (entrada.timestamp instanceof Date) {
            timestamp = entrada.timestamp;
        } else if (typeof entrada.timestamp === 'string' || typeof entrada.timestamp === 'number') {
            timestamp = new Date(entrada.timestamp);
        } else {
            timestamp = new Date();
        }

        if (isNaN(timestamp.getTime())) {
            timestamp = new Date();
        }

        const rawIntensity = entrada.intensity ?? 3;
        const intensity = Math.max(1, Math.min(5, rawIntensity));

        const safeEntry: EmotionEntry = {
            id: entrada.id ?? String(Date.now()),
            date: entrada.date ?? new Date().toLocaleString(),
            mood: entrada.mood ?? 'Sin nombre',
            icon: entrada.icon ?? 'sentiment_neutral',
            color: entrada.color ?? 'bg-purple-100 text-primary',
            text: entrada.text ?? '',
            timestamp,
            intensity,
        };

        console.log('🟡 [addEntry] safeEntry construido:', safeEntry.mood, 'intensity:', safeEntry.intensity);

        // 1. Agregar al estado local inmediatamente
        setEntries((prev) => [safeEntry, ...prev]);

        // 2. Persistir en Supabase (fire-and-forget)
        if (user) {
            const payload = uiEntryToDbPayload(safeEntry, user.id);
            console.log('📤 [addEntry] Persistiendo en Supabase — userId:', user.id);

            emotionalMemoryService.saveEntry(payload).then((result) => {
                if (result) {
                    console.log('✅ [addEntry] Entrada guardada en Supabase — id:', result.id);
                    // Update the local entry ID with the Supabase UUID
                    setEntries((prev) =>
                        prev.map((e) =>
                            e.id === safeEntry.id ? { ...e, id: result.id } : e
                        )
                    );
                } else {
                    console.error('❌ [addEntry] saveEntry devolvió null.');
                }
            }).catch((err) => {
                console.error('❌ [addEntry] Error persistiendo en Supabase:', err);
            });
        } else {
            console.warn('⚠️ [addEntry] Sin sesión — entrada guardada solo localmente.');
        }
    };

    return { entries, addEntry, loadingHistory };
};
