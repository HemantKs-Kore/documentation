import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { SideBarService } from '@kore.services/header.service';
import { DeflectAppConfig } from 'src/app/data/configurations.model';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { FormField, ManageFormDetails } from 'src/app/data/form-field.model';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray, NgForm } from '@angular/forms';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { finalize, delay, retry, switchMap, ignoreElements } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import { DEFLECT_CONFIG } from 'src/app/data/configurations.mock';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '@kore.services/notification.service';
import { LiveChatAgentComponent } from './../live-chat-agent/live-chat-agent.component';
import { EndPointsService } from '@kore.services/end-points.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { AuthService } from '@kore.services/auth.service';

declare const $: any;

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ConfigurationsComponent implements OnInit {
  toShowAppHeader: boolean;
  selectedApp: any;

  config: DeflectAppConfig;
  completedPercentage = 0;
  countryCodeDetailsFromSeedData: any[] = [];
  selectedCountry: any;
  phoneNumberType: 'local' | 'tollfree' = 'local';
  showArrow = true;
  loading: boolean = true;
  submitClicked: boolean;
  response: DeflectAppConfig;

  allowConfigSave: boolean = true;
  successMsg: string;
  errorMsg: string;
  emptyDeflectionType: boolean;

  formTitle; any;
  recipientEmail: any;
  isFormFieldModified: boolean = false;

  showFieldAddedSuccessMsg: boolean;
  showFieldUpdatedSuccessMsg: boolean;

  // Add field form variables -start
  addFieldForm: FormGroup;
  showPlaceholder: boolean = true;
  isOpenedForEdit = false;
  formFieldIndex: number;
  formFieldData: FormField;
  fieldTypeList = [{
    name: 'Date',
    id: 'date'
  }, {
    name: 'URL',
    id: 'url'
  }, {
    name: 'Textbox',
    id: 'textbox'
  }, {
    name: 'Static Dropdown',
    id: 'staticDropDown'
  }, {
    name: 'Textarea',
    id: 'textarea'
  }, {
    name: 'Type Ahead',
    id: 'typeahead'
  }, {
    name: 'Email',
    id: 'email'
  }, {
    name: 'File Upload',
    id: 'file'
  }, {
    name: 'Date & Time',
    id: 'datetime'
  }, {
    name: 'Time Zone',
    id: 'timezone'
  }];

  dataTypeList = [
    'string', 'number', 'boolean', 'email', 'array', 'date'
  ];
  dateFormatList = [
    'dd-MM-YYYY', 'MM-dd-YYYY', 'dd-MM-YY', 'YYYY-MM-dd'
  ]
  dateTimeFormat = ['dd-MM-yyyyThh:mm:ssZ', 'MM-dd-yyyyThh:mm:ssZ', 'dd-MM-yyThh:mm:ssZ', 'yyyy-MM-ddThh:mm:ssZ'];
  endPointContentType = [
    'JSON', 'RSS', 'XML', 'URL Encoded JSON', 'CSV', 'Text', 'Twitter Encoded JSON', 'Multipart/Form-data', 'Multipart/Related', 'Oracle ADF'
  ]
  endPointMethod = [
    'GET', 'POST'
  ];

  filePayloadOptions = [{
    id: 'filename',
    value: 'File Name'
  },
  {
    id: 'size',
    value: 'File Size'
  },
  {
    id: 'contentType',
    value: 'File Content Type'
  }];

  // Add field form variables -End

  showErrorScreen: boolean = false;
  showEditForm: boolean = false;

  showPhNumSlider: boolean = false;

  @ViewChild('mainScroll') componentRef?: PerfectScrollbarComponent;
  @ViewChild(LiveChatAgentComponent) liveChatAgent: LiveChatAgentComponent;
  @ViewChild('configForm') configForm: NgForm;
  constructor(
    public workflowService: workflowService,
    private headerService: SideBarService,
    private fb: FormBuilder,
    private router: Router,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private endPointService: EndPointsService,
    private localStoreService: LocalStoreService,
    private authService: AuthService
  ) { }

  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  @ViewChild('choosePhNumSlider') choosePhNumSlider: SliderComponentComponent;

  ngOnInit() {
    let toogleObj = {
      "title": "Configuration Page",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.selectedApp = this.workflowService.deflectApps();
    this.headerService.toggle(toogleObj);
    this.workflowService.seedData$.subscribe(res => {
      if (!res) return;
      this.countryCodeDetailsFromSeedData = res.deflectSeedData.CountryCodeDetails;
      this.getConfigurations();
    });

    // this.config = { ...this.config, ...this.workflowService.onboardingData }

    this.addFieldForm = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      helpText: [''],
      type: ['textbox', Validators.required],
      dataType: ['string', Validators.required],
      placeholder: '',
      isOptional: false,
      isMultiSelect: false
    });

    this.fieldType.valueChanges.subscribe((value) => this.onFieldTypeChange(value));
  }


  openEditForm() {
    this.showEditForm = true;
    this.sliderComponent.openSlider("#edit-form", "right500 width90");
  }

  closeEditForm(allFormData) {
    this.showEditForm = false;

    this.config.handOff.formDetails.formName = allFormData.formData.formName;
    this.config.handOff.formDetails.agentEmail = allFormData.formData.agentEmail;
    this.config.handOff.formDetails.payloadFields = allFormData.formResults;
    this.constructFormFields();

    this.sliderComponent.closeSlider("#edit-form");
    if (allFormData.isUpdated) {
      this.showFieldUpdatedSuccessMsg = true;
      setTimeout(() => {
        this.showFieldUpdatedSuccessMsg = false;
      }, 2000);
    }

  }

  getConfigurations() {
    this.loading = true;
    const _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }
    this.service.invoke('get.configuration', _params)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe((res: DeflectAppConfig) => {
        this.response = res;
        this.config = $.extend(true, {}, DEFLECT_CONFIG, res);
        if (!this.config.handOff.formDetails.agentEmail) {
          // const jStorage = JSON.parse(localStorage.getItem("jStorage"));
          // this.config.handOff.formDetails.agentEmail = jStorage && jStorage.currentAccount && jStorage.currentAccount.userInfo.emailId;
        }
        this.selectedCountry = this.countryCodeDetailsFromSeedData.find(f => f.ISO === this.config.deflectConfiguration.phoneNumberConfigDetails.countryCode);
        if (this.config.deflectConfiguration.type === 'IVR' && !this.config.deflectConfiguration.sipDomainConfigDetails.sipDomainName) {
          this.enableIntegration('sip')
        }
        if (!this.config.deflectConfiguration.type) {
          this.config.deflectConfiguration.type = 'IVR';
          if (!this.config.deflectConfiguration.sipDomainConfigDetails.sipDomainName) { this.emptyDeflectionType = true; }
        }
        this.constructFormFields();
        this.setCompletedStatus();

        setTimeout(() => {
          const scrollTo = this.route.snapshot.queryParamMap.get("scrollTo");
          if (scrollTo) { this.scrollTo(scrollTo) }
        }, 10)
      }, error => {
        console.log(error);
        this.showErrorScreen = true;
        this.notificationService.notify("Failed to get configurations", 'error');
      });

  }

  get fieldType() {
    return this.addFieldForm.get('type') as FormControl;
  }

  constructFormFields() {
    this.config.handOff.formDetails.payloadFields = this.config.handOff.formDetails.payloadFields.map((field: any) => ({
      _id: field._id,
      name: field.key,
      displayName: field.title,
      helpText: field.help,
      type: field.fieldType,
      dataType: field.type,
      placeholder: field.placeholder || '',
      isOptional: !field.isRequired,
      isMultiSelect: field.isMultiSelect,

      dFormat: field.format,
      dTFormat: field.format,

      defaultOption: field.defaultOption,
      dOptions: field.staticDropDownFields ? field.staticDropDownFields.map(e => ({ name: e.title, value: e.value })) : [],

      endPointUrl: field.dynamicDropDownInfo ? field.dynamicDropDownInfo.endPoint.protocol + "//" + field.dynamicDropDownInfo.endPoint.host + (field.dynamicDropDownInfo.endPoint.path !== '/' ? '/' + field.dynamicDropDownInfo.endPoint.path : '') : '',
      endPointContType: field.dynamicDropDownInfo ? field.dynamicDropDownInfo.endPoint['content-type'] : '',
      endPointMethod: field.dynamicDropDownInfo ? field.dynamicDropDownInfo.endPoint.method : '',
      responsePath: field.dynamicDropDownInfo ? field.dynamicDropDownInfo.responsePath : '',
      labelKey: field.dynamicDropDownInfo ? field.dynamicDropDownInfo.keyForLabel : '',
      optValKey: field.dynamicDropDownInfo ? field.dynamicDropDownInfo.keyForValue : '',

      fileOptions: (() => {
        if (!field.fileMeta) return [];
        const arr = [];
        Object.keys(field.fileMeta).forEach(k => {
          const value = field.fileMeta[k].replace("&lt;%=", "").replace("=%&gt;", "");
          arr.push({ name: k, value: value })
        });
        return arr;
      })(),
      allowMultipleFiles: field.allowMultiple
    }));

  }

  onFieldTypeChange(value) {
    this.removeAdditonaliControls();
    if (!value) return;
    switch (value) {
      case 'date':
        if (this.isOpenedForEdit && this.formFieldData.type === 'datetime') {
          this.addControl('dFormat', new FormControl(this.formFieldData.dFormat, Validators.required));
        } else {
          this.addControl('dFormat', new FormControl('MM-dd-YYYY', Validators.required));
        }

        this.showPlaceholder = false;
        break;
      case 'url':
        break;
      case 'textbox':
        break;
      case 'staticDropDown':
        if (this.isOpenedForEdit && this.formFieldData.type === 'staticDropDown') {
          const fromGroupArr = [];
          this.formFieldData.dOptions.forEach(op => {
            fromGroupArr.push(this.fb.group({
              name: [op.name, Validators.required],
              value: [op.value, Validators.required]
            }))
          });
          this.addControl('dOptions', this.fb.array(fromGroupArr));
          this.addControl('defaultOption', new FormControl(this.formFieldData.defaultOption));
        } else {
          this.addControl('dOptions', this.fb.array([this.creatOptionControl()]));
          this.addControl('defaultOption', new FormControl(0));
        }

        this.showPlaceholder = false;
        break;
      case 'textarea':
        break;
      case 'typeahead':
        if (this.isOpenedForEdit && this.formFieldData.type === 'typeahead') {
          this.addControl('endPointUrl', new FormControl(this.formFieldData.endPointUrl, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]));
          this.addControl('endPointContType', new FormControl(this.formFieldData.endPointContType, Validators.required));
          this.addControl('endPointMethod', new FormControl(this.formFieldData.endPointMethod, Validators.required));
          this.addControl('responsePath', new FormControl(this.formFieldData.responsePath, Validators.required));
          this.addControl('labelKey', new FormControl(this.formFieldData.labelKey, Validators.required));
          this.addControl('optValKey', new FormControl(this.formFieldData.optValKey, Validators.required));
        } else {
          this.addControl('endPointUrl', new FormControl('', Validators.required));
          this.addControl('endPointContType', new FormControl('JSON', Validators.required));
          this.addControl('endPointMethod', new FormControl('GET', Validators.required));
          this.addControl('responsePath', new FormControl('', Validators.required));
          this.addControl('labelKey', new FormControl('', Validators.required));
          this.addControl('optValKey', new FormControl('', Validators.required));
        }
        break;
      case 'email':
        break;
      case 'file':
        if (this.isOpenedForEdit && this.formFieldData.fileOptions) {
          const fromGroupArr = [];
          this.formFieldData.fileOptions.forEach(op => {
            fromGroupArr.push(this.fb.group({
              name: [op.name, Validators.required],
              value: [op.value, Validators.required]
            }))
          });
          this.addControl('fileOptions', this.fb.array(fromGroupArr));
          this.addControl('allowMultipleFiles', new FormControl(this.formFieldData.allowMultipleFiles))
        } else {
          this.addControl('fileOptions', this.fb.array([this.creatOptionControl()]));
          this.addControl('allowMultipleFiles', new FormControl(false))
        }
        this.showPlaceholder = false;
        break;
      case 'datetime':
        if (this.isOpenedForEdit && this.formFieldData.type === 'datetime') {
          this.addControl('dTFormat', new FormControl(this.formFieldData.dTFormat, Validators.required));
        } else {
          this.addControl('dTFormat', new FormControl('MM-dd-yyyyThh:mm:ssZ', Validators.required));
        }
        this.showPlaceholder = false;
        break;
      case 'timezone':
        this.showPlaceholder = false;
        break;

    }
  }

  addControl(name: string, control: AbstractControl) {
    this.addFieldForm.addControl(name, control);
  }

  removeControl(name: string) {
    this.addFieldForm.removeControl(name);
  }

  removeAdditonaliControls() {
    //date
    this.removeControl("dFormat");

    //datetime
    this.removeControl("dTFormat")

    //staticDropDown
    this.removeControl("dOptions");
    this.removeControl("defaultOption");

    // typeahead
    this.removeControl('endPointUrl');
    this.removeControl('endPointContType');
    this.removeControl('endPointMethod');
    this.removeControl('responsePath');
    this.removeControl('labelKey');
    this.removeControl('optValKey');

    //file
    this.removeControl("fileOptions");
    this.removeControl("allowMultipleFiles");

    this.showPlaceholder = true;
  }

  addDropdownOption() {
    (this.addFieldForm.get('dOptions') as FormArray).push(this.creatOptionControl());
  }

  removeDropdownOption(index: number) {
    const defaultOption = this.addFieldForm.controls.defaultOption.value;
    if (index < defaultOption) {
      this.addFieldForm.controls.defaultOption.setValue(defaultOption - 1);
    } else if (index === defaultOption) {
      this.addFieldForm.controls.defaultOption.setValue(0);
    }
    (this.addFieldForm.get('dOptions') as FormArray).removeAt(index);
  }

  addFileOption() {
    (this.addFieldForm.get('fileOptions') as FormArray).push(this.creatOptionControl());
  }

  removeFileOption(index: number) {
    (this.addFieldForm.get('fileOptions') as FormArray).removeAt(index);
  }

  creatOptionControl(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  chooseDefaultOption(i: number) {
    this.addFieldForm.controls.defaultOption.setValue(i);
  }

  removeField(index: number) {
    this.config.handOff.formDetails.payloadFields.splice(index, 1);
    this.isFormFieldModified = true;
  }

  addField() {
    if (this.isOpenedForEdit) {
      this.config.handOff.formDetails.payloadFields.splice(this.formFieldIndex, 1, this.addFieldForm.value);
      this.showFieldUpdatedSuccessMsg = true;
    } else {
      this.config.handOff.formDetails.payloadFields.push(this.addFieldForm.value);
      this.showFieldAddedSuccessMsg = true;
    }

    setTimeout(() => {
      this.showFieldAddedSuccessMsg = false;
      this.showFieldUpdatedSuccessMsg = false;
    }, 2000);
    this.isFormFieldModified = true;
  }

  onClickFormField(field: FormField, index: number) {
    this.isOpenedForEdit = true;
    this.formFieldIndex = index;
    this.formFieldData = field;
    this.addFieldForm.patchValue(field);
  }

  setAddFieldFormDefaults() {
    const defaults = {
      name: '',
      displayName: '',
      helpText: '',
      type: 'textbox',
      dataType: 'string',
      placeholder: '',
      isOptional: true,
      isMultiSelect: false
    }
    this.addFieldForm.patchValue(defaults);
  }


  scrollTo(elementId: string) {
    if (this.workflowService.disablePerfectScroll) {
      document.querySelector('#' + elementId).scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      this.componentRef.directiveRef.scrollToElement('#' + elementId, 0, 500)
    }
  }


  OnDrawerClose() {
    this.isOpenedForEdit = false;
    this.removeAdditonaliControls();
    this.addFieldForm.reset();
    this.setAddFieldFormDefaults();
  }

  openPhNumSlider() {
    this.choosePhNumSlider.openSlider("#phNumSlider", "general");
    this.showPhNumSlider = true;
  }

  closePhNumSlider($event) {
    this.showPhNumSlider = false;
    this.choosePhNumSlider.closeSlider("#phNumSlider");

    if ($event && $event.phoneNumber) {
      this.config.deflectConfiguration.phoneNumberConfigDetails.phoneNumber = $event.phoneNumber;
      this.config.deflectConfiguration.phoneNumber.completed = true;
      this.setCompletedPercentage();
    }
  }

  onClickCountryCode(item) {
    this.selectedCountry = item;
  }

  onBlurIpAddress(isValid: boolean) {
    this.config.deflectConfiguration.IVR.completed = isValid;
    this.setCompletedPercentage();
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

  onLiveChatAgentChanges($event) {
    this.config.handOff.agentDetails = $event;
    this.setCompletedPercentage();
  }

  onScrollDown($event) {
    this.ngZone.run(() => {
      this.showArrow = false;
    });

  }

  copyTextFromInput($event, inputElement) {
    $event.stopPropagation();
    const text = $event.target.innerText;
    $event.target.innerText = "Copied!"
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    setTimeout(() => {
      $event.target.innerText = text
    }, 500);
  }

  checkIVRStatus() {
    if (!this.config.deflectConfiguration.sipDomainConfigDetails.sipDomainName) {
      this.enableIntegration('sip');
    }
    this.setCompletedStatus();
  }

  enableIntegration(type: string) {
    let _payload;
    let _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }
    if (type === "sip") {
      _payload = {
        "integrationType": "sipDomainTransfer",
      }
    } else {
      _payload = {
        "integrationType": "phoneNumberTransfer",
        "countryCode": this.selectedCountry['ISO']
      }

      if(_payload.countryCode === 'US'){
        _payload.phoneNumberType = this.phoneNumberType
      }
    }
    this.service.invoke('enable.ivr.configuration', _params, _payload).subscribe(
      res => {
        if (type === "sip") {
          this.emptyDeflectionType = false;
          res.channels.forEach(value => {
            if (value.type === "twiliovoice") {
              this.config.deflectConfiguration.sipDomainConfigDetails.sipDomainName = value.sipConfigDetails.sipDomainName;
            }
          });
        } else {
          res.channels.forEach(value => {
            if (value.type === "twiliovoice") {
              this.config.deflectConfiguration.phoneNumberConfigDetails.phoneNumber = value.phoneNumberConfigDetails.phoneNumber;
              this.config.deflectConfiguration.phoneNumber.completed = true;
              this.setCompletedPercentage();
            }
          });
        }
      },
      errRes => {
        this.notificationService.notify("Failed to enable " + type + " configurations", 'error');
      }
    );
  }

  createFormFieldPayload(field: FormField, index: number) {
    const payload: any = {};
    payload.key = field.name;
    payload.title = field.displayName;
    payload.help = field.helpText;
    payload.fieldType = field.type;
    if (field.type === 'date') {
      payload.format = field.dFormat;
    }
    else if (field.type === 'url' || field.type === 'textbox' || field.type === 'textarea' || field.type === 'email') {
      payload.placeholder = field.placeholder;
    }
    else if (field.type === 'typeahead') {
      payload.dynamicDropDownInfo = {};
      payload.dynamicDropDownInfo.endPoint = {};
      let endPUrl = new URL(field.endPointUrl);
      payload.dynamicDropDownInfo.endPoint.host = endPUrl.host;
      payload.dynamicDropDownInfo.endPoint.path = endPUrl.pathname;
      payload.dynamicDropDownInfo.endPoint.protocol = endPUrl.protocol;
      payload.dynamicDropDownInfo.endPoint['content-type'] = field.endPointContType;
      payload.dynamicDropDownInfo.endPoint.method = field.endPointMethod;
      payload.dynamicDropDownInfo.keyForLabel = field.labelKey;
      payload.dynamicDropDownInfo.keyForValue = field.optValKey;
      payload.dynamicDropDownInfo.responsePath = field.responsePath;
    }
    else if (field.type == 'datetime') {
      payload.format = field.dTFormat;
    }
    else if (field.type == 'staticDropDown') {
      payload.staticDropDownFields = field.dOptions.map(e => ({ title: e.name, value: e.value }));
      payload.isSearchable = false;
      payload.defaultOption = field.defaultOption;
    }
    else if (field.type == 'file') {
      payload.fileMeta = {};
      field.fileOptions.forEach(e => { payload.fileMeta[e.name] = `<%=${e.value}=%>`; });
    }
    payload.isRequired = !field.isOptional;
    payload.isMultiSelect = field.isMultiSelect;
    payload.getFromSession = {
      enabled: false
    };
    payload.type = field.dataType;
    payload.dependsOn = [];
    payload.transpose = false;
    payload.metadata = 'label';
    payload.fieldIndex = index;

    return payload;
  }

  canDeactivate() {
    if (!this.configForm) return true;
    const isModified = this.configForm.dirty || this.isFormFieldModified || (this.liveChatAgent && this.liveChatAgent.isModified());

    if (!isModified) return true;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: "manage-deflection-exp-popup",
      data: {
        title: 'Confirmation',
        text: 'The changes made on the page are not yet saved.',
        text1: "These changes will be lost if you proceed to another page.",
        buttons: [{ key: 'save', label: 'Save & Proceed' }, { key: 'yes', label: 'Proceed' }, { key: 'no', label: 'Cancel' }]
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

  markAsPristine() {
    this.configForm.form.markAsPristine();
    this.isFormFieldModified = false;
    if (this.liveChatAgent && this.liveChatAgent.agentForm) {
      this.liveChatAgent.agentForm.markAsPristine();
      this.liveChatAgent.isAgentChanged = false;
    }
  }

  onSave(dialogRef?) {
    this.submitClicked = true;
    if (!this.allowConfigSave) { return of(true); }

    // if ((this.config.deflectConfiguration.type === 'IVR' && !this.config.deflectConfiguration.IVR.completed) || (this.config.deflectConfiguration.type === 'phoneNumber' && !this.config.deflectConfiguration.phoneNumberConfigDetails.phoneNumber)) {
    //   this.scrollTo('deflectConfiguration');
    //   this.notificationService.notify('Please complete deflect setup', 'error');
    //   return;
    // } else if (this.config.handOff.formSubmission && !this.config.handOff.isFormCompleted) {
    //   this.scrollTo('handOff');
    //   this.notificationService.notify('Please complete forms section', 'error');
    //   return;
    // }


    const payload = JSON.parse(JSON.stringify(this.config));
    payload.deflectConfiguration.phoneNumberConfigDetails.countryCode = this.selectedCountry ? this.selectedCountry['ISO'] : '';
    if (!Array.isArray(payload.deflectConfiguration.sipDomainConfigDetails.incomingIpAddresses)) {
      payload.deflectConfiguration.sipDomainConfigDetails.incomingIpAddresses = payload.deflectConfiguration.sipDomainConfigDetails.incomingIpAddresses.split(",");
    }

    payload.handOff.formDetails.payloadFields = payload.handOff.formDetails.payloadFields.map((field, i) => this.createFormFieldPayload(field, i));

    delete payload.deflectConfiguration.IVR;
    delete payload.deflectConfiguration.phoneNumber;
    delete payload.virtualAssistant.voice;
    delete payload.virtualAssistant.chat;
    delete payload.handOff.isFormCompleted;

    const _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }

    this.allowConfigSave = false;
    const canRedirect$ = new Subject();
    this.service.invoke('post.configuration', _params, payload)
      .pipe(finalize(() => {
        this.allowConfigSave = true;
        setTimeout(() => { this.successMsg = ""; this.errorMsg = "" }, 5000);
        if(dialogRef) {
          dialogRef.close();
        }
      })).subscribe(res => {
        this.markAsPristine();
        this.successMsg = "Your changes are saved successfully.";
        canRedirect$.next(true);
      }, err => {
        const errMsg = err.error.errors && err.error.errors[0] && err.error.errors[0].msg;
        this.errorMsg = errMsg || "Failed to update configurations";
        // this.notificationService.notify("Failed to update configurations", 'error');

        canRedirect$.next(false);
      });

    return canRedirect$;

  }

  launchPlatform() {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: "manage-deflection-exp-popup",
      data: {
        title: 'Confirmation',
        text: 'You will now be navigated to the Kore.ai Virtual',
        text1: 'Assistant Platform.',
        buttons: [{ key: 'yes', label: 'Proceed' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.showLearnMore = true;

    dialogRef.componentInstance.onSelect.subscribe(result => {
      if (result === 'yes') {

        const url = this.workflowService.resolveHostUrl() + "/botbuilder";
        this.service.invoke('get.token').subscribe(res => {
          if (res.token) {
            const qp = {
              streamId: this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id,
              selectedAccount: (this.localStoreService.getSelectedAccount() && this.localStoreService.getSelectedAccount().accountId) || (this.authService.getSelectedAccount() && this.authService.getSelectedAccount().accountId)
            }
            const encodedQueryParams = btoa(JSON.stringify(qp));
            const finalUrl = `${url}/?qp=${encodedQueryParams}#id_token=${res.token}`;
            window.open(finalUrl, "_blank")
          }
        });
      } else if (result === 'learnMore') {
        window.open("https://developer.kore.ai/docs/bots/bot-builder-tool/dialog-task/dialog-tasks/");
        return;
      }

      dialogRef.close();
    });
  }

}
