
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, resendConfirmation, user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // If already authenticated, skip registration
  useEffect(() => {
    if (!loading && user) {
      navigate('/chat', { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    const result = await signUp(email, password);

    if (result.success) {
      if (result.needsConfirmation) {
        // Email confirmation required — show message
        setNeedsConfirmation(true);
        setRegistrationComplete(true);
      } else {
        // Auto-logged in — navigate to chat
        navigate('/chat');
      }
    } else {
      setError(result.error || 'Error al crear la cuenta.');
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

  // ── Success: Confirmation required ───────────────────────────────
  if (registrationComplete && needsConfirmation) {
    return (
      <div className="relative min-h-full flex flex-col items-center justify-center p-6 bg-[#f5f2ed] dark:bg-background-dark font-display animate-sweep overflow-hidden pt-safe pb-safe">
        <div className="w-full max-w-[400px] bg-white dark:bg-[#251b2e] rounded-3xl shadow-soft border border-[#e0dce5]/40 p-8 flex flex-col items-center z-10">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-green-500/90 rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-4xl">mark_email_read</span>
            </div>
          </div>

          <h1 className="text-[#141117] dark:text-white tracking-tight text-[24px] font-extrabold leading-tight text-center mb-3">
            ¡Cuenta creada!
          </h1>
          <p className="text-[#756487] dark:text-gray-400 text-base font-medium leading-relaxed text-center mb-6">
            Te enviamos un correo de confirmación a <strong className="text-primary">{email}</strong>. 
            Revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
          </p>

          {/* Resend confirmation */}
          {resendSuccess ? (
            <div className="mb-4 flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold animate-sweep">
              <span className="material-symbols-outlined text-base">check_circle</span>
              ¡Correo reenviado! Revisa tu bandeja.
            </div>
          ) : (
            <button
              onClick={handleResendConfirmation}
              disabled={resendLoading}
              className="mb-4 text-primary text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
            >
              {resendLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  Reenviando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                  Reenviar correo de confirmación
                </>
              )}
            </button>
          )}

          <div className="w-full space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              Ir a iniciar sesión
            </button>
            <button
              onClick={() => {
                setRegistrationComplete(false);
                setNeedsConfirmation(false);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setResendSuccess(false);
              }}
              className="w-full text-primary font-bold py-3 rounded-2xl hover:bg-primary/5 transition-all"
            >
              Registrar otro correo
            </button>
          </div>
        </div>

        {/* Background */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent -z-10 pointer-events-none"></div>
      </div>
    );
  }

  // ── Registration form ────────────────────────────────────────────
  return (
    <div className="relative min-h-full flex flex-col items-center justify-center p-6 bg-[#f5f2ed] dark:bg-background-dark font-display animate-sweep overflow-hidden pt-safe pb-safe">
      {/* Top Branding */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 bg-primary rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="relative w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-2xl">eco</span>
          </div>
        </div>
        <h2 className="mt-6 text-primary text-xl font-bold tracking-[0.15em]">GAIA</h2>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-[400px] bg-white dark:bg-[#251b2e] rounded-3xl shadow-soft border border-[#e0dce5]/40 p-8 flex flex-col z-10">
        <div className="mb-2">
          <h1 className="text-[#141117] dark:text-white tracking-tight text-[28px] font-extrabold leading-tight text-center">
            Crea tu cuenta
          </h1>
        </div>

        <div className="mb-8">
          <p className="text-[#756487] dark:text-gray-400 text-base font-medium leading-normal text-center">
            Empieza tu camino al bienestar emocional.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium text-center animate-sweep">
            <span className="material-symbols-outlined text-base align-middle mr-1">error</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
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

          {/* Password */}
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
                  minLength={6}
                  className="flex w-full border-none bg-transparent h-14 text-[#141117] dark:text-white placeholder:text-[#756487]/50 px-4 text-base font-medium focus:ring-0 disabled:opacity-50"
                  placeholder="Mínimo 6 caracteres"
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

          {/* Confirm Password */}
          <div className="flex flex-col w-full">
            <label className="flex flex-col w-full">
              <p className="text-[#141117] dark:text-gray-200 text-sm font-bold leading-normal pb-2 ml-1">Confirmar contraseña</p>
              <input
                required
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
                className="flex w-full rounded-2xl text-[#141117] dark:text-white dark:bg-[#191121] focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#e0dce5] dark:border-gray-700 bg-white focus:border-primary h-14 placeholder:text-[#756487]/50 px-4 text-base font-medium transition-all disabled:opacity-50"
                placeholder="Repite tu contraseña"
              />
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-col items-center gap-2 z-10">
        <p className="text-[#756487] dark:text-gray-400 text-sm font-medium">¿Ya tienes una cuenta?</p>
        <button
          onClick={() => navigate('/login')}
          className="text-primary font-extrabold text-base hover:opacity-80 transition-opacity"
        >
          Iniciar sesión
        </button>
      </div>

      {/* Background */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent -z-10 pointer-events-none"></div>
    </div>
  );
};

export default RegisterScreen;
