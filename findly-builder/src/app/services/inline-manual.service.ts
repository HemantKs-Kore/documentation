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
      CREATEAPP :'85337',
      CHANNELS :'88836',
      CONTENT :'89010',
      CRAWL_WEB_LANDING : '89008',
      CRAWL_WEB_SOURCE: '88953',
      CREATE_APP : '85337',
      CREDENTIALS :'88835',
      EXPERIMENTS : '88837',
      EXTRACT_FAQ_FROM_SOURCE : '89022',  
      EXTRACT_FAQ : '88926',
      FACETS : '88590',
      FAQ_OVERVIEW : '88928',
      FIEDS_TABLE :'88907',
      IMPORT_FAQ_FROM_SOURCE : '89023',
      IMPORT_FAQ : '88455',
      IMPORT_STRUCTURED_DATA : '89187',
      MULTIPLE_INDEX : '88923',
      RESULT_RANKING :'89209',
      RULES : '89207',
      SEARCH_INTERFACE : '89210',
      SMALL_TALK : '88833',
      SOURCES : '89050',
      STOP_WORDS : '88588',
      STRUCTURED_DATA_WALKTHROUGH : '89206',
      SYNONYMS :'88586', // '88586'
      UPLOAD_FILE_FROM_LANDING_PAGE : '89009',
      UPLOAD_FILE_FROM_SOURCE : '89007',
      UPLOAD_FILE_SUB_TOPIC : '88954',
      WEIGHTS : '88687',
      WORKBENCH : '88908'
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
