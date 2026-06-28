import { supabase } from './supabaseClient';

/**
 * Fetches the autosave preference for a given user from Supabase.
 * Returns:
 *   - true / false  → user has already made a decision
 *   - null          → no record found (user hasn't decided yet)
 */
export const fetchAutoSavePreference = async (userId: string): Promise<boolean | null> => {
  try {
    const { data, error } = await supabase
      .from('consent')
      .select('auto_save_enabled')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ [userPreferences] Error fetching preference:', error.message);
      return null;
    }

    if (data === null) {
      // No row found → user hasn't decided yet
      return null;
    }

    return data.auto_save_enabled as boolean;
  } catch (err) {
    console.error('❌ [userPreferences] Unexpected error fetching preference:', err);
    return null;
  }
};

/**
 * Upserts the autosave preference for a given user in Supabase.
 */
export const saveAutoSavePreference = async (userId: string, value: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('consent')
      .upsert(
        { user_id: userId, auto_save_enabled: value, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('❌ [userPreferences] Error saving preference:', error.message);
    } else {
      console.log('✅ [userPreferences] AutoSave preference saved:', value);
    }
  } catch (err) {
    console.error('❌ [userPreferences] Unexpected error saving preference:', err);
  }
};
