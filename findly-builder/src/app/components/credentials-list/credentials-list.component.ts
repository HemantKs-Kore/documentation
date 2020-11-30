import { Component, OnInit, ViewChild} from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

declare const $: any;
@Component({
  selector: 'app-credentials-list',
  templateUrl: './credentials-list.component.html',
  styleUrls: ['./credentials-list.component.scss']
})
export class CredentialsListComponent implements OnInit {
  slider = 0;
  selectedApp: any;
  serachIndexId: any;
  firstlistData:any;
  addCredentialRef:any;
  editCredentialRef:any;
  editCredential:any= {};
  listData: any;
  configuredBot_streamId = '';
  botID = '';
  data;
  isAlertsEnabled: boolean;
  editTitleFlag:boolean=false;
  AppUsage:true;
  channelEnabled: true;
  editCreden:any={};
  channnelConguired: any = [];
  // existingCredential: boolean = false;
  credentials:any;
  credntial: any = {
    name: '',
    anonymus: true,
    register: true,
    awt: 'Select Signing Algorithm',
    enabled: true
  };
  @ViewChild('addCredential') addCredential: KRModalComponent;
  @ViewChild('editCredential') editCredentialPop: KRModalComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    // this.manageCredential();
    this.getCredential();
    // this.getLinkedBot();
  }
  jwtAuth(awt) {
    this.credntial.awt = awt;
  }
  manageCredential() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id,
      getAppsUsage:true,
    }
    this.service.invoke('manage.credentials', queryParams).subscribe(
      res => {
       this.credentials = res;
        console.log(res)
    },
    errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    }
  );
}
newCredential() {
  this.addCredentialRef = this.addCredential.open();
}
closeModalPopup() {
  this.addCredentialRef.close();
}
editnewCredential(event,data){
  this.editCredentialRef=this.editCredentialPop.open()
  this.editTitleFlag = true;
  this.editCredential = data;
  this.editCredential.anonymus = false;
  this.editCredential.register = false;
  if (data.scope && data.scope.length){
    data.scope.forEach(scopeVal => {
      if(scopeVal === 'anonymouschat'){
        this.editCredential.anonymus = true;
      }
      if(scopeVal === 'registration'){
        this.editCredential.register = true;
      }
    });
  }
}
closeEditModalPopup(){
  this.editCredentialRef.close();
}
saveEditCredential(){
  let scope = [];
  if (this.editCredential.anonymus && this.editCredential.register) {
    scope = ['anonymouschat', 'registration'];
  } else if (this.editCredential.anonymus && !this.editCredential.register) {
    scope = ['anonymouschat'];
  } else if (!this.editCredential.anonymus && this.editCredential.register) {
    scope = ['registration'];
  } else {
    scope = [];
  }
  const payload = {
    appName: this.editCredential.name,
    algorithm: this.editCredential.awt,
    scope,
    bots: [this.selectedApp._id],
    pushNotifications: {
      enable: this.editCredential.enabled,
      webhookUrl: ''
    }
  }
}
createCredential() {
  const queryParams = {
    userId: this.authService.getUserId(),
    streamId: this.selectedApp._id
  }
  let scope = [];
  if (this.credntial.anonymus && this.credntial.register) {
    scope = ['anonymouschat', 'registration'];
  } else if (this.credntial.anonymus && !this.credntial.register) {
    scope = ['anonymouschat'];
  } else if (!this.credntial.anonymus && this.credntial.register) {
    scope = ['registration'];
  } else {
    scope = [];
  }
  const payload = {
    appName: this.credntial.name,
    algorithm: this.credntial.awt,
    scope,
    bots: [this.selectedApp._id],
    pushNotifications: {
      enable: this.credntial.enabled,
      webhookUrl: ''
    }
  }

  this.service.invoke('create.createCredential', queryParams, payload).subscribe(
    res => {
      console.log(res);
      this.listData = res;
      this.botID = res.bots[0];
      // this.slider = this.slider + 1;
      // if (this.slider == 3 && this.existingCredential) {
      //   this.slider = 3
      // }

      this.notificationService.notify('Credential Created', 'success');
      this.closeModalPopup();
      this. getCredential();

    },
    errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    }
  );
}
getCredential() {
  const queryParams = {
    userId: this.authService.getUserId(),
    streamId: this.selectedApp._id
  }
  this.service.invoke('get.credential', queryParams).subscribe(
    res => {
      this.channnelConguired= res.apps;
      this.firstlistData=res.apps[0];
      // this.firstlistData.lastModifiedOn = moment(this.firstlistData.lastModifiedOn).format('MM/DD/YYYY - hh:mmA');
   

      // var moment = require('moment/moment');
      // if (this.channnelConguired.apps.length > 0) {
      //   this.existingCredential = true;
      // }
      console.log(res)
    },
    errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    }
  );
}
configureCredential() {
  const queryParams = {
    userId: this.authService.getUserId(),
    streamId: this.selectedApp._id
  }
  let payload = {
    type: 'rtm',
    name: 'Web / Mobile Client',
    app: {
      clientId: this.listData.clientId,
      appName: this.listData.appName,
    },
    isAlertsEnabled: this.isAlertsEnabled,
    enable: this.channelEnabled,
    sttEnabled: false,
    sttEngine: 'kore'
  }

  this.service.invoke('configure.credential', queryParams, payload).subscribe(
    res => {
      this.slider = 0;

      this.notificationService.notify('Credential Configuered', 'success');
      // this.standardPublish();
      console.log(res);
    },
    errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    }
  );
}
deleteCredential(data){
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '446px',
    height: '306px',
    panelClass: 'delete-popup',
    data: {
      title: 'Delete Credential',
      text: 'Are you sure you want to delete Credential?',
      buttons: [{ key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }]
    }
  });
  dialogRef.componentInstance.onSelect
    .subscribe(result => {
      if (result === 'yes') {
        const quaryparms: any = {
          userId: this.authService.getUserId(),
          streamId: this.selectedApp._id,
          appId:data.clientId,
        }
        this.service.invoke('delete.credential', quaryparms).subscribe(res => {
          // this.getCredential();
          dialogRef.close();
          this.notificationService.notify(' credential deleted successfully', 'success');
        }, (err) => {
          if (err && err.data && err.data.errors && err.data.errors[0]) {
            this.notificationService.notify(err.data.errors[0].msg, 'error');
          } else {
            this.notificationService.notify('Failed to delete credential', 'error');
          }
        });
      } else if (result === 'no') {
        dialogRef.close();
      }
    })
};

}
// getLinkedBot() {
//   const queryParams = {
//     userId: this.authService.getUserId(),
//     streamId: this.selectedApp._id
//   }

//   this.service.invoke('get.linkedBot', queryParams).subscribe(
//     res => {
//       if (res.configuredBots) this.configuredBot_streamId = res.configuredBots[0]._id
//       console.log(res);
//     },
//     errRes => {
//       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
//         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
//       } else {
//         this.notificationService.notify('Failed to get LInked BOT', 'error');
//       }
//     }
//   );
// }


