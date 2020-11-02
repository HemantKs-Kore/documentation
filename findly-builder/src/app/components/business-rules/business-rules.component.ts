import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import * as _ from 'underscore';
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
  rules = [];
  loadingContent = true;
  selcectionObj: any = {
    selectAll: false,
    selectedItems:[],
  };
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
    this.getRules();
  }
  openModalPopup(){
    this.addBusinessRulesRef = this.addBusinessRules.open();
  }
  closeModalPopup(){
    this.addBusinessRulesRef.close();
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
      ruleName: 'Rule 1',
      isRuleActive: true,
      rules: [
          {
              contextType: 'User Context',
              contextCategory: 'Accounts',
              operator: 'contains',
              value: [
                  'A'
              ]
          },
          {
              contextType: 'Page Context',
              contextCategory: 'Page Name',
              operator: 'contains',
              value: [
                  'B'
              ]
          }
      ],
      outcomes: [
          {
              outcomeType: 'A',
              scale: 10,
              fieldName: 'question',
              outcomeOperator: 'contains',
              outcomeValue: [
                  'C',
                  'D'
              ]
          },
          {
              outcomeType: 'Boost result',
              scale: 10,
              fieldName: 'question',
              outcomeOperator: 'contains',
              outcomeValue: [
                  'X'
              ]
          }
      ]
   }
    this.service.invoke('create.businessRules', quaryparms,payload).subscribe(res => {
      this.rules.push(res);
    }, errRes => {
      this.errorToaster(errRes,'Failed to create rules');
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
