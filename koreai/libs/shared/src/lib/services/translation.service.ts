import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private translate: TranslateService, private router: Router) {}

  loadModuleTranslations(moduleName?: string) {
    const routePath = moduleName ? moduleName : this.router.url.slice(1);
    const i18nPath = `${routePath}/${this.translate.getDefaultLang()}`;
    this.translate.setTranslation(i18nPath, this.getTranslation(i18nPath));
    this.translate.use(i18nPath);
  }

  getTranslation(i18nPath: string) {
    return `../../assets/i18n/${i18nPath}`;
  }
}
