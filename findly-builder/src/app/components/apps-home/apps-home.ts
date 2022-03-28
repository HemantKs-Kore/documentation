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
import { NONE_TYPE } from '@angular/compiler';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
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
  appsData: any;
  createAppPopRef: any;
  onboardingpopupjourneyRef: any;
  confirmatiomAppPopRef: any;
  detailsPopUpRef:any;
  creatingInProgress = false;
  searchApp = '';
  apps: any = [];
  sharedApp=false;
  confirmApp: any='';
  validateName:any='';
  slectedAppId:any ='';
  slectedUnlinkAppId:any ='';
  unlinkPop = true;
  showSearch = false;
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
  @ViewChild('createAppPop') createAppPop: KRModalComponent;
  @ViewChild('createBoardingJourney') createBoardingJourney: KRModalComponent;
  @ViewChild('confirmatiomAppPop') confirmatiomAppPop: KRModalComponent;
  @ViewChild('detailsPopUp') detailsPopUp: KRModalComponent;
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
    this.appSelectionService.openApp(app);
    this.workflowService.selectedIndexPipelineId='';
  }
  openBoradingJourney() {
    this.headerService.openJourneyForfirstTime = true;
    this.onboardingpopupjourneyRef = this.createBoardingJourney.open();
    this.mixpanel.postEvent('User Onboarding - Journey Presented', {});
  }
  closeBoradingJourney() {
    if (this.onboardingpopupjourneyRef && this.onboardingpopupjourneyRef.close) {
      this.onboardingpopupjourneyRef.close();
      this.mixpanel.postEvent('User Onboarding - Journey Cancelled', {});
    }
    this.showBoarding = false;
  }

  openDetails() {
    this.detailsPopUpRef = this.detailsPopUp.open();
  }
  closeDetails() {
    this.detailsPopUpRef.close();
  }
  closeCreateApp() {
    this.showBoarding = false;
    this.createAppPopRef.close();
    this.newApp = { name: '', description: '' };
  }
  openCreateApp() {
    this.createAppPopRef = this.createAppPop.open();
    if (this.onboardingpopupjourneyRef && this.onboardingpopupjourneyRef.close) {
      this.onboardingpopupjourneyRef.close();
    }
  }
  openDeleteApp(event,appInfo) {
    this.unlinkPop =false;
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
      this.unlinkPop=false;
    }
  }

  //Delete App function
  deleteApp() {

    let quaryparms: any = {};
    quaryparms.streamId = this.slectedAppId;
    if(this.confirmApp == this.validateName ){
    this.service.invoke('delete.app', quaryparms).subscribe(res => {
      if (res) {
        this.notificationService.notify('Deleted Successfully', 'success');
        this.closeConfirmApp();
        this.apps=this.apps.filter((val) => { return val._id!=this.slectedAppId });
        this.selectedAppType(this.app_type);
        this.confirmApp = '';
      }
    }, errRes => {
      this.notificationService.notify('Deletion has gone wrong.', 'error');
    });
  }
  else{
    this.notificationService.notify('Enter and confirm the App Name ', 'error');
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
    openUnlinkApp(event,appInfo) {
      this.unlinkPop =true;
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

    checkForSharedApp(){
      // if(this.apps.filter(item => item.createdBy != this.userId))
      for(let i=0;i<this.apps.length;i++){
        if(this.apps[i].createdBy!=this.userId){
          this.sharedApp=true;
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
        if(localStorage.getItem('krPreviousState') && JSON.parse(localStorage.getItem('krPreviousState')) && JSON.parse(localStorage.getItem('krPreviousState')).route && (JSON.parse(localStorage.getItem('krPreviousState')).route != "/home")){
          let prDetails = JSON.parse(localStorage.getItem('krPreviousState'))
          if(prDetails && prDetails.formAccount){
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
        if(localStorage.getItem('krPreviousState') && JSON.parse(localStorage.getItem('krPreviousState')) && JSON.parse(localStorage.getItem('krPreviousState')).route && (JSON.parse(localStorage.getItem('krPreviousState')).route != "/home")){
          this.redirectHome()
        }else {

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
  clearAccount(){    
    let prDetails = localStorage.getItem('krPreviousState')?JSON.parse(localStorage.getItem('krPreviousState')):null;
        if(prDetails && prDetails.formAccount){
           prDetails.formAccount = false;
        }
        localStorage.setItem('krPreviousState', JSON.stringify(prDetails));
  }
  redirectHome(){
    let prDetails = localStorage.getItem('krPreviousState')?JSON.parse(localStorage.getItem('krPreviousState')):null;
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
        this.notificationService.notify('App created successfully', 'success');
        this.mixpanel.postEvent('New App Created', {});
        self.apps.push(res);
        this.prepareApps(self.apps);
        this.openApp(res)
        self.workflowService.showAppCreationHeader(true);
        // self.router.navigate(['/source'], { skipLocationChange: true });
        this.closeCreateApp();
        const toogleObj = {
          title: '',
        };
        this.headerService.toggle(toogleObj);
        self.creatingInProgress = false;
        $('.toShowAppHeader').removeClass('d-none');
        if (res.length > 0) {
          this.emptyApp = true;
        }
        // this.callStream();
      },
      errRes => {
        this.errorToaster(errRes, 'Error in creating app');
        self.creatingInProgress = false;
      }
    );
  }
  validateSource() {
    let validField = true
    if (!this.newApp.name) {
      $("#enterAppName").css("border-color", "#DD3646");
      $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
      this.notificationService.notify('Enter the required fields to proceed', 'error');
      validField = false
    }
    if (validField) {
      let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?→←↑↓]+/;
      if (!specialCharacters.test(this.newApp.description)) {
        this.createFindlyApp()
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
