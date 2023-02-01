import { Injectable } from '@angular/core';
import { WorkflowService } from './workflow.service';
import { ServiceInvokerService } from './service-invoker.service';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { SideBarService } from './header.service';
import { NotificationService } from './notification.service';
import { AppUrlsService } from './app.urls.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { LocalStoreService } from './localstore.service';
environment;
@Injectable({
  providedIn: 'root',
})
export class AppSelectionService {
  queryList: any = [];
  indexList: any = [];
  configSelected: any = {};
  public queryConfigs = new Subject<any>();
  public appSelectedConfigs = new Subject<any>();
  public queryConfigSelected = new Subject<any>();
  public appSelected = new Subject<any>();
  public getTourConfigData = new Subject<any>();
  public currentSubscription = new Subject<any>();
  // public refreshSummaryPage = new Subject<any>();
  public updateUsageData = new Subject<any>();
  public routeChanged = new BehaviorSubject<any>({
    name: undefined,
    path: '',
    isDemo: false,
  });
  public tourConfigCancel = new BehaviorSubject<any>({
    name: undefined,
    status: 'pending',
  });
  public openSDKApp = new Subject<any>();
  public topicGuideShow = new Subject<any>();
  public resumingApp = false;
  public currentsubscriptionPlanDetails: any;
  public currentUsageData: any;
  public inlineManualInfo: any = [];
  public env_dep_type = '';
  res_length = 0;
  getTourArray: any = {};
  private storageType = 'localStorage';
  constructor(
    private workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private router: Router,
    private headerService: SideBarService,
    private authService: AuthService,
    private appUrls: AppUrlsService,
    public localstore: LocalStoreService,
    private notificationService: NotificationService
  ) {
    if (environment && environment.USE_SESSION_STORE) {
      this.storageType = 'sessionStorage';
    }
    this.env_dep_type = environment?.deployment_type;
  }
  public getIndexPipelineIds(setindex?): ReplaySubject<any> {
    const payload = {
      searchIndexId: this.workflowService.selectedSearchIndex(),
    };
    const appObserver = this.service.invoke('get.indexPipeline', payload);
    const subject = new ReplaySubject(1);
    subject.subscribe(
      (res) => {
        this.indexList = res || [];
        if (this.indexList) {
          //this.workflowService.getSettings(this.indexList[0].settings);
          let indexPipeline: any = [];
          if (setindex && setindex._id) {
            indexPipeline = _.filter(res, (pipeLine) => {
              return pipeLine._id === setindex._id;
            });
          }
          if (indexPipeline && indexPipeline.length) {
            this.selectIndexConfig(setindex);
          } else if (this.indexList.length) {
            const data = this.indexList.filter((ele) => ele.default === true);
            this.selectIndexConfig(data[0]);
          } else {
            this.selectIndexConfig({});
          }
          this.appSelectedConfigs.next(res);
          this.getQureryPipelineIds();
        }
      },
      (errRes) => {
        this.indexList = null;
      }
    );
    appObserver.subscribe(subject);
    return subject;
  }
  public getQureryPipelineIds(setPipline?): ReplaySubject<any> {
    const payload = {
      searchIndexId: this.workflowService.selectedSearchIndex(),
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    const appObserver = this.service.invoke('get.queryPipelines', payload);
    const subject = new ReplaySubject(1);
    subject.subscribe(
      (res: any) => {
        this.queryList = res || [];
        const length = this.queryList.length;
        if (this.queryList) {
          this.workflowService.appQueryPipelines(res);
          let queryPipeline: any = [];
          if (setPipline && setPipline._id) {
            queryPipeline = _.filter(res, (pipeLine) => {
              return pipeLine._id === setPipline._id;
            });
          }
          if (queryPipeline && queryPipeline.length) {
            this.selectQueryConfig(setPipline);
          } else if (this.queryList.length) {
            if (this.res_length == 0) {
              const data = this.queryList.filter((ele) => ele.default === true);
              this.selectQueryConfig(data[0]);
            } else {
              if (this.configSelected && this.configSelected['_id']) {
                const data = res.filter(
                  (element) => element._id == this.configSelected['_id']
                );
                if (data.length) {
                  this.selectQueryConfig(data[0]);
                } else {
                  this.selectQueryConfig(res[length - 1]);
                }
              } else {
                this.selectQueryConfig(res[length - 1]);
              }
            }
          } else {
            this.selectQueryConfig({});
          }
          this.queryConfigs.next(res);
        }
      },
      (errRes) => {
        this.queryList = null;
      }
    );
    appObserver.subscribe(subject);
    return subject;
  }
  getPreviousState() {
    let previOusState: any = null;
    try {
      previOusState = JSON.parse(
        window.localStorage.getItem('krPreviousState')
      );
      if (window[this.storageType].jStorage) {
        this.getCurrentSubscriptionData();
      } else {
        this.redirectToLogin();
      }
    } catch (e) {}
    return previOusState;
  }
  private redirectToLogin() {
    this.appUrls.redirectToLogin();
  }
  setPreviousState(route?) {
    const path: any = {
      selectedApp: '',
      route: '',
    };
    if (route) {
      const selectedAccount =
        this.localstore.getSelectedAccount() ||
        this.authService.getSelectedAccount();
      if (
        this.workflowService.selectedApp &&
        this.workflowService.selectedApp() &&
        this.workflowService.selectedApp()._id
      ) {
        path.selectedApp = this.workflowService.selectedApp()._id;
        if (
          this.workflowService.selectedQueryPipeline() &&
          this.workflowService.selectedQueryPipeline()._id
        ) {
          path.selectedQueryPipeline =
            this.workflowService.selectedQueryPipeline();
        }
        path.selectedAccountId = selectedAccount.accountId || null;
        path.route = route;
        window.localStorage.setItem('krPreviousState', JSON.stringify(path));
        // REVISIT
        // const appInfo = this.workflowService.selectedApp();
        // this.routeChanged.next({
        //   name: 'pathchanged',
        //   path:
        //     appInfo?.disabled && route === '/generalSettings'
        //       ? '/sources'
        //       : route,
        //   disable: appInfo?.disabled ? true : false,
        // });
      }
    } else {
      window.localStorage.removeItem('krPreviousState');
    }
  }
  selectIndexConfig(config) {
    this.workflowService.selectedIndexPipeline(config._id);
    this.workflowService.getSettings(config.settings); // check For All Cases.
  }
  selectQueryConfig(config) {
    this.res_length = this.queryList.length;
    this.configSelected = config;
    this.workflowService.selectedQueryPipeline(config);
    const previousState = this.getPreviousState();
    this.setPreviousState(previousState?.route);
    this.queryConfigSelected.next(config);
  }
  getAppData(app) {
    const payload = {
      streamId: app._id,
    };
    const appObserver = this.service.invoke('get.appData', payload);
    appObserver.subscribe(
      (res) => {
        this.workflowService.selectedApp(res);
      },
      (errRes) => {
        this.queryList = null;
      }
    );
  }
  openApp(app, isDemo?, isUpgrade?) {
    this.workflowService.selectedQueryPipeline([]);
    this.workflowService.appQueryPipelines({});
    this.setAppWorkFlowData(app);
    this.appSelected.next(app);
    const toogleObj = {
      title: '',
    };
    this.headerService.toggle(toogleObj);
    this.routeChanged.next({
      name: 'pathchanged',
      path: app?.disabled ? (isUpgrade ? '/pricing' : '/sources') : '/summary',
      disable: app?.disabled ? true : false,
    });
    this.getInlineManualcall();
    if (isDemo) {
      this.openSDKApp.next(undefined);
      this.routeChanged.next({
        name: 'pathchanged',
        path: '/summary',
        isDemo: true,
      });
    }
  }
  //get current subscription data
  getCurrentSubscriptionData() {
    const data = this.workflowService.selectedApp();
    if (data != undefined) {
      const payload = {
        streamId: data._id,
      };
      const appObserver = this.service.invoke('get.currentPlans', payload);
      appObserver.subscribe(
        (res) => {
          this.currentsubscriptionPlanDetails = res;
          this.getCurrentUsage();
          this.currentSubscription.next(res);
        },
        (errRes) => {
          if (
            errRes &&
            errRes.error &&
            errRes.error.errors[0].code == 'NoActiveSubscription'
          ) {
            this.getLastActiveSubscriptionData();
            this.currentsubscriptionPlanDetails = undefined;
            //this.errorToaster(errRes, 'failed to get current subscription data');
          }
        }
      );
    }
  }
  //get current usage data of search and queries
  getCurrentUsage() {
    const selectedApp = this.workflowService.selectedApp();
    const queryParms = {
      streamId: selectedApp?._id,
    };
    const payload = { features: ['ingestDocs', 'searchQueries'] };
    this.service.invoke('post.usageData', queryParms, payload).subscribe(
      (res) => {
        const docs = Number.isInteger(res.ingestDocs.percentageUsed)
          ? res.ingestDocs.percentageUsed
          : parseFloat(res.ingestDocs.percentageUsed).toFixed(2);
        const queries = Number.isInteger(res.searchQueries.percentageUsed)
          ? res.searchQueries.percentageUsed
          : parseFloat(res.searchQueries.percentageUsed).toFixed(2);
        this.currentUsageData = {
          ingestCount: res.ingestDocs.used,
          ingestLimit: res.ingestDocs.limit,
          ingestDocs: docs,
          searchQueries: queries,
          searchCount: res.searchQueries.used,
          searchLimit: res.searchQueries.limit,
        };
        this.updateUsageData.next('updatedUsage');
      },
      (errRes) => {
        // this.errorToaster(errRes, 'Failed to get current data.');
      }
    );
  }
  getInlineManualcall() {
    const selectedApp = this.workflowService?.selectedApp();
    const searchIndexId = selectedApp ? selectedApp.searchIndexes[0]?._id : '';
    const quaryparms: any = {
      searchIndexId: searchIndexId,
    };
    if (searchIndexId) {
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
  //get last active subscription data
  getLastActiveSubscriptionData() {
    const data = this.workflowService.selectedApp();
    if (data != undefined) {
      const payload = {
        streamId: data._id,
      };
      const appObserver = this.service.invoke(
        'get.lastActiveSubscription',
        payload
      );
      appObserver.subscribe(
        (res) => {
          this.currentsubscriptionPlanDetails = res;
          this.currentSubscription.next(res);
        },
        (errRes) => {
          this.errorToaster(
            errRes,
            'failed to get last active subscription data'
          );
        }
      );
    }
  }
  errorToaster(errRes, message) {
    if (
      errRes &&
      errRes.error &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  async setAppWorkFlowData(app, queryPipeline?) {
    // this.getStreamData(app);
    this.workflowService?.selectedApp(app);
    const searchIndex = app.searchIndexes[0]?._id;
    this.workflowService?.selectedSearchIndex(searchIndex);
    //this.getQureryPipelineIds(queryPipeline);
    await this.getIndexPipelineIds();
    this.headerService.updateSearchConfiguration();
  }
  getStreamData(app) {
    const queryParams = {
      streamId: app._id,
    };
    const appObserver = this.service.invoke('get.streamData', queryParams);
    appObserver.subscribe(
      (res) => {
        this.workflowService.selectedApp(res);
      },
      (errRes) => {
        this.queryList = null;
      }
    );
  }
  //get tour congfig data
  getTourConfig() {
    this.getTourArray = {};
    const appInfo: any = this.workflowService.selectedApp();
    // console.log("appInfo", appInfo)
    const quaryparms: any = {
      streamId: appInfo?._id,
    };
    const appObserver = this.service.invoke('get.tourConfig', quaryparms);
    appObserver.subscribe(
      (res) => {
        this.getTourArray = res.tourConfigurations;
        this.getTourConfigData.next(res.tourConfigurations);
      },
      (errRes) => {
        // console.log(errRes)
      }
    );
  }
  //put tour config
  public updateTourConfig(component) {
    let callApi: boolean;
    const appInfo: any = this.workflowService.selectedApp();
    if (this.getTourArray && this.getTourArray?.onBoardingChecklist?.length) {
      if (
        component == 'addData' &&
        !this.getTourArray.onBoardingChecklist[0].addData
      ) {
        this.getTourArray.onBoardingChecklist[0].addData = true;
        callApi = true;
      } else if (
        component == 'indexing' &&
        !this.getTourArray.onBoardingChecklist[1].indexData
      ) {
        this.getTourArray.onBoardingChecklist[1].indexData = true;
        callApi = true;
      } else if (
        component == 'configure' &&
        !this.getTourArray.onBoardingChecklist[2].optimiseSearchResults
      ) {
        this.getTourArray.onBoardingChecklist[2].optimiseSearchResults = true;
        callApi = true;
      } else if (
        component == 'designing' &&
        !this.getTourArray.onBoardingChecklist[3].designSearchExperience
      ) {
        this.getTourArray.onBoardingChecklist[3].designSearchExperience = true;
        callApi = true;
      } else if (
        component == 'test' &&
        !this.getTourArray.onBoardingChecklist[4].testApp
      ) {
        this.getTourArray.onBoardingChecklist[4].testApp = true;
        callApi = true;
      } else if (
        component == 'optimize' &&
        !this.getTourArray.onBoardingChecklist[5].fineTuneRelevance
      ) {
        this.getTourArray.onBoardingChecklist[5].fineTuneRelevance = true;
        callApi = true;
      }
    }

    if (callApi) {
      const quaryparms: any = {
        streamId: appInfo._id,
      };
      const payload = { tourConfigurations: this.getTourArray };

      this.service.invoke('put.tourConfig', quaryparms, payload).subscribe(
        (res) => {
          this.getTourConfigData.next(this.getTourArray);
          let count = 0;
          const stepsData = this.getTourArray.onBoardingChecklist;
          for (const key in stepsData) {
            for (const key1 in stepsData[key]) {
              if (stepsData[key][key1]) {
                count = count + 1;
              }
            }
          }
          if (count == 6) {
            this.tourConfigCancel.next({
              name: undefined,
              status: 'completed',
            });
          }
        },
        (errRes) => {
          // console.log(errRes);
        }
      );
    }
  }

  //call jobs api for connectors sync progress status
  connectorSyncJobStatus(sid, fid) {
    const queryParams = {
      limit: 5,
      sidx: sid,
      fcon: fid,
    };
    const appObserver = this.service.invoke('get.connectorJob', queryParams);
    return new Promise((resolve, reject) => {
      appObserver.subscribe(
        (res) => {
          if (res) {
            resolve(res);
          }
        },
        (errRes) => {
          reject(errRes);
          this.queryList = null;
        }
      );
    });
  }
}
