import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AuthService } from '@kore.services/auth.service';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'app-tags-inp',
  templateUrl: './tags-inp.component.html',
  styleUrls: ['./tags-inp.component.scss']
})

export class TagsInpComponent implements OnInit {
  suggestionTags = [];
  typedQuery = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: any[] = [];
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  f: any = {
    question: ''
  };

  constructor(private authService: AuthService,
              private kgService: KgDataService,
              private service: ServiceInvokerService,
              private notify: NotificationService) { }

  ngOnInit(): void {
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
  
}
