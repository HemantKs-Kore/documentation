import { Component, OnInit, ElementRef } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '../../services/notification.service';
import { workflowService } from '@kore.services/workflow.service'
import { SideBarService } from '@kore.services/header.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare const $: any;
@Component({
  selector: 'app-call-flow',
  templateUrl: './call-flow.component.html',
  styleUrls: ['./call-flow.component.scss']
})
export class CallFlowComponent implements OnInit {
  welcomeMessageWarning: boolean = true;
  confirmationMessageWarning: boolean = true;
  chatLinkWarning: boolean = true;
  phoneNumberWarning: boolean = true;

  // smsMessageWarning: boolean = true;
  chatInterfaceMessageWarning: boolean = true;
  // formMessageWarning: boolean = true;
  acknowledgementMessageWarning: boolean = true;

  toShowAppHeader: any;
  selectedApp: any;
  callFlowData: any;

  constructor(
    private service: ServiceInvokerService,
    private el: ElementRef,
    private NotificationService: NotificationService,
    public workflowService: workflowService,
    private router: Router,
    private headerService:SideBarService
  ) { }

  ngOnInit() {
    let toogleObj = {
      "title": "Experiences",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.selectedApp = this.workflowService.deflectApps();
    this.headerService.toggle(toogleObj);
    this.getTextEncoded();
    this.getCallFlowData();
  }

  validator(e) {
    this.welcomeMessageWarning = true;
    this.confirmationMessageWarning = true;
    this.chatLinkWarning = true;
    this.phoneNumberWarning = true;

    // this.smsMessageWarning = true;
    this.chatInterfaceMessageWarning = true;
    // this.formMessageWarning = true;
    this.acknowledgementMessageWarning = true;


    $("#welcomeMessage").removeClass('validatorBorder');
    $("#phoneNumber").removeClass('validatorBorder');
    $("#chatLink").removeClass('validatorBorder');
    $("#confirmationMessage").removeClass('validatorBorder');

    // $("#smsMessage").removeClass('validatorBorder');
    $("#chatInterfaceMessage").removeClass('validatorBorder');
    $("#formMessage").removeClass('validatorBorder');
    $("#acknowledgementMessage").removeClass('validatorBorder')
  }

  getCallFlowData() {
    const _self = this;
    let _params = {
      'appId': _self.selectedApp._id || _self.selectedApp[0]._id
    }
    this.service.invoke('get.callflow.data', _params).subscribe(
      res => {
        _self.callFlowData = res;
        _self.callFlowData.variables.forEach(function (data) {
          if (data.key === "CHAT_ACK") {
            _self.el.nativeElement.querySelector("#acknowledgementMessage").innerText = _self.getTextEncoded(data.value);
          }
          if (data.key === "CHAT_WELCOME_MESSAGE") {
            _self.el.nativeElement.querySelector("#chatInterfaceMessage").innerText = _self.getTextEncoded(data.value);
          }
          if (data.key === "MESSAGE_CHAT_LINK") {
            _self.el.nativeElement.querySelector("#chatLink").innerText = _self.getTextEncoded(data.value);
          }
          // if (data.key === "MESSAGE_PRESENT_FORM") {
          //   _self.el.nativeElement.querySelector("#formMessage").innerText = _self.getTextEncoded(data.value);
          // }
          if (data.key === "MESSAGE_SENT_SMS") {
            _self.el.nativeElement.querySelector("#confirmationMessage").innerText = _self.getTextEncoded(data.value);
          }
          if (data.key === "PROMPT_PHONE_NUMBER") {
            _self.el.nativeElement.querySelector("#phoneNumber").innerText = _self.getTextEncoded(data.value);
          }
          if (data.key === "VOICE_WELCOME_MESSAGE") {
            _self.el.nativeElement.querySelector("#welcomeMessage").innerText = _self.getTextEncoded(data.value);
          }
          // if (data.key === "MESSAGE_SEND_SMS") {
          //   _self.el.nativeElement.querySelector("#smsMessage").innerText = _self.getTextEncoded(data.value);
          // }
        })
      },
      errRes => {
        console.error('Failed in singing out');
      }
    );
  }

  saveCallFlowData(e, flag) {
    const _self = this;
    let routeFlag = flag;
    let _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }
    let welcomeMessage = this.el.nativeElement.querySelector("#welcomeMessage").innerText;
    let phoneNumber = this.el.nativeElement.querySelector("#phoneNumber").innerText;
    let chatLink = this.el.nativeElement.querySelector("#chatLink").innerText;
    let confirmationMessage = this.el.nativeElement.querySelector("#confirmationMessage").innerText;

    // let smsMessage = this.el.nativeElement.querySelector("#smsMessage").innerText;
    let chatInterfaceMessage = this.el.nativeElement.querySelector("#chatInterfaceMessage").innerText;
    // let formMessage = this.el.nativeElement.querySelector("#formMessage").innerText;
    let acknowledgementMessage = this.el.nativeElement.querySelector("#acknowledgementMessage").innerText;

    if (welcomeMessage === "") {
      // this.NotificationService.notify('welcomeMessage is required', 'warning');
      this.welcomeMessageWarning = false;
      $("#welcomeMessage").addClass('validatorBorder');
      document.getElementById("welcomeMessage").scrollIntoView();
      return;
    }
    if (phoneNumber === "") {
      this.phoneNumberWarning = false;
      $("#phoneNumber").addClass('validatorBorder');
      document.getElementById("phoneNumber").scrollIntoView();
      return;
    }
    if (chatLink === "") {
      this.chatLinkWarning = false;
      $("#chatLink").addClass('validatorBorder');
      document.getElementById("chatLink").scrollIntoView();
      return;
    }
    if (confirmationMessage === "") {
      this.confirmationMessageWarning = false;
      $("#confirmationMessage").addClass('validatorBorder');
      document.getElementById("confirmationMessage").scrollIntoView();
      return;
    }
    // if (smsMessage === "") {
    //   this.smsMessageWarning = false;
    //   $("#smsMessage").addClass('validatorBorder');
    //   document.getElementById("smsMessage").scrollIntoView();
    //   return;
    // }
    if (chatInterfaceMessage === "") {
      this.chatInterfaceMessageWarning = false;
      $("#chatInterfaceMessage").addClass('validatorBorder');
      document.getElementById("chatInterfaceMessage").scrollIntoView();
      return;
    }
    // if (formMessage === "") {
    //   this.formMessageWarning = false;
    //   $("#formMessage").addClass('validatorBorder');
    //   return;
    // }
    if (acknowledgementMessage === "") {
      this.acknowledgementMessageWarning = false;
      $("#acknowledgementMessage").addClass('validatorBorder');
      document.getElementById("acknowledgementMessage").scrollIntoView();
      return;
    }
    let _payload = {
      "VOICE_WELCOME_MESSAGE": welcomeMessage,
      "PROMPT_PHONE_NUMBER": phoneNumber,
      "MESSAGE_CHAT_LINK": chatLink,
      "MESSAGE_SENT_SMS": confirmationMessage,
      "CHAT_WELCOME_MESSAGE": chatInterfaceMessage,
      "CHAT_ACK": acknowledgementMessage,
      // "MESSAGE_SEND_SMS": smsMessage
    }
    this.service.invoke('save.callflow.data', _params, _payload).subscribe(
      res => {
        _self.callFlowData = res;
        _self.callFlowData.forEach(function (data) {
          if (data.key === "CHAT_ACK") {
            _self.el.nativeElement.querySelector("#acknowledgementMessage").innerText = data.value;
          }
          if (data.key === "CHAT_WELCOME_MESSAGE") {
            _self.el.nativeElement.querySelector("#chatInterfaceMessage").innerText = data.value;
          }
          if (data.key === "MESSAGE_CHAT_LINK") {
            _self.el.nativeElement.querySelector("#chatLink").innerText = data.value;
          }
          // if (data.key === "MESSAGE_PRESENT_FORM") {
          //   _self.el.nativeElement.querySelector("#formMessage").innerText = data.value;
          // }
          if (data.key === "MESSAGE_SENT_SMS") {
            _self.el.nativeElement.querySelector("#confirmationMessage").innerText = data.value;
          }
          if (data.key === "PROMPT_PHONE_NUMBER") {
            _self.el.nativeElement.querySelector("#phoneNumber").innerText = data.value;
          }
          if (data.key === "VOICE_WELCOME_MESSAGE") {
            _self.el.nativeElement.querySelector("#welcomeMessage").innerText = data.value;
          }
          // if (data.key === "MESSAGE_SEND_SMS") {
          //   _self.el.nativeElement.querySelector("#smsMessage").innerText = data.value;
          // }
          if (routeFlag) {
            $(".progressbarItem1").addClass('active');
            $(".progressbarItem2").addClass('default');
            _self.router.navigate(['/reports'])
          }
        });
        this.NotificationService.notify('Experiences are saved successfully', 'success');
      },
      errRes => {
        this.NotificationService.notify('Experiences are not saved', 'error');
      }
    );
  }

  getTextEncoded(name?) {
    if (name) {
      return name.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    } else {
      return '';
    }
  }

  toShowModule(){
    Swal.fire({
      title: 'Heads up!',
      text: 'The changes made on the page will be lost if you navigate to the previous page. ',
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'kr-btn-delete',
        cancelButton: 'kr-btn-cancel'
      },
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/ivr']);
      }
    })
  }

}
