
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En un entorno real aquí iría la validación
    // Por ahora, simulamos un login exitoso llevando al usuario al chat
    navigate('/chat');
  };

  return (
    <div className="relative min-h-full flex flex-col items-center justify-center p-6 bg-[#f5f2ed] dark:bg-background-dark font-display animate-sweep overflow-hidden">
      {/* Top Branding / Organic Element */}
      <div className="mb-10 flex flex-col items-center">
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
                className="flex w-full rounded-2xl text-[#141117] dark:text-white dark:bg-[#191121] focus:outline-none focus:ring-2 focus:ring-primary/20 border border-[#e0dce5] dark:border-gray-700 bg-white focus:border-primary h-14 placeholder:text-[#756487]/50 px-4 text-base font-medium transition-all" 
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
                  className="flex w-full border-none bg-transparent h-14 text-[#141117] dark:text-white placeholder:text-[#756487]/50 px-4 text-base font-medium focus:ring-0" 
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
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex flex-col items-center gap-2 z-10">
        <p className="text-[#756487] dark:text-gray-400 text-sm font-medium">¿No tienes una cuenta?</p>
        <button 
          onClick={() => navigate('/intro')}
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
