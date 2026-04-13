
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, resendConfirmation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Email confirmation specific state
  const [showConfirmationNeeded, setShowConfirmationNeeded] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Note: We intentionally do NOT auto-redirect to /chat when a session exists.
  // This allows users who just logged out to switch accounts.
  // The AuthCallbackHandler handles redirecting fresh sign-ins from public pages.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowConfirmationNeeded(false);
    setResendSuccess(false);
    setIsLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      navigate('/chat');
    } else {
      if (result.isEmailNotConfirmed) {
        setShowConfirmationNeeded(true);
      }
      setError(result.error || 'Error al iniciar sesión.');
    }

    setIsLoading(false);
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    setResendSuccess(false);

    const result = await resendConfirmation(email);
    if (result.success) {
      setResendSuccess(true);
    } else {
      setError(result.error || 'No se pudo reenviar el correo.');
    }

    setResendLoading(false);
  };

  return (
    <div className="relative min-h-full flex flex-col items-center justify-center p-6 bg-[#f5f2ed] dark:bg-background-dark font-display animate-sweep overflow-hidden pt-safe pb-safe">
      {/* Top Branding / Organic Element */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 bg-primary rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="relative w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-2xl">eco</span>
          </div>
        </div>
        <h2 className="mt-6 text-primary text-xl font-bold tracking-[0.15em]">GAIA</h2>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[400px] bg-white dark:bg-[#251b2e] rounded-3xl shadow-soft border border-[#e0dce5]/40 p-8 flex flex-col z-10">
        <div className="mb-2">
          <h1 className="text-[#141117] dark:text-white tracking-tight text-[28px] font-extrabold leading-tight text-center">
            Bienvenido de nuevo
          </h1>
        </div>

        <div className="mb-8">
          <p className="text-[#756487] dark:text-gray-400 text-base font-medium leading-normal text-center">
            Inicia sesión para continuar tu camino al bienestar.
          </p>
        </div>

        {/* Email Not Confirmed — Special Message */}
        {showConfirmationNeeded && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 animate-sweep">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5">mark_email_unread</span>
              <div className="flex-1">
                <p className="text-amber-700 dark:text-amber-300 text-sm font-bold mb-1">
                  Correo no confirmado
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-xs font-medium leading-relaxed mb-3">
                  Revisa tu bandeja de entrada (y spam) y haz clic en el enlace de confirmación que te enviamos.
                </p>
                {resendSuccess ? (
                  <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    ¡Correo reenviado! Revisa tu bandeja.
                  </div>
                ) : (
                  <button
                    onClick={handleResendConfirmation}
                    disabled={resendLoading}
                    className="text-amber-700 dark:text-amber-300 text-xs font-bold underline hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-1"
                  >
                    {resendLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                        Reenviando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">forward_to_inbox</span>
                        Reenviar correo de confirmación
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generic Error Message (shown only when NOT email-confirmation error) */}
        {error && !showConfirmationNeeded && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium text-center animate-sweep">
            <span className="material-symbols-outlined text-base align-middle mr-1">error</span>
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col w-full">
            <label className="flex flex-col w-full">
              <p className="text-[#141117] dark:text-gray-200 text-sm font-bold leading-normal pb-2 ml-1">Correo electrónico</p>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="flex w-full rounded-2xl text-[#141117] dark:text-white dark:bg-[#191121] focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#e0dce5] dark:border-gray-700 bg-white focus:border-primary h-14 placeholder:text-[#756487]/50 px-4 text-base font-medium transition-all disabled:opacity-50"
                placeholder="tu@correo.com"
              />
            </label>
          </div>

          <div className="flex flex-col w-full">
            <label className="flex flex-col w-full">
              <p className="text-[#141117] dark:text-gray-200 text-sm font-bold leading-normal pb-2 ml-1">Contraseña</p>
              <div className="flex w-full items-stretch rounded-2xl overflow-hidden border border-[#e0dce5] dark:border-gray-700 bg-white dark:bg-[#191121] focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="flex w-full border-none bg-transparent h-14 text-[#141117] dark:text-white placeholder:text-[#756487]/50 px-4 text-base font-medium focus:ring-0 disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#756487] dark:text-gray-400 flex items-center justify-center px-4 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-1">
            <button type="button" className="text-primary text-sm font-bold hover:underline transition-all">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Entrando...</span>
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex flex-col items-center gap-2 z-10">
        <p className="text-[#756487] dark:text-gray-400 text-sm font-medium">¿No tienes una cuenta?</p>
        <button
          onClick={() => navigate('/register')}
          className="text-primary font-extrabold text-base hover:opacity-80 transition-opacity"
        >
          Crear una cuenta
        </button>
      </div>

      {/* Background Subtle Detail */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent -z-10 pointer-events-none"></div>
    </div>
  );
};

export default LoginScreen;
