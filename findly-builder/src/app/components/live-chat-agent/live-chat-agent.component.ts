import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { MatDialog } from '@angular/material';
import { LiveChatAgentInstructionsComponent } from './../live-chat-agent-instructions/live-chat-agent-instructions.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { supportedLiveAgents } from 'src/app/data/supported-live-agents.mock';

@Component({
  selector: 'app-live-chat-agent',
  templateUrl: './live-chat-agent.component.html',
  styleUrls: ['./live-chat-agent.component.scss']
})
export class LiveChatAgentComponent implements OnInit {

  liveAgents: any[] = [];
  selectedAgent: any;
  selectedApp: any;
  instructions: any[] = [];
  activeTab: any;
  agentForm: FormGroup;
  sdkApps: any[] = [];
  selectedSdkApp: any;
  isAgentChanged: boolean = false;
  @Input() agentDetails: any;
  @Output() onUpdate = new EventEmitter();
  constructor(
    public workflowService: workflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.selectedApp = this.workflowService.deflectApps();
    this.workflowService.seedData$.subscribe(res => {
      if (!res) return;
      this.liveAgents = JSON.parse(JSON.stringify(res.deflectSeedData.supportedLiveAgents));
      // this.liveAgents = JSON.parse(JSON.stringify(supportedLiveAgents));

      this.liveAgents.forEach(agent => {
        agent.iconPath = this.workflowService.resolveHostUrl() + agent.iconPath;
        agent.fields = agent.fields.map(field => ({
          name: field.key,
          displayName: field.label,
          helpText: field.helpText,
          fieldType: field.fieldType, //staticlist //radio //textbox
          dataType: field.type,
          placeholder: field.placeholder || '',
          isOptional: field.isOptional,
          isMultiSelect: false,
          minLength: field.minLength,
          maxLength: field.maxLength,
          showCopy: field.copyIcon,
          isNew: true,
          listofvalues: field.listOfValues || [],
          defaultValue: field.defaultValue,
          isEditable: field.isEditable
        }));
      })
    });

    if (this.agentDetails && this.agentDetails.agentName) {
      this.getInstructions(this.agentDetails.agentName);
      this.selectedAgent = this.liveAgents.find(f => f.key === this.agentDetails.agentName);
      if (this.agentDetails.agentName === 'custom') {
        this.getSDKApps();
      }
      this.generateForm(true);

    }
  }

  generateForm(bindValues?: boolean) {
    const formFields = {};
    this.selectedAgent.fields.forEach(e => {
      const validators = [];
      if (!e.isOptional) { validators.push(Validators.required) }
      if (e.minLength) { validators.push(Validators.minLength(e.minLength)) }
      if (e.maxLength) { validators.push(Validators.maxLength(e.maxLength)) }
      if (e.dataType === 'email') { validators.push(Validators.email) }
      if (e.dataType === 'url') { validators.push(Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')) }

      if (this.selectedAgent.key === 'servicenow' && e.name === 'webhookURL') {
        const hostUrl = this.workflowService.resolveHostUrl();
        e.defaultValue = hostUrl + "/agentSdk/stream/" + (this.selectedApp._id || this.selectedApp[0]._id) + "/sendToUser";
      }
      formFields[e.name] = new FormControl((bindValues && this.agentDetails && this.agentDetails[e.name]) || e.defaultValue || '', validators);
    })
    this.agentForm = this.fb.group(formFields, { updateOn: "blur" });
    this.agentForm.valueChanges.subscribe(value => {
      this.onUpdate.emit({ agentName: this.selectedAgent.key, ...value });
    });
  }

  getInstructions(selectedAgent) {
    const _params = {
      'agentKey': selectedAgent.key
    }
    this.service.invoke('get.agent.instructions', _params).subscribe(res => {
      this.instructions = res;
    });
  }

  getSDKApps() {
    const _params = {
      'userId': this.authService.getUserId(),
      'appId': this.selectedApp._id || this.selectedApp[0]._id,
    }
    this.service.invoke('get.sdk.apps', _params).subscribe(res => {
      this.sdkApps = res.apps;
    });
  }

  onSdkAppChange(fieldName){
    setTimeout(()=>{
      const id = this.agentForm.get(fieldName).value;
      this.selectedSdkApp = this.sdkApps.find(f=>f.clientId === id);
    })
  }

  onAgentChange(selectedAgent) {
    this.selectedSdkApp = null;
    this.isAgentChanged = true;
    this.getInstructions(selectedAgent);

    if (selectedAgent.key === 'custom') {
      this.getSDKApps();
    }
    this.generateForm();
    this.agentForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });

  }

  updateCheckedStatus(controlName: string, value: string) {
    return this.agentForm.get(controlName).value === value;
  }

  openInstructions() {
    this.dialog.open(LiveChatAgentInstructionsComponent, {
      width: '80%',
      height: '90%',
      panelClass: 'live-chat-instructions-modal',
      data: {
        title: this.selectedAgent.label,
        instructions: this.instructions
      }
    })
  }

  isCompleted(): boolean {
    return this.agentForm && this.agentForm.valid;
  }

  isModified(){
    return (this.agentForm && this.agentForm.dirty) || this.isAgentChanged;
  }

  copyTextFromInput($event, value, elementId) {
    $event.stopPropagation();
    if(!value) return;
    $event.target.innerText = "Copied!";
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    setTimeout(() => {
      $event.target.innerText = "Copy";
    }, 500);
  }

}
