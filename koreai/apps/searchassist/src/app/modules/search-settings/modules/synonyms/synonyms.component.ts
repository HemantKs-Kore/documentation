import { EMPTY_SCREEN } from './../../../empty-screen/empty-screen.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'underscore';
import { Observable, Subscription } from 'rxjs';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { AuthService } from '@kore.apps/services/auth.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { InlineManualService } from '@kore.apps/services/inline-manual.service';
import { ConfirmationDialogComponent } from '@kore.apps/helpers/components/confirmation-dialog/confirmation-dialog.component';
declare const $: any;

@Component({
  selector: 'app-synonyms',
  templateUrl: './synonyms.component.html',
  styleUrls: ['./synonyms.component.scss'],
})
export class SynonymsComponent implements OnInit, OnDestroy {
  emptyScreen = EMPTY_SCREEN.INDICES_SYNONYMS;
  loadImageText = false;
  loadingContent1: boolean;
  selectedApp: any = {};
  synonymSearch: any = '';
  showSearch = false;
  synonyms: any = [];
  synonymDropdownTypeArr: any = [];
  serachIndexId;
  loadingContent = true;
  skip = 0;
  timeoutId: any;
  filteroneWaySynonym: boolean;
  filterSynonym: boolean;
  haveRecord = false;
  currentEditIndex: any = -1;
  editIndex: any = -1;
  pipeline;
  showFlag;
  totalRecord = 0;
  synonymData: any[] = [];
  synonymDuplicateData = [];
  synonymArr: any = [];
  synonymTypeArr$: Observable<any[]>;
  synonymGet: any = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  queryPipelineId;
  editSubmitted = false;
  // showSynonym:boolean
  indexPipelineId;
  isAsc = true;
  selectedSort = 'type';
  checksort = 'asc';
  searchKeyword: any;
  filterType: any = '';
  displaySearch = false;
  newSynonymObj: any = {
    type: 'synonym',
    addNew: false,
    values: [],
  };
  addNewSynonymObj: any = {
    type: 'synonym',
    synonyms: [],
  };
  editSynonymObj: any = {};
  activeClose = false;
  selectedFilter: any;
  createFromScratch: any;
  synonymObj;
  filterSystem: any = {
    typefilter: 'all',
  };
  sortedObject = {
    type: 'fieldName',
    position: 'up',
    value: 1,
  };
  filterObject = {
    type: 'all',
    header: '',
  };
  // synonym;
  // showoneWaySynonym:boolean;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  synArr: any[] = [];
  synArrTemp: any[] = [];
  subscription: Subscription;
  componentType = 'configure';
  submitted = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private appSelectionService: AppSelectionService,
    public inlineManual: InlineManualService
  ) {
    this.synonymObj = new SynonymClass();
  }

  ngOnInit() {
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.loadSynonyms();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(
      (res) => {
        this.loadSynonyms();
      }
    );
  }

  imageLoad() {
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
    if (!this.inlineManual.checkVisibility('SYNONYMS')) {
      this.inlineManual.openHelp('SYNONYMS');
      this.inlineManual.visited('SYNONYMS');
    }
  }
  loadSynonyms() {
    this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()?._id
        : this.selectedApp.searchIndexes[0]?.queryPipelineId;
      if (this.queryPipelineId) {
        this.getSynonyms();
      }
    }
  }
  paginate(event) {
    this.skip = event.skip;
    // this.getFileds(event.skip, this.searchFields)
  }
  synonymChanged() {
    this.addNewSynonymObj.values = [];
    this.synonymObj.synonyms = [];
    this.addNewSynonymObj.keyword = [];
  }
  errorToaster(errRes, message) {
    if (
      errRes &&
      errRes.error &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  removeList(syn, synonymId, i) {
    const synonyms = [...this.synonymData];
    const index = synonyms[i].values.indexOf(syn);
    if (index >= 0) {
      synonyms[i].values.splice(index, 1);
    }
  }
  toggleSearch() {
    if (this.showSearch && this.synonymSearch) {
      this.synonymSearch = '';
    }
    this.showSearch = !this.showSearch;
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.synonymSearch = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100);
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }

  //-------------------------(Author:BHARADWAJ)
  checkDuplicateTags(suggestion: string, alltTags): boolean {
    return alltTags.every((f) => f !== suggestion);
  }
  add(event: MatChipInputEvent, type) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      const synObj =
        type == 'add'
          ? this.addNewSynonymObj.synonyms
          : this.editSynonymObj.synonyms;
      if (!this.checkDuplicateTags((value || '').trim(), synObj)) {
        this.notificationService.notify(
          'Duplicate tags are not allowed',
          'warning'
        );
        return;
      } else {
        type == 'add'
          ? this.addNewSynonymObj.synonyms.push(value.trim())
          : this.editSynonymObj.synonyms.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  //VALIDATION FOR SYNONYM
  getSynonyms() {
    this.loadingContent = true;
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      code: 'en',
      sortField: this.selectedSort ? this.selectedSort : 'type',
      orderType: this.checksort ? this.checksort : 'asc',
      searchKey: this.searchKeyword ? this.searchKeyword : '',
      synonymType: this.filterType ? this.filterType : '',
    };
    this.service.invoke('get.synonyms', quaryparms).subscribe(
      (res) => {
        if (res && res.data) {
          this.synonymData = res.data;
          this.synonymDuplicateData = res?.data;
          this.loadingContent = false;
        }
      },
      (errRes) => {
        this.loadingContent = false;
        this.errorToaster(errRes, 'Failed to get Synonyms');
      }
    );
  }
  debouncedSearch() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.searchKeyword = this.synonymSearch;
      this.getSynonyms();
    }, 300);
  }
  validateSynonyms() {
    if (
      this.addNewSynonymObj?.type === 'oneWaySynonym' &&
      !this.addNewSynonymObj?.keyword &&
      !this.addNewSynonymObj?.synonyms?.length
    ) {
      return false;
    } else if (
      this.addNewSynonymObj?.type === 'synonym' &&
      !(this.addNewSynonymObj?.synonyms.length > 1)
    ) {
      return false;
    } else {
      return true;
    }
  }
  //SELECTING SYNONYMN TYPE
  changeSynonymType() {
    this.addNewSynonymObj.synonyms = [];
    this.synonymObj.synonyms = [];
    this.addNewSynonymObj.keyword = '';
    this.submitted = false;
  }
  addSynonym() {
    this.submitted = true;
    if (this.validateSynonyms()) {
      const obj: any = {
        type: this.addNewSynonymObj.type,
        synonyms: this.addNewSynonymObj.synonyms,
      };
      if (this.addNewSynonymObj.type === 'oneWaySynonym') {
        if (
          !(
            this.addNewSynonymObj.synonyms &&
            this.addNewSynonymObj.synonyms.length
          )
        ) {
          this.notificationService.notify('Synonyms cannot be empty', 'error');
          return;
        }
        if (!this.addNewSynonymObj.keyword) {
          this.notificationService.notify('Please enter keyword', 'error');
          return;
        } else {
          obj.keyword = this.addNewSynonymObj.keyword;
        }
      }
      if (this.addNewSynonymObj.type === 'oneWaySynonym') {
        this.filteroneWaySynonym = true;
      } else if (this.addNewSynonymObj.type === 'synonym') {
        this.filterSynonym = true;
      }
      this.addOrUpddate(obj, 'add');
    } else if (
      this.addNewSynonymObj?.type === 'synonym' &&
      this.addNewSynonymObj?.synonyms.length === 1
    ) {
      this.notificationService.notify(
        'Synonyms should be more than one',
        'warning'
      );
    } else {
      this.notificationService.notify(
        'Enter the required fields to proceed',
        'error'
      );
    }
  }
  addOrUpddate(synonymData, type, dialogRef?) {
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      synonymId: synonymData._id,
    };
    const payload: any = {
      languageCode: 'en',
      type: synonymData.type,
      keyword: synonymData.keyword,
      synonyms: synonymData.synonyms,
    };
    let url: any = '';
    if (synonymData.type == 'synonym') delete payload.keyword;
    url = type == 'add' ? 'put.addSynonym' : 'put.EditSynonym';
    this.service.invoke(url, quaryparms, payload).subscribe(
      (res) => {
        this.getSynonyms();
        this.editIndex = -1;
        this.submitted = false;
        if (type == 'add') this.addNewSynonymObj.synonyms = [];
        if (synonymData.type == 'oneWaySynonym')
          this.addNewSynonymObj.keyword = [];
        if (dialogRef && dialogRef.close) {
          dialogRef.close();
        }
        this.notificationService.notify(
          'Synonym Added Successfully',
          'success'
        );
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed To Add Synonym');
      }
    );
  }
  remove(syn, type) {
    const index =
      type == 'add'
        ? this.addNewSynonymObj.synonyms.indexOf(syn)
        : this.editSynonymObj.synonyms.indexOf(syn);
    if (index >= 0 && type == 'add') {
      this.addNewSynonymObj.synonyms.splice(index, 1);
    } else {
      this.editSynonymObj.synonyms.splice(index, 1);
    }
  }
  deleteSynonymnConfirmationPopUp(synonym, index) {
    const dialogRef: any = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected Synonym group will be deleted.',
        buttons: [
          { key: 'yes', label: 'Delete', type: 'danger' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });

    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        if (this.showFlag === true) {
          this.deleteSynonymn(synonym, index, dialogRef);
        }
      } else if (result === 'no') {
        dialogRef.close();
        // console.log('deleted')
      }
    });
  }
  deleteSynonymn(synonym, index, dialogRef) {
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      synonymId: synonym._id,
    };
    this.service.invoke('delete.synonymn', quaryparms).subscribe(
      (res) => {
        if (res) {
          this.synonymData.splice(index, 1);
          this.notificationService.notify(
            'Synonym deleted successfully',
            'success'
          );
        }
        if (dialogRef && dialogRef.close) {
          dialogRef.close();
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to delete Synonymn');
      }
    );
  }
  editSynonymn(index, synonymn) {
    this.editIndex = index;
    this.editSynonymObj = this.synonymData[index];
  }
  addEditedSynonym(synonymn) {
    this.editSubmitted = true;
    if (
      !this.editSynonymObj ||
      (this.editSynonymObj.synonyms && !this.editSynonymObj.synonyms.length)
    ) {
      return false;
    } else if (
      this.editSynonymObj.type == 'oneWaySynonym' &&
      !this.editSynonymObj.keyword
    ) {
      return false;
    } else {
      this.addOrUpddate(synonymn, 'edit');
    }
  }
  cancelEdit(index) {
    this.editIndex = null;
    this.getSynonyms();
    // this.editSynonymObj = this.synonymData[index]
  }
  sortByApi(sort) {
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    let naviagtionArrow = '';
    if (this.isAsc) {
      naviagtionArrow = 'up';
      this.checksort = 'asc';
    } else {
      naviagtionArrow = 'down';
      this.checksort = 'desc';
    }
    this.getSynonyms();
  }
  getSortIconVisibility(sortingField: string, type: string, component: string) {
    switch (this.selectedSort) {
      case 'type': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
      }
    }
  }
  filterTable(source, headerOption) {
    switch (headerOption) {
      case 'type': {
        this.filterSystem.typefilter = source;
        break;
      }
    }
    this.filterObject = {
      type: source,
      header: headerOption,
    };
    this.filterType = headerOption;
    this.getSynonyms();
  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : false;
  }
  //-------------------------(Author:BHARADWAJ)
}
class SynonymClass {
  type: string;
  synonyms: Array<string>;
}
