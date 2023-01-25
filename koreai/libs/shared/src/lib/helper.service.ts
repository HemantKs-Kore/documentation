import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  cssFiles: any[] = [];

  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];

    if (!this.cssFiles.includes(styleName)) {
      const style = this.document.createElement('link');
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
      this.cssFiles.push(styleName);
    }
  }
}
