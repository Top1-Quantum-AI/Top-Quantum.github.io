// خدمة Groq AI للتحليل الذكي
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AnalysisResult {
  summary: string;
  details: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
}

const getApiKey = (): string => {
  return import.meta.env.VITE_OPENAI_API_KEY || '';
};

export async function sendChatMessage(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('مفتاح API غير مُعدّ. أضف VITE_OPENAI_API_KEY في ملف .env');
  }

  const allMessages: ChatMessage[] = [
    {
      role: 'system',
      content: systemPrompt ?? `أنت محلل ذكاء اصطناعي متخصص في أنظمة الحوسبة الكمية والأمن السيبراني. 
أجب باللغة العربية دائماً. قدم تحليلات دقيقة ومفيدة مع توصيات عملية.
أنت جزء من "النظام الكمي المتقدم - Top1 Quantum AI".`,
    },
    ...messages,
  ];

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    const errorObj = errorData['error'] as Record<string, string> | undefined;
    const errorMsg = errorObj?.['message'] ?? `خطأ في API: ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content;
  if (!content) {
    throw new Error('لم يتم استلام رد من النموذج');
  }
  return content;
}

export async function analyzeSystemData(
  systemData: Record<string, unknown>
): Promise<string> {
  const prompt = `قم بتحليل بيانات النظام التالية وقدم تقريراً شاملاً:

\`\`\`json
${JSON.stringify(systemData, null, 2)}
\`\`\`

قدم التحليل بالتنسيق التالي:
1. **ملخص الحالة العامة**
2. **تحليل الأداء** (المعالج، الذاكرة، القرص، الشبكة)
3. **تحليل الأمان** (التهديدات، التشفير، المقاومة الكمية)
4. **تحليل الحوسبة الكمية** (الكيوبتات، الدقة، التماسك)
5. **التوصيات** (إجراءات مقترحة لتحسين الأداء والأمان)
6. **مستوى المخاطر** (منخفض/متوسط/مرتفع)`;

  return sendChatMessage([{ role: 'user', content: prompt }]);
}

export async function analyzeSecurityThreats(
  threats: Record<string, unknown>[]
): Promise<string> {
  const prompt = `حلل التهديدات الأمنية التالية وقدم تقريراً أمنياً مفصلاً:

\`\`\`json
${JSON.stringify(threats, null, 2)}
\`\`\`

قدم:
1. **تصنيف التهديدات** حسب الخطورة
2. **مصادر التهديد** المحتملة
3. **التأثير المتوقع** على النظام
4. **إجراءات مضادة** مقترحة
5. **خطة العمل** الفورية`;

  return sendChatMessage([{ role: 'user', content: prompt }]);
}

export async function analyzeQuantumPerformance(
  quantumData: Record<string, unknown>[]
): Promise<string> {
  const prompt = `حلل أداء المعالجات الكمية التالية:

\`\`\`json
${JSON.stringify(quantumData, null, 2)}
\`\`\`

قدم:
1. **تقييم الأداء الكمي** لكل معالج
2. **تحليل زمن التماسك** ومعدل الأخطاء
3. **توقعات الجودة** للعمليات الكمية
4. **اقتراحات التحسين**
5. **مقارنة** مع المعايير القياسية`;

  return sendChatMessage([{ role: 'user', content: prompt }]);
}

export function isApiKeyConfigured(): boolean {
  return Boolean(getApiKey());
}
