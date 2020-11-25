import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { EChartOption } from 'echarts';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-result-insights',
  templateUrl: './result-insights.component.html',
  styleUrls: ['./result-insights.component.scss']
})
export class ResultInsightsComponent implements OnInit {
  viewQueriesRef:any;
  selectedApp;
  serachIndexId;
  // pageLimit = 5;
  // totalSearchSum =0;
  // searchesWithClicksSum = 0;
  // searchesWithResultsSum = 0;
  // tsqtotalRecord = 100;
  // tsqlimitpage = 5;
  // tsqrecordEnd = 5;

  // tsqNoRtotalRecord = 100;
  // tsqNoRlimitpage = 5;
  // tsqNoRrecordEnd = 5;

  // tsqNoCtotalRecord = 100;
  // tsqNoClimitpage = 5;
  // tsqNoCrecordEnd = 5;

  // tsqPtotalRecord = 100;
  // tsqPlimitpage = 10;
  // tsqPrecordEnd = 10;

  // tsqNoRPtotalRecord = 100;
  // tsqNoRPlimitpage = 10;
  // tsqNoRPrecordEnd = 10;
  
  // tsqNoCPtotalRecord = 100;
  // tsqNoCPlimitpage = 10;
  // tsqNoCPrecordEnd = 10;

  // totalRecord = 100;
  // limitpage = 5;
  // recordEnd = 5;

  // topQuriesWithNoResults : any;
  // mostSearchedQuries : any = {};
  // queriesWithNoClicks : any;
  // searchHistogram : any;
  // heatMapChartOption : EChartOption;
  // feedbackPieSearches : EChartOption;
  // feedbackPieResult : EChartOption;
  // mostClickBar : EChartOption;
  // chartOption : EChartOption;
  // chartOption1 : EChartOption;
  // userEngagementChartData : EChartOption;
  isAsc = true;
  slider = 2;
  resultsData : any;
  resultsSearchData : any;
  searchQueryanswerType = '';
  resultQueryAnswer = '';
  searchSources : any = '';
  dateType = "hour"
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }
    @ViewChild('viewQueries') viewQueries: KRModalComponent;

    openModalPopup(result){
      this.searchQueryanswerType = result.answerType;
      this.resultQueryAnswer = result.answer;
      this.getQueries('SearchQueriesForResult')
      this.viewQueriesRef = this.viewQueries.open();
    }
    closeModalPopup(){
      this.viewQueriesRef.close();
    }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    
    this.getQueries("Results");
  }
  dateLimt(type){
    this.dateType = type;
    this.getQueries('Results');
  }
  paginate(event){
    console.log(event)
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
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit:100
    };
    let payload : any = {
      type : type,
      filters: {
        from: from.toJSON(),
        to: today.toJSON()
      }
    }
    if(type == 'SearchQueriesForResult'){
      payload.result = this.resultQueryAnswer;
    }
    this.service.invoke('get.queries', quaryparms,payload,header).subscribe(res => {
      if(type == 'Results'){
        this.resultsData = res.results;
      }
      else if(type == 'SearchQueriesForResult'){
        this.resultsSearchData = res.results;
      }
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
  }
  
  
  // pagination(data,type){
  //   if(type == 'MostSearchedQuries'){
  //     if(data.length <= this.tsqlimitpage){ this.tsqlimitpage = data.length }
  //     if(data.length <= this.tsqrecordEnd){ this.tsqrecordEnd = data.length }

  //     if(data.length <= this.tsqPlimitpage){ this.tsqPlimitpage = data.length }
  //     if(data.length <= this.tsqPrecordEnd){ this.tsqPrecordEnd = data.length }

  //   }
  //   if(type == 'TopQuriesWithNoResults'){
  //     if(data.length <= this.tsqNoRlimitpage){ this.tsqNoRlimitpage = data.length }
  //     if(data.length <= this.tsqNoRrecordEnd){ this.tsqNoRrecordEnd = data.length }

  //     if(data.length <= this.tsqNoRPlimitpage){ this.tsqNoRPlimitpage = data.length }
  //     if(data.length <= this.tsqNoRPrecordEnd){ this.tsqNoRPrecordEnd = data.length }

  //   }
  //   if(type == 'QueriesWithNoClicks'){
  //     if(data.length <= this.tsqNoClimitpage){ this.tsqNoClimitpage = data.length }
  //     if(data.length <= this.tsqNoCrecordEnd){ this.tsqNoCrecordEnd = data.length }

  //     if(data.length <= this.tsqNoCPlimitpage){ this.tsqNoCPlimitpage = data.length }
  //     if(data.length <= this.tsqNoCPrecordEnd){ this.tsqNoCPrecordEnd = data.length }

  //   }
  // }
  
}
