/* eslint-disable @typescript-eslint/no-this-alias */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { SearchSdkService } from './services/search-sdk.service';
import { SideBarService } from '@kore.apps/services/header.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { EndPointsService } from '@kore.apps/services/end-points.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { LazyLoadService } from '@kore.libs/shared/src';
import { LocalStoreService } from '@kore.services/localstore.service';
import { Store } from '@ngrx/store';
import { KRSearch } from '../../../assets/web-kore-sdk/minified-sdk/kore-web-sdk-umd-search.js';
import { AuthService } from '@kore.apps/services/auth.service';
import { InsightsModule } from '../insights/insights.module';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs/operators';
import {
  selectAppIds,
  selectSearchExperiance,
} from '@kore.apps/store/app.selectors';

declare const $: any;
declare let self: any;

@Component({
  standalone: true,
  selector: 'app-search-sdk',
  templateUrl: './search-sdk.component.html',
  styleUrls: ['./search-sdk.component.scss'],
  imports: [MatButtonModule, InsightsModule, NgIf],
})
export class SearchSdkComponent implements OnInit, OnDestroy {
  searchExperienceConfig: any = {};
  sub: Subscription;
  styleSub: Subscription;
  $: any;

  loading = true;
  userInfo: any = {};
  showMainMenu = true;
  settingMainMenu = false;
  sourceMenu = false;
  previousState;
  appsData: any;
  searchInstance: any;
  findlyBusinessConfig: any = {};
  bridgeDataInsights = true;
  addNewResult = true;
  structure = 'bottom';
  showInsightFull = false;
  queryText;
  searchRequestId: string;
  subscription: Subscription;
  SearchConfigurationSubscription: Subscription;
  searchSDKSubscription: Subscription;
  resultRankDataSubscription: Subscription;
  showHideMainMenuSubscription: Subscription;
  showHideSettingsMenuSubscription: Subscription;
  showHideSourceMenuSubscription: Subscription;
  closeSDKSubscription: Subscription;
  searchExperienceSubscription: Subscription;
  showSDKApp: Subscription;
  queryConfigsSubscription: Subscription;
  pathsObj: any = {
    '/faq': 'Faqs',
    '/content': 'Contnet',
    '/sources': 'Source',
    '/botActions': 'Bot Actions',
  };
  topDownSearchInstance: any;
  searchExperinceLoading = false;
  indexPipelineId: any;
  queryPipelineId: any;
  searchIndexId;
  // isDemoApp: boolean = false;
  selectedApp: any;
  streamId;
  // @ViewChild('headerComp') headerComp: AppHeaderComponent;

  constructor(
    private authService: AuthService,
    // public localstore: LocalStoreService,
    public workflowService: WorkflowService,
    // private activatedRoute: ActivatedRoute,
    private headerService: SideBarService,
    public service: ServiceInvokerService,
    // changed to public for resolving the search interface failure issue
    private endpointservice: EndPointsService,
    private appSelectionService: AppSelectionService,
    // public dockService: DockStatusService,
    // public inlineManual: InlineManualService,
    // public mixpanel: MixpanelServiceService,
    // private translate: TranslateService,
    private searchSdkService: SearchSdkService,
    public localstore: LocalStoreService,
    private lazyLoadService: LazyLoadService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.$ = $;

    this.getSearchExperience();
    this.initAppIds();
    this.loadStyles();
    // this.SearchConfigurationSubscription =
    //   this.headerService.resetSearchConfiguration.subscribe((res) => {

    //   });
    this.toggleSdkPopup();

    // before click
    this.distroySearch();

    // after load
    this.showHideSearch(false);
    this.showHideTopDownSearch(false);

    this.initSearchSDK();

    this.openSdk();
    // });

    // this.loadScripts().then(() => {
    //   // before click
    //   this.distroySearch();

    //   // after load
    //   this.showHideSearch(false);
    //   this.showHideTopDownSearch(false);

    //   this.initSearchSDK();
    // });
  }

