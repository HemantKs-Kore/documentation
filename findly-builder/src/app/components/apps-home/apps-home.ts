import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';

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
  newApp: any = {
    name: '',
    description: ''
  };
  @ViewChild('createAppPop') createAppPop: KRModalComponent;
  constructor(
    public localstore: LocalStoreService,
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private router: Router,
  ) {
    this.authInfo = localstore.getAuthInfo();
   }

  ngOnInit() {
    this.apps =  this.workflowService.deflectApps();
    console.log(this.apps);
    $('.toShowAppHeader').addClass('d-none');
    setTimeout(() => {
      if (!( $('.toShowAppHeader').hasClass('d-none'))) {
        $('.toShowAppHeader').addClass('d-none');
      }
    }, 100);
  }
  openApp(app) {
   this.workflowService.selectedApp(app);
   this.router.navigate(['/summary'], { skipLocationChange: true });
  }
  openCreateApp() {
    this.createAppPopRef  = this.createAppPop.open();
   }
   closeCreateApp() {
    this.createAppPopRef.close();
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
        self.workflowService.selectedApp(res);
        self.apps.push(res);
        self.workflowService.showAppCreationHeader(true);
        self.router.navigate(['/summary'], { skipLocationChange: true });
        this.closeCreateApp();
        self.creatingInProgress = false;
        $('.toShowAppHeader').removeClass('d-none');
      },
      errRes => {
        self.creatingInProgress = false;
      }
    );
  }
}
