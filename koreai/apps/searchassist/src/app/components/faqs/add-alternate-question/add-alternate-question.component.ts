import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  ElementRef,
  Input,
  Output,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NotificationService } from '../../../services/notification.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
declare const $: any;
import * as _ from 'underscore';
import { AuthService } from '@kore.apps/services/auth.service';
import { KgDataService } from '@kore.apps/services/componentsServices/kg-data.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';

@Component({
  selector: 'app-add-alternate-question',
  templateUrl: './add-alternate-question.component.html',
  styleUrls: ['./add-alternate-question.component.scss'],
})
export class AddAlternateQuestionComponent implements OnInit {
  suggestionTags = [];
  typedQuery = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: any[] = [];
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  f: any = {
    question: '',
  };
  @Input() faqServ: any;
  @Input() isFromFaqsForm: boolean;
  @Output() cancelAltQuestion = new EventEmitter();
  @Output() saveAltQuestion = new EventEmitter();
  constructor(
    private authService: AuthService,
    private kgService: KgDataService,
    private notify: NotificationService,
    private service: ServiceInvokerService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.faqServ.addVariation.alternate
        ? $('#alt').focus()
        : $('#follow').focus();
    }, 200);
  }

  updateAltQues(ques) {
    this.faqServ.updateAltQues.next(ques);
  }

  addAltQues(ques) {
    this.faqServ.addAltQues.next(ques);
  }
  selectedTag(data: MatAutocompleteSelectedEvent) {
    this.suggestedInput.nativeElement.value = '';
    this.tags.push(data.option.viewValue);
  }
  getAltTags(e) {
    const payload = {
      query: this.f.question,
    };
    const params = {
      userId: this.authService.getUserId(),
      ktId: this.kgService.getKgTaskId(),
    };
    this.service.invoke('get.possibletags', params, payload).subscribe(
      (res) => {
        this.suggestionTags = res;
      },
      (err) => {}
    );
  }

  remove(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
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
      }
    }
    if (input) {
      input.value = '';
    }
  }

  checkDuplicateTags(suggestion: string = ''): boolean {
    return this.tags.every((f) => f.toLowerCase() !== suggestion.toLowerCase());
  }

  addFaq() {
    if (this.f.question.trim() == '') {
      return;
    }
    let params = {
      question: ((this.faqServ || {}).faqData || {}).question || '',
      answer: ((this.faqServ || {}).faqData || {}).answer || '',
      _source: {
        faq_alt_questions:
          (((this.faqServ || {}).faqData || {})._source || {})
            .faq_alt_questions ||
          (((this.faqServ || {}).addAltFaq || {})._source || {})
            .faq_alt_questions ||
          [],
      },
      followupQuestions:
        ((this.faqServ || {}).faqData || {}).followupQuestions || [],
    };
    if (this.faqServ.addVariation.alternate) {
      // params._source.faq_alt_questions.push({question: this.f.question, keywords: _.map(this.tags, o=>{return {keyword: o}})});

      /**To restrict if duplicate Alternate Questions are entered on click of Alt Ques Button**/
      params._source.faq_alt_questions.forEach((element) => {
        if (element === this.f.question) {
          this.f.question = '';
          this.notify.notify(
            'Duplicate FAQ question detected. Kindly edit FAQ Question to update changes',
            'error'
          );
        }
      });
      if (this.f.question != '') {
        params._source.faq_alt_questions.push(this.f.question);
        this.faqServ.addAltQues.next(params);
      }
    } else if (this.faqServ.addVariation.followUp) {
      params.followupQuestions.push(this.f.question);
      this.faqServ.addFollowQues.next(params);
    }
    this.f.question = '';
    this.cancelAltQuestion.emit();
  }

  cancelFaq() {
    this.faqServ.cancel.next(undefined);
  }

  updateFaq() {}
  /**To restrict if duplicate Alternate Questions are entered on click of Enter**/
  checkDuplicateAltQues() {
    if (this.f.question) {
      if (this.faqServ && this.faqServ.faqData) {
        this.faqServ.faqData._source.faq_alt_questions.forEach((element) => {
          if (element === this.f.question) {
            this.faqServ.faqData._source.faq_alt_questions.slice(element);
            this.notify.notify(
              'Duplicate FAQ question detected. Kindly edit FAQ Question to update changes',
              'error'
            );
            this.f.question = '';
          }
        });
        this.saveAltQuestion.emit(true);
      } else {
        this.saveAltQuestion.emit(true); //Else cond is if the array is 0 and for entering 1st Alt Ques
      }
    }
  }
}
