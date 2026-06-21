// Test file for emotional anticipation and intensity detection logic
const EMOTION_KEYWORDS = {
  'triste': 'Triste',
  'tristeza': 'Triste',
  'deprimido': 'Triste',
  'deprimida': 'Triste',
  'ansioso': 'Ansioso/a',
  'ansiosa': 'Ansioso/a',
  'cansado': 'Cansado/a',
  'cansada': 'Cansado/a',
  'feliz': 'Feliz',
  'contento': 'Feliz',
  'tranquilo': 'En calma'
};

const ANTICIPATION_KEYWORDS = [
  'me siento',
  'hoy me siento',
  'me he sentido',
  'últimamente me siento',
  'ando',
  'he estado',
  'estoy',
  'me pasa que',
  'siento que',
  'sentí que'
];

function normalize(text) {
  return text.toLowerCase().trim();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function detectEmotion(text) {
  const normalized = normalize(text);
  const sortedKeywords = Object.keys(EMOTION_KEYWORDS).sort((a, b) => b.length - a.length);

  // 1. Detección tradicional
  for (const keyword of sortedKeywords) {
    const regex = new RegExp(`(?:^|\\s|[.,;!?¿¡])${escapeRegex(keyword)}(?:$|\\s|[.,;!?¿¡])`, 'i');
    if (regex.test(normalized)) {
      return EMOTION_KEYWORDS[keyword];
    }
  }

  // 2. Detección con keywords anticipadoras
  const sortedAnticipators = [...ANTICIPATION_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const anticipator of sortedAnticipators) {
    const anticipatorEscaped = escapeRegex(anticipator);
    const regexStr = `(?:^|\\s|[.,;!?¿¡])${anticipatorEscaped}\\s+(?:(?:un\\s+poco|muy|super|súper|bastante|algo|realmente|harto|medio|demasiado|tan|extremadamente|plenamente|como|con|de|que|como\\s+que)\\s+)*([a-zñáéíóúü]+)`;
    const regex = new RegExp(regexStr, 'i');
    const match = normalized.match(regex);

    if (match) {
      const capturedWord = match[1].toLowerCase();
      for (const keyword of sortedKeywords) {
        if (capturedWord === keyword) {
          return EMOTION_KEYWORDS[keyword];
        }
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

function detectIntensity(text) {
  const normalized = normalize(text);

  const highIntensity = [
    'no puedo más',
    'ya no puedo',
    'me supera',
    'me sobrepasa',
    'insoportable',
    'horrible',
    'terrible',
    'demasiado',
    'me tiene agotada',
    'me tiene agotado',
    'agotador',
    'agotadora'
  ];

  const mediumHighIntensity = [
    'mucho',
    'bastante',
    'muy',
    'super',
    'súper',
    'fuerte',
    'intenso',
    'intensa',
    'pesado',
    'pesada',
    'difícil',
    'dura',
    'me cuesta mucho',
    'me tiene mal',
    'me tiene cansada',
    'me tiene cansado',
    'me cuesta'
  ];

  for (const word of highIntensity) {
    if (normalized.includes(word)) return 5;
  }

  for (const word of mediumHighIntensity) {
    if (normalized.includes(word)) return 4;
  }

  return 3;
}

const testCases = [
  { text: "Me siento deprimido por el trabajo", expectedEmotion: "Triste", expectedIntensity: 3 },
  { text: "Hoy me siento muy feliz de verte", expectedEmotion: "Feliz", expectedIntensity: 4 },
  { text: "Últimamente me he sentido súper cansada", expectedEmotion: "Cansado/a", expectedIntensity: 4 },
  { text: "Ando un poco ansioso hoy día", expectedEmotion: "Ansioso/a", expectedIntensity: 3 },
  { text: "He estado bastante deprimida por las noticias", expectedEmotion: "Triste", expectedIntensity: 4 },
  { text: "Estoy horrible y triste", expectedEmotion: "Triste", expectedIntensity: 5 },
  { text: "Me pasa que siento que estoy tranquilo", expectedEmotion: "En calma", expectedIntensity: 3 },
  { text: "Siento que no puedo más", expectedEmotion: null, expectedIntensity: 5 },
  { text: "Esto me supera y me tiene agotado", expectedEmotion: null, expectedIntensity: 5 },
  { text: "Me he sentido tristísima estos días", expectedEmotion: "Triste", expectedIntensity: 3 },
  { text: "Ando preocupadísima con los exámenes", expectedEmotion: null, expectedIntensity: 3 },
  { text: "El carro está pintado de azul", expectedEmotion: null, expectedIntensity: 3 },
  { text: "Me siento a comer un pan", expectedEmotion: null, expectedIntensity: 3 }
];

let passed = 0;
for (const tc of testCases) {
  const emotion = detectEmotion(tc.text);
  const intensity = detectIntensity(tc.text);
  const emotionOk = emotion === tc.expectedEmotion;
  const intensityOk = intensity === tc.expectedIntensity;
  if (emotionOk && intensityOk) {
    console.log(`✅ PASSED: "${tc.text}" -> Emotion: ${emotion}, Intensity: ${intensity}`);
    passed++;
  } else {
    console.error(`❌ FAILED: "${tc.text}". Expected Emotion: "${tc.expectedEmotion}" (got "${emotion}"), Intensity: ${tc.expectedIntensity} (got ${intensity})`);
  }
}
console.log(`\nResults: ${passed}/${testCases.length} passed.`);
