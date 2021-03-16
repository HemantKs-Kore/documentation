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
    this.LinkABot = this.workflowService.linkBot();
    this. botLinkedOrUnlinked();
    console.log(this.LinkABot)
  }

  openActions(){
  $('#botActionsTab').trigger('click')
} 
  botLinkedOrUnlinked() {
    // this.LinkABot = this.workflowService.linkBot()
    if (this.LinkABot) {
      this.botLinked = true; 
    }
    else if (!this.LinkABot){
      this.botLinked = false;

    }
}





}