  initAppIds() {
    const idsSub = this.store
      .select(selectAppIds)
      .subscribe(
        ({ streamId, searchIndexId, indexPipelineId, queryPipelineId }) => {
          this.streamId = streamId;
          this.searchIndexId = searchIndexId;
          this.indexPipelineId = indexPipelineId;
          this.queryPipelineId = queryPipelineId;
        }
      );
    this.sub?.add(idsSub);
  }

  // added setTimeout function and verifying for indexpipeline before we make api call, for  resolving the search interface failure issue
  getSearchExperience() {
    const searchExperianceConfigSub = this.store
      .select(selectSearchExperiance)
      .pipe(filter((res) => !!res))
      .subscribe((res) => {
        if (!this.$) {
          this.$ = $;
        }
        this.searchExperienceConfig = res;
        this.searchExperinceLoading = true;
        this.headerService.updateSearchConfigurationValue(res);
        this.$('#test-btn-launch-sdk').removeAttr('disabled').button('refresh');
        this.headerService.searchConfiguration = res;
      });

    this.sub?.add(searchExperianceConfigSub);
  }

  openSdk() {
    console.log('OPEN');
    this.resetFindlySearchSDK({
      _id: this.streamId,
      pipelineId: this.queryPipelineId,
      indexpipelineId: this.indexPipelineId,
    });

    this.searchSDKHeader();
  }

  closeSdk() {
    console.log('CLOSE');
  }

  toggleSdkPopup() {
    this.sub = this.searchSdkService.sdkSource$.subscribe((isOpen) => {
      if (isOpen) {
        this.cdr.detach();
        // open
        this.openSdk();
      } else {
        // close
        this.cdr.reattach();
        this.searchSDKHeader();
        this.closeSdk();
      }
    });
  }

  loadStyles() {
    this.styleSub = this.lazyLoadService
      .loadStyle('searchsdk.min.css')
      .subscribe();
  }

  async loadScripts() {
    // await import(
    //   '../../../assets/web-kore-sdk/demo/libs/kore-no-conflict-start.js'
    // );
  }

  initSearchSDK() {
    this.$('body').append('<div class="start-search-icon-div"></div>');
    setTimeout(() => {
      this.$('.start-search-icon-div').click(() => {
        if (!this.$('.search-background-div:visible').length) {
          this.showHideSearch(true);
        } else {
          this.showHideSearch(false);
        }
      });
    }, 200);
    this.$('#advanceModeSdk').change(function () {
      if (this.$(this).is(':checked')) {
        this.$('.search-container').removeClass('advanced-mode');
      } else {
        this.$('.search-container').addClass('advanced-mode');
      }
    });
  }

  showHideSearch(show, disabelInstanceDistroy?) {
    if (show) {
      this.$('.appContent').append(
        '<div class="search-background-div" style="display:block"><div class="bgDullOpacity"></div></div>'
      );
      this.$('.appContent').append(
        '<label class="kr-sg-toggle advancemode-checkbox" style="display:none;"><input type="checkbox" id="advanceModeSdk" checked><div class="slider"></div></label>'
      );
      this.$('.search-background-div').show();
      // this.$('.start-search-icon-div').addClass('active');
      this.$('.search-background-div')
        .off('click')
        .on('click', (event) => {
          if (event.target.classList.contains('bgDullOpacity')) {
            this.cacheBottomUpSDK(false);
          }
        });
      this.$('.advancemode-checkbox').css({ display: 'block' });
      this.$('.search-container').addClass('search-container-adv');
      this.$('.search-container').addClass('add-new-result');
      this.initSearch();
      this.$('#test-btn-launch-sdk').addClass('active');
      this.$('#open-chat-window-no-clicks').css({ display: 'block' });
      this.headerService.isSDKOpen = true;
      this.cdr.detach();
    } else {
      this.cdr.reattach();
      setTimeout(() => {
        this.cdr.detectChanges();
      });
      this.$('.search-background-div').remove();
      this.$('.advancemode-checkbox').remove();
      this.$('.start-search-icon-div').removeClass('active');
      this.bridgeDataInsights = true;
      this.addNewResult = true;
      this.showInsightFull = false;
      this.distroySearch();
      this.$('#test-btn-launch-sdk').removeClass('active');
      this.$('#open-chat-window-no-clicks').css({ display: 'none' });
      this.headerService.isSDKCached = false;
      this.headerService.isSDKOpen = false;
    }
  }

