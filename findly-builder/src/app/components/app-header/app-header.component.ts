import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { SideBarService } from '../../services/header.service';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { Router } from '@angular/router';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppUrlsService } from '@kore.services/app.urls.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { NotificationService } from '@kore.services/notification.service';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
import { from, interval, Subject, Subscription } from 'rxjs';
import { environment } from '@kore.environment';
import { startWith, elementAt, filter } from 'rxjs/operators';
import * as moment from 'moment';

declare const $: any;
import * as _ from 'underscore';
import { Input } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  toShowAppHeader: boolean;
  mainMenu = '';
  showMainMenu: boolean = true;
  currentRouteData:any="";
  displyStatusBar:boolean=true;
  tourData:any;
  tourConfigData:any=[];
  checklistCount:any;
  progressPrecent=0;
  pagetitle: any;
  field_name: any;
  profile_display: any;
  alphabetSeries1:any=['A','B','C','D','E'];
  alphabetSeries2:any=['F','G','H','I','J'];
  alphabetSeries3:any=['K','L','M','N','O'];
  alphabetSeries4:any=['P','Q','R','S','T'];
  alphabetSeries5:any=['U','V','W','X','Y','Z'];
  training: boolean = false;
  fromCallFlow = '';
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
  showSearch: boolean = false;
  public statusDockerLoading: boolean = false;
  newApp: any = {
    name: '',
    description: ''
  };
  createAppPopRef: any;
  creatingInProgress: boolean = false;
  selectedApp;
  serachIndexId;
  queryPipelineId;
  indexPipelineId;
  domain = '';
  selectAccountDetails: any = {};
  associatedAccounts: any;
  private storageType = 'localStorage';
  indexSubscription: Subscription;
  subscription: Subscription;
  routeChanged: Subscription;
  updateHeaderMainMenuSubscription: Subscription;
  @Output() showMenu = new EventEmitter();
  @Output() settingMenu = new EventEmitter();
  @Output() showSourceMenu = new EventEmitter();
  @ViewChild('createAppPop') createAppPop: KRModalComponent;
  @ViewChild('testButtonTooltip') testButtonTooltip: any;
  @ViewChild(SliderComponentComponent, { static: true }) sliderComponent: SliderComponentComponent;
  availableRouts = [
    { displayName: 'Summary', routeId: '/summary', quaryParms: {} },
    { displayName: 'Add Sources', routeId: '/source', quaryParms: {} },
    { displayName: 'Crawl Web Domain', routeId: '/source', quaryParms: { sourceType: 'contentWeb' } },
    { displayName: 'Extract Document', routeId: '/source', quaryParms: { sourceType: 'contentDoc' } },
    { displayName: 'Add FAQs Manually', routeId: '/source', quaryParms: { sourceType: 'manual' } },
    { displayName: 'Extract FAQs from Document', routeId: '/source', quaryParms: { sourceType: 'faqDoc' } },
    { displayName: 'Extract FAQs from Webdomain', routeId: '/source', quaryParms: { sourceType: 'faqWeb' } },
    { displayName: 'FAQs', routeId: '/faqs', quaryParms: { sourceType: 'faqWeb' } },
    { displayName: 'Content', routeId: '/content', quaryParms: { sourceType: 'faqWeb' } },
    { displayName: 'Structured Data', routeId: '/structuredData', quaryParms: {} },
    { displayName: 'Experiments', routeId: '/experiments', quaryParms: {} },
    { displayName: 'Actions', routeId: '/botActions', quaryParms: {} },
    { displayName: 'Workbench', routeId: '/index', quaryParms: {} },
    { displayName: 'Fields', routeId: '/FieldManagementComponent', quaryParms: {} },
    { displayName: 'Traits', routeId: '/traits', quaryParms: {} },
    { displayName: 'Weights', routeId: '/weights', quaryParms: {} },
    { displayName: 'Synonyms', routeId: '/synonyms', quaryParms: {} },
    { displayName: 'StopWords', routeId: '/stopWords', quaryParms: {} },
    { displayName: 'Facets', routeId: '/facets', quaryParms: {} },
    { displayName: 'Rules', routeId: '/rules', quaryParms: {} },
    { displayName: 'Search Interface', routeId: '/search-experience', quaryParms: {} },
    { displayName: 'Result Templates', routeId: '/searchInterface', quaryParms: {} },
    { displayName: 'Dashboard', routeId: '/dashboard', quaryParms: {} },
    { displayName: 'User Engagement Metrics', routeId: '/userEngagement', quaryParms: {} },
    { displayName: 'Search Insights', routeId: '/searchInsights', quaryParms: {} },
    { displayName: 'Result Insights', routeId: '/resultInsights', quaryParms: {} },
    { displayName: 'General Settings', routeId: '/generalSettings', quaryParms: {} },
    { displayName: 'Channels', routeId: '/settings', quaryParms: {} },
    { displayName: 'Credentials', routeId: '/credentials-list', quaryParms: {} },
    { displayName: 'Team', routeId: '/team-management', quaryParms: {} },
    { displayName: 'Plan Details', routeId: '/pricing', quaryParms: {} },
    { displayName: 'Usage Log', routeId: '/usageLog', quaryParms: {} },
    { displayName: 'Invoices', routeId: '/invoices', quaryParms: {} },
    { displayName: 'Results Ranking', routeId: '/resultranking', quaryParms: {} }
  ]
  public dockersList: Array<any> = [];
  public pollingSubscriber: any;
  public dockServiceSubscriber: any;
  public isAnyRecordInprogress: boolean = false;
  public isAnyRecordCompleted: boolean = false;
  public isAnyRecordFailed: boolean = false;
  public readDocs: any = [];
  public unReadDocs: any = [];
  trainingInitiated = false;
  constructor(
    private authService: AuthService,
    public headerService: SideBarService,
    public workflowService: WorkflowService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private appUrlsService: AppUrlsService,
    private localStoreService: LocalStoreService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dockService: DockStatusService,
    private appSelectionService: AppSelectionService,
  ) {
    this.userId = this.authService.getUserId();
    if (environment && environment.USE_SESSION_STORE) {
      this.storageType = 'sessionStorage';
    }
  }
  ngOnInit() {
    this.subscription = this.appSelectionService.getTourConfigData.subscribe(res => {
      this.tourConfigData = res;
      this.tourData = res.onBoardingChecklist;
      this.trackChecklist();
    })
    this.routeChanged = this.appSelectionService.routeChanged.subscribe(res => {
      if (res.name != undefined) {
        this.analyticsClick(res.path, false);
      }
    })
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.getAllApps();
    this.headerService.change.subscribe(data => {
      if (this.workflowService.selectedApp() && this.workflowService.selectedApp().name) {
        this.appName = this.workflowService.selectedApp().name
      }
      this.pagetitle = data.title;
      this.toShowAppHeader = data.toShowWidgetNavigation;
      this.fromCallFlow = '';
      this.ref.detectChanges();
      this.poling(true);
      this.dockServiceSubscriber = this.dockService.change.subscribe(data => {
        this.poling(true);
      });
    });

    this.headerService.fromCallFlowExpand.subscribe(data => {
      this.fromCallFlow = data.title;
      this.toShowAppHeader = false;
      this.pagetitle = '';
      this.ref.detectChanges();
    });

    this.showSwichAccountOption = this.localStoreService.getAssociatedAccounts().length > 1;
    this.search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(term => term === '' ? []
          : this.availableRouts.filter(v => (v.displayName || '').toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      )
    this.formatter = (x: { displayName: string }) => (x.displayName || '');
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
    if(localStorage.krPreviousState=='{}'|| localStorage.krPreviousState=="null"  || localStorage.krPreviousState==undefined){
        //this.analyticsClick('/home');
      }
    else if (localStorage.krPreviousState && JSON.parse(localStorage.krPreviousState)) {
      this.analyticsClick(JSON.parse(localStorage.krPreviousState).route);
    }
    this.updateHeaderMainMenuSubscription = this.headerService.headerMainMenuUpdate.subscribe((res) => {
      if (res) {
        this.mainMenu = res;
      }
    });
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.loadHeader();
    this.indexSubscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
        this.loadHeader();
      })
    })
    this.workflowService.mainMenuRouter$.subscribe(route => {
      this.mainMenu = route;
    });
    this.selectAccountDetails = window[this.storageType].getItem('selectedAccount') ? JSON.parse(window[this.storageType].getItem('selectedAccount')) : {};
    this.associatedAccounts = window[this.storageType].getItem('jStorage') ? JSON.parse(window[this.storageType].getItem('jStorage')).currentAccount.associatedAccounts : {};
    this.domain = window[this.storageType].getItem('jStorage') ? JSON.parse(window[this.storageType].getItem('jStorage')).currentAccount.domain : '';
    if(this.selectAccountDetails==null){
        for(let i=0;i<this.associatedAccounts.length;i++)
      {      
        if(this.associatedAccounts[i].status=="active")
        {
          this.selectAccountDetails=this.associatedAccounts[i];
        }
   
      }
      if((!this.selectAccountDetails) || this.selectAccountDetails=="null"  || this.selectAccountDetails==undefined){
        this.selectAccountDetails=this.associatedAccounts[0];
      }

    }
      
    for(let i=0;i<this.associatedAccounts.length;i++)
    {      
      if(this.associatedAccounts[i].status=="active")
      {
        this.loginusername=this.associatedAccounts[i].userFullName;
      }
    } 
    if(!this.loginusername){
      this.loginusername=this.domain;
    }
    // if(this.associatedAccounts.length==1){
    //   this.loginusername=this.associatedAccounts[0].userFullName;
    // }
    if(this.loginusername==this.domain){
      this.extractFirstLetter();
    }
    else{
    this.extractProfiledisplayname();  
    } 
  }
  extractFirstLetter(){
      let firstLetter=this.domain.charAt(0);
      this.profile_display=firstLetter;
      this.profile_display=this.profile_display.toUpperCase();
      this.setprofilebackground(this.profile_display);

  }
  extractProfiledisplayname(){    
    let name = this.loginusername
    //match the spaces
    var matches = name.split(/(?<=^\S+)\s/)
    var firstName = matches[0];
    var lastName = matches[1];
    var firstLetter=firstName.charAt(0);
    var secondLetter=lastName.charAt(0);
    this.profile_display=firstLetter.concat(secondLetter);
    this.profile_display=this.profile_display.toUpperCase();
        
    this.setprofilebackground(this.profile_display);
  }
  clearcontent(){
      
    if($('#searchBoxId') && $('#searchBoxId').length){
    $('#searchBoxId')[0].value = "";
    this.field_name='';
   }
  }

  setprofilebackground(displayname?){
    // to find in series1
    for(let i=0;i<this.alphabetSeries1.length;i++){
      if(displayname.charAt(0)===this.alphabetSeries1[i]){
        document.getElementById('profiledisplay').style.backgroundColor = '#AA336A' ;
        document.getElementById('profiledisplay1').style.backgroundColor = '#AA336A' ;
      }      
    }
    // to find in series2
    for(let i=0;i<this.alphabetSeries2.length;i++){
      if(displayname.charAt(0)===this.alphabetSeries2[i]){
        document.getElementById('profiledisplay').style.backgroundColor = '#006400' ;
        document.getElementById('profiledisplay1').style.backgroundColor = '#006400' ;
      }      
    }
    // to find in series3
    for(let i=0;i<this.alphabetSeries3.length;i++){
      if(displayname.charAt(0)===this.alphabetSeries3[i]){
        document.getElementById('profiledisplay').style.backgroundColor = '#C71585' ;
        document.getElementById('profiledisplay1').style.backgroundColor = '#C71585' ;
      }      
    }
    // to find in series4
    for(let i=0;i<this.alphabetSeries4.length;i++){
      if(displayname.charAt(0)===this.alphabetSeries4[i]){
        document.getElementById('profiledisplay').style.backgroundColor = '#6A5ACD' ;
        document.getElementById('profiledisplay1').style.backgroundColor = '#6A5ACD' ;
      }      
    }
    // to find in series5
    for(let i=0;i<this.alphabetSeries5.length;i++){
      if(displayname.charAt(0)===this.alphabetSeries5[i]){
        document.getElementById('profiledisplay').style.backgroundColor = '#B22222' ;
        document.getElementById('profiledisplay1').style.backgroundColor = '#B22222' ;
      }      
    }
    

  }
  
  
  switchAccountInternal(account) {
    window[this.storageType].setItem('selectedAccount', JSON.stringify(account))
    this.selectAccountDetails = window[this.storageType].getItem('selectedAccount') ? JSON.parse(window[this.storageType].getItem('selectedAccount')) : {};
    // let prDetails = JSON.parse(localStorage.getItem('krPreviousState'))
    //       if(prDetails){
    //         prDetails.formAccount=true;  
    //         localStorage.setItem('krPreviousState', JSON.stringify(prDetails)); 

    //       }
    //       this.router.navigate([''], { skipLocationChange: true })
    this.redirectHome();
    window.location.reload();
  }
  redirectHome(){
    let prDetails
    if(localStorage.getItem('krPreviousState')){
      prDetails=JSON.parse(localStorage.getItem('krPreviousState'))
    }     
    if(prDetails){
      prDetails.route = "/home";
      localStorage.setItem('krPreviousState', JSON.stringify(prDetails));
    }
    this.router.navigate(['/home'], { skipLocationChange: true });
  }
  loadHeader() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId) {
        // this.getcustomizeList(20,0);
        this.selectedApp = this.workflowService.selectedApp();
        this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
      }
    }
  }
  metricsOption(menu) {
    this.analyticsClick(menu, true)
    this.router.navigate([menu], { skipLocationChange: true });
  }
  analyticsClick(menu, skipRouterLink?) {
    this.mainMenu = menu;
    if (menu == '/metrics' ||
      menu == '/dashboard' ||
      menu == '/userEngagement' ||
      menu == '/searchInsights' ||
      menu == '/experiments' ||
      menu == '/resultInsights' ||
      menu == '/summary' ||
      menu == '/experiments') {
      this.showMainMenu = false;
    } else {
      this.showMainMenu = true;
      if (menu == '/source' || menu == '/content' || menu == '/faqs' || menu == '/botActions' || menu == '/structuredData') {
        this.sourcesFlag = true;
        this.menuFlag = false;
      }
      else if (menu == '/settings' || menu == '/credentials-list' || menu == '/actions' || menu == '/team-management' || menu == '/smallTalk' || menu == '/pricing' || menu == '/usageLog' || menu == '/invoices' || menu == '/generalSettings') {
        this.menuFlag = true;
        this.sourcesFlag = false;
      }
      else {
        this.menuFlag = false;
        this.sourcesFlag = false;
        this.resetNotificationBadge();
        if (this.pollingSubscriber) {
          this.pollingSubscriber.unsubscribe();
        }
      }
    }
    if (!skipRouterLink) {
      this.router.navigate([menu], { skipLocationChange: true });
    }
    this.showMenu.emit(this.showMainMenu)
    this.settingMenu.emit(this.menuFlag)
    this.showSourceMenu.emit(this.sourcesFlag);
    let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
    if ((menu == '/content' || menu == "/index") && currentPlan?.subscription?.planId == 'fp_free') {
      this.appSelectionService.updateUsageData.next('updatedUsage');
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
    }, 100)
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
    const self = this;
    let queryParams: any = {};
    if (type) {
      setTimeout(() => {
        const slectedRoute = _.filter(this.availableRouts, { displayName: self.searchText.displayName })
        if (slectedRoute && slectedRoute.length) {
          queryParams = slectedRoute[0].quaryParms || {};
          this.router.navigate([slectedRoute[0].routeId], { skipLocationChange: true, queryParams });
          this.analyticsClick(slectedRoute[0].routeId, true);
        }
      }, 100)
    } else if (routObj && routObj.routeId) {
      queryParams = routObj.quaryParms || {};
      this.router.navigate([routObj.routeId], { skipLocationChange: true, queryParams });
    }
  }
  removeCallFlowExpand() {
    const toogleObj = {
      title: 'Dashboard',
      toShowWidgetNavigation: this.workflowService.showAppCreationHeader()
    };
    $('.dashboardContainer').removeClass('callFlowExpand');
    this.pagetitle = toogleObj.title;
    this.toShowAppHeader = toogleObj.toShowWidgetNavigation;
    this.fromCallFlow = '';
    this.ref.detectChanges();
  }
  train() {
    if (this.training) {
      return;
    }
    this.training = true;
    const self = this;
    const selectedApp = this.workflowService.selectedApp();
    if (selectedApp && selectedApp.searchIndexes && selectedApp.searchIndexes.length) {
      const payload = {
        indexPipelineId: this.workflowService.selectedIndexPipeline()
      }
      const quaryparms = {
        searchIndexId: selectedApp.searchIndexes[0]._id
      }
      this.service.invoke('train.app', quaryparms, payload).subscribe(res => {
        setTimeout(() => {
          // self.training = false;
          this.trainingInitiated = true;
          if (this.training) {
            self.notificationService.notify('Training has been Initiated', 'success');
          }
          this.appSelectionService.updateTourConfig('indexing');
          this.poling();
        }, 5000)
      }, errRes => {
        self.training = false;
        this.notificationService.notify('Failed to train the app', 'error');
      });
    }
  }
  switchAccount() {
    localStorage.removeItem('selectedAccount');
    localStorage.setItem('queryParams', JSON.stringify({
      return_to: this.appUrlsService.completeAppPath(),
      showLogin: 'true',
      // comingFromKey: 'isFindlyApp',
      checkSwitchfrom: 'business-app',
      hideSSOButtons: 'true',
      hideResourcesPageLink: 'true'
    }));
    let jStoarge = window[this.storageType].getItem('jStorage') ? JSON.parse(window[this.storageType].getItem('jStorage')) : {}
    if (jStoarge.currentAccount.accountConf) {
      jStoarge.currentAccount['accountConf'] = false;
      window[this.storageType].setItem('jStorage', JSON.stringify(jStoarge))
    }
    window.location.href = this.appUrlsService.marketURL();
  }

  // Controlling the Status Docker Opening
  //  openStatusDocker(){
  //   this.dockService.showStatusDocker = !this.dockService.showStatusDocker
  //   if(this.dockService.showStatusDocker){
  //     this.statusDockerLoading = true;
  //     // this.getDockerData();
  //   }
  //   else{
  //     this.statusDockerLoading = false;
  //   }
  // }

  poling(recordStatistics?, updateRecordsWithRead?) {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId
    }
    this.pollingSubscriber = interval(10000).pipe(startWith(0)).subscribe(() => {
      this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
        if((!res) || !res.dockStatuses.length){
          this.training=false;
        }
        this.statusDockerLoading = false;        
        this.dockersList = JSON.parse(JSON.stringify(res.dockStatuses));        
        if (this.trainingInitiated && this.dockersList[0].status === 'SUCCESS' && this.dockersList[0].action === "TRAIN") {
          this.trainingInitiated = false;
          if (this.training) {
            this.notificationService.notify('Training Completed', 'success');
          }
          this.training = false;
        }
        if (this.trainingInitiated && this.dockersList[0].status === 'FAILURE' && this.dockersList[0].action === "TRAIN") {
          this.trainingInitiated = false;
          if (this.training) {
            this.notificationService.notify(this.dockersList[0].message, 'error');
          }
          this.training = false;
        }
        this.dockersList.forEach((record: any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");

          if (record.status === 'SUCCESS' && record.fileId && (record.store && !record.store.toastSeen)) {
            if (record.action === 'EXPORT') {
              this.downloadDockFile(record.fileId, record.store.urlParams, record.streamId, record._id);
            }
          }
        })
        const queuedJobs = _.filter(res.dockStatuses, (source) => {
          return ((source.status === 'IN_PROGRESS') || (source.status === 'QUEUED') || (source.status === 'validation'));
        });

        if (recordStatistics) {
          this.readDocs = _.filter(res.dockStatuses, (source) => {
            return (source.read && (source.read === true));
          });
          this.unReadDocs = _.filter(res.dockStatuses, (source) => {
            return (source.read === false);
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
          let successElements = this.unReadDocs.filter(element => {
            if (element && element.status === 'SUCCESS') {
              return element;
            }
          });
          let failureElements = this.unReadDocs.filter(element => {
            if (element && element.status === 'FAILURE') {
              return element;
            }
          });
          if (failureElements && failureElements.length) {
            this.isAnyRecordFailed = true;
            this.isAnyRecordCompleted = false;
            this.isAnyRecordInprogress = false;
          }
          else if (successElements && successElements.length) {
            this.isAnyRecordFailed = false;
            this.isAnyRecordCompleted = true;
            this.isAnyRecordInprogress = false;
          }
        }
        else {
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

      }, errRes => {
        this.pollingSubscriber.unsubscribe();
        if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to get Status of Docker.', 'error');
        }
      });
    }
    )
  }

  getStatusView(status, other?) {
    if (other) {
      if (status === 'HALTED') {
        return 'Stopped';
      }
      else if (status === 'QUEUED') {
        return 'In-Queue';
      }
      else if (status === 'IN_PROGRESS' || status === 'validation') {
        return 'In-progress';
      }
      else if (status === 'FAILURE') {
        return 'Failed'
      }
    }
    else {
      if (status === 'SUCCESS') {
        return true;
      }
      else {
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
    }
    else if (task.jobType == 'STRUCTURED_DATA_INGESTION') {
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
        statusType: task.statusType
      }
      this.service.invoke('delete.dockById', queryParms).subscribe(
        res => {
          this.statusDockerLoading = true;
          this.dockersList.splice(index, 1);
          // this.notificationService.notify(res.msg, 'success');
          this.statusDockerLoading = false;
        },
        errRes => {
          this.statusDockerLoading = false;
          this.errorToaster(errRes, 'Failed to get Status of Docker.');
        }
      );
    }
    else {
      this.notificationService.notify('Failed to remove this Job.', 'error');
    }
  }

  clearAllRecords() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    }
    this.service.invoke('delete.clearAllDocs', queryParms).subscribe(
      res => {
        this.statusDockerLoading = true;
        // this.dockersList = [];
        this.poling();
        // this.notificationService.notify(res.msg, 'success');
      },
      errRes => {
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
    this.service.invoke('recrwal', quaryparms).subscribe(res => {
      this.poling();
      this.notificationService.notify('Recrwaled with status : ' + res.recentStatus, 'success');
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
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

  downloadDockFile(fileId, fileName, streamId, dockId) {
    const params = {
      fileId,
      streamId: streamId,
      dockId: dockId
    }
    let payload = {
      "store": {
        "toastSeen": true,
        "urlParams": fileName,
      }
    }
    this.service.invoke('attachment.file', params).subscribe(res => {
      let hrefURL = res.fileUrl + fileName;
      window.open(hrefURL, '_self');
      this.service.invoke('put.dockStatus', params, payload).subscribe(res => {
      }
      )
    }, err => { console.log(err) });
  }

  resetNotificationBadge() {
    this.isAnyRecordInprogress = false;
    this.isAnyRecordCompleted = false;
    this.isAnyRecordFailed = false;
  }

  ngOnDestroy() {
    this.pollingSubscriber ? this.pollingSubscriber.unsubscribe() : null;
    this.dockServiceSubscriber ? this.dockServiceSubscriber.unsubscribe() : null;
    this.routeChanged ? this.routeChanged.unsubscribe() : null;
    this.updateHeaderMainMenuSubscription ? (this.updateHeaderMainMenuSubscription.unsubscribe()) : false;
    this.indexSubscription ? this.indexSubscription.unsubscribe() : null;
    this.subscription ? this.subscription.unsubscribe() : null;
  }
  //get all apps
  getAllApps() {
    this.service.invoke('get.apps').subscribe(res => {
      let app_id = this.workflowService?.selectedApp();
      if (app_id) {
        this.recentApps = res.filter(app => app._id != app_id._id).slice(0, 5)
      }
    }, errRes => {
      // console.log(errRes);
    });
  }
  //sort apps
  // prepareApps(apps) {
  //   this.recentApps = apps.slice(0, 4);
  // }
  //open app
  openApp(app) {
    this.training = false;
    this.appSelectionService.openApp(app);
    //this.appSelectionService.refreshSummaryPage.next('changed');
    this.appSelectionService.tourConfigCancel.next({ name: undefined, status: 'pending' });
    setTimeout(() => {
      this.workflowService.mainMenuRouter$.next('');
    }, 100);
    this.checkTrainingProgress();
    this.workflowService.selectedIndexPipelineId='';
  }
  //check training in progress
  checkTrainingProgress() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId
    }
    const appId = JSON.parse(localStorage.krPreviousState);
    this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
      const docStatus = res.dockStatuses.filter(data => data.action === 'TRAIN' && data.status === 'IN_PROGRESS');
      if (docStatus !== undefined && docStatus.length !== 0) {
        this.training = true;
      }
      else {
        this.training = false;
      }
    }, errRes => {
      this.pollingSubscriber.unsubscribe();
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to get Status of Docker.', 'error');
      }
    });
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
        this.closeCreateApp();
        this.newApp = {
          name: '',
          description: ''
        };
        this.creatingInProgress = false;
        this.openApp(res);
        // this.router.navigate(['/apps'], { skipLocationChange: true });
        // this.analyticsClick('apps', true)
      },
      errRes => {
        this.errorToaster(errRes, 'Error in creating app');
        self.creatingInProgress = false;
      }
    );
  }
  openOrCloseSearchSDK() {
    this.loadHeader();
    if (this.queryPipelineId) {
      this.headerService.openSearchSDK(true);
      //this.loadHeader();
      this.getcustomizeList(20, 0);
      this.displayToolTip();
    } else {
      this.notificationService.notify('Fetching queryPipeline ID...', 'warning');
      this.loadHeader();
      setTimeout(() => {
        if (this.queryPipelineId) {
          this.openSDKwithQuery();
        } else {
          this.openOrCloseSearchSDK();
        }
      }, 500)
    }

  }
  openSDKwithQuery() {
    this.headerService.openSearchSDK(true);
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
      skip: skip
    };
    this.service.invoke('get.queryCustomizeList', quaryparms).subscribe(res => {
      if (res.data.length > 0) {
        this.headerService.fromResultRank(false);
      }
      else {
        this.headerService.fromResultRank(true);
      }
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }

  notificationIconClick() {
    setTimeout(() => {
      let notificationDropdown = $('#notification-dropdown');
      if ((notificationDropdown.css('display') == 'block') && notificationDropdown.hasClass('show')) {
        this.poling(true, true);
      }
    }, 50);
  }

  checkRecordInDocs(key, record) {
    let matched: boolean = false;
    if (key === 'read') {
      let matched = this.readDocs.find(res => {
        if (res._id === record._id) {
          return res;
        }
      });
      if (matched) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (key === 'unread') {
      let matched = this.unReadDocs.find(res => {
        if (res._id === record._id) {
          return res;
        }
      });
      if (matched) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  makeNotificationsRead() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    }
    const payload = {
      ids: this.unReadDocs.map((doc) => { return doc._id })
    }
    if (payload.ids.length) {
      this.service.invoke('read.dockStatus', queryParms, payload).subscribe(
        res => {

        },
        errRes => {
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
        this.testButtonTooltip._ngbTooltip = 'Close Test mode by clicking on this button again.';
        this.testButtonTooltip.open();
        setTimeout(() => {
          this.testButtonTooltip.close();
          this.testButtonTooltip.tooltipClass = 'test-icon-tooltip';
          this.testButtonTooltip._ngbTooltip = 'Preview & Customize search results.';
        }, 2000);
      }
    }, 1000);
  }
  validateSource() {
    let validField = true
    if (!this.newApp.name) {
      $("#enterAppName").css("border-color", "#DD3646");
      $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
      this.notificationService.notify('Enter the required field to proceed', 'error');
      validField = false
    }
    if (validField) {
      this.createFindlyApp()
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
      $("#infoWarning").hide()
      $("#enterAppName").css("border-color", this.newApp.name != '' ? "#BDC1C6" : "#DD3646");
    }
  }
  /**opening slider component and closing slider component  */
  openUserMetaTagsSlider() { 
    this.currentRouteData=this.router.url;
    this.sliderComponent.openSlider("#supportOnboarding", "width500");
   }
  closeUserMetaTagsSlider() { this.sliderComponent.closeSlider("#supportOnboarding"); }
  emitStatus(event) {
    this.displyStatusBar=event;
  }

  closeStatusBar(){
    if(this.displyStatusBar){
      this.displyStatusBar=false;
    }
    else{
      this.displyStatusBar=true;
    }
  }
   //track checklist count and show count number
   trackChecklist() {
    let arr = [];
    let Index = [];
    this.tourData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        arr.push(item[key])
      });
    })
    arr.map((item, index) => {
      if (item == false) Index.push(index)
    })
    
    let count = 0;
    for (let key in this.tourData) {
      for (let key1 in this.tourData[key]) {
        if (this.tourData[key][key1]) {
          count = count + 1;
        }
      }
    }
    this.checklistCount = count;   
    this.percentCaluculate();
  }
  percentCaluculate(){
    if(this.checklistCount){
      this.progressPrecent = (this.checklistCount/6)*(100);
    }
  }
}

