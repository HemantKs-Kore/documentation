import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LazyLoadService } from '../services/lazy-load.service';

@Injectable({
  providedIn: 'root',
})
export class LazyScriptResolver implements Resolve<boolean> {
  constructor(public lazyLoadService: LazyLoadService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.lazyLoadService.loadScript(route.data['scriptName']);
  }
}
