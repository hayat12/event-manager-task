import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { Language } from './app/core/constants/languages';

/** Starts the app for one language; routes live under /<language>/. */
export function bootstrap(language: Language) {
  return bootstrapApplication(App, {
    providers: [
      ...appConfig.providers,
      { provide: LOCALE_ID, useValue: language },
      { provide: APP_BASE_HREF, useValue: `/${language}/` },
    ],
  });
}
