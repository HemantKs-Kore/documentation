import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MdEditorOption } from 'src/app/helpers/lib/md-editor.types';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { FaqsService } from '../../services/faqsService/faqs.service';
declare const $: any;
// import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss'],
  providers: [ { provide: 'instance1', useClass: FaqsService },
            { provide: 'instance2', useClass: FaqsService }, ]
})
export class AddFaqComponent implements OnInit  {
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @Input() inputClass: string;
  @Input() faqData: any;
  @Output() addFaq = new EventEmitter();
  @Output() cancelfaqEvent = new EventEmitter();
  @Output() editFaq = new EventEmitter();
  form: FormGroup;
  tags: any[] = [];
  text = '';
  isFocused = false;
  synonyms = [];
  newSynonym = ''
  suggestionTags = [];
  typedQuery = '';
  container ='#mainChatInputContainer'
  isAlt: boolean = false;
  isAdd: boolean = false;
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
    if (this.faqData) {
      this.form = this.fb.group({
        question: [this.faqData.question, Validators.required],
        botResponse: [this.faqData.answer, Validators.required]
      });
      this.tags = this.faqData.keywords;
      this.text = this.faqData.answer;
    } else {
      this.form = this.fb.group({
        question: ['', Validators.required],
        botResponse: ['', Validators.required]
      });
    }
    this.faqService.groupAdded.subscribe(res=>{
      this.groupsAdded = res;
    })
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

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim())) {
        this.notify.notify('Duplicate tags are not allowed', 'warning');
      } else {
        this.tags.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  save() {
    const emmiter = this.faqData ? this.editFaq : this.addFaq;
    this.loading = true;
    emmiter.emit({
      question: this.form.get('question').value,
      tags: this.tags,
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
  getMessage() {
    let text = '';
      text = $(this.container).val();
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
          range = this.getRange();
        _self[type](range.text, range);
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
        const _event = {
          action: 'save',
          text: newMessage
        };
        this.form.get('botResponse').setValue(newMessage);
        $(this.container).focus();
    }
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
    this.faqServiceAlt.inpKeywordsAdd.subscribe(res=>{
      if(this.quesList.alternateQuestions[0]) { this.quesList.alternateQuestions[0].keywords = res; }
      else {
        this.quesList.alternateQuestions[0] = {};
        this.quesList.alternateQuestions[0].keywords = res;
      }
    });
    this.faqServiceAlt.inpQuesAdd.subscribe(res=>{
      if(this.quesList.alternateQuestions[0]) { this.quesList.alternateQuestions[0].question = res; }
      else {
        this.quesList.alternateQuestions[0] = {};
        this.quesList.alternateQuestions[0].question = res;
      }
    });
  }

  addFollowupQues() {
    this.isAlt=true;
    this.faqServiceFollow.inpKeywordsAdd.subscribe(res=>{
      if(this.quesList.followupQuestions[0]) { this.quesList.followupQuestions[0].keywords = res; }
      else {
        this.quesList.followupQuestions[0] = {};
        this.quesList.followupQuestions[0].keywords = res;
      }
    });
    this.faqServiceFollow.inpQuesAdd.subscribe(res=>{
      if(this.quesList.followupQuestions[0]) { this.quesList.followupQuestions[0].question = res; }
      else {
        this.quesList.followupQuestions[0] = {};
        this.quesList.followupQuestions[0].question = res;
      }
    });

  }
}

