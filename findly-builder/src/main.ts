import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/lint/json-lint';
declare global {
  interface Window { appConfig: any; }
}
if (environment.production) {
  enableProdMode();
}

window.appConfig=environment;
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
