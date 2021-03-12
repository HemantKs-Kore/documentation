import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';


@Component({
  selector: 'app-search-insights',
  templateUrl: './search-insights.component.html',
  styleUrls: ['./search-insights.component.scss']
})
export class SearchInsightsComponent implements OnInit {
  searchImgSrc:any='assets/icons/search_gray.svg';
  searchFocusIn=false;
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
  QWR_limitPage : number = 4;
  QWR_skipPage:number = 0;

  QWNR_totalRecord : number;
  QWNR_limitPage : number = 4;
  QWNR_skipPage:number = 0;

  SQR_totalRecord : number;
  SQR_limitPage : number = 10;
  SQR_skipPage:number = 0;

  startDate:any = moment().subtract({ days: 7 });
  endDate: any = moment();
  defaultSelectedDay = 7;
  showDateRange: boolean = false;
  querieswithresults : boolean = true;
  selected: { startDate: Moment, endDate: Moment } = { startDate: this.startDate, endDate: this.endDate }
  @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;
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

    if(localStorage.getItem('search_Insight_Result')){
      localStorage.getItem('search_Insight_Result') == 'Top_Search_Queries' ? this.querieswithresults = true: this.querieswithresults = false;
      localStorage.removeItem('search_Insight_Result');
    }
    
  }
  openDateTimePicker(e) {
    setTimeout(() => {
      this.pickerDirective.open(e);
    })
  }
  onDatesUpdated($event){
    this.startDate = this.selected.startDate;
    this.endDate = this.selected.endDate;
    this.dateLimt('custom');
    // this.callFlowJourneyData();
  }
  getDateRange(range, e?) {
    this.defaultSelectedDay = range;
    if (range === -1) {
      this.showDateRange = true;
      this.datetimeTrigger.nativeElement.click();
    }
    else if (range === 7) {
      this.startDate = moment().subtract({ days: 6 });
      this.endDate = moment();
      this.dateLimt('week')
      // this.callFlowJourneyData();
      this.showDateRange = false;
    } else if (range === 1) {
      this.startDate = moment().subtract({ hours: 23 });
      this.endDate = moment();
      this.dateLimt('hour')
      // this.callFlowJourneyData();
      this.showDateRange = false;
    }
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
    if(type == 'QueriesWithNoResults'){
      queryparams = {
        ...queryparams,
        offset: this.QWNR_skipPage || 0,
        limit:this.QWNR_limitPage || 4
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
        from:  this.startDate.toJSON(),//from.toJSON(),
        to: this.endDate.toJSON()
      },
    }
    if(type == 'SearchQueryResults'){
      payload.query = this.selectedQuery;
    }
    this.service.invoke('get.queries', queryparams,payload,header).subscribe(res => {
      if(type == 'QueriesWithNoResults'){
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
      this.getQueries('QueriesWithNoResults');
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
