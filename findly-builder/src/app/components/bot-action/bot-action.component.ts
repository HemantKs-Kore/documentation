import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
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
  searchIndexId: any;
  streamId: any;
  currentView: any;
  bots: any = [];

  sortedBy: string;
  sortInAscending: boolean = false;
  associatedBotsExist: boolean = true;
  linkedBotID: any;
  linkedBotName: any;
  linkedBotDescription: any;
  // associatedBotArr = [];
  userInfo: any;
  botsModalRef: any;
  @ViewChild('botsModalElement') botsModalElement: KRModalComponent;
  searchBots: string;
  searchSources: string;
  associatedBots: any = [];
  associatedTasks: any = [];

  linkedBotTasks: any = [];
  linkedBotFAQs: any = [];

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
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    if (this.workflowService.selectedApp()?.configuredBots[0]) {
      this.streamId = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
    }
    else if (this.workflowService.selectedApp()?.publishedBots[0]) {
      this.streamId = this.workflowService.selectedApp()?.publishedBots[0]?._id ?? null
    }
    else {
      this.streamId = null;
    }
    console.log("StreamID", this.streamId)
    console.log(this.workflowService.selectedApp())
    // this.getBots();

    this.userInfo = this.authService.getUserInfo() || {};
    console.log(this.userInfo);

    this.getAssociatedBots();
    this.getAssociatedTasks(this.streamId);

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
          if (this.sortInAscending == true && type == 'up') {
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

  openBotsModalElement() {
    this.botsModalRef = this.botsModalElement.open();

  }

  closeBotsModalElement() {
    if (this.botsModalRef && this.botsModalRef.close) {
      this.botsModalRef.close();
    }
  }

  modifyStyles(elementRef, isActive) {
    console.log(elementRef);
    let element = document.getElementById(elementRef);
    console.log(element);
    console.log(isActive)
    // document.getElementById(elementRef).style.borderBottom = "none";
  }

  getAssociatedBots() {
    if (this.userInfo.id) {
      const queryParams: any = {
        userID: this.userInfo.id
      };
      this.service.invoke('get.AssociatedBots', queryParams).subscribe(res => {
        console.log("Stream API, response payload", res);
        this.associatedBots = [];
        if (res.length > 0) {
          res.forEach(element => {
            if (element.type == "default" || element.type == "universalbot") {
              element.publishedTasksCount = 0;
              element.publishedFAQsCount = 0;
              let dialogsArr = element.taskCounts?.dialogs ?? [];
              let kTasksArr = element.taskCounts?.kTasksArr ?? [];

              if (this.streamId == element._id) {
                this.linkedBotName = element.name;
                this.linkedBotDescription = element.description;
                this.linkedBotID = element._id;
              }

              if (dialogsArr.length > 0) {
                for (let i = 0; i < dialogsArr.length; i++) {
                  if (dialogsArr[i].state == "published") {
                    element.publishedTasksCount = dialogsArr[i].count + element.publishedTasksCount;
                  }
                }
              }

              if (kTasksArr.length > 0) {
                for (let j = 0; j < kTasksArr.length; j++) {
                  if (kTasksArr[j].state == "published") {
                    element.publishedFAQsCount = kTasksArr[j].count + element.pusblishedFAQsCount;
                  }
                }
              }

              this.associatedBots.push(element);
            }
          });

          console.log("Associated Bots", this.associatedBots);
          if (this.associatedBots.length > 0) {
            this.associatedBotsExist = true;
          }
        }
        else {
          this.associatedBotsExist = false;
          if (this.associatedBots.errors?.length) {
            this.notificationService.notify("Invalid request", 'error')
          }
        }
      },
        (err) => { console.log(err); this.notificationService.notify("Error in loading associated bots", 'error') },

        () => { console.log("XHR Call Complete") }
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

    if (this.searchIndexId) {

      this.loadingContent = true;

      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };
      requestBody['linkBotId'] = botID;
      console.log(requestBody);
      this.service.invoke('put.LinkBot', queryParams, requestBody).subscribe(res => {
        console.log(res);
        selectedApp = this.workflowService.selectedApp();
        console.log("Selected APP", selectedApp);
        if (res.configuredBots[0]) {
          selectedApp.configuredBots[0] = {};
          selectedApp.configuredBots[0]._id = res.configuredBots[0]._id;
          this.linkedBotID = res.configuredBots[0]._id;
          this.linkedBotName = res.configuredBots[0].botName;
        }
        else {
          selectedApp.publishedBots[0] = {};
          selectedApp.publishedBots[0]._id = res.publishedBots[0]._id;
          this.linkedBotID = res.publishedBots[0]._id
          this.linkedBotName = res.publishedBots[0].botName;
        }

        this.linkedBotDescription = res.description;
        console.log("Linked Bot ID, Linked Bot Name, Linked Bot Description", this.linkedBotID, this.linkedBotName, this.linkedBotDescription);
        this.workflowService.selectedApp(selectedApp);
        console.log(res.status);
        if (selectedApp.configuredBots[0]) {
          this.streamId = selectedApp.configuredBots[0]._id;
        }
        else {
          this.streamId = selectedApp.publishedBots[0]._id;
        }
        this.getAssociatedTasks(this.streamId)
        this.getAssociatedBots();
        this.notificationService.notify("Bot linked, successfully", 'success')
      },
        (err) => { console.log(err); this.notificationService.notify("Bot linking, unsuccessful", 'error') }

      )
    }
    else {
      this.notificationService.notify('Failed', 'Error in linking bot');
    }
  }
  unlinkBot(botID: any) {
    event.stopPropagation();

    let requestBody: any = {};
    let selectedApp: any;

    console.log(botID);

    if (this.searchIndexId) {
      
      this.loadingContent = true;

      const queryParams = {
        searchIndexID: this.searchIndexId
      }
      requestBody['linkedBotId'] = botID;
      console.log(requestBody);

      this.service.invoke('put.UnlinkBot', queryParams, requestBody).subscribe(res => {
        console.log(res);

        selectedApp = this.workflowService.selectedApp();
        if (selectedApp.configuredBots[0]) {
          selectedApp.configuredBots[0]._id = null;
        }
        else {
          selectedApp.publishedBots[0]._id = null;
        }
        this.linkedBotID = null;
        this.linkedBotName = null;
        this.linkedBotDescription = null;

        this.workflowService.selectedApp(selectedApp);
        this.streamId = null;

        this.getAssociatedBots();
        this.getAssociatedTasks(this.streamId);

        this.notificationService.notify("Bot unlinked, successfully", 'success');

      },
        (err) => { console.log(err); this.notificationService.notify("Bot unlinking, successfully", 'error'); }
      )
    }
  }
  getAssociatedTasks(botID) {
    if (botID != null) {
      if (this.searchIndexId) {
        const queryParams: any = {
          searchIndexID: this.searchIndexId
        };
        this.service.invoke('get.AssociatedBotTasks', queryParams, null, { "state": "published" }).subscribe(res => {

          
          console.log("getAllTasks API response payload", res);

          this.linkedBotTasks = [];
          if (res.tasks.length > 0) {
            res.tasks.forEach(element => {
              if (element.state == "published") {
                if (element.isHidden == false) {
                  element.taskStatus = "Enabled";
                }
                else {
                  element.taskStatus = "Disabled";
                }
                element.type = element.type ?? "Dialog";
                this.linkedBotTasks.push(element);
              }
            });
            console.log("Linked Bot, Tasks", this.linkedBotTasks);
          }
          else {
            this.linkedBotTasks = []
          }

          if (res.faqs.length > 0) {
            res.faqs.forEach(element => {
              if (element.faqs == "published") {
                this.linkedBotFAQs.push(element);
              }
            });
            console.log("Linked Bot, FAQs", this.linkedBotFAQs);
          }
          else {
            this.linkedBotFAQs = [];
          }

          this.loadingContent = false;
        },
          (err) => { console.log(err) },
          () => { console.log("XHR Call Completed") }
        )
      }
    }
    else {
      this.linkedBotTasks = [];
      this.linkedBotFAQs = [];
      this.loadingContent = false;
    }
  }

  toggleDisable($event: NgbPanelChangeEvent) {
    $event.preventDefault();
  }

  deleteTask(taskID: string) {
    for (let i = 0; i < this.bots.length; i++) {
      if (this.bots[i]['_id'] == taskID) {
        this.bots.splice(i, 1);
        this.notificationService.notify("Task deleted, successfully", 'success')
      }
    }
  }

  enableTask(taskID) {
    event.preventDefault();
    let requestBody = {};
    requestBody['tasks'] = [];
    let taskObject = {};

    if (taskID && this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };

      taskObject['_id'] = taskID;
      taskObject['streamId'] = this.streamId;
      taskObject['isHidden'] = false;

      requestBody['tasks'].push(taskObject)
      console.log(requestBody)

      this.service.invoke('put.enableTask', queryParams, requestBody, { "state": "published" }).subscribe(res => {
        console.log(res);
        /*this.linkedBotTasks.map(element => {
          if (res._id === element._id) {
            element = res;
            console.log(element);
            this.notificationService.notify("Task Enabled, Successfully", 'success');
          }
        })*/
        if (res.tasks.length > 0) {
          this.linkedBotTasks = [];
          res.tasks.forEach(element => {
            if (element.state == "published") {
              if (element.isHidden == false) {
                element.taskStatus = "Enabled";
              }
              else {
                element.taskStatus = "Disabled";
              }
              element.type = element.type ?? "Dialog";
              this.linkedBotTasks.push(element);
            }
          });
          console.log("Linked Bot, Tasks", this.linkedBotTasks);
          this.notificationService.notify("Task Enabled, Successfully", 'success');
        }
      },
        (err) => { this.notificationService.notify("Task Enabling Failed", 'error') });
    }
  }

  disableTask(taskID) {
    event.preventDefault();
    let requestBody = {};
    requestBody['tasks'] = [];
    let taskObject = {};

    if (taskID && this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };

      taskObject['_id'] = taskID;
      taskObject['streamId'] = this.streamId;
      taskObject['isHidden'] = true;

      requestBody['tasks'].push(taskObject)
      console.log(requestBody)

      this.service.invoke('put.disableTask', queryParams, requestBody, { "state": "published" }).subscribe(res => {
        console.log(res);
        /*this.linkedBotTasks.map(element => {
          if (res._id === element._id) {
            element = res;
            console.log(element);
            this.notificationService.notify("Task Disabled, Successfully", 'success');
          }
        })*/
        if (res.tasks.length > 0) {
          this.linkedBotTasks = [];
          res.tasks.forEach(element => {
            if (element.state == "published") {
              if (element.isHidden == false) {
                element.taskStatus = "Enabled";
              }
              else {
                element.taskStatus = "Disabled";
              }
              element.type = element.type ?? "Dialog";
              this.linkedBotTasks.push(element);
            }
          });
          console.log("Linked Bot, Tasks", this.linkedBotTasks);
          this.notificationService.notify("Task Disabled, Successfuly", 'success')
        }
      }, (err) => { this.notificationService.notify("Task Disabling Failed", 'error') })
    }
  }

  syncLinkedBot() {
    if (this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };
      this.service.invoke('put.syncLinkedBot', queryParams, null, { "state": "published" }).subscribe(res => {
        console.log(res);
        if (res.tasks.length > 0) {
          this.linkedBotTasks = [];
          res.tasks.forEach(element => {
            if (element.state == "published") {
              if (element.isHidden == false) {
                element.taskStatus = "Enabled";
              }
              else {
                element.taskStatus = "Disabled";
              }
              element.type = element.type ?? "Dialog";
              this.linkedBotTasks.push(element);
            }
          });
          console.log("Linked Bot, Tasks", this.linkedBotTasks);
        }
        else {
          this.linkedBotTasks = [];
        }
        if (res.faqs.length > 0) {
          this.linkedBotFAQs = []
          res.faqs.forEach(element => {
            if (element.faqs == "published") {
              this.linkedBotFAQs.push(element);
            }
          });
          console.log("Linked Bot, FAQs", this.linkedBotFAQs);
        }
        else {
          this.linkedBotFAQs = [];
        }
        this.notificationService.notify("Linked Bot Synced, Successfully", 'success')
      })
    }
  }
}