  cacheBottomUpSDK(key) {
    if (key) {
      this.$('.search-background-div').css('display', 'block');
      if (
        this.$('#show-all-results-container').length &&
        this.$('#show-all-results-container').attr('isCached') == 'true'
      ) {
        this.$('#show-all-results-container').css('display', 'block');
      }
      this.$('#test-btn-launch-sdk').addClass('active');
      this.$('#open-chat-window-no-clicks').css({ display: 'block' });
      this.headerService.isSDKOpen = true;
      this.cdr.detach();
    } else {
      this.cdr.reattach();
      setTimeout(() => {
        this.cdr.detectChanges();
      });
      this.$('.search-background-div').css('display', 'none');
      this.$('body').removeClass('sdk-body');
      if (this.$('#show-all-results-container').length) {
        if (
          !this.$('#show-all-results-container').attr('isCached') ||
          this.$('#show-all-results-container').attr('isCached') == 'false'
        ) {
          if (
            this.$('#show-all-results-container').attr('isCached') == 'false'
          ) {
            this.$('#show-all-results-container').attr('isCached', 'false');
          }
          // else {
          //   this.$('#show-all-results-container').attr('isCached', 'true');
          // }
          this.$('#show-all-results-container').css('display', 'none');
        }
      }
      this.$('#test-btn-launch-sdk').removeClass('active');
      this.$('#open-chat-window-no-clicks').css({ display: 'none' });
      this.headerService.isSDKCached = true;
      this.headerService.isSDKOpen = false;
    }
    this.addNewResult = true;
  }

  //open search SDK from header
  searchSDKHeader() {
    if (this.searchExperienceConfig) {
      //this.isDemoApp = false;
      if (
        this.searchExperienceConfig.experienceConfig &&
        this.searchExperienceConfig.experienceConfig.searchBarPosition !== 'top'
      ) {
        if (
          !this.headerService.isSDKCached ||
          !this.$('.search-background-div').length
        ) {
          if (!this.$('.search-background-div:visible').length) {
            this.showHideSearch(true);
            this.resultRankDataSubscription =
              this.headerService.resultRankData.subscribe((res: any) => {
                this.searchInstance.customTourResultRank(res);
              });
          } else {
            // this.showHideSearch(false);
            this.cacheBottomUpSDK(false);
          }
        } else {
          if (this.$('.search-background-div').css('display') == 'block') {
            this.cacheBottomUpSDK(false);
          } else {
            this.cacheBottomUpSDK(true);
          }
        }
      } else {
        if (!this.$('.top-down-search-background-div:visible').length) {
          this.$('.top-down-search-background-div').addClass('active');
          this.showHideTopDownSearch(true);
        } else {
          this.showHideTopDownSearch(false);
          this.distroySearch();
        }
      }
    }
  }

  distroySearch() {
    if (this.searchInstance && this.searchInstance.destroy) {
      this.searchInstance.destroy();
    }
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.styleSub?.unsubscribe();
  }

  initSearch() {
    const findlyConfig = this.setBotConfiguration();
    this.distroySearch();
    this.clearBodyClasses();
    this.searchInstance = new KRSearch(findlyConfig);
    this.searchInstance.show(findlyConfig);
    this.resetFindlySearchSDK(this.workflowService.selectedApp());
    $('body').addClass('sdk-body');
  }

  assertion(options, callback) {
    self.service?.invoke('bt.post.sts', {}).subscribe((res) => {
      const data = res;
      options.assertion = data.jwt;
      callback(null, options);
    });
  }

