import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { NotificationService } from '@kore.services/notification.service';
import { SideBarService } from '@kore.services/header.service';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { AuthService } from '@kore.services/auth.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { AppHeaderComponent } from '../app-header/app-header.component';
declare const $: any;
declare var PureJSCarousel: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apps-home',
  templateUrl: './apps-home.html',
  styleUrls: ['./apps-home.scss']
})
export class AppsListingComponent implements OnInit {
  authInfo: any;
  openJourney = false;
  saveInProgress = false;
  toShowAppHeader: boolean;
  demoType: string = '';
  SearchExperianceType: string = '';
  appsData: any;
  streamID: any;
  searchIndexID: any;
  demoOptions: boolean = false;
  createAppPopRef: any;
  onboardingpopupjourneyRef: any;
  loadingAppcreationRef: any;
  confirmatiomAppPopRef: any;
  detailsPopUpRef: any;
  creatingInProgress = false;
  searchApp = '';
  apps: any = [];
  progressBar: any = [];
  stepBar = 1;
  displayApp: boolean = false;
  hideWelcomepage: boolean = true;
  showSearchExperices: boolean = false;
  validateAppname: boolean = false;
  sharedApp = false;
  selectedApp: any;
  serachIndexId: any;
  strmId: any;
  confirmApp: any = '';
  validateName: any = '';
  appType: any;
  steps: any;
  displaydemoOptions: boolean = false;
  slectedAppId: any = '';
  slectedUnlinkAppId: any = '';
  unlinkPop = true;
  showSearch = false;
  submitted: boolean = false;
  activeClose = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  carousel: any = [];
  carouselTemplateCount = 0;
  searchFocusIn = false;
  newApp: any = {
    name: '',
    description: ''
  };
  appTypes = ['All', 'My', 'Shared'];
  sortBy = ['Created Date', 'Alphabetical Order'];
  userId: any;
  recentApps: any;
  currentPage: number = 1;
  testRepeat = false;
  createdAppData: any = {};
  pollingInterval;
  @ViewChild('createAppPop') createAppPop: KRModalComponent;
  @ViewChild('createBoardingJourney') createBoardingJourney: KRModalComponent;
  @ViewChild('loadingAppcreation') loadingAppcreation: KRModalComponent;
  @ViewChild('confirmatiomAppPop') confirmatiomAppPop: KRModalComponent;
  @ViewChild('detailsPopUp') detailsPopUp: KRModalComponent;
  @ViewChild('headerComp') headerComp: AppHeaderComponent;
  constructor(
    public localstore: LocalStoreService,
    private service: ServiceInvokerService,
    public workflowService: WorkflowService,
    private router: Router,
    private notificationService: NotificationService,
    private headerService: SideBarService,
    private appSelectionService: AppSelectionService,
    public authService: AuthService,
    public inlineManual: InlineManualService,
    private route: ActivatedRoute,
    public mixpanel: MixpanelServiceService
  ) {
    this.authInfo = localstore.getAuthInfo();
    this.userId = this.authService.getUserId();
  }

  ngOnInit() {
    $('.krFindlyAppComponent').removeClass('appSelected');
    //const apps = this.workflowService.findlyApps();
    //this.prepareApps(apps);
    this.getAllApps();
    setTimeout(() => {
      $('#serachInputBox').focus();
    }, 100);
    // this.buildCarousel();    
  }
  //call mixpanel api for tellmemore button
  callMixPanel() {
    this.mixpanel.postEvent('User Onboarding - Journey Started', {});
  }
  prepareApps(apps) {
    this.recentApps = apps.slice(0, 4);
    apps.sort((a, b) => {
      const bDate: any = new Date(b.lastModifiedOn);
      const aDate: any = new Date(a.lastModifiedOn);
      return bDate - aDate;
    });
    this.apps = apps;
  }
  openApp(app) {
    this.appSelectionService.tourConfigCancel.next({ name: undefined, status: 'pending' });
    const isDemo = this.appType == 'sampleData' ? true : false;
    this.appSelectionService.openApp(app, isDemo);
    this.workflowService.selectedIndexPipelineId = '';
  }
  openBoradingJourney() {
    this.headerService.openJourneyForfirstTime = true;
    this.onboardingpopupjourneyRef = this.createBoardingJourney.open();
    this.mixpanel.postEvent('User Onboarding - Journey Presented', {});
    this.mixpanel.postEvent('Welcome video Shown',{})
  }
  closeBoradingJourney() {
    if (this.onboardingpopupjourneyRef && this.onboardingpopupjourneyRef.close) {
      this.onboardingpopupjourneyRef.close();
      this.mixpanel.postEvent('User Onboarding - Journey Cancelled', {});
      this.mixpanel.postEvent('Welcome video Played',{})

    }
    // this.showBoarding = false;
  }

