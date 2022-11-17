import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';;
import { of, interval, Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-presentable',
  templateUrl: './presentable.component.html',
  styleUrls: ['./presentable.component.scss']
})
export class PresentableComponent implements OnInit {
  selectedApp;
  indexPipelineId;
  streamId: any;
  queryPipelineId: any;
  querySubscription : Subscription;
  selectedSort:string='asc';
  checksort:string='fieldName';
  selectionflag:boolean=true;
  isSearchable:boolean=true;
  page:number=1;
  limit:number=10;
  allpresentableFields : any = [];
  presentabletrueFields: any=[];
  presentablefalseFields: any=[];
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    this.getPresentableFields();
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.getPresentableFields();
   })
 }
 //** get api for retrieving the presentable Fields */
 getPresentableFields(){
  const quaryparms: any = {
    isSelected:this.selectionflag,
    sortField: this.checksort,
    orderType: this.selectedSort, //desc,
    indexPipelineId:this.indexPipelineId,
    streamId:this.selectedApp._id,
    queryPipelineId:this.queryPipelineId,
    isSearchable:this.isSearchable,
    page:this.page,
    limit:this.limit
  };
  this.service.invoke('get.presentableFields', quaryparms).subscribe(res => {
    this.allpresentableFields = res.data;
    for(let i=0;i<this.allpresentableFields;i++){
      if(this.allpresentableFields[i].presentable===true){
        for(let j=0;j<=this.presentabletrueFields.length;j++)
        this.presentabletrueFields[j]=this.allpresentableFields[i]
      }
      else{
        for(let k=0;k<=this.presentabletrueFields.length;k++)
        this.presentablefalseFields[k]=this.allpresentableFields[i]
      }
    }
    
  }, errRes => {
    this.notificationService.notify(errRes,'error');
  });
 }

  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}


