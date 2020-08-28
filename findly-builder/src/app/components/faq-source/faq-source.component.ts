import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq-source',
  templateUrl: './faq-source.component.html',
  styleUrls: ['./faq-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class FaqSourceComponent implements OnInit , OnDestroy {
  loadingFaqs = true
  loadingSliderContent = false;
  searchSources = '';
  pagesSearch = '';
  selectedApp: any = {};
  resources: any = [];
  polingObj: any = {};
  resourcesObj: any = {};
  loadingContent = true;
  statusObj: any = {
    failed: {name : 'Failed', color: 'red'},
    successfull: {name : 'Successfull', color: 'green'},
    success: {name : 'Success', color: 'green'},
    queued: {name : 'Queued', color: 'blue'},
    running: {name : 'In Progress', color: 'blue'},
    inProgress: {name :'In Progress', color: 'blue'},
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

  ngOnInit() {
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
      type:'faq',
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
      this.loadingFaqs = false;
    }, errRes => {
      this.loadingFaqs = false;
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
  ngOnDestroy() {
   const timerObjects = Object.keys(this.polingObj);
   if (timerObjects && timerObjects.length) {
    timerObjects.forEach(job => {
      clearInterval(this.polingObj[job]);
    });
   }
  }

}
