import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { AppSelectionService } from '@kore.services/app.selection.service'
import * as _ from 'underscore';
import { Subscription } from 'rxjs';
import { InlineManualService } from '@kore.services/inline-manual.service';
declare const $: any;
@Component({
  selector: 'app-stop-words',
  templateUrl: './stop-words.component.html',
  styleUrls: ['./stop-words.component.scss']
})
export class StopWordsComponent implements OnInit, OnDestroy {
  loadingForStopWords:boolean = true;
  loadingContent: any = true;
  stopwords: any = [];
  stopwordsList: any = [];
  defaultStopwordsList: any = [];
  searchStopwords: any = '';
  newStopWord: any = '';
  stopwordData:any;
  showSearch:boolean = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  activeClose = false;
  checkStopwords:boolean = false;
  haveDefaultStopwords:boolean = false;
  enabled = false;
  validation: any = {
    duplicate: false,
    spaceFound: false
  }
  loadingWords = false;
  selectedApp: any = {};
  serachIndexId;
  queryPipelineId;
  indexPipelineId;
  pipeline;
  stopWordsIntiType:any = 'default';
  createFromScratch:boolean = false;
  subscription: Subscription;
  componentType: string = 'configure';
  submitted: boolean = false;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public inlineManual: InlineManualService,
    private appSelectionService: AppSelectionService
  ) { }
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.loadStopwords();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
      this.loadStopwords();
    })
    this.getDefaultStopWords();
  }
  loadImageText: boolean = false;
  loadingContent1: boolean
  imageLoad() {
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
    if (!this.inlineManual.checkVisibility('STOP_WORDS')) {
      this.inlineManual.openHelp('STOP_WORDS')
      this.inlineManual.visited('STOP_WORDS')
    }
  }
  loadStopwords() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId) {
        this.getStopWordsList();
        this.getQuerypipeline();
      }
    }
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
//-----------------------------(AUTHOR:BHARADWAJ)
//Checking for Default Stopwords
checkForDefaultStopWords(){
  this.haveDefaultStopwords = this.defaultStopwordsList.every((e) => this.stopwordsList.includes(e));
}
//GET DEFALUT STOPWORDS
getDefaultStopWords(){
  let  url = 'get.defaultStopWords'
  this.service.invoke(url).subscribe(
    res => {
     this.defaultStopwordsList = res.stopwords.en;
    },
    errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed To Get default Stop words Languages', 'error');
      }
    }
  );
}
//ADD DEFAULT OR START FROM SCRATCH
createInit() {
  if (this.stopWordsIntiType === 'default') {
    this.createStopWords(true);
  } else {
    this.createFromScratch = true;
  }
}
// GET LIST OF STOPWORDS (GET API CALL)
  getStopWordsList() {
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      code:'en'
    };
    this.service.invoke('get.stopWordsList', quaryparms).subscribe(res => {
      if(res?.stopwords){
        this.stopwordsList = res.stopwords;
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get stop words');
    });
  }
