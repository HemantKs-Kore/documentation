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
    this.setResetNewMappingsObj();
  }
  addField(){
    console.log(this.newFieldObj);
    this.closeModalPopup();
  }
  setResetNewMappingsObj(){
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
    this.newFieldObj = {
       defaultValue: '',
        indexed: false,
        isDynamic: false,
        isMulti: false,
        name: '',
        required: false,
        stored: false,
        type: 'string'
    }
    this.addFieldModalPopRef = this.addFieldModalPop.open();
  }
  closeModalPopup(){
    this.addFieldModalPopRef.close();
    this.newMappingObj = null;
  }
  getIndexPipline() {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId
    };
    this.service.invoke('get.indexPipeline', quaryparms).subscribe(res => {
     this.pipeline=  res.stages || [];
      this.loadingContent = false;
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get index  stages');
    });
  }
  getSystemStages() {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
    };
    this.service.invoke('get.platformStages', quaryparms).subscribe(res => {
     this.defaultStageTypes =  res.stages || [];
     this.fieldStage = new StageClass();
     this.fieldStage.name = 'My Stage';
     this.fieldStage.type = 'fields';
     this.fieldStage.catagory = 'fields';
     this.fieldStage.config.mappings = [];
     this.selectedStage = this.fieldStage;
      this.loadingContent = false;
    }, errRes => {
      this.loadingContent = false;
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

