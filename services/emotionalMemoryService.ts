import { supabase } from './supabaseClient';
import { EmotionalEntry } from '../types';

export type EmotionalEntryInput = Omit<EmotionalEntry, 'id' | 'created_at' | 'entry_date'>;

export const emotionalMemoryService = {
  /**
   * Guarda un registro emocional en Supabase (tabla entries).
   */
  async saveEntry(entry: EmotionalEntryInput): Promise<EmotionalEntry | null> {
    const { data, error } = await supabase
      .from('entries')
      .insert(entry)
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving emotional entry:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return null;
    }

    return data as EmotionalEntry;
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
