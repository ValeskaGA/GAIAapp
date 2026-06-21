// ─── Emotional Moment Detector ─────────────────────────────────────
// Servicio puro (sin React). Analiza mensajes del chat para detectar
// momentos emocionales relevantes usando heurística de keywords.
// Preparado para reemplazar por análisis LLM en el futuro.
// ────────────────────────────────────────────────────────────────────

// ─── Tipos ─────────────────────────────────────────────────────────

/** Resultado del análisis de un solo mensaje del usuario */
export interface MessageAnalysis {
  isRelevant: boolean;
  isFarewell: boolean;
  emotion: string | null;
  cause: string | null;
  consequence: string | null;
  pattern: string | null;
  intensity: number;
}

/** Momento emocional listo para guardarse */
export interface EmotionalMoment {
  emotion: string;
  cause: string;
  consequence: string | null;
  noteBrief: string;
  detectedAt: Date;
  intensity: number;
}

/** Momento guardado o descartado en la sesión actual */
export interface SavedMoment extends EmotionalMoment {
  discarded: boolean;
}

import {
  EMOTION_KEYWORDS,
  CAUSE_PATTERNS,
  CONSEQUENCE_PATTERNS,
  PATTERN_KEYWORDS,
  FAREWELL_PATTERNS,
  ANTICIPATION_KEYWORDS,
  HIGH_INTENSIFIERS,
  MEDIUM_HIGH_INTENSIFIERS,
  CONNECTORS,
} from "./emotionalKeywords";

// ─── Funciones de detección ────────────────────────────────────────

/**
 * Normaliza texto para comparación: minúsculas, sin acentos innecesarios
 * para algunos patrones, pero conserva acentos en keywords definidas.
 */
function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Busca la primera keyword de emoción que aparezca en el texto.
 * Retorna la emoción normalizada o null.
 */
function detectEmotion(text: string): string | null {
  const normalized = normalize(text);
  // Sort by length descending to match longer phrases first (e.g. "en paz" before "paz")
  const sortedKeywords = Object.keys(EMOTION_KEYWORDS).sort((a, b) => b.length - a.length);

  // 1. Detección tradicional (coincidencia exacta en EMOTION_KEYWORDS)
  for (const keyword of sortedKeywords) {
    // Word boundary check: ensure the keyword isn't part of a larger word
    const regex = new RegExp(`(?:^|\\s|[.,;!?¿¡])${escapeRegex(keyword)}(?:$|\\s|[.,;!?¿¡])`, 'i');
    if (regex.test(normalized)) {
      return EMOTION_KEYWORDS[keyword];
    }
  }

  // 2. Detección con keywords anticipadoras (cuando la emoción viene precedida por expresiones como 'me siento', 'ando', etc.)
  const sortedAnticipators = [...ANTICIPATION_KEYWORDS].sort((a, b) => b.length - a.length);
  const modifierList = [...HIGH_INTENSIFIERS, ...MEDIUM_HIGH_INTENSIFIERS, ...CONNECTORS];
  const modifierSubpattern = modifierList
    .map(m => escapeRegex(m))
    .sort((a, b) => b.length - a.length)
    .join('|');

  for (const anticipator of sortedAnticipators) {
    const anticipatorEscaped = escapeRegex(anticipator);
    // Regex que busca la keyword anticipadora y captura la palabra que le sigue,
    // omitiendo modificadores e intensificadores dinámicamente cargados
    const regexStr = `(?:^|\\s|[.,;!?¿¡])${anticipatorEscaped}\\s+(?:(?:${modifierSubpattern})\\s+)*([a-zñáéíóúü]+)`;
    const regex = new RegExp(regexStr, 'i');
    const match = normalized.match(regex);

    if (match) {
      const capturedWord = match[1].toLowerCase();
      // Buscamos si la palabra capturada coincide exactamente o comparte la raíz con alguna keyword conocida
      for (const keyword of sortedKeywords) {
        if (capturedWord === keyword) {
          return EMOTION_KEYWORDS[keyword];
        }
        // Coincidencia por raíz para tolerar sufijos (ej. 'deprimidísima' -> 'deprimida', 'tristísimo' -> 'triste')
        if (keyword.length >= 4 && capturedWord.length >= 4) {
          const rootLength = Math.min(keyword.length - 1, 6);
          const keywordRoot = keyword.substring(0, rootLength);
          if (capturedWord.startsWith(keywordRoot) || keyword.startsWith(capturedWord)) {
            return EMOTION_KEYWORDS[keyword];
          }
        }
      }
    }
  }

  return null;
}