  progressBarFun(val, step) {
    this.stepBar = step;
    if (val) {
      this.progressBar = [];
      for (let i = 0; i < val; i++) {
        var obj = {
          class: 'active-bar'
        }

        this.progressBar.push(obj)
      }
    }
    else {
      this.progressBar = [];
    }
    // this.progressBar = val;
  }
  welcomeStep(type) {
    this.appType = type;
    this.steps = 'displayApp';
    // this.displayApp = true;
    this.hideWelcomepage = false;
  }

  exploreMyself() {
    this.displayApp = true;
    this.hideWelcomepage = false;
  }
  exploreSampleDate() {
    this.hideWelcomepage = false;
    if (this.steps == 'demoOptions' && this.demoType) {
      this.steps = 'showSearchExperience';
      this.SearchExperianceType ='top';
      this.progressBarFun(3, 2)
      this.mixpanel.postEvent('Explore App Type selected',{})
    }
    else if (this.steps == 'showSearchExperience' && this.SearchExperianceType) {
      this.progressBarFun(3, 3);
      this.appCreationAtOnboarding();
      this.mixpanel.postEvent('Explore App Searchexperience Type selected',{})

    }
    else if (this.steps == 'showSearchExperience' && !this.SearchExperianceType) {
      this.steps == 'showSearchExperience'
    }
    else {
      if (this.displayApp = true && this.newApp.name) {
        this.steps = 'demoOptions';
        this.demoType = 'e-commerce';
      }
      else {
        this.validateAppname = true;
      }
    }

  }
  openAppLoadingScreen() {
    this.loadingAppcreationRef = this.loadingAppcreation.open();
  }
  CloseAppLoadingScreen() {
    if (this.loadingAppcreationRef?.close) this.loadingAppcreationRef.close()
  }

  selectDemoType(data) {
    this.demoType = data;
  }
  selectSearchExperianceType(data) {
    this.SearchExperianceType = data;

  }
  back() {
    this.validateAppname = false;
    if (this.steps == 'showSearchExperience') {
      this.steps = 'demoOptions';
      this.SearchExperianceType = '';
    }
    else if (this.steps == 'demoOptions') {
      this.steps = 'displayApp';
      this.demoType = '';
    }
    else if (this.steps == 'displayApp') {
      this.steps = '';
      this.progressBar.length = 0
      this.newApp = { name: '', description: '' };

    }
  }
  appCreationAtOnboarding() {
    if (this.appType == 'selfExplore' && this.newApp.name) {
      this.validateSource();
    }
    else if (this.appType == 'sampleData' && this.newApp.name && this.SearchExperianceType) {
      this.validateSource();
    }
    else {
      this.validateAppname = true;
    }
  }

