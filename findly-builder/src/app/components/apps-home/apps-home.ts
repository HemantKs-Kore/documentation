import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { NotificationService } from '@kore.services/notification.service';
import { SideBarService } from '@kore.services/header.service';
import { AppSelectionService } from '@kore.services/app.selection.service'
declare const $: any;

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
  creatingInProgress = false;
  searchApp = '';
  apps: any = [];
  showSearch: any = '';
  newApp: any = {
    name: '',
    description: ''
  };
  @ViewChild('createAppPop') createAppPop: KRModalComponent;
  constructor(
    public localstore: LocalStoreService,
    private service: ServiceInvokerService,
    public workflowService: WorkflowService,
    private router: Router,
    private notificationService: NotificationService,
    private headerService: SideBarService,
    private appSelectionService : AppSelectionService
  ) {
    this.authInfo = localstore.getAuthInfo();
   }

  ngOnInit() {
    $('.krFindlyAppComponent').removeClass('appSelected');
    this.apps =  this.workflowService.findlyApps();
    setTimeout(() => {
     $('#serachInputBox').focus();
    }, 100);
  }
  openApp(app) {
  this.appSelectionService.openApp(app);
  }
  openCreateApp() {
    this.createAppPopRef  = this.createAppPop.open();
   }
   closeCreateApp() {
    this.createAppPopRef.close();
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
 toggleSearch(){
  if(this.showSearch && this.searchApp){
    this.searchApp = '';
  }
  this.showSearch = !this.showSearch
  setTimeout(() => {
    $('#serachInputBox').focus();
   }, 100);
}
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
        this.callStream();
      },
      errRes => {
        this.errorToaster(errRes,'Error in creating app');
        self.creatingInProgress = false;
      }
    );
  }
  callStream(){
    this.service.invoke('get.credential').subscribe(
      res => {
      },
      errRes => {
        this.errorToaster(errRes,'Error in creating app');
      }
    );
  }
}
