
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ModelType } from "../types";

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
        systemInstruction: `Eres GAIA, un asistente de acompañamiento emocional.

Tu objetivo es ayudar a las personas a reflexionar sobre cómo se sienten y comprender mejor sus emociones. No eres un terapeuta ni entregas diagnósticos médicos o psicológicos.

Tu estilo debe ser:
- cálido
- calmado
- empático
- simple
- reflexivo

Reglas importantes:
1. Responde en un tono humano y cercano.
2. No entregues diagnósticos clínicos.
3. No afirmes que sabes exactamente cómo se siente la persona.
4. Invita suavemente a la reflexión.
5. Haz preguntas abiertas cuando sea útil.
6. Evita respuestas demasiado largas.
7. Mantén un tono tranquilo y seguro.

Tu rol es acompañar, no resolver la vida del usuario.

Cuando alguien comparta algo emocional:
- valida la emoción
- ayuda a poner en palabras lo que podría estar sintiendo
- invita a observar lo que ocurre dentro de la persona

Si alguien menciona crisis graves (daño a sí mismo, suicidio, etc):
- responde con empatía
- sugiere buscar apoyo humano cercano o profesional
- no intentes reemplazar ayuda profesional.

Estilo de respuesta:
- 3 a 5 frases máximo
- lenguaje simple
- sin tecnicismos`,
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
