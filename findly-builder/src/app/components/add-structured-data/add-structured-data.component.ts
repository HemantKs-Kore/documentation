import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
declare const $: any;

@Component({
  selector: 'app-add-structured-data',
  templateUrl: './add-structured-data.component.html',
  styleUrls: ['./add-structured-data.component.scss']
})
export class AddStructuredDataComponent implements OnInit {

  public newSourceObj: any;
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

  @Output() closeStructuredDataModal = new EventEmitter();
  @Input() selectedSourceType: any;
  @ViewChild('codemirror') codemirror: any;

  constructor(private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService, ) { }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo() || {};
  }

  ngOnChanges(changes){
    if(changes && changes.selectedSourceType){
      if(changes.selectedSourceType.currentValue && changes.selectedSourceType.currentValue.resourceType === 'structuredDataManual'){
        this.structuredData.payload = JSON.stringify({});
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

  cancleSourceAddition() {
    this.newSourceObj = {};
    this.selectedSourceType = null;
    this.removeFile();
    this.closeStructuredDataModal.emit();
  }

  proceedSource(){

  }

  
  setEditorContent(event) {
    // console.log(event, typeof event);
    console.log(this.structuredData);
    console.log("parse", event);
  }

  indentObj(){
    let count = this.codemirror.codeMirror.lineCount();
    for(let i = 0; i <= count; i++){
      this.codemirror.codeMirror.indentLine(i, "smart");
    }
  }

}
