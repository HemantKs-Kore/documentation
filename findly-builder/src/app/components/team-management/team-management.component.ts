import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import * as _ from 'underscore';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '@kore.services/auth.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
declare const $: any;
@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent implements OnInit {
  teamModalRef: any;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  loadingContent = true;
  showSearch;
  // serachTraits: any = '';
  searchteam: any = '';
  selcectionObj: any = {
    selectAll: false,
    selectedItems: [],
  };
  dummyCount = 0;
  selectedField;
  queryPipelineId;
  subscription: Subscription;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  teamCtrl = new FormControl();
  members: any[] = [];
  allMembers: string[] = [];
  allMembersCount: number;
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('teamModalPouup') teamModalPouup: KRModalComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private appSelectionService: AppSelectionService,
    public authService: AuthService
  ) {
  }
  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.getUserInfo();
    this.getRoleMembers();
  }
  checkUncheckTeam(team) {
    const selectedElements = $('.selectEachfacetInput:checkbox:checked');
    const allElements = $('.selectEachfacetInput');
    if (selectedElements.length === allElements.length) {
      $('#selectAllFacets')[0].checked = true;
    } else {
      $('#selectAllFacets')[0].checked = false;
    }
    const element = $('#' + team._id);
    const addition = element[0].checked
    this.addRemovefacetFromSelection(team._id, addition);
  }
  selectAllFromPartial() {
    this.selcectionObj.selectAll = true;
    $('#selectAllFacets')[0].checked = true;
    this.selectAll();
  }
  selectAll(unselectAll?) {
    const allfacets = $('.selectEachfacetInput');
    if (allfacets && allfacets.length) {
      $.each(allfacets, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = unselectAll ? false : this.selcectionObj.selectAll;
          const teamId = $(element)[0].id
          this.addRemovefacetFromSelection(teamId, $(element)[0].checked);
        }
      });
    };
    if (unselectAll) {
      $('#selectAllFacets')[0].checked = false;
    }
  }
  addRemovefacetFromSelection(teamId?, addtion?, clear?) {
    if (clear) {
      const allfacets = $('.selectEachfacetInput');
      $.each(allfacets, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = false;
        }
      });
      this.selcectionObj.selectedItems = {};
      this.selcectionObj.selectedCount = 0;
      this.selcectionObj.selectAll = false;
    } else {
      if (teamId) {
        if (addtion) {
          this.selcectionObj.selectedItems[teamId] = {};
        } else {
          if (this.selcectionObj.selectedItems[teamId]) {
            delete this.selcectionObj.selectedItems[teamId]
          }
        }
      }
      this.selcectionObj.selectedCount = Object.keys(this.selcectionObj.selectedItems).length;
      if (this.allMembersCount == this.selcectionObj.selectedCount) {
        this.selcectionObj.selectAll = true;
      }
    }
  }
  createNewMember() {
    this.openModal();
  }
  deleteFacets(member?, bulk?) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Are you sure you want to remove?',
        body: 'Selected member will be removed from this app',
        buttons: [{ key: 'yes', label: 'Remove', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          if (bulk) {
            this.deleteBulkFacet(dialogRef);
          } else if (member) {
            this.deleteFacet(member, dialogRef);
          }
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  //delete multiple members
  deleteBulkFacet(dialogRef) {
    const teams = Object.keys(this.selcectionObj.selectedItems);
    let users = [];
    for (let i = 0; i < this.membersList.length; i++) {
      if (!(teams.includes(this.membersList[i]._id))) {
        users.push({ userId: this.membersList[i]._id, roleId: this.membersList[i].roleInfo[0].role === 'Member' ? this.membersList[i].roleInfo[0]._id : this.member_ownerId[0]._id });
      }
    }
    this.updateMember(users, dialogRef, 'delete');
  }
  //delete single member
  deleteFacet(member, dialogRef) {
    let users = [];
    for (let i in this.membersList) {
      if (this.membersList[i]._id !== member._id)
        users.push({ userId: this.membersList[i]._id, roleId: this.membersList[i].roleInfo[0].role === 'Member' ? this.membersList[i].roleInfo[0]._id : this.member_ownerId[0]._id });
    }
    console.log("users", users)
    this.updateMember(users, dialogRef, 'delete');
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
  openModal() {
    this.teamModalRef = this.teamModalPouup.open();
  }
  closeModal() {
    if (this.teamModalRef && this.teamModalRef.close) {
      this.teamModalRef.close();
    }
    this.members = [];
  }
  toggleSearch() {
    if (this.showSearch && this.searchteam) {
      this.searchteam = '';
    }
    this.showSearch = !this.showSearch
  };
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  // userinfo method
  orgId: string;
  accountId: string;
  getUserInfo() {
    const quaryparms: any = {
      id: this.authService.getUserId()
    };
    this.service.invoke('get.userinfo', quaryparms).subscribe(res => {
      console.log("res team", res)
      this.orgId = res[0].orgId;
      this.accountId = res[0].accountId;
    }, errRes => {
    });
  }

  //get members method
  membersList: any = [];
  getRoleMembers() {
    const quaryparms: any = {
      id: this.authService.getUserId(),
      streamId: this.selectedApp._id
    };
    this.service.invoke('get.members', quaryparms).subscribe(res => {
      this.membersList = res.users;
      this.allMembersCount = this.membersList.length - 1;
      this.getRoles();
    }, errRes => {
    });
  }
  //get list of roles
  rolesList: any = [];
  member_roleId;
  member_ownerId
  getRoles() {
    const Headers = { accountid: this.accountId };
    const quaryparms: any = {
      id: this.authService.getUserId(),
      streamId: this.selectedApp._id,
      orgId: this.orgId
    };
    this.service.invoke('get.roles', quaryparms, Headers).subscribe(res => {
      console.log("res roles", res)
      this.rolesList = res;
      this.member_roleId = this.rolesList.filter(data => data.role === "Member");
      this.member_ownerId = this.rolesList.filter(data => data.role === "Owner");
      this.loadingContent = false;
    }, errRes => {
    });
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      if (this.validateEmail(value)) {
        this.members.push({ value: value.trim(), invalid: false });
      }
      else {
        this.members.push({ value: value.trim(), invalid: true });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.teamCtrl.setValue(null);
  }

  remove(member: string): void {
    const index = this.members.indexOf(member);

    if (index >= 0) {
      this.members.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.members.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.teamCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allMembers.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
  //add member
  addMember() {
    if (this.members.length !== 0) {
      let users = [];
      for (let i in this.membersList) {
        users.push({ userId: this.membersList[i]._id, roleId: this.membersList[i].roleInfo[0].role === 'Member' ? this.membersList[i].roleInfo[0]._id : this.member_ownerId[0]._id });
      }
      const validateEmail = this.members.every(e => e.invalid === false);
      if (validateEmail) {
        for (let i in this.members) {
          users.push({ emailId: this.members[i].value, roleId: this.member_roleId[0]._id })
        }
        this.updateMember(users);
      }
      else {
        this.notificationService.notify("Please correct the email address and try again.", 'error');
      }
    }
    else {
      this.notificationService.notify("Please enter the email address and try again.", 'error');
    }
  }
  //update member method
  updateMember(users, dialogref?, type?) {
    let payload = {
      "codevelopers": {
        "users": users,
        "groups": []
      }
    }
    const Headers = { accountid: this.accountId };
    const quaryparms: any = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id
    };
    this.service.invoke('put.members', quaryparms, payload, Headers).subscribe(res => {
      if (type !== 'delete') {
        this.closeModal();
        this.notificationService.notify("Share app link sent to email successfully", 'success');
      }
      else {
        dialogref.close();
        this.selcectionObj = {
          selectAll: false,
          selectedItems: [],
        };
        this.notificationService.notify("Member deleted successfully", 'success');
      }
      this.getRoleMembers();
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed', 'error');
      }
    });
  }
  //validate email in mat-chip
  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}