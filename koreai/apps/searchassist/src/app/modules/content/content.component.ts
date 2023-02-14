import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  TestabilityRegistry,
} from '@angular/core';
import { SliderComponentComponent } from '../../shared/slider-component/slider-component.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { fadeInOutAnimation } from '../../helpers/animations/animations';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
declare const $: any;
import * as _ from 'underscore';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import {
  CrwalObj,
  AdvanceOpts,
  AllowUrl,
  BlockUrl,
  scheduleOpts,
} from '../../helpers/models/Crwal-advance.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
import { SchedulerComponent } from '../../components/scheduler/scheduler.component';
import { EMPTY_SCREEN } from '../../modules/empty-screen/empty-screen.constants';
import { UpgradePlanComponent } from '../../helpers/components/upgrade-plan/upgrade-plan.component';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { AuthService } from '@kore.apps/services/auth.service';
import { InlineManualService } from '@kore.apps/services/inline-manual.service';
import { MixpanelServiceService } from '@kore.apps/services/mixpanel-service.service';
import { OnboardingComponent } from '../onboarding/onboarding.component';

declare let require: any;
const FileSaver = require('file-saver');
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: [fadeInOutAnimation],
})
export class ContentComponent implements OnInit, OnDestroy {
  emptyScreen = EMPTY_SCREEN.CONTENT;
  isPageLoader = false;
  loadingSliderContent = false;
  showSearch;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  executionPop = -1;
  loadingcheckForUpdate = false;
  isEditDoc = false;
  editDocObj: any = {};
  isEdittitle;
  contentId;
  content_id;
  skip = 0;
  schedularData: any;
  edit: any = {};
  Id;
  editConfObj: any = {};
  editTitleFlag = false;
  isConfig = false;
  numberOf: any = {};
  allowUrl: AllowUrl = new AllowUrl();
  blockUrl: BlockUrl = new BlockUrl();
  allowUrlArr: AllowUrl[] = [];
  blockUrlArr: BlockUrl[] = [];
  activeClose = false;
  totalCrawledCount;
  oldQuedJob = [];
  filterSystem: any = {
    typeHeader: 'type',
    statusHeader: 'status',
    typefilter: 'all',
    statusFilter: 'all',
  };
  firstFilter: any = { header: '', source: '' };
  currentView = 'list';
  searchSources = '';
  pagesSearch = '';
  lastPageSearch = '';
  lastData: any;
  selectedApp: any = {};
  resources: any = [];
  polingObj: any = {};
  resourcesStatusObj: any = {};
  loadingContent = true;
  sectionShow = true;
  serachIndexId;
  filterResourcesBack;
  btnCount;
  btnAllCount;
  pagingData: any[] = [];
  statusArr = [];
  docTypeArr = [];
  selectedFilter: any = '';
  executionLogStatus = false;
  componentType = 'addData';
  onboardingOpened = false;
  currentRouteData: any = '';
  contentTypes = {
    webdomain: 'Web',
    document: 'Doc',
  };
  statusObj: any = {
    failed: { name: 'Failed', color: 'red' },
    FAILED: { name: 'Failed', color: 'red' },
    successfull: { name: 'Successfull', color: 'green' },
    SUCCESSFULL: { name: 'Successfull', color: 'green' },
    success: { name: 'Success', color: 'green' },
    SUCCESS: { name: 'Success', color: 'green' },
    queued: { name: 'In-Queue', color: 'blue' },
    QUEUED: { name: 'In-Queue', color: 'blue' },
    validation: { name: 'In-Queue', color: '#0D6EFD' },
    VALIDATION: { name: 'In-Queue', color: '#0D6EFD' },
    scheduled: { name: 'Validated', color: '#0D6EFD' },
    SCHEDULED: { name: 'Validated', color: '#0D6EFD' },
    halted: { name: 'Stopped', color: '#DD3646' },
    HALTED: { name: 'Stopped', color: '#DD3646' },
    running: { name: 'In Progress', color: 'blue' },
    RUNNING: { name: 'In Progress', color: 'blue' },
    configured: { name: 'Validated', color: 'blue' },
    CONFIGURED: { name: 'Validated', color: 'blue' },
    inProgress: { name: 'In Progress', color: 'blue' },
    INPROGRESS: { name: 'In Progress', color: 'blue' },
  };
  executionObj: any = {
    'Execution Successful': {
      tooltip: '',
      icon: 'assets/icons/content/success.svg',
    },
    'Execution Failed': {
      tooltip: '',
      icon: 'assets/icons/content/failed.svg',
    },
    'Execution failed': {
      tooltip: '',
      icon: 'assets/icons/content/failed.svg',
    },
    'Execution Stopped': {
      tooltip: 'Sitemap Validation failed due to timeout',
      icon: 'assets/icons/content/stopped.svg',
    },
    'Execution In Progress': {
      tooltip: '',
      icon: 'assets/icons/content/ex-stat_inprogress.svg',
    },
  };
  stateExecutionstageStatusObj: any = {
    success: { icon: 'assets/icons/content/success.svg' },
    failed: { icon: 'assets/icons/content/failed.svg' },
    stopped: { icon: 'assets/icons/content/stopped.svg' },
    running: { icon: 'assets/icons/content/ex-stat_inprogress.svg' },
    crawling: { icon: 'assets/icons/content/ex-stat_inprogress.svg' },
    halted: { icon: 'assets/icons/content/stopped.svg' },
    inProgress: { icon: 'assets/icons/content/ex-stat_inprogress.svg' },
  };
  finalStateExecutionstageStatusObj: any = {
    success: { icon: 'assets/icons/content/succes-circle.svg' },
    failed: { icon: 'assets/icons/content/failed-circle.svg' },
    running: { icon: 'assets/icons/content/ex-stat_inprogress.svg' },
    halted: { icon: 'assets/icons/content/stopped.svg' },
    stopped: { icon: 'assets/icons/content/stopped.svg' },
  };
  stateExecutionStageNameObj: any = {
    process_in_queue: {
      label: 'Process in Queue',
      icon: this.stateExecutionstageStatusObj,
    },
    url_validation: {
      label: 'URL Validation',
      icon: this.stateExecutionstageStatusObj,
    },
    network_validation: {
      label: 'Network Validation',
      icon: this.stateExecutionstageStatusObj,
    },
    indexing_restrictions: {
      label: 'Index Restriction',
      icon: this.stateExecutionstageStatusObj,
    },
    content_verification: {
      label: 'Content Verification',
      icon: this.stateExecutionstageStatusObj,
    },
    sitemap_identification: {
      label: 'Sitemap Identification',
      icon: this.stateExecutionstageStatusObj,
    },
    crawling: { label: 'Crawling', icon: this.stateExecutionstageStatusObj },
    stopped: { label: 'Stopped', icon: this.finalStateExecutionstageStatusObj },
    failed: { label: 'Failed', icon: this.finalStateExecutionstageStatusObj },
    successful: {
      label: 'Successful',
      icon: this.finalStateExecutionstageStatusObj,
    },
  };

  availableStructuredDataSources = [
    {
      name: 'Import Structured Data',
      description: 'Import from JSON or CSV',
      icon: 'assets/icons/content/database-Import.svg',
      id: 'contentStucturedDataImport',
      sourceType: 'data',
      resourceType: 'structuredData',
    },
    {
      name: 'Add Structured Data',
      description: 'Add structured data manually',
      icon: 'assets/icons/content/database-add.svg',
      id: 'contentStucturedDataAdd',
      sourceType: 'data',
      resourceType: 'structuredDataManual',
    },
  ];

  sliderStep = 0;
  selectedPage: any = {};
  selectedSource: any = {};
  docContent: any = {};
  docContentType: any = {};
  resourcesDoc: any = {};
  currentStatusFailed: any = false;
  userInfo: any = {};
  contentModaltype: any;
  sortedData: any = [];
  statusModalPopRef: any = [];
  statusModalDocumentRef: any;
  title: any;
  editConfigEnable = false;
  addSourceModalPopRef: any = [];
  showSourceAddition: any = null;
  isAsc = true;
  selectedSort = '';
  recordStr = 1;
  recordEnd = 10;
  totalRecord = 0;
  limitpage = 10;
  limitAllpage = 10;
  allInOne = false;
  urlConditionAllow = 'is';
  urlConditionBlock = 'is';
  doesntContains = "Doesn't Contains";
  filterTableheaderOption = '';
  filterTableSource = 'all';
  execution = false;
  page = false;
  executionHistoryData: any = [];
  sourceStatus = 'success';
  useCookies = false;
  respectRobotTxtDirectives = false;
  crawlBeyondSitemaps = false;
  loadingContent1;
  isJavaScriptRendered = true;
  blockHttpsMsgs = false;
  crawlDepth: number;
  maxUrlLimit: number;
  crwalOptionLabel = '';
  structuredDataModalRef: any;
  addStructuredDataModalPopRef: any;
  selectedSourceType: any;
  isStructuredDataAdd = false;
  sortedObject = {
    type: 'fieldName',
    position: 'up',
    value: 1,
  };
  filterObject = {
    type: '',
    header: '',
  };
  isSearchLoading = false;
  isPageDelete = false;
  @ViewChild('statusModalDocument') statusModalDocument: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  @ViewChild('addSourceModalPop') addSourceModalPop: KRModalComponent;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild('structuredDataModal') structuredDataModal: KRModalComponent;
  @ViewChild('addStructuredDataModalPop')
  addStructuredDataModalPop: KRModalComponent;
  @ViewChild(SliderComponentComponent)
  sliderComponent: SliderComponentComponent;
  @ViewChild('schedular') schedular: SchedulerComponent;
  @ViewChild('plans') plans: UpgradePlanComponent;
  @ViewChild(OnboardingComponent, { static: true })
  onBoardingComponent: OnboardingComponent;
  templateState = new Subject();
  loadingData = true;
  isSourceSearchClear = false;

