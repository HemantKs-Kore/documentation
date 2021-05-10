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
  }
  completeAppPath() {
    return this.WINDOW.location.href;
  }
  public getLoginRedirectURL(): string {
    const redirectedUrl = this.completeAppPath();
    // tslint:disable-next-line:max-line-length
    return this.marketURL() + '/?return_to=' + redirectedUrl + '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true&comingFromKey=isSearchAssist';
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
