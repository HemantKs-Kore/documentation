import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    mode: "json",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: false,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: false,
    indentUnit: 0
  };
  selectedApp: any = {};
  selectedJsonForEdit: any;
  sampleJsonPath = '/home/assets/sampleData/sample.json';
  sampleCsvPath = '/home/assets/sampleData/sample.csv';
  openingBrace = "{";
  closingBrace = "}"

  @Output() closeStructuredDataModal = new EventEmitter();
  @Input('selectedSourceType') selectedSourceType: any;
  @ViewChild('codemirror') codemirror: any;

  constructor( private http: HttpClient,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    public workflowService: WorkflowService,
    private router: Router) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.userInfo = this.authService.getUserInfo() || {};
  }

  ngAfterViewInit(){
  }

  ngOnChanges(changes){
    if(changes && changes.selectedSourceType){
      if(changes.selectedSourceType.currentValue && changes.selectedSourceType.currentValue.resourceType === 'structuredDataManual'){
        if(changes.selectedSourceType.currentValue.payload){
          this.selectedJsonForEdit = changes.selectedSourceType.currentValue.payload;
          console.log("source",changes.selectedSourceType.currentValue);
          // this.structuredData.payload = JSON.stringify(this.selectedJsonForEdit._source.jsonData,null,1);
          this.structuredData.payload = this.selectedJsonForEdit.parsedData;
          setTimeout( () => {
            this.indentObj();
          },100)
        }
        else{
          this.structuredData.payload = JSON.stringify({});
        }
        setTimeout(() => {
          if(this.codemirror && this.codemirror.codeMirror){
            this.codemirror.codeMirror.refresh();
          }
        }, 200);
      }
    }
  }

  fileChangeJsonListener(event) {
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
    $('#sourceFileUploader').val('');
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

  proceedSource(){
    let payload: any = {};
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type: this.selectedSourceType.sourceType,
    };
    let endPoint = 'add.structuredData';
    if(this.selectedSourceType && this.selectedSourceType.resourceType === 'structuredData'){
      // File Upload
      quaryparms.file = 'file';
      payload.fileId = this.fileObj.fileId;
      this.jsonInvoke(payload,endPoint,quaryparms);
    }
    else if(this.selectedSourceType && this.selectedSourceType.resourceType === 'structuredDataManual'){
      try{
        let payload_temp = JSON.parse(this.structuredData.payload);
        console.log("payload", payload);
        if(this.selectedJsonForEdit){
          // edit
          this.updateStructuredData(payload_temp);
        }
        else{
          quaryparms.file = 'manual';
          this.jsonInvoke(payload_temp,endPoint,quaryparms);
        }
      }
      catch (e){
        console.log("error", e);
      }
    }
  }

  updateStructuredData(jsonData){
    let quaryparms :any = {};
    quaryparms.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    // quaryparms.sourceId = Math.random().toString(36).substr(7);
    if(jsonData){
      quaryparms.contentId = this.selectedJsonForEdit._id;
      quaryparms.sourceId = this.selectedJsonForEdit.extractionSourceId;
      this.service.invoke('update.structuredData', quaryparms,jsonData).subscribe(res => {
        if(res){
          this.cancleSourceAddition();
          this.notificationService.notify('Updated Successfully', 'success');
        }
      }, errRes => {
        console.log("error", errRes);
        this.notificationService.notify('Updation has gone wrong.', 'error');
      });
    }
  }


  jsonInvoke(payload,endPoint,quaryparms){
    this.service.invoke(endPoint, quaryparms, payload).subscribe(res => {
      // this.openStatusModal();
      if(quaryparms.file === 'file'){
        this.cancleSourceAddition({showStatusModal : true, payload : res});
      }
      else{
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
    console.log("parse", event);
    try{
      let payload_temp = JSON.parse(this.structuredData.payload);
      if(payload_temp){
        this.selectedSourceType.resourceAdded = true;
      }
    }
    catch (e){
      this.selectedSourceType.resourceAdded = false;
    }
  }

  indentObj(){
    let count = this.codemirror.codeMirror.lineCount();
    for(let i = 0; i <= count; i++){
      this.codemirror.codeMirror.indentLine(i, "smart");
    }
  }

  downloadSampleData(key){
    let fileName;
    let filePath;
    if(key === 'json'){
      fileName = 'sample.json';
      filePath = this.sampleJsonPath;
    }
    else{
      fileName = 'sample.csv';
      filePath = this.sampleCsvPath;
    }
    fetch(filePath)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then((blob : any) => {
          const link : any = document.createElement('a');
            let objectURL = URL.createObjectURL(blob);
              link.href =  objectURL;
              link.target = "_blank",
              link.download = fileName,
              link.click();
              link.remove();
        });
  }

}
