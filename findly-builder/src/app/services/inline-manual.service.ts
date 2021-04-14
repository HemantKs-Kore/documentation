import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {AuthService} from '@kore.services/auth.service';
declare const $: any;
declare const inline_manual_player: any;
declare let inlineManualTracking: any
declare let inlineManualPlayerData : any;
declare let  createInlineManualPlayer : any;
@Injectable({
  providedIn: 'root'
})
export class InlineManualService {
  
  constructor(public authService : AuthService) { }
  topicHelpMap = {
      BOT_WALK_THROUGH: '60080',
      PRODUCT_TOUR: '',
      TAKE_TOUR: "64679",//this can be overridden by version below with takeTourVersionMap//"64679", //"60493",//What's New
      CREATE_BOT_ALERT:'60281',
      CREATE_BOT_DIALOG:'60555',
      CREATE_BOT_KT:'60129',
      EXPERIMENTS : '88837'
  };
  loadInlineManualScripts = function () {
    var _self = this
    function inlinemanual_init() {
        createInlineManualPlayer(inlineManualPlayerData);
        setTimeout(function () {
            if (inline_manual_player) {
                inline_manual_player.deactivate();
            }
        }, 200);
    }
    function loadInlineManualScripts(PLAYER_ID) {
      
        var koreUID = _self.authService.getUserId();
        koreUID = btoa(koreUID.substring(koreUID.indexOf('u-') + 2, koreUID.length));//converting to base64 by removing u-
        // inlineManualTracking = {
        //     uid: koreUID
        // };
        //inlineManualTracking['uid'] = koreUID
        var scripts = [
            '//inlinemanual.com/embed/player.' + PLAYER_ID + '.bare.js'
        ];
        var script = scripts.shift();
        var el = document.createElement('script') as any;
        el.language = 'javascript';
        el.async = 'true';
        el.charset = "UTF-8";
        el.type = 'text/javascript';
        $('body').append(el);
        el.onload = function () {
            inlinemanual_init();
        };
        el.src = script;
    }
    if (environment.INLINE_MANUAL_SITE_KEY) {
        loadInlineManualScripts(environment.INLINE_MANUAL_SITE_KEY);
    }
  };

  openHelp = function (helpId) {
    if (this.topicHelpMap[helpId] && inline_manual_player) {
        inline_manual_player.activateTopic(this.topicHelpMap[helpId]);
    }
};
}
