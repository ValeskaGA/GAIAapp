
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface EmotionEntry {
  id: string;
  date: string;
  mood: string;
  icon: string;
  color: string;
  text: string;
  timestamp: Date;
  intensity?: number; // Escala 1-5 para el gráfico
}

export enum ModelType {
  PRO = 'gemini-3-pro-preview',
  FLASH = 'gemini-flash-lite-latest'
}
