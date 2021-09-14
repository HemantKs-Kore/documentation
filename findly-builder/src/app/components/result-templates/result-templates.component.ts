import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { SideBarService } from '@kore.services/header.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result-templates',
  templateUrl: './result-templates.component.html',
  styleUrls: ['./result-templates.component.scss']
})
export class ResultTemplatesComponent implements OnInit {
  customModalRef : any;
  selectedApp: any;
  serachIndexId: any;
  indexPipelineId: any;
  subscription: Subscription;
  searchConfigurationSubscription : Subscription;
  searchExperienceConfig : any = {};
  searchTemplatesDisabled : boolean = false;
  @ViewChild('customModal') customModal: KRModalComponent;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public dialog: MatDialog,
    public headerService : SideBarService,
    public inlineManual : InlineManualService,
  ) { }

  ngOnInit(): void {
    //Initializing Id's
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();

    this.loadFiledsData();
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.loadFiledsData();
    })
    this.searchExperienceConfig = this.headerService.searchConfiguration;
    this.searchConfigurationSubscription = this.headerService.savedSearchConfiguration.subscribe((res) =>{
      this.searchExperienceConfig = res;
      this.updateResultTemplateTabsAccess();
    });
    this.updateResultTemplateTabsAccess();
    /** Inline Not yet Registered */
    if(!this.inlineManual.checkVisibility('RESULT_TEMPLATE') && false){
      this.inlineManual.openHelp('RESULT_TEMPLATE')
      this.inlineManual.visited('RESULT_TEMPLATE')
    }
  }

  loadFiledsData() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
    }
  }
  /** Chat SDK approach and by-default Data */
  updateResultTemplateTabsAccess(){
    if(this.searchExperienceConfig && Object.values(this.searchExperienceConfig).length){
      console.log(this.searchExperienceConfig);
      if(this.searchExperienceConfig && this.searchExperienceConfig.experienceConfig && this.searchExperienceConfig.experienceConfig.searchBarPosition){
        if(this.searchExperienceConfig.experienceConfig.searchBarPosition === 'top'){
          this.searchTemplatesDisabled = true;
          this.getAllSettings({id: "fullSearch",text: "Full Page Result"});
        }
        else{
          this.searchTemplatesDisabled = false;
        }
      }
    }
    else{
      this.searchTemplatesDisabled = false;
    }
  }
  /** Call for All Setting Templates */
  getAllSettings(obj){

  }
  openCustomModal(){
    this.customModalRef = this.customModal.open();
  }

  closeCustomModal() {
    if (this.customModalRef && this.customModalRef.close) {
      this.customModalRef.close();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.searchConfigurationSubscription ? this.searchConfigurationSubscription.unsubscribe() : false;
  }
}
