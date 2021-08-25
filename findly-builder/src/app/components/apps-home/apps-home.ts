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
  saveInProgress = false;
  toShowAppHeader: boolean;
  appsData: any;
  createAppPopRef: any;
  onboardingpopupjourneyRef: any;
  creatingInProgress = false;
  searchApp = '';
  apps: any = [];
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
  @ViewChild('createAppPop') createAppPop: KRModalComponent;
  @ViewChild('createBoardingJourney') createBoardingJourney: KRModalComponent;
  constructor(
    public localstore: LocalStoreService,
    private service: ServiceInvokerService,
    public workflowService: WorkflowService,
    private router: Router,
    private notificationService: NotificationService,
    private headerService: SideBarService,
    private appSelectionService: AppSelectionService,
    public authService: AuthService,
    public inlineManual : InlineManualService,
    private route: ActivatedRoute
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
    this.buildCarousel();
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
  }
  openBoradingJourney() {
    this.onboardingpopupjourneyRef = this.createBoardingJourney.open();
  }
  closeBoradingJourney() {
    if (this.onboardingpopupjourneyRef && this.onboardingpopupjourneyRef.close) {
      this.onboardingpopupjourneyRef.close();
    }
    this.showBoarding = false;
  }

  openCreateApp() {
    this.createAppPopRef = this.createAppPop.open();
    if (this.onboardingpopupjourneyRef && this.onboardingpopupjourneyRef.close) {
      this.onboardingpopupjourneyRef.close();
    }
  }
  closeCreateApp() {
    this.showBoarding = false;
    this.createAppPopRef.close();
    this.newApp = { name: '', description: '' };
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
      this.prepareApps(res);
      if (res && res.length) {
        this.workflowService.showAppCreationHeader(false);
        this.selectedAppType('All');
        this.sortApp('Created Date');
        this.showBoarding = false;
        this.emptyApp = false;
      }
      else {
        this.emptyApp = true;
        // if(!this.inlineManual.checkVisibility('CREATE_APP')){
        //   this.inlineManual.openHelp('CREATE_APP')
        //   this.inlineManual.visited('CREATE_APP')
        // }
        this.showBoarding = true;
        this.openBoradingJourney()
      }
    }, errRes => {
      console.log(errRes);
    });
  }
  imageLoad() {
    console.log("image loaded now")
    this.emptyApp = true;
  }
  buildCarousel(){
    setTimeout(() => {
      $('.carousel:last').addClass("carousel" + this.carouselTemplateCount);
      var count = $(".carousel" + this.carouselTemplateCount).children().length;
      if (count > 1) {
        var carousel = new PureJSCarousel({
          carousel: '.carousel' + this.carouselTemplateCount,
          slide: '.slide',
          oneByOne: true,
          jq: $,
        });
        this.carousel.push(carousel);
      }
      this.carouselTemplateCount += 1;
    }, 400);
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
