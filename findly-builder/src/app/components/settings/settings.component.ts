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
  serachIndexId : any;
  addCredentialRef:any;
  listData : any ;
  isAlertsEnabled : boolean;
  channelEnabled : true;
  channnelConguired : any =[];
  credntial : any = {
    name : "",
    anonymus : true,
    register :true,
    awt : 'Select Signing Algorithm',
    enabled : true
  };
  @ViewChild('addCredential') addCredential: KRModalComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public authService:AuthService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;

    this.callStream();
    this.getdialog();
    this.getLinkedBot();
  }
  copy(val,elementID){
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
  jwtAuth(awt){
    this.credntial.awt = awt;
  }
  selctedChannel(channel){
    this.listData = channel;
    this.botID = channel.bots[0]._id;
    this.slider= this.slider+1;
  }
  cancel(){
    if(this.slider > 0)
    this.slider = this.slider - 1;
  }
  saveCredential(){
    const queryParams = {
      userId:this.authService.getUserId(),
      streamId:this.selectedApp._id
    }
    let scope = [];
    if(this.credntial.anonymus && this.credntial.register){
      scope = ["anonymouschat","registration"];
    }else if(this.credntial.anonymus && !this.credntial.register){
      scope = ["anonymouschat"];
    }else if(!this.credntial.anonymus && this.credntial.register){
      scope = ["registration"];
    }else {
      scope = [];
    }
    let payload = {
      appName : this.credntial.name,
      algorithm : this.credntial.awt,
      scope: scope,
      bots : [this.selectedApp._id],
      pushNotifications : {
        enable : this.credntial.enabled,
        webhookUrl : ""
      }
    }
   
    this.service.invoke('create.createCredential',queryParams,payload).subscribe(
      res => {
        console.log(res);
        this.listData = res;
        this.botID = res.bots[0];
        this.slider = this.slider + 1;
        this.notificationService.notify('Credential Created', 'success');
        this.closeModalPopup();
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
  callStream(){
    const queryParams = {
      userId:this.authService.getUserId(),
      streamId:this.selectedApp._id
    }
    this.service.invoke('get.credential',queryParams).subscribe(
      res => {
        this.channnelConguired = res;
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
  continue(){
    if(this.slider == 2){
      this.configureCredential()
    }
    if(this.slider < 2){
      this.slider = this.slider+1;
    }
  }
  radio(bool){
    this.isAlertsEnabled = bool;
  }
  getLinkedBot(){
    const queryParams = {
      userId:this.authService.getUserId(),
      streamId:this.selectedApp._id
    }
    
    this.service.invoke('get.linkedBot',queryParams).subscribe(
      res => {
        if(res.configuredBots) this.configuredBot_streamId =  res.configuredBots[0]._id
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
  standardPublish(){
    const queryParams = {
      streamId:this.selectedApp._id
    }
    let payload = {
      "resources":
      [
        {"namespace":"enterprise",
        "resourceId":this.refId,
        "namespaceIds":[],
        "resourceType":"dialog",
        "approvalRequestedLanguages":["en"]
      },
        {"resourceId":"smalltalk","resourceType":"smalltalk","approvalRequestedLanguages":["en"]},
        {"resourceId":"NL","resourceType":"NL","modules":["linked_bot_training","bot_synonyms","thresholds_and_configurations","standard_responses","default_dialog","settings"]},
        {"resourceId":"CHANNELS","resourceType":"CHANNELS","modules":["rtm"]},{"resourceId":"EXTENSIONS","resourceType":"EXTENSIONS","modules":["botkit","websdk","events"]},
        {"resourceId":"SETTINGS","resourceType":"SETTINGS","modules":["general","pii","ivr","hold_resume","custom_script","advanced","bot_variables"]},
        {"resourceId":"BOTLANGUAGES","resourceType":"BOTLANGUAGES","modules":{"enabledLanguages":["en"]}}],"publishAllComponents":true,"versionComment":"publishing","linkedBotCount":1}

    this.service.invoke('standard.publish',queryParams,payload).subscribe(
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
  universalPublish(){
    const queryParams = {
      userId:this.authService.getUserId(),
      streamId:this.selectedApp._id
    }
    let payload = {
      "bots":
        [
          {
            "_id": this.configuredBot_streamId,
            "state":"new"
          }
        ],
        "publishAllComponents":true,
        "versionComment":"publishing",
        "linkedBotCount":1
      }

    this.service.invoke('universal.publish',queryParams,payload).subscribe(
      res => {
        this.notificationService.notify('Credential Configuered', 'success');
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
  getdialog(){
    const queryParams = {
      streamId:this.selectedApp._id
    }

    this.service.invoke('get.dialog',queryParams).subscribe(
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
  configureCredential(){
    const queryParams = {
      userId:this.authService.getUserId(),
      streamId:this.selectedApp._id
    }
    let payload = {
      type : "rtm",
      name : 'Web / Mobile Client',
      app : {
        clientId : this.listData.clientId,
        appName : this.listData.appName,
      },
      isAlertsEnabled : this.isAlertsEnabled,
      enable : this.channelEnabled,
      sttEnabled : false,
      sttEngine : "kore"
    }

    this.service.invoke('configure.credential',queryParams,payload).subscribe(
      res => {
        this.slider = 0;
        this.notificationService.notify('Credential Configuered', 'success');
        this.standardPublish();
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
  newCredential(){
    this.addCredentialRef = this.addCredential.open();
  }
  closeModalPopup(){
    this.addCredentialRef.close();
  }
}
