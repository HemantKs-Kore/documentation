import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationComponent } from 'src/app/components/annotool/components/confirmation/confirmation.component';
import { debounceTime, map, retryWhen } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { SideBarService } from './../../services/header.service';
import { InlineManualService } from '../../services/inline-manual.service';
import { AppSelectionService } from './../../services/app.selection.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-structured-data',
  templateUrl: './structured-data.component.html',
  styleUrls: ['./structured-data.component.scss']
})
export class StructuredDataComponent implements OnInit {

  addStructuredDataModalPopRef: any;
  selectedSourceType: any;
  availableSources = [
    {
      name: 'Import Structured Data',
      description: 'Import from JSON or CSV',
      icon: 'assets/icons/content/database-Import.svg',
      id: 'contentStucturedDataImport',
      sourceType: 'data',
      resourceType: 'structuredData'
    },
    {
      name: 'Import Structured Data',
      description: 'Add structured data manually',
      icon: 'assets/icons/content/database-add.svg',
      id: 'contentStucturedDataAdd',
      sourceType: 'data',
      resourceType: 'structuredDataManual'
    }
  ];
  structuredDataItemsList: any = [];
  selectedApp: any;
  codeMirrorOptions: any = {
    theme: 'neo',
    mode: "json",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: false,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: false,
    indentUnit: 0,
    readOnly: 'nocursor',
    scrollbarStyle: 'null'
  };
  searchActive: boolean = false;
  searchText: any = '';
  selectedStructuredData: any = [];
  allSelected: boolean = false;
  adwancedSearchModalPopRef: any;
  advancedSearchInput = '';
  appliedAdvancedSearch: any = {};
  advancedSearchOperators = [
    {
      "name": "Exists",
      "value": "exists"
    },
    {
      "name": "Does Not Exist",
      "value": "notexists"
    },
    {
      "name": "Equals to",
      "value": "equals"
    },
    {
      "name": "Not Equals to",
      "value": "notequals"
    }
  ];
  isLoading: boolean = false;
  structuredDataStatusModalRef: any;
  structuredDataDocPayload: any;
  noItems: boolean = false;
  emptySearchResults: boolean = false;
  skip: any;
  page: any;
  totalCount: any;
  defaultView: boolean = true;
  fields: any = [];
  searchField;
  advancedSearch: any = {};
  tempAdvancedSearch: any = {};
  disableContainer: any = false;
  isResultTemplate: boolean = false;
  isResultTemplateLoading: boolean = false;
  serachIndexId: any;
  searchFocusIn = false;
  search: any;
  formatter: any;
  enableSearchBlock: boolean = false;
  indexPipelineId: any;
  subscription: Subscription;
  activeClose = false;
  componentType: string = 'addData';
  @ViewChild('addStructuredDataModalPop') addStructuredDataModalPop: KRModalComponent;
  @ViewChild('advancedSearchModalPop') advancedSearchModalPop: KRModalComponent;
  @ViewChild('structuredDataStatusModalPop') structuredDataStatusModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private modalService: NgbModal,
    public headerService: SideBarService,
    private router: Router, public dialog: MatDialog,
    public inlineManual: InlineManualService,
    private appSelectionService: AppSelectionService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.getStructuredDataList();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map(term => this.searchItems())
      )
    this.loadData();
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.loadData();
    })
  }

  loadData() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.getAllSettings();
    }
  }
  isLoading1: boolean;
  loadImageText: boolean = false;
  imageLoad() {
    this.isLoading = false;
    this.isLoading1 = true;
    this.loadImageText = true;
    if (!this.inlineManual.checkVisibility('ADD_STRUCTURED_DATA_LANDING')) {
      this.inlineManual.openHelp('ADD_STRUCTURED_DATA_LANDING')
      this.inlineManual.visited('ADD_STRUCTURED_DATA_LANDING')
    }
  }
  getStructuredDataList(skip?) {
    this.isLoading = true;
    this.noItems = false;
    this.emptySearchResults = false;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit: 10
    };
    if (skip) {
      quaryparms.skip = skip;
    }
    this.skip = skip;
    this.service.invoke('get.structuredData', quaryparms).subscribe((res: any) => {
      this.isLoading = false;
      this.totalCount = JSON.parse(JSON.stringify(res.total));
      this.selectedStructuredData = [];
      this.allSelected = false;
      if (res.data) {
        this.structuredDataItemsList = res.data;
      }
      else {
        this.structuredDataItemsList = [];
      }
      if (res.length > 0) {
        this.isLoading = false;
        this.isLoading1 = true;
      }
      else {
        this.isLoading1 = true;
      }
      this.structuredDataItemsList.forEach(data => {
        data.objectLength = Object.keys(data._source).length;
        if (data._source) {
          if (data._source.contentType) {
            delete data._source.contentType;
          }
          data.parsedData = JSON.stringify(data._source, null, 1);
        };
      });
      this.designDefaultData(this.structuredDataItemsList);
      if (this.structuredDataItemsList.length == 0) {
        this.noItems = true;
        this.enableSearchBlock = false;
        // if(!this.inlineManual.checkVisibility('ADD_STRUCTURED_DATA_LANDING')){
        //   this.inlineManual.openHelp('ADD_STRUCTURED_DATA_LANDING')
        //   this.inlineManual.visited('ADD_STRUCTURED_DATA_LANDING')
        // }
      }
      else {
        this.enableSearchBlock = true;
        if (!this.inlineManual.checkVisibility('STRUCTURED_DATA_WALKTHROUGH')) {
          this.inlineManual.openHelp('STRUCTURED_DATA_WALKTHROUGH')
          this.inlineManual.visited('STRUCTURED_DATA_WALKTHROUGH')
        }
      }
    }, errRes => {
      console.log("error", errRes);
      this.isLoading = false;
      this.notificationService.notify('Fetching Structured Data has gone wrong.', 'error');
    });
  }

  designDefaultData(structuredDataItemsList) {
    this.defaultView = this.defaultView;
    structuredDataItemsList.forEach((element: any, index) => {
      element.objectValues = [];
      Object.keys(element._source).forEach((key: any, index) => {
        let nested = false;
        if (key && (typeof element._source[key] === 'object')) {
          nested = true;
        }
        else {
          nested = false;
        }
        if (index < 3) {
          // element.objectValues.push({
          //   key : key,
          //   value : nested ? JSON.stringify(element._source[key], null, 2) : element._source[key],
          //   // var str = JSON.stringify(obj, null, 2);
          //   expandedValue : element._source[key],
          //   nested : nested,
          //   expanded : false
          // });

          // console.log("teest", this.getNestedElements(element._source[key]));

          element.objectValues.push({
            key: key,
            value: nested ? this.getNestedElements(element._source[key]) : element._source[key],
            // var str = JSON.stringify(obj, null, 2);
            expandedValue: element._source[key],
            nested: nested,
            expanded: false,
            valuesLength: nested ? (Object.values(element._source[key]).length) : 1
          });
        }
      });
    });
    console.log("structuredDataItemsList", this.structuredDataItemsList);
  }

  getNestedElements(element) {
    let objectValues = [];
    if ((typeof element === 'object'))
      Object.keys(element).forEach((key: any, index) => {
        let nested = false;
        if (key && (typeof element[key] === 'object')) {
          nested = true;
        }
        else {
          nested = false;
        }
        objectValues.push({
          key: key,
          value: nested ? this.getNestedElements(element[key]) : element[key],
          nested: nested,
          expanded: false,
          valuesLength: nested ? (Object.values(element[key]).length) : 1
        });
      });
    return objectValues;
  }

  getFieldAutoComplete(query) {
    if (/^\d+$/.test(this.searchField)) {
      query = parseInt(query, 10);
    }
    const quaryparms: any = {
      searchIndexID: this.selectedApp.searchIndexes[0]._id,
      query,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.fields = res || [];
    }, errRes => {
      this.notificationService.notify('Failed to get fields', 'error');
    })
  }

  selectedField(suggesition, index) {
    console.log("test", suggesition);
    if (this.advancedSearch.rules[index]) {
      this.advancedSearch.rules[index].fieldName = suggesition.fieldName;
    }
  }

  paginate(event) {
    console.log("event", event);
    if (event.skip) {
      this.getStructuredDataList(event.skip);
    }
  }

  editJson(payload, d_index?) {
    this.selectedSourceType = JSON.parse(JSON.stringify(this.availableSources[1]));
    this.selectedSourceType.payload = payload;
    this.selectedSourceType.viewMode = false;
    this.selectedSourceType.allData = [];
    if (d_index || (d_index == 0)) {
      this.selectedSourceType.currentIndex = d_index;
      this.selectedSourceType.allData = this.structuredDataItemsList;
    }
    else {
      this.selectedSourceType.currentIndex = undefined;
    }
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  viewJson(data, index) {
    this.selectedSourceType = JSON.parse(JSON.stringify(this.availableSources[1]));
    this.selectedSourceType.payload = data;
    this.selectedSourceType.viewMode = true;
    this.selectedSourceType.allData = this.structuredDataItemsList;
    this.selectedSourceType.currentIndex = index;
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  openAddStructuredData(key) {
    this.selectedSourceType = this.availableSources.find((s) => { if (s.resourceType === key) { return s } });
    console.log("this.selectedSourceType", this.selectedSourceType);
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
    if (this.selectedSourceType.id == "contentStucturedDataImport") {
      if (!this.inlineManual.checkVisibility('IMPORT_STRUCTURED_DATA')) {
        this.inlineManual.openHelp('IMPORT_STRUCTURED_DATA')
        this.inlineManual.visited('IMPORT_STRUCTURED_DATA')
      }
    }
  }

  cancleSourceAddition(event?) {
    this.selectedSourceType = null;
    this.closeStructuredDataModal(event);
  }

  closeStructuredDataModal(event?) {
    this.selectedSourceType = {};
    if (this.addStructuredDataModalPopRef && this.addStructuredDataModalPopRef.close) {
      this.modalService.dismissAll();
      this.addStructuredDataModalPopRef.close();
      if (event && event.showStatusModal) {
        this.structuredDataDocPayload = event.payload;
        this.openStructuredDataStatusModal();
      }
      else {
        // refresh the data
        if (this.searchText.length) {
          this.searchItems();
        }
        else if (Object.keys(this.appliedAdvancedSearch).length) {
          this.applyAdvancedSearchCall();
        }
        else {
          if (!event || !(event && event.cancel)) {
            this.getStructuredDataList();
          }
        }
      }
    }
  }

  openAdvancedSearch() {
    this.getFieldAutoComplete('');
    if (Object.values(this.advancedSearch).length) {
      this.tempAdvancedSearch = JSON.parse(JSON.stringify(this.advancedSearch));
    }
    else {
      this.advancedSearch.operand = "and"
      this.advancedSearch.rules = [];
      this.advancedSearch.rules.push({
        fieldName: '',
        operator: '',
        value: '',
        type: ''
      });
      this.tempAdvancedSearch = [];
    }
    this.adwancedSearchModalPopRef = this.advancedSearchModalPop.open();
    // this.advancedSearchInput = '';
  }

  addRule() {
    this.advancedSearch.rules.push({
      fieldName: '',
      operator: '',
      value: '',
      type: ''
    });
    console.log(this.advancedSearch);
    this.getFieldAutoComplete('');
  }

  removeRule(index) {
    if (index === 0 && this.advancedSearch.rules.length === 1) {
      this.advancedSearch.rules[0] = {
        fieldName: '',
        operator: '',
        value: '',
        type: ''
      }
    }
    else {
      this.advancedSearch.rules.splice(index, 1);
    }
  }

  removeAdvancedSearchRule(index) {
    this.appliedAdvancedSearch.rules.splice(index, 1);
    this.advancedSearch = this.appliedAdvancedSearch;
    this.applyAdvancedSearchCall();
  }

  setOperator(key, index) {
    if (this.advancedSearch.rules[index]) {
      this.advancedSearch.rules[index].operator = key;
      if ((key === 'exists') || (key === 'notexists')) {
        this.advancedSearch.rules[index].type = 'field';
        this.advancedSearch.rules[index].value = '';
      }
      else {
        this.advancedSearch.rules[index].type = 'value';
      }
    }
  }

  getOperatorName(key) {
    let name;
    this.advancedSearchOperators.forEach((operator) => {
      if (operator.value === key) {
        name = operator.name;
      }
    });
    return (name ? name : key);
  }

  cancleAdvansedSearch() {
    if (this.adwancedSearchModalPopRef) {
      this.adwancedSearchModalPopRef.close();
    }
    this.advancedSearchInput = '';
    // this.appliedAdvancedSearch = '';
    if (!this.checkAdvancedSearchValidation()) {
      if (this.tempAdvancedSearch.rules && this.tempAdvancedSearch.rules.length) {
        this.advancedSearch = JSON.parse(JSON.stringify(this.tempAdvancedSearch));
        this.appliedAdvancedSearch = JSON.parse(JSON.stringify(this.advancedSearch));
      }
      else {
        this.advancedSearch = {};
        this.appliedAdvancedSearch = {};
      }
    }
    else {
      this.advancedSearch = JSON.parse(JSON.stringify(this.tempAdvancedSearch));
      this.appliedAdvancedSearch = JSON.parse(JSON.stringify(this.advancedSearch));
    }
  }

  returnOperator(operator) {
    switch (operator) {
      case 'exists': return 'Exists';
      case 'notexists': return 'Does Not Exist';
      case 'equals': return 'Equals To';
      case 'notequals': return 'Not Equals To'
    }
  }

  applyAdvancedSearch() {
    console.log("advanced Search", this.advancedSearch);
    this.appliedAdvancedSearch = this.advancedSearch;
    if (this.checkAdvancedSearchValidation()) {
      this.applyAdvancedSearchCall();
      // if(this.adwancedSearchModalPopRef){
      //   this.adwancedSearchModalPopRef.close();
      // }
    }
    else {
      // inform user
      this.notificationService.notify('Please fill all necessary fields', 'error');
    }
  }

  checkAdvancedSearchValidation() {
    if (this.advancedSearch.operand && this.advancedSearch.operand.length) {
      if (this.advancedSearch.rules.length) {
        let isPassed: any;
        isPassed = this.advancedSearch.rules.every((rule) => {
          if (rule.fieldName.length && rule.operator.length) {
            if ((rule.operator !== 'exists') && (rule.operator !== 'notexists')) {
              if (rule.value.length) {
                return true;
              }
              else {
                return false;
              }
            }
            else {
              return true;
            }
          }
          else {
            return false;
          }
        });
        return isPassed;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  applyAdvancedSearchCall() {
    this.isLoading = true;
    this.emptySearchResults = false;
    this.noItems = false;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit: 20,
      searchQuery: this.searchText,
      advanceSearch: true
    };
    if (this.skip) {
      quaryparms.skip = this.skip;
    }
    let payload: any = {};
    payload = this.designPayloadForAdvancedSearch();
    if (payload.cond && !payload.cond.length) {
      // if no rules, then just refresh
      this.appliedAdvancedSearch = {};
      this.advancedSearch = {};
      this.getStructuredDataList();
      return false;
    }
    this.service.invoke('post.searchStructuredData', quaryparms, payload).subscribe(res => {
      this.isLoading = false;
      this.totalCount = JSON.parse(JSON.stringify(res.total));
      this.selectedStructuredData = [];
      this.allSelected = false;
      if (this.adwancedSearchModalPopRef) {
        this.adwancedSearchModalPopRef.close();
      }
      if (res.data) {
        this.structuredDataItemsList = res.data;
        this.structuredDataItemsList.forEach(data => {
          data.objectLength = Object.keys(data._source).length;
          if (data._source) {
            if (data._source.contentType) {
              delete data._source.contentType;
            }
            data.parsedData = JSON.stringify(data._source, null, 1);
          };
        });
        this.designDefaultData(this.structuredDataItemsList);
      }
      else {
        this.structuredDataItemsList = [];
      }
      if (this.structuredDataItemsList.length == 0) {
        this.noItems = true;
        this.emptySearchResults = true;
      }
    }, errRes => {
      console.log("error", errRes);
      this.tempAdvancedSearch = {};
      this.isLoading = false;
      this.emptySearchResults = false;
      this.notificationService.notify('Fetching Structured Data has gone wrong.', 'error');
    });
  }

  designPayloadForAdvancedSearch() {
    let payload: any = {};
    payload.operand = this.advancedSearch.operand;
    payload.cond = [];
    this.advancedSearch.rules.forEach((rule) => {
      payload.cond.push({
        'type': rule.type,
        'key': rule.fieldName,
        'op': rule.operator,
        'value': rule.value
      })
    });
    return payload;
  }

  toggleSearch(activate) {
    this.searchActive = activate;
    if (!activate) {
      if (this.searchText.length) {
        this.searchText = '';
        if (this.appliedAdvancedSearch && (this.appliedAdvancedSearch.rules && this.appliedAdvancedSearch.rules.length)) {
          this.applyAdvancedSearchCall();
        }
        else {
          this.getStructuredDataList();
        }
      }
    }
    else {
      setTimeout(() => {
        let id = 'direct-search';
        let element = document.getElementById(id);
        if (element) {
          element.focus();
        }
      }, 100);
    }
  }

  selectData(item, index) {
    if (!item.isChecked) {
      this.selectedStructuredData.push(item);
      item.isChecked = true;
    }
    else {
      for (let i = 0; i < this.selectedStructuredData.length; i++) {
        if (this.selectedStructuredData[i]._id === item._id) {
          item.isChecked = false;
          this.selectedStructuredData.splice(i, 1);
        }
      }
    }

    if (this.selectedStructuredData.length === this.structuredDataItemsList.length) {
      this.allSelected = true;
    }
    else {
      this.allSelected = false;
    }
  }

  selectAll(key) {
    if (!key) {
      this.structuredDataItemsList.forEach(data => {
        data.isChecked = false;
      });
      this.selectedStructuredData = [];
      this.allSelected = false;
    }
    else {
      this.structuredDataItemsList.forEach(data => {
        data.isChecked = true;
      });
      this.selectedStructuredData = JSON.parse(JSON.stringify(this.structuredDataItemsList));
      this.allSelected = true;
    }
  }

  searchItems() {
    this.isLoading = true;
    this.emptySearchResults = false;
    this.noItems = false;
    let payload;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit: 20,
      searchQuery: this.searchText,
      advanceSearch: false
    };
    if (this.skip) {
      quaryparms.skip = this.skip;
    }
    if (this.appliedAdvancedSearch && this.appliedAdvancedSearch.rows && this.appliedAdvancedSearch.rules.length) {
      payload = this.appliedAdvancedSearch;
    }
    this.service.invoke('get.searchStructuredData', quaryparms, payload).subscribe(res => {
      this.isLoading = false;
      this.totalCount = JSON.parse(JSON.stringify(res.total));
      this.selectedStructuredData = [];
      this.allSelected = false;
      if (res.data) {
        this.structuredDataItemsList = res.data;
      }
      else {
        this.structuredDataItemsList = [];
      }
      this.selectedStructuredData = [];
      this.allSelected = false;
      this.structuredDataItemsList.forEach(data => {
        data.objectLength = Object.keys(data._source).length;
        if (data._source) {
          if (data._source.contentType) {
            delete data._source.contentType;
          }
          data.parsedData = JSON.stringify(data._source, null, 1);
        };
      });
      this.designDefaultData(this.structuredDataItemsList);
      if (this.structuredDataItemsList.length == 0) {
        this.noItems = true;
        this.emptySearchResults = true;
      }
    }, errRes => {
      console.log("error", errRes);
      this.isLoading = false;
      this.emptySearchResults = false;
      this.notificationService.notify('Fetching Structured Data has gone wrong.', 'error');
    });
  }

  //delete experiment popup
  deleteStructuredDataPopup(record?) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected data will be permanently deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true,
      }
    });
    dialogRef.componentInstance.onSelect.subscribe(res => {
      if (res === 'yes') {
        if (!record) {
          if (this.selectedStructuredData.length) {
            //bulk delete
            dialogRef.close();
            this.deleteBulkStructuredData();
          }
        }
        else {
          // delete
          dialogRef.close();
          this.deleteStructuredData(record);
        }
      }
      else if (res === 'no') {
        dialogRef.close();
      }
    });
  }

  deleteStructuredData(record) {
    let quaryparms: any = {};
    quaryparms.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    quaryparms.sourceId = Math.random().toString(36).substr(7);
    if (record) {
      quaryparms.contentId = record._id;
      this.service.invoke('delete.structuredData', quaryparms).subscribe(res => {
        if (res) {
          this.selectedStructuredData = [];
          this.allSelected = false;
          if (this.searchText.length) {
            this.searchItems();
          }
          else if (Object.keys(this.appliedAdvancedSearch).length) {
            this.applyAdvancedSearchCall();
          }
          else {
            this.getStructuredDataList();
            let currentPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
            if (currentPlan?.subscription?.planId == 'fp_free') {
              this.appSelectionService.updateUsageData.next('updatedUsage');
            }
          } this.notificationService.notify('Deleted Successfully', 'success');
        }
      }, errRes => {
        console.log("error", errRes);
        this.notificationService.notify('Deletion has gone wrong.', 'error');
      });
    }
  }

  deleteBulkStructuredData() {
    let quaryparms: any = {};
    let payload: any = {};
    quaryparms.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    if (this.selectedStructuredData.length) {
      payload.docIds = [];
      this.selectedStructuredData.forEach((data: any) => {
        payload.docIds.push(data._id);
      });
      this.service.invoke('delete.clearAllStructureData', quaryparms, payload).subscribe(res => {
        if (res) {
          this.selectedStructuredData = [];
          this.allSelected = false;
          if (this.searchText.length) {
            this.searchItems();
          }
          else if (Object.keys(this.appliedAdvancedSearch).length) {
            this.applyAdvancedSearchCall();
          }
          else {
            this.getStructuredDataList();
          }
          this.notificationService.notify('Deleted Successfully', 'success');
        }
      }, errRes => {
        console.log("error", errRes);
        this.notificationService.notify('Deletion has gone wrong.', 'error');
      });
    }
  }

  openStructuredDataStatusModal() {
    this.structuredDataStatusModalRef = this.structuredDataStatusModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }

  closeStructuredDataStatusModal() {
    if (this.structuredDataStatusModalRef) {
      this.structuredDataStatusModalRef.close();
      this.getStructuredDataList();
    }
  }

  getAllSettings() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      interface: 'fullSearch'
    };
    this.isResultTemplateLoading = true;
    this.service.invoke('get.settingsByInterface', quaryparms).subscribe(res => {
      this.isResultTemplateLoading = false;
      if (res.settings) {
        res.settings.forEach((_interface) => {
          _interface.appearance.forEach(element => {
            if (!this.isResultTemplate) {
              if (element.type === 'structuredData') {
                if (element.templateId && element.templateId.length) {
                  this.isResultTemplate = true;
                }
                else {
                  this.isResultTemplate = false;
                }
              }
            }
          });
        });
      }
    }, errRes => {
      this.notificationService.notify('Failed to fetch all Setting Informations', 'error');
    });
  }

  navigateToSearchInterface() {
    this.router.navigate(['/resultTemplate'], { skipLocationChange: true });
    this.headerService.updateShowHideSettingsMenu(false);
    this.headerService.updateShowHideSourceMenu(false);
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchText = '';
      this.activeClose = false;
      this.searchItems();
    }
    this.searchActive = !this.searchActive;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
