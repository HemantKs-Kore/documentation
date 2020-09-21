import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'underscore';

import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

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

  userInfo: any;
  linkExistingBotsModalRef: any = [];
  @ViewChild('linkExistingBotsComponent') linkExistingBotsComponent: KRModalComponent;
  searchBots: string;
  associatedBots: any = [];
  associatedTasks: any = [];

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
    this.streamId = this.workflowService.selectedApp().findlyLinkedBotId;
    this.getBots();

    this.userInfo = this.authService.getUserInfo() || {};
    console.log(this.userInfo);
    // this.dummyServiceCall();
    this.getAssociatedBots();
  }

  getBots() {
    if (this.streamId) {
      const quaryparms: any = {
        streamId: this.streamId
      };
      this.service.invoke('get.bots', quaryparms).subscribe(res => {
        console.log(res);
        this.currentView = 'grid';
        this.loadingContent = false;
        if (res.tasks && res.tasks.published && res.tasks.published.items && res.tasks.published.items.length) {
          this.bots = _.filter(res.tasks.published.items, (task) => {
            return task.type === 'dialog';
          });
        };
        console.log(this.bots);
      }, errRes => {
        this.errorToaster(errRes, 'Failed to get Bot Actions');

      });
    } else {
      this.bots = [];
      this.loadingContent = false;
    }
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }


  openLinkExistingBotsComponent() {
    this.linkExistingBotsModalRef = this.linkExistingBotsComponent.open();

  }
  closeLinkExistingBotsComponent() {
    if (this.linkExistingBotsModalRef && this.linkExistingBotsModalRef.close) {
      this.linkExistingBotsModalRef.close();
    }
  }
  modifyStyles(elementRef, isActive) {
    console.log(elementRef);
    let element = document.getElementById(elementRef);
    console.log(element);
    console.log(isActive)
  }
  getAssociatedBots() {
    if (this.userInfo.id) {
      const queryParams: any = {
        userID: this.userInfo.id
      };
      this.service.invoke('get.AssociatedBots', queryParams).subscribe(res => {
        console.log("Associated Bots", res);
        this.associatedBots = JSON.parse(JSON.stringify(res));
        console.log(this.associatedBots);
      },
        (err) => { console.log(err) },

        () => { console.log("Call Complete") }
      )
    }
    else {
      console.log("Invalid UserID")
    }
  }
  linkBot(botID: any) {
    console.log(botID);
  }
  getAssociatedTasks(botID: any) {
    if (botID) {
      const queryParams: any = {
        botID: botID
      };
      this.service.invoke('get.AssociatedBotTasks', queryParams).subscribe(res => {
        console.log("Associated Tasks", res);
        this.associatedTasks = [];
        res.forEach(element => {
          if(element.state == "published" && element.isHidden == false){
            this.associatedTasks.push(element);
          }
        });
        console.log(this.associatedTasks);
      },
        (err) => { console.log(err) },
        () => { console.log("Call Completed") }
      )
    }
  }
  /*getAssociatedBots() {
    this.associatedBots = [
      {
        name: 'Dummy Bot',
        content: 'Description Of Dummy Bot'
      },
      {
        name: 'Weather Bot',
        content: 'Description Of Weather Bot'
      },
      {
        name: 'Mail-Client Bot',
        content: 'Description of Mail-Client Bot'
      }
    ]
  }*/
}
