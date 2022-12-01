import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { RangeSlider } from '../../helpers/models/range-slider.model';


@Component({
  selector: 'app-search-relevance',
  templateUrl: './search-relevance.component.html',
  styleUrls: ['./search-relevance.component.scss']
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

  prepareThreshold(){ 
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
      this.searchrelevancedata = res.settings.searchRelevance;
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
