import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';

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
   more_options:boolean=false;
   home_pre_tag="<span class='highlightText'>";
   home_post_tag="</span>"
   pre_tag="<span class='highlightText'>";
   post_tag="</span>"
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
  ) { }

  highlightAppearanceModalPopRef: any;

  @ViewChild('highlightAppearanceModalPop') highlightAppearanceModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  ngOnInit(): void {
    this.more_options=false;
    this.selectedApp = this.workflowService.selectedApp();
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    //this.fetchPropeties();
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      //this.fetchPropeties()
   })
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
  }
  closeContainer(){
    this.more_options=false;
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
