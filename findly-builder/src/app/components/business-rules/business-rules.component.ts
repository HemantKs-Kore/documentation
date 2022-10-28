import { ElementRef, OnDestroy, ViewChild, ViewChildren } from '@angular/core';
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
import { RangeSlider } from 'src/app/helpers/models/range-slider.model';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SortPipe } from 'src/app/helpers/sortPipe/sort-pipe';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { UpgradePlanComponent } from 'src/app/helpers/components/upgrade-plan/upgrade-plan.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { DomSanitizer } from '@angular/platform-browser';
declare const $: any;
declare global {
  interface String {
    replaceBetween: (start: any, end: any, what: any) => any;
  }
}
@Component({
  selector: 'app-business-rules',
  templateUrl: './business-rules.component.html',
  styleUrls: ['./business-rules.component.scss']
})
export class BusinessRulesComponent implements OnInit, OnDestroy {
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  defaultValuesObj: any = {
    contextType: 'searchContext',
    dataType: 'string',
    operator: 'contains',
    contextCategory: 'recentSearches',
    value: []
  }
  ruleOptions = {
    searchContext: ['recentSearches', 'currentSearch', 'traits', 'entity', 'keywords'],
    pageContext: ['device', 'browser', 'currentPage', 'recentPages'],
    userContext: ['userType', 'userProfile', 'age', 'sex'],
    contextTypes: ['searchContext', 'pageContext', 'userContext'],
    dataTypes: ['string', 'date', 'number', 'trait', 'entity', 'keyword'],
    actions: ['boost', 'lower', 'hide', 'filter']
  }
  rulesArray = [{}, {}]
  addBusinessRulesRef: any;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  currentEditInex;
  submitted = false;
  input_1: any = [];
  input_2: any = [];
  removedCon: boolean = false;
  iconImageCon: boolean = false;
  iconImageOut: boolean = false;
  skip = 0;
  rules = [];
  allRules = [];
  currentSugg: any = [];
  selectedSort = '';
  isAsc = true;
  loadingContent = true;
  selcectionObj: any = {
    selectAll: false,
    selectedItems: [],
    ruleType: 'contextual',
    supportURL: 'https://docs.kore.ai/searchassist/concepts/personalizing-results/personalizing-results-ranking/#Configuring_Business_Rules'
  };
  totalRecord: number = 0;
  activeClose = false;
  sortObj: any = {}
  showSearch = false;
  searchRules = '';
  conditions = {
    string: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    date: ['equals', 'between', 'greaterThan', 'lessThan'],
    number: ['equals', 'between', 'greaterThan', 'lessThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'],
    trait: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    entity: ['contains', 'doesNotContain', 'equals', 'notEquals'],
    keyword: ['contains', 'doesNotContain', 'equals', 'notEquals']
  }
  datePlaceHolders = {
    equals: ''
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
    ruleType: 'contextual',
    isRuleActive: true,
    rules: [],
    outcomes: [],
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
    'position': 'up',
    "value": 1,
  }
  filterObject = {
    'type': '',
    'header': ''
  }
  sys_entities: any = [];
  entityDefaultColors: any = [{ type: 'system_defined', color: '#135423' }, { type: 'custom', color: '#803C25' }, { type: 'index_field', color: '#381472' }];
  entityFields = { startIndex: 0, endIndex: 0, entityId: '', word: '' };
  entityObj: any = { entities: [], sentence: '', colorSentence: '', isEditable: false, legends:[] };
  inputSentence: any;
  selectEditIndex: number = 0;
  nlpAnnotatorObj: any = { showEntityPopup: false, isEditPage: false, entities: { entityId: '', entityName: '', entityType: 'index_field', fieldId: '', field_name: '', isEditable: false }, searchEntity: '', annotator: [], Legends: [] };
  search_field:String='';
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
    public mixpanel: MixpanelServiceService,
    private appSelectionService: AppSelectionService,
    private sanitizer: DomSanitizer
  ) { }

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
        this.getFields();
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
    this.skip = event.skip
    this.filterRules(this.searchRules, 'search', this.filterObject.type, this.filterObject.header, this.sortedObject.type, this.sortedObject.value, this.sortedObject.position)
    // this.getRules(event.skip, this.searchRules)
  }
  createNewRule() {
    this.addEditRuleObj = {
      ruleName: '',
      isRuleActive: true,
      ruleType: this.selcectionObj.ruleType,
      rules: [],
      outcomes: []
    };
    this.addNewOutcome();
    this.openModalPopup();
    if (this.selcectionObj.ruleType === 'contextual') {
      this.addNewRule();
    }
  }
  openModalPopup() {
    this.addBusinessRulesRef = this.addBusinessRules.open();
    setTimeout(() => {
      this.perfectScroll?.directiveRef?.update();
      this.perfectScroll?.directiveRef?.scrollToTop();
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
    this.rulesArrayforAddEdit.push(ruleObj);
    this.removedCon = false;
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
  }
  closeModalPopup() {
    if($("#contentText").length>0){
      $("#contentText")[0].style.borderColor='';
    } 
    this.addBusinessRulesRef.close();
    this.submitted = false;
    this.rulesArrayforAddEdit = [];
    this.outcomeArrayforAddEdit = [];
    this.removedCon = false;
    this.createTag(false, false);
    this.nlpAnnotatorObj = { showEntityPopup: false, isEditPage: false, entities: { entityId: '', entityName: '', entityType: 'index_field', fieldId: '', field_name: '', isEditable: false }, searchEntity: '', annotator: [], Legends: [] };
    this.entityFields = { startIndex: 0, endIndex: 0, entityId: '', word: '' };
    this.entityObj = { entities: [], sentence: '', colorSentence: '', isEditable: false,legends:[] };
    this.inputSentence = '';
  }
  setDataForEdit(ruleObj) {
    if (ruleObj && ruleObj.rules && ruleObj.rules.length) {
      if (this.selcectionObj?.ruleType === 'contextual') {
        this.rulesArrayforAddEdit = JSON.parse(JSON.stringify(ruleObj.rules));
      }
      else if (this.selcectionObj?.ruleType === 'nlp') {
        for (let item of ruleObj.rules) {
          this.createColorSentence(item);
        }
      }
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
    this.removedCon = true;
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
          }
           else {
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
    let entitiesArray = [];
    for (let annotator of this.nlpAnnotatorObj.annotator) {
      for (let entity of annotator.entities) {
        const entityObj = this.sys_entities.filter(item => item._id === entity.entityId);
        if (!entitiesArray.includes(entityObj[0].entityName)) entitiesArray.push(entityObj[0].entityName);
      }
    }
    this.currentSugg = [...this.currentSugg, ...entitiesArray];
  }
  filterTable(source, headerOption) {
    // this.filterSystem.isRuleActiveFilter = 'all';


    switch (headerOption) {
      case 'isRuleActive': { this.filterSystem.isRuleActiveFilter = source; break; };
    };
    this.filterObject = {
      type: source,
      header: headerOption
    }
    this.filterRules(null, null, source, headerOption);
  }
  filterRules(searchValue?, searchSource?, source?, headerOption?, sortHeaderOption?, sortValue?, navigate?) {
    // fieldsFilter(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?)  
    // this.loadingContent = true;
    if (sortValue) {
      this.sortedObject = {
        type: sortHeaderOption,
        value: sortValue,
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
    let request: any = {}
    if (!sortValue) {
      request = {
        "sort": {
          "ruleName": 1,
        }
      }
    }
    else if (sortValue) {
      const sort: any = {}
      request = {
        sort
      }
    }
    else {
      request = {}
    }

    request.isRuleActive = this.filterSystem.isRuleActiveFilter;
    request.search = this.searchRules;
    if (request.isRuleActive == 'all') {
      delete request.isRuleActive;
    }
    if (this.searchRules === '') {
      delete request.search;
    }
    if (sortValue) {
      this.getSortIconVisibility(sortHeaderOption, navigate);
      //Sort start
      if (sortHeaderOption === 'ruleName') {
        request.sort.ruleName = sortValue
      }
      if (sortHeaderOption === 'isRuleActive') {
        request.sort.isRuleActive = sortValue
      }
      // end
    }
    this.getRules(searchValue, searchSource, source, headerOption, sortHeaderOption, sortValue, navigate, request);
    this.getDyanmicFilterData()
  }
  sortRules(type?, navigate?, value?) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      offset: this.skip || 0,
      limit: 100
    };
    const sort: any = {}
    const request: any = {
      sort
    }
    this.selectedSort = type;
    if (this.selectedSort !== type) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    if (type === 'ruleName') {
      request.sort.ruleName = value
    }
    if (type === 'isRuleActive') {
      request.sort.isRuleActive = value
    }


    let serviceId = 'post.businessRules'
    this.service.invoke(serviceId, quaryparms, request).subscribe(res => {
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
    const request: any = {
      moduleName: "rules",
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id
    };
    if (search) {
      request.search = search
    }
    this.service.invoke('post.filters', quaryparms, request).subscribe(res => {
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
        const isEntity = this.sys_entities.filter(item => item.entityName === value.slice(0, -1));
        if (isEntity.length > 0) {
          let val = '';
          if (['system_defined', 'custom'].includes(isEntity[0].entityType)) {
            val = `searchContext.entity.${isEntity[0].entityName}`;
          }
          else {
            val = `searchContext.indexedFieldEntities.${isEntity[0].entityName}`;
          }
          ruleObj.outcomeValue.push(val);
        }
        else {
          ruleObj.outcomeValue.push(value);
        }
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
    // console.log(data.option.value);
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
    this.search_field = '';
    $("#responseFields")[0].style.borderColor="";
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
      ruleObj.value=[];
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

  validateCon() {
    if (this.removedCon == false) {
      for (let j = 0; j < this.rulesArrayforAddEdit.length; j++) {
        for (let i = 0; i <= this.rulesArrayforAddEdit[j].value.length; i++) {
          if (this.rulesArrayforAddEdit[j].value.length == 0) {
            $("#ConditionInput").parent('div').css("border-color", "#DD3646");
            this.iconImageCon = true;
            return false;
          } else {
            this.iconImageCon = false;
            // this.submitted=false;   
            return true;
          }
        }
      }
    }
    else {
      this.iconImageCon = false;
      // this.submitted=false;   
      return true;
    }
  }
  validateOut() {
    for (let i = 0; i < this.outcomeArrayforAddEdit.length; i++) {
      for (let j = 0; j <= this.outcomeArrayforAddEdit[i].outcomeValue.length; j++) {
        if(this.outcomeArrayforAddEdit[i].fieldId===''){
          $("#responseFields")[0].style.borderColor="#DD3646";
        }       
        else if (!this.outcomeArrayforAddEdit[i].outcomeValue.length) {
          $("#OutcomeInput").parent('div').css("border-color", "#DD3646");
          this.iconImageOut = true;
          return false;
        }
        else {
          this.iconImageOut = false;
          this.submitted = false;
          return true;
        }
      }
    }
  }
  //create business rule
  createRule() {
    this.submitted = true;
    let isValidate: boolean;
    if (this.selcectionObj?.ruleType === 'nlp') {
      isValidate = this.validateRules() && this.validateOut() && this.emptyAnnotatorValidate() && this.validateLegends();
    }
    else if (this.selcectionObj?.ruleType === 'contextual') {
      isValidate = this.validateRules() && this.validateCon() && this.validateOut()
    }
    if (isValidate) {
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        queryPipelineId: this.queryPipelineId,
        indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
      };
      let payload: any = { ruleName: this.addEditRuleObj.ruleName, isRuleActive: this.addEditRuleObj.isRuleActive, ruleType: this.selcectionObj?.ruleType, outcomes: this.getOutcomeArrayPayload(this.outcomeArrayforAddEdit) || [] };
      if (this.selcectionObj?.ruleType === 'contextual') {
        payload.rules = this.getRulesArrayPayload(this.rulesArrayforAddEdit) || []
      }
      else if (this.selcectionObj?.ruleType === 'nlp') {
        // for (let item of this.nlpAnnotatorObj.annotator) {
        //   delete item?.colorSentence;
        //   delete item?.isEditable;
        // }
        payload.rules = this.nlpAnnotatorObj.annotator;
      }
      if (!payload.outcomes.length) {
        this.errorToaster(null, 'Atleast one outcome is required');
        return;

      }

      this.service.invoke('create.businessRules', quaryparms, payload).subscribe(res => {
        if (this.filterSystem.isRuleActiveFilter == 'all') {
          this.allRules.push(res);
          this.selectRuleType(this.selcectionObj.ruleType);
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
        this.mixpanel.postEvent('Business Rule- Created', {})
        // console.log('MIXPANNEL BR CREATE')
      }, errRes => {
        if (errRes && errRes.error && errRes.error.errors[0].code == 'FeatureAccessLimitExceeded') {
          this.closeModalPopup();
          this.errorToaster(errRes, errRes.error.errors[0].msg);
          this.plans?.openSelectedPopup('choose_plan');
        } else {
          this.errorToaster(errRes, 'Failed to create rules');
        }
      });
    }
    else {
      let message='';
      if (!this.validateCon()) {
        $("#ConditionInput").parent('div').css("border-color", "#DD3646");
        $("#infoWarningCon").css({ "top": "35%", "position": "absolute", "right": "3%", "display": "block" });
        message = 'Enter the required fields to proceed';
      }
      if (!this.validateOut()) {
        $("#OutcomeInput").parent('div').css("border-color", "#DD3646");
        $("#infoWarningOut").css({ "top": "35%", "position": "absolute", "right": "3%", "display": "block" });
        message = 'Enter the required fields to proceed';
      }
      if(!this.emptyAnnotatorValidate()){
        $("#contentText")[0].style.borderColor='#DD3646';
        message = 'Enter the required fields to proceed';
      }
      if(!this.validateLegends()){
       message = 'Tags should equally matched with legends in each annotator';
      }
      this.notificationService.notify(message, 'error');
    }
    this.loadRules();
  }

  //check nlp annotaator is empty
  emptyAnnotatorValidate(){
    return this.nlpAnnotatorObj.annotator.length===0?false:true;
  }

  //validate legends in all annotators
  validateLegends(){
    let count=0;
    for(let item of this.nlpAnnotatorObj.annotator){
      if(item.legends.length>0) count++;
    }
    return count===0?true:false;
  }

  //get all fields
  getFields(){
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
    };
     const payload = {
        "sort": {
          "fieldName": 1,
        }
      }
    this.service.invoke('post.allField', quaryparms, payload).subscribe(res => {
      this.fieldAutoSuggestion = res.fields || [];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }

  // getFieldAutoComplete(event, outcomeObj, clearText?) {
  //   if (clearText && $('#searchBoxId') && $('#searchBoxId').length) {
  //     $('#searchBoxId')[0].value = "";
  //   }
     
  //   let query: any = '';
  //   if (event) {
  //     query = $(event.currentTarget).val();
  //   }
  //   const quaryparms: any = {
  //     searchIndexID: this.serachIndexId,
  //     indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
  //     category: 'rules',
  //     query
  //   };
  //   this.service.invoke('get.getFieldAutocompleteIndices', quaryparms).subscribe(res => {
  //     this.fieldAutoSuggestion = res || [];
  //   }, errRes => {
  //     this.errorToaster(errRes, 'Failed to get fields');
  //   });
  // }
  getRules(searchValue?, searchSource?, source?, headerOption?, sortHeaderOption?, sortValue?, navigate?, request?) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      offset: this.skip || 0,
      limit: 10
    };
    let payload: any = {}
    if (!sortHeaderOption && !headerOption) {
      payload = {
        "sort": {
          "ruleName": 1,
        }
      }
    }
    else {
      payload = request
    }

    let serviceId = 'post.businessRules';
    if (this.searchRules) {
      payload.search = this.searchRules;

    }
    this.service.invoke(serviceId, quaryparms, payload).subscribe(res => {
      this.allRules = res.rules || [];
      this.selectRuleType(this.selcectionObj.ruleType);
      this.totalRecord = res.totalCount || 0;
      this.loadingContent = false;
      this.addRemoveRuleFromSelection(null, null, true);
    }, errRes => {
      this.loadingContent = false;
      this.loadingContent1 = false;
      this.errorToaster(errRes, 'Failed to get rules');
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
      let payload: any = { ruleName: this.addEditRuleObj.ruleName, isRuleActive: this.addEditRuleObj.isRuleActive, ruleType: this.selcectionObj?.ruleType, outcomes: this.getOutcomeArrayPayload(this.outcomeArrayforAddEdit) || [] };
      if (this.selcectionObj?.ruleType === 'contextual') {
        payload.rules = this.getRulesArrayPayload(this.rulesArrayforAddEdit) || [],
          payload.outcomes = this.getOutcomeArrayPayload(this.outcomeArrayforAddEdit) || []
      }
      else if (this.selcectionObj?.ruleType === 'nlp') {
        // for (let item of this.nlpAnnotatorObj.annotator) {
        //   delete item?.colorSentence;
        //   delete item?.isEditable;
        // }
        payload.rules = this.nlpAnnotatorObj.annotator;
      }
      if (!payload.outcomes.length) {
        this.errorToaster(null, 'Atleast one outcome is required');
        return;
      }
      if(!this.validateLegends()&&this.selcectionObj?.ruleType === 'nlp'){
        this.errorToaster(null, 'Tags should equally matched with legends in each annotator');
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
        this.mixpanel.postEvent('Business Rule- Updated', {})
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
          // console.log('deleted')
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
          // console.log('deleted')
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
      this.mixpanel.postEvent('Business Rule - Deleted', {})
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
      const deleteIndex = _.findIndex(this.allRules, (pg) => {
        return pg._id === rule._id;
      })
      this.allRules.splice(deleteIndex, 1);
      const deleteIndex1 = _.findIndex(this.beforeFilterRules, (pg) => {
        return pg._id === rule._id;
      })
      this.beforeFilterRules.splice(deleteIndex1, 1);
      if (!this.allRules.length) {
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
      this.selectRuleType(this.selcectionObj.ruleType);
      this.notificationService.notify('Deleted Successfully', 'success');
      this.mixpanel.postEvent('Business Rule - Deleted', {})
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
  sortByApi(sort) {
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var checkSortValue = 1;
    var naviagtionArrow = '';
    if (this.isAsc) {
      naviagtionArrow = 'up';
      checkSortValue = 1;
    }
    else {
      naviagtionArrow = 'down';
      checkSortValue = -1;
    }
    this.filterRules(null, null, null, null, sort, checkSortValue, naviagtionArrow)
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

  //unsubscribe subjects
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
  updateRuleStatus(rule, event) {
    const isRuleStatus = event.target.checked;
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      ruleId: rule._id,
    };
    const payload: any = {
      ruleName: rule.ruleName,
      isRuleActive: isRuleStatus,
      rules: rule.rules,
      outcomes: rule.outcomes
    }
    this.service.invoke('update.businessRule', quaryparms, payload).subscribe(res => {
      this.notificationService.notify('Updated Successfully', 'success');
      this.allRules = this.allRules.map(item => {
        if (item?._id === rule?._id) {
          item.isRuleActive = isRuleStatus;
        }
        return item
      });
    }, errRes => {
      this.errorToaster(errRes, 'Failed to update rule');
    });
  }
  //NLP Annotator code

  //get dialog dimensions based on event
  getDialogDiemensions(event) {
    const dialog: any = document.getElementsByClassName('nlp-custom-tag-popup');
    if (dialog) {
      dialog[0].style.top = ((event.offsetY * 100) / window.innerHeight) + '%';
      dialog[0].style.left = (((event.offsetX * 100) / window.innerWidth) + 14) + '%';
    }
  }

  //detect text is deleting
  eventDeleted(event) {
    if (event?.keyCode === 8 || event?.keyCode === 46) {
      setTimeout(() => {
        const id = (!this.entityObj.isEditable) ? 'contentText' : ('contentText' + this.selectEditIndex);
        this.entityObj.sentence = document.getElementById(id).innerText;
        const sentence = this.updateColorSentence();
        const coloredSentence = this.sanitizer.bypassSecurityTrustHtml(sentence);
        if (!this.entityObj.isEditable) this.inputSentence = coloredSentence;
        this.entityObj.colorSentence = coloredSentence;
        this.getLegends();
        // this.setCursorPosition(id);
      }, 300)
    }
  }

  // //set cursor position while removing text
  // setCursorPosition(id) {
  //   let node = document.getElementById(id);
  //   node.focus();
  //   const textNode = node.firstChild;
  //   let range = document.createRange();
  //   range.setStart(textNode, index);
  //   range.setEnd(textNode, index);
  //   let sel = window.getSelection();
  //   sel.removeAllRanges();
  //   sel.addRange(range);
  // }


  //fetch index info from appSelectText directive
  getSelectedIndex(index) {
    this.entityFields = { startIndex: 0, endIndex: 0, entityId: '', word: '' };
    this.entityFields.startIndex = index?.start;
    this.entityFields.endIndex = index?.end;
    this.entityFields.word = index?.text;
    this.nlpAnnotatorObj.showEntityPopup = true;
  }

  getSelectedCursorIndex(index){
    console.log("index",index);
  }

  //click on Entity to select
  selectEntity(entity) {
    if (!this.entityObj.isEditable) {
      this.entityObj.sentence = document.getElementById('contentText').innerText;
    }
    let isPush = false;
    this.entityFields.entityId = entity?._id;
    if (this.entityObj.entities.length > 0) {
      for (let i = 0; i <= this.entityObj.entities.length; i++) {
        if (this.entityFields?.startIndex === this.entityObj?.entities[i]?.startIndex) {
          this.entityObj.entities[i].entityId = this.entityFields.entityId;
          isPush = true;
        }
      }
    }
    if (isPush === false) this.entityObj.entities.push(this.entityFields);
    this.inputSentence = '';
    const sentence = this.updateColorSentence();
    const coloredSentence = this.sanitizer.bypassSecurityTrustHtml(sentence);
    if (!this.entityObj.isEditable) {
      this.inputSentence = coloredSentence;
    }
    this.entityObj.colorSentence = coloredSentence;
    this.nlpAnnotatorObj.showEntityPopup = false;
    this.getLegends();
  }

  //add color sentence to original sentence
  updateColorSentence() {
    let entityArray = [];
    let total_entities: any = this.getUniqueListBy(this.entityObj.entities, 'startIndex');
    total_entities = this.removeEntities(this.entityObj);
    this.entityObj.entities = total_entities;
    if (total_entities.length > 0) {
      for (let i = 0; i < total_entities.length; i++) {
        let sentence = '';
        const startIndex = total_entities[i].startIndex;
        const endIndex = total_entities[i].endIndex;
        const entity = this.sys_entities.filter(item => item._id === total_entities[i].entityId);
        const applyColor = this.entityDefaultColors.filter(item => item.type === entity[0].entityType);
        sentence = `<span contenteditable="false" style="font-weight:bold;color:${applyColor[0].color}">` + this.entityObj.sentence.substring(startIndex, endIndex) + '</span>'
        entityArray.push([startIndex, endIndex, sentence]);
      }
      const sentence = this.getSentenceByEntity(entityArray, this.entityObj.sentence);
      return sentence;
    }
    else {
      entityArray = [];
      return this.entityObj.sentence;
    }

  }

  //remove entities if word not matched with sentence
  removeEntities(data: any) {
    let array = [];
    for (let item of data?.entities) {
      const sentence = data?.sentence;
      const word = item?.word;
      const indexes = [sentence.indexOf(word), sentence.indexOf(word) + word?.length];
      if (indexes[0] === item?.startIndex && indexes[1] === item?.endIndex) {
        array.push(item);
      }
    }
    return array;
  }

  //remove duplicate items in array
  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  //update string charaters
  getSentenceByEntity(entityArray, str) {
    String.prototype.replaceBetween = function (start, end, what) {
      var value = this.substring(0, start + 1) + what + this.substring(end);
      return value;
    };
    entityArray.sort(function (a, b) {
      return b[0] - a[0];
    });
    for (var ii = 0, triplet; !!(triplet = entityArray[ii]); ii++) {
      str = str.replaceBetween(triplet[0] - 1, triplet[1], triplet[2]);
    }
    return str;
  }

  //after sentence changes click on add
  AddSelectedEnity() {
    if (this.entityObj.entities.length > 0) {
      if (this.entityObj.isEditable) {
        this.entityObj.isEditable = false;
        this.nlpAnnotatorObj.annotator[this.selectEditIndex] = this.entityObj;
      }
      else if (!this.entityObj.isEditable) {
        this.nlpAnnotatorObj.annotator.push(this.entityObj);        
        $("#contentText")[0].style.borderColor='';
      }
      this.updateLegendAnnotators();
      this.inputSentence = '';
      this.entityObj = { entities: [], sentence: '', colorSentence: '', isEditable: false,legends:[] };
      this.entityFields = { startIndex: 0, endIndex: 0, entityId: '', word: '' };
    }
    else {
      let message = '';
      const text: any = document.getElementById('contentText');
      if (text.innerText === '') {
        message = 'Sentence is required'

      } else if (this.entityObj.entities.length === 0) {
        message = 'At least one Tag is required'
      }
      this.notificationService.notify(message, 'error');
    }
  }

  //create or cancel entity
  createTag(isPopup, isEdit) {
    const annotatorArray = this.nlpAnnotatorObj.annotator;
    this.nlpAnnotatorObj = { showEntityPopup: isPopup, isEditPage: isEdit, entities: { entityId: '', entityName: '', entityType: 'index_field', fieldId: '', field_name: '', isEditable: false }, annotator: annotatorArray };
  }
  //based on entity type show modal height
  setModalHeight(type) {
    $('.nlp-custom-tag-popup').css('height', (type === 'custom' ? '355px' : '450px'));
  }
  //select rule type 
  selectRuleType(type) {
    this.selcectionObj.ruleType = type;
    this.rules = this.allRules?.filter(item => {
      if (type === 'contextual') {
        return (item?.ruleType === type || item?.ruleType === null)
      } else {
        return item?.ruleType === type
      }

    });
    this.beforeFilterRules = JSON.parse(JSON.stringify(this.rules));
    if (this.rules.length > 0) {
      this.loadingContent = false;
      this.loadingContent1 = false;
    }
    else {
      this.loadingContent1 = true;
    }
    if (type === 'nlp') {
      this.getEntities();
    }
  }
  //delete annotator using index
  deleteAnnotator(index) {
    this.nlpAnnotatorObj.annotator.splice(index, 1);
    this.getLegends();
  }
  //get entities list
  getEntities() {
    const quaryparms: any = {
      sidx: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      fip: this.workflowService.selectedIndexPipeline() || ''
    };
    this.service.invoke('get.entities', quaryparms).subscribe(res => {
      const response = res?.entities?.map(item => {
        if (item?.entityType === 'index_field') {
          const field_name = this.fieldAutoSuggestion?.filter(field => field?._id === item?.fieldId);
          return { ...item, field_name: field_name[0]?.fieldName }
        }
        else {
          return item
        }
      });
      let rules = [];
      for (let item of this.rules) {
        let chips = [];
        for (let rule of item?.rules) {
          for (let entity of rule?.entities) {
            const entityName = res?.entities?.filter(ent => ent._id === entity.entityId);
            if (!chips.includes(entityName[0].entityName)) {
              chips.push(entityName[0].entityName);
            }
          }
        }
        const obj = { ...item, chips: chips };
        rules.push(obj);
      }
      this.rules = rules;
      this.sys_entities = response;
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get entities');
    });
  }

  //choose specific entity by clicking
  chooseEntity(type, entity?) {
    const isEditEntity = type === 'add' ? true : false;
    this.createTag(true, isEditEntity);
    if (entity) {
      this.nlpAnnotatorObj.entities.entityId = entity?._id;
      this.nlpAnnotatorObj.entities.isEditable = true;
      this.nlpAnnotatorObj.entities.entityName = entity?.entityName;
      this.nlpAnnotatorObj.entities.entityType = entity?.entityType;
      this.nlpAnnotatorObj.entities.fieldId = entity?.fieldId;
      const field_name = this.fieldAutoSuggestion?.filter(item => item._id === entity?.fieldId);
      if (field_name.length) this.nlpAnnotatorObj.entities.field_name = field_name[0].fieldName;
    }
    this.setModalHeight(entity ? (entity?.entityType) : 'index');
  }

  //add entity
  addEntity() {
    const url = (this.nlpAnnotatorObj.entities.isEditable) ? 'put.entities' : 'post.entities';
    let quaryparms: any = {
      sidx: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      fip: this.workflowService.selectedIndexPipeline() || ''
    };
    if (this.nlpAnnotatorObj.entities.isEditable) {
      quaryparms.entityId = this.nlpAnnotatorObj.entities.entityId;
    }
    delete this.nlpAnnotatorObj.entities.field_name;
    delete this.nlpAnnotatorObj.entities.isEditable;
    delete this.nlpAnnotatorObj.entities.entityId
    if (this.nlpAnnotatorObj.entities.entityType === 'custom') {
      delete this.nlpAnnotatorObj.entities.fieldId
    }
    const payload = this.nlpAnnotatorObj.entities;
    this.service.invoke(url, quaryparms, payload).subscribe(res => {
      if (res) {
        this.createTag(true, false);
        this.getEntities();
        this.setModalHeight('index');
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get entities');
    });
  }

  //delete entity
  deleteEntity(index, id) {
    const quaryparms: any = {
      sidx: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      fip: this.workflowService.selectedIndexPipeline() || ''
    };
    const payload = { entityIds: [id] };
    this.service.invoke('delete.entities', quaryparms, payload).subscribe(res => {
      if (res) {
        this.sys_entities.splice(index, 1);
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get entities');
    });
  }

  //create color sentence while click on edit
  createColorSentence(rule) {
    this.entityObj = { entities: [], sentence: '', colorSentence: '', isEditable: false,legends:[] };
    this.entityObj = { entities: rule?.entities, sentence: rule?.sentence, colorSentence: '', isEditable: false,legends:[] };
    const sentence = this.updateColorSentence();
    this.entityObj.colorSentence = this.sanitizer.bypassSecurityTrustHtml(sentence);
    this.nlpAnnotatorObj.annotator.push(this.entityObj);
    this.entityObj = { entities: [], sentence: '', colorSentence: '', isEditable: false,legends:[] };
    this.getLegends();
  }

  //edit annotator object
  editAnnotatorSentence(index, annotator) {
    annotator.isEditable = true;
    this.selectEditIndex = index;
    this.entityObj = annotator;
    this.updateLegendAnnotators();
  }

  //cancel annotator sentence
  cancelAnnotatorSentence(annotator) {
    annotator.isEditable = false;
    this.entityObj = { entities: [], sentence: '', colorSentence: '', isEditable: false,legends:[] };
    this.selectEditIndex = 0;
  }

  //show legends method
  getLegends() {
    let legends = [];
    for (let annotator of this.nlpAnnotatorObj.annotator) {
      for (let entity of annotator.entities) {
        const Item = this.sys_entities.filter(item => item._id === entity.entityId);
        legends.push({ name: Item[0]?.entityName, type: Item[0]?.entityType });
      }
    }
    for (let obj of this.entityObj.entities) {
      const Item = this.sys_entities.filter(item => item._id === obj.entityId);
      legends.push({ name: Item[0]?.entityName, type: Item[0]?.entityType });
    }
    this.nlpAnnotatorObj.Legends = this.getUniqueListBy(legends, 'name');
  }

  //toipc guide method
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }

  //assign field to object
  selectNLPField(field){
    this.nlpAnnotatorObj.entities.fieldId=field?._id;
    this.nlpAnnotatorObj.entities.field_name=field?.fieldName
    this.search_field = '';
  }

  //validate legends equality with annotators
  updateLegendAnnotators(){
    for(let item of this.nlpAnnotatorObj.annotator){
       let entities = [];
       item.legends = [];
       for(let entity of item?.entities){
        const Item = this.sys_entities.filter(item => item._id === entity.entityId);
        entities.push(Item[0].entityName);
       }
       for(let legend of this.nlpAnnotatorObj.Legends){
         if(!entities.includes(legend.name)){
           item.legends.push({name:legend.name,type:legend.type});
         }
       }
    }
  }

}
