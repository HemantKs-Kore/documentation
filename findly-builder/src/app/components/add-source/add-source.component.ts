import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { AuthService } from '@kore.services/auth.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '../../services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
declare const $: any;
import * as _ from 'underscore';
import { of, interval, Subject } from 'rxjs';
import { startWith, take, finalize } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CrwalObj, AdvanceOpts, AllowUrl, BlockUrl, scheduleOpts } from 'src/app/helpers/models/Crwal-advance.model';

import { PdfAnnotationComponent } from '../annotool/components/pdf-annotation/pdf-annotation.component';
import { MatDialog, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { RangySelectionService } from '../annotool/services/rangy-selection.service';
//import { DockStatusService } from '../../services/dock.status.service';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { UpgradePlanComponent } from 'src/app/helpers/components/upgrade-plan/upgrade-plan.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';

@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class AddSourceComponent implements OnInit, OnDestroy, AfterViewInit {
  fileObj: any = {};
  crwalEvery = false;
  crawlOkDisable = false;
  crwalObject: CrwalObj = new CrwalObj();
  allowUrl: AllowUrl = new AllowUrl();
  allBotArray: any = [];
  showMore = false;
  @ViewChild('botsConfigurationModalElement') botsConfigurationModalElement: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  @ViewChild('perfectScroll3') perfectScroll3: PerfectScrollbarComponent;
  @ViewChild('perfectScroll4') perfectScroll4: PerfectScrollbarComponent;
  @ViewChild('perfectScroll9') perfectScroll9: PerfectScrollbarComponent;
  blockUrl: BlockUrl = new BlockUrl();
  sampleJsonPath: any = '/home/assets/sample-data/sample.json';
  sampleCsvPath: any = '/home/assets/sample-data/sample.csv';
  filePath;
  extension;
  receivedQuaryparms: any;
  searchIndexId;
  selectedSourceType: any = null;
  newSourceObj: any = {};
  selectedApp: any = {};
  statusModalPopRef: any = [];
  customRecurrenceRef: any = [];
  pollingSubscriber: any = null;
  initialValidations: any = {};
  doesntContains = 'Doesn\'t Contains';
  dataFromScheduler: scheduleOpts
  loadFullComponent = true;
  linkedBotID: any;
  linkedBotName: any;
  linkedBotDescription: any;
  linkedBotData: any = {};
  islinked = false;
  botToBeUnlinked = '';
  useCookies = true;
  respectRobotTxtDirectives = true;
  crawlBeyondSitemaps = false;
  isJavaScriptRendered = false;
  blockHttpsMsgs = false;
  crwalOptionLabel = "Crawl Everything";
  crawlDepth: number;
  maxUrlLimit: number;
  botsConfigurationModalRef: any;
  removedArr = [];
  submitted = false;
  showPassword = false;
  url_failed: boolean = false;
  btnDisabled: boolean = false;
  configurationLink: any = {
    postUrl: '',
    accessToken: '',
    webhookUrl: '',
    clientSecret: '',
    clientId: ''
  }
  fileDataObj: any = {};
  multipleData: any = {};
  files;
  showDesc = false
  filesListData: any = [];
  multipleFileArr = [];
  importFaqInprogress = false;
  selectedLinkBotConfig: any;
  @Input() inputClass: string;
  @Input() resourceIDToOpen: any;
  @Output() saveEvent = new EventEmitter();
  @Output() cancleEvent = new EventEmitter();
  @Output() closeSourcePopupEvent = new EventEmitter();
  faqUpdate: Subject<void> = new Subject<void>();
  closePollingTimer$ = new Subject<any>();
  defaultStatusObj: any = {
    jobId: '',
    status: 'running',
    validation: {
      validated: false
    }
  }
  statusObject: any = {
    resourceId: 'faqr-7d78d107-f1ee-5a63-b417-160d36955fd8',
    status: 'success',
    statusMessage: 'Encountered an unexpected error during extraction',
    validation: { validated: true },
    validated: false,
    _id: 'job-2745cd21-98f0-580e-926c-6f6bf41593fa',
  };
  currentStatusFailed: any = false;
  crwal_jobId: any;
  userInfo: any = {};
  csvContent: any = '';
  extract_sourceId: any;
  imageUrl = 'https://banner2.cleanpng.com/20180331/vww/kisspng-computer-icons-document-memo-5ac0480f061158.0556390715225507990249.jpg';
  availableSources: any = [
    {
      title: 'Add Content from Webpages, Files, and Other Sources',
      sources: [
        {
          name: 'Crawl Web Domain',
          description: 'Extract and index web pages',
          icon: 'assets/icons/content/webdomain.svg',
          id: 'contentWeb',
          sourceType: 'content',
          resourceType: 'web'
        },
        {
          name: 'Upload File',
          description: 'Index file content',
          icon: 'assets/icons/content/fileupload.svg',
          id: 'contentDoc',
          sourceType: 'content',
          resourceType: 'file'
        },
        // {
        //   name: 'Others',
        //   description: 'Extract content from other',
        //   icon: 'assets/icons/content/othersuccess.svg',
        //   id: 'contentothers',
        //   sourceType: 'content',
        //   resourceType: 'document'
        // }
      ]
    },
    {
      title: 'Extract FAQs from Webpages and Files, or Add Manually',
      sources: [
        {
          name: 'Extract FAQs ',
          description: 'Extract FAQs from web pages and documents',
          icon: 'assets/icons/content/extractfaq.svg',
          id: 'faqWeb',
          sourceType: 'faq',
          resourceType: ''
        },
        {
          name: 'Import FAQs',
          description: 'Import FAQs from CSV, Json',
          icon: 'assets/icons/content/importfaq.svg',
          id: 'faqDoc',
          sourceType: 'faq',
          resourceType: 'importfaq'
        },
        {
          name: 'Add FAQs Manually',
          description: 'Manually Input FAQs',
          icon: 'assets/icons/content/addfaq.svg',
          id: 'manual',
          sourceType: 'faq',
          resourceType: 'manual'
        }
      ]
    },
    {
      title: 'Add Structured data by uploading a file or adding manually',
      sources: [
        {
          name: 'Add Structured Data',
          description: 'Import from JSON or CSV',
          icon: 'assets/icons/content/database-Import.svg',
          id: 'contentStucturedDataImport',
          sourceType: 'data',
          resourceType: 'structuredData'
        },
        {
          name: 'Add Structured Data',
          description: 'Add structured data manually',
          icon: 'assets/icons/content/database-add.svg',
          id: 'contentStucturedDataAdd',
          sourceType: 'data',
          resourceType: 'structuredDataManual'
        }
      ]
    },
    {
      title: 'Connect & add actions from virtual assistants',
      sources: [
        {
          name: 'Link Virtual Assistant',
          description: 'Add Bot Actions',
          icon: 'assets/icons/content/linkvirtual.svg',
          id: 'botActions',
          sourceType: 'action',
          resourceType: 'linkBot'
        }

      ]
    },
    {
      title: 'Connecting sources and add searchable distinct entities',
      sources: [
        {
          name: 'Link Searchable Sources',
          description: 'shared content across organisation',
          icon: 'assets/icons/content/View.svg',
          id: 'connectorsId',
          sourceType: 'connectors',
          resourceType: 'connectors'
        }

      ]
    },
    
  ];
  anntationObj: any = {};
  addManualFaqModalPopRef: any;
  addSourceModalPopRef: any;
  crawlModalPopRef: any;
  showSourceTitle = false
  linkBotsModalPopRef: any;
  noAssociatedBots: boolean = true;
  associatedBots: any = [];
  streamID: any;
  showProgressBar: boolean;
  searchAssociatedBots: any;
  addStructuredDataModalPopRef: any;
  structuredData: any = {};
  structuredDataStatusModalRef: any;
  structuredDataDocPayload: any;
  selectExtractType: string = 'file';
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    //private dock: DockStatusService,
    public dialog: MatDialog,
    private rangyService: RangySelectionService,
    public inlineManual: InlineManualService,
    private appSelectionService: AppSelectionService,
    public dockService: DockStatusService,
    public mixpanel: MixpanelServiceService
  ) { }
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild('customRecurrence') customRecurrence: KRModalComponent;
  @ViewChild('addManualFaqModalPop') addManualFaqModalPop: KRModalComponent;
  @ViewChild('addSourceModalPop') addSourceModalPop: KRModalComponent;
  @ViewChild('linkBotsModalPop') linkBotsModalPop: KRModalComponent;
  @ViewChild('addStructuredDataModalPop') addStructuredDataModalPop: KRModalComponent;
  @ViewChild('structuredDataStatusModalPop') structuredDataStatusModalPop: KRModalComponent;
  @ViewChild('crawlModalPop') crawlModalPop: KRModalComponent;
  @ViewChild('plans') plans: UpgradePlanComponent;
  ngOnInit() {
    const _self = this
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
    this.appSelectionService.getTourConfig();
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.userInfo = this.authService.getUserInfo() || {};
    // this.streamID = this.workflowService.selectedApp()?.configuredBots[0]?._id ??  null;
    if (this.workflowService.selectedApp()?.configuredBots[0]) {
      this.streamID = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
    }
    else if (this.workflowService.selectedApp()?.publishedBots && this.workflowService.selectedApp()?.publishedBots[0]) {
      this.streamID = this.workflowService.selectedApp()?.publishedBots[0]?._id ?? null
    }
    else {
      this.streamID = null;
    }
    if (this.resourceIDToOpen == undefined) {
      this.getAssociatedBots();
    }
    // this.getAssociatedBots();

    if (this.route && this.route.snapshot && this.route.snapshot.queryParams) {
      this.receivedQuaryparms = this.route.snapshot.queryParams;
      if (this.receivedQuaryparms && this.receivedQuaryparms.sourceType || this.resourceIDToOpen) {
        const resourceType = this.resourceIDToOpen || this.receivedQuaryparms.sourceType;
        this.availableSources.forEach(catagory => {
          catagory.sources.forEach(source => {
            if (source.id === resourceType) {
              this.loadFullComponent = false;
              setTimeout(() => {
                _self.selectSource(source);
              }, 100)
            }
          });
        });
      }
    }
    this.checkAnnotationPolling();
    if (!this.inlineManual.checkVisibility('SOURCES')) {
      this.inlineManual.openHelp('SOURCES')
      this.inlineManual.visited('SOURCES')
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      $('#addSourceTitleInput').focus();
    }, 100);
  }
  openAddManualFAQModal() {
    this.addManualFaqModalPopRef = this.addManualFaqModalPop.open();
    setTimeout(() => {
      this.perfectScroll3.directiveRef.update();
      this.perfectScroll3.directiveRef.scrollToTop();
    }, 500)
  }
  closeAddManualFAQModal() {
    if (this.addManualFaqModalPopRef && this.addManualFaqModalPopRef.close) {
      this.addManualFaqModalPopRef.close();
    }
  }
  openCrawlModalPop() {
    this.crawlModalPopRef = this.crawlModalPop.open();
  }
  closeCrawlModalPop() {
    if (this.crawlModalPopRef && this.crawlModalPopRef.close) {
      this.crawlModalPopRef.close();
    }
  }
  openAddSourceModal() {
    this.addSourceModalPopRef = this.addSourceModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  closeAddSourceModal() {
    if (this.addSourceModalPopRef && this.addSourceModalPopRef.close) {
      this.url_failed = false;
      this.addSourceModalPopRef.close();
    }
  }

  openLinkBotsModal() {
    this.linkBotsModalPopRef = this.linkBotsModalPop.open();
    setTimeout(() => {
      this.perfectScroll4.directiveRef.update();
      this.perfectScroll4.directiveRef.scrollToTop();
    }, 500)
  }
  closeLinkBotsModal() {
    if (this.linkBotsModalPopRef && this.linkBotsModalPopRef.close) {
      this.linkBotsModalPopRef.close();
    }
  }
  editConfiguration() {
    //this.closeStatusModal();
    if (this.statusModalPopRef && this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
    this.url_failed = true;
    this.openAddSourceModal();
  }
  //retry failed url validation
  retryValidation() {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      sourceId: this.extract_sourceId
    };
    const payload = {
      url: this.newSourceObj.url
    }
    this.service.invoke('put.retryValidation', quaryparms, payload).subscribe(res => {
      this.statusObject = { ...this.statusObject, validation: res.validations };
    }, errRes => {
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed retry validation', 'error');
      }
    });
  }
  datainc = 0;
  poling(jobId, schedule?) {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      type: this.selectedSourceType.sourceType
    };
    this.pollingSubscriber = interval(5000).pipe(
      startWith(0)
    ).subscribe(() => {
      this.service.invoke('get.job.status', quaryparms).subscribe(res => {
        this.datainc = this.datainc + 1;
        this.statusObject = res;
        const queuedJobs = _.filter(res, (source) => {
          if (this.selectedSourceType.sourceType === 'content') {
            return (source.extractionSourceId === jobId);
          }
          else {
            return (source._id === jobId);
          }
        });
        if (queuedJobs && queuedJobs.length) {
          this.statusObject = queuedJobs[0];
          this.statusObject.status = this.statusObject.status.toLowerCase();

          if (queuedJobs[0].validation && queuedJobs[0].validation.urlValidation) {
            this.crawlOkDisable = !queuedJobs[0].validation.urlValidation;
          }

          if ((queuedJobs[0].status !== 'running') && (queuedJobs[0].status !== 'queued')) {
            if (this.selectedSourceType.sourceType === 'content'){
              this.mixpanel.postEvent('Content Crawl web domain success', {});
            }
            else if(this.selectedSourceType.sourceType === 'faq'&&this.selectedSourceType.resourceType === ''){
               this.mixpanel.postEvent('FAQ Web extract success', {});  
            } 

            this.pollingSubscriber.unsubscribe();
            let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
            if (currentPlan?.subscription?.planId == 'fp_free') {
              this.appSelectionService.updateUsageData.next('updatedUsage');
            }
            //this.crawlOkDisable = true;
            if (queuedJobs[0].validation?.limitValidation == false) {
              this.upgrade();
              /**updated queuedJobs[0].statusMessage to queuedJobs[0].message on 21/02  */
              //this.notificationService.notify(queuedJobs[0].statusMessage, 'error');
              this.notificationService.notify(queuedJobs[0].message, 'error');
            }
          }
          // if((queuedJobs[0].status == 'queued')){
          //   this.crawlOkDisable = true;
          // }else{
          //   this.crawlOkDisable = false;
          // }
        } else {
          this.statusObject = JSON.parse(JSON.stringify(this.defaultStatusObj));
          this.statusObject.status = this.statusObject.status.toLowerCase();
          if (!schedule) this.statusObject.status = 'failed';
          this.crawlOkDisable = false;
        }
        // console.log("job status every time happen", this.statusObject);
      }, errRes => {
        this.pollingSubscriber.unsubscribe();
        this.statusObject.status = 'failed';
        if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to extract web page', 'error');
        }
        if (this.statusModalPopRef && this.statusModalPopRef.close) {
          setTimeout(() => {
            this.closeStatusModal()
          }, 4000);
        }
      },
      );
    })
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // console.log(`${type}: ${event.value}`);
  }
  openCustomRecModal() {
    this.customRecurrenceRef = this.customRecurrence.open();
  }
  closeCustomRecModal() {
    if (this.customRecurrenceRef && this.customRecurrenceRef.close) {
      this.customRecurrenceRef.close();
    }
  }
  openStatusModal() {
    this.closeAddManualFAQModal();
    this.closeAddSourceModal();
    if (this.resourceIDToOpen) {
      $('.addSourceModalComponent').addClass('hide');
    }
    this.statusObject = { ...this.defaultStatusObj };
    const self = this;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    this.statusModalPopRef = this.statusModalPop.open();
  }
  closeStatusModal() {
    this.importFaqInprogress = false;
    this.saveEvent.emit();
    const self = this;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    if (this.statusModalPopRef && this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }

    this.redirectTo();
    this.cancleSourceAddition();
    this.closeCrawlModalPop();
  }
  closeCrawlModal() {
    this.saveEvent.emit();
    const self = this;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    if (this.crawlModalPopRef && this.crawlModalPopRef.close) {
      this.crawlModalPopRef.close();
    }
    this.closeCrawlModalPop();
    this.redirectTo();
    //this.cancleSourceAddition();
  }
  stopCrwaling(event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      jobId: this.crwal_jobId
    }
    this.service.invoke('stop.crwaling', quaryparms).subscribe(res => {
      this.notificationService.notify('Stoped Crwaling', 'success');
      this.closeStatusModal();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to Stop Cwraling');

    });
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
      this.closeStatusModal();
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  cancleSourceAddition(event?) {
    if (this.resourceIDToOpen) {
      const event: any = {}
      this.cancleEvent.emit(event);
    } else {
      this.newSourceObj = {};
      this.selectedSourceType = null;
      this.removeFile();
    }
    this.closeAddManualFAQModal();
    this.closeAddSourceModal();
    this.closeLinkBotsModal();
    this.closeStructuredDataModal(event);
  }
  selectSource(selectedCrawlMethod) {
    if (selectedCrawlMethod && selectedCrawlMethod.id === 'manual') {
      this.selectedSourceType = selectedCrawlMethod;
      this.openAddManualFAQModal();
    }
    else if (selectedCrawlMethod && selectedCrawlMethod.id === 'botActions') {
      this.selectedSourceType = selectedCrawlMethod;
      this.openLinkBotsModal();
    }
    else if (selectedCrawlMethod && (selectedCrawlMethod.resourceType === 'structuredData' || selectedCrawlMethod.resourceType === 'structuredDataManual')) {
      this.selectedSourceType = selectedCrawlMethod;
      this.openAddStructuredData();
      if (!this.inlineManual.checkVisibility('IMPORT_STRUCTURED_DATA')) {
        this.inlineManual.openHelp('IMPORT_STRUCTURED_DATA')
        this.inlineManual.visited('IMPORT_STRUCTURED_DATA')
      }
    }
    else if(selectedCrawlMethod && selectedCrawlMethod.resourceType === 'connectors'){
      this.router.navigate(['/connectors'], { skipLocationChange: true });
    }
    else {
      this.selectedSourceType = selectedCrawlMethod;
      this.openAddSourceModal();
    }

    if (selectedCrawlMethod && selectedCrawlMethod.id === 'contentWeb') {
      if (!this.inlineManual.checkVisibility('CONTENT_SUB_TOPIC')) {
        this.inlineManual.openHelp('CONTENT_SUB_TOPIC')
        this.inlineManual.visited('CONTENT_SUB_TOPIC')
      }
    } else if (selectedCrawlMethod && selectedCrawlMethod.id === 'contentDoc') {
      if (!this.inlineManual.checkVisibility('UPLOAD_FILE_SUB_TOPIC')) {
        this.inlineManual.openHelp('UPLOAD_FILE_SUB_TOPIC')
        this.inlineManual.visited('UPLOAD_FILE_SUB_TOPIC')
      }
    } else if (selectedCrawlMethod && selectedCrawlMethod.id === 'faqWeb') {
      if (!this.inlineManual.checkVisibility('EXTRACT_FAQ_SUB_TOPIC')) {
        this.inlineManual.openHelp('EXTRACT_FAQ_SUB_TOPIC')
        this.inlineManual.visited('EXTRACT_FAQ_SUB_TOPIC')
      }
    } else if (selectedCrawlMethod && selectedCrawlMethod.id === 'faqDoc') {
      if (!this.inlineManual.checkVisibility('IMPORT_FAQ_SUB_TOPIC')) {
        this.inlineManual.openHelp('IMPORT_FAQ_SUB_TOPIC')
        this.inlineManual.visited('IMPORT_FAQ_SUB_TOPIC')
      }
    } else if (selectedCrawlMethod && selectedCrawlMethod.id === 'manual') {
      if (!this.inlineManual.checkVisibility('ADD_FAQ_MAUALY_SUB_TOPIC')) {
        this.inlineManual.openHelp('ADD_FAQ_MAUALY_SUB_TOPIC')
        this.inlineManual.visited('ADD_FAQ_MAUALY_SUB_TOPIC')
      }
    } else if (selectedCrawlMethod && selectedCrawlMethod.id === 'contentStucturedDataImport') {
      if (!this.inlineManual.checkVisibility('IMPORT_STRUCTURED_DATA')) {
        this.inlineManual.openHelp('IMPORT_STRUCTURED_DATA')
        this.inlineManual.visited('IMPORT_STRUCTURED_DATA')
      }
    } else if (selectedCrawlMethod && selectedCrawlMethod.id === 'contentStucturedDataAdd') {
      if (!this.inlineManual.checkVisibility('ADD_STRUCTURED_DATA_MANUALY')) {
        this.inlineManual.openHelp('ADD_STRUCTURED_DATA_MANUALY')
        this.inlineManual.visited('ADD_STRUCTURED_DATA_MANUALY')
      }
    }
    setTimeout(() => {
      $('#addSourceTitleInput').focus();
    }, 100);
    // }
  }
  openImageLink(url) {
    window.open(url, '_blank');
  }
  //To check validations wrt faq && content for file upload
  showProgValidation(element, event, index) {
    let showProg: boolean = false;
    this.extension = '.' + element.file_ext
    if (this.selectedSourceType.sourceType === "content") {
      if (['.pdf', '.doc', '.ppt', '.xlsx', '.txt', '.docx'].includes(this.extension)) {
        if (this.multipleFileArr.length >= 1) {
          if (index == this.multipleFileArr.length - 1)
            showProg = true;
        }
      }

      else {
        $('#sourceFileUploader').val(null);
        this.notificationService.notify('Please select a valid file', 'error');
        showProg = false;
      }
    }

    else if (this.selectedSourceType.sourceType != "faq" && this.selectedSourceType.sourceType != "content") {

      if (['.pdf', '.doc', '.ppt', '.xlsx', '.txt', '.docx'].includes(this.extension)) {
        showProg = true;
      }
      else {
        $('#sourceFileUploader').val(null);
        this.notificationService.notify('Please select a valid file', 'error');
        // this.multipleFileArr
        // return;
      }
    }
    else {

      if (this.selectedSourceType.sourceType == "faq") {
        if (this.selectedSourceType.resourceType == '') {
          if (this.extension === '.pdf') {
            showProg = true;
          }
          else {
            this.notificationService.notify('Please select a valid pdf file', 'error');
          }
        }
        else {
          if (this.extension === '.csv' || this.extension === '.json') {
            showProg = true;
          }
          else {
            this.notificationService.notify('Please select a valid csv or json file', 'error');
          }
        }
      }
      else {
        showProg = true;
      }

    }
    if (showProg) {
      this.onFileSelect(event.target, this.multipleFileArr);
      this.fileObj.fileName = element.fileName; // for  single file 
    }
  }

  //Triggers while selecting multiple files
  multipleFileChangeListner(event) {
    let fileArr = [];
    if (event && event.target && event.target.files && event.target.files.length <= 10) {
      for (let i = 0; i <= event.target.files.length; i++) {
        if (event && event.target && event.target.files && event.target.files.length && event.target.files[i] && event.target.files[i].name) {
          const _ext = event.target.files[i].name.substring(event.target.files[i].name.lastIndexOf('.'));
          // this.extension = _ext
          let fileObj = {
            fileUploadInProgress: true,
            fileName: event.target.files[i].name,
            file_ext: _ext.replace(".", "") // Check this.
          };

          fileArr.push(fileObj);


        }


      }

    }
    else {
      this.notificationService.notify('More than 10 files can not be uploaded at once.', 'error')
    }
    this.multipleFileArr = [...fileArr];
    fileArr.forEach((element, index) => {
      this.showProgValidation(element, event, index)

    });
  }

  //Triggers on select of a file 
  fileChangeListener(event) {
    this.newSourceObj.url = '';
    let fileName = '';
    // console.log(this.filesListData, this.multipleData)
    if (event && event.target && event.target.files && event.target.files.length && event.target.files[0].size > 15728640) {
      this.filesListData = [];
      this.notificationService.notify('Individual file size cannot be more than 15 MB', 'error')
      $('#sourceFileUploader').val(' ');
    }
    else if (event && event.target && event.target.files && event.target.files.length && event.target.files[0].size <= 15728640) {
      // fileName = event.target.files[0].name;
      this.multipleFileChangeListner(event)
    }
    else
      if (event && event.target && event.target.files && event.target.files.length <= 10 && event.target.files.length > 1) {
        this.multipleFileChangeListner(event)
      } else if (event && event.target && event.target.files && event.target.files.length > 10) {
        this.notificationService.notify("More than 10 files cannot be uploaded at one", 'error');
      } else {
        return;
      }
    // OLD CODE //
    // let showProg: boolean = false;
    // const _ext = fileName.substring(fileName.lastIndexOf('.'));
    // this.extension = _ext
    // if (this.selectedSourceType.sourceType != "faq") {
    //   if (['.pdf', '.doc', '.ppt', '.xlsx', '.txt', '.docx'].includes(this.extension)) {
    //     showProg = true;
    //   }
    //   else {
    //     $('#sourceFileUploader').val(null);
    //     this.notificationService.notify('Please select a valid file', 'error');
    //     // return;
    //   }
    // }
    // else {

    //   if (this.selectedSourceType.sourceType == "faq") {
    //     if (this.selectedSourceType.resourceType == '') {
    //       if (this.extension === '.pdf') {
    //         showProg = true;
    //       }
    //       else {
    //         this.notificationService.notify('Please select a valid pdf file', 'error');
    //       }
    //     }
    //     else {
    //       if (this.extension === '.csv' || this.extension === '.json') {
    //         showProg = true;
    //       }
    //       else {
    //         this.notificationService.notify('Please select a valid csv or json file', 'error');
    //       }
    //     }
    //   }
    //   else {
    //     showProg = true;
    //   }

    // }
    // if (showProg) {
    //   this.onFileSelect(event.target, this.extension);
    //   this.fileObj.fileUploadInProgress = true; // unknown binding
    //   this.fileObj.fileName = fileName; // for  single file 
    //   this.fileObj.file_ext = this.extension.replace(".", "");
    // }
  }

  onFileSelect(input: HTMLInputElement, ext) {
    this.files = input.files;
    const content = this.csvContent;
    let resourceType = this.selectedSourceType.resourceType;
    let resourceType_import = resourceType;
    if (this.files && this.files.length === 1) {
      this.prepareFileUploadData(input, ext, this.files, resourceType_import);

    }
    else {
      this.multipleFileRequestBody(input, ext, this.files, resourceType_import);
    }
  }

  //payload for single file upload data
  prepareFileUploadData(input, ext, files, resourceType_import) {
    this.filesListData = Array.from(input.files);
    const fileToRead = files[0];
    const onFileLoad = (fileLoadedEvent) => {
      const data = new FormData();
      data.append('file', fileToRead);
      data.append('Content-Type', fileToRead.type);
      data.append('fileExtension', ext[0].file_ext);
      if (resourceType_import === 'importfaq' && this.selectedSourceType.id === 'faqDoc') {
        data.append('fileContext', 'bulkImport');
      }
      else {
        data.append('fileContext', 'findly');
      }
      this.filesListData.forEach(element => {
        element['showProgressBar'] = true; //To show loader while file upload inProgress in Content
      });
      this.fileObj.fileUploadInProgress = true; //To show loader while file upload inProgress in FAQ
      this.fileupload(data);
    }
    const fileReader = new FileReader();
    fileReader.onload = onFileLoad;
    fileReader.readAsText(fileToRead, 'UTF-8');

  }

  // Payload for multiple file Upload //
  multipleFileRequestBody(input, ext, files, resourceType_import) {
    this.filesListData = [];
    this.filesListData = Array.from(input.files)
    this.multipleData.type = "bulk";
    this.multipleData.files = [];
    this.filesListData.forEach(element => {
      if (element.size > 15728640) {  //Size is in bytes (1 byte = 9.5367431640625×10-7 MB => 15728640 bytes = 15MB)
        this.filesListData = [];
        // this.removeFile();
        this.notificationService.notify('Individual file size cannot be more than 15 MB', 'error')
        $('#sourceFileUploader').val(' ');

      }

      else {
        element['showProgressBar'] = true;
      }
    });
    if (this.multipleFileArr.length === this.filesListData.length) {
      this.filesListData.forEach(fileDataElement => {
        const _ext = fileDataElement.name.substring(fileDataElement.name.lastIndexOf('.'));
        this.fileRequestBody(input, _ext.replace('.', ''), files, resourceType_import, fileDataElement);

      });



    }

  }
  //Payload for single file upload to loop while uploading multiple files//
  fileRequestBody(input, ext, files, resourceType_import, fileDataElement) {
    const fileToRead = fileDataElement;
    const data = new FormData();
    data.append('file', fileToRead);
    data.append('Content-Type', fileToRead.type);
    data.append('fileExtension', ext);
    data.append('fileContext', 'findly');
    const fileReader = new FileReader();
    fileReader.readAsText(fileToRead, 'UTF-8');
    this.getFileId(data, fileDataElement);
  }

  //To get FileId for multiple file upload
  getFileId(payload, fileDataElement) {
    const quaryparms: any = {
      userId: this.userInfo.id
    };
    this.service.invoke('post.fileupload', quaryparms, payload).subscribe(
      res => {
        this.fileObj.fileId = res.fileId;
        let obj = {
          name: fileDataElement.name.replace(fileDataElement.name.substring(fileDataElement.name.lastIndexOf('.')), ''),
          fileId: this.fileObj.fileId
        }
        this.multipleData.files.push(obj);

        //Independant file loader
        this.filesListData.forEach(element => {
          let elementName = element.name.replace(element.name.substring(element.name.lastIndexOf('.')), '')
          if (elementName === obj.name) {
            element['showProgressBar'] = false;
          }

        });

        // To show the notification after all the files are uploaded
        if (this.multipleData.files.length === this.multipleFileArr.length) {
          let statusMessage = this.multipleFileArr.length + ' files uploaded successfully'
          this.notificationService.notify(statusMessage, 'success');
        }
      },
      errRes => {
        this.fileObj.fileUploadInProgress = false;
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to upload file ', 'error');
        }
      }
    );
  }


  fileupload(payload) {
    const quaryparms: any = {
      userId: this.userInfo.id
    };
    this.service.invoke('post.fileupload', quaryparms, payload).subscribe(
      res => {
        this.fileObj.fileAdded = true;
        this.fileObj.fileId = res.fileId;
        this.fileObj.fileUploadInProgress = false;
        this.notificationService.notify('File uploaded successfully', 'success');
        this.filesListData.forEach(element => {
          element['showProgressBar'] = false;
        });
        this.selectedSourceType.resourceAdded = true;
        //  this.selectedSourceType.resourceType = 'webdomain';
        $(".drag-drop-sec").css("border-color", "#BDC1C6");
      },
      errRes => {
        this.fileObj.fileUploadInProgress = false;
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to upload file ', 'error');
        }
      }
    );
  }

  //API for multiple file upload
  multiplefileupload(payload) {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      type: 'file'
    };
    this.service.invoke('post.multiplefileupload', quaryparms, payload).subscribe(
      res => {
        this.notificationService.notify('Files uploaded successfully', 'success');
        // this.addSourceModalPopRef.close();
        this.cancleSourceAddition();
      },
      errRes => {
        this.fileObj.fileUploadInProgress = false;
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          if (errRes && errRes.error && errRes.error.errors[0].code == 'FeatureAccessDenied' || errRes.error.errors[0].code == 'FeatureAccessLimitExceeded') {
            this.upgrade();
            this.errorToaster(errRes, errRes.error.errors[0].msg);
            setTimeout(() => {
              this.btnDisabled = false;
            }, 500)
          }
          else if (errRes && errRes.error && errRes.error.errors[0].code == '400') {
            this.notificationService.notify(errRes.error.errors[0].msg, 'error');
          }

        } else {
          this.notificationService.notify('Failed to upload file ', 'error');
        }
      }
    );
  }
  urlChange(event) {
    if ($('#sourceFileUploader').val() || this.fileObj.fileId) {
      this.removeFile();
    }
    if (this.newSourceObj.url) {
      this.selectedSourceType.resourceAdded = true;
      // if(this.selectedSourceType.sourceType === 'faq')
      //    this.selectedSourceType.resourceType = 'webdomain';
    } else {
      this.selectedSourceType.resourceAdded = false;
    }
  }
  resetfileSource() {
    this.fileObj = {
      fileAdded: false,
      fileId: null,
      fileUploadInProgress: false,
      fileUploadError: false,
    }
  }
  removeMultipleFile(index) {
    let name;
    //To remove multiple files (In content)
    if (this.multipleFileArr.length) {
      if (index >= 0) {
        this.removedArr.push(this.filesListData[index])
        this.filesListData.splice(index, 1)
        // this.multipleFilePayloadForRemovalOfFile(this.filesListData);
        this.removedArr.forEach(removedElement => {
          name = removedElement.name
        })
        this.notificationService.notify(name + ' is removed.', 'success')

      }
    }
    if (this.multipleFileArr.length === this.removedArr.length) {
      this.removeFile()
      this.removedArr = []; //The array should be cleared as it is restoring the previously removed items aswell
    }
  }
  //To remove single file
  removeFile() {
    $('#sourceFileUploader').val('');
    this.resetfileSource()

    // $('#sourceFileUploader').replaceWith($('#sourceFileUploader').val('').clone(true));
    // this.resetfileSource()
    // this.service.invoke('post.fileupload').subscribe().unsubscribe();
    if (!this.newSourceObj.url && this.selectedSourceType && this.selectedSourceType.resourceAdded) {
      this.selectedSourceType.resourceAdded = false;
    }
  }
  /** file upload  */
  gotoFileUpload() {
    const x = document.createElement('INPUT');
    x.setAttribute('type', 'file');
    x.click();
  }
  /** proceed Source API  */
  faqAnotate(payload, endPoint, quaryparms) {
    if (payload.hasOwnProperty('url')) delete payload.url;
    this.service.invoke(endPoint, quaryparms, payload).subscribe(res => {
      this.annotationModal(res._id);
      // console.log(res);
      this.workflowService.selectedJobId(res._id);
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Duplicate name, try again!', 'error');
      }
    });
  }
  //change extract type
  selectExtract(type) {
    this.selectExtractType = type;
    if (type == 'file') {
      $("#extractUrl").css("border-color", "#BDC1C6");
      $("#infoWarning1").hide();
      if (this.selectedSourceType.name === 'Upload File') {
        this.showSourceTitle = false;
        this.showDesc = false;
      }
      else {
        this.showSourceTitle = true;

      }
    }
    else if (type == 'url') {
      $(".drag-drop-sec").css("border-color", "#BDC1C6");
      this.showSourceTitle = true;
      if (this.selectedSourceType.name === 'Upload File') {
        this.showDesc = true;
      }
    }
  }
  //Form validation
  validateSource() {
    this.btnDisabled = true;
    if (this.selectedSourceType.resourceType == "web" || this.selectedSourceType.resourceType == "faq") {
      if (this.newSourceObj.name) {
        if (this.newSourceObj.url) {
          this.proceedSource()
        }
        else {
          this.btnDisabled = false;
          $("#extractUrl").css("border-color", "#DD3646");
          $("#infoWarning1").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
          this.notificationService.notify('Enter the required fields to proceed', 'error');
        }
      }
      else {
        this.btnDisabled = false;
        $("#addSourceTitleInput").css("border-color", "#DD3646");
        $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
        this.notificationService.notify('Enter the required fields to proceed', 'error');
      }
    }
    // NEW CODE containing multiple file upload in Content and single file upload in FAQ
    else {
      if (this.selectedSourceType.resourceType == "file") {
        if (this.selectExtractType == 'file') {
          if (this.multipleFileArr.length === 1) {
            if (this.fileObj.fileId) {
              this.proceedSource()
            }
          }
          //For deleting unacceptable files while uploading
          else if (this.multipleFileArr.length > 1) {
            if (this.multipleData.files.length != this.filesListData.length) {
              let parentArr = [...this.removedArr];
              let childArr = [...this.multipleData.files];
              parentArr.forEach(parentArrElement => {
                childArr.forEach((childElement, index) => {
                  if (parentArrElement.name.replace(parentArrElement.name.substring(parentArrElement.name.lastIndexOf('.')), '') === childElement.name) {
                    childArr.splice(index, 1)
                  }

                })


              })
              this.multipleData.files = [...childArr]
              // console.log(this.multipleData.files)
            }
            else {
              this.btnDisabled = false;
            }
            if (this.filesListData.length > 1) {
              this.multiplefileupload(this.multipleData)
            }
            else {
              this.proceedSource()
            }

          }
        }
        else if (this.selectExtractType == "url") {
          if (this.newSourceObj.url && this.newSourceObj.name) {
            this.proceedSource()
          }
          else {
            this.btnDisabled = false;
            $("#extractUrl").css("border-color", "#DD3646");
            $("#infoWarning1").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            this.notificationService.notify('Enter the required fields to proceed', 'error');
          }

        }
      }
      else if (this.selectedSourceType.resourceType == "importfaq" || this.selectedSourceType.resourceType == "") {
        if (this.newSourceObj.name) {
          if (this.selectExtractType == 'file') {
            if (this.fileObj.fileId) {
              this.proceedSource()
            }
            else {
              this.btnDisabled = false;
              $(".drag-drop-sec").css("border-color", "#DD3646");
              this.notificationService.notify('Please upload the file to continue', 'error');
            }
          }
          else if (this.selectExtractType == 'url') {
            if (this.newSourceObj.url && this.newSourceObj.name) {
              this.proceedSource()
            }
            else {
              this.btnDisabled = false;
              $("#extractUrl").css("border-color", "#DD3646");
              $("#infoWarning1").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              this.notificationService.notify('Enter the required fields to proceed', 'error');
            }
          }
        }
        else {
          this.btnDisabled = false;
          $("#addSourceTitleInput").css("border-color", "#DD3646");
          $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
          this.notificationService.notify('Enter the required fields to proceed', 'error');
        }


      }

    }

    //OLD CODE //
    // else if (this.selectedSourceType.resourceType == "file" || this.selectedSourceType.resourceType == "importfaq" || this.selectedSourceType.resourceType == "") {
    //   // if (this.newSourceObj.name) {
    //   if (this.selectExtractType == 'file') {
    //     if (this.multipleFileArr.length === 1) {
    //       if (this.fileObj.fileId) {               //|| this.multipleFileArr.length
    //         this.proceedSource()
    //       }
    //     }
    //      //For deleting unacceptable files while uploading
    //     else if (this.multipleFileArr.length > 1) {
    //       if (this.multipleData.files.length != this.filesListData.length) {
    //         let parentArr = [...this.removedArr];
    //         let childArr = [...this.multipleData.files];
    //         parentArr.forEach(parentArrElement => {
    //           childArr.forEach((childElement, index) => {
    //             if (parentArrElement.name.replace(parentArrElement.name.substring(parentArrElement.name.lastIndexOf('.')), '') === childElement.name) {
    //               childArr.splice(index, 1)
    //             }

    //           })


    //         })
    //         this.multipleData.files = [...childArr]
    //         console.log(this.multipleData.files)
    //       }

    //       this.multiplefileupload(this.multipleData)
    //     }
    //     else {
    //       this.btnDisabled = false;
    //       $(".drag-drop-sec").css("border-color", "#DD3646");
    //       this.notificationService.notify('Please upload the file to continue', 'error');
    //     }
    //   }
    //   else if (this.selectExtractType == 'url') {
    //     if (this.newSourceObj.url && this.newSourceObj.name) {
    //       this.proceedSource()
    //     }
    //     else {
    //       this.btnDisabled = false;
    //       $("#extractUrl").css("border-color", "#DD3646");
    //       $("#infoWarning1").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
    //       this.notificationService.notify('Enter the required fields to proceed', 'error');
    //     }
    //   }
    //   // }
    //   else {
    //     this.btnDisabled = false;
    //     $("#addSourceTitleInput").css("border-color", "#DD3646");
    //     $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
    //     this.notificationService.notify('Enter the required fields to proceed', 'error');
    //   }
    // }
  }
  //track changing of input
  inputChanged(type) {
    if (type == 'title') {
      this.newSourceObj.name != '' ? $("#infoWarning").hide() : $("#infoWarning").show();
      $("#addSourceTitleInput").css("border-color", this.newSourceObj.name != '' ? "#BDC1C6" : "#DD3646");
    }
    else if (type == 'extractURL') {
      this.newSourceObj.url != '' ? $("#infoWarning1").hide() : $("#infoWarning1").show();
      $("#extractUrl").css("border-color", this.newSourceObj.url != '' ? "#BDC1C6" : "#DD3646");
    }
  }

  proceedSource() {
    if(this.selectedSourceType.resourceType === 'file'){
      this.mixpanel.postEvent('Content File extraction started', {});
    }
    else if(this.selectedSourceType.sourceType === 'faq'&&this.selectedSourceType.resourceType === ''){
       this.mixpanel.postEvent('FAQ Web extract added', {});      
    }
    else if(this.selectedSourceType.resourceType === 'importfaq'&&this.selectedSourceType.sourceType === "faq"){
      console.log("mix event:FAQ File extraction started")
       //this.mixpanel.postEvent('FAQ File extraction started', {});      
    }
    let payload: any = {};
    let schdVal = true;
    const crawler = this.crwalObject;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: this.selectedSourceType.sourceType,
    };
    payload = this.newSourceObj;
    let endPoint = 'add.sourceMaterialFaq';
    let resourceType = this.selectedSourceType.resourceType;
    let resourceType_import = resourceType;

    this.dockService.trigger(true)
    if (resourceType_import === 'importfaq' && this.selectedSourceType.id === 'faqDoc' && !this.selectedSourceType.annotate) {
      payload.extractionType = "basic";
      this.importFaq();
      schdVal = false;
    }
    if (this.selectedSourceType.annotate && resourceType_import === 'importfaq' && this.selectedSourceType.id === 'faqDoc') {
      quaryparms.faqType = 'file';
      payload.isNew = true;
      payload.fileId = this.fileObj.fileId;
      payload.extractionType = "annotation"
      this.faqAnotate(payload, endPoint, quaryparms);
      schdVal = true;
      return
    }
    if (this.selectedSourceType.annotate && this.selectedSourceType.sourceType === 'faq' && resourceType != 'importfaq' && this.selectedSourceType.id != 'faqDoc') {
      quaryparms.faqType = 'file';
      payload.isNew = true;
      payload.fileId = this.fileObj.fileId;
      if (this.selectedSourceType.annotate) {
        payload.extractionType = "annotation"
      }
      this.faqAnotate(payload, endPoint, quaryparms);
      schdVal = true;
      return
    } else {
      if (this.selectedSourceType.sourceType === 'content') {
        endPoint = this.url_failed ? 'update.contentPageSource' : 'add.sourceMaterial';
        payload.resourceType = resourceType;
        if (this.url_failed) {
          quaryparms.sourceId = this.extract_sourceId;
        }
      } else {
        if (this.fileObj.fileAdded) {
          resourceType = 'file';
        } else if (this.newSourceObj.url) {
          resourceType = 'web';
        }
        quaryparms.faqType = resourceType;
      }
      if (resourceType === 'web') {
        crawler.name = this.newSourceObj.name;
        crawler.url = this.newSourceObj.url;
        crawler.desc = this.newSourceObj.desc || '';
        crawler.advanceOpts.useCookies = this.useCookies;
        crawler.advanceOpts.respectRobotTxtDirectives = this.respectRobotTxtDirectives;
        crawler.advanceOpts.crawlBeyondSitemaps = this.crawlBeyondSitemaps;
        crawler.advanceOpts.isJavaScriptRendered = this.isJavaScriptRendered;
        crawler.advanceOpts.blockHttpsMsgs = this.blockHttpsMsgs;
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
        if (this.allowUrl.url) {
          this.allowUrls(this.allowUrl);
        }
        if (this.blockUrl.url) {
          this.blockUrls(this.blockUrl);
        }
        // crawler.advanceOpts.crawlDepth = Number(this.crawlDepth);
        // crawler.advanceOpts.maxUrlLimit = Number(this.maxUrlLimit);
        // crawler.resourceType = this.selectedSourceType.resourceType;
        crawler.advanceOpts.allowedURLs.length > 0 ? crawler.advanceOpts.allowedOpt = true : crawler.advanceOpts.allowedOpt = false;
        crawler.advanceOpts.blockedURLs.length > 0 ? crawler.advanceOpts.blockedOpt = true : crawler.advanceOpts.blockedOpt = false;
        payload = { ...crawler };
        delete payload.resourceType;
        if (payload.advanceOpts) {
          if (!payload.advanceOpts.scheduleOpt) {
            delete payload.advanceOpts.scheduleOpts;
            if (payload.advanceOpts.repeatInterval) {
              delete payload.advanceOpts.repeatInterval;
            }
          }
        }

        quaryparms.resourceType = resourceType;

      }

      if (resourceType === 'file') {
        if (this.selectedSourceType.sourceType === 'content') {
          if (this.filesListData.length === 1) {
            if (this.fileObj.fileId) {
              payload.fileId = this.fileObj.fileId;
              payload.name = this.filesListData[0].name
              // payload.name = this.fileObj.fileName;
              if (payload.url == '') delete payload.url;
            }
          }

          else if (this.filesListData.length > 1) {
            this.multiplefileupload(this.multipleData);
          }
        }
        if (this.selectedSourceType.sourceType === 'faq') {
          payload.fileId = this.fileObj.fileId;
          payload.extractionType = "basic";
          if (payload.hasOwnProperty('url')) delete payload.url;
        }
        //payload.extractionType = resourceType;
        quaryparms.resourceType = resourceType;
        if (this.selectedSourceType.sourceType !== 'faq') {
          payload.isNew = true;
          payload.resourceType = payload.fileId ? 'file' : 'url';
        }
      }
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
      if (resourceType === 'web' && this.selectedSourceType.sourceType !== 'content') {
        delete payload.advanceOpts;
      }
      if (schdVal) {
        this.service.invoke(endPoint, quaryparms, payload).subscribe(res => {
          this.btnDisabled = false;
          this.openStatusModal();
          this.extract_sourceId = res._id;
          this.appSelectionService.updateTourConfig('addData');
          this.addSourceModalPopRef.close();
          if (this.selectedSourceType.sourceType === 'content') {
            this.statusObject = { ...this.statusObject, validation: res.validations };
            this.mixpanel.postEvent('Content Crawl web domain added', {});
          }
          if (this.selectedSourceType.sourceType === 'faq') {
            this.poling(res._id, 'scheduler');
          }
          if(this.selectedSourceType.resourceType === 'file'){
            this.mixpanel.postEvent('Content File extraction success', {});
          }
          if(this.selectedSourceType.resourceType === ''&&this.selectedSourceType.sourceType === "faq"){
            this.mixpanel.postEvent('FAQ Web extract started', {});       
          }
          if(this.selectedSourceType.resourceType === 'importfaq'&&this.selectedSourceType.sourceType === "faq"){
            console.log("mix event:FAQ File extraction started")
             //this.mixpanel.postEvent('FAQ File extraction started', {});      
          }
          //this.dockService.trigger(true)
        }, errRes => {
          if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
            if (errRes && errRes.error && errRes.error.errors[0].code == 'FeatureAccessDenied' || errRes.error.errors[0].code == 'FeatureAccessLimitExceeded') {
              this.upgrade();
              this.errorToaster(errRes, errRes.error.errors[0].msg);
              setTimeout(() => {
                this.btnDisabled = false;
              }, 500)
            } else {
              if (this.selectedSourceType.sourceType === 'content') {
                this.mixpanel.postEvent('Content Crawl web domain failed', {});
              }
              this.btnDisabled = false;
              this.notificationService.notify(errRes.error.errors[0].msg, 'error');
            }
          } else {
            this.btnDisabled = false;
            this.notificationService.notify('Failed to add sources ', 'error');
          }
        });
      } else if (resourceType == 'web') {
        this.btnDisabled = false;
        this.notificationService.notify('Please fill Date and Time fields', 'error');
      }
      // this.callWebCraller(this.crwalObject,searchIndex)
    }
  }
  //upgrade plan
  upgrade() {
    this.plans.openChoosePlanPopup('choosePlans');
  }
  callWebCraller(crawler, searchIndex) {
    let payload = {}
    const resourceType = this.selectedSourceType.resourceType;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: this.selectedSourceType.sourceType,
    };
    crawler.name = this.newSourceObj.name;
    crawler.url = this.newSourceObj.url;
    crawler.desc = this.newSourceObj.desc || '';
    crawler.resourceType = resourceType;
    payload = crawler;
    // console.log(payload);

    this.service.invoke('create.crawler', quaryparms, payload).subscribe(res => {
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to crawl ', 'error');
      }
    });
  }
  faqCancle(event) {
    this.selectedSourceType = null
    if (this.resourceIDToOpen) {
      const eve: any = {}
      this.cancleEvent.emit(eve);
    }
    this.closeAddManualFAQModal();
  }
  faqUpdateEvent() {
    this.faqUpdate.next();
  }
  addManualFaq(event) {
    // console.log(event);
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      type: 'faq',
      faqType: 'manual'
    };
    let payload: any = {
      // desc: event.response,
      // name: event.question,
      question: event._source.question,
      // answer: event.response,
      defaultAnswers: event._source.defaultAnswers || [],
      conditionalAnswers: event._source.conditionalAnswers || [],
      keywords: event._source.tags,
      alternateQuestions: event._source.alternateQuestions || []
    };
    event.quesList.alternateQuestions = event._source.alternateQuestions || []
    payload = _.extend(payload, event.quesList);

    this.service.invoke('add.sourceMaterialManualFaq', quaryparms, payload).subscribe(res => {
      this.selectedSourceType = null;
      this.closeAddManualFAQModal();
      this.appSelectionService.updateTourConfig('addData');
      this.mixpanel.postEvent('Manual FAQ added', {});
      event.cb('success');
      if (this.resourceIDToOpen) {
        const eve: any = {}
        this.saveEvent.emit(eve);
      }
      this.router.navigate(['/faqs'], { skipLocationChange: true });
    }, errRes => {
      event.cb('error');
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        if (errRes.error.errors[0].code == 'FeatureAccessLimitExceeded') {
          this.upgrade();
        }
      } else {
        this.notificationService.notify('Failed to add sources ', 'error');
      }
    });
  }
  redirectTo() {
    if (this.selectedSourceType.sourceType === 'faq') {
      this.router.navigate(['/faqs'], { skipLocationChange: true })
    } else {
      this.router.navigate(['/content'], { skipLocationChange: true });
    }
  }
  /** proceed Source API */
  scheduleData(scheduleData) {
    // console.log(scheduleData);
    // if(scheduleData.date){
    //   let date = scheduleData.date;
    //   if(String(date).split(" ")) scheduleData.date =  String(date).split(" ")[1] + " " + String(date).split(" ")[2]  + " " + String(date).split(" ")[3];
    // }
    // if(scheduleData.interval.intervalType && scheduleData.interval.intervalType != "Custom"){
    //   scheduleData.interval.intervalValue = {};
    // }
    // if(scheduleData.interval && 
    //   scheduleData.interval.intervalValue &&
    //   scheduleData.interval.intervalValue.endsOn &&
    //   scheduleData.interval.intervalValue.endsOn.endDate){
    //   let endate = scheduleData.interval.intervalValue.endsOn.endDate;
    //   if(String(endate).split(" ")) scheduleData.interval.intervalValue.endsOn.endDate =  String(endate).split(" ")[1]  + " " +  String(endate).split(" ")[2] + " " +  String(endate).split(" ")[3];
    // }
    if (scheduleData.interval.intervalType && scheduleData.interval.intervalType != "Custom") {
      scheduleData.interval.intervalValue = {};
    }
    this.crwalObject.advanceOpts.scheduleOpts = scheduleData;

    // this.dataFromScheduler = scheduleData
  }
  cronExpress(cronExpress) {
    // console.log(cronExpress);
    this.crwalObject.advanceOpts.repeatInterval = cronExpress;
  }
  /*Crwaler */
  allowUrls(data) {
    this.crwalObject.advanceOpts.allowedURLs.push(data);
    this.allowUrl = new AllowUrl();

  }
  blockUrls(data) {
    this.crwalObject.advanceOpts.blockedURLs.push(data);
    this.blockUrl = new BlockUrl
  }
  /*Crwaler */

  exceptUrl(bool) {
    this.crwalObject.advanceOpts.allowedOpt = !bool;
    this.crwalObject.advanceOpts.blockedOpt = !this.crwalObject.advanceOpts.allowedOpt;
  }
  restrictUrl(bool) {
    this.crwalObject.advanceOpts.blockedOpt = !bool;
    this.crwalObject.advanceOpts.allowedOpt = !this.crwalObject.advanceOpts.blockedOpt;
  }
  updateUrlRecord(index, type) {
    type === 'allow' ? this.crwalObject.advanceOpts.allowedURLs.splice(index, 1) : this.crwalObject.advanceOpts.blockedURLs.splice(index, 1)
  }
  urlCondition(condition, type) {
    type === 'allow' ? this.allowUrl.condition = condition : this.blockUrl.condition = condition;
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
  /* Annotation Modal */
  annotationModal(sourceId) {
    if (this.newSourceObj && this.newSourceObj.name && this.fileObj.fileId) {
      const payload = {
        sourceTitle: this.newSourceObj.name,
        sourceDesc: this.newSourceObj.desc,
        fileId: this.fileObj.fileId,
        sourceId: sourceId
      };
      const dialogRef = this.dialog.open(PdfAnnotationComponent, {
        data: { pdfResponse: payload, annotation: this.anntationObj },
        panelClass: 'kr-annotation-modal',
        disableClose: true,
        autoFocus: true
      });
      dialogRef.afterClosed().subscribe(res => {
        // console.log(res);
        if (res === 'cancelFaqExtract') {
          const event: any = {}
          this.closeSourcePopupEvent.emit(event);
          this.cancleEvent.emit(event);
          this.closeAddSourceModal();
        }
        // console.log(this.anntationObj);
        // if (this.anntationObj && this.anntationObj.status === 'Inprogress') {
        //   this.openStatusModal();
        //   this.poling(this.anntationObj._id);
        // }
      });
    }
  }
  annotateChange(event) {
    if (event.currentTarget.checked) {
      this.selectedSourceType.annotate = true;
    } else {
      this.selectedSourceType.annotate = false;
    }
  }
  // Check poling from annoation tool
  checkAnnotationPolling() {
    this.rangyService.getPolling().pipe(take(1)).subscribe(res => {
      if (res) {
        // console.log(this.anntationObj);
        if (this.anntationObj._id) {
          this.openStatusModal();
          this.poling(this.anntationObj._id);
        }
      }


    });
  }
  cancelExtraction() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    this.closeStatusModal()
  }
  /* Annotation Modal end */
  getAssociatedBots() {
    if (this.userInfo.id) {
      const queryParams: any = {
        userID: this.userInfo.id
      };
      this.service.invoke('get.AssociatedBots', queryParams).subscribe(res => {
        // console.log('Associated Bots', res);
        let bots = JSON.parse(JSON.stringify(res));
        //this.associatedBots = JSON.parse(JSON.stringify(res));
        this.associatedBots = [];
        bots.forEach(element => {
          if (element.type == 'default' || element.type == 'universalbot') {
            this.associatedBots.push(element)
          }

        });
        //this.associatedBots = [...bots]
        // console.log(this.associatedBots);
        // console.log(bots);
        this.associatedBots.forEach(element => {
          if (this.streamID == element._id) {
            this.linkedBotName = element.name;
            this.linkedBotID = element._id;
            this.botToBeUnlinked = element._id;
            this.islinked = true;
            if (this.workflowService.selectedApp()?.configuredBots[0]) {
              this.streamID = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
            }
            this.linkedBotData = {
              botName: element.name,
              botId: element._id,
              botType: element.type,
              botDescription: element.description,
              channels: this.workflowService.selectedApp()?.configuredBots[0]?.channels,
              approvedChannels: element.approvedChannels
            }
          }
        })
        /*this.associatedBotArr = [];
        if (this.associatedBots.length > 0) {
          this.associatedBots.forEach(element => {
            if (this.streamId == element._id) {
              this.linkedBotName = element.name;
            }
            let botObject = {};
            botObject['_id'] = element._id;
            botObject['botName'] = element.botName;
            this.associatedBotArr.push(botObject);
          });
          console.log(this.associatedBotArr);
          this.noAssociatedBots = false;
        }
        else {*/
        this.noAssociatedBots = false;
        if (this.associatedBots.errors?.length) {
          this.notificationService.notify('Invalid request', 'error')
        }
        //}
      },
        (err) => { console.log(err); this.notificationService.notify('Error in loading associated bots', 'error') },

        () => { console.log('Call Complete') }
      )
    }
    else {
      // console.log('Invalid UserID')
    }
  }

  linkBot(botID: any) {
    event.stopPropagation();

    const requestBody: any = {};
    let selectedApp: any;

    // console.log(botID);

    if (this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };
      requestBody.linkBotId = botID;
      // console.log(requestBody);
      this.service.invoke('put.LinkBot', queryParams, requestBody).subscribe(res => {
        // console.log(res);
        selectedApp = this.workflowService.selectedApp();
        // console.log(selectedApp);
        selectedApp.configuredBots[0] = {}
        selectedApp.configuredBots[0]._id = res.configuredBots[0]._id;
        this.workflowService.selectedApp(selectedApp);
        // console.log(res.status);
        this.streamID = selectedApp.configuredBots[0]._id;
        this.getAssociatedBots();
        this.notificationService.notify('Bot linked, successfully', 'success');
      },
        (err) => {
          // console.log(err);
          this.notificationService.notify('Bot linking, unsuccessful', 'error');
        }
      )
    }
    else {
      this.notificationService.notify('Error', 'error');
    }
  }

  unlinkBot(botID: any) {
    event.stopPropagation();

    const requestBody: any = {};
    let selectedApp: any;

    // console.log(botID);

    if (this.searchIndexId) {
      const queryParams = {
        searchIndexID: this.searchIndexId
      }
      requestBody.linkedBotId = botID;
      // console.log(requestBody);

      this.service.invoke('put.UnlinkBot', queryParams, requestBody).subscribe(res => {
        // console.log(res);

        selectedApp = this.workflowService.selectedApp();
        // selectedApp.configuredBots[0]._id = null;
        if (this.workflowService.selectedApp()?.configuredBots[0] && this.workflowService.selectedApp()?.configuredBots[0]?._id) {
          this.workflowService.selectedApp().configuredBots[0]._id = null;
        }
        else if (this.workflowService.selectedApp()?.publishedBots && this.workflowService.selectedApp()?.publishedBots[0] && this.workflowService.selectedApp()?.publishedBots[0]?._id) {
          this.workflowService.selectedApp().publishedBots[0]._id = null;
        }

        this.workflowService.selectedApp(selectedApp);
        this.streamID = null;
        this.linkedBotID = null;
        this.linkedBotName = null;
        this.linkedBotDescription = null;
        this.botToBeUnlinked = null;
        this.islinked = false;
        this.getAssociatedBots();
        this.notificationService.notify('Bot unlinked, successfully', 'success');
      },
        (err) => {
          // console.log(err);
          this.notificationService.notify('Bot unlinking, error', 'error');
        }
      )
    }
    else {
      this.notificationService.notify('Error', 'error');
    }

  }
  crawlOption(opt, label) {
    this.crwalOptionLabel = label;
    if (opt != 'any') {
      this.crwalObject.advanceOpts.crawlEverything = false;
      if (opt == 'allow') {
        this.crwalObject.advanceOpts.allowedOpt = true;
        this.crwalObject.advanceOpts.blockedOpt = false;
      } else if (opt == 'block') {
        this.crwalObject.advanceOpts.blockedOpt = true;
        this.crwalObject.advanceOpts.allowedOpt = false;
      }
    } else {
      this.crwalObject.advanceOpts.crawlEverything = true;
    }
  }

  // Code for Structured Data Starts

  openAddStructuredData() {
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  closeStructuredDataModal(event?) {
    if (this.addStructuredDataModalPopRef && this.addStructuredDataModalPopRef.close) {
      this.addStructuredDataModalPopRef.close();
      if (event && event.showStatusModal) {
        this.structuredDataDocPayload = event.payload;
        this.openStructuredDataStatusModal();
      }
    }
  }

  openStructuredDataStatusModal() {
    this.structuredDataStatusModalRef = this.structuredDataStatusModalPop.open();
  }

  closeStructuredDataStatusModal() {
    if (this.structuredDataStatusModalRef) {
      this.router.navigate(['/structuredData'], { skipLocationChange: true });
      this.structuredDataStatusModalRef.close();
    }
  }

  // Code for Structured Data Ends

  ngOnDestroy() {
    const self = this;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    this.anntationObj = null;
    this.fileObj.fileAdded = false;
  }

  downloadSampleData(key) {
    let fileName;
    let filePath;
    if (key === 'json') {
      fileName = 'sample.json';
      filePath = this.sampleJsonPath;
    }
    else {
      fileName = 'sample.csv';
      filePath = this.sampleCsvPath;
    }
    const link: any = document.createElement('a');
    link.href = filePath;
    link.download = fileName,
      link.click();
    link.remove();
  }
  importFaq() {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
    };
    const payload = {
      fileId: this.fileObj.fileId,
      fileType: this.fileObj.file_ext,
      name: this.newSourceObj.name
      // streamId: this.streamId,
    }
    this.service.invoke('import.faq', quaryparms, payload).subscribe(res => {
      if(this.selectedSourceType.resourceType === 'importfaq'&&this.selectedSourceType.sourceType === "faq"){
         this.mixpanel.postEvent('FAQ File extraction success', {});      
      }
      // console.log("imp faq res", res);
      this.importFaqInprogress = true;
      this.openStatusModal();
      this.addSourceModalPopRef.close();
      // this.closeStatusModal();
      //this.dockService.trigger(true);
      this.getDocStatus(res._id);
      this.appSelectionService.updateTourConfig('addData');
    },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }

      }).add(() => {
        if (this.statusModalPopRef && this.statusModalPopRef.close) {
          setTimeout(() => {
            this.closeStatusModal()
          }, 1000);
        }
        console.log('finally closed !!')
      })
    // this.service.invoke('get.dockStatus', quaryparms, payload).subscribe(res1 => {
    // });
  }
  getDocStatus(jobId) {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId
    }
    this.pollingSubscriber = interval(10000).pipe(startWith(0)).subscribe(() => {
      this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
        // console.log("res", res);
        const response = res;
        /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code on 1902*/
        // const jobStatus = response.dockStatuses.filter(ele => ele._id === jobId);
        const jobStatus = response.filter(ele => ele._id === jobId);
        /**made code updates in line no 1905 on 03/01 added new condition for success,since SUCCESS is upadted to success*/
        // if (jobStatus[0].status === "SUCCESS") {
        if (jobStatus[0].status === "SUCCESS" || jobStatus[0].status === "success") {
          this.pollingSubscriber.unsubscribe();
          jobStatus[0] = Object.assign({ ...jobStatus[0], status: 'success' })
          this.statusObject = jobStatus[0];
        }
      }, errRes => {
        this.pollingSubscriber.unsubscribe();
        if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to get Status of Docker.', 'error');
        }
      });
    }
    )
  }
  //popup for crawling confirmation
  // confirmCrawl() {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '650px',
  //     height: 'auto',
  //     panelClass: 'delete-popup',
  //     data: {
  //       title: 'Configuration has been successfully saved',
  //       body: 'Do you wish to initiate crawling now?',
  //       buttons: [{ key: 'yes', label: 'Crawl', type: 'danger' }, { key: 'no', label: 'Cancel' }],
  //       confirmationPopUp: true
  //     }
  //   });
  //   dialogRef.componentInstance.onSelect
  //     .subscribe(result => {
  //       if (result === 'yes') {
  //         dialogRef.close();
  //         //this.openStatusModal();
  //         this.jobOndemand();
  //         this.poling(this.crwal_jobId, 'scheduler')
  //       } else if (result === 'no') {
  //         dialogRef.close();
  //         this.closeStatusModal();
  //       }
  //     })
  //   if (this.statusObject.validation) {
  //     if (this.statusObject.validation.validated) {
  //       this.notificationService.notify('Url validated ', 'success'); // Remove once validation is used
  //     } else {
  //       this.notificationService.notify('Url validated ', 'error'); // Remove once validation is used
  //     }

  //   }
  // }
  //crawl job ondemand
  jobOndemand() {
    this.statusModalPopRef.close();
    this.openCrawlModalPop();
    this.poling(this.extract_sourceId, 'scheduler');
    const queryParams: any = {
      searchIndexID: this.searchIndexId,
      sourceId: this.extract_sourceId
    };
    this.service.invoke('get.crawljobOndemand', queryParams).subscribe(res => {
      this.mixpanel.postEvent('Content Crawl web domain started', {});
      this.crwal_jobId = res._id;
      //this.openStatusModal();
      //this.notificationService.notify('Bot linked, successfully', 'success');
    },
      (err) => {
        // console.log(err);
        this.notificationService.notify('Failed', 'error');
      }
    )
  }
  checkValue(value, valueFrom) {
    // console.log()
    // var valueCheck = value.includes("-");
    if (value <= -1) {
      this.crawlDepth = 0;
      this.maxUrlLimit = 0;
    }
    else if (value == null || value.includes("-")) {
      this.notificationService.notify('Range cannot be entered', 'error');
    }
    // if(value < 500 && valueFrom == 'maxUrlLimit'){
    //   this.maxUrlLimit = 500;
    // }
  }
  copy(val) {
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
    this.notificationService.notify('Copied to clipboard', 'success')

  }

  showPasword() {
    var show: any = document.getElementById("password");
    if (show.type === "password") {
      this.showPassword = true;
      show.type = "text";

    } else {
      this.showPassword = false;
      show.type = "password";
    }
  }
  closeBotsConfigurationModalElement() {
    if (this.botsConfigurationModalRef && this.botsConfigurationModalRef.close) {
      this.botsConfigurationModalRef.close();
      this.submitted = false;
    }
  }
  openBotsConfigurationModalElement(bot, isBotLinked) {
    if (isBotLinked) {
      return;
    }
    this.selectedLinkBotConfig = bot;
    const queryParams = {
      searchIndexID: this.searchIndexId
    }
    this.service.invoke('get.generateChannelCreds', queryParams).subscribe(
      res => {
        this.configurationLink = {
          postUrl: res.postUrl,
          accessToken: res.accessToken,
          webhookUrl: '',
          clientSecret: '',
          clientId: ''
        }
        this.botsConfigurationModalRef = this.botsConfigurationModalElement.open();
        setTimeout(() => {
          this.perfectScroll9.directiveRef.update();
          this.perfectScroll9.directiveRef.scrollToTop();
        }, 500)
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to geneerate channel credentials', 'error');
        }
      }
    );
    // this.botsConfigurationModalRef = this.botsConfigurationModalElement.open();

  }
  validateBotConfiguration() {
    if (!this.configurationLink.clientId || !this.configurationLink.clientSecret || !this.configurationLink.webhookUrl || !this.configurationLink.postUrl || !this.configurationLink.accessToken) {
      return false
    } else {
      return true;
    }
  }
  unlinkBotWhithPublish(linkingBotID) {
    let requestBody: any = {};
    let selectedApp: any;
    if (this.searchIndexId) {
      // this.loadingContent = true;
      const queryParams = {
        searchIndexID: this.searchIndexId
      }
      requestBody['linkedBotId'] = this.streamID//this.botToBeUnlinked;
      // console.log(requestBody);

      this.service.invoke('put.UnlinkBot', queryParams, requestBody).subscribe(res => {
        // console.log(res);
        // this.linkAfterUnlink(linkingBotID);
        selectedApp = this.workflowService.selectedApp();
        if (selectedApp.configuredBots[0]) {
          selectedApp.configuredBots[0]._id = null;
        }
        else {
          selectedApp.publishedBots[0]._id = null;
        }
        this.linkedBotID = null;
        this.linkedBotName = null;
        this.linkedBotDescription = null;
        this.botToBeUnlinked = null;
        this.islinked = false;
        this.workflowService.selectedApp(selectedApp);
        this.streamID = null;
        this.saveLink();
        //this.getAssociatedBots();
        //this.getAssociatedTasks(this.streamId);
        this.notificationService.notify("Bot Unlinked Successfully.", 'success')
        // this.notificationService.notify("Bot unlinked Successfully. Please publish to reflect", 'success');

      },
        (err) => {
          // console.log(err); this.notificationService.notify("Bot unlinking, successfully", 'error');
          // this.loadingContent = false;
          //this.getAssociatedTasks(this.streamId);
        }
      )
    }
  }
  saveLink() {
    this.submitted = true;
    if (!this.validateBotConfiguration()) {
      return;
    }
    if (this.botToBeUnlinked && this.islinked) {
      this.unlinkBotWhithPublish(this.selectedLinkBotConfig._id);
      this.workflowService.linkBot(this.selectedLinkBotConfig._id);
    } else {
      // this.loadingContent = true;
      let selectedApp: any;
      const queryParams = {
        searchIndexID: this.searchIndexId
      }
      let channelType = 'ivr';
      if (this.configurationLink.webhookUrl.split('/').indexOf('hookInstance') > -1) {
        channelType = this.configurationLink.webhookUrl.split('/')[this.configurationLink.webhookUrl.split('/').indexOf('hookInstance') + 1]
      }
      let payload = {
        "linkBotId": this.selectedLinkBotConfig._id,
        "linkBotName": this.selectedLinkBotConfig.name,
        "channels": [
          {
            "type": channelType,
            "app": {
              "clientId": this.configurationLink.clientId,
              "name": (this.selectedLinkBotConfig.channels[0].app || {}).name || (this.selectedLinkBotConfig.channels[0].app || {}).appName || '',
              "clientSecret": this.configurationLink.clientSecret
            },
            "webhookUrl": this.configurationLink.webhookUrl,
            "postUrl": this.configurationLink.postUrl,
            "accessToken": this.configurationLink.accessToken
          }
        ]

      }
      this.service.invoke('put.configLinkbot', queryParams, payload).subscribe(
        res => {
          this.allBotArray = [];
          res.configuredBots.forEach(element => {
            let obj = {
              "_id": element._id,
              "state": "new"
            }
            this.allBotArray.push(obj);
          });

          // if(this.allBotArray.length > 0){
          //   this.universalPublish();
          // }
          // Universal Bot Publish here.
          // console.log(res);
          selectedApp = this.workflowService.selectedApp();
          if (res.configuredBots[0]) {
            selectedApp.configuredBots[0] = {};
            selectedApp.configuredBots[0]._id = res.configuredBots[0]._id;
            this.linkedBotID = res.configuredBots[0]._id;
            this.linkedBotName = res.configuredBots[0].botName;
          }
          this.linkedBotDescription = res.description;
          this.closeBotsConfigurationModalElement();
          if (selectedApp.configuredBots[0]) {
            this.streamID = selectedApp.configuredBots[0]._id;
          }
          else {
            this.streamID = selectedApp.publishedBots[0]._id;
          }
          if (this.workflowService.selectedApp()) {
            this.appSelectionService.getStreamData(this.workflowService.selectedApp())
          }
          this.botToBeUnlinked = this.selectedLinkBotConfig._id;
          this.selectedLinkBotConfig = null;
          this.islinked = true;
          // this.getAssociatedTasks(this.streamID)
          this.getAssociatedBots();
          this.workflowService.linkBot(this.streamID);
          this.workflowService.smallTalkEnable(res.stEnabled);
          this.closeLinkBotsModal()
          this.notificationService.notify("Bot Linked Successfully", 'success');
          this.appSelectionService.updateTourConfig('addData');
          this.router.navigate(['/botActions'], { skipLocationChange: true });
          // this.syncLinkedBot();
          // this.loadingContent = false;
        },
        errRes => {
          // this.loadingContent = false;
          if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
            this.notificationService.notify(errRes.error.errors[0].msg, 'error');
          } else {
            this.notificationService.notify('Failed to geneerate channel credentials', 'error');
          }
        }
      );

    }

  }
}


// class CrwalObj{

//     url: String = '';
//     desc: String = '';
//     name: String = '';
//     resourceType: String = '';
//     advanceOpts: AdvanceOpts = new AdvanceOpts()


// }
// class AdvanceOpts{
//   scheduleOpts:boolean = false;
//       schedulePeriod: String ="";
//       repeatInterval: String ="";
//       crawlEverything: boolean = true;
//          allowedURLs:AllowUrl[] = [];
//          blockedURLs: BlockUrl[] = [];
// }
// class AllowUrl {
//   condition:String = 'contains';
//    url: String = '';
// }
// class BlockUrl {
//   condition:String = 'contains';
//    url: String = '';
// }