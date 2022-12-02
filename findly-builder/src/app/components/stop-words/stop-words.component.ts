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
  searchStopwords: any = '';
  newStopWord: any = '';
  showSearch = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  activeClose = false;
  loadingStopWords:boolean = false;
  checkStopwords:boolean = false;
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
  stopWordsIntiType = 'default'
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
      }
    }
  }
  toggleSearch() {
    if (this.showSearch && this.searchStopwords) {
      this.searchStopwords = '';
    }
    this.showSearch = !this.showSearch
  }
  createInit() {
    if (this.stopWordsIntiType === 'default') {
      // this.checkStopwords = true
      this.createStopWords(true);
    } else {
      this.createFromScratch = true;
    }
  }
  getStopWords() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
      this.pipeline = res.pipeline || {};
      // if (res.pipeline.stages[2].options) {
      //   this.enabled = res.pipeline.stages[2].options.stopWordsRemovalEnabled;
      // }
      if (this.pipeline.stages && this.pipeline.stages.length) {
        this.pipeline.stages.forEach(stage => {
          if (stage && stage.type === 'stopwords') {
            this.stopwords = stage.stopwords || [];
            if (stage.options) {
              this.enabled = stage.options.stopWordsEnabled;
      }
          }
        });
      }
      if (res.length > 0) {
        this.loadingForStopWords = false;
        this.loadingContent = false;
        this.loadingContent1 = true;
      }
      else {
        this.loadingContent1 = true;
        // if(!this.inlineManual.checkVisibility('STOP_WORDS')){
        //   this.inlineManual.openHelp('STOP_WORDS')
        //   this.inlineManual.visited('STOP_WORDS')
        // }
      }
      this.loadingContent = false;
      res.pipeline.stages[2].options.stopWordsEnabled = this.enabled;
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get stop words');
    });
  }
  enableStopWords(event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const modalData: any = {
      newTitle: 'Are you sure you want to Enable ?',
      body: 'Stopwords will be enabled.',
      buttons: [{ key: 'yes', label: 'Enable' }, { key: 'no', label: 'Cancel' }],
      confirmationPopUp: true
    }
    if (!this.enabled) {
      modalData.newTitle = 'Are you sure you want to disable?'
      modalData.body = 'Stopwords will be disabled. ';
      modalData.buttons[0].label = 'Disable';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: modalData,

    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.updateStopWords(dialogRef, true);
        } else if (result === 'no') {
          this.enabled = !this.enabled;
          dialogRef.close();
        }
      })
  }
  restore(dialogRef?) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    this.service.invoke('post.restoreStopWord', quaryparms).subscribe(res => {
      this.newStopWord = '';
      this.pipeline = res.pipeline || {};
      // res.pipeline.stages[2].options.stopWordsRemovalEnabled = true
      if (this.pipeline.stages && this.pipeline.stages.length) {
        this.pipeline.stages.forEach(stage => {
          if (stage && stage.type === 'stopwords') {
            this.stopwords = stage.stopwords || [];
            if (stage.options) {
              this.enabled = stage.options.stopWordsEnabled;
            }
            if (!(this.stopwords && this.stopwords.length) && !dialogRef) {
              this.notificationService.notify('No default stop words available', 'error');
            } else {
              if (this.stopwords.length === 0) this.appSelectionService.updateTourConfig(this.componentType);
            }
          }
        });
      }
      if (dialogRef && dialogRef.close) {
        dialogRef.close();
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to create default stop words');
    });
  }
  restoreStopWords(event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore Stop Words',
        text: 'Are you sure you want to reset Stop Words?',
        newTitle: 'Are you sure you want to reset ?',
        body: 'Stop words will be reset to system-defined values.',
        buttons: [{ key: 'yes', label: 'Reset' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.restore(dialogRef);
          this.notificationService.notify('Reset Successful', 'success');
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  getActiveSearch() {
    return $('.stopwordBlock').length;
  }
  deleteInfividualStopWords(index, event, word, list) {
    if (event) {
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
        newTitle: 'Are you sure you want to delete ?',
        body: word + ' will be removed from stopword list',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.loadingWords = true;
          const deleteindex = this.stopwords.findIndex(f => f === word);
          if (deleteindex > -1) {
            this.stopwords.splice(deleteindex, 1);
          }
          this.updateStopWords(dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  updateStopWords(dialogRef?, enableOrDisable?, deleteAll?) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    let msg = 'Updated Successfully';
    if (!enableOrDisable) {
      if (this.pipeline.stages && this.pipeline.stages.length) {
        this.pipeline.stages.forEach(stage => {
          if (stage && stage.type === 'stopwords') {
            stage.stopwords = this.stopwords;
          }
        });
      }
    }
    if (deleteAll) {
      this.stopwords = []
      this.enabled = false
    }
    const payload: any = {
      pipeline: {
        stopwords: this.stopwords
      },
      options: {
        stopWordsEnabled: this.enabled
      }
    }
    // if (deleteAll) {
    //   this.stopwords = [],
    //   this.enabled = false
    // }
    if (enableOrDisable) {
      msg = 'Stop words ' + (this.enabled ? 'enabled' : 'disabled') + ' successfully';
    }
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(res => {
      this.newStopWord = '';
      if (dialogRef && dialogRef.close) {
        dialogRef.close();
        if (!enableOrDisable) {
          msg = 'Deleted Successfully';
        }
        else {
          if (this.stopwords.length === 0) this.appSelectionService.updateTourConfig(this.componentType);
        }
      }
      this.notificationService.notify(msg, 'success');
      this.loadingWords = false;
    }, errRes => {
      this.loadingWords = false;
      this.errorToaster(errRes, 'Failed to update');
    });
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

  addStopWord(event) {
    this.submitted = true;
    if (this.validateAddStopWord()) {
      const stopwords = (this.newStopWord || '').split(',');
      this.stopwords = _.uniq(this.stopwords.concat(stopwords)).sort();
      this.stopwords = _.filter(this.stopwords, (stopword) => {
        return stopword !== '';
      })
      this.updateStopWords();
      this.submitted = false;
    }
    else {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }

//-----------------------------(AUTHOR:BHARADWAJ)

// GET LIST OF STOPWORDS (GET API CALL)
  getStopWordsList() {
    this.loadingStopWords = true
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      code:'en'
    };
    this.service.invoke('get.stopWordsList', quaryparms).subscribe(res => {
      if(res && res.stopwords){
        this.stopwordsList = res.stopwords;
        this.loadingStopWords = false
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
      this.createStopWords(false,this.newStopWord);
      this.submitted = false;
    }
    else {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }
  // CREATING AND UPDATING THE STOPWORDS (UPDATE API CALL) 
  createStopWords(type,stopwordsArr?,reset?){   // type here is a boolean for to check for adding Default(true) or adding manually(false)
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    const payload: any = {
      languageCode: 'en',
      defaultStopwords:type,
      resetStopwords:reset,         //reset is to have only default Stop Words
      stopwords: stopwordsArr
    };
    if(reset) {
      delete payload.defaultStopwords
      delete payload.stopwords
    }
    this.loadingStopWords = true;
    this.service.invoke('put.createStopWords',quaryparms,payload).subscribe(res => {
       this.stopwordsList = [...res.stopwords] // updating Display Array
       this.loadingStopWords = false;
       this.notificationService.notify('Stopwords Added Successfully', 'success');
       this.newStopWord = '';
    }, errRes => {
      if(type == true) this.notificationService.notify('Failed To Add Stopwords', 'success')
      if(type == false) this.notificationService.notify('Failed To Add Stopword', 'success')   
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
      this.stopwordsList.splice(index,1);
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
