import React, { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { geminiService } from '../services/geminiService';
import { Message, ModelType } from '../types';
import { useConsent } from './useConsent';
import { useAuth } from './AuthContext';
import {
  analyzeMessage,
  evaluateWindow,
  isDuplicate,
  type MessageAnalysis,
  type EmotionalMoment,
  type SavedMoment,
} from '../services/emotionalMomentDetector';

// ─── Types ─────────────────────────────────────────────────────────

export interface ChatContextType {
  messages: Message[];
  input: string;
  isLoading: boolean;
  modelType: ModelType;
  pendingSuggestion: EmotionalMoment | null;
  setInput: (text: string) => void;
  sendMessage: (text: string) => Promise<void>;
  toggleModel: () => void;
  clearChat: () => void;
  acceptSuggestion: () => void;
  declineSuggestion: () => void;
  /** Register the addEntry function from useHistory */
  registerAddEntry: (fn: (entry: any) => void) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ─── Welcome message ───────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: '1',
  role: 'model',
  text: 'Hola. Soy GAIA, tu espacio de tranquilidad. Estoy aquí para escucharte sin juicios. ¿Cómo te sientes hoy?',
  timestamp: new Date(),
};

// ─── Provider ──────────────────────────────────────────────────────

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ── Core chat state ──────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState<ModelType>(ModelType.PRO);

  // ── Emotional detection state ────────────────────────────────────
  const [pendingSuggestion, setPendingSuggestion] = useState<EmotionalMoment | null>(null);
  const analysisWindowRef = useRef<MessageAnalysis[]>([]);
  const savedMomentsRef = useRef<SavedMoment[]>([]);
  const pendingMomentRef = useRef<EmotionalMoment | null>(null);

  // ── External hooks ───────────────────────────────────────────────
  const { autoSaveEnabled } = useConsent();
  const autoSaveRef = useRef(autoSaveEnabled);
  useEffect(() => { autoSaveRef.current = autoSaveEnabled; }, [autoSaveEnabled]);

  const { onSignOut } = useAuth();

  // ── Ref to hold the addEntry callback (registered by App) ────────
  const addEntryRef = useRef<((entry: any) => void) | null>(null);

  const registerAddEntry = useCallback((fn: (entry: any) => void) => {
    addEntryRef.current = fn;
  }, []);

  // ── Helper: add a system/GAIA message ────────────────────────────
  const addGaiaMessage = useCallback((text: string) => {
    const msg: Message = {
      id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'model',
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  // ── Save a detected moment to history ────────────────────────────
  const saveMoment = useCallback((moment: EmotionalMoment) => {
    if (addEntryRef.current) {
      addEntryRef.current({
        mood: moment.emotion,
        text: moment.noteBrief,
        intensity: 3,
        cause: moment.cause,
        consequence: moment.consequence,
        source: 'chat',
      });
      console.log('🌿 [ChatContext] Momento emocional guardado:', moment.emotion, '—', moment.noteBrief);
    } else {
      console.warn('⚠️ [ChatContext] addEntry no registrado, momento no guardado.');
    }
    savedMomentsRef.current = [
      ...savedMomentsRef.current,
      { ...moment, discarded: false },
    ];
  }, []);

  // ── Handle a detected emotional moment ───────────────────────────
  const handleDetectedMoment = useCallback((moment: EmotionalMoment) => {
    if (autoSaveRef.current) {
      // Auto-save ON: inform → save → confirm
      addGaiaMessage('🌿 Esto podría decir algo importante sobre lo que estás viviendo…');
      setTimeout(() => {
        saveMoment(moment);
        addGaiaMessage('📝 Guardé este momento en tu historial.');
      }, 1500);
    } else {
      // Auto-save OFF: show suggestion with buttons
      pendingMomentRef.current = moment;
      setPendingSuggestion(moment);
    }
    // Reset window
    analysisWindowRef.current = [];
  }, [addGaiaMessage, saveMoment]);

  // ── User accepts the suggestion ──────────────────────────────────
  const acceptSuggestion = useCallback(() => {
    const moment = pendingMomentRef.current;
    if (moment) {
      saveMoment(moment);
      addGaiaMessage('📝 Guardé este momento en tu historial.');
    }
    pendingMomentRef.current = null;
    setPendingSuggestion(null);
  }, [saveMoment, addGaiaMessage]);

  // ── User declines the suggestion ─────────────────────────────────
  const declineSuggestion = useCallback(() => {
    const moment = pendingMomentRef.current;
    if (moment) {
      savedMomentsRef.current = [
        ...savedMomentsRef.current,
        { ...moment, discarded: true },
      ];
    }
    pendingMomentRef.current = null;
    setPendingSuggestion(null);
  }, []);

  // ── Process emotional detection after message ────────────────────
  const processEmotionalDetection = useCallback((userText: string) => {
    const analysis = analyzeMessage(userText);
    const detectedFarewell = analysis.isFarewell;

    console.log('🔍 [EmotionalDetection] analysis:', JSON.stringify(analysis));

    if (analysis.isRelevant) {
      // Keep max 3 in window (FIFO)
      analysisWindowRef.current = [
        ...analysisWindowRef.current.slice(-2),
        analysis,
      ];
    }

    const updatedWindow = analysisWindowRef.current;
    const windowFull = updatedWindow.length >= 3;
    const shouldEvaluate = windowFull || detectedFarewell;

    console.log('🔍 [EmotionalDetection] updatedWindow:', JSON.stringify(updatedWindow));
    console.log('🔍 [EmotionalDetection] windowFull:', windowFull, '| isFarewell:', detectedFarewell, '| shouldEvaluate:', shouldEvaluate);

    if (shouldEvaluate) {
      const moment = evaluateWindow(updatedWindow, detectedFarewell);

      console.log('🔍 [EmotionalDetection] moment:', JSON.stringify(moment));
      console.log('🔍 [EmotionalDetection] autoSaveEnabled:', autoSaveRef.current);

      if (moment && !isDuplicate(moment, savedMomentsRef.current)) {
        // Delay so it appears after GAIA's streaming response
        setTimeout(() => handleDetectedMoment(moment), 800);
      } else {
        console.log('🔍 [EmotionalDetection] No moment generated or duplicate. Resetting:', windowFull);
        // No valid moment or duplicate — reset window if full
        if (windowFull) {
          analysisWindowRef.current = [];
        }
      }
    }
  }, [handleDetectedMoment]);

  // ── Send message (main flow) ─────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let modelResponseText = '';
      const responseStream = geminiService.sendMessageStream(text);

      const modelMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        text: '',
        timestamp: new Date(),
      }]);

      for await (const chunk of responseStream) {
        modelResponseText += chunk;
        setMessages(prev => prev.map(msg =>
          msg.id === modelMessageId ? { ...msg, text: modelResponseText } : msg
        ));
      }

      // After GAIA finishes responding, run emotional detection
      processEmotionalDetection(text);
    } catch (error) {
      console.error('[ChatContext] Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, processEmotionalDetection]);

  // ── Toggle model ─────────────────────────────────────────────────
  const toggleModel = useCallback(() => {
    const nextModel = modelType === ModelType.PRO ? ModelType.FLASH : ModelType.PRO;
    setModelType(nextModel);
    geminiService.startNewChat(nextModel);
  }, [modelType]);

  // ── Clear chat (for logout / reset) ──────────────────────────────
  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setInput('');
    setIsLoading(false);
    setPendingSuggestion(null);
    pendingMomentRef.current = null;
    analysisWindowRef.current = [];
    savedMomentsRef.current = [];
    geminiService.resetChat();
    console.log('🔄 [ChatContext] Chat reiniciado.');
  }, []);

  // ── Register clearChat to run on sign out ────────────────────────
  useEffect(() => {
    onSignOut(clearChat);
  }, [onSignOut, clearChat]);

  const value: ChatContextType = {
    messages,
    input,
    isLoading,
    modelType,
    pendingSuggestion,
    setInput,
    sendMessage,
    toggleModel,
    clearChat,
    acceptSuggestion,
    declineSuggestion,
    registerAddEntry,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────

export const useChatContext = (): ChatContextType => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return ctx;
};
