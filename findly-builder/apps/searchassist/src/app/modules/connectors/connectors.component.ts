import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { SliderComponentComponent } from '../../shared/slider-component/slider-component.component';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { PlanUpgradeComponent } from '../pricing/shared/plan-upgrade/plan-upgrade.component';
import { TranslationService } from '@kore.libs/shared/src';
import { ConnectorObject, ConnectorsList, ConnectorSteps, ConnectorTabs, JobStatusList } from './connectors.constants';
declare const $: any;
@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.scss'],
})
export class ConnectorsComponent implements OnInit {
  Connectors = ConnectorsList;
  connectorsObject = ConnectorObject;
  jobStatusList = JobStatusList;
  addConnectorSteps = ConnectorSteps;
  connectorTabs = ConnectorTabs;

  selectedContent = 'list';
  selectAddContent = 'instructions';
  selectedTab = 'overview';
  connectorId = '';
  searchIndexId: string;
  selectedApp: any;
  deleteModelRef: any;
  selectedConnector: any = {};
  sessionData: any = {};
  connectorsData: any = [];
  availableConnectorsData: any = [];
  configurationObj: any = this.returnEmptyConfigObject();
  overViewData: any = { overview: [], coneten: [], jobs: [] };
  syncCount = { count: [], hours: 0, minutes: 0, days: 0 };
  isEditable = false;
  checkConfigButton = true;
  isPopupDelete = true;
  isAuthorizeStatus = false;
  isSyncLoading = true;
  isSyncLoadingMouseOver = false;
  searchField = '';
  isShowSearch = false;
  isloadingBtn = false;
  pageLoading = false;
  total_records: number;
  contentInputSearch = '';

  @ViewChild('plans') plans: PlanUpgradeComponent;
  @ViewChild('deleteModel') deleteModel: KRModalComponent;
  @ViewChild(OnboardingComponent, { static: true }) onBoardingComponent: OnboardingComponent;
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;

  constructor(
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private workflowService: WorkflowService,
    public dialog: MatDialog,
    private appSelectionService: AppSelectionService,
    private translationService: TranslationService
  ) {
    this.translationService.loadModuleTranslations();
  }

