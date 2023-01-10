import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { RangeSlider } from 'src/app/helpers/models/range-slider.model';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';

declare const $: any;
@Component({
  selector: 'app-search-relevance',
  templateUrl: './search-relevance.component.html',
  styleUrls: ['./search-relevance.component.scss'],
})
export class SearchRelevanceComponent implements OnInit {
  searchrelevancedata: any;
  selectedApp;
  indexPipelineId;
  streamId: any;
  serachIndexId
  queryPipelineId;
  isLoading=false
  querySubscription : Subscription;
  weightModal = {
      "fieldName": "",
      "fieldDataType": "",
      "fieldId": "",
      "sliderObj": {
          "minVal": 0,
          "maxVal": 100,
          "step": 1,
          "default": 0,
          "id": "matchThreshold0",
          "key": "",
          "enable": true
      }
  };
  searchrelevanceToggle
  searchRelevanceConfig;
  slider_value_payload:boolean;
  selectedLanguage='en';

  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
  ) { }
  sliderOpen;
  disableCancle: any = true;
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    if(this.indexPipelineId && this.queryPipelineId )this.prepareThreshold('menu')
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.prepareThreshold('menu')
    })   
    
    
  }
    //open topic guide
    openUserMetaTagsSlider() {
      this.appSelectionService.topicGuideShow.next();
    }
  //** to fetch the threshold range slider value */
  prepareThreshold(comingFrom){ 
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId
    };
    if(comingFrom=='menu'){
      this.isLoading=true;
    }    
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
      this.isLoading=false;
      this.searchrelevancedata = res.settings.searchRelevance;
      this.searchrelevanceToggle=res.settings.searchRelevance.enable
      this.searchRelevanceConfig= res.settings.searchRelevance.languages.find(item=>item.languageCode==this.selectedLanguage)      
      const name = ('matchThreshold' || '').replace(/[^\w]/gi, '')
      const obj = {
        fieldName: name,
        fieldDataType: 'number',
        fieldId: 'matchThreshold',
        sliderObj: new RangeSlider(0, 100, 1,this.searchrelevancedata.matchThreshold,'matchThreshold0','',true)
      }
      this.weightModal= obj;
      
    },errRes => {
      this.notificationService.notify('failed to get querypipeline details', 'error')
    }); 
  }
 
  getUpdateItem(type, event) {
    return this.searchrelevancedata.languages.map(item =>{
      if (item.languageCode === this.selectedLanguage) {
        return {
          ...item,
          [type]: event.target.checked
        }
      }  return item;
    });
  }
  //** update query pipeline on toggle button */
  silderValuechanged(event,type){
    const quaryparms:any={
      indexPipelineId:this.workflowService.selectedIndexPipeline(),
      queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexId:this.serachIndexId
    } 
         this.slider_value_payload=$('#sa_slider_enable_disable:checkbox:checked').length?true:false;
          const payload:any=  {
            settings: {
              searchRelevance: {
                enable:this.slider_value_payload,
                languages: this.getUpdateItem(type, event)  
              }
            }
          };
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.searchrelevancedata.enable=res?.settings?.searchRelevance?.enable
      if(type==='enable'){
        this.searchrelevancedata.enable?this.notificationService.notify("Search Relevance Enabled",'success'):this.notificationService.notify("Search Relevance Disabled",'success')
      }
      else{
        this.notificationService.notify("Search Relevance Language keys updated",'success')
      }
      
      this.prepareThreshold('self')
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
  
}
  
  // to update the  threshold Range slider
  valueEvent(val, outcomeObj) {
    const quaryparms:any={
      indexPipelineId:this.workflowService.selectedIndexPipeline(),
      queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexId:this.serachIndexId
    }
      const payload:any={
        settings: {
          searchRelevance: {
            matchThreshold: val
        }
      }    
    }
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {

      //this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
  }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}
