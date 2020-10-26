import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';

@Component({
  selector: 'app-result-ranking',
  templateUrl: './result-ranking.component.html',
  styleUrls: ['./result-ranking.component.scss']
})
export class ResultRankingComponent implements OnInit {
  actionLogData : any = [];
  iconIndex;
  actionIndex;
  selectedApp;
  serachIndexId;
  queryPipelineId;
  customizeLog : any;
  selectedRecord : any = {};
  resultLogs : boolean = false;
  customizeList : any;
  loadingContent : boolean = false;
  icontoggle : boolean = false;
  mocData : any;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.mocData = [
      {
          "_id": "flog-4e82ff46-9282-5c45-b637-fa1868a90846",
          "createdOn": "2020-10-22T06:22:34.147Z",
          "subject": "rankingAndPinning",
          "subjectId": "rnp-7f80f4dd-cd60-5fdd-9f3e-5d00641d4b41",
          "target": {
              "contentType": "page",
              "contentId": "pg-34ce0738-cb7a-401f-8549-c64d7398d0ba",
              "contentInfo": {
                  "_id": "pg-34ce0738-cb7a-401f-8549-c64d7398d0ba",
                  "title": "Director (business) - Wikipedia",
                  "searchResultPreview": ""
              }
          },
          "createdBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
          "searchIndexId": "sidx-4fe0bceb-d390-5abb-b879-e1626ca2b04d",
          "streamId": "st-85bf517b-2592-5050-9cbc-0c81925eadc5",
          "queryPipelineId": "fqp-db87b541-438b-5a13-ac74-6e12226e4dbc",
          "action": "boosted",
          "displayMessage": "boosted the result",
          "__v": 0,
          "selected" : false,
          "drop":false
      },
      {
          "_id": "flog-5b75bdff-2844-563f-a5c9-5aa7d00d706d",
          "createdOn": "2020-10-22T08:23:28.608Z",
          "subject": "rankingAndPinning",
          "subjectId": "rnp-7f80f4dd-cd60-5fdd-9f3e-5d00641d4b41",
          "target": {
              "contentType": "faq",
              "contentId": "faqc-752c532e-ad31-5dfe-ae6c-6acb752b9d7f",
              "contentInfo": {
                  "_id": "faqc-752c532e-ad31-5dfe-ae6c-6acb752b9d7f",
                  "question": "Design problem decomposition: an empirical study of small teams",
                  "defaultAnswers": [
                      {
                          "type": "string",
                          "payload": "This is an updated answer"
                      }
                  ]
              }
          },
          "createdBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
          "searchIndexId": "sidx-4fe0bceb-d390-5abb-b879-e1626ca2b04d",
          "streamId": "st-85bf517b-2592-5050-9cbc-0c81925eadc5",
          "queryPipelineId": "fqp-db87b541-438b-5a13-ac74-6e12226e4dbc",
          "action": "pinned",
          "displayMessage": "pinned the result",
          "__v": 0,
          "selected" : false,
          "drop":false
      },
      {
          "_id": "flog-7371bcbb-72a5-579d-844a-29fd9e1e4fa5",
          "createdOn": "2020-10-22T08:24:32.517Z",
          "subject": "rankingAndPinning",
          "subjectId": "rnp-7f80f4dd-cd60-5fdd-9f3e-5d00641d4b41",
          "target": {
              "contentType": "task",
              "contentId": "dg-d735d974-4450-5f73-a7ec-6d04a7b8a8c0",
              "contentInfo": {
                  "_id": "dg-d735d974-4450-5f73-a7ec-6d04a7b8a8c0",
                  "lname": "aboutfindly"
              }
          },
          "createdBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
          "searchIndexId": "sidx-4fe0bceb-d390-5abb-b879-e1626ca2b04d",
          "streamId": "st-85bf517b-2592-5050-9cbc-0c81925eadc5",
          "queryPipelineId": "fqp-db87b541-438b-5a13-ac74-6e12226e4dbc",
          "action": "pinned",
          "displayMessage": "pinned the result",
          "__v": 0,
          "selected" : false,
          "drop":false
      }
   ]
   
    this.actionLogData = [{
      "header" : "Can I make credit card payament via savings account", // and get notifiaction once done?
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "New",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "help",
      "status": "Boosted",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "bot",
      "status": "Hidden",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    }
  ]
  this.customizeLog = [{
      "header" : "Credit card payament",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "name": "Sunil Singh",
      "time" : "3h ago",
      "selected" : false,
    },
    {
      "header" : "Pay Bill",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "name": "Sunil Singh",
      "time" : "3h ago",
      "selected" : false,
    }]
  this.selectedApp = this.workflowService.selectedApp();
  this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
  this.queryPipelineId = this.selectedApp.searchIndexes[0].queryPipelineId;
  this.getcustomizeList();
  }
  showLogs(){
    this.resultLogs = true;
  }
  clickCustomizeRecord(record){
    this.selectedRecord = record;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      rankingAndPinningId : record._id
    };
    this.service.invoke('get.rankingActionLog', quaryparms).subscribe(res => {
      //this.customizeList = res;
      this.actionLogData = res;
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed', 'error');
       }
     });
  }
  restore(record){
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      rankingAndPinningId : record._id
    };
    this.service.invoke('put.restoreQueryCustomize', quaryparms).subscribe(res => {
      //this.customizeList = res;
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed', 'error');
       }
     });
  }
  getcustomizeList(){
   
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId
    };
    this.service.invoke('get.queryCustomizeList', quaryparms).subscribe(res => {
      this.customizeList = res;
      
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
  }
  toggle(icontoggle,index,selected){
    let previousIndex = this.iconIndex
    //previousIndex == index ? this.icontoggle = !icontoggle : this.icontoggle = icontoggle;
    this.icontoggle = !icontoggle; 
    this.iconIndex  = index;
    this.mocData[index].selected = !selected;
    this.actionLogData[index].selected = !selected;
  }
  toggleAction(actiontoggle,index,selected){
   //this.actionToggle = !actiontoggle;
    this.actionIndex = index;
    this.mocData[index].drop = !selected;
    this.actionLogData[index].drop = !selected;
  }
  toggleLogAction(index,selected){
    this.customizeLog[index].selected = !selected;
  }
  closeLogs(){
    this.resultLogs = false;
  }
}
