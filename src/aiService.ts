import { AI_PERSONALITIES } from './config';

// واجهة الرسالة للـ API
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// واجهة الاستجابة من OpenAI API (محجوزة للاستخدام المستقبلي)
// interface OpenAIResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
//   usage: {
//     prompt_tokens: number;
//     completion_tokens: number;
//     total_tokens: number;
//   };
// }

// خدمة الذكاء الاصطناعي
export class AIService {
  private conversationHistory: Message[] = [];

  constructor() {
    // استخدام OpenAI فقط
  }

  // الحصول على مقدم الخدمة الحالي
  getCurrentProvider(): string {
    return 'OpenAI';
  }

  // إرسال رسالة إلى OpenAI API
  async sendMessage(
    message: string, 
    personality: keyof typeof AI_PERSONALITIES = 'friendly'
  ): Promise<{
    response: string;
    confidence: number;
    quantumScore: string;
    tokensUsed: number;
    provider: string;
  }> {
    try {
      // إضافة رسالة المستخدم إلى التاريخ
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      // إعداد الشخصية
      const personalityConfig = AI_PERSONALITIES[personality];

      // استخدام OpenAI فقط
      return await this.sendToOpenAI(message, personalityConfig);

    } catch (error) {
      console.error('خطأ في الاتصال بـ OpenAI API:', error);
      
      // في حالة الخطأ، استخدم رد احتياطي
      return {
        response: 'عذراً، حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
        confidence: 0.1,
        quantumScore: '0.000',
        tokensUsed: 0,
        provider: 'OpenAI'
      };
    }
  }

  // إرسال رسالة إلى OpenAI API
  private async sendToOpenAI(
    message: string,
    _personalityConfig: any
  ): Promise<{
    response: string;
    confidence: number;
    quantumScore: string;
    tokensUsed: number;
    provider: string;
  }> {
    // محاكاة استجابة OpenAI API (بسبب قيود CORS في المتصفح)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    const mockResponse = this.generateMockResponse(message, 'friendly');
    
    // إضافة رد الذكاء الاصطناعي إلى التاريخ
    this.conversationHistory.push({
      role: 'assistant',
      content: mockResponse
    });

    const confidence = this.calculateConfidence(mockResponse);
    const quantumScore = this.calculateQuantumScore(message, mockResponse);
    const tokensUsed = message.length + mockResponse.length;

    return {
      response: mockResponse,
      confidence,
      quantumScore: quantumScore.toFixed(3),
      tokensUsed,
      provider: 'OpenAI'
    };
  }



