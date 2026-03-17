
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
  PRO = 'gemini-3.1-flash',
  FLASH = 'gemini-flash-lite-latest'
}
