import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
  facetModalRef: any;
  facets: any = [];
  fieldAutoSuggestion: any = [];
  selectedApp;
  serachIndexId;
  fieldDataType = 'number';
  filedTypeShow = false;
  indexPipelineId;
  loadingContent = true;
  addEditFacetObj: any = null;
  showSearch;
  // serachTraits: any = '';
  searchfacet: any = '';
  facetDefaultValueObj: any = {
    facet: {
      fieldId: '',
      facetName: '',
      facetType: 'value',
      isMultiSelect: false,
      isFacetActive: true,
      facetValue: {},
    },
    range: {
      rangeName: '',
      from: '',
      to: ''
    },
    value: {
      size: 0,
      orderKey: 'count',
      asc: true
    }
  }
  selcectionObj: any = {
    selectAll: false,
    selectedItems: [],
  };
  fieldWarnings: any = {
    NOT_INDEXED: 'Associated field is not indexed',
    NOT_EXISTS: 'Associated field has been deleted'
  }
  dummyCount = 0;
  selectedField;
  queryPipelineId;
  subscription: Subscription;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  members: string[] = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private appSelectionService: AppSelectionService,
    public authService: AuthService
  ) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }
  @ViewChild('facetModalPouup') facetModalPouup: KRModalComponent;
  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.loadfacets();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
      this.loadfacets();
    })
    this.getFieldAutoComplete('');
    this.getUserInfo();
    this.getRoleMembers();
  }
  loadfacets() {
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : this.selectedApp.searchIndexes[0].queryPipelineId;
    if (this.queryPipelineId) {
      this.getFacts();
    }
  }
  getType(name) {
    if (typeof name === 'number') {
      return 'Number';
    } else {
      return 'String';
    }
  }
  checkUncheckfacets(facet) {
    const selectedElements = $('.selectEachfacetInput:checkbox:checked');
    const allElements = $('.selectEachfacetInput');
    if (selectedElements.length === allElements.length) {
      $('#selectAllFacets')[0].checked = true;
    } else {
      $('#selectAllFacets')[0].checked = false;
    }
    const element = $('#' + facet._id);
    const addition = element[0].checked
    this.addRemovefacetFromSelection(facet._id, addition);
  }
  selectAll(unselectAll?) {
    const allfacets = $('.selectEachfacetInput');
    if (allfacets && allfacets.length) {
      $.each(allfacets, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = unselectAll ? false : this.selcectionObj.selectAll;
          const facetId = $(element)[0].id
          this.addRemovefacetFromSelection(facetId, $(element)[0].checked);
        }
      });
    };
    if (unselectAll) {
      $('#selectAllFacets')[0].checked = false;
    }
  }
  addRemovefacetFromSelection(facetId?, addtion?, clear?) {
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
      if (facetId) {
        if (addtion) {
          this.selcectionObj.selectedItems[facetId] = {};
        } else {
          if (this.selcectionObj.selectedItems[facetId]) {
            delete this.selcectionObj.selectedItems[facetId]
          }
        }
      }
      this.selcectionObj.selectedCount = Object.keys(this.selcectionObj.selectedItems).length;
    }
  }
  createNewFacet() {
    this.addEditFacetObj = JSON.parse(JSON.stringify(this.facetDefaultValueObj.facet));
    if (this.selectedField && this.selectedField.fieldDataType) {
      this.selectedField.fieldDataType = null;
    }
    if (this.rolesList.length === 0) {
      this.getRoles();
    }
    this.openModal();
  }
  resetDefaults() {
    this.facetDefaultValueObj = {
      facet: {
        fieldId: '',
        facetName: '',
        facetType: 'value',
        isMultiSelect: false,
        facetValue: {},
      },
      range: {
        rangeName: '',
        from: '',
        to: ''
      },
      value: {
        size: 0,
        orderKey: 'count',
        asc: true
      }
    }
  }
  getFieldAutoComplete(query) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.fieldAutoSuggestion = res || [];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
    if (!query) {
      this.fieldDataType = 'number';
      this.filedTypeShow = false;
    } else {
      this.filedTypeShow = true;
    }
  }
  switchType(type) {
    if (type === 'value') {
      if (this.addEditFacetObj.facetRange) {
        delete this.addEditFacetObj.facetRange;
      }
      this.addEditFacetObj.facetValue = {};
    } else {
      if (this.addEditFacetObj.facetValue) {
        delete this.addEditFacetObj.facetValue;
      }
      this.addEditFacetObj.facetRange = [];
    }
    this.addEditFacetObj.facetType = type;
  }
  removeRange(index) {
    this.addEditFacetObj.facetRange.splice(index, 1);
  }
  addFiled(facet?) {
    if (this.addEditFacetObj.facetType === 'value') {
      if (this.addEditFacetObj.facetRange) {
        delete this.addEditFacetObj.facetRange;
      }
      if (!this.addEditFacetObj.facetValue) {
        this.addEditFacetObj.facetValue = {};
      }
    } else {
      if (this.addEditFacetObj.facetValue) {
        delete this.addEditFacetObj.facetValue;
      }
      if (!this.addEditFacetObj.facetRange) {
        this.addEditFacetObj.facetRange = [];
      }
      if (this.facetDefaultValueObj.range.rangeName) {
        this.addEditFacetObj.facetRange.push(JSON.parse(JSON.stringify(this.facetDefaultValueObj.range)));
      }
    }
    this.resetDefaults();
  }
  getFieldData(fieldId) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      fieldId,
    };
    this.service.invoke('get.getFieldById', quaryparms).subscribe(res => {
      this.addEditFacetObj.fieldName = res.name;
    }, errRes => {
    });
  }
  getFacts(offset?) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      offset: offset || 0,
      limit: 100
    };
    this.service.invoke('get.allFacets', quaryparms).subscribe(res => {
      this.facets = res || [];
      this.loadingContent = false;
      this.addRemovefacetFromSelection(null, null, true);
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get facets');
    });
  }
  selectField(suggesition) {
    this.selectedField = suggesition;
    this.fieldDataType = suggesition.fieldDataType;
    this.filedTypeShow = true;
    if (suggesition.fieldId) {
      this.addEditFacetObj.fieldId = suggesition.fieldId;
      this.selectedField.fieldId = suggesition.fieldId;
    } else {
      this.addEditFacetObj.fieldId = suggesition._id;
      this.selectedField.fieldId = suggesition._id;
    }
    this.addEditFacetObj.fieldName = suggesition.fieldName
  }
  deleteFacets(member?, bulk?) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Do you really want to remove?',
        body: 'Selected member will be removed from this app',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }],
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
    console.log("this.membersList", this.membersList);
    const facets = Object.keys(this.selcectionObj.selectedItems);
    let users = [];
    for (let i = 0; i < this.membersList.length; i++) {
      if (!facets.includes(this.membersList[i]._id)) {
        users.push({ userId: this.membersList[i]._id, roleId: this.membersList[i].roleInfo[0].role === 'Member' ? this.membersList[i].roleInfo[0]._id : this.member_ownerId[0]._id });
      }
    }
    console.log("users", users)
    this.updateMember(users);
  }
  //delete single member
  deleteFacet(member, dialogRef) {
    let users = [];
    for (let i in this.membersList) {
      if (this.membersList[i]._id !== member._id)
        users.push({ userId: this.membersList[i]._id, roleId: this.membersList[i].roleInfo[0].role === 'Member' ? this.membersList[i].roleInfo[0]._id : this.member_ownerId[0]._id });
    }
    this.updateMember(users);
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
  addOrUpdate() {
    this.addFiled();
    if (this.addEditFacetObj && this.addEditFacetObj._id) {

    }
  }
  openModal() {
    this.facetModalRef = this.facetModalPouup.open();
  }
  closeModal() {
    if (this.facetModalRef && this.facetModalRef.close) {
      this.facetModalRef.close();
    }
    this.resetDefaults();
    this.addEditFacetObj = null;
    this.members = [];
  }
  toggleSearch() {
    if (this.showSearch && this.searchfacet) {
      this.searchfacet = '';
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
      console.log("res teamRole", res)
      this.membersList = res.users;
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
      console.log("member_roleId", this.member_roleId[0]._id)
    }, errRes => {
    });
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.members.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
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
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
  //add member
  addMember() {
    let users = [];
    for (let i in this.membersList) {
      users.push({ userId: this.membersList[i]._id, roleId: this.membersList[i].roleInfo[0].role === 'Member' ? this.membersList[i].roleInfo[0]._id : this.member_ownerId[0]._id });
    }
    for (let i in this.members) {
      users.push({ emailId: this.members[i], roleId: this.member_roleId[0]._id })
    }
    this.updateMember(users);
  }
  //update member method
  updateMember(users) {
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
    console.log("queryparms", payload);
    this.service.invoke('put.members', quaryparms, payload, Headers).subscribe(res => {
      console.log("res", res);
      this.closeModal();
      this.getRoleMembers();
      this.notificationService.notify("Share app link sent to email successfully", 'success');
    }, errRes => {
    });
  }
}