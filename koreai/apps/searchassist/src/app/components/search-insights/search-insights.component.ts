import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { SideBarService } from '@kore.services/header.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
declare const $: any;

@Component({
  selector: 'app-search-insights',
  templateUrl: './search-insights.component.html',
  styleUrls: ['./search-insights.component.scss']
})
export class SearchInsightsComponent implements OnInit {
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  viewQueriesRef: any;
  searchSources: any = '';
  selectedApp: any;
  selecteddropId: any;
  loadingQueries = true;
  serachIndexId: any;
  topQuriesWithNoResults: any;
  getQueriesWithResults: any;
  getSearchQueriesResults: any;
  indexConfigs:any =[];
  indexConfigObj: any = {};
  selectedIndexConfig: any;
  selectedQuery = '';
  dateType = "hour";
  group = "week";
  QWR_totalRecord: number;
  QWR_limitPage: number = 10;
  QWR_skipPage: number = 0;

  QWNR_totalRecord: number;
  QWNR_limitPage: number = 10;
  QWNR_skipPage: number = 0;

  SQR_totalRecord: number;
  SQR_limitPage: number = 10;
  SQR_skipPage: number = 0;
  selectedSort = '';
  isAsc = true;
  sortedObject = {
    'type': 'fieldName',
    'position': 'up',
    "value": 'asc',
  }
  startDate: any = moment().subtract({ days: 7 });
  endDate: any = moment();
  defaultSelectedDay = 7;
  showDateRange: boolean = false;
  querieswithresults: boolean = true;
  componentType: string = 'addData';
  searchExperienceConfig: any;
  feedbackDisableDate: string;
  selected: { startDate: Moment, endDate: Moment } = { startDate: this.startDate, endDate: this.endDate }
  @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;
  @ViewChild('viewQueries') viewQueries: KRModalComponent;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService, public headerService: SideBarService,private appSelectionService: AppSelectionService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getIndexPipeline();

