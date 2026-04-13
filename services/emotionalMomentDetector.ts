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
}

/** Momento emocional listo para guardarse */
export interface EmotionalMoment {
  emotion: string;
  cause: string;
  noteBrief: string;
  detectedAt: Date;
}

/** Momento guardado o descartado en la sesión actual */
export interface SavedMoment extends EmotionalMoment {
  discarded: boolean;
}

// ─── Keywords por categoría (español) ──────────────────────────────

const EMOTION_KEYWORDS: Record<string, string> = {
  // keyword → emoción normalizada (mapea a EMOTION_ICON_MAP en useHistory)
  'triste': 'Triste',
  'tristeza': 'Triste',
  'llorar': 'Triste',
  'lloro': 'Triste',
  'ansioso': 'Ansioso/a',
  'ansiosa': 'Ansioso/a',
  'ansiedad': 'Ansioso/a',
  'nervioso': 'Ansioso/a',
  'nerviosa': 'Ansioso/a',
  'angustia': 'Ansioso/a',
  'angustiado': 'Ansioso/a',
  'angustiada': 'Ansioso/a',
  'frustrado': 'Inquieto/a',
  'frustrada': 'Inquieto/a',
  'frustración': 'Inquieto/a',
  'enojado': 'Inquieto/a',
  'enojada': 'Inquieto/a',
  'enojo': 'Inquieto/a',
  'rabia': 'Inquieto/a',
  'molesto': 'Inquieto/a',
  'molesta': 'Inquieto/a',
  'solo': 'Un poco bajo/a',
  'sola': 'Un poco bajo/a',
  'soledad': 'Un poco bajo/a',
  'vacío': 'Un poco bajo/a',
  'vacía': 'Un poco bajo/a',
  'miedo': 'Ansioso/a',
  'culpa': 'Un poco bajo/a',
  'culpable': 'Un poco bajo/a',
  'agotado': 'Cansado/a',
  'agotada': 'Cansado/a',
  'cansado': 'Cansado/a',
  'cansada': 'Cansado/a',
  'cansancio': 'Cansado/a',
  'agotamiento': 'Cansado/a',
  'estresado': 'Inquieto/a',
  'estresada': 'Inquieto/a',
  'estrés': 'Inquieto/a',
  'abrumado': 'Inquieto/a',
  'abrumada': 'Inquieto/a',
  'confundido': 'Inquieto/a',
  'confundida': 'Inquieto/a',
  'feliz': 'Feliz',
  'felicidad': 'Feliz',
  'contento': 'Feliz',
  'contenta': 'Feliz',
  'alegría': 'Feliz',
  'alegre': 'Feliz',
  'tranquilo': 'En calma',
  'tranquila': 'En calma',
  'en paz': 'En calma',
  'calma': 'Calma',
  'esperanza': 'En calma',
  'agradecido': 'Feliz',
  'agradecida': 'Feliz',
  'bien': 'En calma',
  'mal': 'Un poco bajo/a',
  'terrible': 'Triste',
  'fatal': 'Un poco bajo/a',
  'deprimido': 'Triste',
  'deprimida': 'Triste',
  'inseguro': 'Ansioso/a',
  'insegura': 'Ansioso/a',
  'desmotivado': 'Cansado/a',
  'desmotivada': 'Cansado/a',
};

const CAUSE_PATTERNS: string[] = [
  'porque', 'por culpa', 'debido a', 'me pasó', 'me pasa',
  'en el trabajo', 'en la oficina', 'con mi jefe', 'con mi pareja',
  'con mi familia', 'con mi mamá', 'con mi papá', 'con mi hermano',
  'con mi hermana', 'con mi hijo', 'con mi hija', 'con mis amigos',
  'hoy me', 'ayer me', 'nos peleamos', 'me dijo que', 'me hizo sentir',
  'la relación', 'el dinero', 'la plata', 'las deudas', 'la universidad',
  'el estudio', 'los exámenes', 'la escuela', 'el colegio',
  'mi salud', 'el médico', 'el doctor',
];

