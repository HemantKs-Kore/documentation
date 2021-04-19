import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { SideBarService } from './services/header.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { EndPointsService } from '@kore.services/end-points.service';
import { environment } from '@kore.environment';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { AppHeaderComponent } from './components/app-header/app-header.component';
// import {TranslateService} from '@ngx-translate/core';
declare const $: any;
// declare const KoreWidgetSDK: any;
declare const FindlySDK: any;
// declare const koreBotChat: any;
// declare const KoreSDK: any;
declare let window: any;
declare let self: any;
import * as _ from 'underscore';
import { Subscription } from 'rxjs';
import { DockStatusService } from './services/dockstatusService/dock-status.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  loading = true;
  userInfo: any = {};
  showMainMenu = true;
  settingMainMenu = false;
  previousState;
  appsData: any;
  searchInstance: any;
  findlyBusinessConfig: any = {};
  bridgeDataInsights = true;
  addNewResult = true;
  structure = 'bottom';
  showInsightFull = false;
  queryText;
  subscription: Subscription;
  SearchConfigurationSubscription: Subscription;
  searchSDKSubscription: Subscription;
  resultRankDataSubscription: Subscription
  showHideMainMenuSubscription: Subscription;
  showHideSettingsMenuSubscription : Subscription;
  closeSDKSubscription : Subscription;
  pathsObj: any = {
    '/faq': 'Faqs',
    '/content': 'Contnet',
    '/source': 'Source',
    '/botActions': 'Bot Actions'
  };
  topDownSearchInstance: any;
  searchExperienceConfig: any;
  @ViewChild('headerComp') headerComp: AppHeaderComponent;
  constructor(private router: Router,
    private authService: AuthService,
    public localstore: LocalStoreService,
    public workflowService: WorkflowService,
    private activatedRoute: ActivatedRoute,
    private headerService: SideBarService,
    private service: ServiceInvokerService,
    private endpointservice: EndPointsService,
    private appSelectionService: AppSelectionService,
    public dockService: DockStatusService
    // private translate: TranslateService
  ) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
    // translate.setDefaultLang('en');
  }

  ngOnInit() {
    self = this;
    this.onResize();
    this.previousState = this.appSelectionService.getPreviousState();
    this.showHideSearch(false);
    this.showHideTopDownSearch(false);
    this.userInfo = this.authService.getUserInfo() || {};
    this.subscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.resetFindlySearchSDK(this.workflowService.selectedApp());
    });
    this.SearchConfigurationSubscription = this.headerService.resetSearchConfiguration.subscribe(res => {
      this.distroySearch();
      this.getSearchExperience();
    });
    this.searchSDKSubscription = this.headerService.openSearchSDKFromHeader.subscribe((res: any) => {
      if (this.searchExperienceConfig) {
        this.distroySearch();
        if (this.searchExperienceConfig.experienceConfig && (this.searchExperienceConfig.experienceConfig.searchBarPosition !== 'top')) {
          if (!this.headerService.isSDKCached || !$('.search-background-div').length) {
            if (!$('.search-background-div:visible').length) {
              this.showHideSearch(true);
              this.resultRankDataSubscription = this.headerService.resultRankData.subscribe((res: any) => {
                this.searchInstance.customTourResultRank(res);
              });
            } else {
              // this.showHideSearch(false);
              this.cacheBottomUpSDK(false);
            }
          }
          else {
            if ($('.search-background-div').css('display') == 'block') {
              this.cacheBottomUpSDK(false);
            }
            else {
              this.cacheBottomUpSDK(true);
            }
          }
        }
        else {
          if (!$('.top-down-search-background-div:visible').length) {
            $('.top-down-search-background-div').addClass('active');
            this.showHideTopDownSearch(true);
          } else {
            this.showHideTopDownSearch(false);
          }
        }
      }
    });
    this.showHideMainMenuSubscription = this.headerService.showHideMainMenu.subscribe((res) => {
      this.showMainMenu = res;
    });
    this.showHideSettingsMenuSubscription = this.headerService.showHideSettingsMenu.subscribe((res) => {
      this.settingMainMenu = res;
    });
    this.closeSDKSubscription = this.headerService.hideSDK.subscribe((res) => {
      this.headerService.isSDKCached = false;
      this.distroySearch();
      this.showHideSearch(false);
      this.showHideTopDownSearch(false);
    });
  }
  showMenu(event) {
    this.showMainMenu = event
  }
  settingMenu(event) {
    this.settingMainMenu = event
  }
  restorepreviousState() {
    let route = '/apps';
    const selectedAccount = this.localstore.getSelectedAccount() || this.authService.getSelectedAccount();
    if (this.previousState && this.previousState.selectedApp && this.previousState.selectedAccountId && (this.previousState.selectedAccountId === selectedAccount.accountId)) {
      const apps = this.appsData;
      if (apps && apps.length) {
        const selectedApp = _.filter(apps, (app) => {
          return (app._id === this.previousState.selectedApp)
        })
        if (selectedApp && selectedApp.length) {
          this.appSelectionService.setAppWorkFlowData(selectedApp[0], this.previousState.selectedQueryPipeline);
          this.resetFindlySearchSDK(this.workflowService.selectedApp());
          route = '/summary';
          if (this.previousState.route) {
            route = this.previousState.route
          }
          try {
            if (this.workflowService.selectedApp() && this.workflowService.selectedApp().searchIndexes && this.workflowService.selectedApp().searchIndexes.length) {
              this.router.navigate([route], { skipLocationChange: true });
            }
            if (route && this.pathsObj && this.pathsObj[route]) {
              setTimeout(() => {
                this.preview(this.pathsObj[route]);
              }, 200);
            } else {
              setTimeout(() => {
                this.preview('');
              }, 200);
            }
          } catch (e) {
          }

        }
      }
    } else {
      this.router.navigate(['/apps'], { skipLocationChange: true });
    }
  }

  preview(selection): void {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
  }
  assertion(options, callback) {
    self.service.invoke('bt.post.sts', {}).subscribe((res) => {
      const data = res;
      options.assertion = data.jwt;
      callback(null, options);
    });
  }
  getJWT(options, callback?) {
    const jsonData = {
      identity: options.userIdentity,
      aud: '',
      isAnonymous: false
    };
    return $.ajax({
      url: 'https://dev.kore.com/api/oAuth/token/jwtgrant',
      type: 'post',
      data: jsonData,
      dataType: 'json',
      success(data) {
      },
      error(err) {
      }
    });
  }
  resetFindlySearchSDK(appData) {
    if (this.searchInstance && this.searchInstance.setAPIDetails) {
      if (appData && appData.searchIndexes && appData.searchIndexes.length && appData.searchIndexes[0]._id) {
        const searchData = {
          _id: appData.searchIndexes[0]._id,
          pipelineId: this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
          indexpipelineId: this.workflowService.selectedIndexPipeline() || ''
        }
        window.selectedFindlyApp = searchData;
        this.searchInstance.setAPIDetails();
      }
    }
  }
  selectApp(select) {
    if (select) {
      $('.start-search-icon-div').removeClass('hide');
      $('.krFindlyAppComponent').addClass('appSelected');
    } else {
      $('.krFindlyAppComponent').removeClass('appSelected');
      $('.start-search-icon-div').addClass('hide');
    }
  }
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      // this.showHideSearch(false);
      // this.showHideTopDownSearch(false);
      this.authService.findlyApps.subscribe((res) => {
        self.loading = true;
        this.appsData = res;
      });

    }
    if (event instanceof NavigationEnd) {
      console.log("event.url", event.url)
      if (event.url == '/summary') {
        this.showMainMenu = false;
      }
      // if (event.url !== '/') {
      //   this.headerComp.analyticsClick(event.url);
      // }
      // if (event.url == '/search-experience') {
      //   this.showMainMenu = true;
      //   this.settingMainMenu = true;

      // }
      if (event && event.url === '/apps') {
        // this.showHideSearch(false);
        // this.showHideTopDownSearch(false);
      }
      if (event && event.url === '/apps') {
        this.appSelectionService.setPreviousState();
        this.resetFindlySearchSDK(this.workflowService.selectedApp());
        this.showHideSearch(false);
        this.showHideTopDownSearch(false);
        this.selectApp(false);
        console.log('navigated to apps throught navigator and closed preview ball');
      } else {
        if (this.workflowService.selectedApp()) {
          this.appSelectionService.getStreamData(this.workflowService.selectedApp())
        }
        const path = event.url.split('?')[0];
        if (path && (path !== '/')) {
          this.appSelectionService.setPreviousState(path);
          this.resetFindlySearchSDK(this.workflowService.selectedApp());
          this.selectApp(true);
          this.getSearchExperience();
          console.log('navigated to path throught navigator and shown preview ball');
        } else {
          // this.showHideSearch(false);
          // this.showHideTopDownSearch(false);
          this.selectApp(false);
          console.log('failed to detect path throught navigator and closed preview ball');
        }
      }
      this.authService.findlyApps.subscribe((res) => {
        this.appsData = res;
        this.restorepreviousState();
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
  ngOnDestroy() {
    this.authService.findlyApps.unsubscribe();
    this.subscription.unsubscribe();
    this.searchSDKSubscription.unsubscribe();
    this.resultRankDataSubscription.unsubscribe();
    this.SearchConfigurationSubscription ? this.SearchConfigurationSubscription.unsubscribe() : false;
    this.showHideMainMenuSubscription ? this.showHideMainMenuSubscription.unsubscribe() : false;
    this.closeSDKSubscription ? this.closeSDKSubscription.unsubscribe() : false;
    this.showHideSettingsMenuSubscription ? this.showHideSettingsMenuSubscription.unsubscribe() : false;
  }
  distroySearch() {
    if (this.searchInstance && this.searchInstance.destroy) {
      this.searchInstance.destroy();
    }
  }
  initSearch() {
    const botOptionsFindly: any = {};
    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.userIdentity = this.userInfo.emailId;// Provide users email id here
    botOptionsFindly.client = 'botbuilder';
    botOptionsFindly.botInfo = { chatBot: this.workflowService.selectedApp().name, taskBotId: this.workflowService.selectedApp()._id };  // bot name is case sensitive
    botOptionsFindly.assertionFn = this.assertion;
    botOptionsFindly.koreAPIUrl = this.endpointservice.getServiceInfo('jwt.grunt.generate').endpoint;
    // To modify the web socket url use the following option
    botOptionsFindly.reWriteSocketURL = {
      protocol: 'wss',
      hostname: window.appConfig.API_SERVER_URL.replace('https://', '')
    };
    // useful for connecting to non-secure urls like localhost during development (not to be used in environments)
    if (window.appConfig.API_SERVER_URL.indexOf('http://') !== -1) {
      botOptionsFindly.reWriteSocketURL = {
        protocol: 'ws',
        hostname: window.appConfig.API_SERVER_URL.replace('http://', '')
      };
    }
    const findlyConfig: any = {
      botOptions: botOptionsFindly,
      viaSocket: true
    };
    this.findlyBusinessConfig = this;
    findlyConfig.findlyBusinessConfig = this.findlyBusinessConfig;
    this.distroySearch();
    this.clearBodyClasses();
    this.searchInstance = new FindlySDK(findlyConfig);
    this.searchInstance.showSearch(findlyConfig.botOptions, this.searchExperienceConfig);
    this.resetFindlySearchSDK(this.workflowService.selectedApp());

  }
  showHideSearch(show, disabelInstanceDistroy?) {
    const _self = this;
    if (show) {
      $('app-body').append('<div class="search-background-div"><div class="bgDullOpacity"></div></div>');
      $('app-body').append('<label class="kr-sg-toggle advancemode-checkbox" style="display:none;"><input type="checkbox" id="advanceModeSdk" checked><div class="slider"></div></label>');
      $('.search-background-div').show();
      // $('.start-search-icon-div').addClass('active');
      $('.search-background-div').off('click').on('click', (event) => {
        if (event.target.classList.contains('bgDullOpacity')) {
          this.cacheBottomUpSDK(false);
        }
      });
      $('.advancemode-checkbox').css({ display: 'block' });
      $('.search-container').addClass('search-container-adv')
      $('.search-container').addClass('add-new-result')
      this.initSearch();
      $('#test-btn-launch-sdk').addClass('active');
      $('#open-chat-window-no-clicks').css({display : 'block'});
      this.headerService.isSDKOpen = true;
    } else {
      $('.search-background-div').remove();
      $('.advancemode-checkbox').remove();
      $('.start-search-icon-div').removeClass('active');
      _self.bridgeDataInsights = true;
      _self.addNewResult = true;
      _self.showInsightFull = false;
      this.distroySearch();
      $('#test-btn-launch-sdk').removeClass('active');
      $('#open-chat-window-no-clicks').css({display : 'none'});
      this.headerService.isSDKCached = false;
      this.headerService.isSDKOpen = false;
    }
  }
  sdkBridge(parms) {  // can be converted as service for common Use
    const _self = this;
    console.log(parms);
    // this.bridgeDataInsights = !parms.data;
    let call = false;
    if (parms.type == 'onboardingjourney') {
      this.appSelectionService.updateTourConfig(parms.data);
    }
    // if (parms.type == 'fullResult') {
    //   this.appSelectionService.updateTourConfig('test');
    // }
    if (parms.type === 'show' && parms.data === true && _self.bridgeDataInsights) {
      _self.bridgeDataInsights = false;
      call = true;
    } else {
      _self.bridgeDataInsights = true;
      call = false;
    }
    if (!call) {
      if (parms.type === 'showInsightFull' && parms.data === true && _self.bridgeDataInsights) {
        _self.bridgeDataInsights = false;
        _self.showInsightFull = true;
        // $('.ksa-resultsContainer').css({width:'50%'});
      } else {
        _self.bridgeDataInsights = true;
        _self.showInsightFull = false;
        $('.ksa-resultsContainer').css({ width: '100%' });
      }
    }
    if (parms.type === 'addNew' && parms.data === true) {
      _self.addNewResult = false;
      _self.structure = parms.structure;
    } else {
      _self.structure = parms.structure;
      _self.addNewResult = true;
    }
    if (parms.query) {
      _self.queryText = parms.query;
    }

    if (parms.type === 'closeSearchContainer' && parms.data === false) {
      if (parms.bottomUp) {
        this.showHideSearch(false);
      }
      else {
        this.showHideTopDownSearch(false);
      }
    }
    
    if (parms.type === 'refreshSearchContainer' && parms.data === false) {
      if (parms.bottomUp) {
        this.refreshSDK();
      }
    }
  }
  closeResultBody(event) {
    const bridgeObj = { type: 'addNew', data: false, query: null }
    this.sdkBridge(bridgeObj);
    if (this.searchInstance && this.searchInstance.applicationToSDK && event) {
      this.searchInstance.applicationToSDK(event);
    }
    if (this.topDownSearchInstance && this.topDownSearchInstance.applicationToSDK && event) {
      this.topDownSearchInstance.applicationToSDK(event);
    }
  }
  initSearchSDK() {
    const _self = this;
    $('body').append('<div class="start-search-icon-div"></div>');
    setTimeout(() => {
      $('.start-search-icon-div').click(() => {
        if (!$('.search-background-div:visible').length) {
          _self.showHideSearch(true);
        } else {
          _self.showHideSearch(false);
        }
      });
    }, 200);
    $('#advanceModeSdk').change(function () {
      if ($(this).is(':checked')) {
        $('.search-container').removeClass('advanced-mode');
      } else {
        $('.search-container').addClass('advanced-mode');
      }
    });
  }

  showHideTopDownSearch(show) {
    if (show) {
      $('app-body').append('<div class="top-down-search-background-div"><div class="bgDullOpacity"></div></div>');
      $('.top-down-search-background-div').show();
      $('.top-down-search-background-div').off('click').on('click', (event) => {
        if (!event.target.closest('.topdown-search-main-container') && !event.target.closest('.filters-sec')) {
          this.showHideTopDownSearch(false);
        }
      });
      // $('app-body').append('<img class="close-top-down-search" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB0SURBVHgBjZHBDYAgDEURjRcjs7iKI3D1gNu4hqPgBk7hRVuiNdEUoqE9ld/3adoqMwbfDHunfoJqxgWv8QCrq3L+gkmjGgLYV2gdrhxOtSJ1B8Ce3k++TfUSgRymnEO3UQlD3Fo+DP8pcqddaJnZhV9HOQHmYl73b8488gAAAABJRU5ErkJggg==">');
      $('.close-top-down-search').off('click').on('click', () => {
        this.showHideTopDownSearch(false);
      });
      $('.start-search-icon-div').addClass('active');
      $('.search-container').addClass('search-container-adv');
      $('.search-container').addClass('add-new-result');
      this.initTopDownSearch();
      $('#test-btn-launch-sdk').addClass('active');
      $('#open-chat-window-no-clicks').css({display : 'block'});
      this.headerService.isSDKOpen = true;
    } else {
      $('.top-down-search-background-div').remove();
      $('.close-top-down-search').remove();
      $('.start-search-icon-div').removeClass('active');
      this.bridgeDataInsights = true;
      this.addNewResult = true;
      this.showInsightFull = false;
      this.distroyTopDownSearch();
      $('#test-btn-launch-sdk').removeClass('active');
      $('#open-chat-window-no-clicks').css({display : 'none'});
      this.headerService.isSDKOpen = false;
    }
  }

  initTopDownSearch() {
    const botOptionsFindly: any = {};
    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.userIdentity = this.userInfo.emailId;// Provide users email id here
    botOptionsFindly.client = 'botbuilder';
    botOptionsFindly.botInfo = { chatBot: this.workflowService.selectedApp().name, taskBotId: this.workflowService.selectedApp()._id };  // bot name is case sensitive
    botOptionsFindly.assertionFn = this.assertion;
    botOptionsFindly.koreAPIUrl = this.endpointservice.getServiceInfo('jwt.grunt.generate').endpoint;
    // To modify the web socket url use the following option
    botOptionsFindly.reWriteSocketURL = {
      protocol: 'wss',
      hostname: window.appConfig.API_SERVER_URL.replace('https://', '')
    };
    // useful for connecting to non-secure urls like localhost during development (not to be used in environments)
    if (window.appConfig.API_SERVER_URL.indexOf('http://') !== -1) {
      botOptionsFindly.reWriteSocketURL = {
        protocol: 'ws',
        hostname: window.appConfig.API_SERVER_URL.replace('http://', '')
      };
    }
    const findlyConfig: any = {
      botOptions: botOptionsFindly,
      viaSocket: true
    };
    this.findlyBusinessConfig = this;
    findlyConfig.findlyBusinessConfig = this.findlyBusinessConfig;
    this.distroyTopDownSearch();
    this.topDownSearchInstance = new FindlySDK(findlyConfig);
    this.resetFindlyTopDownSearchSDK(this.workflowService.selectedApp());
    this.topDownSearchInstance.initializeTopDown(findlyConfig, 'top-down-search-background-div', this.searchExperienceConfig);
  }

  distroyTopDownSearch() {
    if (this.topDownSearchInstance && this.topDownSearchInstance.destroy) {
      this.topDownSearchInstance.destroy();
    }
  }

  resetFindlyTopDownSearchSDK(appData) {
    if (this.topDownSearchInstance && this.topDownSearchInstance.setAPIDetails) {
      if (appData && appData.searchIndexes && appData.searchIndexes.length && appData.searchIndexes[0]._id) {
        const searchData = {
          _id: appData.searchIndexes[0]._id,
          pipelineId: this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
          indexpipelineId: this.workflowService.selectedIndexPipeline() || ''
        }
        window.selectedFindlyApp = searchData;
        this.topDownSearchInstance.setAPIDetails();
      }
    }
  }

  getSearchExperience() {
    console.log("getSearchExperience");
    console.log(this.workflowService.selectedApp());
    let selectedApp: any;
    selectedApp = this.workflowService.selectedApp();
    const searchIndex = selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex
    };
    this.service.invoke('get.searchexperience.list', quaryparms).subscribe(res => {
      console.log("search experience data", res);
      this.searchExperienceConfig = res;
      this.headerService.searchConfiguration = res;
    }, errRes => {
      console.log(errRes);
    });
  }

  clearBodyClasses() {
    // have to clear the classes set for Top-down
    if ($('body').hasClass('top-down')) {
      $('body').removeClass('top-down');
      $('body').removeClass('sdk-top-down-interface');
    }
  }

  cacheBottomUpSDK(key) {
    if (key) {
      $('.search-background-div').css('display', 'block');
      if ($('#show-all-results-container').length && ($('#show-all-results-container').attr('isCached') == 'true')) {
        $('#show-all-results-container').css('display', 'block');
      }
      $('#test-btn-launch-sdk').addClass('active');
      $('#open-chat-window-no-clicks').css({display : 'block'});
      this.headerService.isSDKOpen = true;
    }
    else {
      $('.search-background-div').css('display', 'none');
      if ($('#show-all-results-container').length) {
        if (!$('#show-all-results-container').attr('isCached') || ($('#show-all-results-container').attr('isCached') == 'false')) {
          if ($('#show-all-results-container').attr('isCached') == 'false') {
            $('#show-all-results-container').attr('isCached', 'false');
          }
          // else {
          //   $('#show-all-results-container').attr('isCached', 'true');
          // }
          $('#show-all-results-container').css('display', 'none');
        }
      }
      $('#test-btn-launch-sdk').removeClass('active');
      $('#open-chat-window-no-clicks').css({display : 'none'});
      this.headerService.isSDKCached = true;
      this.headerService.isSDKOpen = false;
    }
  }

  refreshSDK(){
    this.showHideSearch(false);
    setTimeout(() =>{
      this.showHideSearch(true);
    }, 200);
  }

  // click event on whole body. For now, using for Status Docker
  globalHandler(event) {
    // console.log("evnt", event);
    // if (!$(event.target).closest('.statusDockerBody').length && !$(event.target).closest('.status-docker').length && !$(event.target).is('.status-docker')) {
    //   if (this.dockService.showStatusDocker) {
    //     this.dockService.showStatusDocker = false;
    //   }
    // }
  }
}