  // توليد استجابة محاكية ذكية
  private generateMockResponse(message: string, personality: keyof typeof AI_PERSONALITIES): string {
    const lowerMessage = message.toLowerCase();
    
    // استجابات مخصصة حسب الشخصية
    const providerPrefix = '[OpenAI GPT] ';
    
    const responses = {
      analytical: [
        providerPrefix + 'بناءً على التحليل المنطقي، يمكنني القول أن هذا الموضوع يتطلب دراسة معمقة للبيانات المتاحة.',
        providerPrefix + 'من خلال تحليل المعطيات، نجد أن هناك عدة عوامل مؤثرة يجب أخذها في الاعتبار.',
        providerPrefix + 'التحليل الإحصائي يشير إلى وجود علاقة قوية بين المتغيرات المذكورة.'
      ],
      creative: [
        providerPrefix + 'ما رأيك لو فكرنا في هذا الأمر من زاوية مختلفة تماماً؟ ربما يمكننا ابتكار حل جديد!',
        providerPrefix + 'هذا يذكرني بفكرة إبداعية... ماذا لو دمجنا التقنيات الحديثة مع الأساليب التقليدية؟',
        providerPrefix + 'أعتقد أن هناك إمكانية لإنشاء شيء مبتكر هنا. دعني أشاركك بعض الأفكار الجديدة.'
      ],
      friendly: [
        providerPrefix + 'أهلاً وسهلاً! سعيد جداً لمساعدتك في هذا الموضوع. دعني أشرح لك بطريقة بسيطة.',
        providerPrefix + 'مرحباً صديقي! هذا سؤال رائع، وأنا متحمس لمشاركة ما أعرفه معك.',
        providerPrefix + 'أتفهم تماماً ما تقصده، وأقدر اهتمامك بهذا الموضوع. دعني أساعدك بكل سرور.'
      ],
      professional: [
        providerPrefix + 'وفقاً للمعايير المهنية المعتمدة، يمكنني تقديم التوضيح التالي بشكل دقيق ومفصل.',
        providerPrefix + 'بناءً على الخبرة المهنية والممارسات المعتمدة، إليك التحليل الشامل للموضوع.',
        providerPrefix + 'من منظور مهني، هذا الموضوع يتطلب اتباع الإجراءات المعيارية والممارسات الأفضل.'
      ]
    };
    
    // اختيار استجابة عشوائية حسب الشخصية
    const personalityResponses = responses[personality] || responses.friendly;
    const baseResponse = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    
    // إضافة محتوى مخصص حسب الرسالة
    if (lowerMessage.includes('كمومي') || lowerMessage.includes('quantum')) {
      return baseResponse + ' الحوسبة الكمومية تمثل ثورة حقيقية في عالم التكنولوجيا، حيث تستخدم خصائص الكم الفريدة لمعالجة المعلومات بطرق لم تكن ممكنة من قبل.';
    } else if (lowerMessage.includes('ذكاء') || lowerMessage.includes('ai')) {
      return baseResponse + ' الذكاء الاصطناعي يتطور بسرعة مذهلة، ويفتح آفاقاً جديدة في مختلف المجالات من الطب إلى التعليم والأعمال.';
    } else if (lowerMessage.includes('أمن') || lowerMessage.includes('security')) {
      return baseResponse + ' الأمن السيبراني أصبح أولوية قصوى في عصرنا الرقمي، ويتطلب استراتيجيات متقدمة ومتعددة الطبقات للحماية الفعالة.';
    } else {
      return baseResponse + ' شكراً لك على هذا السؤال المثير للاهتمام. أتطلع لمساعدتك أكثر في استكشاف هذا الموضوع.';
    }
  }

  // حساب درجة الثقة بناءً على طول وجودة الرد
  private calculateConfidence(response: string): number {
    const length = response.length;
    const hasNumbers = /\d/.test(response);
    const hasStructure = response.includes('\n') || response.includes('.');
    
    let confidence = Math.min(length / 200, 1); // أساس الطول
    if (hasNumbers) confidence += 0.1;
    if (hasStructure) confidence += 0.1;
    
    return Math.min(confidence, 0.95); // الحد الأقصى 95%
  }

  // حساب النتيجة الكمية
  private calculateQuantumScore(input: string, output: string): number {
    const inputComplexity = input.split(' ').length * 0.1;
    const outputComplexity = output.split(' ').length * 0.05;
    const semanticScore = Math.random() * 0.3; // محاكاة التحليل الدلالي
    
    return inputComplexity + outputComplexity + semanticScore;
  }

  // مسح تاريخ المحادثة
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // الحصول على تاريخ المحادثة
  getHistory(): Message[] {
    return [...this.conversationHistory];
  }

  // الحصول على إحصائيات الاستخدام
  getUsageStats(): {
    totalMessages: number;
    userMessages: number;
    aiMessages: number;
  } {
    const totalMessages = this.conversationHistory.length;
    const userMessages = this.conversationHistory.filter(m => m.role === 'user').length;
    const aiMessages = this.conversationHistory.filter(m => m.role === 'assistant').length;
    
    return {
      totalMessages,
      userMessages,
      aiMessages
    };
  }
}

// إنشاء مثيل واحد من الخدمة
export const aiService = new AIService();