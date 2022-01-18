import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MdEditorOption } from 'src/app/helpers/lib/md-editor.types';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { FaqsService } from '../../services/faqsService/faqs.service';
import { ConvertMDtoHTML } from 'src/app/helpers/lib/convertHTML';
import * as _ from 'underscore';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { Observable, Subscription } from 'rxjs';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
declare const $: any;
// import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss'],
  providers: [{ provide: 'instance1', useClass: FaqsService },
  { provide: 'instance2', useClass: FaqsService },]
})
export class AddFaqComponent implements OnInit, OnDestroy {
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('createImagePop') createImagePop: KRModalComponent;
  @ViewChild('createLinkPop') createLinkPop: KRModalComponent;
  @ViewChild('externalResponsePop') externalResponsePop: KRModalComponent;
  @ViewChild('previewImageModalPop') previewImageModalPop: KRModalComponent;
  @Input() inputClass: string;
  @Input() isFollowUp: boolean;
  @Input() faqData: any;
  @Input() faqUpdate: Observable<void>;
  @Output() addFaq = new EventEmitter();
  @Output() cancelfaqEvent = new EventEmitter();
  @Output() editFaq = new EventEmitter();
  eventsSubscription: Subscription;
  currentEditIndex: any = null;
  showImagePreview = false;
  showResponsePreview = false;
  addAltFaq:any;
  createLinkPopRef
  createImagePopRef
  externalResponsePopRef
  previewImageModalPopRef
  faqs: any = {}
  anwerPayloadObj: any = {};
  editAltQuestionIndex: any;
  altQuestionEdit: any;
  ruleOptions = {
    searchContext: ['recentSearches', 'currentSearch', 'traits', 'entity', 'keywords'],
    pageContext: ['device', 'browser', 'currentPage', 'recentPages'],
    userContext: [' ', 'userType', 'userProfile', 'age', 'sex'],
    contextTypes: ['searchContext', 'pageContext', 'userContext'],
    dataTypes: ['string', 'date', 'number', 'trait', 'entity', 'keyword'],
    actions: ['boost', 'lower', 'hide', 'filter']
  }
  defaultValuesObj: any = {
    contextType: 'searchContext',
    operator: 'contains',
    contextCategory: 'recentSearches',
    // usercontextCategory:'',
    dataType: 'string',
    value: []
  }
  conditions = {
    string: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    date: ['equals', 'between', 'greaterThan', 'lessThan'],
    number: ['equals', 'between', 'greaterThan', 'lessThan'],
    trait: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    entity: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    keyword: ['contains', 'doesNotContain', 'equals', 'notEquals']
  }

  codeMirrorOptions: any = {
    theme: 'neo',
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: false,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-lint-markers'],
    autoCloseBrackets: false,
    matchBrackets: true,
    lint: true
  };
  conditionQuary: any = ''
  obj;
  faqResponse = {
    defaultAnswers: [],
   conditionalAnswers:[]
  }
  form: FormGroup;
  currentSugg: any = [];
  tags: any[] = [];
  text = '';
  image: any = {
    url: '',
    alt: ''
  }
  defaultResponse: any = {}
  responseMethod = 'basic';
  imgInfo: any = {};
  linkInfo: any = {}
  responseType: any = 'default'
  isFocused = false;
  bubblePopUp=true
  synonyms = [];
  uploadImage: any = {};
  newSynonym = ''
  suggestionTags = [];
  typedQuery = '';
  container = '#mainChatInputContainer'
  isAlt = false;
  isAdd = false;
  contentEditableElement = false  // '#mainChatInputContainerDiv';
  // options:any = {maxLines: 20, printMargin: false};
  options: MdEditorOption = {
    showPreviewPanel: false,
    hideIcons: ['TogglePreview']
  }
  groupsAdded: any = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  loading: boolean;
  quesList: any = {
    alternateQuestions: [],
    followupQuestions: []
  };
  conditionInterface: any = { key: '', op: 'exist', value: '' };
  defaultAnsInterface: any = {
    answerType: 'default', // default/conditional
    responseType: 'default',
    imageUrl: '',
    text: '',
    // conditions: [],
    type: 'string',
    image: {
      imageUrl: '',
      alt: '',
    }
  }
  conditionalAnsInterface: any = {
    answerType: 'conditional', // default/conditional
    responseType: 'conditional',
    imageUrl: '',
    text: '',
    conditions: [],
    type: 'string',
    image: {
      imageUrl: '',
      alt: '',
    }
  }
  altAddSub: Subscription;
  altCancelSub: Subscription;
  followInpKeySub: Subscription;
  followInpQuesSub: Subscription;
  altInpKeySub: Subscription;
  altInpQuesSub: Subscription;
  groupAddSub: Subscription;
  selectedResponseToEdit: any = {
    responseObj: {
      image: {
        imageUrl: ''
      }
    }
  }
  addSrc = 'assets/icons/add_plus.svg';
  public config: PerfectScrollbarConfigInterface = {};
  constructor(private fb: FormBuilder,
    config: NgbTooltipConfig,
    private service: ServiceInvokerService,
    private authService: AuthService,
    private kgService: KgDataService,
    private notify: NotificationService,
    private faqService: FaqsService,
    public convertMDtoHTML: ConvertMDtoHTML,
    public dialog: MatDialog,
    public mixpanel : MixpanelServiceService,
    @Inject('instance1') private faqServiceAlt: FaqsService,
    @Inject('instance2') private faqServiceFollow: FaqsService
  ) {
    config.container = 'body'
  }

