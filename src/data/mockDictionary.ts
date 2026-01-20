import { DictionaryEntry, GrammarInfo } from '@/types/trainer';

export const mockDictionary: Record<string, DictionaryEntry> = {
  'the': {
    meaning: 'Mạo từ xác định, chỉ một người/vật cụ thể',
    pos: 'article',
    ipa: '/ðə/, /ðiː/',
    example: 'The book on the table is mine.',
    collocations: ['the more... the more', 'the same as'],
    notes: 'Phát âm /ðiː/ trước nguyên âm',
  },
  'is': {
    meaning: 'Là, thì (động từ to be chia cho ngôi thứ 3 số ít)',
    pos: 'verb',
    ipa: '/ɪz/',
    example: 'She is a doctor.',
    collocations: ['is going to', 'is able to'],
  },
  'a': {
    meaning: 'Một (mạo từ không xác định)',
    pos: 'article',
    ipa: '/ə/, /eɪ/',
    example: 'I saw a cat in the garden.',
  },
  'to': {
    meaning: 'Đến, để (giới từ/phần của động từ nguyên thể)',
    pos: 'preposition/particle',
    ipa: '/tuː/, /tə/',
    example: 'I want to go to the store.',
    collocations: ['to be honest', 'to begin with'],
  },
  'and': {
    meaning: 'Và (liên từ kết hợp)',
    pos: 'conjunction',
    ipa: '/ænd/, /ənd/',
    example: 'Bread and butter.',
  },
  'that': {
    meaning: 'Đó, rằng (đại từ chỉ định/liên từ)',
    pos: 'pronoun/conjunction',
    ipa: '/ðæt/',
    example: 'I think that she is right.',
    collocations: ['so that', 'in that'],
  },
  'it': {
    meaning: 'Nó (đại từ nhân xưng)',
    pos: 'pronoun',
    ipa: '/ɪt/',
    example: 'It is raining outside.',
  },
  'for': {
    meaning: 'Cho, trong (giới từ)',
    pos: 'preposition',
    ipa: '/fɔːr/',
    example: 'This gift is for you.',
    collocations: ['for example', 'for instance'],
  },
  'with': {
    meaning: 'Với (giới từ)',
    pos: 'preposition',
    ipa: '/wɪð/',
    example: 'Come with me.',
    collocations: ['with regard to', 'along with'],
  },
  'on': {
    meaning: 'Trên (giới từ)',
    pos: 'preposition',
    ipa: '/ɒn/',
    example: 'The book is on the table.',
    collocations: ['on purpose', 'on behalf of'],
  },
  'be': {
    meaning: 'Là, thì, ở (động từ)',
    pos: 'verb',
    ipa: '/biː/',
    example: 'To be or not to be.',
    collocations: ['be about to', 'be used to'],
  },
  'at': {
    meaning: 'Tại, ở (giới từ)',
    pos: 'preposition',
    ipa: '/æt/',
    example: 'Meet me at the station.',
    collocations: ['at least', 'at first'],
  },
  'by': {
    meaning: 'Bởi, bằng (giới từ)',
    pos: 'preposition',
    ipa: '/baɪ/',
    example: 'The book was written by her.',
    collocations: ['by the way', 'by means of'],
  },
  'have': {
    meaning: 'Có (động từ)',
    pos: 'verb',
    ipa: '/hæv/',
    example: 'I have a dream.',
    collocations: ['have to', 'have been'],
  },
  'from': {
    meaning: 'Từ (giới từ)',
    pos: 'preposition',
    ipa: '/frɒm/',
    example: 'I come from Vietnam.',
    collocations: ['from now on', 'apart from'],
  },
  'learning': {
    meaning: 'Việc học tập (danh từ/động từ)',
    pos: 'noun/verb',
    ipa: '/ˈlɜːrnɪŋ/',
    example: 'Learning English is fun.',
    collocations: ['learning curve', 'learning process'],
    notes: 'Có thể dùng như danh động từ (gerund)',
  },
  'english': {
    meaning: 'Tiếng Anh (danh từ/tính từ)',
    pos: 'noun/adjective',
    ipa: '/ˈɪŋɡlɪʃ/',
    example: 'She speaks English fluently.',
  },
  'practice': {
    meaning: 'Luyện tập, thực hành (động từ/danh từ)',
    pos: 'verb/noun',
    ipa: '/ˈpræktɪs/',
    example: 'Practice makes perfect.',
    collocations: ['put into practice', 'practice session'],
  },
  'writing': {
    meaning: 'Viết, bài viết (danh từ/động từ)',
    pos: 'noun/verb',
    ipa: '/ˈraɪtɪŋ/',
    example: 'Creative writing is an art.',
    collocations: ['writing skills', 'in writing'],
  },
  'typing': {
    meaning: 'Đánh máy (danh từ/động từ)',
    pos: 'noun/verb',
    ipa: '/ˈtaɪpɪŋ/',
    example: 'Improve your typing speed.',
    collocations: ['typing speed', 'touch typing'],
  },
  'improve': {
    meaning: 'Cải thiện (động từ)',
    pos: 'verb',
    ipa: '/ɪmˈpruːv/',
    example: 'I want to improve my skills.',
    collocations: ['improve on', 'room for improvement'],
  },
  'skills': {
    meaning: 'Kỹ năng (danh từ)',
    pos: 'noun',
    ipa: '/skɪlz/',
    example: 'Develop your communication skills.',
    collocations: ['soft skills', 'skill set'],
  },
  'speed': {
    meaning: 'Tốc độ (danh từ)',
    pos: 'noun',
    ipa: '/spiːd/',
    example: 'Increase your reading speed.',
    collocations: ['at full speed', 'speed up'],
  },
  'accuracy': {
    meaning: 'Độ chính xác (danh từ)',
    pos: 'noun',
    ipa: '/ˈækjərəsi/',
    example: 'Accuracy is more important than speed.',
    collocations: ['with accuracy', 'high accuracy'],
  },
};

export const mockGrammar: Record<string, GrammarInfo> = {
  'is going to': {
    structure: 'S + is/am/are + going to + V',
    explanation: 'Diễn tả dự định trong tương lai hoặc dự đoán dựa trên bằng chứng',
    relatedStructures: ['will + V', 'is about to + V'],
  },
  'have been': {
    structure: 'S + have/has + been + V-ing',
    explanation: 'Thì hiện tại hoàn thành tiếp diễn, diễn tả hành động bắt đầu trong quá khứ và tiếp tục đến hiện tại',
    relatedStructures: ['have + V3', 'had been + V-ing'],
  },
  'in order to': {
    structure: 'S + V + in order to + V',
    explanation: 'Diễn tả mục đích của hành động',
    relatedStructures: ['so as to', 'so that'],
  },
};

export function lookupWord(word: string): DictionaryEntry | null {
  const normalized = word.toLowerCase().replace(/[^\w]/g, '');
  return mockDictionary[normalized] || null;
}

export function lookupPhrase(phrase: string): GrammarInfo | null {
  const normalized = phrase.toLowerCase();
  return mockGrammar[normalized] || null;
}
