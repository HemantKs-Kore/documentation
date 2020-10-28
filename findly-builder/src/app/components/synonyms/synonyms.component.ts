import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SynonymFilterPipe } from './synonym-filter'
import * as _ from 'underscore';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
declare const $: any;

@Component({
  selector: 'app-synonyms',
  templateUrl: './synonyms.component.html',
  styleUrls: ['./synonyms.component.scss']
})
export class SynonymsComponent implements OnInit {
  selectedApp: any = {};
  synonymSearch;
  serachIndexId
  loadingContent = true;
  haveRecord = false;
  currentEditIndex: any = -1;
  pipeline;
  synonymData : any[] = [];
  synonymDataBack : any[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  queryPipelineId;
  newSynonymObj:any = {
    type:'synonym',
    addNew:false,
    values:[]
  }
  selectedFilter:any;
  createFromScratch:any;
  synonymObj;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  synArr : any[] = [];
  synArrTemp: any[] = [];
  constructor( public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,) {
    this.synonymObj = new SynonymClass();
  }


  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId =  this.selectedApp.searchIndexes[0].queryPipelineId;
    this.getSynonyms();
  }
  prepareSynonyms(){
    if(this.pipeline.stages && this.pipeline.stages.length){
      this.pipeline.stages.forEach(stage => {
        if(stage && stage.type === 'synonyms'){
          this.synonymData = JSON.parse(JSON.stringify(stage.synonyms || []));
        }
      });
    }
  }
  getSynonyms(){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
      this.pipeline=  res.pipeline || {};
      this.loadingContent = false;
      this.prepareSynonyms();
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get stop words');
    });
  }
  selectFilter(type){
    this.selectedFilter = type;
  }
  addNewSynonyms(){
    const obj:any = {
      type: this.newSynonymObj.type,
      values:this.newSynonymObj.values
    }
    if(this.newSynonymObj.type==='oneWaySynonym'){
      if(!(this.newSynonymObj.values && this.newSynonymObj.values.length)){
        this.notificationService.notify('Synonyms cannot be empty','error');
          return;
      }
      if(!this.newSynonymObj.keyword){
        this.notificationService.notify('Please enter keyword','error');
        return;
      } else {
        obj.keyword = this.newSynonymObj.keyword;
      }
    }
    this.synonymData.push(obj);
    this.addOrUpddate(this.synonymData);
  }
  cancleAddEdit(){
    this.currentEditIndex = -1;
    this.newSynonymObj = {
      type:'synonym',
      addNew:false,
      values:[]
     }
    this.synonymObj = new SynonymClass();
    this.prepareSynonyms();
  }
  addOrUpddate(synonymData,dialogRef?) {
    synonymData = synonymData || this.synonymData;
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    const payload: any ={
      pipeline:{
        synonyms:synonymData
      }
    }
    if(payload.pipeline.stages && payload.pipeline.stages.length){
      payload.pipeline.stages.forEach(stage => {
        if( stage && stage.type === 'synonyms') {
          stage.synonyms = synonymData || [];
        }
      });
    }
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(res => {
     this.pipeline=  res.pipeline || {};
     this.prepareSynonyms();
     this.cancleAddEdit();
     this.notificationService.notify('Synonyms added successfully','success');
     if(dialogRef && dialogRef.close){
      dialogRef.close();
     }
    }, errRes => {
      this.errorToaster(errRes,'Failed to add Weight');
    });
  }
  errorToaster(errRes,message){
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
  }
 }
  editSynRecord(record,event,i) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    this.cancleAddEdit();
    this.currentEditIndex = i
  }
  updateSynonm(record,event,i){
    if(record.type==='oneWaySynonym'){
      if(!record.keyword){
        this.notificationService.notify('Please enter keyword','error');
        return;
      }
    }
    if(!(record.values && record.values.length)){
      this.notificationService.notify('Synonyms cannot be empty','error');
        return;
    }
    this.addOrUpddate(this.synonymData);
  }
  deleteSynonym(record,event,index) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Synonym',
        text: 'Are you sure you want to delete selected synonym?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const synonyms = JSON.parse(JSON.stringify(this.synonymData));
          synonyms.splice(index,1);
          this.addOrUpddate(synonyms,dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  checkDuplicateTags(suggestion: string,alltTags): boolean {
    return  alltTags.every((f) => f !== suggestion);
  }
  add(event: MatChipInputEvent){
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(),this.newSynonymObj.values)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return ;
      } else {
        this.newSynonymObj.values.push( value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  enableAddNewSynonymBtn(){
    this.currentEditIndex = -1;
    if(!this.newSynonymObj.addNew){
      this.newSynonymObj.type='synonym'
      this.newSynonymObj.addNew = true;
    }
  }
  cancleAddSynonyms(){
      this.newSynonymObj.type='synonym'
      this.newSynonymObj.addNew = false;
  }
  addList(event: MatChipInputEvent,synonymId,i){
    const input = event.input;
    const value = event.value;
    const synonyms = [...this.synonymData];
    if ((value || '').trim()) {
      if ((value || '').trim()) {
        if (!this.checkDuplicateTags((value || '').trim(),synonyms[i].values)) {
          this.notificationService.notify('Duplicate tags are not allowed', 'warning');
          return ;
        } else {
          this.newSynonymObj.values.push( value.trim());
        }
      }
      synonyms[i].values.push( value.trim());
    }
    if (input) {
      input.value = '';
    }
  }
  removeList(syn,synonymId,i) {
    const synonyms = [...this.synonymData];
    const index = synonyms[i].values.indexOf(syn);
    if (index >= 0) {
      synonyms[i].values.splice(index, 1);
    }
  }
  remove(syn) {
    const index = this.newSynonymObj.values.indexOf(syn);
    if (index >= 0) {
      this.newSynonymObj.values.splice(index, 1);
    }
  }
}
class SynonymClass {
  name: String
  values: Array<String>
}