/**
 * Busca patrones de causa/contexto en el texto.
 * Retorna el fragmento relevante o null.
 */
function detectCause(text: string): string | null {
  const normalized = normalize(text);
  for (const pattern of CAUSE_PATTERNS) {
    const idx = normalized.indexOf(pattern);
    if (idx !== -1) {
      // Extract a snippet around the cause pattern (up to 60 chars after)
      const start = idx;
      const snippet = text.substring(start, start + pattern.length + 60).trim();
      // Clean up: take until end of sentence or max length
      const endMatch = snippet.match(/[.!?\n]/);
      return endMatch ? snippet.substring(0, endMatch.index! + 1).trim() : snippet.trim();
    }
  }
  return null;
}

/**
 * Busca patrones de consecuencia en el texto.
 */
function detectConsequence(text: string): string | null {
  const normalized = normalize(text);
  for (const pattern of CONSEQUENCE_PATTERNS) {
    if (normalized.includes(pattern)) {
      return pattern;
    }
  }
  return null;
}

/**
 * Busca patrones de repetición/patrón en el texto.
 */
function detectPattern(text: string): string | null {
  const normalized = normalize(text);
  for (const pattern of PATTERN_KEYWORDS) {
    if (normalized.includes(pattern)) {
      return pattern;
    }
  }
  return null;
}

/**
 * Detecta si el mensaje es una despedida.
 */
function detectFarewell(text: string): boolean {
  const normalized = normalize(text);
  // Farewell messages tend to be short, so also check length
  return FAREWELL_PATTERNS.some(pattern => normalized.includes(pattern));
}

/**
 * Detecta la intensidad emocional (1-5) según intensificadores de HIGH_INTENSIFIERS y MEDIUM_HIGH_INTENSIFIERS.
 */
