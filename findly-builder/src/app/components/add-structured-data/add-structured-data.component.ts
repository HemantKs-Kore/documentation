import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
declare const $: any;

@Component({
  selector: 'app-add-structured-data',
  templateUrl: './add-structured-data.component.html',
  styleUrls: ['./add-structured-data.component.scss']
})
export class AddStructuredDataComponent implements OnInit {

  public newSourceObj: any = {};
  csvContent: any = '';
  fileObj: any = {};
  userInfo: any = {};
  structuredData: any = {};
  codeMirrorOptions: any = {
    theme: 'neo',
    mode: "application/ld+json",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: false,
    indentUnit: 2
  };
  selectedApp: any = {};
  selectedJsonForEdit: any;
  sampleJsonPath = '/home/assets/sampleData/sample.json';
  sampleCsvPath = '/home/assets/sampleData/sample.csv';
  openingBrace = "{";
  closingBrace = "}";
  startingValue: any;
  currentDataIndex: any;
  previousDataIndex: any;
  nextDataIndex: any;
  allStructuredData: any = [];
  submitted : boolean = false;
  isInvalidJSON : boolean = false;;

  @Output() closeStructuredDataModal = new EventEmitter();
  @Input('selectedSourceType') selectedSourceType: any;
  @ViewChild('sourceCreation') sourceCreation : any;
  @ViewChild('codemirror') codemirror: any;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(private http: HttpClient,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.userInfo = this.authService.getUserInfo() || {};
    this.codeMirrorOptions['readOnly'] = '';
    setTimeout(() => {
      $('.CodeMirror-foldgutter-folded').click();
      $('.CodeMirror-foldgutter-open').click();
    }, 500);
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes) {
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500);
    if (changes && changes.selectedSourceType) {
      this.submitted = false;
      this.selectedSourceType.resourceAdded = false;
      if (changes.selectedSourceType.currentValue && changes.selectedSourceType.currentValue.resourceType === 'structuredDataManual') {
        this.setRequirementsForManualInput(changes);
      }
    }
  }

  setRequirementsForManualInput(changes) {
    if (changes.selectedSourceType.currentValue.payload) {
      // this.selectedJsonForEdit = changes.selectedSourceType.currentValue.payload;
      console.log("source", changes.selectedSourceType.currentValue);
      // this.structuredData.payload = JSON.stringify(this.selectedJsonForEdit._source.jsonData,null,1);
      // this.structuredData.payload = this.selectedJsonForEdit.parsedData;
      if (changes.selectedSourceType.currentValue.viewMode) {
        this.codeMirrorOptions['readOnly'] = 'nocursor';
      }
      else {
        this.codeMirrorOptions['readOnly'] = '';
      }

      if (changes.selectedSourceType.currentValue.allData && changes.selectedSourceType.currentValue.allData.length) {
        this.allStructuredData = changes.selectedSourceType.currentValue.allData;
      }

      if (changes.selectedSourceType.currentValue.currentIndex || (changes.selectedSourceType.currentValue.currentIndex == 0)) {
        this.currentDataIndex = changes.selectedSourceType.currentValue.currentIndex;
        if (this.currentDataIndex && this.currentDataIndex > 0) {
          this.previousDataIndex = this.currentDataIndex - 1;
        }
        else {
          this.previousDataIndex = undefined;
        }
        if (this.currentDataIndex < (this.allStructuredData.length - 1)) {
          this.nextDataIndex = this.currentDataIndex + 1;
        }
        else {
          this.nextDataIndex = undefined;
        }
      }
      if (this.currentDataIndex) {
        this.selectedJsonForEdit = this.allStructuredData[this.currentDataIndex];
      }
      else {
        this.selectedJsonForEdit = changes.selectedSourceType.currentValue.payload;
      }
      this.structuredData.payload = this.selectedJsonForEdit.parsedData;
      setTimeout(() => {
        // this.indentObj();
      }, 200)
    }
    else {
      this.codeMirrorOptions['readOnly'] = '';
      this.structuredData.payload = JSON.stringify({});
    }
    setTimeout(() => {
      if (this.codemirror && this.codemirror.codeMirror) {
        this.codemirror.codeMirror.refresh();
      }
    }, 500);
  }

  doubleClick(event) {
    if (this.selectedSourceType && this.selectedSourceType.viewMode) {
      this.editRecord();
    }
  }
  navigateToRecord(key) {
    if (this.currentDataIndex || (this.currentDataIndex == 0)) {
      if (key) {
        this.currentDataIndex = this.currentDataIndex + 1;
      }
      else {
        this.currentDataIndex = this.currentDataIndex - 1;
      }
      if (this.currentDataIndex && this.currentDataIndex > 0) {
        this.previousDataIndex = this.currentDataIndex - 1;
      }
      else {
        this.previousDataIndex = undefined;
      }
      if (this.currentDataIndex < (this.allStructuredData.length - 1)) {
        this.nextDataIndex = this.currentDataIndex + 1;
      }
      else {
        this.nextDataIndex = undefined;
      }
      this.selectedJsonForEdit = this.allStructuredData[this.currentDataIndex];
      this.structuredData.payload = this.selectedJsonForEdit.parsedData;
    }
  }

  deleteStructuredDataPopup(record) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected data will be permanently deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true,
      }
    });
    dialogRef.componentInstance.onSelect.subscribe(res => {
      if (res === 'yes') {
        dialogRef.close();
        this.deleteStructuredData(record);
      }
      else if (res === 'no') {
        dialogRef.close();
      }
    });
  }

  deleteStructuredData(record) {
    let quaryparms: any = {};
    quaryparms.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    quaryparms.sourceId = Math.random().toString(36).substr(7);
    if (record) {
      quaryparms.contentId = record._id;
      this.service.invoke('delete.structuredData', quaryparms).subscribe(res => {
        if (res) {
          this.notificationService.notify('Deleted Successfully', 'success');
          let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
          if (currentPlan?.subscription?.planId == 'fp_free') {
            this.appSelectionService.updateUsageData.next('updatedUsage');
          }
          this.cancleSourceAddition();
        }
      }, errRes => {
        console.log("error", errRes);
        this.notificationService.notify('Deletion has gone wrong.', 'error');
      });
    }
  }

  fileChangeJsonListener(event) {
    this.submitted = false;
    this.newSourceObj.url = '';
    let fileName = '';
    if (event && event.target && event.target.files && event.target.files.length && event.target.files[0].name) {
      fileName = event.target.files[0].name;
    } else {
      return;
    }
    const _ext = fileName.substring(fileName.lastIndexOf('.'));
    if (_ext !== '.json' && _ext !== '.csv') {
      $('#sourceFileUploader').val(null);
      this.notificationService.notify('Please select a valid csv or json file', 'error');
      return;
    } else {
      this.fileObj.fileUploadInProgress = true;
      this.fileObj.fileName = fileName;
    }
    this.onFileSelect(event.target, _ext);
  }

  onFileSelect(input: HTMLInputElement, ext) {
    const files = input.files;
    const content = this.csvContent;
    if (files && files.length) {
      const fileToRead = files[0];
      const onFileLoad = (fileLoadedEvent) => {
        const data = new FormData();
        data.append('file', fileToRead);
        data.append('fileContext', 'findly');
        data.append('Content-Type', fileToRead.type);
        data.append('fileExtension', ext.replace('.', ''));
        this.fileupload(data);
      };
      const fileReader = new FileReader();
      fileReader.onload = onFileLoad;
      fileReader.readAsText(fileToRead, 'UTF-8');
    }
  }

  fileupload(payload) {
    const quaryparms: any = {
      userId: this.userInfo.id
    };
    this.service.invoke('post.fileupload', quaryparms, payload).subscribe(
      res => {
        this.fileObj.fileAdded = true;
        this.fileObj.fileId = res.fileId;
        this.fileObj.fileUploadInProgress = false;
        this.notificationService.notify('File uploaded successfully', 'success');
        this.selectedSourceType.resourceAdded = true;
        //  this.selectedSourceType.resourceType = 'webdomain';
      },
      errRes => {
        this.fileObj.fileUploadInProgress = false;
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to upload file ', 'error');
        }
      }
    );
  }

  removeFile() {
    $('#sourceFileUploader_add_structured_data').val('');
    // $('#sourceFileUploader').replaceWith($('#sourceFileUploader').val('').clone(true));
    this.resetfileSource();
    // this.service.invoke('post.fileupload').subscribe().unsubscribe();
    if (!this.newSourceObj.url && this.selectedSourceType && this.selectedSourceType.resourceAdded) {
      this.selectedSourceType.resourceAdded = false;
    }
  }

  resetfileSource() {
    this.fileObj = {
      fileAdded: false,
      fileId: null,
      fileUploadInProgress: false,
      fileUploadError: false,
    }
  }

  cancleSourceAddition(event?) {
    this.closeStructuredDataModal.emit(event);
    this.newSourceObj = {};
    this.selectedSourceType = null;
    this.selectedJsonForEdit = null;
    this.structuredData = {};
    this.removeFile();
  }

  editRecord() {
    // this.selectedSourceType = JSON.parse(JSON.stringify(this.availableSources[1]));
    // this.selectedSourceType.payload = data;
    this.selectedSourceType.viewMode = false;
    // this.selectedSourceType.currentIndex = index;
    this.codeMirrorOptions['readOnly'] = '';
  }

  proceedSource() {
    let payload: any = {};
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: this.selectedSourceType.sourceType,
    };
    let endPoint = 'add.structuredData';
    this.submitted = true;
    if(this.validateStructuredData()) {
      if (this.selectedSourceType && this.selectedSourceType.resourceType === 'structuredData') {
        // File Upload
        quaryparms.file = 'file';
        payload.fileId = this.fileObj.fileId;
        this.jsonInvoke(payload, endPoint, quaryparms);
  
      }
      else if (this.selectedSourceType && this.selectedSourceType.resourceType === 'structuredDataManual') {
        try {
          let payload_temp = JSON.parse(this.structuredData.payload);
          console.log("payload", payload);
          if (this.selectedJsonForEdit) {
            // edit
            this.updateStructuredData(payload_temp);
          }
          else {
            quaryparms.file = 'manual';
            this.jsonInvoke(payload_temp, endPoint, quaryparms);
          }
        }
        catch (e) {
          console.log("error", e);
        }
      }
    }
    else{
      if(this.selectedSourceType.resourceType == "structuredDataManual"){
        this.notificationService.notify('Please enter valid JSON', 'error');
      }
      else{
        this.notificationService.notify('Enter the required fields to proceed', 'error');
      }
    }
  }

  validateStructuredData(){
    if(this.selectedSourceType.resourceType == "structuredDataManual"){
      let payload_temp;
      try {
        payload_temp = JSON.parse(this.structuredData.payload);
        if (!Object.values(payload_temp).length) {
          this.isInvalidJSON = true;
          return false;
        }
        else{
          return true;
        }
      }
      catch{
        this.isInvalidJSON = true;
        return false;
      }
    }
    else if(!this.selectedSourceType.resourceAdded){
      return false;
    }
    else{
      return true;
    }
  }

  updateStructuredData(jsonData) {
    let quaryparms: any = {};
    quaryparms.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    // quaryparms.sourceId = Math.random().toString(36).substr(7);
    if (jsonData) {
      quaryparms.contentId = this.selectedJsonForEdit._id;
      quaryparms.sourceId = this.selectedJsonForEdit.extractionSourceId;
      this.service.invoke('update.structuredData', quaryparms, jsonData).subscribe(res => {
        if (res) {
          this.cancleSourceAddition();
          this.notificationService.notify('Updated Successfully', 'success');
        }
      }, errRes => {
        console.log("error", errRes);
        this.notificationService.notify('Updation has gone wrong.', 'error');
      });
    }
  }


  jsonInvoke(payload, endPoint, quaryparms) {
    this.service.invoke(endPoint, quaryparms, payload).subscribe(res => {
      this.notificationService.notify('Added Successfully', 'success');
      let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
      if (currentPlan?.subscription?.planId == 'fp_free') {
        this.appSelectionService.updateUsageData.next('updatedUsage');
      }
      if (quaryparms.file === 'file') {
        this.cancleSourceAddition({ showStatusModal: true, payload: res });
      }
      else {
        this.router.navigate(['/structuredData'], { skipLocationChange: true });
        this.cancleSourceAddition();
      }
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Duplicate name, try again!', 'error');
      }
    });
  }

  setEditorContent(event) {
    // console.log("parse", event);
    this.isInvalidJSON = false;
    this.submitted = false;
    try {
      let payload_temp = JSON.parse(this.structuredData.payload);
      if (payload_temp) {
        this.selectedSourceType.resourceAdded = true;
      }
    }
    catch (e) {
      this.selectedSourceType.resourceAdded = false;
    }
  }

  indentObj() {
    let count = this.codemirror.codeMirror.lineCount();
    for (let i = 0; i <= count; i++) {
      this.codemirror.codeMirror.indentLine(i, "smart");
    }
  }

  downloadSampleData(key) {
    let fileName;
    let filePath;
    if (key === 'json') {
      fileName = 'sample.json';
      filePath = this.sampleJsonPath;
    }
    else {
      fileName = 'sample.csv';
      filePath = this.sampleCsvPath;
    }
    fetch(filePath)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then((blob: any) => {
        const link: any = document.createElement('a');
        let objectURL = URL.createObjectURL(blob);
        link.href = objectURL;
        link.target = "_blank",
          link.download = fileName,
          link.click();
        link.remove();
      });
  }

}
