import { Component, OnInit, Input, OnDestroy } from '@angular/core';
// import { EChartOption } from 'echarts';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAppIds } from '@kore.apps/store/app.selectors';
import { StoreService } from '@kore.apps/store/store.service';
declare const $: any;

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() query: any;
  @Input() showInsightFull: any;
  indexPipelineId;
  sub: Subscription;
  queryPipelineId;
  show = false;
  actionLog_id = 0;
  icontoggle = false;
  graphMode = true;
  iconIndex;
  ctrVal;
  slider: any = 1;
  filterArray: any = [];
  actionLogData: any = [];
  actionLogDatBack: any;
  selectedApp: any = {};
  searchIndexId;
  analystic: any = {};
  chartOption: any;
  staticChartOption: any = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      scale: true,
    },
    yAxis: {
      type: 'value',
      scale: true,
      show: false,
      splitLine: {
        show: false,
      },
      splitArea: { show: false },
    },

    series: [
      {
        data: [7, 10, 14, 18, 15, 10, 6],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#202124',
        },
      },
      {
        data: [8, 11, 21, 15, 10, 5, 5],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#3368BB',
        },
      },
      {
        data: [8, 11, 16, 15, 10, 5, 5],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#009DAB',
        },
      },
    ],
  };

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private storeService: StoreService
  ) {}
  getQueryLevelAnalytics() {
    // if(window.koreWidgetSDKInstance.vars.searchObject.searchText){
    //    this.query = window.koreWidgetSDKInstance.vars.searchObject.searchText;
    // }
    //this.query = "Open bank account"
    // this.getAppDetails();
    const date = new Date();
    const _month_old_date = new Date(Date.now() - 30 * 864e5);
    const sdate = new Date(Date.now());
    const startDate =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const endDate =
      _month_old_date.getFullYear() +
      '-' +
      (_month_old_date.getMonth() + 1) +
      '-' +
      _month_old_date.getDate();
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      startDate: _month_old_date.toJSON(), // startDate,  //"2020-10-10",
      endDate: sdate.toJSON(), //endDate,  //"2020-11-10"//endDate,
    };
    const payload = {
      searchQuery: this.query,
    };
    const header: any = {
      'x-timezone-offset': '-330',
    };
    // this.analystic =  {
    //   "searches": 5983,
    //   "clicks": 4254
    // };
    this.ctrVal =
      Math.floor(this.analystic['clicks'] / this.analystic['searches']) * 100;

    this.service
      .invoke('get.QueryLevelAnalytics', quaryparms, payload, header)
      .subscribe(
        (res) => {
          // console.log(res)
          this.analyticGraph(res);
          this.analystic = res;
          if (
            this.analystic['searches'] == 0 ||
            this.analystic['clicks'] == 0
          ) {
            this.ctrVal = 0;
          } else {
            this.ctrVal =
              Math.floor(
                this.analystic['clicks'] / this.analystic['searches']
              ) * 100;
          }
        },
        (error) => {
          // console.log(error);
        }
      );
  }
  ngOnInit(): void {
    this.initAppIds();
    // this.getAppDetails();
    this.customInit();
    this.getQueryLevelAnalytics();
    //},5000)
    //this.getcustomizeList();
  }

  initAppIds() {
    const idsSub = this.storeService.ids$
      .pipe(
        tap(({ searchIndexId, indexPipelineId, queryPipelineId }) => {
          this.searchIndexId = searchIndexId;
          this.indexPipelineId = indexPipelineId;
          this.queryPipelineId = queryPipelineId;
        })
      )
      .subscribe();

    this.sub?.add(idsSub);
  }

  analyticGraph(responseData) {
    const search_x_axis_data = [];
    const click_x_axis_data = [];
    const ctr_x_axis_data = [];
    const _y_axis_data = [];
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

    if (responseData.searchesData) {
      responseData.searchesData.forEach((element) => {
        const date = new Date(element.date);
        _y_axis_data.push(date.getDate() + ' ' + monthNames[date.getMonth()]);
        search_x_axis_data.push(element.searches);
        _y_axis_data.push(element.date);
      });
    }
    if (responseData.clicksData) {
      responseData.clicksData.forEach((element) => {
        click_x_axis_data.push(element.clicks);
        //_y_axis_data.push(element.date);
      });
    }
    if (responseData.ctrData) {
      responseData.ctrData.forEach((element) => {
        ctr_x_axis_data.push(element.ctr);
      });
    }
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: _y_axis_data, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        scale: true,
        //  show:false,
        //  splitLine:{//remove grid lines
        // 	show:false
        // },
        //splitArea : {show : false}// remove the grid area
      },
      yAxis: {
        type: 'value',
        scale: true,
        show: false,
        splitLine: {
          show: true,
        },
        splitArea: { show: false },
      },
      tooltip: {
        axisPointer: {
          label: {
            //backgroundColor: '#6a7985'
          },
        },
      },
      series: [
        {
          data: search_x_axis_data, //[7, 10, 14, 18, 15, 10, 6],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#202124',
          },
        },
        {
          data: click_x_axis_data, //[8, 11, 21, 15, 10, 5, 5],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#3368BB',
          },
        },
        {
          data: ctr_x_axis_data, //[8, 11, 17, 15, 35, 5, 5],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#009DAB',
          },
        },
      ],
    };
  }
  customInit() {
    // $("#advanceContainer").delay(800).fadeIn();
    // $('#advanceContainer').animate($('.dis').addClass('adv-opt-mode'), 500 );

    //   this.actionLogData = [{
    //     "header" : "Can I make credit card payament via savings account", // and get notifiaction once done?
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "New",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },{
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "help",
    //     "status": "Boosted",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },
    //   {
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "bot",
    //     "status": "Hidden",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },
    //   {
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "Pinned",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },
    //   {
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "Pinned",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },{
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "Pinned",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },
    //   {
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "Pinned",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },{
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "Pinned",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },
    //   {
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "Pinned",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },{
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "Pinned",
    //     "time" : "3h ago",
    //     "selected" : false
    //   },{
    //     "header" : "Can I make credit card payament via savings account",
    //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
    //     "option": "doc",
    //     "status": "Pinned",
    //     "time" : "3h ago",
    //     "selected" : false
    //   }
    // ]
    this.actionLogDatBack = [...this.actionLogData];
    this.actionLogData.forEach((element) => {
      this.filterArray.push(element.status);
    });
    this.filterArray = new Set(this.filterArray);
    //console.log(this.data)
  }
  filterRecord(type) {
    this.actionLogData = [...this.actionLogDatBack];
    if (type == 'all') {
      this.actionLogData = [...this.actionLogDatBack];
    } else {
      this.actionLogData = this.actionLogData.filter((data) => {
        return data.status == type;
      });
    }
  }
  closeCross() {
    this.graphMode = false;
  }
  mouseEnter() {
    this.graphMode = true;
  }
  mouseLeave() {
    //this.graphMode = false;
  }
  filter() {}
  toggle(icontoggle, selected) {
    const previousIndex = this.iconIndex;
    //previousIndex == index ? this.icontoggle = !icontoggle : this.icontoggle = icontoggle;
    this.icontoggle = !icontoggle;
    //this.iconIndex  = index;
    //this.actionLogData[index].selected = !selected;
  }
  swapSlider(slide) {
    this.slider = slide;
    if (this.slider == 0 && $('.tab-name').length) {
      $('.tab-ana').addClass('active');
      $('.tab-act').removeClass('active');
    } else {
      $('.tab-act').addClass('active');
      $('.tab-ana').removeClass('active');
    }
    // console.log('button clicked')
  }

  getcustomizeList() {
    // this.getAppDetails();
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      queryPipelineId: this.queryPipelineId,
      indexpipelineId: this.indexPipelineId || '',
    };
    this.service.invoke('get.queryCustomizeList', quaryparms).subscribe(
      (res) => {
        if (res.length) {
          this.actionLog_id = res[res.length - 1]._id;
          this.clickCustomizeRecord(res[res.length - 1]._id);
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
  clickCustomizeRecord(_id) {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      queryPipelineId: this.queryPipelineId,
      rankingAndPinningId: _id,
      indexPipelineId: this.indexPipelineId || '',
    };
    this.service.invoke('get.customisationLogs', quaryparms).subscribe(
      (res) => {
        //this.customizeList = res;
        this.actionLogData = res;
        for (let i = 0; i < this.actionLogData.length; i++) {
          this.actionLogData[i]['selected'] = false;
          this.actionLogData[i]['drop'] = false;
          // if(this.actionLogData[i].target.contentType == 'faq'){
          //   this.faqDesc = this.actionLogData[i].target.contentInfo.defaultAnswers[0].payload
          // }
        }
        // console.log(res);
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
          this.notificationService.notify('Failed', 'error');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
