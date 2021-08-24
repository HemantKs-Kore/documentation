import { Injectable } from '@angular/core';
import  mixpanel  from 'mixpanel-browser';

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
  init(){
    mixpanel.init('b8cca4172b544f41f2dde97189667d81');
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
