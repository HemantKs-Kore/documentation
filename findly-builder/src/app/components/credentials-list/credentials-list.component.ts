import { Component, OnInit, ViewChild} from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import * as moment from 'moment';
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
  listData: any;
  configuredBot_streamId = "";
  botID = '';
  data;
  isAlertsEnabled: boolean;
  AppUsage:true;
  channelEnabled: true;
  channnelConguired: any = [];
  // existingCredential: boolean = false;
  credentials:any;
  credntial: any = {
    name: "",
    anonymus: true,
    register: true,
    awt: 'Select Signing Algorithm',
    enabled: true
  };
  @ViewChild('addCredential') addCredential: KRModalComponent;
  @ViewChild('editCredential') editCredential: KRModalComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
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
editnewCredential($event){
  // this.editTitleFlag = true;

  if(this.editCredentialRef=this.editCredential.open())
  this.credntial.name=this.data.appName;
}
closeEditModalPopup(){
  this.editCredentialRef.close();
}
createCredential() {
  const queryParams = {
    userId: this.authService.getUserId(),
    streamId: this.selectedApp._id
  }
  let scope = [];
  if (this.credntial.anonymus && this.credntial.register) {
    scope = ["anonymouschat", "registration"];
  } else if (this.credntial.anonymus && !this.credntial.register) {
    scope = ["anonymouschat"];
  } else if (!this.credntial.anonymus && this.credntial.register) {
    scope = ["registration"];
  } else {
    scope = [];
  }
  let payload = {
    appName: this.credntial.name,
    algorithm: this.credntial.awt,
    scope: scope,
    bots: [this.selectedApp._id],
    pushNotifications: {
      enable: this.credntial.enabled,
      webhookUrl: ""
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
    type: "rtm",
    name: 'Web / Mobile Client',
    app: {
      clientId: this.listData.clientId,
      appName: this.listData.appName,
    },
    isAlertsEnabled: this.isAlertsEnabled,
    enable: this.channelEnabled,
    sttEnabled: false,
    sttEngine: "kore"
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

}
