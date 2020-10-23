import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  selectedApp;
  serachIndexId;
  topQuriesWithNoResults : any;
  mostSearchedQuries : any;
  queriesWithNoClicks : any;
  searchHistogram : any;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getQueries("TopQuriesWithNoResults");
    this.getQueries("MostSearchedQuries");
    this.getQueries("QueriesWithNoClicks");
    this.getQueries("SearchHistogram");
    
  }
  getQueries(type){
   
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit:20
    };
    let payload = {
      type : type,
      filters: {
        from: "2020-10-14T00:29:38.552Z",
        to: "2020-10-21T00:29:38.552Z"
      }
    }
    if(type == "QueriesWithNoClicks"){
      payload['sort'] = {
        order: "desc", 
        by: "timestamp"
      }
    }
    this.service.invoke('get.queries', quaryparms,payload).subscribe(res => {
      if(type == 'TopQuriesWithNoResults'){
        this.topQuriesWithNoResults = res;
      }else if(type == 'MostSearchedQuries'){
        this.mostSearchedQuries = res;
      }else if(type == 'QueriesWithNoClicks'){
        this.queriesWithNoClicks = res;
      }else if(type == 'SearchHistogram'){
        this.searchHistogram = res;
      }
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
  }
}
