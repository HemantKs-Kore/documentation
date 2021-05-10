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
<<<<<<< HEAD
    return this.marketURL() + '/?return_to=' + redirectedUrl + '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true&comingFromKey=isSearchAssist';
=======
    console.log('URLLLLLLLL',this.marketURL() + '/?return_to=' + redirectedUrl + '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true')
    return this.marketURL() + '/?return_to=' + redirectedUrl + '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true';
    var link = "http://localhost:8000/?return_to=http://localhost:4200&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true"
>>>>>>> 1b0b557017b7b2954e935ab97cab3d5a3143bde0
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
