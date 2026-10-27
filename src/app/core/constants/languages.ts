export const LANGUAGES = ['de', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'de';

export function isLanguage(value: string | undefined): value is Language {
  return LANGUAGES.includes(value as Language);
}
