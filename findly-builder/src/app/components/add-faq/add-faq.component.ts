import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MdEditorOption } from 'src/app/helpers/lib/md-editor.types';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import  { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { FaqsService } from '../../services/faqsService/faqs.service';
import * as _ from 'underscore';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { Subscription } from 'rxjs';
declare const $: any;
// import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss'],
  providers: [ { provide: 'instance1', useClass: FaqsService },
            { provide: 'instance2', useClass: FaqsService }, ]
})
export class AddFaqComponent implements OnInit, OnDestroy  {
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('createImagePop') createImagePop: KRModalComponent;
  @ViewChild('createLinkPop') createLinkPop: KRModalComponent;
  @Input() inputClass: string;
  @Input() faqData: any;
  @Output() addFaq = new EventEmitter();
  @Output() cancelfaqEvent = new EventEmitter();
  @Output() editFaq = new EventEmitter();
  createLinkPopRef
  createImagePopRef
  faqs:any = {}
  anwerPayloadObj:any = {};
  codeMirrorOptions: any = {
    theme: 'idea',
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };
  conditionQuary:any = ''
  obj;
  faqResponse ={
    defaultAnswers:[]
  }
 faqResponse1 ={
   conditionalAnswers:[
   {
   conditions:[
   { key: 'a.b.c.d', op: 'exists', value: '' },
   { key: 'x.y', op: 'eq', value: 'somvalue' },
   { key: 'y', op: 'noteq', value: 'someothervalue' }
   ],
   answers:[
   {
   payload: 'actual answer text',
   type: 'string/javascript'
   },
   {
   payload: 'actual answer text',
   type: 'string/javascript'
   }
   ]
   },
   {
   conditions: [
   { key: 'a.b.c.d', op: 'exists', value: '' },
   { key: 'x.y', op: 'eq', value: 'somvalue' },
   { key: 'y', op: 'noteq', value: 'someothervalue' }
   ],
   answers: [
   {
   payload: 'actual answer text',
   type: 'simple/javascript'
   },
   {
   payload: 'actual answer text',
   type: 'simple/javascript'
   }
   ]
   }
   ],
   defaultAnswers:
   [
   {
   payload: 'actual answer text',
   type: 'javascript'
   },
   {
   payload: 'actual answer text',
   type: 'string'
   }
   ]
 }

  form: FormGroup;
  tags: any[] = [];
  text = '';
  image:any = {
    url:'',
    alt:''
  }
  defaultResponse:any = {}
  responseMethod  = 'basic';
  imgInfo :any ={};
  linkInfo:any = {}
  responseType:any= 'default'
  isFocused = false;
  synonyms = [];
  newSynonym = ''
  suggestionTags = [];
  typedQuery = '';
  container ='#mainChatInputContainer'
  isAlt = false;
  isAdd = false;
  contentEditableElement =  false  // '#mainChatInputContainerDiv';
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
  conditionInterface:any = { key: '', op: '', value: '' };
  defaultAnsInterface:any =  {
    answerType:'default', // default/conditional
    responseType: 'default',
    payload: '',
    conditions:[],
    type: 'string',
    image:{
      imageUrl:'',
      alt:'',
    }
  }
  followInpKeySub: Subscription;
  followInpQuesSub: Subscription;
  altInpKeySub: Subscription;
  altInpQuesSub: Subscription;
  groupAddSub: Subscription;
  selectedResponseToEdit:any = {};
  constructor(private fb: FormBuilder,
    config: NgbTooltipConfig,
    private service: ServiceInvokerService,
    private authService: AuthService,
    private kgService: KgDataService,
    private notify: NotificationService,
    private faqService: FaqsService,
    @Inject('instance1') private faqServiceAlt: FaqsService,
    @Inject('instance2') private faqServiceFollow: FaqsService
    ) {
      config.container = 'body'
     }

