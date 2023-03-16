import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import * as _ from 'underscore';
import {
  of,
  interval,
  Subject,
  Subscription,
  combineLatest,
  Observable,
  EMPTY,
} from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { IndexFieldsComfirmationDialogComponent } from '../../helpers/components/index-fields-comfirmation-dialog/index-fields-comfirmation-dialog.component';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AuthService } from '@kore.apps/services/auth.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { MixpanelServiceService } from '@kore.apps/services/mixpanel-service.service';
import { TranslationService } from '@kore.libs/shared/src';
import { Store } from '@ngrx/store';
import { selectAppIds } from '@kore.apps/store/app.selectors';
import { StoreService } from '@kore.apps/store/store.service';

declare const $: any;
@Component({
  selector: 'app-field-management',
  templateUrl: './field-management.component.html',
  styleUrls: ['./field-management.component.scss'],
})
export class FieldManagementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  sub: Subscription;
  queryPipelineId;
  showSearch = false;
  selectedApp;
  searchIndexId;
  indexPipelineId;
  fields: any = [];
  skip = 0;
  searchFields: any = '';
  newFieldObj: any = null;
  addFieldModalPopRef: any;
  filelds: any = [];
  loadingContent = true;
  currentfieldUsage: any;
  fetchingFieldUsage = false;
  value = 1 || -1;
  indexedWarningMessage: any = '';
  resultTest;
  editresultTest;
  searchableCheckboxMsg;
  tooltipArr = [];
  showSearchSettingsTooltip = false;
  selectedSort = 'fieldName';
  isAsc = true;
  underlineEnable = false;
  fieldAutoSuggestion: any = [];
  fieldDataTypeArr: any = [];
  isAutosuggestArr: any = [];
  isSearchableArr: any = [];
  totalRecord = 0;
  filterSystem: any = {
    typefilter: 'all',
    isAutosuggestFilter: 'all',
    isSearchableFilter: 'all',
  };
  activeClose = false;
  beforeFilterFields: any = [];
  filterTableheaderOption = '';
  filterResourcesBack: any;
  subscription: Subscription;
  filterTableSource = 'all';
  firstFilter: any = { header: '', source: '' };
  componentType = 'indexing';
  submitted = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  sortedObject = {
    type: 'fieldName',
    position: 'up',
    value: 1,
  };
  showSearchableToaster = false;
  deSelectCheckbox: boolean;
  filterObject = {
    type: '',
    header: '',
  };
  fieldTypesArray = [
    'string',
    'number',
    'trait',
    'dense_vector',
    'entity',
    'keyword',
    'array',
    'object',
    'date',
    'float',
    'boolean',
    'url',
    'html',
    'ip',
    'geo_point',
  ];
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    public mixpanel: MixpanelServiceService,
    private sanitizer: DomSanitizer,
    private translationService: TranslationService,
    private storeService: StoreService
  ) {
    this.translationService.loadModuleTranslations('field-management');
  }

  ngOnInit(): void {
    this.initAppIds();
  }

  initAppIds() {
    const idsSub = this.storeService.ids$
      .pipe(
        tap(({ searchIndexId, indexPipelineId, queryPipelineId }) => {
          this.searchIndexId = searchIndexId;
          this.indexPipelineId = indexPipelineId;
          this.queryPipelineId = queryPipelineId;
        }),
        switchMap(() => this.loadFileds())
      )
      .subscribe();

    this.sub?.add(idsSub);
  }

  ngAfterViewInit() {}
  applyDisableClass(fieldName) {
    return {
      'disable-delete':
        fieldName === 'sys_content_type' ||
        fieldName === 'sys_racl' ||
        fieldName === 'sys_source_name',
    };
  }
  loadFileds() {
    return combineLatest([this.getDyanmicFilterData(), this.getFileds()]);
  }
  toggleSearch() {
    if (this.showSearch && this.searchFields) {
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch;
  }
  openModalPopup() {
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef?.update();
      this.perfectScroll.directiveRef?.scrollToTop();
    }, 500);
  }
  selectFieldType(type) {
    // if(type === 'number'){
    //   this.newFieldObj.fieldName = '';
    //   this.newFieldObj.fieldDataType = type
    // } else {
    this.newFieldObj.fieldDataType = type;
    if (type != 'string') {
      $('#auto_suggest_option').prop('checked', false);
      this.newFieldObj.isAutosuggest = false;
    }

    // }
  }
  addEditFiled(field?) {
    if (field) {
      this.showSearchableToaster = true;
      this.newFieldObj = JSON.parse(JSON.stringify(field));
      this.newFieldObj.previousFieldDataType = field.fieldDataType;
      this.getFieldAutoComplete(field.fieldName);
      this.getFieldUsageData(field, 'pop-up');
    } else {
      this.showSearchableToaster = false;
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
      };
      this.mixpanel.postEvent('Enter Add field', {});
    }
    this.getAllFields();
    this.submitted = false;
    this.openModalPopup();
  }
  closeModalPopup() {
    this.submitted = false;
    this.addFieldModalPopRef.close();
  }
  //**get API call method to fetch the field data */
  getFieldUsageData(record, type) {
    this.indexedWarningMessage = '';
    if (this.fetchingFieldUsage) {
      return;
    }
    this.fetchingFieldUsage = true;
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      fieldId: record._id,
    };
    this.service.invoke('get.getFieldUsage', quaryparms).subscribe(
      (res) => {
        this.currentfieldUsage = res;
        this.fetchingFieldUsage = false;
        const deps: any = {
          facets: false,
          rules: false,
          //weights: false
          searchSettings: false,
          resultTemplate: false,
          nlpRules: false,
          entites: false,
        };
        const usageText = '';
        const usedArr = [];
        this.showSearchSettingsTooltip = false;
        this.tooltipArr = [];
        let msg = 'SearchSettings';

        if (!res) {
          return;
        }

        let searchSettingsRecord = [];

        const resultArr = Object.entries(res).reduce(
          (usedArr: any, [key, valObj]) => {
            if (valObj['used']) {
              if (key === 'facets') {
                usedArr = [...usedArr, 'Facet'];
              } else if (key === 'searchSettings') {
                searchSettingsRecord = valObj['records'][0];
                this.showSearchSettingsTooltip = true;
                usedArr = [...usedArr, msg];
              } else if (key === 'rules') {
                msg =
                  res.rules.records.length +
                  ' Business Rule' +
                  (res.rules.records.length > 1 ? 's' : '');
                usedArr = [...usedArr, msg];
              } else if (key === 'resultTemplates') {
                msg =
                  res.resultTemplates.records.length +
                  ' Result Template' +
                  (res.resultTemplates.records.length > 1 ? 's' : '');
                usedArr = [...usedArr, msg];
              } else if (key === 'nlpRules') {
                msg =
                  res.nlpRules.records.length +
                  ' nlp Rule' +
                  (res.nlpRules.records.length > 1 ? 's' : '');
                usedArr = [...usedArr, msg];
              } else if (key === 'entites') {
                msg =
                  res.entites.records.length +
                  (res.entites.records.length == 1 ? 'entity' : '') +
                  (res.entites.records.length > 1 ? 'entities' : '');
                usedArr = [...usedArr, msg];
              }
            }
            return usedArr;
          },
          []
        );

        if (searchSettingsRecord) {
          if (searchSettingsRecord['highlight']?.value) {
            this.tooltipArr = [...this.tooltipArr, 'Highlight'];
          }
          if (searchSettingsRecord['weight']?.value) {
            this.tooltipArr = [...this.tooltipArr, 'Weight'];
          }
          if (searchSettingsRecord['presentable']?.value) {
            this.tooltipArr = [...this.tooltipArr, 'Presentable'];
          }
          if (searchSettingsRecord['spellCorrect']?.value) {
            this.tooltipArr = [...this.tooltipArr, 'Spellcorrect'];
          }
        }
        let popupData = '';
        type === 'pop-up'
          ? (popupData = `This will impact `)
          : (popupData =
              'Searchable property has been set to false this will impact ');
        this.byPassSecurity(resultArr, popupData, type);
      },
      (errRes) => {
        this.fetchingFieldUsage = false;
      }
    );
  }
  byPassSecurity(resultArr, data, type) {
    if (resultArr.length === 1) {
      data += resultArr[0];
    } else if (resultArr.length === 2) {
      data += `${resultArr.join(' and ')}`;
    } else {
      const lastVal = resultArr.slice(-1)[0];
      data += `${resultArr
        .slice(0, resultArr.length - 1)
        .join(', ')} and ${lastVal}`;
    }
    this.indexedWarningMessage = data;
    type == 'pop-up'
      ? (this.editresultTest = this.sanitizer.bypassSecurityTrustHtml(data))
      : (this.searchableCheckboxMsg =
          this.sanitizer.bypassSecurityTrustHtml(data));
  }
  replaceLast(find, replace, string) {
    const lastIndex = string.lastIndexOf(find);

    if (lastIndex === -1) {
      return string;
    }

    const beginString = string.substring(0, lastIndex);
    const endString = string.substring(lastIndex + find.length);

    return beginString + replace + endString;
  }
  getFieldUsage(record) {
    if (this.fetchingFieldUsage) {
      return;
    }
    this.fetchingFieldUsage = true;
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      fieldId: record._id,
    };
    const isDisableDeleteBtn = false;
    this.service.invoke('get.getFieldUsage', quaryparms).subscribe(
      (res) => {
        this.currentfieldUsage = res;
        this.fetchingFieldUsage = false;
        const usageText = record.fieldName + ' will be deleted';
        const deps: any = {
          facets: false,
          rules: false,
          //weights: false
          searchSettings: false,
          resultTemplate: false,
          nlpRules: false,
          entites: false,
        };

        this.showSearchSettingsTooltip = false;
        this.tooltipArr = [];
        if (!res) {
          return;
        }

        let searchSettingsRecord = [];

        const resultArr = Object.entries(res).reduce(
          (usedArr: any, [key, valObj]) => {
            if (valObj['used']) {
              if (key === 'facets') {
                usedArr = [...usedArr, 'Facet'];
              } else if (key === 'searchSettings') {
                // const msg =p `<span class="based-on-selection">searchSettings</span>`;
                const msg = `SearchSettings`;

                searchSettingsRecord = valObj['records'][0];

                this.showSearchSettingsTooltip = true;
                usedArr = [...usedArr, msg];
              } else if (key === 'rules') {
                const msg =
                  res.rules.records.length +
                  ' Business Rule' +
                  (res.rules.records.length > 1 ? 's' : '');
                usedArr = [...usedArr, msg];
              } else if (key === 'resultTemplates') {
                const msg =
                  res.resultTemplates.records.length +
                  ' Result Template' +
                  (res.resultTemplates.records.length > 1 ? 's' : '');
                usedArr = [...usedArr, msg];
              } else if (key === 'nlpRules') {
                const msg =
                  res.nlpRules.records.length +
                  ' nlp Rule' +
                  (res.nlpRules.records.length > 1 ? 's' : '');
                usedArr = [...usedArr, msg];
              } else if (key === 'entites') {
                const msg =
                  res.entites.records.length +
                  (res.entites.records.length == 1 ? 'entity' : '') +
                  (res.entites.records.length > 1 ? 'entities' : '');
                usedArr = [...usedArr, msg];
              }
            }

            return usedArr;
          },
          []
        );

        if (searchSettingsRecord) {
          if (searchSettingsRecord['highlight']?.value) {
            this.tooltipArr = [...this.tooltipArr, 'Highlight'];
          }
          if (searchSettingsRecord['weight']?.value) {
            this.tooltipArr = [...this.tooltipArr, 'Weight'];
          }
          if (searchSettingsRecord['presentable']?.value) {
            this.tooltipArr = [...this.tooltipArr, 'Presentable'];
          }
          if (searchSettingsRecord['spellCorrect']?.value) {
            this.tooltipArr = [...this.tooltipArr, 'Spellcorrect'];
          }
        }
        let resultStr = `This field is being used in `;
        if (resultArr.length === 1) {
          resultStr += resultArr[0];
        } else if (resultArr.length === 2) {
          resultStr += `${resultArr.join(' and ')}`;
        } else {
          const lastVal = resultArr.slice(-1)[0];
          resultStr += `${resultArr
            .slice(0, resultArr.length - 1)
            .join(', ')} and ${lastVal}`;
        }
        resultStr +=
          '.' +
          '<div>' +
          'Deleting it will remove all the associated settings' +
          '</div>';
        const dialogRef = this.dialog.open(
          IndexFieldsComfirmationDialogComponent,
          {
            width: '530px',
            height: 'auto',
            panelClass: 'delete-popup',
            data: {
              newTitle: 'Are you sure you want to delete?',
              body: resultArr,
              tooltipArr: this.tooltipArr,
              resultArr,
              buttons: [
                {
                  key: 'yes',
                  label: 'Delete',
                  type: 'danger',
                  class: 'deleteBtn',
                },
                { key: 'no', label: 'Cancel' },
              ],
              confirmationPopUp: true,
            },
          }
        );

        dialogRef.componentInstance.onSelect.subscribe((result) => {
          if (result === 'yes') {
            this.deleteIndField(record, dialogRef);
          } else if (result === 'no') {
            dialogRef.close();
            // console.log('deleted')
          }
        });
      },
      (errRes) => {
        this.fetchingFieldUsage = false;
      }
    );
  }
  validateFilelds() {
    if (this.newFieldObj && this.newFieldObj.fieldName.length) {
      this.submitted = false;
      return true;
    } else {
      return false;
    }
  }
  addField() {
    this.submitted = true;
    if (this.validateFilelds()) {
      const temppayload: any = {
        fieldName: this.newFieldObj.fieldName,
        fieldDataType: this.newFieldObj.fieldDataType,
        isAutosuggest: this.newFieldObj.isAutosuggest,
        isSearchable: this.newFieldObj.isSearchable,
      };
      let payload: any = {
        fields: [],
      };
      const quaryparms: any = {
        searchIndexID: this.searchIndexId,
        indexPipelineId: this.indexPipelineId,
        fieldId: this.newFieldObj._id,
      };
      let api = 'post.createField';
      if (this.newFieldObj && this.newFieldObj._id) {
        api = 'put.updateField';
        payload = temppayload;
      } else {
        payload.fields.push(temppayload);
      }
      this.service.invoke(api, quaryparms, payload).subscribe(
        (res) => {
          if (this.newFieldObj && this.newFieldObj._id) {
            this.notificationService.notify('Updated Successfully', 'success');
          } else {
            this.notificationService.notify('Added Successfully', 'success');
            let fieldConfig = '';
            fieldConfig = payload.fields[0].isMultiValued ? 'Multi valued' : '';
            fieldConfig =
              fieldConfig +
              (fieldConfig ? ', ' : '') +
              (payload.fields[0].isRequired ? 'Required' : '');
            fieldConfig =
              fieldConfig +
              (fieldConfig ? ', ' : '') +
              (payload.fields[0].isStored ? 'Stored' : '');
            fieldConfig =
              fieldConfig +
              (fieldConfig ? ', ' : '') +
              (payload.fields[0].isIndexed ? 'Indexed' : '');
            fieldConfig =
              fieldConfig +
              (fieldConfig ? ', ' : '') +
              (payload.fields[0].isAutosuggest ? 'Autosuggest' : '');
            fieldConfig =
              fieldConfig +
              (fieldConfig ? ', ' : '') +
              (payload.fields[0].isSearchable ? 'Searchable' : '');
            this.mixpanel.postEvent('Add Field complete', {
              'Field Type': this.newFieldObj.fieldDataType,
              'Field config': fieldConfig,
            });
          }
          this.getFileds(this.searchFields);
          this.closeModalPopup();
        },
        (errRes) => {
          this.errorToaster(errRes, 'Failed to create field');
        }
      );
    } else {
      this.notificationService.notify(
        'Enter the required fields to proceed',
        'error'
      );
    }
  }
  defaultSort(field, icon, isAscBool) {
    this.getSortIconVisibility(field, icon);
    this.isAsc = !isAscBool;
    this.sortBy(field);
  }
  getAllFields() {
    const quaryparms: any = {
        searchIndexID: this.searchIndexId,
        indexPipelineId: this.indexPipelineId,
      },
      payload = {
        sort: {
          fieldName: 1,
        },
      };
    // let serviceId = 'get.allFieldsData';
    const serviceId = 'post.allField';
    this.service.invoke(serviceId, quaryparms, payload).subscribe(
      (res) => {
        this.fieldAutoSuggestion = res.fields || [];
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get fields');
      }
    );
  }

  getFileds(
    searchValue?,
    searchSource?,
    source?,
    headerOption?,
    sortHeaderOption?,
    sortValue?,
    navigate?,
    request?
  ): Observable<any> {
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      indexPipelineId: this.indexPipelineId,
      offset: this.skip || 0,
      limit: 10,
    };
    let payload: any = {};
    if (!sortHeaderOption && !headerOption) {
      payload = {
        sort: {
          fieldName: this.value,
        },
      };
      quaryparms.offset = 0;
      quaryparms.limit = 10;
    } else if (!sortValue && headerOption) {
      // To send offset=0 and limit =10 on filtering
      (payload = request), (quaryparms.offset = 0), (quaryparms.limit = 10);
    }
    // else if(headerOption){
    //   payload = request,
    //   quaryparms.offset = 0,
    //   quaryparms.limit = 10
    // }
    else {
      payload = request;
    }

    if (this.searchFields) {
      payload.search = this.searchFields;
    }
    const serviceId = 'post.allField';
    // if (searchFields) {
    //   quaryparms.search = searchFields;
    //   serviceId = 'post.allField';
    //   this.getDyanmicFilterData();
    // }
    return this.service.invoke(serviceId, quaryparms, payload).pipe(
      tap(
        (res) => {
          this.mixpanel.postEvent('Enter Fields', {});
          this.filelds = res.fields || [];
          this.totalRecord = res.totalCount || 0;
          this.loadingContent = false;
          if (this.filelds.length) {
            // if (!this.inlineManual.checkVisibility('FIEDS_TABLE')) {
            //   this.inlineManual.openHelp('FIEDS_TABLE');
            //   this.inlineManual.visited('FIEDS_TABLE');
            // }
            this.getDyanmicFilterData(searchValue);
            // this.defaultSort( this.sortedObject.type, this.sortedObject.position, this.sortedObject.value)
            // this.sortField( this.sortedObject.type, this.sortedObject.position, this.sortedObject.value)
          }
        },
        catchError((errRes) => {
          this.loadingContent = false;
          this.errorToaster(errRes, 'Failed to get index  stages');
          return EMPTY;
        })
      )
    );

    // .subscribe(
    //   (res) => {
    //     this.mixpanel.postEvent('Enter Fields', {});
    //     this.filelds = res.fields || [];
    //     this.totalRecord = res.totalCount || 0;
    //     this.loadingContent = false;
    //     if (this.filelds.length) {
    //       if (!this.inlineManual.checkVisibility('FIEDS_TABLE')) {
    //         this.inlineManual.openHelp('FIEDS_TABLE');
    //         this.inlineManual.visited('FIEDS_TABLE');
    //       }
    //       this.getDyanmicFilterData(searchValue);
    //       // this.defaultSort( this.sortedObject.type, this.sortedObject.position, this.sortedObject.value)
    //       // this.sortField( this.sortedObject.type, this.sortedObject.position, this.sortedObject.value)
    //     }
    //   },
    //   (errRes) => {
    //     this.loadingContent = false;
    //     this.errorToaster(errRes, 'Failed to get index  stages');
    //   }
    // );
  }

  deleteIndField(record, dialogRef) {
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      indexPipelineId: this.indexPipelineId,
      fieldId: record._id,
    };
    this.service.invoke('delete.deleteField', quaryparms).subscribe(
      (res) => {
        const deleteIndex = _.findIndex(this.filelds, (pg) => {
          return pg._id === record._id;
        });
        this.filelds.splice(deleteIndex, 1);
        this.notificationService.notify('Deleted Successfully', 'success');
        dialogRef.close();
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to delete field');
      }
    );
  }
  deleteFieldPop(record) {
    this.getFieldUsage(record);
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
      this.notificationService.notify('Somthing went wrong', 'error');
    }
  }

  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case 'fieldName': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'fieldDataType': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'isAutosuggest': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'isSearchable': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
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
        case 'fieldDataType':
          return this.compare(a.fieldDataType, b.fieldDataType, isAsc);
        // case 'isMultiValued': return this.compare(a.isMultiValued, b.isMultiValued, isAsc);
        case 'fieldName':
          return this.compare(a.fieldName, b.fieldName, isAsc);
        // case 'isRequired': return this.compare(a.isRequired, b.isRequired, isAsc);
        // case 'isStored': return this.compare(a.isStored, b.isStored, isAsc);
        // case 'isIndexed': return this.compare(a.isIndexed, b.isIndexed, isAsc);
        case 'isAutosuggest':
          return this.compare(a.fieldName, b.fieldName, isAsc);
        case 'isSearchable':
          return this.compare(a.fieldName, b.fieldName, isAsc);
        default:
          return 0;
      }
    });
    this.filelds = sortedData;
  }
  sortByApi(sort) {
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    let naviagtionArrow = '';
    let checkSortValue = 1;
    if (this.isAsc) {
      naviagtionArrow = 'up';
      checkSortValue = 1;
    } else {
      naviagtionArrow = 'down';
      checkSortValue = -1;
    }
    this.fieldsFilter(
      null,
      null,
      null,
      null,
      sort,
      checkSortValue,
      naviagtionArrow
    );
  }

  filterTable(source, headerOption) {
    switch (headerOption) {
      case 'fieldDataType': {
        this.filterSystem.typefilter = source;
        break;
      }
      case 'isAutosuggest': {
        this.filterSystem.isAutosuggestFilter = source;
        break;
      }
      case 'isSearchable': {
        this.filterSystem.isSearchableFilter = source;
        break;
      }
    }
    this.filterObject = {
      type: source,
      header: headerOption,
    };

    this.fieldsFilter(null, null, source, headerOption);
  }

  fieldsFilter(
    searchValue?,
    searchSource?,
    source?,
    headerOption?,
    sortHeaderOption?,
    sortValue?,
    navigate?
  ) {
    // fieldsFilter(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?)
    // this.loadingContent = true;
    if (sortValue) {
      this.sortedObject = {
        type: sortHeaderOption,
        value: sortValue,
        position: navigate,
      };
    }

    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      indexPipelineId: this.indexPipelineId || '',
      queryPipelineId: this.queryPipelineId,
      offset: 0,
      limit: 10,
    };
    let request: any = {};
    if (!sortValue) {
      (request = {
        sort: {
          fieldName: 1,
        },
      }),
        (quaryparms.offset = 0),
        (quaryparms.limit = 10);
    } else if (sortValue) {
      const sort: any = {};
      request = {
        sort,
      };
    } else {
      request = {};
    }

    request.fieldDataType = this.filterSystem.typefilter;
    request.isAutosuggest = this.filterSystem.isAutosuggestFilter;
    request.isSearchable = this.filterSystem.isSearchableFilter;
    request.search = this.searchFields;
    if (request.fieldDataType == 'all') {
      delete request.fieldDataType;
    }
    if (request.isSearchable == 'all') {
      delete request.isSearchable;
    }
    if (request.isAutosuggest == 'all') {
      delete request.isAutosuggest;
    }

    if (this.searchFields === '') {
      delete request.search;
    }
    if (sortValue) {
      this.getSortIconVisibility(sortHeaderOption, navigate);
      //Sort start
      if (sortHeaderOption === 'fieldName') {
        request.sort.fieldName = sortValue;
      }
      if (sortHeaderOption === 'fieldDataType') {
        request.sort.fieldDataType = sortValue;
      }
      if (sortHeaderOption === 'isAutosuggest') {
        request.sort.isAutosuggest = sortValue;
      }
      if (sortHeaderOption === 'isSearchable') {
        request.sort.isSearchable = sortValue;
      }

      // end
    }
    this.getFileds(
      searchValue,
      searchSource,
      source,
      headerOption,
      sortHeaderOption,
      sortValue,
      navigate,
      request
    );
  }
  sortField(type?, navigate?, value?) {
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      indexPipelineId: this.indexPipelineId || '',
      queryPipelineId: this.queryPipelineId,
      offset: 0,
      limit: 10,
    };
    const sort: any = {};
    const request: any = {
      sort,
    };
    this.selectedSort = type;
    if (this.selectedSort !== type) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }

    request.fieldDataType = this.filterSystem.typefilter;
    request.isAutosuggest = this.filterSystem.isAutosuggestFilter;
    request.isSearchable = this.filterSystem.isSearchableFilter;
    request.search = this.searchFields;

    if (request.fieldDataType == 'all') {
      delete request.fieldDataType;
    }
    if (request.isSearchable == 'all') {
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
    if (type === 'fieldName') {
      request.sort.fieldName = value;
    }
    if (type === 'fieldDataType') {
      request.sort.fieldDataType = value;
    }
    if (type === 'isAutosuggest') {
      request.sort.isAutosuggest = value;
    }
    if (type === 'isSearchable') {
      request.sort.isSearchable = value;
    }
    this.getFileds();
  }
  getDyanmicFilterData(search?): Observable<any> {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
    };
    const request: any = {
      moduleName: 'fields',
      indexPipelineId: this.indexPipelineId || '',
    };

    request.fieldDataType = this.filterSystem.typefilter;
    request.isAutosuggest = this.filterSystem.isAutosuggestFilter;
    request.isSearchable = this.filterSystem.isSearchableFilter;
    request.search = this.searchFields;

    if (request.fieldDataType == 'all') {
      delete request.fieldDataType;
    }
    if (request.isAutosuggest == 'all') {
      delete request.isAutosuggest;
    }
    if (request.isSearchable == 'all') {
      delete request.isSearchable;
    }
    if (this.searchFields === '') {
      delete request.search;
    }

    return this.service.invoke('post.filters', quaryparms, request).pipe(
      tap((res) => {
        this.fieldDataTypeArr = [...res.fieldDataType];
        this.isAutosuggestArr = [...res.isAutosuggest];
        this.isSearchableArr = [...res.isSearchable];
      }),
      catchError((errRes: any) => {
        this.errorToaster(errRes, 'Failed to get filters');
        return EMPTY;
      })
    );

    // .subscribe(
    //   (res) => {
    //     this.fieldDataTypeArr = [...res.fieldDataType];
    //     this.isAutosuggestArr = [...res.isAutosuggest];
    //     this.isSearchableArr = [...res.isSearchable];
    //   },
    //   (errRes) => {
    //     this.errorToaster(errRes, 'Failed to get filters');
    //   }
    // );
  }
  getFieldAutoComplete(query) {
    if (!query) {
      query = '';
    }
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      indexPipelineId: this.indexPipelineId || '',
      query,
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(
      (res) => {
        this.fieldAutoSuggestion = res || [];
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get fields');
      }
    );
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchFields = '';
      this.activeClose = false;
      this.getFileds(this.searchFields);
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100);
  }

  paginate(event) {
    this.skip = event.skip;
    this.fieldsFilter(
      this.searchFields,
      'search',
      this.filterObject.type,
      this.filterObject.header,
      this.sortedObject.type,
      this.sortedObject.value,
      this.sortedObject.position
    );
    // this.getFileds(event.skip, this.searchFields)
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}
