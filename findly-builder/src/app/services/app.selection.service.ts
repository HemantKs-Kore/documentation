import { Injectable, Output, EventEmitter } from '@angular/core'
import { WorkflowService } from './workflow.service';
import { ServiceInvokerService } from './service-invoker.service';
import { pipe, ReplaySubject, Subject } from 'rxjs';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { SideBarService } from './header.service';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
@Injectable()
export class AppSelectionService {
  queryList: any = [];
  indexList: any = []
  public queryConfigs = new Subject<any>();
  public appSelectedConfigs = new Subject<any>();
  public queryConfigSelected = new Subject<any>();
  public appSelected = new Subject<any>();
  public resumingApp = false;
  constructor(
    private workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private router: Router,
    private headerService: SideBarService,
    private authService: AuthService,
    public localstore: LocalStoreService,
  ) { }
  public getIndexPipelineIds(setindex?): ReplaySubject<any> {
    const payload = {
      searchIndexId: this.workflowService.selectedSearchIndex()
    };
    const appObserver = this.service.invoke('get.indexPipeline', payload);
    const subject = new ReplaySubject(1);
    subject.subscribe(res => {
      this.indexList = res || [];
      if (this.indexList) {
        //this.workflowService.appQueryPipelines(res);
        let indexPipeline: any = [];
        if (setindex && setindex._id) {
          indexPipeline = _.filter(res, (pipeLine) => {
            return (pipeLine._id === setindex._id);
          })
        }
        if (indexPipeline && indexPipeline.length) {
          this.selectIndexConfig(setindex);
        } else if (this.indexList.length) {
          const data = this.indexList.filter(ele => ele.default === true);
          this.selectIndexConfig(data[0]);
        } else {
          this.selectIndexConfig({});
        }
        this.appSelectedConfigs.next(res);
        this.getQureryPipelineIds()
      }
    }, errRes => {
      this.indexList = null;
    });
    appObserver.subscribe(subject);
    return subject;
  }
  public getQureryPipelineIds(setPipline?): ReplaySubject<any> {
    const payload = {
      searchIndexId: this.workflowService.selectedSearchIndex(),
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    const appObserver = this.service.invoke('get.queryPipelines', payload);
    const subject = new ReplaySubject(1);
    subject.subscribe(res => {
      this.queryList = res || [];
      if (this.queryList) {
        this.workflowService.appQueryPipelines(res);
        let queryPipeline: any = [];
        if (setPipline && setPipline._id) {
          queryPipeline = _.filter(res, (pipeLine) => {
            return (pipeLine._id === setPipline._id);
          })
        }
        if (queryPipeline && queryPipeline.length) {
          this.selectQueryConfig(setPipline);
        } else if (this.queryList.length) {
          const data = this.queryList.filter(ele => ele.default === true);
          this.selectQueryConfig(data[0]);
        } else {
          this.selectQueryConfig({});
        }
        this.queryConfigs.next(res);
      }
    }, errRes => {
      this.queryList = null;
    });
    appObserver.subscribe(subject);
    return subject;
  }
  getPreviousState() {
    let previOusState: any = null;
    try {
      previOusState = JSON.parse(window.localStorage.getItem('krPreviousState'));
    } catch (e) {
    }
    return previOusState;
  }
  setPreviousState(route?) {
    const path: any = {
      selectedApp: '',
      route: ''
    };
    if (route) {
      const selectedAccount = this.localstore.getSelectedAccount() || this.authService.getSelectedAccount();
      if (this.workflowService.selectedApp && this.workflowService.selectedApp() && this.workflowService.selectedApp()._id) {
        path.selectedApp = this.workflowService.selectedApp()._id;
        if (this.workflowService.selectedQueryPipeline() && this.workflowService.selectedQueryPipeline()._id) {
          path.selectedQueryPipeline = this.workflowService.selectedQueryPipeline();
        }
        path.selectedAccountId = selectedAccount.accountId || null;
        path.route = route
        window.localStorage.setItem('krPreviousState', JSON.stringify(path));
      }
    } else {
      window.localStorage.removeItem('krPreviousState');
    }
  }
  selectIndexConfig(config) {
    this.workflowService.selectedIndexPipeline(config._id)
    console.log(config._id)
  }
  selectQueryConfig(config) {
    this.workflowService.selectedQueryPipeline(config);
    const previousState = this.getPreviousState();
    this.setPreviousState(previousState.route);
    this.queryConfigSelected.next(config);
  }
  getAppData(app) {
    const payload = {
      streamId: app._id
    };
    const appObserver = this.service.invoke('get.appData', payload);
    appObserver.subscribe(res => {
      this.workflowService.selectedApp(res);
    }, errRes => {
      this.queryList = null;
    });
  }
  openApp(app) {
    this.workflowService.selectedQueryPipeline([]);
    this.workflowService.appQueryPipelines({});
    this.setAppWorkFlowData(app);
    this.appSelected.next(app);
    this.router.navigate(['/source'], { skipLocationChange: true });
    const toogleObj = {
      title: '',
    };
    this.headerService.toggle(toogleObj);
  }
  setAppWorkFlowData(app, queryPipeline?) {
    // this.getStreamData(app);
    this.workflowService.selectedApp(app);
    const searchIndex = app.searchIndexes[0]._id;
    this.workflowService.selectedSearchIndex(searchIndex);
    //this.getQureryPipelineIds(queryPipeline);
    this.getIndexPipelineIds();
  }
  getStreamData(app) {
    const queryParams = {
      streamId: app._id
    };
    const appObserver = this.service.invoke('get.streamData', queryParams);
    appObserver.subscribe(res => {
      console.log("api called", res)
      this.workflowService.selectedApp(res);
    }, errRes => {
      this.queryList = null;
    });
  }
}