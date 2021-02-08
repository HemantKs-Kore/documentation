import { Injectable } from '@angular/core';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AppUrlsService } from '@kore.services/app.urls.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Observer, from, Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
declare let window: any;


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private authInfo;
  private appControlList = null;
  private selectedAccount = null;
  public findlyApps = new Subject<any>();


  constructor(
    private localstore: LocalStoreService,
    private service: ServiceInvokerService,
    private appUrls: AppUrlsService,
    public workflowService: WorkflowService
  ) {
    this.authInfo = localstore.getAuthInfo();
  }
  public logout() {
    this.service.invoke('sales.signout', {}, {}).subscribe(
      res => {
        this.authInfo = false;
        this.localstore.removeAuthInfo();
        this.appUrls.redirectToLoginBotStore();
      },
      errRes => {
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
        _uid = this.authInfo.currentAccount.userInfo.orgId || this.authInfo.currentAccount.userInfo.orgID || this.authInfo.currentAccount.orgId;
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

    // _observer.subscribe(res => {
    //   this.appControlList = res;
    // }, errRes => {
    //   this.appControlList = null;
    // });

    const subject = new ReplaySubject(1);
    // subscriber 1
    subject.subscribe(res => {
      this.appControlList = res;
    }, errRes => {
      this.appControlList = null;
    });
    subject.subscribe(res => {
      this.appControlList = res;
    }, errRes => {
      this.appControlList = null;
    });
    appObserver.subscribe(subject);
    return subject;
  }

  public seedData() {
    this.service.invoke('findly.seed.data').subscribe(res => {
      this.workflowService.seedData(res);
    }, errRes => {
      this.findlyApps.next(errRes);
    });
  }

  public getfindlyApps() {
    this.service.invoke('get.apps').subscribe(res => {
      // res = [];\
      console.log("latest get apps", res)
      if (res && res.length) {
        this.workflowService.showAppCreationHeader(false);
      }
      this.findlyApps.next(res);
      this.workflowService.findlyApps(res);
    }, errRes => {
      this.findlyApps.next(errRes);
    });
  }
}
