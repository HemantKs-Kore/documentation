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
    //this.getPresentableFields(true);
    this.getPresentableFields(false)
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      //this.getPresentableFields(true);
      this.getPresentableFields(false)
   })
 }
 /** Emited Value for Operation (Add/Delete)  */
 getrecord(recordData : any){
  let record = recordData.record;
  if(record.length > 1){

  }
  let deleteData = {
    url :'delete.presentableFields',
    quaryparms : {
      streamId:this.selectedApp._id,
      indexPipelineId:this.indexPipelineId,
      queryPipelineId:this.queryPipelineId,
      fieldId :  record[0]
    }
   }
   let addData = {
    url :'add.presentableFields',
    quaryparms : {
      streamId:this.selectedApp._id,
      indexPipelineId:this.indexPipelineId,
      queryPipelineId:this.queryPipelineId,
    },
    payload : record
   }
   recordData.type == 'delete' ? this.removeRecord(deleteData) : this.addRecords(addData)
   
 }
 /** remove fromPresentable */
 removeRecord(deleteData){
  const quaryparms: any = deleteData.quaryparms;
  this.service.invoke(deleteData.url, quaryparms).subscribe(res => {
   this.getPresentableFields();
  }, errRes => {
    this.notificationService.notify("Failed to remove Fields",'error');
  });
 }
  /** Add to Prescentable */
 addRecords(addData){
  this.service.invoke(addData.url,addData.quaryparms,addData.payload).subscribe(res => {
   this.getPresentableFields();
   this.notificationService.notify("Field added succesfully",'success');
  }, errRes => {
    this.notificationService.notify("Failed to add Fields",'error');
  });
  // 
 }

 //** get api for retrieving the presentable Fields */
 getPresentableFields(selected?){
  const quaryparms: any = {
    isSelected:selected,
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
      if(element.presentable.value){
        this.presentable.push(element)
      }else{
        this.nonPresentable.push(element)
      }
    });
  }, errRes => {
    this.notificationService.notify("Failed to get presentable fields",'error');
  });
 }
 delete(){

 }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}


