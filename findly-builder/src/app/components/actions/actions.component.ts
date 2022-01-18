import { Component, OnInit } from '@angular/core';
import { SideBarService } from '@kore.services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare const $: any;

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  animations: [fadeInOutAnimation],
})
export class ActionsComponent implements OnInit {
 
  searchIndexId:any;
  selectedApp: any;
  LinkABot:any;
  botLinked= false;
  checkTopBottom=false;
  checkBottomTop=false;
  showTop = false;
  loadingBotContent:boolean;
  loadingBotContent1:boolean;
  showBottom = false
  topActionsTop = false;
  associatedBots: any = [];
  topActionsBottom : boolean;
  loader:boolean;
  bottomActionsTop = false;
  bottomActionsBottom = false;
  previewTopBottom = 'top';
  linkedBotID: any;
  streamId: any;
  userInfo:any;
  searchObject: any = {
   
  };
  indexPipelineId:any;
  actionConfig:any = {
    actionExecution:"auto",
    actionExperience:"top",
    actionTemplate: "grid"
  }
  constructor( 
    public workflowService: WorkflowService,
    private headerService: SideBarService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    if (this.workflowService.selectedApp()?.configuredBots[0]) {
      this.streamId = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
    }
    else if (this.workflowService.selectedApp()?.publishedBots && this.workflowService.selectedApp()?.publishedBots[0]) {
      this.streamId = this.workflowService.selectedApp()?.publishedBots[0]?._id ?? null
    }
    else {
      this.streamId = null;
    }
    this.LinkABot = this.workflowService.linkedBot;
    // console.log(this.LinkABot)
    this.userInfo = this.authService.getUserInfo() || {};
    // this.getAssociatedBots()
    this.checkLoadingContent()
    // streamId: this.selectedApp._id
    this.previewTopBottom = this.workflowService.topDownOrBottomUp;
    if(!this.workflowService.topDownOrBottomUp){
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.getSearchExperience();
    }
    }
    // this.topDownOrBottomUp('top')

    this.actionConfig.actionExecution = (this.selectedApp ||{}).botActionExecution || "auto";
    this.actionConfig.actionExperience = (this.selectedApp ||{}).botActionResultsExperience || "top";
    this.actionConfig.actionTemplate = (this.selectedApp ||{}).botActionTemplate||  "grid";
  }
  getSearchExperience() {
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('get.searchexperience.list', quaryparms).subscribe(res => {
      this.previewTopBottom = ((res||{}).experienceConfig ||{}).searchBarPosition || 'top';
    }, errRes => {
      // console.log(errRes);
    });
  }
  openActions(){
    this.router.navigate(['/botActions'], { skipLocationChange: true });
    this.headerService.updateShowHideSettingsMenu(false);
    this.headerService.updateShowHideSourceMenu(true);
    // this.headerService.updateMainMenuInHeader('/settings');
} 
  botLinkedOrUnlinked() {
    if (this.LinkABot) {
      this.botLinked = true;
    }
    else if (!this.LinkABot) {
      this.botLinked = false;
    }
    this.getAssociatedBots()
  }
  checkLoadingContent() {
    if (this.streamId == null) {
      this.loader = true
      this.getAssociatedBots();
    }
    else if (this.streamId != null) {
      this.loader = true
      this.getAssociatedBots();
     
    }
   

  }
  getAssociatedBots() {
    if (this.userInfo.id) {
      const queryParams: any = {
        userID: this.userInfo.id
      };
      this.service.invoke('get.AssociatedBots', queryParams).subscribe(res => {
        let bots = JSON.parse(JSON.stringify(res))
        this.associatedBots = [];
        this.loader = false;
        // this.botLinked = false;
        if (bots.length) {
          bots.forEach(element => {
            if (element.type == "default" || element.type == "universalbot") {
              this.associatedBots.push(element)
            }
            if (this.streamId == element._id) {
              if (this.loadingBotContent1 = true) {
                this.LinkABot = element._id
                this.loadingBotContent = true
                this.botLinked = true;

                // this.linkedBotID = element._id
                // if(this.linkedBotID == element._id){
                // }
              }
            }
            else if (this.streamId == null) {
              if (this.loadingBotContent = true) {
                this.LinkABot != element._id
                this.botLinked = false;
                this.loader = false;
              }

            }
          },
            errRes => {
              this.loader = false;
              this.notificationService.notify('Unable to find bot', 'error')
            });
        }
        else {
          if (this.loadingBotContent = true) {
            this.LinkABot = null;
            this.botLinked = false;
            this.loader = false;
          }
        }


      },
      )
    }
  }
  topDownOrBottomUp(type) {
    let payload: any = {};
    // if (this.previewTopBottom == "top") {
    //   this.bottomActionsTop = false;
    //   this.bottomActionsBottom = false;
    //   if (type === 'top') {
    //     this.topActionsTop = true;
    //     this.topActionsBottom = false;

    //   }
    //   else if (type === 'bottom') {
    //     this.topActionsBottom = true;
    //     this.topActionsTop = false;
    //   }
    // }
    // else if (this.previewTopBottom == "bottom") {
    //   this.topActionsTop = false;
    //   this.topActionsBottom = false;
    //   if (type == 'top') {
    //     this.bottomActionsTop = true;
    //     this.bottomActionsBottom = false;
    //   }
    //   if (type == 'bottom') {
    //     this.bottomActionsBottom = true;
    //     this.bottomActionsTop = false;
    //   }

    // }
    if (type == 'top' || type == 'bottom') {
      payload.botActionResultsExperience = type;
      this.actionConfig.actionExperience = type;
    }
    if (type == 'auto' || type == 'manual') {
      payload.botActionExecution = type;
      this.actionConfig.actionExecution = type;
    }
    if (type == 'grid' || type == 'list' || type == 'carousel') {
      this.actionConfig.actionTemplate = type;
      payload.botActionTemplate = type;
    }
    this.setActionConfig(payload);
  }
  setActionConfig(payload) {
    const quaryparms: any = {
      streamId: this.selectedApp._id
    };
    this.service.invoke('put.tourConfig', quaryparms, payload).subscribe(res => {
      this.headerService.updateSearchConfiguration();
      this.notificationService.notify('Configuration Updated Successfully', 'success');
    },
      errRes => {
        this.notificationService.notify('Failed to update?', 'error');
      });
  }

}


// }