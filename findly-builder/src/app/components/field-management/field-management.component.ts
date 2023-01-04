import { EMPTY_SCREEN } from 'src/app/modules/empty-screen/empty-screen.constants';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'underscore';
import { of, interval, Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IndexFieldsComfirmationDialogComponent } from 'src/app/helpers/components/index-fields-comfirmation-dialog/index-fields-comfirmation-dialog.component';


declare const $: any;
@Component({
  selector: 'app-field-management',
  templateUrl: './field-management.component.html',
  styleUrls: ['./field-management.component.scss']
})
export class FieldManagementComponent implements OnInit {
  emptyScreen = EMPTY_SCREEN.INDICES_FIELD;
  showSearch = false;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  fields : any= [];
  skip = 0;
  searchFields: any = '';
  newFieldObj: any = null
  addFieldModalPopRef: any;
  filelds: any = [];
  loadingContent = true;
  currentfieldUsage: any
  fetchingFieldUsage = false;
  value = 1 || -1 ;
  indexedWarningMessage: any = '';
  resultTest;
  tooltipArr = [];
  showSearchSettingsTooltip = false;
  selectedSort = 'fieldName';
  isAsc = true;
  underlineEnable=false
  fieldAutoSuggestion: any = [];
  fieldDataTypeArr: any = [];
  // isMultiValuedArr: any = [];
  // isRequiredArr: any = [];
  // isStoredArr: any = [];
  // isIndexedArr: any = [];
  isAutosuggestArr: any = [];
  isSearchableArr: any = [];
  totalRecord: number = 0;
  // filterSystem: any = {
  //   'typefilter': 'all',
  //   'isMultiValuedFilter': 'all',
  //   'isRequiredFilter': 'all',
  //   'isStoredFilter': 'all',
  //   'isIndexedFilter': 'all'
  // }
  filterSystem: any = {
    'typefilter': 'all',
    'isAutosuggestFilter':'all',
    'isSearchableFilter':'all'
  }
  activeClose = false
  beforeFilterFields: any = [];
  filterTableheaderOption = "";
  filterResourcesBack: any;
  subscription: Subscription;
  filterTableSource = "all";
  firstFilter: any = { 'header': '', 'source': '' };
  componentType: string = 'indexing';
  submitted: boolean = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  sortedObject = {
    'type': 'fieldName',
    'position':'up',
    "value": 1,
  }
  filterObject={
    'type': '',
    'header':''
  };
  fieldTypesArray:Array<String>=['string','number','trait','dense_vector','entity','keyword','array','object','date','float','boolean','url','html','ip','geo_point'];
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    public inlineManual : InlineManualService,
    private router: Router,
    public mixpanel: MixpanelServiceService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.loadFileds();
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.loadFileds();
    })
    // });
    
  }
  ngAfterViewInit() {

  }
  applyDisableClass(fieldName){
    return {
      'disable-actionlinks':fieldName==='sys_content_type' || fieldName==='sys_racl' || fieldName==='sys_source_name'
    };
  }
  loadFileds() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.getDyanmicFilterData();
      this.getFileds();
    }
  }
  toggleSearch() {
    if (this.showSearch && this.searchFields) {
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch
  }
  openModalPopup() {
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  selectFieldType(type) {
    // if(type === 'number'){
    //   this.newFieldObj.fieldName = '';
    //   this.newFieldObj.fieldDataType = type
    // } else {
    this.newFieldObj.fieldDataType = type
    // }
  }
  addEditFiled(field?) {
    if (field) {
      this.newFieldObj = JSON.parse(JSON.stringify(field));
      this.newFieldObj.previousFieldDataType = field.fieldDataType;
      this.getFieldAutoComplete(field.fieldName);
      this.getFieldUsageData(field)
    } else {
      // this.newFieldObj = {
      //   fieldName: '',
      //   fieldDataType: 'string',
      //   previousFieldDataType: 'string',
      //   isMultiValued: true,
      //   isRequired: false,
      //   isStored: true,
      //   isIndexed: true
      // }
      this.newFieldObj = {
        fieldName: '',
        fieldDataType: 'string',
        previousFieldDataType: 'string',
        isAutosuggest: false,
        isSearchable: false,
      }
      this.mixpanel.postEvent('Enter Add field',{})
    }
    this.getAllFields();
    this.submitted = false;
    this.openModalPopup();
  }
  closeModalPopup() {
    this.submitted = false;
    this.addFieldModalPopRef.close();
  }
  getFieldUsageData(record) {
    this.indexedWarningMessage = '';
    if (this.fetchingFieldUsage) {
      return;
    }
    this.fetchingFieldUsage = true;
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      fieldId: record._id,
    };
    this.service.invoke('get.getFieldUsage', quaryparms).subscribe(res => {
      this.currentfieldUsage = res;
      this.fetchingFieldUsage = false;
      const deps: any = {
        facets: false,
        rules: false,
        //weights: false
        searchSettings: false,
        resultTemplate: false,
        nlpRules:false,
        entites:false
      }
      let usageText = '';
      let usedArr = [];
      this.showSearchSettingsTooltip = false;
      this.tooltipArr = [];

      if (!res) {
        return;
      }

      let searchSettingsRecord = [];

      const resultArr = Object.entries(res).reduce((usedArr: any, [key, valObj]) => {
        if (valObj['used']) {
          if ((key === 'facets')) {
            usedArr = [...usedArr, 'Facet'];
          } else if (key === 'searchSettings') {
            // const msg =p `<span class="based-on-selection">searchSettings</span>`;
            const msg = 'SearchSettings';

            searchSettingsRecord = valObj['records'][0];

            this.showSearchSettingsTooltip = true;
            usedArr = [...usedArr, msg];
          } else if(key === 'rules') {
            const msg = res.rules.records.length + ' Business Rule' + (res.rules.records.length > 1 ? 's' : '');
            usedArr = [...usedArr, msg];
          } else if (key === 'resultTemplates') {
            const msg = res.resultTemplates.records.length + ' Result Template' + (res.resultTemplates.records.length > 1 ? 's' : '');
            usedArr = [...usedArr, msg]
          } else if (key === 'nlpRules') {
            const msg = res.nlpRules.records.length + ' nlp Rule' + (res.nlpRules.records.length > 1 ? 's' : '');
            usedArr = [...usedArr, msg]
          } else if (key === 'entites') {
            const msg = res.entites.records.length + (res.entites.records.length == 1 ? 'entity' : '')  + (res.entites.records.length > 1 ? 'entities' : '');
            usedArr = [...usedArr, msg];
          }
        }

        return usedArr;
      }, []);
      
      if (searchSettingsRecord) {
        if (searchSettingsRecord['highlight']?.value) {
          this.tooltipArr = [...this.tooltipArr, 'highlight']
        }
        if (searchSettingsRecord['weight']?.value) {
          this.tooltipArr = [...this.tooltipArr, 'weight'];
        }
        if (searchSettingsRecord['presentable']?.value) {
          this.tooltipArr = [...this.tooltipArr, 'presentable']
        }
        if (searchSettingsRecord['spellcorrect']?.value) {
          this.tooltipArr = [...this.tooltipArr, 'spellcorrect']
        }
      }

      let resultStr = `This will impact `;
      if (resultArr.length === 1) {
        resultStr += resultArr[0];
      } else if (resultArr.length === 2) {
        resultStr += `${resultArr.join(' and ')}`;
      } else {
        const lastVal = resultArr.slice(-1)[0]; 
        resultStr += `${resultArr.slice(0, resultArr.length -1 ).join(', ')} and ${lastVal}`;
      }
      console.log(resultStr);
      this.indexedWarningMessage = resultStr;
      this.resultTest = this.sanitizer.bypassSecurityTrustHtml(resultStr);


      // //if (res && (res.facets && res.facets.used) || (res.rules && res.rules.used) || (res.weights && res.weights.used) || (res.resultTemplates && res.resultTemplates.used)) {
      // if (res && (res.facets && res.facets.used) || (res.rules && res.rules.used) || (res.searchSettings && res.searchSettings.used) || (res.resultTemplates && res.resultTemplates.used) || (res.nlpRules && res.nlpRules.used) || (res.entites && res.entites.used)) {
      //   usageText = usageText + ' This will impact'
      //   if (res && res.facets && res.facets.used) {
      //     deps.facets = true;
      //     usageText = usageText + ' facet'
      //   }
      //   // if (res && res.weights && res.weights.used) {
      //   //   deps.weights = true;
      //   //   if (deps.facets) {
      //   //     usageText = usageText + ', ' + 'Weights'
      //   //   } else {
      //   //     usageText = usageText + ' Weights'
      //   //   }
      //   // }
      //   if (res && res.searchSettings && res.searchSettings.used) {
      //     deps.searchSettings = true;
      //     if (deps.facets) {
      //       usageText = usageText + ', ' + 'searchSettings'
      //     } else {
      //       usageText = usageText + ' searchSettings'
      //     }
      //     console.log(usageText);
      //   }
      //   if (res && res.rules && res.rules.used) {
      //     deps.rules = true;
      //     if (deps.facets || deps.searchSettings) {
      //       usageText = usageText + ' , ' + res.rules.records.length + ' Business Rule' + (res.rules.records.length > 1 ? 's' : '')
      //     } else {
      //       usageText = usageText + ' ' + res.rules.records.length + ' Business Rule' + (res.rules.records.length > 1 ? 's' : '')
      //     }
      //   }

      //   if (res && res.resultTemplates && res.resultTemplates.used) {
      //     deps.resultTemplate = true;
      //     if (deps.facets || deps.searchSettings || deps.rules) {
      //       usageText = usageText + ' , ' + res.resultTemplates.records.length + ' Result Template' + (res.resultTemplates.records.length > 1 ? 's' : '');
      //     } else {
      //       usageText = usageText + ' will impact ' + res.resultTemplates.records.length + ' Result Template' + (res.resultTemplates.records.length > 1 ? 's' : '')
      //     }
      //   }

      //   if (res && res.nlpRules && res.nlpRules.used) {
      //     deps.nlpRules = true;
      //     if (deps.facets || deps.searchSettings || deps.rules || deps.resultTemplate) {
      //       usageText = usageText + ' , ' + res.nlpRules.records.length + ' nlp Rule' + (res.nlpRules.records.length > 1 ? 's' : '');
      //     } else {
      //       usageText = usageText + ' will impact ' + res.nlpRules.records.length + ' nlp Rule' + (res.nlpRules.records.length > 1 ? 's' : '')
      //     }
      //   }

      //   if (res && res.entites && res.entites.used) {
      //     deps.entites = true;
      //     if (deps.facets || deps.searchSettings || deps.rules || deps.resultTemplate || deps.nlpRules) {
      //       usageText = usageText + ' , ' + res.entites.records.length + (res.entites.records.length == 1 ? 'entity' : '')  + (res.entites.records.length > 1 ? 'entities' : '');
      //     } else {
      //       usageText = usageText + ' will impact ' + res.nlpRules.entites.length + (res.entites.records.length == 1 ? 'entity' : '') + (res.entites.records.length > 1 ? 'entities' : '');
      //     }
      //   }
      // }
      // usageText = this.replaceLast(",", " and", usageText)
      // this.indexedWarningMessage = usageText;
    }, errRes => {
      this.fetchingFieldUsage = false;
    });
  }
  replaceLast(find, replace, string) {
    var lastIndex = string.lastIndexOf(find);

    if (lastIndex === -1) {
      return string;
    }

    var beginString = string.substring(0, lastIndex);
    var endString = string.substring(lastIndex + find.length);

    return beginString + replace + endString;
  }
  getFieldUsage(record) {
    if (this.fetchingFieldUsage) {
      return;
    }
    this.fetchingFieldUsage = true
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      fieldId: record._id,
    };
    let isDisableDeleteBtn = false;
    this.service.invoke('get.getFieldUsage', quaryparms).subscribe(res => {
      this.currentfieldUsage = res
      this.fetchingFieldUsage = false;
      let usageText = record.fieldName + ' will be deleted' 
      const deps: any = {
        facets: false,
        rules: false,
        //weights: false
        searchSettings: false,
        resultTemplate: false,
        nlpRules:false,
        entites:false
      }

      this.showSearchSettingsTooltip = false;
      this.tooltipArr = [];
      if (!res) {
        return;
      }

      let searchSettingsRecord = [];

      const resultArr = Object.entries(res).reduce((usedArr: any, [key, valObj]) => {
        if (valObj['used']) {
          if ((key === 'facets')) {
            usedArr = [...usedArr, 'Facet'];
          } else if (key === 'searchSettings') {
            // const msg =p `<span class="based-on-selection">searchSettings</span>`;
            const msg = `SearchSettings`;

            searchSettingsRecord = valObj['records'][0];

            this.showSearchSettingsTooltip = true;
            usedArr = [...usedArr, msg];
          } else if(key === 'rules') {
            const msg = res.rules.records.length + ' Business Rule' + (res.rules.records.length > 1 ? 's' : '');
            usedArr = [...usedArr, msg];
          } else if (key === 'resultTemplates') {
            const msg = res.resultTemplates.records.length + ' Result Template' + (res.resultTemplates.records.length > 1 ? 's' : '');
            usedArr = [...usedArr, msg]
          } else if (key === 'nlpRules') {
            const msg = res.nlpRules.records.length + ' nlp Rule' + (res.nlpRules.records.length > 1 ? 's' : '');
            usedArr = [...usedArr, msg]
          } else if (key === 'entites') {
            const msg = res.entites.records.length + (res.entites.records.length == 1 ? 'entity' : '')  + (res.entites.records.length > 1 ? 'entities' : '');
            usedArr = [...usedArr, msg];
          }
        }

        return usedArr;
      }, []);
      
      if (searchSettingsRecord) {
        if (searchSettingsRecord['highlight']?.value) {
          this.tooltipArr = [...this.tooltipArr, 'highlight']
        }
        if (searchSettingsRecord['weight']?.value) {
          this.tooltipArr = [...this.tooltipArr, 'weight'];
        }
        if (searchSettingsRecord['presentable']?.value) {
          this.tooltipArr = [...this.tooltipArr, 'presentable']
        }
        if (searchSettingsRecord['spellcorrect']?.value) {
          this.tooltipArr = [...this.tooltipArr, 'spellcorrect']
        }
      }
      let resultStr = `This field is being used in `;
      if (resultArr.length === 1) {
        resultStr += resultArr[0];
      } else if (resultArr.length === 2) {
        resultStr += `${resultArr.join(' and ')}`;
      } else {
        const lastVal = resultArr.slice(-1)[0]; 
        resultStr += `${resultArr.slice(0, resultArr.length -1 ).join(', ')} and ${lastVal}`;
      }
      resultStr += '. Deleting it will remove all the associated settings'
      console.log(resultStr);
      // let usageText1 = "This field is being used in Facets, Weights, and Rules (Dynamic). Deleting it will remove the associated Facets, Weights, and Rules.";
      // if (res && (res.facets && res.facets.used) || (res.rules && res.rules.used) || (res.searchSettings && res.searchSettings.used) || (res.resultTemplates && res.resultTemplates.used) || (res.nlpRules && res.nlpRules.used) || (res.entites && res.entites.used)) {
      //   isDisableDeleteBtn = true;
      //   let usageText1 = "";
      //   usageText1 = "This field is being used in";
      //   usageText = '';
      //   // let usageText2 = 'Deleting it will remove the associated';
      //   let usageText2 ='Please remove the dependency before deleting the field'
      //   if (res && res.facets && res.facets.used) {
      //     deps.facets = true;
      //     usageText = usageText + ' Facets'
      //   }
      //   if (res && res.searchSettings && res.searchSettings.used) {
      //     deps.searchSettings = true;          
      //     if (deps.facets) {
      //       usageText = usageText + ', ' + 'searchSettings'
      //     } else {
      //       usageText = usageText + ' searchSettings'
      //     }
      //   }
        
      //   if (res && res.rules && res.rules.used) {
      //     if (deps.facets || deps.searchSettings) {
      //       usageText = usageText + ' , ' + res.rules.records.length + ' Rule' + (res.rules.records.length > 1 ? 's' : '')
      //     } else {
      //       usageText = usageText + ' ' + res.rules.records.length + ' Rule' + (res.rules.records.length > 1 ? 's' : '')
      //     }
      //   }
      //   if (res && res.resultTemplates && res.resultTemplates.used) {
      //     deps.resultTemplate = true;
      //     if (deps.facets || deps.searchSettings || deps.rules) { 
      //       usageText = usageText + ' , ' + res.resultTemplates.records.length + ' Result Template' + (res.resultTemplates.records.length > 1 ? 's' : '')
      //     } else {
      //       usageText = usageText + ' ' + res.resultTemplates.records.length + ' Result Template' + (res.resultTemplates.records.length > 1 ? 's' : '')
      //     }
      //   }
      //   if (res && res.nlpRules && res.nlpRules.used) {
      //     deps.nlpRules = true;
      //     if (deps.facets || deps.searchSettings || deps.rules || deps.resultTemplate) { 
      //       usageText = usageText + ' , ' + res.nlpRules.records.length + 'nlpRule' + (res.nlpRules.records.length > 1 ? 's' : '')
      //     } else {
      //       usageText = usageText + ' ' + res.nlpRules.records.length + 'nlpRule' + (res.nlpRules.records.length > 1 ? 's' : '')
      //     }
      //   }
      //   if (res && res.entites && res.entites.used) {
      //     deps.entites = true;
      //     if (deps.facets || deps.searchSettings || deps.rules || deps.resultTemplate || deps.nlpRules) {
      //       usageText = usageText + ' , ' + res.entites.records.length + (res.entites.records.length == 1 ? 'entity' : '')  + (res.entites.records.length > 1 ? 'entities' : '');
      //     } else {
      //       usageText = usageText + ' will impact ' + res.nlpRules.entites.length + (res.entites.records.length == 1 ? 'entity' : '') + (res.entites.records.length > 1 ? 'entities' : '');
      //     }
      //   }
      //   usageText = this.replaceLast(",", " and", usageText);
      //   // usageText = usageText1 + usageText + '. ' + usageText2 + usageText + '.';
      //   usageText = usageText1 + usageText + '. ' + usageText2 +'.';
      // }
      const dialogRef = this.dialog.open(IndexFieldsComfirmationDialogComponent, {
        width: '530px',
        height: 'auto',
        panelClass: 'delete-popup',
        data: {
          newTitle: 'Are you sure you want to delete?',
          body: resultArr,
          tooltipArr: this.tooltipArr,
          resultArr,
          buttons: [{ key: 'yes', label: 'Confirm', type: 'danger' }, { key: 'no', label: 'Cancel' }],
          confirmationPopUp: true
        }
      });

      // dialogRef.componentInstance.onSelect
      //   .subscribe(result => {
      //     if (result === 'yes') {
      //       this.deleteIndField(record, dialogRef);
      //     } else if (result === 'no') {
      //       dialogRef.close();
      //       // console.log('deleted')
      //     }
      //   })
    }, errRes => {
      this.fetchingFieldUsage = false;
    });
  }
  validateFilelds() {
    if (this.newFieldObj && this.newFieldObj.fieldName.length) {
      this.submitted = false;
      return true;
    }
    else {
      return false;
    }
  }
  addField() {
    this.submitted = true;
    if (this.validateFilelds()) {
      const temppayload: any = {
        // fieldName: this.newFieldObj.fieldName,
        // fieldDataType: this.newFieldObj.fieldDataType,
        // isMultiValued: this.newFieldObj.isMultiValued,
        // isRequired: this.newFieldObj.isRequired,
        // isStored: this.newFieldObj.isStored,
        // isIndexed: this.newFieldObj.isIndexed,
        fieldName: this.newFieldObj.fieldName,
        fieldDataType: this.newFieldObj.fieldDataType,
        isAutosuggest: this.newFieldObj.isAutosuggest,
        isSearchable: this.newFieldObj.isSearchable,
      }
      let payload: any = {
        fields: []
      }
      const quaryparms: any = {
        searchIndexID: this.serachIndexId,
        indexPipelineId: this.indexPipelineId,
        fieldId: this.newFieldObj._id
      };
      let api = 'post.createField';
      if (this.newFieldObj && this.newFieldObj._id) {
        api = 'put.updateField'
        payload = temppayload;
      } else {
        payload.fields.push(temppayload);
      }
      this.service.invoke(api, quaryparms, payload).subscribe(res => {
        if (this.newFieldObj && this.newFieldObj._id) {
          this.notificationService.notify('Updated Successfully', 'success');
        } else {
          this.notificationService.notify('Added Successfully', 'success');
          let fieldConfig='';
          fieldConfig = (payload.fields[0].isMultiValued?'Multi valued':'');
          fieldConfig = fieldConfig + (fieldConfig?', ':'') + (payload.fields[0].isRequired?'Required':'');
          fieldConfig = fieldConfig + (fieldConfig?', ':'') + (payload.fields[0].isStored?'Stored':'');
          fieldConfig = fieldConfig + (fieldConfig?', ':'') + (payload.fields[0].isIndexed?'Indexed':'') ;
          this.mixpanel.postEvent('Add Field complete',{'Field Type':this.newFieldObj.fieldDataType, 'Field config':fieldConfig})

        }
        this.getFileds(this.searchFields);
        this.closeModalPopup();
      }, errRes => {
        this.errorToaster(errRes, 'Failed to create field');
      });
    }
    else {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }
  defaultSort(field, icon, isAscBool) {
    this.getSortIconVisibility(field, icon)
    this.isAsc = !isAscBool;
    this.sortBy(field);

  }
  getAllFields() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
    },
    payload ={
      "sort": {
          "fieldName": 1,
      } 
    }
    // let serviceId = 'get.allFieldsData';
    let serviceId = 'post.allField';
    this.service.invoke(serviceId, quaryparms,payload).subscribe(res => {
      this.fieldAutoSuggestion = res.fields || [];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }

  getFileds(searchValue?,searchSource?,source?,headerOption?,sortHeaderOption?,sortValue?,navigate?,request?) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      offset: this.skip || 0,
      limit: 10
    };
    let payload:any = {}
    if(!sortHeaderOption && !headerOption){
       payload ={
        "sort": {
            "fieldName": this.value,
        } 
      }
      quaryparms.offset = 0;
      quaryparms.limit = 10
    }
    else if(!sortValue && headerOption){  // To send offset=0 and limit =10 on filtering
      payload = request,
      quaryparms.offset = 0,
      quaryparms.limit = 10 
    }
    // else if(headerOption){
    //   payload = request,
    //   quaryparms.offset = 0,
    //   quaryparms.limit = 10
    // }
    else{
      payload = request
    }
    
    if(this.searchFields){
      payload.search = this.searchFields
    }   
    let serviceId = 'post.allField';
    // if (searchFields) {
    //   quaryparms.search = searchFields;
    //   serviceId = 'post.allField';
    //   this.getDyanmicFilterData();
    // }
    this.service.invoke(serviceId, quaryparms,payload).subscribe(res => {
      this.mixpanel.postEvent('Enter Fields',{})
      this.filelds = res.fields || [];
      this.totalRecord = res.totalCount || 0;
      this.loadingContent = false;
      if (this.filelds.length) {

        // this.filelds.forEach(element => {
        //   this.fieldDataTypeArr.push(element.fieldDataType);
        //   this.isMultiValuedArr.push(element.isMultiValued);
        //   this.isRequiredArr.push(element.isRequired);
        //   this.isStoredArr.push(element.isStored);
        //   this.isIndexedArr.push(element.isIndexed);
        // });
        // this.fieldDataTypeArr = [...new Set(this.fieldDataTypeArr)];
        // this.isMultiValuedArr = [...new Set(this.isMultiValuedArr)];
        // this.isRequiredArr = [...new Set(this.isRequiredArr)];
        // this.isStoredArr = [...new Set(this.isStoredArr)];
        // this.isIndexedArr = [...new Set(this.isIndexedArr)];
        if(!this.inlineManual.checkVisibility('FIEDS_TABLE')){
          this.inlineManual.openHelp('FIEDS_TABLE')
          this.inlineManual.visited('FIEDS_TABLE')
        }
        this.getDyanmicFilterData(searchValue)
        // this.defaultSort( this.sortedObject.type, this.sortedObject.position, this.sortedObject.value)
        // this.sortField( this.sortedObject.type, this.sortedObject.position, this.sortedObject.value)
      }
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get index  stages');
    });
  }
  
  deleteIndField(record, dialogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      fieldId: record._id,
    };
    this.service.invoke('delete.deleteField', quaryparms).subscribe(res => {
      const deleteIndex = _.findIndex(this.filelds, (pg) => {
        return pg._id === record._id;
      })
      this.filelds.splice(deleteIndex, 1);
      this.notificationService.notify('Deleted Successfully', 'success');
      dialogRef.close();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete field');
    });
  }
  deleteFieldPop(record) {
    this.getFieldUsage(record);
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went wrong', 'error');
    }
  }

  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "fieldName": {
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
      case "fieldDataType": {
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
      // case "isMultiValued": {
      //   if (this.selectedSort == sortingField) {
      //     if (this.isAsc == false && type == 'down') {
      //       return "display-block";
      //     }
      //     if (this.isAsc == true && type == 'up') {
      //       return "display-block";
      //     }
      //     return "display-none"
      //   }
      // }
      // case "isRequired": {
      //   if (this.selectedSort == sortingField) {
      //     if (this.isAsc == false && type == 'down') {
      //       return "display-block";
      //     }
      //     if (this.isAsc == true && type == 'up') {
      //       return "display-block";
      //     }
      //     return "display-none"
      //   }
      // }
      // case "isStored": {
      //   if (this.selectedSort == sortingField) {
      //     if (this.isAsc == false && type == 'down') {
      //       return "display-block";
      //     }
      //     if (this.isAsc == true && type == 'up') {
      //       return "display-block";
      //     }
      //     return "display-none"
      //   }
      // }
      // case "isIndexed": {
      //   if (this.selectedSort == sortingField) {
      //     if (this.isAsc == false && type == 'down') {
      //       return "display-block";
      //     }
      //     if (this.isAsc == true && type == 'up') {
      //       return "display-block";
      //     }
      //     return "display-none"
      //   }
      // }
      case "isAutosuggest": {
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
      case "isSearchable": {
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
      // case "isSearchableFilter": {
      //   if (this.selectedSort == sortingField) {
      //     if (this.isAsc == false && type == 'down') {
      //       return "display-block";
      //     }
      //     if (this.isAsc == true && type == 'up') {
      //       return "display-block";
      //     }
      //     return "display-none"
      //   }
      // }
    }
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortBy(sort) {
    const data = this.filelds.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;

    } else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'fieldDataType': return this.compare(a.fieldDataType, b.fieldDataType, isAsc);
        // case 'isMultiValued': return this.compare(a.isMultiValued, b.isMultiValued, isAsc);
        case 'fieldName': return this.compare(a.fieldName, b.fieldName, isAsc);
        // case 'isRequired': return this.compare(a.isRequired, b.isRequired, isAsc);
        // case 'isStored': return this.compare(a.isStored, b.isStored, isAsc);
        // case 'isIndexed': return this.compare(a.isIndexed, b.isIndexed, isAsc);
        case 'isAutosuggest': return this.compare(a.fieldName, b.fieldName, isAsc);
        case 'isSearchable': return this.compare(a.fieldName, b.fieldName, isAsc);
        default: return 0;
      }
    });
    this.filelds = sortedData;
   
  }
  sortByApi(sort){
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var naviagtionArrow ='';
    var checkSortValue= 1;
    if(this.isAsc){
      naviagtionArrow= 'up';
      checkSortValue = 1;
    }
    else{
      naviagtionArrow ='down';
      checkSortValue = -1;
    }
    this.fieldsFilter(null,null,null,null,sort,checkSortValue,naviagtionArrow)
  }

  // filterTable(source, headerOption) {
  //   console.log(this.filelds, source)
  //   this.filterTableSource = source;
  //   this.filterTableheaderOption = headerOption;
  //   let firstFilterDataBack = [];
  //   //this.resources = [...this.filterResourcesBack]; // For new Filter..
  //   if (headerOption == "extractionType") {
  //     this.filterSystem.typeHeader = headerOption;
  //     this.filterSystem.typefilter = source;
  //   } else {
  //     this.filterSystem.statusHeader = headerOption;
  //     this.filterSystem.statusFilter = source;
  //   }

  //     if (this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter == "all") {
  //       this.filelds = [...this.filterResourcesBack];
  //       this.firstFilter = { 'header': '', 'source': '' };
  //     }
  //     else if (this.filterSystem.typefilter != "all" && this.filterSystem.statusFilter == "all") {
  //       if (!this.firstFilter['header']) {
  //         this.firstFilter = { 'header': headerOption, 'source': source };
  //       }
  //       firstFilterDataBack = [...this.filterResourcesBack];
  //       const resourceData = firstFilterDataBack.filter((data) => {
  //         return data[this.filterSystem.typeHeader].toLocaleLowerCase() === this.filterSystem.typefilter.toLocaleLowerCase();
  //       })
  //       if (resourceData.length) this.filelds = [...resourceData];
  //     }
  //     else if (this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter != "all") {
  //       if (!this.firstFilter['header']) {
  //         this.firstFilter = { 'header': headerOption, 'source': source };
  //       }
  //       firstFilterDataBack = [...this.filterResourcesBack];
  //       const resourceData = firstFilterDataBack.filter((data) => {
  //         return data[this.filterSystem.statusHeader].toLocaleLowerCase() === this.filterSystem.statusFilter.toLocaleLowerCase();
  //       })
  //       if (resourceData.length) this.filelds = [...resourceData];

  //   }
  //   else if (this.filterSystem.typefilter != "all" && this.filterSystem.statusFilter != "all") {
  //     this.filelds = [...this.filterResourcesBack];
  //     //firstFilter
  //    // if (this.firstFilter['header'] == headerOption) {
  //       if (headerOption == "extractionType") {
  //         this.firstFilter = { 'header': this.filterSystem.statusHeader, 'source': this.filterSystem.statusFilter };
  //       } else {
  //         this.firstFilter = { 'header': this.filterSystem.typeHeader, 'source': this.filterSystem.typefilter };
  //       }
  //       const firstResourceData = this.filelds.filter((data) => {
  //         console.log(data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase());
  //         return data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase();
  //       })
  //       const secondResourceData = firstResourceData.filter((data) => {
  //         console.log(data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase());
  //         return data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase();
  //       })
  //       if (secondResourceData.length) this.filelds = [...secondResourceData];
  //     //}
  //   }
  // }
  filterTable(source, headerOption) {
    // this.filterSystem.typefilter = 'all';
    // this.filterSystem.isMultiValuedFilter = 'all';
    // this.filterSystem.isRequiredFilter = 'all';
    // this.filterSystem.isStoredFilter = 'all';
    // this.filterSystem.isIndexedFilter = 'all';  
    switch (headerOption) {
      // case 'fieldDataType': { this.filterSystem.typefilter = source; break; };
      // case 'isMultiValued': { this.filterSystem.isMultiValuedFilter = source; break; };
      // case 'isRequired': { this.filterSystem.isRequiredFilter = source; break; };
      // case 'isStored': { this.filterSystem.isStoredFilter = source; break; };
      // case 'isIndexed': { this.filterSystem.isIndexedFilter = source; break; };
      case 'fieldDataType': { this.filterSystem.typefilter = source; break; };
      case 'isAutosuggest': { this.filterSystem.isAutosuggestFilter = source; break; };
      case 'isSearchable': { this.filterSystem.isSearchableFilter = source; break; };
    };
    this.filterObject = {
      type: source,
      header: headerOption
    }

    this.fieldsFilter(null,null,source, headerOption);
  }

  fieldsFilter(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?){  
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
          'fieldName':1
        }    
    } ,
    quaryparms.offset = 0,
    quaryparms.limit = 10  
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
      
    // request.fieldDataType = this.filterSystem.typefilter;
    // request.isMultiValued = this.filterSystem.isMultiValuedFilter;
    // request.isStored = this.filterSystem.isStoredFilter;
    // request.isIndexed = this.filterSystem.isIndexedFilter;
    // request.isRequired = this.filterSystem.isRequiredFilter;
    request.fieldDataType = this.filterSystem.typefilter;
    request.isAutosuggest = this.filterSystem.isAutosuggestFilter;
    request.isSearchable = this.filterSystem.isSearchableFilter;
    request.search= this.searchFields;
    if (request.fieldDataType == 'all') {
     delete  request.fieldDataType;
    }
    //  if ( request.isMultiValued == 'all') {
    //   delete request.isMultiValued; 
    // }
    //  if (request.isStored == 'all') {
    //  delete request.isStored; 
    // }
    //  if (request.isIndexed == 'all') {
    //  delete  request.isIndexed;
    // }
    // if (request.isRequired == 'all') { 
    //  delete request.isRequired;
    // }
    if ( request.isSearchable == 'all') {
      delete request.isSearchable; 
    }
     if (request.isAutosuggest == 'all') {
     delete request.isAutosuggest; 
    }

    if (this.searchFields === '') {
     delete request.search;
    }
    if(sortValue){  
      this.getSortIconVisibility(sortHeaderOption,navigate);
       //Sort start
    if(sortHeaderOption === 'fieldName' ){
      request.sort.fieldName = sortValue
    }
    if(sortHeaderOption === 'fieldDataType' ){
      request.sort.fieldDataType = sortValue
    }
    // if(sortHeaderOption === 'isMultiValued' ){
    //   request.sort.isMultiValued = sortValue
    // }
    // if(sortHeaderOption === 'isStored' ){
    //   request.sort.isStored = sortValue
    // }
    // if(sortHeaderOption === 'isRequired' ){
    //   request.sort.isRequired = sortValue
    // }
    // if(sortHeaderOption === 'isIndexed' ){
    //   request.sort.isIndexed = sortValue
    // }
    if(sortHeaderOption === 'isAutosuggest' ){
      request.sort.isAutosuggest = sortValue
    }
    if(sortHeaderOption === 'isSearchable' ){
      request.sort.isSearchable = sortValue
    }

    // end
    }
    this.getFileds(searchValue,searchSource, source,headerOption, sortHeaderOption,sortValue,navigate,request);
    // this.getFileds(searchValue,source, headerOption, request);
    // let serviceId = 'post.allField'
    // this.service.invoke(serviceId,quaryparms,request).subscribe(res => {
    //   this.filelds = res.fields;     
    //   this.totalRecord = res.totalCount
    //   // if (headerOption === 'search') {
    //   //   this.getDyanmicFilterData(source);
    //   // }
    // },
    // errRes => {
    //   this.loadingContent = false;
    //   this.errorToaster(errRes, 'Failed to get fields');
    // });
  }
  sortField(type?,navigate?, value?){  
    // this.sortedObject.type=type;
    // this.sortedObject.value = value;
    // this.sortedObject.position=navigate
    // this.sortedObject = {
    //   type : type,
    //   value : value,
    //   position: navigate
    // }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      offset:  0 ,
      limit: 10
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
    // filter along with sort start 
    // request.fieldDataType = this.filterSystem.typefilter;
    // request.isMultiValued = this.filterSystem.isMultiValuedFilter;
    // request.isStored = this.filterSystem.isRequiredFilter;
    // request.isIndexed = this.filterSystem.isStoredFilter;
    // request.isRequired = this.filterSystem.isIndexedFilter;
    // request.search= this.searchFields;

    request.fieldDataType = this.filterSystem.typefilter;
    request.isAutosuggest = this.filterSystem.isAutosuggestFilter;
    request.isSearchable = this.filterSystem.isSearchableFilter;
    request.search= this.searchFields;

    if (request.fieldDataType == 'all') {
     delete  request.fieldDataType;
    }
    //  if ( request.isMultiValued == 'all') {
    //   delete request.isMultiValued; 
    // }
    //  if (request.isStored == 'all') {
    //  delete request.isStored; 
    // }
    //  if (request.isIndexed == 'all') {
    //  delete  request.isIndexed;
    // }
    // if (request.isRequired == 'all') { 
    //  delete request.isRequired;
    // }
    if ( request.isSearchable == 'all') {
      delete request.isMultiValued; 
    }
     if (request.isAutosuggest == 'all') {
     delete request.isStored; 
    }
    if (this.searchFields === '') {
     delete request.search;
    }
    // end 
    //Sort start
    if(type === 'fieldName' ){
      request.sort.fieldName = value
    }
    if(type === 'fieldDataType' ){
      request.sort.fieldDataType = value
    }
    // if(type === 'isMultiValued' ){
    //   request.sort.isMultiValued = value
    // }
    // if(type === 'isStored' ){
    //   request.sort.isStored = value
    // }
    // if(type === 'isRequired' ){
    //   request.sort.isRequired = value
    // }
    // if(type === 'isIndexed' ){
    //   request.sort.isIndexed = value
    // }
    if(type === 'isAutosuggest' ){
      request.sort.isAutosuggest = value
    }
    if(type === 'isSearchable' ){
      request.sort.isSearchable = value
    }
    this.getFileds()
    // end

    // let serviceId = 'post.allField'
    // this.service.invoke(serviceId,quaryparms,request).subscribe(res => {
    //   this.filelds = res.fields;     
    // },
    // errRes => {
    //   this.loadingContent = false;
    //   this.errorToaster(errRes, 'Failed to get fields');
    // });
  }
  getDyanmicFilterData(search?) {
    // this.fieldDataTypeArr = [];
    // this.isMultiValuedArr = [];
    // this.isRequiredArr = [];
    // this.isStoredArr = [];
    // this.isIndexedArr = [];
    const quaryparms: any = {
      searchIndexId: this.serachIndexId
    };
    const request :any = {
      moduleName: "fields",
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    // request.fieldDataType = this.filterSystem.typefilter;
    // request.isMultiValued = this.filterSystem.isMultiValuedFilter;
    // request.isStored = this.filterSystem.isStoredFilter;
    // request.isIndexed = this.filterSystem.isIndexedFilter;
    // request.isRequired = this.filterSystem.isRequiredFilter;
    // request.search= this.searchFields;

    request.fieldDataType = this.filterSystem.typefilter;
    request.isAutosuggest = this.filterSystem.isAutosuggestFilter;
    request.isSearchable = this.filterSystem.isSearchableFilter;
    request.search= this.searchFields;

    // if (request.fieldDataType == 'all') {
    //  delete  request.fieldDataType;
    // }
    //  if ( request.isMultiValued == 'all') {
    //   delete request.isMultiValued; 
    // }
    //  if (request.isStored == 'all') {
    //  delete request.isStored; 
    // }
    //  if (request.isIndexed == 'all') {
    //  delete  request.isIndexed;
    // }
    // if (request.isRequired == 'all') { 
    //  delete request.isRequired;
    // }
    // if (this.searchFields === '') {
    //   delete request.search;
    //  }

    if (request.fieldDataType == 'all') {
      delete  request.fieldDataType;
     }
      if ( request.isAutosuggest == 'all') {
       delete request.isAutosuggest; 
     }
      if (request.isSearchable == 'all') {
      delete request.isSearchable; 
     }      
     if (this.searchFields === '') {
       delete request.search;
      }

    this.service.invoke('post.filters', quaryparms, request).subscribe(res => {
      // this.fieldDataTypeArr = [...res.fieldDataType];
      // this.isMultiValuedArr = [...res.isMultiValued];
      // this.isRequiredArr = [...res.isRequired];
      // this.isStoredArr = [...res.isStored];
      // this.isIndexedArr = [...res.isIndexed];

      this.fieldDataTypeArr = [...res.fieldDataType];
      // this.isMultiValuedArr = [...res.isMultiValued];
      // this.isRequiredArr = [...res.isRequired];
      // this.isStoredArr = [...res.isStored];
      // this.isIndexedArr = [...res.isIndexed];
      this.isAutosuggestArr = [...res.isAutosuggest];
      this.isSearchableArr = [...res.isSearchable];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get filters');
    });
    
  }
  // filterFields(source, headerOption) {
  //   if (!this.beforeFilterFields.length) {
  //     this.beforeFilterFields = JSON.parse(JSON.stringify(this.filelds));
  //   }
  //   let tempFields = this.beforeFilterFields.filter((field: any) => {
  //     if (source !== 'all') {
  //       if (headerOption === 'fieldDataType') {
  //         if (field.fieldDataType === source) {
  //           return field;
  //         }
  //       }
  //       if (headerOption === 'isMultiValued') {
  //         if (field.isMultiValued === source) {
  //           return field;
  //         }
  //       }
  //       if (headerOption === 'isRequired') {
  //         if (field.isRequired === source) {
  //           return field;
  //         }
  //       }
  //       if (headerOption === 'isStored') {
  //         if (field.isStored === source) {
  //           return field;
  //         }
  //       }
  //       if (headerOption === 'isIndexed') {
  //         if (field.isIndexed === source) {
  //           return field;
  //         }
  //       }
  //     }
  //     else {
  //       return field;
  //     }
  //   });

  //   this.filelds = JSON.parse(JSON.stringify(tempFields));
  // }

  // searchByFields() {
  //   if (this.searchFields) {
  //     // this.loadingTab = true;
  //     this.getFileds(null, this.searchFields);
  //   } else {
  //     this.getFileds();
  //     this.searchFields = ''
  //   }
  // }
  getFieldAutoComplete(query) {
    if (!query) {
      query = '';
    }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.fieldAutoSuggestion = res || [];
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchFields = '';
      this.activeClose = false;
      this.getFileds(this.searchFields)
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }

  paginate(event) {
    this.skip= event.skip
     this.fieldsFilter(this.searchFields,'search',this.filterObject.type,this.filterObject.header,this.sortedObject.type,this.sortedObject.value,this.sortedObject.position)
    // this.getFileds(event.skip, this.searchFields)

  }
  ngOnDestroy() {
    const self = this;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }

  //Seachable Checkboc Validation
  searchableValidation(searchableCheckbox){
    console.log(searchableCheckbox)
    if(searchableCheckbox){
      return
    }
    else{
  //     const quaryparms: any = {
  //       searchIndexID: this.serachIndexId,
  //       indexPipelineId: this.indexPipelineId,
  //       queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
  //       fieldId: record._id,
  //     };
    
  // this.service.invoke('get.getFieldUsage', quaryparms).subscribe(res => {
  //       this.currentfieldUsage = res;
  //       this.fetchingFieldUsage = false;
  //       const deps: any = {
  //         facets: false,
  //         rules: false,
  //         //weights: false
  //         searchSettings: false,
  //         resultTemplate: false,
  //         nlpRules:false,
  //         entites:false
  //       }
  //       let usageText = '';
  //       let usedArr = [];
  //       this.showSearchSettingsTooltip = false;
  //       this.tooltipArr = [];
  
  //       if (!res) {
  //         return;
  //       }
  
  //       let searchSettingsRecord = [];
  
  //       const resultArr = Object.entries(res).reduce((usedArr: any, [key, valObj]) => {
  //         if (valObj['used']) {
  //           if ((key === 'facets')) {
  //             usedArr = [...usedArr, 'Facet'];
  //           } else if (key === 'searchSettings') {
  //             // const msg =p `<span class="based-on-selection">searchSettings</span>`;
  //             const msg = 'SearchSettings';
  
  //             searchSettingsRecord = valObj['records'][0];
  
  //             this.showSearchSettingsTooltip = true;
  //             usedArr = [...usedArr, msg];
  //           } else if(key === 'rules') {
  //             const msg = res.rules.records.length + ' Business Rule' + (res.rules.records.length > 1 ? 's' : '');
  //             usedArr = [...usedArr, msg];
  //           } else if (key === 'resultTemplates') {
  //             const msg = res.resultTemplates.records.length + ' Result Template' + (res.resultTemplates.records.length > 1 ? 's' : '');
  //             usedArr = [...usedArr, msg]
  //           } else if (key === 'nlpRules') {
  //             const msg = res.nlpRules.records.length + ' nlp Rule' + (res.nlpRules.records.length > 1 ? 's' : '');
  //             usedArr = [...usedArr, msg]
  //           } else if (key === 'entites') {
  //             const msg = res.entites.records.length + (res.entites.records.length == 1 ? 'entity' : '')  + (res.entites.records.length > 1 ? 'entities' : '');
  //             usedArr = [...usedArr, msg];
  //           }
  //         }
  
  //         return usedArr;
  //       }, []);
        
  //       if (searchSettingsRecord) {
  //         if (searchSettingsRecord['highlight']?.value) {
  //           this.tooltipArr = [...this.tooltipArr, 'highlight']
  //         }
  //         if (searchSettingsRecord['weight']?.value) {
  //           this.tooltipArr = [...this.tooltipArr, 'weight'];
  //         }
  //         if (searchSettingsRecord['presentable']?.value) {
  //           this.tooltipArr = [...this.tooltipArr, 'presentable']
  //         }
  //         if (searchSettingsRecord['spellcorrect']?.value) {
  //           this.tooltipArr = [...this.tooltipArr, 'spellcorrect']
  //         }
  //       }
  
  //       let resultStr = `This will impact `;
  //       if (resultArr.length === 1) {
  //         resultStr += resultArr[0];
  //       } else if (resultArr.length === 2) {
  //         resultStr += `${resultArr.join(' and ')}`;
  //       } else {
  //         const lastVal = resultArr.slice(-1)[0]; 
  //         resultStr += `${resultArr.slice(0, resultArr.length -1 ).join(', ')} and ${lastVal}`;
  //       }
  //       console.log(resultStr);
  //       this.indexedWarningMessage = resultStr;
  //       this.resultTest = this.sanitizer.bypassSecurityTrustHtml(resultStr);
  
  //     }, errRes => {
  //       this.fetchingFieldUsage = false;
  //     });
  //   }
   }
 }
}
