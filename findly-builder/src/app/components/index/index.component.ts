import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as _ from 'underscore';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  selectedApp: any = {};
  serachIndexId;
  indexPipelineId;
  pipeline;
  addFieldModalPopRef:any;
  loadingContent = true;
  indexStages:any = {}
  indexMappings = []
  newStageObj:any = {
    addNew: false,
  }
  filelds:any = [];
  fieldStage:any ={};
  selectedStage;
  changesDetected;
  currentEditIndex :any= -1;
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  newStage:any ={
    name :'My Mapping'
  }
  newFieldObj :any = null
  defaultStageTypes:any = [];
  selectedMapping:any = {};
  actionItmes:any = [{type:'set'},{type:'rename'},{type:'copy'},{type:'Delete'}];
  newMappingObj:any = {}
  simulteObj:any = {
    sourceType: 'page',
    docCount: 5,
    showSimulation: false,
  }
  defaultStageTypesObj:any = {
    field_mapping:{
      name:'Field Mapping',
      valueSet:{ alloperations:['set','rename','copy','remove'],
                set:['target_field','value'],
                remove:['target_field'],
              }
    },
    entity_extraction:{
      name:'Entity Extraction'
    },
    keyword_extraction:{
      name:'Keyword Extraction'
    },
    traits_extraction:{
      name:'Traits Extraction'
    },
    custom_script:{
      name:'Custom Script'
    },
  }
  entitySuggestionTags :any = ['Entity 1','Entity 2' ,'Entity 3','Entity 4','Entity 5'];
  traitsSuggesitions : any = [];
  showSearch;
  searchFields;
  pipelineCopy;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.getSystemStages();
    this.getIndexPipline();
    this.getFileds();
    this.setResetNewMappingsObj();
    this.selectedStage = JSON.parse(JSON.stringify(this.fieldStage));
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pipeline, event.previousIndex, event.currentIndex);
  }
  selectedTag(data: MatAutocompleteSelectedEvent , list) {
    this.suggestedInput.nativeElement.value = '';
    list.push(data.option.viewValue);
  }
  setResetNewMappingsObj(){
    this.simulteObj = {
      sourceType: 'page',
      docCount: 5,
      showSimulation: false,
    }
    this.fieldStage = {type : 'fields'};
    this.newMappingObj = {
      field_mapping:{
        defaultValue : {
          operation:'set',
          target_field:'',
          value:'',
        }
      },
      entity_extraction:{
        defaultValue : {
          source_field:'',
          target_field:'',
          entity_types:[],
        }
      },
      traits_extraction:{
        defaultValue : {
          source_field:'',
          target_field:'',
          trait_groups:[],
        }
      },
      keyword_extraction:{
        defaultValue : {
          source_field:'',
          target_field:'',
          keywords:[],
        }
      },
      custom_ccript:{
        defaultValue : {
          source_field:'',
          target_field:'',
          keywords:[],
        }
      }
    }
  }
  toggleSearch(){
    if(this.showSearch && this.searchFields){
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch
  }
  saveConfig(index?,dialogRef?){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId
    };
    this.service.invoke('put.indexPipeline', quaryparms,{stages:this.pipeline}).subscribe(res => {
     this.pipeline=  res.stages || [];
     this.pipelineCopy = JSON.parse(JSON.stringify(res.stages));
      if(dialogRef && dialogRef.close){
        dialogRef.close();
      }
      if(index !== 'null' && index !== undefined && (index>-1)){
       this.currentEditIndex = -1
      }
    }, errRes => {
      this.errorToaster(errRes,'Failed to get stop words');
    });
  }
  openModalPopup(){
    this.addFieldModalPopRef = this.addFieldModalPop.open();
  }
  addEditFiled(field?){
    if(field){
      this.newFieldObj = field;
    } else{
      this.newFieldObj = {
        fieldName: '',
        fieldDataType: 'string',
        isMultiValued: true,
        isRequired: false,
        isStored: false,
        isIndexed: true
      }
    }
    this.openModalPopup();
  }
  closeModalPopup(){
    this.addFieldModalPopRef.close();
    this.newMappingObj = null;
  }
  simulate(){
    const payload :any ={
      sourceType: this.simulteObj.sourceType,
      noOfDocuments:  this.simulteObj.docCount || 5
    }
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId
    };
    this.service.invoke('post.simulate', quaryparms,payload).subscribe(res => {
      this.simulteObj = {
        sourceType: 'page',
        docCount: 5,
        showSimulation: true,
        simulation:res
      }
    }, errRes => {
      this.errorToaster(errRes,'Failed to get stop words');
    });
  }
  removeStage(i){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Stage',
        text: 'Are you sure you want to delete selected stage?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.pipeline.splice(i,1);
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  addField(){
    const payload:any = {
      fieldName: this.newFieldObj.fieldName,
      fieldDataType: this.newFieldObj.fieldDataType,
      isMultiValued: this.newFieldObj.isMultiValued,
      isRequired: this.newFieldObj.isRequired,
      isStored: this.newFieldObj.isStored,
      isIndexed: this.newFieldObj.isIndexed,
    }
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId,
      fieldId:this.newFieldObj._id
    };
    let api  = 'post.createField';
    if(this.newFieldObj && this.newFieldObj._id){
      api = 'put.updateField'
    }
    this.service.invoke(api, quaryparms,payload).subscribe(res => {
      if(this.newFieldObj && this.newFieldObj._id){
        this.notificationService.notify('Field updated successfully','success');
      } else {
        this.notificationService.notify('Field added successfully','success');
      }
      this.getFileds();
      this.closeModalPopup();
    }, errRes => {
      this.errorToaster(errRes,'Failed to create field');
    });
  }
  getFileds(offset?){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId,
      offset: offset || 0,
      limit:100
    };
    this.service.invoke('get.allField', quaryparms).subscribe(res => {
      this.filelds=  res || [];
      this.loadingContent = false;
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get index  stages');
    });
  }
  deleteIndField(record,dialogRef){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      fieldId:record._id,
    };
    this.service.invoke('delete.deleteField', quaryparms).subscribe(res => {
      const deleteIndex = _.findIndex(this.filelds, (pg) => {
        return pg._id === record._id;
      })
      this.filelds.splice(deleteIndex,1);
      dialogRef.close();
    }, errRes => {
      this.errorToaster(errRes,'Failed to delete field');
    });
  }
  deleteFieldPop(record) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Field',
        text: 'Are you sure you want to delete selected field?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteIndField(record,dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  getIndexPipline() {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId
    };
    this.service.invoke('get.indexpipelineStages', quaryparms).subscribe(res => {
     this.pipeline=  res.stages || [];
     this.pipelineCopy = JSON.parse(JSON.stringify(res.stages));
    }, errRes => {
      this.errorToaster(errRes,'Failed to get index  stages');
    });
  }
  getSystemStages() {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
    };
    this.service.invoke('get.platformStages', quaryparms).subscribe(res => {
     this.defaultStageTypes =  res.stages || [];
     this.selectedStage = this.fieldStage;
    }, errRes => {
      this.errorToaster(errRes,'Failed to get stop words');
    });
  }
  confirmChangeDiscard(newstage?,i?){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Discard current changes',
        text: 'Are you sure you want to discard current?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          if(this.pipeline.length > this.pipelineCopy) {
            i = i-1;
          }
          this.clearDirtyObj();
          if(newstage){
            this.selectStage(newstage,i);
          } else {
            this.createNewMap();
          }
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  clearDirtyObj(){
    this.pipeline = JSON.parse(JSON.stringify(this.pipelineCopy));
    this.currentEditIndex = -1;
    this.changesDetected = false;
  }
  selectStage(stage,i){
    if(this.changesDetected){
     this.confirmChangeDiscard(stage,i);
    } else {
      this.currentEditIndex = i;
      this.selectedStage = stage;
    }
  }
  checkDuplicateTags(suggestion: string,alltTags): boolean {
    return  alltTags.every((f) => f !== suggestion);
  }
  addEntityList(event: MatChipInputEvent,map){
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(),map.entity_types)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return ;
      } else {
        map.entity_types.push( value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  removeEntityList(map,entity) {
    this.changesDetected = true;
    const index = map.entity_types.indexOf(entity);
    if (index >= 0) {
      map.entity_types.splice(index, 1);
    }
  }
  addTraitsList(event: MatChipInputEvent,map){
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(),map.trait_groups)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return ;
      } else {
        map.trait_groups.push( value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  removeKeyWordsList(map,trait) {
    this.changesDetected = true;
    const index = map.trait_groups.indexOf(trait);
    if (index >= 0) {
      map.trait_groups.splice(index, 1);
    }
  }
  addKeyWordsList(event: MatChipInputEvent,map){
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(),map.trait_groups)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return ;
      } else {
        map.trait_groups.push( value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  removeTraitsList(map,trait) {
    this.changesDetected = true;
    const index = map.trait_groups.indexOf(trait);
    if (index >= 0) {
      map.trait_groups.splice(index, 1);
    }
  }
  addFiledmappings(map){
    this.changesDetected = true;
    if(!this.selectedStage.config){
      this.selectedStage.config = {
        mappings:[]
      }
    }
    if(!this.selectedStage.config.mappings){
      this.selectedStage.config.mappings = [];
    }
    this.selectedStage.config.mappings.push(map);
    this.setResetNewMappingsObj();
  }
  createNewMap(){
    if(this.changesDetected){
      this.confirmChangeDiscard()
    } else {
    this.changesDetected = true;
    const obj :any = new StageClass();
    const newArray = [];
    obj.name = 'My Stage';
    obj.type = this.defaultStageTypes[0].type;
    obj.catagory = this.defaultStageTypes[0].category;
    newArray.push(obj)
    this.pipeline = newArray.concat(this.pipeline);
    this.selectedStage = this.pipeline[0];
    }
  }
  selectNewItem(defaultStage){
    this.newStageObj = JSON.parse(JSON.stringify(defaultStage));
  }
  errorToaster(errRes,message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
  }
 }
}
class StageClass {
  name: string
  category: string
  type: string
  condition: string
  config: any = {}
}

