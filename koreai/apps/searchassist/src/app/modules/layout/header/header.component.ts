import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { SideBarService } from '../../../services/header.service';
import { KRModalComponent } from '../../../shared/kr-modal/kr-modal.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, withLatestFrom } from 'rxjs/operators';
import { SliderComponentComponent } from '../../../shared/slider-component/slider-component.component';
import { DockStatusService } from '../../../services/dockstatusService/dock-status.service';
import { interval, Subscription } from 'rxjs';
// import * as moment from 'moment';
import { format } from 'date-fns';
declare const $: any;
import * as _ from 'underscore';
import { AuthService } from '@kore.apps/services/auth.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { LocalStoreService } from '@kore.apps/services/localstore.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { MixpanelServiceService } from '@kore.apps/services/mixpanel-service.service';
import { AppUrlsService } from '@kore.apps/services/app.urls.service';
import { environment } from '@kore.environment/environment';
import { SearchSdkService } from '@kore.apps/modules/search-sdk/services/search-sdk.service';
import { OnboardingComponent } from '@kore.apps/modules/onboarding/onboarding.component';
import { Store } from '@ngrx/store';
import { setAppId } from '@kore.apps/store/app.actions';
import {
  selectAppId,
  selectEnablePreview,
} from '@kore.apps/store/app.selectors';
import { AppsService } from '@kore.apps/modules/apps/services/apps.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSdkBundleLoaded = false;
  toShowAppHeader;
  mainMenu = '';
  showMainMenu = true;
  showClose = false;
  currentRouteData: any = '';
  displyStatusBar = true;
  onboardingOpened = false;
  tourData: any = [];
  browseWorkspaceRef: any;
  tourConfigData: any = [];
  checklistCount: any;
  progressPrecent = 0;
  pagetitle: any;
  field_name: any;
  countTrainAction = 0;
  workspace_search: any;
  profile_display: any;
  associate_profile_display: any;
  selected_profile_display: any;
  alphabetSeries1: any = ['A', 'B', 'C', 'D', 'E'];
  alphabetSeries2: any = ['F', 'G', 'H', 'I', 'J'];
  alphabetSeries3: any = ['K', 'L', 'M', 'N', 'O'];
  alphabetSeries4: any = ['P', 'Q', 'R', 'S', 'T'];
  alphabetSeries5: any = ['U', 'V', 'W', 'X', 'Y', 'Z'];
  alphabetSeries: any = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  training = false;
  fromCallFlow = '';
  disableClearAll = false;
  showSwichAccountOption = false;
  searchActive = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  searchText: any = '';
  activeClose = false;
  activeSearch = false;
  search: any;
  formatter: any;
  appName = '';
  menuFlag = false;
  sourcesFlag = false;
  loginusername: any;
  recentApps: any;
  userId: any;
  showSearch = false;
  public statusDockerLoading = false;
  newApp: any = {
    name: '',
    description: '',
  };
  createAppPopRef: any;
  creatingInProgress = false;
  selectedApp;
  appsnum;
  serachIndexId;
  queryPipelineId;
  indexPipelineId;
  domain = '';
  selectAccountDetails: any = {};
  associatedAccounts: any;
  associatedRedAccounts: any = [];
  private storageType = 'localStorage';
  indexSubscription: Subscription;
  subscription: Subscription;
  routeChanged: Subscription;
  updateHeaderMainMenuSubscription: Subscription;
  topicGuideShowSubscription: Subscription;
  currentSubsciptionData: Subscription;
  accountIdRef = '';
  @Output() showMenu = new EventEmitter();
  @Output() settingMenu = new EventEmitter();
  @Output() showSourceMenu = new EventEmitter();
  @ViewChild('createAppPop') createAppPop: KRModalComponent;
  @ViewChild('testButtonTooltip') testButtonTooltip: any;
  @ViewChild(SliderComponentComponent, { static: true })
  sliderComponent: SliderComponentComponent;
  @ViewChild(OnboardingComponent, { static: true })
  onBoardingComponent: OnboardingComponent;
  @ViewChild('browseWorkspace') browseWorkspace: KRModalComponent;
  availableRouts = [
    { displayName: 'Summary', routeId: '/summary', quaryParms: {} },
    { displayName: 'Overview', routeId: '/summary', quaryParms: {} },
    { displayName: 'Add Sources', routeId: '/sources', quaryParms: {} },
    {
      displayName: 'Crawl Web Domain',
      routeId: '/sources',
      quaryParms: { sourceType: 'contentWeb' },
    },
    {
      displayName: 'Extract Document',
      routeId: '/sources',
      quaryParms: { sourceType: 'contentDoc' },
    },
    {
      displayName: 'Add FAQs Manually',
      routeId: '/sources',
      quaryParms: { sourceType: 'manual' },
    },
    {
      displayName: 'Extract FAQs from Document',
      routeId: '/faqs',
      quaryParms: { sourceType: 'faqDoc' },
    },
    {
      displayName: 'Extract FAQs from Webdomain',
      routeId: '/sources',
      quaryParms: { sourceType: 'faqWeb' },
    },
    {
      displayName: 'FAQs',
      routeId: '/faqs',
      quaryParms: { sourceType: 'faqWeb' },
    },
    {
      displayName: 'Content',
      routeId: '/content',
      quaryParms: { sourceType: 'faqWeb' },
    },
    {
      displayName: 'Structured Data',
      routeId: '/structuredData',
      quaryParms: {},
    },
    { displayName: 'Experiments', routeId: '/experiments', quaryParms: {} },
    { displayName: 'Actions', routeId: '/botActions', quaryParms: {} },
    { displayName: 'Workbench', routeId: '/index', quaryParms: {} },
    {
      displayName: 'Indices',
      routeId: '/FieldManagementComponent',
      quaryParms: {},
    },
    {
      displayName: 'Fields',
      routeId: '/FieldManagementComponent',
      quaryParms: {},
    },
    { displayName: 'Traits', routeId: '/traits', quaryParms: {} },
    { displayName: 'Weights', routeId: '/weights', quaryParms: {} },
    { displayName: 'Synonyms', routeId: '/synonyms', quaryParms: {} },
    { displayName: 'StopWords', routeId: '/stopWords', quaryParms: {} },
    { displayName: 'Facets', routeId: '/facets', quaryParms: {} },
    { displayName: 'Business Rules', routeId: '/rules', quaryParms: {} },
    {
      displayName: 'Search Interface',
      routeId: '/search-experience',
      quaryParms: {},
    },
    {
      displayName: 'Result Templates',
      routeId: '/searchInterface',
      quaryParms: {},
    },
    { displayName: 'Dashboard', routeId: '/dashboard', quaryParms: {} },
    {
      displayName: 'User Engagement Metrics',
      routeId: '/userEngagement',
      quaryParms: {},
    },
    {
      displayName: 'Search Insights',
      routeId: '/searchInsights',
      quaryParms: {},
    },
    {
      displayName: 'Result Insights',
      routeId: '/resultInsights',
      quaryParms: {},
    },
    { displayName: 'Manage', routeId: '/generalSettings', quaryParms: {} },
    {
      displayName: 'General Settings',
      routeId: '/generalSettings',
      quaryParms: {},
    },
    { displayName: 'Channels', routeId: '/settings', quaryParms: {} },
    {
      displayName: 'Credentials',
      routeId: '/credentials-list',
      quaryParms: {},
    },
    { displayName: 'Team', routeId: '/team-management', quaryParms: {} },
    { displayName: 'Plan Details', routeId: '/pricing', quaryParms: {} },
    { displayName: 'Usage Log', routeId: '/pricing/usageLog', quaryParms: {} },
    { displayName: 'Invoices', routeId: '/pricing/invoices', quaryParms: {} },
    { displayName: 'Connectors', routeId: '/connectors', quaryParms: {} },
    {
      displayName: 'Results Ranking',
      routeId: '/resultranking',
      quaryParms: {},
    },
    {
      displayName: 'Analytics(Experiments)',
      routeId: '/experiments',
      quaryParms: {},
    },
    {
      displayName: 'Analytics(Dashboard)',
      routeId: '/dashboard',
      quaryParms: {},
    },
    {
      displayName: 'Analytics(User Engagement Metrics)',
      routeId: '/userEngagement',
      quaryParms: {},
    },
    {
      displayName: 'Analytics(Search Insights)',
      routeId: '/searchInsights',
      quaryParms: {},
    },
    {
      displayName: 'Analytics(Result Insights)',
      routeId: '/resultInsights',
      quaryParms: {},
    },
  ];
  menuItems: any = {
    sources: [
      '/sources',
      '/content',
      '/faqs',
      '/botActions',
      '/structuredData',
      '/connectors',
    ],
    indices: [
      '/FieldManagementComponent',
      '/traits',
      '/index',
      '/weights',
      '/synonyms',
      '/stopWords',
      '/resultranking',
      '/facets',
      '/rules',
      '/search-experience',
      '/resultTemplate',
    ],
    anlytics: [
      '/dashboard',
      '/userEngagement',
      '/searchInsights',
      '/experiments',
      '/resultInsights',
    ],
    manage: [
      '/settings',
      '/credentials-list',
      '/actions',
      '/team-management',
      '/smallTalk',
      '/pricing',
      '/pricing/usageLog',
      '/pricing/invoices',
      '/generalSettings',
    ],
  };
  public dockersList: Array<any> = [];
  public pollingSubscriber: any;
  public dockServiceSubscriber: any;
  public isAnyRecordInprogress = false;
  public isAnyRecordCompleted = false;
  public isAnyRecordFailed = false;
  public readDocs: any = [];
  public unReadDocs: any = [];
  WorkspaceList: any = [];
  loadingContent = false;
  loadingProgress;
  emptyContent;
  currentAppControlList: any;
  notifyAccount = false;
  notifyAccountInfo: any;
  isJoinedClicked = false;
  isRouteDisabled = false;
  enablePreview$ = this.store.select(selectEnablePreview);
  constructor(
    private authService: AuthService,
    public headerService: SideBarService,
    public workflowService: WorkflowService,
    public router: Router,
    private ref: ChangeDetectorRef,
    private appUrlsService: AppUrlsService,
    private localStoreService: LocalStoreService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public mixpanel: MixpanelServiceService,
    public dockService: DockStatusService,
    private appSelectionService: AppSelectionService,
    private searchSdkService: SearchSdkService,
    private viewContainerRef: ViewContainerRef,
    private store: Store,
    private appsService: AppsService
  ) {
    this.userId = this.authService.getUserId();
    if (environment && environment.USE_SESSION_STORE) {
      this.storageType = 'sessionStorage';
    }
  }
  ngOnInit() {
    this.getUserInfo();
    this.checkroute();
    this.getAllApps();
    this.initControlList();

    this.topicGuideShowSubscription =
      this.appSelectionService.topicGuideShow.subscribe((res) => {
        this.openUserMetaTagsSlider();
        this.onBoardingComponent.openTopicguide(); // Testing For merge
        this.onBoardingComponent.triggerChildFaq(this.router.url);
      });
    this.subscription = this.appSelectionService.getTourConfigData.subscribe(
      (res) => {
        this.tourConfigData = res;
        this.tourData = res.onBoardingChecklist;
        this.trackChecklist();
      }
    );
    //subscribe to app current Plan Data
    this.currentSubsciptionData =
      this.appSelectionService.currentSubscription.subscribe((res) => {
        this.isRouteDisabled = res?.appDisabled;
      });
    this.routeChanged = this.appSelectionService.routeChanged.subscribe(
      (res) => {
        if (res.name != undefined) {
          this.analyticsClick(res.path, false);
          this.isRouteDisabled = res?.disable;
        }
        if (res?.isDemo == true) {
          this.viewCheckList();
        }
      }
    );

    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.headerService.change.subscribe((data: any) => {
      if (
        this.workflowService.selectedApp() &&
        this.workflowService.selectedApp().name
      ) {
        this.appName = this.workflowService.selectedApp().name;
      }
      this.pagetitle = data.title;
      this.toShowAppHeader = data.toShowWidgetNavigation;
      this.fromCallFlow = '';
      this.ref.detectChanges();
      this.poling(true);
      this.dockServiceSubscriber = this.dockService.change.subscribe((data) => {
        this.poling(true);
      });
    });

    // this.headerService.fromCallFlowExpand.subscribe(data => {
    //   this.fromCallFlow = data.title;
    //   this.toShowAppHeader = false;
    //   this.pagetitle = '';
    //   this.ref.detectChanges();
    // });

    // this.showSwichAccountOption = this.localStoreService.getAssociatedAccounts().length > 1;
    // this.search = (text$: Observable<string>) =>
    //   text$.pipe(
    //     debounceTime(200),
    //     map(term => term === '' ? []
    //       : this.availableRouts.filter(v => (v.displayName || '').toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //   )
    // this.formatter = (x: { displayName: string }) => (x.displayName || '');
    //   if(this.selectAccountDetails==null){
    //     for(let i=0;i<this.associatedAccounts.length;i++)
    //   {
    //     if(this.associatedAccounts[i].status=="active")
    //     {
    //       this.selectAccountDetails=this.associatedAccounts[i];
    //     }

    //   }
    // }
    //   this.associatedAccounts = window[this.storageType].getItem('jStorage') ? JSON.parse(window[this.storageType].getItem('jStorage')).currentAccount.associatedAccounts : {};
    //   for(let i=0;i<this.associatedAccounts.length;i++)
    //   {
    //     if(this.associatedAccounts[i].status=="active")
    //     {
    //       this.loginusername=this.associatedAccounts[i].userFullName;
    //     }
    //   }
    //   this.extractProfiledisplayname();
    /**added code to fetch the associated accounts from*/
    // if(localStorage.krPreviousState=='{}'|| localStorage.krPreviousState=="null"  || localStorage.krPreviousState==undefined){
    //   this.analyticsClick('/home');
    // }
    //   if(localStorage.krPreviousState=='{}'|| localStorage.krPreviousState=="null"  || localStorage.krPreviousState==undefined){
    //       //this.analyticsClick('/home');
    //     }
    //     else if (localStorage.krPreviousState && JSON.parse(localStorage.krPreviousState)) {
    //         if(this.appsnum.length==='undefined' || this.appsnum.length==0) {
    //             this.analyticsClick(JSON.parse(localStorage.krPreviousState).route,true);
    //           }
    //         else{
    //           this.analyticsClick(JSON.parse(localStorage.krPreviousState).route,false);
    //         }
    //   }

    //   this.updateHeaderMainMenuSubscription = this.headerService.headerMainMenuUpdate.subscribe((res) => {
    //     if (res) {
    //       this.mainMenu = res;
    //     }
    //   });
    //   this.selectedApp = this.workflowService.selectedApp();
    //   this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    //   this.loadHeader();
    //   this.indexSubscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
    //     this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
    //       this.loadHeader();
    //     })
    //   })
    //   this.workflowService.mainMenuRouter$.subscribe(route => {
    //     this.mainMenu = route;
    //   });
    //   this.selectAccountDetails = window[this.storageType].getItem('selectedAccount') ? JSON.parse(window[this.storageType].getItem('selectedAccount')) : {};
    //   this.associatedAccounts = window[this.storageType].getItem('jStorage') ? JSON.parse(window[this.storageType].getItem('jStorage')).currentAccount.associatedAccounts : {};
    //   this.domain = window[this.storageType].getItem('jStorage') ? JSON.parse(window[this.storageType].getItem('jStorage')).currentAccount.domain : '';
    //   if(this.selectAccountDetails==null){
    //       for(let i=0;i<this.associatedAccounts.length;i++)
    //     {
    //       if(this.associatedAccounts[i].status=="active")
    //       {
    //         this.selectAccountDetails=this.associatedAccounts[i];
    //       }

    //     }
    //     if((!this.selectAccountDetails) || this.selectAccountDetails=="null"  || this.selectAccountDetails==undefined){
    //       this.selectAccountDetails=this.associatedAccounts[0];
    //     }

    //   }

    //   for(let i=0;i<this.associatedAccounts.length;i++)
    //   {
    //     if(this.associatedAccounts[i].status=="active")
    //     {
    //       this.loginusername=this.associatedAccounts[i].userFullName;
    //     }
    //   }
    //   if(!this.loginusername){
    //     this.loginusername=this.domain;
    //   }
    //   // if(this.associatedAccounts.length==1){
    //   //   this.loginusername=this.associatedAccounts[0].userFullName;
    //   // }
    //   if(this.loginusername==this.domain){
    //     this.extractFirstLetter();
    //   }
    //   else{
    //   this.extractProfiledisplayname();
    //   }
  }

  initControlList() {
    const appControlListSub = this.authService.appControlList$.subscribe(
      (res) => {
        this.currentAppControlList = res;
      }
    );

    this.subscription?.add(appControlListSub);
  }

  extractFirstLetter() {
    const firstLetter = this.domain.charAt(0);
    this.profile_display = firstLetter;
    this.profile_display = this.profile_display.toUpperCase();
    this.setprofilebackground(this.profile_display);
  }
  extractProfiledisplayname() {
    const name = this.loginusername;
    //match the spaces
    // var matches = name.split(/(?<=^\S+)\s/)
    const matches = name.split(' ');
    const firstName = matches[0];
    const lastName = matches[1] ? matches[1] : '';
    const firstLetter = firstName ? firstName.charAt(0) : '';
    const secondLetter = lastName ? lastName.charAt(0) : '';
    this.profile_display = firstLetter.concat(secondLetter);
    this.profile_display = this.profile_display.toUpperCase();
    this.setprofilebackground(this.profile_display);
  }
  clearcontent() {
    if ($('#searchBoxId') && $('#searchBoxId').length) {
      $('#searchBoxId')[0].value = '';
      this.field_name = '';
    }
  }

  setprofilebackground(displayname?) {
    // to find in series1
    for (let i = 0; i < this.alphabetSeries1.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries1[i]) {
        document.getElementById('profiledisplay').style.backgroundColor =
          '#AA336A';
        document.getElementById('profiledisplay1').style.backgroundColor =
          '#AA336A';
        document.getElementById('profiledisplaydrop').style.backgroundColor =
          '#AA336A';
      }
    }
    // to find in series2
    for (let i = 0; i < this.alphabetSeries2.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries2[i]) {
        document.getElementById('profiledisplay').style.backgroundColor =
          '#006400';
        document.getElementById('profiledisplay1').style.backgroundColor =
          '#006400';
        document.getElementById('profiledisplaydrop').style.backgroundColor =
          '#006400';
      }
    }
    // to find in series3
    for (let i = 0; i < this.alphabetSeries3.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries3[i]) {
        document.getElementById('profiledisplay').style.backgroundColor =
          '#C71585';
        document.getElementById('profiledisplay1').style.backgroundColor =
          '#C71585';
        document.getElementById('profiledisplaydrop').style.backgroundColor =
          '#C71585';
      }
    }
    // to find in series4
    for (let i = 0; i < this.alphabetSeries4.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries4[i]) {
        document.getElementById('profiledisplay').style.backgroundColor =
          '#6A5ACD';
        document.getElementById('profiledisplay1').style.backgroundColor =
          '#6A5ACD';
        document.getElementById('profiledisplaydrop').style.backgroundColor =
          '#6A5ACD';
      }
    }
    // to find in series5
    for (let i = 0; i < this.alphabetSeries5.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries5[i]) {
        document.getElementById('profiledisplay').style.backgroundColor =
          '#B22222';
        document.getElementById('profiledisplay1').style.backgroundColor =
          '#B22222';
        document.getElementById('profiledisplaydrop').style.backgroundColor =
          '#B22222';
      }
    }
  }

  switchAccountInternal(account) {
    window[this.storageType].setItem(
      'selectedAccount',
      JSON.stringify(account)
    );
    this.selectAccountDetails = window[this.storageType].getItem(
      'selectedAccount'
    )
      ? JSON.parse(window[this.storageType].getItem('selectedAccount'))
      : {};
    // let prDetails = JSON.parse(localStorage.getItem('krPreviousState'))
    //       if(prDetails){
    //         prDetails.formAccount=true;
    //         localStorage.setItem('krPreviousState', JSON.stringify(prDetails));

    //       }
    //       this.router.navigate([''], { skipLocationChange: true })
    // this.getAllOtherWorkspaces(account['accountId'])
    this.redirectHome();
    window.location.reload();
  }

  openBrowseWorkspace(value) {
    if (value) {
      this.browseWorkspaceRef = this.browseWorkspace.open();
    }
    const selectAccountDetail = window[this.storageType].getItem(
      'selectedAccount'
    )
      ? JSON.parse(window[this.storageType].getItem('selectedAccount'))
      : {};
    let accountId;
    if (
      !selectAccountDetail ||
      selectAccountDetail == 'null' ||
      selectAccountDetail == undefined
    ) {
      accountId = this.currentAppControlList?.accountId;
    } else {
      accountId = selectAccountDetail.accountId;
    }
    //let accountId = this.currentAppControlList?.accountId
    this.loadingContent = true;
    this.loadingProgress = true;
    const header: any = {
      AccountId: accountId,
    };

    // https://qa1-bots.kore.ai/api/1.1/builder/allowedDomains?rnd=0yiw5b
    // AccountId: 626f77fd38535539c9882b4a
    this.service
      .invoke('app.allowedDomains', {}, {}, header)
      .subscribe((res) => {
        if (res) {
          this.loadingProgress = false;
          this.WorkspaceList = res;
          const requestedAccounts =
            this.currentAppControlList?.requestedAccounts;

          for (let index = 0; index < this.WorkspaceList.length; index++) {
            const element = this.WorkspaceList[index];
            if (!this.WorkspaceList[index].displayName) {
              this.WorkspaceList[index]['displayName'] = '';
            }
            if (!this.WorkspaceList[index].accountName) {
              this.WorkspaceList[index]['accountName'] = '';
            }
            if (!this.WorkspaceList[index].userFullName) {
              this.WorkspaceList[index]['userFullName'] = '';
            }
            const splitBy = '/';
            if (this.WorkspaceList[index]['accountName'].includes('/')) {
              this.WorkspaceList[index]['accountName'] =
                this.WorkspaceList[index]['accountName'].split(splitBy)[1];
            }
            const avatar = this.WorkspaceList[index]['displayName']
              ? this.WorkspaceList[index]['displayName']
              : '';

            const avatar2 = this.WorkspaceList[index]['accountName']
              ? this.WorkspaceList[index]['accountName']
              : '';
            const splitor =
              this.WorkspaceList[index]['accountName'].includes('.');
            let fullName;
            if (splitor) {
              fullName = this.WorkspaceList[index]['accountName']
                .split('@')[0]
                .split('.');
            } else {
              fullName = this.WorkspaceList[index]['accountName']
                .split('@')[0]
                .split('_');
            }
            const firstName = fullName[0];
            const lastName = fullName[fullName.length - 1];

            const firstLetter = firstName.charAt(0);
            const secondLetter = lastName.charAt(0);
            if (avatar2.length > 0) {
              const displayShortName = (firstLetter + secondLetter)
                .trim()
                .toUpperCase();
              this.WorkspaceList[index]['accountShortName'] = displayShortName;
              this.setAssociateprofilebackground(
                this.WorkspaceList,
                displayShortName,
                index
              );
            }

            if (!(avatar.length > 0)) {
              this.WorkspaceList[index]['displayShortName'] = '';
            }
          }
          this.cancelButton();
          if (this.WorkspaceList.length == 0) {
            this.emptyContent = true;
          } else {
            this.emptyContent = false;
          }
        }
      });
  }

  cancelButton() {
    const requestedAccounts = this.currentAppControlList?.requestedAccounts;
    for (let index = 0; index < this.WorkspaceList?.length; index++) {
      const element = this.WorkspaceList[index];
      for (let i = 0; i < requestedAccounts?.length; i++) {
        const account = requestedAccounts[i];
        if (element._id == account.acctId) {
          const obj = {
            accountId: element._id,
            accountName: element.accountName,
            accountType: element.accountType,
            adminPreferences: { autoApproval: true, autoAssignment: false },
            associate_profile_display:
              element.accountShortName || element.displayShortName,
            canAccessWorkbench: false,
            canCreateBot: true,
            color: element.color,
            customerLicenseType: 'Online',
            displayName: element.displayName
              ? element.displayName
              : element.accountName,
            enableDebugInfo: true,
            hasDataTableAndViewAccess: true,
            isDeveloper: true,
            isFreeDomain: false,
            licenses: [],
            orgId: '',
            permissions: [],
            preferences: { defaultAccountId: element._id },
            roles: [],
            userFullName: element.userFullName
              ? element.userFullName
              : element.accountName.split('@')[0],
          };
          this.associatedRedAccounts.push(obj);
          this.WorkspaceList.splice(index, 1);
        }
      }
      // const key = 'accountId';
      // let arrayUniqueByKey = [...new Map(this.associatedRedAccounts.map(item => [item[key], item])).values()];
      // this.associatedAccounts = [...this.associatedAccounts, ...arrayUniqueByKey]
      // this.associatedAccounts = [...new Map(this.associatedAccounts.map(item => [item[key], item])).values()];
    }
  }

  redirectHome() {
    let prDetails;
    if (localStorage.getItem('krPreviousState')) {
      prDetails = JSON.parse(localStorage.getItem('krPreviousState'));
    }
    if (prDetails) {
      prDetails.route = '/';
      localStorage.setItem('krPreviousState', JSON.stringify(prDetails));
    }
    this.router.navigate(['/'], { skipLocationChange: true });
  }
  loadHeader() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId) {
        // this.getcustomizeList(20,0);
        this.selectedApp = this.workflowService.selectedApp();
        this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
      }
    }
  }
  metricsOption(menu) {
    this.analyticsClick(menu, true);
    this.router.navigate([menu], { skipLocationChange: true });
  }

  openRoute(path) {
    this.router.navigate([path], { skipLocationChange: true });
  }

  analyticsClick(menu, skipRouterLink?) {
    if (!menu) {
      // this.router.navigateByUrl('/', { skipLocationChange: true });
      return;
    }

    this.mainMenu = menu;
    if (
      this.menuItems?.anlytics?.includes(menu) ||
      menu == '/summary' ||
      menu == '/'
    ) {
      this.showMainMenu = false;
    } else {
      this.showMainMenu = true;
      if (this.menuItems?.sources?.includes(menu)) {
        this.sourcesFlag = true;
        this.menuFlag = false;
      } else if (this.menuItems?.manage?.includes(menu)) {
        this.menuFlag = true;
        this.sourcesFlag = false;
        if (this.isRouteDisabled) menu = '/pricing';
      } else {
        this.menuFlag = false;
        this.sourcesFlag = false;
        this.resetNotificationBadge();
        if (this.pollingSubscriber) {
          this.pollingSubscriber.unsubscribe();
        }
      }
    }
    //this.resetPreviousState(menu)
    if (!skipRouterLink) {
      this.router.navigate([menu], { skipLocationChange: true });
    }

    this.showMenu.emit(this.showMainMenu);
    this.settingMenu.emit(this.menuFlag);
    this.showSourceMenu.emit(this.sourcesFlag);
  }
  resetPreviousState(menu) {
    let prDetails;
    if (localStorage.getItem('krPreviousState')) {
      prDetails = JSON.parse(localStorage.getItem('krPreviousState'));
    }
    if (prDetails) {
      prDetails.route = menu;
      localStorage.setItem('krPreviousState', JSON.stringify(prDetails));
    }
  }
  logoutClick() {
    this.authService.logout();
  }
  toggleSearch(activate) {
    this.searchActive = activate;
    if (!activate) {
      this.searchText = '';
    }
  }
  focusinSearch() {
    if (this.activeClose) {
      this.activeClose = false;
      return;
    }
    this.showSearch = !this.showSearch;
    setTimeout(() => {
      document.getElementById('globalSearch').focus();
    }, 100);
  }
  focusoutSearch() {
    this.searchText = '';
    this.searchActive = false;
    if (this.activeSearch) {
      this.activeClose = true;
    }
    this.showSearch = !this.showSearch;
  }
  triggerRoute(type, routObj?) {
    let queryParams: any = {};
    if (type) {
      setTimeout(() => {
        const slectedRoute = _.filter(this.availableRouts, {
          displayName: this.searchText.displayName,
        });
        if (slectedRoute && slectedRoute.length) {
          queryParams = slectedRoute[0].quaryParms || {};
          this.router.navigate([slectedRoute[0].routeId], {
            skipLocationChange: true,
            queryParams,
          });
          this.analyticsClick(slectedRoute[0].routeId, true);
        }
      }, 100);
    } else if (routObj && routObj.routeId) {
      queryParams = routObj.quaryParms || {};
      this.router.navigate([routObj.routeId], {
        skipLocationChange: true,
        queryParams,
      });
    }
  }
  removeCallFlowExpand() {
    const toogleObj = {
      title: 'Dashboard',
      toShowWidgetNavigation: this.workflowService.showAppCreationHeader(),
    };
    $('.dashboardContainer').removeClass('callFlowExpand');
    this.pagetitle = toogleObj.title;
    this.toShowAppHeader = toogleObj.toShowWidgetNavigation;
    this.fromCallFlow = '';
    this.ref.detectChanges();
  }
  //FOR TRAINING
  train() {
    if (!this.training) {
      const selectedApp = this.workflowService.selectedApp();
      if (
        selectedApp &&
        selectedApp.searchIndexes &&
        selectedApp.searchIndexes.length
      ) {
        const payload = {
          indexPipelineId: this.workflowService.selectedIndexPipeline(),
        };
        const quaryparms = {
          searchIndexId: selectedApp.searchIndexes[0]._id,
        };
        this.service.invoke('train.app', quaryparms, payload).subscribe(
          (res) => {
            if (res) {
              setTimeout(() => {
                this.training = true;
                this.poling();
              }, 200);
            }
          },
          (errRes) => {
            this.training = false;
            this.errorToaster(errRes, 'Failed to train the app');
          }
        );
      }
    } else {
      this.stopTrain();
      this.notificationService.notify('Stoping Train Initiated', 'success');
    }
  }
  //SHOWING STOP BUTTON
  displayStopTrain() {
    if (this.training) {
      this.countTrainAction = this.countTrainAction + 1;
      this.countTrainAction > 1
        ? (this.showClose = true)
        : (this.showClose = false);
    } else {
      this.countTrainAction = 0;
    }
  }
  displayStopTrainLeave() {
    this.countTrainAction = 0;
    this.displayStopTrain();
  }
  //FOR STOPING TRAIN
  stopTrain() {
    this.training = false;
    const selectedApp = this.workflowService.selectedApp();
    const quaryparms = {
      searchIndexId: selectedApp.searchIndexes[0]._id,
      jobId: this.dockersList[0]._id,
    };
    const payload = {
      indexPipelineId: this.workflowService?.selectedIndexPipeline(),
    };
    this.service.invoke('stopTrain.app', quaryparms, payload).subscribe(
      (res) => {
        if (res && !this.training) {
          this.notificationService.notify(
            'Training has been stopped',
            'success'
          );
        }
      },
      (errRes) => {
        this.training = true;
        this.showClose = false;
        this.notificationService.notify('Failed to stop training', 'error');
      }
    );
  }
  switchAccount() {
    localStorage.removeItem('selectedAccount');
    localStorage.setItem(
      'queryParams',
      JSON.stringify({
        return_to: this.appUrlsService.completeAppPath(),
        showLogin: 'true',
        // comingFromKey: 'isFindlyApp',
        checkSwitchfrom: 'business-app',
        hideSSOButtons: 'true',
        hideResourcesPageLink: 'true',
      })
    );
    const jStoarge = window[this.storageType].getItem('jStorage')
      ? JSON.parse(window[this.storageType].getItem('jStorage'))
      : {};
    if (jStoarge.currentAccount.accountConf) {
      jStoarge.currentAccount['accountConf'] = false;
      window[this.storageType].setItem('jStorage', JSON.stringify(jStoarge));
    }
    window.location.href = this.appUrlsService.marketURL();
  }
  // CHECKING TRAINING STATUS
  checkTrainStatus(dockersList) {
    const trainStatus = dockersList?.filter(
      (data) => data.jobType === 'TRAINING'
    );
    this.training =
      trainStatus[0]?.status !== 'INPROGRESS' && this.training ? false : true;
    if (trainStatus[0]?.status == 'SUCCESS')
      this.notificationService.notify('Training Successfully', 'success');
  }

  poling(recordStatistics?, updateRecordsWithRead?) {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    };
    this.pollingSubscriber = interval(10000)
      .pipe(startWith(0))
      .subscribe(() => {
        this.service.invoke('get.dockStatus', queryParms).subscribe(
          (res) => {
            /**made changes on 09/03 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 536 line*/
            // if((!res) || !res.dockStatuses.length){
            if (!res || !res.length) {
              this.training = false;
              this.isAnyRecordInprogress = false;
            }
            this.statusDockerLoading = false;
            /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 543 line*/
            // this.dockersList = JSON.parse(JSON.stringify(res.dockStatuses));
            this.dockersList = JSON.parse(JSON.stringify(res));
            /**made code updates in line no 503 on 03/01 added new condition for success and jobType,since SUCCESS is updated to success and action is updated to jobType and TRAIN has been updated to TRAINING */
            // if (this.trainingInitiated && this.dockersList[0].status === 'SUCCESS' && this.dockersList[0].action === "TRAIN") {
            // if (this.training) {
            //   this.checkTrainStatus(this.dockersList);
            // }
            this.dockersList.forEach((record: any) => {
              record.createdOn = format(
                new Date(record.createdOn),
                'do LLL yyyy | h:mm aa'
              );
              if (
                this.training ||
                (record.jobType === 'TRAINING' &&
                  record.status === 'INPROGRESS')
              ) {
                this.checkTrainStatus(this.dockersList);
              }
              /**added condition for success on 24/02 in line 519 as per new api contract since SUCCESS is updated to success */
              // if ((record.status === 'SUCCESS') && record.fileId && (record.store && !record.store.toastSeen)) {
              if (
                (record.status === 'SUCCESS' || record.status === 'success') &&
                record.fileId &&
                record.store &&
                !record.store.toastSeen
              ) {
                /**added condition for jobType in 570,since we are no longer recieving action in jobs api response,using the jobType for condition check as per new api contract 10/03 */
                // if (record.action === 'EXPORT') {
                if (record.jobType === 'DATA_EXPORT') {
                  this.downloadDockFile(
                    record.fileId,
                    record.store.urlParams,
                    record.streamId,
                    record._id
                  );
                }
              }
            });
            /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 413 line*/
            // const queuedJobs = _.filter(res.dockStatuses, (source) => {
            const queuedJobs = _.filter(res, (source) => {
              /** added condition for running and INPROGRESS on 24/02 in line 531 as per new api contract since IN_Progress is updated to running */
              // return ((source.status === 'IN_PROGRESS') || (source.status === 'QUEUED') || (source.status === 'validation'));
              return (
                source.status === 'IN_PROGRESS' ||
                source.status === 'INPROGRESS' ||
                source.status === 'running' ||
                source.status === 'QUEUED' ||
                source.status === 'validation'
              );
            });

            if (recordStatistics) {
              /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 421 line*/
              // this.readDocs = _.filter(res.dockStatuses, (source) => {
              this.readDocs = _.filter(res, (source) => {
                return source.read && source.read === true;
              });
              /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 427 line*/
              // this.unReadDocs = _.filter(res.dockStatuses, (source) => {
              this.unReadDocs = _.filter(res, (source) => {
                return source.read === false;
              });
              recordStatistics = false;
            }

            if (updateRecordsWithRead) {
              setTimeout(() => {
                this.makeNotificationsRead();
              }, 500);
              updateRecordsWithRead = false;
            }

            if (this.unReadDocs && this.unReadDocs.length) {
              const successElements = this.unReadDocs.filter((element) => {
                /**made code updates in line no 563 on 03/01 added new condition for success,since SUCCESS is upadted to success*/
                // if (element && element.status === 'SUCCESS') {
                if (
                  element &&
                  (element.status === 'SUCCESS' || element.status === 'success')
                ) {
                  return element;
                }
              });
              const failureElements = this.unReadDocs.filter((element) => {
                /**made code updates in line no 572 on 03/01 added new condition for FAILED,since FAILURE is updated to FAILED as per new api contract*/
                // if (element && element.status === 'FAILURE') {
                if (
                  element &&
                  (element.status === 'FAILURE' || element.status === 'FAILED')
                ) {
                  return element;
                }
              });
              if (failureElements && failureElements.length) {
                this.isAnyRecordFailed = true;
                this.isAnyRecordCompleted = false;
                this.isAnyRecordInprogress = false;
              } else if (successElements && successElements.length) {
                this.isAnyRecordFailed = false;
                this.isAnyRecordCompleted = true;
                this.isAnyRecordInprogress = false;
              }
            } else {
              this.isAnyRecordCompleted = false;
              this.isAnyRecordFailed = false;
            }

            if (queuedJobs && queuedJobs.length) {
              // console.log(queuedJobs);
              this.isAnyRecordInprogress = true;
              this.isAnyRecordCompleted = false;
              this.isAnyRecordFailed = false;
            } else {
              // this.resetNotificationBadge();
              this.isAnyRecordInprogress = false;
              this.pollingSubscriber.unsubscribe();
            }
            this.checkJObStatus(this.dockersList);
          },
          (errRes) => {
            this.pollingSubscriber.unsubscribe();
            if (
              errRes &&
              errRes.error &&
              errRes.error.errors &&
              errRes.error.errors.length &&
              errRes.error.errors[0].msg
            ) {
              this.notificationService.notify(
                errRes.error.errors[0].msg,
                'error'
              );
            } else {
              this.notificationService.notify(
                'Failed to get Status of Docker.',
                'error'
              );
            }
          }
        );
      });
  }
  // CHECK FOR THE INPROGRESS JOB
  checkJObStatus(dockersList) {
    const statusArr: any = [];
    dockersList.forEach((element) => {
      statusArr.push(element.status);
    });
    const Statusvalues = [
      'SUCCESS',
      'FAILED',
      'HALTED',
      'STOPPED',
      'CONFIGURED',
      'halted',
      'success',
      'failed',
    ];
    this.disableClearAll = !statusArr.some((item) =>
      Statusvalues.includes(item)
    );
  }

  getStatusView(status, other?) {
    if (other) {
      /**made code updates in line no 619 on 03/01 added new condition for halted,since HALTED is updated to halted as per new api contract*/
      // if (status === 'HALTED'){
      if (status === 'HALTED' || status === 'halted') {
        return 'Stopped';
      } else if (status === 'QUEUED' || status === 'queued') {
        return 'In-Queue';
      }
      /**updated condition in line no 617 on 24/02,added condition for running since in_progress is updated to running as per new api contract  */
      // else if (status === 'IN_PROGRESS' || status === 'validation') {
      else if (
        status === 'IN_PROGRESS' ||
        status === 'INPROGRESS' ||
        status === 'in_progress' ||
        status === 'inprogress' ||
        status === 'running' ||
        status === 'RUNNING' ||
        status === 'validation' ||
        status === 'VALIDATION'
      ) {
        return 'In-progress';
      }
      /**made code updates in line no 630 on 03/01 added new condition for FAILED,since FAILURE is updated to FAILED as per new api contract*/
      // else if (status === 'FAILURE') {
      else if (
        status === 'FAILURE' ||
        status === 'FAILED' ||
        status === 'failed' ||
        status === 'failure'
      ) {
        return 'Failed';
      }
    } else {
      /**made code updates in line no 1905 on 03/01 added new condition for success,since SUCCESS is upadted to success*/
      // if (status === 'SUCCESS') {
      if (status === 'SUCCESS' || status === 'success') {
        return true;
      } else {
        return false;
      }
    }
  }

  navigateTo(task) {
    if (task.jobType === 'faq' || task.jobType == 'FINDLY_FAQS_IMPORT') {
      this.router.navigate(['/faqs'], { skipLocationChange: true });
      setTimeout(() => {
        this.headerService.openFaqExtracts();
      }, 300);
    } else if (task.jobType === 'web' || task.jobType == 'file') {
      this.router.navigate(['/content'], { skipLocationChange: true });
    } else if (task.jobType == 'STRUCTURED_DATA_INGESTION') {
      this.router.navigate(['/structuredData'], { skipLocationChange: true });
    }
    this.headerService.updateShowHideMainMenu(true);
    this.headerService.updateShowHideSettingsMenu(false);
    this.headerService.updateShowHideSourceMenu(true);
  }

  removeRecord(task, index) {
    if (task._id) {
      // this.statusDockerLoading = true;
      const queryParms = {
        searchIndexId: this.workflowService.selectedSearchIndexId,
        id: task._id,
        statusType: task.statusType,
      };
      this.service.invoke('delete.dockById', queryParms).subscribe(
        (res) => {
          this.statusDockerLoading = true;
          this.dockersList.splice(index, 1);
          // this.notificationService.notify(res.msg, 'success');
          this.statusDockerLoading = false;
        },
        (errRes) => {
          this.statusDockerLoading = false;
          this.errorToaster(errRes, 'Failed to get Status of Docker.');
        }
      );
    } else {
      this.notificationService.notify('Failed to remove this Job.', 'error');
    }
  }

  clearAllRecords() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    };
    this.service.invoke('delete.clearAllDocs', queryParms).subscribe(
      (res) => {
        this.statusDockerLoading = true;
        // this.dockersList = [];
        this.poling();
        // this.notificationService.notify(res.msg, 'success');
      },
      (errRes) => {
        this.statusDockerLoading = false;
        this.errorToaster(errRes, 'Failed to get Status of Docker.');
      }
    );
  }

  recrawl(record) {
    const quaryparms: any = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
      sourceId: record.extractionSourceId,
      sourceType: record.statusType,
    };
    this.service.invoke('recrwal', quaryparms).subscribe(
      (res) => {
        this.poling();
        this.notificationService.notify(
          'Recrwaled with status : ' + res.recentStatus,
          'success'
        );
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

  errorToaster(errRes, message) {
    if (
      errRes &&
      errRes.error &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }

  downloadDockFile(fileId, fileName, streamId, dockId) {
    const params = {
      fileId,
      streamId: streamId,
      dockId: dockId,
      jobId: dockId,
      sidx: this.serachIndexId,
    };
    const payload = {
      store: {
        toastSeen: true,
        urlParams: fileName,
      },
    };
    this.service.invoke('attachment.file', params).subscribe(
      (res) => {
        const hrefURL = res.fileUrl + fileName;
        window.open(hrefURL, '_self');
        this.service
          .invoke('put.dockStatus', params, payload)
          .subscribe((res) => {});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  resetNotificationBadge() {
    this.isAnyRecordInprogress = false;
    this.isAnyRecordCompleted = false;
    this.isAnyRecordFailed = false;
  }

  ngOnDestroy() {
    this.pollingSubscriber ? this.pollingSubscriber.unsubscribe() : null;
    this.dockServiceSubscriber
      ? this.dockServiceSubscriber.unsubscribe()
      : null;
    this.routeChanged ? this.routeChanged.unsubscribe() : null;
    this.updateHeaderMainMenuSubscription
      ? this.updateHeaderMainMenuSubscription.unsubscribe()
      : false;
    this.indexSubscription ? this.indexSubscription.unsubscribe() : null;
    this.subscription ? this.subscription.unsubscribe() : null;
    this.topicGuideShowSubscription
      ? this.topicGuideShowSubscription.unsubscribe()
      : null;
    this.currentSubsciptionData
      ? this.currentSubsciptionData?.unsubscribe()
      : null;
  }
  //get all apps
  getAllApps() {
    const allAppsSub = this.store
      .select(selectAppId)
      .pipe(withLatestFrom(this.appsService.getApps()))
      .subscribe(([appId, res]) => {
        this.appsnum = res;
        if (appId) {
          this.recentApps = res.filter((app) => app._id != appId).slice(0, 5);
        }
      });

    this.subscription?.add(allAppsSub);

    // this.service.invoke('get.apps').subscribe((res) => {
    //   this.appsnum = res;
    //   this.checkroute();

    //   // if(this.appsnum.length==="undefined" || this.appsnum.length==0){
    //   //   this.routeFlag=true;
    //   // }
    //   // else if(this.appsnum.length){
    //   //   this.routeFlag=false;
    //   // }
    //   // console.log("check flag")
    //   const app_id = this.workflowService?.selectedApp();
    //   if (app_id) {
    //     this.recentApps = res
    //       .filter((app) => app._id != app_id._id)
    //       .slice(0, 5);
    //   }
    // });
  }
  checkroute() {
    this.headerService.fromCallFlowExpand.subscribe((data: any) => {
      this.fromCallFlow = data.title;
      this.toShowAppHeader = false;
      this.pagetitle = '';
      this.ref.detectChanges();
    });

    this.showSwichAccountOption =
      this.localStoreService.getAssociatedAccounts().length > 1;
    this.search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map((term) =>
          term === ''
            ? []
            : this.availableRouts
                .filter(
                  (v) =>
                    (v.displayName || '')
                      .toLowerCase()
                      .indexOf(term.toLowerCase()) > -1
                )
                .slice(0, 10)
        )
      );
    this.formatter = (x: { displayName: string }) => x.displayName || '';

    if (
      localStorage.krPreviousState == '{}' ||
      localStorage.krPreviousState == 'null' ||
      localStorage.krPreviousState == undefined
    ) {
      //this.analyticsClick('/home');
    } else if (
      localStorage.krPreviousState &&
      JSON.parse(localStorage.krPreviousState)
    ) {
      if (this.appsnum.length === 'undefined' || this.appsnum.length == 0) {
        this.analyticsClick(
          JSON.parse(localStorage.krPreviousState).route,
          true
        );
      } else {
        this.analyticsClick(
          JSON.parse(localStorage.krPreviousState).route,
          false
        );
      }
    }

    this.updateHeaderMainMenuSubscription =
      this.headerService.headerMainMenuUpdate.subscribe((res) => {
        if (res) {
          this.mainMenu = res;
        }
      });
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.loadHeader();
    this.indexSubscription =
      this.appSelectionService.appSelectedConfigs.subscribe((res) => {
        this.subscription = this.appSelectionService.queryConfigs.subscribe(
          (res) => {
            this.loadHeader();
          }
        );
      });
    this.workflowService.mainMenuRouter$.subscribe((route) => {
      this.mainMenu = route;
    });
    this.selectAccountDetails = window[this.storageType].getItem(
      'selectedAccount'
    )
      ? JSON.parse(window[this.storageType].getItem('selectedAccount'))
      : {};
    this.associatedAccounts = window[this.storageType].getItem('jStorage')
      ? JSON.parse(window[this.storageType].getItem('jStorage')).currentAccount
          .associatedAccounts
      : {};
    this.domain = window[this.storageType].getItem('jStorage')
      ? JSON.parse(window[this.storageType].getItem('jStorage')).currentAccount
          .domain
      : '';
    if (this.selectAccountDetails == null) {
      for (
        let i = 0;
        i < this.currentAppControlList?.associatedAccounts.length;
        i++
      ) {
        if (
          this.currentAppControlList?.associatedAccounts[i].status == 'active'
        ) {
          this.associatedAccounts =
            this.currentAppControlList?.associatedAccounts;
          this.selectAccountDetails =
            this.currentAppControlList?.associatedAccounts[i];
        }
      }
      if (
        !this.selectAccountDetails ||
        this.selectAccountDetails == 'null' ||
        this.selectAccountDetails == undefined
      ) {
        this.selectAccountDetails = this.associatedAccounts[0];
      }
    }

    for (let i = 0; i < this.associatedAccounts.length; i++) {
      if (this.associatedAccounts[i].status == 'active') {
        this.loginusername = this.associatedAccounts[i].userFullName;
      }
    }
    if (!this.loginusername) {
      this.loginusername = this.domain;
      this.extractFirstLetter();
    } else {
      this.extractProfiledisplayname();
    }
    for (let i = 0; i < this.associatedAccounts.length; i++) {
      // this.extractAssociatedisplayname(this.associatedAccounts[i].userFullName,i)
      this.extractAssociatedisplayname(
        this.associatedAccounts[i].accountName,
        i
      );
    }
    this.extractAssociatedisplayname(this.selectAccountDetails.accountName);
  }

  extractAssociatedisplayname(empmail, i?) {
    const splitor = empmail.includes('.');
    let fullName;
    if (splitor) {
      fullName = empmail.split('@')[0].split('.');
    } else {
      fullName = empmail.split('@')[0].split('_');
    }
    const firstName = fullName[0];
    const lastName = fullName[fullName.length - 1];

    const firstLetter = firstName.charAt(0);
    const secondLetter = lastName.charAt(0);
    if (i > -1) {
      this.associatedAccounts[i]['associate_profile_display'] = firstLetter
        .concat(secondLetter)
        .toUpperCase();

      setTimeout(() => {
        this.setAssociateprofilebackground(
          this.associatedAccounts,
          this.associatedAccounts[i]['associate_profile_display'],
          i
        );
      }, 1000);
    } else {
      this.selected_profile_display = firstLetter.concat(secondLetter);
      this.selected_profile_display =
        this.selected_profile_display.toUpperCase();
      this.setAssociateprofilebackground([], this.selected_profile_display);
    }
  }

  setAssociateprofilebackground(array?, displayname?, index?) {
    // to find in series1
    for (let i = 0; i < this.alphabetSeries1.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries1[i]) {
        index > -1 && array.length > 0
          ? (array[index]['color'] = '#AA336A')
          : (document.getElementById('selected_profile').style.backgroundColor =
              '#AA336A');
      }
    }
    // to find in series2
    for (let i = 0; i < this.alphabetSeries2.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries2[i]) {
        index > -1 && array.length > 0
          ? (array[index]['color'] = '#006400')
          : (document.getElementById('selected_profile').style.backgroundColor =
              '#006400');
      }
    }
    // to find in series3
    for (let i = 0; i < this.alphabetSeries3.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries3[i]) {
        index > -1 && array.length > 0
          ? (array[index]['color'] = '#C71585')
          : (document.getElementById('selected_profile').style.backgroundColor =
              '#C71585');
      }
    }
    // to find in series4
    for (let i = 0; i < this.alphabetSeries4.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries4[i]) {
        index > -1 && array.length > 0
          ? (array[index]['color'] = '#6A5ACD')
          : (document.getElementById('selected_profile').style.backgroundColor =
              '#6A5ACD');
      }
    }
    // to find in series5
    for (let i = 0; i < this.alphabetSeries5.length; i++) {
      if (displayname.charAt(0) === this.alphabetSeries5[i]) {
        index > -1 && array.length > 0
          ? (array[index]['color'] = '#B22222')
          : (document.getElementById('selected_profile').style.backgroundColor =
              '#B22222');
      }
    }
  }
  //sort apps
  // prepareApps(apps) {
  //   this.recentApps = apps.slice(0, 4);
  // }
  //open app
  openApp(app) {
    this.store.dispatch(
      setAppId({ appId: app._id, searchIndexId: app.searchIndexes[0]._id })
    );
    // $('#test-btn-launch-sdk').attr('disabled', 'disabled').button('refresh');
    this.training = false;
    this.appSelectionService.openApp(app);
    //this.appSelectionService.refreshSummaryPage.next('changed');
    this.appSelectionService.tourConfigCancel.next({
      name: undefined,
      status: 'pending',
    });
    this.router.navigateByUrl('/summary', { skipLocationChange: true });
    this.checkTrainingProgress();
    this.workflowService.selectedIndexPipelineId = '';
  }
  //check training in progress
  checkTrainingProgress() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    };
    // const appId = JSON.parse(localStorage.krPreviousState);
    this.service.invoke('get.dockStatus', queryParms).subscribe(
      (res) => {
        /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 675 line*/
        /** made changes in line 796 on 24/02,added condition for running since in_progress is updated to running as per new api contract */
        // const docStatus = res.dockStatuses.filter(data => data.action === 'TRAIN' && data.status === 'IN_PROGRESS');
        const docStatus = res.filter(
          (data) =>
            data.jobType === 'TRAINING' &&
            (data.status === 'IN_PROGRESS' ||
              data.status === 'INPROGRESS' ||
              data.status === 'running')
        );
        if (docStatus !== undefined && docStatus.length !== 0) {
          this.training = true;
        } else {
          this.training = false;
        }
      },
      (errRes) => {
        this.pollingSubscriber.unsubscribe();
        if (
          errRes &&
          errRes.error &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify(
            'Failed to get Status of Docker.',
            'error'
          );
        }
      }
    );
  }
  //create new app
  openCreateApp() {
    this.createAppPopRef = this.createAppPop.open();
  }
  //close app
  closeCreateApp() {
    this.createAppPopRef.close();
  }
  //create app
  createFindlyApp() {
    this.creatingInProgress = true;
    const payload: any = {
      name: this.newApp.name,
      icon: '',
      type: 'searchbot',
      description: this.newApp.description,
      skipMakeEditLinks: false,
      purpose: 'customer',
      errorCodes: {
        pollError: [],
      },
      visibility: {
        namespace: [],
        namespaceIds: [],
      },
      defaultLanguage: 'en',
    };
    this.service.invoke('create.app', {}, payload).subscribe(
      (res) => {
        this.notificationService.notify('App created successfully', 'success');
        this.closeCreateApp();
        this.newApp = {
          name: '',
          description: '',
        };
        this.creatingInProgress = false;
        this.openApp(res);
        // this.router.navigate(['/apps'], { skipLocationChange: true });
        // this.analyticsClick('apps', true)
      },
      (errRes) => {
        this.errorToaster(errRes, 'Error in creating app');
        this.creatingInProgress = false;
      }
    );
  }

  handleSearchSdk() {
    if (!this.isSdkBundleLoaded) {
      import('../../search-sdk/search-sdk.component').then(
        ({ SearchSdkComponent }) => {
          this.isSdkBundleLoaded = true;

          this.viewContainerRef.clear();
          const sdkCmpRef =
            this.viewContainerRef.createComponent(SearchSdkComponent);
        }
      );
    } else {
      this.searchSdkService.toggleSdkPopup();
    }
  }

  openOrCloseSearchSDK() {
    this.handleSearchSdk();

    this.loadHeader();
    if (this.queryPipelineId) {
      this.headerService.openSearchSDK(true);
      //this.loadHeader();
      this.getcustomizeList(20, 0);
      this.displayToolTip();
    } else {
      this.notificationService.notify(
        'Fetching queryPipeline ID...',
        'warning'
      );
      this.loadHeader();
      setTimeout(() => {
        if (this.queryPipelineId) {
          this.openSDKwithQuery();
        } else {
          this.openOrCloseSearchSDK();
        }
      }, 500);
    }
  }
  openSDKwithQuery() {
    // this.headerService.openSearchSDK(true);
    this.getcustomizeList(20, 0);
    this.displayToolTip();
  }
  getcustomizeList(limit?, skip?) {
    limit ? limit : 20;
    skip ? skip : 0;
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      limit: limit,
      skip: skip,
    };
    this.service.invoke('get.queryCustomizeList', quaryparms).subscribe(
      (res) => {
        if (res.data.length > 0) {
          this.headerService.fromResultRank(false);
        } else {
          this.headerService.fromResultRank(true);
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

  notificationIconClick() {
    setTimeout(() => {
      const notificationDropdown = $('#notification-dropdown');
      if (
        notificationDropdown.css('display') == 'block' &&
        notificationDropdown.hasClass('show')
      ) {
        this.poling(true, true);
      }
    }, 50);
  }

  checkRecordInDocs(key, record) {
    if (key === 'read') {
      const matched = this.readDocs.find((res) => {
        if (res._id === record._id) {
          return res;
        }
      });
      if (matched) {
        return true;
      } else {
        return false;
      }
    } else if (key === 'unread') {
      const matched = this.unReadDocs.find((res) => {
        if (res._id === record._id) {
          return res;
        }
      });
      if (matched) {
        return true;
      } else {
        return false;
      }
    }
  }

  makeNotificationsRead() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    };
    const payload = {
      ids: this.unReadDocs.map((doc) => {
        return doc._id;
      }),
    };
    if (payload.ids.length) {
      this.service.invoke('read.dockStatus', queryParms, payload).subscribe(
        (res) => {},
        (errRes) => {
          this.statusDockerLoading = false;
          this.errorToaster(errRes, 'Failed to update read Status of Docker.');
        }
      );
    }
  }

  displayToolTip() {
    setTimeout(() => {
      // console.log("isSDKOpen", this.headerService.isSDKOpen);
      if (this.headerService.isSDKOpen) {
        this.testButtonTooltip.tooltipClass = 'test-close-tooltip';
        this.testButtonTooltip._ngbTooltip =
          'Close Test mode by clicking on this button again.';
        this.testButtonTooltip.open();
        setTimeout(() => {
          this.testButtonTooltip.close();
          this.testButtonTooltip.tooltipClass = 'test-icon-tooltip';
          this.testButtonTooltip._ngbTooltip =
            'Preview & Customize search results.';
        }, 2000);
      }
    }, 1000);
  }
  validateSource() {
    let validField = true;
    if (!this.newApp.name) {
      $('#enterAppName').css('border-color', '#DD3646');
      $('#infoWarning').css({
        top: '58%',
        position: 'absolute',
        right: '1.5%',
        display: 'block',
      });
      this.notificationService.notify(
        'Enter the required field to proceed',
        'error'
      );
      validField = false;
    }
    if (validField) {
      this.createFindlyApp();
    }
  }
  inputChanged(type, i?) {
    if (type == 'enterName') {
      if (!this.newApp.name) {
        $('#infoWarning').show();
        $('#infoWarning').css({
          top: '58%',
          position: 'absolute',
          right: '1.5%',
          display: 'block',
        });
      } else {
        $('#infoWarning').hide();
      }
      $('#infoWarning').hide();
      $('#enterAppName').css(
        'border-color',
        this.newApp.name != '' ? '#BDC1C6' : '#DD3646'
      );
    }
  }
  /**opening slider component and closing slider  component  */
  openUserMetaTagsSlider() {
    this.currentRouteData = this.router.url;
    if (this.onboardingOpened == false) {
      this.sliderComponent.openSlider('#supportOnboarding', 'width500');
      this.onboardingOpened = true;
    } else if (this.onboardingOpened == true) {
      this.closeUserMetaTagsSlider();
    }
  }
  closeUserMetaTagsSlider() {
    if (this.onboardingOpened == true) {
      this.sliderComponent.closeSlider('#supportOnboarding');
      this.onboardingOpened = false;
      this.onBoardingComponent.closeSupport();
    }
    this.sliderComponent?.closeSlider('#supportOnboarding');
  }
  emitStatus(event) {
    this.displyStatusBar = event;
  }
  closeStatusBar() {
    if (this.displyStatusBar) {
      this.displyStatusBar = false;
    } else {
      this.displyStatusBar = true;
    }
    // this.closeStatus.emit(false);
  }
  //track checklist count and show count number
  trackChecklist() {
    const arr = [];
    const Index = [];
    this.tourData?.forEach((item) => {
      Object.keys(item).forEach((key) => {
        arr.push(item[key]);
      });
    });
    arr.map((item, index) => {
      if (item == false) Index.push(index);
    });

    let count = 0;
    for (const key in this.tourData) {
      for (const key1 in this.tourData[key]) {
        if (this.tourData[key][key1]) {
          count = count + 1;
        }
      }
    }
    this.checklistCount = count;
    this.percentCaluculate();
  }
  percentCaluculate() {
    if (this.checklistCount) {
      this.progressPrecent = (this.checklistCount / 6) * 100;
    } else {
      this.progressPrecent = 0;
    }
  }
  viewCheckList() {
    this.openUserMetaTagsSlider();
    this.onBoardingComponent.openCheckList();
    this.mixpanel.postEvent('SETUP - Enter Add data', {});
  }
  openSDK() {
    this.openOrCloseSearchSDK();
  }

  clearRecords(search: string) {
    if (search == 'workspace_search') {
      this.workspace_search = '';
    }
    if (search == 'field_name') {
      this.field_name = '';
    }
  }
  dropdownToggle() {
    this.field_name = '';
    this.workspace_search = '';
  }

  closeBrowseWorkspace() {
    if (this.browseWorkspaceRef && this.browseWorkspaceRef.close) {
      this.browseWorkspaceRef.close();
      if (this.isJoinedClicked) this.getAppControlListData();
    }
  }
  JoinWorkspace(workspace, i) {
    const payload: any[] = this.currentAppControlList?.requestedAccounts || [];
    payload.push({ acctId: workspace._id });
    // adding Header
    const selectAccountDetail = window[this.storageType].getItem(
      'selectedAccount'
    )
      ? JSON.parse(window[this.storageType].getItem('selectedAccount'))
      : {};
    let accountId;
    if (
      !selectAccountDetail ||
      selectAccountDetail == 'null' ||
      selectAccountDetail == undefined
    ) {
      accountId = this.currentAppControlList?.accountId;
    } else {
      accountId = selectAccountDetail.accountId;
    }
    const header: any = {
      AccountId: accountId,
    };
    // addeing Header
    //let accountId = this.currentAppControlList?.accountId
    const quaryparms: any = {
      type: 'joinAccount',
    };
    this.service
      .invoke('post.requestToDomains', quaryparms, payload, header)
      .subscribe(
        (res) => {
          if (res.ok === 1) {
            this.notifyAccount = true;
            this.isJoinedClicked = true;
            this.notifyAccountInfo = workspace.displayName
              ? `Successfully Joined ${workspace.displayName}`
              : `Successfully Joined ${workspace.accountName}`;

            for (let index = 0; index < this.WorkspaceList.length; index++) {
              const element = this.WorkspaceList[index];
              if (element._id == workspace._id) {
                this.WorkspaceList[index].alreadyJoined = true;
              }
            }
            // this.openBrowseWorkspace(false)
            setTimeout(() => {
              this.notifyAccount = false;
            }, 1000);
          }
        },
        () => {
          this.notifyAccountInfo = workspace.displayName
            ? `Failed to Join ${workspace.displayName}`
            : `Failed to Join ${workspace.accountName}`;
        }
      );
  }
  //appcontrol list API
  getAppControlListData() {
    this.associatedAccounts = [];
    // let _selectedAccountDetails = window[this.storageType].getItem('selectedAccount') ? JSON.parse(window[this.storageType].getItem('selectedAccount')) : null;
    //     if(_selectedAccountDetails && _selectedAccountDetails.userId){
    //       this.userId = _selectedAccountDetails.userId;
    //     }
    const quaryparms: any = { userId: this.userId };
    this.service.invoke('app.controls', quaryparms).subscribe(
      (res) => {
        this.associatedAccounts = res.associatedAccounts;
        const storage = window.localStorage.getItem('jStorage');
        const updateAssociatedAccounts = JSON.parse(storage);
        updateAssociatedAccounts.currentAccount.associatedAccounts =
          this.associatedAccounts;
        window.localStorage.setItem(
          'jStorage',
          JSON.stringify(updateAssociatedAccounts)
        );
        this.isJoinedClicked = false;

        for (let i = 0; i < this.associatedAccounts.length; i++) {
          this.extractAssociatedisplayname(
            this.associatedAccounts[i].accountName,
            i
          );
        }
      },
      (errRes) => {
        console.log('error', errRes);
      }
    );
  }
  getUserInfo() {
    const quaryparms: any = {
      id: this.authService.getUserId(),
    };
    this.service.invoke('get.userinfo', quaryparms).subscribe((res) => {
      this.accountIdRef = res[0].accountId;
    });
  }
  hideparentTooltip(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}
