import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isRequestCachable(req)) {
      const cachedResponse = this.cache.get(req.url);
      if (cachedResponse) {
        return of(cachedResponse);
      }

      return next.handle(req).pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            this.cache.set(req.url, event);
          }
        })
      );
    } else {
      return next.handle(req);
    }
  }

  isRequestCachable(request: HttpRequest<unknown>): boolean {
    if (request.method === 'GET') {
      if (request.headers.has('cache')) {
        return true;
      }
      return false;
    }

    return false;
  }
}
