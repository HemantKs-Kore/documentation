import { Injectable, Output, EventEmitter } from '@angular/core'
import { WorkflowService } from './workflow.service';
import { ServiceInvokerService } from './service-invoker.service';
@Injectable()
export class AppSelectionService {
  constructor(
    private workflowService : WorkflowService,
    private service : ServiceInvokerService
  ){}
  getQureryPipelineIds(){
    const payload = {
      searchIndexId:this.workflowService.selectedSearchIndex()
    };
    this.service.invoke('get.queryPipelines', payload).subscribe(
      res => {
       if(res && res.length){
        this.workflowService.selectedQueryPipelines(res);
       }
      },
      );
  };
    setAppWorkFlowData(app) {
      this.workflowService.selectedApp(app);
      const searchIndex  = app.searchIndexes[0]._id;
      this.workflowService.selectedSearchIndex(searchIndex);
      this.getQureryPipelineIds();
    }
}