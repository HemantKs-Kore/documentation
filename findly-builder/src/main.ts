import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/lib/codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
declare global {
  interface Window { appConfig: any; }
}

// overriding the API_SERVER_URL with hosted env to support on-prem
if (environment.tag !== 'dev') {
  environment.API_SERVER_URL = window.location.protocol + '//' + window.location.host;
}
window.appConfig=environment;
if (environment.production) {
  enableProdMode();
}

window.appConfig=environment;
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
