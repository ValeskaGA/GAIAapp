import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User, Session, AuthError } from '@supabase/supabase-js';

type AuthResult = { success: boolean; error?: string; needsConfirmation?: boolean; isEmailNotConfirmed?: boolean };

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Traduce errores comunes de Supabase Auth a español */
function translateAuthError(error: AuthError): string {
  const msg = error.message.toLowerCase();
  // Login errors
  if (msg.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.';
  }
  // Sign-up errors
  if (msg.includes('user already registered')) {
    return 'Este correo ya está registrado. Intenta iniciar sesión.';
  }
  if (msg.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (msg.includes('unable to validate email')) {
    return 'El formato del correo electrónico no es válido.';
  }
  if (msg.includes('signup is disabled')) {
    return 'El registro de nuevos usuarios está desactivado temporalmente.';
  }
  // Resend confirmation
  if (msg.includes('otp_disabled') || msg.includes('signups not allowed')) {
    return 'No se pudo reenviar el correo. Intenta más tarde.';
  }
  // Generic
  if (msg.includes('too many requests') || msg.includes('rate limit')) {
    return 'Demasiados intentos. Espera un momento.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Error de conexión. Verifica tu internet.';
  }
  return `Error: ${error.message}`;
}

/** Checks whether a Supabase error message indicates unconfirmed email */
function isEmailNotConfirmedError(error: AuthError): boolean {
  return error.message.toLowerCase().includes('email not confirmed');
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

    // 2. Listen for all auth state changes (login, logout, token refresh, sign up, email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('🔐 [AuthContext] Auth state change:', event, newSession ? `user=${newSession.user.id}` : 'null');

        // Special handling: email confirmation completes
        if (event === 'SIGNED_IN' && newSession) {
          console.log('✅ [AuthContext] Usuario autenticado:', newSession.user.email);
        }
        if (event === 'USER_UPDATED') {
          console.log('📧 [AuthContext] Usuario actualizado (posible confirmación de email)');
        }

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
  ): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return {
        success: false,
        error: translateAuthError(error),
        isEmailNotConfirmed: isEmailNotConfirmedError(error),
      };
    }
    return { success: true };
  };

  const signUp = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { success: false, error: translateAuthError(error) };
    }

    // Supabase behavior:
    // - If email confirmation is ENABLED: data.user exists but data.session is null
    // - If email confirmation is DISABLED: data.user AND data.session both exist
    const needsConfirmation = !data.session;

    if (needsConfirmation) {
      console.log('📧 [AuthContext] Registro exitoso — requiere confirmación por email');
    } else {
      console.log('✅ [AuthContext] Registro exitoso — sesión activa inmediata, user:', data.user?.id);
    }

    return { success: true, needsConfirmation };
  };

  /** Resend confirmation email by re-calling signUp (Supabase resends if user exists but unconfirmed) */
  const resendConfirmation = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      console.error('❌ [AuthContext] Error reenviando confirmación:', error.message);
      return { success: false, error: translateAuthError(error) };
    }

    console.log('📧 [AuthContext] Correo de confirmación reenviado a:', email);
    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resendConfirmation }}>
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
