import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback to a valid format URL if empty or placeholder to avoid breaking app compilation/startup
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

if (!isValidUrl(rawUrl)) {
  console.warn(
    '⚠️ [Supabase] VITE_SUPABASE_URL is missing or invalid. Using a placeholder URL to prevent startup crash.'
  );
}

const supabaseUrl = isValidUrl(rawUrl) ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

