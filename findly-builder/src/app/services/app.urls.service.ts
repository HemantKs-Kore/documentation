import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppUrlsService {

  public WINDOW = window;
  constructor() {
  }
  appURL() {
    return  this.WINDOW.location.protocol + '//' + this.WINDOW.location.host + this.WINDOW.location.pathname;
  }
  marketURL() {
    return  this.WINDOW.location.protocol + '//' + this.WINDOW.location.host + '/accounts';
    //return 'http://localhost:8000';
  }
  completeAppPath() {
    return this.WINDOW.location.href;
  }
  public getLoginRedirectURL(): string {
    const redirectedUrl = this.completeAppPath();
    // tslint:disable-next-line:max-line-length
    console.log('URLLLLLLLL',this.marketURL() + '/?return_to=' + redirectedUrl + '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true')
    return this.marketURL() + '/?return_to=' + redirectedUrl + '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true';
  }
  public redirectToLogin() {
    const redirectUrl = this.getLoginRedirectURL();
    window.location.href = redirectUrl;
  }

  public redirectToLoginBotStore() {
    // let _redirectUrl=this.marketURL()+'/?showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true';
    // window.location.href=_redirectUrl;
    this.redirectToLogin();
  }

}
