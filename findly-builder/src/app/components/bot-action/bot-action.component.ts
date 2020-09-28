import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'underscore';

import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

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

  sortedBy: string;
  sortInAscending: boolean = false;
  emptyAssociatedBots: boolean = true;
  linkedBotName: any;
  associatedBotArr = [];
  userInfo: any;
  linkExistingBotsModalRef: any = [];
  @ViewChild('linkExistingBotsComponent') linkExistingBotsComponent: KRModalComponent;
  searchBots: string;
  searchSources: string;
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
    console.log(this.selectedApp);
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    // this.streamId = this.workflowService.selectedApp().findlyLinkedBotId;
    this.streamId = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
    console.log("StreamID", this.streamId)
    console.log(this.workflowService.selectedApp())
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
        // this.errorToaster(errRes, 'Failed to get Bot Actions');
        this.notificationService.notify("Error in loading bot action", 'error');

      });
    } else {
      this.bots = [];
      this.loadingContent = false;
    }
  }

  /*errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }*/

  compareValues(valA: number | string, valB: number | string, sortType: boolean) {
    return (valA < valB ? -1 : 1) * (sortType ? 1 : -1);
  }

  sortBy(sortingField: string) {
    const listData = this.bots.slice(0);
    this.sortedBy = sortingField;

    if (this.sortedBy !== sortingField) {
      this.sortInAscending = true;
    }
    else {
      this.sortInAscending = !this.sortInAscending;
    }

    const sortedData = listData.sort((a: any, b: any) => {
      const sortOrder = this.sortInAscending;
      switch (sortingField) {
        case 'name': return this.compareValues(a.name, b.name, sortOrder);
        case 'noOfAppearences': return this.compareValues(a.noOfAppearences, b.noOfAppearences, sortOrder);
        case 'noOfClicks': return this.compareValues(a.noOfClicks, b.noOfClicks, sortOrder);
        default: return;
      }
    });
    this.bots = sortedData;
  }

  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.sortedBy) {
      case "name": {
        if (this.sortedBy == sortingField) {
          if (this.sortInAscending == false && type == 'down') {
            return "display-block";
          }
          if(this.sortInAscending == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "noOfAppearences": {
        if (this.sortedBy == sortingField) {
          if (this.sortInAscending == false && type == 'down') {
            return "display-block";
          }
          if (this.sortInAscending == true && type == 'up') {
            return "display-block";
          }
          return "display-none";
        }
      }
      case "noOfClicks": {
        if (this.sortedBy == sortingField) {
          if (this.sortInAscending == false && type == 'down') {
            return "display-block";
          }
          else if (this.sortInAscending == true && type == 'up') {
            return "display-block";
          }
          return "display-none";
        }
      }
    }
  }

  clearSearchSourcesResults() {
    this.searchSources = null;
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
        this.associatedBotArr = [];
        if (this.associatedBots.length > 1) {
          this.associatedBots.forEach(element => {
            if (this.streamId == element._id) {
              this.linkedBotName = element.name;
            }
            let botObject = {};
            botObject['_id'] = element._id;
            botObject['botName'] = element.botName;
            this.associatedBotArr.push(botObject);
          });
          console.log(this.associatedBotArr);
          this.emptyAssociatedBots = false;
        }
        else {
          this.emptyAssociatedBots = true;
        }
      },
        (err) => { console.log(err); this.notificationService.notify("Error in loading associated bots", 'error') },

        () => { console.log("Call Complete") }
      )
    }
    else {
      console.log("Invalid UserID")
    }
  }

  linkBot(botID: any) {
    event.stopPropagation();

    let requestBody: any = {};
    let selectedApp: any;

    console.log(botID);

    if (this.serachIndexId) {
      const queryParams: any = {
        searchIndexID: this.serachIndexId
      };
      requestBody['linkBotId'] = botID;
      console.log(requestBody);
      this.service.invoke('put.LinkBot', queryParams, requestBody).subscribe(res => {
        console.log(res);
        selectedApp = this.workflowService.selectedApp();
        console.log(selectedApp);
        selectedApp.configuredBots[0]._id = res.configuredBots[0]._id;
        this.linkedBotName = res.configuredBots[0].botName;
        this.workflowService.selectedApp(selectedApp);
        console.log(res.status);
        this.streamId = selectedApp.configuredBots[0]._id;
        this.getBots();
        this.getAssociatedBots();
        this.notificationService.notify("Bot linked, successfully", 'success')
      },

        (err) => { console.log(err); this.notificationService.notify("Bot linking, unsuccessful", 'error') }

      )
    }
    else {
      this.notificationService.notify('Failed', 'Error in Linking Bot');
    }
  }
  unlinkBot(botID: any) {
    event.stopPropagation();

    let requestBody: any = {};
    let selectedApp: any;

    console.log(botID);

    if (this.serachIndexId) {
      const queryParams = {
        searchIndexID: this.serachIndexId
      }
      requestBody['linkedBotId'] = botID;
      console.log(requestBody);

      this.service.invoke('put.UnlinkBot', queryParams, requestBody).subscribe(res => {
        console.log(res);

        selectedApp = this.workflowService.selectedApp();
        selectedApp.configuredBots[0]._id = null;
        this.linkedBotName = null;
        this.workflowService.selectedApp(selectedApp);
        this.streamId = null;
        this.getBots();
        this.getAssociatedBots();
        this.notificationService.notify("Bot unlinked, successfully", 'success');

      },
        (err) => { console.log(err); this.notificationService.notify("Bot unlinking, successfully", 'error'); }
      )
    }
  }
  /*getAssociatedTasks(botID: any) {
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
  }*/

  toggleDisable($event: NgbPanelChangeEvent) {
    $event.preventDefault();
  }

  deleteTask(taskID: string) {
    for(let i = 0; i < this.bots.length; i++) {
      if(this.bots[i]['_id'] == taskID) {
        this.bots.splice(i, 1)
      }
    }
  }

}