// VALIDATING NEWLY ADDED STOPWORD 
  validateAddStopWord() {
    if (!this.newStopWord || !this.newStopWord.length) {
      return false;
    }
    else {
      this.submitted = false;
      return true;
    }
  }
  validate(event) {
    if (!this.newStopWord) {
      this.validation.spaceFound = false;
      this.validation.duplicate = false;
    }
    if (this.newStopWord) {
      if (this.newStopWord.indexOf(' ') >= 0) {
        this.validation.spaceFound = true;
      } else {
        this.validation.spaceFound = false;
      }
      const stopwords = (this.newStopWord || '').split(',');
      let duplicate = false
      if (stopwords && stopwords.length) {
        stopwords.forEach(element => {
          _.map(this.stopwordsList, (stopword) => {
            if (stopword === element) {
              duplicate = true;
            }
          });
        });
      }
      this.validation.duplicate = duplicate;
      if (!this.validation.spaceFound && !this.validation.duplicate && event.keyCode === 13) {
        this.addStopWords();
      }
    }
  }
  // SORT STOP WORDS
  addStopWords() {
    this.submitted = true;
    if (this.validateAddStopWord()) {
      const stopwords = (this.newStopWord || '').split(',');
      this.stopwordsList = _.uniq(this.stopwordsList.concat(stopwords)).sort();
      this.stopwordsList = _.filter(this.stopwordsList, (stopword) => {
        return stopword !== '';
      })
      this.createStopWords(false,this.stopwordsList);
      this.submitted = false;
    }
    else {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }
  // CREATING AND UPDATING THE STOPWORDS (UPDATE API CALL) 
  createStopWords(type,stopwordsArr?,reset?,removeDefault?){   // type here is a boolean for to check for adding Default(true) or adding manually(false)
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    const payload: any = {
      languageCode: 'en',
      defaultStopwords:type,
      resetStopwords:reset,        
      stopwords: stopwordsArr,
      removeDefault:removeDefault
    };
    if(reset || removeDefault) {
      delete payload.defaultStopwords
      delete payload.stopwords
      if(removeDefault){
        delete payload.resetStopwords
      }
    }
    this.service.invoke('put.createStopWords',quaryparms,payload).subscribe(res => {
       this.stopwordsList = res.stopwords // updating Display Array
       let message = reset?'Resetting Stop Words Successfully':removeDefault?'Default Stop Words Removed Succesfully':'Default Stop Words Added Succesfully';
       this.notificationService.notify(message, 'success');
       this.newStopWord = '';
       this.checkForDefaultStopWords()
    }, errRes => {
      if(type) this.notificationService.notify('Failed To Add Stopwords', 'success')
    });
  }
  // DELETING AND UPDATING THE STOPWORDS (DELETE API CALL)
  deleteStopWords(type,index?,word?,dialogRef?){          //type here is boolean for deleting all(true) or single stop word(false)
    let deleteStopWordsArr = [];
    type==true?deleteStopWordsArr = [...this.stopwordsList]:deleteStopWordsArr=[word]
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    const payload: any = {
      language: 'en',
      stopwords:deleteStopWordsArr,
      deleteAll:type
    };
    this.service.invoke('delete.deleteStopWords',quaryparms,payload).subscribe(res => {
    if(type == false){
      this.stopwordsList = this.stopwordsList.filter(e => e !== `${word}`);
      // this.stopwordsList.splice(index,1);
      this.notificationService.notify(`${word} Stop Word Deleted successfully`, 'success')
    }
    else {
      this.stopwordsList = [];
      this.notificationService.notify('All Stop words Deleted Successfully', 'success')
      this.createFromScratch = false;
      this.checkStopwords = false;
    }
    if (dialogRef && dialogRef.close) {
      dialogRef.close();
    }
  }, errRes => {
    if(type == false)this.errorToaster(errRes, `Failed to delete ${word}`);
    if(type == true)this.errorToaster(errRes, `Failed to delete all stop words `);
   });
  }
 // CONFIRMATION POPUP FOR DELETE ALL
   deleteAllConfirmationPopUp(event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete  All StopWords',
        newTitle: 'Are you sure you want to delete ?',
        body: 'All the stopwords will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.loadingWords = true;
          this.deleteStopWords(true,'','',dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  deleteSingleStopWordConfirmationPopUp(index, event, word) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Stop Word',
        text: 'Are you sure you want to delete selected Stop Word?',
        newTitle: 'Are you sure you want to delete ?',
        body: '"'+'<b>'+word+'</b>'+'"' + ' will be removed from stopword list',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteStopWords(false,index,word,dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  resetToDefault(event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete  All StopWords',
        newTitle: 'Are you sure you want to reset ?',
        body: 'Stop words will be reset to system-defined values.',
        buttons: [{ key: 'yes', label: 'Reset', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.createStopWords(false,'',true)
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  getQuerypipeline(){
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(
      (res) => {
        this.stopwordData = res?.settings.stopwords;
      },
      (errRes) => {
        this.notificationService.notify(
          'failed to get querypipeline details',
          'error'
        );
      }
    );
  }
   sildervaluechanged(event){
    const quaryparms:any={
      indexPipelineId:this.workflowService.selectedIndexPipeline(),
      queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexId:this.serachIndexId
    }
      const payload:any={
        settings: {
          stopwords: {
            enable: event.target.checked
        }
      }    
    }
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.stopwordData.enable=res?.settings?.stopwords.enable
      this.stopwordData.enable?this.notificationService.notify("Stop Words Enabled",'success'):this.notificationService.notify("Stop Words Disabled",'success')
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
   
  } 
  // -----------------------------(AUTHOR:BHARADWAJ)
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : false;
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchStopwords = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }
}
