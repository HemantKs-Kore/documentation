import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY_SCREEN } from '../../modules/empty-screen/empty-screen.constants';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { AuthService } from '@kore.apps/services/auth.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';

declare const $: any;
@Component({
  selector: 'app-credentials-list',
  templateUrl: './credentials-list.component.html',
  styleUrls: ['./credentials-list.component.scss'],
})
export class CredentialsListComponent implements OnInit {
  emptyScreen = EMPTY_SCREEN.MANAGE_CREDENTIALS;
  slider = 0;
  showError: boolean = false;
  selectedApp: any;
  serachIndexId: any;
  firstlistData: any;
  params: any = {};
  url: string = '';
  appsData: any = [];
  displayScopes: any = [];
  addCredentialRef: any;
  credentialsListRef: any;
  editCredentialRef: any;
  editCredential: any = {};
  listData: any;
  configuredBot_streamId = '';
  searchcredential = '';
  selectedTab: string = 'configuration';
  credentialsTabs: any = [
    { name: 'Configuration', type: 'configuration' },
    { name: 'API Scopes', type: 'apiScopes' },
  ];
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
    enabled: true,
  };
  scopeDesc;
  selectedScopes = [];
  scopesList = [];
  componentType: string = 'addData';
  @ViewChild('addCredential') addCredential: KRModalComponent;
  @ViewChild('credentialsList') credentialsList: KRModalComponent;
  @ViewChild('editCredentialPop') editCredentialPop: KRModalComponent;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    public authService: AuthService,
    private appSelectionService: AppSelectionService
  ) {}

  ngOnInit(): void {
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    // this.manageCredential();
    this.getApiScopes();
    this.getCredential();
    // this.getLinkedBot();
  }
  jwtAuth(awt) {
    this.credntial.awt = awt;
  }
  loadImageText: boolean = false;
  loadingContent1: boolean;
  loadingContent: boolean;
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
    };
    this.service.invoke('manage.credentials', queryParams).subscribe(
      (res) => {
        this.credentials = res;
        // console.log(res)
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  //open the add popUp
  newCredential() {
    // this.editCredentialRef = this.editCredentialPop.open();
    this.addCredentialRef = this.addCredential.open();
  }
  openCredentialsList(index) {
    this.appsData = this.channnelConguired[index];
    this.credentialsListRef = this.credentialsList.open();
  }
  closeCredentialsList() {
    this.credentialsListRef.close();
  }
  //close the popup
  closeModalPopup() {
    this.selectedTab = 'configuration';
    this.credntial.name = [];
    this.credntial.awt = 'HS256';
    this.addCredentialRef.close();
    this.editTitleFlag = false;
    this.scopesList.forEach((element) => {
      element.isMandatory = false;
    });
  }
  //open the edit popUop
  viewDetails(data) {
    this.addCredentialRef = this.addCredential.open();
    this.editTitleFlag = true;
    this.credntial.name = data.appName;
    this.editCreden.clientSecret = data.clientSecret;
    this.editCreden.clientId = data.clientId;
    if (data && data.scope && data.scope[2]) {
      let selectedScope = data?.scope[2].scopes;
      this.scopesList?.forEach((element) => {
        selectedScope.forEach((data) => {
          if (element.scope == data) {
            element.isMandatory = true;
          }
        });
      });
    }
  }
  //create and edit Credentials
  saveCredential() {
    let scopeArr = [];
    for (let item of this.scopesList) {
      if (item.isMandatory) scopeArr.push(item.scope);
    }
    if (!this.editTitleFlag) {
      this.params = {
        userId: this.authService.getUserId(),
        streamId: this.selectedApp._id,
      };
      this.url = 'create.createCredential';
    } else {
      this.params = {
        userId: this.authService.getUserId(),
        streamId: this.selectedApp._id,
        sdkAppId: this.editCreden.clientId,
      };
      this.url = 'edit.credential';
    }
    const queryParams = this.params;
    const payload = {
      appName: this.credntial.name,
      algorithm: this.credntial.awt,
      pushNotifications: {
        enable: this.credntial.enabled,
        webhookUrl: '',
      },
      bots: [this.selectedApp._id],
      scope: [
        'anonymouschat',
        'registration',
        {
          bot: this.selectedApp._id,
          scopes: scopeArr,
        },
      ],
    };
    this.service.invoke(this.url, queryParams, payload).subscribe(
      (res) => {
        this.getCredential();
        this.closeModalPopup();
      },

      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  //validations
  validateSource() {
    if (
      this.credntial.awt != 'Select Signing Algorithm' &&
      this.credntial.name != ''
    ) {
      this.saveCredential();
    } else {
      if (this.credntial.awt == 'Select Signing Algorithm') {
        $('.dropdown-input').css('border-color', '#DD3646');
        this.notificationService.notify(
          'Enter the required fields to proceed',
          'error'
        );
      }
      if (this.credntial.name == '') {
        $('#addSourceTitleInput').css('border-color', '#DD3646');
        $('#infoWarning1').css({
          top: '58%',
          position: 'absolute',
          right: '1.5%',
          display: 'block',
        });
        this.notificationService.notify(
          'Enter the required fields to proceed',
          'error'
        );
      }
    }

    // if (this.credntial.name) {
    //   this.createCredential()

    // }
  }
  //track changing of input
  inputChanged(type) {
    if (type == 'title') {
      this.credntial.name != ''
        ? $('#infoWarning').hide()
        : $('#infoWarning').show();
      $('#addSourceTitleInput').css(
        'border-color',
        this.credntial.name != '' ? '#BDC1C6' : '#DD3646'
      );
    }
  }
  //changing tabs configuration and API scope
  changeTabs(type) {
    this.selectedTab = type;
  }
  //Adding Scopes
  getScope(index) {
    this.scopesList[index].isMandatory = !this.scopesList[index].isMandatory;
  }
  //credentials List method
  getCredential() {
    const queryParams = {
      userId: this.authService?.getUserId(),
      streamId: this.selectedApp?._id,
    };
    this.service.invoke('get.credential', queryParams).subscribe(
      (res) => {
        //this.getApiScopes();
        this.channnelConguired = res.apps;
        this.firstlistData = res.apps[0];
        this.imageLoad();
        // Scopes code for API Scopes initial //
        // Single Obj Api Scope
        // let resScopeList = [];
        // this.channnelConguired.forEach(appsData => {
        //   appsData['scopeDetails'] = [];
        //   if(appsData && appsData.scope.length){
        //     appsData['scopeDetails'] = appsData.scope[2].scopes
        //   }
        // });
        // console.log(this.scopesList)
        // this.scopesList.forEach(scopeData => {
        //   this.channnelConguired.forEach(chanenelData => {
        //     chanenelData['scopeListDetails'] = [];
        //     let tempList = []
        //     chanenelData.scopeDetails.forEach(channelScopeData => {
        //       if(channelScopeData == scopeData.scope){
        //         tempList.push(scopeData);
        //       }
        //     });
        //     chanenelData['scopeListDetails'].push(tempList)
        //   });
        // });
        // console.log(this.channnelConguired)
        //End
        let scopeObj = [];
        this.channnelConguired['customScopeObj'] = [];
        this.channnelConguired['customScopeObjTitle'] = [];
        this.channnelConguired.forEach((element) => {
          if (element.scope && element.scope[2]) {
            this.channnelConguired['customScopeObj'].push(
              element.scope[2].scopes
            );
            scopeObj.push(element.scope[2].scopes);
          } else {
            scopeObj.push([]);
          }
        });
        scopeObj.forEach((element) => {
          element['arr'] = [];
          element.forEach((childElement) => {
            this.scopesList.forEach((scopeElement) => {
              let tooltipObj: any = {};
              let titleObj: any = {};
              if (childElement == scopeElement.scope) {
                (tooltipObj['scopeTitle'] = scopeElement.displayName),
                  (titleObj['scopeTitle'] = scopeElement.displayName),
                  (tooltipObj['scopeDesc'] = scopeElement.description.en);
                element['arr'].push(tooltipObj);
                this.channnelConguired['customScopeObjTitle'].push(
                  titleObj.scopeTitle
                );
              }
            });
          });
        });
        this.channnelConguired.forEach((elementChannel, index) => {
          elementChannel['customScopeObj'] = [];
          scopeObj.forEach((elementScope, childIndex) => {
            if (index == childIndex) {
              elementChannel['customScopeObj'].push(elementScope);
            }
          });
        });
        console.log(this.channnelConguired);
        // Scopes code for API Scopes end //

        // this.firstlistData.lastModifiedOn = moment(this.firstlistData.lastModifiedOn).format('MM/DD/YYYY - hh:mmA');
        // var moment = require('moment/moment');
        // if (this.channnelConguired.apps.length > 0) {
        //   this.existingCredential = true;
        // }
        if (res.length > 0) {
          this.loadingContent = false;
          this.loadingContent1 = true;
        } else {
          this.loadingContent1 = true;
        }
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
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
      streamId: this.selectedApp._id,
    };
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
      sttEngine: 'kore',
    };

    this.service.invoke('configure.credential', queryParams, payload).subscribe(
      (res) => {
        this.slider = 0;

        this.notificationService.notify('Credential Configuered', 'success');
        // this.standardPublish();
        // console.log(res);
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  stopPropagationOfViewDetails(event) {
    if (document.getElementById('viewDetails')) {
      event.stopPropagation();
    }
  }
  //deleting the credential
  deleteCredential(data) {
    const channelName = this.firstlistData.appName;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'autox',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete?',
        body: ' Selected credential will be deleted.',
        buttons: [
          { key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        const quaryparms: any = {
          userId: this.authService.getUserId(),
          streamId: this.selectedApp._id,
          appId: data.clientId,
        };
        const payload = {
          ignoreScopesCheck: true,
        };

        this.service.invoke('delete.credential', quaryparms, payload).subscribe(
          (res) => {
            this.getCredential();
            dialogRef.close();
            this.notificationService.notify('Deleted Successfully', 'success');
          },
          (errors) => {
            if (
              errors &&
              errors.error &&
              errors.error.errors.length &&
              errors.error.errors[0] &&
              errors.error.errors[0].code &&
              errors.error.errors[0].code == 409
            ) {
              this.notificationService.notify(
                'This app is currently associated with' +
                  ' ' +
                  channelName +
                  '.' +
                  ' ' +
                  'Please remove the association and retry.',
                'error'
              );
              dialogRef.close(); //errors.error.errors[0].msg
            } else {
              this.notificationService.notify('Deleted Successfully', 'error');
            }
          }
        );
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
  }
  toggleSearch() {
    if (this.showSearch && this.searchcredential) {
      this.searchcredential = '';
    }
    this.showSearch = !this.showSearch;
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
    }, 100);
  }
  //getting all the seed data for the scopes.
  getApiScopes() {
    this.service.invoke('get.apiScopes').subscribe(
      (res) => {
        this.scopesList = res;
        this.getCredential();
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
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
    this.notificationService.notify('Copied to clipboard', 'success');
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }

  isEmptyScreenLoading(isLoading) {
    this.loadingContent = isLoading;
  }
}
