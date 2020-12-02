import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
declare const $: any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  slider = 0;
  refId = "";
  botID = '';
  configuredBot_streamId = "";
  selectedApp: any;
  serachIndexId: any;
  addCredentialRef: any;
  listData: any;
  firstlistData;
  showSearch;
  searchchannel: any = '';
  isAlertsEnabled: boolean;
  channelEnabled: true;
  existingCredential: boolean = false;
  configFlag: boolean = false;
  channnelConguired: any = [];
  credntial: any = {
    name: "",
    anonymus: true,
    register: true,
    awt: 'Select Signing Algorithm',
    enabled: true
  };
  channels = [
    {
      id: 'rtm',
      name: 'Web/Mobile Client',
      enable: false,
      status: 'Not Setup',
      hide: false,
      class: 'websdk',
      catagory: 'others',
      icon: "assets/icons/web-mobile-client.png"
    },
    {
      id: 'ivrLocal',
      name: 'Webhook',
      enable: false,
      status: 'Not Setup',
      hide: false,
      class: 'ivr',
      catagory: 'other',
      icon: "assets/icons/webhook.svg"
    }
  ]
  @ViewChild('addCredential') addCredential: KRModalComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;

    // this.getCredential();
    this.getdialog();
    this.getLinkedBot();
    this.prepareChannelData();

  }
  prepareChannelData() {
    const channels = JSON.parse(JSON.stringify(this.channels))
    channels.forEach((channel) => {
      this.selectedApp.channels.forEach((streamChannel) => {
        if (channel.id === streamChannel.type) {
          const tempChannel: any = streamChannel
          tempChannel.id = channel.id,
            tempChannel.status = channel.status,
            tempChannel.hide = channel.hide,
            tempChannel.class = channel.class,
            tempChannel.icon = channel.icon
          channel = tempChannel
        }

      })
    })
    this.channels = channels
    // this.getCredential();
    console.log(this.channels);
  }
  copy(val, elementID) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  jwtAuth(awt) {
    this.credntial.awt = awt;
  }
  selctedChannel(channel) {
    this.listData = channel;
    this.botID = channel.bots[0]._id;
    // this.slider = this.slider + 1;
    var div = document.getElementsByClassName('dropdown-menu content-menu');
    for (var i = 0; i < div.length; i++) {
      for (var j = 0; j < div[i].children.length; j++) {
        div[i].children[j].addEventListener('click', function () {
          this.parentNode.previousElementSibling.innerHTML = this.innerHTML;
        })
      }
    }
  }
  cancel() {
    if (this.slider > 0)
      this.slider = this.slider - 1;
  }
  back() {
    if (this.slider != 0)
      this.slider = this.slider - 1;
    if (this.existingCredential = true) {
      this.slider = 0
    }
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
        // this.listData={};
        this.listData = res;
        this.botID = res.bots[0];
        // this.slider = this.slider + 1;
        this.listData != this.credntial.name;
        if (this.slider == 3 && this.existingCredential) {
          this.slider = 3
        }

        this.notificationService.notify('Credential Created', 'success');
        this.closeModalPopup();
        this.getCredential();

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
        this.channnelConguired = res;
        if (this.channnelConguired.apps.length > 0) {
          this.existingCredential = true;
          this.firstlistData = res.apps[0];
          this.slider = 3
          this.listData = this.firstlistData
          this.configFlag = true;
        }
        else if (this.channnelConguired.apps.length == 0) {
          this.existingCredential = false;
          this.slider = 1
        }

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
  proceedChannel(channel) {
    if (channel && channel.id === 'rtm') {
      this.getCredential()
    }
    else (this.notificationService.notify('Channel not available ', 'error'))

  }
  continue(channel) {
    if (this.slider == 0) {
      this.getCredential()
      // this.configFlag = true;

    }
    if (this.slider == 2) {
      this.createCredential()
      this.configFlag = true;
      this.slider = this.slider + 1;

    }
    if (this.slider < 3 && this.slider != 0) {
      // this.configFlag = true;
      this.slider = this.slider + 1;
    }
    // else if(this.slider < 3  && this.slider !=0) {
    //   this.existingCredential=true;
    // this.slider = this.slider + 1;

    // }


    //  if (this.slider < 3  && this.slider == 0 ) {    
    //     // this.configFlag = true;




    // }

  }
  radio(bool) {
    this.isAlertsEnabled = bool;
  }
  getLinkedBot() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }

    this.service.invoke('get.linkedBot', queryParams).subscribe(
      res => {
        if (res.configuredBots) this.configuredBot_streamId = res.configuredBots[0]._id
        console.log(res);
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to get LInked BOT', 'error');
        }
      }
    );
  }
  standardPublish() {
    const queryParams = {
      streamId: this.selectedApp._id
    }
    let payload = {
      "resources":
        [
          {
            "namespace": "enterprise",
            "resourceId": this.refId,
            "namespaceIds": [],
            "resourceType": "dialog",
            "approvalRequestedLanguages": ["en"]
          },
          { "resourceId": "smalltalk", "resourceType": "smalltalk", "approvalRequestedLanguages": ["en"] },
          { "resourceId": "NL", "resourceType": "NL", "modules": ["linked_bot_training", "bot_synonyms", "thresholds_and_configurations", "standard_responses", "default_dialog", "settings"] },
          { "resourceId": "CHANNELS", "resourceType": "CHANNELS", "modules": ["rtm"] }, { "resourceId": "EXTENSIONS", "resourceType": "EXTENSIONS", "modules": ["botkit", "websdk", "events"] },
          { "resourceId": "SETTINGS", "resourceType": "SETTINGS", "modules": ["general", "pii", "ivr", "hold_resume", "custom_script", "advanced", "bot_variables"] },
          { "resourceId": "BOTLANGUAGES", "resourceType": "BOTLANGUAGES", "modules": { "enabledLanguages": ["en"] } }], "publishAllComponents": true, "versionComment": "publishing", "linkedBotCount": 1
    }

    this.service.invoke('standard.publish', queryParams, payload).subscribe(
      res => {
        this.notificationService.notify('Standard Published', 'success');
        this.universalPublish();
        console.log(res);
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed Standard Publish', 'error');
        }
      }
    );
  }
  universalPublish() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }
    let payload = {
      "bots":
        [
          {
            "_id": this.configuredBot_streamId,
            "state": "new"
          }
        ],
      "publishAllComponents": true,
      "versionComment": "publishing",
      "linkedBotCount": 1
    }

    this.service.invoke('universal.publish', queryParams, payload).subscribe(
      res => {
        this.notificationService.notify('Universal Published', 'success');
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
  getdialog() {
    const queryParams = {
      streamId: this.selectedApp._id
    }

    this.service.invoke('get.dialog', queryParams).subscribe(
      res => {
        this.refId = res[0]._id;
        console.log(res)
        //this.notificationService.notify('Credential Configuered', 'success');
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed get DialogID', 'error');
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
        this.standardPublish();
        this.configFlag = true;
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
  newCredential() {
    this.addCredentialRef = this.addCredential.open();
  }
  closeModalPopup() {
    this.addCredentialRef.close();
  }
  toggleSearch() {
    if (this.showSearch && this.searchchannel) {
      this.searchchannel = '';
    }
    this.showSearch = !this.showSearch
  };


}
