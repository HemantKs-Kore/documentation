import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
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
  page:number=0;
  limit:number=10;
  searchKey:any;
  allpresentableFields : any = [];
  presentable = [];
  nonPresentable = [];
  @Input() presentabledata;
  @Input() selectedcomponent
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    console.log(this.presentabledata);
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
    sortField: "fieldName",
    orderType: this.selectedSort, //desc,
    indexPipelineId:this.indexPipelineId,
    streamId:this.selectedApp._id,
    queryPipelineId:this.queryPipelineId,
    isSearchable:this.isSearchable,
    page:0,
    limit:this.limit,
    searchKey:''
  };
  this.service.invoke('get.presentableFields', quaryparms).subscribe(res => {
    this.allpresentableFields = res.data;
    this.allpresentableFields.forEach(element => {
      if(element.presentable){
        this.presentable.push(element)
      }else{
        this.nonPresentable.push(element)
      }
    });
    console.log(this.presentable)
    console.log(this.nonPresentable)
  }, errRes => {
    this.notificationService.notify("Failed to get presentable fields",'error');
  });
 }

  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}


