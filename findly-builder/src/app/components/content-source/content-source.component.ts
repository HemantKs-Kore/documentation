import { Component, OnInit, ViewChild, OnDestroy, TestabilityRegistry } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { AuthService } from '@kore.services/auth.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
declare const $: any;
import * as _ from 'underscore';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { CrwalObj, AdvanceOpts, AllowUrl, BlockUrl, scheduleOpts } from 'src/app/helpers/models/Crwal-advance.model';

@Component({
  selector: 'app-content-source',
  templateUrl: './content-source.component.html',
  styleUrls: ['./content-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ContentSourceComponent implements OnInit, OnDestroy {
  loadingSliderContent = false;
  executionPop = -1;
  loadingcheckForUpdate = false;
  isEditDoc: boolean = false;
  editDocObj: any = {};
  editConfObj: any = {};
  editTitleFlag: boolean = false;
  isConfig: boolean = false;
  allowUrl: AllowUrl = new AllowUrl()
  blockUrl: BlockUrl = new BlockUrl();
  allowUrlArr: AllowUrl[] = [];
  blockUrlArr: BlockUrl[] = []
  filterSystem: any = {
    'typeHeader': 'type',
    'statusHeader': 'status',
    'typefilter': 'all',
    'statusFilter': 'all'
  }
  firstFilter: any = { 'header': '', 'source': '' };
  currentView = 'list'
  searchSources = '';
  pagesSearch = '';
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
  selectedFilter: any = ''
  executionLogStatus = false;
  componentType: string = 'addData';
  contentTypes = {
    webdomain: 'Web',
    document: 'Doc'
  }
  statusObj: any = {
    failed: { name: 'Failed', color: '#DD3646' },
    successfull: { name: 'Successfull', color: '#28A745' },
    success: { name: 'Success', color: '#28A745' },
    queued: { name: 'Queued', color: '#0D6EFD' },
    running: { name: 'In Progress', color: '#0D6EFD' },
    inprogress: { name: 'In Progress', color: '#0D6EFD' },
    validation: { name: 'Queued', color: '#0D6EFD' },
    scheduled: { name: 'Queued', color: '#0D6EFD' },
    halted: { name: 'Stopped', color: '#DD3646' },
    configured: { name: 'Validated', color: '#202124' }
  };
  executionObj: any = {
    'Execution Successful': {
      tooltip: "",
      icon: "assets/icons/content/success.svg"
    },
    'Execution Failed': {
      tooltip: "",
      icon: "assets/icons/content/failed.svg"
    },
    'Execution Stopped': {
      tooltip: "Sitemap Validation failed due to timeout",
      icon: "assets/icons/content/stopped.svg"
    },
    'Execution In Progress': {
      tooltip: "",
      icon: "assets/icons/content/ex-stat_inprogress.svg"
    },
  };
  stateExecutionstageStatusObj: any = {
    'success': { icon: "assets/icons/content/success.svg" },
    'failed': { icon: "assets/icons/content/failed.svg" },
    'stopped': { icon: "assets/icons/content/stopped.svg" },
    'running': { icon: "assets/icons/content/ex-stat_inprogress.svg" },
    'crawling': { icon: "assets/icons/content/ex-stat_inprogress.svg" },
    'halted': { icon: "assets/icons/content/stopped.svg" },
    'inProgress': { icon: "assets/icons/content/ex-stat_inprogress.svg" }
  }
  finalStateExecutionstageStatusObj: any = {
    'success': { icon: "assets/icons/content/succes-circle.svg" },
    'failed': { icon: "assets/icons/content/failed-circle.svg" },
    'running': { icon: "assets/icons/content/ex-stat_inprogress.svg" },
    'halted': { icon: "assets/icons/content/stopped.svg" },
    'stopped': { icon: "assets/icons/content/stopped.svg" },
  }
  stateExecutionStageNameObj: any = {
    'process_in_queue': { label: "Process in Queue", icon: this.stateExecutionstageStatusObj },
    'url_validation': { label: "URL Validation", icon: this.stateExecutionstageStatusObj },
    'network_validation': { label: "Network Validation", icon: this.stateExecutionstageStatusObj },
    'indexing_restrictions': { label: "Index Restriction", icon: this.stateExecutionstageStatusObj },
    'content_verification': { label: "Content Verification", icon: this.stateExecutionstageStatusObj },
    'sitemap_identification': { label: "Sitemap Identification", icon: this.stateExecutionstageStatusObj },
    'crawling': { label: "Crawling", icon: this.stateExecutionstageStatusObj },
    'stopped': { label: "Stopped", icon: this.finalStateExecutionstageStatusObj },
    'failed': { label: "Failed", icon: this.finalStateExecutionstageStatusObj },
    'successful': { label: "Successful", icon: this.finalStateExecutionstageStatusObj },
  };

  sliderStep = 0;
  selectedPage: any = {};
  selectedSource: any = {};
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
  recordStr: number = 1;
  recordEnd: number = 25;
  totalRecord: number = 0;
  limitpage: number = 25;
  limitAllpage: number = 25;
  allInOne: boolean = false;
  urlConditionAllow = "is";
  urlConditionBlock = "is";
  doesntContains = "Doesn't Contains";
  filterTableheaderOption = "";
  filterTableSource = "all";
  execution = false;
  page = true;
  executionHistoryData: any;
  sourceStatus = 'success';
  useCookies = false;
  respectRobotTxtDirectives = false;
  crawlBeyondSitemaps = false;
  loadingContent1: boolean;
  isJavaScriptRendered = false;
  blockHttpsMsgs = false;
  crawlDepth: number;
  maxUrlLimit: number;
  crwalOptionLabel = '';
  @ViewChild('statusModalDocument') statusModalDocument: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  @ViewChild('addSourceModalPop') addSourceModalPop: KRModalComponent;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getSourceList();
    this.getJobStatusForMessages();
    this.userInfo = this.authService.getUserInfo() || {};
    window.addEventListener('scroll', this.scroll, true);
  }
  scroll = (event): void => {
    //console.log(event)
  };
  loadImageText: boolean = false;
  imageLoad() {
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
  }
  hoverExecutionLog() {
    this.executionLogStatus = true;
  }
  addNewContentSource(type) {
    this.showSourceAddition = type;
    // this.openAddSourceModal();
    // this.router.navigate(['/source'], { skipLocationChange: true,queryParams:{ sourceType:type}});
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
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
        case 'type': return this.compare(a.type, b.type, isAsc);
        case 'recentStatus': return this.compare(a.recentStatus, b.recentStatus, isAsc);
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'numPages': return this.compare(a.numPages, b.numPages, isAsc);
        case 'createdOn': return this.compare(a.createdOn, b.createdOn, isAsc);
        default: return 0;
      }
    });
    this.resources = sortedData;
  }
  duration(duration) {
    if (duration) {
      let hr = duration.split(":")[0];
      let min = duration.split(":")[1];
      let sec = duration.split(":")[2];
      let milisec = duration.split(":")[3];

      if (hr > 0) {
        if (min >= 0 && sec > 0) return duration = hr + "h " + min + "m " + sec + "s";
        if (min > 0 && sec <= 0) return duration = hr + "h " + min + "m";
        if (min <= 0 && sec <= 0) return duration = hr + "h ";
      } else if (min > 0) {
        if (sec > 0) return duration = min + "m " + sec + "s" ;
        if (sec <= 0) return duration = min + "m";
      } else if (sec > 0) {
         return duration = sec + "s";
      } else if (milisec > 0) {
        return duration = milisec + 'ms';
      } else {
        return duration = '0' + "ms";
      }
    }
  }
  getSourceList() {
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: 'content',
      limit: 50,
      skip: 0
    };
    this.service.invoke('get.source.list', quaryparms).subscribe(res => {
      this.resources = res;
      this.resources.forEach(element => {
        if (element.advanceSettings && element.advanceSettings.scheduleOpt && element.advanceSettings.scheduleOpts.interval && element.advanceSettings.scheduleOpts.time) {
          element['schedule_title'] = 'Runs ' + element.advanceSettings.scheduleOpts.interval.intervalType + ' at ' +
            element.advanceSettings.scheduleOpts.time.hour + ':' + element.advanceSettings.scheduleOpts.time.minute + ' ' +
            element.advanceSettings.scheduleOpts.time.timeOpt + ' ' + element.advanceSettings.scheduleOpts.time.timezone;
        }
        if (element.jobInfo.createdOn && element.jobInfo.createdOn != "--") {
          element['schedule_createdOn'] = moment(element.jobInfo.createdOn).fromNow();
        }
        if (element.jobInfo.executionStats) {
          element['schedule_duration'] = element.jobInfo.executionStats.duration ? element.jobInfo.executionStats.duration : "00:00:00";
          element['schedule_duration'] = this.duration(element['schedule_duration']);
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
      if (res.numPages)
        this.pageination(res.numPages, false);
      if (this.resources.length) {
        this.resources.forEach(element => {
          this.statusArr.push(element.recentStatus);
          this.docTypeArr.push(element.extractionType);
        });
        this.statusArr = [...new Set(this.statusArr)]
        this.docTypeArr = [...new Set(this.docTypeArr)]

      }
      _.map(this.resources, (source) => {
        source.name = source.name || source.title;
      });
      this.resources = this.resources.reverse();
      if (this.resources && this.resources.length) {
        this.poling('content')
      }
      this.loadingContent = false;
      setTimeout(() => {
        $('#searchContentSources').focus();
      }, 100);
      this.filterTable(this.filterTableSource, this.filterTableheaderOption)
      if (res.length > 0) {
        this.loadingContent = false;
        this.loadingContent1 = true;
      }
      else {
        this.loadingContent1 = true;
      }
    }, errRes => {
      console.log(errRes);
      this.loadingContent = false;
    });
  }
  poling(type) {
    clearInterval(this.polingObj[type]);
    const self = this;
    this.polingObj[type] = setInterval(() => {
      self.getJobStatus(type);
    }, 10000);
  }
  getJobStatusForMessages() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'content'
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(res => {
      if (res && res.length) {
        res.forEach(element => {
          this.resourcesStatusObj[element._id] = element;
        });
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch job status');
    });
  }

  getJobDetails(sourceId) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: sourceId
    };
    this.service.invoke('get.page_detail', quaryparms).subscribe(res => {
      console.log(res)
    }, errRes => {
    });
  }
  getJobStatus(type) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(res => {
      const queuedJobs = _.filter(res, (source) => {
        //this.resourcesStatusObj[source.resourceId] = source;

        if (this.resourcesStatusObj[source._id]) {
          if (this.resourcesStatusObj[source._id].status == 'running' || this.resourcesStatusObj[source._id].status == 'queued') {
            if (source.executionStats.percentageDone && source.executionStats.percentageDone == 100) {
              this.getJobDetails(source._id)
              this.getSourceList();
            }
          }
        }

        this.resourcesStatusObj[source._id] = source;

        return ((source.status === 'running') || (source.status === 'queued'));
      });
      if (queuedJobs && queuedJobs.length) {
        console.log(queuedJobs);
      } else {
        clearInterval(this.polingObj[type]);
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch job status');
      clearInterval(this.polingObj[type]);
    });
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  getCrawledPages(limit, skip) {
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      webDomainId: this.selectedSource._id,
      limit,
      skip,
      sourceType: this.selectedSource.type
    };
    if (quaryparms.sourceType === 'webdomain') {
      quaryparms.contentType = 'pages'
    }
    if (quaryparms.sourceType === 'document') {
      quaryparms.contentType = 'docContent'
    }
    this.service.invoke('get.extracted.pags', quaryparms).subscribe(res => {
      this.selectedSource.pages = res;
      /** Paging */

      const data = [...res]
      this.pagingData = data.slice(0, this.limitpage);
      this.pagingData.forEach(element => {
        element['url_display'] = element._source.url;
      });

      /** Paging */
      this.sliderStep = 0;


      this.loadingSliderContent = false;
      //this.selectedSource.advanceSettings.scheduleOpts = new scheduleOpts();
      this.allowUrlArr = this.selectedSource.advanceSettings ? this.selectedSource.advanceSettings.allowedURLs : [];
      this.blockUrlArr = this.selectedSource.advanceSettings ? this.selectedSource.advanceSettings.blockedURLs : [];
      if (this.selectedSource.advanceSettings.allowedURLs.length > 0) {
        this.crwalOptionLabel = 'Crawl Only Specific URLs'
      } else if (this.selectedSource.advanceSettings.blockedURLs.length > 0) {
        this.crwalOptionLabel = 'Crawl Everything Except Specific URls'
      } else {
        this.crwalOptionLabel = 'Crawl Everything'
      }
      this.swapSlider('page')
      // if(this.isConfig && $('.tabname') && $('.tabname').length){
      //   $('.tabname')[1].classList.remove('active');
      //   $('.tabname')[0].classList.add('active');
      // }
      // this.isConfig = false;
    }, errRes => {
      this.loadingSliderContent = false;
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to crawl web page', 'error');
      }
    });
  }
  viewPages() {
    this.sliderStep = 0;
  }
  viewPageDetails() {
    this.sliderStep = 1;
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
        // $('.tabname')[0].classList.add('active');
        // $('.tabname')[1].classList.remove('active');
        // $('.tabname')[2].classList.remove('active');
        if (this.selectedSource.recentStatus == 'success') {
          this.execution = false;
          this.isConfig = false;
          this.page = true;
        } else {
          this.execution = false;
          this.isConfig = true;
          this.page = false;
        }

      }
    }
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
      sourceType: 'content'
    };
    this.service.invoke('get.executionHistory', quaryparms).subscribe(res => {
      if (res.contentExecutions) {
        this.executionHistoryData = res.contentExecutions;
        this.executionHistoryData.forEach(element => {
          element.executionStats.duration = this.duration(element.executionStats.duration);
          element.createdOn = moment(element.createdOn).fromNow();
          if (element.executionStats.statusLogs) {
            element.executionStats.statusLogs.forEach(status_log => {
              status_log.timeTaken = this.duration(status_log.timeTaken);
            });
          }
          if (element.executionStats.executionStatusMessage == 'Execution Stopped' && element.executionStats.isTimedOut) {
            if (element.executionStats.statusLogs) {
              //element.statusLogs.forEach(element => {
              if (element.executionStats.statusLogs.length > 1) {
                element.executionStats['tooltip'] = "" + element.executionStats.statusLogs[element.statusLogs.length - 2].stageName + "failed due to timeout"
              }
              //});
            }
          } else if (element.executionStats.executionStatusMessage == 'Execution Stopped') {
            element.executionStats['tooltip'] = "Execution Stopped due to " + element.statusMessage || ' time out';
          }
        });
      }

    }, errRes => {
      this.loadingSliderContent = false;
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed', 'error');
      }
    });

  }
  openStatusSlider(source) {
    console.log("sourec opned", source)
    // if (source && ((source.recentStatus === 'running') || (source.recentStatus === 'queued') || (source.recentStatus === 'inprogress'))) {
    //   this.notificationService.notify('Source extraction is still in progress', 'error');
    //   return;
    // }

    // if (source.recentStatus === 'success') {
    this.contentModaltype = source.extractionType;
    this.selectedSource = source;
    this.selectedSource.advanceSettings = source.advanceSettings || new AdvanceOpts();
    //this.pageination(source.numPages, 10)
    if (source.extractionType === 'webdomain') {
      if (source.advanceSettings) {
        this.useCookies = source.advanceSettings.useCookies;
        this.respectRobotTxtDirectives = source.advanceSettings.respectRobotTxtDirectives;
        this.crawlBeyondSitemaps = source.advanceSettings.crawlBeyondSitemaps;
        this.isJavaScriptRendered = source.advanceSettings.isJavaScriptRendered;
        this.blockHttpsMsgs = source.advanceSettings.blockHttpsMsgs;
        this.crawlDepth = source.advanceSettings.crawlDepth;
        this.maxUrlLimit = source.advanceSettings.maxUrlLimit
      }
      this.openStatusModal();
      this.loadingSliderContent = true;
      this.selectedSource.advanceSettings = source.advanceSettings || new AdvanceOpts();
      //this.pageination(source.numPages, 10);
      this.totalRecord = source.numPages;
      this.getCrawledPages(this.limitpage, 0);
      this.executionHistory();
      this.sourceStatus = source.recentStatus;
      // if(this.sourceStatus === 'success'){
      //    this.execution = false;
      //    this.isConfig = false;
      //    this.page = true;
      // }else{
      //   this.execution = false;
      //   this.isConfig = true;
      //   this.page = false;
      // }
    }
    else if (source.extractionType === 'document') {
      this.openDocumentModal();
      this.getCrawledPages(this.limitpage, 0);
    }
    // this.sliderComponent.openSlider('#sourceSlider', 'right500');
    //}
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
    this.recordStr = 1
    if (this.totalRecord > this.limitpage) {
      this.recordEnd = this.limitpage;
      this.allInOne = false;
      $('.pre-arrow').addClass("dis-arow");
    } else {
      this.recordEnd = this.totalRecord;
      this.allInOne = true;
      $('.pre-arrow').addClass("dis-arow");
      $('.nxt-arrow').addClass("dis-arow");
    }
    if (action == true && this.totalRecord > this.recordEnd && !(this.totalRecord > this.limitpage)) {
      this.recordEnd = this.totalRecord;
      this.allInOne = true;
      $('.pre-arrow').addClass("dis-arow");
      $('.nxt-arrow').addClass("dis-arow");
    }
  }

  numArr(n: number): any[] {
    return Array(n);
  }
  onListScroll() {
    if (!this.isConfig) {
      if (this.perfectScroll.states.top) {
        if (!(this.recordStr < this.limitpage)) this.onClickArrow(this.recordStr - this.limitpage, this.recordEnd - this.limitpage, 2, 1000)
      } else if (this.perfectScroll.states.bottom) {
        if (this.recordEnd != this.totalRecord) this.onClickArrow(this.recordStr + this.limitpage, this.recordEnd + this.limitpage, 2, 1000)
      }
    }
  }
  paginate(event, type?) {
    if (type == 'history') {
      this.executionHistory()
    } else {
      this.getCrawledPages(event.limit, event.skip);
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop(2, 1000);
    }

  }
  onClickArrow(newStart, newEnd, offset, time) {
    let preStart = this.recordStr;
    let preEnd = this.recordEnd;
    if ((newStart < 1) || newEnd > (this.totalRecord + this.limitpage)) {
    } else {
      if (preEnd == this.totalRecord) {
        newEnd = newStart + (this.limitpage - 1);
      }
      newStart < 0 ? this.recordStr = 1 : this.recordStr = newStart;
      newStart > this.totalRecord ? this.recordStr = this.recordStr - this.limitpage : this.recordStr = newStart;
      newEnd > this.totalRecord ? this.recordEnd = this.totalRecord : this.recordEnd = newEnd;

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
      if (this.recordStr > this.limitpage && this.recordEnd < this.totalRecord) {
        $('.pre-arrow').removeClass("dis-arow");
        $('.nxt-arrow').removeClass("dis-arow");
      } else if (this.recordStr < this.limitpage) {
        $('.pre-arrow').addClass("dis-arow");
        $('.nxt-arrow').removeClass("dis-arow");
      } else if (this.recordEnd == this.totalRecord) {
        $('.pre-arrow').removeClass("dis-arow");
        $('.nxt-arrow').addClass("dis-arow");
      }
      if (this.allInOne) {
        $('.pre-arrow').addClass("dis-arow");
        $('.nxt-arrow').addClass("dis-arow");
      }


    }
  }
  onClickPageNo(noRows, index) {
    this.getCrawledPages(noRows, index);
    $('.numbers').each((key, valyue) => {
      $('.numbers').removeClass("active")
    })
    $('#number_' + index).addClass("active");
  }
  saveDocDetails() {
    let payload: any;
    if (this.isEditDoc) {
      payload = {
        name: this.editDocObj.title,
        desc: this.editDocObj.desc
      }
    } else {
      payload = {
        name: this.selectedSource.name,
        desc: this.selectedSource.desc
      }
    }

    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: this.selectedSource._id,
    };
    this.service.invoke('update.contentPageSource', quaryparms, payload).subscribe(res => {
      this.isEditDoc = false;
      this.getSourceList();
      this.notificationService.notify('Updated Successfully', 'success');
      this.closeDocumentModal();

    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  cancelDocDetails() {
    this.closeDocumentModal();
  }
  editDoc() {
    this.isEditDoc = true;
    this.editDocObj.title = this.selectedSource.name;
    this.editDocObj.desc = this.selectedSource.desc
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
        body: 'The selected document will be deleted.',
        buttons: [{ key: 'yes', label: 'delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteSource(record, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
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
        body: 'All the Pages associated with this source will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          if (from == 'source') {
            this.deleteSource(record, dialogRef)
          } else {
            this.deletePage(record, event, dialogRef)
          }
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
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
      contentId: page._id
    }
    const payload: any = {
      url: page._source.url
    }
    this.service.invoke('check.forUpdates', quaryparms, payload).subscribe(res => {
      this.loadingcheckForUpdate = false;
      if (res._meta.updateAvailable) {
        this.notificationService.notify('A new version of this page is available', 'success');
      } else {
        this.notificationService.notify('The page is up to date', 'success');
      }

    }, errRes => {
      this.loadingcheckForUpdate = false;
      this.errorToaster(errRes, 'Failed Update');
    });
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
      jobId: page.jobId
    }
    const payload: any = {
      url: page._source.url
    }
    this.service.invoke('reCrwal.website', quaryparms, payload).subscribe(res => {
      this.notificationService.notify('Re-Crawling Initiated', 'success');
    }, errRes => {
      this.errorToaster(errRes, 'Failed to Re-Crawl');
    });
  }

  stopCrwaling(source, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      jobId: source.jobId
    }
    this.service.invoke('stop.crwaling', quaryparms).subscribe(res => {
      this.notificationService.notify('Stoped Crawling', 'success');
      this.getSourceList();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to Stop Cwraling');
    });
  }
  deleteSource(record, dialogRef) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: record.type,
      sourceId: record._id
    }
    this.service.invoke('delete.content.source', quaryparms).subscribe(res => {
      dialogRef.close();
      //if(this.isEditDoc){
      this.isEditDoc = false;
      this.cancelDocDetails();
      this.getSourceList()
      //} 
      this.notificationService.notify('Source deleted successsfully', 'success');
      const deleteIndex = _.findIndex(this.resources, (pg) => {
        return pg._id === record._id;
      })
      if (deleteIndex > -1) {
        this.resources.splice(deleteIndex, 1);
      }
      this.closeStatusModal();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete source');
    });
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
      sourceType: this.selectedSource.type
    }
    if (quaryparms.sourceType === 'webdomain') {
      quaryparms.contentType = 'pages'
    }
    if (quaryparms.sourceType === 'document') {
      quaryparms.contentType = 'docContent'
    }
    this.service.invoke('delete.content.page', quaryparms).subscribe(res => {
      dialogRef.close();
      this.totalRecord = this.totalRecord - 1;
      this.pageination(this.totalRecord, true)
      this.notificationService.notify('Page deleted successsfully', 'success');
      const deleteIndex = _.findIndex(this.selectedSource.pages, (pg) => {
        return pg._id === page._id;
      })
      if (deleteIndex > -1) {
        this.selectedSource.pages.splice(deleteIndex, 1);
        this.getCrawledPages(this.limitpage, this.recordStr - 1);
      }
    }, errRes => {
    });
  }
  filterTableType() {

  }
  filterTable(source, headerOption) {
    console.log(this.resources, source)
    this.filterTableSource = source;
    this.filterTableheaderOption = headerOption;
    let firstFilterDataBack = [];
    //this.resources = [...this.filterResourcesBack]; // For new Filter..
    if (headerOption == "extractionType") {
      this.filterSystem.typeHeader = headerOption;
      this.filterSystem.typefilter = source;
    } else {
      this.filterSystem.statusHeader = headerOption;
      this.filterSystem.statusFilter = source;
    }

    //this.filterText  = source;
    /** TYpe */
    // if(this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter == "all"){
    //   this.resources = [...this.filterResourcesBack];
    //   this.firstFilter = {'header': '' , 'source' : ''};
    // } else {
    //  if(this.filterSystem.typefilter == "all" || this.filterSystem.statusFilter == "all"){
    //   if(!this.firstFilter['header'])this.firstFilter = {'header': headerOption , 'source' : source};
    //   if(source == "all") {
    //     firstFilterDataBack = [...this.filterResourcesBack];
    //     const resourceData =  firstFilterDataBack.filter((data)=>{
    //       return data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase();
    //       })
    //     if(resourceData.length)this.resources = [...resourceData];
    //   }else{
    //     firstFilterDataBack = [...this.filterResourcesBack];
    //     const resourceData =  firstFilterDataBack.filter((data)=>{

    //       return data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase();
    //       })
    //     if(resourceData.length)this.resources = [...resourceData];
    //   }

    //  }else {
    //   this.resources = [...this.filterResourcesBack];
    //   //firstFilter
    //   const firstResourceData =  this.resources.filter((data)=>{
    //     console.log(data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase());
    //     return data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase();
    //     })
    //     const secondResourceData =  firstResourceData.filter((data)=>{
    //       console.log(data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase());
    //       return data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase();
    //       })
    //   if(secondResourceData.length)this.resources = [...secondResourceData];
    //  }

    // }

    //a/
    if (this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter == "all") {
      this.resources = [...this.filterResourcesBack];
      this.firstFilter = { 'header': '', 'source': '' };
    }
    else if (this.filterSystem.typefilter != "all" && this.filterSystem.statusFilter == "all") {
      if (!this.firstFilter['header']) {
        this.firstFilter = { 'header': headerOption, 'source': source };
      }
      firstFilterDataBack = [...this.filterResourcesBack];
      const resourceData = firstFilterDataBack.filter((data) => {
        return data[this.filterSystem.typeHeader].toLocaleLowerCase() === this.filterSystem.typefilter.toLocaleLowerCase();
      })
      if (resourceData.length) this.resources = [...resourceData];
    }
    else if (this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter != "all") {
      if (!this.firstFilter['header']) {
        this.firstFilter = { 'header': headerOption, 'source': source };
      }
      firstFilterDataBack = [...this.filterResourcesBack];
      const resourceData = firstFilterDataBack.filter((data) => {
        return data[this.filterSystem.statusHeader].toLocaleLowerCase() === this.filterSystem.statusFilter.toLocaleLowerCase();
      })
      if (resourceData.length) this.resources = [...resourceData];

    }
    else if (this.filterSystem.typefilter != "all" && this.filterSystem.statusFilter != "all") {
      this.resources = [...this.filterResourcesBack];
      //firstFilter
      // if (this.firstFilter['header'] == headerOption) {
      if (headerOption == "extractionType") {
        this.firstFilter = { 'header': this.filterSystem.statusHeader, 'source': this.filterSystem.statusFilter };
      } else {
        this.firstFilter = { 'header': this.filterSystem.typeHeader, 'source': this.filterSystem.typefilter };
      }
      const firstResourceData = this.resources.filter((data) => {
        console.log(data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase());
        return data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase();
      })
      const secondResourceData = firstResourceData.filter((data) => {
        console.log(data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase());
        return data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase();
      })
      if (secondResourceData.length) this.resources = [...secondResourceData];
      //}
    }



    //this.getSourceList();
  }
  transform(date: string): any {
    const _date = new Date(date);
    if (_date.toString() === 'Invalid Date') {
      return '-';
    }
    else {
      return moment(_date).format('DD MMM YYYY');
    }
  }
  pushValues(res, index) {
    const array = [];
    array.push(this.transform(res[index].createdOn), res[index].desc, res[index].name, res[index].recentStatus, res[index].type)

    return array
  }
  applyFilter(valToSearch) {
    if (valToSearch === this.selectedFilter) {
      this.getSourceList();
      this.selectedFilter = '';
      return;
    }
    if (valToSearch) {
      this.resources = [...this.filterResourcesBack];
      let tableData = [];
      console.log(this.resources)

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
      tableData = [...new Set(tableData)]
      if (tableData.length) {
        this.resources = tableData;
        this.sectionShow = true;
      } else {
        this.sectionShow = false;
      }
      console.log(tableData);
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
    const code = (event.keyCode ? event.keyCode : event.which);
    if (code === 13) {
      // event.preventDefault();
      const payload = {
        title: this.selectedSource.name,
        description: this.selectedSource.desc
      };
      const queryParams = {
        searchIndexId: this.serachIndexId,
        webdomainId: this.selectedSource._id
      }

      this.service.invoke('put.EditConfig', queryParams, payload).subscribe(res => {
        console.log(res)

      }, errRes => {
        console.log(errRes)
      });
    }
  };
  openStatusModal() {
    this.statusModalPopRef = this.statusModalPop.open();
  }
  closeStatusModal() {
    this.swapSlider('page') // Just to redirect to 1st page
    if (this.statusModalPopRef && this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
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
    //var editConfObj : any = {};
    this.editConfObj.title = this.selectedSource.name;
    this.editConfObj.url = this.selectedSource.url;
    this.editConfObj.desc = this.selectedSource.desc;

  }
  blockUrls(data) {
    //data['condition'] = this.urlConditionBlock;
    //this.blockUrl.condition = this.urlConditionBlock;
    //this.selectedSource['advanceSettings'].blockedURLs.push(data);
    this.blockUrlArr = [...this.selectedSource['advanceSettings'].blockedURLs]
    //this.blockUrl = new BlockUrl;
    if (data['url'])
      this.updateRecord(this.selectedSource['advanceSettings'].blockedURLs.length - 1, data, 'add', 'block');
  }
  allowUrls(contains, allowUrl, dataAllow) {
    console.log(contains, allowUrl.value)
    let data = {};
    //data['condition'] = contains;
    //data['url'] = allowUrl.value;
    data = dataAllow;
    this.allowUrlArr = [...this.selectedSource['advanceSettings'].allowedURLs]
    if (data['url'])
      this.updateRecord(this.selectedSource['advanceSettings'].allowedURLs.length - 1, data, 'add', 'allow');
    $('#enterPathInput')[0].value = '';

  }
  updateRecord(i, allowUrls, option, type) {
    //selectedSource.advanceSettings.allowedURLs
    let payload = {}
    let resourceType = this.selectedSource.extractionType;
    let crawler = new CrwalObj()
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: this.selectedSource._id,
      sourceType: this.selectedSource.extractionType,
    };
    crawler.name = this.selectedSource.name;
    crawler.url = this.selectedSource.url;
    crawler.desc = this.selectedSource.desc || '';
    crawler.advanceOpts.allowedURLs = [...this.allowUrlArr]
    crawler.advanceOpts.blockedURLs = [...this.blockUrlArr]
    crawler.advanceOpts.useCookies = this.useCookies;
    crawler.advanceOpts.respectRobotTxtDirectives = this.respectRobotTxtDirectives;
    crawler.advanceOpts.crawlBeyondSitemaps = this.crawlBeyondSitemaps;
    crawler.advanceOpts.isJavaScriptRendered = this.isJavaScriptRendered;
    crawler.advanceOpts.blockHttpsMsgs = this.blockHttpsMsgs;
    crawler.advanceOpts.crawlDepth = this.crawlDepth;
    crawler.advanceOpts.maxUrlLimit = this.maxUrlLimit;
    if (option == 'add') {
      type == 'block' ? crawler.advanceOpts.blockedURLs.push(allowUrls) : crawler.advanceOpts.allowedURLs.push(allowUrls);
    } else {
      type == 'block' ? crawler.advanceOpts.blockedURLs.splice(i, 1) : crawler.advanceOpts.allowedURLs.splice(i, 1);
    }

    crawler.resourceType = resourceType;
    payload = crawler;
    console.log(payload);

    this.service.invoke('update.contentPageSource', quaryparms, payload).subscribe(res => {
      if (option == 'add') {
        type == 'block' ? this.selectedSource['advanceSettings'].blockedURLs.push(allowUrls) : this.selectedSource['advanceSettings'].allowedURLs.push(allowUrls);
      } else {
        type == 'block' ? this.selectedSource['advanceSettings'].blockedURLs.splice(i, 1) : this.selectedSource['advanceSettings'].allowedURLs.splice(i, 1);
      }
      type == 'block' ? this.blockUrl = new BlockUrl : this.allowUrl = new AllowUrl;
      this.allowUrlArr = [...this.selectedSource['advanceSettings'].allowedURLs];
      this.blockUrlArr = [...this.selectedSource['advanceSettings'].blockedURLs];
      this.getSourceList()
      // allowUrls.forEach(element => {

      // });
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
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
    this.service.invoke('recrwal', quaryparms).subscribe(res => {
      this.getSourceList();
      this.notificationService.notify('Re-Crawling Initiated', 'success');
      this.closeStatusModal();
      //this.notificationService.notify('Recrwaled with status : ' + res.recentStatus, 'success');
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  urlCondition(condition, type) {
    type == 'allow' ? this.urlConditionAllow = condition : this.urlConditionBlock = condition;
    type == 'allow' ? this.allowUrl.condition = condition : this.blockUrl.condition = condition;
    if (condition === 'is') {
      type === 'allow' ? this.allowUrl.name = "Equals to" : this.blockUrl.name = "Equals to";
    }
    else if (condition === 'isNot') {
      type === 'allow' ? this.allowUrl.name = "Not equals to" : this.blockUrl.name = "Not equals to";
    }
    else if (condition === 'beginsWith') {
      type === 'allow' ? this.allowUrl.name = "Begins with" : this.blockUrl.name = "Begins with";
    }
    else if (condition === 'endsWith') {
      type === 'allow' ? this.allowUrl.name = "Ends with" : this.blockUrl.name = "Ends with";
    }
    else if (condition === 'contains') {
      type === 'allow' ? this.allowUrl.name = "Contains" : this.blockUrl.name = "Contains";
    }
    else if (condition === 'doesNotContains') {
      type === 'allow' ? this.allowUrl.name = "Doesn't contain" : this.blockUrl.name = "Doesn't contain";
    }
  }
  scheduleData(scheduleData) {
    console.log(scheduleData);
    this.selectedSource['advanceSettings'].scheduleOpts = scheduleData;
  }
  cronExpress(cronExpress) {
    console.log(cronExpress);
    this.selectedSource['advanceSettings'].repeatInterval = cronExpress;
  }
  exceptUrl(bool) {
    this.selectedSource.advanceSettings.allowedOpt = !bool;
    this.selectedSource.advanceSettings.blockedOpt = !this.selectedSource.advanceSettings.allowedOpt;
  }
  restrictUrl(bool) {
    this.selectedSource.advanceSettings.blockedOpt = !bool;
    this.selectedSource.advanceSettings.allowedOpt = !this.selectedSource.advanceSettings.blockedOpt;
  }
  changeSettings(bool) {
    this.selectedSource.advanceSettings.crawlEverything = !bool;
    this.selectedSource.advanceSettings.allowedOpt = bool;
  }
  proceedWithConfigUpdate() {
    let payload = {};
    let schdVal = true;
    let resourceType = this.selectedSource.extractionType;
    let crawler = new CrwalObj()
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: this.selectedSource._id,
      sourceType: this.selectedSource.extractionType,
    };
    if (this.editTitleFlag) {
      crawler.name = this.editConfObj.title;
      crawler.url = this.selectedSource.url; // this.editConfObj.url
      crawler.desc = this.editConfObj.desc || '';
    } else {
      crawler.name = this.selectedSource.name;
      crawler.url = this.selectedSource.url;
      crawler.desc = this.selectedSource.desc || '';
    }
    if (this.selectedSource.advanceSettings.scheduleOpt) {
      // if(this.selectedSource.advanceSettings.scheduleOpts.date){
      //   let date = this.selectedSource.advanceSettings.scheduleOpts.date;
      //   if(String(date).split(" ")) this.selectedSource.advanceSettings.scheduleOpts.date =  String(date).split(" ")[1] + " " + String(date).split(" ")[2]  + " " + String(date).split(" ")[3];
      // }
      // if(this.selectedSource.advanceSettings.scheduleOpts.interval.intervalType && 
      //   this.selectedSource.advanceSettings.scheduleOpts.interval.intervalType != "Custom"){
      //   this.selectedSource.advanceSettings.scheduleOpts.interval.intervalValue = {};
      // }
      // if(this.selectedSource.advanceSettings.scheduleOpts.interval && 
      //   this.selectedSource.advanceSettings.scheduleOpts.interval.intervalValue &&
      //   this.selectedSource.advanceSettings.scheduleOpts.interval.intervalValue.endsOn &&
      //   this.selectedSource.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.endDate){
      //   let endate = this.selectedSource.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.endDate;
      //   if(String(endate).split(" "))this.selectedSource.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.endDate =  String(endate).split(" ")[1]  + " " +  String(endate).split(" ")[2] + " " +  String(endate).split(" ")[3];
      // }
      if (this.selectedSource.advanceSettings.scheduleOpts.interval.intervalType &&
        this.selectedSource.advanceSettings.scheduleOpts.interval.intervalType != "Custom") {
        this.selectedSource.advanceSettings.scheduleOpts.interval.intervalValue = {};
      }
      crawler.advanceOpts = this.selectedSource.advanceSettings;
    }
    crawler.advanceOpts.useCookies = this.useCookies;
    crawler.advanceOpts.respectRobotTxtDirectives = this.respectRobotTxtDirectives;
    crawler.advanceOpts.crawlBeyondSitemaps = this.crawlBeyondSitemaps;
    crawler.advanceOpts.isJavaScriptRendered = this.isJavaScriptRendered;
    crawler.advanceOpts.blockHttpsMsgs = this.blockHttpsMsgs;
    if (Number(this.crawlDepth)) {
      crawler.advanceOpts.crawlDepth = Number(this.crawlDepth);
    } else {
      delete crawler.advanceOpts.crawlDepth;
    }
    if (Number(this.maxUrlLimit)) {
      crawler.advanceOpts.maxUrlLimit = Number(this.maxUrlLimit);
    } else {
      delete crawler.advanceOpts.maxUrlLimit;
    }

    crawler.advanceOpts.allowedURLs = [...this.allowUrlArr]
    crawler.advanceOpts.blockedURLs = [...this.blockUrlArr]
    crawler.advanceOpts.allowedURLs.length > 0 ? crawler.advanceOpts.allowedOpt = true : crawler.advanceOpts.allowedOpt = false;
    crawler.advanceOpts.blockedURLs.length > 0 ? crawler.advanceOpts.blockedOpt = true : crawler.advanceOpts.blockedOpt = false;
    crawler.advanceOpts.allowedURLs.length > 0 || crawler.advanceOpts.blockedURLs.length > 0 ? crawler.advanceOpts.crawlEverything = false : crawler.advanceOpts.crawlEverything = true;
    if (resourceType != 'webdomain') {
      crawler.resourceType = resourceType;
    }
    else {
      delete crawler.resourceType;
    }
    payload = crawler;
    //console.log(payload);
    if (crawler.advanceOpts.scheduleOpt) {
      if (crawler.advanceOpts.scheduleOpts) {
        if (!crawler.advanceOpts.scheduleOpts.date) {
          schdVal = false;
        }
        if (!crawler.advanceOpts.scheduleOpts.time) {
          schdVal = false;
        } else {
          if (crawler.advanceOpts.scheduleOpts.time.hour == "" || crawler.advanceOpts.scheduleOpts.time.hour == "null") schdVal = false;
          if (crawler.advanceOpts.scheduleOpts.time.timeOpt == "") schdVal = false;
          if (crawler.advanceOpts.scheduleOpts.time.timezone == "Time Zone") schdVal = false;
        }
      }
    }
    if (schdVal) {
      this.service.invoke('update.contentPageSource', quaryparms, payload).subscribe(res => {
        this.notificationService.notify('Configuration Saved', 'success');
        this.editTitleFlag = false;
        this.getSourceList();
        this.closeStatusModal();
      }, errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      });
    } else {
      this.notificationService.notify('Please fill Date and Time fields', 'error');
    }

  }

  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "name": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "type": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "recentStatus": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "createdOn": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
    }
  }
  crawlOption(opt, label) {
    this.crwalOptionLabel = label;
    if (opt != 'any') {
      this.selectedSource.advanceSettings.crawlEverything = false;
      if (opt == 'allow') {
        this.selectedSource.advanceSettings.allowedOpt = true;
        this.selectedSource.advanceSettings.blockedOpt = false;
      } else if (opt == 'block') {
        this.selectedSource.advanceSettings.blockedOpt = true;
        this.selectedSource.advanceSettings.allowedOpt = false;
      }
    } else if (opt == 'any') {
      this.selectedSource.advanceSettings.crawlEverything = true;
    }
  }
  //crawl job ondemand
  jobOndemand(source, event) {
    console.log("jobOndemand", source)
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const queryParams: any = {
      searchIndexID: this.serachIndexId,
      sourceId: source._id
    };
    this.service.invoke('get.crawljobOndemand', queryParams).subscribe(res => {
      console.log(res);
      this.getSourceList();
      //this.notificationService.notify('Bot linked, successfully', 'success');
    },
      (err) => {
        console.log(err);
        this.notificationService.notify('Failed to crawl', 'error');
      }
    )
  }
  ngOnDestroy() {
    const timerObjects = Object.keys(this.polingObj);
    if (timerObjects && timerObjects.length) {
      timerObjects.forEach(job => {
        clearInterval(this.polingObj[job]);
      });
    }
    window.removeEventListener('scroll', this.scroll, true);
  }
}

// class CrwalObj{  

//   url: String = '';
//   desc: String = '';
//   name: String = '';
//   resourceType: String = '';
//   advanceOpts: AdvanceOpts = new AdvanceOpts()


// }
// class AdvanceOpts{
// scheduleOpts:boolean = true;
//     schedulePeriod: String ="";
//     repeatInterval: String ="";
//     crawlEverything: boolean = true; 
//        allowedURLs:AllowUrl[] = [];
//        blockedURLs: BlockUrl[] = [];
// }
// class AllowUrl {
// condition:String = '';
//  url: String = '';
// }
// class BlockUrl {
// condition:String = '';
//  url: String = '';
// }
