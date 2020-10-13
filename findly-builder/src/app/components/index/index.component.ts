import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'underscore';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  selectedApp: any = {};
  serachIndexId;
  queryPipelineId;
  pipeline;
  loadingContent = true;
  indexStages:any = {}
  indexMappings = []
  newStageObj:any = {
    addNew: false,
  }
  newStage:any ={
    name :'My Mapping'
  }
  selectedMapping:any = {};
  defaultStageTypes = [
    {type:'field_mapping',name:'Field Mapping',addNew:true,condition:'',actions:[]},
    {type:'entity_extraction',name:'Entity Extraction',addNew:true,condition:'',actions:[]},
    {type:'keyword_extraction',name:'Keyword Extraction',addNew:true,condition:'',actions:[]},
    {type:'traits_extraction',name:'Traits Extraction',addNew:true,condition:'',actions:[]},
    {type:'custom_script',name:'Custom Script',addNew:true,condition:'',actions:[]},
    {type:'position',name:'Position',addNew:true,condition:'',actions:[]},
    {type:'cluster',name:'Cluster',addNew:true,condition:'',actions:[]},
    {type:'indexer',name:'Indexer'},
  ]
  actionItmes:any = [{type:'set'},{type:'rename'},{type:'copy'},{type:'Delete'}];
  defaultStageTypesObj:any = {
    field_mapping:{
      name:'Field Mapping'
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
    position:{
      name:'Position'
    },
    cluster:{
      name:'Cluster'
    },
    indexer:{
      name:'Field Mapping'
    }
  }
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
    this.getIndexPipline();
  }
  selectmapping(stage){
   this.selectedMapping =this.indexStages[stage].mappings;
  }
  prepareStageWiseData(stages,setdefaultFields?){
    this.indexStages = {};
    stages.forEach(stage => {
     if(!this.indexStages[stage.type]){
      this.indexStages[stage.type] = {
        mappings : [],
        name: stage.name
      }
     }
     this.indexStages[stage.type].mappings.push(stage);
     if(setdefaultFields){
       this.selectmapping('field_mapping');
     }
    });
    const tempStages = Object.keys(this.indexStages);
    if(tempStages && tempStages.length){
      tempStages.forEach(stage => {
        const temoObj = {
          stage,
          name:this.indexStages[stage].name,
          mappings : this.indexStages[stage].mappings,
        }
        this.indexMappings.push(temoObj);
      });
    }
  }
  getIndexPipline() {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    this.service.invoke('get.indexPipeline', quaryparms).subscribe(res => {
     this.pipeline=  res.stages || {};
      this.loadingContent = false;
      this.prepareStageWiseData(this.pipeline,true);
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get stop words');
    });
  }
  createNewMap(){
    this.newStageObj = JSON.parse(JSON.stringify(this.defaultStageTypes[0]));
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
