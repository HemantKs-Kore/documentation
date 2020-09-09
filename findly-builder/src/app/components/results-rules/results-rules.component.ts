import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from '../../services/notification.service';
import { MdEditorOption } from 'src/app/helpers/lib/md-editor.types';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
@Component({
  selector: 'app-results-rules',
  templateUrl: './results-rules.component.html',
  styleUrls: ['./results-rules.component.scss']
})
export class ResultsRulesComponent implements OnInit {
  validationRules:any={
    condition:'OR',
    rules:[]
  }
  validationOperators:any ={
    operatorsObj:{
       equalTo: {operator:'==',type:'equalTo',valueTypes:['value','field','currentDate'],inputType:'text'},
       notEqualTo: {operator:'!=',type:'notEqualTo',valueTypes:['value','field','currentDate'],inputType:'text'},
       contains: {operator:'contains',type:'contains',valueTypes:['value','field','valueType'],inputType:'text'},
       doesNotContain: {operator:'doesNotContains',type:'doesNotContain',valueTypes:['value','field','valueType'],inputType:'text'},
       greaterThan: {operator:'>',type:'greaterThan',valueTypes:['value','field','currentDate'],inputType:'number'},
       lessThan: {operator:'<',type:'lessThan',valueTypes:['value','field','currentDate'],inputType:'number'},
       greaterThanOrEqualTo: {operator:'>=',type:'greaterThanOrEqualTo',valueTypes:['value','field','currentDate']
                               ,inputType:'number'},
       lessThanOrEqualTo: {operator:'<=',type:'lessThanOrEqualTo',valueTypes:['value','field','currentDate']
                               ,inputType:'number'},
       // regex: {operator:'regex',type:'regex',valueTypes:['value'],inputType:'text'},
       // noOfDecimals: {operator:'noOfDecimals',type:'noOfDecimals',valueTypes:['value'],inputType:'text'},
       partOf: {operator:'partOf',type:'partOf',valueTypes:['value','field'],inputType:'text'},
       notPartof: {operator:'notPartof',type:'notPartof',valueTypes:['value','field'],inputType:'text'},
       minLength: {operator:'minLength',type:'minLength',valueTypes:['value'],inputType:'number'},
       maxLength: {operator:'maxLength',type:'maxLength',valueTypes:['value'],inputType:'number'},
       futureDates: {operator:'futureDates',type:'futureDates',valueTypes:['value'],inputType:'text'},
       pastDates: {operator:'pastDates',type:'pastDates',valueTypes:['value'],inputType:'text'},
      },
   valueTypes:[
       {operator:'onlyNumbers',type:'onlyNumbers',valueTypes:[],inputType:'number'},
       {operator:'onlyAlphaNumeric',type:'onlyAlphaNumeric',valueTypes:[],inputType:'text'},
       {operator:'onlyAlphabet',type:'onlyAlphabet',valueTypes:[],inputType:'text'},
   ],
   ruleObj:{
       operator:'',
       valueType:'',
       value:'',
     },
   ruleConditionOr:{
       condition:'OR',
       rules:[]
     },
   ruleConditionAnd:{
       condition:'AND',
       rules:[]
   }
}
selectedTab = 'attributes';
loadingTabDetails
addAttributesModalPopRef:any;
addRulesModalPopRef:any;
addSignalsModalPopRef:any;
addEditattribute : any = {
  name:'',
  attributes:[],
  type:'',
  isFacet:''
}
addEditRule:any= {};
typedQuery;
options: MdEditorOption = {
  showPreviewPanel: false,
  hideIcons: ['TogglePreview']
}
selectedRulesOnj:any ={};
selectedAttributesObj:any = {};
attributes:any= [];
rules:any = [];
selectedApp
serachIndexId
groupsAdded: any = [];
searchBlock = '';
loading = true;
loadingRules = true;
readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('addRulesModalPop') addRulesModalPop: KRModalComponent;
  @ViewChild('addAttributesModalPop') addAttributesModalPop: KRModalComponent;
  @ViewChild('addSignalsModalPop') addSignalsModalPop: KRModalComponent;
  constructor(
    private notify: NotificationService,
    private service: ServiceInvokerService,
    private workflowService: WorkflowService
  ) { }
  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.addNewSimpleRuleSet();
    this.getRules();
    this.getAttributes();
  }
  selectTab(tab){
    this.selectedTab = tab;
    this.searchBlock = '';
    if(tab === 'attributes'){
      this.getAttributes();
    }
    this.loadingTabDetails = true;
  }
  addSimpleRule(ruleSet,type){
    const rule = JSON.parse(JSON.stringify(this.validationOperators.ruleObj));
    ruleSet.rules.push(rule);
  }
  removeSimpleRule(ruleSet,index,type){
  if(index>-1 && ruleSet && ruleSet.rules && ruleSet.rules.length){
    ruleSet.rules.splice(index,1);
  }
  }
  addRuleToRuleSet(ruleSet){
    const rule = JSON.parse(JSON.stringify(this.validationOperators.ruleObj));
    ruleSet.rules.push(rule);
  }
  addRuleSetToRuleSet(ruleSet){
    const tempRuleSet = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionAnd));
    const rule = JSON.parse(JSON.stringify(this.validationOperators.ruleObj));
    tempRuleSet.rules.push(rule);
    ruleSet.rules.push(tempRuleSet);
  }
  addNewSimpleRuleSet(){
    const tempObj = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionOr));
    const tempRuleSet = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionAnd))
    const rule = JSON.parse(JSON.stringify(this.validationOperators.ruleObj));
    tempRuleSet.rules.push(rule);
    if(!(this.validationRules.rules && this.validationRules.rules.length)){
      tempObj.rules.push(tempRuleSet);
      this.validationRules = tempObj
     } else if(this.validationRules.rules && this.validationRules.condition){
      this.validationRules.rules.push(tempRuleSet);
     }
  }
  addedGroupToRule(event,rule,type?){
    console.log(event);
  }
  addEditAttibutes(group?){
    if(group){
      this.addEditattribute = group
    } else{
      this.addEditattribute= {
        name:'',
        attributes:[],
        type:'',
        isFacet:''
      }
      this.openAddAttributesModal();
    }
   }
   addEditRules(rule){
     if(rule){
         this.validationRules = rule.rules;
     } else{
      this.addEditRule= {
        name:'',
        definition:[],
      }
      this.openAddRulesModal();
     }
   }
   deleteAttributes(attribute){
    const quaryparamats = {
      searchIndexId : this.serachIndexId,
      groupId:attribute._id
   }
   this.service.invoke('delete.group', quaryparamats).subscribe(
    res => {
      console.log(res);
    },
    errRes => {
    }
  );
   }
   getRules(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId,
   }
   this.service.invoke('get.rules', quaryparamats).subscribe(
    res => {
      this.rules = res;
      console.log(res);
      this.loadingRules = false
    },
    errRes => {
      this.errorToaster(errRes)
      this.loadingRules = false
    }
  );
   }
   getAttributes(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId,
   }
   this.service.invoke('get.groups', quaryparamats).subscribe(
    res => {
      this.attributes = res;
      this.loading = false;
    },
    errRes => {
      this.loading = false;
    this.errorToaster(errRes)
    }
  );
   }
   errorToaster(errRes,message?){
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notify.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notify.notify(message, 'error');
    } else {
      this.notify.notify('Somthing went worng', 'error');
  }
 }
   saveAttributes(){
     const quaryparamats = {
        searchIndexId : this.serachIndexId
     }
     console.log(this.addEditattribute);
     const payload = {
      attributes :this.addEditattribute.attributes,
      name: this.addEditattribute.name
     }
     this.service.invoke('create.group', quaryparamats , payload).subscribe(
      res => {
        this.notify.notify('Attribute saved successfully','success');
        this.closeAddAttributesModal();
        this.getAttributes();
      },
      errRes => {
        this.errorToaster(errRes,'Failed to create group');
      }
    );
   }
   saveRyules(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId
   }
   console.log(this.addEditattribute);
   const payload = {
    attributes :this.addEditattribute.attributes,
    name: this.addEditattribute.name
   }
   this.service.invoke('create.group', quaryparamats , payload).subscribe(
    res => {
      console.log(res);
    },
    errRes => {
      this.errorToaster(errRes,'Failed to create group');
    }
  );
  }
  checkDuplicateTags(suggestion: string): boolean {
    return this.addEditattribute.attributes.every((f) => f.tag !== suggestion);
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
        this.addEditattribute.attributes.push({ value: value.trim()});
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeAltTag(tag): void {
    const index = this.addEditattribute.attributes.indexOf(tag);
    if (index >= 0) {
      this.addEditattribute.attributes.splice(index, 1);
    }
  }
  openAddRulesModal() {
    this.addRulesModalPopRef  = this.addRulesModalPop.open();
   }
   closeAddRulesModal() {
    if (this.addRulesModalPopRef &&  this.addRulesModalPopRef.close) {
      this.addRulesModalPopRef.close();
    }
   }
   openAddAttributesModal() {
    this.addAttributesModalPopRef  = this.addAttributesModalPop.open();
   }
   closeAddAttributesModal() {
    if (this.addAttributesModalPopRef &&  this.addAttributesModalPopRef.close) {
      this.addAttributesModalPopRef.close();
    }
   }
   openAddSignalseModal() {
    this.addSignalsModalPopRef  = this.addSignalsModalPopRef.open();
   }
   closeAddSignalseModal() {
    if (this.addSignalsModalPopRef &&  this.addSignalsModalPopRef.close) {
      this.addSignalsModalPopRef.close();
    }
   }

}
