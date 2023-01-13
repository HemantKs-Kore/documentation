import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { from, Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { AppSelectionService } from  '@kore.services/app.selection.service';
// import {zip} from 'rxjs/operators';

@Injectable()

export class QueryPipelineResolver implements Resolve<any> {
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private appSelectionService: AppSelectionService, public snackBar: MatSnackBar) { }
  // tslint:disable-next-line:max-line-length
  configNote = { duration: 600000, panelClass: ['background-logout'], verticalPosition: this.verticalPosition, data: { msg: '', action: '', stat: false } };

  resolve(route: ActivatedRouteSnapshot) {
    return Observable.create(observer => {
      const promise1 = this.appSelectionService.getQureryPipelineIds();
      promise1.subscribe(res => {
          observer.next(res);
          observer.complete();
      }, errRes => {
        observer.end();
      });
    });
  }
}
