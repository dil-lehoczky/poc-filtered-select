import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { worker } from './mocks/browser';

worker.start();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
