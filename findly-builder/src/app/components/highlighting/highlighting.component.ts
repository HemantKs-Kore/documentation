import {   Component, OnInit,Output,Input,EventEmitter ,ViewChild } from '@angular/core';
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
  queryPipelineId: any;
  querySubscription : Subscription;
  @Input() highlightdata;
  @Input() selectedcomponent
   more_options:boolean=false;
   home_pre_tag="<span class='highlightText'>";
   home_post_tag="</span>"
   pre_tag="<span class='highlightText'>";
   post_tag="</span>"
   selectedSort:string='asc';
   checksort:string='fieldName';
   selectionflag:boolean=true;
   isSearchable:boolean=true;
   page:number=1;
   limit:number=10;
   allhighlightFields : any = [];
   highlighttrueFields: any=[];
   highlightfalseFields: any=[];
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
    console.log(this.highlightdata);
    this.more_options=false;
    this.selectedApp = this.workflowService.selectedApp();
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    this.getHighlightFields();
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.getHighlightFields();
   })
  }
  getHighlightFields(){
    const quaryparms: any = {
      isSelected:this.selectionflag,
      sortField: this.checksort,
      orderType: this.selectedSort, //desc,
      indexPipelineId:this.indexPipelineId,
      streamId:this.selectedApp._id,
      queryPipelineId:this.queryPipelineId,
      isSearchable:this.isSearchable,
      page:1,
      limit:this.limit,
      searchKey:''
    };
    this.service.invoke('get.highlightFields', quaryparms).subscribe(res => {
      this.allhighlightFields = res.data;
      for(let i=0;i<this.allhighlightFields;i++){
        if(this.allhighlightFields[i].highlight===true){
          for(let j=0;j<=this.allhighlightFields.length;j++)
          this.highlighttrueFields[j]=this.allhighlightFields[i]
        }
        else{
          for(let k=0;k<=this.allhighlightFields.length;k++)
          this.highlightfalseFields[k]=this.allhighlightFields[i]
        }
      }
      console.log(this.highlighttrueFields)
      console.log(this.highlightfalseFields)
      
    }, errRes => {
      this.notificationService.notify(errRes,'error');
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
    this.home_pre_tag=pretag;
    this.home_post_tag=posttag
    this.highlightAppearanceModalPopRef.close();
  }

  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}
