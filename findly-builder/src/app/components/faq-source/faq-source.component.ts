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
import { from, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
declare const $: any;

@Component({
  selector: 'app-faq-source',
  templateUrl: './faq-source.component.html',
  styleUrls: ['./faq-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class FaqSourceComponent implements OnInit, OnDestroy {
  loadingSliderContent = false;
  serachIndexId;
  searchSources = '';
  pagesSearch = '';
  selectedFaq: any = null;
  showAddFaqSection = false;
  selectedApp: any = {};
  resources: any = [];
  polingObj: any = {};
  pollingSubscriber;
  faqs:any = [];
  faqsAvailable = false;
  selectedtab = 'allFaqs';
  selectAllFaqs = false;
  loadingTab = false;
  resourcesObj: any = {};
  sekectedResource;
  loadingFaqs = true;
  statusObj: any = {
    failed: { name: 'Failed', color: 'red' },
    successfull: { name: 'Successfull', color: 'green' },
    success: { name: 'Success', color: 'green' },
    queued: { name: 'In Progress', color: 'blue' },
    running: { name: 'In Progress', color: 'blue' },
    inProgress: { name: 'In Progress', color: 'blue' },
  };
  selectedPage: any = {};
  selectedSource: any = {};
  currentStatusFailed: any = false;
  userInfo: any = {};
  searchFaq = '';
  stageMsgImg = 'https://www.svgrepo.com/show/121146/add-circular-interface-button.svg';
  unStageMsgImg = 'https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/1297235041547546467-512.png';
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
    this.getfaqsBy();
    this.getSourceList();
    this.userInfo = this.authService.getUserInfo() || {};
    setTimeout(() => {
      $('#searchFaqs').focus();
    }, 100);
  }
  addNewContentSource(type) {
    this.router.navigate(['/source'], { skipLocationChange: true, queryParams: { sourceType: type } });
  }
  selectAll() {
    const allFaqs = $('.selectEachfaqInput');
    if (allFaqs && allFaqs.length){
      $.each(allFaqs, (index,element) => {
        if($(element) && $(element).length){
          $(element)[0].checked = this.selectAllFaqs;
        }
      });
    };
    const selectedElements = $('.selectEachfaqInput:checkbox:checked');
  }
  checkUncheckfaqs(){
    const selectedElements = $('.selectEachfaqInput:checkbox:checked');
    const allElements = $('.selectEachfaqInput');
    if(selectedElements.length === allElements.length){
      $('#selectAllFaqs')[0].checked = true;
    } else {
      $('#selectAllFaqs')[0].checked = false;
    }
  }
  selectResourceFilter(source?){
    let staged = null;
    if(this.selectedtab=== 'stagedFaqs'){
      staged = 'yes';
    } else if(this.selectedtab === 'unStagedFaqs'){
      staged = 'no';
    }
    if(source){
      this.selectedSource = source;
      this.getfaqsBy(source._id,staged);
    } else {
      this.getfaqsBy(null,staged);
    }
  }
  addManualFaq(event){
    console.log(event);
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'faq',
      faqType:'manual'
    };
    const payload: any = {
      desc: event.response,
      name: event.question,
      question: event.question,
      answer: event.response
      };
    this.service.invoke('add.sourceMaterialFaq', quaryparms, payload).subscribe(res => {
       this.showAddFaqSection = false;
       event.cb('success');
     }, errRes => {
       event.cb('error');
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed to add sources ', 'error');
       }
     });
  }
  faqsApiService(serviceId, params, payload?) {
    this.faqs = [];
    this.service.invoke(serviceId, params, payload).subscribe(res => {
      this.faqs = res;
      if(serviceId === 'get.allFaqs'){
        this.faqsAvailable = res.length?true:false;
      }
      this.loadingFaqs = false;
      this.loadingTab = false;
    }, errRes => {
      this.loadingFaqs = false;
      this.loadingTab = false;
    });
  }
  getfaqsBy(resourceId?, checkStaged?) {
    this.loadingTab = true;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      limit: 50,
      offset: 0,
    };
    if (checkStaged && checkStaged==='yes') {
      quaryparms.staged = true;
    } else {
      quaryparms.staged = false;
    }
    let serviceId = 'get.allFaqs';
    if (resourceId) {
      quaryparms.resourceId = resourceId;
      if(checkStaged){
        serviceId = 'get.faqsByResourcesStaged';
      } else {
        serviceId = 'get.faqsByResources';
      }
    } else {
      if(checkStaged){
        serviceId = 'get.allFaqsByStaged';
      }
    }
    this.faqsApiService(serviceId, quaryparms);
  }
  selectTab(tab){
    this.selectedFaq=null
    this.selectedtab = tab;
    if(tab === 'allFaqs'){
      this.getfaqsBy();
    } else if (tab === 'stagedFaqs'){
      this.getfaqsBy(null , 'yes');
    } else {
      this.getfaqsBy(null , 'no');
    }
  }
  getSourceList() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'faq',
      limit: 50,
      skip: 0
    };
    this.service.invoke('get.source.list', quaryparms).subscribe(res => {
      this.resources = res.reverse();
      if (this.resources && this.resources.length) {
        this.poling()
      }
    }, errRes => {
    });
  }
  selectedFaqToTrain(faq) {
    this.selectedFaq = faq;
  }
  stageUnstageQuestion(faq){
    faq.statusUpdateInProgress = true;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      faqId:faq._id
    };
    if(faq && faq.staged){
      quaryparms.method = 'remove';
    }else {
      quaryparms.method = 'add';
    }
    this.service.invoke('addRemove.faqs', quaryparms).subscribe(res => {
      delete faq.statusUpdateInProgress;
      faq.staged = !faq.staged;
      const faqIndex = _.findIndex(this.faqs,{_id:faq._id});
      if((faqIndex > -1)){
        if( this.selectedtab === 'stagedFaqs' ) {
          if(!faq.staged){
           this.faqs.splice(faqIndex,1);
          }
        } else if(this.selectedtab === 'unStagedFaqs'){
          if(faq.staged){
            if(faq.staged){
              this.faqs.splice(faqIndex,1);
             }
           }
        }
      }
    }, errRes => {
      delete faq.statusUpdateInProgress;
    });
  }
  addfaqs(type) {
    if (type === 'manual') {
      this.showAddFaqSection = true;
      // this.router.navigate(['/faqsManual'], { skipLocationChange: true });
    } else {
      this.router.navigate(['/source'], { skipLocationChange: true, queryParams: { sourceType: type } });
    }
  }
  poling() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'faq'
    };
    this.pollingSubscriber = interval(5000).pipe(startWith(0)).subscribe(() => {
      this.service.invoke('get.job.status', quaryparms).subscribe(res => {
        this.updateSourceStatus(res);
        const queuedJobs = _.filter(res, (source) => {
          return ((source.status === 'running') || (source.status === 'queued'));
        });
        if (queuedJobs && queuedJobs.length) {
          console.log(queuedJobs);
        } else {
          this.pollingSubscriber.unsubscribe();
        }
      }, errRes => {
        this.pollingSubscriber.unsubscribe();
        if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to extract web page', 'error');
        }
      });
    }
    )
  }
  updateSourceStatus(statusItems) {
    if (statusItems && statusItems.length) {
      statusItems.forEach(status => {
        this.polingObj[status._id] = status.status;
      });
      this.resources.forEach(source => {
        if (source && this.polingObj && this.polingObj[source.jobId]) {
          source.status = this.polingObj[source.jobId];
        }
      });
    }
  }
  openStatusSlider() {
    this.sliderComponent.openSlider('#faqsSourceSlider', 'right500');
  }
  closeStatusSlider() {
    this.sliderComponent.closeSlider('#faqsSourceSlider');
  }
  ngOnDestroy() {
    if(this.pollingSubscriber){
      this.pollingSubscriber.unsubscribe();
    }
  }
}
