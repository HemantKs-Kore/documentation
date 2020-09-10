import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import { WorkflowService } from '@kore.services/workflow.service';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { FaqsService } from '../../../services/faqsService/faqs.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import * as _ from 'underscore';

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
  allGroups: string[] = [];
  selectedApp: any;
  searchIndexId: any;
  groupVal: any;
  allValues: any;
  currentSugg: any;
  @Input() customEmitter;
  @Output() emitValues = new EventEmitter();
  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @Input() valuesAdded;

  constructor(  private faqService: FaqsService,
                private service: ServiceInvokerService,
                public workflowService: WorkflowService) {

  }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getAllGroups();
    if(this.valuesAdded) {
      this.groups = _.pluck(_.filter(this.valuesAdded, o=> o.type =='groupValue' || o.type == 'string'), 'value')
    }
  }

  add(event: MatChipInputEvent): void {
    // if(this.allGroups.indexOf(event.value) == -1) {
    //   event.value = '';
    //   this.groupCtrl.setValue(null);
    //   return;
    // }
    const input = event.input;
    const value = event.value;
    // Add our group
    if ((value || '').trim()) {
      this.groups.push(value.trim());
    }
    this.emitValues.emit(this.groups);
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
    this.emitValues.emit(this.groups);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // this.groups.push(this.groupInput.nativeElement.value + ":" +event.option.viewValue);
    // this.faqService.groupAdded.next(this.groups);
    // this.groupInput.nativeElement.value = '';
    // this.groupCtrl.setValue(null);
    let valG = this.groupInput.nativeElement.value;
    if(valG.indexOf('.') > -1) {
      let gg = valG.substr(0, valG.indexOf('.'));
      if(this.allGroups.indexOf(gg) == -1) {
        valG = '';
        this.groupCtrl.setValue(null);
        return;
      }
      this.groups.push(gg + ":" +event.option.viewValue);
      if(this.customEmitter){
         this.emitValues.emit(this.groups);
         this.groupCtrl.setValue(' ');
      } else {
        this.faqService.groupAdded.next(this.groups);
      }
      this.groupCtrl.setValue(null);
      this.groupInput.nativeElement.value = '';
      // this.groupCtrl.setValue(null);
    }
    else {
      this.groupCtrl.setValue(event.option.viewValue+".")
      this.groupInput.nativeElement.value = event.option.viewValue+".";
      this.currentSugg = this.groupVal[event.option.viewValue];
    }
  }
  
  getAllGroups() {
    let params = {
      searchIndexId: this.searchIndexId,
      offset: 0,
      limit: 100
    };
    this.service.invoke('get.allGroups', params).subscribe(res => {
      res.groups = _.filter(res.groups, o=>{return o.action != 'delete'})
      this.allGroups = _.pluck(res.groups, 'name');
      this.allValues = _.map(_.pluck(res.groups, 'attributes'), o=>{ return _.pluck(o, 'value')});
      this.groupVal = _.object(this.allGroups, this.allValues);
      this.currentSugg = this.allGroups;
      //commented for now
      // this.filteredgroups = this.groupCtrl.valueChanges.pipe(
      //   startWith('g'),
      //   map((group: string | null) => group ? this._filter(group) : this.allGroups.slice()));
    }, err=> {} )
  }

  changeList(event) {
    if(!event) { return; }
    if(event.indexOf('.')> -1) {
      let gg = event.substr(0, event.indexOf('.'));
      if(this.allGroups.indexOf(gg) == -1) {
        this.groupInput.nativeElement.value = '';
        this.groupCtrl.setValue(null);
        return;
      }
      else { 
        this.currentSugg = this.groupVal[gg]; 
      }
    }
    else if(this.allGroups.indexOf(event) > -1) { 
      this.currentSugg = [];
      this.currentSugg = this.groupVal[event]; 
    }
    else { 
      this.currentSugg = this.allGroups; 
    }
  }

  private _filter(value: string): string[] {
    if(value.indexOf('.')> -1) {
      let gg = value.substr(0, value.indexOf('.'));
      if(this.allGroups.indexOf(gg) == -1) {
        this.groupInput.nativeElement.value = '';
        this.groupCtrl.setValue(null);
        return;
      }
      else {
        let vv = value.substr(value.indexOf('.')+1);
        return this.currentSugg.filter(group => group.toLowerCase().indexOf(vv) === 0);
      }
    }
    const filterValue = value.toLowerCase();
    return this.currentSugg.filter(group => group.toLowerCase().indexOf(filterValue) === 0);
  }

}
