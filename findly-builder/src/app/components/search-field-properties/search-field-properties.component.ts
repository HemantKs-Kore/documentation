import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'underscore';
import { of, interval, Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';

declare const $: any;

@Component({
  selector: 'app-search-field-properties',
  templateUrl: './search-field-properties.component.html',
  styleUrls: ['./search-field-properties.component.scss']
})
export class SearchFieldPropertiesComponent implements OnInit {
  selectedApp;
  serachIndexId;
  indexPipelineId;
  streamId: any;
  querySubscription : Subscription;
  queryPipelineId: any;
  searchFieldProperties : any = [];
  propeties : any = {
    highlight:false,
    presentable : false,
    spellCorrect : false,
    weight : 0
  };

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    public inlineManual : InlineManualService,
    private router: Router,
    public mixpanel: MixpanelServiceService
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    // if (this.workflowService.selectedApp()?.configuredBots[0]) {
    //   this.streamId = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
    // }
    // else if (this.workflowService.selectedApp()?.publishedBots && this.workflowService.selectedApp()?.publishedBots[0]) {
    //   this.streamId = this.workflowService.selectedApp()?.publishedBots[0]?._id ?? null
    // }
    // else {
    //   this.streamId = null;
    // }
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';

    //this.fetchPropeties();
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.fetchPropeties()
      this.editSearchFiledProperties();
    })
    
    
  }

  fetchPropeties(){
    const quaryparms: any = {
      sortyBy: "createdOn",
      page:1,
      limit:10,
      spellCorrect:true,
      presentable: true,
      highlight:true,
      orderBy: "asc", //desc,
      indexPipelineId:this.indexPipelineId,
      streamId:this.selectedApp._id,
      queryPipelineId:this.queryPipelineId
    };
    this.service.invoke('get.allsearchFields', quaryparms).subscribe(res => {
      this.searchFieldProperties = res;
      //console.log(res);
    }, errRes => {
      // console.log(errRes);
    });

  }
  editSearchFiledProperties(properties?){

    const quaryparms: any = {
      indexPipelineId:this.indexPipelineId,
      streamId:this.selectedApp._id,
      queryPipelineId:this.queryPipelineId,
      fieldId:"fld-1ddbd2bb-9a82-541c-925f-37733d4a56b6"
    };
    const payload ={
      "weight": 5,
      "spellCorrect": false,
      "presentable": true,
      "highlight": true,
    }

    

    this.service.invoke('put.updatesearchFieldsProperties',quaryparms,payload).subscribe(res => {
      this.propeties = res;
      console.log(res);
    }, errRes => {
      // console.log(errRes);
    });    

  }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }
}
