import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.'));

// خدمة الملفات الثابتة من مجلد src
app.use('/src', express.static(path.join(__dirname, 'src')));

// إعدادات الشخصيات المختلفة للذكاء الاصطناعي (مطابقة لـ config.ts)
const AI_PERSONALITIES = {
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

// إعدادات الذكاء الاصطناعي
const AI_CONFIG = {
    // إعدادات OpenAI API
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    OPENAI_MODEL: 'o1-mini',
    
    // إعدادات عامة
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7,
    DEFAULT_PROVIDER: 'openai'
};

// فئة خدمة الذكاء الاصطناعي (مطابقة لـ aiService.ts)
class AIService {
    constructor() {
        this.conversationHistory = [];
        this.currentProvider = AI_CONFIG.DEFAULT_PROVIDER;
    }

    // إرسال رسالة إلى الذكاء الاصطناعي (OpenAI)
    async sendMessage(message, personality = 'friendly', provider = null) {
        if (AI_CONFIG.OPENAI_API_KEY) {
            return await this.sendToOpenAI(message, personality);
        } else {
            // في حالة عدم توفر OpenAI API، استخدم الاستجابة المحاكاة
            return this.generateMockResponse(message, personality);
        }
    }

    // إرسال رسالة إلى OpenAI API
    async sendToOpenAI(message, personality = 'friendly') {
        try {
            // إضافة رسالة المستخدم إلى التاريخ
            this.conversationHistory.push({
                role: 'user',
                content: message
            });

            // إعداد الشخصية
            const personalityConfig = AI_PERSONALITIES[personality] || AI_PERSONALITIES.friendly;
            
            // إعداد الرسائل للـ API
            const messages = [
                {
                    role: 'system',
                    content: personalityConfig.systemPrompt
                },
                {
                    role: 'user',
                    content: message
                }
            ];

            // إرسال الطلب إلى OpenAI API
            const response = await fetch(AI_CONFIG.OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: AI_CONFIG.OPENAI_MODEL,
                    messages: messages,
                    max_tokens: AI_CONFIG.MAX_TOKENS,
                    temperature: personalityConfig.temperature
                })
            });

            if (!response.ok) {
                console.log('OpenAI API Error:', response.status, response.statusText);
                return this.generateMockResponse(message, personality);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // إضافة استجابة الذكاء الاصطناعي إلى التاريخ
            this.conversationHistory.push({
                role: 'assistant',
                content: aiResponse
            });

            // حساب المقاييس
            const confidence = this.calculateConfidence(aiResponse);
            const quantumScore = this.calculateQuantumScore(message, aiResponse);
            const tokensUsed = data.usage ? data.usage.prompt_tokens + data.usage.completion_tokens : 0;

            return {
                response: aiResponse,
                confidence: confidence,
                quantumScore: quantumScore.toFixed(2),
                tokensUsed: tokensUsed,
                provider: 'OpenAI'
            };

        } catch (error) {
            console.error('خطأ في الاتصال بـ OpenAI API:', error);
            return this.generateMockResponse(message, personality);
        }
    }



    // توليد استجابة محاكاة في حالة فشل API
    generateMockResponse(message, personality) {
        const personalityConfig = AI_PERSONALITIES[personality] || AI_PERSONALITIES.friendly;
        const responses = {
            analytical: [
                'بناءً على التحليل المنطقي، يمكنني القول أن...',
                'من خلال دراسة البيانات المتاحة، نجد أن...',
                'التحليل يشير إلى أن الحل الأمثل هو...'
            ],
            creative: [
                'فكرة مبدعة! ماذا لو جربنا...',
                'يمكننا التفكير خارج الصندوق و...',
                'إليك حل إبداعي مختلف...'
            ],
            friendly: [
                'أهلاً وسهلاً! سأساعدك بكل سرور...',
                'مرحباً صديقي، دعني أفكر في هذا...',
                'بالطبع! سأقوم بمساعدتك في...'
            ],
            professional: [
                'وفقاً للمعايير المهنية، أنصح بـ...',
                'من الناحية المهنية، الحل الأنسب هو...',
                'بشكل رسمي، يمكنني تقديم التوصية التالية...'
            ]
        };
        
        const personalityResponses = responses[personality] || responses.friendly;
        const randomResponse = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
        
        return {
            response: `${randomResponse} (استجابة تجريبية - ${message})`,
            confidence: Math.random() * 0.3 + 0.7, // 70-100%
            quantumScore: (Math.random() * 2 + 8).toFixed(2), // 8-10
            tokensUsed: Math.floor(Math.random() * 100) + 50,
            provider: 'Mock'
        };
    }

    // تغيير مزود الخدمة (OpenAI فقط)
    setProvider(provider) {
        if (provider === 'openai') {
            this.currentProvider = provider;
            return true;
        }
        return false;
    }

    // الحصول على مزود الخدمة الحالي
    getCurrentProvider() {
        return 'OpenAI';
    }

    // حساب مستوى الثقة
    calculateConfidence(response) {
        const factors = {
            length: Math.min(response.length / 200, 1) * 0.3,
            complexity: (response.split(' ').length / 50) * 0.3,
            keywords: (response.match(/[أ-ي]/g) || []).length / response.length * 0.4
        };
        
        return Math.min(Object.values(factors).reduce((a, b) => a + b, 0.5), 1);
    }

    // حساب النتيجة الكمومية
    calculateQuantumScore(input, output) {
        const inputComplexity = input.length * 0.1;
        const outputQuality = output.length * 0.05;
        const coherence = Math.random() * 20 + 60;
        
        return Math.min(inputComplexity + outputQuality + coherence, 100);
    }

    // مسح التاريخ
    clearHistory() {
        this.conversationHistory = [];
    }
}

