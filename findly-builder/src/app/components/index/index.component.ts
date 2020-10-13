import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import * as _ from 'underscore';
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
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
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
  showSearch;
  searchFields;
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
  saveConfig(){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId
    };
    this.service.invoke('post.indexPipeline', quaryparms,this.selectedStage).subscribe(res => {
     this.pipeline=  res.stages || [];
    }, errRes => {
      this.errorToaster(errRes,'Failed to get stop words');
    });
  }
  openModalPopup(){
    this.addFieldModalPopRef = this.addFieldModalPop.open();
  }
  addEditFiled(field?){
    if(field){
      const quaryparms: any = {
        searchIndexID:this.serachIndexId,
        fieldId:field._id,
      };
      this.service.invoke('get.getFieldById', quaryparms).subscribe(res => {
        this.newMappingObj = res;
      }, errRes => {
        this.errorToaster(errRes,'Failed to get field');
      });
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
    };
    let api  = 'post.createField';
    if(this.newMappingObj && this.newMappingObj._id){
      api = 'put.put.updateField'
    }
    this.service.invoke(api, quaryparms,payload).subscribe(res => {
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
    this.service.invoke('get.indexPipeline', quaryparms).subscribe(res => {
     this.pipeline=  res.stages || [];
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
  selectStage(stage){
    this.selectedStage = stage;
  }
  checkDuplicateTags(suggestion: string,alltTags): boolean {
    return  alltTags.every((f) => f !== suggestion);
  }
  addEntityList(event: MatChipInputEvent,map){
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
    const index = map.entity_types.indexOf(entity);
    if (index >= 0) {
      map.entity_types.splice(index, 1);
    }
  }
  addTraitsList(event: MatChipInputEvent,map){
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
    const index = map.trait_groups.indexOf(trait);
    if (index >= 0) {
      map.trait_groups.splice(index, 1);
    }
  }
  addKeyWordsList(event: MatChipInputEvent,map){
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
    const index = map.trait_groups.indexOf(trait);
    if (index >= 0) {
      map.trait_groups.splice(index, 1);
    }
  }
  addFiledmappings(map){
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
    const obj :any = new StageClass();
    const newArray = [];
    obj.name = this.defaultStageTypes[0].name;
    obj.type = this.defaultStageTypes[0].type;
    obj.catagory = this.defaultStageTypes[0].category;
    newArray.push(obj)
    this.pipeline = newArray.concat(this.pipeline);
    this.selectedStage = this.pipeline[0];
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

