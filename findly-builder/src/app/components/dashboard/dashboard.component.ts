import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { EChartOption } from 'echarts';
import { Router } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { Subscription } from 'rxjs';
import { SideBarService } from '@kore.services/header.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
declare const $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  math = Math;
  selectedApp;
  serachIndexId;
  pageLimit = 5;
  totalSearchSum = 0;
  searchesWithClicksSum = 0;
  searchesWithResultsSum = 0;
  tsqtotalRecord = 100;
  tsqlimitpage = 5;
  tsqrecordEnd = 5;

  tsqNoRtotalRecord = 100;
  tsqNoRlimitpage = 5;
  tsqNoRrecordEnd = 5;

  tsqNoCtotalRecord = 100;
  tsqNoClimitpage = 5;
  tsqNoCrecordEnd = 5;

  tsqPtotalRecord = 100;
  tsqPlimitpage = 10;
  tsqPrecordEnd = 10;

  tsqNoRPtotalRecord = 100;
  tsqNoRPlimitpage = 10;
  tsqNoRPrecordEnd = 10;

  tsqNoCPtotalRecord = 100;
  tsqNoCPlimitpage = 10;
  tsqNoCPrecordEnd = 10;

  totalRecord = 100;
  limitpage = 5;
  recordEnd = 5;
  totalUsersStats: any;
  totalSearchesStats: any;
  topSearchResults: any;
  topQuriesWithNoResults: any;
  mostSearchedQuries: any = [];
  queriesWithNoClicks: any;
  searchHistogram: any;
  mostClickedPositions: any = [];
  feedbackStats: any;
  heatMapChartOption: EChartOption;
  feedbackPieSearches: EChartOption;
  feedbackPieResult: EChartOption;
  mostClickBar: EChartOption;
  chartOption: EChartOption;
  chartOption1: EChartOption;
  userEngagementChartData: EChartOption;
  selectedSort = '';
  sortedObject = {
    'type': 'fieldName',
    'position': 'up',
    "value": 'asc',
  }
  isAsc = true;
  slider = 0;
  dateType = "hour";
  group = "week";
  isyAxisMostClickPostiondata = false
  startDate: any = moment().subtract({ days: 7 });
  endDate: any = moment();
  defaultSelectedDay = 7;
  showDateRange: boolean = false;
  componentType: string = 'addData';
  searchExperienceConfig: any;
  searchConfigurationSubscription: Subscription;
  appSubscription: Subscription;
  indexPipelineId: string;
  selected: { startDate: Moment, endDate: Moment } = { startDate: this.startDate, endDate: this.endDate }
  @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private router: Router,
    public headerService: SideBarService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.appSubscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    })
    //this.userEngagementChart();

    // this.feedback();
    //this.busyHours();

    this.getQueries("TotalUsersStats");
    this.getQueries("TotalSearchesStats");
    this.getQueries("TopQuriesWithNoResults");
    this.getQueries("MostSearchedQuries");
    this.getQueries("QueriesWithNoClicks");
    this.getQueries("SearchHistogram");
    this.getQueries("TopSearchResults");
    this.getQueries("MostClickedPositions");
    this.getQueries("FeedbackStats");
    // this.searchConfigurationSubscription = this.headerService.savedSearchConfiguration.subscribe((res) => {
    //   this.searchExperienceConfig = res;
    // });
    this.searchExperienceConfig = this.headerService.searchConfiguration;
  }
  viewAll(route, searchType?) {
    this.workflowService.mainMenuRouter$.next(route);
    this.router.navigate([route], { skipLocationChange: true });
    localStorage.setItem('search_Insight_Result', searchType);
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
  tab(index) {
    this.slider = index
    if (index == 2) {
      this.pageLimit = 10
    }
  }
  paginate(event) {
    // console.log(event)
  }
  dateLimt(type) {
    this.dateType = type;
    this.getQueries("TotalUsersStats");
    this.getQueries("TotalSearchesStats");
    this.getQueries("TopQuriesWithNoResults");
    this.getQueries("MostSearchedQuries");
    this.getQueries("QueriesWithNoClicks");
    this.getQueries("SearchHistogram");
    this.getQueries("TopSearchResults");
    this.getQueries("MostClickedPositions");
    this.getQueries("FeedbackStats");
  }
  getQueries(type, sortHeaderOption?, sortValue?, navigate?, request?) {
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
      //this.group = "week";
      var duration = moment.duration(Date.parse(this.endDate.toJSON()) - Date.parse(this.startDate.toJSON()), 'milliseconds');
      var days = duration.asDays();
      // console.log(days);
      if (days > 28) {
        this.group = "week";
        // this.dateType = this.group;
      } else if (days == 1) {
        this.group = "hour";
        this.dateType = this.group;
      } else {
        this.group = "date"; // The group indicates the payload value
        this.dateType = 'week'; // The dateType indicates the graphs rendering condition value
      }
    }
    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit: this.pageLimit
    };
    let payload: any = {
      type: type,
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
    if (type == "TotalUsersStats" || type == "TotalSearchesStats") {
      //payload.group = this.group 
    } else {
      payload.group = this.group
    }
    if (type == "QueriesWithNoClicks") {
      payload.sort = {
        order: "desc",
        by: "timestamp"
      }
    }
    this.service.invoke('get.queries', quaryparms, payload, header).subscribe(res => {
      if (type == 'TopQuriesWithNoResults') {
        this.topQuriesWithNoResults = res.response;
        this.tsqNoRtotalRecord = res.response.length;
        this.tsqNoRPtotalRecord = res.response.length;
        if (!res.response.length) {
          this.tsqNoRtotalRecord = 0
          this.tsqNoRlimitpage = 0;
          this.tsqNoRrecordEnd = 0;
        }
        this.pagination(this.topQuriesWithNoResults, type)
      } else if (type == 'MostSearchedQuries') {
        this.mostSearchedQuries = res.result;
        this.tsqtotalRecord = res.result.length;
        this.tsqPtotalRecord = res.result.length;
        if (!res.result.length) {
          this.tsqtotalRecord = 0;
          this.tsqlimitpage = 0;
          this.tsqrecordEnd = 0;
        }
        this.pagination(this.mostSearchedQuries, type)
      } else if (type == 'QueriesWithNoClicks') {
        this.queriesWithNoClicks = res.result;
        this.tsqNoCtotalRecord = res.result.length;
        this.tsqNoCPtotalRecord = res.result.length;
        if (!res.result.length) {
          this.tsqNoCtotalRecord = 0
          this.tsqNoClimitpage = 0;
          this.tsqNoCrecordEnd = 0;
        }
        this.pagination(this.queriesWithNoClicks, type)
      } else if (type == 'SearchHistogram') {
        this.searchHistogram = res.result;
        this.summaryChart();
      } else if (type == 'TopSearchResults') {
        this.topSearchResults = res.result;
      } else if (type == "MostClickedPositions") {
        this.mostClickedPositions = res.results;
        this.mostClick();
      } else if (type == "FeedbackStats") {
        this.feedbackStats = res || {};
        this.feedback();
      } else if (type == "TotalUsersStats") {
        this.totalUsersStats = res;
      } else if (type == "TotalSearchesStats") {
        this.totalSearchesStats = res;
      }
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  sortAnalytics(type?, sortHeaderOption?, sortValue?, navigate?) {
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
      if (type === 'TotalSearchesStats' || type === 'TopQuriesWithNoResults') {
        if (sortHeaderOption === 'query') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if (sortHeaderOption === 'count') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
      }


      if (type === 'TopSearchResults') {
        if (sortHeaderOption === 'answer') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if (sortHeaderOption === 'clicks') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if (sortHeaderOption === 'appearances') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if (sortHeaderOption === 'clickThroughRate') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
        if (sortHeaderOption === 'avgPosition') {
          request.sort.order = sortValue
          request.sort.by = sortHeaderOption
        }
      }


      // end
    }
    this.getQueries(type, sortHeaderOption, sortValue, navigate, request)
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

  pagination(data, type) {
    if (type == 'MostSearchedQuries') {
      if (data.length <= this.tsqlimitpage) { this.tsqlimitpage = data.length }
      if (data.length <= this.tsqrecordEnd) { this.tsqrecordEnd = data.length }

      if (data.length <= this.tsqPlimitpage) { this.tsqPlimitpage = data.length }
      if (data.length <= this.tsqPrecordEnd) { this.tsqPrecordEnd = data.length }

    }
    if (type == 'TopQuriesWithNoResults') {
      if (data.length <= this.tsqNoRlimitpage) { this.tsqNoRlimitpage = data.length }
      if (data.length <= this.tsqNoRrecordEnd) { this.tsqNoRrecordEnd = data.length }

      if (data.length <= this.tsqNoRPlimitpage) { this.tsqNoRPlimitpage = data.length }
      if (data.length <= this.tsqNoRPrecordEnd) { this.tsqNoRPrecordEnd = data.length }

    }
    if (type == 'QueriesWithNoClicks') {
      if (data.length <= this.tsqNoClimitpage) { this.tsqNoClimitpage = data.length }
      if (data.length <= this.tsqNoCrecordEnd) { this.tsqNoCrecordEnd = data.length }

      if (data.length <= this.tsqNoCPlimitpage) { this.tsqNoCPlimitpage = data.length }
      if (data.length <= this.tsqNoCPrecordEnd) { this.tsqNoCPrecordEnd = data.length }

    }
  }
  // compare(a: number | string, b: number | string, isAsc: boolean) {
  //   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  // }
  // sortBy(sort) {
  //   const data = this.resources.slice();
  //   this.selectedSort = sort;
  //   if (this.selectedSort !== sort) {
  //     this.isAsc = true;
  //   } else {
  //     this.isAsc = !this.isAsc;
  //   }
  //   const sortedData = data.sort((a, b) => {
  //     const isAsc = this.isAsc;
  //     switch (sort) {
  //       case 'type': return this.compare(a.type, b.type, isAsc);
  //       case 'recentStatus': return this.compare(a.recentStatus, b.recentStatus, isAsc);
  //       case 'name': return this.compare(a.name, b.name, isAsc);
  //       case 'createdOn': return this.compare(a.createdOn, b.createdOn, isAsc);
  //       default: return 0;
  //     }
  //   });
  //   this.resources = sortedData;
  // }
  summaryChart() {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var totaldata = [];
    let summaryData = [];
    this.totalSearchSum = 0;
    for (var i = 0; i < this.searchHistogram.length; i++) {
      summaryData.push(Math.max(this.searchHistogram[i].totalSearches, this.searchHistogram[i].searchesWithResults, this.searchHistogram[i].searchesWithClicks));
      if (this.dateType == 'hour' && i > 0 && i <= 24) {
        totaldata.push([i + 'hr', this.searchHistogram[i].totalSearches, this.searchHistogram[i].searchesWithResults, this.searchHistogram[i].searchesWithClicks, i + 'hr'])
      } else if (this.dateType == 'week' || this.dateType == 'custom') {
        let date = new Date(this.searchHistogram[i].date);
        // xAxisData.push(date.getDate() + " " +monthNames[date.getMonth()])
        // totaldata.push([date.getDate() + " " + monthNames[date.getMonth()], this.searchHistogram[i].totalSearches, this.searchHistogram[i].searchesWithResults, this.searchHistogram[i].searchesWithClicks, moment(date,"Do MMM, YYYY")])
        totaldata.push([moment.utc(date).format("Do MMM"), this.searchHistogram[i].totalSearches, this.searchHistogram[i].searchesWithResults, this.searchHistogram[i].searchesWithClicks, moment.utc(date).format("DD MMM YYYY")])
      }
      // else if(this.dateType == 'custom'){
      //   let date = new Date(this.searchHistogram[i].date);
      //   totaldata.push([i+'hr',this.searchHistogram[i].totalSearches,this.searchHistogram[i].searchesWithResults,this.searchHistogram[i].searchesWithClicks])
      // }
      this.totalSearchSum = this.totalSearchSum + this.searchHistogram[i].totalSearches;
      this.searchesWithResultsSum = this.searchesWithResultsSum + this.searchHistogram[i].searchesWithResults;
      this.searchesWithClicksSum = this.searchesWithClicksSum + this.searchHistogram[i].searchesWithClicks
    }

    var searchWithResultdata = []
    var searchWithClickdata = []

    var dateList = totaldata.map(function (item) {
      return item[0];
    });

    var valueList = totaldata.map(function (item) {
      return item[1];
    });
    var valueList1 = totaldata.map(function (item) {
      return item[2];
    });

    var valueList2 = totaldata.map(function (item) {
      return item[3];
    });
    var dateTooltipList = totaldata.map(function (item) {
      return item[4];
    });


    this.chartOption = {
      grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      // 4th August, 2020
      tooltip: {
        trigger: 'axis',
        formatter: `
      <div class="metrics-tooltips-hover">
      <div class="main-title">{c3}</div>
      <div class="data-content"><span class="indication searches"></span><span class="title">Total Searches
              :</span><span class="count-data">{c0}</span></div>
      <div class="data-content"><span class="indication result"></span><span class="title">Searches with Results
              :</span><span class="count-data">{c1}</span></div>
      <div class="data-content"><span class="indication clicks"></span><span class="title">Searches with Clicks
              :</span><span class="count-data">{c2}</span></div>
  </div>
      `,
        position: 'top',
        padding: 0
      },

      xAxis: [{
        data: dateList,
        type: 'category',
        // type: 'time',
        minInterval: 8,
        boundaryGap: false,
        show: true,
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        //data: ['1st Aug', '2nd Aug' , '3rd Aug', '4th Aug', '5th Aug', '6th Aug', '7th Aug']
        //splitLine: {show: true}
      }],
      yAxis: [{
        type: 'value',
        name: 'Count',
        nameLocation: 'middle',
        min: 0,
        max: 5,
        nameGap: 50,
        nameTextStyle: {
          color: "#9AA0A6",
          fontWeight: "normal",
          fontSize: 12,
          fontFamily: "Inter"
        },
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        splitLine: { show: true }
      }],

      series: [{
        type: 'line',
        showSymbol: false,
        data: valueList,
        lineStyle: { color: '#0D6EFD' }
      }, {
        type: 'line',
        showSymbol: false,
        data: valueList1,
        lineStyle: { color: '#28A745' }
      }
        , {
        type: 'line',
        showSymbol: false,
        data: valueList2,
        lineStyle: { color: '#7027E5' }
      }, {
        type: 'line',
        showSymbol: false,
        data: dateTooltipList,
        lineStyle: { color: '#7027E5' }
      }]
    };
    if (Math.max(...summaryData) > 5) {
      delete this.chartOption.yAxis[0].min;
      delete this.chartOption.yAxis[0].max;
    }
    /** TEST */
    this.chartOption1 = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        scale: true,
        show: true,
        splitLine: {//remove grid lines
          show: false
        },
        //splitArea : {show : false}// remove the grid area
      },
      yAxis: {
        type: 'value',
        scale: true,
        show: true,
        splitLine: {
          show: true
        },
        splitArea: { show: false }
      },
      // tooltip: {
      //     axisPointer: {
      //         label: {
      //             //backgroundColor: '#6a7985'
      //         }
      //     }
      // },
      tooltip: {

        formatter: `
          <div class="metrics-tooltips-hover">
          <div class="main-title">4th August, 2020</div>
          <div class="data-content"><span class="indication searches"></span><span class="title">Total Searches
                  :</span><span class="count-data">240</span></div>
          <div class="data-content"><span class="indication result"></span><span class="title">Searches with Results
                  :</span><span class="count-data">160</span></div>
          <div class="data-content"><span class="indication clicks"></span><span class="title">Searches with Clicks
                  :</span><span class="count-data">80</span></div>
      </div>
          `,
        position: 'top',
        padding: 0
      },
      series: [{
        data: [7, 10, 14, 18, 15, 10, 6],
        type: 'line',
        lineStyle: {
          color: '#202124',
        }
      },
      {
        data: [8, 11, 21, 15, 10, 5, 5],
        type: 'line',
        lineStyle: {
          color: '#3368BB',
        }
      },
      {
        data: [8, 11, 16, 15, 10, 5, 5],
        type: 'line',
        lineStyle: {
          color: '#009DAB',
        }
      }
      ]
    };
  }
  mostClick() {
    let xAxisData = [];
    let yAxisData = [];
    let barColor = "#B893F2";
    if (this.mostClickedPositions) {
      this.mostClickedPositions.forEach(element => {
        if (element.position == 0) yAxisData.push(Number(element.position + 1) + "st Position")
        if (element.position == 1) yAxisData.push(Number(element.position + 1) + "nd Position")
        if (element.position == 2) yAxisData.push(Number(element.position + 1) + "rd Position")
        if (element.position > 2) yAxisData.push(Number(element.position + 1) + "th Position");
        xAxisData.push(element.clicks)
      });
      if (xAxisData.length) {
        this.isyAxisMostClickPostiondata = true;
        barColor = "#B893F2"
      } else {
        xAxisData = [120, 200, 150];
        yAxisData = ['1st Position', '2nd Position', '3rd Position']
        this.isyAxisMostClickPostiondata = false;
        barColor = "#EFF0F1"
      }

      // xAxisData = [120];
      // yAxisData= ['1st']
    } else {
      xAxisData = [120, 200, 150];
      yAxisData = ['1st Position', '2nd Position', '3rd Position']
      this.isyAxisMostClickPostiondata = false;
      barColor = "#EFF0F1"
    }

    this.mostClickBar = {
      grid: {
        containLabel: true,
        left: "5%"
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: `
              <div class="metrics-tooltips-hover agent_drop_tolltip">
              <div class="split-sec">
                <div class="main-title">{c0}</div>
              </div> 
            </div>
            
            `,
        position: 'top',
        padding: 0

      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 5,
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        //   axisLabel: {
        //     formatter: '{value}'
        // },
        // name: "Number  of  Clicks"
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
      },
      barWidth: 40,
      series: [{
        label: {
          normal: {
            show: false,
            position: 'outside',
            color: '#202124',
            //textBorderColor: '#202124',
            //textBorderWidth: 1
          }
        },
        itemStyle: {
          normal: {
            color: barColor,
          },
        },
        data: xAxisData,//[120, 200, 150],
        type: 'bar',
        barWidth: '90%',
      }]
    };
    if (Math.max(...xAxisData) > 5) {
      delete this.mostClickBar.xAxis.min;
      delete this.mostClickBar.xAxis.max;
    }
  }
  feedback() {
    // this.feedbackStats
    var colorPaletteSearch = ['#28A745', '#EAF6EC'];
    var colorPaletteResult = ['#FF784B', '#FFF1ED'];
    this.feedbackPieSearches = {
      series: [{
        type: 'pie',
        radius: 90,
        color: colorPaletteSearch,
        hoverAnimation: false,
        center: ['50%', '50%'],
        data: [this.feedbackStats.percentages.totalSearchesPercent, this.feedbackStats.percentages.feedbackReceivedPercent],
        label: {
          show: true,
          position: 'inner',
          formatter: (params) => {
            return params.percent ? params.percent + '%' : '';
          },

        },
      }
      ]
    };
    this.feedbackPieResult = {
      series: [{
        type: 'pie',
        radius: 90,
        color: colorPaletteResult,
        hoverAnimation: false,
        center: ['50%', '50%'],
        data: [this.feedbackStats.percentages.negativeFeedbackPercent, this.feedbackStats.percentages.postitiveFeedbackPercent],
        label: {
          show: true,
          position: 'inner',
          formatter: (params) => {
            return params.percent ? params.percent + '%' : '';
          }
        },
      }
      ]
    };

  }
  ngOnDestroy() {
    this.searchConfigurationSubscription ? this.searchConfigurationSubscription.unsubscribe() : false;
    this.appSubscription ? this.appSubscription.unsubscribe() : false;
  }
  // busyHours(){
  //   let hours = ["5 am","6 am","7 am","8 am","9 am","10 am","11 am","12 pm","1 pm","2 pm","3 pm","4 pm","5 pm"];
  // let days = ["1st Aug","2nd Aug","3rd Aug","4th Aug","5th Aug","6th Aug","7th Aug"]

  // let data = [[0,0,1],[0,1,2],[0,2,3],[0,3,4],[0,4,5],[0,5,6],[0,6,7],[1,0,1],[1,1,2],[1,2,3],[1,3,4],[1,4,5],[1,5,6],[1,6,7],[2,0,1],[2,1,2],[2,2,3],[2,3,4],[2,4,5],[2,5,6],[2,6,7],[3,0,1],[3,1,2],[3,2,3],[3,3,4],[3,4,5],[3,5,6],[3,6,7],[4,0,1],[4,1,2],[4,2,3],[4,3,4],[4,4,5],[4,5,6],[4,6,7],[5,0,1],[5,1,2],[5,2,3],[5,3,4],[5,4,5],[5,5,6],[5,6,7],[6,0,1],[6,1,2],[6,2,3],[6,3,4],[6,4,5],[6,5,6],[6,6,7],[7,0,1],[7,1,2],[7,2,3],[7,3,4],[7,4,5],[7,5,6],[7,6,7],[8,0,1],[8,1,2],[8,2,3],[8,3,4],[8,4,5],[8,5,6],[8,6,7],[9,0,1],[9,1,2],[9,2,3],[9,3,4],[9,4,5],[9,5,6],[9,6,7],[10,0,1],[10,1,2],[10,2,3],[10,3,4],[10,4,5],[10,5,6],[10,6,7],[11,0,1],[11,1,2],[11,2,3],[11,3,4],[11,4,5],[11,5,6],[11,6,7],[12,0,1],[12,1,2],[12,2,3],[12,3,4],[12,4,5],[12,5,6],[12,6,7]];
  // this.heatMapChartOption = {
  //   tooltip: {
  //     position: 'top'
  //   },
  //   animation: false,
  //   grid: {
  //     height: '70%',
  //     top: '10%',
  //     left: '5%',
  //     right: 0,
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: hours,
  //     axisLine: {
  //       show: false
  //     },
  //     axisLabel:{
  //       margin: 20,
  //       color: "#8a959f",
  //       fontWeight: "bold",
  //       fontSize: 12,
  //       fontFamily: "Lato"
  //     },
  //     axisTick: {
  //       show: false
  //     },
  //     splitLine: {
  //       show: true,
  //       lineStyle: {
  //         color: "#FFF",
  //         width: 5
  //       }
  //     },
  //     splitArea: {
  //       show: true
  //     },
  //     boundaryGap: true,
  //     position: 'top'
  //   },
  //   yAxis: {
  //     type: 'category',
  //     data: days,
  //     axisLine: {
  //       show: false
  //     },
  //     axisLabel:{
  //       margin: 20,
  //       color: "#8a959f",
  //       fontWeight: "bold",
  //       fontSize: 12,
  //       fontFamily: "Lato"
  //     },
  //     axisTick: {
  //       show: false
  //     },
  //     splitLine: {
  //       show: true,
  //       lineStyle: {
  //         color: "#FFF",
  //         width: 5
  //       }
  //     },
  //     splitArea: {
  //       show: true
  //     },
  //     boundaryGap: true
  //   },

  //   visualMap: [{
  //     show: false,
  //     min: 0,
  //     max: 10,
  //     calculable: true,
  //     orient: 'horizontal',
  //     left: 'center',
  //     bottom: '0',
  //     inRange : {   
  //       color: ['rgba(0, 157, 171, 0.1)', '#009dab' ] //From smaller to bigger value ->
  //     }
  //   }],
  //   series: [{
  //     name: 'Users',
  //     type: 'heatmap',
  //     data: data,
  //     emphasis: {
  //       itemStyle: {
  //         shadowColor: 'rgba(0, 0, 0, 0.5)'
  //       }
  //     },
  //     itemStyle: {
  //       borderColor: "#fff",
  //       borderWidth: 4
  //     }

  //   }]
  // };
  // }
}