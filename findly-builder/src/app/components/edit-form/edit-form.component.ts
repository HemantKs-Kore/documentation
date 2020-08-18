import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import  clonedeep from 'lodash.clonedeep';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { SideBarService } from '@kore.services/header.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { EditField, PayloadField, FormFieldPayload, FormFieldPayloadMini, FIELD_TYPE_LIST, DEFAULT_FIELDS, ENDPOINT_CONTENT_TYPE, DATE_TIME_FORMAT, YES_NO, FILE_ELEMENT } from '../../data/edit-field.model';

import * as _ from 'underscore';
declare const $: any;

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class EditFormComponent implements OnInit {

  @Output() closed = new EventEmitter();

  closeSlider() {
    this.closed.emit({'formResults':this.getResults, 'formData': this.getFormData, 'isUpdated': this.isUpdatedForm});
  }
  registerForm: FormGroup;
  toShowAppHeader: boolean;
  selectedApp: any;
  renderedData: any;
  publishSuccess: any;
  saveInProgress: boolean = false;
  isLoading: boolean = true;
  getResultsDup: any;
  isInEditMode: boolean = false;
  editFieldName: string = "";
  fieldNameList: any = [];
  editFieldIndex: any;
  staticDropDownSelection: any;
  tempDataSave: any = null;
  defaultValList: any = [{
    name: "",
    value: ""
  }];
  tempResults: EditField;
  isUpdatedForm: boolean = false;
  isNewStatic: boolean = false;
  reg = '(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  regEmail = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  dataTypeList = [
    'string', 'number', 'boolean', 'email', 'array', 'date'
  ];
  dateFormatList = [
    'dd-MM-YYYY', 'MM-dd-YYYY', 'dd-MM-YY', 'YYYY-MM-dd'
  ]
  endPointContentType = ENDPOINT_CONTENT_TYPE;
  endPointMethod = [
    'GET', 'POST'
  ];
  listIsOpt = YES_NO;
  listIsMult = YES_NO;
  listSearchable = YES_NO;
  allowMultiple = YES_NO;
  dateTimeFormat = DATE_TIME_FORMAT;
  payloadFieldValueList = ['File Name', 'File Size', 'File Content Type'];
  isSearchable: string = "Yes";
  isMultipleFile: string = "Yes";
  selected = DEFAULT_FIELDS;
  isFileNewAdded: boolean = false;
  payloadFileKey: string;
  addFileList:any = [FILE_ELEMENT];
  isEditFile: boolean = false;
  submitted: boolean = false;
  isFormNameSaving: boolean = false;
  isAgentEmailSaving: boolean = false;

  constructor(public dialog: MatDialog, 
    private service:ServiceInvokerService,
    public workflowService:workflowService,
    private NotificationService: NotificationService,
    private router: Router,
    private headerService:SideBarService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    let toogleObj = {
      "title": "Manage Forms",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.registerForm = this.formBuilder.group({
      url: ['', Validators.required],
      textbox: ['', Validators.required],
      textarea: [''],
      endpointUrl: ['', Validators.pattern(this.reg)],
      responsePath: [''],
      labelKey: [''],
      optValKey: [''],
      email: ['']
    });
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.headerService.toggle(toogleObj);
    this.dataSource.sort = this.sort;
    this.selectedApp = this.workflowService.deflectApps();
    this.getAllFields();
    this.recipientEmail = JSON.parse(localStorage.getItem("jStorage")).currentAccount.userInfo.emailId;
  }

  get fval() {
    return this.registerForm.controls;
  }

  onListDrop(event: CdkDragDrop<string[]>) {
    // Swap the elements around
    this.saveInProgress = true;
    // console.log(`Moving item from ${event.previousIndex} to index ${event.currentIndex}`)
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // console.log(`event.container ${event.container.data}`)

    const self = this;
    let _params = {
      "appId":  this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
    };
    
    for(let i=0; i<this.dataSource.data.length; i++) {
      for(let j=0; j<this.getResults.length; j++) {
        if(this.dataSource.data[i].fieldName == this.getResults[j].key) {
          this.getResults[j].fieldIndex = i;
          // break;
        }
      }
    }
    var temp = [];
    for(let i=0; i<this.getResults.length; i++) {
      temp[Number(this.getResults[i].fieldIndex)] =  clonedeep(this.getResults[i]);
    }
    // this.getResults = [];
    this.getResults = clonedeep(temp);    
    let finalPayload = {
      payloadField: this.getResults,
      formData: {
        formName: this.formTitle,
        agentEmail: this.recipientEmail      
      }
    };

    this.service.invoke('put.updateFormFields',_params, finalPayload).subscribe(
      res => {     
        this.saveInProgress = false;
        this.getResults = res[0].payloadField;
        this.getResultsDup = clonedeep(this.getResults);
        let formElements  = _.map(this.getResults, o => new PayloadField(o));
        self.dataSource = new MatTableDataSource(formElements);
        this.isUpdatedForm = true;
        this.NotificationService.notify('Form field updated successfully', 'success');
      },
      errRes => {
        this.NotificationService.notify('Failed to update form field', 'error');
        this.saveInProgress = false;
      }
    );

  }

  details = {
    head:"Manage Forms",
    desc: "Define the fields to be presented to your customers for capturing their queries"
  };
  displayedColumns: string[] = ['fieldName', 'helpText', 'dataType', 'fieldType', 'isOptional', 'isMultiSelect', 'operation'];
  fieldTypeList = FIELD_TYPE_LIST;
  dataSource:any = [];
  formTitle: string = "Submit Request";
  getResults: any;
  getFormData: any;
  expandedElement: null;
  @ViewChild(MatSort) sort: MatSort;
  recipientEmail: string;
  isSavedFormTitle: boolean = false;
  isSavedEmailId: boolean = false;

  resetEdit() {
    this.selected = DEFAULT_FIELDS;
    this.addFileList = [FILE_ELEMENT];
    this.defaultValList = [{
      name: "",
      value: ""
    }];
    this.staticDropDownSelection = null;
    this.isInEditMode = false;
    this.editFieldIndex = null;
    this.editFieldName = null;
    this.expandedElement = undefined;
  }

  addNewOptionField() {
    this.defaultValList.push({
      name: "",
      value: ""
    });
    this.isNewStatic = true;
    setTimeout(()=> {
      this.isNewStatic = false;
    }, 2500);
  }

  editElement(row) {
    if(this.expandedElement && this.isInEditMode) {
      return;
    }
    this.expandedElement = !row.isEdit? null : row;
    this.fTChange(row);
    if(row.isEdit) {
      this.isInEditMode = true;
    }
    let temp = this.getResults[row.fieldIndex];
    if(row.fieldType == "date") {
      this.selected.dFormat = temp.format;
    }
    else if(row.fieldType == "url") {
      this.registerForm.get('url').setValue(temp.placeholder);
    }
    else if(row.fieldType == "textbox") {
      this.registerForm.get('textbox').setValue(temp.placeholder);
    }
    else if(row.fieldType == "staticDropDown") {
      this.defaultValList = [];
      for(let i=0; i<temp.staticDropDownFields.length; i++) {
        let obj = {
          name: temp.staticDropDownFields[i].title,
          value: temp.staticDropDownFields[i].value,
          edit: false
        }
        this.defaultValList.push(obj);
      }
      this.isSearchable = temp.isSearchable?"Yes":"No";
      this.staticDropDownSelection = temp.value;
    }
    else if(row.fieldType == "textarea") {
      this.registerForm.get('textarea').setValue(temp.placeholder);
      
    }
    else if(row.fieldType == "typeahead") {
      this.registerForm.get('endpointUrl').setValue(temp.dynamicDropDownInfo.endPoint.protocol + "//" + temp.dynamicDropDownInfo.endPoint.host + temp.dynamicDropDownInfo.endPoint.path);
      this.selected.endPointContType = temp.dynamicDropDownInfo.endPoint['content-type'];
      this.selected.endPointMethod = temp.dynamicDropDownInfo.endPoint.method;
      this.registerForm.get('labelKey').setValue(temp.dynamicDropDownInfo.keyForLabel);
      this.registerForm.get('optValKey').setValue(temp.dynamicDropDownInfo.keyForValue);
      this.registerForm.get('responsePath').setValue(temp.dynamicDropDownInfo.responsePath);
    }
    else if(row.fieldType == "email") {
      this.registerForm.get('email').setValue(temp.placeholder);
    }
    else if(row.fieldType == "file") {
      this.addFileList = [];
      this.isMultipleFile = temp.allowMultiple?'Yes':'No';
      for(let key in temp.fileMeta) {
        let obj = {
          name: key,
          value: '',
          edit: false
        };
        if(temp.fileMeta[key].indexOf("filename") != -1) {
          obj.value = "File Name";
        }
        else if(temp.fileMeta[key].indexOf("size") != -1) {
          obj.value = "File Size";
        }
        else if(temp.fileMeta[key].indexOf("contentType") != -1) {
          obj.value = "File Content Type";
        }
        this.addFileList.push(obj);
      }
    }
    else if(row.fieldType == "datetime") {
      this.selected.dTFormat = temp.format;
    }
  }


  fTChange(element) {
    let registerForms = ['url', 'textbox', 'textarea', 'email', 'endpointUrl', 'responsePath', 'labelKey', 'optValKey'];
    let fieldTypeCheck = ['url', 'textbox', 'textarea', 'email'];
    if(fieldTypeCheck.indexOf(element.fieldType) > -1) {
      registerForms.forEach(o=>{
        if(o === element.fieldType) {
          this.registerForm.get(o).setValidators([Validators.required]);
          if(this.isInEditMode) {
            this.registerForm.get(o).setValue("");
          }
        }
        else {
          this.registerForm.get(o).setValidators(null);
        }
      });
    }
    else if(element.fieldType == 'typeahead') {
      registerForms.forEach(o=>{
        if(o === 'endpointUrl') {
          this.registerForm.get(o).setValidators([Validators.required, Validators.pattern(this.reg)]);
          if(this.isInEditMode) {
            this.registerForm.get(o).setValue("");
          }
        }
        else if(o=='responsePath' || o === 'labelKey' || o === 'optValKey') {
          this.registerForm.get(o).setValidators([Validators.required]);
          if(this.isInEditMode) {
            this.registerForm.get(o).setValue("");
          } 
        }
        else {
          this.registerForm.get(o).setValidators(null);
        }
        if(this.isInEditMode) {
          this.selected.endPointContType = "JSON";
          this.selected.endPointMethod = "GET";
        }
      });
    }
    else {
      registerForms.forEach(o=>{
          this.registerForm.get(o).setValidators(null);
      });
    }
    registerForms.forEach(o=>{
      this.registerForm.get(o).updateValueAndValidity();
    });
    this.submitted = false;
  }

  deleteDefVal(det) {
    if(this.defaultValList.length == 1) {
      this.defaultValList[0].name = "";
      this.defaultValList[0].value = "";
      this.staticDropDownSelection = null;
      return;
    }
    for(var i=0; i<this.defaultValList.length; i++) {
      if(this.defaultValList[i].name == det.name && this.defaultValList[i].value == det.value) {
        if(this.staticDropDownSelection == det.value) {
          this.staticDropDownSelection = null;
        }
        break;
      }
    }
    this.defaultValList.splice(i,1);
  }

  deleteAllFiles() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete all the files.",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'kr-btn-delete',
        cancelButton: 'kr-btn-cancel'
      },
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      
    }).then((result) => {
      if(result.value) {
        this.addFileList = [FILE_ELEMENT];
      }
    });
  }

  deleteFileUpload(i) {
    if(this.addFileList.length == 1) {
      this.addFileList[0].name = "";
      this.addFileList[0].value = "";
      return;
    }
    this.addFileList.splice(i, 1);
  }

  setResponse(res) {
    let configResp = _.find(res, (o)=>{return o.state == 'configured' || o.state == 'upgradeInProgress'});
    this.getResults = configResp.payloadField;
    this.getResultsDup = clonedeep(this.getResults);
    this.getFormData = configResp.formData;
    this.dataSource = new MatTableDataSource(_.map(this.getResults, o => new PayloadField(o) ));
    this.fieldNameList = _.pluck(this.getResults, 'key').map(o=>o.toLowerCase());
    this.formTitle = this.getFormData.formName;
    this.recipientEmail = this.getFormData.agentEmail;
    setTimeout(()=>{
      this.dataSource.sort = this.sort;
    });
  }

  getAllFields() {
    const self = this;
    let _params = {
      'appId': self.selectedApp._id|| self.selectedApp[0]._id
    }
    this.service.invoke('get.getFormFields',_params)
    .pipe(
      finalize(()=>{this.isLoading = false;})
    )
    .subscribe((res: EditField[]) => {
      this.setResponse(res);
    });
  }

  payloadBuild(payloadForm) {
    if(payloadForm.fieldType == 'date') {
      payloadForm.format = this.selected.dFormat;
    } 
    else if (payloadForm.fieldType == 'url') {
      payloadForm.placeholder = this.registerForm.get('url').value;
    }
    else if(payloadForm.fieldType == 'textbox') {
      payloadForm.placeholder = this.registerForm.get('textbox').value;
    }
    else if(payloadForm.fieldType == 'textarea') {
      payloadForm.placeholder = this.registerForm.get('textarea').value;
    }
    else if (payloadForm.fieldType == 'email') {
      payloadForm.placeholder = this.registerForm.get('email').value;
    }
    else if(payloadForm.fieldType == 'typeahead') {
      payloadForm.dynamicDropDownInfo = {};
      payloadForm.dynamicDropDownInfo.endPoint = {};
      let endPUrl = new URL(this.registerForm.get('endpointUrl').value);
      payloadForm.dynamicDropDownInfo.endPoint.host = endPUrl.host;
      payloadForm.dynamicDropDownInfo.endPoint.path = endPUrl.pathname;
      payloadForm.dynamicDropDownInfo.endPoint.protocol = endPUrl.protocol;
      payloadForm.dynamicDropDownInfo.endPoint['content-type'] = this.selected.endPointContType;
      payloadForm.dynamicDropDownInfo.endPoint.method = this.selected.endPointMethod;
      payloadForm.dynamicDropDownInfo.keyForLabel = this.registerForm.get('labelKey').value;
      payloadForm.dynamicDropDownInfo.keyForValue = this.registerForm.get('optValKey').value;
      payloadForm.dynamicDropDownInfo.responsePath = this.registerForm.get('responsePath').value;
    }
    else if(payloadForm.fieldType == 'datetime') {
      payloadForm.format = this.selected.dTFormat;
    }
    else if(payloadForm.fieldType == 'staticDropDown') {
      payloadForm.staticDropDownFields = [];
      for(let i=0; i<this.defaultValList.length; i++) {
        if(this.defaultValList[i].name == "" || this.defaultValList[i].value == "") {
          this.NotificationService.notify("Please fill all the options", "error");
          return;
        }
      }
      if(!this.staticDropDownSelection) {
        this.NotificationService.notify('Please select a radio button', 'error');
        return;
      }
      for(let i=0; i<this.defaultValList.length; i++) {
        payloadForm.staticDropDownFields[i] = {};
        payloadForm.staticDropDownFields[i].title = this.defaultValList[i].name;
        payloadForm.staticDropDownFields[i].value = this.defaultValList[i].value;
      }
      payloadForm.isSearchable = this.isSearchable=='Yes'?true:false;
      payloadForm.value = this.staticDropDownSelection;
    }
    else if(payloadForm.fieldType == 'file') {
      for(let i=0; i<this.addFileList.length; i++) {
        if(this.addFileList[i].name == "" || this.addFileList[i].value == "") {
          this.NotificationService.notify("Please fill all the file options", "error");
          return;
        }
      }
      payloadForm.fileMeta = {};
      for(let i=0; i<this.addFileList.length; i++) {
        let temp1 = '';
        if(this.addFileList[i].value == 'File Name') {
          temp1 = "<%=filename%>";
        }
        else if(this.addFileList[i].value == 'File Size') {
          temp1 = "<%=size%>";
        }
        else if(this.addFileList[i].value == 'File Content Type') {
          temp1 = "<%=contentType%>"
        }
        payloadForm.fileMeta[this.addFileList[i].name] = temp1;
      }
      payloadForm.allowMultiple = this.isMultipleFile=='Yes'?true:false;
    }
    return payloadForm;
  }


  createPayload(elem) {
    let tempObj: any = new FormFieldPayload(elem);
    return this.payloadBuild(tempObj);
    // return tempObj;
  }


  getEditedObj(det) {
    let temp = this.getResultsDup[Number(det.fieldIndex)];
    if(!temp) {
      return this.createPayload(det);
    }
    _.extend(temp, new FormFieldPayloadMini(det));
    return this.payloadBuild(temp);
    // return temp;
  }


  addToFileList() {
    let obj = FILE_ELEMENT;
    this.addFileList.push(obj);
    this.isFileNewAdded = true;
    setTimeout(()=>{
      this.isFileNewAdded = false
    }, 2500);
  }

  editFileDet(det) {
    det.edit = true;
    this.isEditFile = true;
    this.payloadFileKey = det.name;
    this.selected.payloadFieldValue = det.value;
  }

  editToFileList() {
    if(this.payloadFileKey == '' || this.selected.payloadFieldValue == '') {
      return;
    }
    this.isEditFile = false;
    for(let i=0; i<this.addFileList.length; i++) {
      if(this.addFileList[i].edit) {
        this.addFileList[i].edit = true;
        this.addFileList[i].name = this.payloadFileKey;
        this.addFileList[i].value = this.selected.payloadFieldValue;
        break;
      }
    }
    this.payloadFileKey = "";
    this.selected.payloadFieldValue = "";
  }

  editManageField(eleDetails) {   
      if(eleDetails.fieldName == '') {
        this.NotificationService.notify('Field name is required', 'warning');
        return;
      }
      if(eleDetails.dataType == '') {
        this.NotificationService.notify('Please select the data type', 'warning');
        return;
      }
      if(eleDetails.fieldType == '') {
        this.NotificationService.notify('Please select the field type', 'warning');
        return
      }
      if(this.tempDataSave) {
        this.getResults[eleDetails.fieldIndex] = clonedeep(this.tempDataSave);
        this.getResultsDup = clonedeep(this.getResults);
      }
      if(this.fieldNameList.indexOf(eleDetails.fieldName.toLowerCase()) > -1 && eleDetails.fieldName != this.editFieldName) {
        this.NotificationService.notify("Duplicate field names not allowed", "error");
        return;
      }
      this.submitted = true;
      if (this.registerForm.invalid) {
        return;
      }
      let _params = {
        "appId": this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
      };

      let finalPayload = {
        payloadField: [this.getEditedObj(eleDetails)],
        formData: {
          formName: this.getFormData.formName,
          agentEmail: this.getFormData.agentEmail        
        }
      };
      if(finalPayload.payloadField[0] == null) {
        return;
      }
      this.getResults.splice(Number(eleDetails.fieldIndex), 1);
      this.getResultsDup = clonedeep(this.getResults);
      finalPayload.payloadField = finalPayload.payloadField.concat(this.getResults);
      finalPayload.payloadField[0].fieldIndex = eleDetails.fieldIndex;
      let temp = [];
      for(let i=0; i<finalPayload.payloadField.length; i++) {
        temp[Number(finalPayload.payloadField[i].fieldIndex)] =  finalPayload.payloadField[i];
      }
      finalPayload.payloadField = temp;
      this.isLoading = true;
      this.service.invoke('put.updateFormFields',_params, finalPayload)
      .pipe(finalize(()=> {
        this.isLoading = false;
        this.resetEdit();
      }))
      .subscribe(
        res => {     
          this.setResponse(res);
          this.isUpdatedForm = true;
          this.NotificationService.notify('Form field updated successfully', 'success');
        },
        errRes => {
          this.saveInProgress = false;
          this.NotificationService.notify('Failed to update form field', 'error');
          this.getAllFields();
        }
      ); 
  }

  cancelEditting(ele) {
    let formElements = _.map(this.getResults, o => new PayloadField(o));
    for(let i=0; i<this.getResults.length; i++) {
      for(let j=0; j<this.dataSource.data.length; j++) {
        if(this.dataSource.data[j].fieldIndex == this.getResults[i].fieldIndex) {
          formElements[i].isEdit = this.dataSource.data[j].isEdit;
        }
        if(this.dataSource.data[j].fieldIndex == ele.fieldIndex && formElements[i].fieldIndex == ele.fieldIndex) {
          formElements[i].isEdit = false;
        }
      }
    }
    this.dataSource = new MatTableDataSource(formElements);
    this.resetEdit();
  }


  checkKey(e) {
    let code = e.keyCode || e.which;
    if(code == 13 && this.formTitle != "") {
      this.saveTitleEmail('form');
    }
  }

  addField() {
    if(this.isInEditMode) {
      this.NotificationService.notify("Please save the editted changes", "warning");  
      return;
    }
    let emptyField = {
      fieldName: '',
      dataType: '',
      helpText: '',
      displayName: '',
      fieldType: '',
      isOptional: 'No',
      isMultiSelect: 'No',            
      operation: '',
      fieldIndex: this.getResults.length,
      isEdit: true
    };
    let formElements =  _.map(this.getResults, o => new PayloadField(o));
    for(let i=0; i<this.getResults.length; i++) {
      for(let j=0; j<this.dataSource.data.length; j++) {
        if(this.dataSource.data[j].fieldIndex == this.getResults[i].fieldIndex) {
          formElements[i].isEdit = this.dataSource.data[j].isEdit;
        }
      }
    }
    formElements.push(emptyField);
    this.dataSource = new MatTableDataSource(formElements);
    this.resetEdit();
    this.editElement(emptyField)
    this.editFieldIndex = this.getResults.length;
    $("#scroll_per > .ps").animate({ scrollTop: $('#scroll_per > .ps').prop("scrollHeight")}, 1000);
  }

  checkKeyRecipientEmail(e) {
    let code = e.keyCode || e.which;
    if(code == 13 && this.recipientEmail != "") {
      this.saveTitleEmail('email');
    }
  }

  editField(ele) {
    if(this.isInEditMode && this.editFieldIndex != ele.fieldIndex) {
      let formElements = _.map(this.getResults, o=> new PayloadField(o));
      for(let i=0; i<this.getResults.length; i++) {
        for(let j=0; j<this.dataSource.data.length; j++) {
          if(this.dataSource.data[j].fieldIndex == this.getResults[i].fieldIndex) {
            formElements[i].isEdit = this.dataSource.data[j].isEdit;
          }
          if(this.dataSource.data[j].fieldIndex == this.editFieldIndex && formElements[i].fieldIndex == this.editFieldIndex) {
            formElements[i].isEdit = false;
          }
        }
      }
      formElements.forEach(function(val){
        if(val.fieldIndex == ele.fieldIndex) {
          val.isEdit = true;
        }
      });
      this.dataSource = new MatTableDataSource(formElements);
      this.resetEdit();
      this.editFieldName = ele.fieldName;
      this.editFieldIndex = ele.fieldIndex;
      ele.isEdit = true;
      this.isInEditMode = true;
      this.dataSource.filteredData[ele.fieldIndex].isEdit = true;
      this.editElement(this.dataSource.filteredData[ele.fieldIndex]);
      return;
    }
    if(this.editFieldIndex == ele.fieldIndex) {
      return;
    }
    this.editFieldName = ele.fieldName;
    this.editFieldIndex = ele.fieldIndex;
    ele.isEdit = true;
    this.isInEditMode = true;
  }

  deleteAllStaticDropdown() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete all the Static Dropdown values.",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'kr-btn-delete',
        cancelButton: 'kr-btn-cancel'
      },
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      
    }).then((result) => {
      if(result.value) {
        this.defaultValList = [{
          name: "",
          value: ""
        }];
        this.staticDropDownSelection = null;
      }
    });
  }

  saveTitleEmail(flag) {
    let _params = {
      "appId":  this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
    };
    let finalPayload = {
      payloadField: this.getResults,
      formData: {
        formName: this.formTitle,
        agentEmail: this.recipientEmail
      }
    };
    const self = this;
    flag=='form'?this.isFormNameSaving=true:this.isAgentEmailSaving=true;
    this.service.invoke('put.updateFormFields',_params, finalPayload)
    .pipe(finalize(()=>{
      self.isFormNameSaving = false;
      self.isAgentEmailSaving = false;
      setTimeout(function(){
        self.isSavedFormTitle = false;
        self.isSavedEmailId = false;
      }, 500);
    }))
    .subscribe(
      res => {     
        // self.getResults = res[0].payloadField;
        // self.getResultsDup = clonedeep(self.getResults);
        if(flag == 'form') {
          self.NotificationService.notify('Form title updated successfully', 'success');
          self.isSavedFormTitle = true;
          self.getFormData.formName = res[0].formData.formName;
          self.isUpdatedForm = true;
        }
        else if(flag == 'email') {
          self.NotificationService.notify('Recipient email id updated successfully', 'success');
          self.isSavedEmailId = true;
          self.getFormData.agentEmail = res[0].formData.agentEmail;
          self.isUpdatedForm = true;
        }
      },
      errRes => {
        flag=='form'?this.NotificationService.notify('Failed to update form title', 'error'):this.NotificationService.notify('Failed to update recipient email id', 'error');
      }
    );
  }

  editFormField(formDetails) {
    let i =_.findIndex(this.getResults, {key: formDetails.fieldName});
    let formDataAll = {
      edit: this.getResults[i],
      all:this.getResults,
      flag: 'editFlag',
      formData: {
        formName: this.formTitle,
        agentEmail: this.recipientEmail
      }
    };
  }

  deleteFormField(formDetails) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete \""+ formDetails.fieldName +"\".",
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
        this.saveInProgress = true;
        let i =_.findIndex(this.getResults, {key: formDetails.fieldName});
        let tempIndex = this.getResults[i].fieldIndex;
        this.getResults.splice(i,1);
        this.getResults.map(val=>{
          if(Number(val.fieldIndex) > Number(tempIndex)) {
            val.fieldIndex = Number(val.fieldIndex) - 1;
          }
        })
        this.resetEdit();
        this.updateFormField();
      }
    })
  }

  updateFormField() {
    let _params = {
      "appId":  this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
    };
    let finalPayload = {
      payloadField: this.getResults,
      formData: {
        formName: this.formTitle,
        agentEmail: this.recipientEmail  
      }
    }
    this.service.invoke('put.updateFormFields',_params, finalPayload).subscribe(
      res => {     
        this.setResponse(res);
        this.saveInProgress = false;
        this.NotificationService.notify('Form field deleted successfully', 'success');
      },
      errRes => {
        this.saveInProgress = false;
        this.NotificationService.notify('Failed to delete form field', 'error');
      }
    );
  }

  nextStep(){
    let _params = {
      'appId': this.selectedApp._id|| this.selectedApp[0]._id
    };
    let payload = {
      versionComment : "deflect.ai"
    };
    this.service.invoke('post.publish',_params, payload).subscribe(
      res => {
        this.publishSuccess = true;
        $('#widgetNavigationPopUp').modal('show');
      },
      errRes => {
        this.publishSuccess = false;
        $('#widgetNavigationPopUp').modal('show');
      }
    );
  }
  
  backStep(){
    this.router.navigate(['/callFlow']);
  }

  widgetNavigationComplete(){
    this.workflowService.showAppCreationHeader(false);
    $(".toShowAppHeader").removeClass("d-none");
    this.router.navigate(['/dashboard']);
  }
}
