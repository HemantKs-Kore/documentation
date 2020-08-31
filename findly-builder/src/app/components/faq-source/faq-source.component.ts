import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { tempdata } from './tempdata';
import * as _ from 'underscore';
import { from } from 'rxjs';
declare const $: any;

@Component({
  selector: 'app-faq-source',
  templateUrl: './faq-source.component.html',
  styleUrls: ['./faq-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class FaqSourceComponent implements OnInit , OnDestroy {
  loadingSliderContent = false;
  serachIndexId;
  searchSources = '';
  pagesSearch = '';
  selectedFaq:any = null;
  selectedApp: any = {};
  resources: any = [];
  polingObj: any = {};
  faqObj:any = {
    allFaqs:[],
    stagedFaqs:[],
    unStagedFaqs:[]
  }
  selectedtab = 'allFaqs';
  selectAllFaqs = false;
  resourcesObj: any = {};
  loadingFaqs = true;
  statusObj: any = {
    failed: {name : 'Failed', color: 'red'},
    successfull: {name : 'Successfull', color: 'green'},
    success: {name : 'Success', color: 'green'},
    queued: {name : 'In Progress', color: 'blue'},
    running: {name : 'In Progress', color: 'blue'},
    inProgress: {name :'In Progress', color: 'blue'},
  };
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
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getfaqs();
    this.getSourceList();
    this.userInfo = this.authService.getUserInfo() || {};
    setTimeout(()=>{
      $('#searchFaqs').focus();
     },100);
  }
  addNewContentSource(type){
    this.router.navigate(['/source'], { skipLocationChange: true,queryParams:{ sourceType:type}});
  }
  selectAll(){
    const allFaqs= $('.selectEachfaqInput');
    console.log(allFaqs);
  }
  getfaqs(){
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      limit: 50,
      offset: 1,
      sourceType:'all',
      catagory:true,
    };
    this.service.invoke('get.faqs', quaryparms).subscribe(res => {
        console.log(res);
      this.loadingFaqs = false;
    }, errRes => {
      // this.faqObj.allFaqs = tempdata.tempfaqs ||  [];
      this.faqObj.allFaqs = [];
      this.loadingFaqs = false;
    });
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
        this.poling('faq')
      }
    }, errRes => {
    });
  }
  selectedFaqToTrain(faq){
 this.selectedFaq = faq;
  }
  addfaqs(type){
    if(type==='manual'){
      this.router.navigate(['/faqsManual']);
    }else{
      this.router.navigate(['/source'], { skipLocationChange: true,queryParams:{ sourceType:type}});
    }
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
        this.notificationService.notify('Failed to crawl web page', 'error');
      }
    });
  }
  openStatusSlider() {
    this.sliderComponent.openSlider('#faqsSourceSlider', 'right500');
  }
  closeStatusSlider() {
    this.sliderComponent.closeSlider('#faqsSourceSlider');
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
