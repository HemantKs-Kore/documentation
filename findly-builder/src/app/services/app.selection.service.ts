import { Injectable, Output, EventEmitter } from '@angular/core'
import { WorkflowService } from './workflow.service';
import { ServiceInvokerService } from './service-invoker.service';
import { ReplaySubject, Subject } from 'rxjs';
import * as _ from 'underscore';
import { Router} from '@angular/router';
import { SideBarService } from './header.service';
@Injectable()
export class AppSelectionService {
  queryList :any= []
  public queryConfigs = new Subject<any>();
  public queryConfigSelected = new Subject<any>();
  constructor(
    private workflowService : WorkflowService,
    private service : ServiceInvokerService,
    private router: Router,
    private headerService: SideBarService,
  ){}
    public getQureryPipelineIds(): ReplaySubject<any> {
      const payload = {
        searchIndexId:this.workflowService.selectedSearchIndex()
      };
      const appObserver = this.service.invoke('get.queryPipelines', payload);
      const subject = new ReplaySubject(1);
      subject.subscribe(res => {
        this.queryList = res || [];
        if(this.queryList){
          this.workflowService.appQueryPipelines(res);
          if(this.queryList.length){
            this.selectQueryConfig(res[0]);
          }else{
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
    selectQueryConfig(config){
      this.workflowService.selectedQueryPipeline(config);
      this.queryConfigSelected.next(config);
    }
    getAppData(app){
      const payload = {
        streamId:app._id
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
       this.router.navigate(['/source'], { skipLocationChange: true });
       const toogleObj = {
        title: '',
      };
       this.headerService.toggle(toogleObj);
    }
    setAppWorkFlowData(app) {
      this.workflowService.selectedApp(app);
      const searchIndex  = app.searchIndexes[0]._id;
      this.workflowService.selectedSearchIndex(searchIndex);
      this.getQureryPipelineIds();
    }
}