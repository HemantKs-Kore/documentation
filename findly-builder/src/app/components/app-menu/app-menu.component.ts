import { Component, OnInit,ViewEncapsulation, HostListener, Input, ViewChild, OnDestroy } from '@angular/core';
import { SideBarService } from '../../services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ActivatedRoute, Routes, Router } from '@angular/router';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { Subscription } from 'rxjs';
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
  loadingQueryPipelines:any = true;
  queryConfigs:any = [];
  newConfigObj:any = {
    method:'default',
    name:''
  };
  queryConfigsRouts:any = {
    '/synonyms':true,
    '/stopWords':true,
    '/weights':true,
    '/facets':true,
    '/resultranking':true,
  }
  configObj:any = {};
  selectedConfig:any ={};
  subscription:Subscription
  @Input() show;
  @Input() settingMainMenu;
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  constructor( private service:ServiceInvokerService,
      private headerService: SideBarService,
      private workflowService: WorkflowService,
      private router: Router, private activetedRoute:ActivatedRoute,
      private appSelectionService:AppSelectionService) { }
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
  getPreviousState(){
    let previOusState :any = null;
    try {
      previOusState = JSON.parse(window.localStorage.getItem('krPreviousState'));
    } catch (e) {
    }
    return previOusState;
  }
  reloadCurrentRoute() {
    let route = '/source';
    const previousState = this.getPreviousState();
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
  createConfig(){
    const payload:any = {
     method: this.newConfigObj.method,
     name:this.newConfigObj.name,
    }
    if(this.newConfigObj.method === 'clone'){
      payload.sourceQueryPipelineId = this.newConfigObj.sourceQueryPipelineId
    }
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId
    }
    this.service.invoke('create.queryPipeline', queryParms, payload).subscribe(
      res => {
       this.appSelectionService.getQureryPipelineIds();
       this.closeModalPopup();
      },
      errRes => {
      }
    );
  }
  selectQueryPipelineId(queryConfigs){
    this.appSelectionService.selectQueryConfig(queryConfigs);
    this.selectedConfig = queryConfigs._id;
    this.reloadCurrentRoute()
  }
  ngOnInit() {
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res =>{
      this.queryConfigs = res;
      res.forEach(element => {
        this.configObj[element._id] = element;
      });
      this.selectedConfig = this.workflowService.selectedQueryPipeline()._id;
    })
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
  openModalPopup(){
    this.newConfigObj = {
      method:'default',
      name:''
    };
    this.addFieldModalPopRef = this.addFieldModalPop.open();
  }
  ngOnDestroy(){
    this.subscription?this.subscription.unsubscribe(): false;
  }
}
