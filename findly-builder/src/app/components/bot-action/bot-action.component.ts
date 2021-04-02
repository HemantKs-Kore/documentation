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
declare const $: any;
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
  refId: any ='';
  allBotArray : any = [];
  sortedBy: string;
  sortInAscending: boolean = false;
  associatedBotsExist: boolean = true;
  linkedBotID: any;
  linkedBotName: any;
  linkedBotDescription: any;
  islinked = false;
  botToBeUnlinked = '';
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
  showSearch;
  searchImgSrc:any='assets/icons/search_gray.svg';
  searchFocusIn=false;
  searchTasks = '';
  selcectionObj: any = {
    selectAll: false,
    selectedItems:[],
  };
  isEnabledAll = "disable"
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
  ) { }
  checkUncheckTasks(task){
    const selectedElements = $('.selectEachTaskInput:checkbox:checked');
    const allElements = $('.selectEachTaskInput');
    if(selectedElements.length === allElements.length){
      let partialElement : any = document.getElementsByClassName("partial-select-checkbox");
      if(partialElement.length){
        partialElement[0].classList.add('d-none');
      }
      let selectAllElement : any = document.getElementsByClassName("select-all-checkbox");
      if(selectAllElement.length){
        selectAllElement[0].classList.remove('d-none');
      }
      $('#selectAllTasks')[0].checked = true;
    } else {
      let partialElement : any = document.getElementsByClassName("partial-select-checkbox");
      let selectAllElement : any = document.getElementsByClassName("select-all-checkbox");

      if(partialElement && (selectedElements.length != 0)){
        partialElement[0].classList.remove('d-none');
        if(selectAllElement.length){
          selectAllElement[0].classList.add('d-none');
        }
      }
      else{
        partialElement[0].classList.add('d-none');
        if(selectAllElement.length){
          selectAllElement[0].classList.remove('d-none');
        }
      }
      $('#selectAllTasks')[0].checked = false;
    }
    const element = $('#' + task._id);
    const addition =  element[0].checked
    this.addRemoveTasksFromSelection(task._id,addition);
  }
  selectAllFromPartial(){
    this.selcectionObj.selectAll = true;
    $('#selectAllTasks')[0].checked = true;
    this.selectAll();
  }
  selectAll(unselectAll?) {
    const allTasks = $('.selectEachTaskInput');
    if (allTasks && allTasks.length){
      $.each(allTasks, (index,element) => {
        if($(element) && $(element).length){
          $(element)[0].checked = unselectAll?false: this.selcectionObj.selectAll;
          const facetId = $(element)[0].id
          this.addRemoveTasksFromSelection(facetId,$(element)[0].checked);
        }
      });
    };
    let partialElement : any = document.getElementsByClassName("partial-select-checkbox");
    if(partialElement.length){
      partialElement[0].classList.add('d-none');
    }
    let selectAllElement : any = document.getElementsByClassName("select-all-checkbox");
    if(selectAllElement.length){
      selectAllElement[0].classList.remove('d-none');
    }
    if(unselectAll){
      $('#selectallTasks')[0].checked = false;
    }
  }
  addRemoveTasksFromSelection(facetId?,addtion?,clear?){
    if(clear){
      this.resetPartial();
      const allTasks = $('.selectEachfacetInput');
      $.each(allTasks, (index,element) => {
        if($(element) && $(element).length){
          $(element)[0].checked =false;
        }
      });
     this.selcectionObj.selectedItems = {};
     this.selcectionObj.selectedCount = 0;
     this.selcectionObj.selectAll = false;
    } else {
     if(facetId){
       if(addtion){
         this.selcectionObj.selectedItems[facetId] = {};
       } else {
         if(this.selcectionObj.selectedItems[facetId]){
           delete this.selcectionObj.selectedItems[facetId]
         }
       }
     }
     this.selcectionObj.selectedCount = Object.keys(this.selcectionObj.selectedItems).length;
    }
  }
  resetPartial(){
    this.selcectionObj.selectAll = false;
    if($('#selectAllTasks').length){
      $('#selectAllTasks')[0].checked = false;
    }
    let partialElement : any = document.getElementsByClassName("partial-select-checkbox");
    if(partialElement.length){
      partialElement[0].classList.add('d-none');
    }
    let selectAllElement : any = document.getElementsByClassName("select-all-checkbox");
    if(selectAllElement.length){
      selectAllElement[0].classList.remove('d-none');
    }
  }
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
    //this.getdialog();
    //this.getLinkedBot();
  }
  loadingContent1: boolean;
  loadImageText: boolean = false;
  imageLoad(){
    console.log("image loaded now")
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
  }
  getdialog() {
    const queryParams = {
      streamId: this.selectedApp._id
    }

    this.service.invoke('get.dialog', queryParams).subscribe(
      res => {
        this.refId = res[0]._id;
        //this.notificationService.notify('Credential Configuered', 'success');
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed get DialogID', 'error');
        }
      }
    );
  }
  getLinkedBot() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }

    this.service.invoke('get.linkedBot', queryParams).subscribe(
      res => {
        //if (res.configuredBots.length) this.configuredBot_streamId = res.configuredBots[0]._id
        console.log(res);
        // res.configuredBots.forEach(element => {
        //   let obj = {
        //     "_id": element._id,
        //     "state": "new"
        //   }
        //   this.allBotArray.push(obj);
        // });
        // res.unpublishedBots.forEach(element => {
        //   let obj = {
        //     "_id": element._id,
        //     "state": "delete"
        //   }
        //   this.allBotArray.push(obj);
        // });
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to get LInked BOT', 'error');
        }
      }
    );
  }
  toggleSearch() {
    if (this.showSearch && this.searchTasks) {
      this.searchTasks = '';
    }
    this.showSearch = !this.showSearch
  };
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
              if (res.length > 0) {
                this.loadingContent = false;
                this.loadingContent1 = true;
              }
              else {
                this.loadingContent1 = true;
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
  linkAfterUnlink(botID){
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
        // Universal Bot Publish here.
        this.allBotArray =[];
        res.configuredBots.forEach(element => {
          let obj = {
            "_id": element._id,
            "state": "new"
          }
          this.allBotArray.push(obj);
        });
        res.unpublishedBots.forEach(element => {
          let obj = {
            "_id": element._id,
            "state": "delete"
          }
          this.allBotArray.push(obj);
        });
        if(this.allBotArray.length > 0){
          this.universalPublish();
        }
         // Universal Bot Publish here.
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
        this.workflowService.linkBot(botID);
        this.workflowService.smallTalkEnable(res.stEnabled);
        this.notificationService.notify("Bot linked, successfully", 'success')
      },
        (err) => {
           console.log(err); this.notificationService.notify("Bot linking, unsuccessful", 'error') 
        this.loadingContent = false;

      }
      )
    }
    else {
      this.notificationService.notify('Failed', 'Error in linking bot');
    }
  } 
  linkBot(botID: any) {
    if(this.botToBeUnlinked && this.islinked){
      this.unlinkBotWhithPublish(botID);
      this.workflowService.linkBot(botID);
    }else{
      this.linkAfterUnlink(botID);
      this.botToBeUnlinked = botID;
      this.islinked = true;
    }

    // OLD LOGIC
    // event.stopPropagation();

    // let requestBody: any = {};
    // let selectedApp: any;
    // console.log(botID);

    // if (this.searchIndexId) {

    //   this.loadingContent = true;

    //   const queryParams: any = {
    //     searchIndexID: this.searchIndexId
    //   };
    //   requestBody['linkBotId'] = botID;
    //   console.log(requestBody);
    //   this.service.invoke('put.LinkBot', queryParams, requestBody).subscribe(res => {
    //     // Universal Bot Publish here.
    //     this.allBotArray =[];
    //     res.configuredBots.forEach(element => {
    //       let obj = {
    //         "_id": element._id,
    //         "state": "new"
    //       }
    //       this.allBotArray.push(obj);
    //     });
    //     res.unpublishedBots.forEach(element => {
    //       let obj = {
    //         "_id": element._id,
    //         "state": "delete"
    //       }
    //       this.allBotArray.push(obj);
    //     });
    //     if(this.allBotArray.length > 0){
    //       this.universalPublish();
    //     }
    //      // Universal Bot Publish here.
    //     console.log(res);
    //     selectedApp = this.workflowService.selectedApp();
    //     console.log("Selected APP", selectedApp);
    //     if (res.configuredBots[0]) {
    //       selectedApp.configuredBots[0] = {};
    //       selectedApp.configuredBots[0]._id = res.configuredBots[0]._id;
    //       this.linkedBotID = res.configuredBots[0]._id;
    //       this.linkedBotName = res.configuredBots[0].botName;
    //     }
    //     else {
    //       selectedApp.publishedBots[0] = {};
    //       selectedApp.publishedBots[0]._id = res.publishedBots[0]._id;
    //       this.linkedBotID = res.publishedBots[0]._id
    //       this.linkedBotName = res.publishedBots[0].botName;
    //     }

    //     this.linkedBotDescription = res.description;
    //     console.log("Linked Bot ID, Linked Bot Name, Linked Bot Description", this.linkedBotID, this.linkedBotName, this.linkedBotDescription);
    //     this.workflowService.selectedApp(selectedApp);
    //     console.log(res.status);
    //     if (selectedApp.configuredBots[0]) {
    //       this.streamId = selectedApp.configuredBots[0]._id;
    //     }
    //     else {
    //       this.streamId = selectedApp.publishedBots[0]._id;
    //     }
    //     this.getAssociatedTasks(this.streamId)
    //     this.getAssociatedBots();
    //     this.notificationService.notify("Bot linked, successfully", 'success')
    //   },
    //     (err) => {
    //        console.log(err); this.notificationService.notify("Bot linking, unsuccessful", 'error') 
    //     this.loadingContent = false;

    //   }
    //   )
    // }
    // else {
    //   this.notificationService.notify('Failed', 'Error in linking bot');
    // }
  }
  universalPublish(){
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }
    let payload = {
      "bots": this.allBotArray,
        // [
        //   {
        //     "_id": this.configuredBot_streamId,
        //     "state": "new"
        //   }
        // ],
      "publishAllComponents": true,
      "versionComment": "publishing",
      "linkedBotCount": 1
    }

    this.service.invoke('universal.publish', queryParams, payload).subscribe(
      res => {
        this.notificationService.notify('Universal Published', 'success');
       // console.log(res);
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  standardPublish() {
    const queryParams = {
      streamId: this.selectedApp._id
    }
    let payload = {
      "resources":
        [
          {
            "namespace": "enterprise",
            "resourceId": this.refId,
            "namespaceIds": [],
            "resourceType": "dialog",
            "approvalRequestedLanguages": ["en"]
          },
          { "resourceId": "smalltalk", "resourceType": "smalltalk", "approvalRequestedLanguages": ["en"] },
          { "resourceId": "NL", "resourceType": "NL", "modules": ["linked_bot_training", "bot_synonyms", "thresholds_and_configurations", "standard_responses", "default_dialog", "settings"] },
          { "resourceId": "CHANNELS", "resourceType": "CHANNELS", "modules": ["rtm"] }, { "resourceId": "EXTENSIONS", "resourceType": "EXTENSIONS", "modules": ["botkit", "websdk", "events"] },
          { "resourceId": "SETTINGS", "resourceType": "SETTINGS", "modules": ["general", "pii", "ivr", "hold_resume", "custom_script", "advanced", "bot_variables"] },
          { "resourceId": "BOTLANGUAGES", "resourceType": "BOTLANGUAGES", "modules": { "enabledLanguages": ["en"] } }], "publishAllComponents": true, "versionComment": "publishing", "linkedBotCount": 1
    }

    this.service.invoke('standard.publish', queryParams, payload).subscribe(
      res => {
        //this.notificationService.notify('Standard Published', 'success');
        if(this.allBotArray.length > 0){
          this.universalPublish();
        }
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed Standard Publish', 'error');
        }
      }
    );
  }
  unlinkBotWhithPublish(linkingBotID){
    let requestBody: any = {};
    let selectedApp: any;
    if (this.searchIndexId) {
      this.loadingContent = true;
      const queryParams = {
        searchIndexID: this.searchIndexId
      }
      requestBody['linkedBotId'] = this.streamId//this.botToBeUnlinked;
      console.log(requestBody);

      this.service.invoke('put.UnlinkBot', queryParams, requestBody).subscribe(res => {
        console.log(res);
        this.linkAfterUnlink(linkingBotID);
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

        //this.getAssociatedBots();
        //this.getAssociatedTasks(this.streamId);
        this.notificationService.notify("Bot unlinked, successfully. Please publish to reflect", 'success');
        
      },
        (err) => { 
          console.log(err); this.notificationService.notify("Bot unlinking, successfully", 'error'); 
          this.loadingContent = false;
          //this.getAssociatedTasks(this.streamId);
        }
       )
     }
  }
  unlinkBot(botID: any,linkType?) {
    // if(!linkType){
    //   this.openBotsModalElement();
    //   this.notificationService.notify('Please link other Bots to ulink the current Bot', 'warning');
    //   this.botToBeUnlinked = botID;
    // }else{
    //   this.notificationService.notify('Please link other Bots to ulink the current Bot', 'warning');
      this.botToBeUnlinked = botID;
     // OLD LOGIC
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
       // Universal Bot Publish here.
       this.allBotArray =[];
    
       res.configuredBots.forEach(element => {
        let obj = {
          "_id": element._id,
          "state": "new"
        }
        this.allBotArray.push(obj);
      });
      res.unpublishedBots.forEach(element => {
        let obj = {
          "_id": element._id,
          "state": "delete"
        }
        this.allBotArray.push(obj);
      });
      if(this.allBotArray.length > 0){
        this.universalPublish();
      }
       // Universal Bot Publish here.
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
        this.workflowService.linkBot('');
        this.syncLinkedBot();

        this.notificationService.notify("Bot unlinked, successfully. Please publish to reflect", 'success');
        
      },
        (err) => { 
          console.log(err); this.notificationService.notify("Bot unlinking, successfully", 'error'); 
          this.loadingContent = false;
          //this.getAssociatedTasks(this.streamId);
        }
       )
     }
    
  }
  getAssociatedTasks(botID) {
    if (botID != null) {
      this.islinked = true;
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
          (err) => { 
            this.loadingContent = false;
            console.log(err) 
          },
          () => { console.log("XHR Call Completed") }
        )
      }
    }
    else {
      this.linkedBotTasks = [];
      this.linkedBotFAQs = [];
      this.loadingContent = false;
      this.islinked = false;
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
  
  enableDisableTask(){
    this.isEnabledAll = (this.isEnabledAll === 'disable')?'enable':'disable';
    if(this.isEnabledAll === 'enable'){
      this.enableSeletedTasks(true);
    }else{
      this.disableSeletedTasks(true);
    }
  }

  enableSeletedTasks(isEnabledAll) {
    event.preventDefault();

    const tasks = isEnabledAll?this.linkedBotTasks:Object.keys(this.selcectionObj.selectedItems);

    let requestBody = {};
    requestBody['tasks'] = [];
    

    if (this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };
      tasks.forEach((e:any) => {
        if (isEnabledAll) {
          if (e.isHidden == true) {
            let taskObject: any = {};
            taskObject['_id'] = e._id;
            taskObject['streamId'] = this.streamId;
            taskObject['isHidden'] = false;
            requestBody['tasks'].push(taskObject);
          }
        } else {
          let taskObject: any = {};
          taskObject['_id'] = e;
          taskObject['streamId'] = this.streamId;
          taskObject['isHidden'] = false;
          requestBody['tasks'].push(taskObject);
        }
      });
      
      console.log(requestBody)

      this.service.invoke('put.enableTask', queryParams, requestBody, { "state": "published" }).subscribe(res => {
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
          this.notificationService.notify("Task Enabled, Successfully", 'success');
          this.selcectionObj = {
            selectAll: false,
            selectedItems:[]
          };
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
  disableSeletedTasks(isDisabledAll) {
    event.preventDefault();
    const tasks = isDisabledAll?this.linkedBotTasks:Object.keys(this.selcectionObj.selectedItems);
    let requestBody = {};
    requestBody['tasks'] = [];
    let taskObject = {};

    if (this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };
      tasks.forEach((e:any) => {
        if (isDisabledAll) {
          if (e.isHidden == false) {
            let taskObject:any = {};
            taskObject['_id'] = e._id;
          taskObject['streamId'] = this.streamId;
          taskObject['isHidden'] = true;
          requestBody['tasks'].push(taskObject);
          }
        } else {
          let taskObject:any = {};
        taskObject['_id'] = e;
      taskObject['streamId'] = this.streamId;
      taskObject['isHidden'] = true;
      requestBody['tasks'].push(taskObject);
        }



        
      });

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
          this.selcectionObj = {
            selectAll: false,
            selectedItems:[]
          };
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