  ngOnInit() {
    this.obj = JSON.stringify({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      title: 'Object',
      additionalProperties: false,
      properties: {
        string: {
          type: 'string',
          title: 'String'
        }
      }
    }, null, ' ');
    this.setDataforEditDelete(this.faqData);
    if (this.faqData) {
      if (this.faqData.templateSettings) {
        this.responseType = this.faqData.templateSettings.responseType
      }
      this.form = this.fb.group({
        question: [this.faqData._source.faq_question, Validators.required],
        botResponse: [this.faqData._source.faq_answer, Validators.required],
      });
      this.tags = this.faqData._source.keywords;
      this.text = this.faqData._source.faq_answer;
    } else {
      this.addAltFaq={
        _source :{
          faq_alt_question : []
        }
      }
      this.form = this.fb.group({
        question: ['', Validators.required],
        botResponse: ['', Validators.required]
      });
      this.addAnotherResponse('default');
    }
    this.altAddSub = this.faqServiceAlt.addAltQues.subscribe((params : any) => {
      this.isAdd = false;
      if(  !(this.faqData || {})._id){
        if(!this.faqData){
          this.faqData = {
            _source :{
              faq_alt_questions : params._source.faq_alt_questions
            }
          };
        }
        
      else{
        this.faqData._source.faq_alt_questions.push(params._source.faq_alt_questions[0]);
      }
      this.isAdd = true;
      }
     
    });
    this.altCancelSub = this.faqServiceAlt.cancel.subscribe(data => { this.isAdd = false; });
    if (this.faqUpdate) {
      this.eventsSubscription = this.faqUpdate.subscribe(() => this.save());
    }
    this.groupAddSub = this.faqService.groupAdded.subscribe(res => { this.groupsAdded = res; });
  }
  // buildCurrentContextSuggetions(ruleObj) {
  //   const _ruleOptions = JSON.parse(JSON.stringify(this.ruleOptions))
  //   const mainContext = _ruleOptions.contextTypes;
  //   if ($('.mat_autofocus_dropdown').length) {
  //     if (ruleObj.outcomeValueType == 'static' || (ruleObj.outcomeValueType == 'dynamic' && ruleObj.newValue && (ruleObj.newValue.search(/\./) !== -1))) {
  //       if ($('.mat_autofocus_dropdown')[0]) {
  //         $('.mat_autofocus_dropdown')[0].style.display = 'none';
  //       }
  //     } else {
  //       if ($('.mat_autofocus_dropdown')[0]) {
  //         $('.mat_autofocus_dropdown')[0].style.display = 'block';
  //       }
  //     }
  //   }
  //   this.currentSugg = [];
  //   if (ruleObj && ruleObj.newValue) {
  //     const selectedContextSelections = ruleObj.newValue.split('.');
  //     if (selectedContextSelections && selectedContextSelections.length) {
  //       const selectedContext = selectedContextSelections[0];
  //       if (selectedContext && _ruleOptions[selectedContext]) {
  //         if (selectedContextSelections.length === 3) {
  //           this.currentSugg = [];
  //         } else if (selectedContextSelections.length === 2) {
  //           let filteredValues = _ruleOptions[selectedContextSelections[0]] || [];
  //           filteredValues = _ruleOptions[selectedContextSelections[0]].filter(it => {
  //             if (selectedContextSelections[1]) {
  //               return it.toLowerCase().includes(selectedContextSelections[1].toLowerCase());
  //             } else {
  //               return true;
  //             }
  //           });
  //           this.currentSugg = filteredValues;
  //         } else if (selectedContextSelections.length === 1 && _ruleOptions[selectedContextSelections[0]]) {
  //           this.currentSugg = _ruleOptions[selectedContextSelections[0]];
  //         } else {
  //           this.currentSugg = [];
  //         }
  //       } else {
  //         const filteredValues = mainContext.filter(it => {
  //           return it.toLowerCase().includes(ruleObj.newValue.toLowerCase());
  //         });
  //         this.currentSugg = filteredValues;
  //       }
  //     } else {
  //       this.currentSugg = mainContext;
  //     }
  //   } else {
  //     this.currentSugg = mainContext;
  //   }
  // }
  // removeTag(tags, index) {
  //   tags.splice(index, 1);
  // }
  openDateTimePicker(ruleObj, index) {
    setTimeout(() => {
      if (ruleObj && ruleObj.operator === 'between') {
        $('#rangePicker_' + index).click();
      } else {
        $('#datePicker_' + index).click();
      }
    })
  }
  onDatesUpdated(event, ruleObj) {
    if (!ruleObj.value) {
      ruleObj.value = [];
    }
    if (ruleObj && ruleObj.operator === 'between') {
      if (event.startDate && event.endDate) {
        moment.utc();
        const date = [];
        const startDate = moment.utc(event.startDate).format();
        const endDate = moment.utc(event.endDate).format();
        date.push(startDate);
        date.push(endDate)
        ruleObj.value.push(date)
      }
    } else {
      if (event.startDate) {
        const date = moment.utc(event.startDate).format();
        ruleObj.value.push(date)
      }
    }
  }
  ruleSelection(ruleObj, value, key) {
    if (key === 'contextCategory') {
      ruleObj.contextCategory = value;
      if(ruleObj.contextCategory == 'traits'){
        ruleObj.dataType = 'trait';
      } else if(ruleObj.contextCategory == 'entity'){
        ruleObj.dataType = 'entity';
      } else if(ruleObj.contextCategory == 'keywords'){
        ruleObj.dataType = 'keyword';
      }else{
        ruleObj.dataType = 'string';
      }
    }
    if (key === 'contextType') {
      ruleObj.contextType = value;
      ruleObj.contextCategory = this.ruleOptions[value][0];
    }
    if (key === 'operator') {
      ruleObj.operator = value;
    }
    if (key === 'dataType') {
      if (ruleObj.dataType !== value) {
        ruleObj.operator = this.conditions[value][0];
        ruleObj.value = [];
      }
      ruleObj.dataType = value;
    }
  }
  addNewRule(index, faq) {
    const ruleObj: any = JSON.parse(JSON.stringify(this.defaultValuesObj));
    ruleObj.value = []
    if (!faq.conditions) {
      faq.conditions = [];
    }
    faq.conditions.push(ruleObj)
  }
  removeRule(index, rules) {
    rules.splice(index, 1);
  }
  addRules(event: MatChipInputEvent, ruleObj, i) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags1((value || '').trim(), ruleObj.value)) {
        this.notify.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        ruleObj.value.push(value);
      }
    }
    if (input) {
      input.value = '';
    }
    this.suggestedInput.nativeElement.value = '';
  }
  checkDuplicateTags1(suggestion: string, alltTags): boolean {
    return alltTags.every((f) => f !== suggestion);
  }
  setResponseType(type, responseObj) {
    responseObj.responseType = type;
  }
  setEditorContent(event, responseObj, type, index) {
    // console.log(event, typeof event);
    console.log(this.obj);
  }
  getAltTags(e) {
    // console.log(e);
    const payload = {
      query: this.form.get('question').value
    }
    const params = {
      userId: this.authService.getUserId(),
      ktId: this.kgService.getKgTaskId()
    }
    this.service.invoke('get.possibletags', params, payload).subscribe(res => {
      this.suggestionTags = res;
    }, err => { })
  }
  checkDuplicateConditions(suggestion: string = '', conditions): boolean {
    return conditions.every(f => f.value.toLowerCase() !== suggestion.toLowerCase());
  }
  addConditionTag(event: MatChipInputEvent, faqObj) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateConditions((value || '').trim(), faqObj.conditions)) {
        this.notify.notify('Duplicate tags are not allowed', 'warning');
      } else {
        const conditionTags: any = JSON.parse(JSON.stringify(this.conditionInterface));
        conditionTags.value = value;
        faqObj.conditions.push(conditionTags);
        this.conditionQuary = '';
      }
    }
  }
  removeConditionTag(tag, faqObj, index) {
    if (faqObj && faqObj.conditions.length) {
      faqObj.conditions.splice(index, 1);
    }
  }
  changeResponseType(faqObj, index) {
    faqObj.answerType = (faqObj.answerType === 'condition') ? 'default' : 'condition';
    if (faqObj.answerType === 'condition' && !(faqObj.conditions && faqObj.conditions.length)) {
      this.addNewRule(index, faqObj)
    }
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim())) {
        this.notify.notify('Duplicate tags are not allowed', 'warning');
      } else {
        this.tags.push(value.trim());
        this.typedQuery = '';
      }
    }
  }
  addAnotherResponse(type) {
    if (type === 'default') {
      const tempResponseObj = JSON.parse(JSON.stringify(this.defaultAnsInterface))
      this.faqResponse.defaultAnswers.push(tempResponseObj);
      this.currentEditIndex = this.faqResponse.defaultAnswers.length - 1;
      this.bubblePopUp=true;
    } 
    else if (type === 'conditional') {
      const tempResponseObj = JSON.parse(JSON.stringify(this.conditionalAnsInterface))
      this.faqResponse.conditionalAnswers.push(tempResponseObj);
      this.currentEditIndex = this.faqResponse.conditionalAnswers.length - 1;
      this.bubblePopUp=true;
    }
    this.initializeEditResponselayoutEvents();
  }
  initializeEditResponselayoutEvents() {
    if ($('.text-area-editor').length) {
      $('.text-area-editor').off('click').on('click', function (event) {
        $('.editResponseMode').addClass('focusedEdit');
      });
    }
    
    $('.add-faq-modal-popup').off('click').on('click', function (event) {
      if (!$(event.target).closest('.text-area-editor').length && !$(event.target).closest('.provideLinkPopup').length && $('.editResponseMode').hasClass('focusedEdit')) {
        $('.editResponseMode').addClass('d-none');
        $('.previewResponseMode').removeClass('d-none');
        $('.editResponseMode').removeClass('focusedEdit');
        $('.text-area-editor').click();
      }
    });

    // $(document).off('click').on('click', function (event) {
    //   if (!$(event.target).closest('.text-area-editor').length && !$(event.target).closest('.provideLinkPopup').length && $('.editResponseMode').hasClass('focusedEdit')) {
    //     $('.editResponseMode').addClass('d-none');
    //     $('.previewResponseMode').removeClass('d-none');
    //     $('.editResponseMode').removeClass('focusedEdit');
    //     $('.text-area-editor').click();

    //   }
    // });

    if ($('.responsePreviewBlock').length) {
      setTimeout(() => {
        $('.responsePreviewBlock').click(function () {
          setTimeout(() => {
            $('.editResponseMode').removeClass('d-none');
            $('.previewResponseMode').addClass('d-none');
            $('.editResponseMode').addClass('focusedEdit');
          }, 100);
        })
      }, 1000);
    }

  }
  remove(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  delete(index) {
    if (this.faqResponse && this.faqResponse.defaultAnswers && this.faqResponse.defaultAnswers.length > 1) {
      this.faqResponse.defaultAnswers.splice(index, 1);
    } 
   else if (this.faqResponse && this.faqResponse.conditionalAnswers && this.faqResponse.conditionalAnswers.length > 1) {
      this.faqResponse.conditionalAnswers.splice(index, 1);
    }
    else {
      this.notify.notify('Default answer is required', 'error');
    }
  }
  setDataforEditDelete(faqdata) {
    if (faqdata) {
      if (faqdata && faqdata._source && faqdata._source.faq_answer && faqdata._source.faq_answer.length) {
        $.each(faqdata._source.faq_answer, (i, answer) => {

          const answerObj: any = {
            type: "string",
            text: answer.text,
            answerType: 'default',
            responseType: 'default',
            conditions: [],
            image: answer.image_url,
            image_url: (answer||{}).image_url
          }
          if (answer.type === 'javascript' && answer.text) {
            try {
              answerObj.text = JSON.parse(answer.text);
            } catch (e) {
              console.log('Bad JSON');
            }
          }
          if (answer && answer.image_url && answer.image_url) {
            answerObj.image_url = answer.image_url;
            // answerObj.responseType = answer.multimedia.position
          }
          this.faqResponse.defaultAnswers.push(answerObj);
        })
      }
      if (faqdata && faqdata._source && faqdata._source.faq_cond_answers && faqdata._source.faq_cond_answers && faqdata._source.faq_cond_answers.length) {
        $.each(faqdata._source.faq_cond_answers, (i, answer) => {
          const answerObj: any = {
            type: 'string',
            text: '',
            answerType: 'condition',
            responseType: 'default',
            // conditions: answer.conditions || []
          }
          const _conditions = [];
          answer.conditions.forEach(element => {
            _conditions.push(element);
          });
          answerObj.conditions = _conditions || []
          if (answer && answer.answers && answer.answers.length) {
            answerObj.type = answer.answers[0].type;
            answerObj.text = answer.answers[0].text;
            answerObj.image_url = answer.answers[0].image_url;
          }
          if (answer.type === 'javascript' && answer.text) {
            try {
              answerObj.text = JSON.parse(answer.text);
            } catch (e) {
              console.log('Bad JSON');
            }
          }
          if (answer && answer.answers.length && answer.answers[0].image_url) {
            answerObj.image_url = answer.answers[0].image_url;
          }
          // this.faqResponse.defaultAnswers.push(answerObj);
          this.faqResponse.conditionalAnswers.push(answerObj);
        })
      }
    } else {
      // const tempResponseObj = JSON.parse(JSON.stringify(this.defaultAnsInterface))
      // this.faqResponse.defaultAnswers.push(tempResponseObj);
    }
  }
  prpaerFaqsResponsePayload() {
    const defaultAnswers = [];
    const conditionalAnswers = [];
    if (this.faqResponse && this.faqResponse.defaultAnswers && this.faqResponse.defaultAnswers.length) {
      $.each(this.faqResponse.defaultAnswers, (i, answer) => {
        if (answer.answerType !== 'condition') {
          const answerObj: any = {
            type: answer.type,
            text: answer.text,
          }
          if (answer.type === 'javascript' && answer.text) {
            answerObj.text = JSON.stringify(answer.text);
          }
          if (answer.image_url && answer.image_url) {
            answerObj.image_url = answer.image_url;
          }
          if(answer && answer.image && answer.image.url){
            answerObj.image_url = answer.image.url
          }
          defaultAnswers.push(answerObj);
        }
      })
    }
        if (this.faqResponse && this.faqResponse.conditionalAnswers && this.faqResponse.conditionalAnswers.length) {
          $.each(this.faqResponse.conditionalAnswers, (i, answer) => {
        if (answer.answerType === 'condition') {
          const answerObj1: any = {
            type: answer.type,
            text: answer.text,
          }
          if (answer.type === 'javascript' && answer.text) {
            answerObj1.text = JSON.stringify(answer.text);
          }
          if (answer && answer.image_url) {
            answerObj1.image_url =  answer.image_url;
          }
          if (answer && answer.image && answer.image.url) {
            answerObj1.image_url =  answer.image.url;
          }
          const _conditions = [];
          if (answer.conditions) {
            answer.conditions.forEach(element => {
              _conditions.push(element);
            });
          }
          const conditionAnswerObj: any = {
            answers: [],
            conditions: _conditions || [],
          }
          conditionAnswerObj.answers.push(answerObj1);
          conditionalAnswers.push(conditionAnswerObj);
        }
      })
    }     
    this.anwerPayloadObj.defaultAnswers = defaultAnswers;
    this.anwerPayloadObj.conditionalAnswers = conditionalAnswers;
    if(conditionalAnswers.length != 0){
      this.mixpanel.postEvent('FAQ-created-Conditional response',{})
    }
   
  }
  addAnotherAlternate(isHideInput?) {
    $('#addAlternateFaq').click();
    setTimeout(() => {
      if(!isHideInput){
        this.isAdd = true;
      }
    });
  }
  save() {
    // if (this.imgInfo.url && this.imgInfo.url.length) {
    //   this.addImage();
    // }
    $('#addAlternateFaq').click();
    this.prpaerFaqsResponsePayload();
    if (this.anwerPayloadObj.defaultAnswers && this.anwerPayloadObj.defaultAnswers.length) {
      const oneValidRespone = _.filter(this.anwerPayloadObj.defaultAnswers, (answer) => {
        delete answer.type;
        return ((answer.text !== '') && (answer.text !== undefined) && (answer.text !== null));
      })
      let defaultAns = [...this.anwerPayloadObj.defaultAnswers];
      for (let k = defaultAns.length - 1; k >= 0; k--) {
        if (defaultAns[k].text.trim() == "") {
          this.anwerPayloadObj.defaultAnswers.splice(k, 1);
        }
      }
      if (!(oneValidRespone && oneValidRespone.length)) {
        this.notify.notify('Default answer is required', 'error');
        return;
      }
    } else {
      this.notify.notify('Default answer is required', 'error');
      return;
    }
    if (!(this.form && this.form.get('question') && this.form.get('question').value)) {
      this.notify.notify('Please add atleast question', 'error');
      return;
    }
    const emmiter = this.faqData && !this.addAltFaq ? this.editFaq : this.addFaq;
    this.loading = true;
    const payload = {
      _source: {
        question: this.form.get('question').value,
        tags: this.tags,
        defaultAnswers: this.anwerPayloadObj.defaultAnswers,
        conditionalAnswers: this.anwerPayloadObj.conditionalAnswers,
        alternateQuestions: (this.faqData && this.faqData._source && this.faqData._source.faq_alt_questions) ? this.faqData._source.faq_alt_questions : ((this.addAltFaq && this.addAltFaq._source && this.addAltFaq._source.faq_alt_questions) ? this.addAltFaq._source.faq_alt_questions : []),
      },
      followupQuestions: (this.faqData && this.faqData.followupQuestions) ? this.faqData.followupQuestions : [],
      response: this.form.get('botResponse').value,
      _id: this.faqData && !this.addAltFaq  ? this.faqData._id : null,
      quesList: this.quesList,
      cb: (res => { this.loading = false })
    }
    emmiter.emit(payload);
  }

  cancel() {
    this.cancelfaqEvent.emit();
  }
  toggle(popOver, popOverid?) {
    setTimeout(() => {
      if (!this.isFocused) {
        popOver.close()
      }
    }, 1000)
  }
  containFocused(isFocused) {
    this.isFocused = isFocused
  }
  addSynonym(tag) {
    // debugger;
    tag.synonyms.push(this.newSynonym);
    this.newSynonym = '';
  }

  removeSynonym(tag, index) {
    tag.synonyms.splice(index, 1);
  }
  removeTag(tags, index) {
    tags.splice(index, 1);
  }
  checkDuplicateTags(suggestion: string = ''): boolean {
    return this.tags.every(f => f.toLowerCase() !== suggestion.toLowerCase())
  }
  selectedTag(data: MatAutocompleteSelectedEvent) {
    this.suggestedInput.nativeElement.value = '';
    this.tags.push(data.option.viewValue);
  }
  showpopup(popOver) {
    const elements = document.getElementsByClassName('bs-popover-bottom');
    while (elements.length > 0) elements[0].remove();
    setTimeout(() => {
      popOver.open()
    }
    )
  }
  chatInputUpdate(event) {
    alert(event.text);
  }
  checkTags(suggestion) {
    return this.tags.find(f => f === suggestion)
  }
  selectCurrentFocusedResponse(id, responseObj, type, index) {
    console.log("payload responseObj", responseObj)
    if (responseObj) {
      this.selectedResponseToEdit.resposneObj = responseObj;
      this.selectedResponseToEdit.index = index;
      this.selectedResponseToEdit.type = type;
      this.selectedResponseToEdit.id = id;
      this.container = '#mainChatInputContainer' + type + '_' + index;
    }
  }
  openPreviewModal() {
    this.externalResponsePopRef = this.externalResponsePop.open();
  }
  closeExternalPopUpRef() {
    if (this.externalResponsePopRef && this.externalResponsePopRef.close) {
      this.externalResponsePopRef.close();
    }
  }
  openImgApp(resposneObj, index, type) {
    this.selectedResponseToEdit.resposneObj = resposneObj;
    this.selectedResponseToEdit.index = index;
    this.selectedResponseToEdit.type = type;
    this.createImagePopRef = this.createImagePop.open();
  }
  //  closeImgApp() {
  //   this.createImagePopRef.close();
  //  }
  addImage() {
    // this.imgInfo && this.imgInfo.url ? this.defaultAnsInterface.multimedia.url = this.imgInfo.url : ''
    this.faqResponse.defaultAnswers.forEach((element, index) => {
      if (this.faqResponse.defaultAnswers.length - 1 == index) {
        (element||{})['image_url'] = this.imgInfo && this.imgInfo.url ? this.imgInfo.url : ''
      }
    });
    this.faqResponse.conditionalAnswers.forEach((element, index) => {
      if (this.faqResponse.conditionalAnswers.length - 1 == index) {
        (element||{})['image_url'] = this.imgInfo && this.imgInfo.url ? this.imgInfo.url : ''
      }
    });
    this.image = JSON.parse(JSON.stringify(this.imgInfo));
    this.selectedResponseToEdit = this.imgInfo;
    // this.closeImgApp();
  }
  openLinkApp(range) {
    this.linkInfo.range = range;
    this.linkInfo.type = 'link';
    this.createLinkPopRef = this.createLinkPop.open();
  }
  closeLinkApp() {
    this.linkInfo = {};
    this.createLinkPopRef.close();
  }
  responseChnge(event) {
    if (event) {
      console.log(event);
      // $(event.currentTarget)[0].innet
    }
    // this.form.get('question').setValue();
  }
  getMessage() {
    let text = '';
    if (this.contentEditableElement) {
      text = $(this.container)[0].innerText;
    } else {
      text = $(this.container).val();
    }
    return text;
  }
  getRange() {
    const startIndex = $(this.container)[0].selectionStart;
    const endIndex = $(this.container)[0].selectionEnd;
    const selectedText = this.getMessage().substring(startIndex, endIndex);
    const stringMarkInfo = {
      startIndex,
      endIndex,
      text: selectedText
    };
    return stringMarkInfo;
  }
  getSelectionCharOffsetsWithin(element) {
    element = element[0];
    let start = 0;
    let end = 0;
    let range;
    let priorRange;
    if (typeof window.getSelection !== undefined) {
      range = window.getSelection().getRangeAt(0);
      priorRange = range.cloneRange();
      priorRange.selectNodeContents(element);
      priorRange.setEnd(range.startContainer, range.startOffset);
      start = priorRange.toString().length;
      end = start + range.toString().length;
      const selectedText = this.getMessage().substring(start, end);
      return {
        startIndex: start,
        endIndex: end,
        text: selectedText
      };
    }
  }
  getTextStartEndIndex() {
    const mainDiv = $($(this.container)[0]);
    const sel = this.getSelectionCharOffsetsWithin(mainDiv);
    return sel;
  }
  onSelected(type) {
    const _self: any = this;
    let range: any = {
      startIndex: 0,
      endIndex: 0,
      text: ''
    };
    if (this.contentEditableElement) {
      range = this.getTextStartEndIndex();
    } else {
      range = this.getRange();
    }
    if (type === 'link') {
      this.openLinkApp(range);
    } else {
      _self[type](range.text, range);
    }
    // if(type === 'underline'){
    //   $(this.container)[0].innerText.style.textdecoration = "underline"
    // }
  }
  replaceAt(range, replacement, mainText) {
    if (range.startIndex >= mainText.length) {
      return mainText + replacement;
    }
    return mainText.substring(0, range.startIndex) + replacement + mainText.substring(range.endIndex);
  }
  handleToolBarAction(text, range) {
    const replaceValue = this.getMessage() || '';
    const replacedValue = this.replaceAt(range, text, replaceValue);
    const newMessage = replacedValue;
    if (this.contentEditableElement) {
      const event = {
        action: 'save',
        text: newMessage
      };
      $(this.contentEditableElement)[0].innerText = newMessage;
      this.form.get('botResponse').setValue(newMessage);
    } else {
      const _event = {
        action: 'save',
        text: newMessage
      };
      $(this.container).val(newMessage);
      if (this.selectedResponseToEdit && this.selectedResponseToEdit.index > -1) {
        $.each(this.faqResponse.defaultAnswers, (i, key) => {
          if (i === this.selectedResponseToEdit.index) {
            key.text = newMessage;
          }
        })
      }
      this.form.get('botResponse').setValue(newMessage);
      // $(this.container).focus();
    }
  }
  saveLink() {
    let text;
    let link;
    text = this.linkInfo.link;
    link = this.linkInfo.linkText;

    if (this.linkInfo.type === 'link') {
      text = '[' + link + '](' + text + ')';
    } else if (this.linkInfo.type === 'image') {
      text = '![' + link + '](' + text + ')';
    }
    this.handleToolBarAction(text, this.linkInfo.range);
    this.closeLinkApp()
  };
  bold(text, range) {
    const verifyForUndo = (tex) => {
      let chunk;
      chunk = tex.replace(/\*/g, '');
      return ('*' + chunk + '*') === tex;
    };
    if (verifyForUndo(text)) {
      text = text.replace(/\*/g, '');
      this.handleToolBarAction(text, range);
      return;
    }
    text = '*' + text + '*';
    this.handleToolBarAction(text, range);
  }
  italic(text, range) {
    const verifyForUndo = (tex) => {
      let chunk;
      chunk = tex.replace(/~/g, '');
      return ('_' + chunk + '_') === tex;
    };
    if (verifyForUndo(text)) {
      text = text.replace(/_/g, '');
      this.handleToolBarAction(text, range);
      return;
    }
    text = '_' + text + '_';
    this.handleToolBarAction(text, range);
  }
  ordered(text, range) {
    text = text.split('\n');
    text = text.map((chunk, i) => {
      // tslint:disable-next-line:triple-equals
      if (chunk.search(/^([0-9]+?\.\s)/) != -1) {
        // tslint:disable-next-line:whitespace
        return chunk.replace(/^([0-9]+?\.\s)/, '');
      } else {
        return (i + 1) + '. ' + chunk;
      }
    });
    text = text.join('\n');
    this.handleToolBarAction(text, range);
  }
  unordered(text, range) {
    text = text.split('\n');
    text = text.map((chunk, i) => {
      // tslint:disable-next-line:triple-equals
      if (chunk.search(/\*\s/) != -1) {
        // tslint:disable-next-line:whitespace
        return chunk.replace(/\*\s/, '');
      } else {
        return '* ' + chunk;
      }
    });
    text = text.join('\n');
    this.handleToolBarAction(text, range);
  }
  indentLeft(text, range) {
    const verifyForUndo = (txt) => {
      let chunk;
      chunk = txt.replace(/^>>/, '');
      return ('>>' + chunk) === txt;
    };
    if (verifyForUndo(text)) {
      text = text.replace(/^>>/, '');
      this.handleToolBarAction(text, range);
      return;
    }
    text = '>>' + text;
    this.handleToolBarAction(text, range);
  }
  indentRight(text, range) {
    const verifyForUndo = (txt) => {
      let chunk;
      chunk = txt.replace(/^<</, '');
      return ('<<' + chunk) === txt;
    };
    if (verifyForUndo(text)) {
      text = text.replace(/^<</, '');
      this.handleToolBarAction(text, range);
      return;
    }
    text = '<<' + text;
    this.handleToolBarAction(text, range);
  }
  line(text, range) {
    text = text + '\n___';
    this.handleToolBarAction(text, range);
  }

  addAltQues() {
    if(this.isAdd){
      this.addAnotherAlternate();
    }
    this.faqServiceAlt.updateVariation('alternate');
    this.faqServiceAlt.updateFaqData(this.faqData);
    this.isAdd = true;
  }

  addFollowupQues() {
    this.isAlt = true;
    this.followInpKeySub = this.faqServiceFollow.inpKeywordsAdd.subscribe(res => {
      if (this.quesList.followupQuestions[0]) { this.quesList.followupQuestions[0].keywords = _.map(res, o => { return { keyword: o } }); }
      else {
        this.quesList.followupQuestions[0] = {};
        this.quesList.followupQuestions[0].keywords = _.map(res, o => { return { keyword: o } });
      }
    });
    this.followInpQuesSub = this.faqServiceFollow.inpQuesAdd.subscribe(res => {
      if (this.quesList.followupQuestions[0]) { this.quesList.followupQuestions[0].question = res; }
      else {
        this.quesList.followupQuestions[0] = {};
        this.quesList.followupQuestions[0].question = res;
      }
    });
  }
  editAltQuestion(altQuestion, index) {
    this.editAltQuestionIndex = index;
    this.altQuestionEdit = altQuestion;
  }
  closeAltQuestion() {
    this.altQuestionEdit = '';
    this.editAltQuestionIndex = null;
  }
  delAltQues(ques, index, event) {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Are you sure you want to delete?',
        body: 'Selected alternate question will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.faqData._source.faq_alt_questions.splice(index, 1);
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
    // this.faqData._source.alternateQuestions = _.without(this.faqData._source.alternateQuestions, _.findWhere(this.faqData._source.alternateQuestions, { _id: ques._id }));
  }
  ngAfterViewInit() {
    this.initializeEditResponselayoutEvents();
  }
  ngOnDestroy() {
    this.eventsSubscription ? this.eventsSubscription.unsubscribe() : false;
    this.altAddSub ? this.altAddSub.unsubscribe() : false;
    this.altCancelSub ? this.altCancelSub.unsubscribe() : false;
    this.followInpKeySub ? this.followInpKeySub.unsubscribe() : false;
    this.followInpQuesSub ? this.followInpQuesSub.unsubscribe() : false;
    this.altInpKeySub ? this.altInpKeySub.unsubscribe() : false;
    this.altInpQuesSub ? this.altInpQuesSub.unsubscribe() : false;
    this.groupAddSub ? this.groupAddSub.unsubscribe() : false;
  }

  openPreviewImgModal(image_url) {
    this.image.url = image_url;
    this.previewImageModalPopRef = this.previewImageModalPop.open();
  }
  closePreviewImgModal() {
    if (this.previewImageModalPopRef && this.previewImageModalPopRef.close) {
      this.previewImageModalPopRef.close();
    }
  }

  closebubblePopUp(){
    this.bubblePopUp= false
  }
}
