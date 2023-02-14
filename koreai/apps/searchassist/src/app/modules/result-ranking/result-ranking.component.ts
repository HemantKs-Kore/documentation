import { EMPTY_SCREEN } from './../../modules/empty-screen/empty-screen.constants';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { InlineManualService } from '@kore.apps/services/inline-manual.service';
import { SideBarService } from '@kore.apps/services/header.service';
declare const $: any;

@Component({
  selector: 'app-result-ranking',
  templateUrl: './result-ranking.component.html',
  styleUrls: ['./result-ranking.component.scss'],
})
export class ResultRankingComponent implements OnInit, OnDestroy {
  emptyScreen = EMPTY_SCREEN.RESULT_RANKING;
  actionLogData: any;
  time;
  iconIndex;
  actionIndex;
  selectedApp;
  serachIndexId;
  queryPipelineId;
  indexPipelineId;
  customizeLog: any = [];
  selectedRecord: any = {};
  resultLogs = false;
  customizeList: any;
  totalRecord = 0;
  limitpage = 10;
  customizeListBack: any;
  loadingContent = true;
  nextPage = false;
  icontoggle = false;
  faqDesc: any;
  mocData: any;
  subscription: Subscription;
  timeLogData: any;
  lastModifiedOn: any;
  resultSelected = false;
  disableDiv = false;
  collectedRecord = [];
  permisionView = false;
  showSearch = false;
  activeClose = false;
  searchSources = '';
  componentType = 'optimize';
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  fieldData: any;
  strucDataHeading = '';
  strucDataDec = '';
  strucDataHeadingDis = '';
  strucDataDecDis = '';
  loadImageText = false;
  loadingContent1: boolean;
  customizedActionLogData = [];
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public inlineManual: InlineManualService,
    private headerService: SideBarService,
    private zone: NgZone
  ) {}
  sdk_evenBind() {
    // $(document).off('click', '.kore-search-container-close-icon').on('click', '.kore-search-container-close-icon', () => {
    //   this.getcustomizeList(20, 0);
    // })
    $(document).on('click', '.kore-search-container-close-icon', () => {
      this.selectedApp = this.workflowService.selectedApp();
      this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
      this.zone.run(() => {
        this.loadCustomRankingList();
      });
    });
    $(document)
      .off('click', '.start-search-icon-div')
      .on('click', '.start-search-icon-div', () => {
        this.selectedApp = this.workflowService.selectedApp();
        this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
        this.loadCustomRankingList();
      });

    //Top Down
    $(document)
      .off('click', '.rr-tour-test-btn')
      .on('click', '.rr-tour-test-btn', () => {
        this.selectedApp = this.workflowService.selectedApp();
        this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
        this.loadCustomRankingList();
      });
  }
  ngOnInit(): void {
    this.sdk_evenBind();
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.loadCustomRankingList();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(
      (res) => {
        this.loadCustomRankingList();
      }
    );
  }
  isEmptyScreenLoading(isLoading) {
    if (!isLoading) {
      this.loadingContent = false;
      this.loadingContent1 = true;
      this.loadImageText = true;
      if (!this.inlineManual.checkVisibility('RESULT_RANKING')) {
        this.inlineManual.openHelp('RESULT_RANKING');
        this.inlineManual.visited('RESULT_RANKING');
      }
    }
  }
  loadCustomRankingList() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId) {
        this.getFieldAutoComplete();
      }
    }
  }
  getFieldAutoComplete() {
    const query: any = '';
    // const quaryparms: any = {
    //   searchIndexID: this.serachIndexId,
    //   indexPipelineId: this.indexPipelineId,
    //   query,
    // };
    // const url = 'get.getFieldAutocomplete'
    const url = 'get.presentableFields';
    const quaryparms: any = {
      isSelected: true,
      sortField: 'fieldName',
      orderType: 'asc', //desc,
      indexPipelineId: this.indexPipelineId,
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      searchKey: '',
    };
    this.service.invoke(url, quaryparms).subscribe(
      (res) => {
        this.fieldData = res.data;
        this.getSettings('fullSearch');
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get fields');
      }
    );
  }
  multiplyAction(value) {
    const count = value / 0.25;
    if (count > 4) {
      const data = count - 4;
      return data;
    } else {
      const data = 4 - count;
      return data >= 0 ? data : -1 * data;
    }
  }
  showLogs() {
    this.resultLogs = true;
  }
  paginate(event) {
    this.getcustomizeList(10, event.skip);
    //event.limit;
    //event.skip;
  }
  getSettings(interfaceType) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      interface: interfaceType,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
    };
    this.service.invoke('get.settingsByInterface', quaryparms).subscribe(
      (res) => {
        if (res && res.groupSetting) {
          let isStructured = '';
          res.groupSetting.conditions.forEach((element) => {
            if (element.fieldValue == 'data' && element.templateId) {
              isStructured = element.templateId;
            }
          });
          if (isStructured) {
            this.getTemplate(isStructured);
          } else {
            this.getcustomizeList(10, 0);
          }
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to fetch Setting Informations');
        //this.selectedSettingResultsObj = new selectedSettingResults()
      }
    );
  }
  getTemplate(templateId) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      templateId: templateId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
    };
    this.service.invoke('get.templateById', quaryparms).subscribe(
      (res) => {
        const strucDataHeadingId = res.mapping.heading;
        this.fieldData.forEach((element) => {
          if (element._id == res.mapping.heading) {
            this.strucDataHeading = element.fieldName;
          }
        });
        const strucDataDecId = res.mapping.description;
        this.fieldData.forEach((element) => {
          if (element._id == res.mapping.description) {
            this.strucDataDec = element.fieldName;
          }
        });

        this.getcustomizeList(10, 0);
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to fetch Template');
      }
    );
  }
  errorToaster(errRes, message) {
    if (
      errRes &&
      errRes.error &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  resetCustomization() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    const ids = [];
    this.collectedRecord.forEach((element) => {
      ids.push(element._id);
    });
    const payload = {
      ids: ids,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore Customization',
        text: 'Are you sure you want to Reset',
        newTitle: 'Are you sure you want to Reset?',
        body: 'All the customizations done on the selected queries will be removed.',
        buttons: [
          { key: 'yes', label: 'Reset', type: 'danger', class: 'deleteBtn' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        this.service
          .invoke('reset.bulkCustomization', quaryparms, payload)
          .subscribe(
            (res) => {
              this.resetSelected();
              this.selectedRecord = {};
              this.customizeLog = [];
              this.notificationService.notify('Reset Successful', 'success');
            },
            (errRes) => {
              if (
                errRes &&
                errRes.error.errors &&
                errRes.error.errors.length &&
                errRes.error.errors[0] &&
                errRes.error.errors[0].msg
              ) {
                this.notificationService.notify(
                  errRes.error.errors[0].msg,
                  'error'
                );
              } else {
                this.notificationService.notify('Failed', 'error');
              }
            }
          );
        dialogRef.close();
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
  }
  lauchTest() {
    const testButtun = document.getElementsByClassName(
      'rr-tour-test-btn'
    )[0] as HTMLBaseElement;
    testButtun.click();
    this.headerService.fromResultRank(true);
  }
  launch() {
    if (this.selectedRecord && this.selectedRecord.searchQuery) {
      this.headerService.fromResultRank(false);
      // let ball = document.getElementsByClassName('start-search-icon-div')[0] as HTMLBaseElement;
      // ball.click()
      const testButtun = document.getElementsByClassName(
        'rr-tour-test-btn'
      )[0] as HTMLBaseElement;
      testButtun.click();
      // console.log(this.headerService.searchConfiguration);
      if (
        this.headerService.searchConfiguration.experienceConfig
          .searchBarPosition == 'top'
      ) {
        setTimeout(() => {
          if (
            this.headerService.searchConfiguration.experienceConfig
              .searchBarPosition == 'top'
          ) {
            const link = document.getElementById('search') as HTMLDataElement;
            link.value = this.selectedRecord.searchQuery;
            link.focus();
            $('#search').addClass('from-result-ranking');
            link.click();
            setTimeout(() => {
              if (
                this.headerService.searchConfiguration.experienceConfig
                  .searchBarPosition == 'top'
              ) {
                const containerClass = document.getElementsByClassName(
                  'top-down-search-background-div'
                )[0] as HTMLBaseElement;
                containerClass.classList.add('if-full-results');
                const container = document.getElementsByClassName(
                  'all-result-container'
                )[0] as HTMLBaseElement;
                container.style.display = 'block';
              }
            }, 3000);
          }
        }, 3000);
      } else {
        // let testButtun = document.getElementsByClassName('rr-tour-test-btn')[0] as HTMLBaseElement;
        //testButtun.click()
        setTimeout(() => {
          // let texBox = document.getElementsByName('search')[1] as HTMLDataElement;
          // texBox.value = this.selectedRecord.searchQuery;
          const link = document.getElementById('search') as HTMLDataElement;
          link.value = this.selectedRecord.searchQuery;
          $('#search').addClass('from-result-ranking');
          link.click();
          // link.focus();
          // document.getElementsByClassName('search-button')[0].removeAttribute('disabled')
          // let go = document.getElementsByClassName('search-button')[0] as HTMLBaseElement;
          // go.click();

          const box = document.getElementById('searchBox') as HTMLDataElement;
          box.style.display = 'block';
          const container = document.getElementById(
            'searchChatContainer'
          ) as HTMLDataElement;
          container.click();
          //   texBox.value = this.selectedRecord.searchQuery;
          // $('#search').keyup(function (this) {
          //   let texBox = document.getElementsByName('search')[1] as HTMLDataElement;
          //   texBox.value = this.selectedRecord.searchQuery;
          // });
          // $('#search').keyup(this);
          // setTimeout(() => {
          //   if (this.headerService.searchConfiguration.experienceConfig.searchBarPosition == 'top') {
          //     let customTag = document.getElementsByClassName('faqs-wrp-content')[0] as HTMLBaseElement;
          //     customTag.click();
          //     let custom = document.getElementsByClassName('custom-header-nav-link-item')[1] as HTMLBaseElement;
          //     custom.click();
          //     let seeAll = document.getElementsByClassName('show-all-results')[0] as HTMLBaseElement;
          //     seeAll.click()
          //   }
          // }, 3000)
          //document.getElementById('viewTypeCustomize').click(); //viewTypeCustomize
        }, 3000);
      }
    }
  }
  resetSelected() {
    this.customizeList.forEach((element, index) => {
      element['check'] = false;
    });
    this.collectedRecord = [];
    this.resultSelected = false;
    this.disableDiv = false;
    this.getcustomizeList(10, 0);
  }
  selectAll() {
    //this.collectedRecord = [];
    const selected = false;
    if (this.collectedRecord.length == this.customizeList.length) {
      this.resetSelected();
    } else if (
      this.collectedRecord.length >= 0 &&
      this.collectedRecord.length < this.customizeList.length
    ) {
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
    if (event.target.checked) {
      this.collectedRecord.push(record);
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
    // console.log(this.collectedRecord)
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
      queryPipelineId: this.queryPipelineId,
      rankingAndPinningId: record._id,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };

    this.service.invoke('get.customisationLogs', quaryparms).subscribe(
      (res) => {
        //this.customizeList = res;
        this.lastModifiedOn = res.lMod;
        this.actionLogData = JSON.parse(JSON.stringify(res.customizations));
        this.customizedActionLogData = [];
        this.actionLogData.forEach((data) => {
          const actLog = new ActionLog();
          actLog.selected = false;
          actLog.drop = false;
          actLog.contentType = data.target.contentType;
          actLog.contentId = data.target.contentId;
          if (data.target.contentType == 'web') {
            actLog.icon = 'assets/icons/resultranking/copy.svg';
            actLog.title =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.page_title
                : '';
            actLog.desc =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.page_preview
                : '';
          }
          if (data.target.contentType == 'faq') {
            actLog.icon = 'assets/icons/resultranking/faq.svg';
            actLog.title =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.faq_question
                : '';
            actLog.desc =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source &&
              data.target.contentInfo._source.faq_answer[0].text
                ? data.target.contentInfo._source.faq_answer[0].text
                : '';
          }
          if (data.target.contentType == 'task') {
            actLog.icon = 'assets/icons/resultranking/task.svg';
            actLog.title =
              data.target && data.target.contentInfo
                ? data.target.contentInfo.lname
                : '';
            actLog.desc =
              data.target && data.target.contentInfo
                ? data.target.contentInfo.shortDesc
                : '';
          }
          if (data.target.contentType == 'file') {
            actLog.icon = 'assets/icons/resultranking/file-icon.svg';
            actLog.title =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.file_title
                : '';
            actLog.desc =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.file_preview
                : '';
          }
          if (data.target.contentType == 'data') {
            actLog.icon = 'assets/icons/resultranking/data-icon.svg';
            if (
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
            ) {
              actLog.title =
                data.target.contentInfo._source[this.strucDataHeading];
              actLog.desc = data.target.contentInfo._source[this.strucDataDec];
            }
          }
          // Connectors Key Words
          if (data.target.contentType == 'serviceNow') {
            actLog.icon = 'assets/icons/resultranking/data-icon.svg';
            actLog.title =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.serviceNow_short_description
                : '';
            actLog.desc =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.serviceNow_text
                : '';
          }
          if (data.target.contentType == 'confluenceCloud') {
            actLog.icon = 'assets/icons/resultranking/data-icon.svg';
            actLog.title =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.confluenceCloud_name
                : '';
            actLog.desc =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.confluenceCloud_content
                : '';
          }
          if (data.target.contentType == 'confluenceServer') {
            actLog.icon = 'assets/icons/resultranking/data-icon.svg';
            actLog.title =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.confluenceServer_name
                : '';
            actLog.desc =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.confluenceServer_content
                : '';
          }
          if (data.target.contentType == 'zendesk') {
            actLog.icon = 'assets/icons/resultranking/data-icon.svg';
            actLog.title =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.zendesk_name
                : '';
            actLog.desc =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.zendesk_content
                : '';
          }
          if (data.target.contentType == 'googleDrive') {
            actLog.icon = 'assets/icons/resultranking/data-icon.svg';
            actLog.title =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.name
                : '';
            actLog.desc =
              data.target &&
              data.target.contentInfo &&
              data.target.contentInfo._source
                ? data.target.contentInfo._source.content
                : '';
          }
          // Connectors Key Words
          actLog.action = data.customization.action;
          if (data.customization.action == 'pinned') {
            actLog.actionIcon = 'assets/icons/resultranking/pined.svg';
            //actLog.actionDesc
          }
          if (data.customization.action == 'hidden') {
            actLog.actionIcon = 'assets/icons/resultranking/Unsee.svg';
            //actLog.actionDesc
          }
          if (data.customization.action == 'lowered') {
            actLog.actionIcon = 'assets/icons/resultranking/MoveUp.svg';
            //actLog.actionDesc
          }
          if (data.customization.action == 'boosted') {
            actLog.actionIcon = 'assets/icons/resultranking/MoveUp.svg';
            //actLog.actionDesc
          }
          actLog.value = data.customization.value;
          actLog.addedResult = data.target.addedResult;
          actLog.lMod = moment(data.customization.lMod).fromNow();
          if (data.logs) {
            actLog.createdOn = moment(data.createdOn).fromNow();
          }
          this.customizedActionLogData.push(actLog);
        });
        console.log(this.customizedActionLogData);
        this.timeLog(record);
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed', 'error');
        }
      }
    );
  }
  removeRecord(actLog) {
    const searchIndex = this.serachIndexId;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      queryPipelineId: this.queryPipelineId,
      rankingAndPinningId: this.selectedRecord._id,
      contentId: actLog?.contentId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    this.remove_Record(quaryparms);
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
        buttons: [
          { key: 'yes', label: 'Remove', type: 'danger', class: 'deleteBtn' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        this.service.invoke('delete.CustomizatioLog', quaryparms).subscribe(
          (res) => {
            dialogRef.close();
            this.notificationService.notify('Removed Successfully', 'success');
            this.getcustomizeList(10, 0);
            this.actionLogData = [];
            this.customizeList = [];
            //console.log(res);
          },
          (errRes) => {
            if (
              errRes &&
              errRes.error.errors &&
              errRes.error.errors.length &&
              errRes.error.errors[0] &&
              errRes.error.errors[0].msg
            ) {
              this.notificationService.notify(
                errRes.error.errors[0].msg,
                'error'
              );
            } else {
              this.notificationService.notify('Failed remove record', 'error');
            }
          }
        );
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
  }

  applyFilter(value) {
    const list = [...this.customizeListBack];
    const listPush = [];
    if (value) {
      list.forEach((element) => {
        if (element.searchQuery.includes(value)) {
          listPush.push(element);
        }
      });
      this.customizeList = [...listPush];
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
      rankingAndPinningId: record._id,
    };
    // this.time =moment("2020-10-28T05:27:49.499Z").fromNow()
    // const displayTime=document.getElementById('displayTime')
    // displayTime.append('time')
    this.service.invoke('get.rankingActionLog', quaryparms).subscribe(
      (res) => {
        this.customizeLog = res;
        for (let i = 0; i < this.customizeLog.length; i++) {
          const time = this.customizeLog[i].createdOn;
          this.customizeLog[i].createdOn = moment(time).fromNow();
          this.customizeLog[i]['selected'] = false;
          if (this.customizeLog[i].target.contentType == 'data') {
            if (
              this.customizeLog[i].target.contentInfo &&
              this.customizeLog[i].target.contentInfo._source
            ) {
              this.customizeLog[i].target.contentInfo._source[
                'strucDataHeadingDis'
              ] =
                this.customizeLog[i].target.contentInfo._source[
                  this.strucDataHeading
                ];
              this.customizeLog[i].target.contentInfo._source[
                'strucDataDecDis'
              ] =
                this.customizeLog[i].target.contentInfo._source[
                  this.strucDataDec
                ];
            }
          }
        }
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed', 'error');
        }
      }
    );
  }

  restore(record) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      rankingAndPinningId: record._id,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to reset?',
        body: 'All the customizations done for this query will be removed.',
        buttons: [
          { key: 'yes', label: 'Reset', type: 'danger', class: 'deleteBtn' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        this.service.invoke('put.restoreQueryCustomize', quaryparms).subscribe(
          (res) => {
            //this.customizeList = res;
            this.selectedRecord = {};
            this.getcustomizeList(10, 0);
            this.actionLogData = [];
            this.customizeList = [];
            this.notificationService.notify('Reset Successful', 'success');
            dialogRef.close();
          },
          (errRes) => {
            if (
              errRes &&
              errRes.error.errors &&
              errRes.error.errors.length &&
              errRes.error.errors[0] &&
              errRes.error.errors[0].msg
            ) {
              this.notificationService.notify(
                errRes.error.errors[0].msg,
                'error'
              );
            } else {
              this.notificationService.notify('Failed', 'error');
            }
          }
        );
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
  }
  getcustomizeList(limit?, skip?) {
    limit ? limit : 10;
    skip ? skip : 0;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      limit: limit,
      skip: skip,
    };
    this.service.invoke('get.queryCustomizeList', quaryparms).subscribe(
      (res) => {
        this.loadingContent = false;
        this.customizeList = res.data;
        if (res.data.length > 0) {
          this.nextPage = true;
          this.loadingContent = false;
          this.headerService.fromResultRank(false);
        } else {
          this.nextPage = false;
          this.loadingContent = false;
          this.headerService.fromResultRank(true);
        }
        this.customizeListBack = [...res.data];
        this.totalRecord = res.total || res.data.length;
        if (this.selectedRecord._id) {
          this.customizeList.forEach((element, index) => {
            if (this.selectedRecord._id == element._id) {
              element['check'] = false;
              this.clickCustomizeRecord(element);
            }
          });
        } else {
          this.customizeList.forEach((element, index) => {
            element['check'] = false;
            if (index == 0) {
              this.clickCustomizeRecord(element);
            }
          });
        }
        if (!this.customizeList.length) {
          this.selectedRecord = {};
          this.customizeLog = [];
          this.actionLogData = [];
        }
        if (res.data.length > 0) {
          this.loadingContent = false;
          this.loadingContent1 = true;
        } else {
          this.loadingContent1 = true;
          // if(!this.inlineManual.checkVisibility('RESULT_RANKING')){
          //   this.inlineManual.openHelp('RESULT_RANKING')
          //   this.inlineManual.visited('RESULT_RANKING')
          // }
        }
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  toggle(icontoggle, selected) {
    const previousIndex = this.iconIndex;
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
  focusoutSearch() {
    if (this.activeClose) {
      this.searchSources = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    $('#inputSearch').focus();
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
      $('#inputSearch').focus();
    }, 500);
  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : false;
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}

class ActionLog {
  selected = false;
  drop = false;
  contentType = '';
  icon = '';
  title = '';
  desc = '';
  action = '';
  actionIcon = '';
  actionDesc = '';
  value = '';
  addedResult = '';
  lMod = '';
  createdOn = '';
  contentId = '';
}
