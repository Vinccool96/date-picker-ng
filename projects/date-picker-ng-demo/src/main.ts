import './app/locale.import';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

try {
  await bootstrapApplication(App, appConfig);
} catch (error: unknown) {
  console.error(error);
}
