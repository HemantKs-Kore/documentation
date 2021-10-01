import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
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
  enableConfiguration = true;
  showPassword: boolean;
  pageDisable = true;
  configuredBot_streamId = "";
  selectedApp: any;
  serachIndexId: any;
  addCredentialRef: any;
  listData: any;
  firstlistData;
  showSearch = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  activeClose = false;
  searchchannel: any = '';
  isAlertsEnabled: boolean;
  showError: boolean = false;
  channelEnabled: true;
  existingCredential: boolean = false;
  configFlag: boolean = false;
  channnelConguired: any = [];
  credntial: any = {
    name: "",
    anonymus: true,
    register: true,
    awt: 'HS256',
    enabled: false
  };
  delChannel = false;
  componentType: string = 'addData';
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
    // {
    //   id: 'ivrLocal',
    //   name: 'Webhook',
    //   enable: false,
    //   status: 'Not Setup',
    //   hide: false,
    //   class: 'ivr',
    //   catagory: 'other',
    //   icon: "assets/icons/webhook.svg"
    // }
  ]
  allBotArray = [];
  @ViewChild('addCredential') addCredential: KRModalComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;

    // this.getCredential();
    // this.getdialog();
    this.getLinkedBot();
    this.prepareChannelData();

  }
  prepareChannelData() {
    // this.getCredential();
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
          if (channel.enable = true) {
            channel = tempChannel
          }
        }

      })
    })
    this.channels = channels
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
    this.notificationService.notify('Copied to clipboard', 'success')

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
    if (this.existingCredential = true)
      this.slider = 0;
  }
  // if(slider)
  back() {
    if (this.slider != 0)
      this.slider = this.slider - 1;
    if (this.existingCredential = true) {
      this.slider = 0
    }
  }

  validateSource() {
    if (this.credntial.awt != 'HS256') {
      this.createCredential()
    }
    else if (this.credntial.awt == 'Signing algorithm') {
      this.showError = true;
      $(".dropdown-input").css("border-color", "#DD3646");
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }

    if (this.credntial.name) {
      this.createCredential()
    }
    else {

      $("#addSourceTitleInput").css("border-color", "#DD3646");
      $("#infoWarning1").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }

  }
  //track changing of input
  inputChanged(type) {
    if (type == 'title') {
      this.credntial.name != '' ? $("#infoWarning").hide() : $("#infoWarning").show();
      $("#addSourceTitleInput").css("border-color", this.credntial.name != '' ? "#BDC1C6" : "#DD3646");
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

        this.notificationService.notify('Created successfully', 'success');
        this.closeModalPopup();
        this.getCredential();

      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          // this.notificationService.notify(errRes.error.errors[0].msg, 'error');
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
        this.channnelConguired.apps = [...res.apps];
        if (this.channnelConguired.apps.length > 0) {
          this.existingCredential = true;
          // if(this.selectedApp.appPreferences && this.selectedApp.appPreferences.rtmAppId){
          //   res.apps.forEach(element => {
          //     if(element.clientId === this.selectedApp.appPreferences.rtmAppId){
          //       this.listData=element;
          //     }

          //   });
          // }
          this.listData = this.channnelConguired.apps[this.channnelConguired.apps.length - 1];
          this.slider = 3
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
    // if(this.enableConfiguration){
    //   event.stopPropagation();
    // }
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

    this.service.invoke('get.streamData', queryParams).subscribe(
      res => {
        if (res.configuredBots.length) this.configuredBot_streamId = res.configuredBots[0]._id
        console.log(res);
        if (res && res.configuredBots) {
          res.configuredBots.forEach(element => {
            let obj = {
              "_id": element._id,
              "state": "new"
            }
            this.allBotArray.push(obj);
          });
        }
        if (res && res.unpublishedBots) {
          res.unpublishedBots.forEach(element => {
            let obj = {
              "_id": element._id,
              "state": "delete"
            }
            this.allBotArray.push(obj);
          });
        }
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          // this.notificationService.notify(errRes.error.errors[0].msg, 'error');
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
        if (this.allBotArray.length > 0) {
          this.universalPublish();
        }
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
      "bots": this.allBotArray,
      // [
      //   {
      //     "_id": this.configuredBot_streamId,
      //     "state": "new"
      //   }
      // ],
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
          // this.notificationService.notify('Failed get DialogID', 'error');
        }
      }
    );
  }
  configureCredential(event) {
    if (event) {
      if (this.enableConfiguration) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
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
      enable: this.enableConfiguration,
      sttEnabled: false,
      sttEngine: "kore"
    }

    this.service.invoke('configure.credential', queryParams, payload).subscribe(
      res => {
        this.slider = 0;
        this.selectedApp.channels = res.channels;
        this.workflowService.selectedApp(this.selectedApp);
        this.notificationService.notify('Credential Configured', 'success');
        this.prepareChannelData();
        //this.standardPublish();
        this.configFlag = true;
        this.delChannel = false;
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
  deleteChannel() {
    const modalData: any = {
      newTitle: 'Are you sure you want to delete?',
      body: 'Search users cannot interact with the app through this channel if it is delete. ',
      buttons: [{ key: 'yes', label: 'Delete' }, { key: 'no', label: 'Cancel' }],
      confirmationPopUp: true
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: modalData,
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const queryParams = {
            streamId: this.selectedApp._id
          }
          let payload = { "channels": [] }
          this.service.invoke('delete.credentialData', queryParams, payload).subscribe(
            res => {
              this.delChannel = true;
              this.getLinkedBot();
              this.prepareChannelData();
            },
            errRes => {
              this.delChannel = false;
              if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
                this.notificationService.notify(errRes.error.errors[0].msg, 'error');
              } else {
                this.notificationService.notify('Failed ', 'error');
              }
            }
          );
          dialogRef.close();
        } else if (result === 'no') {
          this.delChannel = false;
          dialogRef.close();
        }
      })

  }
  enableDisableCredential() {

    const modalData: any = {
      newTitle: 'Are you sure you want to disable?',
      body: 'Search users cannot interact with the app through this channel if it is disabled. ',
      buttons: [{ key: 'yes', label: 'Disable' }, { key: 'no', label: 'Cancel' }],
      confirmationPopUp: true
    }
    if (this.enableConfiguration) {
      this.disableCredential();
      this.notificationService.notify('Web SDK channel is enabled.', 'success')
      // modalData.newTitle = 'Are you sure you want to Enable ?'
      // modalData.body = 'Channel will be enabled.';
      // modalData.buttons[0].label = 'Enable' ;
    }
    if (!this.enableConfiguration) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '530px',
        height: 'auto',
        panelClass: 'delete-popup',
        data: modalData,
      });
      dialogRef.componentInstance.onSelect
        .subscribe(result => {
          if (result === 'yes') {
            this.disableCredential();
            dialogRef.close();
          } else if (result === 'no') {
            this.enableConfiguration = !this.enableConfiguration;
            dialogRef.close();
          }
        })
    }

  }
  disableCredential(pageDisable?) {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }
    let payload = {
      type: "rtm",
      name: 'Web / Mobile Client',
      app: {
        clientId: this.selectedApp.channels.length ? this.selectedApp.channels[0].app.clientId : "",
        appName: this.selectedApp.channels.length ? this.selectedApp.channels[0].app.appName : "",
      },
      isAlertsEnabled: this.isAlertsEnabled,
      enable: this.enableConfiguration ? true : false,
      sttEnabled: false,
      sttEngine: "kore"
    }
    this.service.invoke('configure.credential', queryParams, payload).subscribe(
      res => {
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
    if (pageDisable == true) {
      this.enableConfiguration = !this.enableConfiguration;
    }
  }

  newCredential() {
    this.addCredentialRef = this.addCredential.open();
  }
  closeModalPopup() {
    if (this.addCredentialRef) {
      this.addCredentialRef.close();
    }
    this.credntial.name = [];
    this.credntial.awt = 'HS256';
  }
  toggleSearch() {
    if (this.showSearch && this.searchchannel) {
      this.searchchannel = '';
    }
    this.showSearch = !this.showSearch
  };

  showPasword() {
    var show: any = document.getElementById("password");
    if (show.type === "password") {
      this.showPassword = true;
      show.type = "text";

    } else {
      this.showPassword = false;
      show.type = "password";
    }
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchchannel = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
}

