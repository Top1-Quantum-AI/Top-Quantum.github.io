// تكوين API للذكاء الاصطناعي
export const AI_CONFIG = {
  // إعدادات OpenAI API
  OPENAI_API_KEY: (import.meta as unknown as { env: Record<string, string | undefined> }).env['VITE_OPENAI_API_KEY'] || 'your-openai-api-key-here',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  OPENAI_MODEL: 'o1-mini',
  
  // إعدادات عامة
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7
};

// إعدادات الشخصيات المختلفة للذكاء الاصطناعي
export const AI_PERSONALITIES = {
  analytical: {
    name: 'تحليلي',
    systemPrompt: 'أنت مساعد ذكي تحليلي. تقدم إجابات دقيقة ومفصلة مع التركيز على التحليل المنطقي والبيانات.',
    temperature: 0.3
  },
  creative: {
    name: 'إبداعي',
    systemPrompt: 'أنت مساعد ذكي إبداعي. تقدم حلولاً مبتكرة وأفكاراً جديدة مع التفكير خارج الصندوق.',
    temperature: 0.9
  },
  friendly: {
    name: 'ودود',
    systemPrompt: 'أنت مساعد ذكي ودود ومتفهم. تتفاعل بطريقة دافئة ومشجعة مع المستخدمين.',
    temperature: 0.7
  },
  professional: {
    name: 'مهني',
    systemPrompt: 'أنت مساعد ذكي مهني. تقدم إجابات رسمية ودقيقة مع التركيز على الكفاءة والوضوح.',
    temperature: 0.5
  }
};