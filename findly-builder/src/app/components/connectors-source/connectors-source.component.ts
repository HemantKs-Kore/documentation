import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { environment } from '@kore.environment';
import { DomSanitizer } from '@angular/platform-browser';
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
      description1: "Please edit configuration",
      type: "confluenceServer",
      image: "assets/icons/connectors/confluence.png",
      url: "https://admin.atlassian.com/",
      doc_url: "https://developer.atlassian.com/",
      tag: "Wiki, Atlassian, Intranet"
    },
    {
      connector_name: "Confluence (Cloud)",
      description: "Please complete configuration",
      description1: "Please edit configuration",
      type: "confluenceCloud",
      image: "assets/icons/connectors/confluence.png",
      url: "https://admin.atlassian.com/",
      doc_url: "https://developer.atlassian.com/",
      tag: "Wiki, Atlassian, Intranet"
    },
    {
      connector_name: "Service Now",
      description: "Please complete configuration",
      description1: "Please edit configuration",
      type: "serviceNow",
      image: "assets/icons/connectors/servicenow.png",
      url: "https://www.servicenow.com/",
      doc_url: "https://developer.servicenow.com/dev.do",
      tag: "The world works with ServiceNow"
    }
  ];
  componentType = 'Connectors';
  selectedApp: any;
  selectedContent: string = 'list';
  selectAddContent: string = 'instructions';
  selectedConnector: any = {};
  isEditable: boolean = false;
  searchIndexId: string;
  connectorsData: any = [];
  availableConnectorsData: any = [];
  configurationObj: any = { name: '', clientId: '', clientSecret: '', hostUrl: '', hostDomainName: '', username: '', password: '' };
  checkConfigButton: Boolean = true;
  connectorId: string = '';
  deleteModelRef: any;
  showProtecedText: Object = { isClientShow: false, isSecretShow: false, isPassword: false };
  isShowButtons: boolean = false;
  sessionData: any = {};
  addConnectorSteps: any = [{ name: 'instructions', isCompleted: true, display: 'Introduction' }, { name: 'configurtion', isCompleted: false, display: 'Configuration & Authentication' }];
  @ViewChild('deleteModel') deleteModel: KRModalComponent;
  constructor(private notificationService: NotificationService, private service: ServiceInvokerService, private workflowService: WorkflowService, public dialog: MatDialog, private location: Location, private activeRoute: ActivatedRoute, private auth: AuthService, private localStoreService: LocalStoreService, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp?.searchIndexes[0]._id;
    this.getConnectors();
    if (sessionStorage.getItem('connector') !== null) {
      const session_connector_data = sessionStorage.getItem('connector');
      this.sessionData = JSON.parse(session_connector_data);
      if (this.sessionData?.error === 'access_denied') {
        this.notificationService.notify(this.sessionData?.error_description, 'error');
        sessionStorage.clear();
      }
      else {
        this.callbackURL();
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
    }
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
  changeEditTabs() {
    this.isShowButtons = !this.isShowButtons;
    this.showProtecedText = { isClientShow: false, isSecretShow: false, isPassword: false };
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
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get Connectors');
    });
  }
  //get connectors by Id
  getConnectorData() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId
    };
    this.service.invoke('get.connectorById', quaryparms).subscribe(res => {
      console.log("res", res);
      this.connectorId = res?._id;
      this.configurationObj.name = res?.name;
      this.configurationObj.hostUrl = res?.configuration?.hostUrl;
      this.configurationObj.hostDomainName = res?.configuration?.hostDomainName;
      this.configurationObj.clientId = res?.authDetails?.clientId;
      this.configurationObj.clientSecret = res?.authDetails?.clientSecret;
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  //change page like list, add ,edit
  changeContent(page, data) {
    this.isShowButtons = false;
    this.showProtecedText = { isClientShow: false, isSecretShow: false, isPassword: false };
    this.selectedConnector = data;
    this.selectedContent = page;
    if (page === 'edit') {
      this.isEditable = true;
      this.connectorId = data?._id;
      this.getConnectorData();
    }
  }
  //back to page in add page
  backToPage(type) {
    if (type === 'back') {
      this.navigatePage();
    }
    else if (type === 'cancel') {
      this.selectedContent = 'list';
      this.selectAddContent = 'instructions';
      this.isShowButtons = false;
      this.selectedConnector = {};
      this.isEditable = false;
      this.connectorId = '';
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
        if (this.isEditable) {
          this.updateConnector();
        } else {
          this.createConnector();
        }
      }
    }
  }
  //navaigate to next page based on selectAddContent
  navigatePage() {
    this.selectAddContent = this.selectAddContent === 'instructions' ? 'configurtion' : 'instructions';
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
        this.notificationService.notify('Connector Created Successfully', 'success');
        this.authorizeConnector(this.selectedConnector);
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get Connectors');
    });
  }
  //authorize created connector
  authorizeConnector(data?) {
    // const quaryparms: any = {
    //   sidx: this.searchIndexId,
    //   fcon: this.connectorId
    // };
    // this.service.invoke('post.authorizeConnector', quaryparms).subscribe(res => {
    //   console.log("res", res.headers);
    //   if (res) {
    //     this.selectedContent = 'list';
    //     this.notificationService.notify('Connector Authorized Successfully', 'success');
    //     this.getConnectors();
    //   }
    // }, errRes => {
    //   this.errorToaster(errRes, 'Failed to get Connectors');
    // });
    const authToken = this.auth.getAccessToken();
    const _bearer = 'bearer ' + authToken;
    const account_id = this.localStoreService?.getAuthInfo()?.currentAccount?.accountId;
    const connector_id = data?._id ? data?._id : this.connectorId;
    const url = `${environment.API_SERVER_URL}/searchassistapi/findly/${this.searchIndexId}/connectors/${connector_id}/authorize`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: _bearer,
        AccountId: account_id
      },
    }).then(res => {
      if (data?.type === 'confluenceCloud') {
        // fetch(res.url, {
        //   method: 'GET',
        //   referrerPolicy: "no-referrer-when-downgrade",
        //   redirect: "manual"
        // }).then(dat => {
        //   console.log("res", dat);
        // })
        //window.open(res.url, '_blank');
        //window.location.replace(res.url)
      }
      else {
        this.selectedContent = 'list';
        this.notificationService.notify('Connector Authorized Successfully', 'success');
        this.ingestConnector();
      }
    })
      .catch(error => {
        console.log("error", error);
      })
  }
  //update connector 
  openConnectorDialog(data, event) {
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
          if (data?.type === 'confluenceCloud' && data?.isActive) {
            this.authorizeConnector(data);
          }
          else {
            this.updateConnector(data, event, dialogRef);
          }
        } else if (result === 'no') {
          dialogRef.close();
          this.getConnectors();
        }
      })
  }
  updateConnector(data?, checked?, dialog?) {
    const Obj = data ? data : this.selectedConnector;
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: Obj?._id
    };
    let payload: any = {
      "name": Obj?.name,
      "type": Obj?.type,
      "authDetails": {
        "clientId": Obj?.authDetails?.clientId,
        "clientSecret": Obj?.authDetails?.clientSecret
      },
      "configuration": {
        "hostUrl": this.configurationObj.hostUrl,
        "hostDomainName": this.configurationObj.hostDomainName
      },
      "isActive": data ? checked.target.checked : Obj.isActive
    };
    if (this.selectedConnector.type === 'serviceNow') {
      payload.authDetails.username = this.configurationObj.username;
      payload.authDetails.password = this.configurationObj.password;
    }
    this.service.invoke('put.connector', quaryparms, payload).subscribe(res => {
      if (res) {
        this.authorizeConnector(this.selectedConnector);
        this.notificationService.notify('Connector Updated Successfully', 'success');
        if (dialog) dialog?.close();
      }
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  //callback url after redirect in confluence cloud
  callbackURL() {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      connectorId: this.sessionData?.connectorId,
      code: this.sessionData?.code,
      state: this.sessionData?.state
    };
    this.service.invoke('get.callbackConnector', quaryparms).subscribe(res => {
      sessionStorage.clear();
      this.ingestConnector();
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
        this.getConnectors();
      }
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
  // queue-content API
  ingestConnector() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId
    };
    this.service.invoke('post.ingestConnector', quaryparms).subscribe(res => {
      if (res) {
        this.getConnectors();
      }
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
}
