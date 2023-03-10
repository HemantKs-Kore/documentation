import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
// import { EChartOption } from 'echarts';
import { Options } from 'ng5-slider';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { NGB_DATEPICKER_18N_FACTORY } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-i18n';
import { style } from '@angular/animations';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  selectIndexPipelineId,
  selectIndexPipelines,
  selectQueryPipelineId,
  selectSearchIndexId,
} from '@kore.apps/store/app.selectors';
import { combineLatest, Subscription } from 'rxjs';
declare const $: any;
@Component({
  selector: 'app-user-engagement',
  templateUrl: './user-engagement.component.html',
  styleUrls: ['./user-engagement.component.scss'],
})
export class UserEngagementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  sub: Subscription;
  indexPipelineId;
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
  selecteddropname: any;
  indexConfigs: any = [];
  indexConfigObj: any = {};
  selecteddropId: any;
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

  /**slider */
  durationRange1 = 0;
  durationRange2 = 24;
  durationOptions: Options = {
    floor: 0,
    ceil: 24,
  };

  messagesRange1 = 5;
  messagesRange2 = 20;
  messagesOptions: Options = {
    floor: 0,
    ceil: 30,
  };

  tasksRange1 = 2;
  tasksRange2 = 5;
  tasksOptions: Options = {
    floor: 0,
    ceil: 20,
  };

  ranges = {
    duration: ['0-10', '10-20', '20-100'],
    msgCount: ['1-5', '5-10', '10-100'],
    taskCount: ['0-10', '10-20', '20-100'],
  };
  type = '';
  refElement: any;
  componentType = 'addData';
  @Output() updatedRanges = new EventEmitter();
  /**slider */
  maxHeatValue = 0;
  minHeatValue = 0;
  group = 'hour'; // hour , date , week
  dateType = 'week';
  usersBusyChart: any;
  usersChart: any;
  mostUsedDev_bro_geo_sen: any;
  topQuriesWithNoResults: any;
  mostSearchedQuries: any = {};
  queriesWithNoClicks: any;
  searchHistogram: any;
  heatMapChartOption: any;
  feedbackPieSearches: any;
  feedbackPieResult: any;
  mostUsedDeviceBar: any;
  chartOption: any;
  chartOption1: any;
  mostUsedBrowserBar: any;
  userEngagementChartData: any;
  geoBar: any;
  sentimentsBar;
  isAsc = true;
  slider = 1;
  totalUser = 0;
  totalUserProgress = 0;
  newUser = 0;
  newUserProgress = 0;
  repeatUser = 0;
  repeatUserProgress = 0;
  highValue = 24;
  lowValue = 0;
  isyAxismostUsedBrowserdata = false;
  isyAxisGeodata = false;
  startDate: any = moment().subtract({ days: 6 });
  endDate: any = moment();
  minDate: any = moment().subtract({ days: 95 });
  maxDate: any = moment();
  defaultSelectedDay = 7;
  showDateRange = false;
  busyHour_dataDIV: any = '';
  selected: { startDate: Moment; endDate: Moment } = {
    startDate: this.startDate,
    endDate: this.endDate,
  };
  @ViewChild(DaterangepickerDirective, { static: true })
  pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initAppIds();
    // this.selectedApp = this.workflowService?.selectedApp();
    // this.serachIndexId = this.selectedApp?.searchIndexes[0]._id;
    // this.getIndexPipeline();
    //this.getAllgraphdetails()

    //this.mostClick();
    //this.feedback();

    // this.getQueries("SearchHistogram");
  }

  initAppIds() {
    this.sub = combineLatest([
      this.store.select(selectIndexPipelineId),
      this.store.select(selectSearchIndexId),
      // this.store.select(selectQueryPipelineId),
    ]).subscribe(([indexPipelineId, searchIndexId]) => {
      // this.queryPipelineId = queryPipelineId;
      this.serachIndexId = searchIndexId;
      this.indexPipelineId = indexPipelineId;

      this.getIndexPipeline();
    });
  }

  getIndexPipeline() {
    const selectedDefaultIndexSub = this.store
      .select(selectIndexPipelines)
      .subscribe((res) => {
        this.indexConfigs = res;

        if (res.length) {
          const selectedIndexConfigId = res.find((item) => item.default)?._id;
          this.getAllgraphdetails(selectedIndexConfigId);
        }
      });

    this.sub?.add(selectedDefaultIndexSub);
  }

  getAllgraphdetails(selectedindexpipeline) {
    this.selecteddropId = selectedindexpipeline;
    this.getuserCharts('UsersChart', selectedindexpipeline);
    this.getuserCharts('UsersBusyChart', selectedindexpipeline);
    this.getuserCharts('MostUsedDevices', selectedindexpipeline);
    this.getuserCharts('MostUsedBrowsers', selectedindexpipeline);
    this.getuserCharts('MostUsedGeoLocations', selectedindexpipeline);
    //this.getuserCharts("MostUsersSentiments",selectedindexpipeline); /** Commenting to reduce the Call can be used later  */
  }
  // getDetails(config?){
  //   this.selecteddropname=config.name;
  //   this.selectedIndexConfig=config._id;
  //   this.getAllgraphdetails(config._id);
  // }

  toCapitalize(str) {
    if (str !== 'ie') {
      return str.replace(/\w\S*/g, (w) =>
        w.replace(/^\w/, (c) => c.toUpperCase())
      );
    } else {
      return str.toUpperCase();
    }
  }
  //SLider
  onUserChangeEnd(rangeType: string, $event, parentClass) {
    //console.log(rangeType,$event,parentClass)
    //this.removeTooltip(parentClass);
    // const endRange = rangeType === 'duration' ? this.ranges.duration[this.ranges.duration.length -1] : rangeType === 'taskCount' ? 30 : 20;
    // this.ranges[rangeType] = [`0-${$event.value}`, `${$event.value}-${$event.highValue}`, `${$event.highValue}-${endRange}`]
    // let floor = 0;
    // let ceil = 0;
    // switch (rangeType) {
    //   case 'duration':
    //     floor = +this.durationOptions.floor;
    //     ceil = +this.durationOptions.ceil;
    //     break;
    //   case 'msgCount':
    //     floor = +this.messagesOptions.floor;
    //     ceil = +this.messagesOptions.ceil;
    //     break;
    //   case 'taskCount':
    //     floor = +this.tasksOptions.floor;
    //     ceil = +this.tasksOptions.ceil;
    //     break;
    // }
    // this.ranges[rangeType] = [];
    // if ($event.value !== floor) { this.ranges[rangeType].push(`${floor}-${$event.value}`) }
    // if ($event.value !== $event.highValue) { this.ranges[rangeType].push(`${$event.value}-${$event.highValue}`) }
    // if ($event.highValue !== ceil) { this.ranges[rangeType].push(`${$event.highValue}-${ceil}`) }
    // this.updatedRanges.emit({ sessionType: this.type, ranges: this.ranges });
  }
  onUserChange(event, parentClass, multiple?) {
    // this.appendToolTip(event, parentClass, multiple);
    //console.log(multiple,event,parentClass)
    const hourConversion = [
      '1 am',
      '2 am',
      '3 am',
      '4 am',
      '5 am',
      '6 am',
      '7 am',
      '8 am',
      '9 am',
      '10 am',
      '11 am',
      '12 pm',
      '1 pm',
      '2 pm',
      '3 pm',
      '4 pm',
      '5 pm',
      '6 pm',
      '7 pm',
      '8 pm',
      '9pm',
      '10 pm',
      '11 pm',
      '0 am',
    ];
    this.highValue = event.highValue;
    this.lowValue = event.value;
    this.busyHours();
    // document.getElementsByClassName('ng5-slider-model-value')[0].innerHTML = hourConversion[event.value];
    // document.getElementsByClassName('ng5-slider-model-high')[0].innerHTML = hourConversion[event.highValue];
  }
  openDateTimePicker(e) {
    setTimeout(() => {
      this.pickerDirective.open(e);
    });
  }
  onDatesUpdated($event) {
    if ($event.startDate || $event.endDate) {
      this.startDate = this.selected.startDate;
      this.endDate = this.selected.endDate;
      this.dateLimt('custom');
    }
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
      // this.dateLimt('custom')
    } else if (range === 7) {
      this.startDate = moment().subtract({ days: 6 });
      this.endDate = moment();
      this.dateLimt('week');
      // this.callFlowJourneyData();
      this.showDateRange = false;
    } else if (range === 1) {
      this.startDate = moment().subtract({ hours: 23 });
      this.endDate = moment();
      this.dateLimt('hour');
      // this.callFlowJourneyData();
      this.showDateRange = false;
    }

    this.selected = { startDate: this.startDate, endDate: this.endDate };
  }

  appendToolTip(event, parentClass, multiple?) {
    // let value;
    // if (event.pointerType == 1) {
    //   this.refElement = 'ng5-slider-pointer-max';
    //   value = event.highValue;
    // }
    // else {
    //   this.refElement = 'ng5-slider-pointer-min';
    //   value = event.value;
    // }
    // let elementCollection = document.getElementsByClassName(this.refElement);
    // for (let i = 0; i <= elementCollection.length; i++) {
    //   if (elementCollection[i]) {
    //     if (elementCollection[i] && elementCollection[i].parentElement.className.includes(parentClass)) {
    //       // console.log("message true",  elementCollection[i],  elementCollection[i].parentElement.className);
    //       var node = document.createElement("SPAN");                 // Create a <span> node
    //       let element: any = document.getElementsByClassName(this.refElement)[i];
    //       while (element.firstChild) {
    //         element.removeChild(element.firstChild);
    //       }
    //       var testnode = document.createTextNode(value);
    //       node.appendChild(testnode);
    //       element.appendChild(node);
    //     }
    //   }
    // }
  }
  //SLider
  tab(index) {
    this.slider = index;
    if (index == 2) {
      this.pageLimit = 10;
    }
  }
  paginate(event) {
    console.log(event);
  }
  dateLimt(type) {
    this.dateType = type;
    const selectedindexpipeline = this.selecteddropId;
    if (selectedindexpipeline) {
      this.getuserCharts('UsersChart', selectedindexpipeline);
      this.getuserCharts('UsersBusyChart', selectedindexpipeline);
      this.getuserCharts('MostUsedDevices', selectedindexpipeline);
      this.getuserCharts('MostUsedBrowsers', selectedindexpipeline);
      this.getuserCharts('MostUsedGeoLocations', selectedindexpipeline);
      // this.getuserCharts("MostUsersSentiments",selectedindexpipeline); /** Commenting to reduce the Call can be used later  */
    }
  }

  getuserCharts(type, selectedindexpipeline?) {
    const today = new Date();
    const yesterday = new Date(Date.now() - 864e5);
    const week = new Date(Date.now() - 6 * 864e5);
    const custom = new Date(Date.now() - 29 * 864e5);
    let from: any; //new Date();
    if (this.dateType == 'hour') {
      from = yesterday;
      this.group = 'hour';
    } else if (this.dateType == 'week') {
      from = week;
      this.group = 'date';
    } else if (this.dateType == 'custom') {
      from = custom;
      const duration = moment.duration(
        Date.parse(this.endDate.toJSON()) - Date.parse(this.startDate.toJSON()),
        'milliseconds'
      );
      const days = duration.asDays();
      console.log(days);
      if (days > 28) {
        this.group = 'week';
      } else if (days == 1) {
        this.group = 'hour';
      } else {
        this.group = 'date';
      }
    }
    let startDateRandom = '';
    let endDateRandom = '';
    if (this.dateType == 'week' || this.dateType == 'custom') {
      if (
        this.startDate.toJSON() &&
        this.startDate.toJSON().split('.').length &&
        this.startDate.toJSON().split('.')[0].split('T')
      )
        startDateRandom =
          this.startDate.toJSON().split('.')[0].split('T')[0] +
          'T' +
          '00:00:00.' +
          this.startDate.toJSON().split('.')[1];
    } else {
      startDateRandom = this.startDate.toJSON();
      endDateRandom = this.endDate.toJSON();
    }
    const header: any = {
      'x-timezone-offset': '-330',
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId, //'sidx-e91a4194-df09-5e9c-be4e-56988e984343',
      indexPipelineId: selectedindexpipeline,
      offset: 0,
      limit: this.pageLimit,
    };
    const payload = {
      type: type,
      filters: {
        from: startDateRandom, //this.startDate.toJSON(),//from.toJSON(),
        to: this.endDate.toJSON(),
      },
      group: this.group, //this.group//"hour - 24 /date - 7 /week - coustom if time > 30 days"
    };

    this.service.invoke('get.userChart', quaryparms, payload, header).subscribe(
      (res) => {
        if (type == 'UsersChart') {
          if (
            this.group == 'date' ||
            this.group == 'hour' ||
            this.group == 'week'
          ) {
            // for 7 days
            this.usersChart = res.UsersChart;
            this.totalUser = res.totalUsers;
            this.totalUserProgress = res.increaseInNewUsers;
            this.newUser = res.newUsers;
            this.newUserProgress = res.increaseInUsers;
            this.repeatUser = res.repeatedUsers;
            this.repeatUserProgress = res.increaseInRepeatedUsers;
          }
          this.userEngagementChart();
        } else if (type == 'UsersBusyChart') {
          if (
            this.group == 'date' ||
            this.group == 'hour' ||
            this.group == 'week'
          ) {
            this.usersBusyChart = res.totalUsersChart;
          }
          this.busyHours();
        } else if (type == 'MostUsedDevices') {
          this.mostUsedDev_bro_geo_sen = res.results;
          this.mostUsedDevice();
        } else if (type == 'MostUsedBrowsers') {
          this.mostUsedDev_bro_geo_sen = res.results;
          this.mostUsedBrowser();
        } else if (type == 'MostUsedGeoLocations') {
          this.mostUsedDev_bro_geo_sen = res.results;
          this.geo();
        } else if (type == 'MostUsersSentiments') {
          this.mostUsedDev_bro_geo_sen = res.results;
          this.sentiments();
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
  getQueries(type) {
    const today = new Date();
    const yesterday = new Date(Date.now() - 864e5);
    const header: any = {
      'x-timezone-offset': '-330',
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      offset: 0,
      limit: this.pageLimit,
    };
    const payload: any = {
      type: type,
      filters: {
        from: yesterday.toJSON(),
        to: today.toJSON(),
      },
    };
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

  summaryChart() {
    const totaldata = [];
    this.totalSearchSum = 0;
    for (let i = 0; i < this.searchHistogram.length; i++) {
      totaldata.push([
        i + 'hr',
        this.searchHistogram[i].totalSearches,
        this.searchHistogram[i].searchesWithResults,
        this.searchHistogram[i].searchesWithClicks,
      ]);
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
  }
  userEngagementChart() {
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
    const xAxisData = [];
    const yAxisRepeatUser = [];
    const yAxisNewUsers = [];
    let splitNumber = 1;
    if (this.group == 'date') {
      // 7 days
      this.usersChart.forEach((element) => {
        const date = new Date(element.date);
        xAxisData.push(date.getDate() + ' ' + monthNames[date.getMonth()]);
        yAxisRepeatUser.push(element.repeatedUsers);
        yAxisNewUsers.push(element.newUsers);
      });
    }
    if (this.group == 'hour') {
      // 24 hours
      this.usersChart.forEach((element, index) => {
        if (index >= 0 && index <= 24) {
          xAxisData.push(index + 1 + 'hr');
          yAxisRepeatUser.push(element.repeatedUsers);
          yAxisNewUsers.push(element.newUsers);
        }
      });
    }
    if (this.group == 'week') {
      // custom
      this.usersChart.forEach((element, index) => {
        const date = new Date(element.date);
        xAxisData.push(date.getDate() + ' ' + monthNames[date.getMonth()]);
        yAxisRepeatUser.push(element.repeatedUsers);
        yAxisNewUsers.push(element.newUsers);
      });
    }
    const sumArray = [];
    yAxisRepeatUser.forEach((element, index) => {
      sumArray.push(element + yAxisNewUsers[index]);
      // console.log(element , yAxisNewUsers[index] , element + yAxisNewUsers[index])
    });
    if (Math.max(...sumArray) < 5) {
      splitNumber = Math.max(...sumArray) + 1;
    } else {
      splitNumber = 5;
    }

    this.userEngagementChartData = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter: (params) => `
        <div class="metrics-tooltips-hover userengagment-tooltip">
        <div class="data-content">
            <div class="main-title">Total Users</div>
            <div class="title total">${params[0].value + params[1].value}</div>
        </div>
        <div class="data-content">
            <div class="main-title">New Users</div>
            <div class="title new">${params[1].value}</div>
        </div>
        <div class="data-content border-0">
            <div class="main-title">Return Users</div>
            <div class="title return">${params[0].value}</div>
        </div>
    </div>
        `,
        position: 'top',
        padding: 0,
      },

      grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        data: xAxisData, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] //data//
        axisLabel: {
          //margin: 20,
          color: '#9AA0A6',
          fontWeight: 'normal',
          fontSize: 12,
          fontFamily: 'Inter',
        },
        nameLocation: 'left',
        nameGap: 50,
      },
      yAxis: {
        type: 'value',
        name: 'Number of Users',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: 5,
        // minInterval: 2,
        nameTextStyle: {
          color: '#9AA0A6',
          fontWeight: 'normal',
          fontSize: 12,
          fontFamily: 'Inter',
        },
        //splitNumber: splitNumber,
        axisLabel: {
          //margin: 20,
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
      },
      series: [
        //barMinWidth = 10;
        {
          name: 'bottom',
          type: 'bar',
          stack: '总量',
          // label: {
          //     show: true,
          //     position: 'insideRight'
          // },
          barWidth: 10,
          itemStyle: {
            normal: {
              color: '#FF784B',
              barBorderRadius: [0, 0, 50, 50],
            },
          },
          data: yAxisRepeatUser,
        },
        {
          name: 'top',
          type: 'bar',
          stack: '总量',
          // label: {
          //     show: true,
          //     position: 'insideRight'
          // },
          barWidth: 10,
          itemStyle: {
            normal: {
              color: '#0D6EFD',
              barBorderRadius: [50, 50, 0, 0],
            },
          },
          lineStyle: {
            color: '#0D6EFD',
          },
          data: yAxisNewUsers,
        },
      ],
    };
    if (Math.max(...sumArray) > 5) {
      delete this.userEngagementChartData.yAxis.min;
      delete this.userEngagementChartData.yAxis.max;
    }
  }
  checkAxis(y_axis, data, graphData) {
    graphData = [];
    data.forEach((element) => {
      if (!element.name) {
        element.name = 'Null';
      }
      y_axis.forEach((y, index) => {
        // if(element.name){
        if (
          y.charAt(0).toLowerCase() + y.slice(1) ==
          element.name.charAt(0).toLowerCase() + y.slice(1)
        ) {
          // y = element.name.charAt(0).toUpperCase() + element.name.slice(1)
          if (graphData.length != y_axis.length) {
            graphData.push(element.percentOfUsers);
          }
        } else {
          if (graphData.length != y_axis.length) {
            graphData.push('');
          }
        }
        //}
        // else{
        //   graphData.push('')
        // }
      });
    });
    return graphData;
  }
  mostUsedDevice() {
    const graphData = [];
    const y_axis = ['Desktop', 'Tablet', 'Mobile'];
    //this.checkAxis(y_axis,this.mostUsedDev_bro_geo_sen,graphData)
    //console.log(this.checkAxis(y_axis,this.mostUsedDev_bro_geo_sen,graphData))
    // this.mostUsedDev_bro_geo_sen.forEach(element => {
    //   y_axis.forEach(y => {
    //     if(y == element.name){
    //       y = element.name;
    //       graphData.push(element.percentOfUsers);
    //     }else{
    //       graphData.push('')
    //     }
    //   });

    // });
    this.mostUsedDeviceBar = {
      // tooltip: {
      //   trigger: 'axis',
      //   axisPointer: {
      //     type: 'none'
      // },
      //   formatter:  (params) => `
      //       <div class="metrics-tooltips-hover userengagment-tooltip">
      //       <div class="data-content">
      //           <div class="main-title">Total Users</div>
      //           <div class="title total">${params[0].value + params[1].value}</div>
      //       </div>
      //       <div class="data-content">
      //           <div class="main-title">New Users</div>
      //           <div class="title new">${params[1].value}</div>
      //       </div>
      //       <div class="data-content border-0">
      //           <div class="main-title">Repeat Users</div>
      //           <div class="title return">${params[0].value}</div>
      //       </div>
      //   </div>
      //   `,
      //   position: 'top',
      //   padding: 0

      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter: `
              <div class="metrics-tooltips-hover agent_drop_tolltip">
              <div class="">
                <div class="main-title">{c0} Users are using </div>
                <div class="main-title">{b0} to search</div>
              </div>
            </div>

            `,
        position: 'top',
        padding: 0,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} %',
        },
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        // name: "Number  of  Clicks"
      },
      yAxis: {
        type: 'category',
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        data: y_axis, //['Desktop_Image', 'Tablet_Image', 'Mobile_Image'],
        inverse: true,
        axisLabel: {
          formatter: function (value) {
            return '{' + value + '| }\n{value|' + '' + '}';
          },
          rich: {
            value: {
              lineHeight: 30,
              align: 'center',
            },
            Desktop: {
              height: 40,
              align: 'center',
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAxCAMAAABNqRFUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACrUExURQAAACAgIGBgYGNjayAgIFhgaGBgaCAgJWBlZSAgJGBkaCAgI2BjZiAjIyAgIyAgJV1iaF5jZyAgJF1iaWBiaWBkaSAiJF5iaCAgJF5iaCAgJCAiJCAgI15haCAiIyAiJV9jaCAgIyAgJCAiJF9jZyAgJCAgJCAhJF9jaCAgJCAgJCAhJF9jZ19jaSAgIyAhIyAhJV9iaF9jaCAhJF9iZ19jZ19jaSAhJF9jaF68u5EAAAA3dFJOUwAQEB8gICAwMEBAUFBfYGBgb3BwcHB/f4CAj4+QkJ+fn6Cvr6+wv7+/wM/Pz8/f39/f3+/v7+9s2eW/AAABYUlEQVRIx+3U3VLbMBCG4Vd0wRUiduvQVCQGQygsoLaiccC5/yvjwBASJ+CSmXCU78Qzq3nGq59ZeM7Ph1ln+rTz789JVyaTVXVOV252aqd2akP1a78r61T3AJh9kjo63ESd9jfu8PeKOp52oukPtpCv88l58AH1bd7V4X+K7+2BP+l3o73VU3jsVgdrDu8Lu2whqaoOpV0dJgDIW8rfWpvFvFVVu/hZo0pAKgNZORQwgzIFtRgvWSzdSz1LBmW6rFDH6NL5aIjeao5agicJuTAILguC3uXutaVGXaQSgXFqamlaO/NNh6YW8AWag71fVmNnK1WNHl9rChor0ygbAHfVbLFu7UuSICJiAHtZoLnXRsn9s3JgllQSCogJlCIjyK5Ri45g7CD0MCFFFQblXNV1/TcHkqjVBRQxxAS1mNgjrUskauVBixCu192fGACztGRe6mqNfPwNvXnh7yZb+NMTH4RuKyAScm4AAAAASUVORK5CYII=',
              },
            },

            Tablet: {
              height: 40,
              align: 'center',
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAsCAMAAAAgsQpJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACHUExURQAAACAgICEhISAgIGBgaCAgJSAgJCAgIyAgIyAgJV1gaF1iaGBiaCAgJCAiJF5kaCAgJCAgJCAgI15haF5jaGBjaCAgIyAiIyAiJV9jaCAgI15jaCAgJCAiJF9jZ15jZyAhJF9jaCAhJF9jZyAhIyAhJV9iaF9jaCAhJF9iZ19jZyAhJF9jaAjeyywAAAArdFJOUwAQHyAgMEBQYGBgYGBwf3+Aj5CQkJCfn5+foKCvr6+wv7/Pz9/f39/v7+/RD+HEAAABG0lEQVQ4y+2Tb1eDIBTGIdwVK5bRP3SxGJG6ze//+bpep2W2aefUm+p5AQ/w4164HBhDRdmuPqFdFjFSVNYTKlsyqyeVEfhM/okd0y2GJFO82/SZLn4peHe5mgU2JSzmgGtsylmps/P1Hyz4l8DNUfCqA2/mfoWomOKK7huutqew7SZi//o2gSOdHUYpddz266I3AF4DHEaJaSdfetDBW1AnsVlcG9mAiZGcQL6kiWDiASgqBV6ypNJx7ggMGvIHtvBKDCMKypt4tB4QjJtDVHycemlDMO0Zc4lgGvCKFYzAxAqK2ICPMYLKCNQ4osa63CNYCSb2AkEI6HCbi4egCM5bBG3wQdJlUu+CYkzt9YfKY5pB3znOf+alXwEB8Uul/UsUGwAAAABJRU5ErkJggg==',
              },
            },
            Mobile: {
              height: 40,
              align: 'center',
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAA2CAMAAABpy5C3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC3UExURQAAACAgIGBgYCEhIWNjayAgIGBgaCAgJWBgZSAgJFxgaGBkaCAgI1xgaSAgIyAgJV1iaGBiaCAiJSAgJF1iaWBiZmBkZmBkaSAiJF5iaCAgJF5iaGBkaCAgJCAiJF9iaV9kZyAgI15jaGBjaCAgIyAiJV9jaCAgI15jaCAgJCAiJF9jZyAgJF5jZyAgJCAhJF9jaCAhJF9jZ19jaSAgIyAhIyAhJV9iaF9jaCAhJF9jZyAhJF9jaBQCQ50AAAA7dFJOUwAQEB8fICAwMEBAQFBQYGBgYG9wcHBwcH9/gICAj4+Pj5CQkJ+fn6Cgr6+vsLC/v7/Pz8/f39/f3+/vWU6buQAAAVJJREFUSMft1NtSgzAQBuBNa6xbEKt4TFu1B+xJCdVGTMn7P5dLaGGkmc54oVf8F2yyfBMSLgJQ5SE19Xz0wJknk9RxkphnF+2aAbS2BCae521vxjRKAcbmzGF7efedxEu3e/51vaLRW75Cz2lPAPo/tnB51LbmaZUBHLWOUzS2sY1t7G+s57wSX8yp66Kcm1W/nsRM3Bfw7eFdnd5Bk3+MRFuWwb7RebSF6Q7Ims1sAzOxb2BcVJ9BVrea0XOqyPJhFOQWoyEHCK1l91FQWZErRU+uQlQhoFr6QjHYtHOrRjgrt5IxWvgiIjulBbgG1NRdhIX1X2lCo50F6YPiZO0pN22733BUWKGklBpLi9KPgezCp6lm+EmFptaGEaew0sJaBflLsQS4iumXIDCFheWaA4+gskLZhWCk1jGn/zCTWsDubMFa0nkdYbyo5UcPJn+Qb9pcRrcxvvbzAAAAAElFTkSuQmCC',
              },
            },
          },
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
              color: '#7027E5',
            },
          },
          data: [100, 0, 50], //graphData,//[120, 200, 150],
          type: 'bar',
        },
      ],
    };
  }
  mostUsedBrowser() {
    let graphData = [];
    const gridWidth = '0%';
    let minHeight = 40;
    const mostUsedBrowserNumberOfuserObj = {};
    let y_axis = [];
    let barColor = '#FF784B';
    y_axis = this.mostUsedDev_bro_geo_sen
      .filter(function (e) {
        return e.name;
      })
      .map(function (g) {
        if (g.name !== 'ie') {
          return g.name.replace(/\w\S*/g, (w) =>
            w.replace(/^\w/, (c) => c.toUpperCase())
          );
        } else {
          return g.name.toUpperCase();
        }
      });
    //let y_axis = ['Chrome','IE','Safari'];
    //this.checkAxis(y_axis,this.mostUsedDev_bro_geo_sen,graphData)
    //console.log(this.checkAxis(y_axis,this.mostUsedDev_bro_geo_sen,graphData))
    this.mostUsedDev_bro_geo_sen.forEach((element) => {
      y_axis.forEach((y) => {
        const name = element.name ? this.toCapitalize(element.name) : '';
        if (y == name) {
          y = name || '';
          element.name = name;
          graphData.push(element.percentOfUsers);
          mostUsedBrowserNumberOfuserObj[name] = element.usersCount;
        } else {
          // graphData.push('')
        }
      });
    });
    if (graphData.length > 0) {
      this.isyAxismostUsedBrowserdata = true;
      barColor = '#FF784B';
      if (graphData.length > 0 && graphData.length < 4) {
        minHeight = 40;
      } else if (graphData.length > 3 && graphData.length < 6) {
        minHeight = 20;
      } else {
        minHeight = 10;
      }
    } else {
      y_axis = ['Chrome', 'Safari', 'IE'];
      graphData = [82, 9, 9];
      this.isyAxismostUsedBrowserdata = false;
      barColor = '#EFF0F1';
    }

    // if(y_axis.length == 1){
    //   y_axis.push("");
    //   y_axis.push("");
    //   y_axis.reverse();
    //   graphData.push("");
    //   graphData.push("");
    //   graphData.reverse();

    // }
    //   <div class="metrics-tooltips-hover agent_drop_tolltip">
    //   <div class="split-sec">
    //     <div class="main-title">{c0} Users are using {b0} to search</div>
    //   </div>
    // </div>
    this.mostUsedBrowserBar = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter: (params) => `
        <div class="metrics-tooltips-hover agent_drop_tolltip">
        <div class="">
          <div class="main-title">${
            mostUsedBrowserNumberOfuserObj[params[0].axisValue]
          } Users in</div>
          <div class="main-title">${params[0].axisValue} to search</div>
        </div>
      </div>
        `,
        // formatter: `
        //   <div class="metrics-tooltips-hover agent_drop_tolltip ">
        //   <div class="">
        //     <div class="main-title">{c0} Users are using </div>
        //     <div class="main-title">{b0} to search</div>
        //   </div>
        // </div>

        // `,
        position: 'top',
        padding: 0,
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value} %',
        },
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        // name: "Number  of  Clicks"
      },
      yAxis: {
        type: 'category',
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        data: y_axis, //['Chrome', 'Safari', 'IE'],
        inverse: true,
        axisLabel: {
          formatter: function (value) {
            if (value != '') {
              return '{' + value + '| }\n{value|' + value + '}';
            } else {
              return '';
            }
          },
          rich: {
            value: {
              lineHeight: 30,
              align: 'center',
            },
            Chrome: {
              height: minHeight,
              align: 'center',
              backgroundColor: {
                image: 'assets/icons/chrome_logo.svg',
                // <img *ngIf ="actLog.selected" src="assets/icons/chrome_logo.png" class="ml-8" >
                //image: 'data:image/png;base64,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'
              },
            },
            Safari: {
              height: minHeight,
              align: 'center',
              backgroundColor: {
                image: 'assets/icons/safari_logo.svg',
                //image:'data:image/png;base64,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'
              },
            },
            IE: {
              height: minHeight,
              align: 'center',
              backgroundColor: {
                image: 'assets/icons/ie_logo.svg',
                //image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAZCAYAAACo79dmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAM5SURBVHgB7ZddUtpQFMfPCWjwoyPdQZx2OtSXpjvAx+q0wgrEFVRXoK4AXIG4AmA66KO4AnlSWtshroDMVEUjuafnBiMhCQglTmc6/maA+5V7/5x7zrk3AC88DwgRkvr2Ow2KkkagJAGaiKTZHSz/+DJXhgiIRKwrEoCMW2uubGTRfOyrXu/cWlbByL42YULiow5MldoaqnaGMPYBCTQWpgFBVwBCkkjsgnVf8wqV2EDlmenkAhcnFvukZZeqLZ0wkWdxaRgB3vriza215VpyqXqln63O1yEClGGdqaP2OqF66golgBr/DPU/IszNqOppqtTSZF1YsYkt6jLQsu8OrzMxwNJD1eDt3IojrEkxMAoE9bZ1txyFr7qE+mzqqKUhYf6hWkb2xxgo+2xZnSPdFAR7MpiQfRUI13nv9cAkCPqcqm5zaQsGoGlaEjBeQrBzzWbzUlt8exwYRHRgGL+KA8WCmErzYiyYdoVi8UBVTqI5XXfKx0Z2xvCMLrw/vJE7kAlMA7CplVq7Q6yb5E/aU+d1scgPnvSa8NHfQ8Ui4Fcp9IZTjvQ/Vyj31OS3zAx948muECqZsLkS01OyvQijIsSJa0k/AbF6qZW0ACpnq3M7bLF8T6iE0qhC0/8MDYlTDgodIiLUslJoqnqV4+ImTAgpsYWxHkDMa4tvtj0TZA3jwnGFgNg6+1c3wJTt4MpQJ6AKjIHo0Hg5lgOKFXvS473hlgacYIl154Tyg2g2VmZ3/M3yzzlBGYJl39dgPOqG8bMW1hEPW5iDKwehUFreAxqfX9W8rQpN5wkxLMCMBCTk2DFyrbLAKU3zNJiGYZihYt20NWgqjMVKS0fXZSHoxMmzEFujwUfxni/NPQ1SgWUVenVOZQAbTtE/NnXYPkZnccHJXMnDXyMOzlfmcxAhfTnHcQFHKNZ4oYIYcvoMJ3qhkv4E2Ylr3UI34r+vzBbYFxfp4TB4CnkU81Vx4zmESvp81lbQ9Dtx45Pjc8t8A+OIFzn2mzU+rUzsZYs63xUuUdjlc1/gRU3AZ/nUaspLdQfExgXfQ/lsTybicd19E2iszhfhHxEMMGlBgn2v5XhrK/7XlRf+J/4AZ2hd+H+2OEcAAAAASUVORK5CYII='
              },
            },
            Opera: {
              height: minHeight,
              align: 'center',
              backgroundColor: {
                image: 'assets/icons/opera_logo.svg',
                //image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAZCAYAAACo79dmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAM5SURBVHgB7ZddUtpQFMfPCWjwoyPdQZx2OtSXpjvAx+q0wgrEFVRXoK4AXIG4AmA66KO4AnlSWtshroDMVEUjuafnBiMhCQglTmc6/maA+5V7/5x7zrk3AC88DwgRkvr2Ow2KkkagJAGaiKTZHSz/+DJXhgiIRKwrEoCMW2uubGTRfOyrXu/cWlbByL42YULiow5MldoaqnaGMPYBCTQWpgFBVwBCkkjsgnVf8wqV2EDlmenkAhcnFvukZZeqLZ0wkWdxaRgB3vriza215VpyqXqln63O1yEClGGdqaP2OqF66golgBr/DPU/IszNqOppqtTSZF1YsYkt6jLQsu8OrzMxwNJD1eDt3IojrEkxMAoE9bZ1txyFr7qE+mzqqKUhYf6hWkb2xxgo+2xZnSPdFAR7MpiQfRUI13nv9cAkCPqcqm5zaQsGoGlaEjBeQrBzzWbzUlt8exwYRHRgGL+KA8WCmErzYiyYdoVi8UBVTqI5XXfKx0Z2xvCMLrw/vJE7kAlMA7CplVq7Q6yb5E/aU+d1scgPnvSa8NHfQ8Ui4Fcp9IZTjvQ/Vyj31OS3zAx948muECqZsLkS01OyvQijIsSJa0k/AbF6qZW0ACpnq3M7bLF8T6iE0qhC0/8MDYlTDgodIiLUslJoqnqV4+ImTAgpsYWxHkDMa4tvtj0TZA3jwnGFgNg6+1c3wJTt4MpQJ6AKjIHo0Hg5lgOKFXvS473hlgacYIl154Tyg2g2VmZ3/M3yzzlBGYJl39dgPOqG8bMW1hEPW5iDKwehUFreAxqfX9W8rQpN5wkxLMCMBCTk2DFyrbLAKU3zNJiGYZihYt20NWgqjMVKS0fXZSHoxMmzEFujwUfxni/NPQ1SgWUVenVOZQAbTtE/NnXYPkZnccHJXMnDXyMOzlfmcxAhfTnHcQFHKNZ4oYIYcvoMJ3qhkv4E2Ylr3UI34r+vzBbYFxfp4TB4CnkU81Vx4zmESvp81lbQ9Dtx45Pjc8t8A+OIFzn2mzU+rUzsZYs63xUuUdjlc1/gRU3AZ/nUaspLdQfExgXfQ/lsTybicd19E2iszhfhHxEMMGlBgn2v5XhrK/7XlRf+J/4AZ2hd+H+2OEcAAAAASUVORK5CYII='
              },
            },
            Firefox: {
              height: minHeight,
              align: 'center',
              backgroundColor: {
                image: 'assets/icons/firefox_logo.svg',
                //image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAZCAYAAACo79dmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAM5SURBVHgB7ZddUtpQFMfPCWjwoyPdQZx2OtSXpjvAx+q0wgrEFVRXoK4AXIG4AmA66KO4AnlSWtshroDMVEUjuafnBiMhCQglTmc6/maA+5V7/5x7zrk3AC88DwgRkvr2Ow2KkkagJAGaiKTZHSz/+DJXhgiIRKwrEoCMW2uubGTRfOyrXu/cWlbByL42YULiow5MldoaqnaGMPYBCTQWpgFBVwBCkkjsgnVf8wqV2EDlmenkAhcnFvukZZeqLZ0wkWdxaRgB3vriza215VpyqXqln63O1yEClGGdqaP2OqF66golgBr/DPU/IszNqOppqtTSZF1YsYkt6jLQsu8OrzMxwNJD1eDt3IojrEkxMAoE9bZ1txyFr7qE+mzqqKUhYf6hWkb2xxgo+2xZnSPdFAR7MpiQfRUI13nv9cAkCPqcqm5zaQsGoGlaEjBeQrBzzWbzUlt8exwYRHRgGL+KA8WCmErzYiyYdoVi8UBVTqI5XXfKx0Z2xvCMLrw/vJE7kAlMA7CplVq7Q6yb5E/aU+d1scgPnvSa8NHfQ8Ui4Fcp9IZTjvQ/Vyj31OS3zAx948muECqZsLkS01OyvQijIsSJa0k/AbF6qZW0ACpnq3M7bLF8T6iE0qhC0/8MDYlTDgodIiLUslJoqnqV4+ImTAgpsYWxHkDMa4tvtj0TZA3jwnGFgNg6+1c3wJTt4MpQJ6AKjIHo0Hg5lgOKFXvS473hlgacYIl154Tyg2g2VmZ3/M3yzzlBGYJl39dgPOqG8bMW1hEPW5iDKwehUFreAxqfX9W8rQpN5wkxLMCMBCTk2DFyrbLAKU3zNJiGYZihYt20NWgqjMVKS0fXZSHoxMmzEFujwUfxni/NPQ1SgWUVenVOZQAbTtE/NnXYPkZnccHJXMnDXyMOzlfmcxAhfTnHcQFHKNZ4oYIYcvoMJ3qhkv4E2Ylr3UI34r+vzBbYFxfp4TB4CnkU81Vx4zmESvp81lbQ9Dtx45Pjc8t8A+OIFzn2mzU+rUzsZYs63xUuUdjlc1/gRU3AZ/nUaspLdQfExgXfQ/lsTybicd19E2iszhfhHxEMMGlBgn2v5XhrK/7XlRf+J/4AZ2hd+H+2OEcAAAAASUVORK5CYII='
              },
            },
            Edge: {
              height: minHeight,
              align: 'center',
              backgroundColor: {
                image: 'assets/icons/edge_logo.svg',
                //image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAZCAYAAACo79dmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAM5SURBVHgB7ZddUtpQFMfPCWjwoyPdQZx2OtSXpjvAx+q0wgrEFVRXoK4AXIG4AmA66KO4AnlSWtshroDMVEUjuafnBiMhCQglTmc6/maA+5V7/5x7zrk3AC88DwgRkvr2Ow2KkkagJAGaiKTZHSz/+DJXhgiIRKwrEoCMW2uubGTRfOyrXu/cWlbByL42YULiow5MldoaqnaGMPYBCTQWpgFBVwBCkkjsgnVf8wqV2EDlmenkAhcnFvukZZeqLZ0wkWdxaRgB3vriza215VpyqXqln63O1yEClGGdqaP2OqF66golgBr/DPU/IszNqOppqtTSZF1YsYkt6jLQsu8OrzMxwNJD1eDt3IojrEkxMAoE9bZ1txyFr7qE+mzqqKUhYf6hWkb2xxgo+2xZnSPdFAR7MpiQfRUI13nv9cAkCPqcqm5zaQsGoGlaEjBeQrBzzWbzUlt8exwYRHRgGL+KA8WCmErzYiyYdoVi8UBVTqI5XXfKx0Z2xvCMLrw/vJE7kAlMA7CplVq7Q6yb5E/aU+d1scgPnvSa8NHfQ8Ui4Fcp9IZTjvQ/Vyj31OS3zAx948muECqZsLkS01OyvQijIsSJa0k/AbF6qZW0ACpnq3M7bLF8T6iE0qhC0/8MDYlTDgodIiLUslJoqnqV4+ImTAgpsYWxHkDMa4tvtj0TZA3jwnGFgNg6+1c3wJTt4MpQJ6AKjIHo0Hg5lgOKFXvS473hlgacYIl154Tyg2g2VmZ3/M3yzzlBGYJl39dgPOqG8bMW1hEPW5iDKwehUFreAxqfX9W8rQpN5wkxLMCMBCTk2DFyrbLAKU3zNJiGYZihYt20NWgqjMVKS0fXZSHoxMmzEFujwUfxni/NPQ1SgWUVenVOZQAbTtE/NnXYPkZnccHJXMnDXyMOzlfmcxAhfTnHcQFHKNZ4oYIYcvoMJ3qhkv4E2Ylr3UI34r+vzBbYFxfp4TB4CnkU81Vx4zmESvp81lbQ9Dtx45Pjc8t8A+OIFzn2mzU+rUzsZYs63xUuUdjlc1/gRU3AZ/nUaspLdQfExgXfQ/lsTybicd19E2iszhfhHxEMMGlBgn2v5XhrK/7XlRf+J/4AZ2hd+H+2OEcAAAAASUVORK5CYII='
              },
            },
          },
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
          data: graphData, //[120, 200, 150],
          type: 'bar',
          barWidth: '90%',
        },
      ],
    };
  }
  geo() {
    let graphData = [];
    let y_axis = []; //['US','India','UK','Japan'];
    const geoNumberOfuserObj = {};
    let barColor = '#93D3A2';
    y_axis = this.mostUsedDev_bro_geo_sen
      .filter(function (e) {
        return e.name;
      })
      .map(function (g) {
        return g.name;
      });
    //this.checkAxis(y_axis,this.mostUsedDev_bro_geo_sen,graphData)
    this.mostUsedDev_bro_geo_sen.forEach((element) => {
      y_axis.forEach((y) => {
        if (y == element.name) {
          y = element.name;
          graphData.push(element.percentOfUsers);
          geoNumberOfuserObj[element.name] = element.usersCount;
        } else {
          //graphData.push('')
        }
      });
    });
    if (!graphData.length) {
      y_axis = ['US', 'India', 'UK', 'Japan'];
      graphData = [10, 80, 5, 5];
      this.isyAxisGeodata = false;
      barColor = '#EFF0F1';
    } else {
      this.isyAxisGeodata = true;
      barColor = '#93D3A2';
    }

    // if(y_axis.length == 1){
    //   y_axis.push("");
    //   y_axis.push("");
    //   y_axis.reverse();
    //   graphData.push("");
    //   graphData.push("");
    //   graphData.reverse();

    // }
    this.geoBar = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        //<div class="title total">${params[0].value + params[1].value}</div>
        formatter: (params) => `
        <div class="metrics-tooltips-hover agent_drop_tolltip">
        <div class="">
          <div class="main-title">No. of Users : ${
            geoNumberOfuserObj[params[0].axisValue]
          } </div>
          <div class="main-title">Percentage of users :  ${
            params[0].data
          }% </div>
        </div>
      </div>
        `,
        // formatter: `
        //   <div class="metrics-tooltips-hover agent_drop_tolltip">
        //   <div class="split-sec">
        //     <div class="main-title">{c0} Users in {b0}</div>
        //   </div>
        // </div>

        // `,
        position: 'top',
        padding: 0,
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value} %',
        },
        axisLine: {
          show: false, // Hide full Line
        },
        axisTick: {
          show: false, // Hide Ticks,
        },
        // name: "Number  of  Clicks"
      },
      yAxis: {
        inverse: true,
        type: 'category',
        data: y_axis, //['US', 'India', 'UK'],
        //inverse: true,
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
          data: graphData, //[120, 200, 150],
          type: 'bar',
          barWidth: '90%',
        },
      ],
    };
  }
  sentiments() {
    const graphData = [];
    const y_axis = [];
    //this.checkAxis(y_axis,this.mostUsedDev_bro_geo_sen,graphData)
    this.mostUsedDev_bro_geo_sen.forEach((element) => {
      graphData.push(element.percentOfUsers);
      if (element.name) {
        y_axis.push(
          element.name.charAt(0).toUpperCase() + element.name.slice(1)
        );
      } else {
        y_axis.push('');
      }
    });
    this.sentimentsBar = {
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}',
        },
        // name: "Number  of  Clicks"
      },
      yAxis: {
        inverse: true,
        type: 'category',
        data: ['Angry', 'Disgust', 'Fear', 'Sad', 'Joy', 'Positive'], // y_axis, //['Angry', 'Disgust', 'Fear','Sad','Joy','Positive'],
        //inverse: true,
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
              color: '#28A745',
            },
          },
          data: graphData, //[120, 200, 150,500,120,150],
          type: 'bar',
        },
      ],
    };
  }

  busyHours() {
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
    const hourConversion = [
      '1 am',
      '2 am',
      '3 am',
      '4 am',
      '5 am',
      '6 am',
      '7 am',
      '8 am',
      '9 am',
      '10 am',
      '11 am',
      '12 pm',
      '1 pm',
      '2 pm',
      '3 pm',
      '4 pm',
      '5 pm',
      '6 pm',
      '7 pm',
      '8 pm',
      '9 pm',
      '10 pm',
      '11 pm',
      '0 am',
    ];
    const busyChartArrayData: any = [];
    const yAxisData = [];
    const xAxisData = [];
    let heatData = [[]];
    const toolTipData = [[]];
    const totalMaxValueArr = [];
    const start = this.lowValue; // 3
    const end = this.highValue; // 17
    let secondIndex = 0;
    let checkData = [];
    // For Dimensions
    const dimensions = [];
    dimensions.push('product');
    if (this.group == 'hour' || this.group == 'date' || this.group == 'week') {
      for (const property in this.usersBusyChart) {
        busyChartArrayData.push(this.usersBusyChart[property]);
        // let date =  property.split('-')[2];
        if (property.split('T').length > 1) {
          const splitData = property.split('T')[0];
          yAxisData.push(
            splitData.split('-')[2] +
              ' ' +
              monthNames[Number(splitData.split('-')[1]) - 1]
          );
          dimensions.push(
            splitData.split('-')[2] +
              ' ' +
              monthNames[Number(splitData.split('-')[1]) - 1]
          );
        } else {
          yAxisData.push(
            property.split('-')[2] +
              ' ' +
              monthNames[Number(property.split('-')[1]) - 1]
          );
          dimensions.push(
            property.split('-')[2] +
              ' ' +
              monthNames[Number(property.split('-')[1]) - 1]
          );
        }
        //  if(this.group == 'hour' || this.group == 'date') yAxisData.push(property.split('-')[2] + " " + monthNames[Number(property.split('-')[1]) - 1 ])
        //  if(this.group == 'week') yAxisData.push(property.split('-')[2] + " " + monthNames[Number(property.split('-')[1]) - 1 ])
        //console.log(`${property}: ${object[property]}`);
      }
      if (this.group == 'hour') {
        for (let a = start; a < end; a++) {
          xAxisData.push(hourConversion[a]);
          // toolTipData.push([hourConversion[a]])
        }
      }
      let checkIndex = 0;
      for (let i = 0; i < busyChartArrayData.length; i++) {
        for (let j = 0; j < busyChartArrayData[i].length; j++) {
          if (
            busyChartArrayData[i][j].hour >= start &&
            busyChartArrayData[i][j].hour <= end
          ) {
            // for 5 am to 5 pm
            // if(this.group == 'hour') xAxisData.push(hourConversion[busyChartArrayData[i][j].hour])
            if ((this.group == 'date' || this.group == 'week') && i == 0) {
              xAxisData.push(hourConversion[busyChartArrayData[0][j].hour]);
              //toolTipData.push([hourConversion[busyChartArrayData[0][j].hour]])
            }
            // console.log(toolTipData)
            heatData.push([
              i,
              secondIndex,
              busyChartArrayData[i][j].totalUsers,
            ]);
            if (i != checkIndex) {
              checkData = [];
              checkData.push([
                i,
                secondIndex,
                busyChartArrayData[i][j].totalUsers,
              ]);
            } else {
              checkData.push([
                i,
                secondIndex,
                busyChartArrayData[i][j].totalUsers,
              ]);
            }
            secondIndex = checkData.length - 1;
            checkIndex = i;
          }

          totalMaxValueArr.push(busyChartArrayData[i][j].totalUsers);
        }
      }
    }

    this.maxHeatValue = Math.max(...totalMaxValueArr);
    //this.minHeatValue = //Math.min(...totalMaxValueArr)
    heatData = heatData.map(function (item) {
      return [item[1], item[0], item[2] || '-'];
    });

    // For source
    const source = [];
    for (let i = start; i < end; i++) {
      const sourceObj = {};
      sourceObj['product'] = hourConversion[i];
      for (let a = 1; a < dimensions.length; a++) {
        // if((this.group == 'date' || this.group == 'week' )&&  i == 0){
        // }
        if (busyChartArrayData[a - 1]) {
          if (busyChartArrayData[a - 1][i]) {
            sourceObj[dimensions[a]] = busyChartArrayData[a - 1][i].totalUsers;
          } else {
            sourceObj[dimensions[a]] = 0; //'-'
          }
        } else {
          sourceObj[dimensions[a]] = 0; //'-'
        }
      }
      source.push(sourceObj);
    }
    // console.log(dimensions);
    // console.log(source);
    // console.log(heatData)

    // ${console.log( yAxisData[params[0].data[1]] , params[0].axisValue , params[0].data[2])}
    // ${params[0].value}
    // formatter: `
    // formatter:  (params) => `
    // <div class="indication_text">Number of total user is <b> ${ dimensions[5]} ${params[5].value[2]}</b></div>
    //           <div class="indication_text">Number of total user is <b>${ dimensions[4]}  ${params[4].value[2]}</b></div>
    //           <div class="indication_text">Number of total user is <b>${ dimensions[3]}  ${params[3].value[2]}</b></div>
    //           <div class="indication_text">Number of total user is <b>${ dimensions[2]}  ${params[2].value[2]}</b></div>
    //           <div class="indication_text">Number of total user is <b>${ dimensions[1]}  ${params[1].value[2]}</b></div>
    //           <div class="indication_text">Number of total user is <b>${ dimensions[0]}  ${params[0].value[2]}</b></div>
    this.heatMapChartOption = {
      // tooltip: {
      //   position: 'top'
      // },
      //   dataset: {
      //     dimensions: dimensions,
      //     source:source
      // },

      tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'none'
        // },
        //${this.tooltipHover(params , busyChartArrayData , source ,dimensions)}
        formatter: (params, ticket, callback) => `

          ${this.tooltipHoverN(params, xAxisData, yAxisData)}
          `,
        position: 'top',
        padding: 0,
      },

      //animation: false,
      grid: {
        height: '70%',
        top: '10%',
        left: '5%',
        right: 0,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          show: false,
        },
        axisLabel: {
          //margin: 20,
          color: '#9AA0A6',
          fontWeight: 'normal',
          fontSize: 12,
          fontFamily: 'Inter',
          align: 'right',
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#FFF',
            width: 5,
          },
        },
        splitArea: {
          show: true,
        },
        boundaryGap: true,
        position: 'top',
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        axisLine: {
          show: false,
        },
        axisLabel: {
          //margin: 20,
          color: '#9AA0A6',
          fontWeight: 'normal',
          fontSize: 12,
          fontFamily: 'Inter',
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#FFF',
            width: 5,
          },
        },
        splitArea: {
          show: true,
        },
        boundaryGap: true,
      },

      visualMap: {
        //show: false,
        calculable: true,
        orient: 'horizontal',
        bottom: '0%',
        right: '20%',
        min: 0,
        max: this.maxHeatValue,
        splitNumber: 5,
        color: ['#07377F', '#F3F8FF'],
        // inRange : {
        //   color: ['#E7F1FF', '#07377F' ] //From smaller to bigger value ->
        // }
      },
      series: [
        {
          name: 'Busy hours',
          type: 'heatmap',
          data: heatData,
          emphasis: {
            itemStyle: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      ],
    };
  }
  ngAfterViewInit() {
    const slideFloor: any =
      document.getElementsByClassName('ng5-slider-floor')[0];
    const slideCeil: any =
      document.getElementsByClassName('ng5-slider-ceil')[0];
    const slideModelValue: any = document.getElementsByClassName(
      'ng5-slider-model-value'
    )[0];
    const slideModelHigh: any = document.getElementsByClassName(
      'ng5-slider-model-high'
    )[0];
    const sliderCombined: any = document.getElementsByClassName(
      'ng5-slider-combined'
    )[0];
    if (slideFloor) {
      slideFloor['style'].display = 'none'; // 00
    }
    if (slideCeil) {
      slideCeil['style'].display = 'none'; // 00
    }
    if (slideModelValue) {
      slideModelValue['style'].top = '12px'; // 00
      slideModelValue['style'].fontWeight = 'bold';
      slideModelValue['style'].fontSize = '12px';
    }
    if (slideModelHigh) {
      slideModelHigh['style'].top = '12px'; // 00
      slideModelHigh['style'].fontWeight = 'bold';
      slideModelHigh['style'].fontSize = '12px';
    }
    if (sliderCombined) {
      sliderCombined['style'].top = '12px'; // 00
      sliderCombined['style'].fontWeight = 'bold';
      sliderCombined['style'].fontSize = '12px';
    }
    $(document).on('hover', '.ng5-slider-selection-bar', () => {
      const val = this.highValue - this.lowValue;
      val > 1 ? val + ' hrs' : val + ' hr';
      const div = `<div>${val}</div>
        `;
      return div;
      //document.getElementsByClassName('ng5-slider-selection-bar')[0].classList.add('ng5-slider ng5-slider-span')
    });
  }
  tooltipHover(e, data, source, dimensions) {
    // console.log(e);
    //console.log(data[e[0].data[0]][e[0].data[1]].totalUsers)
    let loopDIV: any = '';
    const dataDIV = `<div class="metrics-tooltips-hover agent_drop_tolltip">
        <div class="split-sec">
          <div class="main-title" >${e[0].axisValue}</div>
          <div class="data-content"></div>
        </div>
        `;
    // for(let i = 0 ;i<e.length ; i++){
    //   if(dimensions[i+1]) // && e[i].value[2] > 0
    //   loopDIV = loopDIV + `<div class="indication_text" >total user on <b> ${dimensions[i+1]} </b> is <b>${e[i].value[2]} </b></div>`
    // }
    for (let i = 0; i <= dimensions.length; i++) {
      if (e[i]) {
        e[i].value[2] == '-' ? (e[i].value[2] = 0) : e[i].value[2];
      }
      if (dimensions[i + 1])
        loopDIV =
          loopDIV +
          `<div class="indication_text" >total user on <b> ${
            dimensions[i + 1]
          } </b> is <b>${e[i] ? e[i].value[2] : 0} </b></div>`;
    }
    `</div>
        `;
    if (loopDIV) return (this.busyHour_dataDIV = dataDIV + loopDIV);
  }
  tooltipHoverN(e, x, y) {
    const loopDIV: any = '';
    const tempIncrementalData = {
      '0 am': ' - 1 am',
      '1 am': ' - 2 am',
      '2 am': ' - 3 am',
      '3 am': ' - 4 am',
      '4 am': ' - 5 am',
      '5 am': ' - 6 am',
      '6 am': ' - 7 am',
      '7 am': ' - 8 am',
      '8 am': ' - 9 am',
      '9 am': ' - 10 am',
      '10 am': ' - 11 am',
      '11 am': ' - 12 am',
      '12 pm': ' - 1 pm',
      '1 pm': ' - 2 pm',
      '2 pm': ' - 3 pm',
      '3 pm': ' - 4 pm',
      '4 pm': ' - 5 pm',
      '5 pm': ' - 6 pm',
      '6 pm': ' - 7 pm',
      '7 pm': ' - 8 pm',
      '8 pm': ' - 9 pm',
      '9 pm': ' - 10 pm',
      '10 pm': ' - 11 pm',
      '11 pm': ' - 0 am',
    };
    const dataDIV = `
        <div class="metrics-tooltips-hover agent_drop_tolltip">
        <div class="split-sec">
          <div class="main-title">${y[e.value[1]]}</div>
          <div class="data-content"><span class="main-title">${
            x[e.value[0]] + tempIncrementalData[e.name]
          }</span></div>
        </div>
        <div class="indication_text">Total Users : <b>${e.value[2]}</b></div>
      </div>
        `;
    return dataDIV;
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
