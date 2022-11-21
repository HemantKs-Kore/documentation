import {   Component, OnInit,Output,Input,EventEmitter ,ViewChild } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';


@Component({
  selector: 'app-spell-correction',
  templateUrl: './spell-correction.component.html',
  styleUrls: ['./spell-correction.component.scss']
})
export class SpellCorrectionComponent implements OnInit {
  selectedApp;
  indexPipelineId;
  streamId: any;
  queryPipelineId: any;
  querySubscription : Subscription;
  more_options:boolean=false;
  checksort:string='fieldName';
  selectedSort:string='asc';
  isSearchable:boolean=true;
  limit:number=10;
  allspellCorrect : any = [];
  spellcorrect: any=[];
  nonspellcorrect:any=[];
  max_threshold:number=0;
  min_threshold:number=0;
  serachIndexId
  @Input() spellcorrectdata;
  @Input() selectedcomponent
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.more_options=false;
    this.max_threshold=0;
    this.min_threshold=0;
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    this.getAllspellcorrectFields()
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.getAllspellcorrectFields()
   })
  }
  getAllspellcorrectFields(){
    this.getSpellcorrect(true);
    this.getSpellcorrect(false);
  }

  spellcorrectsort(sortobj){
    console.log(sortobj);
    if(sortobj.componenttype=="datatable"){
      this.getSpellcorrect(true,sortobj);
    }
    else{
      this.getSpellcorrect(false,sortobj);
    }
  
   }
  

  getSpellcorrect(isSelected?,sortobj?){
    const quaryparms: any = {
      isSelected:isSelected,
      sortField: sortobj?.fieldname?.length>0?sortobj.fieldname:"fieldName",
      orderType: sortobj?.type?.length>0?sortobj.type:'asc', //desc,
      indexPipelineId:this.indexPipelineId,
      streamId:this.selectedApp._id,
      queryPipelineId:this.queryPipelineId,
      isSearchable:this.isSearchable,
      page:0,
      limit:this.limit,
      searchKey:''
    };
    this.service.invoke('get.spellcorrectFields', quaryparms).subscribe(res => {
      this.allspellCorrect = res.data;
      if(isSelected){
        this.spellcorrect=[];
        this.allspellCorrect.forEach(element => {
          if(element.presentable.value){
            this.spellcorrect.push(element)
          }
        });
      }
      else{
        this.nonspellcorrect=[];
        this.allspellCorrect.forEach(element => {
          if(!element.presentable.value){
            this.nonspellcorrect.push(element)
          }
        });
      } 
      // this.allspellCorrect.forEach(element => {
      //   if(element.spellCorrect.value){
      //     this.spellcorrect.push(element)
      //   }else{
      //     this.nonspellcorrect.push(element)
      //   }
      // });
    }, errRes => {
      this.notificationService.notify("Failed to get Spellcorrect fields",'error');
    });
   }

   /** Emited Value for Operation (Add/Delete)  */
 getrecord(recordData : any){
  let record = recordData.record;
  if(record.length > 1){

  }
  let deleteData = {
    url :'delete.spellcorrectFields',
    quaryparms : {
      streamId:this.selectedApp._id,
      indexPipelineId:this.indexPipelineId,
      queryPipelineId:this.queryPipelineId,
      fieldId :  record[0]
    }
   }
   let addData = {
    url :'add.spellcorrectFields',
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
   this.getAllspellcorrectFields();
  }, errRes => {
    this.notificationService.notify("Failed to remove Fields",'error');
  });
 }
  /** Add to Prescentable */
 addRecords(addData){
  this.service.invoke(addData.url,addData.quaryparms,addData.payload).subscribe(res => {
    this.getAllspellcorrectFields();
    this.notificationService.notify("Field added succesfully",'success');
  }, errRes => {
    this.notificationService.notify("Failed to add Fields",'error');
  });
  // 
 }
 //**Spell Correct Slider change update query pipeline */
 sildervaluechanged(event){
    const quaryparms:any={
      indexPipelineId:this.workflowService.selectedIndexPipeline(),
      queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexId:this.serachIndexId
    }
      var payload:any={
        settings: {
          spellCorrect: {
            enable: event.currentTarget.checked
        }
      
    }
  }
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.spellcorrectdata.enable=res.settings.spellcorrectdata.enable
      this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
  
}

  openContainer(){
    this.more_options=true;
  }
  closeContainer(){
    this.more_options=false;
  }
  maxdecrementValue(max_val){
    this.max_threshold=max_val-1;
    if(this.max_threshold < 0){
      this.max_threshold=0;
    }
    if(this.max_threshold >= 0){
      const quaryparms:any={
        indexPipelineId:this.workflowService.selectedIndexPipeline(),
        queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
        searchIndexId:this.serachIndexId
      }
      const payload:any={
        settings: {
          spellCorrect: {
            maxTypoEdits:this. max_threshold
        }
      }
    }
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.spellcorrectdata.maxTypoEdits=res.settings.spellCorrect.maxTypoEdits
      this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
  }
    
  }
  maxincrementValue(max_val){
    this.max_threshold=max_val+1;
    if(this.max_threshold >= 0){
      const quaryparms:any={
        indexPipelineId:this.workflowService.selectedIndexPipeline(),
        queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
        searchIndexId:this.serachIndexId
      }
      const payload:any={
        settings: {
          spellCorrect: {
            maxTypoEdits:this.max_threshold
        }
      }
    }
    this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
      this.spellcorrectdata.maxTypoEdits=res.settings.spellCorrect.maxTypoEdits
      this.notificationService.notify("updated successfully",'success');
    }, errRes => {
      this.notificationService.notify("Failed to update",'error');
    });
 }
  }
  mindecrementValue(min_val){
        this.min_threshold=min_val-1;
        if(this.min_threshold < 0){
          this.min_threshold=0;
        }
        if(this.min_threshold >= 0){
          const quaryparms:any={
            indexPipelineId:this.workflowService.selectedIndexPipeline(),
            queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
            searchIndexId:this.serachIndexId
          }
          const payload:any={
            settings: {
              spellCorrect: {
                minCharacterThreshold:this. min_threshold
            }
          }
        }
        this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
          this.spellcorrectdata.minCharacterThreshold=res.settings.spellCorrect.minCharacterThreshold
          this.notificationService.notify("updated successfully",'success');
        }, errRes => {
          this.notificationService.notify("Failed to update",'error');
        });
      }
    }
  minincrementValue(min_val){
    this.min_threshold=min_val+1;
      if(this.min_threshold >= 0){
        const quaryparms:any={
          indexPipelineId:this.workflowService.selectedIndexPipeline(),
          queryPipelineId:this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
          searchIndexId:this.serachIndexId
        }
        const payload:any={
          settings: {
            spellCorrect: {
              minCharacterThreshold:this. min_threshold
          }
        }
      }
      this.service.invoke('put.queryPipeline', quaryparms,payload).subscribe(res => {
        this.spellcorrectdata.minCharacterThreshold=res.settings.spellCorrect.minCharacterThreshold
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
