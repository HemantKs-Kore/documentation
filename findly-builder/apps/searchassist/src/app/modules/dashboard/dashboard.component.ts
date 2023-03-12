import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
// import { EChartOption } from 'echarts';
import { Router } from '@angular/router';

import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { filter, Subscription } from 'rxjs';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { SideBarService } from '@kore.apps/services/header.service';
import { Store } from '@ngrx/store';
import { differenceInDays, format, subDays, subHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
  selectAppIds,
  selectSearchExperiance,
} from '@kore.apps/store/app.selectors';

declare const $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  math = Math;
  selectedApp;
  searchIndexId;
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
  /*added line 52,53 for the dropdown based analytics 17/01 */
  indexConfigObj: any = {};
  selectedIndexConfig: any; // changes ends here

  totalUsersStats: any;
  totalSearchesStats: any;
  topSearchResults: any;
  topQuriesWithNoResults: any;
  mostSearchedQuries: any = [];
  queriesWithNoClicks: any;
  searchHistogram: any;
  selecteddropId: any;
  mostClickedPositions: any = [];
  feedbackStats: any;
  heatMapChartOption: any;
  feedbackPieSearches: any;
  feedbackPieResult: any;
  mostClickBar: any;
  chartOption: any;
  chartOption1: any;
  userEngagementChartData: any;
  selectedSort = '';
  sortedObject = {
    type: 'fieldName',
    position: 'up',
    value: 'asc',
  };
  isAsc = true;
  slider = 0;
  dateType = 'hour';
  group = 'week';
  isyAxisMostClickPostiondata = false;
  startDate: any = subDays(new Date(), 7);
  endDate: any = new Date();
  defaultSelectedDay = 7;
  showDateRange = false;
  componentType = 'addData';
  searchExperienceConfig: any;
  searchConfigurationSubscription: Subscription;
  appSubscription: Subscription;
  indexPipelineId: string;
  selected: { startDate: Date; endDate: Date } = {
    startDate: this.startDate,
    endDate: this.endDate,
  };
  sub: Subscription;
  @ViewChild(DaterangepickerDirective, { static: true })
  pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private router: Router,
    public headerService: SideBarService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private store: Store
  ) {}
  indexConfigs: any = []; //added on 17/01

  ngOnInit(): void {
    this.initAppIds();
  }

  initAppIds() {
    const idsSub = this.store
      .select(selectAppIds)
      .subscribe(({ searchIndexId, indexPipelineId }) => {
        this.searchIndexId = searchIndexId;
        this.indexPipelineId = indexPipelineId;

        this.getSearchExperience();
      });
    this.sub?.add(idsSub);
  }

  getSearchExperience() {
    const searchExperianceConfigSub = this.store
      .select(selectSearchExperiance)
      .pipe(filter((res) => !!res))
      .subscribe((res) => {
        this.searchExperienceConfig = res;
      });

    this.appSubscription?.add(searchExperianceConfigSub);
  }

  getIndexPipeline() {
    const header: any = {
      'x-timezone-offset': '-330',
    };
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      offset: 0,
      limit: 100,
    };
    this.service.invoke('get.indexPipeline', quaryparms, header).subscribe(
      (res) => {
        this.indexConfigs = res;
        this.indexConfigs.forEach((element) => {
          this.indexConfigObj[element._id] = element;
        });
        if (res.length >= 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].default === true) {
              this.selectedIndexConfig = res[i]._id;
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
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }

  /* added on 17/01 */
  getAllgraphdetails(selectedindexpipeline) {
    this.selecteddropId = selectedindexpipeline;
    this.getQueries('TotalUsersStats', selectedindexpipeline);
    this.getQueries('TotalSearchesStats', selectedindexpipeline);
    this.getQueries('TopQuriesWithNoResults', selectedindexpipeline);
    this.getQueries('MostSearchedQuries', selectedindexpipeline);
    this.getQueries('QueriesWithNoClicks', selectedindexpipeline);
    this.getQueries('SearchHistogram', selectedindexpipeline);
    this.getQueries('TopSearchResults', selectedindexpipeline);
    this.getQueries('MostClickedPositions', selectedindexpipeline);
    this.getQueries('FeedbackStats', selectedindexpipeline);
  }
  /*added selectindex pipeline function to capture the id's of selection dropdowns on 17/01*/
  // selectIndexPipelineId(indexConfigs, event?, type?) {
  //   if (event) {
  //     event.close();
  //   }
  //   //this.workflowService.selectedSearchIndex(indexConfigs._id)
  //   this.appSelectionService.getIndexPipelineIds(indexConfigs)
  //   this.selectedIndexConfig = indexConfigs._id;
  //   //this.reloadCurrentRoute()
  // }//changes ends here

  /* to get the id of the selected element 17/01 */
  // getDetails(config?){
  //   this.selecteddropname=config.name;
  //   this.selectedIndexConfig=config._id;
  //   this.getAllgraphdetails(config._id);

  // }

  viewAll(route, searchType?) {
    this.workflowService.mainMenuRouter$.next(route);
    this.router.navigate([route], { skipLocationChange: true });
    localStorage.setItem('search_Insight_Result', searchType);
  }
  openDateTimePicker(e) {
    setTimeout(() => {
      this.pickerDirective.open(e);
    });
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
    } else if (range === 7) {
      this.startDate = subDays(new Date(), 6);
      this.endDate = new Date();
      this.dateLimt('week');
      // this.callFlowJourneyData();
      this.showDateRange = false;
    } else if (range === 1) {
      this.startDate = subHours(new Date(), 23);
      this.endDate = new Date();
      this.dateLimt('hour');
      // this.callFlowJourneyData();
      this.showDateRange = false;
    }
  }
  tab(index) {
    this.slider = index;
    if (index == 2) {
      this.pageLimit = 10;
    }
  }
  paginate(event) {
    // console.log(event)
  }
  dateLimt(type) {
    this.dateType = type;
    /*passing the selectedindexpipeline to getQueries added on 17/01 */
    const selectedindexpipeline = this.selecteddropId;
    if (selectedindexpipeline) {
      this.getQueries('TotalUsersStats', selectedindexpipeline);
      this.getQueries('TotalSearchesStats', selectedindexpipeline);
      this.getQueries('TopQuriesWithNoResults', selectedindexpipeline);
      this.getQueries('MostSearchedQuries', selectedindexpipeline);
      this.getQueries('QueriesWithNoClicks', selectedindexpipeline);
      this.getQueries('SearchHistogram', selectedindexpipeline);
      this.getQueries('TopSearchResults', selectedindexpipeline);
      this.getQueries('MostClickedPositions', selectedindexpipeline);
      this.getQueries('FeedbackStats', selectedindexpipeline);
    }
  }
  getQueries(
    type,
    selectedindexpipeline?,
    sortHeaderOption?,
    sortValue?,
    navigate?,
    request?
  ) {
    const today = new Date();
    const yesterday = new Date(Date.now() - 864e5);
    const week = new Date(Date.now() - 6 * 864e5);
    const custom = new Date(Date.now() - 29 * 864e5);
    let from = new Date();
    if (this.dateType == 'hour') {
      from = yesterday;
      this.group = 'hour';
    } else if (this.dateType == 'week') {
      from = week;
      this.group = 'date';
    } else if (this.dateType == 'custom') {
      from = custom;
      //this.group = "week";
      const days = Math.round(
        differenceInDays(
          Date.parse(this.endDate.toJSON()),
          Date.parse(this.startDate.toJSON())
        )
      );
      // const days = duration.asDays();
      // console.log(days);
      if (days > 28) {
        this.group = 'week';
        // this.dateType = this.group;
      } else if (days == 1) {
        this.group = 'hour';
        this.dateType = this.group;
      } else {
        this.group = 'date'; // The group indicates the payload value
        this.dateType = 'week'; // The dateType indicates the graphs rendering condition value
      }
    }
    const header: any = {
      'x-timezone-offset': '-330',
    };

    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      /* adding indexPipelineid to query params on 17/01*/
      indexPipelineId: selectedindexpipeline,
      //indexPipelineId:selectedindexpipeline ? selectedindexpipeline : this.defaultPipelineid,
      offset: 0,
      limit: this.pageLimit,
    };
    const payload: any = {
      type: type,
      filters: {
        from: this.startDate.toJSON(), //from.toJSON(),
        to: this.endDate.toJSON(),
      },
    };
    if (sortHeaderOption) {
      payload.sort = {
        order: sortValue,
        by: sortHeaderOption,
      };
    }
    if (type == 'TotalUsersStats' || type == 'TotalSearchesStats') {
      //payload.group = this.group
    } else {
      payload.group = this.group;
    }
    if (type == 'QueriesWithNoClicks') {
      payload.sort = {
        order: 'desc',
        by: 'timestamp',
      };
    }
    this.service.invoke('get.queries', quaryparms, payload, header).subscribe(
      (res) => {
        if (type == 'TopQuriesWithNoResults') {
          this.topQuriesWithNoResults = res.response;
          this.tsqNoRtotalRecord = res.response.length;
          this.tsqNoRPtotalRecord = res.response.length;
          if (!res.response.length) {
            this.tsqNoRtotalRecord = 0;
            this.tsqNoRlimitpage = 0;
            this.tsqNoRrecordEnd = 0;
          }
          this.pagination(this.topQuriesWithNoResults, type);
        } else if (type == 'MostSearchedQuries') {
          this.mostSearchedQuries = res.result;
          this.tsqtotalRecord = res.result.length;
          this.tsqPtotalRecord = res.result.length;
          if (!res.result.length) {
            this.tsqtotalRecord = 0;
            this.tsqlimitpage = 0;
            this.tsqrecordEnd = 0;
          }
          this.pagination(this.mostSearchedQuries, type);
        } else if (type == 'QueriesWithNoClicks') {
          this.queriesWithNoClicks = res.result;
          this.tsqNoCtotalRecord = res.result.length;
          this.tsqNoCPtotalRecord = res.result.length;
          if (!res.result.length) {
            this.tsqNoCtotalRecord = 0;
            this.tsqNoClimitpage = 0;
            this.tsqNoCrecordEnd = 0;
          }
          this.pagination(this.queriesWithNoClicks, type);
        } else if (type == 'SearchHistogram') {
          this.searchHistogram = res.result;
          this.summaryChart();
        } else if (type == 'TopSearchResults') {
          this.topSearchResults = res.result;
        } else if (type == 'MostClickedPositions') {
          this.mostClickedPositions = res.results;
          this.mostClick();
        } else if (type == 'FeedbackStats') {
          this.feedbackStats = res || {};
          this.feedback();
        } else if (type == 'TotalUsersStats') {
          this.totalUsersStats = res;
        } else if (type == 'TotalSearchesStats') {
          this.totalSearchesStats = res;
        }
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  sortAnalytics(type?, sortHeaderOption?, sortValue?, navigate?) {
    if (sortValue) {
      this.sortedObject = {
        type: sortHeaderOption,
        value: sortValue,
        position: navigate,
      };
    }

    let request: any = {};
    // if(!sortValue){
    //   request = {
    //     "extractionType": "content",
    //     "sort":{
    //       "name":1
    //     }
    // }
    // }
    if (sortValue) {
      const sort: any = {};
      request = {
        sort,
      };
    }
    // else {
    // request={}
    // }
    if (sortValue) {
      this.getSortIconVisibility(sortHeaderOption, navigate);
      //Sort start
      if (type === 'TotalSearchesStats' || type === 'TopQuriesWithNoResults') {
        if (sortHeaderOption === 'query') {
          request.sort.order = sortValue;
          request.sort.by = sortHeaderOption;
        }
        if (sortHeaderOption === 'count') {
          request.sort.order = sortValue;
          request.sort.by = sortHeaderOption;
        }
      }

      if (type === 'TopSearchResults') {
        if (sortHeaderOption === 'answer') {
          request.sort.order = sortValue;
          request.sort.by = sortHeaderOption;
        }
        if (sortHeaderOption === 'clicks') {
          request.sort.order = sortValue;
          request.sort.by = sortHeaderOption;
        }
        if (sortHeaderOption === 'appearances') {
          request.sort.order = sortValue;
          request.sort.by = sortHeaderOption;
        }
        if (sortHeaderOption === 'clickThroughRate') {
          request.sort.order = sortValue;
          request.sort.by = sortHeaderOption;
        }
        if (sortHeaderOption === 'avgPosition') {
          request.sort.order = sortValue;
          request.sort.by = sortHeaderOption;
        }
      }

      // end
    }
    this.getQueries(
      type,
      this.selecteddropId,
      sortHeaderOption,
      sortValue,
      navigate,
      request
    );
    // this.getSourceList(null,searchValue,searchSource, source,headerOption, sortHeaderOption,sortValue,navigate,request);
  }
  sortByApi(type, sort) {
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    let naviagtionArrow = '';
    let checkSortValue = '';
    if (this.isAsc) {
      naviagtionArrow = 'up';
      checkSortValue = 'asc';
    } else {
      naviagtionArrow = 'down';
      checkSortValue = 'desc';
    }
    this.sortAnalytics(type, sort, checkSortValue, naviagtionArrow);
    // this.fieldsFilter(null,null,null,null,sort,checkSortValue,naviagtionArrow)
  }
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case 'answer': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'clicks': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'appearances': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'clickThroughRate': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'avgPosition':
        {
          if (this.selectedSort == sortingField) {
            if (this.isAsc == false && type == 'down') {
              return 'display-block';
            }
            if (this.isAsc == true && type == 'up') {
              return 'display-block';
            }
            return 'display-none';
          }
        }
        break;
    }
  }

  pagination(data, type) {
    if (type == 'MostSearchedQuries') {
      if (data.length <= this.tsqlimitpage) {
        this.tsqlimitpage = data.length;
      }
      if (data.length <= this.tsqrecordEnd) {
        this.tsqrecordEnd = data.length;
      }

      if (data.length <= this.tsqPlimitpage) {
        this.tsqPlimitpage = data.length;
      }
      if (data.length <= this.tsqPrecordEnd) {
        this.tsqPrecordEnd = data.length;
      }
    }
    if (type == 'TopQuriesWithNoResults') {
      if (data.length <= this.tsqNoRlimitpage) {
        this.tsqNoRlimitpage = data.length;
      }
      if (data.length <= this.tsqNoRrecordEnd) {
        this.tsqNoRrecordEnd = data.length;
      }

      if (data.length <= this.tsqNoRPlimitpage) {
        this.tsqNoRPlimitpage = data.length;
      }
      if (data.length <= this.tsqNoRPrecordEnd) {
        this.tsqNoRPrecordEnd = data.length;
      }
    }
    if (type == 'QueriesWithNoClicks') {
      if (data.length <= this.tsqNoClimitpage) {
        this.tsqNoClimitpage = data.length;
      }
      if (data.length <= this.tsqNoCrecordEnd) {
        this.tsqNoCrecordEnd = data.length;
      }

      if (data.length <= this.tsqNoCPlimitpage) {
        this.tsqNoCPlimitpage = data.length;
      }
      if (data.length <= this.tsqNoCPrecordEnd) {
        this.tsqNoCPrecordEnd = data.length;
      }
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
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const totaldata = [];
    const summaryData = [];
    this.totalSearchSum = 0;
    for (let i = 0; i < this.searchHistogram.length; i++) {
      summaryData.push(
        Math.max(
          this.searchHistogram[i].totalSearches,
          this.searchHistogram[i].searchesWithResults,
          this.searchHistogram[i].searchesWithClicks
        )
      );
      if (this.dateType == 'hour' && i > 0 && i <= 24) {
        totaldata.push([
          i + 'hr',
          this.searchHistogram[i].totalSearches,
          this.searchHistogram[i].searchesWithResults,
          this.searchHistogram[i].searchesWithClicks,
          i + 'hr',
        ]);
      } else if (this.dateType == 'week' || this.dateType == 'custom') {
        const date = new Date(this.searchHistogram[i].date);
        // xAxisData.push(date.getDate() + " " +monthNames[date.getMonth()])

        totaldata.push([
          format(utcToZonedTime(date, 'UTC'), 'do MMM'),
          this.searchHistogram[i].totalSearches,
          this.searchHistogram[i].searchesWithResults,
          this.searchHistogram[i].searchesWithClicks,
          format(utcToZonedTime(date, 'UTC'), 'dd MMM yyyy'),
        ]);
      }
      // else if(this.dateType == 'custom'){
      //   let date = new Date(this.searchHistogram[i].date);
      //   totaldata.push([i+'hr',this.searchHistogram[i].totalSearches,this.searchHistogram[i].searchesWithResults,this.searchHistogram[i].searchesWithClicks])
      // }
      this.totalSearchSum =
        this.totalSearchSum + this.searchHistogram[i].totalSearches;
      this.searchesWithResultsSum =
        this.searchesWithResultsSum +
        this.searchHistogram[i].searchesWithResults;
      this.searchesWithClicksSum =
        this.searchesWithClicksSum + this.searchHistogram[i].searchesWithClicks;
    }

    const searchWithResultdata = [];
    const searchWithClickdata = [];

    const dateList = totaldata.map(function (item) {
      return item[0];
    });

    const valueList = totaldata.map(function (item) {
      return item[1];
    });
    const valueList1 = totaldata.map(function (item) {
      return item[2];
    });

    const valueList2 = totaldata.map(function (item) {
      return item[3];
    });
    const dateTooltipList = totaldata.map(function (item) {
      return item[4];
    });

    this.chartOption = {
      grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
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
        padding: 0,
      },

      xAxis: [
        {
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
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Count',
          nameLocation: 'middle',
          min: 0,
          max: 5,
          nameGap: 50,
          nameTextStyle: {
            color: '#9AA0A6',
            fontWeight: 'normal',
            fontSize: 12,
            fontFamily: 'Inter',
          },
          axisLine: {
            show: false, // Hide full Line
          },
          axisTick: {
            show: false, // Hide Ticks,
          },
          splitLine: { show: true },
        },
      ],

      series: [
        {
          type: 'line',
          showSymbol: false,
          data: valueList,
          lineStyle: { color: '#0D6EFD' },
        },
        {
          type: 'line',
          showSymbol: false,
          data: valueList1,
          lineStyle: { color: '#28A745' },
        },
        {
          type: 'line',
          showSymbol: false,
          data: valueList2,
          lineStyle: { color: '#7027E5' },
        },
        {
          type: 'line',
          showSymbol: false,
          data: dateTooltipList,
          lineStyle: { color: '#7027E5' },
        },
      ],
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
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        scale: true,
        show: true,
        splitLine: {
          //remove grid lines
          show: false,
        },
        //splitArea : {show : false}// remove the grid area
      },
      yAxis: {
        type: 'value',
        scale: true,
        show: true,
        splitLine: {
          show: true,
        },
        splitArea: { show: false },
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
        padding: 0,
      },
      series: [
        {
          data: [7, 10, 14, 18, 15, 10, 6],
          type: 'line',
          lineStyle: {
            color: '#202124',
          },
        },
        {
          data: [8, 11, 21, 15, 10, 5, 5],
          type: 'line',
          lineStyle: {
            color: '#3368BB',
          },
        },
        {
          data: [8, 11, 16, 15, 10, 5, 5],
          type: 'line',
          lineStyle: {
            color: '#009DAB',
          },
        },
      ],
    };
  }
  mostClick() {
    let xAxisData = [];
    let yAxisData = [];
    let barColor = '#B893F2';
    if (this.mostClickedPositions) {
      this.mostClickedPositions.forEach((element) => {
        if (element.position == 0)
          yAxisData.push(Number(element.position + 1) + 'st Position');
        if (element.position == 1)
          yAxisData.push(Number(element.position + 1) + 'nd Position');
        if (element.position == 2)
          yAxisData.push(Number(element.position + 1) + 'rd Position');
        if (element.position > 2)
          yAxisData.push(Number(element.position + 1) + 'th Position');
        xAxisData.push(element.clicks);
      });
      if (xAxisData.length) {
        this.isyAxisMostClickPostiondata = true;
        barColor = '#B893F2';
      } else {
        xAxisData = [120, 200, 150];
        yAxisData = ['1st Position', '2nd Position', '3rd Position'];
        this.isyAxisMostClickPostiondata = false;
        barColor = '#EFF0F1';
      }

      // xAxisData = [120];
      // yAxisData= ['1st']
    } else {
      xAxisData = [120, 200, 150];
      yAxisData = ['1st Position', '2nd Position', '3rd Position'];
      this.isyAxisMostClickPostiondata = false;
      barColor = '#EFF0F1';
    }

    this.mostClickBar = {
      grid: {
        containLabel: true,
        left: '5%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter: `
              <div class="metrics-tooltips-hover agent_drop_tolltip">
              <div class="split-sec">
                <div class="main-title">{c0}</div>
              </div>
            </div>

            `,
        position: 'top',
        padding: 0,
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
      series: [
        {
          label: {
            normal: {
              show: false,
              position: 'outside',
              color: '#202124',
              //textBorderColor: '#202124',
              //textBorderWidth: 1
            },
          },
          itemStyle: {
            normal: {
              color: barColor,
            },
          },
          data: xAxisData, //[120, 200, 150],
          type: 'bar',
          barWidth: '90%',
        },
      ],
    };
    if (Math.max(...xAxisData) > 5) {
      delete this.mostClickBar.xAxis.min;
      delete this.mostClickBar.xAxis.max;
    }
  }
  feedback() {
    // this.feedbackStats
    const colorPaletteSearch = ['#28A745', '#EAF6EC'];
    const colorPaletteResult = ['#FF784B', '#FFF1ED'];
    this.feedbackPieSearches = {
      series: [
        {
          type: 'pie',
          radius: 90,
          color: colorPaletteSearch,
          hoverAnimation: false,
          center: ['50%', '50%'],
          data: [
            this.feedbackStats.percentages.totalSearchesPercent,
            this.feedbackStats.percentages.feedbackReceivedPercent,
          ],
          label: {
            show: true,
            position: 'inner',
            formatter: (params) => {
              return params.percent ? params.percent + '%' : '';
            },
          },
        },
      ],
    };
    this.feedbackPieResult = {
      series: [
        {
          type: 'pie',
          radius: 90,
          color: colorPaletteResult,
          hoverAnimation: false,
          center: ['50%', '50%'],
          data: [
            this.feedbackStats.percentages.negativeFeedbackPercent,
            this.feedbackStats.percentages.postitiveFeedbackPercent,
          ],
          label: {
            show: true,
            position: 'inner',
            formatter: (params) => {
              return params.percent ? params.percent + '%' : '';
            },
          },
        },
      ],
    };
  }
  ngOnDestroy() {
    this.searchConfigurationSubscription
      ? this.searchConfigurationSubscription.unsubscribe()
      : false;
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
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}
