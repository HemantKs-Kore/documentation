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
import { startWith } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CrwalObj, AdvanceOpts, AllowUrl, BlockUrl, scheduleOpts } from 'src/app/helpers/models/Crwal-advance.model';

import { PdfAnnotationComponent } from '../annotool/components/pdf-annotation/pdf-annotation.component';
import { MatDialog } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { RangySelectionService } from '../annotool/services/rangy-selection.service';
import {  DockStatusService} from '../../services/dock.status.service';

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
  blockUrl: BlockUrl = new BlockUrl();
  sampleJsonPath:any='/home/assets/sample-data/sample.json';
  sampleCsvPath:any='/home/assets/sample-data/sample.csv';
  filePath;
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

  useCookies = true;
  respectRobotTxtDirectives = true;
  crawlBeyondSitemaps= false;
  isJavaScriptRendered = false;
  blockHttpsMsgs = false;
  crwalOptionLabel = "Crawl Everything";
  crawlDepth :number;
  maxUrlLimit: number;
  @Input() inputClass: string;
  @Input() resourceIDToOpen: any;
  @Output() saveEvent = new EventEmitter();
  @Output() cancleEvent = new EventEmitter();
  faqUpdate: Subject<void> = new Subject<void>();
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
  crwal_jobId : any;
  userInfo: any = {};
  csvContent: any = '';
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
          resourceType: 'webdomain'
        },
        {
          name: 'Upload File',
          description: 'Index file content',
          icon: 'assets/icons/content/fileupload.svg',
          id: 'contentDoc',
          sourceType: 'content',
          resourceType: 'document'
        },
        {
          name: 'Others',
          description: 'Extract content from other',
          icon: 'assets/icons/content/othersuccess.svg',
          id: 'contentothers',
          sourceType: 'content',
          resourceType: 'document'
        }
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
    // {
      title: 'Add Structured data by uploading a file or adding manually',
      sources: [
        {
          name: 'Import Structured Data',
          description: 'Import from JSON or CSV',
          icon: 'assets/icons/content/database-Import.svg',
          id: 'contentStucturedDataImport',
          sourceType: 'object',
          resourceType: 'structuredData'
        },
        {
          name: 'Import Structured Data',
          description: 'Add structured data manually',
          icon: 'assets/icons/content/database-add.svg',
          id: 'contentStucturedDataAdd',
          sourceType: 'object',
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
    }
  ];
  anntationObj: any = {};
  addManualFaqModalPopRef: any;
  addSourceModalPopRef: any;

  linkBotsModalPopRef: any;
  noAssociatedBots: boolean = true;
  associatedBots: any = [];
  streamID: any;
  searchAssociatedBots: any;
  addStructuredDataModalPopRef : any;
  structuredData : any = {};
  structuredDataStatusModalRef : any;
  structuredDataDocPayload : any;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dock: DockStatusService,
    public dialog: MatDialog,
    private rangyService: RangySelectionService
  ) { }
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild('customRecurrence') customRecurrence: KRModalComponent;
  @ViewChild('addManualFaqModalPop') addManualFaqModalPop: KRModalComponent;
  @ViewChild('addSourceModalPop') addSourceModalPop: KRModalComponent;
  @ViewChild('linkBotsModalPop') linkBotsModalPop: KRModalComponent;
  @ViewChild('addStructuredDataModalPop') addStructuredDataModalPop: KRModalComponent;
  @ViewChild('structuredDataStatusModalPop') structuredDataStatusModalPop: KRModalComponent;
  ngOnInit() {
    const _self = this
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }

    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.userInfo = this.authService.getUserInfo() || {};
    console.log(this.userInfo);

    this.streamID = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
    console.log('StreamID', this.streamID)
    console.log(this.workflowService.selectedApp())
    this.getAssociatedBots();

    if (this.route && this.route.snapshot && this.route.snapshot.queryParams) {
      this.receivedQuaryparms = this.route.snapshot.queryParams
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
  }
  ngAfterViewInit() {
    setTimeout(() => {
      $('#addSourceTitleInput').focus();
    }, 100);
  }
  openAddManualFAQModal() {
    this.addManualFaqModalPopRef = this.addManualFaqModalPop.open();
  }
  closeAddManualFAQModal() {
    if (this.addManualFaqModalPopRef && this.addManualFaqModalPopRef.close) {
      this.addManualFaqModalPopRef.close();
    }
  }
  openAddSourceModal() {
    this.addSourceModalPopRef = this.addSourceModalPop.open();
  }
  closeAddSourceModal() {
    if (this.addSourceModalPopRef && this.addSourceModalPopRef.close) {
      this.addSourceModalPopRef.close();
    }
  }

  openLinkBotsModal() {
    this.linkBotsModalPopRef = this.linkBotsModalPop.open();
  }
  closeLinkBotsModal() {
    if (this.linkBotsModalPopRef && this.linkBotsModalPopRef.close) {
      this.linkBotsModalPopRef.close();
    }
  }

  poling(jobId, schedule?) {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      type: this.selectedSourceType.sourceType
    };
    this.pollingSubscriber = interval(5000).pipe(startWith(0)).subscribe(() => {
      this.service.invoke('get.job.status', quaryparms).subscribe(res => {
        this.statusObject = res;
        const queuedJobs = _.filter(res, (source) => {
          return (source._id === jobId);
        });
        if (queuedJobs && queuedJobs.length) {
          this.statusObject = queuedJobs[0];
          if(queuedJobs[0].validation.urlValidation){
            this.crawlOkDisable = !queuedJobs[0].validation.urlValidation;
          }
          
          if ((queuedJobs[0].status !== 'running') && (queuedJobs[0].status !== 'queued')) {
            this.pollingSubscriber.unsubscribe();
            //this.crawlOkDisable = true;
          }
          // if((queuedJobs[0].status == 'queued')){
          //   this.crawlOkDisable = true;
          // }else{
          //   this.crawlOkDisable = false;
          // }
        } else {
          this.statusObject = JSON.parse(JSON.stringify(this.defaultStatusObj));
          if(!schedule) this.statusObject.status = 'failed';
          this.crawlOkDisable = false;
        }
      }, errRes => {
        this.pollingSubscriber.unsubscribe();
        this.statusObject.status = 'failed';
        if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to extract web page', 'error');
        }
      });
    }
    )
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`${type}: ${event.value}`);
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
  }
  stopCrwaling(source,event){
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      jobId :   this.crwal_jobId

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
    console.log(selectedCrawlMethod);
    if (selectedCrawlMethod && selectedCrawlMethod.id === 'manual') {
      this.selectedSourceType = selectedCrawlMethod;
      this.openAddManualFAQModal();
    }
    else if (selectedCrawlMethod && selectedCrawlMethod.id === 'botActions') {
      this.selectedSourceType = selectedCrawlMethod;
      this.openLinkBotsModal();
    }
    else if(selectedCrawlMethod && (selectedCrawlMethod.resourceType === 'structuredData' || selectedCrawlMethod.resourceType === 'structuredDataManual')){
      this.selectedSourceType = selectedCrawlMethod;
      this.openAddStructuredData();
    }
    else {
      this.selectedSourceType = selectedCrawlMethod;
      this.openAddSourceModal();
    }
    setTimeout(() => {
      $('#addSourceTitleInput').focus();
    }, 100);
    // }
  }
  openImageLink(url) {
    window.open(url, '_blank');
  }
  fileChangeListener(event) {
    this.newSourceObj.url = '';
    let fileName = '';
    if (event && event.target && event.target.files && event.target.files.length && event.target.files[0].name) {
      fileName = event.target.files[0].name;
    } else {
      return;
    }
    const _ext = fileName.substring(fileName.lastIndexOf('.'));
    if (_ext !== '.pdf' && _ext !== '.csv') {
      $('#sourceFileUploader').val(null);
      this.notificationService.notify('Please select a valid csv or pdf file', 'error');
      return;
    } else {
      this.fileObj.fileUploadInProgress = true;
      this.fileObj.fileName = fileName;
    }
    this.onFileSelect(event.target, _ext);
  }
  onFileSelect(input: HTMLInputElement, ext) {
    const files = input.files;
    const content = this.csvContent;
    if (files && files.length) {
      const fileToRead = files[0];
      const onFileLoad = (fileLoadedEvent) => {
        const data = new FormData();
        data.append('file', fileToRead);
        data.append('fileContext', 'findly');
        data.append('Content-Type', fileToRead.type);
        data.append('fileExtension', ext.replace('.', ''));
        this.fileupload(data);
      };
      const fileReader = new FileReader();
      fileReader.onload = onFileLoad;
      fileReader.readAsText(fileToRead, 'UTF-8');
    }
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
        this.selectedSourceType.resourceAdded = true;
        //  this.selectedSourceType.resourceType = 'webdomain';
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
  removeFile() {
    $('#sourceFileUploader').val('');
    // $('#sourceFileUploader').replaceWith($('#sourceFileUploader').val('').clone(true));
    this.resetfileSource()
    // this.service.invoke('post.fileupload').subscribe().unsubscribe();
    if (!this.newSourceObj.url && this.selectedSourceType && this.selectedSourceType.resourceAdded) {
      this.selectedSourceType.resourceAdded = false;
    }
  }
  /** file upload  */
  gotoFileUpload(){
    const x = document.createElement('INPUT');
    x.setAttribute('type', 'file');
    x.click();
  }
  /** proceed Source API  */
  faqAnotate(payload,endPoint,quaryparms){
    if (payload.hasOwnProperty('url')) delete payload.url;
    this.service.invoke(endPoint, quaryparms, payload).subscribe(res => {
      this.annotationModal();
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Duplicate name, try again!', 'error');
      }
    });
  }
  proceedSource() {
    let payload: any = {};
    let schdVal =  true;
    const crawler = this.crwalObject;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: this.selectedSourceType.sourceType,
    };
    payload = this.newSourceObj;
    let endPoint = 'add.sourceMaterialFaq';
    let resourceType = this.selectedSourceType.resourceType;
    if (this.selectedSourceType.annotate && this.selectedSourceType.sourceType === 'faq') {
      quaryparms.faqType = 'document';
      payload.isNew = true;
      payload.fileId = this.fileObj.fileId;
     this.faqAnotate(payload,endPoint,quaryparms);
     schdVal = true;
    } else {
      if (this.selectedSourceType.sourceType === 'content') {
        endPoint = 'add.sourceMaterial';
        payload.resourceType = resourceType;
      } else {
        if (this.fileObj.fileAdded) {
          resourceType = 'document';
        } else if (this.newSourceObj.url) {
          resourceType = 'webdomain';
        }
        quaryparms.faqType = resourceType;
      }
      if (resourceType === 'webdomain') {
        crawler.name = this.newSourceObj.name;
        crawler.url = this.newSourceObj.url;
        crawler.desc = this.newSourceObj.desc || '';
        crawler.advanceOpts.useCookies = this.useCookies;
        crawler.advanceOpts.respectRobotTxtDirectives = this.respectRobotTxtDirectives;
        crawler.advanceOpts.crawlBeyondSitemaps= this.crawlBeyondSitemaps;
        crawler.advanceOpts.isJavaScriptRendered = this.isJavaScriptRendered;
        crawler.advanceOpts.blockHttpsMsgs = this.blockHttpsMsgs;
        if(Number(this.crawlDepth)){
          crawler.advanceOpts.crawlDepth =  Number(this.crawlDepth);
        }else{
          delete crawler.advanceOpts.crawlDepth;
        }
        if(Number(this.maxUrlLimit)){
          crawler.advanceOpts.maxUrlLimit = Number(this.maxUrlLimit);
        }else{
          delete crawler.advanceOpts.maxUrlLimit;
        }
        
        // crawler.advanceOpts.crawlDepth = Number(this.crawlDepth);
        // crawler.advanceOpts.maxUrlLimit = Number(this.maxUrlLimit);
        crawler.resourceType = this.selectedSourceType.resourceType;
        crawler.advanceOpts.allowedURLs.length > 0 ? crawler.advanceOpts.allowedOpt = true : crawler.advanceOpts.allowedOpt = false;
        crawler.advanceOpts.blockedURLs.length > 0 ? crawler.advanceOpts.blockedOpt = true : crawler.advanceOpts.blockedOpt = false;
        payload = {...crawler};
        delete payload.resourceType;
        if(payload.advanceOpts){
          if(!payload.advanceOpts.scheduleOpt){
            delete payload.advanceOpts.scheduleOpts;
            if(payload.advanceOpts.repeatInterval){
              delete payload.advanceOpts.repeatInterval;
            }
          }
        }
        quaryparms.resourceType = resourceType;
      }

      if (resourceType === 'document') {
        payload.fileId = this.fileObj.fileId;
        quaryparms.resourceType = resourceType;
        payload.isNew = true;
        if (payload.hasOwnProperty('url')) delete payload.url;
      }
      if(crawler.advanceOpts.scheduleOpt){
        if(crawler.advanceOpts.scheduleOpts){
          if(!crawler.advanceOpts.scheduleOpts.date){
            schdVal = false;
          }
          if(!crawler.advanceOpts.scheduleOpts.time){
            schdVal = false;
          }else{
            if(crawler.advanceOpts.scheduleOpts.time.hour == "" ||crawler.advanceOpts.scheduleOpts.time.hour == "null") schdVal = false;
            if(crawler.advanceOpts.scheduleOpts.time.timeOpt == "") schdVal = false;
            if(crawler.advanceOpts.scheduleOpts.time.timezone == "Time Zone") schdVal = false;
          }
        }
      }
      if(schdVal){
        this.service.invoke(endPoint, quaryparms, payload).subscribe(res => {
          this.openStatusModal();
          this.poling(res._id,'scheduler');
          this.crwal_jobId = res._id
        }, errRes => {
          if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
            this.notificationService.notify(errRes.error.errors[0].msg, 'error');
          } else {
            this.notificationService.notify('Failed to add sources ', 'error');
          }
        });
      }else{
        this.notificationService.notify('Please fill Date and Time fields', 'error');
      }
      // this.callWebCraller(this.crwalObject,searchIndex)
    }

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
    console.log(payload);

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
    console.log(event);
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
      keywords: event._source.tags
    };
    payload = _.extend(payload, event.quesList);

    this.service.invoke('add.sourceMaterialManualFaq', quaryparms, payload).subscribe(res => {
      this.selectedSourceType = null;
      this.closeAddManualFAQModal();
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
    console.log(scheduleData);
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
      if(scheduleData.interval.intervalType && scheduleData.interval.intervalType != "Custom"){
        scheduleData.interval.intervalValue = {};
      }
    this.crwalObject.advanceOpts.scheduleOpts = scheduleData;

    // this.dataFromScheduler = scheduleData
  }
  cronExpress(cronExpress) {
    console.log(cronExpress);
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
  }
  /* Annotation Modal */
  annotationModal() {
    if (this.newSourceObj && this.newSourceObj.name && this.fileObj.fileId) {
      const payload = {
        sourceTitle: this.newSourceObj.name,
        sourceDesc: this.newSourceObj.desc,
        fileId: this.fileObj.fileId
      };
      const dialogRef = this.dialog.open(PdfAnnotationComponent, {
        data: { pdfResponse: payload, annotation: this.anntationObj },
        panelClass: 'kr-annotation-modal',
        disableClose: true,
        autoFocus: true
      });
      // dialogRef.afterClosed().subscribe(res => {
      //   console.log(this.anntationObj);
      //   if (this.anntationObj && this.anntationObj.status === 'Inprogress') {
      //     this.openStatusModal();
      //     this.poling(this.anntationObj._id);
      //   }
      // });
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
    this.rangyService.getPolling().subscribe(res => {
      if(res) {
        console.log(this.anntationObj);
        this.openStatusModal();
        this.poling(this.anntationObj._id);
      }
    });
  }
  cancelExtraction() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
  }
  /* Annotation Modal end */

  getAssociatedBots() {
    if (this.userInfo.id) {
      const queryParams: any = {
        userID: this.userInfo.id
      };
      this.service.invoke('get.AssociatedBots', queryParams).subscribe(res => {
        console.log('Associated Bots', res);

        this.associatedBots = JSON.parse(JSON.stringify(res));
        console.log(this.associatedBots);
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
      console.log('Invalid UserID')
    }
  }

  linkBot(botID: any) {
    event.stopPropagation();

    const requestBody: any = {};
    let selectedApp: any;

    console.log(botID);

    if (this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };
      requestBody.linkBotId = botID;
      console.log(requestBody);
      this.service.invoke('put.LinkBot', queryParams, requestBody).subscribe(res => {
        console.log(res);
        selectedApp = this.workflowService.selectedApp();
        console.log(selectedApp);
        selectedApp.configuredBots[0] = {}
        selectedApp.configuredBots[0]._id = res.configuredBots[0]._id;
        this.workflowService.selectedApp(selectedApp);
        console.log(res.status);
        this.streamID = selectedApp.configuredBots[0]._id;
        this.getAssociatedBots();
        this.notificationService.notify('Bot linked, successfully', 'success');
      },
        (err) => {
          console.log(err);
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

    console.log(botID);

    if (this.searchIndexId) {
      const queryParams = {
        searchIndexID: this.searchIndexId
      }
      requestBody.linkedBotId = botID;
      console.log(requestBody);

      this.service.invoke('put.UnlinkBot', queryParams, requestBody).subscribe(res => {
        console.log(res);

        selectedApp = this.workflowService.selectedApp();
        selectedApp.configuredBots[0]._id = null;
        this.workflowService.selectedApp(selectedApp);
        this.streamID = null;
        this.getAssociatedBots();
        this.notificationService.notify('Bot unlinked, successfully', 'success');
      },
        (err) => {
          console.log(err);
          this.notificationService.notify('Bot unlinking, error', 'error');
        }
      )
    }
    else {
      this.notificationService.notify('Error', 'error');
    }

  }
  crawlOption(opt,label){
    this.crwalOptionLabel =  label;
    if(opt != 'any'){
      this.crwalObject.advanceOpts.crawlEverything = false;
      if(opt == 'allow'){
        this.crwalObject.advanceOpts.allowedOpt = true;
        this.crwalObject.advanceOpts.blockedOpt = false;
      }else if(opt == 'block'){
        this.crwalObject.advanceOpts.blockedOpt = true;
        this.crwalObject.advanceOpts.allowedOpt = false;
      }
    }else{
      this.crwalObject.advanceOpts.crawlEverything = true;
    }
  }

  // Code for Structured Data Starts

  openAddStructuredData(){
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  closeStructuredDataModal(event?){
    if (this.addStructuredDataModalPopRef && this.addStructuredDataModalPopRef.close) {
      this.addStructuredDataModalPopRef.close();
      if(event && event.showStatusModal){
        this.structuredDataDocPayload = event.payload;
        this.openStructuredDataStatusModal();
      }
    }
  }

  openStructuredDataStatusModal(){
    this.structuredDataStatusModalRef = this.structuredDataStatusModalPop.open();
  }

  closeStructuredDataStatusModal(){
    if(this.structuredDataStatusModalRef){
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
    console.log('PolingDistroyed');
    this.fileObj.fileAdded = false;
  }
  
  downloadSampleData(key){
    let fileName;
    let filePath;
    if(key === 'json'){
    fileName = 'sample.json';
    filePath = this.sampleJsonPath;
    }
    else{
    fileName = 'sample.csv';
    filePath = this.sampleCsvPath;
    }
    const link : any = document.createElement('a');
    link.href = filePath;
    link.download = fileName,
    link.click();
    link.remove();
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