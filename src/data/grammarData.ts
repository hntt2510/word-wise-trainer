import { GrammarPattern, GrammarExample, WordAnalysis } from '@/types/lesson';

// Các mẫu ngữ pháp phổ biến
export const grammarPatterns: Record<string, GrammarPattern> = {
  'present_simple': {
    id: 'present_simple',
    name: 'Present Simple Tense',
    pattern: 'S + V(s/es) + O',
    explanation: 'Used for habits, general truths, and regular actions',
    vietnamese_explanation: 'Thì hiện tại đơn - dùng cho thói quen, sự thật chung, hành động thường xuyên',
    examples: [
      { sentence: 'She works at a hospital.', translation: 'Cô ấy làm việc ở bệnh viện.', highlight: 'works' },
      { sentence: 'The sun rises in the east.', translation: 'Mặt trời mọc ở hướng đông.', highlight: 'rises' },
      { sentence: 'I drink coffee every morning.', translation: 'Tôi uống cà phê mỗi sáng.', highlight: 'drink' },
    ],
    related_patterns: ['present_continuous', 'simple_past'],
  },
  
  'present_continuous': {
    id: 'present_continuous',
    name: 'Present Continuous Tense',
    pattern: 'S + am/is/are + V-ing',
    explanation: 'Used for actions happening now or temporary situations',
    vietnamese_explanation: 'Thì hiện tại tiếp diễn - dùng cho hành động đang xảy ra hoặc tình huống tạm thời',
    examples: [
      { sentence: 'I am studying English now.', translation: 'Tôi đang học tiếng Anh.', highlight: 'am studying' },
      { sentence: 'They are playing football.', translation: 'Họ đang chơi bóng đá.', highlight: 'are playing' },
      { sentence: 'She is living in Paris temporarily.', translation: 'Cô ấy đang sống ở Paris tạm thời.', highlight: 'is living' },
    ],
    related_patterns: ['present_simple', 'past_continuous'],
  },

  'simple_past': {
    id: 'simple_past',
    name: 'Simple Past Tense',
    pattern: 'S + V-ed/V2 + O',
    explanation: 'Used for completed actions in the past',
    vietnamese_explanation: 'Thì quá khứ đơn - dùng cho hành động đã hoàn thành trong quá khứ',
    examples: [
      { sentence: 'I visited Paris last year.', translation: 'Tôi đã thăm Paris năm ngoái.', highlight: 'visited' },
      { sentence: 'She wrote a letter yesterday.', translation: 'Cô ấy đã viết thư hôm qua.', highlight: 'wrote' },
      { sentence: 'They played tennis last week.', translation: 'Họ đã chơi tennis tuần trước.', highlight: 'played' },
    ],
    related_patterns: ['present_perfect', 'past_continuous'],
  },

  'present_perfect': {
    id: 'present_perfect',
    name: 'Present Perfect Tense',
    pattern: 'S + have/has + V3 (past participle)',
    explanation: 'Used for actions that happened at an unspecified time or continue to the present',
    vietnamese_explanation: 'Thì hiện tại hoàn thành - dùng cho hành động xảy ra không rõ thời điểm hoặc kéo dài đến hiện tại',
    examples: [
      { sentence: 'I have lived here for 5 years.', translation: 'Tôi đã sống ở đây 5 năm rồi.', highlight: 'have lived' },
      { sentence: 'She has never been to Japan.', translation: 'Cô ấy chưa bao giờ đến Nhật.', highlight: 'has never been' },
      { sentence: 'They have just finished their work.', translation: 'Họ vừa hoàn thành công việc.', highlight: 'have finished' },
    ],
    related_patterns: ['simple_past', 'present_perfect_continuous'],
  },

  'passive_voice': {
    id: 'passive_voice',
    name: 'Passive Voice',
    pattern: 'S + be + V3 (+ by agent)',
    explanation: 'Used when the action is more important than who did it',
    vietnamese_explanation: 'Câu bị động - dùng khi hành động quan trọng hơn người thực hiện',
    examples: [
      { sentence: 'The cake was made by my mother.', translation: 'Bánh được làm bởi mẹ tôi.', highlight: 'was made' },
      { sentence: 'English is spoken worldwide.', translation: 'Tiếng Anh được nói trên toàn thế giới.', highlight: 'is spoken' },
      { sentence: 'The letter has been sent.', translation: 'Thư đã được gửi đi.', highlight: 'has been sent' },
    ],
    related_patterns: ['active_voice'],
  },

  'conditional_type_1': {
    id: 'conditional_type_1',
    name: 'First Conditional',
    pattern: 'If + S + V (present), S + will + V',
    explanation: 'Used for real/possible situations in the future',
    vietnamese_explanation: 'Câu điều kiện loại 1 - tình huống có thể xảy ra trong tương lai',
    examples: [
      { sentence: 'If it rains, I will stay home.', translation: 'Nếu trời mưa, tôi sẽ ở nhà.', highlight: 'If it rains, will stay' },
      { sentence: 'If you study hard, you will pass.', translation: 'Nếu bạn học chăm, bạn sẽ đậu.', highlight: 'If you study, will pass' },
    ],
    related_patterns: ['conditional_type_2', 'conditional_type_3'],
  },

  'conditional_type_2': {
    id: 'conditional_type_2',
    name: 'Second Conditional',
    pattern: 'If + S + V-ed (past), S + would + V',
    explanation: 'Used for unreal/hypothetical situations in the present',
    vietnamese_explanation: 'Câu điều kiện loại 2 - tình huống không thực/giả định ở hiện tại',
    examples: [
      { sentence: 'If I were rich, I would travel the world.', translation: 'Nếu tôi giàu, tôi sẽ du lịch vòng quanh thế giới.', highlight: 'If I were, would travel' },
      { sentence: 'If she knew the answer, she would tell us.', translation: 'Nếu cô ấy biết câu trả lời, cô ấy sẽ nói cho chúng tôi.', highlight: 'If she knew, would tell' },
    ],
    related_patterns: ['conditional_type_1', 'conditional_type_3'],
  },

  'relative_clause': {
    id: 'relative_clause',
    name: 'Relative Clauses',
    pattern: 'N + who/which/that/whose/where/when + clause',
    explanation: 'Used to give more information about a noun',
    vietnamese_explanation: 'Mệnh đề quan hệ - bổ sung thông tin cho danh từ',
    examples: [
      { sentence: 'The woman who lives next door is a doctor.', translation: 'Người phụ nữ sống bên cạnh là bác sĩ.', highlight: 'who lives next door' },
      { sentence: 'The book that I read was interesting.', translation: 'Cuốn sách tôi đọc rất thú vị.', highlight: 'that I read' },
      { sentence: 'The city where I was born is beautiful.', translation: 'Thành phố nơi tôi sinh ra rất đẹp.', highlight: 'where I was born' },
    ],
    related_patterns: ['defining_relative', 'non_defining_relative'],
  },

  'comparative': {
    id: 'comparative',
    name: 'Comparative Forms',
    pattern: 'S + be + adj-er/more adj + than + N | S + V + adv-er/more adv + than + N',
    explanation: 'Used to compare two things',
    vietnamese_explanation: 'So sánh hơn - dùng để so sánh hai đối tượng',
    examples: [
      { sentence: 'She is taller than her brother.', translation: 'Cô ấy cao hơn anh trai.', highlight: 'taller than' },
      { sentence: 'This book is more interesting than that one.', translation: 'Cuốn sách này thú vị hơn cuốn kia.', highlight: 'more interesting than' },
      { sentence: 'He runs faster than me.', translation: 'Anh ấy chạy nhanh hơn tôi.', highlight: 'faster than' },
    ],
    related_patterns: ['superlative', 'as_as'],
  },

  'superlative': {
    id: 'superlative',
    name: 'Superlative Forms',
    pattern: 'S + be + the + adj-est/most adj + (in/of) | S + V + the + adv-est/most adv',
    explanation: 'Used to describe the highest degree of a quality',
    vietnamese_explanation: 'So sánh nhất - dùng để mô tả mức độ cao nhất',
    examples: [
      { sentence: 'She is the tallest girl in the class.', translation: 'Cô ấy là cô gái cao nhất lớp.', highlight: 'the tallest' },
      { sentence: 'This is the most beautiful place I have ever seen.', translation: 'Đây là nơi đẹp nhất tôi từng thấy.', highlight: 'the most beautiful' },
    ],
    related_patterns: ['comparative'],
  },

  'gerund': {
    id: 'gerund',
    name: 'Gerunds (V-ing as noun)',
    pattern: 'V-ing + ... (as subject/object)',
    explanation: 'Verb form ending in -ing used as a noun',
    vietnamese_explanation: 'Danh động từ - động từ thêm -ing dùng như danh từ',
    examples: [
      { sentence: 'Swimming is good for health.', translation: 'Bơi lội tốt cho sức khỏe.', highlight: 'Swimming' },
      { sentence: 'I enjoy reading books.', translation: 'Tôi thích đọc sách.', highlight: 'reading' },
      { sentence: 'She is good at cooking.', translation: 'Cô ấy giỏi nấu ăn.', highlight: 'cooking' },
    ],
    related_patterns: ['infinitive', 'verb_patterns'],
  },

  'infinitive': {
    id: 'infinitive',
    name: 'Infinitives (to + V)',
    pattern: 'to + V (base form)',
    explanation: 'Base form of verb with "to", used after many verbs',
    vietnamese_explanation: 'Động từ nguyên mẫu có to - dùng sau nhiều động từ',
    examples: [
      { sentence: 'I want to learn English.', translation: 'Tôi muốn học tiếng Anh.', highlight: 'to learn' },
      { sentence: 'She decided to go abroad.', translation: 'Cô ấy quyết định đi nước ngoài.', highlight: 'to go' },
      { sentence: 'It is important to practice every day.', translation: 'Quan trọng là phải luyện tập mỗi ngày.', highlight: 'to practice' },
    ],
    related_patterns: ['gerund', 'bare_infinitive'],
  },
};

