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
  searchText: any;
  search: any;
  formatter: any;
  appName = '';
  menuFlag = false;
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
  constructor(
    private authService: AuthService,
    public headerService: SideBarService,
    public workflowService: WorkflowService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private appUrlsService: AppUrlsService,
    private localStoreService: LocalStoreService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService
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
      menu == '/summary') {
      this.showMainMenu = false;
    }else{
      this.showMainMenu = true;
      if (menu == '/settings' || menu=='/credentials-list') {
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

}
