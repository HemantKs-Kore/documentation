import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { SideBarService } from '../../services/header.service';
import { Router } from '@angular/router';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppUrlsService } from '@kore.services/app.urls.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
import { from, interval, Subject, Subscription } from 'rxjs';
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
  pagetitle: any;
  training;
  fromCallFlow = '';
  showSwichAccountOption = false;
  searchActive = false;
  searchImgSrc:any='assets/icons/search_gray.svg';
  searchFocusIn=false;
  searchText: any;
  search: any;
  formatter: any;
  appName = '';
  menuFlag = false;
  public statusDockerLoading : boolean = false;
  @Output() showMenu = new EventEmitter();
  @Output() settingMenu = new EventEmitter();
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
  ]
  public dockersList : Array<any> = [];
  public pollingSubscriber : any;
  public dockServiceSubscriber: any;
  public isAnyRecordInprogress : boolean = false;
  public isAnyRecordCompleted : boolean = false;
  public isAnyRecordFailed : boolean = false;

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
    public dockService: DockStatusService
  ) { }
  metricsOption(menu){
    this.analyticsClick(menu,true)
    this.router.navigate([menu], { skipLocationChange: true });
  }
  analyticsClick(menu,skipRouterLink?){
    this.mainMenu = menu;
    if(menu == '/metrics' || 
      menu == '/dashboard' || 
      menu == '/userEngagement' || 
      menu == '/searchInsights'  || 
      menu == '/experiments'  || 
      menu == '/resultInsights' ||
      menu == '/summary' ||
      menu == '/experiments') {
      this.showMainMenu = false;
    }else{
      this.showMainMenu = true;
      if (menu == '/settings' || menu=='/credentials-list' || menu == '/searchInterface') {
        this.menuFlag = true;
      }
      else {
        this.menuFlag = false;
      }
    }
    if(!skipRouterLink){
      this.router.navigate([menu], { skipLocationChange: true });
    }
    this.showMenu.emit(this.showMainMenu)
    this.settingMenu.emit(this.menuFlag)
    this.resetNotificationBadge();
    this.pollingSubscriber.unsubscribe();
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
  triggerRoute(type, routObj?) {
    const self = this;
    let queryParams: any = {};
    if (type) {
      setTimeout(() => {
        const slectedRoute = _.filter(this.availableRouts, { displayName: self.searchText.displayName })
        if (slectedRoute && slectedRoute.length) {
          queryParams = slectedRoute[0].quaryParms || {};
          this.router.navigate([slectedRoute[0].routeId], { skipLocationChange: true, queryParams });
        }
      }, 100)
    } else if (routObj && routObj.routeId) {
      queryParams = routObj.quaryParms || {};
      this.router.navigate([routObj.routeId], { skipLocationChange: true, queryParams });
    }
  }
  ngOnInit() {
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.headerService.change.subscribe(data => {
      if (this.workflowService.selectedApp() && this.workflowService.selectedApp().name) {
        this.appName = this.workflowService.selectedApp().name
      }
      this.pagetitle = data.title;
      this.toShowAppHeader = data.toShowWidgetNavigation;
      this.fromCallFlow = '';
      this.ref.detectChanges();
      this.poling();
      this.dockServiceSubscriber = this.dockService.change.subscribe(data=>{
        this.poling();
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
    this.formatter = (x: {displayName: string}) => (x.displayName || '');
    if(localStorage.krPreviousState){
      this.analyticsClick(JSON.parse(localStorage.krPreviousState).route);
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
  train(){
    this.training = true;
    const self = this;
    const selectedApp = this.workflowService.selectedApp();
    if (selectedApp && selectedApp.searchIndexes && selectedApp.searchIndexes.length) {
      const quaryparms = {
        searchIndexId: selectedApp.searchIndexes[0]._id
      }
      this.service.invoke('train.app', quaryparms).subscribe(res => {
        setTimeout(()=>{
          self.training = false;
          self.notificationService.notify('Training has been initated','success');
        },5000)
      }, errRes => {
        self.training = false;
        this.notificationService.notify('Failed to train the app','error');
      });
    }
  }
  switchAccount() {
    localStorage.removeItem('selectedAccount');
    localStorage.setItem('queryParams', JSON.stringify({
      return_to: this.appUrlsService.completeAppPath(),
      showLogin: 'true',
      // comingFromKey: 'isFindlyApp',
      hideSSOButtons: 'true',
      hideResourcesPageLink: 'true'
    }));
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

  poling() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms ={
      searchIndexId:this.workflowService.selectedSearchIndexId
    }
    this.pollingSubscriber = interval(10000).pipe(startWith(0)).subscribe(() => {
      this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
        this.statusDockerLoading = false;
        this.dockersList = JSON.parse(JSON.stringify(res.dockStatuses));
        this.dockersList.forEach((record : any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");
          if(record.status === 'SUCCESS' && record.fileId && !record.store.toastSeen){
            if(record.action === 'EXPORT'){
              this.downloadDockFile(record.fileId, record.store.urlParams,record.streamId,record._id);
            }
          }
        })
        const queuedJobs = _.filter(res.dockStatuses, (source) => {
          return ((source.status === 'IN_PROGRESS') || (source.status === 'QUEUED') || (source.status === 'validation'));
        });
       
        if (queuedJobs && queuedJobs.length) {
          console.log(queuedJobs);
          this.isAnyRecordInprogress = true;
          this.isAnyRecordCompleted = false;
          this.isAnyRecordFailed = false;
        } else {
          this.resetNotificationBadge();
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

  getStatusView(status, other?){
    if(other){
      if(status === 'HALTED'){
        return 'Stopped';
      }
      else if(status === 'QUEUED'){
        return 'In-queue';
      }
      else if(status === 'IN_PROGRESS' || status === 'validation' ){
        return 'In-progress';
      }
    }
    else{
      if(status === 'SUCCESS' || status === 'FAILURE'){
        return true;
      }
      else{
        return false;
      }
    }
  }

  navigateTo(task){
    if (task.jobType === 'faq') {
      this.router.navigate(['/faqs'], { skipLocationChange: true })
    } else {
      this.router.navigate(['/content'], { skipLocationChange: true });
    }
  }

  removeRecord(task, index){
    if(task._id){
      // this.statusDockerLoading = true;
      const queryParms ={
        searchIndexId:this.workflowService.selectedSearchIndexId,
        id : task._id,
        statusType : task.statusType
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
          this.errorToaster(errRes,'Failed to get Status of Docker.');
        }
      );
    }    
    else{
      this.notificationService.notify('Failed to remove this Job.', 'error');
    }
  }

  clearAllRecords(){
    const queryParms ={
      searchIndexId:this.workflowService.selectedSearchIndexId,
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
        this.errorToaster(errRes,'Failed to get Status of Docker.');
      }
    );
  }

  recrawl(record){
     const quaryparms : any = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
      sourceId: record.extractionSourceId,
      sourceType: record.statusType,
    };
    this.service.invoke('recrwal', quaryparms).subscribe(res => {
      this.poling();
      this.notificationService.notify('Recrwaled with status : '+ res.recentStatus, 'success');
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
   }

  errorToaster(errRes,message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
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

  resetNotificationBadge(){
    this.isAnyRecordInprogress = false;
    this.isAnyRecordCompleted = false;
    this.isAnyRecordFailed = false;
  }

  ngOnDestroy() {
    if(this.pollingSubscriber){
      this.pollingSubscriber.unsubscribe(); 
    }
    if(this.dockServiceSubscriber){
      this.dockServiceSubscriber.unsubscribe();
    }
  }
  openOrCloseSearchSDK(){
    this.headerService.openSearchSDK(true);
  }

}
