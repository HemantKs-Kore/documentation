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
  actionLogData : any;
  iconIndex;
  actionIndex;
  selectedApp;
  serachIndexId;
  queryPipelineId;
  customizeLog : any = {};
  selectedRecord : any = {};
  resultLogs : boolean = false;
  customizeList : any;
  loadingContent : boolean = false;
  icontoggle : boolean = false;
  faqDesc : any;
  mocData : any;
  timeLogData : any;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    
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
  // this.customizeLog = [{
  //     "header" : "Credit card payament",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "name": "Sunil Singh",
  //     "time" : "3h ago",
  //     "selected" : false,
  //   },
  //   {
  //     "header" : "Pay Bill",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "name": "Sunil Singh",
  //     "time" : "3h ago",
  //     "selected" : false,
  //   }]
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
    this.service.invoke('get.customisationLogs', quaryparms).subscribe(res => {
      //this.customizeList = res;
      this.actionLogData = res;
      for(let i =0; i<this.actionLogData.length; i++){
        this.actionLogData[i]["selected"] = false;
        this.actionLogData[i]["drop"] = false;
        if(this.actionLogData[i].target.contentType == 'faq'){
          this.faqDesc = this.actionLogData[i].target.contentInfo.defaultAnswers[0].payload
        }
      }

      this.timeLog(record)
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed', 'error');
       }
     });
  }
  timeLog(record){
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      rankingAndPinningId : record._id
    };
    this.service.invoke('get.rankingActionLog', quaryparms).subscribe(res => {
      this.customizeLog = res;
      for(let i = 0 ; i< this.customizeLog.length ; i++){
        this.customizeLog[i]['selected'] = false;
      }
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
  toggle(icontoggle,selected){
    let previousIndex = this.iconIndex
    //previousIndex == index ? this.icontoggle = !icontoggle : this.icontoggle = icontoggle;
    this.icontoggle = !icontoggle; 
    // this.iconIndex  = index;
    //this.mocData[index].selected = !selected;
    // this.actionLogData[index].selected = !selected;
  }
  toggleAction(actiontoggle,index,selected){
   //this.actionToggle = !actiontoggle;
    this.actionIndex = index;
   // this.mocData[index].drop = !selected;
    this.actionLogData[index].drop = !selected;
  }
  toggleLogAction(index,selected){
    this.customizeLog[index].selected = !selected;
  }
  closeLogs(){
    this.resultLogs = false;
  }
}
