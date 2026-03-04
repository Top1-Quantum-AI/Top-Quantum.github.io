/**
 * بيانات الاعتماد للنظام — مصدرها متغيرات البيئة حصراً.
 * System credentials — sourced exclusively from environment variables.
 *
 * القيم الافتراضية للتطوير فقط؛ تأكد من ضبط المتغيرات في الإنتاج.
 * Default values are for development only; always set these in production.
 */
const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;

export const SYSTEM_USERNAME = env['VITE_SYSTEM_USERNAME'] ?? '511';
export const SYSTEM_PASSWORD = env['VITE_SYSTEM_PASSWORD'] ?? '511';
export const MASTER_SECRET_CODE = env['VITE_MASTER_SECRET_CODE'] ?? '511';
