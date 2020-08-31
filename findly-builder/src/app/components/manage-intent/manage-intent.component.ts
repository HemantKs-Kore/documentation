import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SideBarService } from '@kore.services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { finalize, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips'
import { ImportFaqsModalComponent } from './../import-faqs-modal/import-faqs-modal.component';
import * as uuid from 'uuid';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { Subject, of, Subscription, from } from 'rxjs';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
import { NotificationService } from '@kore.services/notification.service';
import { AddAltFaqComponent } from '../add-alt-faq/add-alt-faq.component';
import { ActivatedRoute } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-manage-intent',
  templateUrl: './manage-intent.component.html',
  styleUrls: ['./manage-intent.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ManageIntentComponent implements OnInit, OnDestroy {

  selectedApp: any;
  selectedFaq: any;
  altQuestionIndex: number = null;
  isEmpty = false;
  ktId: string;
  nodeId: string;
  loading = true;
  showError = false;
  showAddAltQuestion = false;
  showAltQuestionList = false;
  showAddFaqSection = false;
  faqs: any[] = [];
  faqsCount = 0;
  searchTerm$ = new Subject<string>();
  searchTerm = '';
  filteredFaqs: any[] = [];
  importFileSub: Subscription;
  jsConent: any;

  showResumeConfigMsg = true;
  completedPercentage: number = null;
  @ViewChild(AddAltFaqComponent) addAltFaqComponent: AddAltFaqComponent;
  @ViewChild('jsModal') jsModal;
  constructor(
    public workflowService: WorkflowService,
    private headerService: SideBarService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    public dialog: MatDialog,
    private kgService: KgDataService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {

    this.completedPercentage = this.route.snapshot.queryParams.completedPercentage;
    const toogleObj = {
      title: 'Manage Intents',
      toShowWidgetNavigation: this.workflowService.showAppCreationHeader()
    }
    this.headerService.toggle(toogleObj);
    this.selectedApp = this.workflowService.findlyApps();
    this.getKnowledgeTasks();
    this.initSearchFaqs();
    this.importFileSub = this.kgService.importFileComplete.subscribe(() => {
      this.getKnowledgeTasks();
      this.initSearchFaqs();
    });
    this.kgService.importFaqs.subscribe(res=>{this.importFaqs(-1)});
  }
  getKnowledgeTasks() {
    const _params = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id || this.selectedApp[0]._id,
    }

    this.service.invoke('get.knowledgetasks', _params).subscribe(res => {
      if (!res) return;
      if (res && res.length === 0) {
        this.createKnowledgeTask();
      } else {
        this.ktId = res[0]._id;
        this.kgService.setKgTaskId(res[0]._id);
        this.nodeId = res[0].taxonomy[0].nodeId;
        this.getFaqs();
      }
    }, err => {
      this.loading = false;
      this.showError = true;
      this.notificationService.notify('Unable to fetch knowledge tasks', 'error');
    })
  }

  createKnowledgeTask() {
    const _params = {
      userId: this.authService.getUserId(),
    }

    const nodeId = uuid.v4();

    const _payload = {
      name: this.selectedApp.name || this.selectedApp[0].name,
      description: 'This is used to make ontology',
      taxonomy: [
        {
          nodeId,
          label: this.selectedApp.name || this.selectedApp[0].name,
          level: 'l0',
          parent: [],
          synonyms: []
        }
      ],
      isGraph: true,
      visibility: {
        namespace: 'private',
        namespaceIds: [
          this.authService.getUserId()
        ]
      },
      streamId: this.selectedApp._id || this.selectedApp[0]._id,
      metadata: {
        taxonomy: [
          {
            nodeId,
            label: this.selectedApp.name || this.selectedApp[0].name,
            class: 'bgblack',
            level: 'l0',
            parent: [],
            synonyms: [],
            nodes: []
          }
        ]
      }
    }

    this.service.invoke('create.knowledgetask', _params, _payload).subscribe(res => {
      this.ktId = res._id;
      this.nodeId = nodeId;
      this.getFaqs();
    }, err => {
      this.loading = false;
      this.showError = true;
      this.notificationService.notify('Unable to create knowledge tasks', 'error');
    })
  }

  getFaqs() {
    const _params = {
      userId: this.authService.getUserId(),
      ktId: this.ktId,
      limit: 1000,
      offSet: 0,
      searchParam: '',
      parentId: this.nodeId,
      withallchild: true,
      filter: 'all'
    }

    this.service.invoke('get.getorsearchfaq', _params)
      .pipe(
        finalize(() => this.loading = false))
      .subscribe(res => {
        if (!(res && res.faqs)) return;
        const faqs = res.faqs;
        this.isEmpty = faqs.length === 0;
        this.faqs = faqs.map(faq => this.decodeFaq(faq));
        this.faqsCount = res.count;
        this.showAddFaqSection = this.isEmpty;
      }, err => {
        this.notificationService.notify('Unable to fetch FAQs', 'error');
        this.showError = true;
      })
  }

  initSearchFaqs() {
    this.searchTerm$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        // if (!term.trim()) return of(this.faqs);
        const _params = {
          userId: this.authService.getUserId(),
          ktId: this.ktId,
          limit: 1000,
          offSet: 0,
          searchParam: term,
          parentId: this.nodeId,
          withallchild: true,
          filter: 'all'
        }

        return this.service.invoke('get.getorsearchfaq', _params);
      })
    ).subscribe(res => {
      if (!(res && res.faqs)) return;
      this.faqs = res.faqs.map(faq => this.decodeFaq(faq));;
    }, err => {
      this.notificationService.notify('Unable to fetch FAQs', 'error');
    })
  }

  onClickAddFaqs() {
    this.isEmpty = false;
    this.showAddFaqSection = true;
  }

  private _prepareFaqPayload(data): any {
    return {
      questionPayload: {
        question: data.question,
        tagsPayload: data.tags,
      },
      knowledgeTaskId: this.ktId,
      subQuestions: [

      ],
      responseType: 'message',
      streamId: this.selectedApp._id || this.selectedApp[0]._id,
      parent: this.nodeId,
      leafterm: this.selectedApp.name || this.selectedApp[0].name,
      answerPayload: [
        {
          text: this.encode(data.response),
          type: 'basic',
          channel: 'default'
        }
      ],
      subAnswers: [

      ]
    }
  }

  addFaq($event) {
    // "text": "You%20can%20test%20it%20with%20deflect.ai",
    const _params = { userId: this.authService.getUserId() }
    const _payload = this._prepareFaqPayload($event);

    this.service.invoke('create.faqs', _params, _payload)
      .subscribe(res => {
        this.faqs.push(this.decodeFaq(res));
        this.isEmpty = false;
        this.showAddFaqSection = false;
        this.notificationService.notify('FAQ added successfully!', 'success');
        $event.cb('success');
      }, err => {
        this.notificationService.notify('Failed to Add FAQ', 'error');
        $event.cb('error');
      })
  }

  editFaq($event) {
    const _params: any = { userId: this.authService.getUserId() }
    const _payload = this._prepareFaqPayload($event);
    _payload._id = $event._id;
    _params.faqID = $event._id;

    this.service.invoke('edit.faq', _params, _payload)
      .subscribe(res => {
        const index = this.faqs.findIndex(f => f._id === $event._id);
        this.faqs.splice(index, 1, this.decodeFaq(res));
        this.faqs.forEach(e => e.showEditSection = false);
        this.notificationService.notify('FAQ updated successfully!', 'success');
        $event.cb('success');
      }, err => {
        this.notificationService.notify('Failed to update FAQ', 'error');
        $event.cb('error');
      })
  }

  updateFaq($event) {
    const _params: any = { userId: this.authService.getUserId() }
    const _payload = $event.faq;
    _params.faqID = $event.faq._id;

    this.service.invoke('edit.faq', _params, _payload)
      .subscribe(res => {
        const index = this.faqs.findIndex(f => f._id === $event.faq._id);
        this.faqs.splice(index, 1, this.decodeFaq(res));
        this.selectedFaq = res;
        setTimeout(() => {
          $('#' + 'collapse' + index).collapse('show'); // to keep card open
        });
        this.notificationService.notify('FAQ updated successfully!', 'success');
        $event.cb('success')
      }, err => {
        this.notificationService.notify('Failed to update FAQ', 'error');
        $event.cb('error');
      })
  }

  deleteFaq(faq) {
    const _params = {
      userId: this.authService.getUserId(),
      faqID: faq._id
    }
    this.service.invoke('delete.faq', _params)
      .subscribe(res => {
        const index = this.faqs.findIndex(f => f._id === faq._id);
        this.faqs.splice(index, 1);
        this.checkFaqs();
        this.notificationService.notify('FAQ has been deleted', 'success');
      }, err => {
        this.notificationService.notify('Failed to delete FAQ', 'error');
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
          this.selectedFaq.subQuestions.splice(index, 1);
          this.updateFaq(this.selectedFaq);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }

  importFaqs(step) {
    this.dialog.open(ImportFaqsModalComponent, {
      width: '446px',
      height: '340px',
      disableClose: true,
      panelClass: 'import-faqs-popup',
      data: {step}
    });

  }

  prepareTags(tagsPayload = []) {
    return tagsPayload.map(e => '#' + e.tag).join(', ');
  }

  checkFaqs() {
    if (this.faqs.length === 0 && !this.searchTerm) {
      this.isEmpty = true;
    }
  }

  onClickAddQuestion() {
    if (this.searchTerm !== '') {
      this.searchTerm = '';
      this.searchTerm$.next('');
    }
    this.showAddFaqSection = true

  }

  onClickFaq(faq, $event) {
    this.faqs.forEach(e => e.showEditSection = false);
    $('.card-link[data-toggle=collapse]').each(function () {
      $(this).parent().removeClass('expanded');
    })

    if ($($event.target).attr('aria-expanded') === 'false' || !$($event.target).attr('aria-expanded')) {
      this.selectedFaq = faq;
      $($event.target).parent().addClass('expanded');
    } else {
      this.selectedFaq = null;
    }
  }

  onClickEditFaq(faq, id) {
    $('#' + id).collapse('hide');
    this.faqs.forEach(e => {
      if (faq._id === e._id) {
        e.showEditSection = !e.showEditSection;
      } else {
        e.showEditSection = false;
      }
    });
    faq.showAddFollowUpQSection = false;
    this.selectedFaq = null;
  }

  onClickDeleteFaq(faq) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete FAQ',
        text: 'Are you sure you want to delete selected FAQ?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          dialogRef.close();
          this.deleteFaq(faq)
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }

  openJSModal(faq) {
    this.jsConent = '';
    const dialogRef = this.dialog.open(this.jsModal, {
      width: '70%',
      height: '80%',
      panelClass: 'js-faq-popup',
      data: {
        title: 'Delete FAQ'
      }
    });
    this.jsConent = `\`\`\`javascript\n${faq.answerPayload[0].text} \`\`\``;
    dialogRef.afterClosed().subscribe((res) => this.jsConent = '');
  }

  onClickAltQuestion(index) {
    this.altQuestionIndex = index;
    // Changes will not trigger if same alt question is clicked multiple times, need to tell child comp explicitly
    // if (this.altQuestionIndex === index) {
    //   this.addAltFaqComponent.bindData(index);
    // }
  }

  encode(text) {
    return encodeURIComponent(text);
  }

  decodeFaq(faq) {
    faq.answerPayload[0].text = decodeURIComponent(faq.answerPayload[0].text);
    return faq;
  }

  resetAltQuestionIndex() {
    this.altQuestionIndex = null;
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.importFileSub ? this.importFileSub.unsubscribe() : false;
  }
}