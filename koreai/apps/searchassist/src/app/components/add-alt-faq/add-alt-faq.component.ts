import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
declare const $: any;
@Component({
  selector: 'app-add-alt-faq',
  templateUrl: './add-alt-faq.component.html',
  styleUrls: ['./add-alt-faq.component.scss'],
})
export class AddAltFaqComponent implements OnInit, OnChanges {
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  altQuestion = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  altTags: any[] = [];
  isFocused = false;
  synonyms = [];
  newSynonym = '';
  suggestionTags = [];
  typedQuery = '';
  loading: boolean;
  @Input() selectedFaq: any;
  @Input() altQuestionIndex: number = null;
  @Output() updateFaq = new EventEmitter();
  @Output() resetAltQuestionIndex = new EventEmitter();
  constructor(
    config: NgbTooltipConfig,
    private service: ServiceInvokerService,
    private authService: AuthService,
    private kgService: KgDataService,
    private notify: NotificationService
  ) {
    // config.placement = 'right';
    config.container = 'body';
  }

  ngOnInit() {
    if (this.altQuestionIndex !== null) {
      this.bindData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedFaq && !changes.selectedFaq.firstChange) {
      this.reset();
      if (changes.selectedFaq.previousValue && changes.selectedFaq.previousValue.questionPayload) {
        // this.altTags = changes.selectedFaq.previousValue.questionPayload.tagsPayload || [];
        // this.altTags = this.options;
      }
    }
    // if (changes.altQuestionIndex && !changes.altQuestionIndex.firstChange) {
    //   if (changes.altQuestionIndex.currentValue !== null && this.selectedFaq) {
    //     this.bindData();
    //   }
    // }
  }

  getAltTags(e) {
    const payload = {
      query: this.altQuestion || '',
    };
    const params = {
      userId: this.authService.getUserId(),
      ktId: this.kgService.getKgTaskId(),
    };
    this.service.invoke('get.possibletags', params, payload).subscribe(
      (res) => {
        this.suggestionTags = res;
      },
      (err) => { }
    );
  }

  bindData(index?) {
    this.altQuestionIndex =
      this.altQuestionIndex !== null ? this.altQuestionIndex : index;
    const selected = this.selectedFaq.subQuestions[this.altQuestionIndex];
    this.altQuestion = selected.question;
    this.altTags = selected.tagsPayload;
  }

  addAltTag(event: MatChipInputEvent): void {
    // debugger;
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {

      if (!this.checkDuplicateTags((value || '').trim())) {
        this.notify.notify('Duplicate tags are not allowed', 'warning');
      } else {
        this.altTags.push({ tag: value.trim(), synonyms: [] });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeAltTag(tag): void {
    const index = this.altTags.indexOf(tag);

    if (index >= 0) {
      this.altTags.splice(index, 1);
    }
  }

  save() {
    const faq = JSON.parse(JSON.stringify(this.selectedFaq));
    this.loading = true;
    faq.subQuestions.push({
      question: this.altQuestion,
      tagsPayload: this.altTags,
    });

    this.updateFaq.emit({
      faq,
      cb: (status) => {
        if (status === 'success') {
          this.reset();
        }
        this.loading = false;
      },
    });
  }

  update() {
    const faq = JSON.parse(JSON.stringify(this.selectedFaq));
    this.loading = true;
    faq.subQuestions.splice(this.altQuestionIndex, 1, {
      question: this.altQuestion,
      tagsPayload: this.altTags,
    });
    this.updateFaq.emit({
      faq,
      cb: (status) => {
        if (status === 'success') {
          this.reset();
        }
        this.loading = false;
      },
    });
  }

  reset() {
    this.altQuestion = '';
    this.altTags = [];
    this.altQuestionIndex = null;
    this.resetAltQuestionIndex.emit();
    // this.selectedFaq = null;
  }

  toggle(popOver, popOverid?) {
    setTimeout(() => {
      if (!this.isFocused) {
        popOver.close();
      }
    }, 2000);
  }
  toggleEnter() { }
  containFocused(isFocused) {
    this.isFocused = isFocused;
  }
  addSynonym(tag) {
    // debugger;
    tag.synonyms.push(this.newSynonym);
    this.newSynonym = '';
  }

  selectedTag(data: MatAutocompleteSelectedEvent) {
    this.suggestedInput.nativeElement.value = '';
    // debugger;
    const obj: any = {
      tag: data.option.viewValue,
      synonyms: [],
    };
    this.altTags.push(obj);
    // console.log(data);
  }
  showpopup(popOver) {
    const elements = document.getElementsByClassName('bs-popover-bottom');
    while (elements.length > 0) elements[0].remove();
    setTimeout(() => {
      popOver.open();
    });
  }

  removeSynonym(tag, index) {
    tag.synonyms.splice(index, 1);
  }

  checkDuplicateTags(suggestion: string): boolean {
    return this.altTags.every((f) => f.tag !== suggestion);
  }
}
