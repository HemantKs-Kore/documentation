import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from '../../services/notification.service';
import { MdEditorOption } from 'src/app/helpers/lib/md-editor.types';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';


import * as _ from 'underscore';
@Component({
  selector: 'app-results-rules',
  templateUrl: './results-rules.component.html',
  styleUrls: ['./results-rules.component.scss']
})
export class ResultsRulesComponent implements OnInit {
  validationRules:any={
    condition:'OR',
    rules:[],
    then:{
      resultCategory : 'BoostResults',
      values:[]
    }
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
   rulesObj:{
       operator:'',
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
  listContextTypes = ['Search Context', 'User Context', 'Page Context'];
  listContextCategories = ['Customer Type', 'Accounts', 'Recent Searches', 'Device Type', 'Location', 'Page Name', ' Page Id'];
  dispContextCategories = [];
  listResultsCategories = ['Filter Results', 'Hide Results', 'Boost Results', 'Surplus Results', 'Rewrite Query'];
  rulesObjOO ={
    then:{
     resultCategory : '',
     values:[]
     }
  }
selectedTab = 'rules';
loadingTabDetails
addAttributesModalPopRef:any;
addRulesModalPopRef:any;
addSignalsModalPopRef:any;
addEditattribute : any = {
  name:'',
  attributes:[],
  type:'',
  isFacet:''
};
isCheckAll: boolean = false;
name = {
  na: ''
};
showReviewFooter: boolean = false;
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
allGroups: string[] = [];
allValues: any;
groupVal: any;
groupIds: any;
valueIds: any;
readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('addRulesModalPop') addRulesModalPop: KRModalComponent;
  @ViewChild('addAttributesModalPop') addAttributesModalPop: KRModalComponent;
  @ViewChild('addSignalsModalPop') addSignalsModalPop: KRModalComponent;
  constructor(
    private notify: NotificationService,
    private service: ServiceInvokerService,
    private workflowService: WorkflowService,
    public dialog: MatDialog
  ) { }
  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.addNewSimpleRuleSet();
    this.getRules();
    this.getAttributes();
  }

  resetRule() {
    this.name.na = '';
    this.rulesObjOO ={
      then:{
       resultCategory : '',
       values:[]
       }
    }
    this.validationRules.rules = [
      {
        "condition": "AND",
        "rules": [
          {
            "operator": ""
          }
        ]
      }
    ];
  }
  selectTab(tab){
    this.selectedTab = tab;
    this.searchBlock = '';
    if(tab === 'attributes'){
      this.getAttributes();
    }
    this.loadingTabDetails = true;
  }
  updateContextCategory(ruleData, val) {
    ruleData.contextCategory = val;
  }
  updatedContextType(ruleData, val) {
    ruleData.contextType = val;
    ruleData.contextCategory = null;
    if(val == 'User Context') {
      this.dispContextCategories = ['Customer Type', 'Accounts'];
    }
    else if(val == 'Search Context') {
      this.dispContextCategories = ['Recent Searches', 'Device Type', 'Location'];
    }
    else if(val == 'Page Context') {
      this.dispContextCategories = ['Page Name', ' Page Id'];
    }
  }

  updateResCat(ruleObjData, val) {
    ruleObjData.then.resultCategory = val;
  }

  addSimpleRule(ruleSet,type){
    const rule = JSON.parse(JSON.stringify(this.validationOperators.rulesObj));
    ruleSet.rules.push(rule);
  }
  removeSimpleRule(ruleSet,index,type){
  if(index>-1 && ruleSet && ruleSet.rules && ruleSet.rules.length){
    ruleSet.rules.splice(index,1);
  }
  }
  addRuleToRuleSet(ruleSet){
    const rule = JSON.parse(JSON.stringify(this.validationOperators.rulesObj));
    ruleSet.rules.push(rule);
  }
  addRuleSetToRuleSet(ruleSet){
    const tempRuleSet = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionAnd));
    const rule = JSON.parse(JSON.stringify(this.validationOperators.rulesObj));
    tempRuleSet.rules.push(rule);
    ruleSet.rules.push(tempRuleSet);
  }
  addNewSimpleRuleSet(){
    const tempObj = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionOr));
    const tempRuleSet = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionAnd))
    const rule = JSON.parse(JSON.stringify(this.validationOperators.rulesObj));
    tempRuleSet.rules.push(rule);
    if(!(this.validationRules.rules && this.validationRules.rules.length)){
      tempObj.rules.push(tempRuleSet);
      this.validationRules = tempObj
     } else if(this.validationRules.rules && this.validationRules.condition){
      this.validationRules.rules.push(tempRuleSet);
     }
  }
  updateFooter(ruleData) {
    console.log('rules ', this.rules);
    this.showReviewFooter = _.where(this.rules, {isChecked: true}).length;
  }
  selectAll() {
    this.rules = _.map(this.rules, o=> {o.isChecked = !this.isCheckAll; return o;})
    this.showReviewFooter = _.where(this.rules, {isChecked: true}).length;
  }

  bulkDelete() {
    let selectedIds = _.map(_.where(this.rules, {isChecked: true}), o=> _.pick(o, '_id'));
    let params = {
      searchIndexId: this.serachIndexId
    }
    let payload = {
      rules: selectedIds,
      action: 'delete'
    };
    this.service.invoke('updateBulk.rule',params,payload).subscribe(res=>{
      this.notify.notify('Rules deleted successfully', 'success');
      this.showReviewFooter = false;
      this.isCheckAll = false;
      this.getRules();
    }, err=>{

    })
  }

  bulkSend() {
    let selectedIds = _.map(_.where(this.rules, {isChecked: true}), o=> _.pick(o, '_id'));
    let params = {
      searchIndexId: this.serachIndexId
    }
    let payload = {
      rules: selectedIds,
      state: 'in-review',
      action: 'edit'
    };
    this.service.invoke('updateBulk.rule',params,payload).subscribe(res=>{
      this.notify.notify(res.msg, 'success');
      this.showReviewFooter = false;
      this.isCheckAll = false;
      this.getRules();
    }, err=>{

    })
  }

  addedGroupToRule(event,rule,type?){
    if(type == 'if') {
      rule.values = [];
      for(var i=0; i<event.length; i++) {
        let temp1 = {type: 'group', groupId: _.findWhere(this.groupIds, {name: event[i].split(':')[0]})._id, value: event[i].split(':')[0]};
        let temp2 = {type: 'groupValue', groupId: _.findWhere(this.groupIds, {name: event[i].split(':')[0]})._id, groupValueId: _.findWhere(this.valueIds, {value: event[i].split(':')[1]})._id, value: event[i]};
        let temp3 = {
          "type" : "string",
          "value" : "Search"
        }
        rule.values.push(temp1);
        rule.values.push(temp2);
        // rule.values.push(temp3);
      }
    }
    else if(type == 'then') {
      this.rulesObjOO.then.values = [];
      for(var i=0; i<event.length; i++) {
        let temp1 = {type: 'group', groupId: _.findWhere(this.groupIds, {name: event[i].split(':')[0]})._id, value: event[i].split(':')[0]};
        let temp2 = {type: 'groupValue', groupId: _.findWhere(this.groupIds, {name: event[i].split(':')[0]})._id, groupValueId: _.findWhere(this.valueIds, {value: event[i].split(':')[1]})._id, value: event[i]};
        let temp3 = {
          "type" : "string",
          "value" : "Search"
        }
        this.rulesObjOO.then.values.push(temp1);
        this.rulesObjOO.then.values.push(temp2);
        // this.rulesObjOO.then.values.push(temp3);
      }
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
   deleteRule(ruleData) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Rule',
        text: 'Are you sure you want to delete this rule?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const params = {
            searchIndexId: this.serachIndexId,
            ruleId: ruleData._id
          };
          this.service.invoke('delete.rule', params).subscribe(
            res => {
             this.getRules();
            }, err => {
     
            })
          dialogRef.close();
        } else if (result === 'no') { dialogRef.close(); }
      });
   }

   getRules(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId,
   }
   this.service.invoke('get.rules', quaryparamats).subscribe(
    res => {
      this.rules = _.map(res.rules, o=>{o.isChecked = false; return o});
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
      this.allGroups = _.pluck(res.groups, 'name');
      this.allValues = _.map(_.pluck(res.groups, 'attributes'), o=>{ return _.pluck(o, 'value')});
      this.groupVal = _.object(this.allGroups, this.allValues);
      this.groupIds = _.map(res.groups, function(o){return _.pick(o, 'name', '_id')});
      let temp = _.pluck(res.groups, 'attributes').filter(o=>{return o.length !=0});
      let tempVals = [];
      temp.forEach(o=>{tempVals.push(...o)});
      this.valueIds = tempVals;
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

   saveRules(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId
   }
   console.log(this.validationRules);
  //  return;
  const params = {
    searchIndexId : this.serachIndexId
  }
 let payload = {
   name: this.name.na,
   type: 'web',
   definition:{ if: {}, then: {}}
 }
 payload.definition.if = this.validationRules;
 payload.definition.then = this.rulesObjOO.then;
   this.service.invoke('create.rule', params, payload).subscribe(
     res=>{
      console.log(res);
      this.closeAddRulesModal();
      this.getRules();
      this.resetRule();
     }, err=>{})
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
