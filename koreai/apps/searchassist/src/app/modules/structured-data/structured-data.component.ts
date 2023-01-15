import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { debounceTime, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { SideBarService } from './../../services/header.service';
import { InlineManualService } from '../../services/inline-manual.service';
import { AppSelectionService } from './../../services/app.selection.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { OnboardingComponentComponent } from '../../components/onboarding-component/onboarding-component.component';
import { SliderComponentComponent } from '../../shared/slider-component/slider-component.component';
import * as moment from 'moment';
import { EMPTY_SCREEN } from '../../modules/empty-screen/empty-screen.constants';
@Component({
  selector: 'app-structured-data',
  templateUrl: './structured-data.component.html',
  styleUrls: ['./structured-data.component.scss'],
})
export class StructuredDataComponent implements OnInit {
  emptyScreen = EMPTY_SCREEN.STRUCTURED_DATA;
  addStructuredDataModalPopRef: any;
  selectedSourceType: any;
  availableSources = [
    {
      name: 'Import Structured Data',
      description: 'Import from JSON or CSV',
      icon: 'assets/icons/content/database-Import.svg',
      id: 'contentStucturedDataImport',
      sourceType: 'data',
      resourceType: 'structuredData',
    },
    {
      name: 'Add Structured Data',
      description: 'Add structured data manually',
      icon: 'assets/icons/content/database-add.svg',
      id: 'contentStucturedDataAdd',
      sourceType: 'data',
      resourceType: 'structuredDataManual',
    },
  ];

  structuredDataItemsList: any = [];
  selectedApp: any;
  codeMirrorOptions: any = {
    theme: 'neo',
    mode: 'json',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: false,
    gutters: [
      'CodeMirror-linenumbers',
      'CodeMirror-foldgutter',
      'CodeMirror-lint-markers',
    ],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: false,
    indentUnit: 0,
    readOnly: 'nocursor',
    scrollbarStyle: 'null',
  };
  searchActive: boolean = false;
  actionforcheckbox: any = ''; //flag which returns 'all' as value in select all scenario/'partial' value in partial select scenario
  searchText: any = '';
  selectedStructuredData: any = [];
  allSelected: boolean = false;
  adwancedSearchModalPopRef: any;
  advancedSearchInput = '';
  selecteditems: any = []; //array to capture the selected checkboxes info from items list
  unselecteditems: any = [];
  appliedAdvancedSearch: any = {};
  advancedSearchOperators = [
    {
      name: 'Exists',
      value: 'exists',
    },
    {
      name: 'Does Not Exist',
      value: 'notexists',
    },
    {
      name: 'Equals to',
      value: 'equals',
    },
    {
      name: 'Not Equals to',
      value: 'notequals',
    },
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
  limitpage = 10;
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
  showSelectedData: boolean;
  showSelectAllQues: boolean;
  enableSearchBlock: boolean = false;
  indexPipelineId: any;
  queryPipelineId: any;
  subscription: Subscription;
  activeClose = false;
  paginateEvent: any;
  showSelectedCount = 0;
  componentType: string = 'addData';
  onboardingOpened: boolean = false;
  currentRouteData: any = '';
  @ViewChild('addStructuredDataModalPop')
  addStructuredDataModalPop: KRModalComponent;
  @ViewChild('advancedSearchModalPop') advancedSearchModalPop: KRModalComponent;
  @ViewChild('structuredDataStatusModalPop')
  structuredDataStatusModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  @ViewChild(OnboardingComponentComponent, { static: true })
  onBoardingComponent: OnboardingComponentComponent;
  @ViewChild(SliderComponentComponent)
  sliderComponent: SliderComponentComponent;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private modalService: NgbModal,
    public headerService: SideBarService,
    private router: Router,
    public dialog: MatDialog,
    public inlineManual: InlineManualService,
    private appSelectionService: AppSelectionService
  ) {}

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getStructuredDataList();
    this.search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map((term) => this.searchItems())
      );
    //this.loadData();
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(
      (res) => {
        this.loadData();
      }
    );
  }

  loadData() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : this.selectedApp.searchIndexes[0].queryPipelineId;
      this.getAllSettings();
    }
  }
  isLoading1: boolean;
  loadImageText: boolean = false;

  getStructuredDataList(skip?) {
    this.isLoading = true;
    this.noItems = false;
    this.emptySearchResults = false;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit: 10,
    };
    //changes made on 31/01 to avoid passing on negative skip values in payload.
    if (skip < 0) {
      skip = 0;
    }
    if (skip) {
      quaryparms.skip = skip;
    }
    this.skip = skip;
    this.service.invoke('get.structuredData', quaryparms).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.totalCount = JSON.parse(JSON.stringify(res.total));

        // this.selectedStructuredData = [];
        // this.allSelected = false; // To be sent true for selectionAll during pagination
        if (res.data) {
          this.structuredDataItemsList = res.data;
        } else {
          this.structuredDataItemsList = [];
        }
        this.structuredDataItemsList.forEach((responseElement) => {
          //next page array
          this.selectedStructuredData.forEach((selectedElement) => {
            //current page array
            if (
              responseElement._id === selectedElement._id &&
              selectedElement.isChecked
            ) {
              // id's will never be same as above two are different arrays
              responseElement.isChecked = true;
            }
          });
        });
        if (quaryparms && quaryparms.skip) {
        }
        //changes made on 31/01
        if (this.allSelected || this.actionforcheckbox == 'all') {
          this.showSelectedData = true; // To show number of records selected
          this.structuredDataItemsList.forEach((data) => {
            data.isChecked = true;
          });
          this.selectedStructuredData = [...this.structuredDataItemsList]; //To have a same session data and server data
          //check for id and push data in to selectitemslist if we dont have id.
          /*changes done on 27/01*/
          // this.selecteditems.forEach(selecteddata => {
          //   this.structuredDataItemsList.forEach(fetcheddata => {
          //     if(selecteddata._id!=fetcheddata._id){
          //       this.selecteditems.push(fetcheddata);
          //     }
          //   });
          // });
          //changes made on 31/01
          let uniquedata = this.structuredDataItemsList.filter(
            ({ _id: id1 }) =>
              !this.selecteditems.some(({ _id: id2 }) => id2 === id1)
          );
          if (uniquedata.length > 0) {
            uniquedata.forEach((element) => {
              this.selecteditems.push(element);
            });
          }
        }
        //if partial selection or data coming from paginate
        if (
          (skip || this.skip === 0) &&
          this.showSelectedCount > 0 &&
          this.showSelectedCount < this.totalCount
        ) {
          /* code changes made on 06/01 checking if action checkbox is empty,if so updating checkbox value to partial*/
          if (!this.actionforcheckbox) {
            this.actionforcheckbox = 'partial';
          }
          if (this.actionforcheckbox === 'all') {
            this.showSelectedData = true; // To show number of records selected
            this.structuredDataItemsList.forEach((data) => {
              data.isChecked = true;
            });
          } else if (this.actionforcheckbox === 'partial') {
            /**updted 05/01 compare select array with items and write function for
           selectcompare and compare select list and update checked to true **/
            if (this.selecteditems.length) {
              this.selectcompare();
            }
          }
          this.selectedStructuredData = [...this.structuredDataItemsList]; //To have a same session data and server data
        }
        // if(this.showSelectedCount > 0 && this.showSelectedCount < this.totalCount)
        //   {
        //     this.selectedStructuredData=[...this.structuredDataItemsList]//To have a same session data and server data
        //   }
        /*check if user unselected items in select all scenario  and call unselectcompare function*/
        if (this.unselecteditems.length) {
          this.unselectcompare();
        }

        if (res.length > 0) {
          this.isLoading = false;
          this.isLoading1 = true;
        } else {
          this.isLoading1 = true;
        }
        this.structuredDataItemsList.forEach((data) => {
          data.objectLength = Object.keys(data._source).length;
          if (data._source) {
            if (data._source.contentType) {
              delete data._source.contentType;
            }
            data.parsedData = JSON.stringify(data._source, null, 1);
          }
        });
        this.designDefaultData(this.structuredDataItemsList);
        if (this.structuredDataItemsList.length == 0) {
          this.noItems = true;
          this.enableSearchBlock = false;
          // if(!this.inlineManual.checkVisibility('ADD_STRUCTURED_DATA_LANDING')){
          //   this.inlineManual.openHelp('ADD_STRUCTURED_DATA_LANDING')
          //   this.inlineManual.visited('ADD_STRUCTURED_DATA_LANDING')
          // }
        } else {
          this.enableSearchBlock = true;
          if (
            !this.inlineManual.checkVisibility('STRUCTURED_DATA_WALKTHROUGH')
          ) {
            // this.inlineManual.openHelp('STRUCTURED_DATA_WALKTHROUGH')
            // this.inlineManual.visited('STRUCTURED_DATA_WALKTHROUGH')
          }
        }
      },
      (errRes) => {
        // console.log("error", errRes);
        this.isLoading = false;
        this.notificationService.notify(
          'Fetching Structured Data has gone wrong.',
          'error'
        );
      }
    );
  }

  designDefaultData(structuredDataItemsList) {
    this.defaultView = this.defaultView;
    structuredDataItemsList.forEach((element: any, index) => {
      element.objectValues = [];
      Object.keys(element._source).forEach((key: any, index) => {
        let nested = false;
        if (
          key &&
          typeof element._source[key] === 'object' &&
          typeof element._source[key] != null
        ) {
          nested = true;
        } else {
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
            value: nested
              ? this.getNestedElements(element._source[key])
              : element._source[key],
            // var str = JSON.stringify(obj, null, 2);
            expandedValue: element._source[key],
            nested: nested,
            expanded: false,
            valuesLength: nested
              ? element._source[key]
                ? Object.values(element._source[key]).length
                : null
              : 1,
          });
        }
      });
    });
    // console.log("structuredDataItemsList", this.structuredDataItemsList);
  }

  getNestedElements(element) {
    let objectValues = [];
    if (typeof element === 'object' && element != null)
      Object.keys(element).forEach((key: any, index) => {
        let nested = false;
        if (key && typeof element[key] === 'object') {
          nested = true;
        } else {
          nested = false;
        }
        objectValues.push({
          key: key,
          value: nested ? this.getNestedElements(element[key]) : element[key],
          nested: nested,
          expanded: false,
          valuesLength: nested ? Object.values(element[key]).length : 1,
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
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(
      (res) => {
        this.fields = res || [];
      },
      (errRes) => {
        this.notificationService.notify('Failed to get fields', 'error');
      }
    );
  }

  selectedField(suggesition, index) {
    // console.log("test", suggesition);
    if (this.advancedSearch.rules[index]) {
      this.advancedSearch.rules[index].fieldName = suggesition.fieldName;
    }
  }

  paginate(event) {
    console.log('event', event);
    this.paginateEvent = event;
    if (event.skip || event.skip === 0) {
      // 31/01
      //   add if condition to check if search key is present if yes then call the search function
      //  if not call the structrued datalist
      if (this.searchText.length > 0) {
        this.searchItems();
      } else {
        this.getStructuredDataList(event.skip);
      }
    }
  }

  editJson(payload, d_index?) {
    this.selectedSourceType = JSON.parse(
      JSON.stringify(this.availableSources[1])
    );
    this.selectedSourceType.payload = payload;
    this.selectedSourceType.viewMode = false;
    this.selectedSourceType.allData = [];
    if (d_index || d_index == 0) {
      this.selectedSourceType.currentIndex = d_index;
      this.selectedSourceType.allData = this.structuredDataItemsList;
    } else {
      this.selectedSourceType.currentIndex = undefined;
    }
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  viewJson(data, index) {
    this.selectedSourceType = JSON.parse(
      JSON.stringify(this.availableSources[1])
    );
    this.selectedSourceType.payload = data;
    this.selectedSourceType.viewMode = true;
    this.selectedSourceType.allData = this.structuredDataItemsList;
    this.selectedSourceType.currentIndex = index;
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  openAddStructuredData(key) {
    this.selectedSourceType = this.availableSources.find((s) => {
      if (s.resourceType === key) {
        return s;
      }
    });
    // console.log("this.selectedSourceType", this.selectedSourceType);
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
    if (this.selectedSourceType.id == 'contentStucturedDataImport') {
      if (!this.inlineManual.checkVisibility('IMPORT_STRUCTURED_DATA')) {
        // this.inlineManual.openHelp('IMPORT_STRUCTURED_DATA')
        // this.inlineManual.visited('IMPORT_STRUCTURED_DATA')
      }
    }
  }

  cancleSourceAddition(event?) {
    this.selectedSourceType = null;
    this.closeStructuredDataModal(event);
  }

  closeStructuredDataModal(event?) {
    this.selectedSourceType = {};
    if (
      this.addStructuredDataModalPopRef &&
      this.addStructuredDataModalPopRef.close
    ) {
      this.modalService.dismissAll();
      this.addStructuredDataModalPopRef.close();
      if (event && event.showStatusModal) {
        this.structuredDataDocPayload = event.payload;
        this.openStructuredDataStatusModal();
      } else {
        // refresh the data
        if (this.searchText.length) {
          this.searchItems();
        } else if (Object.keys(this.appliedAdvancedSearch).length) {
          this.applyAdvancedSearchCall();
        } else {
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
    } else {
      this.advancedSearch.operand = 'and';
      this.advancedSearch.rules = [];
      this.advancedSearch.rules.push({
        fieldName: '',
        operator: '',
        value: '',
        type: '',
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
      type: '',
    });
    // console.log(this.advancedSearch);
    this.getFieldAutoComplete('');
  }

  removeRule(index) {
    if (index === 0 && this.advancedSearch.rules.length === 1) {
      this.advancedSearch.rules[0] = {
        fieldName: '',
        operator: '',
        value: '',
        type: '',
      };
    } else {
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
      if (key === 'exists' || key === 'notexists') {
        this.advancedSearch.rules[index].type = 'field';
        this.advancedSearch.rules[index].value = '';
      } else {
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
    return name ? name : key;
  }

  cancleAdvansedSearch() {
    if (this.adwancedSearchModalPopRef) {
      this.adwancedSearchModalPopRef.close();
    }
    this.advancedSearchInput = '';
    // this.appliedAdvancedSearch = '';
    if (!this.checkAdvancedSearchValidation()) {
      if (
        this.tempAdvancedSearch.rules &&
        this.tempAdvancedSearch.rules.length
      ) {
        this.advancedSearch = JSON.parse(
          JSON.stringify(this.tempAdvancedSearch)
        );
        this.appliedAdvancedSearch = JSON.parse(
          JSON.stringify(this.advancedSearch)
        );
      } else {
        this.advancedSearch = {};
        this.appliedAdvancedSearch = {};
      }
    } else {
      this.advancedSearch = JSON.parse(JSON.stringify(this.tempAdvancedSearch));
      this.appliedAdvancedSearch = JSON.parse(
        JSON.stringify(this.advancedSearch)
      );
    }
  }

  returnOperator(operator) {
    switch (operator) {
      case 'exists':
        return 'Exists';
      case 'notexists':
        return 'Does Not Exist';
      case 'equals':
        return 'Equals To';
      case 'notequals':
        return 'Not Equals To';
    }
  }

  applyAdvancedSearch() {
    // console.log("advanced Search", this.advancedSearch);
    this.appliedAdvancedSearch = this.advancedSearch;
    if (this.checkAdvancedSearchValidation()) {
      this.applyAdvancedSearchCall();
      // if(this.adwancedSearchModalPopRef){
      //   this.adwancedSearchModalPopRef.close();
      // }
    } else {
      // inform user
      this.notificationService.notify(
        'Please fill all necessary fields',
        'error'
      );
    }
  }

  checkAdvancedSearchValidation() {
    if (this.advancedSearch.operand && this.advancedSearch.operand.length) {
      if (this.advancedSearch.rules.length) {
        let isPassed: any;
        isPassed = this.advancedSearch.rules.every((rule) => {
          if (rule.fieldName.length && rule.operator.length) {
            if (rule.operator !== 'exists' && rule.operator !== 'notexists') {
              if (rule.value.length) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          } else {
            return false;
          }
        });
        return isPassed;
      } else {
        return false;
      }
    } else {
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
      advanceSearch: true,
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
    this.service
      .invoke('post.searchStructuredData', quaryparms, payload)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.totalCount = JSON.parse(JSON.stringify(res.total));
          this.selectedStructuredData = [];
          this.allSelected = false;
          if (this.adwancedSearchModalPopRef) {
            this.adwancedSearchModalPopRef.close();
          }
          if (res.data) {
            this.structuredDataItemsList = res.data;
            this.structuredDataItemsList.forEach((data) => {
              data.objectLength = Object.keys(data._source).length;
              if (data._source) {
                if (data._source.contentType) {
                  delete data._source.contentType;
                }
                data.parsedData = JSON.stringify(data._source, null, 1);
              }
            });
            this.designDefaultData(this.structuredDataItemsList);
          } else {
            this.structuredDataItemsList = [];
          }
          if (this.structuredDataItemsList.length == 0) {
            this.noItems = true;
            this.emptySearchResults = true;
          }
        },
        (errRes) => {
          // console.log("error", errRes);
          this.tempAdvancedSearch = {};
          this.isLoading = false;
          this.emptySearchResults = false;
          this.notificationService.notify(
            'Fetching Structured Data has gone wrong.',
            'error'
          );
        }
      );
  }

  designPayloadForAdvancedSearch() {
    let payload: any = {};
    payload.operand = this.advancedSearch.operand;
    payload.cond = [];
    this.advancedSearch.rules.forEach((rule) => {
      payload.cond.push({
        type: rule.type,
        key: rule.fieldName,
        op: rule.operator,
        value: rule.value,
      });
    });
    return payload;
  }

  toggleSearch(activate) {
    this.searchActive = activate;
    if (!activate) {
      if (this.searchText.length) {
        this.searchText = '';
        if (
          this.appliedAdvancedSearch &&
          this.appliedAdvancedSearch.rules &&
          this.appliedAdvancedSearch.rules.length
        ) {
          this.applyAdvancedSearchCall();
        } else {
          this.getStructuredDataList();
        }
      }
    } else {
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
      this.selecteditems.push(item); //capturing selected checkbox items in selected items array
      item.isChecked = true;
      this.showSelectedCount = this.showSelectedCount + 1;
      //If unselected & Then Selected it should get cleared.
      for (let k = 0; k < this.unselecteditems.length; k++) {
        //compare the selecteditems array with items array and splice
        if (this.unselecteditems[k]._id === item._id) {
          this.unselecteditems.splice(k, 1);
        }
      }
      // Action for Checkbox flag,  when there is change From SelectALL
      if (!this.actionforcheckbox) {
        if (this.totalCount <= this.limitpage) {
          this.actionforcheckbox = 'all';
        }
      }

      //All Check by Single select
      if (this.showSelectedCount == this.totalCount) {
        this.actionforcheckbox = 'all';
        this.partialSelection();
      }
      // if(this.showSelectedCount == this.totalCount){
      //   this.actionforcheckbox = "all"
      // }else if(this.showSelectedCount > 0){
      //   this.actionforcheckbox = "partial"
      // }
    } else {
      if (!this.selectedStructuredData.length) {
        this.selectedStructuredData = [...this.structuredDataItemsList];
      }
      //   for (var i = 0; i < this.selectedStructuredData.length; i++) {
      //     var obj = this.selectedStructuredData[i];

      //     if (this.selectedStructuredData.indexOf(obj.id) !== -1) {
      //       this.selectedStructuredData.splice(i, 1);
      //       console.log(this.selectedStructuredData);
      //     }
      // }
      // this.selectedStructuredData.length=10;
      //add logic to remove the duplicate

      for (let i = 0; i < this.selecteditems.length; i++) {
        if (this.selecteditems[i]._id === item._id) {
          this.unselecteditems.push(item); // After select all clicked,and user unselects some items those are saved in unselecteditems array.
          item.isChecked = false;
          this.selecteditems.splice(i, 1);
          this.showSelectedCount = this.showSelectedCount - 1;

          //changes made on 31/01
          if (this.showSelectedCount == 0) {
            this.clearDependencies();
          }
          break;
        }
      }
      // Action for Checkbox flag,  when there is change From SelectALL
      //  if(!this.actionforcheckbox){
      //   if(this.totalCount < this.limitpage && this.showSelectedCount == this.totalCount){
      //     this.actionforcheckbox = "all"
      //   }
      // }
      // for(let k=0;k<this.selecteditems.length;k++)
      //  {
      //     //compare the selecteditems array with items array and splice
      //     if (this.selecteditems[k]._id === item._id){
      //       this.selecteditems.splice(k, 1);

      //     }
      // }
    }
    // /** new code on 05/01 **/

    // Check for this condition
    if (this.selecteditems.length === this.structuredDataItemsList.length) {
      if (this.selecteditems.length === this.totalCount) {
        this.allSelected = true;
      }
    } else {
      if (this.showSelectedCount == this.totalCount) {
        this.allSelected = true;
      } else {
        this.allSelected = false;
      }
    }
  }
  /** in select all scenario,when user unselects in one page and comes back to same page the items has not be highlighted
   * ,to compare the unselect items  and update the ischecked flag to false and with page items(structureddataitems list) */
  unselectcompare() {
    for (let i = 0; i < this.unselecteditems.length; i++) {
      for (let j = 0; j < this.structuredDataItemsList.length; j++) {
        if (
          this.unselecteditems[i]._id === this.structuredDataItemsList[j]._id
        ) {
          this.structuredDataItemsList[j].isChecked = false;
          console.log('inside unselect compare');
        }
      }
    }
  }
  /***code updates on 05/01 */
  selectcompare() {
    for (let i = 0; i < this.selecteditems.length; i++) {
      for (let j = 0; j < this.structuredDataItemsList.length; j++) {
        if (this.selecteditems[i]._id === this.structuredDataItemsList[j]._id) {
          this.structuredDataItemsList[j].isChecked = true;
          console.log(
            'inside select compare block',
            this.structuredDataItemsList[j]
          );
        }
      }
    }
  }
  /** Individual checbox selection */
  selectAllData() {
    this.showSelectAllQues = false;
    //  this.structuredDataItemsList.forEach(data => {
    //   data.isChecked = true;
    //   this.selecteditems.forEach(element => {
    //     if(element._id != data._id){
    //       this.selecteditems.push(data)
    //     }
    //   });
    // });
    //changes made on 31/01
    let uniquedata = this.structuredDataItemsList.filter(
      ({ _id: id1 }) => !this.selecteditems.some(({ _id: id2 }) => id2 === id1)
    );
    if (uniquedata.length > 0) {
      uniquedata.forEach((element) => {
        this.selecteditems.push(element);
      });
    }
    //changes made on 31/01
    this.checkUncheckData(true);
    this.allSelected = true;
    this.showSelectedCount = this.totalCount;
    this.unselecteditems = [];
    //  this.selectAll(true);
  }
  checkForAllBoolean(arr): any {
    let count = 0;
    //this.selecteditems=[];
    if (this.actionforcheckbox == 'partial') {
    } else {
      this.selecteditems = []; //emptying the selecteditems array
    }
    arr.forEach((element) => {
      this.selecteditems.push(element); //when partial selection is done, selected checkbox elements are pushed into selected items list.
      //element.isChecked=true;
      if (element.isChecked) {
        count++;
      }
    });
    return count;
  }

  /** 'Key' checkbox partial selection */
  partialSelection(recordStr?) {
    if (this.actionforcheckbox == 'all') {
      this.showSelectedCount = this.totalCount;
      this.allSelected = true;
      this.unselecteditems = [];
      /* nested loop logic to be added 31/01 */
      // this.structuredDataItemsList.forEach(data => {
      //   data.isChecked = true;
      //     this.selecteditems.forEach(element => {
      //       if(element._id != data._id){
      //         this.selecteditems.push(data)
      //       }
      //     });
      // });
      let uniquedata = this.structuredDataItemsList.filter(
        ({ _id: id1 }) =>
          !this.selecteditems.some(({ _id: id2 }) => id2 === id1)
      );
      if (uniquedata.length > 0) {
        uniquedata.forEach((element) => {
          this.selecteditems.push(element);
        });
      }
    } else {
      let count = this.checkForAllBoolean(this.structuredDataItemsList);
      if (count > 0 && count < this.limitpage) {
        this.showSelectedCount =
          this.showSelectedCount + (this.limitpage - count); // this.limitpage is obtained from pagination count
        // this.showSelectedCount = count;
        this.checkUncheckData(true);
      } else if (
        count == 0 &&
        !(this.structuredDataItemsList.length < this.limitpage)
      ) {
        this.showSelectedCount = this.showSelectedCount + this.limitpage;
        this.checkUncheckData(true);
      } else if (
        count == 0 &&
        this.structuredDataItemsList.length < this.limitpage
      ) {
        if (this.totalCount == this.structuredDataItemsList.length) {
          this.showSelectedCount = this.structuredDataItemsList.length;
          this.checkUncheckData(true);
          this.allSelected = true;
        }
        //changes done on 31/01
        else {
          //updated show selected count from this.showSelectedCount=this.structuredDataItemsList.length; to below on 05/02
          this.showSelectedCount =
            this.structuredDataItemsList.length + this.showSelectedCount;
          this.checkUncheckData(true);
        }
      } else if (count == this.limitpage) {
        this.showSelectedCount = this.showSelectedCount - this.limitpage;

        /** Unselecting the view list in a page because  */
        // this.structuredDataItemsList.forEach(data => {
        //   data.isChecked = false;
        // });

        this.checkUncheckData(false);
      }
    }
  }
  /** Selection and Deselection of data  */
  checkUncheckData(bool) {
    //  old referance code START

    /** Comparing the 2 arrays of the same page , if id is same data is pushed  */
    if (
      this.showSelectedCount > 0 &&
      this.showSelectedCount < this.totalCount
    ) {
      // changes made on 31/01
      let uniquedata = this.structuredDataItemsList.filter(
        ({ _id: id1 }) =>
          !this.selecteditems.some(({ _id: id2 }) => id2 === id1)
      );
      if (uniquedata.length > 0 && bool === true) {
        uniquedata.forEach((element) => {
          this.selecteditems.push(element);
        });
      }
      //*for partial unselection scenario 03/02 changes */
      // else if(uniquedata.length>0 && bool===false)
      else if (bool === false) {
        let commonelements = this.structuredDataItemsList.filter(
          ({ _id: id1 }) =>
            this.selecteditems.some(({ _id: id2 }) => id2 === id1)
        );
        if (commonelements.length > 0 && bool === false) {
          commonelements.forEach((element) => {
            //this.selecteditems.splice(element,1);
            this.selecteditems = this.selecteditems.filter(
              (a) => a !== element
            );
          });
        }
      }
      this.structuredDataItemsList.forEach((data, index) => {
        // this.selecteditems.forEach(selElement => {
        // if(data._id !== selElement._id){
        //   this.selecteditems.push(data)
        // }
        // });
        /** To check or uncheck  */
        if (bool) {
          data.isChecked = true;
        } else {
          data.isChecked = false;
          // if(this.paginateEvent && this.paginateEvent.skip){
          //   if(index >= this.paginateEvent.skip){
          //     data.isChecked =false;
          //   }
          // }
        }
        /** To show or hide SELECT ALL button*/
        if (bool) {
          this.showSelectAllQues = bool;
        } else {
          if (this.showSelectedCount) {
            this.showSelectAllQues = true;
          } else {
            this.showSelectAllQues = false;
          }
        }
      });
      // this.selectedStructuredData = JSON.parse(JSON.stringify(this.structuredDataItemsList));
    } else if (this.showSelectedCount === 0) {
      this.structuredDataItemsList.forEach((data) => {
        data.isChecked = bool;
        if (bool) {
          this.showSelectAllQues = bool;
        } else {
          if (this.showSelectedCount) {
            this.showSelectAllQues = true;
          } else {
            this.showSelectAllQues = false;
          }
        }
      });
    } else {
      this.structuredDataItemsList.forEach((data) => {
        data.isChecked = bool;
        if (bool) {
          this.showSelectAllQues = bool;
          this.allSelected = bool;
        } else {
          if (this.showSelectedCount) {
            this.showSelectAllQues = true;
          } else {
            this.showSelectAllQues = false;
          }
        }
      });
    }
    //  old referance code END
    //  if(bool ){
    //   if( this.showSelectedCount > 0 && this.showSelectedCount < this.totalCount){
    //     this.structuredDataItemsList.forEach((data,index) => {
    //       this.selectedStructuredData.forEach(selElement => {
    //       if(data._id === selElement._id){
    //       data.isChecked = true;
    //       this.selectedStructuredData.push(data)
    //       }
    //       });
    //     });
    //     this.showSelectAllQues = bool
    //   }
    //   else if(this.showSelectedCount === 0){
    //     this.structuredDataItemsList.forEach(data => {
    //       data.isChecked = bool;
    //     });
    //     if(bool){
    //       this.showSelectAllQues = bool
    //     }
    //    }
    //  }
    //  else{
    //    // Once unchecked the array is spliced
    //   if( this.showSelectedCount > 0 && this.showSelectedCount < this.totalCount){
    //     this.structuredDataItemsList.forEach((data,index) => {
    //       this.selectedStructuredData.forEach((selElement, selIndex) => {
    //       if(data._id === selElement._id){
    //       data.isChecked = false;
    //       this.selectedStructuredData.splice(selIndex , 1)
    //       }
    //       });
    //     });
    //       if (this.showSelectedCount) {
    //         this.showSelectAllQues = true;
    //       }
    //       else {
    //         this.showSelectAllQues = false;
    //       }

    //   }
    //   else if(this.showSelectedCount === 0){
    //     this.structuredDataItemsList.forEach(data => {
    //       data.isChecked = bool;
    //     });
    //     if(bool){
    //       this.showSelectAllQues = bool
    //     }
    //    }
    //  }
  }
  /** 'Key' Checkbox Selection */
  selectAll(key) {
    if (!key) {
      this.structuredDataItemsList.forEach((data) => {
        data.isChecked = false;
        this.showSelectAllQues = false;
      });
      // added below line on 05/02
      this.clearDependencies();
      this.selectedStructuredData = [];
      this.selecteditems = [];
      this.allSelected = false;
      this.showSelectedCount = 0;
    } else {
      this.allSelected = false;
      this.partialSelection('currentRecord');
      // this.structuredDataItemsList.forEach(data => {
      //   data.isChecked = true;
      //   this.showSelectAllQues =true
      // });
      //this.selectedStructuredData = JSON.parse(JSON.stringify(this.structuredDataItemsList));
    }
    //this.allSelected = false;
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
      limit: 10,
      searchQuery: this.searchText,
      advanceSearch: false,
    };
    if (this.skip) {
      quaryparms.skip = this.skip;
    }
    if (
      this.appliedAdvancedSearch &&
      this.appliedAdvancedSearch.rows &&
      this.appliedAdvancedSearch.rules.length
    ) {
      payload = this.appliedAdvancedSearch;
    }
    this.service
      .invoke('get.searchStructuredData', quaryparms, payload)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.totalCount = JSON.parse(JSON.stringify(res.total));
          this.selectedStructuredData = [];
          this.allSelected = false;
          if (res.data) {
            this.structuredDataItemsList = res.data;
          } else {
            this.structuredDataItemsList = [];
          }
          this.allSelected = false;
          this.structuredDataItemsList.forEach((data) => {
            data.objectLength = Object.keys(data._source).length;
            if (data._source) {
              if (data._source.contentType) {
                delete data._source.contentType;
              }
              data.parsedData = JSON.stringify(data._source, null, 1);
            }
          });
          this.designDefaultData(this.structuredDataItemsList);
          if (this.structuredDataItemsList.length == 0) {
            this.noItems = true;
            this.emptySearchResults = true;
          }
        },
        (errRes) => {
          // console.log("error", errRes);
          this.isLoading = false;
          this.emptySearchResults = false;
          this.notificationService.notify(
            'Fetching Structured Data has gone wrong.',
            'error'
          );
        }
      );
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
        buttons: [
          { key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((res) => {
      if (res === 'yes') {
        if (!record) {
          if (this.selecteditems.length) {
            //bulk delete
            dialogRef.close();
            this.deleteBulkStructuredData();
          }
        } else {
          // delete
          dialogRef.close();
          this.deleteStructuredData(record);
        }

        this.showSelectedCount = 0;
      } else if (res === 'no') {
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
      this.service.invoke('delete.structuredData', quaryparms).subscribe(
        (res) => {
          if (res) {
            this.selectedStructuredData = [];
            this.allSelected = false;
            //added on 05/02 below line to clear array's on deleting by delete bin image selection
            this.clearDependencies();
            if (this.searchText.length) {
              this.searchItems();
            } else if (Object.keys(this.appliedAdvancedSearch).length) {
              this.applyAdvancedSearchCall();
            } else {
              this.getStructuredDataList();
            }
            this.notificationService.notify('Deleted Successfully', 'success');
          }
        },
        (errRes) => {
          // console.log("error", errRes);
          this.notificationService.notify('Deletion has gone wrong.', 'error');
        }
      );
    }
  }
  //to clear flags adde on 31/01
  clearDependencies() {
    this.selecteditems = [];
    this.unselecteditems = [];
    this.actionforcheckbox = '';
    this.allSelected = false;
    this.showSelectedCount = 0;
  }

  deleteBulkStructuredData() {
    //added below if condition on 05/02 incase if skip is undefined.
    if (this.skip == undefined) {
      this.skip = 0;
    }
    let quaryparms: any = {};
    let payload: any = {};
    quaryparms.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    if (this.selecteditems.length) {
      if (this.allSelected) {
        payload.allStructuredData = true;
      }
      //updated the below else if condition to handle the delete happy flow on 05/02
      else if (
        this.unselecteditems.length &&
        this.actionforcheckbox == 'all' &&
        this.selecteditems.length + this.unselecteditems.length ==
          this.structuredDataItemsList.length + this.skip
      ) {
        payload.excludeDocIds = [];
        this.unselecteditems.forEach((data: any) => {
          payload.excludeDocIds.push(data._id);
        });
      } else {
        payload.docIds = [];
        this.selecteditems.forEach((data: any) => {
          payload.docIds.push(data._id);
        });
      }

      this.service
        .invoke('delete.clearAllStructureData', quaryparms, payload)
        .subscribe(
          (res) => {
            if (res) {
              this.selectedStructuredData = [];
              this.selecteditems = [];
              this.actionforcheckbox = '';
              this.allSelected = false;
              this.clearDependencies();
              if (this.searchText.length) {
                this.searchItems();
              } else if (Object.keys(this.appliedAdvancedSearch).length) {
                this.applyAdvancedSearchCall();
              } else {
                this.getStructuredDataList();
              }
              this.notificationService.notify(
                'Deleted Successfully',
                'success'
              );
              // To hide deleted and show all buttons after deletion //
              this.showSelectAllQues = false;
              this.showSelectedData = false;
            }
          },
          (errRes) => {
            // console.log("error", errRes);
            this.notificationService.notify(
              'Deletion has gone wrong.',
              'error'
            );
          }
        );
    }
  }

  openStructuredDataStatusModal() {
    this.structuredDataStatusModalRef =
      this.structuredDataStatusModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500);
  }

  closeStructuredDataStatusModal() {
    if (this.structuredDataStatusModalRef) {
      this.structuredDataStatusModalRef.close();
      this.getStructuredDataList();
    }
  }
  exportStructureData(ext) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    const payload = {
      exportType: ext,
    };
    this.service.invoke('export.structuredData', quaryparms, payload).subscribe(
      (res) => {
        if (ext === 'json') {
          this.notificationService.notify(
            'Export to JSON is in progress. You can check the status in the Status Docker',
            'success'
          );
        } else {
          this.notificationService.notify(
            'Export to CSV is in progress. You can check the status in the Status Docker',
            'success'
          );
        }
        this.checkStructureData();
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

  checkStructureData() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    };
    this.service.invoke('get.dockStatus', queryParms).subscribe(
      (res) => {
        /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 1894*/
        // if (res && res.dockStatuses) {
        if (res) {
          /**made changes on 24/02 as per new api contract in response we no longer use the key
       dockStatuses added updated code in 1898 line*/
          // res.dockStatuses.forEach((record: any) => {
          res.forEach((record: any) => {
            record.createdOn = moment(record.createdOn).format(
              'Do MMM YYYY | h:mm A'
            );
            /**made code updates in line no 1905 on 03/01 added new condition for success,since SUCCESS is updated to success as per new api contract */
            /** made code updates in line no 1903 on 03/09 added new condition for record.fileInfo and record.fileInfo.fileId,since fileId is now has to be fetched from fileInfo  as per new api contract  */
            // if (record.status === 'SUCCESS' && record.fileId && !record.store.toastSeen) {
            if (
              (record.status === 'SUCCESS' || record.status === 'success') &&
              record.fileInfo &&
              record.fileInfo.fileId &&
              !record?.store?.toastSeen
            ) {
              /**added condition for jobType in 1906,since we are no longer recieving action in jobs api response,using the jobType for condition check as per new api contract 10/03 */
              // if (record.action === 'EXPORT') {
              if (record.jobType === 'DATA_EXPORT') {
                this.downloadDockFile(
                  record.fileInfo.fileId,
                  record.store.urlParams,
                  record.streamId,
                  record._id
                );
              }
            }
          });
        }
      },
      (errRes) => {
        //this.pollingSubscriber.unsubscribe();
        if (
          errRes &&
          errRes.error &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify(
            'Failed to get Status of Docker.',
            'error'
          );
        }
      }
    );
  }
  downloadDockFile(fileId, fileName, streamId, dockId) {
    const params = {
      fileId,
      streamId: streamId,
      dockId: dockId,
      jobId: dockId,
      sidx: this.serachIndexId,
    };
    let payload = {
      store: {
        toastSeen: true,
        urlParams: fileName,
      },
    };
    this.service.invoke('attachment.file', params).subscribe(
      (res) => {
        let hrefURL = res.fileUrl + fileName;
        window.open(hrefURL, '_self');
        this.service
          .invoke('put.dockStatus', params, payload)
          .subscribe((res) => {});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllSettings() {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      interface: 'fullSearch',
    };
    this.isResultTemplateLoading = true;
    this.service.invoke('get.settingsByInterface', quaryparms).subscribe(
      (res) => {
        this.isResultTemplateLoading = false;
        if (res.groupSetting) {
          res.groupSetting.conditions.forEach((element) => {
            if (!this.isResultTemplate) {
              if (element.fieldValue === 'data') {
                if (element?.templateId?.length) {
                  this.isResultTemplate = true;
                } else {
                  this.isResultTemplate = false;
                }
              }
            }
          });
        }
      },
      (errRes) => {
        this.notificationService.notify(
          'Failed to fetch all Setting Informations',
          'error'
        );
      }
    );
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
    }, 100);
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isEmptyScreenLoading(isLoading) {
    this.isLoading = isLoading;
  }
}
