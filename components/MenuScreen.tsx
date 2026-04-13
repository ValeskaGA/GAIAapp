
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const MenuScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Estado para el nombre del perfil con persistencia
  const [userName, setUserName] = useState(() => localStorage.getItem('gaia_user_name') || 'Viajero');

  // Estados para el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [error, setError] = useState('');

  const menuItems = [
    { icon: 'chat', label: 'Chat con GAIA', path: '/chat' },
    { icon: 'sentiment_satisfied', label: 'Registro emocional', path: '/checkin' },
    { icon: 'auto_stories', label: 'Historial del diario', path: '/history' },
    { icon: 'verified_user', label: 'Ética y límites', path: '/ethics' },
    {
      icon: 'settings',
      label: 'Configuración',
      onClick: () => setShowConfigModal(true)
    }
  ];

  const handleSaveProfile = () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      setError('Tu nombre no puede quedar en blanco.');
      return;
    }
    if (trimmed.length > 25) {
      setError('Máximo 25 caracteres.');
      return;
    }
    localStorage.setItem('gaia_user_name', trimmed);
    setUserName(trimmed);
    setIsEditModalOpen(false);
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setError('');
    setEditName(userName);
  };

  return (
    <div className="flex flex-col h-full bg-warm-beige dark:bg-background-dark animate-sweep pt-safe pb-safe">
      <div className="flex items-center p-4 justify-end">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">close</span>
        </button>
      </div>

      <div className="px-6 pb-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* Avatar Circle */}
            <div className="aspect-square rounded-full h-24 w-24 border-4 border-white dark:border-white/10 shadow-sm bg-cover bg-center overflow-hidden bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">person</span>
            </div>

            {/* Botón de Lápiz (Editar Perfil) */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              aria-label="Editar perfil"
              className="absolute bottom-0 -right-1 size-8 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 shadow-md flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all z-10"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-main dark:text-text-dark-main">Hola, {userName}</h1>
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm font-medium mt-1">Tu espacio seguro</p>
          </div>
        </div>
      </div>

      <div className="px-6 mb-4">
        <div className="h-px w-full bg-[#E6E1D6] dark:bg-white/10"></div>
      </div>

      <div className="flex flex-col px-4 gap-2 flex-1">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            onClick={item.onClick || (() => navigate(item.path!))}
            className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-white/5 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center rounded-full bg-white dark:bg-surface-dark shrink-0 size-10 shadow-sm border border-[#EBE8E0] dark:border-white/5 text-primary">
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <p className="font-medium flex-1 text-text-main dark:text-text-dark-main">{item.label}</p>
            <span className="material-symbols-outlined text-[#9ca3af]">chevron_right</span>
          </div>
        ))}
      </div>

      <div className="p-6 mt-auto">
        <button
          onClick={async () => {
            await signOut();
            // Clear any user-specific local state so the previous account doesn't linger
            localStorage.removeItem('gaia_user_name');
            navigate('/login', { replace: true });
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-text-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium">Cerrar sesión</span>
        </button>
        <div className="text-center mt-4">
          <p className="text-[#9ca3af] text-xs">GAIA v1.0.4 • AI Powered</p>
        </div>
      </div>

      {/* Modal Editar Perfil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-sweep">
          <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-text-main dark:text-text-dark-main mb-6 text-center">Editar perfil</h3>

            <div className="space-y-6">
              {/* Campo Nombre */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-text-dark-secondary mb-2 px-1">
                  Nombre
                </label>
                <input
                  autoFocus
                  type="text"
                  maxLength={25}
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full h-12 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} bg-gray-50 dark:bg-background-dark/50 px-4 text-text-main dark:text-text-dark-main focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  placeholder="Tu nombre"
                />
                {error && <p className="text-red-500 text-[10px] mt-1.5 px-1 font-medium">{error}</p>}
              </div>

              {/* Campo Foto (Placeholder) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary dark:text-text-dark-secondary mb-2 px-1">
                  Foto
                </label>
                <div className="w-full h-12 rounded-xl border border-dashed border-gray-300 dark:border-white/10 flex items-center gap-3 px-4 text-gray-400 opacity-60 bg-gray-50/50 dark:bg-background-dark/20 cursor-not-allowed">
                  <span className="material-symbols-outlined text-[20px]">image</span>
                  <span className="text-sm">Cambiar foto (próximamente)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleSaveProfile}
                className="w-full h-12 rounded-full bg-primary text-white font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Guardar
              </button>
              <button
                onClick={handleCancelEdit}
                className="w-full h-12 rounded-full border border-gray-200 dark:border-white/10 text-text-secondary dark:text-text-dark-secondary font-bold hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuración Próximamente */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-sweep">
          <div className="bg-white dark:bg-surface-dark w-full max-w-xs rounded-3xl p-8 shadow-2xl text-center border border-gray-100 dark:border-white/5">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">settings_suggest</span>
            </div>
            <h3 className="text-xl font-bold text-text-main dark:text-text-dark-main mb-2">Ajustes</h3>
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm mb-8 leading-relaxed">
              Esta opción estará disponible pronto.
            </p>
            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full h-12 rounded-full bg-primary text-white font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuScreen;
