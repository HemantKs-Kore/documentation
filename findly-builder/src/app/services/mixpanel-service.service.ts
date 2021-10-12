import { Injectable } from '@angular/core';
import  mixpanel  from 'mixpanel-browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MixpanelServiceService {
  email = '';
  enabled = false;
  excludedMailDomains = [ 'mailinator.com' , 'yopmail.com' , 'abc.com' , 'xyz.com' , 'qq.com' , 'vomoto.com', '.xyz'];
  constructor() { 
  } /** */
  checkForEmailDomains = function(email) {
    var valid = true;
    this.excludedMailDomains.forEach(function (domain){
        if(email.includes(domain)){
            valid =  false; 
        }
    });
  this.enabled = valid;
  };

  checkForKey(){
    const mixpanelEnv: any = environment;
    if (mixpanelEnv.hasOwnProperty('MIXPANEL_KEY') && mixpanelEnv['MIXPANEL_KEY']) {
        this.enabled = true; 
    }else{
        this.enabled = false; 
    }
  }
  init(){
    const mixpanelEnv: any = environment;
    if (mixpanelEnv.hasOwnProperty('MIXPANEL_KEY') && mixpanelEnv['MIXPANEL_KEY']) {
        mixpanel.init(mixpanelEnv['MIXPANEL_KEY']);
    }
  }
  reset =  function(){
    this.enabled = false;
    try{
        if(mixpanel && mixpanel.reset){
          console.log('Mixpanel.....')
            mixpanel.reset();
        }
       } catch(e){
           return;
       }
  };
  setUserInfo = function (email,userInfo) {
    this.checkForEmailDomains(email);
    this.checkForKey();
    if(!this.enabled){
        return;
    }
    if(userInfo){
       try{
        if(mixpanel && mixpanel.people){
            if(email){
                mixpanel.identify(email);
            }
            userInfo.Time = new Date().toISOString();
            mixpanel.people.set(userInfo);
        }
       } catch(e){
           return;
       }
    } else {
        try{
            if(mixpanel){
                mixpanel.identify(email);
            }
           } catch(e){
               return;
       }
    }

  };
  postEvent = function (event,eventPayload) {
    this.checkForKey();
    if(!this.enabled){
       return;
    }
    var userInfo : any//$applicationService.userInfo();
    eventPayload =  eventPayload || {};
    if(eventPayload){
        if(userInfo && userInfo.koreUserInfo) {
            eventPayload.$email = userInfo.koreUserInfo.emailId;
            eventPayload.$name = userInfo.koreUserInfo.fName + ' ' + userInfo.koreUserInfo.lName; 
            eventPayload.orgId = userInfo.orgId;
            eventPayload.accountId = userInfo.koreUserInfo.accountId;
        }
       try{
        if(mixpanel && event){
            mixpanel.track(event, eventPayload);
        }
       } catch(e){
           return;
       }
    } else {
        try{
            if(mixpanel && event){
                mixpanel.track(event);
            }
           } catch(e){
               return;
       }
    }

  };
  
}
