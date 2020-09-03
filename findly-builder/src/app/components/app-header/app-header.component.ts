import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { SideBarService } from '../../services/header.service';
import { Router } from '@angular/router';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppUrlsService } from '@kore.services/app.urls.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
declare const $: any;
import * as _ from 'underscore';
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  toShowAppHeader: boolean;
  pagetitle: any;
  fromCallFlow = '';
  showSwichAccountOption = false;
  searchActive = false;
  searchText:any;
  search:any;
  formatter:any;
  availableRouts = [
    {displayName:'Summary' , routeId:'/summary',quaryParms:{}},
    {displayName:'Add Sources' , routeId:'/source',quaryParms:{}},
    {displayName:'Crawl Web Domain' , routeId:'/source',quaryParms:{sourceType:'contentWeb'}},
    {displayName:'Extract Document' , routeId:'/source',quaryParms:{sourceType:'contentDoc'}},
    {displayName:'Add FAQs Manually' , routeId:'/source',quaryParms:{sourceType:'manual'}},
    {displayName:'Extract FAQs from Document' , routeId:'/source',quaryParms:{sourceType:'faqDoc'}},
    {displayName:'Extract FAQs from Webdomain' , routeId:'/source',quaryParms:{sourceType:'faqWeb'}},
    {displayName:'FAQs' , routeId:'/faqs',quaryParms:{sourceType:'faqWeb'}},
    {displayName:'Content' , routeId:'/content',quaryParms:{sourceType:'faqWeb'}},
  ]
  constructor(
    private authService: AuthService,
    public headerService: SideBarService,
    public workflowService: WorkflowService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private appUrlsService: AppUrlsService,
    private localStoreService: LocalStoreService
  ) { }

  logoutClick() {
    this.authService.logout();
  }
  toggleSearch(activate){
    this.searchActive = activate;
    if(!activate){
    this.searchText = '';
    }
  }
  triggerRoute(type,routObj?){
    const self = this;
    let queryParams:any = {};
    if(type){
      setTimeout(()=>{
        const slectedRoute = _.filter(this.availableRouts,{displayName:self.searchText.displayName})
        if(slectedRoute && slectedRoute.length){
          queryParams = slectedRoute[0].quaryParms || {};
          this.router.navigate([slectedRoute[0].routeId], { skipLocationChange: true,queryParams});
        }
      },100)
    } else if (routObj && routObj.routeId){
       queryParams = routObj.quaryParms || {};
      this.router.navigate([routObj.routeId], { skipLocationChange: true,queryParams});
    }
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
    this.search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.availableRouts.filter(v => (v.displayName || '').toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
    this.formatter = (x: {displayName: string}) => (x.displayName || '');
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
