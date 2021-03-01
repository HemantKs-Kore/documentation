import { Component, OnInit,ViewEncapsulation, HostListener, Input, ViewChild, OnDestroy } from '@angular/core';
import { SideBarService } from '../../services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ActivatedRoute, Routes, Router } from '@angular/router';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '@kore.services/notification.service';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
declare const $: any;
@Component({
  selector: 'app-mainmenu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppMenuComponent implements OnInit , OnDestroy{

  selected = '';
  trainingMenu = false;
  addFieldModalPopRef:any;
  addIndexFieldModalPopRef : any;
  statusDockerModalPopRef : any;
  loadingQueryPipelines:any = true;
  queryConfigs:any = [];
  indexConfigs:any = 
  [
    {
      "_id": "fip-29dee24c-0be2-5ca3-9340-b3fcb9ea965a",
      "stages": [
          {
              "name": "amazing stage",
              "type": "field_mapping"
          }
      ],
      "default": true,
      "createdBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
      "name": "Default",
      "searchIndexId": "sidx-14f596e8-9e10-59cc-8fcf-515e16eab654",
      "lModBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
      "lModOn": "2021-02-08T08:35:46.050Z",
      "streamId": "st-03fe1a81-cf78-53ea-94ea-bfc3918d20cb",
      "__v": 0
  },{
    "_id": "fip-29dee24c-0be2-5ca3-9340-b3fcb9ea965b",
    "stages": [
        {
            "name": "amazing stage",
            "type": "field_mapping"
        }
    ],
    "default": false,
    "createdBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
    "name": "pipeline",
    "searchIndexId": "sidx-14f596e8-9e10-59cc-8fcf-515e16eab654",
    "lModBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
    "lModOn": "2021-02-08T08:35:46.050Z",
    "streamId": "st-03fe1a81-cf78-53ea-94ea-bfc3918d20cb",
    "__v": 0
},
{
  "_id": "fip-29dee24c-0be2-5ca3-9340-b3fcb9ea965c",
  "stages": [
      {
          "name": "amazing stage",
          "type": "field_mapping"
      }
  ],
  "default": false,
  "createdBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
  "name": "pipeline1",
  "searchIndexId": "sidx-14f596e8-9e10-59cc-8fcf-515e16eab654",
  "lModBy": "u-c64b1dd4-a67e-58a5-821e-040dcb342eb4",
  "lModOn": "2021-02-08T08:35:46.050Z",
  "streamId": "st-03fe1a81-cf78-53ea-94ea-bfc3918d20cb",
  "__v": 0
},
];
  newConfigObj:any = {
    method:'default',
    name:''
  };
  newIndexConfigObj :any = {
    method:'default',
    name:''
  }
  searchPipeline:any = '';
  queryConfigsRouts:any = {
    '/synonyms':true,
    '/stopWords':true,
    '/weights':true,
    '/facets':true,
    '/resultranking':true,
  }

  configObj:any = {};
  selectedConfig:any ={};
  indexConfigObj : any = {};
  selectedIndexConfig : any = {};
  subscription:Subscription;
  indexSub : Subscription;
  editName : boolean = false;
  editNameVal : String = "";
  editIndexName : boolean = false;
  editIndexNameVal : String = "";
  public showStatusDocker : boolean = false;
  public statusDockerLoading : boolean = false;
  public dockersList : Array<any> = [];
  @Input() show;
  @Input() settingMainMenu;
  @ViewChild('addIndexFieldModalPop') addIndexFieldModalPop: KRModalComponent;
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('statusDockerModalPop') statusDockerModalPop: KRModalComponent;
  
  constructor( private service:ServiceInvokerService,
      private headerService: SideBarService,
      private workflowService: WorkflowService,
      private router: Router, private activetedRoute:ActivatedRoute,
      private notify: NotificationService,
      private appSelectionService:AppSelectionService,
      public dockService: DockStatusService,
      ) { }
  goHome(){
    this.workflowService.selectedApp(null);
    this.router.navigate(['/apps'], { skipLocationChange: true });
  };
  preview(selection) {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
  }
  reloadCurrentRoute() {
    let route = '/source';
    const previousState = this.appSelectionService.getPreviousState();
    if(previousState.route){
      route = previousState.route
     }
     try {
       if(route && this.queryConfigsRouts[route]){
        if(this.workflowService.selectedApp() && this.workflowService.selectedApp().searchIndexes && this.workflowService.selectedApp().searchIndexes.length){
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([route],{ skipLocationChange: true });
        });
         }
       }
     } catch (e) {
     }
  }
  selectDefault(){
    this.newConfigObj._id = this.selectedConfig;
  }
  editIndexConfig(config,action){
    this.editIndexName = true;
    this.editIndexNameVal = config.name;
    this.selectIndexPipelineId(config,null,'edit')
  }
  editConfig(config,action){
    this.editName = true;
    this.editNameVal = config.name;
    this.selectQueryPipelineId(config,null,'edit')
  }
  markAsDefaultIndex(config,action?){
    this.editIndexName = false;
    const queryParms ={
      queryPipelineId:config._id,
      searchIndexID:this.workflowService.selectedSearchIndexId
    }
    let payload = {}
    if(action == 'edit'){
       payload = {
        name:this.editIndexNameVal,
      }
    }else{
       payload = {
        default:true,
      }
    }
    this.service.invoke('post.newIndexPipeline', queryParms, payload).subscribe(
      res => {
        this.notify.notify('Set to default Index successfully','success');
        this.appSelectionService.getIndexPipelineIds(config);
        if(config && config._id && action !== 'edit'){
          this.selectQueryPipelineId(config);
        }
       this.closeIndexModalPopup();
      },
      errRes => {
        this.errorToaster(errRes,'Failed to Create indexPipeline');
      }
    );
  }
  markAsDefault(config,action?){
    this.editName = false;
    const queryParms ={
      queryPipelineId:config._id,
      searchIndexID:this.workflowService.selectedSearchIndexId,
      indexpipelineId: this.workflowService.selectedIndexPipeline() || '' 
    }
    let payload = {}
    if(action == 'edit'){
       payload = {
        name:this.editNameVal,
      }
    }else{
       payload = {
        default:true,
      }
    }
    this.service.invoke('put.queryPipeline', queryParms, payload).subscribe(
      res => {
        this.notify.notify('Set to default successfully','success');
       this.appSelectionService.getQureryPipelineIds(config);
       if(config && config._id && action !== 'edit'){
         this.selectQueryPipelineId(config);
       }
      },
      errRes => {
        this.errorToaster(errRes,'Failed to set successfully');
      }
    );
  }
  errorToaster(errRes,message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notify.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notify.notify(message, 'error');
    } else {
      this.notify.notify('Somthing went worng', 'error');
  }
 }
 createIndexConfig(){
  const payload:any = {
    method: this.newIndexConfigObj.method,
    name:this.newIndexConfigObj.name,
   }
   if(this.newIndexConfigObj.method === 'clone'){
    payload.sourceQueryPipelineId = this.newConfigObj._id
  }
  const queryParms = {
    searchIndexId: this.workflowService.selectedSearchIndexId
  }
  this.service.invoke('post.newIndexPipeline', queryParms, payload).subscribe(
    res => {
     if(res && res._id){
        this.notify.notify('New Index created successfully','success');
       this.selectIndexPipelineId(res);
     }
     this.closeIndexModalPopup();
    },
    errRes => {
      this.errorToaster(errRes,'Failed to Create indexPipeline');
    }
  );
 }
  createConfig(){
    const payload:any = {
     method: this.newConfigObj.method,
     name:this.newConfigObj.name,
    }
    if(this.newConfigObj.method === 'clone'){
      payload.sourceQueryPipelineId = this.newConfigObj._id
    }
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
      indexpipelineId: this.workflowService.selectedIndexPipeline() || ''
    }
    this.service.invoke('create.queryPipeline', queryParms, payload).subscribe(
      res => {
       this.appSelectionService.getQureryPipelineIds();
       if(res && res._id){
         this.selectQueryPipelineId(res);
       }
       this.closeModalPopup();
      },
      errRes => {
      }
    );
  }
  selectQueryPipelineId(queryConfigs,event?,type?){
    if(event && !this.editName){
      event.close();
    }
    if(this.editName && type){
      this.editName = true
    }else{
      this.editName = false;
      //event.close();
    }
    this.appSelectionService.selectQueryConfig(queryConfigs);
    this.selectedConfig = queryConfigs._id;
    this.reloadCurrentRoute()
  }
  deleteIndexPipeLine(indexConfigs,event?){
    if(event){
      event.close();
    }
    const queryParms ={
      indexPipelineId:indexConfigs._id
    }
    this.service.invoke('delete.indexPipeline', queryParms).subscribe(
      res => {
        this.notify.notify('deleted successfully','success');
      },
      errRes => {
        this.errorToaster(errRes,'Faile to delete.');
      }
    );
  }
  selectIndexPipelineId(indexConfigs,event?,type?){
    if(event){
      event.close();
    }
    if(this.editIndexName && type){
      this.editIndexName = true
    }else{
      this.editIndexName = false;
      //event.close();
    }
    //this.workflowService.selectedSearchIndex(indexConfigs._id)
    this.appSelectionService.getIndexPipelineIds(indexConfigs)
    this.selectedIndexConfig = indexConfigs._id;
    //.reloadCurrentRoute()
  }
  onKeypressEvent(e,config){
    if(e){
      e.stopPropagation();
    }
    if (e.keyCode == 13) {
      this.markAsDefault(config,'edit')
      return false;
  }
  }
  onKeypressIndexEvent(e,config){
    if(e){
      e.stopPropagation();
    }
    if (e.keyCode == 13) {
      this.markAsDefaultIndex(config,'edit')
      return false;
  }
  }
  ngOnInit() {
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res =>{
      this.queryConfigs = res;
      res.forEach(element => {
        this.configObj[element._id] = element;
      });
      this.selectedConfig = this.workflowService.selectedQueryPipeline()._id;
    })
    // Multiple INdex hardcoded
     this.appSelectionService.appSelectedConfigs.subscribe(res =>{
      this.indexConfigs = res;
       this.indexConfigs.forEach(element => {
        this.indexConfigObj[element._id] = element;
      });
      if(res.length > 0)
      this.selectedIndexConfig = res[0]._id;
    })
    // this.indexConfigs.forEach(element => {
    //   this.indexConfigObj[element._id] = element;
    // });
    // this.selectedConfig = 'fip-29dee24c-0be2-5ca3-9340-b3fcb9ea965a';
  }
  // toggle sub-menu
  switchToTerminal(){
    this.closeModalPopup();
  }
  toggleTranningMenu() {
    this.trainingMenu === false ? this.trainingMenu = true: this.trainingMenu = false;
  }
  closeModalPopup(){
    this.addFieldModalPopRef.close();
    this.newConfigObj = {
      method:'default',
      name:''
    };
  }
  closeIndexModalPopup(){
    this.addIndexFieldModalPopRef.close();
    this.newIndexConfigObj = {
      method:'default',
      name:''
    };
  }
  openModalPopup(){
    this.newConfigObj = {
      method:'default',
      name:''
    };
    this.addFieldModalPopRef = this.addFieldModalPop.open();
  }
  openIndexModalPopup(){
    this.newIndexConfigObj = {
      method:'default',
      name:''
    };
    this.addIndexFieldModalPopRef = this.addIndexFieldModalPop.open();
  }
  // Controlling the Status Docker Opening
  openStatusDocker(){
    if(this.dockService.showStatusDocker){
      this.statusDockerLoading = true;
      // this.getDockerData();
    }
  }

  getDockerData(){
    const queryParms ={
      searchIndexId:this.workflowService.selectedSearchIndexId
    }
    this.service.invoke('get.dockStatus', queryParms).subscribe(
      res => {
        this.statusDockerLoading = false;
        this.dockersList = res.dockStatuses;
      },
      errRes => {
        this.statusDockerLoading = false;
        this.errorToaster(errRes,'Failed to get Status of Docker.');
      }
    );
  }

  ngOnDestroy(){
    this.subscription?this.subscription.unsubscribe(): false;
    this.indexSub?this.indexSub.unsubscribe(): false;
  }
}
