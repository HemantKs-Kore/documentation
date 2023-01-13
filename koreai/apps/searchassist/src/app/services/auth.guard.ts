import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '@kore.services/auth.service';
import {AppUrlsService} from '@kore.services/app.urls.service'
import { environment } from '@kore.environment';
import { ServiceInvokerService } from './service-invoker.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private storageType = 'localStorage';
  constructor(
    private authService:AuthService,
    private appUrlsService:AppUrlsService,
    private service: ServiceInvokerService,
  ){
    if (environment && environment.USE_SESSION_STORE) {
      this.storageType = 'sessionStorage';
    }
  }
  // Get Account Configuration
  public getAccountConf() {
    this.service.invoke('app.account-configuratuion').subscribe(res => {
    }, errRes => {
      // console.log(errRes);
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    if(!this.authService.isAuthenticated()) {
      this.appUrlsService.redirectToLogin();
      return false;
    }else{
      let jStoarge = window[this.storageType].getItem('jStorage') ? JSON.parse(window[this.storageType].getItem('jStorage')):{}
      if(!jStoarge.currentAccount.accountConf){
        jStoarge.currentAccount['accountConf'] = true;
        window.localStorage.setItem('jStorage',JSON.stringify(jStoarge))
        this.getAccountConf();
      }
      return true;
    }
  }
}
