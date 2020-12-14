import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'underscore';
declare const $: any;
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
  enabled = false;
  validation: any = {
    duplicate:false,
    spaceFound:false
  }
  loadingWords = false;
  selectedApp: any = {};
  serachIndexId;
  queryPipelineId;
  pipeline;
  stopWordsIntiType = 'default'
  createFromScratch;
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
  createInit(){
    if(this.stopWordsIntiType === 'default'){
      this.restore();
    } else {
      this.createFromScratch = true;
    }
  }
  validate(event){
    if(!this.newStopWord){
      this.validation.spaceFound = false;
      this.validation.duplicate = false;
    }
   if (this.newStopWord) {
    if ( this.newStopWord.indexOf(' ') >= 0 ) {
      this.validation.spaceFound = true;
    } else {
      this.validation.spaceFound = false;
    }
    const stopwords = (this.newStopWord || '').split(',');
    let duplicate = false
    if(stopwords && stopwords.length){
      stopwords.forEach(element => {
        _.map(this.stopwords,(stopword)=>{
           if(stopword === element){
            duplicate = true;
           }
          });
      });
    }
    this.validation.duplicate = duplicate;
   }
  }
  getStopWords(){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
     this.pipeline=  res.pipeline || {};
     if(res.options){
      this.enabled = res.options.stopWordsRemovalEnabled;
     }
      if(this.pipeline.stages && this.pipeline.stages.length){
        this.pipeline.stages.forEach(stage => {
          if(stage && stage.type === 'stopwords'){
            this.stopwords = stage.stopwords || [];
            if(stage.options){
              this.enabled = stage.options.stopWordsRemovalEnabled;
            }
          }
        });
      }
      this.loadingContent = false;
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get stop words');
    });
  }
  enableStopWords(event) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const modalData :any =  {
      title: 'Enable Stop Words',
      text: 'Are you sure you want to enable Stop Words?',
      buttons: [{ key: 'yes', label: 'Enable'}, { key: 'no', label: 'Cancel' }]
    }
    if(!this.enabled){
      modalData.title = 'Disable Stop Words'
      modalData.text = 'Are you sure you want to disable Stop Words?';
      modalData.buttons[0].label = 'Disable';
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
          this.updateStopWords(dialogRef,true);
        } else if (result === 'no') {
          this.enabled = !this.enabled;
          dialogRef.close();
        }
      })
  }
  restore(dialogRef?) {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    this.service.invoke('post.restoreStopWord', quaryparms).subscribe(res => {
      this.newStopWord = '';
      this.pipeline=  res.pipeline || {};
      if(res.options){
        this.enabled = res.options.stopWordsRemovalEnabled;
       }
      if(this.pipeline.stages && this.pipeline.stages.length){
        this.pipeline.stages.forEach(stage => {
          if(stage && stage.type === 'stopwords'){
            this.stopwords = stage.stopwords || [];
            if(stage.options){
              this.enabled = stage.options.stopWordsRemovalEnabled;
            }
            if(!(this.stopwords && this.stopwords.length) && !dialogRef){
              this.notificationService.notify('No default stop words available','error');
            } else {
              this.notificationService.notify('Stopwords set to default','success');
            }
          }
        });
      }
      if(dialogRef && dialogRef.close){
       dialogRef.close();
      }
     }, errRes => {
       this.errorToaster(errRes,'Failed to create default stop words');
     });
  }
  restoreStopWords(event) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore Stop Words',
        text: 'Are you sure you want to restore Stop Words?',
        newTitle:'Are you sure you want to restore Stop Words?',
        body:'Selected stop words will be restored.',
        buttons: [{ key: 'yes', label: 'Restore'}, { key: 'no', label: 'Cancel' }],
        confirmationPopUp:true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
         this.restore(dialogRef)
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  getActiveSearch(){
    return $('.stopwordBlock').length;
  }
  deleteInfividualStopWords(index,event,word,list) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Stop Word',
        text: 'Are you sure you want to delete selected Stop Word?',
        newTitle:'Are you sure you want to delete selected Stop Word?',
        body:'Selected stop word will be deleted',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp:true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.loadingWords = true;
          const deleteindex = this.stopwords.findIndex(f => f=== word);
          if(deleteindex > -1){
            this.stopwords.splice(deleteindex,1);
          }
         this.updateStopWords(dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  updateStopWords(dialogRef?,enableOrDisable?) {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    let msg = 'Stop words updated successfully';
    if(!enableOrDisable){
      if(this.pipeline.stages && this.pipeline.stages.length) {
        this.pipeline.stages.forEach(stage => {
          if(stage && stage.type === 'stopwords'){
            stage.stopwords = this.stopwords;
          }
        });
      }
    }
    const payload: any = {
      pipeline:{
        stopwords:this.stopwords
      },
      options:{
        stopWordsRemovalEnabled : this.enabled
      }
    }
    if (enableOrDisable){
      msg = 'Stop words ' + (this.enabled?'enabled':'disabled') + ' successfully';
    }
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(res => {
     this.newStopWord = '';
     if(dialogRef && dialogRef.close){
      dialogRef.close();
      if(!enableOrDisable){
        msg = 'Stop word deleted successfully';
       }
     }
     this.notificationService.notify(msg,'success');
      this.loadingWords = false;
    }, errRes => {
      this.loadingWords = false;
      this.errorToaster(errRes,'Failed to update');
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
