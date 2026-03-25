import { useState, useEffect } from 'react';
import { EmotionEntry } from '../types';
import { emotionalMemoryService } from '../services/emotionalMemoryService';
import { supabase } from '../services/supabaseClient';

export type EmotionEntryInput = Partial<Omit<EmotionEntry, 'timestamp' | 'intensity'>> & {
    timestamp?: Date | string | number;
    intensity?: number;
};

const GAIA_HISTORY_V1 = 'gaia_emotion_history_v1';

const defaultHistory: EmotionEntry[] = [
    {
        id: '1',
        date: '24 Oct • 10:30 AM',
        mood: 'Feliz',
        icon: 'sentiment_satisfied',
        color: 'bg-purple-100 text-primary',
        text: 'Hoy tuve una conversación excelente con Sarah. Hablamos de todo y finalmente me sentí conectado...',
        timestamp: new Date(2024, 9, 24),
        intensity: 5
    },
    {
        id: '2',
        date: '23 Oct • 8:15 PM',
        mood: 'Cansado/a',
        icon: 'bedtime',
        color: 'bg-orange-100 text-orange-500',
        text: 'Hoy fue un día largo en el trabajo. Me sentí abrumado con los plazos acumulándose...',
        timestamp: new Date(2024, 9, 23),
        intensity: 3
    },
    {
        id: '3',
        date: '22 Oct • 6:00 PM',
        mood: 'Calma',
        icon: 'spa',
        color: 'bg-indigo-100 text-indigo-500',
        text: 'Una tarde tranquila leyendo. Hacía tiempo que no lograba apagar el ruido mental.',
        timestamp: new Date(2024, 9, 22),
        intensity: 4
    }
];

const loadHistoryFromStorage = (): EmotionEntry[] => {
    try {
        const stored = localStorage.getItem(GAIA_HISTORY_V1);
        if (!stored) return [...defaultHistory];

        const parsed = JSON.parse(stored) as Array<Omit<EmotionEntry, 'timestamp'> & { timestamp: string }>;
        return parsed.map((entry) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
        }));
    } catch {
        return [...defaultHistory];
    }
};

/**
 * Persiste la entrada en Supabase (fire-and-forget).
 * Si falla, solo logea el error — el historial local sigue intacto.
 */
async function persistToSupabase(entry: EmotionEntry): Promise<void> {
    try {
        // Usar getSession (cache local) en vez de getUser (network call)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('❌ Error obteniendo sesión:', sessionError.message);
            return;
        }

        if (!session?.user) {
            console.warn('⚠️ No hay sesión activa — entrada guardada solo localmente.');
            return;
        }

        const userId = session.user.id;

        // Mapeo: EmotionEntry (local, 1-5) → campos de public.entries
        const intensity = entry.intensity
            ? Math.min(10, Math.max(1, entry.intensity * 2))
            : 5;

        const payload = {
            user_id: userId,
            emotion: entry.mood,
            intensity,
            place: null,
            cause: null,
            consequence: null,
            note_brief: entry.text || null,
            source: 'manual' as string,
        };

        console.log('📤 Enviando a Supabase entries:', JSON.stringify(payload, null, 2));

        const result = await emotionalMemoryService.saveEntry(payload);

        if (result) {
            console.log('✅ Entrada guardada en Supabase (entries):', result.id);
        } else {
            console.error('❌ saveEntry devolvió null — revisa errores anteriores.');
        }
    } catch (err) {
        console.error('❌ Error inesperado al persistir en Supabase:', err);
    }
}

export const useHistory = () => {
    const [entries, setEntries] = useState<EmotionEntry[]>(loadHistoryFromStorage);

    useEffect(() => {
        try {
            const serialized = entries.map((entry) => ({
                ...entry,
                timestamp: entry.timestamp.toISOString()
            }));
            localStorage.setItem(GAIA_HISTORY_V1, JSON.stringify(serialized));
        } catch (error) {
            console.error('Failed to save history to localStorage:', error);
        }
    }, [entries]);

    const addEntry = (entrada?: EmotionEntryInput) => {
        if (!entrada) return;

        let timestamp: Date;
        if (entrada.timestamp instanceof Date) {
            timestamp = entrada.timestamp;
        } else if (typeof entrada.timestamp === 'string' || typeof entrada.timestamp === 'number') {
            timestamp = new Date(entrada.timestamp);
        } else {
            timestamp = new Date();
        }

        // Ensure timestamp is valid to prevent toISOString() crashes
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

        // 1. Guardar en localStorage (inmediato, síncrono)
        setEntries((prev) => [safeEntry, ...prev]);

        // 2. Persistir en Supabase (fire-and-forget, no bloquea)
        persistToSupabase(safeEntry);
    };

    return { entries, addEntry };
};
