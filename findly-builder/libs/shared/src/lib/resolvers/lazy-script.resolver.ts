import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { LazyLoadService } from '../services/lazy-load.service';

@Injectable({
  providedIn: 'root',
})
export class LazyScriptResolver implements Resolve<boolean> {
  constructor(public lazyLoadService: LazyLoadService) {}
  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this.lazyLoadService.addScript(route.data['scriptName']);
  }
}
