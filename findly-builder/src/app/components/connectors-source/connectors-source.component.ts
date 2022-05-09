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
    }
  ];
  selectedApp: any;
  selectedContent: string = 'list';
  selectAddContent: string = 'instructions';
  selectedConnector: any = {};
  searchIndexId: string;
  connectorsData: any = [];
  availableConnectorsData: any = [];
  configurationObj: any = { name: '', clientId: '', clientSecret: '', hostUrl: '', hostDomainName: '' };
  checkConfigButton: Boolean = true;
  connectorId: string = '';
  deleteModelRef: any;
  showProtecedText: Object = { isClientShow: false, isSecretShow: false };
  isShowButtons: boolean = false;
  sessionData: any = {};
  addConnectorSteps: any = [{ name: 'instructions', isCompleted: false }, { name: 'configurtion', isCompleted: false }, { name: 'authentication', isCompleted: false }];
  Instructions = [
    {
      heading: "Quick setup, then all of your documents will be searchable.",
      type: "Confluence",
      icon: 'assets/icons/connectors/confluence.png',
      description: "documentation content",
      sampleexample: [{
        heading: "How to add Google Drive", description: "documentation content", clientidheading: "Generate Client ID",
        clientidexample: "Ex: RB69B5VG", secretidheading: "Generate Secret ID", secretidexample: "Ex: 12345", icon: 'assets/icons/connectors/confluence.png',
        iconheading: "Connect sources", iconexamples: "Ex: Files, Audio, Video, Images..."
      }],
      steps: [{ stepnumber: "Step 1", steptitle: "Configure an OAuth application", linktext: "Documentation", url: "", linkiconpresent: true, stepdescription: "Setup a secure OAuth application through the content source that you or your team will use to connect and synchronize content. You only have to do this once per content source." }
        , { stepnumber: "Step 2", steptitle: "Connect the content source", linktext: "", url: "", linkiconpresent: false, stepdescription: "Use the new OAuth application to connect any number of instances of the content source to  Search Assist." }
        , { stepnumber: "Step 3", steptitle: "Follow authentification flow", linktext: "", url: "", linkiconpresent: false, stepdescription: "Follow the Confluence authentication flow as presented in the documentation link." }
        , { stepnumber: "Step 4", steptitle: "Authentication", linktext: "", url: "", linkiconpresent: false, stepdescription: "Upon the successful authentication flow, you will be redirected to Search Assist.Google Drive content will now be captured and will be ready for search gradually as it is synced. Once successfully configured and connected, the Google Drive will synchronize automatically." }]
    }];
  @ViewChild('deleteModel') deleteModel: KRModalComponent;
  constructor(private notificationService: NotificationService, private service: ServiceInvokerService, private workflowService: WorkflowService, public dialog: MatDialog, private location: Location, private activeRoute: ActivatedRoute, private auth: AuthService, private localStoreService: LocalStoreService) { }

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
    this.showProtecedText = { isClientShow: false, isSecretShow: false };
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
  //change page like list, add ,edit
  changeContent(page, data) {
    this.selectedConnector = data;
    this.selectedContent = page;
    if (data) {
      this.configurationObj.hostUrl = data?.configuration?.hostUrl;
      this.configurationObj.hostDomainName = data?.configuration?.hostDomainName;
      this.configurationObj.clientId = data?.authDetails?.clientId;
      this.configurationObj.clientSecret = data?.authDetails?.clientSecret;
    }
  }
  //back to page in add page
  backToPage(type) {
    if (type === 'back') {
      this.selectAddContent = this.selectAddContent === 'configurtion' ? 'instructions' : this.selectAddContent === 'authentication' ? 'configurtion' : 'instructions';
    }
    else if (type === 'cancel') {
      this.selectedContent = 'list';
      this.selectAddContent = 'instructions';
      this.addConnectorSteps = this.addConnectorSteps.map(item => {
        return { ...item, isCompleted: false };
      })
    }
    else if (type === 'submit') {
      this.addConnectorSteps = this.addConnectorSteps.map(item => {
        if (item.name === this.selectAddContent) {
          return { ...item, isCompleted: true };
        }
        else {
          return item;
        }
      })
      if (this.selectAddContent === 'instructions') {
        this.navigatePage();
      }
      else if (this.selectAddContent === 'configurtion') {
        if (this.connectorId) {
          this.navigatePage();
        } else {
          this.createConnector();
        }
      }
      else if (this.selectAddContent === 'authentication') {
        this.authorizeConnector(this.selectedConnector);
      }
    }
  }
  //update configuration input's
  updateConfiguration() {
    if (this.configurationObj.clientId.length && this.configurationObj.clientSecret.length) {
      this.checkConfigButton = false;
    }
  }
  //navaigate to next page based on selectAddContent
  navigatePage() {
    this.selectAddContent = this.selectAddContent === 'instructions' ? 'configurtion' : this.selectAddContent === 'configurtion' ? 'authentication' : 'instructions';
  }
  //save connectors create api
  createConnector() {
    const quaryparms: any = {
      sidx: this.searchIndexId
    };
    const payload = {
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
    }
    this.service.invoke('post.connector', quaryparms, payload).subscribe(res => {
      if (res) {
        this.connectorId = res?._id;
        this.selectAddContent = this.selectAddContent === 'instructions' ? 'configurtion' : this.selectAddContent === 'configurtion' ? 'authentication' : 'instructions';
        this.notificationService.notify('Connector Created Successfully', 'success');
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
    const selectedAccount = this.localStoreService.getSelectedAccount();
    const account_id = selectedAccount?.accountId;
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
        window.open(res.url, '_blank');
        //window.location.replace(res.url)
      }
      else {
        this.selectedContent = 'list';
        this.notificationService.notify('Connector Authorized Successfully', 'success');
        this.getConnectors();
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
    const payload = {
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
    }
    this.service.invoke('put.connector', quaryparms, payload).subscribe(res => {
      if (res) {
        if (this.selectedConnector.type === 'confluenceCloud') {
          this.authorizeConnector(this.selectedConnector);
        }
        else {
          this.notificationService.notify('Connector Updated Successfully', 'success');
          if (dialog) dialog?.close();
          this.ingestConnector();
          this.getConnectors();
        }
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
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
}
