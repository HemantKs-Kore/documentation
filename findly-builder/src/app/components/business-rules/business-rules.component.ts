import { ElementRef, OnDestroy, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import * as _ from 'underscore';
import { relativeTimeRounding } from 'moment';
import { RangeSlider } from 'src/app/helpers/models/range-slider.model';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map } from 'rxjs/operators';
import { SortPipe } from 'src/app/helpers/sortPipe/sort-pipe';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { Subscription } from 'rxjs';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { UpgradePlanComponent } from 'src/app/helpers/components/upgrade-plan/upgrade-plan.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';
declare const $: any;
@Component({
  selector: 'app-business-rules',
  templateUrl: './business-rules.component.html',
  styleUrls: ['./business-rules.component.scss']
})
export class BusinessRulesComponent implements OnInit, OnDestroy {
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  addBusinessRulesRef: any;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  currentEditInex;
  submitted = false;
  skip=0
  rules = [];
  currentSugg: any = [];
  selectedSort = '';
  isAsc = true;
  loadingContent = true;
  selcectionObj: any = {
    selectAll: false,
    selectedItems: [],
  };
  totalRecord: number = 0;
  activeClose = false;
  sortObj: any = {}
  showSearch = false;
  searchRules = '';
  conditions = {
    string: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    date: ['equals', 'between', 'greaterThan', 'lessThan'],
    number: ['equals', 'between', 'greaterThan', 'lessThan'],
    trait: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    entity: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    keyword: ['contains', 'doesNotContain', 'equals', 'notEquals']
  }
  datePlaceHolders = {
    equals: ''
  }
  ruleOptions = {
    searchContext: ['recentSearches', 'currentSearch', 'traits', 'entity', 'keywords'],
    // pageContext: ['device', 'browser', 'currentPage', 'recentPages', 'signed', 'timeDateDay', 'session', 'timeSpentOnThePageSession'],
    pageContext: ['device', 'browser', 'currentPage', 'recentPages'],
    userContext: ['userType', 'userProfile', 'age', 'sex'],
    contextTypes: ['searchContext', 'pageContext', 'userContext'],
    dataTypes: ['string', 'date', 'number', 'trait', 'entity', 'keyword'],
    actions: ['boost', 'lower', 'hide', 'filter']
  }
  tagsArray: any = []
  defaultValuesObj: any = {
    contextType: 'searchContext',
    dataType: 'string',
    operator: 'contains',
    contextCategory: 'recentSearches',
    value: []
  }
  defaultOutcomeObj: any = {
    fieldDataType: 'string',
    fieldName: '',
    fieldId: '',
    outcomeOperator: 'contains',
    outcomeType: 'boost',
    outcomeValueType: 'static',
    outcomeValue: [],
    scale: 3,
  }
  addEditRuleObj: any = {
    ruleName: '',
    isRuleActive: true,
    rules: [],
    outcomes: []
  };
  rulesArrayforAddEdit: any = [];
  outcomeArrayforAddEdit: any = [];
  fieldAutoSuggestion: any = [];
  subscription: Subscription;
  queryPipelineId
  fieldWarnings: any = {
    NOT_INDEXED: 'Indexed property has been set to False for this field',
    NOT_EXISTS: 'Associated field has been deleted'
  }
  filterSystem: any = {
    'isRuleActiveFilter': 'all'
  }
  beforeFilterRules: any = [];
  isRuleActiveArr: any = [];
  private contextSuggestedImput: ElementRef;
  autoSuggestInputItems: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  componentType: string = 'configure';
  loadImageText: boolean = false;
  loadingContent1: boolean = false;
  sortedObject = {
    'type': 'fieldName',
    'position':'up',
    "value": 1,
  }
  filterObject={
    'type': '',
    'header':''
  }
  @ViewChild('contextSuggestedImput') set content(content: ElementRef) {
    if (content) {
      this.contextSuggestedImput = content;
    }
  }
  @ViewChildren('contextSuggestedImput') set queries(queries: ElementRef) {
    if (queries) {
      this.autoSuggestInputItems = queries;
    }
  }
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('addBusinessRules') addBusinessRules: KRModalComponent;
  @ViewChild('plans') plans: UpgradePlanComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private sortPipe: SortPipe,
    public inlineManual: InlineManualService,
    public mixpanel : MixpanelServiceService,
    private appSelectionService: AppSelectionService
  ) { }
  // ngAfterViewInit(){
  //   this.loadingContent=false;
  // }
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.loadRules();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
      this.loadRules();
    })
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
  }
  
  imageLoad() {
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
    if (!this.inlineManual.checkVisibility('RULES')) {
      this.inlineManual.openHelp('RULES')
      this.inlineManual.visited('RULES')
    }
  }
  loadRules() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId) {
        this.getDyanmicFilterData()
        this.getRules();
        this.getFieldAutoComplete(null, null);
      }
    }
  }
  searchByRule() {
    if (this.searchRules) {
      this.getRules(null, this.searchRules);
    } else {
      this.getRules();
      this.searchRules = ''
    }
  }
  paginate(event) {
    this.skip= event.skip
    this.filterRules(this.searchRules,'search',this.filterObject.type,this.filterObject.header,this.sortedObject.type,this.sortedObject.value,this.sortedObject.position)
    // this.getRules(event.skip, this.searchRules)
  }
  createNewRule() {
    this.addEditRuleObj = {
      ruleName: '',
      isRuleActive: true,
      rules: [],
      outcomes: []
    };
    this.addNewRule();
    this.addNewOutcome();
    this.openModalPopup();
    this.getFieldAutoComplete(null, null);
  }
  openModalPopup() {
    this.addBusinessRulesRef = this.addBusinessRules.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  prepereSliderObj(index, scale?) {
    return new RangeSlider(0, 5, 1, scale || 3, 'outcomeScale' + index)
  }
  valueEvent(val, outcomeObj) {
    outcomeObj.scale = val;
  }
  addNewRule() {
    const ruleObj: any = JSON.parse(JSON.stringify(this.defaultValuesObj));
    ruleObj.value = []
    this.rulesArrayforAddEdit.push(ruleObj)
  }
  addNewOutcome() {
    const ruleObj: any = JSON.parse(JSON.stringify(this.defaultOutcomeObj));
    ruleObj.sliderObj = this.prepereSliderObj(this.outcomeArrayforAddEdit.length);
    this.outcomeArrayforAddEdit.push(ruleObj)
  }
  editRule(rule) {
    this.addEditRuleObj = { ...rule };
    this.setDataForEdit(this.addEditRuleObj);
    this.openModalPopup();
    this.getFieldAutoComplete(null, null);
  }
  closeModalPopup() {
    this.submitted = false;
    this.rulesArrayforAddEdit = [];
    this.outcomeArrayforAddEdit = [];
    this.addBusinessRulesRef.close();
  }
  setDataForEdit(ruleObj) {
    if (ruleObj && ruleObj.rules && ruleObj.rules.length) {
      this.rulesArrayforAddEdit = JSON.parse(JSON.stringify(ruleObj.rules));
    } else {
      //this.addNewRule();
    }
    if (ruleObj && ruleObj.outcomes && ruleObj.outcomes.length) {
      const _outcoms = []
      let ruleObjOutcomes = JSON.parse(JSON.stringify(ruleObj.outcomes));
      ruleObjOutcomes.forEach((outcome, i) => {
        const tempObj: any = outcome
        tempObj.sliderObj = this.prepereSliderObj(i, (outcome.scale || 3));
        _outcoms.push(tempObj);
      });
      this.outcomeArrayforAddEdit = _outcoms;
    } else {
      this.addNewOutcome();
    }
  }
  getRulesArrayPayload(rules) {
    const _verifiedRules = [];
    if (rules && rules.length) {
      rules.forEach(rule => {
        const tempObj: any = {
          contextCategory: rule.contextCategory,
          contextType: rule.contextType,
          operator: rule.operator,
          dataType: rule.dataType,
          value: rule.value,
        }
        _verifiedRules.push(tempObj);
      });
    }
    return _verifiedRules;
  }
  getOutcomeArrayPayload(outcomes) {
    const _verifiedRules = [];
    if (outcomes && outcomes.length) {
      outcomes.forEach(outcome => {
        const tempObj: any = {
          outcomeType: outcome.outcomeType,
          scale: outcome.scale,
          fieldName: outcome.fieldName,
          fieldId: outcome.fieldId,
          fieldDataType: outcome.fieldDataType,
          outcomeOperator: outcome.outcomeOperator,
          outcomeValueType: outcome.outcomeValueType,
          outcomeValue: outcome.outcomeValue
        }
        _verifiedRules.push(tempObj);
      });
    }
    return _verifiedRules;
  }
  removeRule(index) {
    this.rulesArrayforAddEdit.splice(index, 1);
  }
  removeOutcome(index) {
    this.outcomeArrayforAddEdit.splice(index, 1);
  }
  removeTag(value, tags, index) {
    value.splice(index, 1);
  }
  openDateTimePicker(ruleObj, index) {
    setTimeout(() => {
      if (ruleObj && ruleObj.operator === 'between') {
        $('#rangePicker_' + index).click();
      } else {
        $('#datePicker_' + index).click();
      }
    })
  }
  onDatesUpdated(event, ruleObj) {
    if (!ruleObj.value) {
      ruleObj.value = [];
    }
    if (ruleObj && ruleObj.operator === 'between') {
      if (event.startDate && event.endDate) {
        moment.utc();
        const date = [];
        const startDate = moment.utc(event.startDate).format();
        const endDate = moment.utc(event.endDate).format();
        date.push(startDate);
        date.push(endDate)
        ruleObj.value.push(date)
      }
    } else {
      if (event.startDate) {
        const date = moment.utc(event.startDate).format();
        ruleObj.value.push(date)
      }
    }
  }
  buildCurrentContextSuggetions(ruleObj) {
    const _ruleOptions = JSON.parse(JSON.stringify(this.ruleOptions))
    const mainContext = _ruleOptions.contextTypes;
    if ($('.mat_autofocus_dropdown').length) {
      if (ruleObj.outcomeValueType == 'static' || (ruleObj.outcomeValueType == 'dynamic' && ruleObj.newValue && (ruleObj.newValue.search(/\./) !== -1))) {
        if ($('.mat_autofocus_dropdown')[0]) {
          $('.mat_autofocus_dropdown')[0].style.display = 'none';
        }
      } else {
        if ($('.mat_autofocus_dropdown')[0]) {
          $('.mat_autofocus_dropdown')[0].style.display = 'block';
        }
      }
    }
    this.currentSugg = [];
    if (ruleObj && ruleObj.newValue) {
      const selectedContextSelections = ruleObj.newValue.split('.');
      if (selectedContextSelections && selectedContextSelections.length) {
        const selectedContext = selectedContextSelections[0];
        if (selectedContext && _ruleOptions[selectedContext]) {
          if (selectedContextSelections.length === 3) {
            this.currentSugg = [];
          } else if (selectedContextSelections.length === 2) {
            let filteredValues = _ruleOptions[selectedContextSelections[0]] || [];
            filteredValues = _ruleOptions[selectedContextSelections[0]].filter(it => {
              if (selectedContextSelections[1]) {
                return it.toLowerCase().includes(selectedContextSelections[1].toLowerCase());
              } else {
                return true;
              }
            });
            this.currentSugg = filteredValues;
          } else if (selectedContextSelections.length === 1 && _ruleOptions[selectedContextSelections[0]]) {
            this.currentSugg = _ruleOptions[selectedContextSelections[0]];
          } else {
            this.currentSugg = [];
          }
        } else {
          const filteredValues = mainContext.filter(it => {
            return it.toLowerCase().includes(ruleObj.newValue.toLowerCase());
          });
          this.currentSugg = filteredValues;
        }
      } else {
        this.currentSugg = mainContext;
      }
    } else {
      this.currentSugg = mainContext;
    }
  }
  filterTable(source, headerOption) {
    console.log(this.rules, source, headerOption);
    // this.filterSystem.isRuleActiveFilter = 'all';

   
    switch (headerOption) {
      case 'isRuleActive': { this.filterSystem.isRuleActiveFilter = source; break; };
    };
    this.filterObject = {
      type: source,
      header: headerOption
    }
    this.filterRules(null,null,source, headerOption);
  }
  filterRules(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?){  
    // fieldsFilter(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?)  
    // this.loadingContent = true;
    if(sortValue){
      this.sortedObject = {
        type : sortHeaderOption,
        value : sortValue,
        position: navigate
      }
    }

    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      offset: 0,
      limit: 10
    };
    let request:any={}
    if(!sortValue){
      request = {
        "sort":{
          "ruleName" : 1,
        }    
    }   
    }
    else if(sortValue){
      const sort :any ={}
      request= {
        sort
      }
    }
    else {
    request={}
    }
      
    request.isRuleActive = this.filterSystem.isRuleActiveFilter;
    request.search = this.searchRules;
    if (request.isRuleActive == 'all') {
     delete  request.isRuleActive;
    }
    if (this.searchRules === '') {
     delete request.search;
    }
    if(sortValue){  
      this.getSortIconVisibility(sortHeaderOption,navigate);
       //Sort start
       if(sortHeaderOption === 'ruleName' ){
        request.sort.ruleName = sortValue
      }
      if(sortHeaderOption === 'isRuleActive' ){
        request.sort.isRuleActive = sortValue
      }
    // end
    }
    this.getRules(searchValue,searchSource, source,headerOption, sortHeaderOption,sortValue,navigate,request);
    this.getDyanmicFilterData()
  }
  // filterRules(source, headerOption) {

  //   const quaryparms: any = {
  //     searchIndexID: this.serachIndexId,
  //     indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
  //     queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
  //   };
    
  //   const request:any = {   
  //     "sort":{
  //       ruleName : 1,
  //     }
  //   }
  //   if (headerOption === 'isRuleActive' && source !== 'all') {
  //     request.isRuleActive = source
  //   }

  //   else if (headerOption === 'search') {
  //     request.search = source
  //   }
  //   // if(this.searchRules){
  //   //   payload.search = this.searchRules
  //   // }   
  //   let serviceId = 'post.businessRules'
  //   this.service.invoke(serviceId,quaryparms,request).subscribe(res => {
  //     this.rules = [];
  //     this.rules = res.rules;     
  //     if (headerOption === 'search') {
  //       this.getDyanmicFilterData(source);
  //     }
  //   })
  //   // if (!this.beforeFilterRules.length) {
  //   //   this.beforeFilterRules = JSON.parse(JSON.stringify(this.rules));
  //   // }
  //   // let tempRules = this.beforeFilterRules.filter((field: any) => {
  //   //   if (source !== 'all') {
  //   //     if (headerOption === 'isRuleActive') {
  //   //       if (field.isRuleActive === source) {
  //   //         return field;
  //   //       }
  //   //     }
  //   //   }
  //   //   else {
  //   //     return field;
  //   //   }
  //   // });

  //   // this.rules = JSON.parse(JSON.stringify(tempRules));
  // }
  sortRules(type?,navigate?, value?){  
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      offset:  this.skip || 0,
      limit: 100
    };
    const sort :any ={}
      const request:any = {
        sort    
    }   
    this.selectedSort = type;
    if (this.selectedSort !== type) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }  
    if(type === 'ruleName' ){
      request.sort.ruleName = value
    }
    if(type === 'isRuleActive' ){
      request.sort.isRuleActive = value
    }
   
    
    let serviceId = 'post.businessRules'
    this.service.invoke(serviceId,quaryparms,request).subscribe(res => {
      this.rules = res.rules;        
    },
    errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  getDyanmicFilterData(search?) {
    this.isRuleActiveArr = [];
    const quaryparms: any = {
      searchIndexId: this.serachIndexId
    };
    const request :any = {
      moduleName: "rules",
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id
    };
    if (search) {
      request.search = search
    }
    this.service.invoke('post.filters', quaryparms, request).subscribe(res => {
      console.log(res, 'Filters')
      this.isRuleActiveArr = [...res.isRuleActive];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get filters');
    });
    
  }
  selected(event: MatAutocompleteSelectedEvent, ruleObj, index): void {
    const newSelectedValue = event.option.viewValue;
    const text = this.autoSuggestInputItems._results[index].nativeElement.value;
    // const text = this.autoSuggestInputItems._re[].nativeElement.value;
    const selectedContextValues = (text || '').split('.') || [];
    selectedContextValues.push(newSelectedValue);
    if (selectedContextValues && selectedContextValues.length) {
      let newVal = ''
      selectedContextValues.forEach(element => {
        if (element) {
          if (newVal) {
            newVal = newVal + '.' + element;
          } else {
            newVal = element;
          }
        }
      });
      if (newVal.split('.').length > 1) {
        newVal = newVal.split('.')[1];
      }
      this.autoSuggestInputItems._results[index].nativeElement.value = newVal + '.';
      ruleObj.newValue = newVal + '.';
      if ($('.mat_autofocus_dropdown')[0]) {
        $('.mat_autofocus_dropdown')[0].style.display = 'none';
      }
    }
  }
  addRules(event: MatChipInputEvent, ruleObj, i) {
    const input = event.input;
    const value = event.value;
    if (ruleObj && ruleObj.dataType === 'number') {
      if (ruleObj.operator == 'between') {
        const range = value.split('-');
        const values: any = [];
        if (range && range.length === 2) {
          range.forEach((rang) => {
            const numericVal = parseInt(rang.trim(), 10) || 0;
            values.push(numericVal);
          });
          ruleObj.value.push(values);
        } else {
          this.notificationService.notify('Provide range in proper format, Ex: 111-121', 'error')
        }
      } else {
        if (value) {
          ruleObj.value.push(parseInt(value.trim(), 10) || 0);
        }

      }
    } else if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(), ruleObj.value)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        ruleObj.value.push(value);
      }
    }
    if (input) {
      input.value = '';
    }
    if ((this.suggestedInput || {}).nativeElement) {
      (this.suggestedInput || {}).nativeElement.value = '';
    }
  }
  addOutcome(event: MatChipInputEvent, ruleObj, index) {
    const input = event.input;
    const value = event.value;
    if (!ruleObj.fieldName) {
      this.notificationService.notify('Please select valid field', 'error');
      return
    }
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(), ruleObj.outcomeValue)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        ruleObj.outcomeValue.push(value);
      }
    }
    if (input) {
      input.value = '';
    }
    ((this.autoSuggestInputItems._results[index || 0] || {}).nativeElement || {}).value = '';
    if ((this.suggestedInput || {}).nativeElement) {
      (this.suggestedInput || {}).nativeElement.value = '';
    }
  }
  selectedTag(data: MatAutocompleteSelectedEvent, outcomeObj) {
    console.log(data.option.value);
    outcomeObj.fieldDataType = data.option.value.fieldDataType
    outcomeObj.fieldName = data.option.value.fieldName
    outcomeObj.fieldId = data.option.value._id
    if ((this.suggestedInput || {}).nativeElement) {
      (this.suggestedInput || {}).nativeElement.value = '';
    }
    this.fieldAutoSuggestion = [];
  }
  selectField(data, outcomeObj) {
    outcomeObj.fieldDataType = data.fieldDataType
    outcomeObj.fieldName = data.fieldName
    outcomeObj.fieldId = data._id;
    //this.fieldAutoSuggestion = [];
  }
  checkDuplicateTags(suggestion: string, alltTags): boolean {
    return alltTags.every((f) => f !== suggestion);
  }
  ruleSelection(ruleObj, value, key) {
    if (key === 'contextCategory') {
      ruleObj.contextCategory = value;
      if (ruleObj.contextCategory == 'traits') {
        ruleObj.dataType = 'trait';
      } else if (ruleObj.contextCategory == 'entity') {
        ruleObj.dataType = 'entity';
      } else if (ruleObj.contextCategory == 'keywords') {
        ruleObj.dataType = 'keyword';
      } else {
        ruleObj.dataType = 'string';
      }
    }
    if (key === 'contextType') {
      ruleObj.contextType = value;
      ruleObj.contextCategory = this.ruleOptions[value][0];
      if (ruleObj.contextType === 'userContext') {
        ruleObj.contextCategory = '';
      }
    }
    if (key === 'operator') {
      if (ruleObj.operator !== value) {
        ruleObj.value = [];
      }
      ruleObj.operator = value;
    }
    if (key === 'dataType') {
      if (ruleObj.dataType !== value) {
        ruleObj.operator = this.conditions[value][0];
        ruleObj.value = [];
      }
      ruleObj.dataType = value;
    }
  }
  outcomeSclection(outcome, value, key) {
    if (key === 'outcomeType') {
      outcome.outcomeType = value;
    }
    if (key === 'outcomeOperator') {
      outcome.outcomeOperator = value;
    }
    if (key === 'outcomeValueType') {
      outcome.outcomeValue = [];
      outcome.outcomeValueType = value;
    }
    console.log("filter data", this.fieldAutoSuggestion)
  }
  checkUncheckfacets(rule) {
    const selectedElements = $('.selectRuleCheckBoxDiv:checkbox:checked');
    const allElements = $('.selectRuleCheckBoxDiv');
    if (selectedElements.length === allElements.length) {
      // $('#selectAllRules')[0].checked = true;
      this.selcectionObj.selectAll = true
    } else {
      // $('#selectAllRules')[0].checked = false;
      this.selcectionObj.selectAll = false
    }
    const element = $('#' + rule._id);
    const addition = element[0].checked
    this.addRemoveRuleFromSelection(rule._id, addition);
  }
  addRemoveRuleFromSelection(ruleId?, addtion?, clear?) {
    if (clear) {
      const allfacets = $('.selectRuleCheckBoxDiv');
      $.each(allfacets, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = false;
        }
      });
      this.selcectionObj.selectedItems = {};
      this.selcectionObj.selectedCount = 0;
      this.selcectionObj.selectAll = false;
      // $('#checkbox-1').checked = false;
    } else {
      if (ruleId) {
        if (addtion) {
          this.selcectionObj.selectedItems[ruleId] = {};
        } else {
          if (this.selcectionObj.selectedItems[ruleId]) {
            delete this.selcectionObj.selectedItems[ruleId]
          }
        }
      }
      this.selcectionObj.selectedCount = Object.keys(this.selcectionObj.selectedItems).length;
      if (this.selcectionObj.selectedCount === this.rules.length) {
        this.selcectionObj.selectAll = true;
        //$('#checkbox-1').checked = true;
      }
    }
  }
  selectAllFromPartial() {
    this.selcectionObj.selectAll = true;
    this.selectAll();
  }
  selectAll(unselectAll?) {
    const allfacets = $('.selectRuleCheckBoxDiv');
    if (allfacets && allfacets.length) {
      $.each(allfacets, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = unselectAll ? false : this.selcectionObj.selectAll;
          const ruleId = $(element)[0].id
          this.addRemoveRuleFromSelection(ruleId, $(element)[0].checked);
        }
      });
    };
    // if (unselectAll) {
    //   $('#selectAllRules')[0].checked = false;
    // }
  }
  validateRules() {
    if (this.addEditRuleObj && this.addEditRuleObj.ruleName.length) {
      this.submitted = false;
      return true;
    }
    else {
      return false;
    }
  }
  createRule() {
    this.submitted = true;
    if (this.validateRules()) {
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        queryPipelineId: this.queryPipelineId,
        indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
      };
      const payload: any = {
        ruleName: this.addEditRuleObj.ruleName,
        isRuleActive: this.addEditRuleObj.isRuleActive,
        rules: this.getRulesArrayPayload(this.rulesArrayforAddEdit) || [],
        outcomes: this.getOutcomeArrayPayload(this.outcomeArrayforAddEdit) || []
      }
      // if (!payload.rules.length) {
      //   this.errorToaster(null, 'Atleast one condition is required');
      //   return;
      // }
      if (!payload.outcomes.length) {
        this.errorToaster(null, 'Atleast one outcome is required');
        return;
      }
      this.service.invoke('create.businessRules', quaryparms, payload).subscribe(res => {
        if (this.filterSystem.isRuleActiveFilter == 'all') {
          this.rules.push(res);
        }
        if (this.searchRules) {
          this.getRules(null, this.searchRules);
        }
        this.beforeFilterRules.push(res);
        this.isRuleActiveArr = [];
        this.beforeFilterRules.forEach(element => {
          this.isRuleActiveArr.push(element.isRuleActive);
        });
        this.isRuleActiveArr = [...new Set(this.isRuleActiveArr)];
        this.filterTable(this.filterSystem.isRuleActiveFilter, 'isRuleActive');
        this.closeModalPopup();
        this.notificationService.notify('Added successfully', 'success');
        this.mixpanel.postEvent('Business Rule- Created',{})
        // console.log('MIXPANNEL BR CREATE')
      }, errRes => {
        if (errRes && errRes.error && errRes.error.errors[0].code == 'FeatureAccessLimitExceeded') {
          this.closeModalPopup();
          this.errorToaster(errRes, errRes.error.errors[0].msg);
          this.plans.openChoosePlanPopup('choosePlans', { show: true, msg: errRes.error.errors[0].msg });
        } else {
          this.errorToaster(errRes, 'Failed to create rules');
        }
      });
    }
    else {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }
  getFieldAutoComplete(event, outcomeObj) {
    let query: any = '';
    if (event) {
      query = $(event.currentTarget).val();
    }
    // if (/^\d+$/.test(query)) {
    //   query = query.parseInt();
    // }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      category: 'rules',
      query
    };
    this.service.invoke('get.getFieldAutocompleteIndices', quaryparms).subscribe(res => {
      console.log("fieldAutoSuggestion", res)
      this.fieldAutoSuggestion = res || [];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  getRules(searchValue?,searchSource?,source?,headerOption?,sortHeaderOption?,sortValue?,navigate?,request?) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      offset:  this.skip || 0,
      limit: 10
    };
    let payload:any = {}
    if(!sortHeaderOption && !headerOption){
       payload ={
        "sort": {
            "ruleName": 1,
        } 
      }
    }
    else{
      payload = request
    }
   
    let serviceId = 'post.businessRules';
    if (this.searchRules) {
     payload.search = this.searchRules;
      
    }
    this.service.invoke(serviceId, quaryparms,payload).subscribe(res => {
      this.rules = res.rules || [];
      this.totalRecord = res.totalCount || 0;
      this.beforeFilterRules = JSON.parse(JSON.stringify(this.rules));
      this.loadingContent = false;
      // if (this.rules.length) {
      //   this.rules.forEach(element => {
      //     this.isRuleActiveArr.push(element.isRuleActive);
      //   });
      //   this.isRuleActiveArr = [...new Set(this.isRuleActiveArr)];
      // }
      this.addRemoveRuleFromSelection(null, null, true);
      if (res && res.rules && res.rules.length > 0) {
        this.loadingContent = false;
        this.loadingContent1 = false;
      }
      else {
        this.loadingContent1 = true;
        //if(!this.inlineManual.checkVisibility('RULES')){
        //  this.inlineManual.openHelp('RULES')
        //  this.inlineManual.visited('RULES')
        //}
      }
    }, errRes => {
      this.loadingContent = false;
      this.loadingContent1 = false;
      this.errorToaster(errRes, 'Failed to get rules');
    });
  }
  getRukeById(rule) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      ruleId: rule._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      limit: 100
    };
    this.service.invoke('get.businessRuleById', quaryparms).subscribe(res => {
      console.log(res);
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get rule');
    });
  }
  updateRule(rule) {
    this.submitted = true;
    if (this.validateRules()) {
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        queryPipelineId: this.queryPipelineId,
        indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
        ruleId: rule._id,
      };
      const payload: any = {
        ruleName: this.addEditRuleObj.ruleName,
        isRuleActive: this.addEditRuleObj.isRuleActive,
        rules: this.getRulesArrayPayload(this.rulesArrayforAddEdit),
        outcomes: this.getOutcomeArrayPayload(this.outcomeArrayforAddEdit)
      }
      // if (!payload.rules.length) {
      //   this.errorToaster(null, 'Atleast one condition is required');
      //   return;
      // }
      if (!payload.outcomes.length) {
        this.errorToaster(null, 'Atleast one outcome is required');
        return;
      }
      this.service.invoke('update.businessRule', quaryparms, payload).subscribe(res => {
        const editRule = _.findIndex(this.rules, (pg) => {
          return pg._id === rule._id;
        })
        this.rules[editRule] = res;
        if (this.searchRules) {
          this.getRules(null, this.searchRules);
        }
        this.beforeFilterRules[editRule] = res;
        this.isRuleActiveArr = [];
        this.beforeFilterRules.forEach(element => {
          this.isRuleActiveArr.push(element.isRuleActive);
        });
        this.isRuleActiveArr = [...new Set(this.isRuleActiveArr)];
        this.filterTable(this.filterSystem.isRuleActiveFilter, 'isRuleActive');
        this.notificationService.notify('Updated Successfully', 'success');
        this.closeModalPopup();
        this.mixpanel.postEvent('Business Rule- Updated',{})
        // console.log('MIXPANNEL BR UPDATE')
      }, errRes => {
        this.errorToaster(errRes, 'Failed to update rule');
      });
    }
  }
  deleteRulePop(rule, i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        // title: 'Delete rule',
        // text: 'Are you sure you want to delete selected rule?',
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected rule will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteRule(rule, i, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  deleteMultiePop() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        // title: 'Delete selected rules',
        // text: 'Are you sure you want to delete selected rules?',
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected rules will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteSelectedRules(dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  deleteSelectedRules(dialogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      limit: 100
    };
    const payload: any = {
      rules: []
    }
    if (this.selcectionObj && this.selcectionObj.selectedItems) {
      const selectedItems = Object.keys(this.selcectionObj.selectedItems);
      if (selectedItems && selectedItems.length) {
        selectedItems.forEach((ruleId, i) => {
          const tempobj = {
            _id: ruleId
          }
          payload.rules.push(tempobj);
        });
      }
    }
    this.service.invoke('delete.businessRulesBulk', quaryparms, payload).subscribe(res => {
      if (dialogRef && dialogRef.close) {
        dialogRef.close();
      }
      this.getRules(null, this.searchRules);
      this.notificationService.notify('Deleted Successfully', 'success');
      this.mixpanel.postEvent('Business Rule - Deleted',{})
      // console.log('MIXPANNEL BR DELETE')
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete rule');
    });
  }
  deleteRule(rule, i, dilogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      ruleId: rule._id,
      limit: 100
    };
    this.service.invoke('delete.businessRule', quaryparms).subscribe(res => {
      const deleteIndex = _.findIndex(this.rules, (pg) => {
        return pg._id === rule._id;
      })
      this.rules.splice(deleteIndex, 1);
      const deleteIndex1 = _.findIndex(this.beforeFilterRules, (pg) => {
        return pg._id === rule._id;
      })
      this.beforeFilterRules.splice(deleteIndex1, 1);
      if (!this.rules.length) {
        this.isRuleActiveArr = [];
        this.beforeFilterRules.forEach(element => {
          this.isRuleActiveArr.push(element.isRuleActive);
          this.isRuleActiveArr = [...new Set(this.isRuleActiveArr)];
          this.filterTable('all', 'isRuleActive');
        });
      }
      if (dilogRef && dilogRef.close) {
        dilogRef.close();
      }
      this.notificationService.notify('Deleted Successfully', 'success');
      this.mixpanel.postEvent('Business Rule - Deleted',{})
      // console.log('MIXPANNEL BR DELETE')
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete rule');
    });
  }
  toggleSearch() {
    if (this.showSearch && this.searchRules) {
      this.searchRules = '';
    }
    this.showSearch = !this.showSearch
    if (this.showSearch) {
      $('#searchInput').focus();
    }
  };
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "ruleName": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "isRuleActive": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      
    }
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortByApi(sort){
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var checkSortValue = 1;
    var naviagtionArrow ='';
    if(this.isAsc){
      naviagtionArrow ='up';
      checkSortValue = 1;
    }
    else{
      naviagtionArrow ='down';
      checkSortValue = -1;
    }
    this.filterRules(null,null,null,null,sort,checkSortValue,naviagtionArrow)
  }
  // sortBy(sort) {
  //   const data = this.rules.slice();
  //   this.selectedSort = sort;
  //   if (this.selectedSort !== sort) {
  //     this.isAsc = true;
  //   } else {
  //     this.isAsc = !this.isAsc;
  //   }
  //   const sortedData = data.sort((a, b) => {
  //     const isAsc = this.isAsc;
  //     switch (sort) {
  //       case 'ruleName': return this.compare(a.ruleName, b.ruleName, isAsc);
  //       case 'isRuleActive': return this.compare(a.isRuleActive, b.isRuleActive, isAsc);
  //       default: return 0;
  //     }
  //   });
  //   this.rules = sortedData;
  // }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  ngOnDestroy() {
    // this.subscription ? this.subscription.unsubscribe() : false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  checkIsArray(value) {
    if (Array.isArray(value)) {
      return true;
    } else {
      return false;
    }
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchRules = '';
      this.activeClose = false;
      this.getRules(null, this.searchRules)
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  modifyFieldWarningMsg(warningMessage) {
    let index = warningMessage.indexOf("changed");
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }
}
