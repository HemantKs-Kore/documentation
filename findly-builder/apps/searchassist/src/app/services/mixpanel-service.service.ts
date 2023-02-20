import { Injectable } from '@angular/core';
declare const mixpanel;
import { environment } from '../../environments/environment';
declare const $: any;
@Injectable({
  providedIn: 'root',
})
export class MixpanelServiceService {
  email = '';
  utm = '';
  enabled = false;
  PLGScoresevents = {
      "Explore App named": 2,
      "Joined Workspace":3,
      "Start create app":5,
      "Content Crawl web domain success":3,
      "Content File extraction success":3,
      "FAQ Web extract success":3,
      "FAQ File extraction success":3,
      "Manual FAQ added":3,
      "Enter Fields": 1,
      "Add Field complete": 5,
      "Trait Group created":2,
      "Trait utterance added":5,
      "Enter Workbench":1,
      "Workbench Stage added":0,
      "Workbench simulation failed":0,
      "Workbench simulation complete":5,
      "Enter Weights":0,
      "Save Weights":0
      
  };
excludedMailDomains = [ 'mailinator.com' , 'yopmail.com' , 'abc.com' , 'xyz.com' , 'qq.com' , 'vomoto.com', '.xyz'];
constructor() { 
} /** */
checkForEmailDomains = function(email) {
  let valid = true;
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
      mixpanel.init(mixpanelEnv['MIXPANEL_KEY'],{ batch_requests: true, ignore_dnt: true });
  }
}
reset =  function(){
  this.enabled = false;
  this.email = "";
  try{
      if(mixpanel && mixpanel.reset){
      //   console.log('Mixpanel.....')
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
              this.email = email;
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
              this.email = email;
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
  this.numericCounter(event,eventPayload)
  let userInfo : any//$applicationService.userInfo();
  eventPayload =  eventPayload || {};
    /** UTM code */
  //   let userProperties = {};
  //   let oneTimeParms = {};
  //   let utmDetails = window.localStorage.getItem('utmDetails') || this.utm;
  //   if (utmDetails) {
  //       var _uat = JSON.parse(utmDetails);
  //       this.utm = utmDetails;
  //       if (Object.keys(_uat) && Object.keys(_uat).length) {
  //           var utmparameters = Object.keys(_uat);

  //           utmparameters.forEach(function (value) {
  //               oneTimeParms['First ' + value] = _uat[value];
  //           });
  //       }
  //       userProperties = _uat || {};
  //       localStorage.removeItem('utmDetails');

  //       if (oneTimeParms && Object.keys(oneTimeParms) && Object.keys(oneTimeParms).length) {
  //           this.oneTimeProperties(oneTimeParms,userInfo);
  //       }
  //     }
  /** UTM code */
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
          if(mixpanel && event && this.email){
              mixpanel.track(event);
          }
         } catch(e){
             return;
     }
  }
};
oneTimeProperties = (payload , userInfo) => {
  // const service: any = ServiceInvokerService;
  // const http: any = HttpClient;
    try {
        if (mixpanel && userInfo.email && window.appConfig.USAGE_ANALYTICS && window.appConfig.USAGE_ANALYTICS.ENABLE && window.appConfig.USAGE_ANALYTICS.MIX_PANEL && window.appConfig.USAGE_ANALYTICS.MIX_PANEL.ENABLE && window.appConfig.USAGE_ANALYTICS.MIX_PANEL.MIX_PANEL_TOKEN) {
            const data = JSON.stringify([
                {
                    "$token": window.appConfig.USAGE_ANALYTICS.MIX_PANEL.MIX_PANEL_TOKEN,
                    "$distinct_id": userInfo.email,
                    "$set_once": payload
                }
            ]);
            const settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://api.mixpanel.com/engage#profile-set-once",
                "method": "POST",
                "headers": {
                    "Accept": "text/plain",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "data": data
                }
            };
            /** using JS Ajax */ 
              // $http.get(settings).done(function (response) {
              //     console.log(response);
              // });
            /** using Angular Service */ 
              // service.invoke(settings).subscribe(res => {
              //     console.log(res);
              // });
           /** using Angular  Ajax */ 
              // http.get(settings).done(res => {
              //     console.log(res);
              // });
        }
    } catch (error) {
        console.log(error);
    }
};
  numericCounter = (event, eventPayload) => {
      const mixpanelEnv: any = environment;
      // const service: any = ServiceInvokerService;
      // const http: any = HttpClient;
      try {
          const PLGScoreAddition = this.PLGScoresevents[event];
          if (!PLGScoreAddition) {
              return;
          }
          if (this.email && mixpanelEnv.hasOwnProperty('MIXPANEL_KEY') && mixpanelEnv['MIXPANEL_KEY']) {
              const settings = {
                  "async": true,
                  "crossDomain": true,
                  "url": "https://api.mixpanel.com/engage#profile-numerical-add",
                  "method": "POST",
                  "headers": {
                      "Accept": "text/plain",
                      "Content-Type": "application/x-www-form-urlencoded"
                  },
                  "data": {
                      "data": "{\n    \"$token\": \"" + mixpanelEnv['MIXPANEL_KEY'] + "\",\n    \"$distinct_id\": \"" + this.email + "\",\n    \"$add\": { \"PLG\": " + PLGScoreAddition + " }\n}\n"
                  }
              };
              /** OLD ajaz  */
              $.ajax(settings).done(function (response) {
                  // console.log(response);
              });
              /** using JS Ajax */ 
              // $http.get(settings).done(function (response) {
              //     console.log(response);
              // });
            /** using Angular Service */ 
              // service.invoke(settings).subscribe(res => {
              //     console.log(res);
              // });
           /** using Angular  Ajax */ 
              // http.prototype.get(settings).done(res => {
              //     console.log(res);
              // });
          }
      } catch (error) {
          console.log(error);
      }
  };

}
