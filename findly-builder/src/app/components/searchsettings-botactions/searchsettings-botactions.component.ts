import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { of, interval, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-searchsettings-botactions',
  templateUrl: './searchsettings-botactions.component.html',
  styleUrls: ['./searchsettings-botactions.component.scss']
})
export class SearchsettingsBotactionsComponent implements OnInit {

  @Input() botactionsdata;
  @Input() selectedcomponent
  selectedApp;
  indexPipelineId;
  streamId: any;
  serachIndexId
  queryPipelineId
  querySubscription : Subscription;

  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''

  })
}


  sildervaluechanged(event){
    console.log(event)
    const quaryparms:any={
      indexPipelineId:this.workflowService.selectedIndexPipeline(),
      queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexId:this.serachIndexId
    }
      const payload:any={
        settings: {
          botActions: {
            enable: event.currentTarget.checked
        }
      }    
    }
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.botactionsdata.enable=res.settings.botActions.enable
      this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
   
  }
  selectradiobutton(type){
    const quaryparms:any={
      indexPipelineId:this.workflowService.selectedIndexPipeline(),
      queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexId:this.serachIndexId
    }
    if(type=='execute'){
        var payload:any={
          settings: {
            botActions: {
              executeIntents:true
          }
        }    
      }
    }
    else{
      var payload:any={
        settings: {
          botActions: {
            executeIntents:false
        }
      }    
    }
    }

    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.botactionsdata.enable=res.settings.botActions.enable
      this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
    
  }

  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}