  resetFindlySearchSDK(searchData) {
    if (this.searchInstance && this.searchInstance.setAPIDetails) {
      window.selectedFindlyApp = {
        _id: this.searchIndexId,
        pipelineId: this.queryPipelineId,
        indexpipelineId: this.indexPipelineId,
      };
      this.searchInstance.setAPIDetails();
    }
  }

  clearBodyClasses() {
    // have to clear the classes set for Top-down
    if (this.$('body').hasClass('top-down')) {
      this.$('body').removeClass('top-down');
      this.$('body').removeClass('sdk-top-down-interface');
      this.$('body').removeClass('sdk-body');
    }
  }

  /******************** Search SDK **********************/

  distroyTopDownSearch() {
    if (this.topDownSearchInstance && this.topDownSearchInstance.destroy) {
      this.topDownSearchInstance.destroy();
      this.$('body').removeClass('sdk-body');
    }
  }

  initTopDownSearch() {
    const findlyConfig = this.setBotConfiguration();
    this.distroyTopDownSearch();
    this.resetFindlyTopDownSearchSDK(this.workflowService.selectedApp());
    this.topDownSearchInstance = new KRSearch(findlyConfig);
    this.topDownSearchInstance.show(findlyConfig);
    this.$('body').addClass('sdk-body');
  }