// Parts of speech chi tiết
export const posExplanations: Record<string, { name: string; vietnamese: string; explanation: string; examples: string[] }> = {
  'noun': {
    name: 'Noun',
    vietnamese: 'Danh từ',
    explanation: 'Words that name people, places, things, or ideas',
    examples: ['cat', 'Paris', 'happiness', 'teacher'],
  },
  'verb': {
    name: 'Verb',
    vietnamese: 'Động từ',
    explanation: 'Words that express actions, states, or occurrences',
    examples: ['run', 'think', 'become', 'is'],
  },
  'adjective': {
    name: 'Adjective',
    vietnamese: 'Tính từ',
    explanation: 'Words that describe or modify nouns',
    examples: ['beautiful', 'tall', 'interesting', 'red'],
  },
  'adverb': {
    name: 'Adverb',
    vietnamese: 'Trạng từ',
    explanation: 'Words that modify verbs, adjectives, or other adverbs',
    examples: ['quickly', 'very', 'well', 'always'],
  },
  'preposition': {
    name: 'Preposition',
    vietnamese: 'Giới từ',
    explanation: 'Words that show relationships between nouns/pronouns and other words',
    examples: ['in', 'on', 'at', 'with', 'for'],
  },
  'conjunction': {
    name: 'Conjunction',
    vietnamese: 'Liên từ',
    explanation: 'Words that connect words, phrases, or clauses',
    examples: ['and', 'but', 'or', 'because', 'although'],
  },
  'pronoun': {
    name: 'Pronoun',
    vietnamese: 'Đại từ',
    explanation: 'Words that replace nouns',
    examples: ['he', 'she', 'it', 'they', 'who'],
  },
  'article': {
    name: 'Article',
    vietnamese: 'Mạo từ',
    explanation: 'Words that define nouns as specific or unspecific',
    examples: ['a', 'an', 'the'],
  },
  'determiner': {
    name: 'Determiner',
    vietnamese: 'Từ hạn định',
    explanation: 'Words that introduce nouns and specify their reference',
    examples: ['this', 'that', 'these', 'my', 'some'],
  },
  'interjection': {
    name: 'Interjection',
    vietnamese: 'Thán từ',
    explanation: 'Words that express strong emotions',
    examples: ['wow', 'oh', 'hey', 'ouch'],
  },
};

