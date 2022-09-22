import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { EChartOption } from 'echarts';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { AppSelectionService } from '@kore.services/app.selection.service'
declare const $: any;
@Component({
  selector: 'app-result-insights',
  templateUrl: './result-insights.component.html',
  styleUrls: ['./result-insights.component.scss']
})
export class ResultInsightsComponent implements OnInit {
  viewQueriesRef: any;
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
  selectedSort = '';
  sortedObject = {
    'type': 'fieldName',
    'position':'up',
    "value": 1,
  }
  loadingQueries =true;
  isAsc = true;
  slider = 2;
  resultsData: any;
  resultsSearchData: any;
  searchQueryanswerType = '';
  resultQueryAnswer = '';
  searchSources: any = '';
  indexConfigs:any =[];
  selecteddropId: any;
  indexConfigObj: any = {};
  selectedIndexConfig: any;
  dateType = "hour"
  group = "week";
  totalRecord: number = 0;
  limitPage: number = 10;
  skipPage: number = 0;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  Q_totalRecord: number = 0;
  Q_limitPage: number = 10;
  Q_skipPage: number = 0;
  startDate: any = moment().subtract({ days: 7 });
  endDate: any = moment();
  defaultSelectedDay = 7;
  showDateRange: boolean = false;
  componentType: string = 'addData';
  selected: { startDate: Moment, endDate: Moment } = { startDate: this.startDate, endDate: this.endDate }
  @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,private appSelectionService: AppSelectionService) { }
  @ViewChild('viewQueries') viewQueries: KRModalComponent;

  openModalPopup(result) {
    this.searchQueryanswerType = result.answerType;
    this.resultQueryAnswer = result.answer;
    this.loadingQueries=true;
    this.getQueries('SearchQueriesForResult',this.selectedIndexConfig)
    this.viewQueriesRef = this.viewQueries.open();
  }
  closeModalPopup() {
    this.viewQueriesRef.close();
    this.resultsSearchData =[];
  }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getIndexPipeline();

    
  }

  getIndexPipeline() {
    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit: 100
    };
    this.service.invoke('get.indexPipeline', quaryparms, header).subscribe(res => {
      this.indexConfigs = res;
      this.indexConfigs.forEach(element => {
          this.indexConfigObj[element._id] = element;
         });
      if (res.length >= 0){
            //this.selectedIndexConfig = this.workflowService.selectedIndexPipeline();
            for(let i=0;i<res.length;i++){
              if(res[i].default=== true){
                this.selectedIndexConfig=res[i]._id;           
              }
            }
            this.getAllgraphdetails(this.selectedIndexConfig);
            // for(let i=0;i<res.length;i++){
            //   if(res[i].default=== true){
            //     this.selecteddropname=res[i].name;           
            //   }
            // }
          } 
         
      //this.getQueryPipeline(res[0]._id);
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
    
  }

  getAllgraphdetails(selectedindexpipeline){
    this.selecteddropId=selectedindexpipeline;
    this.getQueries("Results",selectedindexpipeline);       
  }
  openDateTimePicker(e) {
    setTimeout(() => {
      this.pickerDirective.open(e);
    })
  }
  onDatesUpdated($event) {
    this.startDate = this.selected.startDate;
    this.endDate = this.selected.endDate;
    this.dateLimt('custom');
    // this.callFlowJourneyData();
  }
  getDateRange(range, e?) {
    this.defaultSelectedDay = range;
    if (range === -1) {
      if (!this.showDateRange || $('.md-drppicker').hasClass('hidden')) {
        this.showDateRange = true;
        this.datetimeTrigger.nativeElement.click();
      } else {
        this.showDateRange = false;
      }
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
  dateLimt(type) {
    this.dateType = type;
    let selectedindexpipeline=this.selecteddropId;
    if(selectedindexpipeline){
    this.getQueries('Results',selectedindexpipeline);
    }
  }
  getQueries(type,selectedindexpipeline?,sortHeaderOption?,sortValue?,navigate?,request?,searchSource?) {
    var today = new Date();
    var yesterday = new Date(Date.now() - 864e5);
    var week = new Date(Date.now() - (6 * 864e5));
    var custom = new Date(Date.now() - (29 * 864e5));
    let from = new Date();
    if (this.dateType == 'hour') {
      from = yesterday;
      this.group = "hour";
    } else if (this.dateType == 'week') {
      from = week;
      this.group = "date";
    } else if (this.dateType == 'custom') {
      from = custom;
      var duration = moment.duration(Date.parse(this.endDate.toJSON()) - Date.parse(this.startDate.toJSON()), 'milliseconds');
      var days = duration.asDays();
      // console.log(days);
      if (days > 28) {
        this.group = "week";
      } else if (days == 1) {
        this.group = "hour";
      } else {
        this.group = "date";
      }
    }
    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId:selectedindexpipeline, 
      offset: this.skipPage,
      limit: 10
    };
    let payload: any = {
      type: type,
      group: this.group,
      filters: {
        from: this.startDate.toJSON(),//from.toJSON(),
        to: this.endDate.toJSON()
      },
    }

    if(sortHeaderOption){
        payload.sort ={
         order : sortValue,
         by: sortHeaderOption
        }
     }
     if(searchSource){
       payload.search =searchSource
     }

    if (type == 'SearchQueriesForResult') {
      payload.result = this.resultQueryAnswer;
    }
    this.service.invoke('get.queries', quaryparms, payload, header).subscribe(res => {
      if (type == 'Results') 
     {
        this.resultsData = res.results;
        this.totalRecord = res.totalCount;
      }
      else if (type == 'SearchQueriesForResult') {
        this.loadingQueries=false;
        this.resultsSearchData = res.results;
        this.Q_totalRecord = res.totalCount;
        // console.log("Q_totalRecord", this.Q_totalRecord)
      }
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
      this.loadingQueries=false;
    });
  }
  sortAnalytics(type?, sortHeaderOption?,sortValue?,navigate?,searchSource?,searchValue?){
    if(sortValue){
      this.sortedObject = {
        type : sortHeaderOption,
        value : sortValue,
        position: navigate
      }
    }
    // const quaryparms: any = {
    //   searchIndexID: this.serachIndexId,
    //   indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    //   queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
    //   offset: 0,
    //   limit: 10
    // };
    let request:any={}
    // if(!sortValue){
    //   request = {
    //     "extractionType": "content",
    //     "sort":{
    //       "name":1
    //     }    
    // }   
    // }
    if(sortValue){
      const sort :any ={}
      request= {
        sort
      }
    }
    // else {
    // request={}
    // }
    if(sortValue){  
      this.getSortIconVisibility(sortHeaderOption,navigate);
       //Sort start answer
        if(sortHeaderOption === 'answer' ){
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if(sortHeaderOption === 'clicks' ){
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if(sortHeaderOption === 'appearances' ){
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if(sortHeaderOption === 'clickThroughRate' ){
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if(sortHeaderOption === 'avgPosition' ){
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
       
       if(searchSource){
        request.search = searchSource;
      }
   
    
    // end
    }
    this.getQueries(type,this.selecteddropId,sortHeaderOption,sortValue,navigate,request,searchSource)
  }
  sortByApi(type,sort){
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var naviagtionArrow ='';
    var checkSortValue= '';
    if(this.isAsc){
      naviagtionArrow= 'up';
      checkSortValue = 'asc';
    }
    else{
      naviagtionArrow ='down';
      checkSortValue = 'desc';
    }
    this.sortAnalytics(type,sort,checkSortValue,naviagtionArrow)
    // this.fieldsFilter(null,null,null,null,sort,checkSortValue,naviagtionArrow)
  }
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "answer": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "appearances": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "clicks": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "clickThroughRate": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "avgPosition": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
    }
  }

  //pagination method
  paginate(event, type) {
    if (type === 'Results') {
      // this.limitPage = event.limit;
      this.skipPage = event.skip;
      this.getQueries('Results',this.selecteddropId);
    }
    else if (type === 'QRESULT') {
      // this.Q_limitPage = event.limit;
      this.Q_skipPage = event.skip;
      this.getQueries('SearchQueriesForResult',this.selecteddropId);
    }
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
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }

}
