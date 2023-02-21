import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { MixpanelServiceService } from './mixpanel-service.service';
import { LocalStoreService } from './localstore.service';
import { ServiceInvokerService } from './service-invoker.service';
import { AppUrlsService } from './app.urls.service';
import { environment } from '../../environments/environment';
declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authInfo;
  private appControlList = null;
  private selectedAccount = null;
  public findlyApps = new Subject<any>();
  private storageType = 'localStorage';
  private appControlListSource$ = new BehaviorSubject(null);
  appControlList$ = this.appControlListSource$.asObservable();

  constructor(
    private localstore: LocalStoreService,
    private service: ServiceInvokerService,
    private appUrls: AppUrlsService,
    public mixpanel: MixpanelServiceService
  ) {
    this.authInfo = localstore.getAuthInfo();
    if (environment && environment.USE_SESSION_STORE) {
      this.storageType = 'sessionStorage';
    }
  }
  public logout() {
    this.service.invoke('sales.signout', {}, {}).subscribe(
      (res) => {
        this.authInfo = false;
        this.localstore.removeAuthInfo();
        this.appUrls.redirectToLoginBotStore();
        this.mixpanel.reset();
      },
      (errRes) => {
        console.error('Failed in singing out');
      }
    );
  }
  public getAuthInfo() {
    return this.authInfo;
  }
  public isAuthenticated() {
    return this.authInfo ? true : false;
  }
  public getAccessToken() {
    let _accessToken = '';
    if (this.isAuthenticated) {
      try {
        _accessToken = this.authInfo.currentAccount.authorization.accessToken;
      } catch (error) {
        return false;
      }
      window.findlyAccessToken = _accessToken;
      return _accessToken;
    } else {
      return false;
    }
  }
  public getUserId() {
    let _uid = '';
    if (this.isAuthenticated) {
      try {
        _uid = this.authInfo.currentAccount.userInfo.id;
      } catch (error) {
        return false;
      }
      return _uid;
    } else {
      return false;
    }
  }
  public getUserInfo() {
    let userInfo = '';
    if (this.isAuthenticated) {
      try {
        userInfo = this.authInfo.currentAccount.userInfo;
      } catch (error) {
        return false;
      }
      return userInfo;
    } else {
      return false;
    }
  }
  public getOrgId() {
    let _uid = '';
    if (this.isAuthenticated) {
      try {
        // tslint:disable-next-line:max-line-length
        _uid =
          this.authInfo.currentAccount.userInfo.orgId ||
          this.authInfo.currentAccount.userInfo.orgID ||
          this.authInfo.currentAccount.orgId;
      } catch (error) {
        return false;
      }
      return _uid;
    } else {
      return false;
    }
  }
  // public getSelectedAccount() {
  //   let _uid = "";
  //   if (this.isAuthenticated) {
  //     try {
  //       let _selectedAccount = this.localstore.getSelectedAccount();
  //       if (_selectedAccount) {
  //         return _selectedAccount
  //       } else {
  //         return false;
  //       }
  //     } catch (error) {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }
  public getApplictionControls() {
    return this.appControlList;
  }
  public setSelectedAccount(account) {
    this.selectedAccount = account;
  }
  public getSelectedAccount() {
    if (this.authInfo && this.authInfo.currentAccount) {
      return this.authInfo.currentAccount;
    }
  }

  public getApplictionControlsFromServer(): ReplaySubject<any> {
    const appObserver = this.service.invoke('app.controls', {}, {});

    const subject = new ReplaySubject(1);
    // subscriber 1
    subject.subscribe(
      (res: any) => {
        this.appControlList = res;
        this.appControlListSource$.next(res);
        // this.mixpanel.reset();
        // const userInfo = {
        //   $email: res.domain,
        // };
        // if (res && res.domain) {
        //   this.mixpanel.setUserInfo(res.domain, userInfo);
        // }
        let infoObject;
        if (res && res.associatedAccounts.length) {
          const details = res.associatedAccounts[0];
          infoObject = {
            $email: details.emailId,
            $name: details.userFullName,
            email: details.emailId,
            Name: details.userFullName,
          };
        }
        if (!infoObject) {
          infoObject = {
            $email: res.domain,
            email: res.domain,
          };
        }
        this.mixpanel.reset();
        const userInfo = infoObject;
        if (infoObject.email) {
          this.mixpanel.setUserInfo(userInfo.email, userInfo);
        }
      },
      (errRes) => {
        this.appControlList = null;
      }
    );

    appObserver.subscribe(subject);
    return subject;
  }
}
