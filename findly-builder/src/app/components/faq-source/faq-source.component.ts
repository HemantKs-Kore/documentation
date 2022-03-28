import { Component, OnInit, Input, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, AfterViewInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { from, interval, Subject, Subscription } from 'rxjs';
import { startWith, elementAt, filter, pluck } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ConvertMDtoHTML } from 'src/app/helpers/lib/convertHTML';
import { FaqsService } from '../../services/faqsService/faqs.service';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { PdfAnnotationComponent } from '../annotool/components/pdf-annotation/pdf-annotation.component';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { CdkDragDrop, moveItemInArray ,transferArrayItem} from '@angular/cdk/drag-drop';
// import {  DockStatusService } from '../../services/dock.status.service';
// import { DockStatusService } from '../../services/dockstatusService/dock-status.service';

declare const $: any;
import * as moment from 'moment';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { D, F } from '@angular/cdk/keycodes';
import { SideBarService } from './../../services/header.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { ThrowStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-faq-source',
  templateUrl: './faq-source.component.html',
  styleUrls: ['./faq-source.component.scss'],
  animations: [fadeInOutAnimation],
  providers: [{ provide: 'instance1', useClass: FaqsService },
  { provide: 'instance2', useClass: FaqsService },]
})
export class FaqSourceComponent implements OnInit, AfterViewInit, OnDestroy {
  loadingSliderContent = false;
  serachIndexId;
  currentView = 'list'
  searchSources = '';
  pagesSearch = '';
  viewDetails: boolean;
  // addAltFaq :any;
  selectedFaq: any = null;
  numberOf: any = {};
  singleSelectedFaq: any = null;
  showAddFaqSection = false;
  noManulaRecords: boolean = false;
  selectedApp: any = {};
  fileName: ' ';
  statsApiLoading = false;
  extractedResources: any = [];
  resources: any = [];
  filters: any = [];
  duriationDays:any;
  duriationTime:any;
  polingObj: any = {};
  faqUpdate: Subject<void> = new Subject<void>();
  filterObject = {};
  manualFilterSelected = false;
  initialFaqCall = false;
  showResponse: boolean;
  loading = false;
  faqSelectionObj: any = {
    selectAll: false,
    selectedItems: {},
    deSelectedItems :{},
    selectedCount: 0,
    stats: {},
    loadingStats: true
  }
  // deSelectedItems: any = [];
  newCommentObj = {
    comment: ''
  }
  activeClose = false;
  faqComments: any = [];
  pollingSubscriber;
  showSearch;
  searchallFaq: any = '';
  faqs: any = [];
  faqsAvailable = false;
  selectedtab = 'draft';
  selectAllFaqs = false;
  loadingTab = false;
  resourcesStatusObj: any = {};
  selectedResource;
  public model: any;
  loadingFaqs = true;
  editfaq = false;
  selectedFaqToEdit;
  previousSearchQuery = '';
  statusObj: any = {
    failed: { name: 'Failed', color: 'red' },
    successfull: { name: 'Successfull', color: 'green' },
    SUCCESS: { name: 'Success', color: 'green' },
    queued: { name: 'In-Queue', color: 'blue' },
    running: { name: 'In Progress', color: 'blue' },
    configured: { name: 'Annotation paused', color: '#FF784B' },
    inProgress: { name: 'In Progress', color: 'blue' },
  };
  contentTypes = {
    webdomain: 'WEB',
    document: 'File',
    manual: 'Manual'
  }
  filterSystem: any = {
    'typeHeader': 'type',
    'statusHeader': 'status',
    'typefilter': 'all',
    'statusFilter': 'all'
  }
  firstFilter: any = { 'header': '', 'source': '' };
  statusArr = [];
  docTypeArr = [];
  filterResourcesBack;
  filterTableheaderOption = "";
  filterTableSource = "all";
  faqsObj = {
    faqs: []
  }
  apiLoading = false;
  isNotSearching = false;
  extractedFaqs = false;
  isAsc = true;
  selectedSort = '';
  faqLimit = 10;
  selectedPage: any = {};
  currentStatusFailed: any = false;
  userInfo: any = {};
  searchFaq = '';
  stageMsgImg = 'https://www.svgrepo.com/show/121146/add-circular-interface-button.svg';
  unStageMsgImg = 'https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/1297235041547546467-512.png';
  statusModalPopRef: any = [];
  addSourceModalPopRef: any = [];
  editFAQModalPopRef: any;
  showSourceAddition: any = null;
  moreLoading: any = {};
  altAddSub: Subscription;
  altCancelSub: Subscription;
  followAddSub: Subscription;
  followCancelSub: Subscription;
  componentType: string = 'addData';
  openExtractsSubs: Subscription;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  sortedObject = {
    'type': 'fieldName',
    'position':'up',
    "value": 1,
  }

  @ViewChild('editQaScrollContainer', { static: true }) editQaScrollContainer?: PerfectScrollbarComponent;
  @ViewChild('fqasScrollContainer', { static: true }) fqasScrollContainer?: PerfectScrollbarComponent;
  @ViewChild('addfaqSourceModalPop') addSourceModalPop: KRModalComponent;
  @ViewChild('editfaqSourceModalPop') editFAQModalPop: KRModalComponent;
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(
    public cdRef: ChangeDetectorRef,
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    // private dock: DockStatusService,
    private convertMDtoHTML: ConvertMDtoHTML,
    // public dockService: DockStatusService,
    private headerService: SideBarService,
    public inlineManual: InlineManualService,
    private appSelectionService: AppSelectionService,
    public mixpanel: MixpanelServiceService,
    @Inject('instance1') private faqServiceAlt: FaqsService,
    @Inject('instance2') private faqServiceFollow: FaqsService
  ) {
    window.alert = function () { };
  }

  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getStats(null, true);
    // this.getfaqsBy();
    this.getSourceList(true);
    this.getDyanmicFilterData(null,'landingPage');
    if((this.resources && this.resources.length === 0)){
      this.getJobStatusForMessages();
      this.getSourceList(true);
    }
    else {
      this.getSourceList(true);
    }

