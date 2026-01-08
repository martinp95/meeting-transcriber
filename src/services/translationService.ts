export type Language = 'es' | 'en';

export interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  es: {},
  en: {}
};

let loaded = false;

export async function loadTranslations(): Promise<void> {
  if (loaded) return;

  try {
    const [esResponse, enResponse] = await Promise.all([
      fetch('/locales/es.json'),
      fetch('/locales/en.json')
    ]);

    if (!esResponse.ok || !enResponse.ok) {
      throw new Error('Failed to load translation files');
    }

    translations.es = await esResponse.json();
    translations.en = await enResponse.json();
    loaded = true;
  } catch (error) {
    console.error('Error loading translations:', error);
    // Fallback to empty objects if loading fails
  }
}

export function getTranslations(language: Language): Translations {
  return translations[language];
}

export async function t(language: Language, key: string): Promise<string> {
  await loadTranslations();
  return translations[language][key] || key;
}
