import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-single-chip',
  templateUrl: './autocomplete-single-chip.component.html',
  styleUrls: ['./autocomplete-single-chip.component.scss']
})
export class AutocompleteSingleChipComponent implements OnInit {
  @Input() allSuggestions;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  suggInpCtrl = new FormControl();
  filteredsuggInps: Observable<string[]>;
  suggInps: string[] = [];
  allSuggInps: string[] = [];

  @ViewChild('suggInpInput') suggInpInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredsuggInps = this.suggInpCtrl.valueChanges.pipe(
        startWith(null),
        map((suggInp: string | null) => suggInp ? this._filter(suggInp) : this.allSuggInps.slice()));
  }

  ngOnInit() {
    this.allSuggInps = this.allSuggestions;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our suggInp
    if ((value || '').trim() && this.suggInps.length == 0) {
      this.suggInps.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.suggInpCtrl.setValue(null);
  }

  remove(suggInp: string): void {
    const index = this.suggInps.indexOf(suggInp);

    if (index >= 0) {
      this.suggInps.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if(this.suggInps.length == 1) {
      return;
    }
    this.suggInps.push(event.option.viewValue);
    this.suggInpInput.nativeElement.value = '';
    this.suggInpCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSuggInps.filter(suggInp => suggInp.toLowerCase().indexOf(filterValue) === 0);
  }
}
