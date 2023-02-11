import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare global {
  interface Window {
    appConfig: any;
  }
}

// overriding the API_SERVER_URL with hosted env to support on-prem
if (environment.tag !== 'dev') {
  environment.API_SERVER_URL =
    window.location.protocol + '//' + window.location.host;
}
if (environment.production) {
  enableProdMode();
  window.console.log = () => {};
}

window.appConfig = environment;
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
