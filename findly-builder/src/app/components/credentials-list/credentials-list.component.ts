import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

declare const $: any;
@Component({
  selector: 'app-credentials-list',
  templateUrl: './credentials-list.component.html',
  styleUrls: ['./credentials-list.component.scss']
})
export class CredentialsListComponent implements OnInit {
  slider = 0;
  showError: boolean = false;
  selectedApp: any;
  serachIndexId: any;
  firstlistData: any;
  addCredentialRef: any;
  editCredentialRef: any;
  editCredential: any = {};
  listData: any;
  configuredBot_streamId = '';
  searchcredential = '';
 
  showSearch = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  activeClose = false;
  botID = '';
  data;
  isAlertsEnabled: boolean;
  editTitleFlag: boolean = false;
  AppUsage: true;
  channelEnabled: true;
  editCreden: any = {};
  channnelConguired: any = [];
  // existingCredential: boolean = false;
  credentials: any;
  credntial: any = {
    name: '',
    anonymus: true,
    register: true,
    awt: 'HS256',
    enabled: true
  };
  scopeDesc;
  selectedScopes=[];
  scopeList =[
    {
      title : 'Ingest Structured Data',
      desc : 'Assign this scope to store the structured data in SearchAssist.',
      data : 'Ingest Structured Data',
      value : false,
    },
    {
      title : 'Update Structured Document',
      desc : 'Assign this scope to update documents using Document ID.',
      data : 'Update Structured Document',
      value : false,
    },
    {
      title : 'Get Structured Data',
      desc : 'Assign this scope to get the list of documents or individual documents using Document ID',
      data : 'Get Structured Data',
      value : false,
    },
    {
      title : 'Delete Structured Data',
      desc : 'Assign this scope to delete the data stored in SearchAssist using Document ID.',
      data : 'Delete Structured Data',
      value : false,
    },
    {
      title : 'Live search Results',
      desc : 'Assign this scope to get the live search results as the user is typing the query.',
      data : 'Live search Results',
      value : false,
    },
    {
      title : 'Search Results',
      desc : 'Assign this scope to get the search results as the user has submitted the search query.',
      data : 'Search Results',
      value : false,
    },
    {
      title : 'Train',
      desc : 'Assign this scope to index the data stored in SearchAssist.',
      data : 'Train',
      value : false,
    },
    {
      title : 'View FAQ',
      desc : 'Assign this scope to get the list of FAQs stored in SearchAssist.',
      data : 'View FAQ',
      value : false,
    },
  ]
  seed_data :  {
    "_id" : "seed_data_id",
    "__v" : 0.0,
    "appScopes" : [
    {
    "scope" : "ingest_data",
    "description" : {
    "en" : "Assign this scope to allow data ingestion into findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Ingest Data",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "train",
    "description" : {
    "en" : "Assign this scope to allow training data for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Train",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "live_search",
    "description" : {
    "en" : "Assign this scope to allow live search on data for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Live Search",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "full_search",
    "description" : {
    "en" : "Assign this scope to allow full search on data for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Live Search",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "update_permission",
    "description" : {
    "en" : "Assign this scope to allow updating permissions for findly application integration with workspace.ai",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Update Permission",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "view_faqs",
    "description" : {
    "en" : "Assign this scope to allow viewing extracted FAQs for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "View FAQs",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "structured_data:get",
    "description" : {
    "en" : "Assign this scope to allow viewing extracted structured data for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "View Structured Data",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "structured_data:update",
    "description" : {
    "en" : "Assign this scope to allow updating structured data using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Update Structured Data",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "structured_data:delete",
    "description" : {
    "en" : "Assign this scope to allow deleting structured data using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Delete Structured Data",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "create_fields",
    "description" : {
    "en" : "create fields API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Create Fields",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "get_fields",
    "description" : {
    "en" : "Get fields API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Get Fields",
    "parentName" : "",
    "isMandatory" : false
    }
    ],
    "adminAppScopes" : [
    {
    "scope" : "ingest_data",
    "description" : {
    "en" : "Assign this scope to allow data ingestion into findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Ingest Data",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "train",
    "description" : {
    "en" : "Assign this scope to allow training data for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Train",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "live_search",
    "description" : {
    "en" : "Assign this scope to allow live search on data for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Live Search",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "full_search",
    "description" : {
    "en" : "Assign this scope to allow full search on data for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Live Search",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "update_permission",
    "description" : {
    "en" : "Assign this scope to allow updating permissions for findly application integration with workspace.ai",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Update Permission",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "view_faqs",
    "description" : {
    "en" : "Assign this scope to allow viewing extracted FAQs for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "View FAQs",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "structured_data:get",
    "description" : {
    "en" : "Assign this scope to allow viewing extracted structured data for a findly application using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "View Structured Data",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "structured_data:update",
    "description" : {
    "en" : "Assign this scope to allow updating structured data using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Update Structured Data",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "structured_data:delete",
    "description" : {
    "en" : "Assign this scope to allow deleting structured data using secured APIs",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Delete Structured Data",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "create_fields",
    "description" : {
    "en" : "create fields API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Create Fields",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "update_rules",
    "description" : {
    "en" : "Update rules API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Update rules",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "get_fields",
    "description" : {
    "en" : "Get fields API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Get Fields",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "create_rules",
    "description" : {
    "en" : "Create rules API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Create Rules",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "create_weights",
    "description" : {
    "en" : "Create weights API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Create weights",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "create_findly_app",
    "description" : {
    "en" : "Create findly app API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Create findly app",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "update_indexpipeline",
    "description" : {
    "en" : "update index pipeline API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Update indexpipeline",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "advanced_search",
    "description" : {
    "en" : "Advanced Search API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Advanced Search",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "get_status",
    "description" : {
    "en" : "Status API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Status",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "view_datasourcegroups",
    "description" : {
    "en" : "view dataSourceGroups API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Get dataSourceGroups",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "edit_datasourcegroups",
    "description" : {
    "en" : "Edit dataSourceGroups API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Edit dataSourceGroups",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "view_sources",
    "description" : {
    "en" : "view sources API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "View Sources",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "edit_sources",
    "description" : {
    "en" : "Edit sources API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Edit Sources",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "view_contents",
    "description" : {
    "en" : "View Contents API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "View Contents",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "create_datasourcegroup",
    "description" : {
    "en" : "Create data source group API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Create data source group",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "edit_contents",
    "description" : {
    "en" : "Edit contents API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Edit contents",
    "parentName" : "",
    "isMandatory" : false
    },
    {
    "scope" : "get_indexpipelines",
    "description" : {
    "en" : "Get Index Pipelines API",
    "de" : "",
    "es" : "",
    "fr" : ""
    },
    "displayName" : "Get Index Pipelines",
    "parentName" : "",
    "isMandatory" : false
    }
    ]
    }
  componentType: string = 'addData';
  @ViewChild('addCredential') addCredential: KRModalComponent;
  @ViewChild('editCredentialPop') editCredentialPop: KRModalComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    // this.manageCredential();
    // this.getApiScopes();
    this.getCredential();
    // this.getLinkedBot();
  }
  jwtAuth(awt) {
    this.credntial.awt = awt;
  }
  loadImageText: boolean = false;
  loadingContent1: boolean
  loadingContent: boolean
  imageLoad() {
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
  }
  
  
  manageCredential() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id,
      getAppsUsage: true,
    }
    this.service.invoke('manage.credentials', queryParams).subscribe(
      res => {
        this.credentials = res;
        console.log(res)
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
  newCredential() {
    // this.editCredentialRef = this.editCredentialPop.open();
    this.addCredentialRef = this.addCredential.open();
  }
  closeModalPopup() {
    this.credntial.name = [];
    this.credntial.awt = 'HS256';
    this.addCredentialRef.close();
  }
  
  editnewCredential(event, data) {
    this.addCredentialRef = this.addCredential.open()
    this.editTitleFlag = true;
    this.editCredential = data;
    this.editCredential.anonymus = false;
    this.editCredential.register = false;
    if (data.scope && data.scope.length) {
      data.scope.forEach(scopeVal => {
        if (scopeVal === 'anonymouschat') {
          this.editCredential.anonymus = true;
        }
        if (scopeVal === 'registration') {
          this.editCredential.register = true;
        }
      });
    }
  }

  closeEditModalPopup() {
    // if ($('.checkbox-custom')) {
    //   for (let i = 0; i < $('.checkbox-custom').length; i++) {
    //     $('.checkbox-custom')[i].checked = false;
    //   }
    // }
    this.scopeList.forEach(data => {
      data.value = false  
    });
    this.selectedScopes = [];
    this.editCredentialRef.close();
  }

  viewDetails(data){
    this.editCredentialRef = this.editCredentialPop.open();
    this.editCreden.name = data.appName;
    this.editCreden.clientSecret = data.clientSecret;
    this.editCreden.clientId = data.clientId;
    if(data && data.scope && data.scope[2]){
      console.log(this.scopeList) 
      let selectedScope = data.scope[2].scopes
      this.scopeList.forEach(element => {
        selectedScope.forEach(data => {
          if(element.data == data){
            element.value = true
          }
         
        });
        
      });
      
    }
 
  }

  onClickOfScopes(value,data){
    if(!this.selectedScopes.includes(data)){
      this.selectedScopes.push(data)
      this.booleanCheck(data,true)
    }
    else {
      let index = this.selectedScopes.indexOf(data);
     this.selectedScopes = this.selectedScopes.slice(0,index);
     this.booleanCheck(data,false)
    }
  } 

  booleanCheck(data,bool){    
    this.scopeList.forEach(element => {
    if(element.title == data){
     element.value = bool;
    }
    });
  }

  saveEditCredential() {
    // let scope = [];
    // if (this.editCredential.anonymus && this.editCredential.register) {
    //   scope = ['anonymouschat', 'registration'];
    // } else if (this.editCredential.anonymus && !this.editCredential.register) {
    //   scope = ['anonymouschat'];
    // } else if (!this.editCredential.anonymus && this.editCredential.register) {
    //   scope = ['registration'];
    // } else {
    //   scope = [];
    // }
    let ingestData;
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id,
      sdkAppId: this.editCreden.clientId
    }
    const payload = {
      appName: this.editCreden.name,
      algorithm: 'HS256',
      pushNotifications: {
        enable: this.credntial.enabled,
        webhookUrl: ''
      },
      bots: [this.selectedApp._id],
      scope: [
        "anonymouschat",
        "registration",
        {
          bot: this.selectedApp._id, 
            scopes: this.selectedScopes
        }
    ]
    }
    this.service.invoke('edit.credential', queryParams,payload).subscribe(
      res => {
        this.getCredential();
        this.editCredentialRef.close(); 
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
  validateSource() {
    if (this.credntial.awt != 'Select Signing Algorithm' && this.credntial.name != "") {
      this.createCredential()

    }
    else {
      if (this.credntial.awt == 'Select Signing Algorithm') {
        $(".dropdown-input").css("border-color", "#DD3646");
        this.notificationService.notify('Enter the required fields to proceed', 'error');
      }
      if (this.credntial.name == "") {

        $("#addSourceTitleInput").css("border-color", "#DD3646");
        $("#infoWarning1").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
        this.notificationService.notify('Enter the required fields to proceed', 'error');
      }

    }


    // if (this.credntial.name) {
    //   this.createCredential()

    // }


  }
  //track changing of input
  inputChanged(type) {
    if (type == 'title') {
      this.credntial.name != '' ? $("#infoWarning").hide() : $("#infoWarning").show();
      $("#addSourceTitleInput").css("border-color", this.credntial.name != '' ? "#BDC1C6" : "#DD3646");
    }
  }

  createCredential() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }
    let scope = [];
    if (this.credntial.anonymus && this.credntial.register) {
      scope = ['anonymouschat', 'registration'];
    } else if (this.credntial.anonymus && !this.credntial.register) {
      scope = ['anonymouschat'];
    } else if (!this.credntial.anonymus && this.credntial.register) {
      scope = ['registration'];
    } else {
      scope = [];
    }
    const payload = {
      appName: this.credntial.name,
      algorithm: this.credntial.awt,
      scope,
      bots: [this.selectedApp._id],
      pushNotifications: {
        enable: this.credntial.enabled,
        webhookUrl: ''
      }
    }

    this.service.invoke('create.createCredential', queryParams, payload).subscribe(
      res => {
        console.log(res);
        this.listData = res;
        this.botID = res.bots[0];
        // this.slider = this.slider + 1;
        // if (this.slider == 3 && this.existingCredential) {
        //   this.slider = 3
        // }

        this.notificationService.notify('Created Successfully', 'success');
        this.closeModalPopup();
        this.getCredential();

      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          // this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  getCredential() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }
    this.service.invoke('get.credential', queryParams).subscribe(
      res => {
        this.channnelConguired = res.apps;
        this.firstlistData = res.apps[0]; 
        let scopeObj = []
        this.channnelConguired['customScopeObj'] =[];  
        this.channnelConguired.forEach(element => {
        this.channnelConguired['customScopeObj'].push(element.scope[2].scopes)
        scopeObj.push(element.scope[2].scopes)
       });
       let parentArr = []
       scopeObj.forEach(element => {
        //  let arr = [];
        element['arr']=[]
         element.forEach(childElement => {
           this.scopeList.forEach(scopeElement => {
            let tooltipObj : any = {}
            if(childElement == scopeElement.title){
              tooltipObj['scopeTitle'] = scopeElement.title,
               tooltipObj['scopeDesc'] = scopeElement.desc
               element['arr'].push(tooltipObj) 
            }
          });
         });
        //  parentArr.push() 
       });
        this.channnelConguired.forEach((elementChannel, index) => {
          elementChannel['customScopeObj'] = [];
          scopeObj.forEach((elementScope , childIndex) => {
            if(index == childIndex){
              elementChannel['customScopeObj'].push(elementScope)  
            }
           
          });
        });



















        // comment old code
        const uniqueValuesSet = new Set();
        // this.scopeList.forEach(element => {
          // this.channnelConguired.forEach(scopeData => {
          //   if(scopeData.scope[2] && scopeData.scope[2].scopes){
          //     // scopeData.scope[2]['scopesObj'] = [];
          //     scopeData.scope[2].scopes.forEach(eachScope => {
          //       this.scopeList.forEach(element => {
          //       let tooltipObj : any = {}
          //     if(element.title == eachScope){
          //         tooltipObj['scopeTitle'] = element.title,
          //         tooltipObj['scopeDesc'] = element.desc
          //         scopeObj.push(tooltipObj)
          //       }
          //       // const filteredArr = scopeObj.filter((obj) => {
          //       //   const isPresentInSet = uniqueValuesSet.has(obj.scopeTitle);
          //       //   uniqueValuesSet.add(obj.scopeTitle);
          //       //   uniqueValuesSet.add(obj.scopeDesc);
          //       //   return !isPresentInSet;
          //       // });
          //       scopeData.scope[2]['scopesObj'] = [...scopeObj]
          //     });
          //     });      
          //   }
          // });         
      // });
          
        // this.firstlistData.lastModifiedOn = moment(this.firstlistData.lastModifiedOn).format('MM/DD/YYYY - hh:mmA');
        // var moment = require('moment/moment');
        // if (this.channnelConguired.apps.length > 0) {
        //   this.existingCredential = true;
        // }

        console.log('$$$$$$$$$',this.channnelConguired)
        if (res.length > 0) {
          this.loadingContent = false;
          this.loadingContent1 = true;
        }
        else {
          this.loadingContent1 = true;
        }
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
  configureCredential() {
    const queryParams = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    }
    let payload = {
      type: 'rtm',
      name: 'Web / Mobile Client',
      app: {
        clientId: this.listData.clientId,
        appName: this.listData.appName,
      },
      isAlertsEnabled: this.isAlertsEnabled,
      enable: this.channelEnabled,
      sttEnabled: false,
      sttEngine: 'kore'
    }

    this.service.invoke('configure.credential', queryParams, payload).subscribe(
      res => {
        this.slider = 0;

        this.notificationService.notify('Credential Configuered', 'success');
        // this.standardPublish();
        console.log(res);
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
  stopPropagationOfViewDetails(event){
    if(document.getElementById('viewDetails')){
      event.stopPropagation();
    }
  }
  deleteCredential(data) {
    const channelName= this.firstlistData.appName
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'autox',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete?',
        body: ' Selected credential will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const quaryparms: any = {
            userId: this.authService.getUserId(),
            streamId: this.selectedApp._id,
            appId: data.clientId,
          }
          const payload ={
            "ignoreScopesCheck": true
            }

          this.service.invoke('delete.credential', quaryparms,payload).subscribe(res => {
            this.getCredential();
            dialogRef.close();
            this.notificationService.notify('Deleted Successfully', 'success');

          }, (errors) => {
            if (errors && errors.error && errors.error.errors.length && errors.error.errors[0] && errors.error.errors[0].code && errors.error.errors[0].code == 409) {
              this.notificationService.notify('This app is currently associated with' + ' ' + channelName +'.'+ ' '+ 'Please remove the association and retry.' , 'error');
              dialogRef.close();//errors.error.errors[0].msg
            }
            else {
              this.notificationService.notify('Deleted Successfully', 'error');
            }
          });
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  };
  toggleSearch() {

    if (this.showSearch && this.searchcredential) {
      this.searchcredential = '';
    }
    this.showSearch = !this.showSearch


  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchcredential = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
 
  getApiScopes(){
    const queryParams = {
    seed_data :  {
        "_id" : "seed_data_id",
        "__v" : 0.0,
        "appScopes" : [
        {
        "scope" : "ingest_data",
        "description" : {
        "en" : "Assign this scope to allow data ingestion into findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Ingest Data",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "train",
        "description" : {
        "en" : "Assign this scope to allow training data for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Train",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "live_search",
        "description" : {
        "en" : "Assign this scope to allow live search on data for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Live Search",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "full_search",
        "description" : {
        "en" : "Assign this scope to allow full search on data for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Live Search",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "update_permission",
        "description" : {
        "en" : "Assign this scope to allow updating permissions for findly application integration with workspace.ai",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Update Permission",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "view_faqs",
        "description" : {
        "en" : "Assign this scope to allow viewing extracted FAQs for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "View FAQs",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "structured_data:get",
        "description" : {
        "en" : "Assign this scope to allow viewing extracted structured data for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "View Structured Data",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "structured_data:update",
        "description" : {
        "en" : "Assign this scope to allow updating structured data using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Update Structured Data",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "structured_data:delete",
        "description" : {
        "en" : "Assign this scope to allow deleting structured data using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Delete Structured Data",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "create_fields",
        "description" : {
        "en" : "create fields API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Create Fields",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "get_fields",
        "description" : {
        "en" : "Get fields API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Get Fields",
        "parentName" : "",
        "isMandatory" : false
        }
        ],
        "adminAppScopes" : [
        {
        "scope" : "ingest_data",
        "description" : {
        "en" : "Assign this scope to allow data ingestion into findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Ingest Data",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "train",
        "description" : {
        "en" : "Assign this scope to allow training data for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Train",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "live_search",
        "description" : {
        "en" : "Assign this scope to allow live search on data for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Live Search",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "full_search",
        "description" : {
        "en" : "Assign this scope to allow full search on data for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Live Search",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "update_permission",
        "description" : {
        "en" : "Assign this scope to allow updating permissions for findly application integration with workspace.ai",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Update Permission",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "view_faqs",
        "description" : {
        "en" : "Assign this scope to allow viewing extracted FAQs for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "View FAQs",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "structured_data:get",
        "description" : {
        "en" : "Assign this scope to allow viewing extracted structured data for a findly application using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "View Structured Data",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "structured_data:update",
        "description" : {
        "en" : "Assign this scope to allow updating structured data using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Update Structured Data",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "structured_data:delete",
        "description" : {
        "en" : "Assign this scope to allow deleting structured data using secured APIs",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Delete Structured Data",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "create_fields",
        "description" : {
        "en" : "create fields API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Create Fields",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "update_rules",
        "description" : {
        "en" : "Update rules API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Update rules",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "get_fields",
        "description" : {
        "en" : "Get fields API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Get Fields",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "create_rules",
        "description" : {
        "en" : "Create rules API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Create Rules",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "create_weights",
        "description" : {
        "en" : "Create weights API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Create weights",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "create_findly_app",
        "description" : {
        "en" : "Create findly app API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Create findly app",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "update_indexpipeline",
        "description" : {
        "en" : "update index pipeline API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Update indexpipeline",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "advanced_search",
        "description" : {
        "en" : "Advanced Search API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Advanced Search",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "get_status",
        "description" : {
        "en" : "Status API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Status",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "view_datasourcegroups",
        "description" : {
        "en" : "view dataSourceGroups API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Get dataSourceGroups",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "edit_datasourcegroups",
        "description" : {
        "en" : "Edit dataSourceGroups API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Edit dataSourceGroups",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "view_sources",
        "description" : {
        "en" : "view sources API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "View Sources",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "edit_sources",
        "description" : {
        "en" : "Edit sources API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Edit Sources",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "view_contents",
        "description" : {
        "en" : "View Contents API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "View Contents",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "create_datasourcegroup",
        "description" : {
        "en" : "Create data source group API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Create data source group",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "edit_contents",
        "description" : {
        "en" : "Edit contents API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Edit contents",
        "parentName" : "",
        "isMandatory" : false
        },
        {
        "scope" : "get_indexpipelines",
        "description" : {
        "en" : "Get Index Pipelines API",
        "de" : "",
        "es" : "",
        "fr" : ""
        },
        "displayName" : "Get Index Pipelines",
        "parentName" : "",
        "isMandatory" : false
        }
        ]
        }
    }
    this.service.invoke('get.apiScopes', queryParams).subscribe(
      res => {
        this.credentials = res;
        console.log(res)
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
  copy(val, elementID?) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notificationService.notify('Copied to clipboard', 'success')

  }
}
// getLinkedBot() {
//   const queryParams = {
//     userId: this.authService.getUserId(),
//     streamId: this.selectedApp._id
//   }

//   this.service.invoke('get.linkedBot', queryParams).subscribe(
//     res => {
//       if (res.configuredBots) this.configuredBot_streamId = res.configuredBots[0]._id
//       console.log(res);
//     },
//     errRes => {
//       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
//         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
//       } else {
//         this.notificationService.notify('Failed to get LInked BOT', 'error');
//       }
//     }
//   );
// }


