
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ModelType } from "../types";
import {
  GEMINI_SYSTEM_INSTRUCTION,
  SIMPLE_FAREWELL_PATTERNS,
  FAREWELL_RESPONSES,
} from "./geminiPrompt";

function isFarewellMessage(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return SIMPLE_FAREWELL_PATTERNS.some(p => normalized.includes(p));
}

function getRandomFarewellResponse(): string {
  return FAREWELL_RESPONSES[Math.floor(Math.random() * FAREWELL_RESPONSES.length)];
}

// ─── Error helpers ───────────────────────────────────────────────
function getUserFriendlyError(error: any): string {
  const status = error?.status || error?.code;
  if (status === 429) {
    return 'GAIA necesita un momento para recuperar energía. Intenta de nuevo en unos minutos. 💜';
  }
  if (status === 503 || status === 500) {
    return 'El servicio está temporalmente inestable. Intenta de nuevo en un momento.';
  }
  return 'Hubo un problema al conectar con GAIA. Intenta de nuevo en unos segundos.';
}

// ─── Service ─────────────────────────────────────────────────────

export class GeminiService {
  private chat: Chat | null = null;
  private currentModel: ModelType = ModelType.PRO;

  private getAIInstance() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("Gemini key loaded:", import.meta.env.VITE_GEMINI_API_KEY ? "YES" : "NO");
    return new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async startNewChat(model: ModelType = ModelType.PRO) {
    this.currentModel = model;
    const ai = this.getAIInstance();
    this.chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
      },
    });
    return this.chat;
  }

  /** Resets the chat session so the next message starts a fresh conversation */
  resetChat() {
    this.chat = null;
  }

  async sendMessage(message: string): Promise<string> {
    const isActive = import.meta.env.VITE_GEMINI_SERVICE_ACTIVE !== 'false';
    if (!isActive) {
      return "El servicio de Gemini está desactivado en la configuración.";
    }

    // Farewell fallback: skip API call for simple goodbyes
    if (isFarewellMessage(message)) {
      return getRandomFarewellResponse();
    }

    if (!this.chat) {
      await this.startNewChat(this.currentModel);
    }

    try {
      const response: GenerateContentResponse = await this.chat!.sendMessage({ message });
      return response.text || "Lo siento, tuve un problema procesando eso. ¿Podrías repetirlo?";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      console.error("Detalles:", JSON.stringify(error, null, 2));
      return getUserFriendlyError(error);
    }
  }

  async *sendMessageStream(message: string) {
    const isActive = import.meta.env.VITE_GEMINI_SERVICE_ACTIVE !== 'false';
    if (!isActive) {
      yield "El servicio de Gemini está desactivado en la configuración.";
      return;
    }

    // Farewell fallback: skip API call for simple goodbyes
    if (isFarewellMessage(message)) {
      yield getRandomFarewellResponse();
      return;
    }

    if (!this.chat) {
      await this.startNewChat(this.currentModel);
    }

    try {
      const stream = await this.chat!.sendMessageStream({ message });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error: any) {
      console.error("Gemini API Stream Error:", error);
      console.error("Detalles:", JSON.stringify(error, null, 2));
      yield getUserFriendlyError(error);
    }
  }
}

export const geminiService = new GeminiService();
