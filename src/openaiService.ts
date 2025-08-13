import OpenAI from 'openai';
import { AI_CONFIG } from './config';

export interface OpenAIClient {
  responses: {
    create: (params: any) => Promise<any>;
  };
}

export class MockOpenAIClient implements OpenAIClient {
  responses = {
    create: async (params: any) => {
      // Mock response for development
      return {
        choices: [{
          message: {
            content: `Mock OpenAI response for prompt ID: ${params.prompt.id}, version: ${params.prompt.version}, variables: ${JSON.stringify(params.prompt.variables)}`
          }
        }]
      };
    }
  };
}

export class OpenAIService {
  private client: OpenAIClient;

  constructor() {
    if (AI_CONFIG.OPENAI_API_KEY && AI_CONFIG.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      this.client = new OpenAI({
        apiKey: AI_CONFIG.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      }) as OpenAIClient;
    } else {
      this.client = new MockOpenAIClient();
    }
  }

  async createResponse(promptId: string, variables: Record<string, any>, version?: string): Promise<any> {
    try {
      const response = await this.client.responses.create({
        prompt: {
          id: promptId,
          version: version || "2",
          variables
        }
      });
      
      return response;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  // قوالب جاهزة للاستخدام
  async askAboutTopic(topic: string) {
    return this.createResponse(
      'pmpt_6898ef1524b48190abd6141c143534e70a12348215c2bd28',
      { topic }
    );
  }

  // قالب للتحليل
  async analyzeData(data: string) {
    return this.createResponse(
      'pmpt_analysis_template',
      { data, analysis_type: 'comprehensive' }
    );
  }

  // قالب للإبداع
  async generateIdeas(context: string) {
    return this.createResponse(
      'pmpt_creative_template',
      { context, creativity_level: 'high' }
    );
  }
}

// إنشاء مثيل واحد من الخدمة
export const openaiService = new OpenAIService();

// مثال على الاستخدام كما في الكود المقدم
export async function exampleUsage() {
  const response = await openaiService.createResponse(
    'pmpt_6898ef1524b48190abd6141c143534e70a12348215c2bd28',
    { topic: 'example topic' }
  );
  
  console.log('OpenAI Response:', response);
  return response;
}