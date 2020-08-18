import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ServiceInvokerService} from '@kore.services/service-invoker.service';
import {workflowService} from '@kore.services/workflow.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { KRModalComponent } from '@kore.shared/kr-modal/kr-modal.component';
import { AuthService } from '@kore.services/auth.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-source-content',
  templateUrl: './source-content.component.html',
  styleUrls: ['./source-content.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SourceContentComponent implements OnInit , OnDestroy {
  selectedSourceType: any = null;
  searchSources = '';
  pagesSearch = '';
  clickedSourceType: any = null;
  addNewSource = false;
  newSourceObj: any = {};
  selectedApp: any = {};
  resources: any = [];
  statusModalPopRef: any = [];
  polingObj: any = {};
  loadingContent = true;
  selectedSource: any = {};
  statusObj: any = {
    failed: 'Failed',
    successfull: 'Successfull',
    queued: 'Queued',
  };
  showPages: any = false;
  currentStatusFailed: any = false;
  userInfo: any = {};
  jobid = 'job-707f76af-b916-5cd5-ba9d-43826e4b1934';
  tempPages = [
    {
        _id: 'pg-xxxxxx-xxx-xxx',
        title: 'Adding a Quora Bot - Kore.ai Documentation',
        sections: [
            'Adding a Quora Bot'
        ],
        // tslint:disable-next-line:max-line-length
        body: 'Menu\nDocumentation\nCurrent Version (7.3)\n7.2 Version\n7.1 Version\n7.0 Version\n6.4 Version\n6.3 Version\nCommunity\nSupport\nBot Builder\nsearch\nChatbot Overview\nConversational Bots\nIntents & Entities\nIntelligent Bots\nKore.ai\'s Approach\nKore.ai Conversational Platform',
        imageUrl: [
            'https://developer.kore.ai/wp-content/uploads/2019/05/logo-documentation-3x-1.png',
            'https://developer.kore.ai/wp-content/uploads/QuoraLogo.jpg',
            'https://developer.kore.ai/wp-content/uploads/newtask.png'
        ],
        resourceId: 'wdom-df76b7c4-7160-5d60-a3e6-036176dc53ff',
        searchIndexId: 'sidx-4fe0bceb-d390-5abb-b879-e1626ca2b04d',
        streamId: 'st-85bf517b-2592-5050-9cbc-0c81925eadc5',
        searchResultPreview: '',
        createdOn: '2020-08-14T11:16:52.527Z',
        jobId: 'job-e8b3a541-fbb2-56d5-9b60-7bb11ee5ee41'
    }
 ];

  imageUrl = 'https://banner2.cleanpng.com/20180331/vww/kisspng-computer-icons-document-memo-5ac0480f061158.0556390715225507990249.jpg';
  constructor(private workflowService: workflowService,
              private service: ServiceInvokerService,
              private notificationService: NotificationService,
              private authService: AuthService) {}
   @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
   @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.getSourceList();
    this.userInfo = this.authService.getUserInfo() || {};
    console.log(this.userInfo);
  }
  proceedSourceAddition() {
    let payload: any = {};
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      limit: 20,
      skip: 0
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
  getSourceList() {
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
    };
    this.service.invoke('get.source.list', quaryparms).subscribe(res => {
      this.resources = res;
      this.loadingContent = false;
    }, errRes => {
      this.getSourceList();
      console.log(errRes);
      this.loadingContent = false;
    });
  }
  poling(jobMetaId) {
    clearInterval(this.polingObj[jobMetaId]);
    const self = this;
    this.polingObj[jobMetaId] = setInterval(() => {
      self.getJobStatus(jobMetaId);
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
        this.getSourceList();
      }
    }, errRes => {
      console.log(errRes);
      this.getSourceList();
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
  getCrawledPages() {
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      webDomainId: this.selectedSource._id,
      limit: 50,
      skip: 0
    };
    this.service.invoke('get.extracted.pags', quaryparms).subscribe(res => {
      this.selectedSource.pages = res;
      this.showPages = false;
      this.sliderComponent.openSlider('#sourceSlider', 'right500');
    }, errRes => {
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to crawl web page', 'error');
      }
    });
  }
  viewPages() {
    this.showPages = true;
  }
  hidepages() {
    this.showPages = false;
  }
  openStatusSlider(source) {
    this.selectedSource = source;
    this.getCrawledPages();
  }
  openStatusModal() {
    this.statusModalPopRef  = this.statusModalPop.open();
   }
   closeStatusModal() {
    this.cancleSourceAddition();
    this.statusModalPopRef.close();
   }
  closeStatusSlider() {
    this.sliderComponent.closeSlider('#sourceSlider');
  }
  createNewResource() {
    this.addNewSource = true;
  }
  cancleSourceAddition() {
    this.addNewSource = false;
    this.newSourceObj = {};
    this.selectedSourceType = null;
    this.clickedSourceType = null;
  }
  cancleNewSource() {
    this.addNewSource = false;
  }
  confirmSource() {
    this.selectedSourceType = this.clickedSourceType;
  }
  selectSource(selectedCrawlMethod) {
   this.clickedSourceType = selectedCrawlMethod;
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
