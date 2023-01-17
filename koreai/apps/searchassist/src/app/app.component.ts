import { Component, HostListener } from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { AuthService } from '@kore.services/auth.service';
import { DockStatusService } from '@kore.services/dock.status.service';
import { EndPointsService } from '@kore.services/end-points.service';
import { SideBarService } from '@kore.services/header.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import * as _ from 'underscore';

declare const $: any;
declare const FindlySDK: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  loading = false;
  userInfo: any = {};
  appsData;
  showMainMenu = true;
  searchInstance: any;
  bridgeDataInsights = true;
  addNewResult = true;
  showInsightFull = false;
  searchExperienceSubscription: Subscription;
  findlyBusinessConfig: any = {};
  searchExperienceConfig: any;
  topDownSearchInstance: any;
  indexPipelineId: any;
  queryPipelineId: any;
  previousState;
  // isDemoApp: boolean = false;
  selectedApp: any;
  searchExperinceLoading = false;
  pathsObj: any = {
    '/faq': 'Faqs',
    '/content': 'Contnet',
    '/sources': 'Source',
    '/botActions': 'Bot Actions',
  };
  constructor(
    private router: Router,
    private authService: AuthService,
    public localstore: LocalStoreService,
    public workflowService: WorkflowService,
    private activatedRoute: ActivatedRoute,
    private headerService: SideBarService,
    public service: ServiceInvokerService, // changed to public for resolving the search interface failure issue
    private endpointservice: EndPointsService,
    private appSelectionService: AppSelectionService,
    public dockService: DockStatusService,
    public inlineManual: InlineManualService,
    public mixpanel: MixpanelServiceService,
    private translate: TranslateService
  ) {
    this.mixpanel.init();
    router.events.subscribe((event: any) => {
      this.navigationInterceptor(event);
    });
    if (
      window.location.href.split('home/').length &&
      window.location.href.split('home/')[1]
    ) {
      const lang = window.location.href.split('home/')[1];
      translate.setDefaultLang(lang);
    }
  }

  resetFindlySearchSDK(appData) {
    if (this.searchInstance && this.searchInstance.setAPIDetails) {
      if (
        appData &&
        appData.searchIndexes &&
        appData.searchIndexes.length &&
        appData.searchIndexes[0]._id
      ) {
        const searchData = {
          _id: appData.searchIndexes[0]._id,
          pipelineId: this.workflowService.selectedQueryPipeline()
            ? this.workflowService.selectedQueryPipeline()._id
            : '',
          indexpipelineId: this.workflowService.selectedIndexPipeline() || '',
        };
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

  showHideSearch(show, disabelInstanceDistroy?) {
    const _self = this;
    if (show) {
      $('app-body').append(
        '<div class="search-background-div"><div class="bgDullOpacity"></div></div>'
      );
      $('app-body').append(
        '<label class="kr-sg-toggle advancemode-checkbox" style="display:none;"><input type="checkbox" id="advanceModeSdk" checked><div class="slider"></div></label>'
      );
      $('.search-background-div').show();
      // $('.start-search-icon-div').addClass('active');
      $('.search-background-div')
        .off('click')
        .on('click', (event) => {
          if (event.target.classList.contains('bgDullOpacity')) {
            this.cacheBottomUpSDK(false);
          }
        });
      $('.advancemode-checkbox').css({ display: 'block' });
      $('.search-container').addClass('search-container-adv');
      $('.search-container').addClass('add-new-result');
      this.initSearch();
      $('#test-btn-launch-sdk').addClass('active');
      $('#open-chat-window-no-clicks').css({ display: 'block' });
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
      $('#open-chat-window-no-clicks').css({ display: 'none' });
      this.headerService.isSDKCached = false;
      this.headerService.isSDKOpen = false;
    }
  }
  distroySearch() {
    if (this.searchInstance && this.searchInstance.destroy) {
      this.searchInstance.destroy();
    }
  }
  initSearch() {
    const botOptionsFindly: any = {};
    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.userIdentity = this.userInfo.emailId; // Provide users email id here
    botOptionsFindly.client = 'botbuilder';
    if (
      this.workflowService.selectedApp() &&
      (this.workflowService.selectedApp().channels || []).length &&
      this.workflowService.selectedApp().channels[0].app
    ) {
      botOptionsFindly.clientId =
        this.workflowService.selectedApp().channels[0].app.clientId;
    }
    if (
      this.workflowService.selectedApp() &&
      (this.workflowService.selectedApp().searchIndexes || []).length &&
      this.workflowService.selectedApp().searchIndexes[0]._id
    ) {
      botOptionsFindly.searchIndexID =
        this.workflowService.selectedApp().searchIndexes[0]._id;
    }
    // botOptionsFindly.indexPipelineId = this.workflowService.selectedIndexPipeline()||'';
    // botOptionsFindly.queryPipelineId = this.queryPipelineId||'';
    botOptionsFindly.botInfo = {
      chatBot: this.workflowService.selectedApp().name,
      taskBotId: this.workflowService.selectedApp()._id,
    }; // bot name is case sensitive
    botOptionsFindly.assertionFn = this.assertion;
    botOptionsFindly.koreAPIUrl =
      this.endpointservice.getServiceInfo('jwt.grunt.generate').endpoint;
    // To modify the web socket url use the following option
    botOptionsFindly.reWriteSocketURL = {
      protocol: 'wss',
      hostname: window.appConfig.API_SERVER_URL.replace('https://', ''),
    };
    // useful for connecting to non-secure urls like localhost during development (not to be used in environments)
    if (window.appConfig.API_SERVER_URL.indexOf('http://') !== -1) {
      botOptionsFindly.reWriteSocketURL = {
        protocol: 'ws',
        hostname: window.appConfig.API_SERVER_URL.replace('http://', ''),
      };
    }
    const findlyConfig: any = {
      botOptions: botOptionsFindly,
      viaSocket: true,
      pickersConfig: {
        showDatePickerIcon: false, //set true to show datePicker icon
        showDateRangePickerIcon: false, //set true to show dateRangePicker icon
        showClockPickerIcon: false, //set true to show clockPicker icon
        showTaskMenuPickerIcon: true, //set true to show TaskMenu Template icon
        showradioOptionMenuPickerIcon: false, //set true to show Radio Option Template icon
      },
    };
    this.findlyBusinessConfig = this;
    findlyConfig.findlyBusinessConfig = this.findlyBusinessConfig;
    this.distroySearch();
    this.clearBodyClasses();
    this.searchInstance = new FindlySDK(findlyConfig);
    const currentSubscriptionPlan =
      this.appSelectionService?.currentsubscriptionPlanDetails;
    const isFreePlan =
      currentSubscriptionPlan?.subscription?.planName === 'Free' ? true : false;
    const searchConfig = {
      ...this.searchExperienceConfig,
      freePlan: isFreePlan,
    };
    this.searchInstance.showSearch(findlyConfig.botOptions, searchConfig, true);
    this.resetFindlySearchSDK(this.workflowService.selectedApp());
    $('body').addClass('sdk-body');
  }

  clearBodyClasses() {
    // have to clear the classes set for Top-down
    if ($('body').hasClass('top-down')) {
      $('body').removeClass('top-down');
      $('body').removeClass('sdk-top-down-interface');
      $('body').removeClass('sdk-body');
    }
  }

  cacheBottomUpSDK(key) {
    if (key) {
      $('.search-background-div').css('display', 'block');
      if (
        $('#show-all-results-container').length &&
        $('#show-all-results-container').attr('isCached') == 'true'
      ) {
        $('#show-all-results-container').css('display', 'block');
      }
      $('#test-btn-launch-sdk').addClass('active');
      $('#open-chat-window-no-clicks').css({ display: 'block' });
      this.headerService.isSDKOpen = true;
    } else {
      $('.search-background-div').css('display', 'none');
      $('body').removeClass('sdk-body');
      if ($('#show-all-results-container').length) {
        if (
          !$('#show-all-results-container').attr('isCached') ||
          $('#show-all-results-container').attr('isCached') == 'false'
        ) {
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
      $('#open-chat-window-no-clicks').css({ display: 'none' });
      this.headerService.isSDKCached = true;
      this.headerService.isSDKOpen = false;
    }
    this.addNewResult = true;
  }

  showHideTopDownSearch(show) {
    if (show) {
      $('app-body').append(
        '<div class="top-down-search-background-div"><div class="bgDullOpacity"></div></div>'
      );
      $('.top-down-search-background-div').show();
      $('.top-down-search-background-div')
        .off('click')
        .on('click', (event) => {
          if (
            !event.target.closest('.topdown-search-main-container') &&
            !event.target.closest('.filters-sec') &&
            !event.target.closest('.filters-reset')
          ) {
            this.showHideTopDownSearch(false);
          }
        });
      $('app-body').append(
        '<div class="close-top-down-search-outer"><img class="close-top-down-search" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuNzA3MDMgNS4wMDAwOUw5Ljg1MzU1IDAuODUzNTUzQzEwLjA0ODggMC42NTgyOTEgMTAuMDQ4OCAwLjM0MTcwOSA5Ljg1MzU1IDAuMTQ2NDQ3QzkuNjU4MjkgLTAuMDQ4ODE1NyA5LjM0MTcxIC0wLjA0ODgxNTQgOS4xNDY0NSAwLjE0NjQ0N0w0Ljk5OTkxIDQuMjkzTDAuODUzNTU1IDAuMTQ2ODE0QzAuNjU4Mjg4IC0wLjA0ODQ0NDQgMC4zNDE3MDYgLTAuMDQ4NDM4IDAuMTQ2NDQ4IDAuMTQ2ODI4Qy0wLjA0ODgxMDQgMC4zNDIwOTQgLTAuMDQ4ODA0IDAuNjU4Njc3IDAuMTQ2NDYyIDAuODUzOTM1TDQuMjkyOCA1LjAwMDFMMC4xNDY0NDcgOS4xNDY0NkMtMC4wNDg4MTU3IDkuMzQxNzMgLTAuMDQ4ODE1NSA5LjY1ODMxIDAuMTQ2NDQ3IDkuODUzNTdDMC4zNDE3MDkgMTAuMDQ4OCAwLjY1ODI5MiAxMC4wNDg4IDAuODUzNTUzIDkuODUzNTdMNC45OTk5MiA1LjcwNzJMOS4xNDY0NiA5Ljg1MzU3QzkuMzQxNzMgMTAuMDQ4OCA5LjY1ODMxIDEwLjA0ODggOS44NTM1NyA5Ljg1MzU1QzEwLjA0ODggOS42NTgyOSAxMC4wNDg4IDkuMzQxNzEgOS44NTM1NSA5LjE0NjQ1TDUuNzA3MDMgNS4wMDAwOVoiIGZpbGw9IiMyMDIxMjQiLz4KPC9zdmc+Cg=="></div>'
      );
      $('.close-top-down-search-outer')
        .off('click')
        .on('click', () => {
          this.showHideTopDownSearch(false);
        });
      $('.start-search-icon-div').addClass('active');
      $('.search-container').addClass('search-container-adv');
      $('.search-container').addClass('add-new-result');
      this.initTopDownSearch();
      $('#test-btn-launch-sdk').addClass('active');
      $('#open-chat-window-no-clicks').css({ display: 'block' });
      this.headerService.isSDKOpen = true;
    } else {
      $('.top-down-search-background-div').remove();
      $('.close-top-down-search-outer').remove();
      $('body').removeClass('sdk-top-down-interface');
      $('.start-search-icon-div').removeClass('active');
      this.bridgeDataInsights = true;
      this.addNewResult = true;
      this.showInsightFull = false;
      this.distroyTopDownSearch();
      $('#test-btn-launch-sdk').removeClass('active');
      $('#open-chat-window-no-clicks').css({ display: 'none' });
      this.headerService.isSDKOpen = false;
    }
  }

  initTopDownSearch() {
    const botOptionsFindly: any = {};
    botOptionsFindly.logLevel = 'debug';
    botOptionsFindly.userIdentity = this.userInfo.emailId; // Provide users email id here
    botOptionsFindly.client = 'botbuilder';
    botOptionsFindly.botInfo = {
      chatBot: this.workflowService.selectedApp().name,
      taskBotId: this.workflowService.selectedApp()._id,
    }; // bot name is case sensitive
    if (
      this.workflowService.selectedApp() &&
      (this.workflowService.selectedApp().channels || []).length &&
      this.workflowService.selectedApp().channels[0].app
    ) {
      botOptionsFindly.clientId =
        this.workflowService.selectedApp().channels[0].app.clientId;
    }
    if (
      this.workflowService.selectedApp() &&
      (this.workflowService.selectedApp().searchIndexes || []).length &&
      this.workflowService.selectedApp().searchIndexes[0]._id
    ) {
      botOptionsFindly.searchIndexID =
        this.workflowService.selectedApp().searchIndexes[0]._id;
    }
    // botOptionsFindly.indexPipelineId = this.workflowService.selectedIndexPipeline()||'';
    // botOptionsFindly.queryPipelineId = this.queryPipelineId||'';
    botOptionsFindly.assertionFn = this.assertion;
    botOptionsFindly.koreAPIUrl =
      this.endpointservice.getServiceInfo('jwt.grunt.generate').endpoint;
    // To modify the web socket url use the following option
    botOptionsFindly.reWriteSocketURL = {
      protocol: 'wss',
      hostname: window.appConfig.API_SERVER_URL.replace('https://', ''),
    };
    // useful for connecting to non-secure urls like localhost during development (not to be used in environments)
    if (window.appConfig.API_SERVER_URL.indexOf('http://') !== -1) {
      botOptionsFindly.reWriteSocketURL = {
        protocol: 'ws',
        hostname: window.appConfig.API_SERVER_URL.replace('http://', ''),
      };
    }
    const findlyConfig: any = {
      botOptions: botOptionsFindly,
      viaSocket: true,
      pickersConfig: {
        showDatePickerIcon: false, //set true to show datePicker icon
        showDateRangePickerIcon: false, //set true to show dateRangePicker icon
        showClockPickerIcon: false, //set true to show clockPicker icon
        showTaskMenuPickerIcon: true, //set true to show TaskMenu Template icon
        showradioOptionMenuPickerIcon: false, //set true to show Radio Option Template icon
      },
    };
    this.findlyBusinessConfig = this;
    findlyConfig.findlyBusinessConfig = this.findlyBusinessConfig;
    this.distroyTopDownSearch();
    this.topDownSearchInstance = new FindlySDK(findlyConfig);
    this.resetFindlyTopDownSearchSDK(this.workflowService.selectedApp());
    const currentSubscriptionPlan =
      this.appSelectionService?.currentsubscriptionPlanDetails;
    const isFreePlan =
      currentSubscriptionPlan?.subscription?.planName === 'Free' ? true : false;
    const searchConfig = {
      ...this.searchExperienceConfig,
      freePlan: isFreePlan,
    };
    this.topDownSearchInstance.initializeTopDown(
      findlyConfig,
      'top-down-search-background-div',
      searchConfig
    );
    $('body').addClass('sdk-body');
  }

  resetFindlyTopDownSearchSDK(appData) {
    if (
      this.topDownSearchInstance &&
      this.topDownSearchInstance.setAPIDetails
    ) {
      if (
        appData &&
        appData.searchIndexes &&
        appData.searchIndexes.length &&
        appData.searchIndexes[0]._id
      ) {
        const searchData = {
          _id: appData.searchIndexes[0]._id,
          pipelineId: this.workflowService.selectedQueryPipeline()
            ? this.workflowService.selectedQueryPipeline()._id
            : '',
          indexpipelineId: this.workflowService.selectedIndexPipeline() || '',
        };
        window.selectedFindlyApp = searchData;
        this.topDownSearchInstance.setAPIDetails();
      }
    }
  }

  distroyTopDownSearch() {
    if (this.topDownSearchInstance && this.topDownSearchInstance.destroy) {
      this.topDownSearchInstance.destroy();
      $('body').removeClass('sdk-body');
    }
  }

  restorepreviousState() {
    let route = '/apps';
    const selectedAccount =
      this.localstore.getSelectedAccount() ||
      this.authService.getSelectedAccount();
    if (
      this.previousState &&
      this.previousState.selectedApp &&
      this.previousState.selectedAccountId &&
      this.previousState.selectedAccountId === selectedAccount.accountId
    ) {
      const apps = this.appsData;
      if (apps && apps.length) {
        const selectedApp = _.filter(apps, (app) => {
          return app._id === this.previousState.selectedApp;
        });
        if (selectedApp && selectedApp.length) {
          this.appSelectionService.setAppWorkFlowData(
            selectedApp[0],
            this.previousState.selectedQueryPipeline
          );
          this.resetFindlySearchSDK(this.workflowService.selectedApp());
          route = '/summary';
          if (this.previousState.route) {
            route = this.previousState.route;
          }
          try {
            if (
              this.workflowService.selectedApp() &&
              this.workflowService.selectedApp().searchIndexes &&
              this.workflowService.selectedApp().searchIndexes.length
            ) {
              this.router.navigate([route], { skipLocationChange: true });
              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: {},
                queryParamsHandling: '',
              });
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
            console.log(e);
          }
        }
      }
    } else {
      let paramsExist: any;
      this.activatedRoute.queryParams.subscribe((params) => {
        // console.log("params", params);
        paramsExist = params;
      });
      this.router.navigate(['/apps'], { skipLocationChange: true });
      // this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {}, queryParamsHandling: '' });
    }
  }

  preview(selection): void {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
  }
  assertion(options, callback) {
    this.service.invoke('bt.post.sts', {}).subscribe((res) => {
      const data = res;
      options.assertion = data.jwt;
      callback(null, options);
    });
  }

  loadSearchExperience() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline()
      ? this.workflowService.selectedQueryPipeline()._id
      : this.selectedApp.searchIndexes[0].queryPipelineId;
    /** fetching the ID from Previous state for refresh app */
    if (!this.queryPipelineId) {
      const preStateData = this.localstore.getPreviousState();
      if (preStateData && preStateData.selectedQueryPipeline) {
        this.queryPipelineId = preStateData.selectedQueryPipeline._id;
      }
    }
    if (
      this.indexPipelineId &&
      this.queryPipelineId &&
      this.searchExperinceLoading === false
    ) {
      this.getSearchExperience();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.workflowService.disablePerfectScroll = window.innerWidth <= 600;
  }

  // added setTimeout function and verifying for indexpipeline before we make api call, for  resolving the search interface failure issue
  getSearchExperience() {
    // let selectedApp: any;
    var _self = this;
    this.selectedApp = this.workflowService.selectedApp();
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      indexPipelineId: this.workflowService.selectedIndexPipeline(),
      queryPipelineId: this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : this.queryPipelineId,
    };
    setTimeout(function () {
      if (!quaryparms.indexPipelineId) {
        quaryparms.indexPipelineId =
          _self.workflowService.selectedIndexPipelineId;
      }
      if (!quaryparms.queryPipelineId) {
        quaryparms.queryPipelineId =
          _self.workflowService.selectedQueryPipeline()
            ? _self.workflowService.selectedQueryPipeline()._id
            : _self.selectedApp.searchIndexes[0].queryPipelineId;
      }
      if (quaryparms.indexPipelineId && quaryparms.queryPipelineId) {
        _self.service.invoke('get.searchexperience.list', quaryparms).subscribe(
          (res) => {
            _self.searchExperienceConfig = res;
            _self.searchExperinceLoading = true;
            _self.headerService.updateSearchConfigurationValue(res);
            $('#test-btn-launch-sdk').removeAttr('disabled').button('refresh');
            _self.headerService.searchConfiguration = res;
            //if (_self.isDemoApp) _self.searchSDKHeader();
          },
          (errRes) => {
            // console.log("getSearchExperience failed happen");
            // console.log(errRes);
          }
        );
      } else {
        _self.getSearchExperience();
      }
    }, 100);
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      // this.showHideSearch(false);
      // this.showHideTopDownSearch(false);
      this.authService.findlyApps.subscribe((res: any) => {
        this.loading = true;
        this.appsData = res;
      });
    }
    if (event instanceof NavigationEnd) {
      // console.log("event.url", event.url)
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
        // console.log('navigated to apps throught navigator and closed preview ball');
      } else {
        if (this.workflowService.selectedApp()) {
          this.appSelectionService.getStreamData(
            this.workflowService.selectedApp()
          );
        }
        const path = event.url.split('?')[0];
        if (path && path !== '/') {
          this.appSelectionService.setPreviousState(path);
          this.resetFindlySearchSDK(this.workflowService.selectedApp());
          this.selectApp(true);
          this.loadSearchExperience();
          this.searchExperienceSubscription =
            this.appSelectionService.appSelectedConfigs.subscribe((res) => {
              this.loadSearchExperience();
            });
        } else {
          // this.showHideSearch(false);
          // this.showHideTopDownSearch(false);
          this.selectApp(false);
          // console.log('failed to detect path throught navigator and closed preview ball');
        }
      }
      this.authService.findlyApps.subscribe((res) => {
        this.appsData = res;
        // this.restorepreviousState();
        this.loading = false;
      });
      //this.appSelectionService.getInlineManualcall();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }
}
