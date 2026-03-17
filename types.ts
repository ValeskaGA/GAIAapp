
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
  PRO = 'gemini-3-flash-preview',
  FLASH = 'gemini-flash-lite-latest'
}

export interface EmotionalEntry {
  id: string;
  user_id: string;
  created_at: string;
  emotion: string;
  intensity: number;
  context: string | null;
  cause: string | null;
  summary: string | null;
  source: 'chat' | 'manual';
}
