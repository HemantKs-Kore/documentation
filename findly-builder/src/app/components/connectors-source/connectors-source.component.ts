import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ActivatedRoute } from '@angular/router';
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
      image: "assets/icons/connectors/confluence.png"
    }
    // {
    //   connector_name: "Confluence",
    //   description: "Please complete configuration",
    //   type: "confluenceCloud",
    //   image: "assets/icons/connectors/confluence.png"
    // }
  ];
  selectedApp: any;
  selectedContent: string = 'list';
  selectAddContent: string = 'instructions';
  selectedConnector: Object = {};
  searchIndexId: string;
  connectorsData: Array<[]> = [];
  availableConnectorsData: any = [];
  configurationObj: any = { clientId: '', clientSecret: '' };
  checkConfigButton: Boolean = true;
  connectorId: string = '';
  deleteModelRef: any;
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
  constructor(private notificationService: NotificationService, private service: ServiceInvokerService, private workflowService: WorkflowService, public dialog: MatDialog, private location: Location, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp?.searchIndexes[0]._id;
    this.getConnectors();
    // this.activeRoute.params.subscribe(param => {
    //   const params = Object.keys(param).length;
    //   if (params > 0) {
    //     this.location.replaceState('');
    //   }
    // })
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
  //get connector list
  getConnectors() {
    this.availableConnectorsData = [];
    this.connectorsData = [];
    const quaryparms: any = {
      sidx: this.searchIndexId
    };
    this.service.invoke('get.connectors', quaryparms).subscribe(res => {
      const result = res?.connectors;
      this.Connectors.forEach(item => {
        if (result?.length) {
          result.forEach(item1 => {
            if (item.type === item1.type) {
              this.connectorsData.push({ ...item, ...item1 });
            }
            else {
              this.availableConnectorsData.push(item);
            }
          })
        }
        else {
          this.availableConnectorsData = this.Connectors;
        }
      })
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get Connectors');
    });
  }
  //change page like list, add ,edit
  changeContent(page, data) {
    this.selectedConnector = data;
    this.selectedContent = page;
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
        this.authorizeConnector();
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
      "name": "siemens",
      "type": "confluenceServer",
      "authDetails": {
        "clientId": this.configurationObj.clientId,
        "clientSecret": this.configurationObj.clientSecret
      },
      "configuration": {
        "hostUrl": "https://myid.siemens.com",
        "hostDomainName": "siemens"
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
  authorizeConnector() {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: this.connectorId
    };
    this.service.invoke('get.authorizeConnector', quaryparms).subscribe(res => {
      if (res) {
        this.selectedContent = 'list';
        this.notificationService.notify('Connector Authorized Successfully', 'success');
        this.getConnectors();
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get Connectors');
    });
  }
  //update connector 
  openConnectorDialog(data, checked) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Disable the connected source?',
        body: 'This can be enabled any point of time, configuration will remain intact.',
        buttons: [{ key: 'yes', label: 'Proceed', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.updateConnector(data, checked, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  updateConnector(data, checked, dialog?) {
    const quaryparms: any = {
      sidx: this.searchIndexId,
      fcon: data?._id
    };
    const payload = {
      "name": data?.name,
      "type": data?.type,
      "authDetails": {
        "clientId": data?.authDetails?.clientId,
        "clientSecret": data?.authDetails?.clientSecret
      },
      "configuration": {
        "hostUrl": "https://myid.siemens.com",
        "hostDomainName": "siemens"
      },
      "isActive": checked.target.checked
    }
    this.service.invoke('put.connector', quaryparms, payload).subscribe(res => {
      if (res) {
        this.notificationService.notify('Connector Updated Successfully', 'success');
        if (dialog) dialog?.close();
        this.getConnectors();
      }
    }, errRes => {
      this.errorToaster(errRes, 'Connectors API Failed');
    });
  }
}
