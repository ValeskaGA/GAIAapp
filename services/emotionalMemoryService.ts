import { supabase } from './supabaseClient';
import { EmotionalEntry } from '../types';

export type EmotionalEntryInput = Omit<EmotionalEntry, 'id' | 'created_at'>;

export const emotionalMemoryService = {
  /**
   * Guarda un registro emocional en Supabase.
   */
  async saveEntry(entry: EmotionalEntryInput): Promise<EmotionalEntry | null> {
    const { data, error } = await supabase
      .from('emotional_entries')
      .insert(entry)
      .select()
      .single();

    if (error) {
      console.error('Error saving emotional entry:', error);
      return null;
    }

    return data as EmotionalEntry;
  },

  /**
   * Obtiene todos los registros emocionales de un usuario.
   */
  async getEntries(userId: string = 'anonymous'): Promise<EmotionalEntry[]> {
    const { data, error } = await supabase
      .from('emotional_entries')
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
  async getRecentEntries(userId: string = 'anonymous', limit: number = 10): Promise<EmotionalEntry[]> {
    const { data, error } = await supabase
      .from('emotional_entries')
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
