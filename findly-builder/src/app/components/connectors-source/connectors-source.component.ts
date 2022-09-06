import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { UpgradePlanComponent } from 'src/app/helpers/components/upgrade-plan/upgrade-plan.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { OnboardingComponentComponent } from 'src/app/components/onboarding-component/onboarding-component.component';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-connectors-source',
  templateUrl: './connectors-source.component.html',
  styleUrls: ['./connectors-source.component.scss']
})
export class ConnectorsSourceComponent implements OnInit {
  Connectors = [
    {
      connector_name: "Confluence (Server)",
      description: "Please complete configuration",
      type: "confluenceServer",
      image: "assets/icons/connectors/confluence.png",
      url: "https://admin.atlassian.com/",
      doc_url: "https://developer.atlassian.com/",
      tag: "Wiki, Atlassian, Intranet"
    },
    {
      connector_name: "Confluence (Cloud)",
      description: "Please complete configuration",
      type: "confluenceCloud",
      image: "assets/icons/connectors/confluence.png",
      url: "https://admin.atlassian.com/",
      doc_url: "https://developer.atlassian.com/",
      tag: "Wiki, Atlassian, Intranet"
    },
    {
      connector_name: "Service Now",
      description: "Please complete configuration",
      type: "serviceNow",
      image: "assets/icons/connectors/servicenow.png",
      url: "https://www.servicenow.com/",
      doc_url: "https://developer.servicenow.com/dev.do",
      tag: "The world works with ServiceNow"
    }
  ];
  componentType = 'Connectors';
  selectedContent: string = 'list';
  selectAddContent: string = 'instructions';
  selectedTab: string = 'overview';
  searchContent: string = '';
  connectorId: string = '';
  searchIndexId: string;
  selectedApp: any;
  deleteModelRef: any;
  selectedConnector: any = {};
  sessionData: any = {};
  connectorsData: any = [];
  availableConnectorsData: any = [];
  configurationObj: any = { name: '', clientId: '', clientSecret: '', hostUrl: '', hostDomainName: '', username: '', password: '' };
  overViewData: any = { overview: [], coneten: [],jobs:[] };
  syncCount = { count: [], hours: 0, minutes: 0, days: 0 };
  showProtecedText: Object = { isClientShow: false, isSecretShow: false, isPassword: false };
  isEditable: boolean = false;
  checkConfigButton: Boolean = true;
  isPopupDelete: boolean = true;
  isAuthorizeStatus: boolean = false;
  isSyncLoading: boolean = true;
  searchField: string = '';
  isShowSearch: boolean = false;
  isloadingBtn: boolean = false;
  pageLoading: boolean = false;
  total_records: number;
  onboardingOpened: boolean = false;
  currentRouteData: any = "";
  addConnectorSteps: any = [{ name: 'instructions', isCompleted: true, display: 'Introduction' }, { name: 'configurtion', isCompleted: false, display: 'Configuration & Authentication' }];
  connectorTabs: any = [{ name: 'Overview', type: 'overview' }, { name: 'Content', type: 'content' }, { name: 'Connection Settings', type: 'connectionSettings' }, { name: 'Configurations', type: 'configurations' },{name:'Jobs',type:'jobs'}];
  @ViewChild('plans') plans: UpgradePlanComponent;
  @ViewChild('deleteModel') deleteModel: KRModalComponent;
  @ViewChild(OnboardingComponentComponent, { static: true }) onBoardingComponent: OnboardingComponentComponent;
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  constructor(private notificationService: NotificationService, private service: ServiceInvokerService, private workflowService: WorkflowService, public dialog: MatDialog, private appSelectionService: AppSelectionService,private router: Router) { }

