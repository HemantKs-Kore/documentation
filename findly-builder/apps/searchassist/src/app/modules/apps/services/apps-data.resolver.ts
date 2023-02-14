import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { AppsService } from './apps.service';

@Injectable({
  providedIn: 'root',
})
export class AppsDataResolver implements Resolve<boolean> {
  constructor(private appsService: AppsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.appsService.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.appsService.getAll();
        }
      }),
      first()
    );
  }
}
