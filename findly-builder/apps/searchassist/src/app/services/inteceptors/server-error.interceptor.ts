import { catchError } from 'rxjs/operators';
import { NotificationService } from './../notification.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  handleServerError(error: HttpErrorResponse) {
    let errMsg = '';
    switch (error.status) {
      case 401: {
        errMsg = '401 Unauthorized';
        break;
      }
      case 404: {
        errMsg = 'Requested Resource Not Found';
        break;
      }
      case 403: {
        errMsg = 'Access Denied';
        break;
      }
      case 500: {
        errMsg = 'Internal Server Error';
        break;
      }
      // default: {
      //   errMsg = `${error.statusText}`;
      // }
    }

    if (errMsg && !error['error']['errors']?.length) {
      this.notificationService.notify(errMsg, 'error');
    }
    return throwError(() => error);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // skip request
    // if (!req.url.includes(paths.sources)) {
    //   return next.handle(req);
    // }

    return next.handle(req).pipe(
      // retry(2),
      catchError((err: HttpErrorResponse) => {
        if (err.error instanceof ErrorEvent) {
          // Client Side Http Error
          // this.notificationService.notify(err.error.message, 'error');
          return throwError(() => err);
        } else {
          // Server Side Http Error
          return this.handleServerError(err);
        }
      })
    );
  }
}
