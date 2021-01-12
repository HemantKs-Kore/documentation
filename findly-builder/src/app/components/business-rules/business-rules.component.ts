import { ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import * as _ from 'underscore';
import { relativeTimeRounding } from 'moment';
import { RangeSlider } from 'src/app/helpers/models/range-slider.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map } from 'rxjs/operators';
import { SortPipe } from 'src/app/helpers/sortPipe/sort-pipe';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { Subscription } from 'rxjs';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
declare const $: any;
@Component({
  selector: 'app-business-rules',
  templateUrl: './business-rules.component.html',
  styleUrls: ['./business-rules.component.scss']
})
export class BusinessRulesComponent implements OnInit, OnDestroy {
  addBusinessRulesRef: any;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  currentEditInex;
  rules = [];
  selectedSort;
  isAsc;
  loadingContent = true;
  selcectionObj: any = {
    selectAll: false,
    selectedItems: [],
  };
  sortObj: any = {}
  showSearch = false;
  searchRules = '';
  conditions = {
    string: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    date: ['equals', 'between', 'greaterThan','lessThan'],
    number: ['equals', 'between', 'greaterThan','lessThan'],
    trait:['contains', 'doesNotContain', 'equals', 'notEquals'],
    entity:['contains', 'doesNotContain', 'equals', 'notEquals'],
    keyword:['contains', 'doesNotContain', 'equals', 'notEquals']
  }
  datePlaceHolders = {
    equals:''
  }
  ruleOptions = {
    searchContext: ['recentSearches', 'currentSearch', 'traits', 'entity', 'keywords'],
    pageContext: ['device', 'browser', 'currentPage', 'recentPages', 'signed', 'timeDateDay', 'session', 'timeSpentOnThePageSession'],
    userContext: ['userType', 'userProfile', 'age', 'sex'],
    contextTypes: ['searchContext', 'pageContext', 'userContext'],
    dataTypes:['string','date','number'],
    actions: ['boost', 'lower', 'hide', 'filter']
  }
  tagsArray: any = []
  defaultValuesObj: any = {
    contextType: 'searchContext',
    dataType:'string',
    operator: 'contains',
    contextCategory: 'recentSearches',
    value: []
  }
  defaultOutcomeObj: any = {
    fieldDataType: 'string',
    fieldName: '',
    fieldId: '',
    outcomeOperator: 'contains',
    outcomeType: 'boost',
    outcomeValue: [],
    scale: 3,
  }
  addEditRuleObj: any = {
    ruleName: '',
    isRuleActive: true,
    rules: [],
    outcomes: []
  };
  rulesArrayforAddEdit: any = [];
  outcomeArrayforAddEdit: any = [];
  fieldAutoSuggestion: any = [];
  subscription: Subscription;
  queryPipelineId
  fieldWarnings: any = {
    NOT_INDEXED: 'Associated field is not indexed',
    NOT_EXISTS: 'Associated field has been deleted'
  }
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('addBusinessRules') addBusinessRules: KRModalComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private sortPipe: SortPipe,
    private appSelectionService: AppSelectionService
  ) { }
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.loadRules();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
      this.loadRules();
    })
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.getFieldAutoComplete(null, null);
  }
  loadRules() {
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : this.selectedApp.searchIndexes[0].queryPipelineId;
    if (this.queryPipelineId) {
      this.getRules();
    }
  }
  createNewRule() {
    this.addEditRuleObj = {
      ruleName: '',
      isRuleActive: true,
      rules: [],
      outcomes: []
    };
    this.addNewRule();
    this.addNewOutcome();
    this.openModalPopup();
  }
  openModalPopup() {
    this.addBusinessRulesRef = this.addBusinessRules.open();
  }
  prepereSliderObj(index) {
    return new RangeSlider(0, 5, 1, 3, 'outcomeScale' + index)
  }
  valueEvent(val, outcomeObj) {
    outcomeObj.scale = val;
  }
  addNewRule() {
    const ruleObj: any = JSON.parse(JSON.stringify(this.defaultValuesObj));
    ruleObj.value = []
    this.rulesArrayforAddEdit.push(ruleObj)
  }
  addNewOutcome() {
    const ruleObj: any = JSON.parse(JSON.stringify(this.defaultOutcomeObj));
    ruleObj.sliderObj = this.prepereSliderObj(this.outcomeArrayforAddEdit.length);
    this.outcomeArrayforAddEdit.push(ruleObj)
  }
  editRule(rule) {
    this.addEditRuleObj = rule;
    this.setDataForEdit(this.addEditRuleObj);
    this.openModalPopup();
  }
  closeModalPopup() {
    this.rulesArrayforAddEdit = [];
    this.outcomeArrayforAddEdit = [];
    this.addBusinessRulesRef.close();
  }
  setDataForEdit(ruleObj) {
    if (ruleObj && ruleObj.rules && ruleObj.rules.length) {
      this.rulesArrayforAddEdit = JSON.parse(JSON.stringify(ruleObj.rules));
    } else {
      this.addNewRule();
    }
    if (ruleObj && ruleObj.outcomes && ruleObj.outcomes.length) {
      const _outcoms = []
      ruleObj.outcomes.forEach((outcome, i) => {
        const tempObj: any = outcome
        tempObj.sliderObj = this.prepereSliderObj(i);
        _outcoms.push(tempObj);
      });
      this.outcomeArrayforAddEdit = _outcoms;
    } else {
      this.addNewOutcome();
    }
  }
  getRulesArrayPayload(rules) {
    const _verifiedRules = [];
    if (rules && rules.length) {
      rules.forEach(rule => {
        const tempObj: any = {
          contextCategory: rule.contextCategory,
          contextType: rule.contextType,
          operator: rule.operator,
          dataType:rule.dataType,
          value: rule.value,
        }
        _verifiedRules.push(tempObj);
      });
    }
    return _verifiedRules;
  }
  getOutcomeArrayPayload(outcomes) {
    const _verifiedRules = [];
    if (outcomes && outcomes.length) {
      outcomes.forEach(outcome => {
        const tempObj: any = {
          outcomeType: outcome.outcomeType,
          scale: outcome.scale,
          fieldName: outcome.fieldName,
          fieldId: outcome.fieldId,
          fieldDataType:outcome.fieldDataType,
          outcomeOperator: outcome.outcomeOperator,
          outcomeValue: outcome.outcomeValue
        }
        _verifiedRules.push(tempObj);
      });
    }
    return _verifiedRules;
  }
  removeRule(index) {
    this.rulesArrayforAddEdit.splice(index, 1);
  }
  removeOutcome(index) {
    this.outcomeArrayforAddEdit.splice(index, 1);
  }
  removeTag(tags, index) {
    tags.splice(index, 1);
  }
  openDateTimePicker(ruleObj,index){
    setTimeout(()=>{
      if(ruleObj && ruleObj.operator === 'between'){
        $('#rangePicker_' + index).click();
      } else {
        $('#datePicker_' + index).click();
      }
    })
  }
  onDatesUpdated(event,ruleObj){
    if (!ruleObj.value){
      ruleObj.value = [];
    }
    if(ruleObj && ruleObj.operator === 'between'){
      if(event.startDate){
        moment.utc();
        const date= [];
        const startDate  = moment.utc(event.startDate).format();
        const endDate  = moment.utc(event.startDate).format();
        date.push(startDate);
        date.push(endDate)
        ruleObj.value.push(date)
      }
    } else {
      if(event.startDate){
        const date  = moment.utc(event.startDate).format();
        ruleObj.value.push(date)
      }
    }
  }
  addRules(event: MatChipInputEvent, ruleObj, i) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(), ruleObj.value)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        ruleObj.value.push(value);
      }
    }
    if (input) {
      input.value = '';
    }
    this.suggestedInput.nativeElement.value = '';
  }
  addOutcome(event: MatChipInputEvent, ruleObj, i) {
    const input = event.input;
    const value = event.value;
    if (!ruleObj.fieldName) {
      this.notificationService.notify('Please select valid field', 'error');
      return
    }
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(), ruleObj.outcomeValue)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        ruleObj.outcomeValue.push(value);
      }
    }
    if (input) {
      input.value = '';
    }
    this.suggestedInput.nativeElement.value = '';
  }
  selectedTag(data: MatAutocompleteSelectedEvent, outcomeObj) {
    console.log(data.option.value);
    outcomeObj.fieldDataType = data.option.value.fieldDataType
    outcomeObj.fieldName = data.option.value.fieldName
    outcomeObj.fieldId = data.option.value._id
    this.suggestedInput.nativeElement.value = '';
    this.fieldAutoSuggestion = [];
  }
  selectField(data, outcomeObj) {
    outcomeObj.fieldDataType = data.fieldDataType
    outcomeObj.fieldName = data.fieldName
    outcomeObj.fieldId = data._id;
    this.fieldAutoSuggestion = [];
  }
  checkDuplicateTags(suggestion: string, alltTags): boolean {
    return alltTags.every((f) => f !== suggestion);
  }
  ruleSelection(ruleObj, value, key) {
    if (key === 'contextCategory') {
      ruleObj.contextCategory = value;
    }
    if (key === 'contextType') {
      ruleObj.contextType = value;
      ruleObj.contextCategory = this.ruleOptions[value][0];
    }
    if (key === 'operator') {
      ruleObj.operator = value;
    }
    if (key === 'dataType') {
      if(ruleObj.dataType !== value){
        ruleObj.operator = this.conditions[value][0];
        ruleObj.value = [];
      }
      ruleObj.dataType = value;
    }
  }
  outcomeSclection(outcome, value, key) {
    if (key === 'outcomeType') {
      outcome.outcomeType = value;
    }
    if (key === 'outcomeOperator') {
      outcome.outcomeOperator = value;
    }
  }
  checkUncheckfacets(rule) {
    const selectedElements = $('.selectRuleCheckBoxDiv:checkbox:checked');
    const allElements = $('.selectRuleCheckBoxDiv');
    if (selectedElements.length === allElements.length) {
      $('#selectAllRules')[0].checked = true;
    } else {
      $('#selectAllRules')[0].checked = false;
    }
    const element = $('#' + rule._id);
    const addition = element[0].checked
    this.addRemoveRuleFromSelection(rule._id, addition);
  }
  addRemoveRuleFromSelection(ruleId?, addtion?, clear?) {
    if (clear) {
      const allfacets = $('.selectRuleCheckBoxDiv');
      $.each(allfacets, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = false;
        }
      });
      this.selcectionObj.selectedItems = {};
      this.selcectionObj.selectedCount = 0;
      this.selcectionObj.selectAll = false;
    } else {
      if (ruleId) {
        if (addtion) {
          this.selcectionObj.selectedItems[ruleId] = {};
        } else {
          if (this.selcectionObj.selectedItems[ruleId]) {
            delete this.selcectionObj.selectedItems[ruleId]
          }
        }
      }
      this.selcectionObj.selectedCount = Object.keys(this.selcectionObj.selectedItems).length;
    }
  }
  selectAll(unselectAll?) {
    const allfacets = $('.selectRuleCheckBoxDiv');
    if (allfacets && allfacets.length) {
      $.each(allfacets, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = unselectAll ? false : this.selcectionObj.selectAll;
          const ruleId = $(element)[0].id
          this.addRemoveRuleFromSelection(ruleId, $(element)[0].checked);
        }
      });
    };
    if (unselectAll) {
      $('#selectAllRules')[0].checked = false;
    }
  }
  createRule() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId
    };
    const payload: any = {
      ruleName: this.addEditRuleObj.ruleName,
      isRuleActive: this.addEditRuleObj.isRuleActive,
      rules: this.getRulesArrayPayload(this.rulesArrayforAddEdit) || [],
      outcomes: this.getOutcomeArrayPayload(this.outcomeArrayforAddEdit) || []
    }
    if (!payload.rules.length) {
      this.errorToaster(null, 'Atleast one condition is required');
      return;
    }
    if (!payload.outcomes.length) {
      this.errorToaster(null, 'Atleast one outcome is required');
      return;
    }
    this.service.invoke('create.businessRules', quaryparms, payload).subscribe(res => {
      this.rules.push(res);
      this.closeModalPopup();
      this.notificationService.notify('Rule created successfully', 'sucecss');
    }, errRes => {
      this.errorToaster(errRes, 'Failed to create rules');
    });
  }
  getFieldAutoComplete(event, outcomeObj) {
    let query: any = '';
    if (event) {
      query = $(event.currentTarget).val();
    }
    // if (/^\d+$/.test(query)) {
    //   query = query.parseInt();
    // }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.fieldAutoSuggestion = res || [];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  getRules(offset?) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      offset: offset || 0,
      limit: 100
    };
    this.service.invoke('get.businessRules', quaryparms).subscribe(res => {
      this.rules = res.rules || [];
      this.loadingContent = false;
      this.addRemoveRuleFromSelection(null, null, true);
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get rules');
    });
  }
  getRukeById(rule) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      ruleId: rule._id,
      queryPipelineId: this.queryPipelineId,
      limit: 100
    };
    this.service.invoke('get.businessRuleById', quaryparms).subscribe(res => {
      console.log(res);
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get rule');
    });
  }
  updateRule(rule) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      ruleId: rule._id,
    };
    const payload: any = {
      ruleName: this.addEditRuleObj.ruleName,
      isRuleActive: this.addEditRuleObj.isRuleActive,
      rules: this.getRulesArrayPayload(this.rulesArrayforAddEdit),
      outcomes: this.getOutcomeArrayPayload(this.outcomeArrayforAddEdit)
    }
    if (!payload.rules.length) {
      this.errorToaster(null, 'Atleast one condition is required');
      return;
    }
    if (!payload.outcomes.length) {
      this.errorToaster(null, 'Atleast one outcome is required');
      return;
    }
    this.service.invoke('update.businessRule', quaryparms, payload).subscribe(res => {
      const editRule = _.findIndex(this.rules, (pg) => {
        return pg._id === rule._id;
      })
      this.rules[editRule] = res;
      this.notificationService.notify('Rule updated successfully', 'success');
      this.closeModalPopup();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to update rule');
    });
  }
  deleteRulePop(rule, i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete rule',
        text: 'Are you sure you want to delete selected rule?',
        newTitle: 'Delete rule',
        body: 'Are you sure you want to delete selected rule?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteRule(rule, i, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  deleteMultiePop() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete selected rules',
        text: 'Are you sure you want to delete selected rules?',
        newTitle: 'Are you sure you want to delete selected rules?',
        body: 'Selected rules will be deleted',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteSelectedRules(dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  deleteSelectedRules(dialogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      limit: 100
    };
    const payload: any = {
      rules: []
    }
    if (this.selcectionObj && this.selcectionObj.selectedItems) {
      const selectedItems = Object.keys(this.selcectionObj.selectedItems);
      if (selectedItems && selectedItems.length) {
        selectedItems.forEach((ruleId, i) => {
          const tempobj = {
            _id: ruleId
          }
          payload.rules.push(tempobj);
        });
      }
    }
    this.service.invoke('delete.businessRulesBulk', quaryparms, payload).subscribe(res => {
      if (dialogRef && dialogRef.close) {
        dialogRef.close();
      }
      this.getRules();
      this.notificationService.notify('Selected rules are deleted successfully', 'success');
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete rule');
    });
  }
  deleteRule(rule, i, dilogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      ruleId: rule._id,
      limit: 100
    };
    this.service.invoke('delete.businessRule', quaryparms).subscribe(res => {
      const deleteIndex = _.findIndex(this.rules, (pg) => {
        return pg._id === rule._id;
      })
      this.rules.splice(deleteIndex, 1);
      if (dilogRef && dilogRef.close) {
        dilogRef.close();
      }
      this.notificationService.notify('Selected rule deleted successfully', 'success');
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete rule');
    });
  }
  toggleSearch() {
    if (this.showSearch && this.searchRules) {
      this.searchRules = '';
    }
    this.showSearch = !this.showSearch
    if (this.showSearch) {
      $('#searchInput').focus();
    }
  };
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortBy(sort) {
    const data = this.rules.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'ruleName': return this.compare(a.ruleName, b.ruleName, isAsc);
        case 'isRuleActive': return this.compare(a.isRuleActive, b.isRuleActive, isAsc);
        default: return 0;
      }
    });
    this.rules = sortedData;
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : false;
  }
}
