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
@Component({
  selector: 'app-source-content',
  templateUrl: './source-content.component.html',
  styleUrls: ['./source-content.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SourceContentComponent implements OnInit , OnDestroy {
  fileAdded : boolean = false;
  loadingSliderContent = false;
  selectedSourceType: any = null;
  searchSources = '';
  pagesSearch = '';
  addNewSource = false;
  newSourceObj: any = {};
  selectedApp: any = {};
  resources: any = [];
  statusModalPopRef: any = [];
  polingObj: any = {};
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
    this.userInfo = this.authService.getUserInfo() || {};
    console.log(this.userInfo);
  }
    proceedSourceAddition1(extractDoc) {
    console.log(extractDoc);
    let payload={};
    let fileId='1234'
    const resourceType='document'
    let quaryparms={
      searchIndexId:this.selectedApp.searchIndexes[0]._id

    };
    this.newSourceObj.fileId=fileId;
    this.newSourceObj.resourceType=resourceType;
    payload=this.newSourceObj
    this.service.invoke('post.extractdocument',quaryparms,payload).subscribe(res => {
      this.router.navigate(['/content'], { skipLocationChange: true });
      // console.log(res);
      // this.poling(res._id);
      // this.openStatusModal();
     }, errRes => {
      this.router.navigate(['/content'], { skipLocationChange: true });
       console.log(errRes);
     });

    console.log('contentdemo', this.newSourceObj.title)
    console.log('contentdemo', this.newSourceObj.desc)
    console.log('contentdemo', this.newSourceObj)

  }
  proceedSourceAddition() {
    let payload: any = {};
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
    };

    payload = this.newSourceObj;
    payload.resourceType = 'webdomain';
    this.service.invoke('add.source', quaryparms, payload).subscribe(res => {
     console.log(res);
     this.poling(res._id);
     this.openStatusModal();
    }, errRes => {
      console.log(errRes);
    });
  }
  poling(jobId) {
    clearInterval(this.polingObj[jobId]);
    const self = this;
    this.polingObj[jobId] = setInterval(() => {
      self.getJobStatus(jobId);
    }, 5000);
  }
  getJobStatus(jobId) {
    const quaryparms: any = {
      jobId,
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(res => {
      if (res && res.status === 'failed') {
        this.currentStatusFailed = false;
        this.notificationService.notify('Failed to crawl web page', 'error');
      }
      if ((res && (res.status !== 'running')) && (res && (res.status !== 'queued'))) {
        clearInterval(this.polingObj[jobId]);
        this.closeStatusModal();
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
    this.statusModalPopRef  = this.statusModalPop.open();
   }
   closeStatusModal() {
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
        data.append('fileExtension', 'pdf');
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
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to upload file ', 'error');
        }
      }
    );
 }
  ngOnDestroy() {
   const timerObjects = Object.keys(this.polingObj);
   if (timerObjects && timerObjects.length) {
    timerObjects.forEach(job => {
      clearInterval(this.polingObj[job]);
    });
   }
  }
}
