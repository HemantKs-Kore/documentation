import { ElementRef, ViewChild } from '@angular/core';
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
declare const $: any;
@Component({
  selector: 'app-business-rules',
  templateUrl: './business-rules.component.html',
  styleUrls: ['./business-rules.component.scss']
})
export class BusinessRulesComponent implements OnInit {
  addBusinessRulesRef:any;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  rules = [];
  loadingContent = true;
  selcectionObj: any = {
    selectAll: false,
    selectedItems:[],
  };
  conditions =['containes','does not contain','equals','not equals']
  ruleOptions = {
    searchContext:['Recent Searches','Current Search', 'Traits', 'Entity','Keywords'],
    pageContext:['Device', 'Browser', 'Current Page' , 'Recently Pages','Signed','Time Date Day','Session','Time spent on the page/session'],
    userContext:['User Type', 'User Profile', 'Age', 'Sex'],
    contextTypes:['searchContext','pageContext','userContext'],
    actions:['boost','lower','hide','filter']
  }
  tagsArray:any = []
  defaultValuesObj: any = {
    contextType:'searchContext',
    operator:'contains',
    contextCategory:'Recent searches',
    value:[]
  }
  defaultOutcomeObj: any = {
    fieldDataType: 'string',
    fieldName: '',
    outcomeOperator: 'contains',
    outcomeType: 'boost',
    outcomeValue: [],
    scale: 3,
  }
  addEditRuleObj:any = {
    ruleName:'',
    isRuleActive:true,
    rules:[],
    outcomes:[]
  };
  rulesArrayforAddEdit:any = [];
  outcomeArrayforAddEdit:any = [];
  fieldAutoSuggestion: any = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('addBusinessRules') addBusinessRules: KRModalComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.getRules();
  }
  createNewRule(){
    this.addEditRuleObj = {
      ruleName:'',
      isRuleActive:true,
      rules:[],
      outcomes:[]
    };
    this.addNewRule();
    this.addNewOutcome();
    this.openModalPopup();
  }
  openModalPopup(){
    this.addBusinessRulesRef = this.addBusinessRules.open();
  }
  prepereSliderObj(index){
      return new RangeSlider(0,5,1,3, 'outcomeScale' + index)
  }
  valueEvent(val,outcomeObj){
   outcomeObj.scale = val;
  }
  addNewRule(){
    const ruleObj:any = JSON.parse(JSON.stringify(this.defaultValuesObj));
    ruleObj.value = []
    this.rulesArrayforAddEdit.push(ruleObj)
  }
  addNewOutcome(){
    const ruleObj:any = JSON.parse(JSON.stringify(this.defaultOutcomeObj));
    ruleObj.sliderObj = this.prepereSliderObj(this.outcomeArrayforAddEdit.length);
    this.outcomeArrayforAddEdit.push(ruleObj)
  }
  editRule(rule){
    this.addEditRuleObj = rule;
    this.setDataForEdit(this.addEditRuleObj);
  }
  closeModalPopup(){
    this.addBusinessRulesRef.close();
  }
  setDataForEdit(ruleObj){
    if(ruleObj && ruleObj.rules && ruleObj.rules.length) {
      this.rulesArrayforAddEdit = JSON.parse(JSON.stringify(ruleObj.rules));
    } else {
      this.addNewRule();
    }
    if(ruleObj && ruleObj.outcomes && ruleObj.outcomes.length) {
      const _outcoms = []
      ruleObj.outcomes.forEach((outcome,i) => {
        const tempObj:any = outcome
        tempObj.sliderObj = this.prepereSliderObj(i);
        _outcoms.push(tempObj);
      });
      this.outcomeArrayforAddEdit = _outcoms;
    } else {
      this.addNewOutcome();
    }
  }
  getRulesArrayPayload(rules){
    const _verifiedRules = [];
    if(rules && rules.length) {
    rules.forEach(rule => {
      const tempObj: any = {
        contextCategory:rule.contextCategory,
        contextType:rule.contextType,
        operator:rule.operator,
        value:rule.value,
      }
      _verifiedRules.push(tempObj);
    });
    }
    return _verifiedRules;
  }
  getOutcomeArrayPayload(outcomes){
    const _verifiedRules = [];
    if(outcomes && outcomes.length) {
      outcomes.forEach(outcome => {
      const tempObj: any = {
        outcomeType: outcome.outcomeType,
        scale: outcome.scale,
        fieldName: outcome.fieldName,
        outcomeOperator: outcome.outcomeOperator,
        outcomeValue:outcome.outcomeValue
      }
      _verifiedRules.push(tempObj);
    });
    }
    return _verifiedRules;
  }
  addRules(event: MatChipInputEvent,ruleObj,i){
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(),ruleObj.value)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return ;
      } else {
        ruleObj.value.push(value);
      }
    }
    if (input) {
      input.value = '';
    }
    this.suggestedInput.nativeElement.value = '';
  }
  addOutcome(event: MatChipInputEvent,ruleObj,i){
    const input = event.input;
    const value = event.value;
    if(!ruleObj.fieldName){
     this.notificationService.notify('Please select valid field','error');
     return
    }
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(),ruleObj.outcomeValue)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return ;
      } else {
        ruleObj.outcomeValue.push(value);
      }
    }
    if (input) {
      input.value = '';
    }
    this.suggestedInput.nativeElement.value = '';
  }
  selectedTag(data: MatAutocompleteSelectedEvent , outcomeObj) {
      console.log(data.option.value);
      outcomeObj.fieldDataType = data.option.value.fieldDataType
      outcomeObj.fieldName= data.option.value.fieldName
      this.suggestedInput.nativeElement.value = '';
      this.fieldAutoSuggestion = [];
  }
  checkDuplicateTags(suggestion: string,alltTags): boolean {
    return  alltTags.every((f) => f !== suggestion);
  }
  ruleSelection(ruleObj,value,key){
    if( key === 'contextCategory' ){
      ruleObj.contextCategory = value;
    }
    if( key === 'contextType' ){
      ruleObj.contextType = value;
      ruleObj.contextCategory = this.ruleOptions[value][0];
    }
    if( key === 'operator' ){
      ruleObj.operator = value;
    }
  }
  outcomeSclection(outcome,value,key){
    if( key === 'outcomeType' ){
      outcome.outcomeType = value;
    }
    if( key === 'outcomeOperator' ){
      outcome.outcomeOperator = value;
    }
  }
  checkUncheckfacets(rule){
    const selectedElements = $('.selectRuleCheckBoxDiv:checkbox:checked');
    const allElements = $('.selectRuleCheckBoxDiv');
    if(selectedElements.length === allElements.length){
      $('#selectAllRules')[0].checked = true;
    } else {
      $('#selectAllRules')[0].checked = false;
    }
    const element = $('#' + rule._id);
    const addition =  element[0].checked
    this.addRemoveRuleFromSelection(rule._id,addition);
  }
  addRemoveRuleFromSelection(ruleId?,addtion?,clear?){
    if(clear){
      const allfacets = $('.selectRuleCheckBoxDiv');
      $.each(allfacets, (index,element) => {
        if($(element) && $(element).length){
          $(element)[0].checked =false;
        }
      });
     this.selcectionObj.selectedItems = {};
     this.selcectionObj.selectedCount = 0;
     this.selcectionObj.selectAll = false;
    } else {
     if(ruleId){
       if(addtion){
         this.selcectionObj.selectedItems[ruleId] = {};
       } else {
         if(this.selcectionObj.selectedItems[ruleId]){
           delete this.selcectionObj.selectedItems[ruleId]
         }
       }
     }
     this.selcectionObj.selectedCount = Object.keys(this.selcectionObj.selectedItems).length;
    }
  }
  selectAll(unselectAll?) {
    const allfacets = $('.selectRuleCheckBoxDiv');
    if (allfacets && allfacets.length){
      $.each(allfacets, (index,element) => {
        if($(element) && $(element).length){
          $(element)[0].checked = unselectAll?false: this.selcectionObj.selectAll;
          const ruleId = $(element)[0].id
          this.addRemoveRuleFromSelection(ruleId,$(element)[0].checked);
        }
      });
    };
    if(unselectAll){
      $('#selectAllRules')[0].checked = false;
    }
  }
  createRule(){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
    };
    const payload:any ={
      ruleName: this.addEditRuleObj.ruleName,
      isRuleActive: this.addEditRuleObj.isRuleActive,
      rules: this.getRulesArrayPayload(this.rulesArrayforAddEdit),
      outcomes: this.getOutcomeArrayPayload(this.outcomeArrayforAddEdit)
   }
    this.service.invoke('create.businessRules', quaryparms,payload).subscribe(res => {
      this.rules.push(res);
    }, errRes => {
      this.errorToaster(errRes,'Failed to create rules');
    });
  }
  getFieldAutoComplete(event,outcomeObj){
    if(outcomeObj.fieldName){
     return;
    }
    let query  = $(event.currentTarget).val();
    if (/^\d+$/.test(query)) {
      query = query.parseInt();
    }
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.fieldAutoSuggestion = res || [];
     }, errRes => {
       this.errorToaster(errRes,'Failed to get fields');
     });
  }
  getRules(offset?){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      offset: offset || 0,
      limit:100
    };
    this.service.invoke('get.businessRules', quaryparms).subscribe(res => {
      this.rules =  res.rules || [];
      this.loadingContent = false;
      this.addRemoveRuleFromSelection(null,null,true);
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get rules');
    });
  }
  getRukeById(rule){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      ruleId:rule._id,
      limit:100
    };
    this.service.invoke('get.businessRuleById', quaryparms).subscribe(res => {
     console.log(res);
    }, errRes => {
      this.errorToaster(errRes,'Failed to get rule');
    });
  }
  updateRule(rule){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      ruleId:rule._id,
      limit:100
    };
    this.service.invoke('update.businessRule', quaryparms).subscribe(res => {
     console.log(res);
    }, errRes => {
      this.errorToaster(errRes,'Failed to update rule');
    });
  }
  deleteRule(rule,dilogRef?){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      ruleId:rule._id,
      limit:100
    };
    this.service.invoke('delete.businessRule', quaryparms).subscribe(res => {
     if(dilogRef && dilogRef.close){
      dilogRef.close();
     }
    }, errRes => {
      this.errorToaster(errRes,'Failed to delete rule');
    });
  }
  errorToaster(errRes,message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
  }
 }
}