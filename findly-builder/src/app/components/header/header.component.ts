import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { SideBarService } from '../../services/header.service';
import { Router } from '@angular/router';
import { workflowService } from '@kore.services/workflow.service';
import { AppUrlsService } from '@kore.services/app.urls.service';
import { LocalStoreService } from '@kore.services/localstore.service';

declare const $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  toShowAppHeader: boolean;
  pagetitle: any;
  fromCallFlow = '';
  showSwichAccountOption = false;
  constructor(
    private authService: AuthService,
    public headerService: SideBarService,
    public workflowService: workflowService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private appUrlsService: AppUrlsService,
    private localStoreService: LocalStoreService
  ) { }

  logoutClick() {
    this.authService.logout();
  }

  ngOnInit() {
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.headerService.change.subscribe(data => {
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
