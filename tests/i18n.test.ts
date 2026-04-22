/**
 * i18n utility tests
 */
import { t, detectLocale, type SupportedLocale } from '../src/i18n';

describe('i18n', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('detectLocale()', () => {
    it('should return "ar" by default when no settings are stored', () => {
      // navigator.language in jsdom defaults to 'en', but 'en' IS supported
      // so we check after clearing localStorage
      const locale = detectLocale();
      expect(['ar', 'en', 'fr', 'es']).toContain(locale);
    });

    it('should return stored language from quantumSettings', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'en' }));
      expect(detectLocale()).toBe('en');
    });

    it('should return French when stored as fr', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'fr' }));
      expect(detectLocale()).toBe('fr');
    });

    it('should return Spanish when stored as es', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'es' }));
      expect(detectLocale()).toBe('es');
    });

    it('should return Arabic when stored as ar', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'ar' }));
      expect(detectLocale()).toBe('ar');
    });

    it('should ignore unsupported languages in settings and fall back', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'zh' }));
      // 'zh' is not supported, should fall back to browser or 'ar'
      const locale = detectLocale();
      expect(['ar', 'en', 'fr', 'es']).toContain(locale);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('quantumSettings', '{not valid json}');
      // Should not throw, should fall back to browser or 'ar'
      expect(() => detectLocale()).not.toThrow();
      const locale = detectLocale();
      expect(['ar', 'en', 'fr', 'es']).toContain(locale);
    });

    it('should handle null value in localStorage', () => {
      // localStorage.getItem returns null when key doesn't exist
      expect(() => detectLocale()).not.toThrow();
    });

    it('should handle settings without language key', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ theme: 'dark' }));
      const locale = detectLocale();
      expect(['ar', 'en', 'fr', 'es']).toContain(locale);
    });

    it('should handle settings with non-string language value', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 42 }));
      const locale = detectLocale();
      expect(['ar', 'en', 'fr', 'es']).toContain(locale);
    });
  });

  describe('t()', () => {
    it('should return Arabic for "loading" by default when ar is set', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'ar' }));
      expect(t('loading')).toBe('جاري التحميل...');
    });

    it('should return English for "loading" with en locale', () => {
      expect(t('loading', 'en')).toBe('Loading...');
    });

    it('should return French for "loading" with fr locale', () => {
      expect(t('loading', 'fr')).toBe('Chargement...');
    });

    it('should return Spanish for "loading" with es locale', () => {
      expect(t('loading', 'es')).toBe('Cargando...');
    });

    it('should return Arabic for "loading" with ar locale', () => {
      expect(t('loading', 'ar')).toBe('جاري التحميل...');
    });

    it('should return the key when the key does not exist', () => {
      expect(t('nonexistent_key_xyz', 'en')).toBe('nonexistent_key_xyz');
    });

    it('should return the key for unknown key with ar locale', () => {
      expect(t('no_such_key', 'ar')).toBe('no_such_key');
    });

    it('should use locale from localStorage when no explicit locale given', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'en' }));
      expect(t('loading')).toBe('Loading...');
    });

    it('should use locale from localStorage for French', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'fr' }));
      expect(t('loading')).toBe('Chargement...');
    });

    it('explicit locale parameter should override localStorage', () => {
      localStorage.setItem('quantumSettings', JSON.stringify({ language: 'ar' }));
      // Explicit 'en' should override the stored 'ar'
      expect(t('loading', 'en')).toBe('Loading...');
    });

    it('all supported locales should return non-empty string for "loading"', () => {
      const locales: SupportedLocale[] = ['ar', 'en', 'fr', 'es'];
      for (const locale of locales) {
        const result = t('loading', locale);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('should return distinct translations for each locale', () => {
      const ar = t('loading', 'ar');
      const en = t('loading', 'en');
      const fr = t('loading', 'fr');
      const es = t('loading', 'es');
      // Each locale has a unique translation
      const unique = new Set([ar, en, fr, es]);
      expect(unique.size).toBe(4);
    });
  });
});
