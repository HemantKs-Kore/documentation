/* eslint-disable @typescript-eslint/no-this-alias */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ServiceInvokerService } from './service-invoker.service';
import { WorkflowService } from './workflow.service';
import { NotificationService } from './notification.service';
import { AppSelectionService } from './app.selection.service';
import { AuthService } from './auth.service';

declare const $: any;
declare const window: any;
declare let inlineManualPlayerData: any;
declare let createInlineManualPlayer: any;
@Injectable({
  providedIn: 'root',
})
export class InlineManualService {
  selectedApp;
  serachIndexId;
  inlineManualInfo;
  constructor(
    public authService: AuthService,
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public appSelectionService: AppSelectionService,
    private notificationService: NotificationService
  ) {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp
      ? this.selectedApp.searchIndexes[0]._id
      : '';
  }
  topicHelpMap = {
    CHANNELS: '88836',
    ADDING_WEB_FILE_CONTENT: '89011',
    ACTION_SUB_TOPIC: '89332',
    APP_WALKTHROUGH: '88933',
    CONTENT_OVERVIEW: '89010', //d
    CONTENT_SUB_TOPIC: '85339',
    ADD_CONTENT_FROM_LANDING: '89008',
    CRAWL_WEB_SOURCE: '88953',
    CREATE_APP: '85337',
    CREDENTIALS: '88835',
    EXPERIMENTS: '88837', //d
    EXTRACT_FAQ_FROM_SOURCE: '89022',
    ADD_FAQ_FROM_LANDING: '88927',
    EXTRACT_FAQ_SUB_TOPIC: '88926',
    FACETS: '88590', //d
    FACETS_OVERVIEW: '89394',
    FAQ_OVERVIEW: '88928',
    FIEDS_TABLE: '88907',
    IMPORT_FAQ_FROM_SOURCE: '89023',
    ADD_FAQ_MAUALY_FROM_SOURCE: '89024',
    ADD_FAQ_MAUALY_SUB_TOPIC: '88454',
    IMPORT_FAQ_SUB_TOPIC: '88455',
    IMPORT_STRUCTURED_DATA: '89187',
    MULTIPLE_INDEX: '88923',
    RESULT_RANKING: '89209',
    RULES: '89207', //d
    SEARCH_INTERFACE: '89210',
    RESULT_TEMPLATE: '89333',
    SMALL_TALK: '88833',
    SOURCES: '89050',
    STOP_WORDS: '88588', //d
    ADD_STRUCTURED_DATA_LANDING: '89190',
    ADD_STRUCTURED_DATA_MANUALY: '89188',
    STRUCTURED_DATA_WALKTHROUGH: '89206',
    SYNONYMS: '88587', //d '88586'
    UPLOAD_FILE_FROM_LANDING_PAGE: '89009',
    UPLOAD_FILE_FROM_SOURCE: '89007',
    UPLOAD_FILE_SUB_TOPIC: '88954',
    WEIGHTS: '88687',
    WORKBENCH: '88908',
    BOT_ACTION_FROM_LANDING_PAGE: '88834',
  };
  loadInlineManualScripts = function () {
    const _self = this;
    function inlinemanual_init() {
      createInlineManualPlayer(inlineManualPlayerData);
      setTimeout(function () {
        // console.log("inline_manual_player",inline_manual_player)
        // if (inline_manual_player) {
        //   inline_manual_player.deactivate();
        // }
      }, 200);
    }
    function loadInlineManualScripts(PLAYER_ID) {
      let koreUID = _self.authService.getUserId();
      koreUID = btoa(
        koreUID.substring(koreUID.indexOf('u-') + 2, koreUID.length)
      ); //converting to base64 by removing u-
      // inlineManualTracking = {
      //     uid: koreUID
      // };
      //inlineManualTracking['uid'] = koreUID
      const scripts = [
        '//inlinemanual.com/embed/player.' + PLAYER_ID + '.bare.js',
      ];
      const script = scripts.shift();
      const el = document.createElement('script') as any;
      el.language = 'javascript';
      el.async = 'true';
      el.charset = 'UTF-8';
      el.type = 'text/javascript';
      $('body').append(el);
      el.onload = function () {
        inlinemanual_init();
      };
      el.src = script;
    }
    const inline: any = environment;
    if (
      inline.hasOwnProperty('INLINE_MANUAL_SITE_KEY') &&
      inline['INLINE_MANUAL_SITE_KEY']
    ) {
      //loadInlineManualScripts(inline['INLINE_MANUAL_SITE_KEY']);
    }
  };

  openHelp = function (helpId) {
    // if (this.topicHelpMap[helpId] && inline_manual_player) {
    //   inline_manual_player?.activateTopic(this.topicHelpMap[helpId]);
    // }
  };
  getInlineSuggestionData() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp
      ? this.selectedApp.searchIndexes[0]._id
      : '';
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    if (this.serachIndexId) {
      this.service.invoke('get.inlineManual', quaryparms).subscribe(
        (res) => {
          this.inlineManualInfo = res.inlineManualInfo;
        },
        (errRes) => {
          if (
            errRes &&
            errRes.error.errors &&
            errRes.error.errors.length &&
            errRes.error.errors[0] &&
            errRes.error.errors[0].msg
          ) {
            this.notificationService.notify(
              errRes.error.errors[0].msg,
              'error'
            );
          } else {
            this.notificationService.notify('Failed ', 'error');
          }
        }
      );
    }
  }
  checkVisibility(module, moduleName?) {
    const visited = false;
    // let data = [];
    // if(this.appSelectionService && this.appSelectionService.inlineManualInfo){
    //    data = [...this.appSelectionService.inlineManualInfo];
    // }
    // if(!data.length && moduleName == "SUMMARY"){
    //   this.openHelp('APP_WALKTHROUGH');
    // }
    // data.forEach(element => {
    //   if (element[module]) {
    //     visited = element[module].visited;
    //   }
    // });
    return visited;
  }
  visited(module) {
    // let payload = {};
    // let data = [];
    // if(this.appSelectionService && this.appSelectionService.inlineManualInfo){
    //    data = [...this.appSelectionService.inlineManualInfo];
    // }
    // data.forEach(element => {
    //   if (element[module]) {
    //     payload[module] = {
    //       id: element[module].id,
    //       visited: true
    //     }
    //   }
    // });
    // this.saveInlineSuggestionData(payload);
  }
  saveInlineSuggestionData(payload) {
    this.selectedApp = this.workflowService.selectedApp();
    if (this.selectedApp && this.selectedApp.searchIndexes.length) {
      this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    } else {
      this.serachIndexId = '';
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    if (this.serachIndexId) {
      this.service
        .invoke('put.updateInlineManual', quaryparms, payload)
        .subscribe(
          (res) => {
            //this.getInlineSuggestionData();
            this.appSelectionService.getInlineManualcall();
          },
          (errRes) => {
            if (
              errRes &&
              errRes.error.errors &&
              errRes.error.errors.length &&
              errRes.error.errors[0] &&
              errRes.error.errors[0].msg
            ) {
              this.notificationService.notify(
                errRes.error.errors[0].msg,
                'error'
              );
            } else {
              this.notificationService.notify('Failed ', 'error');
            }
          }
        );
    }
  }
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