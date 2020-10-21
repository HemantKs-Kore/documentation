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
  resultLogs : boolean = false;
  customizeList : any;
  loadingContent : boolean = false;
  icontoggle : boolean = false;
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
    this.actionLogData[index].selected = !selected;
  }
  toggleAction(actiontoggle,index,selected){
   //this.actionToggle = !actiontoggle;
    this.actionIndex = index;
    this.actionLogData[index].drop = !selected;
  }
  toggleLogAction(index,selected){
    this.customizeLog[index].selected = !selected;
  }
  closeLogs(){
    this.resultLogs = false;
  }
}