const CONSEQUENCE_PATTERNS: string[] = [
  'no puedo dormir', 'no duermo', 'no como', 'no quiero comer',
  'lloro', 'me paralizo', 'exploto', 'me alejo', 'me aíslo',
  'me cuesta concentrar', 'no me concentro', 'me duele',
  'no tengo energía', 'no tengo ganas', 'no quiero hacer nada',
  'me afecta', 'me está afectando',
];

const PATTERN_KEYWORDS: string[] = [
  'siempre que', 'cada vez que', 'últimamente', 'otra vez',
  'como siempre', 'me pasa seguido', 'es la tercera vez',
  'de nuevo', 'todo el tiempo', 'nunca cambia', 'sigue pasando',
  'ya no sé qué hacer', 'ya estoy harto', 'ya estoy harta',
  'siempre es lo mismo', 'siempre pasa', 'no es la primera vez',
];

const FAREWELL_PATTERNS: string[] = [
  'chao', 'me voy', 'gracias por escuchar', 'hablamos',
  'nos vemos', 'hasta luego', 'bye', 'adiós', 'adios',
  'buenas noches', 'hablamos después', 'te cuento luego',
  'me tengo que ir', 'ya me voy', 'hasta mañana',
  'cuídate', 'gracias gaia', 'eso era todo', 'era eso',
];

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

  for (const keyword of sortedKeywords) {
    // Word boundary check: ensure the keyword isn't part of a larger word
    const regex = new RegExp(`(?:^|\\s|[.,;!?¿¡])${escapeRegex(keyword)}(?:$|\\s|[.,;!?¿¡])`, 'i');
    if (regex.test(normalized)) {
      return EMOTION_KEYWORDS[keyword];
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

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── API Pública ───────────────────────────────────────────────────

/**
 * Analiza un mensaje individual del usuario.
 * Clasifica en: emoción, causa, consecuencia, patrón, despedida.
 */
export function analyzeMessage(text: string): MessageAnalysis {
  const emotion = detectEmotion(text);
  const cause = detectCause(text);
  const consequence = detectConsequence(text);
  const pattern = detectPattern(text);
  const isFarewell = detectFarewell(text);

  const isRelevant = !!(emotion || cause || consequence || pattern);

  return { isRelevant, isFarewell, emotion, cause, consequence, pattern };
}

/**
 * Evalúa una ventana de hasta 4 mensajes relevantes.
 * Retorna un EmotionalMoment si hay emoción + causa/contexto suficiente.
 * Retorna null si no hay suficiente material.
 */
export function evaluateWindow(analyses: MessageAnalysis[]): EmotionalMoment | null {
  if (analyses.length === 0) return null;

  // Aggregate signals from the entire window
  let dominantEmotion: string | null = null;
  let bestCause: string | null = null;
  let bestConsequence: string | null = null;
  let bestPattern: string | null = null;

  // Count emotion occurrences to find dominant
  const emotionCounts: Record<string, number> = {};

  for (const a of analyses) {
    if (a.emotion) {
      emotionCounts[a.emotion] = (emotionCounts[a.emotion] || 0) + 1;
    }
    if (a.cause && !bestCause) bestCause = a.cause;
    if (a.consequence && !bestConsequence) bestConsequence = a.consequence;
    if (a.pattern && !bestPattern) bestPattern = a.pattern;
  }

  // Find dominant emotion (most frequent)
  let maxCount = 0;
  for (const [emotion, count] of Object.entries(emotionCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantEmotion = emotion;
    }
  }

  // Must have emotion + at least cause/context
  if (!dominantEmotion || !bestCause) {
    return null;
  }

  const noteBrief = buildNoteBrief(dominantEmotion, bestCause, bestConsequence, bestPattern);

  return {
    emotion: dominantEmotion,
    cause: bestCause,
    noteBrief,
    detectedAt: new Date(),
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
