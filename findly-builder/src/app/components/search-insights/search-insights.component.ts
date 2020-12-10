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

  QWR_totalRecord:number;
  QWR_limitPage : number = 10;
  QWR_skipPage:number = 0;

  QWNR_totalRecord : number;
  QWNR_limitPage : number = 10;
  QWNR_skipPage:number = 0;

  SQR_totalRecord : number;
  SQR_limitPage : number = 10;
  SQR_skipPage:number = 0;

  @ViewChild('viewQueries') viewQueries: KRModalComponent;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getQueries("QueriesWithNoResults");
    this.getQueries("QueriesWithResults");
    //this.getQueries("GetSearchQueriesResults");
    
  }
  dateLimt(type){
    this.dateType = type;
    this.getQueries("QueriesWithNoResults");
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
    let queryparams:any={searchIndexId: this.serachIndexId};
    if(type == 'TopQuriesWithNoResults'){
      queryparams = {
        ...queryparams,
        offset: this.QWNR_skipPage,
        limit:this.QWNR_limitPage
      };
    }
    else if(type == 'QueriesWithResults'){
      queryparams = {
        ...queryparams,
        offset: this.QWR_skipPage,
        limit:this.QWR_limitPage
      };
    }
    else if(type == 'SearchQueryResults'){
      queryparams = {
        ...queryparams,
        offset: this.SQR_skipPage,
        limit:this.SQR_limitPage
      };
    }

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
    this.service.invoke('get.queries', queryparams,payload,header).subscribe(res => {
      if(type == 'TopQuriesWithNoResults'){
       this.topQuriesWithNoResults = res.result;
       this.QWNR_totalRecord = res.totalCount;
      }
      else if(type == 'QueriesWithResults'){
        this.getQueriesWithResults = res.result;
        this.QWR_totalRecord = res.totalCount;
       }
       else if(type == 'SearchQueryResults'){
        this.getSearchQueriesResults = res.result;
        this.SQR_totalRecord = res.totalCount;
       }
       
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
  }

  paginate(event,type){
    if(type==='QWR'){
      this.QWR_limitPage = event.limit;
      this.QWR_skipPage = event.skip;
      this.getQueries('QueriesWithResults');
    }
    else if(type === 'QWNR'){
      this.QWNR_limitPage = event.limit;
      this.QWNR_skipPage = event.skip;
      this.getQueries('TopQuriesWithNoResults');
    }
    else if(type === 'SQR'){
      this.SQR_limitPage = event.limit;
      this.SQR_skipPage = event.skip;
      this.getQueries('SearchQueryResults');
    }
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
