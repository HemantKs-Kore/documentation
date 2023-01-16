import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { interval, Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
import { startWith } from 'rxjs/operators';
import * as _ from 'underscore';

declare const $: any;
@Component({
  selector: 'app-index-configuration-settings',
  templateUrl: './index-configuration-settings.component.html',
  styleUrls: ['./index-configuration-settings.component.scss'],
})
export class IndexConfigurationSettingsComponent implements OnInit {
  addLangModalPopRef: any;
  indexPipelineId;
  queryPipelineId;
  searchLanguages: any = '';
  selectedApp;
  serachIndexId;
  seedData;
  saveLanguages = false;
  isAddLoading = false;
  configurationsSubscription: Subscription;
  supportedLanguages: any = [];
  listOfLanguages: any = [];
  listLanguages: any = [
    {
      language: 'English',
      code: 'en',
    },
  ];
  languageList: any = [];
  public pollingSubscriber: any;
  docStatusObject: any = {};
  isTrainStatusInprogress = false;
  @ViewChild('addLangModalPop') addLangModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public dialog: MatDialog,
    public dockService: DockStatusService
  ) {}

  ngOnInit(): void {
    this.getAvilableLanguages();
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline()
      ? this.workflowService.selectedQueryPipeline()._id
      : '';
    this.supportedLanguages = this.workflowService?.supportedLanguages?.values;
    this.configurationsSubscription =
      this.appSelectionService.queryConfigSelected.subscribe((res) => {
        this.indexPipelineId = this.workflowService.selectedIndexPipeline();
        this.queryPipelineId = this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '';
        this.supportedLanguages =
          this.workflowService?.supportedLanguages?.values;
      });

    this.poling();
  }
  // toaster message
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
      this.notificationService.notify('Somthing went wrong', 'error');
    }
  }
  // open pop for add and edit
  openModalPopup() {
    this.addLangModalPopRef = this.addLangModalPop.open();
    this.supportedLanguages.forEach((element) => {
      this.languageList.forEach((lang) => {
        if (element.languageCode == lang.languageCode) {
          lang.selected = true;
        }
      });
    });
  }
  // close pop for add and edit
  closeModalPopup() {
    this.addLangModalPopRef.close();
    this.saveLanguages = false;
    this.clearCheckbox();
    this.searchLanguages = '';
    setTimeout(() => {
      this.isAddLoading = false;
    }, 200);
  }
  //geting the seedData
  getAvilableLanguages() {
    let url = 'get.indexAvailableLanguages';
    this.service.invoke(url).subscribe(
      (res) => {
        this.languageList = res.languages;
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
          this.notificationService.notify(
            'Failed To Get Available Languages',
            'error'
          );
        }
      }
    );
  }
  // clearing the seedData
  clearCheckbox() {
    let arr = [...this.supportedLanguages];
    let dumyArr = [];
    arr.forEach((arrElement) => {
      dumyArr.push(arrElement.languageCode);
    });
    this.languageList.forEach((element) => {
      if (dumyArr.includes(element.languageCode)) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
  }
  //adding Language
  addLanguage(index) {
    this.languageList[index].selected = !this.languageList[index].selected;
  }
  addLang() {
    let langArr = [];
    this.languageList.forEach((element) => {
      if (element.selected) {
        langArr.push(element);
      }
    });
    this.saveLanguage('', langArr);
  }
  //add or edit Language
  saveLanguage(dialogRef?, langArr?) {
    this.isAddLoading = true;
    let queryParams = {
      streamId: this.selectedApp._id,
      indexPipelineId: this.indexPipelineId,
    };
    let payload = {
      language: {
        enable: true,
        values: langArr,
      },
    };
    let url = 'put.indexLanguages';
    this.service.invoke(url, queryParams, payload).subscribe(
      (res) => {
        this.getIndexPipeline();
        if (dialogRef && dialogRef.close) {
          dialogRef.close();
        }
        this.dockService.trigger(true);
        this.poling();
        this.closeModalPopup();
        this.notificationService.notify(
          'Language Saved Successfully',
          'success'
        );
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
          this.notificationService.notify('Failed To Add Language', 'error');
        }
        this.isAddLoading = false;
      }
    );
  }
  //get train status
  getTrainIsInprogress() {
    if ($('.train-btn-icons').find('.training-pending-icon').is(':visible')) {
      return true;
    } else false;
  }
  // get selected language count
  getSelectedCount() {
    return this.languageList.filter((e) => e.selected).length;
  }

  //selection and deselection method
  unCheck() {
    this.supportedLanguages.forEach((element) => {
      this.languageList.forEach((data) => {
        if (element.languageCode == data.languageCode) {
          data.selected = true;
        } else {
          data.selected = false;
        }
      });
    });
  }
  updateLangListFun(list) {
    let updateArr = [];
    this.supportedLanguages.forEach((element, index) => {
      if (element.languageCode != list.languageCode) {
        updateArr.push(element);
      }
    });
    this.supportedLanguages = updateArr;
    return updateArr;
  }
  //delete language
  deleteLanguagesPop(event, list) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Language',
        text: 'Are you sure you want to remove?',
        newTitle: 'Are you sure you want to remove?',
        body:
          'The ' +
          '"' +
          '<b>' +
          list.language +
          '</b>' +
          '"' +
          ' language will be removed. ' +
          '"' +
          '<b>' +
          list.language +
          '</b>' +
          '"' +
          ' content will be searched using ' +
          '"' +
          '<b>' +
          'English' +
          '</b>' +
          '"' +
          ' language analyzers.',
        buttons: [
          { key: 'yes', label: 'Delete', type: 'danger' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });

    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        this.deleteLanguage(dialogRef, list);
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
  }
  deleteLanguage(dialogRef?, list?) {
    this.unCheck();
    let updateArr = this.updateLangListFun(list);
    this.saveLanguage(dialogRef, updateArr);
  }
  clearSearch() {
    this.searchLanguages = '';
  }
  getIndexPipeline() {
    const header: any = {
      'x-timezone-offset': '-330',
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit: 100,
    };
    this.service.invoke('get.indexPipeline', quaryparms, header).subscribe(
      (res) => {
        res.forEach((element) => {
          if (element._id == this.indexPipelineId) {
            this.supportedLanguages = element.settings.language.values;
            this.workflowService.getSettings(element.settings);
          }
        });
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
  poling() {
    this.isTrainStatusInprogress = true;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    };
    this.pollingSubscriber = interval(10000)
      .pipe(startWith(0))
      .subscribe(() => {
        this.service.invoke('get.dockStatus', queryParms).subscribe(
          (res) => {
            const queuedDoc = _.find(res, (source) => {
              return (
                source?.jobType == 'TRAINING' && source?.status == 'INPROGRESS'
              );
            });
            if (queuedDoc && queuedDoc.status == 'INPROGRESS') {
              this.isTrainStatusInprogress = true;
            } else {
              this.isTrainStatusInprogress = false;
              this.pollingSubscriber.unsubscribe();
            }
          },
          (errRes) => {
            this.isTrainStatusInprogress = false;
            this.pollingSubscriber.unsubscribe();
          }
        );
      });
  }
  ngOnDestroy() {
    this.configurationsSubscription
      ? this.configurationsSubscription.unsubscribe()
      : false;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
  }
}