// Hàm phân tích ngữ pháp của câu dựa trên các từ
export function analyzeGrammarPatterns(sentence: string): GrammarPattern[] {
  const patterns: GrammarPattern[] = [];
  const lowerSentence = sentence.toLowerCase();

  // Kiểm tra các pattern
  if (/\b(am|is|are)\s+\w+ing\b/.test(lowerSentence)) {
    patterns.push(grammarPatterns['present_continuous']);
  }
  
  if (/\b(have|has)\s+(been|never|just|already|ever)?\s*\w+ed\b/.test(lowerSentence) || 
      /\b(have|has)\s+(been|never|just|already|ever)?\s*(done|gone|seen|written|made|taken|given)\b/.test(lowerSentence)) {
    patterns.push(grammarPatterns['present_perfect']);
  }

  if (/\b(was|were)\s+\w+ed\b/.test(lowerSentence) || /\bby\s+\w+/.test(lowerSentence)) {
    if (/\b(was|were|is|are|been)\s+\w+(ed|en)\b/.test(lowerSentence)) {
      patterns.push(grammarPatterns['passive_voice']);
    }
  }

  if (/\bif\s+.+,?\s+(will|would|could|might)\b/.test(lowerSentence)) {
    if (/\bwould\b/.test(lowerSentence)) {
      patterns.push(grammarPatterns['conditional_type_2']);
    } else {
      patterns.push(grammarPatterns['conditional_type_1']);
    }
  }

  if (/\b(who|which|that|whose|where|when)\s+\w+/.test(lowerSentence)) {
    patterns.push(grammarPatterns['relative_clause']);
  }

  if (/\b\w+(er|ier)\s+than\b/.test(lowerSentence) || /\bmore\s+\w+\s+than\b/.test(lowerSentence)) {
    patterns.push(grammarPatterns['comparative']);
  }

  if (/\bthe\s+(most|least|\w+est)\b/.test(lowerSentence)) {
    patterns.push(grammarPatterns['superlative']);
  }

  if (/\b(enjoy|like|love|hate|avoid|finish|keep|mind|suggest)\s+\w+ing\b/.test(lowerSentence)) {
    patterns.push(grammarPatterns['gerund']);
  }

  if (/\b(want|need|decide|hope|plan|promise|agree|refuse|learn)\s+to\s+\w+\b/.test(lowerSentence)) {
    patterns.push(grammarPatterns['infinitive']);
  }

  // Nếu không phát hiện pattern đặc biệt, kiểm tra thì cơ bản
  if (patterns.length === 0) {
    if (/\b(am|is|are|do|does|have|has)\b/.test(lowerSentence) && !/\b(was|were|did|had)\b/.test(lowerSentence)) {
      patterns.push(grammarPatterns['present_simple']);
    }
    if (/\b(was|were|did|\w+ed)\b/.test(lowerSentence) && !/\b(have|has)\s+\w+ed\b/.test(lowerSentence)) {
      patterns.push(grammarPatterns['simple_past']);
    }
  }

  return patterns;
}

