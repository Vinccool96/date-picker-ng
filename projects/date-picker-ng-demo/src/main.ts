import './app/locale.import';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}

try {
  await bootstrapApplication(App, appConfig);
} catch (error: unknown) {
  console.error(error);
}
