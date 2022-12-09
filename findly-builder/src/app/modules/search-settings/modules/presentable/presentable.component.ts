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
  max_pageno:any;
  limit:number=10;
  searchKey:any;
  searchValue='';
  allpresentableFields : any = [];
  presentable = [];
  nonPresentable = [];
  loader:any=false;
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
    this.getAllpresentableFields()
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.getAllpresentableFields()
   })
 }

 /**to fetch the data to table and add pop-up passing true and false*/
  getAllpresentableFields(){
    this.getPresentableFields(true);
    this.getPresentableFields(false);
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
 /**presentable sort */
 presentablesort(sortobj){
  console.log(sortobj);
  if(sortobj.componenttype=="datatable"){
    this.getPresentableFields(true,sortobj);
  }
  else{
    this.getPresentableFields(false,sortobj);
  }

 }
 /** remove fromPresentable */
 removeRecord(deleteData){
  const quaryparms: any = deleteData.quaryparms;
  this.service.invoke(deleteData.url, quaryparms).subscribe(res => {
    this.getAllpresentableFields();
  }, errRes => {
    this.notificationService.notify("Failed to remove Fields",'error');
  });
 }
  /** Add to Prescentable */
 addRecords(addData){
  this.service.invoke(addData.url,addData.quaryparms,addData.payload).subscribe(res => {
   this.getAllpresentableFields();
   this.notificationService.notify("Field added succesfully",'success');
  }, errRes => {
    this.notificationService.notify("Failed to add Fields",'error');
  });
  // 
 }
 //**Presentable search function */
 presentablesearch(obj){
  this.searchValue=obj.searchvalue;
  if(obj.componenttype=="datatable"){
    this.getPresentableFields(true)
  }  
  else{
    this.getPresentableFields(false);
  }
 }
 //**presentable get page */
 presentablepage(pageinfo){
  this.page=pageinfo;
  this.getPresentableFields(true)
 }

 //** get api for retrieving the presentable Fields */
 getPresentableFields(selected?,sortobj?){
  const quaryparms: any = {
    isSelected:selected,
    sortField: sortobj?.fieldname?.length>0?sortobj.fieldname:"fieldName",
    orderType: sortobj?.type?.length>0?sortobj.type:'asc', //desc,
    indexPipelineId:this.indexPipelineId,
    streamId:this.selectedApp._id,
    queryPipelineId:this.queryPipelineId,
    // isSearchable:this.isSearchable,
    // page:this.page?this.page:0,
    // limit:this.limit,
    searchKey:this.searchValue?this.searchValue:''
  };
  this.service.invoke('get.presentableFields', quaryparms).subscribe(res => {
    this.loader=true;
    this.allpresentableFields = res.data;
    //this.max_pageno=Number(Math.ceil(res.totalCount/10))-1;
    if(selected){
      this.presentable=[];
      this.allpresentableFields.forEach(element => {
        // if(element.presentable.value){
          this.presentable.push(element)
        // }
      });
    }
    else{
      this.nonPresentable=[];
      this.allpresentableFields.forEach(element => {
        // if(!element.presentable.value){
          this.nonPresentable.push(element)
        // }
      });
    }    
    // this.allpresentableFields.forEach(element => {
    //   if(element.presentable.value){
    //     this.presentable.push(element)
    //   }else{
    //     this.nonPresentable.push(element)
    //   }
    // });
  }, errRes => {
    this.notificationService.notify("Failed to get presentable fields",'error');
  });
 }
 //**unsubcribing the query subsciption */
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}


