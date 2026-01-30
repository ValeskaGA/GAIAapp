
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionEntry } from '../types';

interface InsightsScreenProps {
  entries: EmotionEntry[];
}

const InsightsScreen: React.FC<InsightsScreenProps> = ({ entries = [] }) => {
  const navigate = useNavigate();
  const [range, setRange] = useState('1 semana');
  const [selectedDay, setSelectedDay] = useState<EmotionEntry | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Colores extraídos de la referencia visual
  const COLORS = {
    lavender: 'bg-[#E1D7F2]',
    peach: 'bg-[#F7D2B6]',
    sage: 'bg-[#C0D3C1]',
    sageText: 'text-[#8BA88E]',
    sageBg: 'bg-[#8BA88E]/10',
    textLavender: 'text-[#9b89b3]',
    bgWarm: 'bg-[#FDFBF7]'
  };

  // Datos para el gráfico: Usamos los últimos 7 días si existen, si no, mock data
  const chartDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const chartData = chartDays.map((day, idx) => {
    // Intentamos encontrar un entry para este día de la semana (simplificado para demo)
    const entry = (entries && entries[idx]) || null;
    const colorOptions = [COLORS.lavender, COLORS.peach, COLORS.sage];
    
    // Si no hay entrada real, generamos una informativa para el tooltip de demo
    const displayEntry = entry || {
      id: `mock-${idx}`,
      mood: idx % 2 === 0 ? 'Calma' : 'Energía',
      icon: idx % 2 === 0 ? 'sentiment_satisfied' : 'bolt',
      intensity: Math.floor(Math.random() * 4) + 2,
      color: colorOptions[idx % 3],
      date: `Día ${idx + 1}`,
      text: 'Nota de ejemplo...',
      timestamp: new Date()
    };

    return {
      day,
      intensity: displayEntry.intensity || 3,
      color: entry ? (entry.color.includes('purple') ? COLORS.lavender : entry.color.includes('orange') ? COLORS.peach : COLORS.sage) : colorOptions[idx % 3],
      entry: displayEntry as EmotionEntry
    };
  });

  const handleDayClick = (entry: EmotionEntry) => {
    setSelectedDay(entry);
  };

  return (
    <div className={`flex flex-col h-full ${COLORS.bgWarm} dark:bg-background-dark animate-sweep overflow-hidden`}>
      {/* Header */}
      <header className="px-6 pt-12 pb-2">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex size-10 items-center justify-start rounded-full text-text-main dark:text-text-dark-main"
          >
            <span className="material-symbols-outlined text-[28px] font-bold">chevron_left</span>
          </button>
          <h1 className="text-[17px] font-extrabold text-text-main dark:text-text-dark-main">Mapa emocional</h1>
          <button 
            onClick={() => setShowInfo(true)}
            className="flex size-10 items-center justify-end rounded-full text-text-main dark:text-text-dark-main hover:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] fill-current">info</span>
          </button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-[28px] font-extrabold text-text-main dark:text-text-dark-main leading-[1.15] tracking-tight">
            Un vistazo a tu recorrido, sin interpretaciones
          </h2>
        </div>

        {/* Selector de Rango */}
        <div className="flex gap-2.5 mb-8 overflow-x-auto no-scrollbar py-1">
          {['1 día', '1 semana', '1 mes', '3 meses'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap ${
                range === r 
                  ? 'bg-[#E1D7F2] text-primary shadow-sm ring-1 ring-primary/10' 
                  : 'bg-white dark:bg-surface-dark text-text-secondary border border-black/5 dark:border-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-5 pb-32 overflow-y-auto no-scrollbar">
        {/* Tarjeta Vibración Emocional con Gráfico Interactivo */}
        <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 shadow-soft border border-black/5 dark:border-white/5 mb-8 relative">
          <div className="mb-10">
            <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${COLORS.textLavender} block mb-1`}>Ritmo</span>
            <h3 className="text-[25px] font-extrabold text-text-main dark:text-text-dark-main leading-tight mb-1">Vibración emocional</h3>
            <p className="text-[14px] text-text-secondary dark:text-text-dark-secondary font-medium">Interactúa con las barras</p>
          </div>

          {/* Gráfico de Barras con Tooltip */}
          <div className="h-44 flex items-end justify-between gap-3 mb-6 px-1 relative">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full relative group">
                {/* Tooltip flotante individual */}
                {hoveredIndex === idx && (
                  <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 z-50 animate-sweep pointer-events-none">
                    <div className="bg-white dark:bg-[#2d2438] shadow-xl border border-black/5 dark:border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1 min-w-[80px]">
                      <span className="material-symbols-outlined text-primary text-[20px]">{data.entry.icon}</span>
                      <span className="text-[10px] font-extrabold text-text-main dark:text-text-dark-main whitespace-nowrap">{data.entry.mood}</span>
                      <div className="flex gap-0.5">
                         {[1,2,3,4,5].map(d => (
                           <div key={d} className={`size-1 rounded-full ${d <= (data.intensity || 0) ? 'bg-primary' : 'bg-gray-200'}`}></div>
                         ))}
                      </div>
                    </div>
                    {/* Triangulito del tooltip */}
                    <div className="w-2 h-2 bg-white dark:bg-[#2d2438] rotate-45 mx-auto -mt-1 border-r border-b border-black/5 dark:border-white/10"></div>
                  </div>
                )}

                <button 
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(idx)}
                  onClick={() => handleDayClick(data.entry)}
                  className={`w-full rounded-full transition-all duration-300 ease-out ${data.color} shadow-sm ${hoveredIndex === idx ? 'scale-x-125 brightness-95' : 'hover:scale-x-110'} active:scale-95`}
                  style={{ height: `${(data.intensity / 5) * 100}%` }}
                ></button>
                <span className={`text-[12px] font-bold transition-opacity ${hoveredIndex === idx ? 'text-primary opacity-100' : 'text-text-secondary opacity-60'}`}>
                  {data.day}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px bg-gray-100 dark:bg-white/5 w-full mb-8"></div>
          
          {/* Leyenda */}
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-orange-400 text-[24px]">light_mode</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary opacity-80">Luz</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-[24px]">cloud</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary opacity-80">Sombra</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">auto_awesome</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary opacity-80">Brillo</span>
            </div>
          </div>
        </div>

        {/* Sección: Tus días */}
        <section className="mb-12">
          <h2 className="text-[18px] font-extrabold text-text-main dark:text-text-dark-main mb-6 ml-1">Tus días</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-1">
             {entries && entries.length > 0 ? (
               entries.slice(0, 5).map((entry, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDay(entry)}
                  className="min-w-[115px] bg-white dark:bg-surface-dark p-6 rounded-[28px] shadow-soft border border-black/5 dark:border-white/5 flex flex-col items-center gap-3 active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="text-[12px] font-bold text-text-secondary opacity-50 mb-1">
                    {entry.date.split('•')[0].trim()}
                  </span>
                  <span className={`material-symbols-outlined text-[28px] ${entry.color.includes('text-') ? entry.color : 'text-primary'}`}>
                    {entry.icon}
                  </span>
                  <p className="text-[14px] font-extrabold text-text-main dark:text-text-dark-main truncate w-full text-center">
                      {entry.mood}
                  </p>
                </div>
               ))
             ) : (
               [1,2,3].map(i => (
                 <div key={i} className="min-w-[115px] bg-white/40 dark:bg-surface-dark/40 p-6 rounded-[28px] flex flex-col items-center opacity-30">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mb-2"></div>
                    <div className="w-12 h-2 bg-gray-200 rounded"></div>
                 </div>
               ))
             )}
          </div>
        </section>

        <div className="text-center px-10 py-6 mb-10">
          <p className={`text-[14px] italic ${COLORS.textLavender} font-medium leading-relaxed`}>
            "Esto no define quién eres. Solo muestra por dónde has pasado. "
          </p>
        </div>
      </main>

      {/* Modals y Bottom Sheets (Sin cambios en lógica pero asegurando z-index) */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/20 backdrop-blur-md animate-sweep" onClick={() => setShowInfo(false)}>
          <div className="bg-white dark:bg-[#1f1a26] w-full max-w-[340px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col items-stretch" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-5 w-full items-center justify-center pt-2">
              <div className="h-1.5 w-10 rounded-full bg-[#e0dce5] dark:bg-gray-700"></div>
            </div>
            <div className="px-8 pt-6 pb-2 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">info</span>
                </div>
              </div>
              <h3 className="text-[#141117] dark:text-white tracking-tight text-2xl font-extrabold leading-tight mb-4">Sobre este mapa</h3>
              <p className="text-[#4a4552] dark:text-gray-300 text-[15px] font-medium leading-relaxed mb-8">
                GAIA no interpreta ni diagnostica. Este mapa solo organiza lo que tú registras, para ayudarte a mirar tu recorrido con más claridad.
              </p>
            </div>
            <div className="px-8 pb-8">
              <button onClick={() => setShowInfo(false)} className="flex w-full cursor-pointer items-center justify-center rounded-full h-14 bg-primary/15 text-primary hover:bg-primary/20 transition-all active:scale-[0.98] font-extrabold">Entiendo</button>
            </div>
          </div>
        </div>
      )}

      {selectedDay && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-[2px] animate-sweep" onClick={() => setSelectedDay(null)}>
          <div className="bg-[#fcfaf9] dark:bg-[#251b2e] w-full max-w-md rounded-t-[32px] shadow-2xl pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-8 w-full items-center justify-center pt-2">
              <div className="h-1.5 w-12 rounded-full bg-[#e0dce5] dark:bg-gray-700"></div>
            </div>
            <div className="px-4 py-2 text-center">
              <h4 className="text-[#756388] dark:text-[#a698b5] text-[13px] font-bold uppercase tracking-[0.1em]">{selectedDay.date}</h4>
            </div>
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 size-14`}>
                    <span className="material-symbols-outlined text-[32px]">{selectedDay.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-[#141118] dark:text-white text-[22px] font-extrabold">{selectedDay.mood}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado de ánimo</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div key={dot} className={`w-3.5 h-3.5 rounded-full shadow-sm ${ (selectedDay.intensity || 3) >= dot ? 'bg-[#8BA88E]' : 'bg-[#e0dce5] dark:bg-gray-700' }`}></div>
                  ))}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-white/5 rounded-[24px] p-6 border border-black/5 dark:border-white/5 mb-8">
                <p className="text-[#141118] dark:text-gray-200 text-[16px] leading-relaxed italic font-medium">"{selectedDay.text}"</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => { navigate('/history'); setSelectedDay(null); }} className="w-full h-14 rounded-2xl bg-primary text-white text-[16px] font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Ir al diario</button>
                <button onClick={() => setSelectedDay(null)} className="w-full h-12 rounded-2xl bg-transparent text-[#141118] dark:text-gray-300 text-[16px] font-bold hover:bg-black/5 transition-all">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl border-t border-black/5 pb-9 pt-4 px-10 max-w-md mx-auto z-50">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate('/chat')} className="flex flex-col items-center gap-2 w-16 text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[26px]">chat_bubble_outline</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Chat</span>
          </button>
          <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-2 w-16 text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[26px]">history_edu</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Diario</span>
          </button>
          <button className="flex flex-col items-center gap-2 w-16 text-primary">
            <span className="material-symbols-outlined text-[26px] fill-current">insights</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Insights</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default InsightsScreen;
