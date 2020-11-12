import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, AfterViewInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { from, interval, Subject, Subscription } from 'rxjs';
import { startWith, elementAt, filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ConvertMDtoHTML } from 'src/app/helpers/lib/convertHTML';
import { FaqsService } from '../../services/faqsService/faqs.service';
import { PdfAnnotationComponent } from '../annotool/components/pdf-annotation/pdf-annotation.component';
declare const $: any;
declare const koreBotChat : any

@Component({
  selector: 'app-faq-source',
  templateUrl: './faq-source.component.html',
  styleUrls: ['./faq-source.component.scss'],
  animations: [fadeInOutAnimation],
  providers: [ { provide: 'instance1', useClass: FaqsService },
            { provide: 'instance2', useClass: FaqsService }, ]
})
export class FaqSourceComponent implements OnInit, AfterViewInit , OnDestroy {
  loadingSliderContent = false;
  serachIndexId;
  currentView = 'list'
  searchSources = '';
  pagesSearch = '';
  selectedFaq: any = null;
  singleSelectedFaq: any = null;
  showAddFaqSection = false;
  selectedApp: any = {};
  resources: any = [];
  polingObj: any = {};
  faqUpdate: Subject<void> = new Subject<void>();
  filterObject = {};
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
  resourcesStatusObj: any = {};
  selectedResource;
  public model: any;
  loadingFaqs = true;
  editfaq = false;
  statusObj: any = {
    failed: { name: 'Failed', color: 'red' },
    successfull: { name: 'Successfull', color: 'green' },
    success: { name: 'Success', color: 'green' },
    queued: { name: 'Queued', color: 'blue' },
    running: { name: 'In Progress', color: 'blue' },
    inProgress: { name: 'In Progress', color: 'blue' },
  };
  contentTypes= {
    webdomain:'WEB',
    document:'DOC'
  }
  faqsObj = {
    faqs: []
  }
  apiLoading = false;
  isAsc = true;
  selectedSort = '';
  faqLimit = 20;
  selectedPage: any = {};
  currentStatusFailed: any = false;
  userInfo: any = {};
  searchFaq = '';
  stageMsgImg = 'https://www.svgrepo.com/show/121146/add-circular-interface-button.svg';
  unStageMsgImg = 'https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/1297235041547546467-512.png';
  statusModalPopRef: any = [];
  addSourceModalPopRef: any = [];
  editFAQModalPopRef:any;
  showSourceAddition:any = null;
  moreLoading:any = {};
  altAddSub: Subscription;
  altCancelSub: Subscription;
  followAddSub: Subscription;
  followCancelSub: Subscription;
  @ViewChild('editQaScrollContainer' , { static: true })editQaScrollContainer?: PerfectScrollbarComponent;
  @ViewChild('fqasScrollContainer' , { static: true })fqasScrollContainer?: PerfectScrollbarComponent;
  @ViewChild('addfaqSourceModalPop') addSourceModalPop: KRModalComponent;
  @ViewChild('editfaqSourceModalPop') editFAQModalPop: KRModalComponent;
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;



  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private convertMDtoHTML:ConvertMDtoHTML,
    @Inject('instance1') private faqServiceAlt: FaqsService,
    @Inject('instance2') private faqServiceFollow: FaqsService
  ) {

  }

  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getfaqsBy();
    this.getSourceList();
    this.getStats();
    this.userInfo = this.authService.getUserInfo() || {};
    this.altAddSub = this.faqServiceAlt.addAltQues.subscribe(params => {
      this.selectedFaq.isAlt = false;
      this.updateFaq(this.selectedFaq, 'updateQA', params);
    });
    this.followAddSub = this.faqServiceFollow.addFollowQues.subscribe(params=> {
      this.selectedFaq.isAddFollow = false;
      this.updateFaq(this.selectedFaq, 'updateQA', params);
    });
    this.followCancelSub = this.faqServiceFollow.cancel.subscribe(data=>{ this.selectedFaq.isAddFollow = false; });
    this.altCancelSub = this.faqServiceAlt.cancel.subscribe(data=>{ this.selectedFaq.isAlt = false; });
  }
    ngAfterViewInit(){
      setTimeout(() => {
        $('#searchFaqs').focus();
      }, 100);
    }
  filterApply(type,value){
    if(this.filterObject[type] === value){
       delete this.filterObject[type]
    } else {
      this.filterObject[type] = value;
    }
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortBy(sort) {
    const data = this.resources.slice();
    this.selectedSort = sort;
    if(this.selectedSort !== sort){
      this.isAsc = true;
    }else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
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
  addNewContentSource(type) {
    this.router.navigate(['/source'], { skipLocationChange: true, queryParams: { sourceType: type } });
  }
  openStatusModal() {
    this.statusModalPopRef  = this.statusModalPop.open();
    this.getJobStatusForMessages();
   }
   closeStatusModal() {
    if (this.statusModalPopRef &&  this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
   }
   openAddSourceModal(edit?) {
     if(!edit){
      this.editfaq = null;
     }
    this.addSourceModalPopRef  = this.addSourceModalPop.open();
   }
   openAddManualFaqModal(){
     
   }
   closeAddsourceModal() {
    if (this.addSourceModalPopRef &&  this.addSourceModalPopRef.close) {
      this.addSourceModalPopRef.close();
    }
   }
   onSourceAdditionClose(){
    this.closeAddsourceModal();
    // this.closeStatusModal()
    this.showSourceAddition = null;
   }
   onSourceAdditionSave(){
    this.closeAddsourceModal();
    this.getSourceList();
    this.closeStatusModal();
    this.getfaqsBy();
    this.getStats();
    this.showSourceAddition = null;
   }
   addFaqSource(type){
     this.showSourceAddition = type;
    // this.openAddSourceModal();
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
      if(this.selectedResource && (this.selectedResource._id === source._id)){
        this.selectedResource = null;
        this.getfaqsBy(null,this.selectedtab);
        this.getStats();
      }else {
        this.selectedResource = source;
        this.getfaqsBy(source._id,this.selectedtab);
        this.getStats(source._id);
      }

    } else {
      this.selectedResource = null;
      this.getfaqsBy(null,this.selectedtab);
      this.getStats();
    }
  }

  addNewFollowUp(event){
    const followUPpayload: any = {
      question: event._source.question,
      defaultAnswers: event._source.defaultAnswers || [],
      conditionalAnswers: event._source.conditionalAnswers || [],
      keywords: event._source.tags
      };
      const existingfollowups =  this.selectedFaq.followupQuestions || [];
      existingfollowups.push(followUPpayload);
    const _payload = {
       followupQuestions: existingfollowups || [],
      };
      this.updateFaq(this.selectedFaq,'updateQA',_payload)
  }
  addManualFaq(event){
    console.log(event);
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'faq',
      faqType:'manual'
    };
    const payload: any = {
      question: event.question,
      defaultAnswers: event.defaultAnswers || [],
      conditionalAnswers: event.conditionalAnswers || [],
      keywords: event.tags
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
  getStats(resourceId?) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    let endPoint = 'get.faqStatics';
    if(resourceId){
     endPoint  = 'get.faqStaticsByResourceFilter';
     quaryparms.resourceId = resourceId;
    }
    this.service.invoke(endPoint, quaryparms).subscribe(res => {
      this.faqSelectionObj.stats = res.countByState;
    }, errRes => {
    });
  }
  onScrolledEnd(event){
    const selectedElements = $('.selectEachfaqInput');
    if(this.faqsObj.faqs && (this.faqsObj.faqs.length  >= (this.faqLimit -1))){
      // this.moreLoading.loading = true;
      // this.moreLoading.loadingText = 'Loading...';
      // this.getfaqsBy(null,null,selectedElements.length)
    }
  }
  searchFaqs(){
    if(this.searchFaq){
      this.loadingTab = true;
      this.getfaqsBy(null,null,null,this.searchFaq);
    } else {
      this.getfaqsBy();
    }
  }
  getJobStatusForMessages(){
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type:'faq'
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(res => {
      if (res && res.length) {
       res.forEach(element => {
        this.resourcesStatusObj[element.resourceId] = element;
       });
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch job status');
    });
  }
  faqsApiService(serviceId, params?,concat?) {
    this.faqs = [];
    if(this.apiLoading){
      return;
    }
    this.apiLoading = true;
    this.service.invoke(serviceId, params).subscribe(res => {
      if(concat){
        this.faqs = this.faqs.concat(res);
      } else {
        this.faqs = _.filter(res,(faq)=>{
              return faq.action!=='delete';
        })
      }
      this.faqsObj.faqs = this.faqs;
      if(this.faqs.length){
         this.moreLoading.loadingText = 'Loading...';
         this.selectedFaq = this.faqs[0];
      } else {
        this.moreLoading.loadingText = 'No more results available';
        const self = this;
        setTimeout( () => {
          self.moreLoading.loading = false;
        },700);
      }
      if(serviceId === 'get.allFaqs'){
        this.faqsAvailable = res.length?true:false;
      }
      this.editfaq = null
      this.apiLoading = false;
      this.loadingFaqs = false;
      this.loadingTab = false;
    }, errRes => {
      this.apiLoading = false;
      this.loadingFaqs = false;
      this.loadingTab = false;
    });
  }
  getfaqsBy(resourceId?, tab? , skip?, quary?) {
    this.showAddFaqSection = false;
    if(this.selectedResource && this.selectedResource._id && !resourceId){
      resourceId = this.selectedResource._id
    }
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      limit: this.faqLimit,
      offset: 0,
      state:this.selectedtab || 'draft'
    };
    if(tab){
      quaryparms.state = tab;
    }
    if(quary){
      quaryparms.searchQuary = quary;
    }
    let serviceId = 'get.allFaqsByState';
    if (resourceId) {
      serviceId = 'get.allFaqsByResources';
      quaryparms.resourceId = resourceId;
    }
    if(quary){
      serviceId = 'get.faqs.search';
    }
    if(skip){
      quaryparms.offset = skip;
    }
    const concatResults = skip?true:false;
    this.faqsApiService(serviceId, quaryparms,concatResults);
  }
  paginate(event){
    this.getfaqsBy(null,null,event.skip)
    this.addRemoveFaqFromSelection(null,null,true);
    // this.perfectScroll.directiveRef.update();
    // this.perfectScroll.directiveRef.scrollToTop(2, 1000);
  }
  selectTab(tab){
    this.loadingTab = true;
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
  confirmFAQswitch(faq) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Confirm',
      text: 'The changes made on this FAQ are not yet saved.',
      text1:'Do you want to switch to another FAQ?',
        buttons: [{ key: 'yes', label: 'Yes',secondaryBtn:true }, { key: 'no', label: 'No', type: 'danger' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.selectedFaq = faq;
          this.editfaq = null;
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  selectedFaqToTrain(faq, e) {
    if(!faq.alternateQuestions || !faq.alternateQuestions.length) {
      e.stopImmediatePropagation();
    }
    if(this.editfaq){
      this.confirmFAQswitch(faq);
    } else {
      this.selectedFaq = faq;
    }
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
  faqUpdateEvent(){
    this.faqUpdate.next();
  }
  editThisQa(){
    this.showSourceAddition = false
    this.editfaq = true;
    this.openEditFAQModal(true);
  }
  openEditFAQModal(edit?) {
   this.editFAQModalPopRef  = this.editFAQModalPop.open();
  }
  closeEditFAQModal() {
   if (this.editFAQModalPopRef &&  this.editFAQModalPopRef.close) {
     this.editFAQModalPopRef.close();
   }
  }
  faqCancle(event?){
   this.editfaq = false;
   this.closeEditFAQModal();
  }
  editFaq(event){
    const _payload:any = {
   question: event._source.question,
   defaultAnswers: event._source.defaultAnswers || [],
   conditionalAnswers: event._source.conditionalAnswers || [],
   alternateQuestions: event._source.alternateQuestions || [],
   followupQuestions: event.followupQuestions || [],
   keywords: event._source.tags,
   state: this.selectedFaq._meta.state
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
      this.notificationService.notify('Selected FAQ updated succesfully','success');
      this.addRemoveFaqFromSelection(null,null,true);
      this.selectAll(true);
      this.selectedFaq = res;
      this.selectedtab = res.state;
      const index = _.findIndex(this.faqs,(faqL)=>{
        return faqL._id ===  this.selectedFaq._id;
         })
         if(index > -1){
           this.faqs[index] = res;
         }
      // this.getfaqsBy();
      this.getStats();
      this.editfaq = false;
      this.closeEditFAQModal();
      this.closeAddsourceModal();
    }, errRes => {
      this.errorToaster(errRes,'Somthing went worng');
    });
  }
  cancleAddFollowUp(){
    if(this.selectedFaq){
      this.selectedFaq.isAddFollow = null
    }
    this.closeAddsourceModal();
  }
  bulkUpdate(action,state?,dialogRef?){
    const payload: any = {};
    let custerrMsg = 'Failed to update faqs'
    let custSucessMsg = 'Selected faqs updated successfully';
    if(action === 'update' && state){
      payload.state = state
    }else if(action === 'delete'){
      payload.action = 'delete'
      custSucessMsg = 'Selected Faqs deleted successfully'
      custerrMsg = 'Failed to delete faqs'
    }
    if(this.faqSelectionObj && this.faqSelectionObj.selectAll){
      payload.allFaqs = true;
      payload.currentState = this.selectedtab;
    } else {
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
    }
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
    }
    this.selectAll(true);
    this.addRemoveFaqFromSelection(null,null,true);
    this.service.invoke('update.faq.bulk', quaryparms,payload).subscribe(res => {
      if(state){
        this.selectTab(state)
      }else {
       this.getfaqsBy();
       this.selectedFaq = null;
      }
      this.getStats();
      this.editfaq = null
      this.notificationService.notify(custSucessMsg,'success');
      if(dialogRef){
        dialogRef.close();
      }
    }, errRes => {
      this.errorToaster(errRes,custerrMsg);
    });
  }
  strArr(s: string): any[] {
    return Array(s);
  }
  deleteSrcAQ(source,dialogRef){
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
      sourceId : source._id
    }
    this.service.invoke('delete.content.source', quaryparms).subscribe(res => {
      dialogRef.close();
      this.notificationService.notify('FAQ source deleted successfully','success');
      const deleteIndex = _.findIndex(this.resources,(fq)=>{
           return fq._id === source._id;
      })
      if (deleteIndex > -1) {
       this.resources.splice(deleteIndex,1);
      }
    }, errRes => {
      this.errorToaster(errRes,'Failed to delete faq source');
    });
  }
  deleteIndFAQ(faq,dialogRef){
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
      faqId : faq._id
    }
    this.service.invoke('delete.content.source', quaryparms).subscribe(res => {
      dialogRef.close();
      this.faqCancle();
      this.notificationService.notify('Faq deleted succesfully','success')
      const deleteIndex = _.findIndex(this.faqs,(fq)=>{
           return fq._id === faq._id;
      })
      if (deleteIndex > -1) {
       this.faqs.splice(deleteIndex,1);
      }
      this.getStats();
      if( !(this.faqs && this.faqs.length)){
        this.selectedFaq = null;
      } else {
        if(this.faqs && this.faqs.length){
          if(this.faqs && this.faqs[deleteIndex]) { // best next possible selection
                this.selectedFaq = this.faqs[deleteIndex];
          } else if (this.faqs[deleteIndex -1]){
            this.selectedFaq = this.faqs[deleteIndex -1];
          } else {
            this.selectedFaq = null;
          }
        }
      }
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
  deleteSource(record,event) {
    if(event){
      event.stopImmediatePropagation();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Resource',
        text: 'Are you sure you want to delete ?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteSrcAQ(record,dialogRef);
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
            this.deleteSrcAQ(record,dialogRef)
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
  addFollowUp() {
    this.faqServiceFollow.updateVariation('followUp');
    this.faqServiceFollow.updateFaqData(this.selectedFaq);
    this.selectedFaq.isAddFollow = true;
    this.showSourceAddition = false;
    this.openAddSourceModal();
    // setTimeout( () =>{
    //   $('#questionList').closest('.ps.ps--active-y').animate({
    //     scrollTop : Math.abs($('#questionList').position().top) + $('#followQue').position().top
    //   });
    // }, 100);
  }
  addAlternate() {
    this.faqServiceAlt.updateVariation('alternate');
    this.faqServiceAlt.updateFaqData(this.selectedFaq);
    this.selectedFaq.isAlt = true;
    setTimeout(() =>{
      $('#questionList').closest('.ps.ps--active-y').animate({
        scrollTop : Math.abs($('#questionList').position().top) + $('#altQue').position().top
      });
    }, 100);
  }

  delAltQues(ques) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Alternate Question',
        text: 'Are you sure you want to delete this alternate question?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.selectedFaq.alternateQuestions = _.without(this.selectedFaq.alternateQuestions, _.findWhere(this.selectedFaq.alternateQuestions, { _id: ques._id }));
          const params = {
            question: this.selectedFaq.question,
            answer: this.selectedFaq.answer,
            alternateQuestions: this.selectedFaq.alternateQuestions || [],
            followupQuestions: this.selectedFaq.followupQuestions || []
          };
          this.updateFaq(this.selectedFaq, 'updateQA', params);
          dialogRef.close();
        } else if (result === 'no') { dialogRef.close(); }
      });
  }

  delFollowQues(ques) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Followup Question',
        text: 'Are you sure you want to delete this followup question?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.selectedFaq.followupQuestions = _.without(this.selectedFaq.followupQuestions, _.findWhere(this.selectedFaq.followupQuestions, {_id: ques._id }));
          const params = {
            question: this.selectedFaq.question,
            answer: this.selectedFaq.answer,
            alternateQuestions: this.selectedFaq.alternateQuestions || [],
            followupQuestions: this.selectedFaq.followupQuestions || []
          };
          this.updateFaq(this.selectedFaq, 'updateQA', params);
          dialogRef.close();
        } else if (result === 'no') { dialogRef.close(); }
      });
  }

  openStatusSlider() {
    this.sliderComponent.openSlider('#faqsSourceSlider', 'right500');
  }
  closeStatusSlider() {
    this.sliderComponent.closeSlider('#faqsSourceSlider');
  }
  // Re-Annotate document on-demand
  reAnnotateDocument(source) {
    const dialogRef = this.dialog.open(PdfAnnotationComponent, {
      data: { type: 'reannotate', pdfResponse: null, source: source },
      panelClass: 'kr-annotation-modal',
      disableClose: true,
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe(res => {

    });
  }
  ngOnDestroy() {
    if(this.pollingSubscriber){
      this.pollingSubscriber.unsubscribe();
    }
    this.altAddSub?this.altAddSub.unsubscribe(): false;
    this.altCancelSub?this.altCancelSub.unsubscribe(): false;
    this.followAddSub?this.followAddSub.unsubscribe(): false;
    this.followCancelSub?this.followCancelSub.unsubscribe(): false;
  }
}
