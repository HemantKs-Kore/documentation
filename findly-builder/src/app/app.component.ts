import { Component, HostListener, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError ,ActivatedRoute} from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { SideBarService } from './services/header.service';
declare const $: any;
declare const KoreWidgetSDK: any;
declare const FindlySDK: any;
declare const KoreSDK: any;
declare const koreBotChat: any;
declare let window:any;
import * as _ from 'underscore';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;
  previousState;
  appsData: any;
  searchInstance:any;
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
              private headerService: SideBarService
  ) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.onResize();
    this.previousState = this.getPreviousState();
    this.showHideSearch(false);
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
    if(this.searchInstance && this.searchInstance.setAPIDetails) {
      if(appData && appData.searchIndexes && appData.searchIndexes.length && appData.searchIndexes[0]._id){
        const searchData = {
          _id:appData.searchIndexes[0]._id
        }
        window.selectedFindlyApp = searchData;
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
  ngOnDistroy(){
    this.authService.findlyApps.unsubscribe();
  }
  showHideSearch(show){
    if(show){
      $('.search-background-div').show();
      $('.start-search-icon-div').addClass('active');
      $('.advancemode-checkbox').css({"display":"block"});
      $('.search-container').addClass('search-container-adv')
    }else{
      $('.search-background-div').hide();
      $('.start-search-icon-div').removeClass('active');
      $('.advancemode-checkbox').css({"display":"none"});
    }
  }
  initSearchSDK(){
    const _self = this;
    $('body').append('<div class="start-search-icon-div"></div>');
    $('app-body').append('<div class="search-background-div"></div>');
    $('app-body').append('<label class="kr-sg-toggle advancemode-checkbox" style="display:none;"><input type="checkbox" id="advanceModeSdk" checked><div class="slider"></div></label>');
   // $('.search-container').addClass('search-container-adv');
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
    var findlyConfig=window.KoreSDK.findlyConfig;
    var fSdk = new FindlySDK(findlyConfig);
    fSdk.showSearch();
    // var chatConfig = KoreSDK.chatConfig;
    // //chatConfig.botOptions.assertionFn = assertion;
    // chatConfig.widgetSDKInstace=wSdk;//passing widget sdk instance to chatwindow 

    // var koreBot = koreBotChat();
    // koreBot.show(chatConfig);


    // var widgetsConfig=KoreSDK.widgetsConfig;

    // var wizSelector = {
    //     menu: ".kr-wiz-menu-chat",
    //     content: ".kr-wiz-content-chat"
    // }
    // var wSdk = new KoreWidgetSDK(widgetsConfig);
    // this.searchInstance = wSdk;
    //        wSdk.setJWT('dummyJWT');
    //         wSdk.show(widgetsConfig, wizSelector);
    //         wSdk.showSearch();
  }
}
