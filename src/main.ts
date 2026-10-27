/// <reference types="@angular/localize" />

import { loadTranslations } from '@angular/localize';
import { DEFAULT_LANGUAGE, isLanguage, Language } from './app/core/constants/languages';

/** Translation file as written: nested by feature > page > section. */
type TranslationTree = { [key: string]: string | TranslationTree };

// The language is the first URL segment: /de/events, /en/events.
const language = location.pathname.split('/')[1];

if (isLanguage(language)) {
  start(language).catch((err) => console.error(err));
} else {
  location.replace(`/${DEFAULT_LANGUAGE}${location.pathname}${location.search}${location.hash}`);
}

async function start(language: Language): Promise<void> {
  try {
    const response = await fetch(`i18n/${language}.json`);
    loadTranslations(flatten(await response.json()));
  } catch (err) {
    console.warn(`Translations for "${language}" could not be loaded.`, err);
  }
  document.documentElement.lang = language;
  const { bootstrap } = await import('./bootstrap');
  await bootstrap(language);
}

function flatten(tree: TranslationTree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((result, [key, value]) => {
    const id = prefix + key;
    return typeof value === 'string' ? { ...result, [id]: value } : { ...result, ...flatten(value, `${id}.`) };
  }, {});
}
