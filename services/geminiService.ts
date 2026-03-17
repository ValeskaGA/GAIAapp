
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ModelType } from "../types";

export class GeminiService {
  private chat: Chat | null = null;
  private currentModel: ModelType = ModelType.PRO;

  private getAIInstance() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async startNewChat(model: ModelType = ModelType.PRO) {
    this.currentModel = model;
    const ai = this.getAIInstance();
    this.chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `Eres GAIA, un espacio tranquilo y seguro para el bienestar emocional. 
        Tu objetivo es ser un diario conversacional empático, sin juicios y reflexivo. 
        Ayuda al usuario a procesar sus emociones, no des consejos médicos ni diagnósticos. 
        Si el usuario está en crisis, recuérdale con mucha suavidad que eres una IA y que existen líneas de ayuda profesional.
        Sé breve, cálido y utiliza un lenguaje natural y cercano.`,
      },
    });
    return this.chat;
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      await this.startNewChat(this.currentModel);
    }

    try {
      const response: GenerateContentResponse = await this.chat!.sendMessage({ message });
      return response.text || "Lo siento, tuve un problema procesando eso. ¿Podrías repetirlo?";
    } catch (error) {
      console.error("Gemini API Error:", error);
      console.error("Detalles:", JSON.stringify(error, null, 2));
      return "Hubo un error al conectar con GAIA. Por favor, intenta de nuevo.";
    }
  }

  async *sendMessageStream(message: string) {
    if (!this.chat) {
      await this.startNewChat(this.currentModel);
    }

    try {
      const stream = await this.chat!.sendMessageStream({ message });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error) {
      console.error("Gemini API Stream Error:", error);
      console.error("Detalles:", JSON.stringify(error, null, 2));
      yield "Error de conexión.";
    }
  }
}

export const geminiService = new GeminiService();
