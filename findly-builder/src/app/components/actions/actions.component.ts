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
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
 
  searchIndexId:any;
  selectedApp: any;
  LinkABot:any;
  botLinked=false;
  checkTopBottom=false;
  checkBottomTop=false;
  showTop = false;
  showBottom = false
  topActionsTop = false;
  topActionsBottom : boolean;
  bottomActionsTop = false;
  bottomActionsBottom = false;
  previewTopBottom:any;
  searchObject: any = {
   
  };
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
    this.LinkABot = this.workflowService.linkedBot;
    console.log(this.LinkABot)
    this.previewTopBottom = this.workflowService.checkTopOrBottom();
    this. botLinkedOrUnlinked();
    // this. topDownOrBottomUp(type);
    console.log(this.previewTopBottom)
    console.log(this.LinkABot)
  }

  openActions(){
  $('#botActionsTab').trigger('click')
} 
  botLinkedOrUnlinked() {
    // this.LinkABot = this.workflowService.linkBot()
    this.botLinked  = this.LinkABot?true:false;
    // if (this.LinkABot) {
    //   this.botLinked = true; 
    // }
    // else if (!this.LinkABot){
    //   this.botLinked = false;

    }
  
    // topDownOrBottomUp(){
    //   if(this.previewTopBottom == "top" ){
    //     this.checkTopBottom = true;
    //   }
    //   else{
    //     this.checkBottomTop = true;
    //   }

    // }
    topDownOrBottomUp(type) {
    if (this.previewTopBottom == "top") {
      this.bottomActionsTop = false;
      this.bottomActionsBottom = false;
      if (type === 'showTop') {
        this.topActionsTop = true;
        this.topActionsBottom = false;

      }
      else if (type === 'showBottom') {
        this.topActionsBottom = true;
        this.topActionsTop = false;
      }
    }
    else if(this.previewTopBottom == "bottom"){
      this.topActionsTop = false;
      this.topActionsBottom = false;
      if(type == 'showTop'){
        this.bottomActionsTop = true;
        this.bottomActionsBottom = false;
      }
      if(type == 'showBottom'){
        this.bottomActionsBottom = true;
        this.bottomActionsTop = false;
      }

    }

  }
}


// }