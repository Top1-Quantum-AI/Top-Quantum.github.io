/**
 * بيانات الاعتماد للنظام — مصدرها متغيرات البيئة حصراً.
 * System credentials — sourced exclusively from environment variables.
 *
 * القيم الافتراضية للتطوير فقط؛ تأكد من ضبط المتغيرات في الإنتاج.
 * Default values are for development only; always set these in production.
 */
const env = (import.meta as unknown as {
  env: (Record<string, string | undefined> & { PROD?: boolean });
}).env;

function getCredential(name: string, devDefault: string): string {
  const value = env[name];

  if (value !== undefined) {
    return value;
  }

  // In production, missing credentials are a hard error; never fall back to a default.
  if (env.PROD) {
    throw new Error(
      `[config/credentials] Missing required environment variable "${name}" in production.`
    );
  }

  // In non-production environments, fall back to the development default.
  return devDefault;
}

export const SYSTEM_USERNAME = getCredential('VITE_SYSTEM_USERNAME', '511');
export const SYSTEM_PASSWORD = getCredential('VITE_SYSTEM_PASSWORD', '511');
export const MASTER_SECRET_CODE = getCredential('VITE_MASTER_SECRET_CODE', '511');