  checkExperience() {
    if (this.appType == 'selfExplore') {
      this.appCreationAtOnboarding();
      this.mixpanel.postEvent('Explore App Named',{})
    }
    else {
      if (this.appType == 'sampleData') {
        this.exploreSampleDate();
        this.mixpanel.postEvent('Explore App Named',{})
      }
    }
  }
  openDetails() {
    this.detailsPopUpRef = this.detailsPopUp.open();
  }
  closeDetails() {
    this.detailsPopUpRef.close();
  }
  closeCreateApp() {
    this.showBoarding = false;
    this.newApp = { name: '', description: '' };
    if (this.createAppPopRef?.close) this.createAppPopRef.close();
  }
  openCreateApp() {
    this.createAppPopRef = this.createAppPop.open();
    this.mixpanel.postEvent('Start create app',{})
    if (this.onboardingpopupjourneyRef && this.onboardingpopupjourneyRef.close) {
      this.onboardingpopupjourneyRef.close();
    }
  }
  openDeleteApp(event, appInfo) {
    this.unlinkPop = false;
    this.submitted = false;
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    this.validateName = appInfo.name;
    this.slectedAppId = appInfo._id;
    this.confirmatiomAppPopRef = this.confirmatiomAppPop.open();
  }
  closeConfirmApp() {
    if (this.confirmatiomAppPopRef && this.confirmatiomAppPopRef.close) {
      this.confirmatiomAppPopRef.close();
      this.confirmApp = '';
      this.unlinkPop = false;
    }
  }

  //Delete App function
  deleteApp() {
    this.submitted = true;
    let quaryparms: any = {};
    quaryparms.streamId = this.slectedAppId;
    if (this.confirmApp == 'DELETE') {
      this.service.invoke('delete.app', quaryparms).subscribe(res => {
        if (res) {
          this.notificationService.notify('Deleted Successfully', 'success');
          this.closeConfirmApp();
          this.apps = this.apps.filter((val) => { return val._id != this.slectedAppId });
          this.prepareApps(this.apps);
          // this.getAllApps();
          this.selectedAppType(this.app_type);
          this.confirmApp = '';
        }
      }, errRes => {
        this.notificationService.notify('Deletion has gone wrong.', 'error');
      });
    }
    // for (let i=0; i<this.apps.length; i++){
    // if (this.apps[i].name === this.confirmApp){
    // let quaryparms: any = {};
    // quaryparms.streamId = this.apps[i]._id;
    //  this.service.invoke('delete.app', quaryparms).subscribe(res => {
    //  if (res) {
    //           this.notificationService.notify('Deleted Successfully', 'success');
    //           this. closeDeleteApp();
    //           this.getAllApps();
    //         }
    //       }, errRes => {
    //         this.notificationService.notify('Deletion has gone wrong.', 'error');
    //       });
    //  }
    // }
  }
  openUnlinkApp(event, appInfo) {
    this.unlinkPop = true;
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    this.slectedUnlinkAppId = appInfo._id;
    this.confirmatiomAppPopRef = this.confirmatiomAppPop.open();
  }
  unlinkApp() {

    let quaryparms: any = {};
    quaryparms.streamId = this.slectedUnlinkAppId;

    this.service.invoke('Unlink.app', quaryparms).subscribe(res => {
      if (res) {
        this.notificationService.notify('Removed Successfully', 'success');
        this.closeConfirmApp();
        setTimeout(() => {
          this.getAllApps();
        }, 400);
      }
    }, errRes => {
      this.notificationService.notify('Something has gone wrong.', 'error');
    });
  }

