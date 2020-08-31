import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
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
declare const $: any;
// import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent implements OnInit {
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  form: FormGroup;
  tags: any[] = [];
  text = '';
  isFocused = false;
  synonyms = [];
  newSynonym = ''
  suggestionTags = [];
  typedQuery = '';
  // options:any = {maxLines: 20, printMargin: false};
  options: MdEditorOption = {
    showPreviewPanel: false,
    hideIcons: ['TogglePreview']
  }
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  loading: boolean;
  @Input() inputClass: string;
  @Input() faqData: any;
  @Output() addFaq = new EventEmitter();
  @Output() cancelfaqEvent = new EventEmitter();
  @Output() editFaq = new EventEmitter();
  constructor(private fb: FormBuilder,
    config: NgbTooltipConfig,
    private service: ServiceInvokerService,
    private authService: AuthService,
    private kgService: KgDataService,
    private notify: NotificationService) {
      config.container = 'body'
     }

  ngOnInit() {
    if (this.faqData) {
      this.form = this.fb.group({
        question: [this.faqData.questionPayload.question, Validators.required],
        botResponse: [this.faqData.answerPayload[0].text, Validators.required]
      });
      this.tags = this.faqData.questionPayload.tagsPayload;
      this.text = this.faqData.answerPayload[0].text;
    } else {
      this.form = this.fb.group({
        question: ['', Validators.required],
        botResponse: ['', Validators.required]
      });
    }
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

    // Add our tag
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim())) {
        this.notify.notify('Duplicate tags are not allowed', 'warning');
      } else {
        this.tags.push({ tag: value.trim(), synonyms: [] });
      }
    }

    // Reset the input value
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
    return this.tags.every(f => f.tag.toLowerCase() !== suggestion.toLowerCase())
  }

  selectedTag(data: MatAutocompleteSelectedEvent) {
    this.suggestedInput.nativeElement.value = '';
    const obj: any = {
      tag: data.option.viewValue,
      synonyms: []
    }
    this.tags.push(obj);
    console.log(data);
  }
  showpopup(popOver) {
    const elements = document.getElementsByClassName('bs-popover-bottom');
    while (elements.length > 0) elements[0].remove();
    setTimeout(()=>{
        popOver.open()
      }
      )
  }
  checkTags(suggestion){
    return this.tags.find(f=>f=== suggestion)
  }
}
