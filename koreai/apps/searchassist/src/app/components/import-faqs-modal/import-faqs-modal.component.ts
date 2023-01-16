import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Inject, ContentChild } from '@angular/core';
import { FileUploadService } from '../../services/fileUploadService/file-upload.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { HttpClient } from '@angular/common/http';
import { WorkflowService } from '@kore.services/workflow.service';
import { KgDataService } from '@kore.services/componentsServices/kg-data.service';
import { NotificationService } from '@kore.services/notification.service';
import { Subscription, interval } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, map, startWith, pluck } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';

import * as _ from 'underscore';

const URL = 'path_to_api';
@Component({
  selector: 'app-import-faqs-modal',
  templateUrl: './import-faqs-modal.component.html',
  styleUrls: ['./import-faqs-modal.component.scss']
})
export class ImportFaqsModalComponent implements OnInit, OnDestroy {
  uploader:FileUploader = new FileUploader({url: URL});
  selectedApp: any;
  step: number;
  fileData: Subscription;
  validExtensions: string [] = ['.csv', '.json'];
  fileName: string;
  importPayload: {};
  importProgress: any = 0;
  polling: Subscription;
  errorMessage = '';
  showSteps = {
    proceed: [-1],
    cancel: [-1,0,1,2],
    next: [0,1,2],
    ok: [3,4]
  };
  params: {};

  constructor(private fUpload: FileUploadService,
              private service: ServiceInvokerService,
              public workflowService: WorkflowService,
              private authService: AuthService,
              private http: HttpClient,
              private kgService: KgDataService,
              public dialogRef: MatDialogRef<ImportFaqsModalComponent>,
              private dockService: DockStatusService,
              private notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) { }

  ngOnInit() {
    this.selectedApp = this.workflowService.findlyApps();
    this.params = { userId: this.authService.getUserId() };
    this.step = this.data.step;
  }

  removeFile() {
    this.step = 0;
    this.fileName = '';
    this.fileData.unsubscribe();
  }

  updateError(text) {
    this.step = 4;
    this.errorMessage = text;
  }

  exportFile(ext) {
    const payload = {
      exportType: ext,
      getFileId: true,
      knowledgeTaskId: this.kgService.getKgTaskId(),
      streamId: this.selectedApp._id || this.selectedApp[0]._id
    }
    this.service.invoke('post.faqexport', this.params, payload).subscribe(res => {
      this.notificationService.notify('Manage Intent export is in progress', 'success');
      this.dockService.getDockStatus('KG_EXPORT')
        .subscribe( (res1) =>{
          _.extend(res.store,{toastSeen: true});
          const fileName = res.store.urlParams;
          this.dockService.updateProgress( _.pick(res, 'store'), res._id).pipe(pluck('fileId')).subscribe(res=>{
            this.notificationService.notify('Manage Intent export is completed, File download will start in a moment', 'success');
            this.dockService.downloadDockFile(res, fileName);
          })
        }, err=>{this.updateError(err);})
    })
  }

  fileSelect(event) {
    const targ = event.target?event.target.files[0]:event.queue[0]._file;
    const _ext = targ.name.substring(targ.name.lastIndexOf('.'));
    this.fileName = targ.name;
    this.fileData = this.fUpload.onFileUpload(targ, this.validExtensions).subscribe(
      data => {
        this.service.invoke('post.uploadfaqfile', this.params, data).subscribe(
          res => {
            this.step = 1;
            this.importPayload = {
              delimiter: ',',
              fileName: res.fileId,
              fileType: _ext.slice(1),
              importType: 'override',
              knowledgeTaskId: this.kgService.getKgTaskId(),
              streamId: this.selectedApp._id || this.selectedApp[0]._id,
            };
          }, err => { this.updateError(err); });
        }, err => { this.updateError(err); });
    }

  fileOverBase(e) {
    this.fileSelect(this.uploader)
  }

  getFaqStatus(progressInt) {
    const streamId = this.selectedApp._id || this.selectedApp[0]._id;
    const callName = 'streams/'+ streamId +'/knowledgetask/'+this.kgService.getKgTaskId()+'/importfaq';
    const _params = { userId: this.authService.getUserId(), callName };
    this.polling = interval(5000).pipe(startWith(0)).subscribe(() => {
        this.service.invoke('get.faqstatus', _params).subscribe(
          res => {
            if(res.status === 'success') {
              this.step = 3;
              this.importProgress = 100;
              progressInt.unsubscribe();
              this.polling.unsubscribe();
              this.kgService.importComplete();
            }
            else if(res.status === 'failed') {
              this.step = 4;
              this.errorMessage = res.message;
              this.importProgress = 100;
              progressInt.unsubscribe();
              this.polling.unsubscribe();
            }
          }, err => {
            progressInt.unsubscribe();
            this.updateError('File import has been failed');
          })
      }
    )
  }

  startImport() {
    this.step = 2;
    this.importProgress = 10;
    const progressInt = interval(500).subscribe(()=>{
      this.importProgress = this.importProgress < 90? this.importProgress+1:this.importProgress;
    });
    this.service.invoke('post.importfaqfile', this.params, this.importPayload)
      .subscribe(res=>{ this.getFaqStatus(progressInt);},
        err => {
          progressInt.unsubscribe();
          this.updateError('File import has been failed');
        }
      );
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.fileData?this.fileData.unsubscribe():false;
    // tslint:disable-next-line:no-unused-expression
    this.polling?this.polling.unsubscribe():false;
  }
}
