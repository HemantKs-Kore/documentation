/* eslint-disable no-empty-character-class */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppUrlsService {
  public WINDOW = window;
  public utmLocation = '';
  constructor() {}
  appURL() {
    return (
      this.WINDOW.location.protocol +
      '//' +
      this.WINDOW.location.host +
      this.WINDOW.location.pathname
    );
  }
  marketURL() {
    return (
      this.WINDOW.location.protocol +
      '//' +
      this.WINDOW.location.host +
      '/accounts'
    );
    //return 'http://localhost:8000';
  }
  completeAppPath() {
    return this.WINDOW.location.href;
  }
  public getLoginRedirectURL(): string {
    const redirectedUrl = this.completeAppPath();
    this.utmLocation = window.location.search.replace('?', '&');
    // tslint:disable-next-line:max-line-length
    return (
      this.marketURL() +
      '/?return_to=' +
      redirectedUrl +
      '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true&comingFromKey=isSearchAssist'
    );
  }
  public redirectToLogin() {
    this.utmParams();
    setTimeout(() => {
      const redirectUrl = this.getLoginRedirectURL();
      if (localStorage.getItem('utmLocation')) {
        debugger;
        window.location.href =
          redirectUrl + localStorage.getItem('utmLocation');
      } else {
        window.location.href = redirectUrl;
      }
    }, 100);
  }
  /** fetching UTM Params from href */
  public utmParams() {
    const location = window.location.search;
    this.utmLocation = window.location.search.replace('?', '&');
    if (this.utmLocation) {
      window.localStorage.setItem('utmLocation', this.utmLocation);
    }
    if (!window.localStorage.getItem('utmDetails')) {
      this.campaignParams();
    }
  }

  public getQueryParam(url, param) {
    // Expects a raw URL
    // eslint-disable-next-line no-useless-escape
    param = param.replace(/[[]/, '[').replace(/[]]/, ']');
    const regexS = '[?&]' + param + '=([^&#]*)',
      regex = new RegExp(regexS),
      results = regex.exec(url) || [];
    if (
      results === null ||
      (results && typeof results[1] !== 'string' && results[1]?.length)
    ) {
      return '';
    } else {
      return decodeURIComponent(results[1]).replace(/\W/gi, ' ');
    }
  }
  /** Campains storage  */
  public campaignParams() {
    const campaign_keywords =
      'utm_source utm_medium utm_campaign utm_content utm_term'.split(' ');
    let kw = '';
    const params = {};
    const first_params = {};
    let index;
    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = this.getQueryParam(window.location.search, campaign_keywords[index]);
      if (kw.length && kw != 'undefined') {
        params[campaign_keywords[index] + ' [last touch]'] = kw;
      }
    }
    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = this.getQueryParam(window.location.search, campaign_keywords[index]);
      if (kw.length && kw != 'undefined') {
        first_params[campaign_keywords[index] + ' [first touch]'] = kw;
      }
    }
    if (
      JSON.stringify(params) !== '{}' ||
      JSON.stringify(first_params) !== '{}'
    ) {
      window.localStorage.setItem('utmDetails', JSON.stringify(params));
      window.localStorage.setItem(
        'utmDetails_first',
        JSON.stringify(first_params)
      );
    }
  }
  public redirectToLoginBotStore() {
    // let _redirectUrl=this.marketURL()+'/?showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true';
    // window.location.href=_redirectUrl;
    this.redirectToLogin();
  }
}
