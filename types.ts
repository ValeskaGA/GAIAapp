
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
  cause?: string | null;
  consequence?: string | null;
  source?: string | null;
}

export enum ModelType {
  PRO = 'gemini-3-flash-preview',
  FLASH = 'gemini-flash-lite-latest'
}

export interface EmotionalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  emotion: string;
  intensity: number; // Escala 1-10
  place: string | null;
  cause: string | null;
  consequence: string | null;
  note_brief: string | null;
  source: string;
  created_at: string;
}
