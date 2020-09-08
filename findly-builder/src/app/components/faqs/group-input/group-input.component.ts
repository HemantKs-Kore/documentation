import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FaqsService } from '../../../services/faqsService/faqs.service';

@Component({
  selector: 'app-group-input',
  templateUrl: './group-input.component.html',
  styleUrls: ['./group-input.component.scss']
})
export class GroupInputComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  groupCtrl = new FormControl();
  filteredgroups: Observable<string[]>;
  groups: string[] = [];
  allgroups: string[] = ['Key1', 'Ley1', 'Li2', 'Key34', 'Kiu5'];

  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private faqService: FaqsService) {
    this.filteredgroups = this.groupCtrl.valueChanges.pipe(
        startWith(null),
        map((group: string | null) => group ? this._filter(group) : this.allgroups.slice()));
  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our group
    if ((value || '').trim()) {
      this.groups.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.groupCtrl.setValue(null);
  }

  remove(group: string): void {
    const index = this.groups.indexOf(group);
    if (index >= 0) {
      this.groups.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.groups.push(this.groupInput.nativeElement.value + ":" +event.option.viewValue);
    this.faqService.groupAdded.next(this.groups);
    this.groupInput.nativeElement.value = '';
    this.groupCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allgroups.filter(group => group.toLowerCase().indexOf(filterValue) === 0);
  }

}