  async ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp?.searchIndexes[0]._id;
    this.getConnectors();
    if (sessionStorage.getItem('connector') !== null) {
      const session_connector_data = sessionStorage.getItem('connector');
      this.sessionData = JSON.parse(session_connector_data);
      if (this.sessionData?.isRedirect) {
        this.isPopupDelete = false;
        this.isAuthorizeStatus = true;
        this.openDeleteModel('open');
        sessionStorage.clear();
      }
    }
  }
  //open delete model popup
  openDeleteModel(type) {
    if (type === 'open') {
      this.deleteModelRef = this.deleteModel.open();
    }
    else if (type === 'close') {
      this.deleteModelRef.close();
      this.isAuthorizeStatus = false;
      this.isPopupDelete = true;
      this.getConnectors();
    }
  }
  //upgrade plan
  upgrade(){
    this.plans?.openSelectedPopup('choose_plan');
  }
  //common for toast messages
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
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
    this.showProtecedText = { isClientShow: false, isSecretShow: false, isPassword: false };
    this.searchContent='';
  }
  //get connector list
  getConnectors() {
    this.availableConnectorsData = [];
    this.connectorsData = [];
    const quaryparms: any = {
      sidx: this.searchIndexId
    };
    this.service.invoke('get.connectors', quaryparms).subscribe(res => {
      const result = res?.connectors;
      if (result?.length) {
        this.Connectors.forEach(item => {
          result.forEach(item1 => {
            if (item.type === item1.type) {
              this.connectorsData.push({ ...item, ...item1 });
            }
            else {

            }
          })
        })        
      }
      if (this.connectorsData.length) {
        for (let item of this.Connectors) {
          const isPush = this.connectorsData?.some(available => available.type === item.type);
          if (!isPush)
            this.availableConnectorsData.push(item);
        }
      }
      else {
        this.availableConnectorsData = this.Connectors;
      }
      this.pageLoading = true;
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get Connectors');
    });
  }
  //goto result template page
  navigateToResultTemplate() {
    this.appSelectionService.routeChanged.next({ name: 'pathchanged', path: '/resultTemplate' });
  }
  //remove spaces in url
  removeSpaces(url){
   const contentURL = url.trim();
   window.open(contentURL);
  }
  //get connectors by Id
  getConnectorData() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId
    };
    this.service.invoke('get.connectorById', quaryparms).subscribe(res => {
      this.connectorId = res?._id;
      this.overViewData.overview = res?.overview;
      this.configurationObj.name = res?.name;
      this.configurationObj.hostUrl = res?.configuration?.hostUrl;
      this.configurationObj.hostDomainName = res?.configuration?.hostDomainName;
      this.configurationObj.clientId = res?.authDetails?.clientId;
      this.configurationObj.clientSecret = res?.authDetails?.clientSecret;
      this.configurationObj.isActive = res?.isActive;
      this.configurationObj.username = res?.authDetails?.username;
      this.configurationObj.password = res?.authDetails?.password;
      this.getConentData();      
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  //get content data api
  getConentData(offset?) {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      connectorId: this.connectorId,
      offset: offset || 0,
      limit: 10
    };
    this.service.invoke('get.contentData', quaryparms).subscribe(res => {
      this.overViewData.content = res?.content;
      this.total_records = res?.count;
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  //disable connector
  disableConnector(data, dialogRef) {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: data?._id
    };
    this.service.invoke('post.disableConnector', quaryparms).subscribe(res => {
      if (res) {
        dialogRef.close();
        this.getConnectors();
        this.notificationService.notify('Connector Disabled Successfully', 'success');
      }
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  //change page like list, add ,edit
  changeContent(page, data) {
    this.showProtecedText = { isClientShow: false, isSecretShow: false, isPassword: false };
    this.selectedConnector = data;
    this.selectedContent = page;
    if (page === 'edit') {
      this.isEditable = true;
      this.connectorId = data?._id;
      this.getConnectorData();
      this.getSyncCount();
      this.appSelectionService.connectorSyncJobStatus(this.searchIndexId,this.connectorId).then((res:any)=>{
        this.overViewData.jobs = res;
        if(res&&res[0]?.status!=='INPROGRESS'){
          this.isSyncLoading = false;
        }
        else if(res&&res[0]?.status==='INPROGRESS'){
          this.checkJobStatus();
          this.isSyncLoading = true;
        }
      })
    }
  }
  //content pagination 
  paginate(event) {
    this.getConentData(event?.skip);
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
    }
    else if (type === 'cancel') {
      this.selectedTab = 'overview'
      this.selectedContent = 'list';
      this.selectAddContent = 'instructions';
      this.selectedConnector = {};
      this.isEditable = false;
      this.isloadingBtn = false;
      this.connectorId = '';
      this.isAuthorizeStatus = false;
      this.isPopupDelete = true;
      this.syncCount = { count: [], hours: 0, minutes: 0, days: 0 };
      this.configurationObj = { name: '', clientId: '', clientSecret: '', hostUrl: '', hostDomainName: '', username: '', password: '' };
      this.addConnectorSteps = this.addConnectorSteps.map((item, index) => {
        if (index > 0) {
          return { ...item, isCompleted: false };
        }
        else {
          return item
        }
      })
    }
    else if (type === 'submit') {
      this.addConnectorSteps = this.addConnectorSteps.map(item => {
        return { ...item, isCompleted: true };
      })
      if (this.selectAddContent === 'instructions') {
        this.navigatePage();
      }
      else if (this.selectAddContent === 'configurtion') {
        if (this.fieldsValidation()) {
          if (this.isEditable || this.connectorId !== '') {
            this.updateConnector();
          } else {
            this.createConnector();
          }
        }
      }
    }
  }
  //navaigate to next page based on selectAddContent
  navigatePage() {
    this.selectAddContent = this.selectAddContent === 'instructions' ? 'configurtion' : 'instructions';
  }
  //create connector validation
  fieldsValidation() {
    if (this.selectedConnector.type === 'confluenceServer') {
      if (this.configurationObj.hostDomainName.length > 0) {
        return true;
      }
      else {
        this.notificationService.notify('Domain name field is required', 'error');
      }
    }
    else {
      return true;
    }
  }
  //save connectors create api
  createConnector() {
    const quaryparms: any = {
      sidx: this.searchIndexId
    };
    let payload: any = {
      "name": this.configurationObj.name,
      "type": this.selectedConnector?.type,
      "authDetails": {
        "clientId": this.configurationObj.clientId,
        "clientSecret": this.configurationObj.clientSecret
      },
      "configuration": {
        "hostUrl": this.configurationObj.hostUrl,
        "hostDomainName": this.configurationObj.hostDomainName
      }
    };
    if (this.selectedConnector.type === 'serviceNow') {
      payload.authDetails.username = this.configurationObj.username;
      payload.authDetails.password = this.configurationObj.password;
    }
    this.service.invoke('post.connector', quaryparms, payload).subscribe(res => {
      if (res) {
        this.connectorId = res?._id;
        this.authorizeConnector(this.selectedConnector);
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get Connectors');
    });
  }
  //authorize created connector
  authorizeConnector(data?, dialogRef?) {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId
    };
    let payload: any = {};
    if (data?.type === 'confluenceCloud') {
      payload.url = window.location.protocol + '//' + window.location.host + '/home?isRedirect=true'
    }
    this.service.invoke('post.authorizeConnector', quaryparms, payload).subscribe(res => {
      if (res) {
        this.isloadingBtn = false;
        if (data?.type === 'confluenceCloud') {
          window.open(res.url, '_self');
        }
        else {
          this.appSelectionService.updateTourConfig('addData');
          if (dialogRef) {
            dialogRef.close();
            this.getConnectors();
          }
          else {
            this.isPopupDelete = false;
            this.isAuthorizeStatus = true;
            this.openDeleteModel('open');
          }
        }
      }
    }, errRes => {
      this.isPopupDelete = false;
      this.isAuthorizeStatus = false;
      this.isloadingBtn = false;
      if (dialogRef) dialogRef.close();
      // this.errorToaster(errRes, 'error');
      if (document.getElementsByClassName("modal").length === 0) this.openDeleteModel('open');
    });
  }
  //call if authorize api was success
  goBacktoListPage() {
    this.openDeleteModel('close');
    this.backToPage('cancel');
    if (this.selectedContent !== 'edit') this.selectedContent = 'list';
  }
  //update connector 
  openConnectorDialog(data) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: `${data?.isActive ? 'Enable' : 'Disable'} the connected source?`,
        body: `This can be ${data?.isActive ? 'enabled' : 'disabled'} any point of time, configuration will remain intact.`,
        buttons: [{ key: 'yes', label: 'Proceed', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        this.connectorId = data?._id;
        if (result === 'yes') {
          if (data?.isActive) {
            this.selectedConnector = data;
            this.authorizeConnector(data, dialogRef);
          }
          else {
            this.disableConnector(data, dialogRef);
          }
        } else if (result === 'no') {
          dialogRef.close();
          this.getConnectors();
        }
      })
  }
  //update connector method
  updateConnector(data?, checked?, dialog?) {
    this.isloadingBtn = true;
    const Obj = data ? data : this.configurationObj;
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId
    };
    let payload: any = {
      "name": Obj?.name,
      "authDetails": {
        "clientId": Obj?.clientId,
        "clientSecret": Obj?.clientSecret
      },
      "configuration": {
        "hostUrl": Obj?.hostUrl,
        "hostDomainName": Obj?.hostDomainName
      }
    };
    if (this.selectedConnector.type === 'serviceNow') {
      payload.authDetails.username = this.configurationObj.username;
      payload.authDetails.password = this.configurationObj.password;
    }
    this.service.invoke('put.connector', quaryparms, payload).subscribe(res => {
      if (res) {
        this.authorizeConnector(this.selectedConnector);
        if (dialog) dialog?.close();
      }
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  //update sync frequency method
  updateSyncFrequency() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId
    };
    const payload = {
      "name": this.configurationObj.name,
      "ingestSchedule": {
        "humanInterval": {
          "hours": this.syncCount.hours,
          "days": this.syncCount.days,
          "minutes": this.syncCount.minutes
        }
      }
    }
    this.service.invoke('put.connector', quaryparms, payload).subscribe(res => {
      if (res) {
        this.getConnectors();
        this.notificationService.notify('Connector Updated Successfully', 'success');
      }
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  //delete connector
  deleteConnector() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.selectedConnector._id
    };
    this.service.invoke('delete.connector', quaryparms).subscribe(res => {
      if (res) {
        this.openDeleteModel('close');
        this.notificationService.notify('Connector Deleted Successfully', 'success');
        this.selectedContent = 'list';
        this.backToPage('cancel');
      }
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  // queue-content API
 ingestConnector(isShow?) {
    this.isSyncLoading = true;
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId
    };
    this.service.invoke('post.ingestConnector', quaryparms).subscribe(res => {
      this.checkJobStatus();
      if (isShow) this.notificationService.notify('Connector Synchronized Successfully', 'success');
    }, errRes => {
      this.isSyncLoading = false;
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  //call jobs api wrt status
  checkJobStatus(){
    let jobInterval = setInterval(()=>{
      this.appSelectionService.connectorSyncJobStatus(this.searchIndexId,this.connectorId).then((res:any)=>{
        this.overViewData.jobs = res;
        if(res&&res[0]?.status!=='INPROGRESS'){
          clearInterval(jobInterval);
          this.isSyncLoading = false;
          this.getConnectorData();
        }
      })
    },3000)
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }

}