// إنشاء مثيل من خدمة الذكاء الاصطناعي
const aiService = new AIService();

// نقطة النهاية الرئيسية للذكاء الاصطناعي
app.post('/api/ai', async (req, res) => {
    const { message, personality } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }
    
    try {
        const result = await aiService.sendMessage(message, personality || 'friendly');
        res.json(result);
    } catch (error) {
        console.error('خطأ في معالجة الطلب:', error);
        res.status(500).json({ error: 'خطأ في الخادم' });
    }
});

// نقطة نهاية للحصول على الشخصيات المتاحة
app.get('/api/personalities', (req, res) => {
    res.json(AI_PERSONALITIES);
});

// نقطة نهاية لمسح تاريخ المحادثة
app.post('/api/clear-history', (req, res) => {
    aiService.clearHistory();
    res.json({ message: 'تم مسح التاريخ بنجاح' });
});

// نقطة نهاية لتغيير مزود الخدمة
app.post('/api/set-provider', (req, res) => {
    const { provider } = req.body;
    
    if (!provider) {
        return res.status(400).json({ error: 'مزود الخدمة مطلوب' });
    }
    
    const success = aiService.setProvider(provider);
    
    if (success) {
        res.json({ 
            message: `تم تغيير مزود الخدمة إلى ${provider}`,
            currentProvider: aiService.getCurrentProvider()
        });
    } else {
        res.status(400).json({ error: 'مزود خدمة غير صالح' });
    }
});

// نقطة نهاية للحصول على مزود الخدمة الحالي
app.get('/api/current-provider', (req, res) => {
    res.json({ 
        currentProvider: aiService.getCurrentProvider(),
        availableProviders: ['openai']
    });
});

// نقطة نهاية للحصول على تاريخ المحادثة
app.get('/api/history', (req, res) => {
    res.json(aiService.conversationHistory);
});

// نقطة نهاية لخدمة النظام الكمومي الموحد
app.get('/quantum', (req, res) => {
    res.sendFile(path.join(__dirname, 'quantum.html'));
});

app.listen(port, () => {
    console.log(`الخادم يعمل على المنفذ ${port}`);
});