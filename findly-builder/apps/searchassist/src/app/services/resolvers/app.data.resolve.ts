import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { AuthService } from '../auth.service';
// import {zip} from 'rxjs/operators';

@Injectable()
export class AppDataResolver implements Resolve<any> {
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((param) => {
      const params = Object.keys(param).length;
      if (params) {
        sessionStorage.setItem('connector', JSON.stringify(param));
      }
    });
  }
  // tslint:disable-next-line:max-line-length
  configNote = {
    duration: 600000,
    panelClass: ['background-logout'],
    verticalPosition: this.verticalPosition,
    data: { msg: '', action: '', stat: false },
  };

  resolve(route: ActivatedRouteSnapshot) {
    return Observable.create((observer) => {
      const promise1 = this.authService.getApplictionControlsFromServer();
      promise1.subscribe(
        (res) => {
          observer.next(res);
          // this.authService.seedData();
          // this.authService.getfindlyApps();
          observer.complete();
        },
        (errRes) => {
          observer.end();
        }
      );
    });
  }
}
