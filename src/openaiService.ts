// Stub — original service was removed during cleanup.
// UnifiedQuantumSystem.tsx still references this export.

export class OpenAIService {
  createResponse(
    promptId: string,
    vars: Record<string, string>,
    version?: string
  ): Promise<{ text: string }> {
    void promptId;
    void vars;
    void version;
    return Promise.resolve({ text: 'خدمة OpenAI غير متوفرة. استخدم لوحة التحكم الرئيسية.' });
  }
}
