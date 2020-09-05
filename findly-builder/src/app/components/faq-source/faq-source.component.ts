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
import { startWith, elementAt, filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
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
  singleSelectedFaq: any = null;
  showAddFaqSection = false;
  selectedApp: any = {};
  resources: any = [];
  polingObj: any = {};
  faqSelectionObj:any ={
    selectAll:false,
    selectedItems:{},
    selectedCount:0,
    stats:{}
  }
  pollingSubscriber;
  faqs:any = [];
  faqsAvailable = false;
  selectedtab = 'draft';
  selectAllFaqs = false;
  loadingTab = false;
  resourcesObj: any = {};
  selectedResource;
  public model: any;
  loadingFaqs = true;
  editfaq = false;
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
  @ViewChild('editQaScrollContainer' , { static: true })editQaScrollContainer?: PerfectScrollbarComponent;
  @ViewChild('fqasScrollContainer' , { static: true })fqasScrollContainer?: PerfectScrollbarComponent;
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
    this.getStats();
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
    this.getfaqsBy();
   }
   addFaqSource(type){
     this.showSourceAddition = type;
    this.openAddSourceModal();
   }
   errorToaster(errRes,message){
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
  }
 }
   addRemoveFaqFromSelection(faqId,addtion,clear?){
     if(clear){
      this.faqSelectionObj.selectedItems = {};
      this.faqSelectionObj.selectedCount = 0;
      this.faqSelectionObj.selectAll = false;
     } else {
      if(faqId){
        if(addtion){
          this.faqSelectionObj.selectedItems[faqId] = {};
        } else {
          if(this.faqSelectionObj.selectedItems[faqId]){
            delete this.faqSelectionObj.selectedItems[faqId]
          }
        }
      }
      this.faqSelectionObj.selectedCount = Object.keys(this.faqSelectionObj.selectedItems).length;
     }
   }
  selectAll(unselectAll?) {
    const allFaqs = $('.selectEachfaqInput');
    if (allFaqs && allFaqs.length){
      $.each(allFaqs, (index,element) => {
        if($(element) && $(element).length){
          $(element)[0].checked = unselectAll?false: this.faqSelectionObj.selectAll;
          const faqId = $(element)[0].id.split('_')[1]
          this.addRemoveFaqFromSelection(faqId,this.faqSelectionObj.selectAll);
        }
      });
    };
    if(unselectAll){
      $('#selectAllFaqs')[0].checked = false;
    }
    const selectedElements = $('.selectEachfaqInput:checkbox:checked');
  }
  checkUncheckfaqs(faq){
    const selectedElements = $('.selectEachfaqInput:checkbox:checked');
    const allElements = $('.selectEachfaqInput');
    if(selectedElements.length === allElements.length){
      $('#selectAllFaqs')[0].checked = true;
    } else {
      $('#selectAllFaqs')[0].checked = false;
    }
    const element = $('#selectFaqCheckBox_' + faq._id);
    const addition =  element[0].checked
    this.addRemoveFaqFromSelection(faq._id,addition);
    this.singleSelectedFaq = faq;
  }
  selectResourceFilter(source?){
    if(source){
      this.selectedResource = source;
      this.getfaqsBy(source._id,this.selectedtab);
    } else {
      this.selectedResource = null;
      this.getfaqsBy(null,this.selectedtab);
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
       this.getFaqsOnSelection();
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
  getStats() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    this.service.invoke('get.faqStatics', quaryparms).subscribe(res => {
      this.faqSelectionObj.stats = res.countByState;
    }, errRes => {
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
  getfaqsBy(resourceId?, tab? , skip?) {
    this.showAddFaqSection = false;
    if(this.selectedResource && this.selectedResource._id && !resourceId){
      resourceId = this.selectedResource._id
    }
    this.loadingTab = true;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      limit: 100,
      offset: 0,
      state:this.selectedtab || 'draft'
    };
    if(tab){
      quaryparms.state = tab;
    }
    let serviceId = 'get.allFaqsByState';
    if (resourceId) {
      serviceId = 'get.allFaqsByResources';
      quaryparms.resourceId = resourceId;
    }
    if(skip){
      quaryparms.offset = skip;
    }
    this.faqsApiService(serviceId, quaryparms);
  }
  selectTab(tab){
    this.selectedFaq=null
    this.selectedtab = tab;
    this.getFaqsOnSelection();
  }
  getFaqsOnSelection(){
    this.addRemoveFaqFromSelection(null,null,true);
    this.getfaqsBy(null , this.selectedtab);
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
  editThisQa(){
    this.editfaq = true;
  }
  faqCancle(event){
   this.editfaq = false;
  }
  editFaq(event){
    const _payload = {
      question: event.question,
   answer: event.answer,
   alternateQuestions: [],
   keywords: event.tags,
   state: event.state
    };
    this.updateFaq(this.selectedFaq,'updateQA',_payload)
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
  updateFaq(faq,action,params){
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
      faqId:faq._id,
    }
    let payload:any={}
    if(action === 'stateUpdate'){
      payload.state = params;
    }
    if(action==='updateQA'){
      payload = params;
    }
    this.service.invoke('update.faq', quaryparms,payload).subscribe(res => {
      this.addRemoveFaqFromSelection(null,null,true);
      this.selectAll(true);
      this.selectedFaq = res;
      this.selectedtab = res.state;
      this.getfaqsBy();
      this.getStats();
      this.editfaq = false;
    }, errRes => {
      this.errorToaster(errRes,'Somthing went worng');
    });
  }
  bulkUpdate(action,state?,dialogRef?){
    const payload: any = {
      faqs : [],
    };
    let custerrMsg = 'Failed to update faqs'
    if(action === 'update' && state){
      payload.state = state
    }else if(action === 'delete'){
      payload.action = 'delete'
      custerrMsg = 'Failed to delete faqs'
    }
    const selectedElements = $('.selectEachfaqInput:checkbox:checked');
    const sekectedFaqsCollection:any = [];
    if(selectedElements && selectedElements.length){
      $.each(selectedElements,(i,ele) =>{
        const  faqId = $(ele)[0].id.split('_')[1];
        const tempobj= {
          _id:faqId
        }
          sekectedFaqsCollection.push(tempobj);
      })
    }
    payload.faqs = sekectedFaqsCollection;
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
    }
    this.selectAll(true);
    this.addRemoveFaqFromSelection(null,null,true);
    this.service.invoke('update.faq.bulk', quaryparms,payload).subscribe(res => {
      this.getfaqsBy();
      this.getStats();
      if(dialogRef){
        dialogRef.close();
      }
    }, errRes => {
      this.errorToaster(errRes,custerrMsg);
    });
  }
  tempRecordDelete(id){
    const deleteIndex = _.findIndex(this.faqs,(fq)=>{
      return fq._id === id;
    })
    if (deleteIndex > -1) {
      this.faqs.splice(deleteIndex,1);
    }
  }
  strArr(s: string): any[] {
    return Array(s);
  }
  deleteSrcAQ(source,event,dialogRef){
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
      sourceId : source._id
    }
    this.service.invoke('delete.faq.source', quaryparms).subscribe(res => {
      dialogRef.close();
      const deleteIndex = _.findIndex(this.resources,(fq)=>{
           return fq._id === source._id;
      })
      if (deleteIndex > -1) {
       this.resources.splice(deleteIndex,1);
      }
    }, errRes => {
    });
  }
  deleteIndFAQ(faq,dialogRef){
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
      faqId : faq._id
    }
    this.service.invoke('delete.faq.ind', quaryparms).subscribe(res => {
      dialogRef.close();
      const deleteIndex = _.findIndex(this.faqs,(fq)=>{
           return fq._id === faq._id;
      })
      if (deleteIndex > -1) {
       this.faqs.splice(deleteIndex,1);
      }
      this.getStats();
      this.selectedFaq = null;
    }, errRes => {
      this.errorToaster(errRes,'Failed to delete faq');
    });
  }
  deleteInfividualQuestion(record) {
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
          this.deleteIndFAQ(record,dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  deleteQuestion(type,record,event) {
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
          if(type === 'qstnFAQ'){
              this.bulkUpdate('delete',null,dialogRef)
          }else{
            this.deleteSrcAQ(record,event,dialogRef)
          }
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
