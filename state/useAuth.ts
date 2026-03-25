import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User, AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({ user: session?.user ?? null, loading: false });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthState({ user: session?.user ?? null, loading: false });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: translateAuthError(error) };
    }

    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user: authState.user,
    loading: authState.loading,
    signIn,
    signOut,
  };
};

/** Traduce errores comunes de Supabase Auth a español */
function translateAuthError(error: AuthError): string {
  const msg = error.message.toLowerCase();
  if (msg.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Tu correo aún no ha sido confirmado.';
  }
  if (msg.includes('too many requests')) {
    return 'Demasiados intentos. Espera un momento.';
  }
  return 'Error al iniciar sesión. Inténtalo de nuevo.';
}
