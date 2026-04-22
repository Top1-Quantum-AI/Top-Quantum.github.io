// Stub — original service was removed during cleanup.
// UnifiedQuantumSystem.tsx still references this export.

export class OpenAIService {
  createResponse(
    _promptId: string,
    _vars: Record<string, string>,
    _version?: string
  ): Promise<{ text: string }> {
    void _promptId;
    void _vars;
    void _version;
    return Promise.resolve({ text: 'خدمة OpenAI غير متوفرة. استخدم لوحة التحكم الرئيسية.' });
  }
}