  ngOnInit() {
    this.obj= JSON.stringify({
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
      if(this.faqData.templateSettings){
        this.responseType = this.faqData.templateSettings.responseType
      }
      this.form = this.fb.group({
        question: [this.faqData.question, Validators.required],
        botResponse: [this.faqData.answer, Validators.required],
      });
      this.tags = this.faqData.keywords;
      this.text = this.faqData.answer;
    } else {
      this.form = this.fb.group({
        question: ['', Validators.required],
        botResponse: ['', Validators.required]
      });
    }
    this.groupAddSub =  this.faqService.groupAdded.subscribe(res=>{ this.groupsAdded = res; });
  }
  setResponseType(type,responseObj){
    responseObj.responseType = type;
  }
  setEditorContent(event,responseObj,type,index) {
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
    }, err=> {} )
  }
  checkDuplicateConditions(suggestion: string = '',conditions): boolean {
    return conditions.every(f => f.value.toLowerCase() !== suggestion.toLowerCase());
  }
  addConditionTag(event: MatChipInputEvent,faqObj){
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateConditions((value || '').trim(),faqObj.conditions)) {
        this.notify.notify('Duplicate tags are not allowed', 'warning');
      } else {
        const conditionTags:any = JSON.parse(JSON.stringify(this.conditionInterface));
        conditionTags.value = value;
        faqObj.conditions.push(conditionTags);
        this.conditionQuary = '';
      }
    }
  }
  removeConditionTag(tag,faqObj,index){
    if(faqObj && faqObj.conditions.length){
      faqObj.conditions.slice(index,1);
    }
  }
  changeResponseType(faqObj){
    faqObj.answerType = (faqObj.answerType ==='condition')?'default':'condition';
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
  addAnotherResponse(type){
   if(type==='default'){
     const tempResponseObj = JSON.parse(JSON.stringify(this.defaultAnsInterface))
     this.faqResponse.defaultAnswers.push(tempResponseObj);
   }
  }
  remove(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  setDataforEditDelete(faqdata){
    if(faqdata){
      if(faqdata && faqdata.defaultAnswers && faqdata.defaultAnswers.length){
        $.each(faqdata.defaultAnswers,(i,answer)=>{
            const answerObj:any = {
              type: answer.type,
              payload:answer.payload,
              answerType:'default',
              responseType: 'default',
              conditions:[
                { key: '', op: '', value: '' },
              ],
              image:answer.multimedia
            }
            if(answer.type === 'javascript' && answer.payload){
              try {
                answerObj.payload = JSON.parse(answer.payload);
              } catch(e){
                 console.log('Bad JSON');
              }
            }
            if(answer && answer.image && answer.image.url){
              answerObj.multimedia = {
                type:'image',
                url:answer.image.url,
                viewType:answer.responseType,
              }
           }
          this.faqResponse.defaultAnswers.push(answerObj);
        })
      }
      if(faqdata && faqdata.defaultAnswers && faqdata.conditionalAnswers.length){
        $.each(faqdata.conditionalAnswers,(i,answer)=>{
            const answerObj:any = {
              type: 'string',
              payload:'',
              answerType:'default',
              responseType: 'default',
              conditions: answer.conditions || []
            }
            if(answer && answer.answers && answer.answers.length){
              answerObj.type =  answer.answers[0].type;
              answerObj.payload =  answer.answers[0].payload;
              answerObj.image = answer.answers[0].multimedia;
            }
            if(answer.type === 'javascript' && answer.payload){
              try {
                answerObj.payload = JSON.parse(answer.payload);
              } catch(e){
                 console.log('Bad JSON');
              }
            }
            if(answer && answer.image && answer.image.imageUrl){
              answerObj.multimedia = {
                type:'image',
                url:'answer.image.imageUrl',
              }
            this.faqResponse.defaultAnswers.push(answerObj);
          }
        })
      }
    } else {
      const tempResponseObj = JSON.parse(JSON.stringify(this.defaultAnsInterface))
      this.faqResponse.defaultAnswers.push(tempResponseObj);
    }
  }
  prpaerFaqsResponsePayload(){
    const defaultAnswers = [];
    const conditionalAnswers = [];
    if(this.faqResponse && this.faqResponse.defaultAnswers && this.faqResponse.defaultAnswers.length){
      $.each(this.faqResponse.defaultAnswers,(i,answer)=>{
        if(answer.answerType !== 'conditional'){
          const answerObj:any = {
            type: answer.type,
            payload:answer.payload,
          }
          if(answer.type === 'javascript' && answer.payload){
            answerObj.payload = JSON.stringify(answer.payload);
          }
          if(answer && answer.image && answer.image.imageUrl){
            answerObj.multimedia = {
              type:'image',
              url:'answer.image.imageUrl',
            }
          }
          defaultAnswers.push(answerObj);
        }
        if(answer.answerType === 'condition'){
          const answerObj1:any = {
            type: answer.type,
            payload:answer.payload,
          }
          if(answer.type === 'javascript' && answer.payload){
            answerObj1.payload = JSON.stringify(answer.payload);
          }
          if(answer && answer.image && answer.image.imageUrl){
            answerObj1.multimedia = {
              type:'image',
              url:'answer.image.imageUrl',
            }
          }
          const conditionAnswerObj:any = {
              answers: [],
              conditions:answer.conditions || [],
          }
          conditionAnswerObj.answers.push(answerObj1);
          conditionalAnswers.push(conditionAnswerObj);
        }
      })
    }
    this.anwerPayloadObj.defaultAnswers = defaultAnswers;
    this.anwerPayloadObj.conditionalAnswers = conditionalAnswers;
  }
  save() {
    this.prpaerFaqsResponsePayload();
    if(this.anwerPayloadObj.defaultAnswers && this.anwerPayloadObj.defaultAnswers.length){
      const oneValidRespone = _.filter(this.anwerPayloadObj.defaultAnswers,(answer) =>{
         return ((answer.payload !== '') && (answer.payload !== undefined) && ( answer.payload !==null ));
      })
       if(!(oneValidRespone && oneValidRespone.length)){
        this.notify.notify('Default answer is required','error');
        return;
       }
    } else {
      this.notify.notify('Default answer is required','error');
      return ;
    }
    if(!(this.form && this.form.get('question') &&  this.form.get('question').value)){
      this.notify.notify('Please add atleast question','error');
      return ;
    }
    const emmiter = this.faqData ? this.editFaq : this.addFaq;
    this.loading = true;
    emmiter.emit({
      question: this.form.get('question').value,
      tags: this.tags,
      defaultAnswers:this.anwerPayloadObj.defaultAnswers,
      conditionalAnswers:this.anwerPayloadObj.defaultAnswers,
      alternateQuestions: this.faqData ? this.faqData.alternateQuestions : [],
      followupQuestions: this.faqData ? this.faqData.followupQuestions : [],
      response: this.form.get('botResponse').value,
      _id: this.faqData ? this.faqData._id : null,
      quesList: this.quesList,
      cb: (res => { this.loading = false })
    })
  }

  cancel() {
    this.cancelfaqEvent.emit();
  }
  toggle(popOver, popOverid ?) {
    setTimeout(()=>{
      if(!this.isFocused) {
        popOver.close()
      }
      },1000)
  }
  containFocused(isFocused) {
    this.isFocused = isFocused
  }
  addSynonym(tag){
    // debugger;
    tag.synonyms.push(this.newSynonym);
    this.newSynonym = '';
  }

  removeSynonym(tag, index) {
    tag.synonyms.splice(index, 1);
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
    setTimeout(()=>{
        popOver.open()
      }
      )
  }
  chatInputUpdate(event){
    alert(event.text);
  }
  checkTags(suggestion){
    return this.tags.find(f=>f=== suggestion)
  }
  selectCurrentFocusedResponse(id,responseObj,type,index){
    if(responseObj){
      this.selectedResponseToEdit.resposneObj = responseObj;
      this.selectedResponseToEdit.index = index;
      this.selectedResponseToEdit.type = type;
      this.selectedResponseToEdit.id = id;
      this.container = '#mainChatInputContainer' + type + '_' + index;
    }
  }
  openImgApp(resposneObj,index,type) {
    this.selectedResponseToEdit.resposneObj = resposneObj;
    this.selectedResponseToEdit.index = index;
    this.selectedResponseToEdit.type = type;
    this.createImagePopRef  = this.createImagePop.open();
   }
   closeImgApp() {
    this.createImagePopRef.close();
   }
   addImage(){
    this.image = this.imgInfo;
    this.selectedResponseToEdit.resposneObj.image = this.imgInfo;
    this.closeImgApp();
   }
   openLinkApp(range) {
     this.linkInfo.range = range;
     this.linkInfo.type = 'link';
    this.createLinkPopRef  = this.createLinkPop.open();
   }
   closeLinkApp() {
    this.linkInfo = {};
    this.createLinkPopRef.close();
   }
   responseChnge(event){
     if(event){
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
      let  start = 0;
      let  end = 0;
      let  range;
      let  priorRange;
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
        if(type==='link'){
           this.openLinkApp(range);
        } else{
          _self[type](range.text, range);
        }
   }
   replaceAt(range, replacement , mainText) {
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
        this.form.get('botResponse').setValue(newMessage);
        $(this.container).focus();
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
      this.handleToolBarAction(text,this.linkInfo.range);
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
   italic(text , range) {
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
    this.handleToolBarAction(text , range);
  }
  ordered(text, range) {
    text = text.split('\n');
    text = text.map((chunk, i) => {
        // tslint:disable-next-line:triple-equals
        if (chunk.search(/^([0-9]+?\.\s)/) != -1) {
            // tslint:disable-next-line:whitespace
            return chunk.replace(/^([0-9]+?\.\s)/,'');
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
            return chunk.replace(/\*\s/,'');
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
    this.isAdd=true;
    this.altInpKeySub = this.faqServiceAlt.inpKeywordsAdd.subscribe(res=>{
      if(this.quesList.alternateQuestions[0]) { this.quesList.alternateQuestions[0].keywords = _.map(res, o=>{return {keyword: o}}); }
      else {
        this.quesList.alternateQuestions[0] = {};
        this.quesList.alternateQuestions[0].keywords = _.map(res, o=>{return {keyword: o}});
      }
    });
    this.altInpQuesSub = this.faqServiceAlt.inpQuesAdd.subscribe(res=>{
      if(this.quesList.alternateQuestions[0]) { this.quesList.alternateQuestions[0].question = res; }
      else {
        this.quesList.alternateQuestions[0] = {};
        this.quesList.alternateQuestions[0].question = res;
      }
    });
  }

  addFollowupQues() {
    this.isAlt=true;
    this.followInpKeySub =  this.faqServiceFollow.inpKeywordsAdd.subscribe(res=>{
      if(this.quesList.followupQuestions[0]) { this.quesList.followupQuestions[0].keywords = _.map(res, o=>{return {keyword: o}}); }
      else {
        this.quesList.followupQuestions[0] = {};
        this.quesList.followupQuestions[0].keywords = _.map(res, o=>{return {keyword: o}});
      }
    });
    this.followInpQuesSub = this.faqServiceFollow.inpQuesAdd.subscribe(res=>{
      if(this.quesList.followupQuestions[0]) { this.quesList.followupQuestions[0].question = res; }
      else {
        this.quesList.followupQuestions[0] = {};
        this.quesList.followupQuestions[0].question = res;
      }
    });
  }
  ngOnDestroy() {
    this.followInpKeySub?this.followInpKeySub.unsubscribe():false;
    this.followInpQuesSub?this.followInpQuesSub.unsubscribe():false;
    this.altInpKeySub?this.altInpKeySub.unsubscribe():false;
    this.altInpQuesSub?this.altInpQuesSub.unsubscribe():false;
    this.groupAddSub?this.groupAddSub.unsubscribe():false;
  }
}

