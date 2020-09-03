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
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
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
  selectedResource;
  public model: any;
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
  currentStatusFailed: any = false;
  userInfo: any = {};
  searchFaq = '';
  stageMsgImg = 'https://www.svgrepo.com/show/121146/add-circular-interface-button.svg';
  unStageMsgImg = 'https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/1297235041547546467-512.png';
  statusModalPopRef: any = [];
  addSourceModalPopRef: any = [];
  showSourceAddition:any = null;
  @ViewChild('addSourceModalPop') addSourceModalPop: KRModalComponent;
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
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
  openStatusModal() {
    this.statusModalPopRef  = this.statusModalPop.open();
   }
   closeStatusModal() {
    if (this.statusModalPopRef &&  this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
   }
   openAddSourceModal() {
    this.addSourceModalPopRef  = this.addSourceModalPop.open();
   }
   closeAddsourceModal() {
    if (this.addSourceModalPopRef &&  this.addSourceModalPopRef.close) {
      this.addSourceModalPopRef.close();
    }
   }
   onSourceAdditionClose(){
    this.closeAddsourceModal();
    this.showSourceAddition = null;
   }
   onSourceAdditionSave(){
    this.showSourceAddition = null;
   }
   addFaqSource(type?){
     this.showSourceAddition = true;
    this.openAddSourceModal();
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
      this.selectedResource = source;
      this.getfaqsBy(source._id,staged);
    } else {
      this.selectedResource = null;
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
    if(this.selectedResource && this.selectedResource._id){
      resourceId = this.selectedResource._id
    }
    this.loadingTab = true;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      limit: 50,
      offset: 0,
    };
    if (checkStaged && checkStaged==='yes') {
      quaryparms.state = 'Approved';
    } else {
      quaryparms.staged = 'in_review';
    }
    let serviceId = 'get.allFaqs';
    if (resourceId) {
      quaryparms.resourceId = resourceId;
      if(checkStaged){
        serviceId = 'get.faqsByResourcesState';
      } else {
        serviceId = 'get.faqsByResources';
      }
    } else {
      if(checkStaged){
        serviceId = 'get.allFaqsByState';
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
  deleteQuestion(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete FAQ',
        text: 'Are you sure you want to delete selected question?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          dialogRef.close();
          console.log('deleted')
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  deleteAltQuestion(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Alternate Question',
        text: 'Are you sure you want to delete selected alternate question?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          dialogRef.close();
          console.log('deleted')
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
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
