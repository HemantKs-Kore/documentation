import { GlobalErrorHandler } from './global-error-handler';
import { ErrorHandler } from '@angular/core';
import { ServerErrorInterceptor } from './server-error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';

export const globalErrorProviders = [
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
];
