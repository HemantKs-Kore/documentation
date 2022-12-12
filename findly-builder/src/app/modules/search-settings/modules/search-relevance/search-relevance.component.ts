import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { RangeSlider } from 'src/app/helpers/models/range-slider.model';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';


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
  searchRelevanceConfig;
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
    this.prepareThreshold()
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.prepareThreshold()
    })   
    
    
  }
  //** to fetch the threshold range slider value */
  prepareThreshold(){ 
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
      this.searchrelevancedata = res.settings.searchRelevance;
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
 
  //** update query pipeline on toggle button */
  sildervaluechanged(event,type){
    const quaryparms:any={
      indexPipelineId:this.workflowService.selectedIndexPipeline(),
      queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexId:this.serachIndexId
    }
        let updatedItems=[];
        //**condition check for slider */
        if(type==='slider'){
           updatedItems = this.searchrelevancedata.languages.map(item =>{
            if (item.languageCode === this.selectedLanguage) {
              return {
                ...item,
                enable: event.target.checked
              }
            } return item;
          });
		}

    //**condition check for subject  */
        else if(type==='subject'){
           updatedItems = this.searchrelevancedata.languages.map(item =>{
            if (item.languageCode === this.selectedLanguage) {
              return {
                ...item,
                subject: event.target.checked
              }
            }  return item;
          });
		}
        //**condition check for subject  */
        else if(type==='verb'){
           updatedItems = this.searchrelevancedata.languages.map(item =>{
            if (item.languageCode === this.selectedLanguage) {
              return {
                ...item,
                verb: event.target.checked
              }
            }   return item;
          });
		}
        else{
           updatedItems = this.searchrelevancedata.languages.map(item =>{
            if (item.languageCode === this.selectedLanguage) {
              return {
                ...item,
                object: event.target.checked
              }
            }  return item;
          });
        }		

          const payload:any=  {
            settings: {
              searchRelevance: {
                languages: updatedItems
              }
            }
          };



    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.searchrelevancedata.enable=res?.settings?.searchRelevance?.enable
      this.notificationService.notify("updated successfully",'success');
      this.prepareThreshold()
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
      this.prepareThreshold()

      //this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
  }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}