  showHideTopDownSearch(show) {
    if (show) {
      this.$('.appContent').append(
        '<div class="top-down-search-background-div"><div class="bgDullOpacity"></div></div>'
      );
      this.$('.top-down-search-background-div').show();
      this.$('.top-down-search-background-div')
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
      this.$('.appContent').append(
        '<div class="close-top-down-search-outer"><img class="close-top-down-search" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuNzA3MDMgNS4wMDAwOUw5Ljg1MzU1IDAuODUzNTUzQzEwLjA0ODggMC42NTgyOTEgMTAuMDQ4OCAwLjM0MTcwOSA5Ljg1MzU1IDAuMTQ2NDQ3QzkuNjU4MjkgLTAuMDQ4ODE1NyA5LjM0MTcxIC0wLjA0ODgxNTQgOS4xNDY0NSAwLjE0NjQ0N0w0Ljk5OTkxIDQuMjkzTDAuODUzNTU1IDAuMTQ2ODE0QzAuNjU4Mjg4IC0wLjA0ODQ0NDQgMC4zNDE3MDYgLTAuMDQ4NDM4IDAuMTQ2NDQ4IDAuMTQ2ODI4Qy0wLjA0ODgxMDQgMC4zNDIwOTQgLTAuMDQ4ODA0IDAuNjU4Njc3IDAuMTQ2NDYyIDAuODUzOTM1TDQuMjkyOCA1LjAwMDFMMC4xNDY0NDcgOS4xNDY0NkMtMC4wNDg4MTU3IDkuMzQxNzMgLTAuMDQ4ODE1NSA5LjY1ODMxIDAuMTQ2NDQ3IDkuODUzNTdDMC4zNDE3MDkgMTAuMDQ4OCAwLjY1ODI5MiAxMC4wNDg4IDAuODUzNTUzIDkuODUzNTdMNC45OTk5MiA1LjcwNzJMOS4xNDY0NiA5Ljg1MzU3QzkuMzQxNzMgMTAuMDQ4OCA5LjY1ODMxIDEwLjA0ODggOS44NTM1NyA5Ljg1MzU1QzEwLjA0ODggOS42NTgyOSAxMC4wNDg4IDkuMzQxNzEgOS44NTM1NSA5LjE0NjQ1TDUuNzA3MDMgNS4wMDAwOVoiIGZpbGw9IiMyMDIxMjQiLz4KPC9zdmc+Cg=="></div>'
      );
      this.$('.close-top-down-search-outer')
        .off('click')
        .on('click', () => {
          this.showHideTopDownSearch(false);
        });
      this.$('.start-search-icon-div').addClass('active');
      this.$('.search-container').addClass('search-container-adv');
      this.$('.search-container').addClass('add-new-result');
      this.initTopDownSearch();
      this.$('#test-btn-launch-sdk').addClass('active');
      this.$('#open-chat-window-no-clicks').css({ display: 'block' });
      this.headerService.isSDKOpen = true;
    } else {
      this.$('.top-down-search-background-div').remove();
      this.$('.close-top-down-search-outer').remove();
      this.$('body').removeClass('sdk-top-down-interface');
      this.$('.start-search-icon-div').removeClass('active');
      this.bridgeDataInsights = true;
      this.addNewResult = true;
      this.showInsightFull = false;
      this.distroyTopDownSearch();
      this.$('#test-btn-launch-sdk').removeClass('active');
      this.$('#open-chat-window-no-clicks').css({ display: 'none' });
      this.headerService.isSDKOpen = false;
    }
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
        this.searchIndexId
      ) {
        const searchData = {
          _id: this.searchIndexId,
          pipelineId: this.queryPipelineId || '',
          indexpipelineId: this.indexPipelineId || '',
        };
        window.selectedFindlyApp = searchData;
        this.topDownSearchInstance.setAPIDetails();
      }
    }
  }
  sdkBridge(parms) {
    // can be converted as service for common Use
    const _self = this;
    // console.log(parms);
    // this.bridgeDataInsights = !parms.data;
    let call = false;
    if (parms.type == 'onboardingjourney') {
      this.searchRequestId = parms.requestId;
      //this.appSelectionService.updateTourConfig(parms.data);
    }
    // if (parms.type == 'fullResult') {
    //   this.appSelectionService.updateTourConfig('test');
    // }
    if (
      parms.type === 'show' &&
      parms.data === true &&
      _self.bridgeDataInsights
    ) {
      _self.bridgeDataInsights = false;
      call = true;
    } else {
      _self.bridgeDataInsights = true;
      call = false;
    }
    if (!call) {
      if (
        parms.type === 'showInsightFull' &&
        parms.data === true &&
        _self.bridgeDataInsights
      ) {
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
        this.distroySearch();
      } else {
        this.showHideTopDownSearch(false);
      }
    }

    if (parms.type === 'refreshSearchContainer' && parms.data === false) {
      if (parms.bottomUp) {
        this.refreshSDK();
      }
    }
  }
  refreshSDK() {
    this.showHideSearch(false);
    setTimeout(() => {
      this.showHideSearch(true);
    }, 200);
  }
  closeResultBody(event) {
    const bridgeObj = { type: 'addNew', data: false, query: null };
    this.sdkBridge(bridgeObj);
    if (this.searchInstance && this.searchInstance.applicationToSDK && event) {
      this.searchInstance.applicationToSDK(event);
    }
    if (
      this.topDownSearchInstance &&
      this.topDownSearchInstance.applicationToSDK &&
      event
    ) {
      this.topDownSearchInstance.applicationToSDK(event);
    }
  }

  setBotConfiguration() {
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
      this.searchIndexId
    ) {
      botOptionsFindly.searchIndexID = this.searchIndexId;
    }
    botOptionsFindly.queryPipelineId = this.queryPipelineId || '';
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
    if (this.authService.getAccessToken()) {
      botOptionsFindly.accessToken = this.authService.getAccessToken();
    }
    botOptionsFindly.JWTUrl =
      this.endpointservice.getServiceInfo('jwt.grunt.generate').endpoint +
      '/users/sts?rnd=fle73l';
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
      isDev: true,
    };
    this.findlyBusinessConfig = this;
    findlyConfig.findlyBusinessConfig = this.findlyBusinessConfig;
    const currentSubscriptionPlan =
      this.appSelectionService?.currentsubscriptionPlanDetails;
    const isFreePlan =
      currentSubscriptionPlan?.subscription?.planName === 'Free' ? true : false;
    findlyConfig.searchInterfaceConfig = {
      ...this.searchExperienceConfig,
      freePlan: isFreePlan,
    };
    return findlyConfig;
  }
}
