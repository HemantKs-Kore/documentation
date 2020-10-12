import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'underscore';
@Component({
  selector: 'app-stop-words',
  templateUrl: './stop-words.component.html',
  styleUrls: ['./stop-words.component.scss']
})
export class StopWordsComponent implements OnInit {
  loadingContent:any = true;
  stopwords:any = [];
  searchStopwords: any = '';
  newStopWord:any = '';
  showSearch = false;
  enabled: boolean = false;
  selectedApp: any = {};
  serachIndexId;
  queryPipelineId;
  pipeline;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId = this.selectedApp.searchIndexes[0].queryPipelineId;
    this.getStopWords();
  }
  toggleSearch(){
    if(this.showSearch && this.searchStopwords){
      this.searchStopwords = '';
    }
    this.showSearch = !this.showSearch
  }
  getStopWords(){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
     this.pipeline=  res.pipeline || {};
      if(this.pipeline.stages && this.pipeline.stages.length){
        this.pipeline.stages.forEach(stage => {
          if(stage && stage.type === 'stopwords'){
            this.stopwords = stage.stopwords || [];
          }
        });
      }
      this.loadingContent = false;
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get stop words');
    });
  }
  StopWords(event) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const modalData :any =  {
      title: 'Enable Stop Words',
      text: 'Are you sure you want to enable Stop Words?',
      buttons: [{ key: 'yes', label: 'Restore'}, { key: 'no', label: 'Cancel' }]
    }
    if(!this.enabled){
      modalData.title = 'Disable Stop Words'
      modalData.text = 'Are you sure you want to disable Stop Words?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data:modalData
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const quaryparms: any = {
            searchIndexID:this.serachIndexId,
            queryPipelineId:this.queryPipelineId,
            enable:this.enabled,
          };
          this.service.invoke('post.restoreStopWord', quaryparms).subscribe(res => {
            this.newStopWord = '';
            if(dialogRef && dialogRef.close){
             dialogRef.close();
            }
            this.notificationService.notify('Stop words enabled successfully','success');
           }, errRes => {
             this.errorToaster(errRes,'Failed to update stop words');
           });
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  restoreStopWords(event) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore Stop Words',
        text: 'Are you sure you want to restore Stop Words?',
        buttons: [{ key: 'yes', label: 'Restore'}, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const quaryparms: any = {
            searchIndexID:this.serachIndexId,
            queryPipelineId:this.queryPipelineId,
          };
          this.service.invoke('post.restoreStopWord', quaryparms).subscribe(res => {
            this.newStopWord = '';
            if(dialogRef && dialogRef.close){
             dialogRef.close();
            }
           }, errRes => {
             this.errorToaster(errRes,'Failed to restore stop words');
           });
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  deleteInfividualStopWords(index,event) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Stop Word',
        text: 'Are you sure you want to delete selected Stop Word?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.stopwords.splice(index,1);
         this.updateStopWords(dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  updateStopWords(dialogRef?) {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    if(this.pipeline.stages && this.pipeline.stages.length) {
      this.pipeline.stages.forEach(stage => {
        if(stage && stage.type === 'stopwords'){
          stage.stopwords = this.stopwords;
        }
      });
    }
    const payload: any = {
      pipeline:this.pipeline
    }
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(res => {
     this.newStopWord = '';
     this.notificationService.notify('Stop word deleted successfully','success');
     if(dialogRef && dialogRef.close){
      dialogRef.close();
     }
    }, errRes => {
      this.errorToaster(errRes,'Failed to delete stop word ');
    });
  }
  errorToaster (errRes,message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
  }
 }
  addStopWord(){
    const stopwords = (this.newStopWord || '').split(',');
    this.stopwords = _.uniq(this.stopwords.concat(stopwords)).sort();
    this.stopwords = _.filter(this.stopwords,(stopword)=>{
           return stopword !== '';
    })
    this.updateStopWords();
  }
}