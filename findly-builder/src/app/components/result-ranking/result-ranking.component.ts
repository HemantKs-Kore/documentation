import { Component, OnDestroy, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { Moment } from 'moment';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
declare const $: any;

@Component({
  selector: 'app-result-ranking',
  templateUrl: './result-ranking.component.html',
  styleUrls: ['./result-ranking.component.scss']
})
export class ResultRankingComponent implements OnInit, OnDestroy {
  actionLogData: any;
  time;
  iconIndex;
  actionIndex;
  selectedApp;
  serachIndexId;
  queryPipelineId;
  indexPipelineId;
  customizeLog: any = {};
  selectedRecord: any = {};
  resultLogs: boolean = false;
  customizeList: any;
  totalRecord = 0;
  limitpage = 10;
  customizeListBack: any;
  loadingContent: boolean = true;
  nextPage: boolean = false;
  icontoggle: boolean = false;
  faqDesc: any;
  mocData: any;
  subscription: Subscription;
  timeLogData: any;
  lastModifiedOn: any;
  resultSelected = false;
  disableDiv = false;
  collectedRecord = [];
  permisionView = false;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService) { }
  sdk_evenBind() {
    $(document).off('click', '.start-search-icon-div').on('click', '.start-search-icon-div', () => {
      this.getcustomizeList(20, 0);
    })
    // $(document).on('click','.start-search-icon-div.active',() =>{
    //   this.getcustomizeList();
    // })
  }
  ngOnInit(): void {
    this.sdk_evenBind();


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
    this.loadCustomRankingList();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
      this.loadCustomRankingList();
    })
  }
  loadImageText: boolean = false;
  loadingContent1: boolean
  imageLoad(){
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
  }
  loadCustomRankingList(){
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      if(this.indexPipelineId){
      this.queryPipelineId = this.workflowService.selectedQueryPipeline()?this.workflowService.selectedQueryPipeline()._id:this.selectedApp.searchIndexes[0].queryPipelineId;
      if(this.queryPipelineId){
        this.getcustomizeList(20,0);
      }
    }
  }
  showLogs() {
    this.resultLogs = true;
  }
  paginate(event) {
    this.getcustomizeList(event.limit, event.skip);
    //event.limit;
    //event.skip;
  }
  resetCustomization() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    let ids = []
    this.collectedRecord.forEach(element => {
      ids.push(element._id);
    });
    let payload = {
      ids: ids
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore Customization',
        text: 'Are you sure you want to Reset',
        newTitle: 'Are you sure you want to Reset?',
        body: 'Selected customizations will be Reset once you proceed.',
        buttons: [{ key: 'yes', label: 'Reset', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true,
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.service.invoke('reset.bulkCustomization', quaryparms, payload).subscribe(res => {
            this.resetSelected();
            this.selectedRecord = {};
            this.customizeLog = [];
            this.notificationService.notify('Bulk reset successfull', 'success');
          }, errRes => {
            if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
              this.notificationService.notify(errRes.error.errors[0].msg, 'error');
            } else {
              this.notificationService.notify('Failed', 'error');
            }
          });
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      })

  }
  launch() {
    if (this.selectedRecord && this.selectedRecord.searchQuery) {
      let ball = document.getElementsByClassName('start-search-icon-div')[0] as HTMLBaseElement;
      ball.click()
      let texBox = document.getElementsByName('search')[1] as HTMLDataElement;
      texBox.value = this.selectedRecord.searchQuery;
      setTimeout(() => {
        let go = document.getElementsByClassName('search-button')[0] as HTMLBaseElement;
        go.click();
        setTimeout(() => {
          let customTag = document.getElementsByClassName('faqs-wrp-content')[0] as HTMLBaseElement;
          customTag.click();
          let custom = document.getElementsByClassName('custom-header-nav-link-item')[1] as HTMLBaseElement;
          custom.click();
        }, 3000)
        //document.getElementById('viewTypeCustomize').click(); //viewTypeCustomize
      }, 3000);
    }
  }
  resetSelected() {
    this.customizeList.forEach((element, index) => {
      element['check'] = false;
    });
    this.collectedRecord = [];
    this.resultSelected = false;
    this.disableDiv = false;
    this.getcustomizeList(20, 0);
  }
  selectAll() {
    //this.collectedRecord = [];
    let selected = false;
    if (this.collectedRecord.length == this.customizeList.length) {
      this.resetSelected();
    } else if (this.collectedRecord.length >= 0 && this.collectedRecord.length < this.customizeList.length) {
      this.collectedRecord = [];
      this.disableDiv = true;
      this.customizeList.forEach((element, index) => {
        element['check'] = true;
        this.collectedRecord.push(element);
      });
      this.resultSelected = true;
    } else {
      this.resetSelected();
    }
    // if(this.customizeList.length){
    //   let selected = this.customizeList.find(element=> {
    //     return element['check'] == false ? true : false;
    //   });
    //   if(!selected){
    //     this.resetSelected();
    //   }else{
    //     this.customizeList.forEach((element,index) => {
    //       element['check'] = true;
    //       this.collectedRecord.push(element);
    //     });
    //     this.resultSelected = true;
    //   }
    // }
  }
  multiSelect(record, opt, event) {
    if (event) {

    }
    if (event.target.checked) {
      this.collectedRecord.push(record)
    } else {
      this.collectedRecord.forEach((element, index) => {
        if (element._id == record._id) {
          this.collectedRecord.splice(index, 1);
        }
      });
    }
    if (this.collectedRecord.length > 0) {
      this.resultSelected = true;
      this.disableDiv = true;
    } else {
      this.resultSelected = false;
      this.disableDiv = false;
    }

    // let pushRecord = [];
    // //this.collectedRecord  = [];
    // if(event.target.checked){
    //   this.resultSelected = opt;
    //   // this.collectedRecord.forEach(element => {

    //   // });
    //   this.collectedRecord.push(record)
    // }else {
    //   let selecetd = false;
    //   this.customizeList.forEach((element,index) => {
    //     if(element._id != record._id){
    //       if(element['check'] == true){
    //         pushRecord.push(element)
    //       }
    //     }
    //     if(element._id == record._id){
    //       this.collectedRecord.splice(index,1);
    //     }
    //   });

    //   if(pushRecord.length > 0){
    //     this.resultSelected = true;
    //   }else {
    //     this.resultSelected = false;
    //     this.collectedRecord = [];
    //   }
    // }
    console.log(this.collectedRecord)
  }
  clickCustomizeRecord(record, event?) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    //opt == 'default' ?  this.resultSelected = false : this.resultSelected = true;
    //this.multiSelect(record,opt)

    this.selectedRecord = record;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      rankingAndPinningId : record._id,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };

    this.service.invoke('get.customisationLogs', quaryparms).subscribe(res => {
      //this.customizeList = res;
      this.lastModifiedOn = res.lMod;
      this.actionLogData = res.customizations;
      for (let i = 0; i < this.actionLogData.length; i++) {
        this.actionLogData[i]["selected"] = false;
        this.actionLogData[i]["drop"] = false;
        this.actionLogData[i].customization.lMod = moment(this.actionLogData[i].customization.lMod).fromNow()
        if (this.actionLogData[i].logs) {
          this.actionLogData[i].logs[0].createdOn = moment(this.actionLogData[i].logs[0].createdOn).fromNow()
        }
        if (this.actionLogData[i].target.contentType == 'faq') {
          if (this.actionLogData[i].target.contentInfo._source.defaultAnswers[0].payload.split(/^\r\n/)) {
            this.faqDesc = this.actionLogData[i].target.contentInfo._source.defaultAnswers[0].payload.replace(/\u21b5/g, '');
          } else {
            this.faqDesc = this.actionLogData[i].target.contentInfo._source.defaultAnswers[0].payload
          }

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
  removeRecord(actLog) {
    const searchIndex = this.serachIndexId;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      queryPipelineId: this.queryPipelineId,
      rankingAndPinningId: this.selectedRecord._id,
      contentId : actLog.target.contentId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    this.remove_Record(quaryparms)
  }
  remove_Record(quaryparms) {
    // const searchIndex = this.serachIndexId;
    // const quaryparms: any = {
    //   searchIndexId: searchIndex,
    //   queryPipelineId: this.queryPipelineId
    // };
    // let result: any = [];
    // var obj: any = {};
    // obj.config = {};
    // obj.contentType = actLog.target.contentType;
    // //obj.contentType = contentTaskFlag ? contentType : element._source.contentType ;
    // obj.contentId = actLog.target.contentId;
    // if (actLog.customization.action == 'pinned') obj.config['pinIndex'] = -1;
    // if (actLog.customization.action == 'boosted' || actLog.customization.action == 'burried') obj.config['boost'] = 1;
    // if (actLog.customization.action == 'hidden') obj.config['hidden'] = true;
    // // obj.config = {
    // //    pinIndex : -1,
    // //   //boost: 1.0,
    // //   //visible: true,
    // //burried
    // // }
    // result.push(obj);

    // let payload: any = {};
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore Customization',
        text: 'Are you sure you want to Restore',
        newTitle: 'Are you sure you want to remove?',
        body: 'Selected customization done for this query will be removed.',
        buttons: [{ key: 'yes', label: 'Remove', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true,
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.service.invoke('delete.CustomizatioLog', quaryparms).subscribe(res => {
            dialogRef.close();
            this.notificationService.notify('Record Removed', 'success');
            this.getcustomizeList(20, 0);
            this.actionLogData = [];
            this.customizeList = [];
            //console.log(res);
          }, errRes => {
            if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
              this.notificationService.notify(errRes.error.errors[0].msg, 'error');
            } else {
              this.notificationService.notify('Failed remove record', 'error');
            }
          });
        } else if (result === 'no') {
          dialogRef.close();
        }
      })


  }

  applyFilter(value) {
    let list = [...this.customizeListBack];
    let listPush = [];
    if (value) {
      list.forEach(element => {
        if (element.searchQuery.includes(value)) {
          listPush.push(element);
        }
      });
      this.customizeList = [...listPush]
    } else {
      //listPush = [...list]
      this.customizeList = [...this.customizeListBack];
    }

  }
  timeLog(record) {
    // this.selectedRecord = record;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      rankingAndPinningId: record._id
    };
    // this.time =moment("2020-10-28T05:27:49.499Z").fromNow()
    // const displayTime=document.getElementById('displayTime')
    // displayTime.append('time')
    this.service.invoke('get.rankingActionLog', quaryparms).subscribe(res => {
      this.customizeLog = res;
      for (let i = 0; i < this.customizeLog.length; i++) {
        let time = this.customizeLog[i].createdOn
        this.customizeLog[i].createdOn = moment(time).fromNow()
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

  restore(record) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      rankingAndPinningId : record._id,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to reset?',
        body: 'All the customizations done for this query will be removed.',
        buttons: [{ key: 'yes', label: 'Reset', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true,
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.service.invoke('put.restoreQueryCustomize', quaryparms).subscribe(res => {
            //this.customizeList = res;
            this.getcustomizeList(20, 0);
            this.actionLogData = [];
            this.customizeList = [];
            dialogRef.close();
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
  getcustomizeList(limit?, skip?) {
    limit ? limit : 20;
    skip ? skip : 0;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      limit : limit,
      skip : skip
    };
    this.service.invoke('get.queryCustomizeList', quaryparms).subscribe(res => {
      this.loadingContent = false;
      this.customizeList = res;
      if (res.length > 0) { this.nextPage = true; this.loadingContent = false; }
      else {
        this.nextPage = false; this.loadingContent = false;
      }
      this.customizeListBack = [...res];
      this.totalRecord = res.length
      this.customizeList.forEach((element, index) => {

        if (index == 0) {
          element['check'] = false;
          this.clickCustomizeRecord(element)
        } else {
          element['check'] = false;
        }

      });
      if (!this.customizeList.length) {
        this.selectedRecord = {};
        this.customizeLog = [];
        this.actionLogData = [];
      }
      if (res.length > 0) {
        this.loadingContent = false;
        this.loadingContent1 = true;
      }
      else {
        this.loadingContent1 = true;
      }
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  toggle(icontoggle, selected) {
    let previousIndex = this.iconIndex
    //previousIndex == index ? this.icontoggle = !icontoggle : this.icontoggle = icontoggle;
    this.icontoggle = !icontoggle;
    // this.iconIndex  = index;
    //this.mocData[index].selected = !selected;
    // this.actionLogData[index].selected = !selected;
  }
  toggleAction(actiontoggle, index, selected) {
    //this.actionToggle = !actiontoggle;
    this.actionIndex = index;
    // this.mocData[index].drop = !selected;
    this.actionLogData[index].drop = !selected;
  }
  toggleLogAction(index, selected) {
    this.customizeLog[index].selected = !selected;
  }
  closeLogs() {
    this.resultLogs = false;
  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : false;
  }
}
