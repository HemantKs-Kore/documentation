import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { fadeInOutAnimation } from '../../helpers/animations/animations';
import { Router } from '@angular/router';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { UseronboardingJourneyComponent } from '../../helpers/components/useronboarding-journey/useronboarding-journey.component';
import { catchError, EMPTY, filter, Subscription, switchMap, tap } from 'rxjs';
import { SideBarService } from '@kore.apps/services/header.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { AuthService } from '@kore.apps/services/auth.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { InlineManualService } from '@kore.apps/services/inline-manual.service';
import { selectIndexPipelines } from '@kore.apps/store/app.selectors';
import { Store } from '@ngrx/store';
// import { IndexPipelineService } from './services/index-pipeline.service';
// import { QueryPipelineService } from './services/query-pipeline.service';
declare const $: any;
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  animations: [fadeInOutAnimation],
})
export class SummaryComponent implements OnInit, AfterViewInit, OnDestroy {
  sub: Subscription;
  math = Math;
  serachIndexId;
  indices: any = [];
  experiments: any = [];
  default_Indexpipelineid: any;
  variants: any = [];
  activities: any = [];
  channels: any = [];
  channelsName = '';
  //searchIndexes: any = [];
  channelExist = false;
  totalUsersStats: any = {};
  totalSearchesStats: any = {};
  selectedApp: any;
  installer_summary_flag: any;
  loading = true;
  summary: any;
  showError = false;
  btLogs: any[] = [];
  onBoardingModalPopRef: any;
  showOverview = true;
  indexPipeLineCount: number;
  loading_skelton: boolean;
  show_indices: boolean;
  currentPlan: any = {};
  usageDetails: any = {};
  summaryObj: any = {
    contentDocuments: [],
    contentWebDomains: [],
    faqWebDomains: [],
    faqDocuments: [],
  };
  exp_status = {
    completed: 1,
    active: 2,
    configured: 3,
  };
  componentType: string;
  listMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  date = new Date();
  current_month: string;
  emptySummaryBlocks: any = [
    {
      stepCount: 1,
      stepName: 'Add Source',
      stepDiscription:
        'You need to add source such as web pages, documents, FAQs, bot actions',
    },
    {
      stepCount: 2,
      stepName: 'Manage Content',
      stepDiscription:
        'You can then review and moidify the added sources if required',
    },
    {
      stepCount: 3,
      stepName: 'Test & Preview',
      stepDiscription:
        'You can then check how the serach results or bot actions will be displayed to the end-user',
    },
    {
      stepCount: 4,
      stepName: 'Training',
      stepDiscription:
        "You can now train Findly.ai to address the user's quaries more effectively",
    },
    {
      stepCount: 5,
      stepName: 'Puublish and Deploy',
      stepDiscription:
        'You can now deploye app and allow users to intract  with the searchbot',
    },
    {
      stepCount: 6,
      stepName: 'Analytics and Insignts',
      stepDiscription:
        'You can now track real realtime performance, operational, usage metrics of your app',
    },
  ];
  tooltipObj: any = {
    'Total Users': 'Total number of calls received by the app today.',
    'In Progress': 'Number of conversation sessions currently in-progress.',
    'Fulfilled via Automation':
      'Number of conversation sessions that are fulfilled by the Chat or Voice Virtual Agents.',
    'Handed-off to Agents':
      'Number of conversation sessions that are handed-off Virtual Agents.',
    'Drop offs':
      'Number of conversation sessions where the users have dropped-off from the conversation.',
  };
  subscription: Subscription;
  showActivity: boolean;
  currentUsageSubscription: Subscription;
  currentPlanSubscription: Subscription;
  updateUsageData: Subscription;
  @ViewChild('onBoardingModalPop') onBoardingModalPop: KRModalComponent;
  @ViewChild('onboard') onboard: UseronboardingJourneyComponent;
  constructor(
    public workflowService: WorkflowService,
    private headerService: SideBarService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public inlineManual: InlineManualService,
    public appSelectionService: AppSelectionService,
    private store: Store
  ) {}

