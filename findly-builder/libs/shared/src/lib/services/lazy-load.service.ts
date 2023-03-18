import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LazyLoadService {
  private _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

  constructor(@Inject(DOCUMENT) private readonly document: any) {}

  // lazyLoadCodeMirror(): Observable<any> {
  //   return forkJoin([
  //     this.loadScript('assets/quill/quill.min.js'),
  //     this.loadStyle('assets/quill/quill.snow.css')
  //   ]);
  // }

  addScript(scriptName: string) {
    // Check if your file is in the cache
    return caches
      .match(scriptName)
      .then((response) => {
        // If the file is in the cache, serve it from there
        if (response) {
          return response.text();
        }
        // If the file is not in the cache, fetch it from the network and cache it
        else {
          return fetch(scriptName).then((response) => {
            // Clone the response
            const responseToCache = response.clone();

            caches.open('sa-cache').then((cache) => {
              cache.put(scriptName, responseToCache);
            });
            return response.text();
          });
        }
      })
      .then((scriptContent) => {
        // Create a new script element and add it to the DOM
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);
      });
  }

  loadScript(url: string): Observable<any> {
    if (this._loadedLibraries[url]) {
      return this._loadedLibraries[url].asObservable();
    }

    this._loadedLibraries[url] = new ReplaySubject();

    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.defer = true;
    script.src = url;
    script.onload = () => {
      this._loadedLibraries[url].next(null);
      this._loadedLibraries[url].complete();
    };

    this.document.body.appendChild(script);

    return this._loadedLibraries[url].asObservable();
  }

  loadStyle(url: string): Observable<any> {
    if (this._loadedLibraries[url]) {
      return this._loadedLibraries[url].asObservable();
    }

    this._loadedLibraries[url] = new ReplaySubject();

    const style = this.document.createElement('link');
    style.type = 'text/css';
    style.href = url;
    style.rel = 'stylesheet';
    style.onload = () => {
      this._loadedLibraries[url].next(null);
      this._loadedLibraries[url].complete();
    };

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(style);

    return this._loadedLibraries[url].asObservable();
  }
}
