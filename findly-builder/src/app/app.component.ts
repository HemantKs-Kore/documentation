import { Component, HostListener, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError ,ActivatedRoute} from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { SideBarService } from './services/header.service';
// import {TranslateService} from '@ngx-translate/core';
declare const $: any;
// declare const KoreWidgetSDK: any;
declare const FindlySDK: any;
// declare const koreBotChat: any;
// declare const KoreSDK: any;
declare let window:any;
import * as _ from 'underscore';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;
  showMainMenu = true;
  previousState;
  appsData: any;
  searchInstance:any;
  findlyBusinessConfig:any = {};
  bridgeDataInsights = true;
  addNewResult = true;
  showInsightFull = false;
  queryText ;
  pathsObj: any = {
   '/faq':'Faqs',
   '/content':'Contnet',
   '/source':'Source',
   '/botActions':'Bot Actions'
  }
  constructor(private router: Router,
              private authService: AuthService,
              public localstore: LocalStoreService,
              public workflowService: WorkflowService,
              private activatedRoute: ActivatedRoute,
              private headerService: SideBarService,
              // private translate: TranslateService
  ) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
    // translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.onResize();
    this.previousState = this.getPreviousState();
    this.showHideSearch(false);
  }
  showMenu(event){
    this.showMainMenu = event
  }
   restorepreviousState(){
    let route = '/apps';
    if(this.previousState && this.previousState.selectedApp){
      const apps = this.appsData;
      if(apps && apps.length){
        const selectedApp = _.filter(apps,(app) => {
          return (app._id === this.previousState.selectedApp)
        })
        if(selectedApp && selectedApp.length){
          this.workflowService.selectedApp(selectedApp[0]);
          // debugger;
          this.resetFindlySearchSDK(this.workflowService.selectedApp());
          route = '/source';
        if(this.previousState.route){
          route = this.previousState.route
         }
         try {
          this.router.navigate([route], { skipLocationChange: true });
          $('.start-search-icon-div').removeClass('hide');
          if(route && this.pathsObj && this.pathsObj[route]){
            setTimeout(()=>{
              this.preview(this.pathsObj[route]);
            },200);
          }
         } catch (e) {
         }
         
        }
      }
    }
   }
   setPreviousState(route?){
     const path: any = {
       selectedApp: '',
       route:''
     };
     if(route){
       if(this.workflowService.selectedApp && this.workflowService.selectedApp() && this.workflowService.selectedApp()._id){
         this.resetFindlySearchSDK(this.workflowService.selectedApp());
         path.selectedApp = this.workflowService.selectedApp()._id;
         path.route = route
         window.localStorage.setItem('krPreviousState',JSON.stringify(path));
       }
     } else {
      window.localStorage.removeItem('krPreviousState');
     }
   }
   preview(selection): void {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
  }
   getPreviousState(){
     let previOusState :any = null;
     try {
       previOusState = JSON.parse(window.localStorage.getItem('krPreviousState'));
     } catch (e) {
     }
     return previOusState;
   }
  resetFindlySearchSDK(appData){
    //debugger;
    if(this.searchInstance && this.searchInstance.setAPIDetails) {
      if(appData && appData.searchIndexes && appData.searchIndexes.length && appData.searchIndexes[0]._id){
        const searchData = {
          _id:appData.searchIndexes[0]._id,
          pipelineId:appData.searchIndexes[0].queryPipelineId
        }
        // debugger;
        window.selectedFindlyApp = searchData;
        console.log(searchData, window.selectedFindlyApp)
        //debugger;
        this.searchInstance.setAPIDetails();
      }
    }
  }
  navigationInterceptor(event: RouterEvent): void {
    const self = this;
    if (event instanceof NavigationStart) {
      this.authService.findlyApps.subscribe( (res) => {
        self.loading = true;
        this.appsData = res;
      });
    }
    if (event instanceof NavigationEnd) {
      if(event && event.url === '/apps'){
        this.showHideSearch(false);
      }
      if (event && event.url === '/apps') {
        this.setPreviousState();
        this.showHideSearch(false);
        $('.krFindlyAppComponent').removeClass('appSelected');
        $('.start-search-icon-div').addClass('hide');
      } else {
        const path = event.url.split('?')[0];
        if(path && (path !=='/')){
          this.setPreviousState(path);
          $('.start-search-icon-div').removeClass('hide');
          $('.krFindlyAppComponent').addClass('appSelected');
        } else {
          this.showHideSearch(false);
          $('.krFindlyAppComponent').removeClass('appSelected');
          $('.start-search-icon-div').addClass('hide');
        }
      }
      this.authService.findlyApps.subscribe((res) => {
        this.appsData = res;
        this. restorepreviousState();
        self.loading = false;
      });
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.workflowService.disablePerfectScroll = window.innerWidth <= 600;
  }
  ngOnDestroy(){
    this.authService.findlyApps.unsubscribe();
  }
  showHideSearch(show){
    const _self = this;
    if(show){
      $('.search-background-div').show();
      $('.start-search-icon-div').addClass('active');
      $('.advancemode-checkbox').css({"display":"block"});
      $('.search-container').addClass('search-container-adv')
      $('.search-container').addClass('add-new-result')
    }else{
      $('.search-background-div').hide();
      $('.start-search-icon-div').removeClass('active');
      $('.advancemode-checkbox').css({"display":"none"});
      $('.search-container').removeClass('search-container-adv')
      $('.search-container').removeClass('add-new-result');

      $('.ksa-resultsContainer').removeClass('search-body-full');
      _self.bridgeDataInsights = true;
      _self.addNewResult = true;
      _self.showInsightFull = false;
    }
  }
  sdkBridge(parms){  // can be converted as service for common Use
    const _self = this;
    console.log(parms);
    //this.bridgeDataInsights = !parms.data;
    let call = false;
    if(parms.type == "show" && parms.data == true && _self.bridgeDataInsights){
      _self.bridgeDataInsights = false;
      call = true;
    }else{
      _self.bridgeDataInsights = true;
      call = false;
    }
    if( !call ){
      if(parms.type == "showInsightFull" && parms.data == true && _self.bridgeDataInsights){
        _self.bridgeDataInsights = false;
        _self.showInsightFull = true;
        $('.ksa-resultsContainer').css({"width":"50%"});
      }else{
        _self.bridgeDataInsights = true;
        _self.showInsightFull = false;
        $('.ksa-resultsContainer').css({"width":"100%"});
      }
    }
    if(parms.type == "addNew" && parms.data == true){
      _self.addNewResult = false;
    }else{
      _self.addNewResult = true;
    }
    if(parms.query){
      _self.queryText = parms.query;
    }
  }
  closeResultBody(event){
    var bridgeObj = { type : "addNew" , data : false , query : null}
    this.sdkBridge(bridgeObj)
  }
  initSearchSDK(){
    const _self = this;
    $('body').append('<div class="start-search-icon-div"></div>');
    $('app-body').append('<div class="search-background-div"></div>');
    $('app-body').append('<label class="kr-sg-toggle advancemode-checkbox" style="display:none;"><input type="checkbox" id="advanceModeSdk" checked><div class="slider"></div></label>');
    $('.start-search-icon-div').click(function(){
      if(!$('.search-background-div:visible').length){
        _self.showHideSearch(true);
      }else{
        _self.showHideSearch(false);

      }
    });
    $('#advanceModeSdk').change(function(){
      if($(this).is(":checked")) {
        $('.search-container').removeClass('advanced-mode');          
      } else {
        $('.search-container').addClass('advanced-mode');
      }
  });
    const findlyConfig :any =window.KoreSDK.findlyConfig;
    this.findlyBusinessConfig = this;
    findlyConfig.findlyBusinessConfig = this.findlyBusinessConfig;
    var fSdk = new FindlySDK(findlyConfig);
    fSdk.showSearch();
    console.log(this.findlyBusinessConfig);
    const e = {'data' : 1}
    //fSdk.applicationDataTransfer(e);
    this.searchInstance = fSdk;

    // this.queryText =window.koreWidgetSDKInstance.vars.searchObject.searchText
  //    var chatConfig = KoreSDK.chatConfig;
  //   //chatConfig.botOptions.assertionFn = assertion;
  //   // chatConfig.widgetSDKInstace=fSdk;//passing widget sdk instance to chatwindow 

  //    var koreBot = koreBotChat();
  //    koreBot.show(chatConfig);


  //    var widgetsConfig=KoreSDK.widgetsConfig;

  //   var wizSelector = {
  //       menu: ".kr-wiz-menu-chat",
  //       content: ".kr-wiz-content-chat"
  //   }
  //    var wSdk = new KoreWidgetSDK(widgetsConfig);
  //    this.searchInstance = wSdk;
  //  // this.searchInstance = fSdk;
  //   fSdk.setJWT('dummyJWT');
  //           fSdk.show(widgetsConfig, wizSelector);
  //            fSdk.showSearch();
    
    this.resetFindlySearchSDK(this.workflowService.selectedApp());
  }
}
