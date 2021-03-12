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
declare const $: any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedApp: any = {};
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
  fields: any = [];
  newfieldsData: any = [];
  loadingFields = true;
  isActiveAll = true;
  showStageType = false;
  selectedStage;
  changesDetected;
  currentEditIndex: any = -1;
  pollingSubscriber: any = null;
  showNewStageType: boolean = false;
  subscription: Subscription;
  @ViewChild('tleft') public tooltip: NgbTooltip;
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  newStage: any = {
    name: 'My Mapping'
  }
  newFieldObj: any = null
  defaultStageTypes: any = [];
  selectedMapping: any = {};
  actionItmes: any = [{ type: 'set' }, { type: 'rename' }, { type: 'copy' }, { type: 'Delete' }];
  newMappingObj: any = {}
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
      name: 'Remove Document'
    },
  }
  entityNlp = [
    { title: 'Address', value: 'address', isDepricated: false },
    { title: 'Airport', value: 'airport', isDepricated: false },
    { title: 'Attachment(Image / File)', value: 'attachment', isDepricated: false },
    { title: 'City', value: 'city', isDepricated: false },
    // {"title": "City (Advanced)", "value": "cityAdv", "isDepricated": false},
    { title: 'Country', value: 'country', isDepricated: false },
    // {"title": "City with Geo Coordinates", "value": "city_coordinates"},
    { title: 'Company Name or Organization Name', value: 'company_name', isDepricated: false },
    // {"title": "City", "value": "city"},
    { title: 'Color', value: 'color', isDepricated: false },
    { title: 'Currency(Deprecated)', value: 'currency', isDepricated: true },
    { title: 'Currency', value: 'currencyv2', isDepricated: false },
    { title: 'Custom', value: 'regex', isDepricated: false },
    { title: 'Composite', value: 'composite', isDepricated: false },
    { title: 'Date', value: 'date', isDepricated: false },
    { title: 'Date Period', value: 'dateperiod', isDepricated: false },
    { title: 'Date Time', value: 'datetime', isDepricated: false },
    { title: 'Description', value: 'description', isDepricated: false },
    { title: 'Email', value: 'email', isDepricated: false },
    // {"title": "JSON Object", "value": "json_object", "isDepricated": false},
    { title: 'List of items (enumerated)', value: 'list_of_values', isDepricated: false },
    { title: 'List of items (lookup)', value: 'list_of_items_lookup', isDepricated: false },
    { title: 'Location', value: 'location', isDepricated: false },
    { title: 'Number', value: 'number', isDepricated: false },
    // {"title": "Password", "value": "password", "isDepricated": false},
    { title: 'Person Name', value: 'person_name', isDepricated: false },
    { title: 'Percentage', value: 'percentage', isDepricated: false },
    { title: 'Phone Number', value: 'phone_number', isDepricated: false },
    // {"title": "Quantity(Number with unit of measure)", "value": "quantity"},
    { title: 'Quantity', value: 'quantityv2', isDepricated: false },
    { title: 'String', value: 'label', isDepricated: false },
    { title: 'Time', value: 'time', isDepricated: false },
    { title: 'Time Zone', value: 'timezone', isDepricated: false },
    { title: 'URL', value: 'url', isDepricated: false },
    { title: 'Zip Code', value: 'zipcode', isDepricated: false },

    { title: 'From - number(minimum of a range)(Deprecated)', value: 'from_number', isDepricated: true },
    { title: 'To - number(maximum of a range, limit)(Deprecated)', value: 'to_number', isDepricated: true },
    { title: 'Quantity(Deprecated)', value: 'quantity', isDepricated: true }
    // {"title": "City", "value": "city"},
  ];
  simulteObj: any = {
    sourceType: 'faq',
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
  showSearch;
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
  simulateJson;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService:AppSelectionService
  ) { }
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    console.log("this.selectedApp", this.selectedApp)
    if ((this.selectedApp || {}).searchIndexes && (this.selectedApp || {}).searchIndexes.length) {
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
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res=>{
      this.loadIndexAll()
    })
  }
  loadIndexAll(){
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      if(this.indexPipelineId){
        this.getSystemStages();
        this.getIndexPipline();
        this.getFileds();
        this.setResetNewMappingsObj();
        this.addcode({});
        this.getTraitGroups()
      }
  }
  ngAfterViewInit() {
    const self = this;
    setTimeout(() => {
      $('#addToolTo').click();
    }, 700);
    this.bindDocumentClickEvents();
  }
  bindDocumentClickEvents() {
    const self = this;
    $('body').off('click').on('click', (event) => {
      if (event && event.target) {
        if (!$(event.target).closest('.simulator-div').length && !$(event.target).closest('.simulatebtnContainer').length) {
          self.closeSimulator();
        }
      }
    });
  }
  getTraitGroups(initial?) {
    const quaryparms: any = {
      userId: this.authService.getUserId(),
      streamId: (this.selectedApp || {})._id
    }
    this.service.invoke('get.traits', quaryparms).subscribe(res => {
      const allTraitskeys: any = [];
      if (res && res.length) {
        res.forEach(element => {
          allTraitskeys.push(element.groupName);
        });
        this.traitsSuggesitions = allTraitskeys;
      }
    }, (err) => {
    });
  };
  drop(event: CdkDragDrop<string[]>, list) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }
  setRuleObj(configObj, key, value, type) {
    this.changesDetected = true;
    if (type === 'field_mapping') {
      configObj[key] = value;
      if (value === 'remove') {
        delete configObj.value
      }
    }
  }
  selectedTag(data: MatAutocompleteSelectedEvent, list) {
    if (!this.checkDuplicateTags((data.option.value || '').trim(), list)) {
      this.notificationService.notify('Duplicate tags are not allowed', 'warning');
      return;
    } else {
      list.push(data.option.value);
      this.suggestedInput.nativeElement.value = '';
    }
  }
  setResetNewMappingsObj(ignoreSimulate?, saveConfig?) {
    if (!ignoreSimulate) {
      this.simulteObj = {
        sourceType: 'faq',
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
    if (saveConfig && this.selectedStage && this.selectedStage.type === 'custom_script' && this.selectedStage.config && this.selectedStage.config.mappings && this.selectedStage.config.mappings.length) {
      if (!this.newMappingObj.custom_script) {
        this.newMappingObj.custom_script = {
          defaultValue: {
            script: ''
          }
        }
      }
      this.newMappingObj.custom_script.defaultValue.script = this.selectedStage.config.mappings[0].script || '';
    }
  }
  checkNewAddition() {
    if (this.selectedStage && this.selectedStage.type === 'field_mapping') {
      if (this.newMappingObj.field_mapping && this.newMappingObj.field_mapping.defaultValue) {
        if (this.newMappingObj.field_mapping.defaultValue.operation && this.newMappingObj.field_mapping.defaultValue.target_field && (this.newMappingObj.field_mapping.defaultValue.value || this.newMappingObj.field_mapping.defaultValue.operation === 'remove' || this.newMappingObj.field_mapping.defaultValue.source_field)) {
          this.addFiledmappings(this.newMappingObj.field_mapping.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'entity_extraction') {
      if (this.newMappingObj.entity_extraction && this.newMappingObj.entity_extraction.defaultValue) {
        if (this.newMappingObj.entity_extraction.defaultValue.source_field && this.newMappingObj.entity_extraction.defaultValue.entity_types && this.newMappingObj.entity_extraction.defaultValue.entity_types.length && this.newMappingObj.entity_extraction.defaultValue.target_field) {
          this.addFiledmappings(this.newMappingObj.entity_extraction.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'traits_extraction') {
      if (this.newMappingObj.traits_extraction && this.newMappingObj.traits_extraction.defaultValue) {
        if (this.newMappingObj.traits_extraction.defaultValue.source_field && this.newMappingObj.traits_extraction.defaultValue.trait_groups && this.newMappingObj.traits_extraction.defaultValue.trait_groups.length && this.newMappingObj.traits_extraction.defaultValue.target_field) {
          this.addFiledmappings(this.newMappingObj.traits_extraction.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'keyword_extraction') {
      if (this.newMappingObj.keyword_extraction && this.newMappingObj.keyword_extraction.defaultValue) {
        if (this.newMappingObj.keyword_extraction.defaultValue.source_field && this.newMappingObj.keyword_extraction.defaultValue.target_field) {
          this.addFiledmappings(this.newMappingObj.keyword_extraction.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'semantic_meaning') {
      if (this.newMappingObj.semantic_meaning && this.newMappingObj.semantic_meaning.defaultValue) {
        if (this.newMappingObj.semantic_meaning.defaultValue.source_field && this.newMappingObj.semantic_meaning.defaultValue.target_field) {
          this.addFiledmappings(this.newMappingObj.semantic_meaning.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'custom_script') {
      if (this.newMappingObj.custom_script && this.newMappingObj.custom_script.defaultValue) {
        if (this.newMappingObj.custom_script.defaultValue.script) {
          this.addFiledmappings(this.newMappingObj.custom_script.defaultValue);
        }
      }
    }
    if (this.selectedStage && this.selectedStage.type === 'exclude_document') {
      if (this.newMappingObj.exclude_document && this.newMappingObj.exclude_document.defaultValue) {
        if (this.newMappingObj.exclude_document.defaultValue.script) {
          this.addFiledmappings(this.newMappingObj.exclude_document.defaultValue);
        }
      }
    }
  }
  toggleSearch() {
    if (this.showSearch && this.searchFields) {
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch
  }
  getFieldAutoComplete() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('put.indexPipeline', quaryparms, { stages: this.pipeline }).subscribe(res => {
      this.fieldAutoSuggestion = res;
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  selectFieldType(type) {
    if (type === 'number') {
      this.newFieldObj.fieldName = '';
      this.newFieldObj.fieldDataType = type
    } else {
      this.newFieldObj.fieldDataType = type
    }
  }
  poling() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    this.simulteObj.currentSimulateAnimi = -1;
    this.pollingSubscriber = interval(1000).pipe(startWith(0)).subscribe(() => {
      if (this.simulteObj.currentSimulateAnimi === (this.simulteObj.totalStages - 1)) {
        this.simulteObj.currentSimulateAnimi = -1;
      }
      this.simulteObj.currentSimulateAnimi = this.simulteObj.currentSimulateAnimi + 1;
      console.log('hilight ' + this.simulteObj.currentSimulateAnimi);
    }
    )
  }
  simulateAnimate(payload) {
    this.simulteObj.totalStages = payload.length - 1;
    this.simulteObj.simulationInprogress = true;
    this.poling()
  }
  preparepayload() {
    this.checkNewAddition();
    const stagesArray = [];
    this.payloadValidationObj.invalidObjs = {};
    this.payloadValidationObj.valid = true;
    this.pipeline.forEach(stage => {
      const tempStageObj = JSON.parse(JSON.stringify(stage));
      if (tempStageObj && tempStageObj.type === 'field_mapping') {
        if (tempStageObj.config && tempStageObj.config.mappings && tempStageObj.config.mappings.length) {
          const tempConfig: any = [];
          tempStageObj.config.mappings.forEach(config => {
            if (config && (config.operation === 'set') || (config.operation === 'copy') || (config.operation === 'rename')) {
              if (!config.target_field || !config.value) {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
              if (config.operation === 'copy' || config.operation === 'rename') {
                if (config.hasOwnProperty('value')) {
                  delete config.value;
                }
              } else {
                if (config.hasOwnProperty('source_field')) {
                  delete config.source_field;
                }
              }
            }
            if ((config.operation === 'remove')) {
              if (config.hasOwnProperty('value')) {
                delete config.value;
              }
              if (config.hasOwnProperty('source_field')) {
                delete config.source_field;
              }
              if (!config.target_field) {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
            }
            tempConfig.push(config);
          });
          tempStageObj.config.mappings = tempConfig;
        }
      }
      if (tempStageObj && tempStageObj.type === 'custom_script') {
        if (tempStageObj.config && tempStageObj.config.mappings && tempStageObj.config.mappings.length) {
          const tempConfig: any = [];
          tempStageObj.config.mappings.forEach(config => {
            if (!config.script) {
              this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
            }
            tempConfig[0] = config;
          });
          tempStageObj.config.mappings = tempConfig;
        }
      }
      if (tempStageObj && ((tempStageObj.type === 'entity_extraction') || (tempStageObj.type === 'traits_extraction') || (tempStageObj.type === 'keyword_extraction'))) {
        if (tempStageObj.config && tempStageObj.config.mappings && tempStageObj.config.mappings.length) {
          const tempConfig: any = [];
          tempStageObj.config.mappings.forEach(config => {
            if (!config.source_field || !config.source_field) {
              this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
            }
            if ((tempStageObj.type === 'entity_extraction')) {
              if (!(config && config.entity_types && config.entity_types.length)) {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
              if (config.trait_groups) {
                delete config.trait_groups;
              }
              if (config.keywords) {
                delete config.keywords;
              }
            }
            if ((tempStageObj.type === 'traits_extraction')) {
              if (!(config && config.trait_groups && config.trait_groups.length)) {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
              if (config.entity_types) {
                delete config.entity_types;
              }
              if (config.keywords) {
                delete config.keywords;
              }
            }
            if ((tempStageObj.type === 'keyword_extraction')) {
              if (!(config && config.keywords && config.keywords.length)) {
                this.payloadValidationObj.invalidObjs[tempStageObj._id] = true;
              }
              if (config.entity_types) {
                delete config.entity_types;
              }
              if (config.trait_groups) {
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
  checkForNewFields() {
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
      .subscribe(result => {
        if (result === 'yes') {
          dialogRef.close();
          this.openModalPopup();
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  validateConditionForRD() {
    let indexArray = [];
    if (this.pipeline.length) {
      for (let k = 0; k < this.pipeline.length; k++) {
        if (this.pipeline[k].type === 'exclude_document') {
          if (!this.pipeline[k].condition) {
            indexArray.push(k);
          }
        }
      }
    }
    return indexArray.length;
  }
  removeExcludeDocumentStage(indexArrayLength, isSaveConfig) {
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
      .subscribe(result => {
        if (result === 'yes') {
          for (let i = 0; i < indexArrayLength; i++) {
            let index = this.pipeline.findIndex((p) => !p.condition);
            if (index > -1) {
              this.pipeline.splice(index, 1);
            }
          }
          console.log("inside dialog");
          dialogRef.close();
          if (this.pipeline && this.pipeline.length) {
            this.selectStage(this.pipeline[0], 0);
            if (isSaveConfig) {
              this.saveConfig();
            } else {
              this.simulate();
            }
          } else {
            this.selectedStage = null
            return false;
          }
        } else if (result === 'no') {
          dialogRef.close();
          return false;
        }
      })
  }
  saveConfig(index?, dialogRef?) {
    let indexArrayLength: any = this.validateConditionForRD();
    if (indexArrayLength) {
      this.removeExcludeDocumentStage(indexArrayLength, true);
    }
    else {
      console.log("outside dialog");
      this.savingConfig = true;
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        indexPipelineId: this.indexPipelineId
      };
      this.service.invoke('put.indexPipeline', quaryparms, { stages: this.preparepayload() }).subscribe(res => {
        this.pipeline = res.stages || [];
        this.pipelineCopy = JSON.parse(JSON.stringify(res.stages));
        this.notificationService.notify('Configurations saved successfully', 'success');
        this.savingConfig = false;
        if (dialogRef && dialogRef.close) {
          dialogRef.close();
        }
        if (index !== 'null' && index !== undefined && (index > -1)) {
          this.currentEditIndex = -1
        }
        if (res && res.targetFields && res.targetFields.length) {
          const newFileds: any = [];
          res.targetFields.forEach(field => {
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
      }, errRes => {
        this.savingConfig = false;
        this.errorToaster(errRes, 'Failed to save configurations');
      });
    }

  }
  openModalPopup() {
    this.loadingFields = true;
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    this.getFileds();
  }
  closeModalPopup() {
    this.addFieldModalPopRef.close();
    this.setResetNewMappingsObj();
  }
  reindex() {
    const proceed = () => {
      this.reIndexing = true;
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        indexPipelineId: this.indexPipelineId
      };
      this.service.invoke('post.reindex', quaryparms).subscribe(res => {
        this.notificationService.notify('Re-indexed successfully', 'success')
        this.reIndexing = false;
      }, errRes => {
        this.errorToaster(errRes, 'Failed to re-index');
        this.reIndexing = false;
      });
    }
    if (this.changesDetected) {
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
        .subscribe(result => {
          if (result === 'yes') {
            this.clearDirtyObj();
            proceed();
            dialogRef.close();
          } else if (result === 'no') {
            dialogRef.close();
            console.log('deleted')
          }
        })
    } else {
      proceed();
    }
  }
  changeSimulate(value, type) {
    if (type === 'source') {
      this.simulteObj.sourceType = value;
    } else {
      this.simulteObj.docCount = value
    }
    this.simulate();
  }
  closeSimulator() {
    this.simulteObj = {
      sourceType: 'faq',
      docCount: 5,
      showSimulation: false,
    }
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    this.simulteObj.currentSimulateAnimi = -1;
  }
  addcode(data?) {
    data = data || {};
    this.simulateJson = JSON.stringify(data, null, ' ');
  }
  simulate() {
    let indexArrayLength: any = this.validateConditionForRD();
    if (indexArrayLength) {
      this.removeExcludeDocumentStage(indexArrayLength, false);
    }
    else {
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
      if (this.currentEditIndex > -1) {
        payload.pipelineConfig = stages.slice(0, this.currentEditIndex + 1);
      } else {
        payload.pipelineConfig = stages
      }
      if (this.currentEditIndex) {
        this.simulateAnimate(payload.pipelineConfig);
      } else {
        if (this.pollingSubscriber) {
          this.pollingSubscriber.unsubscribe();
        }
      }
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        indexPipelineId: this.indexPipelineId
      };
      this.service.invoke('post.simulate', quaryparms, payload).subscribe(res => {
        this.simulteObj.simulating = false;
        this.addcode(res);
        this.notificationService.notify('Simulated successfully', 'success')
        this.simulating = false;
        if (this.pollingSubscriber) {
          this.pollingSubscriber.unsubscribe();
        }
        this.simulteObj.currentSimulateAnimi = -1;
        this.simulteObj.simulationInprogress = false;
      }, errRes => {
        this.simulating = false;
        this.simulteObj.simulating = false;
        if (this.pollingSubscriber) {
          this.pollingSubscriber.unsubscribe();
        }
        this.simulteObj.currentSimulateAnimi = -1;
        this.simulteObj.simulationInprogress = false;
        if (this.pollingSubscriber) {
          this.pollingSubscriber.unsubscribe();
        }
        this.simulteObj.currentSimulateAnimi = -1;
        this.errorToaster(errRes, 'Failed to get stop words');
      });
    }
  }
  removeStage(i, stageType) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Stage',
        text: 'Are you sure you want to delete selected stage?',
        newTitle: 'Are you sure you want to delete selected stage?',
        body: 'Selected stage will be deleted.',
        // text: 'Do you want to discard this stage?',
        // newTitle: 'Do you want to discard this stage?',
        // body:'The '+stageType+' stage will be discarded as it does not contain any conditions.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.pipeline.splice(i, 1);
          dialogRef.close();
          if (this.pipeline && this.pipeline.length) {
            this.selectStage(this.pipeline[0], 0);
          } else {
            this.selectedStage = null
          }
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  addField() {
    const payload: any = {
      fields: []
    }
    this.newfieldsData.forEach(field => {
      const tempPayload: any = {
        fieldName: field.fieldName,
        fieldDataType: field.fieldDataType,
        isMultiValued: field.isMultiValued,
        isRequired: field.isRequired,
        isStored: field.isStored,
        isIndexed: field.isIndexed,
      }
      if (field.isActive) {
        payload.fields.push(tempPayload);
      }
    });
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
    };
    let api = 'post.createField';
    if (this.newFieldObj && this.newFieldObj._id) {
      api = 'put.updateField'
    }
    this.service.invoke(api, quaryparms, payload).subscribe(res => {
      //this.notificationService.notify('Fields added successfully','success');
      this.notificationService.notify('ⓘ New Fields have been added. Please train to re-index the configuration', 'info');
      this.closeModalPopup();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to create field');
    });
  }
  getFileds(offset?) {
    this.loadingFields = true;
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      offset: offset || 0,
      limit: 200
    };
    this.service.invoke('get.allField', quaryparms).subscribe(res => {
      this.fields = res.fields || [];
      this.loadingFields = false;
    }, errRes => {
      this.loadingFields = false;
      this.errorToaster(errRes, 'Failed to get index  stages');
    });
  }
  deleteIndField(record, dialogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      fieldId: record._id,
    };
    this.service.invoke('delete.deleteField', quaryparms).subscribe(res => {
      const deleteIndex = _.findIndex(this.fields, (pg) => {
        return pg._id === record._id;
      })
      this.fields.splice(deleteIndex, 1);
      dialogRef.close();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete field');
    });
  }
  deleteFieldPop(record) {
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
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteIndField(record, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  getIndexPipline() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId
    };
    console.log("index queryparams", quaryparms);
    this.service.invoke('get.indexpipelineStages', quaryparms).subscribe(res => {
      this.pipeline = res.stages || [];
      this.pipelineCopy = JSON.parse(JSON.stringify(res.stages));
      if (res.stages && res.stages.length) {
        this.selectStage(res.stages[0], 0);
      }
      this.loadingContent = false;
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get index  stages');
    });
  }
  getSystemStages() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
    };
    this.service.invoke('get.platformStages', quaryparms).subscribe(res => {
      // removing Duplicate value - temporary
      for (let index = 0; index < res.stages.length; index++) {
        if (index < 11 && res.stages[index].name !== 'FAQ Keyword Extraction')
          this.defaultStageTypes.push(res.stages[index])
      }
      setTimeout(() => {
        $('#addToolTo').click();
      }, 700);
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get stop words');
    });
  }
  confirmChangeDiscard(newstage?, i?) {
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
      .subscribe(result => {
        if (result === 'yes') {
          if (this.pipeline.length > this.pipelineCopy) {
            i = i - 1;
          }
          this.clearDirtyObj();
          if (newstage) {
            this.selectStage(newstage, i);
          } else {
            this.createNewMap();
          }
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  removeConfig(index, list) {
    this.changesDetected = true;
    list.splice(index, 1);
  }
  clearDirtyObj(cancel?) {
    this.pipeline = JSON.parse(JSON.stringify(this.pipelineCopy));
    if (this.selectedStage && !this.selectedStage._id) {
      if (this.pipeline && this.pipeline.length) {
        this.selectStage(this.pipeline[0], 0);
      } else {
        this.selectedStage = null
      }
    } else {
      const index = _.findIndex(this.pipeline, (pg) => {
        return pg._id === this.selectedStage._id;
      })
      if (index > -1) {
        this.selectedStage = this.pipeline[index];
      }
    }
    if (!cancel) {
      this.currentEditIndex = -1;
    }
    this.changesDetected = false;
    this.setResetNewMappingsObj();
  }
  selectStage(stage, i) {
    if (this.changesDetected && false) {
      this.confirmChangeDiscard(stage, i);
    } else {
      this.currentEditIndex = i;
      this.checkNewAddition();
      if (stage && stage.type === 'custom_script' && stage.config && stage.config.mappings && stage.config.mappings.length) {
        if (!this.newMappingObj.custom_script) {
          this.newMappingObj.custom_script = {
            defaultValue: {
              script: ''
            }
          }
        }
        this.newMappingObj.custom_script.defaultValue.script = stage.config.mappings[0].script || '';
      } else {
        if (!this.newMappingObj.custom_script) {
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
  checkDuplicateTags(suggestion: string, alltTags): boolean {
    return alltTags.every((f) => f !== suggestion);
  }
  addCustomScript(script) {
    this.changesDetected = true;
    if (!(this.selectedStage.config && this.selectedStage.config.mappings)) {
      this.selectedStage.config.mappings = []
    }
    this.selectedStage.config.mappings[0] = {
      script
    }
  }
  addEntityList(event: MatChipInputEvent, map) {
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(), map.entity_types)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        map.entity_types.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  removeEntityList(map, entity) {
    this.changesDetected = true;
    const index = map.entity_types.indexOf(entity);
    if (index >= 0) {
      map.entity_types.splice(index, 1);
    }
  }
  addTraitsList(event: MatChipInputEvent, map) {
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(), map.trait_groups)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        map.trait_groups.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  removeKeyWordsList(map, trait) {
    this.changesDetected = true;
    const index = map.trait_groups.indexOf(trait);
    if (index >= 0) {
      map.trait_groups.splice(index, 1);
    }
  }
  addKeyWordsList(event: MatChipInputEvent, map) {
    this.changesDetected = true;
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(), map.trait_groups)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        map.trait_groups.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  removeTraitsList(map, trait) {
    this.changesDetected = true;
    const index = map.trait_groups.indexOf(trait);
    if (index >= 0) {
      map.trait_groups.splice(index, 1);
    }
  }
  addFiledmappings(map) {
    this.changesDetected = true;
    if (!this.selectedStage.config) {
      this.selectedStage.config = {
        mappings: []
      }
    }
    if (!this.selectedStage.config.mappings) {
      this.selectedStage.config.mappings = [];
    }
    this.selectedStage.config.mappings.push(map);
    this.setResetNewMappingsObj(true, true);
  }
  closeNewStage() {
    this.showNewStageType = false;
    if (this.pipeline && this.pipeline.length) {
      this.selectedStage = this.pipeline[0];
    }

  }
  switchStage(systemStage, i) {
    if (this.showNewStageType) {
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
    }
    this.selectedStage.type = this.defaultStageTypes[i].type;
    this.selectedStage.category = this.defaultStageTypes[i].category;
    this.selectedStage.name = this.defaultStageTypesObj[systemStage.type].name;
    this.selectedStage.config = {}
    if (systemStage && systemStage.type === 'custom_script') {
      if (!this.newMappingObj.custom_script) {
        this.newMappingObj.custom_script = {
          defaultValue: {
            script: ''
          }
        }
      }
      this.newMappingObj.custom_script.defaultValue.script = '';
    }
  }
  createNewMap() {
    if (this.changesDetected && false) {
      this.confirmChangeDiscard()
    } else {
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
  selectNewItem(defaultStage) {
    this.newStageObj = JSON.parse(JSON.stringify(defaultStage));
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
  selectAll() {
    this.newfieldsData.forEach(element => {
      element.isActive = this.isActiveAll;
    });
  }

  selectSingle(isActive) {
    if (isActive) {
      let fieldActive = false;
      this.newfieldsData.forEach(element => {
        if (element.isActive && !fieldActive) {
          this.isActiveAll = true;
        } else {
          fieldActive = true;
          this.isActiveAll = false;
        }
      });
    } else {
      this.isActiveAll = false;
    }

  }

  ngOnDestroy() {
    const self = this;
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
  }
}
class StageClass {
  name: string
  category: string
  type: string
  enable: boolean;
  condition: string
  config: any = {}
}

