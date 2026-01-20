// Gemini API Service for IELTS Writing Correction

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface WordAnalysisResult {
  word: string;
  pos: string; // part of speech
  posVietnamese: string;
  meaning: string;
  meaningVietnamese: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  examples: string[];
  collocations?: string[];
  synonyms?: string[];
}

export interface SentenceAnalysisResult {
  original: string;
  corrected: string;
  translation: string;
  grammarNotes: string[];
  bandScore: number;
  improvements: string[];
  words: WordAnalysisResult[];
}

export interface IELTSCorrectionResult {
  originalText: string;
  correctedText: string;
  overallBandScore: number;
  sentences: SentenceAnalysisResult[];
  vocabularyToNote: WordAnalysisResult[]; // Từ B1+ để ghi nhớ
  generalFeedback: string;
}

export const isGeminiConfigured = (): boolean => {
  return GEMINI_API_KEY !== '' && GEMINI_API_KEY.length > 10;
};

// Analyze a single sentence
export async function analyzeSentence(sentence: string): Promise<SentenceAnalysisResult | null> {
  if (!isGeminiConfigured()) {
    console.log('Gemini API not configured, using mock data');
    return getMockSentenceAnalysis(sentence);
  }

  try {
    const prompt = `Analyze this English sentence for IELTS writing. Return JSON only, no markdown:
{
  "original": "${sentence}",
  "corrected": "corrected version for IELTS band 7+",
  "translation": "Vietnamese translation",
  "grammarNotes": ["grammar point 1", "grammar point 2"],
  "bandScore": 6.5,
  "improvements": ["improvement suggestion 1"],
  "words": [
    {
      "word": "example",
      "pos": "noun",
      "posVietnamese": "danh từ",
      "meaning": "a thing characteristic of its kind",
      "meaningVietnamese": "ví dụ, thí dụ",
      "level": "A2",
      "examples": ["This is an example."],
      "collocations": ["for example", "example of"],
      "synonyms": ["instance", "sample"]
    }
  ]
}

Sentence: "${sentence}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getMockSentenceAnalysis(sentence);
  }
}

// Correct full text for IELTS Band 7+
export async function correctForIELTS(text: string): Promise<IELTSCorrectionResult | null> {
  if (!isGeminiConfigured()) {
    console.log('Gemini API not configured');
    return getMockIELTSCorrection(text);
  }

  try {
    const prompt = `You are an IELTS writing examiner. Correct this text to achieve Band 7+.
Return JSON only, no markdown code blocks:
{
  "originalText": "original text here",
  "correctedText": "corrected IELTS Band 7+ version",
  "overallBandScore": 7.0,
  "sentences": [
    {
      "original": "original sentence",
      "corrected": "corrected sentence",
      "translation": "Vietnamese translation",
      "grammarNotes": ["present perfect used for experience"],
      "bandScore": 7.0,
      "improvements": ["added complex structure"],
      "words": [
        {
          "word": "significant",
          "pos": "adjective",
          "posVietnamese": "tính từ",
          "meaning": "sufficiently great or important",
          "meaningVietnamese": "đáng kể, quan trọng",
          "level": "B2",
          "examples": ["This is a significant improvement."],
          "collocations": ["significant impact", "significant difference"],
          "synonyms": ["important", "notable", "considerable"]
        }
      ]
    }
  ],
  "vocabularyToNote": [
    {
      "word": "significant",
      "pos": "adjective",
      "posVietnamese": "tính từ",
      "meaning": "sufficiently great or important",
      "meaningVietnamese": "đáng kể, quan trọng",
      "level": "B2",
      "examples": ["This is a significant improvement."],
      "synonyms": ["important", "notable"]
    }
  ],
  "generalFeedback": "Overall feedback about the writing"
}

Text to correct: "${text}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      // Filter vocabulary to note (B1+)
      result.vocabularyToNote = (result.vocabularyToNote || []).filter(
        (w: WordAnalysisResult) => ['B1', 'B2', 'C1', 'C2'].includes(w.level)
      );
      return result;
    }
    return null;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getMockIELTSCorrection(text);
  }
}

// Get word meaning and analysis
export async function getWordAnalysis(word: string, context?: string): Promise<WordAnalysisResult | null> {
  if (!isGeminiConfigured()) {
    return getMockWordAnalysis(word);
  }

  try {
    const prompt = `Analyze this English word. Return JSON only:
{
  "word": "${word}",
  "pos": "part of speech in English",
  "posVietnamese": "loại từ tiếng Việt",
  "meaning": "meaning in English",
  "meaningVietnamese": "nghĩa tiếng Việt chi tiết",
  "level": "CEFR level (A1/A2/B1/B2/C1/C2)",
  "examples": ["example sentence 1", "example sentence 2"],
  "collocations": ["common collocation 1", "common collocation 2"],
  "synonyms": ["synonym1", "synonym2"]
}

Word: "${word}"${context ? `\nContext: "${context}"` : ''}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getMockWordAnalysis(word);
  }
}

// Mock data when API is not available
function getMockSentenceAnalysis(sentence: string): SentenceAnalysisResult {
  const words = sentence.split(/\s+/).filter(w => w.length > 2);
  return {
    original: sentence,
    corrected: sentence,
    translation: `[Bản dịch của: ${sentence}]`,
    grammarNotes: ['Cấu trúc câu cơ bản'],
    bandScore: 6.0,
    improvements: ['Thêm từ nối để câu mạch lạc hơn'],
    words: words.slice(0, 3).map(w => getMockWordAnalysis(w.replace(/[.,!?]/g, ''))),
  };
}

function getMockIELTSCorrection(text: string): IELTSCorrectionResult {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  return {
    originalText: text,
    correctedText: text,
    overallBandScore: 6.5,
    sentences: sentences.map(s => getMockSentenceAnalysis(s.trim())),
    vocabularyToNote: [],
    generalFeedback: 'Để được đánh giá chi tiết, vui lòng cấu hình Gemini API key.',
  };
}

function getMockWordAnalysis(word: string): WordAnalysisResult {
  return {
    word,
    pos: 'unknown',
    posVietnamese: 'chưa xác định',
    meaning: `Meaning of "${word}"`,
    meaningVietnamese: `Nghĩa của từ "${word}"`,
    level: 'A2',
    examples: [`This is an example with ${word}.`],
    collocations: [],
    synonyms: [],
  };
}
