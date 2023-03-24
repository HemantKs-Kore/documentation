import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from '../logging.service';
import { ErrorService } from '../error.service';
import { NotificationService } from '../notification.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  override handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);
    const notifier = this.injector.get(NotificationService);

    let message;
    let stackTrace;
    if (error instanceof HttpErrorResponse) {
      // Server error
      message = errorService.getServerErrorMessage(error);
      //stackTrace = errorService.getServerErrorStackTrace(error);
    } else {
      // Client Error
      message = error && errorService.getClientErrorMessage(error);
    }

    // Always log errors
    // logger.logError(message, stackTrace);

    // Let's not supress console error as it helps dev a lot
    if (error && !message.includes('retrieving PDF')) {
      // Notify Error
      notifier.notify(message, 'error');
      super.handleError(error);
    }
  }
}
