import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ServiceInvokerService} from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { AuthService } from '@kore.services/auth.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '../../services/notification.service';
import { Router} from '@angular/router';
@Component({
  selector: 'app-content-source',
  templateUrl: './content-source.component.html',
  styleUrls: ['./content-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ContentSourceComponent implements OnInit, OnDestroy {
  loadingSliderContent = false;
  searchSources = '';
  pagesSearch = '';
  selectedApp: any = {};
  resources: any = [];
  polingObj: any = {};
  resourcesObj: any = {};
  loadingContent = true;
  statusObj: any = {
    failed: 'Failed',
    successfull: 'Successfull',
    success: 'Success',
    queued: 'Queued',
  };
  sliderStep = 0;
  selectedPage:any={};
  selectedSource: any = {};
  currentStatusFailed: any = false;
  userInfo: any = {};
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.getSourceList();
    this.userInfo = this.authService.getUserInfo() || {};
  }
  addNewContentSource(type){
    this.router.navigate(['/source'], { skipLocationChange: true,queryParams:{ sourceType:type}});
  }
  getSourceList() {
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      limit: 50,
      skip: 0
    };
    this.service.invoke('get.source.list', quaryparms).subscribe(res => {
      this.resources = res.reverse();
      if (this.resources && this.resources.length) {
        this.resources.forEach(resource => {
          if ((resource && resource.recentStatus === 'inprogress') || (resource && resource.recentStatus === 'queued')) {
             if (!this.polingObj[resource.jobId]) {
               this.poling(resource.jobId);
             }
          } else {
            if (this.polingObj[resource.jobId]) {
              clearInterval(this.polingObj[resource.jobId]);
            }
          }
        });
      }
      this.loadingContent = false;
    }, errRes => {
      this.getSourceList();
      console.log(errRes);
      this.loadingContent = false;
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
      this.sliderStep = 0;
      this.loadingSliderContent = false;
    }, errRes => {
      this.loadingSliderContent = false;
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to crawl web page', 'error');
      }
    });
  }
  viewPages() {
    this.sliderStep = 1;
  }
  viewPageDetails() {
    this.sliderStep = 2;
  }
  sliderBack() {
    if(this.sliderStep){
      this.sliderStep =  this.sliderStep - 1;
    }
  }
  openStatusSlider(source) {
    this.selectedSource = source;
    this.loadingSliderContent = true;
    this.sliderComponent.openSlider('#sourceSlider', 'right500');
    this.getCrawledPages();
  }
  closeStatusSlider() {
    this.sliderComponent.closeSlider('#sourceSlider');
  }
  openImageLink(url){
    window.open(url,'_blank');
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
