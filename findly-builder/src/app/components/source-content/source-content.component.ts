import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ServiceInvokerService} from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { AuthService } from '@kore.services/auth.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';
declare const $: any;
import * as _ from 'underscore';
@Component({
  selector: 'app-source-content',
  templateUrl: './source-content.component.html',
  styleUrls: ['./source-content.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SourceContentComponent implements OnInit , OnDestroy {
  fileAdded = false;
  searchIndexId;
  loadingSliderContent = false;
  selectedSourceType: any = null;
  addNewSource = false;
  newSourceObj: any = {};
  selectedApp: any = {};
  resources: any = [];
  statusModalPopRef: any = [];
  polingObj: any = {};
  initialValidations:any = {}
  currentStatusFailed: any = false;
  userInfo: any = {};
  fileName:any = '';
  csvContent:any = '';
  fileId:any = '';
  imageUrl = 'https://banner2.cleanpng.com/20180331/vww/kisspng-computer-icons-document-memo-5ac0480f061158.0556390715225507990249.jpg';
  constructor(public workflowService: WorkflowService,
              private service: ServiceInvokerService,
              private notificationService: NotificationService,
              private authService: AuthService,
              private router: Router,
              ) {}
   @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
   @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.userInfo = this.authService.getUserInfo() || {};
    console.log(this.userInfo);
  }
  proceedSourceAddition() {
    let payload: any = {};
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
    };
    payload = this.newSourceObj;
    payload.resourceType = 'webdomain';
    this.service.invoke('add.source', quaryparms, payload).subscribe(res => {
    this.polingObj.currentRunningResource = res;
     this.poling();
     this.openStatusModal();
    }, errRes => {
      console.log(errRes);
    });
  }
  poling() {
    const self = this;
    clearInterval(self.polingObj.currentPoleJob);
    this.polingObj.currentPoleJob = setInterval(() => {
      self.getJobStatus();
    }, 5000);
  }
  getJobStatus() {
    const self = this;
    const quaryparms: any = {
      searchIndexId:this.searchIndexId,
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(res => {
      const queuedJobs = _.filter(res,(source) => {
        return (((source.status === 'running') || (source.status === 'queued')) && (source._id === this.polingObj.currentRunningResource.jobId));
      });
      if (queuedJobs && queuedJobs.length) {
        console.log(queuedJobs);
     } else {
       console.log('No Jobs');
       clearInterval(self.polingObj.currentPoleJob);
     }
    }, errRes => {
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to crawl web page', 'error');
      }
    });
  }
  sliderDone() {
    this.addNewSource = false;
    this.cancleSourceAddition();
  }
  openStatusModal() {
    const self= this;
    clearInterval(self.polingObj.currentPoleJob);
    this.statusModalPopRef  = this.statusModalPop.open();
   }
   closeStatusModal() {
    const self= this;
    clearInterval(self.polingObj.currentPoleJob);
    this.cancleSourceAddition();
    if (this.statusModalPopRef &&  this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
    this.router.navigate(['/content'], { skipLocationChange: true });
   }
  createNewResource() {
    this.addNewSource = true;
  }
  cancleSourceAddition() {
    this.addNewSource = false;
    this.newSourceObj = {};
    this.selectedSourceType = null;
  }
  cancleNewSource() {
    this.addNewSource = false;
  }
  selectSource(selectedCrawlMethod) {
   this.selectedSourceType = selectedCrawlMethod;
  }
  openImageLink(url){
    window.open(url,'_blank');
  }
  fileChangeListener(event) {
    // getting file name and validating file type//
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
      this.fileName = fileName;
    }
    this.onFileSelect(event.target , _ext);
  }
  onFileSelect(input: HTMLInputElement , ext) {
    const files = input.files;
    const content = this.csvContent;
    if (files && files.length) {
      const fileToRead = files[0];
      const onFileLoad = (fileLoadedEvent) => {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        this.csvContent = textFromFileLoaded;
        const data = new FormData();
        data.append('file', fileToRead);
        data.append('fileContext', 'daas');
        data.append('fileExtension', ext.replace('.',''));
        // data.append('Content-Type', fileToRead.type);
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
        this.fileAdded= true;
        this.fileName= '.csv';
       this.fileId = res.fileId;
       this.notificationService.notify('File uploaded successfully', 'success');
      },
      errRes => {
        this.fileAdded= false;
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to upload file ', 'error');
        }
      }
    );
 }

  /** file upload  */

  FAQfileUpload(event){
    console.log(event);
    this.fileAdded= true;
    this.fileChangeListener(event);
  }
  removeFile(){
    $('#fileInput').replaceWith($('#fileInput').val('').clone(true));
    this.fileAdded= true;
    this.service.invoke('post.fileupload').subscribe().unsubscribe();
  }
  /** file upload  */

   /** proceed Source API  */

   proceedSource(proceedType,resourceType){
    let payload: any = {};
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: proceedType,
    };
    payload = this.newSourceObj;
    if(this.fileAdded) {
      resourceType = 'document';
    }
    if(proceedType === 'content'){
      payload.resourceType = resourceType;
    } else {
      quaryparms.faqType = resourceType
    }
    if(resourceType === 'document'){
      payload.fileId = this.fileId;
      if(payload.hasOwnProperty('url')) delete payload.url;
    }
    this.service.invoke('add.sourceMaterial', quaryparms, payload).subscribe(res => {
     this.poling();
     this.openStatusModal();
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to add sources ', 'error');
      }
    });
  }
  redirectTo(proceedType){
    if(proceedType === 'faq'){
      this.router.navigate(['/faqs'], { skipLocationChange: true })
    }else{
      this.router.navigate(['/content'], { skipLocationChange: true });
    }
  }
  /** proceed Source API */
  ngOnDestroy() {
     const self= this;
      clearInterval(self.polingObj.currentPoleJob);
      console.log('PolingDistroyed');
      this.fileAdded = false;
  }
}