  async ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp?.searchIndexes[0]._id;
    this.getConnectors();
  }

  //receive object data from connector Input Component
  updateConnectorObject(obj) {
    this.configurationObj[obj.type] = obj?.value;
  }

  //open delete model popup
  openDeleteModel(type) {
    if (type === 'open') {
      this.deleteModelRef = this.deleteModel.open();
    } else if (type === 'close') {
      this.deleteModelRef.close();
      this.isAuthorizeStatus = false;
      this.isPopupDelete = true;
      this.getConnectors();
    }
  }

  //upgrade plan
  upgrade() {
    this.plans?.openSelectedPopup('choose_plan');
  }

  //common for toast messages
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

  //change edit tabs
  changeEditTabs(type) {
    this.selectedTab = type;
  }

  //get connector list
  getConnectors() {
    this.availableConnectorsData = [];
    this.connectorsData = [];
    const quaryparms: any = {
      sidx: this.searchIndexId,
    };
    this.service.invoke('get.connectors', quaryparms).subscribe(
      (res) => {
        const result = res?.connectors;
        if (result?.length) {
          this.Connectors.forEach((item) => {
            result.forEach((item1) => {
              if (item.type === item1.type && item1?.isDeleted == false) {
                this.connectorsData.push({ ...item, ...item1 });
              }
            });
          });
        }
        if (this.connectorsData.length) {
          for (const item of this.Connectors) {
            const isPush = this.connectorsData?.some(
              (available) => available.type === item.type
            );
            if (!isPush) this.availableConnectorsData.push(item);
          }
        } else {
          this.availableConnectorsData = this.Connectors;
        }
        this.pageLoading = true;
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get Connectors');
      }
    );
  }

  //remove spaces in url
  removeSpaces(url) {
    const contentURL = url.trim();
    window.open(contentURL);
  }

  //get connectors by Id
  getConnectorData() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId,
    };
    this.service.invoke('get.connectorById', quaryparms).subscribe(
      (res) => {
        this.connectorId = res?._id;
        this.overViewData.overview = res?.overview;
        this.configurationObj.name = res?.name;
        this.configurationObj.hostUrl = res?.configuration?.hostUrl;
        this.configurationObj.hostDomainName =
          res?.configuration?.hostDomainName;
        this.configurationObj.clientId = res?.authDetails?.clientId;
        this.configurationObj.clientSecret = res?.authDetails?.clientSecret;
        this.configurationObj.isActive = res?.isActive;
        this.configurationObj.username = res?.authDetails?.username;
        this.configurationObj.password = res?.authDetails?.password;
        this.configurationObj.tenantId = res?.authDetails?.tenantId;
        this.getConentData();
      },
      (errRes) => {
        this.errorToaster(errRes, 'Connectors API Failed');
      }
    );
  }

  //on change get content data using search function
  getDynamicSearchContent(type) {
    const text = type === 'input' ? this.contentInputSearch : '';
    setTimeout(() => {
      this.getConentData(0, text);
    }, 500);
    if (type === 'clear') {
      if ($('#pageInput').length) $('#pageInput')[0].value = 1;
      this.contentInputSearch = '';
    }
  }

  //content pagination
  paginate(event) {
    if (this.contentInputSearch.length) {
      this.getConentData(event?.skip, this.contentInputSearch);
    } else {
      this.getConentData(event?.skip);
    }
  }
  //get content data api
  getConentData(offset?, text?) {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      connectorId: this.connectorId,
      offset: offset || 0,
      q: text || '',
      limit: 10,
    };
    this.service.invoke('get.contentData', quaryparms).subscribe(
      (res) => {
        this.overViewData.content = res?.content;
        this.total_records = res?.count;
      },
      (errRes) => {
        this.errorToaster(errRes, 'Connectors API Failed');
      }
    );
  }

  //disable connector
  disableConnector(data, dialogRef) {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: data?._id,
    };
    this.service.invoke('post.disableConnector', quaryparms).subscribe(
      (res) => {
        if (res) {
          dialogRef.close();
          this.getConnectors();
          this.notificationService.notify(
            'Connector Disabled Successfully',
            'success'
          );
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Connectors API Failed');
      }
    );
  }

  //change page like list, add ,edit
  changeContent(page, data) {
    this.selectedConnector = data;
    this.selectedContent = page;
    if (page === 'edit') {
      this.isEditable = true;
      this.connectorId = data?._id;
      this.getConnectorData();
      this.getSyncCount();
      this.appSelectionService
        .connectorSyncJobStatus(this.searchIndexId, this.connectorId)
        .then((res: any) => {
          this.overViewData.jobs = this.modifyJobStatusNames(res);
          if (res && res[0]?.status !== 'INPROGRESS') {
            this.isSyncLoading = false;
          } else if (res && res[0]?.status === 'INPROGRESS') {
            this.checkJobStatus();
            this.isSyncLoading = false;
          }
        });
    }
  }

  //loop sync count numbers
  getSyncCount() {
    for (let i = 0; i < 60; i++) {
      this.syncCount.count.push(i + 1);
    }
  }

  //back to page in add page
  backToPage(type) {
    if (type === 'back') {
      this.navigatePage();
    } else if (type === 'cancel') {
      this.selectedTab = 'overview';
      this.selectedContent = 'list';
      this.selectAddContent = 'instructions';
      this.selectedConnector = {};
      this.isEditable = false;
      this.isloadingBtn = false;
      this.connectorId = '';
      this.isAuthorizeStatus = false;
      this.isPopupDelete = true;
      this.syncCount = { count: [], hours: 0, minutes: 0, days: 0 };
      this.overViewData = { overview: [], coneten: [], jobs: [] };
      this.configurationObj = this.returnEmptyConfigObject();
      this.addConnectorSteps = this.addConnectorSteps.map((item, index) => {
        if (index > 0) {
          return { ...item, isCompleted: false };
        } else {
          return item;
        }
      });
    } else if (type === 'submit') {
      this.addConnectorSteps = this.addConnectorSteps.map((item) => {
        return { ...item, isCompleted: true };
      });
      if (this.selectAddContent === 'instructions') {
        this.navigatePage();
      } else if (this.selectAddContent === 'configurtion') {
        // if (this.validationForConnetor()) {
        if (this.validationConnector()) {
          if (this.isEditable || this.connectorId !== '') {
            this.updateConnector();
          } else {
            this.createConnector();
          }
        }
      }
    }
  }

  //return config obj
  returnEmptyConfigObject() {
    return {
      name: '',
      clientId: '',
      clientSecret: '',
      hostUrl: '',
      hostDomainName: '',
      username: '',
      password: '',
      tenantId: ''
    }
  }
  //navaigate to next page based on selectAddContent
  navigatePage() {
    this.selectAddContent =
      this.selectAddContent === 'instructions'
        ? 'configurtion'
        : 'instructions';
  }

  //create connector validation
  validationForConnetor() {
    if (
      this.configurationObj.name &&
      this.configurationObj.clientId &&
      this.configurationObj.clientId
    ) {
      if (
        ['confluenceServer', 'confluenceCloud'].includes(
          this.selectedConnector.type
        )
      ) {
        if (
          this.configurationObj.hostUrl &&
          this.configurationObj.hostDomainName
        ) {
          return true;
        }
      } else if (['serviceNow'].includes(this.selectedConnector.type)) {
        if (
          this.configurationObj.hostUrl &&
          this.configurationObj.name &&
          this.configurationObj.password
        ) {
          return true;
        }
      } else if (['zendesk'].includes(this.selectedConnector.type)) {
        if (this.configurationObj.hostUrl) {
          return true;
        }
      } else if (['sharepointOnline'].includes(this.selectedConnector.type)) {
        if (this.configurationObj.tenantId) {
          return true;
        }
      }
      else if (['googleDrive'].includes(this.selectedConnector.type)) {
        return true
      }
    } else {
      this.notificationService.notify('Enter the Required Fields', 'error');
      return false;
    }
  }

  //validation for connectors object
  validationConnector() {
    const array = [], configArray = [];
    for (const item of this.connectorsObject) {
      if (item?.connectors?.includes(this.selectedConnector.type)) array.push(item?.value);
    }
    for (const arr of array) {
      if (this.configurationObj[arr].length > 0) configArray.push(true);
    }
    if (array.length !== configArray.length) this.notificationService.notify('Enter the Required Fields', 'error');
    return (array.length === configArray.length) ? true : false;
  }

  //save connectors create api
  createConnector() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
    };
    const payload: any = {
      name: this.configurationObj.name,
      type: this.selectedConnector?.type,
      authDetails: {
        clientId: this.configurationObj.clientId,
        clientSecret: this.configurationObj.clientSecret,
      },
      configuration: {
        hostUrl: this.configurationObj.hostUrl,
        hostDomainName: this.configurationObj.hostDomainName,
      },
    };
    if (this.selectedConnector.type === 'serviceNow') {
      payload.authDetails.username = this.configurationObj.username;
      payload.authDetails.password = this.configurationObj.password;
    }
    if (this.selectedConnector.type === 'sharepointOnline') {
      payload.authDetails.tenantId = this.configurationObj.tenantId;
    }
    if (['zendesk', 'sharepointOnline', 'googleDrive'].includes(this.selectedConnector.type)) {
      delete payload.configuration.hostDomainName;
    }
    this.service.invoke('post.connector', quaryparms, payload).subscribe(
      (res) => {
        if (res) {
          this.connectorId = res?._id;
          this.authorizeConnector(this.selectedConnector);
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get Connectors');
      }
    );
  }

  //authorize created connector
  authorizeConnector(data?, dialogRef?) {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId,
    };
    const payload: any = {};
    if (data?.type === 'confluenceCloud') {
      payload.url =
        window.location.protocol +
        '//' +
        window.location.host +
        '/home?isRedirect=true';
    }
    this.service
      .invoke('post.authorizeConnector', quaryparms, payload)
      .subscribe(
        (res) => {
          if (res) {
            this.isloadingBtn = false;
            if (
              ['confluenceCloud', 'zendesk', 'sharepointOnline', 'googleDrive'].includes(
                data?.type
              )
            ) {
              window.open(res.url, '_self');
            } else {
              if (dialogRef) {
                dialogRef.close();
                this.getConnectors();
              } else {
                this.isPopupDelete = false;
                this.isAuthorizeStatus = true;
                if (document.getElementsByClassName('modal').length === 1)
                  this.openDeleteModel('open');
              }
            }
          }
          this.appSelectionService.updateTourConfig('addData');
        },
        (errRes) => {
          this.isPopupDelete = false;
          this.isAuthorizeStatus = false;
          this.isloadingBtn = false;
          if (dialogRef) dialogRef.close();
          if (document.getElementsByClassName('modal').length === 1)
            this.openDeleteModel('open');
        }
      );
  }

  //call if authorize api was success
  goBacktoListPage() {
    this.openDeleteModel('close');
    if (this.selectedContent === 'add') this.backToPage('cancel');
  }

  //update connector
  openConnectorDialog(data) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: `${data?.isActive ? 'Enable' : 'Disable'
          } the connected source?`,
        body: `This can be ${data?.isActive ? 'enabled' : 'disabled'
          } any point of time, configuration will remain intact.`,
        buttons: [
          { key: 'yes', label: 'Proceed', type: 'danger' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      this.connectorId = data?._id;
      if (result === 'yes') {
        if (data?.isActive) {
          this.selectedConnector = data;
          this.authorizeConnector(data, dialogRef);
        } else {
          this.disableConnector(data, dialogRef);
        }
      } else if (result === 'no') {
        dialogRef.close();
        this.getConnectors();
      }
    });
  }

  //update connector method
  updateConnector(data?, checked?, dialog?) {
    this.isloadingBtn = true;
    const Obj = data ? data : this.configurationObj;
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId,
    };
    const payload: any = {
      name: Obj?.name,
      authDetails: {
        clientId: Obj?.clientId,
        clientSecret: Obj?.clientSecret,
      },
      configuration: {
        hostUrl: Obj?.hostUrl,
        hostDomainName: Obj?.hostDomainName,
      },
    };
    if (this.selectedConnector.type === 'serviceNow') {
      payload.authDetails.username = this.configurationObj.username;
      payload.authDetails.password = this.configurationObj.password;
    }
    if (this.selectedConnector.type === 'sharepointOnline') {
      payload.authDetails.tenantId = this.configurationObj.tenantId;
    }
    if (['zendesk', 'sharepointOnline', 'googleDrive'].includes(this.selectedConnector.type)) {
      delete payload.configuration.hostDomainName
    }
    if (['zendesk', 'sharepointOnline', 'googleDrive'].includes(this.selectedConnector.type)) {
      delete payload.configuration.hostDomainName;
    }
    this.service.invoke('put.connector', quaryparms, payload).subscribe(
      (res) => {
        if (res) {
          this.authorizeConnector(this.selectedConnector);
          if (dialog) dialog?.close();
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Connectors API Failed');
      }
    );
  }

  //update sync frequency method
  updateSyncFrequency() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId,
    };
    const payload = {
      name: this.configurationObj.name,
      ingestSchedule: {
        humanInterval: {
          hours: this.syncCount.hours,
          days: this.syncCount.days,
          minutes: this.syncCount.minutes,
        },
      },
    };
    this.service.invoke('put.connector', quaryparms, payload)
      .subscribe(
        (res) => {
          if (res) {
            this.getConnectors();
            this.notificationService.notify(
              'Connector Updated Successfully',
              'success'
            );
          }
        },
        (errRes) => {
          this.errorToaster(errRes, 'Connectors API Failed');
        }
      );
  }

  //delete connector
  deleteConnector() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.selectedConnector._id,
    };
    this.service.invoke('delete.connector', quaryparms).subscribe(
      (res) => {
        if (res) {
          this.openDeleteModel('close');
          this.notificationService.notify(
            'Connector Deleted Successfully',
            'success'
          );
          this.selectedContent = 'list';
          this.backToPage('cancel');
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Connectors API Failed');
      }
    );
  }

  // queue-content API
  ingestConnector(isShow?) {
    this.isSyncLoading = true;
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId,
    };
    this.service.invoke('post.ingestConnector', quaryparms).subscribe(
      (res) => {
        this.checkJobStatus();
        if (isShow)
          this.notificationService.notify(
            'Connector Synchronized Successfully',
            'success'
          );
      },
      (errRes) => {
        this.isSyncLoading = false;
        this.errorToaster(errRes, 'Connectors API Failed');
      }
    );
  }

  //mouse over /out to call this method
  syncMouseOver(type) {
    if (this.isSyncLoading && type === 'over') {
      this.isSyncLoadingMouseOver = true;
    }
    if (type === 'out') {
      this.isSyncLoadingMouseOver = false;
    }
  }

  //stop synchronize content for connectors
  stopSynchronizeConnector() {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      connectorId: this.connectorId,
    };
    const payload = {};
    this.service.invoke('put.stopSyncConnector', quaryparms, payload)
      .subscribe(
        (res) => {
          if (res) {
            this.notificationService.notify('Synchronize Stopped Successfully', 'success');
          }
        },
        (errRes) => {
          this.errorToaster(errRes, 'Connectors API Failed');
        }
      );
  }

  //call jobs api wrt status
  checkJobStatus() {
    const jobInterval = setInterval(() => {
      if (this.connectorId) {
        this.appSelectionService
          .connectorSyncJobStatus(this.searchIndexId, this.connectorId)
          .then((res: any) => {
            this.overViewData.jobs = this.modifyJobStatusNames(res);
            if (res && res[0]?.status !== 'INPROGRESS') {
              clearInterval(jobInterval);
              this.isSyncLoading = false;
              this.getConnectorData();
            }
          });
      } else {
        clearInterval(jobInterval);
        this.isSyncLoading = false;
      }
    }, 3000);
  }

  //modify job status names
  modifyJobStatusNames(res) {
    let Data = [];
    if (res?.length > 0) {
      Data = res?.map(item => {
        const status_name = this.jobStatusList.filter(job => job.status === item?.status?.toLowerCase());
        return { ...item, status_name: status_name[0].name, color: status_name[0].color };
      });
    }
    return Data;
  }

  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}

class connectorsConfigObj {
  name: '';
  clientId: '';
  clientSecret: '';
  hostUrl: '';
  hostDomainName: '';
  username: '';
  password: '';
  tenantId: '';
}
