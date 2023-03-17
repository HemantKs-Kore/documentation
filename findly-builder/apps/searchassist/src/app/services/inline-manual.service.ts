/* eslint-disable @typescript-eslint/no-this-alias */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare const $: any;
declare const window: any;
// declare let inlineManualPlayerData: any;
// declare let createInlineManualPlayer: any;
@Injectable({
  providedIn: 'root',
})
export class InlineManualService {
  constructor() {}

  // AppsCue
  loadAppscue() {
    const self = this;
    const env: any = environment;
    if (env.APPCUES && env.APPCUES.ENABLE) {
      self.loadAppcuesScripts(env.APPCUES.APPCUES_KEY);
    }
  }

  loadAppcuesScripts = function (appcuesKey) {
    const self = this;
    function appcues_init() {
      if (self.authService.isAuthenticated()) {
        let koreUID = self.authService.getUserId();
        const koreAuthInfo = self.authService.getAuthInfo();
        const koreEmail = koreAuthInfo.currentAccount
          ? koreAuthInfo.currentAccount.userInfo.emailId
          : koreAuthInfo.entAdmin
          ? koreAuthInfo.entAdmin.userInfo.emailId
          : '';
        koreUID = btoa(
          koreUID.substring(koreUID.indexOf('u-') + 2, koreUID.length)
        ); //converting to base64 by removing u-
        window.Appcues.identify(
          koreUID, // unique, required
          {
            email: koreEmail, // Current user's email
          }
        );
      }
    }
    function loadAppcuesScript(APPCUES_KEY) {
      const _self = this;
      const scripts = ['//fast.appcues.com/' + APPCUES_KEY + '.js'];
      const script = scripts.shift();
      const el: any = document.createElement('script');
      el.language = 'javascript';
      el.async = 'true';
      el.charset = 'UTF-8';
      el.type = 'text/javascript';
      $('body').append(el);
      el.onload = function () {
        appcues_init();
      };
      el.src = script;
    }
    if (appcuesKey) {
      loadAppcuesScript(appcuesKey);
    }
  };
}
