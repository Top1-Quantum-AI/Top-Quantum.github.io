/**
 * Minimal i18n utility for the four supported UI languages:
 * Arabic (ar), English (en), French (fr), Spanish (es).
 *
 * Language preference is read from the user settings stored in localStorage
 * under the key `quantumSettings` (managed by AdvancedSettings.tsx).
 * Falls back to `navigator.language`, then to 'ar' (the app default).
 *
 * Usage:
 *   import { t } from './i18n';
 *   t('loading')  // → "جاري التحميل..." | "Loading..." | …
 */

export type SupportedLocale = 'ar' | 'en' | 'fr' | 'es';

// ─── Translation table ────────────────────────────────────────────────────────

const translations: Record<string, Record<SupportedLocale, string>> = {
  loading: {
    ar: 'جاري التحميل...',
    en: 'Loading...',
    fr: 'Chargement...',
    es: 'Cargando...',
  },
};

// ─── Locale detection ─────────────────────────────────────────────────────────

const SUPPORTED: readonly SupportedLocale[] = ['ar', 'en', 'fr', 'es'];

function isSupportedLocale(v: unknown): v is SupportedLocale {
  return SUPPORTED.includes(v as SupportedLocale);
}

export function detectLocale(): SupportedLocale {
  // 1. User preference stored by AdvancedSettings
  try {
    const raw = localStorage.getItem('quantumSettings');
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'language' in parsed &&
        isSupportedLocale((parsed as Record<string, unknown>)['language'])
      ) {
        return (parsed as Record<string, unknown>)['language'] as SupportedLocale;
      }
    }
  } catch {
    // localStorage not available or JSON parse failed — continue
  }

  // 2. Browser language
  const browserLang = (navigator.language ?? '').slice(0, 2).toLowerCase();
  if (isSupportedLocale(browserLang)) return browserLang;

  // 3. Default: Arabic (app default)
  return 'ar';
}

// ─── Translate helper ─────────────────────────────────────────────────────────

export function t(key: string, locale?: SupportedLocale): string {
  const lang = locale ?? detectLocale();
  return translations[key]?.[lang] ?? translations[key]?.['ar'] ?? key;
}
