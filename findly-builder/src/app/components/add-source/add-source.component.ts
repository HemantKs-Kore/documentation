import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import {ServiceInvokerService} from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { AuthService } from '@kore.services/auth.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '../../services/notification.service';
import { Router , ActivatedRoute} from '@angular/router';
declare const $: any;
import * as _ from 'underscore';
import { of, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CrwalObj , AdvanceOpts , AllowUrl , BlockUrl, scheduleOpts} from 'src/app/helpers/models/Crwal-advance.model';

import { PdfAnnotationComponent } from '../annotool/components/pdf-annotation/pdf-annotation.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class AddSourceComponent implements OnInit , OnDestroy ,AfterViewInit {
  fileObj:any = {};
  crwalEvery : boolean = false;
  crwalObject : CrwalObj = new CrwalObj();
  allowUrl : AllowUrl = new AllowUrl();
  blockUrl : BlockUrl = new BlockUrl();
  receivedQuaryparms: any;
  searchIndexId;
  selectedSourceType: any = null;
  newSourceObj: any = {};
  selectedApp: any = {};
  statusModalPopRef: any = [];
  customRecurrenceRef : any = [];
  pollingSubscriber: any = null;
  initialValidations:any = {};
  doesntContains = "Doesn't Contains";
  dataFromScheduler : scheduleOpts
  @Input() inputClass: string;
  @Input() resourceIDToOpen: any;
  @Output() saveEvent = new EventEmitter();
  @Output() cancleEvent = new EventEmitter();
  defaultStatusObj:any = {
    jobId: '',
    status: 'running',
    validation:{
      validated :false
    }
    }
  statusObject:any = {};
  currentStatusFailed: any = false;
  userInfo: any = {};
  csvContent:any = '';
  imageUrl = 'https://banner2.cleanpng.com/20180331/vww/kisspng-computer-icons-document-memo-5ac0480f061158.0556390715225507990249.jpg';
  availableSources:any = [
    {
      title: 'Add Content',
      sources: [
        {
          name:'Crawl Web Domain',
          description:'Extract and index web pages',
          icon: 'assets/images/source-icos/crawlwebdomain.svg',
          id:'contentWeb',
          sourceType:'content',
          resourceType:'webdomain'
        },
        {
          name:'Upload File',
          description:'Index file content',
          icon: 'assets/images/source-icos/file_upload.svg',
          id:'contentDoc',
          sourceType:'content',
          resourceType:'document'
        },
        {
          name:'Others',
          description:'Extract content from other',
          icon: 'assets/images/source-icos/others.svg',
          id:'contentothers',
          sourceType:'content',
          resourceType:'document'
        }
      ]
    },
    {
      title: 'Extract FAQs',
      sources: [
        {
          name:'Extract FAQs ',
          description:'Extract FAQs from web pages and documents',
          icon: 'assets/images/source-icos/globe.svg',
          id:'faqWeb',
          sourceType:'faq',
          resourceType:''
        },
        {
          name:'Import FAQs',
          description:'Import FAQs from CSV, Json',
          icon: 'assets/images/source-icos/importfaq.svg',
          id:'faqDoc',
          sourceType:'faq',
          resourceType:'importfaq'
        },
        {
          name:'Add FAQs Manually',
          description:'Manually Input FAQs',
          icon: 'assets/images/source-icos/addfaqmanually.svg',
          id:'manual',
          sourceType:'faq',
          resourceType:'manual'
        }
      ]
    }
  ];
  anntationObj: any = {};
  constructor(public workflowService: WorkflowService,
              private service: ServiceInvokerService,
              private notificationService: NotificationService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog
              ) {}
   @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
   @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
   @ViewChild('customRecurrence') customRecurrence: KRModalComponent;
  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.userInfo = this.authService.getUserInfo() || {};
    console.log(this.userInfo);
    if(this.route && this.route.snapshot && this.route.snapshot.queryParams){
      this.receivedQuaryparms = this.route.snapshot.queryParams
      if(this.receivedQuaryparms && this.receivedQuaryparms.sourceType || this.resourceIDToOpen){
        const resourceType = this.resourceIDToOpen || this.receivedQuaryparms.sourceType;
      this.availableSources.forEach( catagory => {
            catagory.sources.forEach(source => {
               if(source.id === resourceType){
                this.selectedSourceType = source;
               }
            });
      });
      }
    }
  }
  ngAfterViewInit(){
    setTimeout(()=>{
     $('#addSourceTitleInput').focus();
    },100);
  }
  poling(jobId) {
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
          return  (source._id=== jobId);
        });
        if (queuedJobs && queuedJobs.length) {
          this.statusObject = queuedJobs[0];
          if((queuedJobs[0].status !== 'running') && (queuedJobs[0].status !== 'queued')) {
            this.pollingSubscriber.unsubscribe();
          }
        } else {
          this.statusObject = JSON.parse(JSON.stringify(this.defaultStatusObj));
          this.statusObject.status = 'failed';
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
  openCustomRecModal(){
    this.customRecurrenceRef = this.customRecurrence.open();
  }
  closeCustomRecModal(){
    if (this.customRecurrenceRef &&  this.customRecurrenceRef.close) {
      this.customRecurrenceRef.close();
    }
  }
  openStatusModal() {
    if(this.resourceIDToOpen){
      $('.addSourceModalComponent').addClass('hide');
    }
    this.statusObject = { ...this.defaultStatusObj};
    const self= this;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    this.statusModalPopRef  = this.statusModalPop.open();
   }
   closeStatusModal() {
    this.saveEvent.emit();
    const self= this;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    if (this.statusModalPopRef &&  this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
    this.redirectTo();
    this.cancleSourceAddition();
   }
  cancleSourceAddition() {
    if(this.resourceIDToOpen){
      const event:any = {}
      this.cancleEvent.emit(event);
    }else {
      this.newSourceObj = {};
      this.selectedSourceType = null;
      this.removeFile();
    }
  }
  selectSource(selectedCrawlMethod) {
  // if(selectedCrawlMethod && (selectedCrawlMethod.sourceType === 'faq') && (selectedCrawlMethod.resourceType === 'manual')){
  //   this.router.navigate(['/faqsManual'], { skipLocationChange: true })
  // } else {
    this.selectedSourceType = selectedCrawlMethod;
    setTimeout(()=>{
     $('#addSourceTitleInput').focus();
    },100);
  // }
  }
  openImageLink(url){
    window.open(url,'_blank');
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
    this.onFileSelect(event.target , _ext);
  }
  onFileSelect(input: HTMLInputElement , ext) {
    const files = input.files;
    const content = this.csvContent;
    if (files && files.length) {
      const fileToRead = files[0];
      const onFileLoad = (fileLoadedEvent) => {
        const data = new FormData();
        data.append('file', fileToRead);
        data.append('fileContext', 'findly');
        data.append('Content-Type', fileToRead.type);
        data.append('fileExtension', ext.replace('.',''));
        this.fileupload(data);
    };
      const fileReader = new FileReader();
      fileReader.onload = onFileLoad;
      fileReader.readAsText(fileToRead, 'UTF-8');
    }
  }
  fileupload(payload){
    const quaryparms: any = {
      userId: this.userInfo.id
    };
    this.service.invoke('post.fileupload', quaryparms,payload).subscribe(
      res => {
        this.fileObj.fileAdded= true;
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
 urlChange(event){
  if($('#sourceFileUploader').val() || this.fileObj.fileId){
    this.removeFile();
  }
  if (this.newSourceObj.url){
    this.selectedSourceType.resourceAdded = true;
    this.selectedSourceType.resourceType = 'webdomain';
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
  removeFile(){
    $('#sourceFileUploader').val('');
    // $('#sourceFileUploader').replaceWith($('#sourceFileUploader').val('').clone(true));
    this.resetfileSource()
    // this.service.invoke('post.fileupload').subscribe().unsubscribe();
    if(!this.newSourceObj.url && this.selectedSourceType && this.selectedSourceType.resourceAdded){
      this.selectedSourceType.resourceAdded = false;
    }
  }
  /** file upload  */

   /** proceed Source API  */

   proceedSource(){
    let payload: any = {};
    let crawler = this.crwalObject;
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: this.selectedSourceType.sourceType,
    };
    payload = this.newSourceObj;
    let endPoint = 'add.sourceMaterialFaq';
    let resourceType = this.selectedSourceType.resourceType;
    if(this.selectedSourceType.annotate && this.selectedSourceType.sourceType === 'faq') {
      quaryparms.faqType = 'document';
      payload.resourceType = 'document';
      payload.fileId = this.fileObj.fileId;
      if(payload.hasOwnProperty('url')) delete payload.url;
      this.service.invoke(endPoint, quaryparms, payload).subscribe(res => {
        this.annotationModal();
       }, errRes => {
         if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
           this.notificationService.notify(errRes.error.errors[0].msg, 'error');
         } else {
           this.notificationService.notify('Duplicate name, try again!', 'error');
         }
       });
    } else {
      if(this.selectedSourceType.sourceType === 'content'){
        endPoint = 'add.sourceMaterial';
        payload.resourceType = resourceType;
      } else {
        if(this.fileObj.fileAdded) {
          resourceType = 'document';
        } else if(this.newSourceObj.url){
         resourceType = 'webdomain';
        }
        quaryparms.faqType = resourceType;
      }
        if(resourceType == 'webdomain'){
        crawler.name = this.newSourceObj.name;
        crawler.url = this.newSourceObj.url;
        crawler.desc = this.newSourceObj.desc || '';
        crawler.resourceType = this.selectedSourceType.resourceType;
        payload = crawler
      }
     
      if(resourceType === 'document'){
        payload.fileId = this.fileObj.fileId;
        if(payload.hasOwnProperty('url')) delete payload.url;
      }
      this.service.invoke(endPoint, quaryparms, payload).subscribe(res => {
       this.openStatusModal();
       this.poling(res._id);
      }, errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to add sources ', 'error');
        }
      });
      //this.callWebCraller(this.crwalObject,searchIndex)
    }

  }
  callWebCraller(crawler,searchIndex){
    let payload = {}
    let resourceType = this.selectedSourceType.resourceType;
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
  faqCancle(event){
    this.selectedSourceType = null
    if(this.resourceIDToOpen){
      const eve:any = {}
      this.cancleEvent.emit(eve);
     }
  }
  addManualFaq(event){
    console.log(event);
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      type: 'faq',
      faqType:'manual'
    };
    let payload: any = {
      // desc: event.response,
      // name: event.question,
      question: event.question,
      // answer: event.response,
      defaultAnswers: event.defaultAnswers || [],
      conditionalAnswers: event.conditionalAnswers || [],
      keywords: event.tags
      };
    payload = _.extend(payload, event.quesList);

    this.service.invoke('add.sourceMaterialFaq', quaryparms, payload).subscribe(res => {
       this.selectedSourceType = null;
       event.cb('success');
       if(this.resourceIDToOpen){
        const eve:any = {}
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
  redirectTo(){
    if(this.selectedSourceType.sourceType === 'faq'){
      this.router.navigate(['/faqs'], { skipLocationChange: true })
    }else{
      this.router.navigate(['/content'], { skipLocationChange: true });
    }
  }
  /** proceed Source API */
  scheduleData(scheduleData){
    console.log(scheduleData);
    this.crwalObject.advanceOpts.scheduleOpts = scheduleData;

    //this.dataFromScheduler = scheduleData
  }
  cronExpress(cronExpress){
    console.log(cronExpress);
    this.crwalObject.advanceOpts.repeatInterval = cronExpress;
  }
  /**Crwaler */
  allowUrls(data){
    this.crwalObject.advanceOpts.allowedURLs.push(data);
    this.allowUrl = new AllowUrl();

  }
  blockUrls(data){
    this.crwalObject.advanceOpts.blockedURLs.push(data);
    this.blockUrl = new BlockUrl
  }
  /**Crwaler */

  exceptUrl(bool){
    this.crwalObject.advanceOpts.allowedOpt = !bool;
    this.crwalObject.advanceOpts.blockedOpt = !this.crwalObject.advanceOpts.allowedOpt;
  }
  restrictUrl(bool){
    this.crwalObject.advanceOpts.blockedOpt = !bool;
    this.crwalObject.advanceOpts.allowedOpt = !this.crwalObject.advanceOpts.blockedOpt;
  }
  updateUrlRecord(index,type){
    type == 'allow' ? this.crwalObject.advanceOpts.allowedURLs.splice(index,1) : this.crwalObject.advanceOpts.blockedURLs.splice(index,1)
  }
  urlCondition(condition , type){
    type == 'allow' ? this.allowUrl.condition = condition : this.blockUrl.condition = condition; 
   }
  /* Annotation Modal */
  annotationModal() {
    if(this.newSourceObj && this.newSourceObj.name && this.fileObj.fileId) {
      // console.log(this.newSourceObj);
      let payload = {
        sourceTitle: this.newSourceObj.name || 'test',
        sourceDesc: this.newSourceObj.desc || 'test desc',
        fileId: this.fileObj.fileId || '5f6ad9b032d08f34c4f61b73'
      };
      const dialogRef = this.dialog.open(PdfAnnotationComponent, {
        data: { pdfResponse: payload, annotation: this.anntationObj },
        panelClass: 'kr-annotation-modal',
        disableClose: true,
        autoFocus: true
      });
      dialogRef.afterClosed().subscribe(res => {
        console.log(this.anntationObj);
        if(this.anntationObj && this.anntationObj.status === 'Inprogress') {
          this.openStatusModal();
          this.poling(this.anntationObj._id);         
        }
      });
    }
  }
  annotateChange(event) {
    if(event.currentTarget.checked) {
      this.selectedSourceType.annotate = true;
    } else {
      this.selectedSourceType.annotate = false;
    }
  }
  cancelExtraction() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
     }
  }
  /* Annotation Modal end */
  ngOnDestroy() {
     const self= this;
     if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
     }
      console.log('PolingDistroyed');
      this.fileObj.fileAdded = false;
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