    //this.getQueries("GetSearchQueriesResults");
    this.searchExperienceConfig = this.headerService.searchConfiguration;
    this.feedbackDisableDate = "User feedback disabled since " + moment(this.searchExperienceConfig?.interactionsConfig?.feedbackExperience?.lmod).format("DD/MM/YYYY");
    if (localStorage.getItem('search_Insight_Result')) {
      localStorage.getItem('search_Insight_Result') == 'Top_Search_Queries' ? this.querieswithresults = true : this.querieswithresults = false;
      localStorage.removeItem('search_Insight_Result');
    }

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
    this.getQueries("QueriesWithNoResults",selectedindexpipeline);
    this.getQueries("QueriesWithResults",selectedindexpipeline);

  }
  openDateTimePicker(e){
    setTimeout(() =>{
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
    this.getQueries("QueriesWithNoResults",selectedindexpipeline);
    this.getQueries("QueriesWithResults",selectedindexpipeline);
    }
  }
  searchQuery(){
    if(this.querieswithresults){
      this.getQueries('QueriesWithResults',this.selecteddropId,null,null,null,null,this.searchSources)
    }
    else if(!this.querieswithresults){
      this.getQueries('QueriesWithNoResults',this.selecteddropId,null,null,null,null,this.searchSources)
    }
  }
  clearSearch(){
    this.searchSources = '';
    if (this.querieswithresults) {
      this.getQueries('QueriesWithResults',this.selecteddropId);
    }
    else {
      this.getQueries('QueriesWithNoResults',this.selecteddropId,)
    }

  }
  getQueries(type,selectedindexpipeline?, sortHeaderOption?, sortValue?, navigate?, request?, searchSource?) {
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
    let queryparams: any = { searchIndexId: this.serachIndexId,
      indexPipelineId:selectedindexpipeline };
    if (type == 'QueriesWithNoResults')
    {
      queryparams = {
        ...queryparams,
        offset: this.QWNR_skipPage || 0,
        limit: 10
      };
    }
    else if (type == 'QueriesWithResults') {
      queryparams = {
        ...queryparams,
        offset: this.QWR_skipPage || 0,
        limit: 10
      };
    }
    else if (type == 'SearchQueryResults') {
      queryparams = {
        ...queryparams,
        offset: this.SQR_skipPage || 0,
        limit: 10
      };
    }

    let payload: any = {
      type: type,
      group: this.group,
      filters: {
        from: this.startDate.toJSON(),//from.toJSON(),
        to: this.endDate.toJSON()
      },
    }
    if (sortHeaderOption) {
      payload.sort = {
        order: sortValue,
        by: sortHeaderOption
      }
    }
    if (searchSource) {
      payload.search = searchSource
    }

    if (type == 'SearchQueryResults') {
      payload.query = this.selectedQuery;
    }
    this.service.invoke('get.queries', queryparams, payload, header).subscribe(res => {
      if (type == 'QueriesWithNoResults') {
        this.topQuriesWithNoResults = res.result;
        this.QWNR_totalRecord = res.totalCount;
      }
      else if (type == 'QueriesWithResults') {
        this.getQueriesWithResults = res.result;
        this.QWR_totalRecord = res.totalCount;
      }
      else if (type == 'SearchQueryResults') {
        this.loadingQueries = false;
        this.getSearchQueriesResults = res.result;
        this.SQR_totalRecord = res.totalCount;
      }

    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
      this.loadingQueries = false;
    });
  }
  sortAnalytics(type?, sortHeaderOption?, sortValue?, navigate?, searchSource?, searchValue?) {
    if (sortValue) {
      this.sortedObject = {
        type: sortHeaderOption,
        value: sortValue,
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
    let request: any = {}
    // if(!sortValue){
    //   request = {
    //     "extractionType": "content",
    //     "sort":{
    //       "name":1
    //     }
    // }
    // }
    if (sortValue) {
      const sort: any = {}
      request = {
        sort
      }
    }
    // else {
    // request={}
    // }
    if (sortValue) {
      this.getSortIconVisibility(sortHeaderOption, navigate);
      //Sort start
      if (type === 'QueriesWithResults') {
        if (sortHeaderOption === 'query') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if (sortHeaderOption === 'clicks') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if (sortHeaderOption === 'searches') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
      }
      else if (type === 'QueriesWithNoResults') {
        if (sortHeaderOption === 'query') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if (sortHeaderOption === 'clicks') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
      }
      if (searchSource) {
        request.search = searchSource;
      }


      // end
    }
    this.getQueries(type,this.selecteddropId,sortHeaderOption,sortValue,navigate,request)
    // this.getSourceList(null,searchValue,searchSource, source,headerOption, sortHeaderOption,sortValue,navigate,request);

  }
  sortByApi(type, sort) {
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var naviagtionArrow = '';
    var checkSortValue = '';
    if (this.isAsc) {
      naviagtionArrow = 'up';
      checkSortValue = 'asc';
    }
    else {
      naviagtionArrow = 'down';
      checkSortValue = 'desc';
    }
    this.sortAnalytics(type, sort, checkSortValue, naviagtionArrow)
    // this.fieldsFilter(null,null,null,null,sort,checkSortValue,naviagtionArrow)
  }
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "query": {
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
      case "searches": {
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
      case "count": {
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

  paginate(event, type) {
    if (type === 'QWR') {
      // this.QWR_limitPage = event.limit;
      this.QWR_skipPage = event.skip;
      this.getQueries('QueriesWithResults',this.selecteddropId);
    }
    else if (type === 'QWNR') {
      // this.QWNR_limitPage = event.limit;
      this.QWNR_skipPage = event.skip;
      this.getQueries('QueriesWithNoResults',this.selecteddropId);
    }
    else if (type === 'SQR') {
      // this.SQR_limitPage = event.limit;
      this.SQR_skipPage = event.skip;
      this.getQueries('SearchQueryResults',this.selecteddropId);
    }
  }

  openModalPopup(result) {
    this.selectedQuery = result.query;
    this.loadingQueries = true;
    this.getQueries('SearchQueryResults',this.selecteddropId)
    this.viewQueriesRef = this.viewQueries.open();
  }
  closeModalPopup() {
    this.viewQueriesRef.close();
    this.getSearchQueriesResults = [];
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}
