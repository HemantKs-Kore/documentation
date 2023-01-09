import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { of, interval, Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-small-talk',
  templateUrl: './small-talk.component.html',
  styleUrls: ['./small-talk.component.scss']
})
export class SmallTalkComponent implements OnInit {
 searchIndexId:any;
 selectedApp: any;
 LinkABot:any;
 streamId:any;
 enableSmallTalk:any;
 querySubscription : Subscription;
 enable = false ;
 botLinked = false;
 smallTalkData:any;
 serachIndexId;
 indexPipelineId;
 queryPipelineId;
 constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private appSelectionService: AppSelectionService,
  ) { 
  
 }
 ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    this.getQuerypipeline();
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.getQuerypipeline();
    })
 }
 getAssociatedTasks() {
    if (this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };
      this.service.invoke('get.AssociatedBotTasks', queryParams, null, { "state": "published" }).subscribe(res => {
        // console.log("getAllTasks API response payload", res);
        this.enable = this.selectedApp.smallTalk.enable;
      },
    
        (err) => {
        },
        
      )}
 }
 enableST(type) {
    const queryParams: any = {
    streamId: this.selectedApp._id
   };
   const payload = {
     smallTalk : {
      enable: type
     }
   }
   this.service.invoke('put.enableST', queryParams, payload).subscribe(res => {
     if (this.enable) {
       payload.smallTalk.enable = true
       this.notificationService.notify('Small Talk Enabled', 'success')
     }
    if (!this.enable){
       payload.smallTalk.enable = false;
       this.notificationService.notify('Small Talk Disabled', 'success')
     }
   },
     (err) => { this.notificationService.notify("Task Enabling Failed", 'error') });
 }
 //Open slider
 openUserMetaTagsSlider() {
  this.appSelectionService.topicGuideShow.next();
}
 getQuerypipeline(){
  const quaryparms: any = {
    searchIndexID: this.serachIndexId,
    queryPipelineId: this.queryPipelineId,
    indexPipelineId: this.indexPipelineId,
  };
  this.service.invoke('get.queryPipeline', quaryparms).subscribe(
    (res) => {
      this.smallTalkData = res?.settings.smallTalk;
    },
    (errRes) => {
      this.notificationService.notify(
        'failed to get querypipeline details',
        'error'
      );
    }
  );
 }
 sildervaluechanged(event){
  const quaryparms:any={
    indexPipelineId:this.workflowService.selectedIndexPipeline(),
    queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
    searchIndexId:this.serachIndexId
  }
    const payload:any={
      settings: {
        smallTalk: {
          enable: event.target.checked
      }
    }    
  }
  this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
    this.smallTalkData.enable=res.settings.smallTalk.enable
    this.notificationService.notify("updated successfully",'success');
  }, errRes => {
    this.notificationService.notify("Failed to update",'error');
  });
 
 }
 ngOnDestroy() {
  this.querySubscription ? this.querySubscription.unsubscribe() : false;
 }
}
