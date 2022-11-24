import {  Component, OnInit,Output,Input,EventEmitter ,ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-highlighting',
  templateUrl: './highlighting.component.html',
  styleUrls: ['./highlighting.component.scss']
})
export class HighlightingComponent implements OnInit {
  selectedApp;
  indexPipelineId;
  streamId: any;
  serachIndexId
  queryPipelineId: any;
  querySubscription : Subscription;
  synonymsHighlight
  highlightenable
  @Input() highlightdata;
  @Input() selectedcomponent
   more_options:boolean=false;
   home_pre_tag
   home_post_tag
   pre_tag
   post_tag
   selectedSort:string='asc';
   checksort:string='fieldName';
   selectionflag:boolean=true;
   isSearchable:boolean=true;
   page:number=0;
   limit:number=10;
   max_pageno:any;
   searchValue='';
   allhighlightFields : any = [];
   highlight: any=[];
   nonhighlight: any=[];
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
  ) { }

  highlightAppearanceModalPopRef: any;

  @ViewChild('highlightAppearanceModalPop') highlightAppearanceModalPop: KRModalComponent;
  @ViewChild(PerfectScrollbarComponent) perfectScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef: PerfectScrollbarDirective;

  ngOnInit(): void {
    this.home_pre_tag=this.highlightdata.highlightAppearance.preTag
    this.home_post_tag=this.highlightdata.highlightAppearance.postTag
    this.pre_tag=this.highlightdata.highlightAppearance.preTag;
    this.post_tag=this.highlightdata.highlightAppearance.postTag;
    this.more_options=false;
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    this.getAllHighlightFields()
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.getAllHighlightFields()
   })
  }
  getAllHighlightFields(){
    this.getHighlightFields(true);
    this.getHighlightFields(false);
  }
   /**highlight sort */
   highlightsort(sortobj){
  console.log(sortobj);
  if(sortobj.componenttype=="datatable"){
    this.getHighlightFields(true,sortobj);
  }
  else{
    this.getHighlightFields(false,sortobj);
  }

 }
   //**highlight search function */
   highlightsearch(obj){
    this.searchValue=obj.searchvalue;
    if(obj.componenttype=="datatable"){
      this.getHighlightFields(true)
    }  
    else{
      this.getHighlightFields(false);
    }
   }
    //**highlight get page */
 highlightpage(pageinfo){
  if(pageinfo<0){
    pageinfo=0;
  }
  this.page=pageinfo;
  this.getHighlightFields(true)
 }
  getHighlightFields(isSelected?,sortobj?){
    const quaryparms: any = {
      isSelected:isSelected,
      sortField: sortobj?.fieldname?.length>0?sortobj.fieldname:"fieldName",
      orderType: sortobj?.type?.length>0?sortobj.type:'asc', //desc,
      indexPipelineId:this.indexPipelineId,
      streamId:this.selectedApp._id,
      queryPipelineId:this.queryPipelineId,
      isSearchable:this.isSearchable,
      page:this.page?this.page:0,
      limit:this.limit,
      searchKey:this.searchValue?this.searchValue:''
    };
    this.service.invoke('get.highlightFields', quaryparms).subscribe(res => {
      this.allhighlightFields = res.data;
      this.max_pageno=Number(Math.ceil(res.totalCount/10))-1;
      if(isSelected){
        this.highlight=[];
        this.allhighlightFields.forEach(element => {
          if(element.presentable.value){
            this.highlight.push(element)
          }
        });
      }
      else{
        this.nonhighlight=[];
        this.allhighlightFields.forEach(element => {
          if(!element.presentable.value){
            this.nonhighlight.push(element)
          }
        });
      }
    }, errRes => {
      this.notificationService.notify("Failed to get highlight fields",'error');
    });
   }

  openModalPopup() {
    this.highlightAppearanceModalPopRef = this.highlightAppearanceModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }

  closeModalPopup() {
    this.highlightAppearanceModalPopRef.close();
  }
  openContainer(){
    this.more_options=true;
    this.perfectScroll.directiveRef.scrollTo(25,50,500)
  }
  closeContainer(){
    this.more_options=false;
    this.perfectScroll.directiveRef.scrollTo(25,50,500)
  }
  addTags(pretag,posttag){
    const quaryparms:any={
      indexPipelineId:this.workflowService.selectedIndexPipeline(),
      queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexId:this.serachIndexId
    }
    const payload:any={
          settings: {
            highlight: {
              highlightAppearance: {
                  preTag: pretag,
                  postTag: posttag
              }
          }
      }
   }
    
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.home_pre_tag=res.settings.highlight.highlightAppearance.preTag
      this.home_post_tag=res.settings.highlight.highlightAppearance.postTag
      this.highlightdata.highlightAppearance.preTag=res.settings.highlight.highlightAppearance.preTag
      this.highlightdata.highlightAppearance.postTag=res.settings.highlight.highlightAppearance.postTag
      this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });   
    this.highlightAppearanceModalPopRef.close();
  }
  
   /** Emited Value for Operation (Add/Delete)  */
 getrecord(recordData : any){
  let record = recordData.record;
  if(record.length > 1){

  }
  let deleteData = {
    url :'delete.highlightFields',
    quaryparms : {
      streamId:this.selectedApp._id,
      indexPipelineId:this.indexPipelineId,
      queryPipelineId:this.queryPipelineId,
      fieldId :  record[0]
    }
   }
   let addData = {
    url :'add.highlightFields',
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
    this.getAllHighlightFields();
  }, errRes => {
    this.notificationService.notify("Failed to remove Fields",'error');
  });
 }
  /** Add to Prescentable */
 addRecords(addData){
  this.service.invoke(addData.url,addData.quaryparms,addData.payload).subscribe(res => {
    this.getAllHighlightFields();
    this.notificationService.notify("Field added succesfully",'success');
  }, errRes => {
    this.notificationService.notify("Failed to add Fields",'error');
  });
  // 
 }
 sildervaluechanged(event,type){
  const quaryparms:any={
    indexPipelineId:this.workflowService.selectedIndexPipeline(),
    queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
    searchIndexId:this.serachIndexId
  }
  if(type=='synonyms'){
    const payload:any={
      settings: {
        highlight: {
          synonymsHighlight: event.currentTarget.checked
      }
   }    
  }
  this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
    this.highlightdata.synonymsHighlight=res.settings.highlight.enable
    this.notificationService.notify("updated successfully",'success');
  }, errRes => {
    this.notificationService.notify("Failed to update",'error');
  });
 }
 else{
      const payload:any={
        settings: {
          highlight: {
            enable: event.currentTarget.checked
        }
    }    
    }
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.highlightdata.enable=res.settings.highlight.enable
      this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
 }
}
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}