  checkForSharedApp() {
    // if(this.apps.filter(item => item.createdBy != this.userId))
    for (let i = 0; i < this.apps.length; i++) {
      if (this.apps[i].createdBy != this.userId) {
        this.sharedApp = true;
      }
    }
  }

  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  toggleSearch() {
    if (this.showSearch && this.searchApp) {
      this.searchApp = '';
    }
    this.showSearch = !this.showSearch
    setTimeout(() => {
      $('#serachInputBox').focus();
    }, 100);
  }
  //get all apps
  emptyApp: boolean;
  showBoarding: boolean = true;
  public getAllApps() {
    this.service.invoke('get.apps').subscribe(res => {
      if (res && res.length) {
        if (localStorage.getItem('krPreviousState') && JSON.parse(localStorage.getItem('krPreviousState')) && JSON.parse(localStorage.getItem('krPreviousState')).route && (JSON.parse(localStorage.getItem('krPreviousState')).route != "/home")) {
          let prDetails = JSON.parse(localStorage.getItem('krPreviousState'))
          if (prDetails && prDetails.formAccount) {
            this.redirectHome()
          }
        }
        this.prepareApps(res);
        this.workflowService.showAppCreationHeader(false);
        this.selectedAppType('All');
        this.sortApp('Created Date');
        this.showBoarding = false;
        this.emptyApp = false;
      }
      else {
        if (localStorage.getItem('krPreviousState') && JSON.parse(localStorage.getItem('krPreviousState')) && JSON.parse(localStorage.getItem('krPreviousState')).route && (JSON.parse(localStorage.getItem('krPreviousState')).route != "/home")) {
          this.redirectHome()
        } else {

          /** Issue Fix for multiple onboarding  function called */
          // if (this.headerService.openJourneyForfirstTime) {
          //   this.emptyApp = true;
          //   this.showBoarding = true;
          //   this.headerService.openJourneyForfirstTime = true;
          //   this.openBoradingJourney();
          // }
          if (!this.headerService.openJourneyForfirstTime) {
            this.emptyApp = true;
            this.showBoarding = true;
            this.headerService.openJourneyForfirstTime = true;
            this.openBoradingJourney();
          }
        }
      }
      this.clearAccount();
      //this.checkForSharedApp();
    }, errRes => {
      // console.log(errRes);
    });
  }
  clearAccount() {
    let prDetails = localStorage.getItem('krPreviousState') ? JSON.parse(localStorage.getItem('krPreviousState')) : null;
    if (prDetails && prDetails.formAccount) {
      prDetails.formAccount = false;
    }
    localStorage.setItem('krPreviousState', JSON.stringify(prDetails));
  }
  redirectHome() {
    let prDetails = localStorage.getItem('krPreviousState') ? JSON.parse(localStorage.getItem('krPreviousState')) : null;
    prDetails.route = "/home";
    localStorage.setItem('krPreviousState', JSON.stringify(prDetails));
    this.router.navigate(['/home'], { skipLocationChange: true });
  }
  imageLoad() {
    // console.log("image loaded now")
    this.emptyApp = true;
  }
  //create app
  createFindlyApp() {
    const self = this;
    self.creatingInProgress = true;
    const payload: any = {
      name: this.newApp.name,
      icon: '',
      type: 'searchbot',
      description: this.newApp.description,
      skipMakeEditLinks: false,
      purpose: 'customer',
      errorCodes: {
        pollError: []
      },
      visibility: {
        namespace: [],
        namespaceIds: []
      },
      defaultLanguage: 'en',
    };
    this.service.invoke('create.app', {}, payload).subscribe(
      res => {
        this.createdAppData = res;
        this.notificationService.notify(`${this.newApp.name} created successfully`, 'success');
        if (this.appType == 'sampleData') {
          this.createDemoApp(res?.searchIndexes[0]);
        }
        else {
          this.openCreatedApp();
        }
      },
      errRes => {
        this.errorToaster(errRes, 'Error in creating app');
        self.creatingInProgress = false;
      }
    );
  }
  //common method for create sample/scratch app
  openCreatedApp() {
    const res = this.createdAppData;
    this.mixpanel.postEvent('New App Created', {});
    this.apps.push(res);
    this.prepareApps(this.apps);
    this.openApp(res)
    this.displayApp = false;
    this.workflowService.showAppCreationHeader(true);
    // this.appSelectionService.routeChanged.next({ name: 'pathchanged', path: '/source' });
    this.closeCreateApp();
    const toogleObj = {
      title: '',
    };
    this.headerService.toggle(toogleObj);
    this.creatingInProgress = false;
    $('.toShowAppHeader').removeClass('d-none');
    if (res.length > 0) {
      this.emptyApp = true;
    }
  }
  // create demo app API
  createDemoApp(obj?) {
    if (this.SearchExperianceType) {
      const payload = {
        searchIndexId: obj?._id,
        streamId: obj?.streamId,
        appType: this.demoType,
        searchBarPosition: this.SearchExperianceType,
      }
      this.service.invoke('post.createDemoApp', {}, payload).subscribe(
        res => {
          if (res) {
            this.openAppLoadingScreen();
            this.polling();
            this.appSelectionService.getTourConfig();
            this.headerComp.viewCheckList();
            this.mixpanel.postEvent('Walkthrough complete',{})
          }
        },
        errRes => {
          this.notificationService.notify('App creation has gone wrong', 'error');
        }
      );
    }
  }
  //calling polling API To get traing status
  polling() {
    this.pollingInterval = setInterval(() => { this.dockStatus() }, 700);
  }
  //call dock status API
  dockStatus() {
    const queryParms = {
      searchIndexId: this.createdAppData?.searchIndexes[0]?._id
    }
    this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
      const doc_status = JSON.parse(JSON.stringify(res));
      console.log("doc_status", doc_status);
      if ((doc_status[0].status === 'SUCCESS' || doc_status[0].status === 'success') && doc_status[0].jobType === "TRAINING") {
        clearInterval(this.pollingInterval);
        this.CloseAppLoadingScreen();
        this.openCreatedApp();
      }
      else if ((doc_status[0].status === 'FAILURE' || doc_status[0].status === "FAILED") && doc_status[0].jobType === "TRAINING") {
        this.CloseAppLoadingScreen();
        this.notificationService.notify(doc_status[0].message, 'error');
      }
    }), errRes => {
      this.notificationService.notify('Failed to get Status of Docker.', 'error');
    }
  }
  validateSource() {
    let validField = true
    if (!this.newApp.name) {
      $("#enterAppName").css("border-color", "#DD3646");
      $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
      this.notificationService.notify('Enter the required fields to proceed', 'error');
      validField = false
    }
    if (validField && this.newApp.name) {
      let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?→←↑↓]+/;
      if (!specialCharacters.test(this.newApp.description)) {
        this.createFindlyApp();
      }
      else {
        this.notificationService.notify('Special characters not allowed', 'error');
      }
    }
  }
  inputChanged(type, i?) {
    if (type == 'enterName') {
      if (!this.newApp.name) {
        $("#infoWarning").show();
        $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
      }
      else {
        $("#infoWarning").hide()
      }
      $("#enterAppName").css("border-color", this.newApp.name != '' ? "#BDC1C6" : "#DD3646");
    }
  }
  callStream() {
    this.service.invoke('get.credential').subscribe(
      res => {
      },
      errRes => {
        this.errorToaster(errRes, 'Error in creating app');
      }
    );
  }
  //select app type
  filteredApps = [];
  app_type: string;
  selectedAppType(type) {
    this.app_type = type;
    this.filteredApps = [];
    if (type === 'All') {
      this.filteredApps = this.apps;
    }
    else if (type === 'My') {
      this.filteredApps = this.apps.filter(item => item.createdBy === this.userId)
    }
    else if (type === 'Shared') {
      this.filteredApps = this.apps.filter(item => item.createdBy != this.userId)
    }
  }
  //sort app
  sort_type: string;
  minToMax: boolean = false;
  order: boolean = false;
  sortApp(type) {
    if (type !== 'Icon filter') {
      this.sort_type = type;
    }
    this.order = !this.order;
    if (type == 'Created Date') {
      this.filteredApps = this.filteredApps.sort((a, b) => {
        const D2: any = new Date(b.lastModifiedOn);
        const D1: any = new Date(a.lastModifiedOn);
        return D2 - D1;
      });
    }
    else if (type == 'Alphabetical Order') {
      this.filteredApps = this.filteredApps.sort((a, b) => a.name.localeCompare(b.name))
    }
    else if (type == 'Icon filter') {
      this.filteredApps = this.filteredApps.sort((a, b) => {
        if (this.order) {
          this.minToMax = false;
          return a.name.localeCompare(b.name)
        }
        else {
          this.minToMax = true;
          return b.name.localeCompare(a.name);
        }
        // return (this.order) ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      });
    }
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchApp = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  // callStream(){
  //   this.service.invoke('get.credential').subscribe(
  //     res => {
  //     },
  //     errRes => {
  //       this.errorToaster(errRes,'Error in creating app');
  //     }
  //   );
  // }
}
