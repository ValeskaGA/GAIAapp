import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Restore existing session on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('🔐 [AuthContext] Sesión restaurada:', currentSession ? `user=${currentSession.user.id}` : 'null');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for all auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('🔐 [AuthContext] Auth state change:', _event, newSession ? `user=${newSession.user.id}` : 'null');
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: translateAuthError(error) };
    }
    // onAuthStateChange will update user/session automatically
    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange will clear user/session automatically
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access auth state anywhere in the app.
 * Must be used within an <AuthProvider>.
 */
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
