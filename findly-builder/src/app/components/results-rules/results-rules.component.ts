import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from '../../services/notification.service';
import { MdEditorOption } from 'src/app/helpers/lib/md-editor.types';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { cloneDeep } from "lodash";

import * as _ from 'underscore';
import { ResultsRulesService } from '../../services/componentsServices/results-rules.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-results-rules',
  templateUrl: './results-rules.component.html',
  styleUrls: ['./results-rules.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResultsRulesComponent implements OnInit, OnDestroy {
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
       listContextTypes: ['Search Context', 'User Context', 'Page Context'],
       listContextCategories: ['Customer Type', 'Accounts', 'Recent Searches', 'Device Type', 'Location', 'Page Name', ' Page Id']
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
name = {
  na: ''
};
ruleEditId: string;
addEditRule:any= {};
typedQuery;
options: MdEditorOption = {
  showPreviewPanel: false,
  hideIcons: ['TogglePreview']
};
isAdd: boolean;
isEdit: boolean;
selectedAttributesObj:any = {};
attributes:any= [];
rules:any = [];
draftRules: any = [];
inReviewRules: any = [];
approvedRules: any = [];
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
tabsList: any = [
  {name: 'Drafts', isSelected: true, count: 0},
  {name: 'In-review', isSelected: false, count: 0},
  {name: 'Approved', isSelected: false, count: 0}
]
selectAllSub :Subscription;
openAddRulesModalSub :Subscription;
deleteRuleSub :Subscription;
bulkSendSub :Subscription;
bulkDeleteSub :Subscription;
readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('addRulesModalPop') addRulesModalPop: KRModalComponent;
  @ViewChild('addAttributesModalPop') addAttributesModalPop: KRModalComponent;
  @ViewChild('addSignalsModalPop') addSignalsModalPop: KRModalComponent;
  constructor(
    private notify: NotificationService,
    private service: ServiceInvokerService,
    private workflowService: WorkflowService,
    public dialog: MatDialog,
    private rulesService: ResultsRulesService
  ) { }
  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getAttributes();
    this.addNewSimpleRuleSet();
    this.getRules();
    this.allSubscribe();
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
    this.validationRules.rules[0].rules[0].listContextTypes = ['Search Context', 'User Context', 'Page Context'];
    this.validationRules.rules[0].rules[0].listContextCategories = ['Customer Type', 'Accounts', 'Recent Searches', 'Device Type', 'Location', 'Page Name', ' Page Id'];
  }
  selectTab(tab){
    this.selectedTab = tab;
    this.searchBlock = '';
    this.loadingTabDetails = true;
  }
  updateContextCategory(ruleData, val) {
    ruleData.contextCategory = val;
  }
  updatedContextType(ruleData, val) {
    ruleData.contextType = val;
    ruleData.contextCategory = null;
    if(val == 'User Context') {
      ruleData.dispContextCategories = ['Customer Type', 'Accounts'];
    }
    else if(val == 'Search Context') {
      ruleData.dispContextCategories = ['Recent Searches', 'Device Type', 'Location'];
    }
    else if(val == 'Page Context') {
      ruleData.dispContextCategories = ['Page Name', ' Page Id'];
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
  if(index>-1 && ruleSet && ruleSet.rules && ruleSet.rules.length > 1){
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
  getAttributes(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId,
   }
   this.service.invoke('get.groups', quaryparamats).subscribe(
    res => {
      res.groups = _.filter(res.groups, o=>o.action!='delete')
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
  addedGroupToRule(event,rule,type?){
    if(type == 'if') {
      rule.values = [];
      for(var i=0; i<event.length; i++) {
        if(event[i].indexOf(':') == -1) {
          let temp3 = {
            "type" : "string",
            "value" : event[i]
          }
          rule.values.push(temp3);
        }
        else {
          let temp1 = {type: 'group', groupId: _.findWhere(this.groupIds, {name: event[i].split(':')[0]})._id, value: event[i].split(':')[0]};
          let temp2 = {type: 'groupValue', groupId: _.findWhere(this.groupIds, {name: event[i].split(':')[0]})._id, groupValueId: _.findWhere(this.valueIds, {value: event[i].split(':')[1]})._id, value: event[i]};
          rule.values.push(temp1);
          rule.values.push(temp2);
        }
      }
    }
    else if(type == 'then') {
      this.rulesObjOO.then.values = [];
      for(var i=0; i<event.length; i++) {
        if(event[i].indexOf(':') == -1) {
          let temp3 = {
            "type" : "string",
            "value" : event[i]
          }
          this.rulesObjOO.then.values.push(temp3);
        }
        else {
          let temp1 = {type: 'group', groupId: _.findWhere(this.groupIds, {name: event[i].split(':')[0]})._id, value: event[i].split(':')[0]};
          let temp2 = {type: 'groupValue', groupId: _.findWhere(this.groupIds, {name: event[i].split(':')[0]})._id, groupValueId: _.findWhere(this.valueIds, {value: event[i].split(':')[1]})._id, value: event[i]};
          this.rulesObjOO.then.values.push(temp1);
          this.rulesObjOO.then.values.push(temp2);
        }
      }
    }
  }

  editRules() {

    if(this.name.na.trim() == '') {
      this.notify.notify('Please enter rule name', 'error');
      return;
    }
    let rulesCheck = this.validateRules(this.validationRules.rules[0].rules);
    if(rulesCheck.length == 0) {
      this.notify.notify('Atleast one rule is mandatory to proceed', 'error');
      return;
    }
    if(this.rulesObjOO.then.resultCategory == '' || this.rulesObjOO.then.values.length == 0) {
      this.notify.notify('THEN rule is mandatory to proceed', 'error');
      return;
    }
    rulesCheck = _.map(rulesCheck, o=> {return _.pick(o, 'contextCategory', 'contextType', 'operator', 'values')});
    this.validationRules.rules[0].rules = rulesCheck;
    let params = {
      searchIndexId: this.serachIndexId,
      ruleId: this.ruleEditId
    };
    let payload = {
      name: this.name.na,
      type: 'web',
      definition:{ if: {}, then: {}}
    }
    payload.definition.if = this.validationRules;
    payload.definition.then = this.rulesObjOO.then;

    this.service.invoke('update.rule', params, payload).subscribe(res=>{
      this.closeAddRulesModal();
      this.notify.notify('Rule has been updated', 'success');
      this.getRules();
    }, err => {
      this.closeAddRulesModal()
    })
  }

   addEditRules(rule){
     if(rule){
      this.name.na = rule.name;
      this.validationRules.rules = cloneDeep(rule.definition.if.rules);
      this.rulesObjOO.then = cloneDeep(rule.definition.then);
      this.ruleEditId = rule._id;
      this.isEdit = true;
      this.isAdd = false;
     } else{
      this.addEditRule= {
        name:'',
        definition:[],
      }
      this.resetRule();
      this.isEdit = false;
      this.isAdd = true;
     }
     this.addRulesModalPopRef  = this.addRulesModalPop.open();
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
 

   tabActive(tab) {
    this.tabsList.map(o=>{o.isSelected = false; return o;});
    this.draftRules.map(o=>{o.isChecked = false; return o;});
    this.inReviewRules.map(o=>{o.isChecked = false; return o;});
    this.approvedRules.map(o=>{o.isChecked = false; return o;});
    this.searchBlock = '';
    this.rulesService.isCheckAll = false;
    this.rulesService.showReviewFooter = false;
    tab.isSelected = true;
   }

   allSubscribe() {
    this.selectAllSub =  this.rulesService.selectAll.subscribe(res=>{
      let tabActive = _.findWhere(this.tabsList, {isSelected: true}).name;
      if(tabActive == 'Drafts') {
        this.draftRules = _.map(this.draftRules, o=> {o.isChecked = !this.rulesService.isCheckAll; return o;});
        this.rulesService.showReviewFooter = _.where(this.rules, {isChecked: true}).length > 0;
      } else if(tabActive == 'In-review'){
        this.inReviewRules = _.map(this.inReviewRules, o=> {o.isChecked = !this.rulesService.isCheckAll; return o;});
        this.rulesService.showReviewFooter = _.where(this.rules, {isChecked: true}).length > 0;
      } else if(tabActive == 'Approved') {
        this.approvedRules = _.map(this.approvedRules, o=> {o.isChecked = !this.rulesService.isCheckAll; return o;});
        this.rulesService.showReviewFooter = _.where(this.rules, {isChecked: true}).length > 0;
      }
     });

    this.openAddRulesModalSub = this.rulesService.openAddRulesModal.subscribe(res=>{
      this.addEditRules(res);
      // this.addRulesModalPopRef  = this.addRulesModalPop.open();
    });
    this.deleteRuleSub = this.rulesService.deleteRule.subscribe(res=>{
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
              ruleId: res
            };
            this.service.invoke('delete.rule', params).subscribe(
              res => {
               this.getRules();
              }, err => {
       
              })
            dialogRef.close();
          } else if (result === 'no') { dialogRef.close(); }
        });
    });
    this.bulkSendSub = this.rulesService.bulkSend.subscribe(res=>{
      let tabActive = _.findWhere(this.tabsList, {isSelected: true}).name;
      let selectedIds = [];
      if(tabActive == 'Drafts') {
        selectedIds = _.map(_.where(this.draftRules, {isChecked: true}), o=> _.pick(o, '_id'));
      } else if(tabActive == 'In-review'){
        selectedIds = _.map(_.where(this.inReviewRules, {isChecked: true}), o=> _.pick(o, '_id'));
      } else if(tabActive == 'Approved') {
        selectedIds = _.map(_.where(this.approvedRules, {isChecked: true}), o=> _.pick(o, '_id'));
      }
      let params = {
        searchIndexId: this.serachIndexId
      }
      let payload = {
        rules: selectedIds,
        state: res,
        action: 'edit'
      };
      this.service.invoke('updateBulk.rule',params,payload).subscribe(res=>{
        this.notify.notify(res.msg, 'success');
        this.rulesService.showReviewFooter = false;
        this.rulesService.isCheckAll = false;
        this.getRules();
      }, err=>{
  
      });
    });
    this.bulkDeleteSub = this.rulesService.bulkDelete.subscribe(res=>{
      let tabActive = _.findWhere(this.tabsList, {isSelected: true}).name;
      let selectedIds = [];
      if(tabActive == 'Drafts') {
        selectedIds = _.map(_.where(this.draftRules, {isChecked: true}), o=> _.pick(o, '_id'));
      } else if(tabActive == 'In-review'){
        selectedIds = _.map(_.where(this.inReviewRules, {isChecked: true}), o=> _.pick(o, '_id'));
      } else if(tabActive == 'Approved') {
        selectedIds = _.map(_.where(this.approvedRules, {isChecked: true}), o=> _.pick(o, '_id'));
      }
      let params = {
        searchIndexId: this.serachIndexId
      }
      let payload = {
        rules: selectedIds,
        action: 'delete'
      };
      this.service.invoke('updateBulk.rule',params,payload).subscribe(res=>{
        this.notify.notify('Rules deleted successfully', 'success');
        this.rulesService.showReviewFooter = false;
        this.rulesService.isCheckAll = false;
        this.getRules();
      }, err=>{
  
      });
    });

   }

   getRules(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId,
   }
   this.service.invoke('get.rules', quaryparamats).subscribe(
    res => {
      this.rules = _.map(res.rules, o=>{o.isChecked = false; return o});
      this.rules = _.filter(res.rules, function(o){ return o.action != "delete"; });

      this.rules.forEach(o=>{
        o.definition.if.rules.map(oo=>{
          oo.rules.map(ooo=>{
            ooo.listContextTypes = ['Search Context', 'User Context', 'Page Context'];
            ooo.listContextCategories = ['Customer Type', 'Accounts', 'Recent Searches', 'Device Type', 'Location', 'Page Name', ' Page Id'];
            if(ooo.contextType == 'User Context') {
              ooo.dispContextCategories = ['Customer Type', 'Accounts'];
            }
            else if(ooo.contextType == 'Search Context') {
              ooo.dispContextCategories = ['Recent Searches', 'Device Type', 'Location'];
            }
            else if(ooo.contextType == 'Page Context') {
              ooo.dispContextCategories = ['Page Name', ' Page Id'];
            }
            return ooo;
          })
        })
      });
      this.draftRules = _.where(this.rules, {state: 'draft'});
      this.inReviewRules = _.where(this.rules, {state: 'in-review'});
      this.approvedRules = _.where(this.rules, {state: 'approved'});
      this.tabsList[0].count = this.draftRules.length;
      this.tabsList[1].count = this.inReviewRules.length;
      this.tabsList[2].count = this.approvedRules.length;
      this.loadingRules = false;
    },
    errRes => {
      this.errorToaster(errRes)
      this.loadingRules = false
    });  
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

 validateRules(rulesList) {
  return _.filter(rulesList, o=>{
    return o.operator != '' && o.hasOwnProperty('contextType') && o.hasOwnProperty('contextCategory') && o.hasOwnProperty('values') && o.values.length > 0;
  });
 }

   saveRules(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId
   }
   if(this.name.na.trim() == '') {
     this.notify.notify('Please enter rule name', 'error');
     return;
   }
   let rulesCheck = this.validateRules(this.validationRules.rules[0].rules);
   if(rulesCheck.length == 0) {
     this.notify.notify('Atleast one rule is mandatory to proceed', 'error');
     return;
   }
   if(this.rulesObjOO.then.resultCategory == '' || this.rulesObjOO.then.values.length == 0) {
     this.notify.notify('THEN rule is mandatory to proceed', 'error');
     return;
   }
   rulesCheck = _.map(rulesCheck, o=> {return _.pick(o, 'contextCategory', 'contextType', 'operator', 'values')});
   this.validationRules.rules[0].rules = rulesCheck;
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
      }, err=>{
        this.errorToaster(err, 'Unable to save the rule');
      });
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

   ngOnDestroy() {
    this.selectAllSub?this.selectAllSub.unsubscribe():false;
    this.openAddRulesModalSub?this.openAddRulesModalSub.unsubscribe():false;
    this.deleteRuleSub?this.deleteRuleSub.unsubscribe():false;
    this.bulkSendSub?this.bulkSendSub.unsubscribe():false;
    this.bulkDeleteSub?this.bulkDeleteSub.unsubscribe():false;
   }

}
