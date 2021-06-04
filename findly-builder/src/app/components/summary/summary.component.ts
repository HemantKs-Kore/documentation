import { Component, ModuleWithComponentFactories, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SideBarService } from '@kore.services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { UseronboardingJourneyComponent } from '../../helpers/components/useronboarding-journey/useronboarding-journey.component';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
declare const $: any;
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SummaryComponent implements OnInit, OnDestroy {
  serachIndexId;
  indices: any = [];
  experiments: any = [];
  variants: any = [];
  activities: any = [];
  channels: any = [];
  channelsName = '';
  // searchIndexes: any = [];
  channelExist = false;
  totalUsersStats: any = {};
  totalSearchesStats: any = {};
  selectedApp: any;
  loading = true;
  summary: any;
  showError = false;
  btLogs: any[] = [];
  onBoardingModalPopRef: any;
  showOverview: boolean = true;
  indexPipeLineCount: number;
  summaryObj: any = {
    contentDocuments: [],
    contentWebDomains: [],
    faqWebDomains: [],
    faqDocuments: []
  }
  exp_status = {
    'completed': 1,
    'active': 2,
    'configured': 3
  };
  componentType: string;
  listMonths = ['January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  date = new Date();
  current_month: string;
  emptySummaryBlocks: any = [
    {
      stepCount: 1,
      stepName: 'Add Source',
      stepDiscription: 'You need to add source such as web pages, documents, FAQs, bot actions'
    },
    {
      stepCount: 2,
      stepName: 'Manage Content',
      stepDiscription: 'You can then review and moidify the added sources if required'
    },
    {
      stepCount: 3,
      stepName: 'Test & Preview',
      stepDiscription: 'You can then check how the serach results or bot actions will be displayed to the end-user'
    },
    {
      stepCount: 4,
      stepName: 'Training',
      stepDiscription: 'You can now train Findly.ai to address the user\'s quaries more effectively'
    },
    {
      stepCount: 5,
      stepName: 'Puublish and Deploy',
      stepDiscription: 'You can now deploye app and allow users to intract  with the searchbot'
    },
    {
      stepCount: 6,
      stepName: 'Analytics and Insignts',
      stepDiscription: 'You can now track real realtime performance, operational, usage metrics of your app'
    }
  ];
  tooltipObj: any = {
    'Total Users': 'Total number of calls received by the app today.',
    'In Progress': 'Number of conversation sessions currently in-progress.',
    'Fulfilled via Automation': 'Number of conversation sessions that are fulfilled by the Chat or Voice Virtual Agents.',
    'Handed-off to Agents': 'Number of conversation sessions that are handed-off Virtual Agents.',
    'Drop offs': 'Number of conversation sessions where the users have dropped-off from the conversation.'
  };
  subscription: Subscription;
  showActivity: boolean;
  routeRefresh: Subscription;
  @ViewChild('onBoardingModalPop') onBoardingModalPop: KRModalComponent;
  @ViewChild('onboard') onboard: UseronboardingJourneyComponent;
  constructor(
    public workflowService: WorkflowService,
    private headerService: SideBarService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private appSelectionService: AppSelectionService
  ) { }


  ngOnInit() {
    this.initialCall();
    this.subscription = this.appSelectionService.getTourConfigData.subscribe(res => {
      this.showOverview = res.findlyOverviewVisited;
    })
    this.routeRefresh = this.appSelectionService.refreshSummaryPage.subscribe(res => {
      if (res == 'changed') {
        this.initialCall();
        this.onboard.initialCall();
      }
    })
  }
  // closeOverview() {
  //   this.subscription.unsubscribe();
  //   this.showOverview = true
  // }
  //initial ngoninit method call
  initialCall() {
    const toogleObj = {
      title: 'Summary',
      toShowWidgetNavigation: this.workflowService.showAppCreationHeader()
    };
    this.current_month = this.listMonths[this.date.getMonth()];
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.headerService.toggle(toogleObj);
    this.getSummary();
    this.getQueries("TotalUsersStats");
    this.getQueries("TotalSearchesStats");
    this.getAllOverview();
    this.componentType = 'summary';
  }
  getSummary() {
    this.loading = false;
    // this.loading = true;
    // const params = {
    //   appId: this.selectedApp._id || this.selectedApp[0]._id
    // };
    // this.service.invoke('get.summary', params)
    //   .pipe(
    //     finalize(() => this.loading = false)
    //   )
    //   .subscribe((res: SummaryModel) => {
    //     this.summary = res;
    //   }, err => {
    //     this.showError = true;
    //     this.notificationService.notify('Unable to get summary details', 'error');
    //   });
  }
  getQueries(type) {
    var today = new Date();
    let from = new Date(Date.now() - (29 * 864e5));

    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit: 100
    };
    let payload: any = {
      type: type,
      filters: {
        from: from.toJSON(),
        to: today.toJSON()
      },

    }


    this.service.invoke('get.queries', quaryparms, payload, header).subscribe(res => {
      console.log("summary result rate", res)
      if (type == "TotalUsersStats") {
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

  getChannel() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }
    this.service.invoke('get.credential', queryParams).subscribe(
      res => {
        console.log(res.channels[0].app.name)
        if (res.apps.length) {
          this.channelExist = true;
        }

      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  getLinkedBot() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }

    this.service.invoke('get.linkedBot', queryParams).subscribe(
      res => {
        // console.log(res.channels[0].name)
        if (res.channels.length) {
          this.channelExist = true;
          this.channelsName = res.channels[0].name;
        }
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          // this.notificationService.notify('Failed to get LInked BOT', 'error');
        }
      }
    );
  }
  getAllOverview() {
    const queryParams = {
      searchIndexId: this.serachIndexId,
    }
    this.service.invoke('get.overview', queryParams).subscribe(
      res => {
        this.experiments = res.experiments
        this.activities = res.activities;
        this.indices = res.indices;
        this.indexPipeLineCount = this.indices[0].indexPipeLineCount;
        this.showActivity = this.activities.length > 0 ? this.activities.some(act => act.faqInReviewCount > 0) ? true : false : false;
        this.activities = this.activities.map(item => {
          let hours = moment().diff(moment(item.time), 'hours');
          let days = moment().diff(moment(item.time), 'days');
          let result = hours > 24 ? days + ' days' : hours + ' hrs';
          return { ...item, time_format: result };
        })
        this.experiments = this.experiments.slice(0, 3).map(data => {
          let hours = moment().diff(moment(data.end), 'hours');
          let days = moment().diff(moment(data.end), 'days');
          let days_result = Math.abs(hours) > 24 ? Math.abs(days) + ' days' : Math.abs(hours) + ' hrs';
          return { ...data, total_days: days_result + ' more to go', time_result: hours };
        })
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }


  userViewAll() {
    $('#dashboardTab').trigger('click');
    setTimeout(() => {
      this.router.navigate(['/userEngagement'], { skipLocationChange: true });
    }, 100)
  }
  searchViewAll() {
    $('#dashboardTab').trigger('click');
    setTimeout(() => {
      this.router.navigate(['/searchInsights'], { skipLocationChange: true });
    }, 100)
  }
  resultViewAll() {
    $('#dashboardTab').trigger('click');
    setTimeout(() => {
      this.router.navigate(['/resultInsights'], { skipLocationChange: true });
    }, 100)
  }
  openExp() {
    $('#experimentsTab').trigger('click')
  }
  openChannel() {
    $('#channelsTab').trigger('click')
  }
  openDashboard() {
    $('#dashboardTab').trigger('click')
  }
  openSource() {
    $('#sourceTab').trigger('click')
  }
  openOnBoardingModal() {
    this.showOverview = true;
    this.subscription.unsubscribe();
    setTimeout(() => {
      this.componentType = 'overview';
      //this.onboard.openOnBoardingModal();
    }, 1000)
  }
  closeOnBoardingModal() {
    this.onboard.closeOnBoardingModal();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routeRefresh.unsubscribe();
  }
}
