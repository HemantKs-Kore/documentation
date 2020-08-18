import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SideBarService } from '@kore.services/header.service';
import { workflowService } from '@kore.services/workflow.service';
import { DeflectAppConfig } from 'src/app/data/configurations.model';
import { of, forkJoin, Subject } from 'rxjs';
import { Manage_Deflection_Mock } from 'src/app/data/manage-deflection-exp.mock';
import { delay, finalize, switchMap } from 'rxjs/operators';
import { NotificationService } from '@kore.services/notification.service';
import { LiveChatAgentComponent } from './../live-chat-agent/live-chat-agent.component';
import { DEFLECT_CONFIG } from 'src/app/data/configurations.mock';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';

declare const $: any;

@Component({
  selector: 'app-manage-deflection',
  templateUrl: './manage-deflection.component.html',
  styleUrls: ['./manage-deflection.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ManageDeflectionComponent implements OnInit {
  toShowAppHeader: boolean;
  selectedApp: any;
  previewConfig: boolean = true;

  config: DeflectAppConfig;
  messages: any[] = [];
  isUpdated: boolean;
  completedPercentage: number = 0;
  allowSave: boolean = true;
  successMsg: string;
  errorMsg: string;

  //new
  selectedCountry: any;
  countryCodeDetailsFromSeedData: any[] = [];

  loading: boolean = true;
  showErrorScreen: boolean = false;

  @ViewChild(LiveChatAgentComponent) liveChatAgent: LiveChatAgentComponent;
  constructor(
    public workflowService: workflowService,
    private headerService: SideBarService,
    private router: Router,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    let toogleObj = {
      "title": "Call Flow Messages",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.selectedApp = this.workflowService.deflectApps();
    this.headerService.toggle(toogleObj);

    // this.config = this.workflowService.configurationData;
    // this.completedPercentage = this.workflowService.completedPercentage;

    // this.getMessages();

    this.workflowService.seedData$.subscribe(res => {
      if (!res) return;
      this.countryCodeDetailsFromSeedData = res.deflectSeedData.CountryCodeDetails;
      this.resloveData();
    });



  }

  resloveData() {
    this.loading = true;
    let _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }
    forkJoin(
      this.service.invoke('get.configuration', _params),
      this.service.invoke('get.callflow.data', _params)
    )
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {

        this.config = $.extend(true, {}, DEFLECT_CONFIG, res[0]);
        if (!this.config.handOff.formDetails.agentEmail) {
          const jStorage = JSON.parse(localStorage.getItem("jStorage"));
          this.config.handOff.formDetails.agentEmail = jStorage && jStorage.currentAccount && jStorage.currentAccount.userInfo.emailId;
        }
        this.selectedCountry = this.countryCodeDetailsFromSeedData.find(f => f.ISO === this.config.deflectConfiguration.phoneNumberConfigDetails.countryCode);
        if (this.config.deflectConfiguration.type === 'IVR' && !this.config.deflectConfiguration.sipDomainConfigDetails.sipDomainName) {
          // this.enableIntegration('sip')
        }
        // this.constructFormFields();
        this.setCompletedStatus();

        this.messages = res[1];
      }, err => {
        this.showErrorScreen = true;
        this.notificationService.notify("Failed to get messages", "error")
      })
  }

  getMessages() {
    // of(Manage_Deflection_Mock).pipe(delay(100)).subscribe((res => {
    //   this.messages = res;
    // }));

    let _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }

    this.service.invoke('get.callflow.data', _params).subscribe(res => {
      this.messages = res;
    });
  }

  onResume() {
    this.router.navigate(['/config']);
  }

  onSave(dialogRef?) {
    if (!this.isUpdated || !this.allowSave) return of(true);
    let _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }
    const payload = {}
    this.messages.forEach(e => {
      e.messages.forEach(msg => {
        payload[msg.key] = msg.value;
      })
    });

    this.allowSave = false;
    const canRedirect$ = new Subject();
    this.service.invoke('save.callflow.data', _params, payload)
      .pipe(finalize(() => {
        this.allowSave = true;
        setTimeout(() => { this.successMsg = ""; this.errorMsg = "" }, 5000);
        dialogRef.close();
      }))
      .subscribe(res => {
        this.isUpdated = false;
        // this.notificationService.notify("Your changes are saved successfully.", "success");

        this.successMsg = "Your changes are saved successfully.";
        canRedirect$.next(true);
      }, err => {
        const errMsg = err.error.errors && err.error.errors[0] && err.error.errors[0].msg;
        this.errorMsg = errMsg || "Failed to update configurations";
        canRedirect$.next(false);
      });
    return canRedirect$;
  }


  setFormCompletedStatus(status?: boolean) {
    if (status === false) {
      this.config.handOff.isFormCompleted = false;
    } else if (this.config.handOff.formSubmission && this.config.handOff.formDetails.agentEmail && this.config.handOff.formDetails.formName && this.config.handOff.formDetails.payloadFields.length) {
      this.config.handOff.isFormCompleted = true;
    }
    this.setCompletedPercentage();
  }

  setCompletedStatus() {
    if (this.config.deflectConfiguration.type === 'IVR') {
      this.config.deflectConfiguration.IVR.completed = !!this.config.deflectConfiguration.sipDomainConfigDetails.incomingIpAddresses.length;
    } else if (this.config.deflectConfiguration.type === 'phoneNumber') {
      this.config.deflectConfiguration.phoneNumber.completed = !!this.selectedCountry;
    }
    this.setFormCompletedStatus();
    this.setCompletedPercentage();

  }

  setCompletedPercentage() {
    setTimeout(() => {
      this.completedPercentage = 0;

      if (this.config.deflectConfiguration.type === 'IVR' && this.config.deflectConfiguration.IVR.completed) {
        this.completedPercentage += 50;
      } else if (this.config.deflectConfiguration.type === 'phoneNumber' && this.config.deflectConfiguration.phoneNumber.completed) {
        this.completedPercentage += 50;
      }

      const isAutomationEnabled = this.config.virtualAssistant.enabled && this.config.virtualAssistant.type;

      const isHandOffEnabled = this.config.handOff.liveAgent || this.config.handOff.formSubmission;

      let isHandOffCompleted;
      if (this.config.handOff.liveAgent) { this.config.handOff.isAgentDetailsCompleted = this.liveChatAgent.isCompleted() }
      // if (this.config.handOff.liveAgent) { this.config.handOff.isAgentDetailsCompleted = true}


      if (this.config.handOff.formSubmission && this.config.handOff.liveAgent) {
        isHandOffCompleted = (this.config.handOff.isFormCompleted && this.config.handOff.isAgentDetailsCompleted);
      } else if (this.config.handOff.formSubmission) {
        isHandOffCompleted = this.config.handOff.isFormCompleted;
      } else if (this.config.handOff.liveAgent) {
        isHandOffCompleted = this.config.handOff.isAgentDetailsCompleted;
      } else {
        isHandOffCompleted = false;
      }


      if (!isAutomationEnabled && !isHandOffEnabled) { return; }

      if (isAutomationEnabled && !isHandOffEnabled) { this.completedPercentage += 50; return; }

      if (isAutomationEnabled && isHandOffCompleted) {
        this.completedPercentage += 50;
      } else if (isAutomationEnabled) {
        this.completedPercentage += 25;
      } else if (isHandOffCompleted) {
        this.completedPercentage += 50;
      }
    });
  }

  canDeactivate() {

    if (!this.isUpdated) return true;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: "manage-deflection-exp-popup",
      data: {
        title: 'Confirmation',
        text: 'The changes made on the page are not yet saved.',
        text1: "These changes will be lost if you proceed to another page.",
        buttons: [{ key: 'save', label: 'Save & Proceed' }, {key: 'yes', label: 'Proceed' }, {key: 'no', label: 'Cancel' }]
      }
    });

    return dialogRef.componentInstance.onSelect
    .pipe(
      switchMap(result => {
        if (result === 'save') {
          return this.onSave(dialogRef);
        } else if (result === 'yes') {
          dialogRef.close();
          return of(true); 
        } else if (result === 'no') {
          dialogRef.close();
          return of(false);
        }
      })
    );
  }

}
