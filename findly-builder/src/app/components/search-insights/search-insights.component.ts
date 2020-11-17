import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';

@Component({
  selector: 'app-search-insights',
  templateUrl: './search-insights.component.html',
  styleUrls: ['./search-insights.component.scss']
})
export class SearchInsightsComponent implements OnInit {
  viewQueriesRef:any;
  selectedApp : any;
  serachIndexId: any;
  topQuriesWithNoResults : any;
  getQueriesWithResults : any;
  getSearchQueriesResults : any;
  selectedQuery = '';
  @ViewChild('viewQueries') viewQueries: KRModalComponent;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getQueries("TopQuriesWithNoResults");
    this.getQueries("GetQueriesWithResults");
    //this.getQueries("GetSearchQueriesResults");
    
  }
 
  getQueries(type){
    var today = new Date();
    var yesterday = new Date(Date.now() - 864e5);
    const header : any= {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: 'sidx-e91a4194-df09-5e9c-be4e-56988e984343',//this.serachIndexId,
      offset: 0,
      limit:50
    };
    let payload : any = {
      type : type,
      filters: {
        from: new Date(Date.now() - (24 * 864e5)),//yesterday.toJSON(),
        to: today.toJSON()
      }
    }
    if(type == 'GetSearchQueriesResults'){
      payload.query = this.selectedQuery;
    }
    this.service.invoke('get.queries', quaryparms,payload,header).subscribe(res => {
      if(type == 'TopQuriesWithNoResults'){
       this.topQuriesWithNoResults = res.response;
      }
      if(type == 'GetQueriesWithResults'){
        this.getQueriesWithResults = res;
       }
       if(type == 'GetSearchQueriesResults'){
        this.getSearchQueriesResults = res;
       }
       
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
  }
  openModalPopup(result){
    this.selectedQuery = result.query;
    this.getQueries('GetSearchQueriesResults')
    this.viewQueriesRef = this.viewQueries.open();
  }
  closeModalPopup(){
    this.viewQueriesRef.close();
  }
}
