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
  searchSources : any = '';
  selectedApp : any;
  serachIndexId: any;
  topQuriesWithNoResults : any;
  getQueriesWithResults : any;
  getSearchQueriesResults : any;
  selectedQuery = '';
  dateType = "hour";
  @ViewChild('viewQueries') viewQueries: KRModalComponent;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getQueries("TopQuriesWithNoResults");
    this.getQueries("QueriesWithResults");
    //this.getQueries("GetSearchQueriesResults");
    
  }
  dateLimt(type){
    this.dateType = type;
    this.getQueries("TopQuriesWithNoResults");
    this.getQueries("QueriesWithResults");
  }
  getQueries(type){
    var today = new Date();
    var yesterday = new Date(Date.now() - 864e5);
    var week = new Date(Date.now() - (6 * 864e5));
    var custom = new Date(Date.now() - (29 * 864e5));
    let from = new Date();
    if(this.dateType == 'hour'){
      from = yesterday;
    }else if(this.dateType == 'week'){
      from = week;
    }else if(this.dateType == 'custom'){
      from = custom;
    }
    const header : any= {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId, //'sidx-e91a4194-df09-5e9c-be4e-56988e984343'
      offset: 0,
      limit:50
    };
    let payload : any = {
      type : type,
      filters: {
        from: from.toJSON(),//yesterday.toJSON(),
        to: today.toJSON()
      }
    }
    if(type == 'SearchQueryResults'){
      payload.query = this.selectedQuery;
    }
    this.service.invoke('get.queries', quaryparms,payload,header).subscribe(res => {
      if(type == 'TopQuriesWithNoResults'){
       this.topQuriesWithNoResults = res.response;
      }
      if(type == 'QueriesWithResults'){
        this.getQueriesWithResults = res.result;
       }
       if(type == 'SearchQueryResults'){
        this.getSearchQueriesResults = res.result;
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
    this.getQueries('SearchQueryResults')
    this.viewQueriesRef = this.viewQueries.open();
  }
  closeModalPopup(){
    this.viewQueriesRef.close();
  }
}
