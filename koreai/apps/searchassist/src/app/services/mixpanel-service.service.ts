import { Injectable } from '@angular/core';
import { LazyLoadService } from '@kore.shared/*';
import mixpanel from 'mixpanel-browser';
import { take } from 'rxjs';
import { environment } from '../../environments/environment';

declare let mixpanel: any;

@Injectable({
  providedIn: 'root',
})
export class MixpanelServiceService {
  email = '';
  enabled = false;
  excludedMailDomains = [
    'mailinator.com',
    'yopmail.com',
    'abc.com',
    'xyz.com',
    'qq.com',
    'vomoto.com',
    '.xyz',
  ];
  constructor(private lazyLoadService: LazyLoadService) {
    this.lozyLoadAssets();
  }

  lozyLoadAssets() {
    this.lazyLoadService
      .loadScript(
        '../../../../../node_modules/mixpanel-browser/dist/mixpanel.cjs.js'
      )
      .pipe(take(1))
      .subscribe((res) => {
        if (!mixpanel) {
          mixpanel = res;
          this.init();
        }
      });
  }

  checkForEmailDomains = (email) => {
    let valid = true;
    this.excludedMailDomains.forEach((domain) => {
      if (email.includes(domain)) {
        valid = false;
      }
    });
    this.enabled = valid;
  };

  checkForKey() {
    const mixpanelEnv: any = environment;
    if (
      mixpanelEnv.hasOwnProperty('MIXPANEL_KEY') &&
      mixpanelEnv['MIXPANEL_KEY']
    ) {
      this.enabled = true;
    } else {
      this.enabled = false;
    }
  }
  init() {
    const mixpanelEnv: any = environment;
    if (
      mixpanelEnv.hasOwnProperty('MIXPANEL_KEY') &&
      mixpanelEnv['MIXPANEL_KEY']
    ) {
      mixpanel.init(mixpanelEnv['MIXPANEL_KEY']);
    }
  }
  reset = () => {
    this.enabled = false;
    try {
      if (mixpanel && mixpanel.reset) {
        //   console.log('Mixpanel.....')
        mixpanel.reset();
      }
    } catch (e) {
      return;
    }
  };
  setUserInfo = (email, userInfo) => {
    this.checkForEmailDomains(email);
    this.checkForKey();
    if (!this.enabled) {
      return;
    }
    if (userInfo) {
      try {
        if (mixpanel && mixpanel.people) {
          if (email) {
            mixpanel.identify(email);
          }
          userInfo.Time = new Date().toISOString();
          mixpanel.people.set(userInfo);
        }
      } catch (e) {
        return;
      }
    } else {
      try {
        if (mixpanel) {
          mixpanel.identify(email);
        }
      } catch (e) {
        return;
      }
    }
  };
  postEvent = (event, eventPayload) => {
    this.checkForKey();
    if (!this.enabled) {
      return;
    }
    let userInfo: any; //$applicationService.userInfo();
    eventPayload = eventPayload || {};
    if (eventPayload) {
      if (userInfo && userInfo.koreUserInfo) {
        eventPayload.$email = userInfo.koreUserInfo.emailId;
        eventPayload.$name =
          userInfo.koreUserInfo.fName + ' ' + userInfo.koreUserInfo.lName;
        eventPayload.orgId = userInfo.orgId;
        eventPayload.accountId = userInfo.koreUserInfo.accountId;
      }
      try {
        if (mixpanel && event) {
          mixpanel.track(event, eventPayload);
        }
      } catch (e) {
        return;
      }
    } else {
      try {
        if (mixpanel && event) {
          mixpanel.track(event);
        }
      } catch (e) {
        return;
      }
    }
  };
}