function detectIntensity(text: string): number {
  const normalized = normalize(text);

  // Comprobar primero intensidad alta (5)
  for (const word of HIGH_INTENSIFIERS) {
    if (normalized.includes(word)) return 5;
  }

  // Comprobar intensidad media-alta (4)
  for (const word of MEDIUM_HIGH_INTENSIFIERS) {
    if (normalized.includes(word)) return 4;
  }

  return 3; // Nivel base por defecto
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── API Pública ───────────────────────────────────────────────────

/**
 * Analiza un mensaje individual del usuario.
 * Clasifica en: emoción, causa, consecuencia, patrón, despedida, intensidad.
 */
export function analyzeMessage(text: string): MessageAnalysis {
  const emotion = detectEmotion(text);
  const cause = detectCause(text);
  const consequence = detectConsequence(text);
  const pattern = detectPattern(text);
  const isFarewell = detectFarewell(text);
  const intensity = detectIntensity(text);

  const isRelevant = !!(emotion || cause || consequence || pattern);

  return { isRelevant, isFarewell, emotion, cause, consequence, pattern, intensity };
}

/**
 * Evalúa una ventana de hasta 3 mensajes relevantes.
 * Retorna un EmotionalMoment si hay emoción + causa/contexto suficiente.
 * Retorna null si no hay suficiente material.
 */
export function evaluateWindow(
  analyses: MessageAnalysis[],
  isFarewell: boolean = false,
): EmotionalMoment | null {
  if (analyses.length === 0) return null;

  // Aggregate signals from the entire window
  let dominantEmotion: string | null = null;
  let bestCause: string | null = null;
  let bestConsequence: string | null = null;
  let bestPattern: string | null = null;
  let maxIntensity = 3;

  // Count emotion occurrences to find dominant
  const emotionCounts: Record<string, number> = {};

  for (const a of analyses) {
    if (a.emotion) {
      emotionCounts[a.emotion] = (emotionCounts[a.emotion] || 0) + 1;
    }
    if (a.cause && !bestCause) bestCause = a.cause;
    if (a.consequence && !bestConsequence) bestConsequence = a.consequence;
    if (a.pattern && !bestPattern) bestPattern = a.pattern;
    if (a.intensity > maxIntensity) maxIntensity = a.intensity;
  }

  // Find dominant emotion (most frequent)
  let maxCount = 0;
  for (const [emotion, count] of Object.entries(emotionCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantEmotion = emotion;
    }
  }

  // Must have emotion; cause is required unless it's a farewell
  if (!dominantEmotion) return null;
  if (!bestCause && !isFarewell) return null;

  // For farewell without explicit cause, use a generic context
  const effectiveCause = bestCause || 'la conversación de hoy';
  const noteBrief = buildNoteBrief(dominantEmotion, effectiveCause, bestConsequence, bestPattern);

  return {
    emotion: dominantEmotion,
    cause: effectiveCause,
    consequence: bestConsequence,
    noteBrief,
    detectedAt: new Date(),
    intensity: maxIntensity,
  };
}

/**
 * Verifica si un momento es duplicado de alguno ya guardado o descartado.
 * Compara emoción + similaridad de causa.
 */
export function isDuplicate(moment: EmotionalMoment, saved: SavedMoment[]): boolean {
  return saved.some(prev => {
    const sameEmotion = prev.emotion === moment.emotion;
    const similarCause = areSimilar(prev.cause, moment.cause);
    return sameEmotion && similarCause;
  });
}

/**
 * Compara dos textos de causa/contexto por overlap de palabras significativas.
 * Retorna true si hay > 50% de overlap.
 */
function areSimilar(a: string, b: string): boolean {
  const wordsA = extractSignificantWords(a);
  const wordsB = extractSignificantWords(b);

  if (wordsA.length === 0 || wordsB.length === 0) return false;

  const setA = new Set(wordsA);
  const overlap = wordsB.filter(w => setA.has(w)).length;
  const minLen = Math.min(wordsA.length, wordsB.length);

  return overlap / minLen > 0.5;
}

/**
 * Extrae palabras significativas (> 3 caracteres) de un texto.
 */
function extractSignificantWords(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter(w => w.length > 3)
    .map(w => w.replace(/[.,;!?¿¡]/g, ''));
}

// ─── Generación de noteBrief ───────────────────────────────────────

/**
 * Construye un resumen natural del momento emocional basado en las señales detectadas.
 * Selecciona una plantilla según qué campos están disponibles.
 */
function buildNoteBrief(
  emotion: string,
  cause: string,
  consequence: string | null,
  pattern: string | null,
): string {
  // Clean cause: remove leading "porque", "por culpa de", etc.
  const cleanCause = cleanCauseText(cause);

  // Select template based on available signals
  if (pattern && consequence) {
    return pickRandom([
      `${emotion} recurrente asociada a ${cleanCause}, afectando ${consequence}`,
    ]);
  }

  if (pattern) {
    return pickRandom([
      `${emotion} repetida en situaciones de ${cleanCause}`,
      `${emotion} recurrente asociada a ${cleanCause}`,
    ]);
  }

  if (consequence) {
    return pickRandom([
      `${emotion} que está afectando ${consequence}`,
      `${emotion} con impacto en ${consequence}`,
      `${emotion} por ${cleanCause}, afectando ${consequence}`,
    ]);
  }

  // Emotion + cause (most common case)
  return pickRandom([
    `${emotion} asociada a ${cleanCause}`,
    `${emotion} relacionada con ${cleanCause}`,
    `${emotion} vinculada a ${cleanCause}`,
  ]);
}

/**
 * Limpia el texto de causa removiendo prefijos comunes.
 */
function cleanCauseText(cause: string): string {
  return cause
    .replace(/^(porque|por culpa de|debido a|por)\s+/i, '')
    .replace(/[.!?]+$/, '')
    .trim();
}

/**
 * Selecciona un elemento aleatorio de un array.
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