  async ngOnInit() {
    this.currentPlan = {};
    this.loading_skelton = true;
    this.initialCall();
    await this.appSelectionService.getCurrentUsage();
    this.usageDetails = this.appSelectionService?.currentUsageData;
    this.updateUsageData = this.appSelectionService.updateUsageData.subscribe(
      (res) => {
        if (res == 'updatedUsage') {
          this.usageDetails = this.appSelectionService?.currentUsageData;
        }
      }
    );
    this.currentUsageSubscription =
      this.appSelectionService.queryConfigs.subscribe((res) => {
        const subscription_data =
          this.appSelectionService?.currentsubscriptionPlanDetails;
        this.currentPlan = subscription_data?.subscription;
        this.initialCall('changed');
        this.onboard?.initialCall();
        this.appSelectionService.getTourConfig();
        this.getAllOverview();
      });
    this.currentPlanSubscription =
      this.appSelectionService.currentSubscription.subscribe((res) => {
        const subscription_data =
          this.appSelectionService?.currentsubscriptionPlanDetails;
        this.currentPlan = subscription_data.subscription;
      });
  }
  ngAfterViewInit() {
    if (!this.inlineManual?.checkVisibility('APP_WALKTHROUGH')) {
      // this.onboard.openOnBoardingModal(); //commenting this since we have new check list
    }
    setTimeout(() => {
      if (!this.inlineManual?.checkVisibility('APP_WALKTHROUGH')) {
        this.inlineManual?.openHelp('APP_WALKTHROUGH');
        this.inlineManual?.visited('APP_WALKTHROUGH');
      }
    }, 1000);
  }

