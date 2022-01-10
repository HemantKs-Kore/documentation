import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'underscore';
import { of, interval, Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AuthService } from '@kore.services/auth.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { FormControl } from '@angular/forms';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { UpgradePlanComponent } from 'src/app/helpers/components/upgrade-plan/upgrade-plan.component';
declare const $: any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy, AfterViewInit
{
  selectedApp: any = {};
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  activeClose = false;
  showSearch = false;
  searchSimulator: any = '';
  basic_fieldName: any = '';
  search_basic_fieldName: any = '';
  search_basic_fieldName1: any = '';
  search_basic_fieldName2: any = '';
  savingConfig;
  reIndexing;
  simulating;
  serachIndexId;
  indexPipelineId;
  pipeline;
  addFieldModalPopRef: any;
  loadingContent = true;
  indexStages: any = {}
  indexMappings = []
  newStageObj: any = {
    addNew: false,
  }
  isHoverd = false;
  fields: any = [];
  newfieldsData: any = [];
  loadingFields = true;
  isActiveAll = true;
  showStageType = false;
  selectedStage;
  changesDetected;
  currentEditIndex: any = -1;
  selectedStageIndex: any = -1;
  pollingSubscriber: any = null;
  submitted: boolean = false;
  showNewStageType: boolean = false;
  subscription: Subscription;
  @ViewChild('tleft') public tooltip: NgbTooltip;
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('customScriptCodeMirror') codemirror: any;
  @ViewChild('containInput') containInput: ElementRef<HTMLInputElement>;
  newStage: any = {
    name: 'My Mapping'
  }
  newFieldObj: any = null
  defaultStageTypes: any = [];
  selectedMapping: any = {};
  actionItmes: any = [{ type: 'set' }, { type: 'rename' }, { type: 'copy' }, { type: 'Delete' }];
  newMappingObj: any = {}
  sourceType = 'all';
  defaultStageTypesObj: any = {
    field_mapping: {
      name: 'Field Mapping',
    },
    entity_extraction: {
      name: 'Entity Extraction'
    },
    keyword_extraction: {
      name: 'Keyword Extraction'
    },
    traits_extraction: {
      name: 'Traits Extraction'
    },
    custom_script: {
      name: 'Custom Script'
    },
    semantic_meaning: {
      name: 'Semantic Meaning'
    },
    exclude_document: {
      name: 'Exclude Document'
    },
  }
  entityNlp = [
    { title: 'Date', value: 'DATE', isDepricated: false },
    { title: 'Time', value: 'TIME', isDepricated: false },
    { title: 'URL', value: 'URL', isDepricated: false },
    { title: 'Email', value: 'EMAIL', isDepricated: false },
    { title: 'Location', value: 'LOCATION', isDepricated: false },
    { title: 'City', value: 'CITY', isDepricated: false },
    { title: 'Country', value: 'COUNTRY', isDepricated: false },
    { title: 'Company Name or Organization', value: 'ORGANIZATION', isDepricated: false },
    { title: 'Currency', value: 'MONEY', isDepricated: false },
    { title: 'Person Name', value: 'PERSON', isDepricated: false },
    { title: 'Number', value: 'NUMBER', isDepricated: false },
    { title: 'Percentage', value: 'PERCENTAGE', isDepricated: false }
    /** Existing  */
    // { title: 'Date', value: 'date', isDepricated: false },
    // { title: 'Time', value: 'time', isDepricated: false },
    // { title: 'Date Time', value: 'datetime', isDepricated: false },
    // { title: 'Date Period', value: 'dateperiod', isDepricated: false },
    // { title: 'URL', value: 'url', isDepricated: false },
    // { title: 'Email', value: 'email', isDepricated: false },
    // { title: 'Location', value: 'location', isDepricated: false },
    // { title: 'City', value: 'city', isDepricated: false },
    // { title: 'Country', value: 'country', isDepricated: false },
    // { title: 'Color', value: 'color', isDepricated: false },
    // { title: 'Company Name or Organization Name', value: 'company_name', isDepricated: false },
    // { title: 'Currency', value: 'currencyv2', isDepricated: false },
    // { title: 'Person Name', value: 'person_name', isDepricated: false },
    // { title: 'Number', value: 'number', isDepricated: false },
    // { title: 'Percentage', value: 'percentage', isDepricated: false },
    // { title: 'Phone Number', value: 'phone_number', isDepricated: false },
    // { title: 'Zip Code', value: 'zipcode', isDepricated: false },
    // { title: 'Quantity', value: 'quantityv2', isDepricated: false },
    // { title: 'Address', value: 'address', isDepricated: false },
    // { title: 'Airport', value: 'airport', isDepricated: false },
    /** Existing  */
    // { title: 'Attachment(Image / File)', value: 'attachment', isDepricated: false },
    // {"title": "City (Advanced)", "value": "cityAdv", "isDepricated": false},
    // {"title": "City with Geo Coordinates", "value": "city_coordinates"},
    // {"title": "City", "value": "city"},
    // { title: 'Currency(Deprecated)', value: 'currency', isDepricated: true },
    // { title: 'Custom', value: 'regex', isDepricated: false },
    // { title: 'Composite', value: 'composite', isDepricated: false },
    // { title: 'Description', value: 'description', isDepricated: false },
    // {"title": "JSON Object", "value": "json_object", "isDepricated": false},
    // { title: 'List of items (enumerated)', value: 'list_of_values', isDepricated: false },
    // { title: 'List of items (lookup)', value: 'list_of_items_lookup', isDepricated: false },
    // {"title": "Password", "value": "password", "isDepricated": false},
    // {"title": "Quantity(Number with unit of measure)", "value": "quantity"},
    // { title: 'String', value: 'label', isDepricated: false },
    // { title: 'Time Zone', value: 'timezone', isDepricated: false },

    // { title: 'From - number(minimum of a range)(Deprecated)', value: 'from_number', isDepricated: true },
    // { title: 'To - number(maximum of a range, limit)(Deprecated)', value: 'to_number', isDepricated: true },
    // { title: 'Quantity(Deprecated)', value: 'quantity', isDepricated: true }
    // {"title": "City", "value": "city"},
  ];
  simulteObj: any = {
    sourceType: this.sourceType,
    docCount: 5,
    showSimulation: false,
    simulate: this.defaultStageTypesObj
  }
  payloadValidationObj: any = {
    valid: true,
    invalidObjs: {}
  };
  entitySuggestionTags: any = ['Entity 1', 'Entity 2', 'Entity 3', 'Entity 4', 'Entity 5'];
  traitsSuggesitions: any = [];
  searchFields: any = '';
  pipelineCopy;
  fieldAutoSuggestion: any = [];
  codeMirrorOptions: any = {
    theme: 'neo',
    mode: 'application/ld+json',
    lineNumbers: false,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-foldgutter'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: false,
    readOnly: true,
  };
  customScriptCodeMirrorOptions: any = {
    theme: 'neo',
    mode: "javascript",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: false,
    indentUnit: 2
  };
  simulateJson;
  filteredSimulatorRes: any;
  componentType: string = 'addData';
  // containCondition: any[] = [];
  selectable = true;
  removable = true;
  containCtrl = new FormControl();
  operators = [{ name: 'Exists', value: 'exists' }, { name: 'Does Not Exist', value: 'doesNotExist' }, { name: 'EqualsTo', value: 'equalsTo' }, { name: 'Not Equals To', value: 'notEqualsTo' }, { name: 'Contains', value: 'contains' }, { name: 'DoesNot Contain', value: 'doesNotContain' }];
  conditionArray: any = [];
  conditionObj: any = { fieldId: '', operator: '', value: [] };
  selectedConditionType = 'basic';
  modifiedStages = {
    createdStages: [],
    deletedStages: []
  }
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  entityName: string;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    public inlineManual: InlineManualService,
    public mixpanel: MixpanelServiceService
  ) { }
  @ViewChild('plans') plans: UpgradePlanComponent;
  ngOnInit(): void
  {
    this.selectedApp = this.workflowService.selectedApp();
    // console.log("this.selectedApp", this.selectedApp)
    if ((this.selectedApp || {}).searchIndexes && (this.selectedApp || {}).searchIndexes.length)
    {
      this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
      //this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    }
    this.loadIndexAll()
    // this.getSystemStages();
    // this.getIndexPipline();
    // this.getFileds();
    // this.setResetNewMappingsObj();
    // this.addcode({});
    // this.getTraitGroups()
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res =>
    {
      this.loadIndexAll()
    })
  }
  loadIndexAll()
  {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId)
    {
      this.getSystemStages();
      //this.getIndexPipline();
      this.getFileds();
      this.setResetNewMappingsObj();
      this.addcode({});
      this.getTraitGroups()
    }
  }
  ngAfterViewInit()
  {
    const self = this;
    setTimeout(() =>
    {
      $('#addToolTo').click();
    }, 700);
    this.bindDocumentClickEvents();
  }
  bindDocumentClickEvents()
  {
    const self = this;
    $('body').off('click').on('click', (event) =>
    {
      if (event && event.target)
      {
        if (!$(event.target).closest('.simulator-div').length && !$(event.target).closest('.simulatebtnContainer').length)
        {
          self.closeSimulator();
        }
      }
    });
  }
  //add condition dynamically
  addCondition(type, index, field?, data?)
  {
    if (type === 'add')
    {
      this.conditionObj = { fieldId: '', operator: '', value: [] };
      if (this.selectedStage.condition.mappings === undefined)
      {
        this.selectedStage.condition.mappings = [];
      }
      this.selectedStage.condition.mappings.push(this.conditionObj);
    }
    else if (type === 'remove')
    {
      this.selectedStage.condition.mappings.splice(index, 1);
    }
    else if (type === 'update')
    {
      if (field === 'field')
      {
        this.selectedStage.condition.mappings[index] = { ...this.selectedStage.condition.mappings[index], fieldId: data };
      }
      else if (field === 'operator')
      {
        this.selectedStage.condition.mappings[index] = { ...this.selectedStage.condition.mappings[index], operator: data };
        if (['exists', 'doesNotExist'].includes(data))
        {
          this.selectedStage.condition.mappings[index].value = [];
        }
      }
    }
  }
  //camelcase names in operators
  camelCaseNames(operator)
  {
    const camel_name = this.operators.filter(data => data.value == operator);
    return camel_name[0].name;
  }
  getTraitGroups(initial?)
  {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId
    }
    this.service.invoke('get.traits', quaryparms).subscribe(res =>
    {
      const allTraitskeys: any = [];
      if (res && res.length)
      {
        res.forEach(element =>
        {
          allTraitskeys.push(element.groupName);
        });
        this.traitsSuggesitions = allTraitskeys;
      }
    }, (err) =>
    {
    });
  };
  drop(event: CdkDragDrop<string[]>, list)
  {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    if (event.previousIndex == this.selectedStageIndex)
    {
      this.currentEditIndex = event.currentIndex;
      this.selectedStageIndex = event.currentIndex;
    }
  }
  setRuleObj(configObj, key, value, type)
  {
    this.changesDetected = true;
    if (type === 'field_mapping')
    {
      configObj[key] = value;
      if (value === 'remove')
      {
        delete configObj.value
      }
    }
  }
  selectedTag(data: MatAutocompleteSelectedEvent, list)
  {
    this.entityName = '';
    if (!this.checkDuplicateTags((data.option.value || '').trim(), list))
    {
      this.notificationService.notify('Duplicate tags are not allowed', 'warning');
      return;
    } else
    {
      list.push(data.option.value);
      this.suggestedInput.nativeElement.value = '';
    }
    this.suggestedInput.nativeElement.blur();
    setTimeout(() =>
    {
      this.suggestedInput.nativeElement.focus();
    }, 100)
  }
  setResetNewMappingsObj(ignoreSimulate?, saveConfig?)
  {
    if (!ignoreSimulate)
    {
      this.simulteObj = {
        sourceType: this.sourceType,
        docCount: 5,
        showSimulation: false,
      }
    }
    this.newMappingObj = {
      field_mapping: {
        defaultValue: {
          operation: 'set',
          target_field: '',
          value: '',
        }
      },
      entity_extraction: {
        defaultValue: {
          source_field: '',
          target_field: '',
          entity_types: [],
        }
      },
      traits_extraction: {
        defaultValue: {
          source_field: '',
          target_field: '',
          trait_groups: [],
        }
      },
      keyword_extraction: {
        defaultValue: {
          source_field: '',
          target_field: '',
          model: '',
        }
      },
      semantic_meaning: {
        defaultValue: {
          source_field: '',
          target_field: '',
          model: '',
        }
      },
      custom_script: {
        defaultValue: {
          script: ''
        }
      },
      exclude_document: {
        defaultValue: {
          operation: 'set',
          target_field: '',
          value: '',
        }
      },
    }
    if (saveConfig && this.selectedStage && this.selectedStage.type === 'custom_script' && this.selectedStage.config && this.selectedStage.config.mappings && this.selectedStage.config.mappings.length)
    {
      if (!this.newMappingObj.custom_script)
      {
        this.newMappingObj.custom_script = {
          defaultValue: {
            script: ''
          }
        }
      }
      this.newMappingObj.custom_script.defaultValue.script = this.selectedStage.config.mappings.length > 1 ? this.selectedStage.config.mappings[1].script : this.selectedStage.config.mappings[0].script || '';
    }
  }
  checkNewAddition()
  {
    if (this.selectedStage && this.selectedStage.type === 'field_mapping')
    {
      if (this.newMappingObj.field_mapping && this.newMappingObj.field_mapping.defaultValue)
      {
        if (this.newMappingObj.field_mapping.defaultValue.operation && this.newMappingObj.field_mapping.defaultValue.target_field && (this.newMappingObj.field_mapping.defaultValue.value || this.newMappingObj.field_mapping.defaultValue.operation === 'remove' || this.newMappingObj.field_mapping.defaultValue.source_field))
        {
          this.addFiledmappings(this.newMappingObj.field_mapping.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'entity_extraction')
    {
      if (this.newMappingObj.entity_extraction && this.newMappingObj.entity_extraction.defaultValue)
      {
        if (this.newMappingObj.entity_extraction.defaultValue.source_field && this.newMappingObj.entity_extraction.defaultValue.entity_types && this.newMappingObj.entity_extraction.defaultValue.entity_types.length && this.newMappingObj.entity_extraction.defaultValue.target_field)
        {
          this.addFiledmappings(this.newMappingObj.entity_extraction.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'traits_extraction')
    {
      if (this.newMappingObj.traits_extraction && this.newMappingObj.traits_extraction.defaultValue)
      {
        if (this.newMappingObj.traits_extraction.defaultValue.source_field && this.newMappingObj.traits_extraction.defaultValue.trait_groups && this.newMappingObj.traits_extraction.defaultValue.trait_groups.length && this.newMappingObj.traits_extraction.defaultValue.target_field)
        {
          this.addFiledmappings(this.newMappingObj.traits_extraction.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'keyword_extraction')
    {
      if (this.newMappingObj.keyword_extraction && this.newMappingObj.keyword_extraction.defaultValue)
      {
        if (this.newMappingObj.keyword_extraction.defaultValue.source_field && this.newMappingObj.keyword_extraction.defaultValue.target_field)
        {
          this.addFiledmappings(this.newMappingObj.keyword_extraction.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'semantic_meaning')
    {
      if (this.newMappingObj.semantic_meaning && this.newMappingObj.semantic_meaning.defaultValue)
      {
        if (this.newMappingObj.semantic_meaning.defaultValue.source_field && this.newMappingObj.semantic_meaning.defaultValue.target_field)
        {
          this.addFiledmappings(this.newMappingObj.semantic_meaning.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'custom_script')
    {
      if (this.newMappingObj.custom_script && this.newMappingObj.custom_script.defaultValue)
      {
        if (this.newMappingObj.custom_script.defaultValue.script)
        {
          this.addFiledmappings(this.newMappingObj.custom_script.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'exclude_document')
    {
      if (this.newMappingObj.exclude_document && this.newMappingObj.exclude_document.defaultValue)
      {
        if (this.newMappingObj.exclude_document.defaultValue.script)
        {
          this.addFiledmappings(this.newMappingObj.exclude_document.defaultValue);
        }
      }
    }
  }
  toggleSearch()
  {
    if (this.showSearch && this.searchFields)
    {
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch
  }
  getFieldAutoComplete()
  {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('put.indexPipeline', quaryparms, { stages: this.pipeline }).subscribe(res =>
    {
      this.fieldAutoSuggestion = res;
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  selectFieldType(type)
  {
    if (type === 'number')
    {
      this.newFieldObj.fieldName = '';
      this.newFieldObj.fieldDataType = type
    } else
    {
      this.newFieldObj.fieldDataType = type
    }
  }
  poling()
  {
    if (this.pollingSubscriber)
    {
      this.pollingSubscriber.unsubscribe();
    }
    this.simulteObj.currentSimulateAnimi = -1;
    this.pollingSubscriber = interval(1000).pipe(startWith(0)).subscribe(() =>
    {
      if (this.simulteObj.currentSimulateAnimi === (this.simulteObj.totalStages - 1))
      {
        this.simulteObj.currentSimulateAnimi = -1;
      }
      this.simulteObj.currentSimulateAnimi = this.simulteObj.currentSimulateAnimi + 1;
      // console.log('hilight ' + this.simulteObj.currentSimulateAnimi);
    }
    )
  }
  simulateAnimate(payload)
  {
    this.simulteObj.totalStages = payload.length - 1;
    this.simulteObj.simulationInprogress = true;
    this.poling()
  }
  preparepayload()
  {
    this.checkNewAddition();
    const stagesArray = [];
    this.payloadValidationObj.invalidObjs = {};
    this.payloadValidationObj.valid = true;
    this.pipeline.forEach(stage =>
    {
      const tempStageObj = JSON.parse(JSON.stringify(stage));
      if (tempStageObj && tempStageObj.condition && tempStageObj.condition.type === 'script')
      {
        delete tempStageObj.condition.mappings
      }
      else
      {
        if (tempStageObj && tempStageObj.condition)
        {
          delete tempStageObj.condition.value;
          tempStageObj.condition.mappings.forEach(el => { delete el.autocomplete_text; delete el.fieldName })
        }
      }
      if (tempStageObj && tempStageObj.type === 'field_mapping')
      {
        // if (tempStageObj.condition.type === 'script') {
        //   tempStageObj.condition.mappings = [];
        //   tempStageObj.condition.value = this.selectedScript;
        // }
        // else {
        //   tempStageObj.condition.mappings.forEach(el => { delete el.autocomplete_text; delete el.fieldName })
        // }
        // const obj = { type: this.selectedConditionType, mappings: this.conditionArray };
        // tempStageObj.condition = obj;
        if (tempStageObj.config && tempStageObj.config.mappings && tempStageObj.config.mappings.length)
        {
          const tempConfig: any = [];
          tempStageObj.config.mappings.forEach(config =>
          {
            if (config && (config.operation === 'set') || (config.operation === 'copy') || (config.operation === 'rename'))
            {
              if (!config.target_field || !config.value)
              {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
              if (config.operation === 'copy' || config.operation === 'rename')
              {
                if (config.hasOwnProperty('value'))
                {
                  delete config.value;
                }
              } else
              {
                if (config.hasOwnProperty('source_field'))
                {
                  delete config.source_field;
                }
              }
            }
            if ((config.operation === 'remove'))
            {
              if (config.hasOwnProperty('value'))
              {
                delete config.value;
              }
              if (config.hasOwnProperty('source_field'))
              {
                delete config.source_field;
              }
              if (!config.target_field)
              {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
            }
            tempConfig.push(config);
          });
          tempStageObj.config.mappings = tempConfig;
        }
      }
      if (tempStageObj && tempStageObj.type === 'custom_script')
      {
        if (tempStageObj.config && tempStageObj.config.mappings && tempStageObj.config.mappings.length)
        {
          const tempConfig: any = [];
          tempStageObj.config.mappings.forEach(config =>
          {
            if (!config.script)
            {
              this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
            }
            tempConfig[0] = config;
          });
          tempStageObj.config.mappings = tempConfig;
        }
      }
      if (tempStageObj && ((tempStageObj.type === 'entity_extraction') || (tempStageObj.type === 'traits_extraction') || (tempStageObj.type === 'keyword_extraction')))
      {
        if (tempStageObj.config && tempStageObj.config.mappings && tempStageObj.config.mappings.length)
        {
          const tempConfig: any = [];
          tempStageObj.config.mappings.forEach(config =>
          {
            if (!config.source_field || !config.source_field)
            {
              this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
            }
            if ((tempStageObj.type === 'entity_extraction'))
            {
              if (!(config && config.entity_types && config.entity_types.length))
              {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;

              }
              else if (config && config.entity_types && config.entity_types.length)
              {
                // let localEntitytype=[...config.entity_types]
                // config.entity_types.forEach(typeElement => {
                //   this.entityNlp.forEach(nlpElement=> {
                //     if(nlpElement.title==typeElement){
                //       typeElement=nlpElement.value
                //     }


                //   });
                // });
                for (let i = 0; i < config.entity_types.length; i++)
                {
                  for (let j = 0; j < this.entityNlp.length; j++)
                  {
                    if (this.entityNlp[j].title == config.entity_types[i])
                    {
                      config.entity_types[i] = this.entityNlp[j].value
                    }
                  }
                }
              }
              if (config.trait_groups)
              {
                delete config.trait_groups;
              }
              if (config.keywords)
              {
                delete config.keywords;
              }
            }
            if ((tempStageObj.type === 'traits_extraction'))
            {
              if (!(config && config.trait_groups && config.trait_groups.length))
              {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
              if (config.entity_types)
              {
                delete config.entity_types;
              }
              if (config.keywords)
              {
                delete config.keywords;
              }
            }
            if ((tempStageObj.type === 'keyword_extraction'))
            {
              if (!(config && config.keywords && config.keywords.length))
              {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
              if (config.entity_types)
              {
                delete config.entity_types;
              }
              if (config.trait_groups)
              {
                delete config.trait_groups;
              }
            }
            tempConfig.push(config);
          });
          tempStageObj.config.mappings = tempConfig;
        }
      }
      stagesArray.push(tempStageObj);
    });
    return stagesArray;
  }
  checkForNewFields()
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Stage configuration is successfully saved',
        body: 'You have added ' + this.newfieldsData.length + ' new fields in your configuration. Do you wish to define properties for them?',
        buttons: [{ key: 'yes', label: 'Proceed' }, { key: 'no', label: 'Cancel', secondaryBtn: true }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result =>
      {
        if (result === 'yes')
        {
          dialogRef.close();
          this.openModalPopup();
        } else if (result === 'no')
        {
          dialogRef.close();
          // console.log('deleted')
        }
      })
  }
  validateConditionForRD()
  {
    let indexArray = [];
    if (this.pipeline.length)
    {
      for (let k = 0; k < this.pipeline.length; k++)
      {
        if (this.pipeline[k].type === 'exclude_document')
        {
          if (!this.pipeline[k].condition)
          {
            indexArray.push(k);
          }
        }
      }
    }
    return indexArray.length;
  }
  removeExcludeDocumentStage(indexArrayLength, isSaveConfig)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Stage',
        text: 'Do you want to discard this stage?',
        newTitle: 'Do you want to discard this stage?',
        body: 'The Exclude Document stage will be discarded as it does not contain any conditions.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result =>
      {
        if (result === 'yes')
        {
          for (let i = 0; i < indexArrayLength; i++)
          {
            let index = this.pipeline.findIndex((p) => !p.condition);
            if (index > -1)
            {
              let index2 = this.modifiedStages.createdStages.findIndex((d) => d.type == this.pipeline[index].type);
              if (index2 > -1)
              {
                this.modifiedStages.createdStages.splice(index2, 1);
              }
              this.pipeline.splice(index, 1);
            }
          }
          // console.log("inside dialog");
          dialogRef.close();
          if (this.pipeline && this.pipeline.length)
          {
            this.selectStage(this.pipeline[0], 0);
            if (isSaveConfig)
            {
              this.saveConfig();
            } else
            {
              this.simulate();
            }
          } else
          {
            this.selectedStage = null
            return false;
          }
        } else if (result === 'no')
        {
          dialogRef.close();
          return false;
        }
      })
  }
  mixpanelForStages()
  {
    if (this.modifiedStages.createdStages.length)
    {
      this.mixpanel.postEvent('Workbench - Rule Created', {});
      this.modifiedStages.createdStages.forEach((s) =>
      {
        if (s.type === 'field_mapping')
        {
          this.mixpanel.postEvent('Workbench - Rule Created - Field Mapping', {});
        } else if (s.type === 'entity_extraction')
        {
          this.mixpanel.postEvent('Workbench - Rule Created - Entity Extraction', {});
        } else if (s.type === 'traits_extraction')
        {
          this.mixpanel.postEvent('Workbench - Rule Created - Traits Extraction', {});
        } else if (s.type === 'custom_script')
        {
          this.mixpanel.postEvent('Workbench - Rule Created - Custom Script', {});
        } else if (s.type === 'position')
        {
        } else if (s.type === 'cluster')
        {
        } else if (s.type === 'indexer')
        {
        } else if (s.type === 'keyword_extraction')
        {
          this.mixpanel.postEvent('Workbench - Rule Created - Keyword Extraction', {});
        } else if (s.type === 'exclude_document')
        {
          this.mixpanel.postEvent('Workbench - Rule Created - Exclude Document', {});
        } else if (s.type === 'semantic_meaning')
        {
          this.mixpanel.postEvent('Workbench - Rule Created - Semantic Meaning', {});
        }
      })
    }
    if (this.modifiedStages.deletedStages.length)
    {
      this.mixpanel.postEvent('Workbench - Rule Deleted', {});
    }
    if (!this.modifiedStages.createdStages.length && !this.modifiedStages.deletedStages.length)
    {
      this.mixpanel.postEvent('Workbench - Rule Updated', {});
    }
  }

  
  saveConfig(warningmessage?,index?, dialogRef?)
  { 
    
    let plainScriptTxt: any;
    if (this.newMappingObj && this.newMappingObj.custom_script &&
      this.newMappingObj.custom_script.defaultValue && this.newMappingObj.custom_script.defaultValue.script)
    {
      plainScriptTxt = this.newMappingObj.custom_script.defaultValue.script;
    }
    let indexArrayLength: any = this.validateConditionForRD();
    if (indexArrayLength)
    {
      this.removeExcludeDocumentStage(indexArrayLength, true);
    }
    else
    {
      this.savingConfig = true;
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        indexPipelineId: this.indexPipelineId
      };
      this.service.invoke('put.indexPipeline', quaryparms, { stages: this.preparepayload() }).subscribe(res =>
      {
        this.pipeline = res.stages || [];
        this.pipelineCopy = JSON.parse(JSON.stringify(res.stages));
        // this.appSelectionService.updateTourConfig('addData');
        this.mixpanelForStages();
        this.notificationService.notify('Configurations Saved Successfully', 'success');
        if(warningmessage){
          this.notificationService.notify(warningmessage,'warning');
        }
        this.modifiedStages = {
          createdStages: [],
          deletedStages: []
        }
        this.savingConfig = false;
        if (dialogRef && dialogRef.close)
        {
          dialogRef.close();
        }
        if (index !== 'null' && index !== undefined && (index > -1))
        {
          this.currentEditIndex = -1
        }
        if (res && res.targetFields && res.targetFields.length)
        {
          const newFileds: any = [];
          res.targetFields.forEach(field =>
          {
            const tempPayload: any = {
              fieldName: field.fieldName,
              fieldDataType: field.fieldDataType,
              isMultiValued: field.isMultiValued || true, // can use hasobjectket property if required to take server values in furture //
              isActive: field.isActive || true,
              isRequired: field.isRequired || false,
              isStored: field.isStored || true,
              isIndexed: field.isIndexed || true,
            }
            newFileds.push(tempPayload);
          });
          this.newfieldsData = newFileds || [];
          this.checkForNewFields();
        }
        this.clearDirtyObj();
        this.setResetNewMappingsObj(null, true);
        /** Workbench plain text temp */
        // if (this.newMappingObj && this.newMappingObj.custom_script &&
        //   this.newMappingObj.custom_script.defaultValue && this.newMappingObj.custom_script.defaultValue.script) {
        //   this.newMappingObj.custom_script.defaultValue.script = plainScriptTxt;
        // }
        // setTimeout(()=>{
        //   //this.selectedStage.condition.value = ""
        //   if(this.selectedStage && this.selectedStage.condition && this.selectedStage.condition.value){
        //     let greaterThan = "&gt;";
        //     let lessThan = "&lt;";
        //     let greaterThanSymbol= ">";
        //     let lessThanSymbol = "<";
        //     if(this.selectedStage.condition.value.includes(greaterThan)){
        //       this.selectedStage.condition.value.replace(greaterThan, greaterThanSymbol); 
        //       let elemenet = document.getElementsByTagName("ngx-codemirror")[0] as HTMLBaseElement
        //       elemenet.innerText.replace(greaterThan, greaterThanSymbol);
        //     }else if(this.selectedStage.condition.value.includes(lessThan)){
        //       this.selectedStage.condition.value.replace(lessThan,lessThanSymbol);
        //       let elemenet = document.getElementsByTagName("ngx-codemirror")[0] as HTMLBaseElement
        //       elemenet.innerText.replace(lessThan, lessThanSymbol); 
        //     }
        //   }
        // },1)
      }, errRes =>
      {
        this.savingConfig = false;
        // this.errorToaster(errRes, 'Failed to save configurations');
        if (errRes && errRes.error && errRes.error.errors[0].code == 'FeatureAccessDenied' || errRes.error.errors[0].code == 'FeatureAccessLimitExceeded')
        {
          this.upgrade();
          this.errorToaster(errRes, errRes.error.errors[0].msg);
          setTimeout(() =>
          {
            // this.btnDisabled = false;
          }, 500)
        }
        /** Workbench plain text temp */
        if (this.newMappingObj && this.newMappingObj.custom_script &&
          this.newMappingObj.custom_script.defaultValue && this.newMappingObj.custom_script.defaultValue.script)
        {
          this.newMappingObj.custom_script.defaultValue.script = plainScriptTxt;
        }

      });
    }

  }
  upgrade()
  {
    this.plans.openChoosePlanPopup('choosePlans');
  }
  openModalPopup()
  {
    this.loadingFields = true;
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    this.getFileds();
  }
  closeModalPopup()
  {
    this.addFieldModalPopRef.close();
    this.setResetNewMappingsObj();
  }
  reindex()
  {
    const proceed = () =>
    {
      this.reIndexing = true;
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        indexPipelineId: this.indexPipelineId
      };
      this.service.invoke('post.reindex', quaryparms).subscribe(res =>
      {
        this.notificationService.notify('Re-indexed successfully', 'success')
        this.reIndexing = false;
      }, errRes =>
      {
        this.errorToaster(errRes, 'Failed to re-index');
        this.reIndexing = false;
      });
    }
    if (this.changesDetected)
    {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '530px',
        height: 'auto',
        panelClass: 'delete-popup',
        data: {
          title: 'Are you sure',
          text: 'There are usaved changes, Are you sure you want to reindex without saving them?',
          newTitle: 'There are usaved changes, Are you sure you want to reindex without saving them?',
          body: 'The changes are unsaved.',
          buttons: [{ key: 'yes', label: 'Save', type: 'danger' }, { key: 'no', label: 'Cancel' }],
          confirmationPopUp: true
        }
      });
      dialogRef.componentInstance.onSelect
        .subscribe(result =>
        {
          if (result === 'yes')
          {
            this.clearDirtyObj();
            proceed();
            dialogRef.close();
          } else if (result === 'no')
          {
            dialogRef.close();
            // console.log('deleted')
          }
        })
    } else
    {
      proceed();
    }
  }
  changeSimulate(value, type)
  {
    if (type === 'source')
    {
      this.sourceType = value
      this.simulteObj.sourceType = this.sourceType;
    } else
    {
      if (value == null)
      {
        return;
      } else if (value < 1)
      {
        this.simulateJson.docCount = 1;
        value = 1;
      } else if (value > 20)
      {
        this.simulateJson.docCount = 20;
        value = 20;
      }
      this.simulteObj.docCount = value
    }
    this.simulate();
  }
  closeSimulator()
  {
    this.simulteObj = {
      sourceType: 'all',//this.sourceType,
      docCount: 5,
      showSimulation: false,
    }
    if (this.pollingSubscriber)
    {
      this.pollingSubscriber.unsubscribe();
    }
    this.simulteObj.currentSimulateAnimi = -1;
  }
  addcode(data?)
  {
    data = data || {};
    this.simulateJson = data;
    // this.simulateJson = JSON.stringify(data, null, ' ');
    this.filteredSimulatorRes = JSON.stringify(data, null, ' ');
  }

  clearvalidation(){
    
   
      $("#infoWarning").hide();
      $("#fieldname").css("border-color","#BDC1C6");
    
    
      $("#infoWarning1").hide();
      $("#set_value").css("border-color","#BDC1C6");
   
  
      $("#infoWarning2").hide() 
      $("#rename_sourcefield").css("border-color","#BDC1C6");
    

      $("#dropdownBasic1entity").css("border-color","#BDC1C6");

      
        $("#infoWarning4").hide();
        $("#entitytarget").css("border-color","#BDC1C6");
        
        
    
    
      $("#infoWarning3").hide();
      $("#addentity").parents('div').css("border-color","#BDC1C6");
      //$("#addentity").css("border-color", ((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length) != 0) ? "#BDC1C6" : "#DD3646");
      
      
   
      $("#infoWarning5").hide() 
      //$("#traitsgroup").css("border-color", ((this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups).length!=0)? "#BDC1C6" : "#DD3646");
      $("#traitsgroup").parents('div').css("border-color","#BDC1C6");
  }

  inputChanged(type) {

    if (type == 'fieldname') {
      this.newMappingObj.field_mapping.defaultValue.target_field != '' ? $("#infoWarning").hide() : $("#infoWarning").show();
      $("#fieldname").css("border-color", this.newMappingObj.field_mapping.defaultValue.target_field != '' ? "#BDC1C6" : "#DD3646");
    }
    else if (type == 'set_value') {
      this.newMappingObj.field_mapping.defaultValue.value != '' ? $("#infoWarning1").hide() : $("#infoWarning1").show();
      $("#set_value").css("border-color", this.newMappingObj.field_mapping.defaultValue.value != '' ? "#BDC1C6" : "#DD3646");
    }
    else if (type == 'rename_sourcefield') {
      this.newMappingObj.field_mapping.defaultValue.source_field != '' ? $("#infoWarning2").hide() : $("#infoWarning2").show();
      $("#rename_sourcefield").css("border-color", this.newMappingObj.field_mapping.defaultValue.source_field != '' ? "#BDC1C6" : "#DD3646");
    }
    else if(type=='dropdownBasic1entity'){
      $("#dropdownBasic1entity").css("border-color", this.newMappingObj[this.selectedStage.type].defaultValue.source_field != '' ? "#BDC1C6" : "#DD3646");
    }
    else if (type == 'addentity') {
      console.log((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length));
      ((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length)!= 0) ? $("#infoWarning3").hide() : $("#infoWarning3").show();
      $("#addentity").css("border-color", ((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length) != 0) ? "#BDC1C6" : "#DD3646");
    }
    else if (type == 'entitytarget') {
      this.newMappingObj[this.selectedStage.type].defaultValue.target_field != '' ? $("#infoWarning4").hide() : $("#infoWarning4").show();
      $("#entitytarget").css("border-color", this.newMappingObj[this.selectedStage.type].defaultValue.target_field != '' ? "#BDC1C6" : "#DD3646");
    }
    else if (type == 'traitsgroup') {
      ((this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups).length!=0) ? $("#infoWarning5").hide() : $("#infoWarning5").show();
      $("#traitsgroup").css("border-color", ((this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups).length!=0)? "#BDC1C6" : "#DD3646");
      
    }
    
  }
  validation(save){
    if ((this.selectedStage.condition.mappings)) {

     if(this.selectedStage.type === 'field_mapping')
     {
        if (this.newMappingObj.field_mapping.defaultValue.operation === "set") {
          for (let i = 0; i <= this.selectedStage.condition.mappings.length; i++) {
            if (((this.selectedStage.condition.mappings[i].operator === '') || (this.basic_fieldName === '')) &&
              (((this.newMappingObj.field_mapping.defaultValue.target_field) && (this.newMappingObj.field_mapping.defaultValue.value)))) {
              let warningmessage = 'Chosen stage will be applied on all documents since there are no conditions provided'
              // this.notificationService.notify('Chosen stage will be applied on all documents since there are no conditions provided','warning')
              if(save===true){
                this.saveConfig(warningmessage);
              }  
              else{            
              this.simulate(warningmessage);
              }
            }
            else if (this.newMappingObj.field_mapping.defaultValue.target_field === '' || this.newMappingObj.field_mapping.defaultValue.value === '') {
              if ((this.newMappingObj.field_mapping.defaultValue.value === '')
                && (this.newMappingObj.field_mapping.defaultValue.target_field === '')) {

                $("#fieldname").css("border-color", "#DD3646");
                $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
                $("#set_value").css("border-color", "#DD3646");
                $("#infoWarning1").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }
              else if (this.newMappingObj.field_mapping.defaultValue.target_field === '') {
                $("#fieldname").css("border-color", "#DD3646");
                $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }
              else if (this.newMappingObj.field_mapping.defaultValue.value === '') {
                $("#set_value").css("border-color", "#DD3646");
                $("#infoWarning1").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }
              this.notificationService.notify('Enter the required fields to proceed', 'error');
            }
            else {
              this.simulate();
            }
          }
        }

        else if (this.newMappingObj.field_mapping.defaultValue.operation === "rename" ||  this.newMappingObj.field_mapping.defaultValue.operation === "copy") {
          for (let i = 0; i <= this.selectedStage.condition.mappings.length; i++) {
            if (((this.selectedStage.condition.mappings[i].operator === '') || (this.basic_fieldName === '')) &&
              (((this.newMappingObj.field_mapping.defaultValue.source_field) && (this.newMappingObj.field_mapping.defaultValue.target_field)))) {
              let warningmessage = 'Chosen stage will be applied on all documents since there are no conditions provided'
              // this.notificationService.notify('Chosen stage will be applied on all documents since there are no conditions provided','warning')
              if(save===true){
                this.saveConfig(warningmessage);
              }  
              else{            
              this.simulate(warningmessage);
              }
              
            }
            else if (this.newMappingObj.field_mapping.defaultValue.source_field === '' || this.newMappingObj.field_mapping.defaultValue.source_field === undefined || this.newMappingObj.field_mapping.defaultValue.target_field === '') {
              if ((this.newMappingObj.field_mapping.defaultValue.source_field === '' || this.newMappingObj.field_mapping.defaultValue.source_field === undefined)
                && (this.newMappingObj.field_mapping.defaultValue.target_field === '')) {
                $("#rename_sourcefield").css("border-color", "#DD3646");
                $("#infoWarning2").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
                $("#fieldname").css("border-color", "#DD3646");
                $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }
              else if (this.newMappingObj.field_mapping.defaultValue.source_field === '' || this.newMappingObj.field_mapping.defaultValue.source_field === undefined) {
                $("#rename_sourcefield").css("border-color", "#DD3646");
                $("#infoWarning2").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }
              else if (this.newMappingObj.field_mapping.defaultValue.target_field === '') {
                $("#fieldname").css("border-color", "#DD3646");
                $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }
              this.notificationService.notify('Enter the required fields to proceed', 'error');
            }

            else {
              this.simulate();
            }
          }
        }

        else if (this.newMappingObj.field_mapping.defaultValue.operation === "remove") {
          for (let i = 0; i <= this.selectedStage.condition.mappings.length; i++) {
            if (((this.selectedStage.condition.mappings[i].operator === '') || (this.basic_fieldName === '')) &&
              (((this.newMappingObj.field_mapping.defaultValue.target_field)))) {
              let warningmessage = 'Chosen stage will be applied on all documents since there are no conditions provided'
              // this.notificationService.notify('Chosen stage will be applied on all documents since there are no conditions provided','warning')
              if(save===true){
                this.saveConfig(warningmessage);
              }  
              else{            
              this.simulate(warningmessage);
              }
            }
            else if (this.newMappingObj.field_mapping.defaultValue.target_field === '') {
              if (this.newMappingObj.field_mapping.defaultValue.target_field === '') {
                $("#fieldname").css("border-color", "#DD3646");
                $("#infoWarning").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }
              this.notificationService.notify('Enter the required fields to proceed', 'error');
            }

            else {
              this.simulate();
            }
          }
        }        
      }

      else if(this.selectedStage.type === 'entity_extraction')
      {
        for (let i = 0; i <= this.selectedStage.condition.mappings.length; i++) {
          if (((this.selectedStage.condition.mappings[i].operator === '') || (this.basic_fieldName === '')) &&
            (((this.newMappingObj[this.selectedStage.type].defaultValue.source_field) && 
            ((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length)!=0) && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field)))) {
            let warningmessage = 'Chosen stage will be applied on all documents since there are no conditions provided'
            // this.notificationService.notify('Chosen stage will be applied on all documents since there are no conditions provided','warning')
            if(save===true){
              this.saveConfig(warningmessage);
            }  
            else{            
            this.simulate(warningmessage);
            }
          }
          else if (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '' || (this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length==0)
                    || this.newMappingObj[this.selectedStage.type].defaultValue.target_field === '' ) {
                      console.log("Hello");
            if ((this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '')
              && ((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length)==0) && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field===''))
              
              {
              $("#dropdownBasic1entity").css("border-color", "#DD3646");
              // $("#addentity").css("border-color", "#DD3646");
              $("#addentity").parents('div').css("border-color", "#DD3646");
              $("#infoWarning3").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              $("#entitytarget").css("border-color", "#DD3646");
              $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });

            }
            else if ((this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '')&&((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types).length)==0
                &&(this.newMappingObj[this.selectedStage.type].defaultValue.target_field))
            {
              $("#dropdownBasic1entity").css("border-color", "#DD3646");
              //$("#addentity").css("border-color", "#DD3646");
              $("#addentity").parents('div').css("border-color", "#DD3646");
              $("#infoWarning3").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
            else if (((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length)==0) && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field==='')
                 &&(this.newMappingObj[this.selectedStage.type].defaultValue.source_field)) {
             // $("#addentity").css("border-color", "#DD3646");
             $("#addentity").parents('div').css("border-color", "#DD3646");
              $("#infoWarning3").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              $("#entitytarget").css("border-color", "#DD3646");
              $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
            else if ((this.newMappingObj[this.selectedStage.type].defaultValue.target_field==='') && (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '')
                &&  (this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length)) {
              $("#entitytarget").css("border-color", "#DD3646");
              $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              $("#dropdownBasic1entity").css("border-color", "#DD3646");
            }
            else if ((this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '') && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field) && 
             (this.newMappingObj[this.selectedStage.type].defaultValue.entity_types.length))
            {
              $("#dropdownBasic1entity").css("border-color", "#DD3646");
            }
            else if (((this.newMappingObj[this.selectedStage.type].defaultValue.entity_types).length==0) && (this.newMappingObj[this.selectedStage.type].defaultValue.source_field)
                 &&((this.newMappingObj[this.selectedStage.type].defaultValue.target_field)) ) {
              //$("#addentity").css("border-color", "#DD3646");
              $("#addentity").parents('div').css("border-color", "#DD3646");
              $("#infoWarning3").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
            else if (((this.newMappingObj[this.selectedStage.type].defaultValue.target_field==''))) {
              $("#entitytarget").css("border-color", "#DD3646");
              $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
            this.notificationService.notify('Enter the required fields to proceed', 'error');
          }
          else {
            this.simulate();
          }
        }         
      }
      else if(this.selectedStage.type === 'traits_extraction')
      {
        for (let i = 0; i <= this.selectedStage.condition.mappings.length; i++) {          
          if (((this.selectedStage.condition.mappings[i].operator === '') || (this.basic_fieldName === '')) &&
            (((this.newMappingObj[this.selectedStage.type].defaultValue.source_field) && 
            ((this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups.length)!=0) && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field)))) {
            let warningmessage = 'Chosen stage will be applied on all documents since there are no conditions provided'
            // this.notificationService.notify('Chosen stage will be applied on all documents since there are no conditions provided','warning')
            if(save===true){
              this.saveConfig(warningmessage);
            }  
            else{            
            this.simulate(warningmessage);
            }
          }
          else if (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '' || (this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups.length==0)
                    || this.newMappingObj[this.selectedStage.type].defaultValue.target_field === '' ) {
            if ((this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '')
              && ((this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups.length)==0) && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field===''))
              
              {
              $("#dropdownBasic1entity").css("border-color", "#DD3646");
              //$("#traitsgroup").css("border-color", "#DD3646");
              $("#traitsgroup").parents('div').css("border-color", "#DD3646");
              $("#infoWarning5").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              $("#entitytarget").css("border-color", "#DD3646");
              $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });

            }
            else if (((this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '')&&(this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups.length)==0)) {
              $("#dropdownBasic1entity").css("border-color", "#DD3646");
              //$("#traitsgroup").css("border-color", "#DD3646");
              $("#traitsgroup").parents('div').css("border-color", "#DD3646");
              $("#infoWarning5").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
            else if (((this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups.length)==0) && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field==='')) {
              //$("#traitsgroup").css("border-color", "#DD3646");
              $("#traitsgroup").parents('div').css("border-color", "#DD3646");
              $("#infoWarning5").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              $("#entitytarget").css("border-color", "#DD3646");
              $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
            else if ((this.newMappingObj[this.selectedStage.type].defaultValue.target_field==='') && (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '')) {
              $("#entitytarget").css("border-color", "#DD3646");
              $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              $("#dropdownBasic1entity").css("border-color", "#DD3646");
            }
            else if (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '') {
              $("#dropdownBasic1entity").css("border-color", "#DD3646");
            }
            else if ((this.newMappingObj[this.selectedStage.type].defaultValue.trait_groups).length==0) {
              //$("#traitsgroup").css("border-color", "#DD3646");
              $("#traitsgroup").parents('div').css("border-color", "#DD3646");
              $("#infoWarning5").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
            else if (this.newMappingObj[this.selectedStage.type].defaultValue.target_field==='') {
              $("#entitytarget").css("border-color", "#DD3646");
              $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
            this.notificationService.notify('Enter the required fields to proceed', 'error');
          }
          else {
            this.simulate();
          }
        }         
      }
      else if(this.selectedStage.type === 'keyword_extraction'){
        for (let i = 0; i <= this.selectedStage.condition.mappings.length; i++) {
          if (((this.selectedStage.condition.mappings[i].operator === '') || (this.basic_fieldName === '')) &&
            (((this.newMappingObj[this.selectedStage.type].defaultValue.source_field) && 
              (this.newMappingObj[this.selectedStage.type].defaultValue.target_field)))) {
            let warningmessage = 'Chosen stage will be applied on all documents since there are no conditions provided'
            // this.notificationService.notify('Chosen stage will be applied on all documents since there are no conditions provided','warning')
            if(save===true){
              this.saveConfig(warningmessage);
            }  
            else{            
            this.simulate(warningmessage);
            }
          }
          else if (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '' 
                    || this.newMappingObj[this.selectedStage.type].defaultValue.target_field === '' ) {
            if ((this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '')
               && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field===''))           
              {
                $("#dropdownBasic1entity").css("border-color", "#DD3646");              
                $("#entitytarget").css("border-color", "#DD3646");
                $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }            
            else if (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '') {
                $("#dropdownBasic1entity").css("border-color", "#DD3646");
            }
            else if (this.newMappingObj[this.selectedStage.type].defaultValue.target_field==='') {
                $("#entitytarget").css("border-color", "#DD3646");
                $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
              this.notificationService.notify('Enter the required fields to proceed', 'error');
          }
          else {
            this.simulate();
          }
        }      

      }

      else if(this.selectedStage.type === 'semantic_meaning'){
        for (let i = 0; i <= this.selectedStage.condition.mappings.length; i++) {
          if (((this.selectedStage.condition.mappings[i].operator === '') || (this.basic_fieldName === '')) &&
            (((this.newMappingObj[this.selectedStage.type].defaultValue.source_field) && 
              (this.newMappingObj[this.selectedStage.type].defaultValue.target_field)))) {
            let warningmessage = 'Chosen stage will be applied on all documents since there are no conditions provided'
            // this.notificationService.notify('Chosen stage will be applied on all documents since there are no conditions provided','warning')
            if(save===true){
              this.saveConfig(warningmessage);
            }  
            else{            
            this.simulate(warningmessage);
            }
          }
          else if (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '' 
                    || this.newMappingObj[this.selectedStage.type].defaultValue.target_field === '' ) {
            if ((this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '')
               && (this.newMappingObj[this.selectedStage.type].defaultValue.target_field===''))           
              {
                $("#dropdownBasic1entity").css("border-color", "#DD3646");              
                $("#entitytarget").css("border-color", "#DD3646");
                $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
              }            
            else if (this.newMappingObj[this.selectedStage.type].defaultValue.source_field === '') {
                $("#dropdownBasic1entity").css("border-color", "#DD3646");
            }
            else if (this.newMappingObj[this.selectedStage.type].defaultValue.target_field==='') {
                $("#entitytarget").css("border-color", "#DD3646");
                $("#infoWarning4").css({ "top": "58%", "position": "absolute", "right": "1.5%", "display": "block" });
            }
              this.notificationService.notify('Enter the required fields to proceed', 'error');
          }
          else {
            this.simulate();
          }
        }      

      }

    }
  }
  
  scriptTextFlow(plainScriptTxt){
    if(plainScriptTxt){
      if (this.newMappingObj && this.newMappingObj.custom_script &&
        this.newMappingObj.custom_script.defaultValue && 
        this.newMappingObj.custom_script.defaultValue.script && 
        this.newMappingObj.custom_script.defaultValue.script != plainScriptTxt) {
        this.newMappingObj.custom_script.defaultValue.script = plainScriptTxt;
      }
    }
  }
  simulate(warningmessage?)
  {
    let plainScriptTxt: any;
    if (this.newMappingObj && this.newMappingObj.custom_script &&
      this.newMappingObj.custom_script.defaultValue && this.newMappingObj.custom_script.defaultValue.script)
    {
      plainScriptTxt = this.newMappingObj.custom_script.defaultValue.script;
    }
    let indexArrayLength: any = this.validateConditionForRD();
    if (indexArrayLength)
    {
      this.removeExcludeDocumentStage(indexArrayLength, false);
    }
    else
    {
      this.simulteObj.showSimulation = true;
      const self = this;
      this.simulating = true;
      this.simulteObj.simulating = true;
      const payload: any = {
        sourceType: this.simulteObj.sourceType,
        noOfDocuments: this.simulteObj.docCount || 5,
        // pipelineConfig: this.preparepayload()
      }
      const stages = this.preparepayload();
      if (this.currentEditIndex > -1)
      {
        payload.pipelineConfig = stages.slice(0, this.currentEditIndex + 1);
        //payload.pipelineConfig = [stages[this.currentEditIndex]];

      } else
      {
        payload.pipelineConfig = stages
      }
      if (this.currentEditIndex)
      {
        this.simulateAnimate(payload.pipelineConfig);
      } else
      {
        if (this.pollingSubscriber)
        {
          this.pollingSubscriber.unsubscribe();
        }
      }
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        indexPipelineId: this.indexPipelineId
      };
      this.searchSimulator = '';
       /** Workbench plain text temp */
       this.scriptTextFlow(plainScriptTxt);
      this.service.invoke('post.simulate', quaryparms, payload).subscribe(res => {
        /** Workbench plain text temp */
          // if (this.newMappingObj && this.newMappingObj.custom_script &&
          //   this.newMappingObj.custom_script.defaultValue && 
          //   this.newMappingObj.custom_script.defaultValue.script && 
          //   this.newMappingObj.custom_script.defaultValue.script != plainScriptTxt) {
          //   this.newMappingObj.custom_script.defaultValue.script = plainScriptTxt;
          // }
        this.simulteObj.simulating = false;
        this.addcode(res);
        this.mixpanel.postEvent('Initiated Simulator', {});
        this.notificationService.notify('Simulated Successfully', 'success')
        if(warningmessage){
          this.notificationService.notify(warningmessage,'warning');
        }
        this.simulating = false;
        if (this.pollingSubscriber)
        {
          this.pollingSubscriber.unsubscribe();
        }
        this.simulteObj.currentSimulateAnimi = -1;
        this.simulteObj.simulationInprogress = false;
        
      }, errRes => {
        if(warningmessage){
          this.notificationService.notify(warningmessage,'warning');
        }
        this.simulating = false;
        this.simulteObj.simulating = false;
        this.addcode({});
        if (this.pollingSubscriber)
        {
          this.pollingSubscriber.unsubscribe();
        }
        this.simulteObj.currentSimulateAnimi = -1;
        this.simulteObj.simulationInprogress = false;
        if (this.pollingSubscriber)
        {
          this.pollingSubscriber.unsubscribe();
        }
        this.simulteObj.currentSimulateAnimi = -1;
        /** Workbench plain text temp */
        if (this.newMappingObj && this.newMappingObj.custom_script &&
          this.newMappingObj.custom_script.defaultValue && this.newMappingObj.custom_script.defaultValue.script)
        {
          this.newMappingObj.custom_script.defaultValue.script = plainScriptTxt;
        }
        this.errorToaster(errRes, 'Failed to get stop words');
      });
    }
  }
  removeStage(i, stageType)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Stage',
        text: 'Are you sure you want to delete ?',
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected stage will be deleted from workbench.',
        // text: 'Do you want to discard this stage?',
        // newTitle: 'Do you want to discard this stage?',
        // body:'The '+stageType+' stage will be discarded as it does not contain any conditions.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result =>
      {
        if (result === 'yes')
        {
          if (this.pipeline[i]._id)
          {
            this.modifiedStages.deletedStages.push(this.pipeline[i]);
          } else
          {
            if (this.modifiedStages.createdStages.length)
            {
              let index = this.modifiedStages.createdStages.findIndex((d) => d.type == this.pipeline[i].type);
              if (index > -1)
              {
                this.modifiedStages.createdStages.splice(index, 1);
              }
            }

          }
          this.pipeline.splice(i, 1);
          dialogRef.close();
          this.notificationService.notify('Deletd Successfully', 'success')
          if (this.pipeline && this.pipeline.length)
          {
            this.selectStage(this.pipeline[0], 0);
          } else
          {
            this.selectedStage = null
          }
        } else if (result === 'no')
        {
          dialogRef.close();
          // console.log('deleted')
        }
      })
  }
  addField()
  {
    const payload: any = {
      fields: []
    }
    this.newfieldsData.forEach(field =>
    {
      const tempPayload: any = {
        fieldName: field.fieldName,
        fieldDataType: field.fieldDataType,
        isMultiValued: field.isMultiValued,
        isRequired: field.isRequired,
        isStored: field.isStored,
        isIndexed: field.isIndexed,
      }
      if (field.isActive)
      {
        payload.fields.push(tempPayload);
      }
    });
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
    };
    let api = 'post.createField';
    if (this.newFieldObj && this.newFieldObj._id)
    {
      api = 'put.updateField'
    }
    this.service.invoke(api, quaryparms, payload).subscribe(res =>
    {
      //this.notificationService.notify('Fields added successfully','success');
      this.notificationService.notify('New Fields have been added. Please train to re-index the configuration', 'success');
      this.closeModalPopup();
      this.getFileds();
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to create field');
    });
  }
  getFileds(offset?)
  {
    this.loadingFields = true;
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
    };
    let serviceId = 'get.allFieldsData';
    // let serviceId ='get.allField';
    this.service.invoke(serviceId, quaryparms).subscribe(res =>
    {
      this.fields = res.fields || [];
      this.getIndexPipline();
      this.loadingFields = false;
    }, errRes =>
    {
      this.loadingFields = false;
      this.errorToaster(errRes, 'Failed to get index  stages');
    });
  }
  deleteIndField(record, dialogRef)
  {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      fieldId: record._id,
    };
    this.service.invoke('delete.deleteField', quaryparms).subscribe(res =>
    {
      const deleteIndex = _.findIndex(this.fields, (pg) =>
      {
        return pg._id === record._id;
      })
      this.fields.splice(deleteIndex, 1);
      dialogRef.close();
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to delete field');
    });
  }
  deleteFieldPop(record)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Field',
        text: 'Are you sure you want to delete selected field?',
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected field will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result =>
      {
        if (result === 'yes')
        {
          this.deleteIndField(record, dialogRef);
        } else if (result === 'no')
        {
          dialogRef.close();
          // console.log('deleted')
        }
      })
  }
  getIndexPipline()
  {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId
    };
    // console.log("index queryparams", quaryparms);
    this.service.invoke('get.indexpipelineStages', quaryparms).subscribe(res =>
    {
      res.stages.map(data =>
      {
        return data?.condition?.mappings?.map(data1 =>
        {
          let obj = this.fields.find(da => da._id === data1?.fieldId);
          data1.fieldName = obj?.fieldName
        })
      })
      this.pipeline = res.stages || [];
      this.pipelineCopy = JSON.parse(JSON.stringify(res.stages));
      if (res.stages && res.stages.length)
      {
        this.selectStage(res.stages[0], 0);
      }
      this.loadingContent = false;
      if (!this.inlineManual.checkVisibility('WORKBENCH'))
      {
        this.inlineManual.openHelp('WORKBENCH')
        this.inlineManual.visited('WORKBENCH')
      }
    }, errRes =>
    {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get index  stages');
    });
  }
  getSystemStages()
  {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
    };
    this.service.invoke('get.platformStages', quaryparms).subscribe(res =>
    {
      // removing Duplicate value - temporary
      if (!this.defaultStageTypes.length)
      {

        for (let index = 0; index < res.stages.length; index++)
        {
          if (index < 11 && res.stages[index].name !== 'FAQ Keyword Extraction')
            this.defaultStageTypes.push(res.stages[index])
        }
      }

      setTimeout(() =>
      {
        $('#addToolTo').click();
      }, 700);
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to get stop words');
    });
  }
  confirmChangeDiscard(newstage?, i?)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Discard current changes',
        text: 'Are you sure you want to discard current?',
        newTitle: 'Are you sure you want to discard?',
        body: 'Current changes will be discarded.',
        buttons: [{ key: 'yes', label: 'Discard', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result =>
      {
        if (result === 'yes')
        {
          if (this.pipeline.length > this.pipelineCopy)
          {
            i = i - 1;
          }
          this.clearDirtyObj();
          if (newstage)
          {
            this.selectStage(newstage, i);
          } else
          {
            this.createNewMap();
          }
          dialogRef.close();
        } else if (result === 'no')
        {
          dialogRef.close();
          // console.log('deleted')
        }
      })
  }
  removeConfig(index, list)
  {
    this.changesDetected = true;
    list.splice(index, 1);
  }
  clearDirtyObj(cancel?)
  {
    this.pipeline = JSON.parse(JSON.stringify(this.pipelineCopy));
    this.pipeline.map(data =>
    {
      return data?.condition?.mappings?.map(data1 =>
      {
        let obj = this.fields.find(da => da._id === data1.fieldId);
        if (obj && obj.fieldName)
        {
          data1.fieldName = obj.fieldName
        }
      })
    })
    if (this.selectedStage && !this.selectedStage._id)
    {
      if (this.pipeline && this.pipeline.length)
      {
        this.selectStage(this.pipeline[0], 0);
      } else
      {
        this.selectedStage = null
      }
    } else
    {
      const index = _.findIndex(this.pipeline, (pg) =>
      {
        return pg._id === this.selectedStage._id;
      })
      if (index > -1)
      {
        this.selectedStage = this.pipeline[index];
      }
    }
    if (!cancel)
    {
      this.currentEditIndex = -1;
    }
    this.changesDetected = false;
    this.setResetNewMappingsObj();
  }
  selectStage(stage, i)
  {
    if (this.changesDetected && false)
    {
      this.confirmChangeDiscard(stage, i);
    } else
    {
      this.currentEditIndex = i;
      this.selectedStageIndex = i;
      this.checkNewAddition();
      if (stage && stage.type === 'custom_script' && stage.config && stage.config.mappings && stage.config.mappings.length)
      {
        if (!this.newMappingObj.custom_script)
        {
          this.newMappingObj.custom_script = {
            defaultValue: {
              script: ''
            }
          }
        }
        this.newMappingObj.custom_script.defaultValue.script = stage.config.mappings[0].script || '';
      } else
      {
        if (!this.newMappingObj.custom_script)
        {
          this.newMappingObj.custom_script = {
            defaultValue: {
              script: ''
            }
          }
        }
        this.newMappingObj.custom_script.defaultValue.script = '';
      }
      this.selectedStage = stage;
    }
  }
  checkDuplicateTags(suggestion: string, alltTags): boolean
  {
    return alltTags.every((f) => f !== suggestion);
  }
  addCustomScript(script)
  {
    this.changesDetected = true;
    if (!(this.selectedStage.config && this.selectedStage.config.mappings))
    {
      this.selectedStage.config.mappings = []
    }
    this.selectedStage.config.mappings[0] = {
      script
    }
  }
  addEntityList(event: MatChipInputEvent, map)
  {
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim())
    {
      if (!this.checkDuplicateTags((value || '').trim(), map.entity_types))
      {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else
      {
        map.entity_types.push(value.trim());
      }
    }
    if (input)
    {
      input.value = '';
    }

  }
  removeEntityList(map, entity)
  {
    this.changesDetected = true;
    const index = map.entity_types.indexOf(entity);
    if (index >= 0)
    {
      map.entity_types.splice(index, 1);
    }
  }
  addTraitsList(event: MatChipInputEvent, map)
  {
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim())
    {
      if (!this.checkDuplicateTags((value || '').trim(), map.trait_groups))
      {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else
      {
        map.trait_groups.push(value.trim());
      }
    }
    if (input)
    {
      input.value = '';
    }
  }
  removeKeyWordsList(map, trait)
  {
    this.changesDetected = true;
    const index = map.trait_groups.indexOf(trait);
    if (index >= 0)
    {
      map.trait_groups.splice(index, 1);
    }
  }
  addKeyWordsList(event: MatChipInputEvent, map)
  {
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim())
    {
      if (!this.checkDuplicateTags((value || '').trim(), map.trait_groups))
      {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else
      {
        map.trait_groups.push(value.trim());
      }
    }
    if (input)
    {
      input.value = '';
    }
  }
  removeTraitsList(map, trait)
  {
    this.changesDetected = true;
    const index = map.trait_groups.indexOf(trait);
    if (index >= 0)
    {
      map.trait_groups.splice(index, 1);
    }
  }
  checkFieldsValidOrNot(map)
  {
    if (this.selectedStage.type == 'field_mapping')
    {
      if ((map.operation === 'rename' || map.operation === 'copy') ? (!map.target_field || !map.source_field) : (map.operation === 'remove' ? !map.target_field : (!map.target_field || !map.value)))
      {
        return false;
      }
    } else if (this.selectedStage.type == 'entity_extraction')
    {
      if (!map.target_field || !map.source_field || !map.entity_types.length)
      {
        return false;
      }
    } else if (this.selectedStage.type == 'traits_extraction')
    {
      if (!map.target_field || !map.source_field || !map.trait_groups.length)
      {
        return false;
      }
    } else if (this.selectedStage.type == 'keyword_extraction' || this.selectedStage.type == 'semantic_meaning')
    {
      if (!map.target_field || !map.source_field)
      { // removing this ' || !map.model ' parameter to exectute the removal of choose model
        return false;
      }
    } else if (this.selectedStage.type == 'exclude_document')
    {
      if (!map.target_field || !map.value)
      {
        return false;
      }
    }
    return true;
  }
  onSourcefieldChange(event, parent, no, e)
  {
    // console.log(event,parent,no)
    // e.stopPropagation();
    // $(this).next('.dropdown-toggle').find('[data-toggle=dropdown]').dropdown('toggle');
    // parent.classList.add('show')
    // parent.children[1].classList.add('show');
    // parent.children[1].style.top ="0px";
  }
  addFiledmappings(map, isNotDefault?)
  {
    this.changesDetected = true;
    if (!this.selectedStage.config)
    {
      this.selectedStage.config = {
        mappings: []
      }
    }
    if (!this.selectedStage.config.mappings)
    {
      this.selectedStage.config.mappings = [];
    }
    if (isNotDefault && !this.checkFieldsValidOrNot(map))
    {
      return
    }
    this.selectedStage.config.mappings.push(map);
    this.setResetNewMappingsObj(true, true);
  }
  closeNewStage()
  {
    this.showNewStageType = false;
    if (this.pipeline && this.pipeline.length)
    {
      this.selectedStage = this.pipeline[0];
    }

  }
  switchStage(systemStage, i)
  {  
    
    if (this.showNewStageType)
    {
      const obj: any = new StageClass();
      const newArray = [];
      obj.name = this.defaultStageTypes[i].name;
      obj.enable = true;
      obj.type = this.defaultStageTypes[i].type;
      obj.category = this.defaultStageTypes[i].category;
      newArray.push(obj)
      this.pipeline = newArray.concat(this.pipeline || []);
      this.selectedStage = this.pipeline[0];
      this.showNewStageType = false;
      this.modifiedStages.createdStages.push(this.pipeline[0]);
    }
    this.selectedStage.type = this.defaultStageTypes[i].type;
    this.selectedStage.category = this.defaultStageTypes[i].category;
    this.selectedStage.name = this.defaultStageTypesObj[systemStage.type].name;
    this.selectedStage.config = {};
    //if (systemStage?.type !== 'custom_script') {
    this.selectedStage.condition = { type: 'basic', mappings: [{ fieldId: '', operator: '', value: [] }] }
    //}
    if (systemStage && systemStage.type === 'custom_script')
    {
      if (!this.newMappingObj.custom_script)
      {
        this.newMappingObj.custom_script = {
          defaultValue: {
            script: ''
          }
        }
      }
      this.newMappingObj.custom_script.defaultValue.script = '';
    }
  }
  createNewMap()
  {
    if (this.changesDetected && false)
    {
      this.confirmChangeDiscard()
    } else
    {
      this.changesDetected = true;
      const obj: any = new StageClass();
      const newArray = [];
      obj.name = this.defaultStageTypes[0].name;
      obj.enable = true;
      obj.type = this.defaultStageTypes[0].type;
      obj.category = this.defaultStageTypes[0].category;
      newArray.push(obj)
      this.pipeline = newArray.concat(this.pipeline);
      this.selectedStage = this.pipeline[0];
    }
  }
  selectNewItem(defaultStage)
  {
    this.newStageObj = JSON.parse(JSON.stringify(defaultStage));
  }
  errorToaster(errRes, message)
  {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg)
    {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message)
    {
      this.notificationService.notify(message, 'error');
    } else
    {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  selectAll()
  {
    this.newfieldsData.forEach(element =>
    {
      element.isActive = this.isActiveAll;
    });
  }

  selectSingle(isActive)
  {
    if (isActive)
    {
      let fieldActive = false;
      this.newfieldsData.forEach(element =>
      {
        if (element.isActive && !fieldActive)
        {
          this.isActiveAll = true;
        } else
        {
          fieldActive = true;
          this.isActiveAll = false;
        }
      });
    } else
    {
      this.isActiveAll = false;
    }

  }
  focusoutSearch()
  {
    if (this.activeClose)
    {
      this.searchSimulator = '';
      this.activeClose = false;
      this.searchBySimulator();
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch)
  {
    setTimeout(() =>
    {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  searchBySimulator()
  {
    const filtered = this.getKeyByValue(this.simulateJson, this.searchSimulator);
    this.filteredSimulatorRes = JSON.stringify(filtered, null, ' ');
  }
  getKeyByValue(object, searchSimulator)
  {
    searchSimulator = searchSimulator.toLowerCase();
    let filteredObject: any = {};
    Object.keys(object).forEach(key =>
    {
      if (key.toLowerCase().search(searchSimulator) > -1)
      {
        filteredObject[key] = object[key];
      }
      else if (object[key].length && this.checkIsArray(object[key]))
      {
        object[key].forEach((element, index) =>
        {
          Object.keys(element).forEach(key1 =>
          {
            if (key1.toLowerCase().search(searchSimulator) > -1)
            {
              if (!((filteredObject || {})[key] || []).length)
              {
                filteredObject[key] = [];
              }
              filteredObject[key].push({ [key1]: element[key1] });
            } else if (this.checkIsArray(element[key1]))
            {
              //
              element[key1].forEach((ele, index2) =>
              {
                Object.keys(ele).forEach(key2 =>
                {
                  if (key2.toLowerCase().search(searchSimulator) > -1)
                  {
                    if (!((filteredObject || {})[key] || []).length)
                    {
                      filteredObject[key] = [];
                    }
                    if (!((filteredObject[key][index] || {})[key1] || []).length)
                    {
                      filteredObject[key][index] = { [key1]: [] };
                    }
                    filteredObject[key][index][key1].push({ [key2]: ele[key2] })
                  }
                });
              });
              //
            }
          });
        });
      }
    });
    return filteredObject;
  }
  checkIsArray(value)
  {
    if (Array.isArray(value))
    {
      return true;
    } else
    {
      return false;
    }
  }

  painlessScriptChanged(event)
  {
    let count = this.codemirror.codeMirror.lineCount();
    console.log("lines", this.codemirror.codeMirror.lineCount());
  }
  //matchip method
  add(event: MatChipInputEvent, index): void
  {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim())
    {
      this.selectedStage.condition.mappings[index].value.push(value.trim());
    }
    if (input)
    {
      input.value = '';
    }
    this.containCtrl.setValue(null);
  }
  //remove matchip data
  remove(member: string, i): void
  {
    const index = this.selectedStage.condition.mappings[i].value.indexOf(member);
    if (index >= 0) this.selectedStage.condition.mappings[i].value.splice(index, 1);
  }
  // selected(event: MatAutocompleteSelectedEvent): void {
  //   this.containCondition.push(event.option.viewValue);
  //   this.containInput.nativeElement.value = '';
  //   this.containCtrl.setValue(null);
  // }
  clearcontent()
  {
    if ($('#searchBoxId') && $('#searchBoxId').length)
    {
      $('#searchBoxId')[0].value = "";
      this.search_basic_fieldName = '';
    }
  }
  // to clear source field content.
  clearcontentSrc()
  {
    if ($('#searchBoxId1') && $('#searchBoxId1').length)
    {
      $('#searchBoxId1')[0].value = "";
      this.search_basic_fieldName1 = '';
    }
  }
  clearcontentSrcD()
  {
    if ($('#searchBoxId2') && $('#searchBoxId2').length)
    {
      $('#searchBoxId2')[0].value = "";
      this.search_basic_fieldName2 = '';
    }
  }

  ngOnDestroy()
  {
    const self = this;
    if (this.pollingSubscriber)
    {
      this.pollingSubscriber.unsubscribe();
    }
    if (this.subscription)
    {
      this.subscription.unsubscribe();
    }

  }
}
class StageClass
{
  name: string
  category: string
  type: string
  enable: boolean;
  condition: string
  config: any = {}
}