  //latest object wrt crawl changes
  editSource: any;
  allowURLValues: any = [
    'is',
    'isNot',
    'beginsWith',
    'endsWith',
    'contains',
    'doesNotContains',
  ];
  allowURLArray: any = [{ condition: 'contains', url: '' }];
  blockURLArray: any = [{ condition: 'contains', url: '' }];
  authorizationFieldObj: any = {
    type: '',
    key: '',
    value: '',
    isEnabled: true,
    isShow: false,
    isEditable: false,
    duplicateObj: { type: '', key: '', value: '' },
  };
  formFieldObj: any = {
    type: '',
    key: '',
    value: '',
    isEnabled: true,
    isShow: false,
    isPwdShow: false,
    isEditable: false,
    isRequired: true,
    duplicateObj: { type: '', key: '', value: '' },
  };
  loadImageText = false;
  autorizationFieldTypes: any = [
    'header',
    'payload',
    'querystring',
    'pathparam',
  ];
  testTypes: any = ['text_presence', 'redirection_to', 'status_code'];
  authenticationTypes: any = ['basic', 'form'];
  crawlOptions: any = ['any', 'block', 'allow'];
  inputTypes: any = ['textbox', 'password'];
  isPasswordShow = false;
  isShowSchedlerModal = false;
  scheduleObject: any = {};
  isContentPage = false;
  pagesSearchModelChanged = new Subject<string>();
  sourcesSearchModelChanged = new Subject<string>();
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public inlineManual: InlineManualService,
    public dockService: DockStatusService,
    private appSelectionService: AppSelectionService,
    public mixpanel: MixpanelServiceService
  ) {}

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]._id;
    this.getDyanmicFilterData();
    this.getSourceList();
    this.getJobStatusForMessages();
    this.userInfo = this.authService.getUserInfo() || {};
    window.addEventListener('scroll', this.scroll, true);

    this.templateState.subscribe((val) => {
      // console.log(val)
    });
    this.pagesSearchModelChanged.pipe(debounceTime(300)).subscribe(() => {
      this.getCrawledPages(10, 0);
    });
    this.sourcesSearchModelChanged.pipe(debounceTime(300)).subscribe(() => {
      this.getSourceList(null, this.searchSources, 'search');
    });
  }

  isEmptyScreenLoading(isLoading) {
    this.loadingContent = isLoading;
  }

  scroll = (event): void => {
    //console.log(event)
  };

  hoverExecutionLog() {
    this.executionLogStatus = true;
  }
  addNewContentSource(type) {
    const isFreePlan =
      this.appSelectionService?.currentsubscriptionPlanDetails?.subscription
        ?.planName === 'Free'
        ? true
        : false;
    isFreePlan && type === 'contentDoc'
      ? this.plans?.openSelectedPopup('free_upgrade')
      : (this.showSourceAddition = type);
    if (type === 'contentWeb') {
      this.mixpanel.postEvent('Enter Crawl web domain', {});
    } else if (type === 'contentDoc') {
      this.mixpanel.postEvent('Enter Upload Content File', {});
    }
  }

  addStructuredDataSource() {
    // this.structuredDataModalRef = this.structuredDataModal.open();
    this.isStructuredDataAdd = true;
    this.selectedSourceType = JSON.parse(
      JSON.stringify(this.availableStructuredDataSources[0])
    );
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  openStructuredData() {
    this.structuredDataModalRef = this.structuredDataModal.open();
  }

  closeAddStructuredDataModal() {
    if (
      this.addStructuredDataModalPopRef &&
      this.addStructuredDataModalPopRef.close
    ) {
      this.isStructuredDataAdd = false;
      this.addStructuredDataModalPopRef.close();
    }
  }

  compare(a: number | string, b: number | string, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortBy(sort) {
    const data = this.resources.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'type':
          return this.compare(a.type, b.type, isAsc);
        case 'recentStatus':
          return this.compare(a.recentStatus, b.recentStatus, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'numPages':
          return this.compare(a.numPages, b.numPages, isAsc);
        case 'createdOn':
          return this.compare(a.createdOn, b.createdOn, isAsc);
        default:
          return 0;
      }
    });
    this.resources = sortedData;
  }
  duration(duration) {
    if (duration) {
      const hr = duration.split(':')[0];
      const min = duration.split(':')[1];
      const sec = duration.split(':')[2];
      const milisec = duration.split(':')[3];

      if (hr > 0) {
        if (min >= 0 && sec > 0)
          return (duration = hr + 'h ' + min + 'm ' + sec + 's');
        if (min > 0 && sec <= 0) return (duration = hr + 'h ' + min + 'm');
        if (min <= 0 && sec <= 0) return (duration = hr + 'h ');
      } else if (min > 0) {
        if (sec > 0) return (duration = min + 'm ' + sec + 's');
        if (sec <= 0) return (duration = min + 'm');
      } else if (sec > 0) {
        return (duration = sec + 's');
      } else if (milisec > 0) {
        return (duration = milisec + 'ms');
      } else {
        return (duration = '0' + 'ms');
      }
    }
  }
  convertToDay(repeatOn) {
    switch (repeatOn) {
      case 'SUN':
        return 'Sunday';

      case 'MON':
        return 'Monday';

      case 'TUE':
        return 'Tuesday';

      case 'WED':
        return 'Wednesday';

      case 'THU':
        return 'Thursday';

      case 'FRI':
        return 'Friday';

      case 'SAT':
        return 'Saturday';

      default:
        return '';
    }
  }

  getSourceList(
    nxt?,
    searchValue?,
    searchSource?,
    source?,
    headerOption?,
    sortHeaderOption?,
    sortValue?,
    navigate?,
    request?
  ) {
    this.statusArr = [];
    this.docTypeArr = [];
    const searchIndex = this.selectedApp?.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: 'content',
      offset: this.skip || 0,
      limit: 10,
    };
    let payload: any = {};
    if (!sortHeaderOption && !headerOption) {
      payload = {
        extractionType: 'content',
        sort: {
          name: -1,
        },
      };
    } else {
      payload = request;
    }
    if (this.searchSources) {
      payload.search = this.searchSources;
    }
    if (this.pagesSearch) {
      payload.search = this.pagesSearch;
    }
    this.service.invoke('get.source.list', quaryparms, payload).subscribe(
      (res) => {
        this.resources = res.sources;
        this.totalRecord = res.totalCount || 0;
        //  this.resourcesDoc=this.resources[0].fileMeta;
        //element.advanceSettings.scheduleOpts.interval.intervalType
        this.resources.forEach((element) => {
          if (
            element.advanceSettings &&
            element.advanceSettings.scheduleOpt &&
            element.advanceSettings.scheduleOpts.interval &&
            element.advanceSettings.scheduleOpts.time
          ) {
            if (
              element?.advanceSettings?.scheduleOpts?.interval?.intervalType !=
              'Custom'
            ) {
              let minute = '',
                hour = '';
              if (element?.advanceSettings?.scheduleOpts?.time?.hour)
                hour =
                  (
                    element?.advanceSettings?.scheduleOpts?.time?.hour || ''
                  ).toString().length > 1
                    ? element?.advanceSettings?.scheduleOpts?.time?.hour
                    : '0' + element?.advanceSettings?.scheduleOpts?.time?.hour;
              if (element?.advanceSettings?.scheduleOpts?.time?.minute) {
                minute =
                  (
                    element?.advanceSettings?.scheduleOpts?.time?.minute || ''
                  ).toString().length > 1
                    ? element?.advanceSettings?.scheduleOpts?.time?.minute
                    : '0' +
                      element?.advanceSettings?.scheduleOpts?.time?.minute;
              }
              element['schedule_title'] =
                'Runs ' +
                element?.advanceSettings?.scheduleOpts?.interval?.intervalType +
                ' ' +
                'at ' +
                hour +
                ':' +
                (minute === '' ? '00' : minute) +
                ' ' +
                element?.advanceSettings?.scheduleOpts?.time?.timeOpt +
                ' ' +
                element?.advanceSettings?.scheduleOpts?.time?.timezone;
            } else {
              let repeatOn = '';
              let schedulePeriod = '';
              let every = '';
              let date = '';
              if (
                element?.advanceSettings?.scheduleOpts?.interval
                  ?.intervalValue &&
                element?.advanceSettings?.scheduleOpts?.interval?.intervalValue
                  ?.schedulePeriod
              ) {
                schedulePeriod =
                  element.advanceSettings.scheduleOpts.interval.intervalValue
                    .schedulePeriod;
              }
              if (
                element?.advanceSettings?.scheduleOpts?.interval
                  ?.intervalValue &&
                element?.advanceSettings?.scheduleOpts?.interval?.intervalValue
                  ?.repeatOn
              ) {
                repeatOn =
                  ' on ' +
                  this.convertToDay(
                    element.advanceSettings.scheduleOpts.interval.intervalValue
                      .repeatOn
                  );
              }
              if (
                element?.advanceSettings?.scheduleOpts?.interval
                  ?.intervalValue &&
                element?.advanceSettings?.scheduleOpts?.interval?.intervalValue
                  ?.every
              ) {
                every =
                  element.advanceSettings.scheduleOpts.interval.intervalValue
                    .every;
              }
              if (
                element?.advanceSettings?.scheduleOpts?.interval
                  ?.intervalValue &&
                element?.advanceSettings?.scheduleOpts?.interval?.intervalValue
                  ?.endsOn
              ) {
                date = moment(
                  element.advanceSettings.scheduleOpts.interval.intervalValue
                    .endsOn.endDate
                ).format('Do MMMM YYYY');
              }
              if (date != 'Invalid date') {
                element['schedule_title'] =
                  'Runs once every' +
                  ' ' +
                  every +
                  ' ' +
                  schedulePeriod +
                  repeatOn +
                  ' till' +
                  ' ' +
                  date;
              } else {
                element['schedule_title'] =
                  'Runs once every' +
                  ' ' +
                  every +
                  ' ' +
                  schedulePeriod +
                  repeatOn;
              }
            }
          }
          if (element.jobInfo.createdOn && element.jobInfo.createdOn != '--') {
            element['schedule_createdOn'] = moment(
              element.jobInfo.createdOn
            ).fromNow();
          }
          if (element.jobInfo.executionStats) {
            element['schedule_duration'] = element.jobInfo.executionStats
              .duration
              ? element.jobInfo.executionStats.duration
              : '00:00:00';
            element['schedule_duration'] = this.duration(
              element['schedule_duration']
            );
          }
          if (
            element &&
            element.validations &&
            element.validations.url &&
            !element.validations.url.validated
          ) {
            element['vailadtionTootlip'] = element.validations.url.msg;
          }
          // let hr = element['schedule_duration'].split(":")[0];
          // let min = element['schedule_duration'].split(":")[1];
          // let sec = element['schedule_duration'].split(":")[2];

          // if(hr > 0 ){
          //   if(min > 0 && sec > 0)element['schedule_duration'] = hr + "h " + min + "m " + sec + "s";
          //   if(min > 0 && sec <= 0)element['schedule_duration'] = hr + "h " + min + "m " + sec + "s";
          //   if(min <= 0 && sec <= 0)element['schedule_duration'] = hr + "h ";
          // }else if(min > 0){
          //   if(sec > 0) element['schedule_duration'] =  min + "m " + sec + "s";
          //   if(sec <= 0) element['schedule_duration'] =  min + "m ";
          // }else if(sec > 0){
          //   element['schedule_duration'] = sec + "s";
          // }
        });
        this.filterResourcesBack = [...this.resources];
        // let noPage = 0;
        // res.forEach(element => {
        //   if(element.recentStatus =="success"){
        //     noPage =  element.numPages;
        //   }
        // });
        if (res.numPages) this.pageination(res.numPages, false);
        if (this.resources.length) {
          this.resources.forEach((element) => {
            this.statusArr.push(element.recentStatus);
            this.docTypeArr.push(element.extractionType);
          });
          this.statusArr = [...new Set(this.statusArr)];
          this.docTypeArr = [...new Set(this.docTypeArr)];
        }
        _.map(this.resources, (source) => {
          source.name = source.name || source.title;
          // if(source.extractionType==='file'){
          //   source.name = source.fileMeta.fileName; // source title for upload file (considerig fileName)
          // }
          // else{

          // }
        });
        this.resources = this.resources.reverse();
        if (this.resources && this.resources.length && !nxt) {
          this.poling('content');
        }
        this.isSourceSearchClear = false;
        this.loadingContent = false;
        this.loadingData = false;
        setTimeout(() => {
          $('#searchContentSources').focus();
        }, 100);
        // this.filterTable(this.filterTableSource, this.filterTableheaderOption)
        if (res.sources.length > 0) {
          this.loadingContent = false;
          this.loadingData = false;
          if (!this.inlineManual.checkVisibility('CONTENT_OVERVIEW')) {
            this.inlineManual.openHelp('CONTENT_OVERVIEW');
            this.inlineManual.visited('CONTENT_OVERVIEW');
          }
        } else {
          if (
            (searchValue === undefined && res.sources.length == 0) ||
            (searchValue.length <= 0 && res.sources.length == 0)
          ) {
            this.loadingContent1 = true;
            this.loadingData = true;
          }
          setTimeout(() => {
            if (
              !this.inlineManual.checkVisibility('ADD_CONTENT_FROM_LANDING')
            ) {
              this.inlineManual.openHelp('ADD_CONTENT_FROM_LANDING');
              this.inlineManual.visited('ADD_CONTENT_FROM_LANDING');
            }
          }, 500);
          // if(!this.inlineManual.checkVisibility('ADD_CONTENT_FROM_LANDING')){
          //   this.inlineManual.openHelp('ADD_CONTENT_FROM_LANDING')
          //   this.inlineManual.visited('ADD_CONTENT_FROM_LANDING')
          // }
        }
        this.getDyanmicFilterData(searchValue);
      },
      (errRes) => {
        // console.log(errRes);
        this.loadingContent = false;
      }
    );
  }
  poling(type) {
    clearInterval(this.polingObj[type]);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.polingObj[type] = setInterval(() => {
      self.getJobStatus(type);
    }, 10000);
  }
  getJobStatusForMessages() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'content',
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(
      (res) => {
        if (res && res.length) {
          res.forEach((element) => {
            this.resourcesStatusObj[element._id] = element;
          });
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to fetch job status');
      }
    );
  }

  getJobDetails(sourceId) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: sourceId,
    };
    this.service.invoke('get.page_detail', quaryparms).subscribe(
      (res) => {
        // console.log(res)
      },
      (errRes) => {}
    );
  }
  getJobStatus(type) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type,
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(
      (res) => {
        this.oldQuedJob = [];
        const queuedJobs = _.filter(res, (source) => {
          if (source.status == 'running' || source.status == 'queued') {
            if (source.numPages == 0 || source.numPages == '') {
              this.oldQuedJob.push(source._id);
            }
          }
          if (this.resourcesStatusObj[source._id]) {
            if (
              this.resourcesStatusObj[source._id].status == 'running' ||
              this.resourcesStatusObj[source._id].status == 'queued'
            ) {
              if (
                source.executionStats.percentageDone &&
                source.executionStats.percentageDone == 100
              ) {
                // this.getJobDetails(source._id)
                this.getSourceList();
              }
            }
          }
          this.resourcesStatusObj[source._id] = source;

          return source.status === 'running' || source.status === 'queued';
        });
        if (queuedJobs && queuedJobs.length) {
          if (this.oldQuedJob.length != queuedJobs.length) {
            this.getSourceList();
          }
        } else {
          clearInterval(this.polingObj[type]);
          this.getSourceList('clearPoling');
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to fetch job status');
        this.oldQuedJob = [];
        clearInterval(this.polingObj[type]);
      }
    );
  }
  errorToaster(errRes, message) {
    if (
      errRes &&
      errRes.error &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  searchSourcesChange() {
    this.sourcesSearchModelChanged.next(undefined);
  }
  searchPageChange() {
    this.pagesSearchModelChanged.next(undefined);
  }
  clearPageSearch() {
    this.pagesSearch = '';
    this.isSearchLoading = true;
    this.getCrawledPages();
  }

  getCrawledPages(limit?, skip?) {
    this.pagingData = [];
    this.docContent = {};
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      webDomainId: this.selectedSource._id,
      limit,
      skip,
      sourceType: this.selectedSource.type,
    };
    if (quaryparms.sourceType === 'web') {
      quaryparms.contentType = 'pages';
    }
    if (quaryparms.sourceType === 'file') {
      quaryparms.contentType = 'docContent';
    }
    //  const payload = request;
    const payload: any = {
      sort: {
        lMod: -1,
      },
    };
    // if(this.searchSources){
    //   payload.search = this.searchSources;
    // }
    if (this.pagesSearch) {
      payload.search = this.pagesSearch;
    }
    // payload.sort.lMod = -1;
    this.service.invoke('get.extracted.pags', quaryparms, payload).subscribe(
      (res) => {
        this.isPageDelete = false;
        this.isSearchLoading = false;
        this.loadingSliderContent = false;
        this.selectedSource.pages = res.content;
        this.totalCrawledCount = res.count;
        if (this.selectedSource.pages.length > 0) {
          this.docContent = this.selectedSource.pages[0]._source;
          this.docContentType = this.selectedSource.pages[0]._meta;
          this.contentId = this.selectedSource.pages[0]._id;
        }
        /** Paging */
        const data = [...res.content];
        this.pagingData = data.slice(0, this.limitpage);
        this.pagingData.forEach((element) => {
          element['url_display'] = element._source.page_url;
        });
        /** Paging */
        this.sliderStep = 0;
        //this.selectedSource.advanceSettings.scheduleOpts = new scheduleOpts();
        this.allowUrlArr = this.selectedSource.advanceSettings
          ? this.selectedSource.advanceSettings.allowedURLs
          : [];
        this.blockUrlArr = this.selectedSource.advanceSettings
          ? this.selectedSource.advanceSettings.blockedURLs
          : [];
        const searchEl = document.getElementsByName('pagesSearch')[0];
        const isFocused = document.activeElement === searchEl;
        this.lastPageSearch = this.pagesSearch;
        this.lastData = data;
        if (data.length || this.pagesSearch || isFocused) {
          this.swapSlider('page');
          // this.selectedPage = {
          //   ...this.pagingData[0],
          //   isSection: false,
          //   isBody: false,
          // };
          /** updating from multiple data to onDemand data */
          this.pagingData.forEach((element) => {
            element['url_display'] = element._source.page_url;
          });
          const firstIndex = 0;
          this.callContentPage(this.pagingData[firstIndex]._id); // Please check the above line for the details
        } else {
          if (data.length == 0 && this.pagesSearch.length == 0) {
            this.swapSlider('config');
          }
        }
        if (res?.content[0]?.extractionType === 'file') {
          this.clicksViews('file');
        }
      },
      (errRes) => {
        this.isSearchLoading = false;
        if (
          errRes &&
          errRes.error &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0].msg
        ) {
          this.loadingSliderContent = false;
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to crawl web page', 'error');
        }
      }
    );
  }
  /** Page deatils onDemand */
  callContentPage(pageId) {
    this.isPageLoader = true;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      webDomainId: this.selectedSource._id,
      contentId: pageId,
    };
    const payload: any = {};
    this.service
      .invoke('get.extracted.pagsById', quaryparms, payload)
      .subscribe(
        (res) => {
          this.isSearchLoading = false;
          this.isPageLoader = false;
          if (this.selectedPage) {
            this.selectedPage = { ...res, isSection: false, isBody: false };
          }
          //this.selectedPage = {...this.pagingData[0],isSection:false,isBody:false};
          // Response is only for page_html , page_body
        },
        (errRes) => {
          this.isPageLoader = false;
          if (
            errRes &&
            errRes.error &&
            errRes.error.errors &&
            errRes.error.errors.length &&
            errRes.error.errors[0].msg
          ) {
            this.notificationService.notify(
              errRes.error.errors[0].msg,
              'error'
            );
          } else {
            this.notificationService.notify('Failed to fetch page', 'error');
          }
        }
      );
  }
  viewPages() {
    this.sliderStep = 0;
  }
  viewPageDetails(page) {
    this.content_id = page._id;
    this.sliderStep = 1;
    //this.clicksViews('web');
  }
  sliderBack() {
    if (this.sliderStep) {
      this.sliderStep = this.sliderStep - 1;
    }
  }
  swapSlider(tabName) {
    if ($('.tabname')) {
      if (tabName == 'execution') {
        this.execution = true;
        this.isConfig = false;
        this.page = false;
        // $('.tabname')[0].classList.remove('active')
        // $('.tabname')[1].classList.remove('active')
        // $('.tabname')[2].classList.add('active')
      } else if (tabName == 'config') {
        // $('.tabname')[0].classList.remove('active')
        // $('.tabname')[1].classList.add('active')
        // $('.tabname')[2].classList.remove('active');
        this.execution = false;
        this.isConfig = true;
        this.page = false;
      } else if (tabName == 'page') {
        // if(this.selectedSource.recentStatus == 'success'){
        this.page = true;
        this.isConfig = false;
        this.execution = false;
        // }
        // else{
        //   this.page = false;
        //   this.isConfig = true;
        //   this.execution = false;
        // }

        // $('.tabname')[0].classList.add('active');
        // $('.tabname')[1].classList.remove('active');
        // $('.tabname')[2].classList.remove('active');
        // if (this.selectedSource.recentStatus == 'success' || (this.selectedSource.recentStatus == 'running' && this.selectedSource.numPages > 0) || (this.selectedSource.recentStatus == 'inprogress' && this.selectedSource.numPages > 0)) {
        //   this.execution = false;
        //   this.isConfig = false;
        //   this.page = true;
        // } else {
        //   this.execution = false;
        //   this.isConfig = true;
        //   this.page = false;
        // }
      }
    }
    this.editTitleFlag = false;
    // $('.tabname').toggleClass("active");
    // if (this.isConfig) {
    //   this.isConfig = false;
    // } else {
    //   this.isConfig = true;
    // }
  }
  executionHistory(limit?, skip?) {
    if (!limit) limit = 100;
    if (!skip) skip = 0;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      extractionSourceId: this.selectedSource._id,
      limit: limit,
      skip: skip,
      sourceType: 'content',
    };
    this.service.invoke('get.executionHistory', quaryparms).subscribe(
      (res) => {
        if (res.contentExecutions) {
          this.executionHistoryData = res.contentExecutions;
          this.executionHistoryData.forEach((element) => {
            element.executionStats.duration = this.duration(
              element.executionStats.duration
            );
            // console.log("element.executionStats.duration", element.executionStats.duration)
            element.createdOn = moment(element.createdOn).fromNow();
            if (element.executionStats.statusLogs) {
              element.executionStats.statusLogs.forEach((status_log) => {
                if (status_log?.timeTaken) {
                  status_log.timeTaken = this.duration(status_log?.timeTaken);
                }
              });
            }
            /**updated element.executionStats.isTimedOut to element.executionStats.timedOut on 21/02*/
            // if (element.executionStats.executionStatusMessage == 'Execution Stopped' && element.executionStats.isTimedOut) {
            if (
              element.executionStats.executionStatusMessage ==
                'Execution Stopped' &&
              element.executionStats.timedOut
            ) {
              if (element.executionStats.statusLogs) {
                //element.statusLogs.forEach(element => {
                if (element.executionStats.statusLogs.length > 1) {
                  element.executionStats['tooltip'] =
                    '' +
                    element.executionStats.statusLogs[
                      element.statusLogs.length - 2
                    ].stageName +
                    'failed due to timeout';
                }
                //});
              }
            } else if (
              element.executionStats.executionStatusMessage ==
              'Execution Stopped'
            ) {
              /**updated  element.statusMessage to element.message on 21/02 */
              // element.executionStats['tooltip'] = "Execution Stopped due to " + element.statusMessage || ' time out';
              element.executionStats['tooltip'] =
                'Execution Stopped due to ' + element.message || ' time out';
            } else if (
              element.executionStats.executionStatusMessage ==
              'Execution In Progress'
            ) {
              element.executionStats['tooltip'] = 'In Progress';
            } else {
              /**updated  element.statusMessage to element.message on 21/02 */
              // element.executionStats['tooltip'] = element.statusMessage;
              element.executionStats['tooltip'] = element.message;
            }
          });
        }
      },
      (errRes) => {
        this.loadingSliderContent = false;
        if (
          errRes &&
          errRes.error &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed', 'error');
        }
      }
    );
  }

  copyUrl(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notificationService.notify('Copied URL to clipboard', 'success');
  }
  goToLink(url: string) {
    if (url.length > 0) {
      window.open(url, '_blank');
    }
  }

  openStatusSlider(source, page?) {
    this.executionHistoryData = [];
    this.pagesSearch = '';
    this.contentModaltype = source.extractionType;
    this.selectedSource = source;
    this.editSource = new CrwalObj();
    this.selectedSource.advanceSettings =
      source.advanceSettings || new AdvanceOpts();
    if (source.extractionType === 'web') {
      this.editSource.name = source?.name;
      this.editSource.desc = source?.desc;
      this.crwalOptionLabel = source?.advanceSettings?.crawlEverything
        ? 'any'
        : source?.advanceSettings?.allowedOpt
        ? 'allow'
        : 'block';
      this.useCookies = source?.advanceSettings?.useCookies;
      this.respectRobotTxtDirectives =
        source?.advanceSettings?.respectRobotTxtDirectives;
      this.crawlBeyondSitemaps = source?.advanceSettings?.crawlBeyondSitemaps;
      this.isJavaScriptRendered = source?.advanceSettings?.isJavaScriptRendered;
      this.crawlDepth = source?.advanceSettings?.crawlDepth;
      this.maxUrlLimit = source?.advanceSettings?.maxUrlLimit;
      this.allowURLArray =
        source?.advanceSettings?.allowedURLs?.length === 0
          ? this.allowURLArray
          : source?.advanceSettings?.allowedURLs;
      this.blockURLArray =
        source?.advanceSettings?.blockedURLs?.length === 0
          ? this.blockURLArray
          : source?.advanceSettings?.blockedURLs;
      this.editSource.advanceOpts.scheduleOpt =
        source?.advanceSettings?.scheduleOpt;
      this.editSource.advanceOpts.scheduleOpts =
        source?.advanceSettings?.scheduleOpts;
      this.editSource.authorizationEnabled =
        source?.authorizationEnabled || false;
      this.editSource.advanceOpts.allowedOpt =
        source?.advanceSettings?.allowedOpt;
      this.editSource.advanceOpts.blockedOpt =
        source?.advanceSettings?.blockedOpt;
      this.editSource.advanceOpts.crawlEverything =
        source?.advanceSettings?.crawlEverything;
      if (source?.authorizationProfle) {
        this.editSource.authorizationProfle.sso_type =
          source?.authorizationProfle?.sso_type;
        this.editSource.authorizationProfle.testType =
          source?.authorizationProfle?.testType;
        this.editSource.authorizationProfle.testValue =
          source?.authorizationProfle?.testValue;
        this.editSource.authorizationProfle.authCheckUrl =
          source?.authorizationProfle?.authCheckUrl;
        if (source?.authorizationProfle?.authorizationFields?.length > 0) {
          for (const item of source?.authorizationProfle?.authorizationFields ||
            '') {
            const obj = {
              ...item,
              isEditable: false,
              duplicateObj: { type: '', key: '', value: '' },
            };
            this.editSource.authorizationProfle.authorizationFields.push(obj);
          }
        }
        if (source?.authorizationProfle?.sso_type === 'basic') {
          for (
            let i = 0;
            i < source?.authorizationProfle?.formFields?.length;
            i++
          ) {
            this.editSource.authorizationProfle.basicFields[i].value =
              source?.authorizationProfle?.formFields[i].value;
            this.editSource.authorizationProfle.basicFields[
              i
            ].duplicateObj.value =
              source?.authorizationProfle?.formFields[i].value;
          }
        }
        if (
          source?.authorizationProfle?.formFields?.length > 0 &&
          this.editSource.authorizationProfle.sso_type === 'form'
        ) {
          for (const item of source?.authorizationProfle?.formFields || '') {
            const obj = {
              ...item,
              isEditable: false,
              duplicateObj: { type: '', key: '', value: '' },
            };
            this.editSource.authorizationProfle.formFields.push(obj);
          }
        } else {
          this.formFieldObj.isShow = true;
        }
      }
      this.scheduleObject = source?.advanceSettings?.scheduleOpts;
      this.openStatusModal();
      this.loadingSliderContent = true;
      this.totalCrawledCount = source.numPages;
      this.getCrawledPages(this.limitpage, 0);
      this.executionHistory();
      this.sourceStatus = source.recentStatus;
    } else if (source.extractionType === 'file') {
      this.openDocumentModal();
      this.getCrawledPages(this.limitpage, 0);
    }
    this.isEditDoc = false;
  }
  pageination(pages, action) {
    // let count = 0;
    // let divisor = Math.floor(pages/perPage)
    // let remainder = pages%perPage;
    // if(remainder>0){
    //   this.btnCount = divisor +1;
    //   this.btnAllCount = this.btnCount;
    // }else{
    //   this.btnCount =  divisor;
    //   this.btnAllCount = this.btnCount;
    // }

    // if(this.btnCount > 5){
    //   this.btnCount = 5
    // }
    /** new Paging Logic */
    this.totalRecord = 0;
    this.totalRecord = pages;
    this.recordStr = 1;
    if (this.totalRecord > this.limitpage) {
      this.recordEnd = this.limitpage;
      this.allInOne = false;
      $('.pre-arrow').addClass('dis-arow');
    } else {
      this.recordEnd = this.totalRecord;
      this.allInOne = true;
      $('.pre-arrow').addClass('dis-arow');
      $('.nxt-arrow').addClass('dis-arow');
    }
    if (
      action == true &&
      this.totalRecord > this.recordEnd &&
      !(this.totalRecord > this.limitpage)
    ) {
      this.recordEnd = this.totalRecord;
      this.allInOne = true;
      $('.pre-arrow').addClass('dis-arow');
      $('.nxt-arrow').addClass('dis-arow');
    }
  }

  numArr(n: number): any[] {
    return Array(n);
  }
  onListScroll() {
    if (!this.isConfig) {
      if (this.perfectScroll.states.top) {
        if (!(this.recordStr < this.limitpage))
          this.onClickArrow(
            this.recordStr - this.limitpage,
            this.recordEnd - this.limitpage,
            2,
            1000
          );
      } else if (this.perfectScroll.states.bottom) {
        if (this.recordEnd != this.totalRecord)
          this.onClickArrow(
            this.recordStr + this.limitpage,
            this.recordEnd + this.limitpage,
            2,
            1000
          );
      }
    }
  }
  paginate(event, type?) {
    if (type == 'history') {
      this.executionHistory();
    } else {
      this.getCrawledPages(10, event.skip);
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop(2, 1000);
    }
  }
  onClickArrow(newStart, newEnd, offset, time) {
    const preStart = this.recordStr;
    const preEnd = this.recordEnd;
    if (newStart < 1 || newEnd > this.totalRecord + this.limitpage || '') {
      console.log('empty block');
    } else {
      if (preEnd == this.totalRecord) {
        newEnd = newStart + (this.limitpage - 1);
      }
      newStart < 0 ? (this.recordStr = 1) : (this.recordStr = newStart);
      newStart > this.totalRecord
        ? (this.recordStr = this.recordStr - this.limitpage)
        : (this.recordStr = newStart);
      newEnd > this.totalRecord
        ? (this.recordEnd = this.totalRecord)
        : (this.recordEnd = newEnd);

      /** Apply scroller on last record **/
      // if(newEnd >= this.totalRecord){
      //   this.recordStr = this.recordStr-(this.limitpage);
      //   let skip = this.recordStr-(this.limitpage-1) < 0 ? 0: this.recordStr-(this.limitpage-1)
      //   this.getCrawledPages(this.limitpage,skip);
      //   this.perfectScroll.directiveRef.update();
      // }else{
      //   this.getCrawledPages(this.limitpage,this.recordStr-1);
      // }
      /** Apply scroller on last record **/
      if (
        this.recordStr > this.limitpage &&
        this.recordEnd < this.totalRecord
      ) {
        $('.pre-arrow').removeClass('dis-arow');
        $('.nxt-arrow').removeClass('dis-arow');
      } else if (this.recordStr < this.limitpage) {
        $('.pre-arrow').addClass('dis-arow');
        $('.nxt-arrow').removeClass('dis-arow');
      } else if (this.recordEnd == this.totalRecord) {
        $('.pre-arrow').removeClass('dis-arow');
        $('.nxt-arrow').addClass('dis-arow');
      }
      if (this.allInOne) {
        $('.pre-arrow').addClass('dis-arow');
        $('.nxt-arrow').addClass('dis-arow');
      }
    }
  }
  onClickPageNo(noRows, index) {
    this.getCrawledPages(noRows, index);
    $('.numbers').each((key, valyue) => {
      $('.numbers').removeClass('active');
    });
    $('#number_' + index).addClass('active');
  }
  saveDocDetails() {
    let payload: any;
    if (this.isEditDoc) {
      payload = {
        name: this.editDocObj.title,
        desc: this.editDocObj.desc,
      };
    } else {
      payload = {
        name: this.selectedSource.name,
        desc: this.selectedSource.desc,
      };
    }

    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: this.selectedSource._id,
    };
    this.service
      .invoke('update.contentPageSource', quaryparms, payload)
      .subscribe(
        (res) => {
          this.isEditDoc = false;
          this.getSourceList();
          this.notificationService.notify('Updated Successfully', 'success');
          this.closeDocumentModal();
        },
        (errRes) => {
          if (
            errRes &&
            errRes.error.errors &&
            errRes.error.errors.length &&
            errRes.error.errors[0] &&
            errRes.error.errors[0].msg
          ) {
            this.notificationService.notify(
              errRes.error.errors[0].msg,
              'error'
            );
          } else {
            this.notificationService.notify('Failed ', 'error');
          }
        }
      );
  }
  cancelDocDetails() {
    this.closeDocumentModal();
  }
  editDoc() {
    this.isEditDoc = true;
    this.editDocObj.title = this.selectedSource.name;
    this.editDocObj.desc = this.selectedSource.desc;
  }
  changeTittle() {
    this.isEditDoc = true;
    this.editDocObj.title = this.selectedSource.name;
  }
  updateTittle() {
    this.isEditDoc = false;
    this.selectedSource.name = this.editDocObj.title;
    this.docContent.sys_source_name = this.editDocObj.title;
    // this.editDocObj.title = this.selectedSource.name;
  }
  cancelTittle() {
    this.isEditDoc = false;
    this.editDocObj.title = this.selectedSource.name;
    this.editDocObj.title = this.docContent.sys_source_name;
  }

  deleteDocument(from, record, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Document',
        newTitle: 'Are you sure you want to delete?',
        body: 'All the Docs associated with this source will be deleted.',
        buttons: [
          { key: 'yes', label: 'delete', type: 'danger' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        this.deleteSource(record, dialogRef);
      } else if (result === 'no') {
        dialogRef.close();
        // console.log('deleted')
      }
    });
  }
  deletePages(from, record, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: from == 'source' ? 'Delete Source ' : ' Delete Page',
        text: 'Are you sure you want to delete?',
        newTitle: 'Are you sure you want to delete?',
        body:
          from == 'source'
            ? 'All the Docs associated with this source will be deleted.'
            : 'Selected Page will be deleted.',
        buttons: [
          { key: 'yes', label: 'Delete', type: 'danger' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        if (from == 'source') {
          this.deleteSource(record, dialogRef);
        } else {
          this.isPageDelete = true;
          this.deletePage(record, event, dialogRef);
        }
      } else if (result === 'no') {
        dialogRef.close();
        // console.log('deleted')
      }
    });
  }

  closeStatusSlider() {
    this.sliderComponent.closeSlider('#sourceSlider');
  }
  openImageLink(url) {
    window.open(url, '_blank');
  }
  checkForUpdate(page) {
    //this.notificationService.notify('Checking for Updates', 'success');
    this.loadingcheckForUpdate = true;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      extractionSourceId: this.selectedSource._id,
      contentId: page._id,
    };
    const payload: any = {
      url: page._source.page_url,
    };
    this.service.invoke('check.forUpdates', quaryparms, payload).subscribe(
      (res) => {
        this.loadingcheckForUpdate = false;
        this.dockService.trigger(true);
        if (res._meta.updateAvailable) {
          this.notificationService.notify(
            'A new version of this page is available',
            'success'
          );
        } else {
          this.notificationService.notify('The page is up to date', 'success');
        }
      },
      (errRes) => {
        this.loadingcheckForUpdate = false;
        this.errorToaster(errRes, 'Failed Update');
      }
    );
  }
  reCrwalingWeb(from, page, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      extractionSourceId: this.selectedSource._id,
      contentId: page._id,
      jobId: page.jobId,
    };
    const payload: any = {
      url: page._source.page_url,
    };
    this.service.invoke('reCrwal.website', quaryparms, payload).subscribe(
      (res) => {
        this.dockService.trigger(true);
        this.notificationService.notify('Re-Crawling Initiated', 'success');
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to Re-Crawl');
      }
    );
  }

  stopCrwaling(source, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      jobId: source.jobId,
    };
    this.service.invoke('stop.crwaling', quaryparms).subscribe(
      (res) => {
        this.notificationService.notify('Stopped Crawling', 'success');
        this.getSourceList();
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to Stop Cwraling');
      }
    );
  }
  deleteSource(record, dialogRef) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: record.type,
      sourceId: record._id,
    };
    this.service.invoke('delete.content.source', quaryparms).subscribe(
      (res) => {
        dialogRef.close();
        this.isEditDoc = false;
        this.cancelDocDetails();
        this.getSourceList();
        this.notificationService.notify(
          'Source deleted successsfully',
          'success'
        );
        const deleteIndex = _.findIndex(this.resources, (pg) => {
          return pg._id === record._id;
        });
        if (deleteIndex > -1) {
          this.resources.splice(deleteIndex, 1);
        }
        this.closeStatusModal();
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to delete source');
      }
    );
  }
  deletePage(page, event, dialogRef) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: this.selectedSource._id,
      contentId: page._id,
      sourceType: this.selectedSource.type,
    };
    if (quaryparms.sourceType === 'web') {
      quaryparms.contentType = 'pages';
    }
    if (quaryparms.sourceType === 'file') {
      quaryparms.contentType = 'docContent';
    }
    this.service.invoke('delete.content.page', quaryparms).subscribe(
      (res) => {
        dialogRef.close();
        this.totalRecord = this.totalRecord - 1;
        this.pageination(this.totalRecord, true);
        this.notificationService.notify(
          'Page deleted successsfully',
          'success'
        );
        // const deleteIndex = _.findIndex(this.selectedSource.pages, (pg) => {
        //   return pg._id === page._id;
        // })
        const deleteIndex = _.findIndex(this.pagingData, (pg) => {
          return pg._id === page._id;
        });
        if (deleteIndex > -1) {
          this.pagingData.splice(deleteIndex, 1);
          this.getCrawledPages(this.limitpage, this.recordStr - 1);
        }
        this.getSourceList();
      },
      (errRes) => {}
    );
  }
  filterTable(source, headerOption) {
    switch (headerOption) {
      case 'contentSource': {
        this.filterSystem.typefilter = source;
        break;
      }
      case 'recentStatus': {
        this.filterSystem.statusFilter = source;
        break;
      }
    }
    this.filterObject = {
      type: source,
      header: headerOption,
    };
    if (headerOption) {
      this.filterContent(null, null, source, headerOption);
    }
  }

  filterContent(
    searchValue?,
    searchSource?,
    source?,
    headerOption?,
    sortHeaderOption?,
    sortValue?,
    navigate?
  ) {
    if (sortValue) {
      this.sortedObject = {
        type: sortHeaderOption,
        value: sortValue,
        position: navigate,
      };
    }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      offset: 0,
      limit: 10,
    };
    let request: any = {};
    if (!sortValue) {
      request = {
        extractionType: 'content',
        sort: {
          name: 1,
        },
      };
    } else if (sortValue) {
      const sort: any = {};
      request = {
        sort,
      };
    } else {
      request = {};
    }
    (request.extractionType = 'content'),
      (request.contentSource = this.filterSystem.typefilter);
    request.recentStatus = this.filterSystem.statusFilter;
    request.search = this.searchSources;
    if (request.contentSource == 'all') {
      delete request.contentSource;
    }
    if (request.recentStatus == 'all') {
      delete request.recentStatus;
    }
    if (this.searchSources === '') {
      delete request.search;
    }
    if (sortValue) {
      this.getSortIconVisibility(sortHeaderOption, navigate);
      //Sort start
      if (sortHeaderOption === 'contentSource') {
        request.sort.contentSource = sortValue;
      }
      if (sortHeaderOption === 'recentStatus') {
        request.sort.recentStatus = sortValue;
      }
      if (sortHeaderOption === 'name') {
        request.sort.name = sortValue;
      }
      if (sortHeaderOption === 'numOfDocs') {
        request.sort.numOfDocs = sortValue;
      }
      if (sortHeaderOption === 'triggeredBy') {
        request.sort.triggeredBy = sortValue;
      }
      if (sortHeaderOption === 'lastUpdated') {
        this.getCrawledPages();
      }

      // end
    }

    this.getSourceList(
      null,
      searchValue,
      searchSource,
      source,
      headerOption,
      sortHeaderOption,
      sortValue,
      navigate,
      request
    );
    // if(sortHeaderOption === 'lastUpdated'){
    //   this.getCrawledPages()
    // }
  }

  getFilterData(search?) {
    // this.fieldDataTypeArr = [];
    // this.isMultiValuedArr = [];
    // this.isRequiredArr = [];
    // this.isStoredArr = [];
    // this.isIndexedArr = [];
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    const request: any = {
      moduleName: 'content',
    };
    // if (request.contentSource == 'all') {
    //  delete  request.contentSource;
    // }
    //  if (request.recentStatus == 'all') {
    //   delete request.recentStatus;
    // }
    // if (this.searchSources === '') {
    //   delete request.search;
    //  }
    this.service.invoke('post.filters', quaryparms, request).subscribe(
      (res) => {
        this.statusArr = [...res.recentStatus];
        this.docTypeArr = [...res.contentSource];
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get filters');
      }
    );
  }
  getDyanmicFilterData(search?) {
    // this.fieldDataTypeArr = [];
    // this.isMultiValuedArr = [];
    // this.isRequiredArr = [];
    // this.isStoredArr = [];
    // this.isIndexedArr = [];
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    const request: any = {
      moduleName: 'content',
    };
    request.contentSource = this.filterSystem.typefilter;
    request.recentStatus = this.filterSystem.statusFilter;
    // request.isStored = this.filterSystem.isStoredFilter;
    // request.isIndexed = this.filterSystem.isIndexedFilter;
    // request.isRequired = this.filterSystem.isRequiredFilter;
    request.search = this.searchSources;
    if (request.contentSource == 'all') {
      delete request.contentSource;
    }
    if (request.recentStatus == 'all') {
      delete request.recentStatus;
    }
    if (this.searchSources === '') {
      delete request.search;
    }
    this.service.invoke('post.filters', quaryparms, request).subscribe(
      (res) => {
        // this.statusArr = [...res.recentStatus];
        // this.docTypeArr = [...res.contentSource];
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get filters');
      }
    );
  }
  sortByApi(sort) {
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    let naviagtionArrow = '';
    let checkSortValue = 1;
    if (this.isAsc) {
      naviagtionArrow = 'up';
      checkSortValue = 1;
    } else {
      naviagtionArrow = 'down';
      checkSortValue = -1;
    }
    this.filterContent(
      null,
      null,
      null,
      null,
      sort,
      checkSortValue,
      naviagtionArrow
    );
  }
  paginateContent(event) {
    this.skip = event.skip;
    this.filterContent(
      this.searchSources,
      'search',
      this.filterObject.type,
      this.filterObject.header,
      this.sortedObject.type,
      this.sortedObject.value,
      this.sortedObject.position
    );
    // this.getFileds(event.skip, this.searchFields)
  }
  transform(date: string): any {
    const _date = new Date(date);
    if (_date.toString() === 'Invalid Date') {
      return '-';
    } else {
      return moment(_date).format('DD MMM YYYY');
    }
  }
  pushValues(res, index) {
    const array = [];
    array.push(
      this.transform(res[index].createdOn),
      res[index].desc,
      res[index].name,
      res[index].recentStatus,
      res[index].type
    );

    return array;
  }
  applyFilter(valToSearch) {
    if (valToSearch === this.selectedFilter) {
      this.getSourceList();
      this.selectedFilter = '';
      this.searchSources = '';
      return;
    }
    if (valToSearch) {
      this.resources = [...this.filterResourcesBack];
      let tableData = [];
      // console.log(this.resources)

      for (let i = 0; i < this.resources.length; i++) {
        // console.log(Object.keys(requireddata[i]))
        const requireddata = this.pushValues(this.resources, i);
        const obj: string[] = requireddata;
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < obj.length; j++) {
          if (obj[j]) {
            if (obj[j].includes(valToSearch)) {
              tableData.push(this.resources[i]);
            }
          }
        }
      }
      tableData = [...new Set(tableData)];
      if (tableData.length) {
        this.resources = tableData;
        this.sectionShow = true;
      } else {
        this.sectionShow = false;
      }
      // console.log(tableData);
    } else {
      this.resources = [...this.filterResourcesBack];
      this.searchSources = '';
      this.sectionShow = true;
    }
  }
  openDocumentModal() {
    this.statusModalDocumentRef = this.statusModalDocument.open();
  }
  closeDocumentModal() {
    if (this.statusModalDocumentRef && this.statusModalDocumentRef.close) {
      this.statusModalDocumentRef.close();
    }
  }
  editPages() {
    this.editConfigEnable = true;
  }

  executionHistoryPop(history, index) {
    this.executionPop = index;
  }
  onHistoryPop(index) {
    this.executionPop = index;
  }
  mouseleave() {
    this.executionPop = -1;
  }
  keyPress(event) {
    const code = event.keyCode ? event.keyCode : event.which;
    if (code === 13) {
      // event.preventDefault();
      const payload = {
        title: this.selectedSource.name,
        description: this.selectedSource.desc,
      };
      const queryParams = {
        searchIndexId: this.serachIndexId,
        webdomainId: this.selectedSource._id,
      };

      this.service.invoke('put.EditConfig', queryParams, payload).subscribe(
        (res) => {
          // console.log(res)
        },
        (errRes) => {
          // console.log(errRes)
        }
      );
    }
  }
  openStatusModal() {
    this.statusModalPopRef = this.statusModalPop.open();
    this.editTitleFlag = false;
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500);
  }
  closeStatusModal() {
    this.page = false;
    this.editTitleFlag = false;
    // this.swapSlider('page') // Just to redirect to 1st page
    if (this.statusModalPopRef && this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }

    this.totalCrawledCount = 0;
    this.addFormField('cancel');
    this.addAuthorizationField('cancel');
  }
  openAddSourceModal() {
    this.addSourceModalPopRef = this.addSourceModalPop.open();
  }
  closeAddsourceModal() {
    if (this.addSourceModalPopRef && this.addSourceModalPopRef.close) {
      this.addSourceModalPopRef.close();
    }
  }
  onSourceAdditionClose() {
    // this.closeAddsourceModal();
    this.getSourceList();
    this.showSourceAddition = null;
  }
  onSourceAdditionSave() {
    this.getSourceList();
    this.showSourceAddition = null;
  }
  editTitle(event) {
    this.editTitleFlag = true;
    this.editConfObj.title = this.selectedSource.name;
    this.editConfObj.url = this.selectedSource.url;
    this.editConfObj.desc = this.selectedSource.desc;
  }
  recrwal(from, record, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: record._id,
      sourceType: record.type,
    };
    this.service.invoke('recrwal', quaryparms).subscribe(
      (res) => {
        this.dockService.trigger(true);
        this.notificationService.notify('Re-Crawling Initiated', 'success');
        this.getSourceList();
        this.closeStatusModal();
        //this.notificationService.notify('Recrwaled with status : ' + res.recentStatus, 'success');
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  scheduleData(scheduleData) {
    if (this.editSource?.advanceOpts?.scheduleOpts)
      this.editSource.advanceOpts.scheduleOpts = scheduleData;
    if (this.isContentPage) {
      this.selectedSource.advanceSettings.scheduleOpts = scheduleData;
      if (this.selectedSource?.authorizationEnabled) {
        delete this.selectedSource?.authorizationProfle?.createdBy;
        delete this.selectedSource?.authorizationProfle?.createdOn;
        delete this.selectedSource?.authorizationProfle?.lModified;
        delete this.selectedSource?.authorizationProfle?.lModifiedBy;
        delete this.selectedSource?.authorizationProfle?._id;
        delete this.selectedSource?.authorizationProfle?.streamId;
        delete this.selectedSource?.authorizationProfle?.searchIndexId;
        delete this.selectedSource?.authorizationProfle?.resourceid;
        delete this.selectedSource?.authorizationProfle?.name;
        delete this.selectedSource?.authorizationProfle?.__v;
      }
      this.updateSchedular();
    }
  }

  //update scheduler data
  updateSchedular() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: this.selectedSource._id,
      sourceType: this.selectedSource.extractionType,
    };
    const payload = {
      name: this.selectedSource?.name,
      desc: this.selectedSource?.desc,
      url: this.selectedSource?.url,
      authorizationProfle: this.selectedSource?.authorizationProfle,
      authorizationEnabled: this.selectedSource?.authorizationEnabled,
      advanceOpts: this.selectedSource?.advanceSettings,
    };

    this.service
      .invoke('update.contentPageSource', quaryparms, payload)
      .subscribe(
        (res) => {
          this.scheduleObject = {};
          this.selectedSource = {};
          this.isContentPage = false;
          this.notificationService.notify(
            'Scheduler data saved successfully',
            'success'
          );
          this.getSourceList();
        },
        (errRes) => {
          if (
            errRes &&
            errRes.error.errors &&
            errRes.error.errors.length &&
            errRes.error.errors[0] &&
            errRes.error.errors[0].msg
          ) {
            this.notificationService.notify(
              errRes.error.errors[0].msg,
              'error'
            );
          } else {
            this.notificationService.notify('Failed ', 'error');
          }
        }
      );
  }

  cronExpress(cronExpress) {
    this.editSource.advanceOpts.repeatInterval = cronExpress;
  }
  exceptUrl(bool) {
    this.selectedSource.advanceSettings.allowedOpt = !bool;
    this.selectedSource.advanceSettings.blockedOpt =
      !this.selectedSource.advanceSettings.allowedOpt;
  }
  restrictUrl(bool) {
    this.selectedSource.advanceSettings.blockedOpt = !bool;
    this.selectedSource.advanceSettings.allowedOpt =
      !this.selectedSource.advanceSettings.blockedOpt;
  }
  changeSettings(bool) {
    this.selectedSource.advanceSettings.crawlEverything = !bool;
    this.selectedSource.advanceSettings.allowedOpt = bool;
  }

  //update source data
  updateSourceConfiguration() {
    if (this.validationInputs()) {
      this.proceedWithConfigUpdate();
    }
  }

  //update source API call
  proceedWithConfigUpdate() {
    let payload: any = {};
    const schdVal = true;
    const crawler = this.editSource;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: this.selectedSource._id,
      sourceType: this.selectedSource.extractionType,
    };
    if (this.editTitleFlag) {
      crawler.name = this.editConfObj.title;
      crawler.url = this.selectedSource.url;
      crawler.desc = this.editConfObj.desc || '';
    } else {
      crawler.name = this.editSource.name;
      crawler.url = this.selectedSource.url;
      crawler.desc = this.editSource.desc || '';
    }
    if (this.editSource.advanceOpts.scheduleOpt) {
      if (
        this.editSource.advanceOpts.scheduleOpts.interval.intervalType &&
        this.editSource.advanceOpts.scheduleOpts.interval.intervalType !=
          'Custom'
      ) {
        this.editSource.advanceOpts.scheduleOpts.interval.intervalValue = {};
      }
      crawler.advanceOpts = this.editSource.advanceOpts;
    }

    crawler.advanceOpts.useCookies = this.useCookies;
    crawler.advanceOpts.respectRobotTxtDirectives =
      this.respectRobotTxtDirectives;
    crawler.advanceOpts.crawlBeyondSitemaps = this.crawlBeyondSitemaps;
    crawler.advanceOpts.isJavaScriptRendered = this.isJavaScriptRendered;
    crawler.advanceOpts.blockHttpsMsgs = this.blockHttpsMsgs;
    crawler.advanceOpts.allowedURLs = crawler.advanceOpts.allowedOpt
      ? this.allowURLArray
      : [];
    crawler.advanceOpts.blockedURLs = crawler.advanceOpts.blockedOpt
      ? this.blockURLArray
      : [];
    if (Number(this.crawlDepth) || Number(this.crawlDepth) == 0) {
      crawler.advanceOpts.crawlDepth = Number(this.crawlDepth);
    } else {
      delete crawler.advanceOpts.crawlDepth;
    }
    if (Number(this.maxUrlLimit) || Number(this.maxUrlLimit) == 0) {
      crawler.advanceOpts.maxUrlLimit = Number(this.maxUrlLimit);
    } else {
      delete crawler.advanceOpts.maxUrlLimit;
    }
    payload = crawler;
    for (const item of payload.authorizationProfle.authorizationFields) {
      delete item.duplicateObj;
      delete item.isEditable;
      delete item.isShow;
    }
    if (payload.authorizationProfle.sso_type === 'basic') {
      payload.authorizationProfle.formFields =
        payload.authorizationProfle.basicFields;
    } else if (payload.authorizationProfle.sso_type === 'form') {
      for (const item of payload.authorizationProfle.formFields) {
        delete item.duplicateObj;
        delete item.isEditable;
        delete item.isShow;
        delete item.isPwdShow;
      }
    }
    delete payload.authorizationProfle.basicFields;
    if (schdVal) {
      this.service
        .invoke('update.contentPageSource', quaryparms, payload)
        .subscribe(
          (res) => {
            this.notificationService.notify('Configuration Saved', 'success');
            this.editTitleFlag = false;
            this.getSourceList();
            this.closeStatusModal();
            this.dockService.trigger(true);
          },
          (errRes) => {
            if (
              errRes &&
              errRes.error.errors &&
              errRes.error.errors.length &&
              errRes.error.errors[0] &&
              errRes.error.errors[0].msg
            ) {
              this.notificationService.notify(
                errRes.error.errors[0].msg,
                'error'
              );
            } else {
              this.notificationService.notify('Failed ', 'error');
            }
          }
        );
    } else {
      this.notificationService.notify(
        'Please fill Date and Time fields',
        'error'
      );
    }
  }

  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case 'name': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'contentSource': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'recentStatus': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'triggeredBy': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'numOfDocs': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'lastUpdated':
        {
          if (this.selectedSort == sortingField) {
            if (this.isAsc == false && type == 'down') {
              return 'display-block';
            }
            if (this.isAsc == true && type == 'up') {
              return 'display-block';
            }
            return 'display-none';
          }
        }
        break;
    }
  }

  crawlOption(opt) {
    this.editSource.advanceOpts.crawlEverything = false;
    this.editSource.advanceOpts.allowedOpt = false;
    this.editSource.advanceOpts.blockedOpt = false;
    this.crwalOptionLabel = opt;
    if (opt === 'any') {
      this.editSource.advanceOpts.crawlEverything = true;
    } else if (opt === 'allow') {
      this.editSource.advanceOpts.allowedOpt = true;
    } else if (opt === 'block') {
      this.editSource.advanceOpts.blockedOpt = true;
    }
  }

  //retry failed url validation
  retryValidation(source, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    this.closeStatusModal();
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: source._id,
    };
    const payload = {
      url: source.url,
    };
    this.service.invoke('put.retryValidation', quaryparms, payload).subscribe(
      (res) => {
        this.getSourceList();
        this.dockService.trigger(true);
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed retry validation', 'error');
        }
      }
    );
  }

  //crawl job ondemand
  jobOndemand(source, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    this.closeStatusModal();
    const queryParams: any = {
      searchIndexID: this.serachIndexId,
      sourceId: source?._id,
    };
    this.service.invoke('get.crawljobOndemand', queryParams).subscribe(
      (res) => {
        this.getSourceList();
        this.dockService.trigger(true);
      },
      (err) => {
        this.notificationService.notify('Failed to crawl', 'error');
      }
    );
  }

  toggleSearch() {
    if (this.showSearch && this.searchSources) {
      this.searchSources = '';
    }
    this.showSearch = !this.showSearch;
  }
  closeSearch() {
    this.pagesSearch = '';
    this.showSearch = !this.showSearch;
    this.getCrawledPages(10, 0);
  }
  focusoutSearch(isSearchSource?) {
    if (this.activeClose) {
      if (isSearchSource) {
        this.searchSources = '';
      } else {
        this.pagesSearch = '';
      }
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
    this.getSourceList(null, this.searchSources, 'search');
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100);
  }
  downloadDoc(url) {
    FileSaver.saveAs(url + '&DownloadPdf=true');
  }
  checkValue(value, valueFrom) {
    if (value <= -1) {
      this.crawlDepth = 0;
      this.maxUrlLimit = 0;
    } else if (value == null || value.includes('-')) {
      this.notificationService.notify('Range cannot be entered', 'error');
    }
  }

  clicksViews(type) {
    if (type == 'file') {
      const quaryparms: any = {
        searchIndexId: this.serachIndexId,
        contentId: this.contentId,
      };
      this.service.invoke('get.clicksViewsContent', quaryparms).subscribe(
        (res) => {
          this.numberOf = res;
        },
        (errRes) => {}
      );
    }
  }

  //add allow/block obj into array
  addAllowBlockObj(type) {
    const obj = { condition: 'contains', url: '' };
    if (type === 'allow') {
      this.allowURLArray.push(obj);
    } else if (type === 'block') {
      this.blockURLArray.push(obj);
    }
  }

  //add authorization field
  addAuthorizationField(type) {
    if (type === 'add') {
      this.authorizationFieldObj.isShow = true;
    } else if (type === 'save') {
      const array = [
        'contentFieldKeyId',
        'contentFieldTypeId',
        'contentFieldValueId',
      ];
      const count = this.countValidationInputs(array);
      if (count === array.length) {
        this.editSource.authorizationProfle.authorizationFields.push(
          this.authorizationFieldObj
        );
        this.authorizationFieldObj = {
          type: '',
          key: '',
          value: '',
          isEnabled: true,
          isShow: false,
          isEditable: false,
          duplicateObj: { type: '', key: '', value: '' },
        };
      } else {
        this.notificationService.notify(
          'Enter the required fields to proceed',
          'error'
        );
      }
    } else if (type === 'cancel') {
      this.authorizationFieldObj = {
        type: '',
        key: '',
        value: '',
        isEnabled: true,
        isShow: false,
        isEditable: false,
        duplicateObj: { type: '', key: '', value: '' },
      };
    }
  }

  //edit authorization field
  editAuthorizationField(type, form, index?) {
    if (type === 'save') {
      const array = [
        `contentFieldKeyId${index}`,
        `contentFieldTypeId${index}`,
        `contentFieldValueId${index}`,
      ];
      const count = this.countValidationInputs(array);
      if (array.length === count) {
        form.type = form.duplicateObj.type;
        form.key = form.duplicateObj.key;
        form.value = form.duplicateObj.value;
        form.isEditable = false;
      } else {
        this.notificationService.notify(
          'Enter the required fields to proceed',
          'error'
        );
      }
    } else if (['cancel', 'edit'].includes(type)) {
      form.duplicateObj.type = form.type;
      form.duplicateObj.key = form.key;
      form.duplicateObj.value = form.value;
      if (type === 'cancel') form.isEditable = false;
    }
  }

  //add form field
  addFormField(type) {
    if (type === 'add') {
      this.formFieldObj.isShow = true;
    } else if (type === 'save') {
      const array = [
        'contentFormFieldKeyId',
        'contentFormFieldTypeId',
        'contentFormFieldValueId',
      ];
      const count = this.countValidationInputs(array);
      if (count === array.length) {
        this.editSource.authorizationProfle.formFields.push(this.formFieldObj);
        this.formFieldObj = {
          type: '',
          key: '',
          value: '',
          isEnabled: true,
          isRequired: true,
          isPwdShow: false,
          isShow: false,
          isEditable: false,
          duplicateObj: { type: '', key: '', value: '' },
        };
      } else {
        this.notificationService.notify(
          'Enter the required fields to proceed',
          'error'
        );
      }
    } else if (type === 'cancel') {
      this.formFieldObj = {
        type: '',
        key: '',
        value: '',
        isEnabled: true,
        isShow: false,
        isPwdShow: false,
        isRequired: true,
        isEditable: false,
        duplicateObj: { type: '', key: '', value: '' },
      };
    }
  }

  //edit authorization field
  editFormField(type, form, index) {
    if (type === 'save') {
      const array = [
        `contentFormFieldKeyId${index}`,
        `contentFormFieldTypeId${index}`,
        `contentFormFieldValueId${index}`,
      ];
      const count = this.countValidationInputs(array);
      if (count === array.length) {
        form.type = form.duplicateObj.type;
        form.key = form.duplicateObj.key;
        form.value = form.duplicateObj.value;
        form.isEditable = false;
      } else {
        this.notificationService.notify(
          'Enter the required fields to proceed',
          'error'
        );
      }
    } else if (['cancel', 'edit'].includes(type)) {
      form.duplicateObj.type = form.type;
      form.duplicateObj.key = form.key;
      form.duplicateObj.value = form.value;
      form.isPwdShow = false;
      if (type === 'cancel') form.isEditable = false;
    }
  }

  //save basic field
  saveBasicField(form, type) {
    if (type === 'save') {
      form.value = form.duplicateObj.value;
    } else if (type === 'cancel') {
      form.duplicateObj.value = form.value;
    }
    form.isEditable = false;
    this.isPasswordShow = false;
  }

  //select authentication type
  selectAuthenticationType(type) {
    this.editSource.authorizationProfle.sso_type = type;
    this.editSource.authorizationProfle.authorizationFields = [];
    this.editSource.authorizationProfle.authCheckUrl = '';
    this.editSource.authorizationProfle.testType = '';
    this.editSource.authorizationProfle.testValue = '';
    this.authorizationFieldObj = {
      type: '',
      key: '',
      value: '',
      isEnabled: true,
      isShow: false,
      isEditable: false,
      duplicateObj: { type: '', key: '', value: '' },
    };
    if (
      this.editSource.authorizationProfle.sso_type === 'form' &&
      this.editSource.authorizationProfle.formFields.length === 0
    ) {
      this.formFieldObj = {
        type: '',
        key: '',
        value: '',
        isEnabled: true,
        isRequired: true,
        isPwdShow: false,
        isShow: true,
        isEditable: false,
        duplicateObj: { type: '', key: '', value: '' },
      };
    }
  }

  //delete form fields
  deleteFormFields(index) {
    if (this.editSource.authorizationProfle.formFields.length === 1) {
      this.formFieldObj.isShow = true;
    }
    this.editSource.authorizationProfle.formFields.splice(index, 1);
  }

  //validation method
  validationInputs() {
    const inputs = ['addSourceTitleInput'];
    if (
      this.editSource.advanceOpts.blockedOpt ||
      this.editSource.advanceOpts.allowedOpt
    ) {
      const array: any = this.editSource.advanceOpts.allowedOpt
        ? this.allowURLArray
        : this.blockURLArray;
      const name = this.editSource.advanceOpts.allowedOpt
        ? 'contentAllowId'
        : 'contentBlockId';
      for (let i = 0; i < array.length; i++) {
        inputs.push(name + i);
      }
    }
    if (this.editSource.authorizationEnabled) {
      inputs.push('contentIsAuthId');
      if (
        this.editSource.authorizationProfle.sso_type === 'basic' ||
        this.editSource.authorizationProfle.sso_type === 'form'
      ) {
        inputs.push(
          'contentAuthURLId',
          'contentTestTypeId',
          'contentTestValueId'
        );
        if (this.authorizationFieldObj.isShow) {
          inputs.push(
            'contentFieldKeyId',
            'contentFieldTypeId',
            'contentFieldValueId'
          );
        }
        if (
          this.editSource.authorizationProfle.sso_type === 'form' &&
          this.formFieldObj.isShow
        ) {
          inputs.push(
            'contentFormFieldKeyId',
            'contentFormFieldTypeId',
            'contentFormFieldValueId'
          );
        }
      }
    }
    const count = this.countValidationInputs(inputs);
    if (count !== inputs.length) {
      this.notificationService.notify(
        'Enter the required fields to proceed',
        'error'
      );
    }
    return count === inputs.length ? true : false;
  }

  //count validation input's
  countValidationInputs(data) {
    let count = 0;
    for (const item of data) {
      let text = 0;
      const id: any = document.getElementById(item);
      if (id?.type === 'submit') {
        text = [
          'Select Authentication Type',
          'Choose an option',
          'Select Field Type',
        ].includes(id.innerHTML)
          ? 0
          : 1;
      } else {
        text = id?.value?.length;
      }
      $(id).css('border-color', text > 0 ? '' : '#DD3646');
      if (text > 0) count++;
    }
    return count;
  }

  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }

  //show or hide password in form fields
  showFormFieldPassword(id, data) {
    data.isPwdShow = !data.isPwdShow;
    const value: any = document.getElementById(id);
    value.type = value.type === 'password' ? 'text' : 'password';
  }

  //open Schedular
  openSchedular(event, source?) {
    this.isShowSchedlerModal = true;
    if (source) {
      this.selectedSource = source;
      this.scheduleObject = source?.advanceSettings?.scheduleOpts;
      this.isContentPage = true;
    }
    const isOpen = event?.currentTarget?.checked || event === true;
    if (isOpen) {
      setTimeout(() => {
        this.schedular?.openCloseSchedular('open');
      }, 500);
    }
  }

  ngOnDestroy() {
    const timerObjects = Object.keys(this.polingObj);
    if (timerObjects && timerObjects.length) {
      timerObjects.forEach((job) => {
        clearInterval(this.polingObj[job]);
      });
    }
    window.removeEventListener('scroll', this.scroll, true);
  }
}