  handlePipelineError(errRes) {
    if (
      errRes &&
      errRes.error?.errors &&
      errRes.error?.errors.length &&
      errRes.error?.errors[0] &&
      errRes.error?.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else {
      this.notificationService.notify('Failed ', errRes);
    }
  }

  getIndexPipeline(status?) {
    const indexPipelineSub = this.store
      .select(selectIndexPipelines)
      .pipe(
        tap((indexPipelines: any[]) => {
          const selectedIndexConfig = indexPipelines.find(
            (item) => item.default
          );
          this.default_Indexpipelineid = selectedIndexConfig._id;
          this.getQueries('TotalUsersStats');
          this.getQueries('TotalSearchesStats');
          this.getAllOverview(status);
          this.componentType = 'summary';
        })
      )
      .subscribe({
        error: this.handlePipelineError.bind(this),
      });

    this.sub?.add(indexPipelineSub);
  }

  //initial ngoninit method call
  initialCall(status?) {
    const toogleObj = {
      title: 'Summary',
      toShowWidgetNavigation: this.workflowService.showAppCreationHeader(),
    };
    this.current_month = this.listMonths[this.date.getMonth()];
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.headerService.toggle(toogleObj);
    this.getIndexPipeline(status);
  }
  getQueries(type) {
    //moved the below flag to ngOnInit to fix the NAN display issue for few sec in summary screen on 08/03
    //this.loading_skelton = true;
    const today = new Date();
    const from = new Date(Date.now() - 1 * 864e5);
    const header: any = {
      'x-timezone-offset': '-330',
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.default_Indexpipelineid,
      offset: 0,
      limit: 100,
    };
    const payload: any = {
      type: type,
      filters: {
        from: from.toJSON(),
        to: today.toJSON(),
      },
    };
    this.service.invoke('get.queries', quaryparms, payload, header).subscribe(
      (res) => {
        if (type == 'TotalUsersStats') {
          this.totalUsersStats = res;
        } else if (type == 'TotalSearchesStats') {
          this.totalSearchesStats = res;
          this.loading_skelton = false;
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
          if (errRes.error.errors[0].code != 'NoActiveSubscription') {
            this.notificationService.notify(
              errRes.error.errors[0].msg,
              'error'
            );
          }
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }

  getChannel() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id,
    };
    this.service.invoke('get.credential', queryParams).subscribe(
      (res) => {
        // console.log(res.channels[0].app.name)
        if (res.apps.length) {
          this.channelExist = true;
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
  getLinkedBot() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id,
    };

    this.service.invoke('get.linkedBot', queryParams).subscribe(
      (res) => {
        // console.log(res.channels[0].name)
        if (res.channels.length) {
          this.channelExist = true;
          this.channelsName = res.channels[0].name;
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
          // this.notificationService.notify('Failed to get LInked BOT', 'error');
        }
      }
    );
  }
  getAllOverview(status?) {
    const queryParams = {
      searchIndexId: this.serachIndexId,
    };
    this.service.invoke('get.overview', queryParams).subscribe(
      (res) => {
        this.experiments = res.experiments.slice(0, 3);
        this.indices = res.indices[0];
        this.show_indices =
          this.indices.botActions.tasks > 0 ||
          this.indices?.connectors?.sources > 0 ||
          this.indices.files > 0 ||
          this.indices.structuredDataCount > 0 ||
          this.indices.web.domains > 0 ||
          this.indices.web.numOfDocs > 0 ||
          this.indices.faqs.in_review > 0 ||
          this.indices.faqs.draft > 0 ||
          this.indices.faqs.approved > 0
            ? true
            : false;
        if (status == undefined) {
          const subscription_data =
            this.appSelectionService?.currentsubscriptionPlanDetails;
          this.currentPlan = subscription_data?.subscription;
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

  userViewAll() {
    $('#dashboardTab').trigger('click');
    setTimeout(() => {
      this.workflowService.mainMenuRouter$.next('/userEngagement');
      this.router.navigate(['/userEngagement'], { skipLocationChange: true });
    }, 100);
  }
  searchViewAll() {
    $('#dashboardTab').trigger('click');
    setTimeout(() => {
      this.workflowService.mainMenuRouter$.next('/searchInsights');
      this.router.navigate(['/searchInsights'], { skipLocationChange: true });
    }, 100);
  }
  resultViewAll() {
    $('#dashboardTab').trigger('click');
    setTimeout(() => {
      this.workflowService.mainMenuRouter$.next('/resultInsights');
      this.router.navigate(['/resultInsights'], { skipLocationChange: true });
    }, 100);
  }
  redirectToActions() {
    this.appSelectionService.routeChanged.next({
      name: 'pathchanged',
      path: '/botActions',
    });
  }
  openExp() {
    $('#experimentsTab').trigger('click');
  }
  openChannel() {
    $('#channelsTab').trigger('click');
    setTimeout(() => {
      this.workflowService.mainMenuRouter$.next('/settings');
      this.router.navigate(['/settings'], { skipLocationChange: true });
    }, 100);
  }
  openDashboard() {
    $('#dashboardTab').trigger('click');
  }
  openSource() {
    this.router.navigate(['sources'], { skipLocationChange: true });
    //this.router.navigateByUrl('sources', { skipLocationChange: true });
    // this.appSelectionService.routeChanged.next({
    //   name: 'pathchanged',
    //   path: '/sources',
    // });
  }
  redirectToPricing() {
    // this.router.navigateByUrl('/pricing');
    this.appSelectionService.routeChanged.next({
      name: 'pathchanged',
      path: '/pricing',
    });
  }
  openOnBoardingModal() {
    this.onboard.openOnBoardingModal();
  }
  closeOnBoardingModal() {
    this.onboard.closeOnBoardingModal();
  }
  ngOnDestroy() {
    this.currentUsageSubscription
      ? this.currentUsageSubscription.unsubscribe()
      : null;
    this.currentPlanSubscription
      ? this.currentPlanSubscription.unsubscribe()
      : null;
    this.updateUsageData ? this.updateUsageData.unsubscribe() : false;

    this.sub?.unsubscribe();
  }
}
