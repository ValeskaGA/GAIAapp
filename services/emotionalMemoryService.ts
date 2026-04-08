import { supabase } from './supabaseClient';
import { EmotionalEntry } from '../types';

export type EmotionalEntryInput = Omit<EmotionalEntry, 'id' | 'created_at' | 'entry_date'>;

export const emotionalMemoryService = {
  /**
   * Guarda un registro emocional en Supabase (tabla entries).
   */
  async saveEntry(entry: EmotionalEntryInput): Promise<EmotionalEntry | null> {
    console.log('🔵 [DEBUG] emotionalMemoryService.saveEntry() INICIO');
    console.log('🔵 [DEBUG] entry recibido:', JSON.stringify(entry, null, 2));

    try {
      console.log('🔵 [DEBUG] Ejecutando supabase.from("entries").insert()...');
      const { data, error } = await supabase
        .from('entries')
        .insert(entry)
        .select()
        .single();

      console.log('🔵 [DEBUG] Supabase respondió — data:', data, 'error:', error);

      if (error) {
        console.error('❌ [DEBUG] Error saving emotional entry:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          status: (error as any).status,
          statusText: (error as any).statusText,
        });
        return null;
      }

      console.log('🔵 [DEBUG] Insert exitoso — data.id:', data?.id);
      return data as EmotionalEntry;
    } catch (err) {
      console.error('❌ [DEBUG] Excepción no capturada en saveEntry:', err);
      return null;
    }
  },

  /**
   * Obtiene todos los registros emocionales de un usuario.
   */
  async getEntries(userId: string): Promise<EmotionalEntry[]> {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emotional entries:', error);
      return [];
    }

    return data as EmotionalEntry[];
  },

  /**
   * Obtiene los últimos N registros emocionales de un usuario.
   */
  async getRecentEntries(userId: string, limit: number = 10): Promise<EmotionalEntry[]> {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent emotional entries:', error);
      return [];
    }

    return data as EmotionalEntry[];
  },
};
