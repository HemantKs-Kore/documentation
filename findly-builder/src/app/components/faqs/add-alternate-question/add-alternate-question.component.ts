import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NotificationService } from '../../../services/notification.service';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
declare const $: any;
import * as _ from 'underscore';

@Component({
  selector: 'app-add-alternate-question',
  templateUrl: './add-alternate-question.component.html',
  styleUrls: ['./add-alternate-question.component.scss']
})
export class AddAlternateQuestionComponent implements OnInit {

  suggestionTags = [];
  typedQuery = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: any[] = [];
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  f: any = {
    question: ''
  };
  @Input() faqServ: any;

  constructor(private authService: AuthService,
              private kgService: KgDataService,
              private notify: NotificationService,
              private service: ServiceInvokerService) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.faqServ.addVariation.alternate?$('#alt').focus():$('#follow').focus();
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
      query: this.f.question
    }
    const params = {
      userId: this.authService.getUserId(),
      ktId: this.kgService.getKgTaskId()
    }
    this.service.invoke('get.possibletags', params, payload).subscribe(res => {
      this.suggestionTags = res;
    }, err=> {} )
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
    return this.tags.every(f => f.toLowerCase() !== suggestion.toLowerCase())
  }

  addFaq() {
    if(this.f.question.trim() == '') {
      return;
    }
    let params = {
      question: this.faqServ.faqData.question,
      answer: this.faqServ.faqData.answer,
      _source:{
        alternateQuestions: this.faqServ.faqData._source.alternateQuestions || []
      },
      followupQuestions: this.faqServ.faqData.followupQuestions || []
    };
    if(this.faqServ.addVariation.alternate) {
      params._source.alternateQuestions.push({question: this.f.question, keywords: _.map(this.tags, o=>{return {keyword: o}})});
      this.faqServ.addAltQues.next(params);
    }
    else if(this.faqServ.addVariation.followUp) {
      params.followupQuestions.push({question: this.f.question, keywords: _.map(this.tags, o=>{return {keyword: o}})});
      this.faqServ.addFollowQues.next(params);
    }
  }

  cancelFaq() {
    this.faqServ.cancel.next();
  }

  updateFaq() {

  }

}