    this.userInfo = this.authService.getUserInfo() || {};
    this.altAddSub = this.faqServiceAlt.addAltQues.subscribe(params => {
      this.selectedFaq.isAlt = false;
      this.updateFaq(this.selectedFaq, 'updateQA', params);
    });
    this.followAddSub = this.faqServiceFollow.addFollowQues.subscribe(params => {
      this.selectedFaq.isAddFollow = false;
      this.updateFaq(this.selectedFaq, 'updateQA', params);
    });
    this.followCancelSub = this.faqServiceFollow.cancel.subscribe(data => { this.selectedFaq.isAddFollow = false; });
    this.altCancelSub = this.faqServiceAlt.cancel.subscribe(data => { this.selectedFaq.isAlt = false; });
    this.openExtractsSubs = this.headerService.openFaqExtractsFromDocker.subscribe((res) => {
      this.openStatusModal()
    });

  }
  ngAfterViewInit() {
    setTimeout(() => {
      $('#searchFaqs').focus();
    }, 100);
  }
  filterApply(type, value) {
    if (this.filterObject[type] === value) {
      delete this.filterObject[type]
    } else {
      this.filterObject[type] = value;
    }
  }
  loadingFaqs1: boolean;
  loadImageText: boolean = false;
  imageLoad() {
    this.loadingFaqs = false;
    this.loadingFaqs1 = true;
    this.loadImageText = true;
    // if (!this.inlineManual.checkVisibility('ADD_FAQ_FROM_LANDING')) {
    //   this.inlineManual.openHelp('ADD_FAQ_FROM_LANDING')
    //   this.inlineManual.visited('ADD_FAQ_FROM_LANDING')
    // }
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortBy(sort) {
    const data = this.extractedResources.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
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
    this.extractedResources = sortedData;
  }
  addNewContentSource(type) {
    this.router.navigate(['/source'], { skipLocationChange: true, queryParams: { sourceType: type } });
  }
  openStatusModal() {
    this.statusModalPopRef = this.statusModalPop.open();
    this.getJobStatusForMessages();
  }
  closeStatusModal(extractedFaqs?) {
    if (this.statusModalPopRef && this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
      this.extractedFaqs
    }
    if ((this.extractedResources && this.extractedResources.length)) {
      this.loadingFaqs = false;
      this.loadingFaqs1 = true;
    }
    else {
      this.loadingFaqs1 = true;
    }
    if (extractedFaqs) {
      this.getStats(null, true);
      this.getSourceList();
    } else {
      this.getStats(null, true);
    }

  }
  openAddSourceModal(edit?) {
    if (!edit) {
      this.editfaq = null;
    }
    this.addSourceModalPopRef = this.addSourceModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  openAddManualFaqModal() {

  }
  closeAddsourceModal() {
    if (this.addSourceModalPopRef && this.addSourceModalPopRef.close) {
      this.addSourceModalPopRef.close();
    }
  }
  onSourceAdditionClose() {
    this.closeAddsourceModal();
    // this.closeStatusModal()
    this.showSourceAddition = null;
    this.getSourceList();
  }
  closeSourcePopupEvent() {
    this.closeAddsourceModal();
    this.showSourceAddition = null;
    this.openStatusModal();
    this.extractedFaqs = true
    // this.getJobStatusForMessages();
  }
  onSourceAdditionSave() {
    this.manualFilterSelected = false;
    this.selectedResource = null;
    this.closeAddsourceModal();
    // this.getSourceList();
    this.closeStatusModal();
    if (this.faqs && this.faqs.length === 0) {
      if (this.showSourceAddition !== 'manual')
        this.openStatusModal();
      this.extractedFaqs = true
      this.getJobStatusForMessages();
    }
    this.showSourceAddition = null;
  }
  addFaqSource(type) {
    this.showSourceAddition = type;
    // this.addAltFaq={
    //   _source :{
    //     faq_alt_question : []
    //   }
    // }
    // this.openAddSourceModal();
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  addRemoveFaqFromSelection(faqId, addtion, clear?) {
    if (clear) {
      this.faqSelectionObj.selectedItems = {};
      this.faqSelectionObj.deSelectedItems = {};
      this.faqSelectionObj.selectedCount = 0;
      this.faqSelectionObj.selectAll = false;
    } else {
      if (faqId) {
        if (addtion) {
        //  delete this.faqSelectionObj.deSelectedItems
          this.faqSelectionObj.selectedItems[faqId] = {};
        } else {
          this.faqSelectionObj.deSelectedItems[faqId] = {}
          delete this.faqSelectionObj.selectedItems[faqId]
          
        }
      }
      this.faqSelectionObj.selectedCount = Object.keys(this.faqSelectionObj.selectedItems).length;
    }
  }
  resetCheckboxSelect() {
    this.faqSelectionObj = {
      selectAll: false,
      selectedItems: {},
      selectedCount: 0,
      stats: {},
      loadingStats: true
    }
  }
  selectAllPartially() {
    const selectedElements = $('.selectEachfaqInput:checkbox:checked');
    if (selectedElements.length !== this.faqs.length) {
      this.faqSelectionObj.selectAll = true;
      this.selectAll();
      setTimeout(() => {
        if ((this.selectedtab === 'draft' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.draft) || (this.selectedtab === 'in_review' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.in_review) || (this.selectedtab === 'approved' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.approved)) {
          $('#selectAllFaqs')[0].checked = true;
          this.faqSelectionObj.selectAll = true;
        } else {
          $('#selectAllFaqs')[0].checked = false;
          this.faqSelectionObj.selectAll = false;
        }
      }, 100)
    } else {
      this.selectAll(true);
    }
    setTimeout(() => {
      if ((this.selectedtab === 'draft' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.draft) || (this.selectedtab === 'in_review' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.in_review) || (this.selectedtab === 'approved' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.approved)) {
        $('#selectAllFaqs')[0].checked = true;
        this.faqSelectionObj.selectAll = true;
      } else {
        $('#selectAllFaqs')[0].checked = false;
        this.faqSelectionObj.selectAll = false;
      }
    }, 150)

  }
  headerSelectAll() {
    this.selectAll();
    if ((this.selectedtab === 'draft' && this.faqs.length == this.faqSelectionObj.stats.draft) || (this.selectedtab === 'in_review' && this.faqs.length == this.faqSelectionObj.stats.in_review) || (this.selectedtab === 'approved' && this.faqs.length == this.faqSelectionObj.stats.approved)) {
      this.faqSelectionObj.selectAll = true;
    } else {
      this.faqSelectionObj.selectAll = false;
    }
  }
  selectAll(unselectAll?) {
    const allFaqs = $('.selectEachfaqInput');
    if (allFaqs && allFaqs.length) {
      $.each(allFaqs, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = unselectAll ? false : this.faqSelectionObj.selectAll;
          const faqId = $(element)[0].id.split('_')[1]
          this.addRemoveFaqFromSelection(faqId, this.faqSelectionObj.selectAll);
        }
      });
    };
    if (unselectAll) {
      $('#selectAllFaqs')[0].checked = false;
      this.faqSelectionObj.selectAll = false;
    }
    const selectedElements = $('.selectEachfaqInput:checkbox:checked');
  }
  selectAllRecords() {
    this.faqSelectionObj.selectAll = true;
    this.selectAll();
  }
  checkUncheckfaqs(faq) {
    const selectedElements = $('.selectEachfaqInput:checkbox:checked');
    const allElements = $('.selectEachfaqInput');
    // if (selectedElements.length > 1) {
    const element = $('#selectFaqCheckBox_' + faq._id);
    const addition = element[0].checked
    this.addRemoveFaqFromSelection(faq._id, addition);
    if ((this.selectedtab === 'draft' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.draft) || (this.selectedtab === 'in_review' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.in_review) || (this.selectedtab === 'approved' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.approved)) {
      $('#selectAllFaqs')[0].checked = true;
      this.faqSelectionObj.selectAll = true;
    } else {
      $('#selectAllFaqs')[0].checked = false;
      this.faqSelectionObj.selectAll = false;
    }
    if ((this.selectedtab === 'draft' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.draft) || (this.selectedtab === 'in_review' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.in_review) || (this.selectedtab === 'approved' && this.faqSelectionObj.selectedCount == this.faqSelectionObj.stats.approved) || this.searchFaq) {
      $('#selectAllFaqs')[0].checked = true;
      this.faqSelectionObj.selectAll = false;
    }
    this.singleSelectedFaq = faq;
  }

  markSelectedFaqs(faqs) {
    if (this.faqSelectionObj.selectAll) {
      this.selectAllRecords()
      // faqs.forEach((e) => {
      //   $('#selectFaqCheckBox_' + e._id)[0].checked = true;
      //   this.checkUncheckfaqs(e);
      // });
    } else {
      if (Object.keys(this.faqSelectionObj.selectedItems).length) {
        Object.keys(this.faqSelectionObj.selectedItems).forEach((key) => {
          let index = faqs.findIndex((d) => d._id === key);
          if (index > -1) {
            $('#selectFaqCheckBox_' + key)[0].checked = true;
            this.checkUncheckfaqs(faqs[index]);
          }
        })
      }
    }
  }
  manualFaqsFilter() {
    this.manualFilterSelected = true;
    this.getfaqsBy('manual', this.selectedtab);
    // this.getStats('manual');
  }
  selectResourceFilter(source?) {
    // console.log("source", source)
    this.loadingTab = true;
    this.manualFilterSelected = false;
    if (source) {
      this.selectedResource = null;
      if (this.selectedResource && (this.selectedResource._id === source._id)) {
        this.getfaqsBy();
        this.getStats();
        // this.faqUpdateEvent();
      } else {
        this.selectedResource = source;
        this.getfaqsBy(source._id, this.selectedtab);
        this.getStats(source._id);
        this.faqUpdateEvent();
      }

    } else {
      this.selectedResource = null;
      this.getfaqsBy(null, this.selectedtab);
      this.getStats();
      this.faqUpdateEvent();
    }
  }

  addNewFollowUp(event) {
    const followUPpayload: any = {
      question: event._source.question,
      defaultAnswers: event._source.defaultAnswers || [],
      conditionalAnswers: event._source.conditionalAnswers || [],
      keywords: event._source.tags,
      alternateQuestions : event._source.alternateQuestions || []
    };
    const existingfollowups = [];
    if (this.selectedFaq._meta.followupQuestions && this.selectedFaq._meta.followupQuestions.length) {
      this.selectedFaq._meta.followupQuestions.forEach(followup => {
        if (followup && followup._source) {
          const tempObjPayload: any = {
            question: followup._source.question,
            defaultAnswers: followup._source.defaultAnswers || [],
            conditionalAnswers: followup._source.conditionalAnswers || [],
            keywords: followup._source.tags,
            alternateQuestions: followup._source.alternateQuestions,
            extractionType: 'faq',
          };
          existingfollowups.push(tempObjPayload);
        }
      });
    }
    existingfollowups.push(followUPpayload);
    const _payload = {
      followupQuestions: existingfollowups || [],
    };
    this.updateFaq(this.selectedFaq, 'updateQA', _payload)
  }
  addManualFaq(event) {
    // console.log(event);
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'faq',
      faqType: 'manual'
    };
    const payload: any = {
      question: event.question,
      defaultAnswers: event.defaultAnswers || [],
      conditionalAnswers: event.conditionalAnswers || [],
      keywords: event.tags
    };
    this.service.invoke('add.sourceMaterialFaq', quaryparms, payload).subscribe(res => {
      this.showAddFaqSection = false;
      this.selectTab('draft');
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
  clearContent() {
    this.newCommentObj.comment = '';
  }
  saveComment() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      faqId: this.selectedFaq._id,
      sourceId: this.selectedFaq.extractionSourceId || 'faq'
    };
    const payload: any = {
      text: this.newCommentObj.comment
    }
    this.service.invoke('add.comment', quaryparms, payload).subscribe(res => {
      res.createdOn = moment(res.createdOn).fromNow();
      if (res.userDetails && res.userDetails.fullName) {
        res.initial = res.userDetails.fullName.slice(0, 1);
      }
      // res.color = this.getRandomRolor();
      this.faqComments.push(res);
      this.clearContent();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to  comment');
      // this.clearContent();
    });
    $('#changePlaceholder').attr('placeholder', 'Reply');
  }
  getRandomRolor() {
    let letters = '012345'.split('');
    let color = '#';
    color += letters[Math.round(Math.random() * 5)];
    letters = '0123456789ABCDEF'.split('');
    for (let i = 0; i < 5; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  };
  getFaqComment(faq) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      faqId: faq._id,
      sourceId: faq.extractionSourceId || 'faq'
    };
    this.service.invoke('get.comments', quaryparms).subscribe(res => {
      if (res && res.length) {
        res.forEach(element => {
          if (element.userDetails && element.userDetails.fullName) {
            element.initial = element.userDetails.fullName.slice(0, 1);
          }
          // element.color = this.getRandomRolor();
          element.createdOn = moment(element.createdOn).fromNow()
        });
      }
      this.faqComments = res || [];
      this.clicksViews();
    }, errRes => {
    });
  }
  getStats(resourceId?, isInitialFaqCall?) {
    // console.log("resourceId", resourceId)
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    let endPoint = 'get.faqStatics';
    if (resourceId) {
      endPoint = 'get.faqStaticsByResourceFilter';
      quaryparms.resourceId = resourceId;
    }
    if (resourceId === 'manual') {
      endPoint = 'get.faqStaticsManualFilter';
    }
    if (this.statsApiLoading) {
      return;
    }
    this.statsApiLoading = true;
    this.service.invoke(endPoint, quaryparms).subscribe(res => {
      this.statsApiLoading = false;
      // console.log("manula issu", res)
      this.faqSelectionObj.stats = res.countByState;
      // this.faqSelectionObj.stats = res.countBySource; 
      this.faqSelectionObj.loadingStats = false;
      if (resourceId === undefined || resourceId === null) {
        if (res.countBySource && res.countBySource.manual) {
          this.noManulaRecords = true;
        }
        else {
          this.noManulaRecords = false;
        }
      }
      if (isInitialFaqCall) {
        this.initialFaqCall = true;
        if (this.faqSelectionObj.stats.draft) {
          this.selectTab('draft');
        } else if (this.faqSelectionObj.stats.in_review) {
          if (this.selectedtab == 'approved' && this.faqSelectionObj.stats.approved) {
            this.selectTab('approved');
          } else {
            this.selectTab('in_review');
          }
        } else if (this.faqSelectionObj.stats.approved) {
          this.selectTab('approved');
        } else {
          this.selectTab('draft');
        }
      }
    }, errRes => {
      this.statsApiLoading = false;
    });
  }
  onScrolledEnd(event) {
    const selectedElements = $('.selectEachfaqInput');
    if (this.faqsObj.faqs && (this.faqsObj.faqs.length >= (this.faqLimit - 1))) {
      // this.moreLoading.loading = true;
      // this.moreLoading.loadingText = 'Loading...';
      // this.getfaqsBy(null,null,selectedElements.length)
    }
  }
  searchFaqs() {
    this.apiLoading = false;
    this.isNotSearching = true;
    if (this.searchFaq) {
      // this.loadingTab = true;
      this.getfaqsBy(null, null, null, this.searchFaq);
    } else {
      this.getfaqsBy();
      this.searchFaq = ''
    }
    // console.log(this.searchFaq, 'search');

  }
  getJobStatusForMessages(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?,request?) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'faq'
    };
    let payload:any = {}
    if(!sortHeaderOption && !headerOption){
       payload ={
        "extractionType": "faq",
        "sort":{
          "name" : -1
        } 
      }
    }
    else{
      payload = request
    }
    if(this.searchFaq){
      payload.search = this.searchFaq;
    }
    if(this.searchSources){
      payload.search = this.searchSources;
    }
    this.service.invoke('get.source.list', quaryparms,payload).subscribe(res => { //get.job.status
      this.resources = [...res.sources];
      this.extractedResources = [...res.sources];
      if (this.extractedResources.length) {
        this.statusArr = [];
        this.docTypeArr = [];
        this.extractedResources.forEach(element => {
          this.statusArr.push(element.recentStatus);
          this.docTypeArr.push(element.contentSource);
        });
        this.statusArr = [...new Set(this.statusArr)]
        this.docTypeArr = [...new Set(this.docTypeArr)]

      }
      this.filterResourcesBack = [...this.extractedResources];
      this.getDyanmicFilterData(searchValue,'manageExract');
      // this.filterTable(this.filterTableSource, this.filterTableheaderOption)


      if (res.sources && res.sources.length) {
        res.sources.forEach((d: any) => {
          if (d.extractedFaqsCount === 0) {
            let index = this.resources.findIndex((f) => f.name == d.name);
            if (index > -1) {
              this.resources.splice(index, 1);
            }
          }
        });
        res = [...this.resources];
        this.resources = res.reverse();
        res.forEach(element => {
          this.resourcesStatusObj[element.resourceId] = element;
        });
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch job status');
    });
  }
  faqsApiService(serviceId, params?, concat?) {
    // console.log("serviceID", serviceId, params)
    // if ((this.apiLoading && !params.searchQuary) || ((this.previousSearchQuery == this.searchFaq) && this.searchFaq && this.previousSearchQuery && !params.offset)) {
    if ((this.apiLoading)) {
      return;
    }
    this.faqs = [];
    this.previousSearchQuery = this.searchFaq;
    this.apiLoading = true;
    if (!this.initialFaqCall) {
      this.loading = true;
    }
    this.service.invoke(serviceId, params).subscribe((res: any) => {
      this.initialFaqCall = false;
      // console.log("service res", res);
      this.loading = false;
      this.isNotSearching = false;
      this.faqs = ((res || {}).faqs || []);
      // if (concat) {
      //   this.faqs = this.faqs.concat((res||{}).faqs || []);
      // } else {
      //   this.faqs = _.filter(((res||{}).faqs || []), (faq) => {
      //     return faq.action !== 'delete';
      //   })
      // }
      this.faqSelectionObj.stats[this.selectedtab || 'draft'] = (res || {}).count || 0;
      this.faqsObj.faqs = this.faqs;
      if (params.resourceId === 'manual' && this.faqs.length) {
        this.getStats(this.faqs[0].extractionSourceId)
      }
      if (this.faqs.length) {
        this.moreLoading.loadingText = 'Loading...';
        this.selectFaq(this.faqs[0]);
      } else {
        if (params.searchQuary) {
          this.selectedFaq = null;
        }
        this.moreLoading.loadingText = 'No more results available';
        const self = this;
        setTimeout(() => {
          self.moreLoading.loading = false;
        }, 700);
      }
      if (serviceId === 'get.allFaqs') {
        this.faqsAvailable = ((res || {}).faqs || []).length ? true : false;
      }
      setTimeout(() => {
        this.markSelectedFaqs(this.faqs);
      }, 100)
      // setTimeout(()=> {
      //   this.selectAll()
      // }, 1)
      // FAQ Overview
      if (!this.inlineManual.checkVisibility('FAQ_OVERVIEW')) {
        this.inlineManual.openHelp('FAQ_OVERVIEW')
        this.inlineManual.visited('FAQ_OVERVIEW')
      }

      this.editfaq = null
      this.apiLoading = false;
      this.loadingFaqs = false;
      this.loadingTab = false;
    }, errRes => {
      this.isNotSearching = false
      this.loading = false;
      this.apiLoading = false;
      this.loadingFaqs = false;
      this.loadingTab = false;
    });
  }
  getfaqsBy(resourceId?, tab?, skip?, quary?) {
    this.showAddFaqSection = false;
    if (this.selectedResource && this.selectedResource._id && !resourceId) {
      resourceId = this.selectedResource._id
    }
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      limit: this.faqLimit,
      offset: 0,
      state: this.selectedtab || 'draft'
    };
    if (tab) {
      quaryparms.state = tab;
    }
    if (quary) {
      quaryparms.searchQuary = quary;
    }
    let serviceId = 'get.allFaqsByState';
    if (resourceId) {
      serviceId = 'get.allFaqsByResources';
      quaryparms.resourceId = resourceId;
    }
    if (quary) {
      serviceId = 'get.faqs.search';
    }
    if (resourceId === 'manual') {
      serviceId = 'get.allManualFaqsByState';
      if (quary) {
        serviceId = 'get.faqs.searchManual';
      }
    }
    if (skip) {
      quaryparms.offset = skip;
    }
    const concatResults = skip ? true : false;
    this.faqsApiService(serviceId, quaryparms, concatResults);
  }
  paginate(event) {
    // if(this.faqSelectionObj.selectAll){
    //   this.selectAllRecords();
    // }
    this.getfaqsBy(null, null, event.skip, this.searchFaq || '')
    // this.addRemoveFaqFromSelection(null, true,null);
    // this.perfectScroll.directiveRef.update();
    // this.perfectScroll.directiveRef.scrollToTop(2, 1000);
  }
  selectTab(tab) {
    this.loadingTab = true;
    this.selectedFaq = null
    this.searchFaq = '';
    this.selectedtab = tab;
    this.getStats((this.selectedResource || {})._id || null);
    // this.getStats();
    this.getFaqsOnSelection();
  }

  getFaqsOnSelection() {
    this.addRemoveFaqFromSelection(null, null, true);
    this.getfaqsBy(null, this.selectedtab);
  }
  getSourceList(initializePoling?,searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?,request?) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      type: 'faq',
      limit: 50,
      skip: 0
    };
    let payload:any = {}
    if(!sortHeaderOption && !headerOption){
       payload ={
        "extractionType": "faq",
        "sort":{
          "name" : -1
        } 
        
      }
    }
    else{
      payload = request
    }
   
    if(this.searchFaq){
      payload.search = this.searchFaq;
    }
    if(this.searchSources){
      payload.search = this.searchSources;
    }
    this.service.invoke('get.source.list', quaryparms,payload).subscribe(res => {
      this.resources = [...res.sources];
      res.sources.forEach(element => {
        if (element.recentStatus == 'queued' || element.recentStatus == 'failed' || element.recentStatus == 'running' || element.recentStatus == 'configured') {
          this.viewDetails = true;
          this.extractedFaqs = true;
          this.getStats(null, true);
        }
      });
      if (res.sources && res.sources.length) {
        res.sources.forEach((d: any) => {
          if (d.extractedFaqsCount === 0) {
            let index = this.resources.findIndex((f) => f._id == d._id);
            if (index > -1) {
              this.resources.splice(index, 1);
            }
          }
        });
      }
      res = [...this.resources];
      this.resources.forEach(element => {
        if (element.advanceSettings && element.advanceSettings.scheduleOpt && element.advanceSettings.scheduleOpts.interval && element.advanceSettings.scheduleOpts.time) {
          element['schedule_title'] = 'Runs ' + element.advanceSettings.scheduleOpts.interval.intervalType + ' at ' +
            element.advanceSettings.scheduleOpts.time.hour + ':' + element.advanceSettings.scheduleOpts.time.minute + ' ' +
            element.advanceSettings.scheduleOpts.time.timeOpt + ' ' + element.advanceSettings.scheduleOpts.time.timezone;
        }
        if (element.jobInfo.createdOn) {
          element['schedule_createdOn'] = moment(element.jobInfo.createdOn).fromNow();
         this.duriationDays = element['schedule_createdOn']
        }
        if (element.jobInfo.executionStats) {
          element['schedule_duration'] = element.jobInfo.executionStats.duration ? element.jobInfo.executionStats.duration : "00:00:00:00";
          this.duriationTime = this.duration(element['schedule_duration']);
        }

      });
      // if (this.resources.length) {
      //   this.resources.forEach(element => {
      //     this.statusArr.push(element.recentStatus);
      //     this.docTypeArr.push(element.contentSource);
      //   });
      //   this.statusArr = [...new Set(this.statusArr)]
      //   this.docTypeArr = [...new Set(this.docTypeArr)]

      // }
      this.resources = res.reverse();
      if (this.resources && this.resources.length && !initializePoling) {
        this.poling()
      }
      else if (!initializePoling) {
        this.poling()
      }
      if ((this.extractedResources && this.extractedResources.length)) {
        this.loadingFaqs = false;
        this.loadingFaqs1 = true;
        this.viewDetails = true;
        this.extractedFaqs = true;
      }
      else {
        this.loadingFaqs1 = true;
        setTimeout(()=>{
          if (!this.inlineManual.checkVisibility('ADD_FAQ_FROM_LANDING')) {
            this.inlineManual.openHelp('ADD_FAQ_FROM_LANDING')
            this.inlineManual.visited('ADD_FAQ_FROM_LANDING')
          }
        }, 500)
        
      }
      this.getDyanmicFilterData(searchValue,'landingPage');
      // console.log('MIXPANNEL')
      this.mixpanel.postEvent('FAQ-created', {})
    }, errRes => {
    });
  }
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "name": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "contentSource": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "recentStatus": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "createdOn": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
    }
  }
  filterTable(source, headerOption) {
    switch (headerOption) {
      case 'contentSource': {this.filterSystem.typefilter = source; break; };
      case 'recentStatus': {this.filterSystem.statusFilter = source; break; };
    };
    this.filterObject = {
      type: source,
      header: headerOption
    }
    if(headerOption) {
      this.filterFaq(null, null, source, headerOption);
    }
  }
  filterFaq(searchValue?,searchSource?,source?,headerOption?, sortHeaderOption?,sortValue?,navigate?){
    if(sortValue){
      this.sortedObject = {
        type : sortHeaderOption,
        value : sortValue,
        position: navigate
      }
    }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      offset: 0,
      limit: 3
    };
    let request:any={}
    if(!sortValue){
      request = {
        "extractionType": "faq",
        "sort":{
          "name":1
        }
    }   
    }
    else if(sortValue){
      const sort :any ={}
      request= {
        sort
      }
    }
    else {
    request={}
    }
    request.extractionType = "faq",
    request.contentSource = this.filterSystem.typefilter;
    request.recentStatus = this.filterSystem.statusFilter;
    request.search= this.searchSources;
    if (request.contentSource == 'all') {
     delete request.contentSource;
    }
     if (request.recentStatus == 'all') {
      delete request.recentStatus; 
    }
    if (this.searchSources === '') {
      delete request.search;
     }
    if(sortValue){  
      this.getSortIconVisibility(sortHeaderOption,navigate);
       //Sort start
    if(sortHeaderOption === 'contentSource' ){
      request.sort.contentSource = sortValue
    }
    if(sortHeaderOption === 'recentStatus' ){
      request.sort.recentStatus = sortValue
    }
    if(sortHeaderOption === 'name' ){
      request.sort.name = sortValue
    }
    // if(sortHeaderOption === 'numOfDocs' ){
    //   request.sort.numOfDocs = sortValue
    // }
    // if(sortHeaderOption === 'triggeredBy' ){
    //   request.sort.triggeredBy = sortValue
    // }
    // end
    }
     this.getJobStatusForMessages(searchValue,searchSource, source,headerOption, sortHeaderOption,sortValue,navigate,request);

    // this.getSourceList(null,searchValue,searchSource, source,headerOption, sortHeaderOption,sortValue,navigate,request);
  }
  getDyanmicFilterData(search?,from?) {
    // this.fieldDataTypeArr = [];
    // this.isMultiValuedArr = [];
    // this.isRequiredArr = [];
    // this.isStoredArr = [];
    // this.isIndexedArr = [];
    const quaryparms: any = {
      searchIndexId: this.serachIndexId
    };
    const request :any = {
      moduleName: "faq"
    };
    if(from == 'landingPage'){
      request.state = this.selectedtab || 'draft';
    }
    if(from == 'manageExract'){
      request.display = true;
    }
    
    
    request.contentSource = this.filterSystem.typefilter;
    request.recentStatus = this.filterSystem.statusFilter;
    request.search= this.searchSources;
    if (request.contentSource == 'all') {
     delete  request.contentSource;
    }
     if (request.recentStatus == 'all') {
      delete request.recentStatus; 
    }
    if (this.searchSources === '') {
      delete request.search;
     }
    this.service.invoke('post.filters', quaryparms, request).subscribe(res => {
      console.log(res, 'Filters')
      this.statusArr = [...res.recentStatus];
      this.docTypeArr = [...res.contentSource];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get filters');
    });
    
  }
  sortByApi(sort){
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var naviagtionArrow ='';
    var checkSortValue= 1;
    if(this.isAsc){
      naviagtionArrow= 'up';
      checkSortValue = 1;
    }
    else{
      naviagtionArrow ='down';
      checkSortValue = -1;
  }
  this.filterFaq(null,null,null,null,sort,checkSortValue,naviagtionArrow)
}
  // filterTable(source, headerOption) {
  //   console.log(this.resources, source)
  //   this.filterTableSource = source;
  //   this.filterTableheaderOption = headerOption;
  //   let firstFilterDataBack = [];
  //   //this.resources = [...this.filterResourcesBack]; // For new Filter..
  //   if (headerOption == "contentSource") {
  //     this.filterSystem.typeHeader = headerOption;
  //     this.filterSystem.typefilter = source;
  //   } else {
  //     this.filterSystem.statusHeader = headerOption;
  //     this.filterSystem.statusFilter = source;
  //   }
  //   if (this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter == "all") {
  //     this.extractedResources = [...this.filterResourcesBack];
  //     this.firstFilter = { 'header': '', 'source': '' };
  //   }
  //   else if (this.filterSystem.typefilter != "all" && this.filterSystem.statusFilter == "all") {
  //     if (!this.firstFilter['header']) {
  //       this.firstFilter = { 'header': headerOption, 'source': source };
  //     }
  //     firstFilterDataBack = [...this.filterResourcesBack];
  //     const resourceData = firstFilterDataBack.filter((data) => {
  //       return data[this.filterSystem.typeHeader].toLocaleLowerCase() === this.filterSystem.typefilter.toLocaleLowerCase();
  //     })
  //     if (resourceData.length) this.extractedResources = [...resourceData];
  //   }
  //   else if (this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter != "all") {
  //     if (!this.firstFilter['header']) {
  //       this.firstFilter = { 'header': headerOption, 'source': source };
  //     }
  //     firstFilterDataBack = [...this.filterResourcesBack];
  //     const resourceData = firstFilterDataBack.filter((data) => {
  //       return data[this.filterSystem.statusHeader].toLocaleLowerCase() === this.filterSystem.statusFilter.toLocaleLowerCase();
  //     })
  //     if (resourceData.length) this.extractedResources = [...resourceData];

  //   }
  //   else if (this.filterSystem.typefilter != "all" && this.filterSystem.statusFilter != "all") {
  //     this.resources = [...this.filterResourcesBack];
  //     //firstFilter
  //     // if (this.firstFilter['header'] == headerOption) {
  //     if (headerOption == "contentSource") {
  //       this.firstFilter = { 'header': this.filterSystem.statusHeader, 'source': this.filterSystem.statusFilter };
  //     } else {
  //       this.firstFilter = { 'header': this.filterSystem.typeHeader, 'source': this.filterSystem.typefilter };
  //     }
  //     const firstResourceData = this.extractedResources.filter((data) => {
  //       console.log(data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase());
  //       return data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase();
  //     })
  //     const secondResourceData = firstResourceData.filter((data) => {
  //       console.log(data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase());
  //       return data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase();
  //     })
  //     if (secondResourceData.length) this.resources = [...secondResourceData];
  //     //}
  //   }
  // }
  confirmFAQswitch(faq) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Confirm',
        text: 'The changes made on this FAQ are not yet saved.',
        text1: 'Do you want to switch to another FAQ?',
        buttons: [{ key: 'yes', label: 'Yes', secondaryBtn: true }, { key: 'no', label: 'No', type: 'danger' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.selectFaq(faq);
          this.editfaq = null;
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  selectFaq(faq) {
    this.getFaqComment(faq);
    this.selectedFaq = faq;
  }
  selectedFaqToTrain(faq, e) {

    if (!faq._meta.followupQuestions || !faq._meta.followupQuestions.length) {
      e.stopImmediatePropagation();
    }
    if (this.editfaq) {
      this.confirmFAQswitch(faq);
    } else {
      this.selectFaq(faq);
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
        // this.getJobStatusForMessages();
        const queuedJobs = _.filter(res, (source) => {
          return ((source.status === 'running') || (source.status === 'queued'));
        });
        if (queuedJobs && queuedJobs.length) {
          // console.log(queuedJobs);
        } else {
          this.getStats(null, true);
          this.pollingSubscriber.unsubscribe();
          let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
          if (currentPlan?.subscription?.planId == 'fp_free') {
            this.appSelectionService.updateUsageData.next('updatedUsage');
          }
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
  faqUpdateEvent() {
    this.faqUpdate.next();
    // this.selectResourceFilter();
    // setTimeout(() => {
    //   this.selectTab('draft');
    // this.faqCancle();
    // }, 500);

  }
  editThisQa() {
    this.showSourceAddition = false
    this.editfaq = true;
    this.openEditFAQModal(true);
  }
  openEditFAQModal(edit?) {
    this.selectedFaqToEdit = JSON.parse(JSON.stringify(this.selectedFaq));
    this.editFAQModalPopRef = this.editFAQModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  closeEditFAQModal() {
    if (this.editFAQModalPopRef && this.editFAQModalPopRef.close) {
      this.editFAQModalPopRef.close();
    }
  }
  faqCancle(event?) {
    this.editfaq = false;
    this.closeEditFAQModal();
  }
  editFaq(event) {
    let faqData: any = {}
    let isFollowUpUpdate = null;
    if (this.selectedFaq && this.selectedFaq._meta.isFollowupQuestion && this.selectedFaq._meta.parentQuestionId) {
      isFollowUpUpdate = this.selectedFaq._id
      faqData = {
        question: event._source.question,
        defaultAnswers: event._source.defaultAnswers || [],
        conditionalAnswers: event._source.conditionalAnswers || [],
        keywords: event._source.tags,
        alternateQuestions: event._source.alternateQuestions,
        extractionType: 'faq',
      };
    } else {
      faqData = {
        question: event._source.question,
        defaultAnswers: event._source.defaultAnswers || [],
        conditionalAnswers: event._source.conditionalAnswers || [],
        alternateQuestions: event._source.alternateQuestions || [],
        followupQuestions: event.followupQuestions || [],
        keywords: event._source.tags,
        state: this.selectedFaq._meta.state
      };
    }

    this.updateFaq(this.selectedFaq, 'updateQA', faqData, isFollowUpUpdate)
  }
  updateSourceStatus(statusItems) {
    if (statusItems && statusItems.length) {
      statusItems.forEach(status => {
        this.polingObj[status._id] = status.status;
      });
      this.resources.forEach(source => {
        if (source && this.polingObj && this.polingObj[source.jobId]) {
          source.recentStatus = this.polingObj[source.jobId];
        }
      });
    }
  }
  updateFaq(faq, action, params, isFollowUpUpdate?) {
    // console.log("faq, action, params", faq, action, params)
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      faqId: faq._id,
    }
    let payload: any = {}
    if (action === 'stateUpdate') {
      payload.state = params;
    }
    if (action === 'updateQA') {
      payload = params;
    }
    this.service.invoke('update.faq', quaryparms, payload).subscribe(res => {
      this.notificationService.notify('Updated Successfully', 'success');
      this.addRemoveFaqFromSelection(null, null, true);
      this.selectAll(true);
      this.selectedFaq = res;
      this.selectedtab = res._meta.state;
      if (isFollowUpUpdate) {
        const index = _.findIndex(this.faqs, (faqL) => {
          return faqL._id === res._meta.parentQuestionId;
        })
        if (index > -1) {
          const followUpItem = _.findIndex(this.faqs[index]._meta.followupQuestions, (followUpfaq) => {
            return followUpfaq._id === isFollowUpUpdate;
          });
          if (followUpItem > -1) {
            this.faqs[index]._meta.followupQuestions[followUpItem] = res;
          }
        }
      } else {
        const index = _.findIndex(this.faqs, (faqL) => {
          return faqL._id === res._id;
        })
        if (index > -1) {
          this.faqs[index] = res;
        }
      }
      // this.getStats();
      if (this.editfaq) {
        this.selectTab('draft');

      } else {
        if (action === 'stateUpdate') {
          this.selectTab(params || 'draft');
        } else {
          this.selectTab((params || {}).state || 'draft');
        }

      }
      this.editfaq = false;
      this.closeEditFAQModal();
      this.closeAddsourceModal();
      this.mixpanel.postEvent('FAQ-updated', {})
      // console.log('MIXPANNEL FAQ UPDATE')
    }, errRes => {
      this.errorToaster(errRes, 'Somthing went worng');
    });
  }
  cancleAddFollowUp() {
    if (this.selectedFaq) {
      this.selectedFaq.isAddFollow = null
    }
    this.closeAddsourceModal();
  }
  bulkUpdate(action, state?, dialogRef?) {
    const payload: any = {};
    let custerrMsg = 'Failed to update faqs'
    let custSucessMsg = 'Updated Successfully';
    if (action === 'update' && state) {
      payload.state = state
    } else if (action === 'delete') {
      payload.action = 'delete'
      custSucessMsg = 'Deleted Successfully'
      custerrMsg = 'Failed to delete faqs'
    }
    if (this.faqSelectionObj && this.faqSelectionObj.selectAll) {
      payload.allFaqs = true;
      payload.currentState = this.selectedtab;
      if (this.selectedResource && this.selectedResource._id) {
        payload.extractionSourceId = this.selectedResource._id;
      } else {
        payload.extractionSourceId = '';
      }
    }
    else if (Object.keys(this.faqSelectionObj.deSelectedItems).length) {
      const deselectedFaqsCollection: any = [];
      Object.keys(this.faqSelectionObj.deSelectedItems).forEach((key) => {
        const tempobj = {
          _id: key
        }
        deselectedFaqsCollection.push(tempobj);
      });
      payload.excludeFaqs = deselectedFaqsCollection;
      payload.currentState = this.selectedtab;
 
    }
    else  {
      const selectedElements = $('.selectEachfaqInput:checkbox:checked');
      const sekectedFaqsCollection: any = [];
      Object.keys(this.faqSelectionObj.selectedItems).forEach((key) => {
        const tempobj = {
          _id: key
        }
        sekectedFaqsCollection.push(tempobj);
      });
      // if (selectedElements && selectedElements.length) {
      //   $.each(selectedElements, (i, ele) => {
      //     const faqId = $(ele)[0].id.split('_')[1];
      //     const tempobj = {
      //       _id: faqId
      //     }
      //     sekectedFaqsCollection.push(tempobj);
      //   })
      // }
      payload.faqs = sekectedFaqsCollection;
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    }
    this.selectAll(true);
    this.addRemoveFaqFromSelection(null, null, true);
    let serviceID = 'update.faq.bulk';
    if (this.manualFilterSelected) {
      serviceID = 'update.manualFaqs.bulk'
    }
    this.service.invoke(serviceID, quaryparms, payload).subscribe(res => {
      if (state) {
        this.selectTab(state)
      } else {
        this.getfaqsBy();
        this.selectedFaq = null;
      }
      // this.getStats();
      this.editfaq = null
      if (state != 'in_review' && state != 'approved') {
        this.notificationService.notify(custSucessMsg, 'success');
        let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
        if (currentPlan?.subscription?.planId == 'fp_free') {
          this.appSelectionService.updateUsageData.next('updatedUsage');
        }
      }
      if (state == 'in_review') {
        this.notificationService.notify('Sent for Review', 'success');
      }
      else if (state == 'approved') {
        this.notificationService.notify('Approved', 'success');
      }
      if (dialogRef) {
        dialogRef.close();
      }
      this.mixpanel.postEvent('FAQ-deleted', {})
      // console.log('MIXPANNEL FAQ DEL')
    }, errRes => {
      this.errorToaster(errRes, custerrMsg);
    });
  }
  strArr(s: string): any[] {
    return Array(s);
  }
  deleteSrcAQ(source, dialogRef) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      sourceId: source._id
    }
    this.service.invoke('delete.content.source', quaryparms).subscribe(res => {
      dialogRef.close();
      this.notificationService.notify('Deleted Successfully', 'success');
      this.mixpanel.postEvent('FAQ-deleted', {})
      //  console.log('MIXPANNEL FAQ DEL')
      const deleteIndex = _.findIndex(this.extractedResources, (fq) => {
        return fq._id === source._id;
      })
      if (deleteIndex > -1) {
        this.extractedResources.splice(deleteIndex, 1);
      }
      if (!(this.extractedResources && this.extractedResources.length)) {
        this.viewDetails = false;
        this.extractedFaqs = false;
        // this.getSourceList();
      }
      this.resetCheckboxSelect();

      let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
      if (currentPlan?.subscription?.planId == 'fp_free') {
        this.appSelectionService.updateUsageData.next('updatedUsage');
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete faq source');
    });
  }
  deleteIndFAQ(faq, dialogRef) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      contentId: faq._id,
      sourceId: Math.random().toString(36).substr(7)
    }
    this.service.invoke('delete.structuredData', quaryparms).subscribe(res => {
      dialogRef.close();
      this.faqCancle();
      this.notificationService.notify('Deleted Successfully', 'success')
      const deleteIndex = _.findIndex(this.faqs, (fq) => {
        return fq._id === faq._id;
      })
      if (deleteIndex > -1) {
        this.faqs.splice(deleteIndex, 1);
      }
      this.getStats();
      this.resetCheckboxSelect();
      let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
      if (currentPlan?.subscription?.planId == 'fp_free') {
        this.appSelectionService.updateUsageData.next('updatedUsage');
      }
      if (!(this.faqs && this.faqs.length)) {
        this.selectedFaq = null;
      } else {
        if (this.faqs && this.faqs.length) {
          if (this.faqs && this.faqs[deleteIndex]) { // best next possible selection
            this.selectFaq(this.faqs[deleteIndex]);
          } else if (this.faqs[deleteIndex - 1]) {
            this.selectFaq(this.faqs[deleteIndex - 1]);
          } else {
            this.selectedFaq = null;
          }
        }
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete faq');
    });
  }
  deleteInfividualQuestion(record) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected question will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteIndFAQ(record, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          // console.log('deleted')
        }
      })
  }
  deleteSource(record, event) {
    if (event) {
      event.stopImmediatePropagation();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Resource',
        text: 'Are you sure you want to delete ?',
        newTitle: 'Are you sure you want to delete ?',
        body: 'All the FAQs associated with this source will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteSrcAQ(record, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          // console.log('deleted')
        }
      })
  }
  deleteQuestion(type, record, event) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected question(s) will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          if (type === 'qstnFAQ') {
            this.bulkUpdate('delete', null, dialogRef)
          } else {
            this.deleteSrcAQ(record, dialogRef)
          }
        } else if (result === 'no') {
          dialogRef.close();
          // console.log('deleted')
        }
      })
  }
  deleteAltQuestion(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected alternate question will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          dialogRef.close();
          // console.log('deleted')
        } else if (result === 'no') {
          dialogRef.close();
          // console.log('deleted')
        }
      })

  }
  addFollowUp(faq, event) {
    this.editfaq = false;
    this.selectedFaqToTrain(faq, event);
    this.faqServiceFollow.updateVariation('followUp');
    this.faqServiceFollow.updateFaqData(this.selectedFaq);
    this.selectedFaq.isAddFollow = true;
    this.showSourceAddition = false;
    this.openAddSourceModal();
  }
  addAlternate() {
    this.faqServiceAlt.updateVariation('alternate');
    this.faqServiceAlt.updateFaqData(this.selectedFaq);
    this.selectedFaq.isAlt = true;
    setTimeout(() => {
      $('#questionList').closest('.ps.ps--active-y').animate({
        scrollTop: Math.abs($('#questionList').position().top) + $('#altQue').position().top
      });
    }, 100);
  }

  delAltQues(ques) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected alternate question will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        // confirmationPopUp:true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.selectedFaq._source.alternateQuestions = _.without(this.selectedFaq._source.alternateQuestions, _.findWhere(this.selectedFaq._source.alternateQuestions, { _id: ques._id }));
          const params = {
            alternateQuestions: this.selectedFaq._source.alternateQuestions || [],
          };
          this.updateFaq(this.selectedFaq, 'updateQA', params);
          dialogRef.close();
        } else if (result === 'no') { dialogRef.close(); }
      });
  }

  delFollowQues(ques) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected followup question will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.selectedFaq._meta.followupQuestions = _.without(this.selectedFaq._meta.followupQuestions, _.findWhere(this.selectedFaq._meta.followupQuestions, { _id: ques._id }));
          const params = {
            followupQuestions: this.selectedFaq._meta.followupQuestions || []
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

  resumeAnnotate(source) {
    const payload = {
      sourceTitle: source.name,
      sourceDesc: source.desc,
      fileId: source.fileMeta.fileId,
      sourceId: source._id
    };
    const dialogRef = this.dialog.open(PdfAnnotationComponent, {
      data: { type: 'resumeAnnotate', pdfResponse: payload },
      panelClass: 'kr-annotation-modal',
      disableClose: true,
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe(res => {

    });
  }
  ngOnDestroy() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    this.altAddSub ? this.altAddSub.unsubscribe() : false;
    this.altCancelSub ? this.altCancelSub.unsubscribe() : false;
    this.followAddSub ? this.followAddSub.unsubscribe() : false;
    this.followCancelSub ? this.followCancelSub.unsubscribe() : false;
    this.openExtractsSubs ? this.openExtractsSubs.unsubscribe() : false;
  }
  exportFaq(ext) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    const payload = {
      exportType: ext,
    }
    this.service.invoke('export.faq', quaryparms, payload).subscribe(res => {
      if (ext === 'json') {
        this.notificationService.notify('Export to JSON is in progress. You can check the status in the Status Docker', 'success');
      }
      else {
        this.notificationService.notify('Export to CSV is in progress. You can check the status in the Status Docker', 'success');
      }

      this.checkExportFaq();
    },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      });
  }
  showSeeAll(conditions) {
    if ((conditions || []).length) {
      if (conditions.length > 2) {
        return true;
      } else {
        for (let i = 0; i < conditions.length; i++) {
          if ((conditions[0].value.length > 4 && i == 0) || (conditions.length == 2 && conditions[1].value.length > 2 && i == 1) || (conditions[0].value.length == 2 && i == 0 && (conditions[0].value[0].length + (conditions[0].value.length == 2 ? (conditions[0].value[1].length) : 0)) > 14 && conditions.length !== 1) || (conditions[0].value.length > 2 && i == 0 && conditions[0].operator == 'between')) {
            return true
          }
        }
      }
    }
    return false;
  }
  showConditions(conditions, ruleIndex) {
    if ((conditions[0].value.length < 3 && ruleIndex == 1 && (conditions[0].value[0].length + (conditions[0].value.length == 2 ? (conditions[0].value[1].length) : 0) < 14)) || ruleIndex == 0) {
      return true;
    } else {
      return false;
    }
    return true;
  }
  checkExportFaq() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId
    }
    this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
      /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 1894*/
      // if (res && res.dockStatuses) {
        if (res) {
          /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 1898 line*/
        // res.dockStatuses.forEach((record: any) => {
          res.forEach((record: any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");
          /**made code updates in line no 1905 on 03/01 added new condition for success,since SUCCESS is updated to success as per new api contract */
          /** made code updates in line no 1903 on 03/09 added new condition for record.fileInfo and record.fileInfo.fileId,since fileId is now has to be fetched from fileInfo  as per new api contract  */
          // if (record.status === 'SUCCESS' && record.fileId && !record.store.toastSeen) {
            if ((record.status === 'SUCCESS' || record.status ==='success') && (record.fileInfo) && (record.fileInfo.fileId) && !record.store.toastSeen) {
          /**added condition for jobType in 1906,since we are no longer recieving action in jobs api response,using the jobType for condition check as per new api contract 10/03 */
          // if (record.action === 'EXPORT') {
               if (record.jobType === "DATA_EXPORT") {
              this.downloadDockFile(record.fileInfo.fileId, record.store.urlParams, record.streamId, record._id);
            }
          }
        })
      }
    }, errRes => {
      this.pollingSubscriber.unsubscribe();
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to get Status of Docker.', 'error');
      }
    });
  }

  downloadDockFile(fileId, fileName, streamId, dockId) {
    const params = {
      fileId,
      streamId: streamId,
      dockId: dockId,
      jobId: dockId,
      sidx:this.serachIndexId
    }
    let payload = {
      "store": {
        "toastSeen": true,
        "urlParams": fileName,
      }
    }
    this.service.invoke('attachment.file', params).subscribe(res => {
      let hrefURL = res.fileUrl + fileName;
      window.open(hrefURL, '_self');
      this.service.invoke('put.dockStatus', params, payload).subscribe(res => { });
    }, err => { console.log(err) });
  }

  duration(duration) {
    if (duration) {
      let hr = duration.split(":")[0];
      let min = duration.split(":")[1];
      let sec = duration.split(":")[2];


      if (hr > 0) {
        if (min > 0 && sec > 0) return duration = hr + "h " + min + "m " + sec + "s";
        if (min > 0 && sec <= 0) return duration = hr + "h " + min + "m " + sec + "s";
        if (min <= 0 && sec <= 0) return duration = hr + "h ";
      } else if (min > 0) {
        if (sec > 0) return duration = min + "m " + sec + "s";
        if (sec <= 0) return duration = min + "m ";
      } else if (sec > 0) {
        return duration = sec + "s";
      } else {
        return duration = '0' + "s";
      }
    }
  }
  toggleSearch() {
    if (this.showSearch && this.searchSources) {
      this.searchSources = '';
    }
    this.showSearch = !this.showSearch;
    this.cdRef.detectChanges();
  };


  focusoutSearch(isPopup?) {
    if (isPopup) {
      if (this.activeClose) {
        this.searchSources = '';
        this.activeClose = false;
      }
    } else {
      if (this.activeClose) {
        this.searchFaq = '';
        this.activeClose = false;
        this.searchFaqs();
      }
    }
    this.showSearch = !this.showSearch;
    this.cdRef.detectChanges();
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  clicksViews() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      faqId: this.selectedFaq._id,
    };
    this.service.invoke('get.clicksViews', quaryparms).subscribe(res => {
      this.numberOf = res
      console.log(res);
    }, errRes => {
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    let faqDragData: any = {}
      faqDragData = {
        question: this.selectedFaq._source.faq_question, 
        // defaultAnswers: event.container.data ,
        // conditionalAnswers: event.previousContainer.data ,
        alternateQuestions: this.selectedFaq._source.faq_alt_questions || [],
        // followupQuestions: event.followupQuestions || [],
        keywords: this.selectedFaq._source.keywords,
        state: this.selectedFaq._meta.state
      };

      if(event.previousContainer === event.container){
        // if(event.container.data === this.selectedFaq._source.faq_answer){
        //   faqDragData.defaultAnswers = event.container.data
        //   faqDragData.conditionalAnswers = this.selectedFaq._source.faq_cond_answers
        // }
         if (event.container.data === this.selectedFaq._source.faq_cond_answers){
          // faqDragData.defaultAnswers = this.selectedFaq._source.faq_answer
          faqDragData.conditionalAnswers =  event.container.data
        }
      }
      else {
        // faqDragData.defaultAnswers = event.container.data || this.selectedFaq._source.faq_answer
        faqDragData.conditionalAnswers =  event.container.data || this.selectedFaq._source.faq_cond_answers
      }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateFaq(this.selectedFaq, 'updateQA',faqDragData);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        this.updateFaq(this.selectedFaq, 'updateQA',faqDragData);
    }
  }
 
}
