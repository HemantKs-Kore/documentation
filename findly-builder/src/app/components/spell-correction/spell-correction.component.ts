import {   Component, OnInit,Output,Input,EventEmitter ,ViewChild } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';

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
  max_threshold:number=0;
  min_threshold:number=0;
  @Input() spellcorrectdata;
  @Input() selectedcomponent
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
  ) { }

  ngOnInit(): void {
    this.more_options=false;
    this.max_threshold=0;
    this.min_threshold=0;
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

  openContainer(){
    this.more_options=true;
  }
  closeContainer(){
    this.more_options=false;
  }
  maxdecrementValue(){
    this.max_threshold=this.max_threshold-1;
    if(this.max_threshold < 0){
      this.max_threshold=0;
    }
  }
  maxincrementValue(){
    this.max_threshold=this.max_threshold+1;
  }
  mindecrementValue(){
    this.min_threshold=this.min_threshold-1;
    if(this.min_threshold < 0){
      this.min_threshold=0;
    }
  }
  minincrementValue(){
    this.min_threshold=this.min_threshold+1;
  }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}