// Lấy thông tin chi tiết về từ
export function getEnhancedWordAnalysis(word: string, context?: string): WordAnalysis {
  const lowerWord = word.toLowerCase();
  
  // Xác định loại từ cơ bản
  let pos = 'unknown';
  let posVietnamese = 'Chưa xác định';
  let meaning = '';
  let grammarRole = '';
  
  // Articles
  if (['a', 'an', 'the'].includes(lowerWord)) {
    pos = 'article';
    posVietnamese = 'Mạo từ';
    if (lowerWord === 'the') {
      meaning = 'Mạo từ xác định - chỉ một đối tượng cụ thể đã được đề cập hoặc người nghe đã biết';
    } else {
      meaning = 'Mạo từ không xác định - giới thiệu một đối tượng chung, chưa cụ thể';
    }
    grammarRole = 'Đứng trước danh từ để giới hạn hoặc giới thiệu';
  }
  
  // Prepositions
  else if (['in', 'on', 'at', 'by', 'for', 'with', 'to', 'from', 'of', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'over'].includes(lowerWord)) {
    pos = 'preposition';
    posVietnamese = 'Giới từ';
    grammarRole = 'Kết nối danh từ/đại từ với các thành phần khác trong câu';
    
    const prepMeanings: Record<string, string> = {
      'in': 'Trong, ở trong (không gian/thời gian)',
      'on': 'Trên, vào (bề mặt/ngày cụ thể)',
      'at': 'Tại, ở (địa điểm/thời điểm cụ thể)',
      'by': 'Bởi, bằng, bên cạnh',
      'for': 'Cho, dành cho, trong khoảng (thời gian)',
      'with': 'Với, cùng với',
      'to': 'Đến, tới',
      'from': 'Từ',
      'of': 'Của, về',
      'about': 'Về, khoảng',
    };
    meaning = prepMeanings[lowerWord] || 'Giới từ';
  }
  
  // Pronouns
  else if (['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves'].includes(lowerWord)) {
    pos = 'pronoun';
    posVietnamese = 'Đại từ';
    grammarRole = 'Thay thế cho danh từ đã được đề cập';
    
    const pronounMeanings: Record<string, string> = {
      'i': 'Tôi (chủ ngữ)',
      'you': 'Bạn, các bạn',
      'he': 'Anh ấy, ông ấy',
      'she': 'Cô ấy, bà ấy',
      'it': 'Nó (đồ vật, động vật, khái niệm)',
      'we': 'Chúng tôi, chúng ta',
      'they': 'Họ, chúng nó',
    };
    meaning = pronounMeanings[lowerWord] || 'Đại từ';
  }
  
  // Conjunctions
  else if (['and', 'but', 'or', 'nor', 'so', 'yet', 'for', 'because', 'although', 'though', 'while', 'when', 'if', 'unless', 'until', 'since', 'as', 'whereas', 'however', 'therefore', 'moreover', 'furthermore', 'nevertheless'].includes(lowerWord)) {
    pos = 'conjunction';
    posVietnamese = 'Liên từ';
    grammarRole = 'Kết nối các từ, cụm từ hoặc mệnh đề';
    
    const conjMeanings: Record<string, string> = {
      'and': 'Và - kết nối thêm thông tin',
      'but': 'Nhưng - thể hiện sự tương phản',
      'or': 'Hoặc - đưa ra lựa chọn',
      'because': 'Bởi vì - giải thích nguyên nhân',
      'although': 'Mặc dù - nhượng bộ',
      'if': 'Nếu - điều kiện',
      'when': 'Khi - thời gian',
      'while': 'Trong khi - đồng thời/tương phản',
    };
    meaning = conjMeanings[lowerWord] || 'Liên từ';
  }
  
  // Common verbs
  else if (['is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'].includes(lowerWord)) {
    pos = 'verb';
    posVietnamese = 'Động từ (trợ động từ)';
    grammarRole = 'Trợ động từ - hỗ trợ động từ chính tạo thì, thể, hoặc câu hỏi/phủ định';
    
    const verbMeanings: Record<string, string> = {
      'is': 'Là, thì - động từ to be ngôi 3 số ít',
      'am': 'Là - động từ to be ngôi 1 số ít',
      'are': 'Là - động từ to be ngôi 2 hoặc số nhiều',
      'was': 'Đã là - quá khứ của is/am',
      'were': 'Đã là - quá khứ của are',
      'have': 'Có / Đã (trợ động từ hoàn thành)',
      'has': 'Có / Đã - ngôi 3 số ít',
      'do': 'Làm / trợ động từ nhấn mạnh, câu hỏi, phủ định',
      'will': 'Sẽ - diễn tả tương lai',
      'would': 'Sẽ (điều kiện) / Đã thường',
      'can': 'Có thể - khả năng',
      'could': 'Có thể (quá khứ/lịch sự)',
      'should': 'Nên - lời khuyên',
      'must': 'Phải - bắt buộc',
      'may': 'Có thể - khả năng/xin phép',
      'might': 'Có lẽ - khả năng thấp',
    };
    meaning = verbMeanings[lowerWord] || 'Động từ';
  }
  
  return {
    word,
    pos,
    pos_vietnamese: posVietnamese,
    meaning,
    grammar_role: grammarRole,
    examples: [],
    grammar_patterns: context ? analyzeGrammarPatterns(context) : [],
  };
}
