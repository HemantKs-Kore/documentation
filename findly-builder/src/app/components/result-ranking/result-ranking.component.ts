import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-result-ranking',
  templateUrl: './result-ranking.component.html',
  styleUrls: ['./result-ranking.component.scss']
})
export class ResultRankingComponent implements OnInit {
  actionLogData : any;
  time;
 
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
    public dialog: MatDialog,
    private notificationService: NotificationService) { }
   

  ngOnInit(): void {


    
  //   this.actionLogData = [{
  //     "header" : "Can I make credit card payament via savings account", // and get notifiaction once done?
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "New",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "help",
  //     "status": "Boosted",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "bot",
  //     "status": "Hidden",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false,
  //     "drop":false
  //   }
  // ]
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
        this.actionLogData[i].target.contentInfo.createdOn = moment(this.actionLogData[i].target.contentInfo.createdOn).fromNow()
        //this.actionLogData[i].logs[0].createdOn = moment(this.actionLogData[i].logs[0].createdOn).fromNow()
        // if(this.actionLogData[i].target.contentType == 'faq'){
        //   this.faqDesc = this.actionLogData[i].target.contentInfo.defaultAnswers[0].payload
        // }
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
  
  removeRecord(actLog){
    
    const searchIndex = this.serachIndexId;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      queryPipelineId : this.queryPipelineId
    };
    let result :any = [];
      var obj :any = {};
      obj.contentType = actLog.target.contentType ;
      //obj.contentType = contentTaskFlag ? contentType : element._source.contentType ;
      obj.contentId = actLog.target.contentId;
      if(actLog.customization.action == 'pinned' ) obj.config['pinIndex'] = -1;
      if(actLog.customization.action == 'pinned' ) obj.config['boost'] = 1;  
      if(actLog.customization.action == 'pinned' ) obj.config['visible'] = true;
      // obj.config = {
      //    pinIndex : -1,
      //   //boost: 1.0,
      //   //visible: true,
      // }
      result.push(obj);
    
    let payload : any = {};
    
    payload.searchQuery = this.selectedRecord.searchQuery;//this.query;
    payload.results = result;
    this.service.invoke('update.rankingPinning', quaryparms,payload).subscribe(res => {
      
      this.notificationService.notify('Record Removed', 'success');
      this.getcustomizeList();
      this.actionLogData = [];
      this.customizeList = [];
      //console.log(res);
    }, errRes =>  {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed remove record', 'error');
      }
    });
  
  }
  timeLog(record){
    // this.selectedRecord = record;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      rankingAndPinningId : record._id
    };
    // this.time =moment("2020-10-28T05:27:49.499Z").fromNow()
    // const displayTime=document.getElementById('displayTime')
    // displayTime.append('time')
    this.service.invoke('get.rankingActionLog', quaryparms).subscribe(res => {
      this.customizeLog = res;
      for(let i = 0 ; i< this.customizeLog.length ; i++){
        let time= this.customizeLog[i].createdOn
        this.customizeLog[i].createdOn=moment(time).fromNow()
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore Customization',
        text: 'Are you sure you want to Restore',
        buttons: [{ key: 'yes', label: 'Restore', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }]
      }
    });
    dialogRef.componentInstance.onSelect
        .subscribe(result => {
          if (result === 'yes') {
            this.service.invoke('put.restoreQueryCustomize', quaryparms).subscribe(res => {
              //this.customizeList = res;
              this.getcustomizeList();
              this.actionLogData = [];
              this.customizeList = [];
             }, errRes => {
               if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
                 this.notificationService.notify(errRes.error.errors[0].msg, 'error');
               } else {
                 this.notificationService.notify('Failed', 'error');
               }
             });
          } else if (result === 'no') {
            dialogRef.close();
          }
        })
    
    
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
