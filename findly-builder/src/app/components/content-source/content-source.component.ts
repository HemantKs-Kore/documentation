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
declare const $: any;
import * as _ from 'underscore';
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
  serachIndexId;
  statusObj: any = {
    failed: {name : 'Failed', color: 'red'},
    successfull: {name : 'Successfull', color: 'green'},
    success: {name : 'Success', color: 'green'},
    queued: {name : 'In Progress', color: 'blue'},
    running: {name : 'In Progress', color: 'blue'},
    inprogress: {name :'In Progress', color: 'blue'},
  };
  sliderStep = 0;
  selectedPage:any={};
  selectedSource: any = {};
  currentStatusFailed: any = false;
  userInfo: any = {};
  sortedData:any = [];
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
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getSourceList();
    this.userInfo = this.authService.getUserInfo() || {};
  }
  addNewContentSource(type){
    this.router.navigate(['/source'], { skipLocationChange: true,queryParams:{ sourceType:type}});
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortBy(sort) {
    const data = this.resources.slice();
    const sortedData = data.sort((a, b) => {
      const isAsc = true;
      switch (sort) {
        case 'type': return this.compare(a.type, b.type, isAsc);
        case 'recentStatus': return this.compare(a.recentStatus, b.recentStatus, isAsc);
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'createdOn': return this.compare(a.createdOn, b.createdOn, isAsc);
        default: return 0;
      }
    });
    this.resources = sortedData;
  }
  getSourceList() {
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type:'content',
      limit: 50,
      skip: 0
    };
    this.service.invoke('get.source.list', quaryparms).subscribe(res => {
      this.resources = res;
      _.map(this.resources, (source)=> {
        source.name = source.name || source.title;
      });
      this.resources =  this.resources.reverse();
      if (this.resources && this.resources.length) {
        this.poling('content')
      }
      this.loadingContent = false;
      setTimeout(()=>{
        $('#searchContentSources').focus();
       },100);
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
  getJobStatus(type) {
    const quaryparms: any = {
      searchIndexId:this.serachIndexId,
      type
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(res => {
      const queuedJobs = _.filter(res,(source) => {
        return ((source.status === 'running') || (source.status === 'queued'));
      });
      if (queuedJobs && queuedJobs.length) {
        console.log(queuedJobs);
     } else {
       clearInterval(this.polingObj[type]);
     }
    }, errRes => {
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to crawl', 'error');
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
    if(source && ((source.recentStatus === 'running') || (source.recentStatus === 'queued') || (source.recentStatus === 'inprogress'))){
    this.notificationService.notify('Source extraction is still in progress','error');
    return;
    }
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
  deletePage(page,event){
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
      webDomainId:this.selectedSource._id,
      pageId:page._id
    }
    this.service.invoke('delete.contnet.page', quaryparms).subscribe(res => {
      const deleteIndex = _.findIndex(this.selectedSource.pages,(pg)=>{
           return pg._id === page._id;
      })
      if (deleteIndex > -1) {
       this.selectedSource.pages.splice(deleteIndex,1);
      }
    }, errRes => {
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
