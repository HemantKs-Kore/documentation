import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bot-action',
  templateUrl: './bot-action.component.html',
  styleUrls: ['./bot-action.component.scss']
})
export class BotActionComponent implements OnInit {
  loadingContent = true;
  selectedApp: any;
  serachIndexId;
  streamId;
  currentView;
  bots: any = [];
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.streamId = this.workflowService.selectedApp()._id;
    this.getBots();
  }
  getBots(){
    const quaryparms: any = {
      streamId:this.streamId
    };
    this.service.invoke('get.bots', quaryparms).subscribe(res => {
      console.log(res);
      this.currentView = 'grid';
      this.loadingContent = false;
      this.bots =  [
        {
          lMod: "2020-09-06T11:32:35.000Z",
          name: "Transfer",
          shortDesc: "Transfer fund to other account",
          state: "configured",
          type: "dialog",
          _id: "dg-193fe2c6-7062-50ce-ac6e-5f4a13641e49"
        },
          {
            lMod: "2020-09-06T11:32:35.000Z",
          name: "Pay",
          shortDesc: "Pay bills online",
          state: "configured",
          type: "dialog",
          _id: "dg-193fe2c6-7062-50ce-ac6e-5f4a13641e59"
        },
          {
          lMod: "2020-09-06T11:32:35.000Z",
          name: "Close",
          shortDesc: "Close existing account",
          state: "configured",
          type: "dialog",
          _id: "dg-193fe2c6-7062-50ce-ac6e-5f4a13641e69"
        },{
          lMod: "2020-09-06T11:32:35.000Z",
          name: "Transfer",
          shortDesc: "Transfer fund to other account",
          state: "configured",
          type: "dialog",
          _id: "dg-193fe2c6-7062-50ce-ac6e-5f4a13641e49"
        },
          {
            lMod: "2020-09-06T11:32:35.000Z",
          name: "Pay",
          shortDesc: "Pay bills online",
          state: "configured",
          type: "dialog",
          _id: "dg-193fe2c6-7062-50ce-ac6e-5f4a13641e59"
        },
          {
          lMod: "2020-09-06T11:32:35.000Z",
          name: "Close",
          shortDesc: "Close existing account",
          state: "configured",
          type: "dialog",
          _id: "dg-193fe2c6-7062-50ce-ac6e-5f4a13641e69"
        }
    ];
    }, errRes => {
      this.errorToaster(errRes,'Failed to get Synonyms');
    });
  }
  errorToaster(errRes,message){
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else if (message){
        this.notificationService.notify(message, 'error');
      } else {
        this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  
}
