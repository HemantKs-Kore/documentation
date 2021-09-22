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
import { InlineManualService } from '@kore.services/inline-manual.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { E } from '@angular/cdk/keycodes';
declare const $: any;
@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit, OnDestroy {
  facetModalRef: any;
  facetModalRef1: any;
  facets: any = [];
  fieldAutoSuggestion: any = [];
  selectedApp;
  serachIndexId;
  fieldDataType = 'number';
  filedTypeShow = false;
  selectedFieldId: any;
  indexPipelineId;
  loadingContent = true;
  addEditFacetObj: any = null;
  showSearch = false;
  activeClose = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  // serachTraits: any = '';
  searchfacet: any = '';
  facetDefaultValueObj: any = {
    facet: {
      fieldId: '',
      facetName: '',
      facetType: 'value',
      isMultiSelect: true,
      isFacetActive: true,
      facetValue: { asc: true, size: 10 },
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
    NOT_INDEXED: 'Indexed property has been set to False for this field',
    NOT_EXISTS: 'Associated field has been deleted'
  }
  dummyCount = 0;
  selectedField;
  queryPipelineId;
  subscription: Subscription;
  isAsc = true;
  selectedSort = '';
  filterSystem: any = {
    typefilter: 'all',
    selectFilter: 'all',
    statusFilter: 'all'
  };
  beforeFilterFacets: any = [];
  docTypeArr: any = [];
  statusArr: any = [];
  selectTypeArr: any = [];
  componentType: string = 'configure';
  submitted: boolean = false;
  //new code from here
  filterFacetObj: any = {
    fieldId: "",
    name: "",
    type: "filter",
    subtype: "value",
    multiselect: false,
    size: 0,
    sortConfig: {
      sortBy: "",
      order: ""
    },
    ranges: [
      {
        name: "",
        from: 0,
        to: 0
      }]
  };
  sortableFacetObj: any = {
    fieldId: "",
    name: "",
    type: "sortable",
    sortConfig: {
      sortBy: "",
      order: ""
    }
  }
  tabFacetObj: any = {
    fieldId: "",
    type: 'tab',
    multiselect: false,
    tabs: []
  };
  configuredTabValues: any = [{ bucketName: '', fieldValue: 'faq', name: 'FAQs', selected: false }, { bucketName: '', fieldValue: 'web', name: 'Web', selected: false }, { bucketName: '', fieldValue: 'actions', name: 'Actions', selected: false }, { bucketName: '', fieldValue: 'data', name: 'Structured Data', selected: false }, { bucketName: '', fieldValue: 'file', name: 'Files', selected: false }]
  showConfiguredFacet: boolean = false;
  currentFacetObj: any = null;
  currentFacetTab: string = 'filter';
  selectAllConfigure: boolean = false;
  facetType: any = [{ name: 'Filter facet', type: 'filter' }, { name: 'Sortable facet', type: 'sortable' }, { name: 'Tab facet', type: 'tab' }];
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private appSelectionService: AppSelectionService,
    public inlineManual: InlineManualService
  ) { }
  @ViewChild('facetModalPouup') facetModalPouup: KRModalComponent;
  @ViewChild('facetModalPopupNew') facetModalPopupNew: KRModalComponent;
  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    //this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.loadfacets();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
      this.loadfacets();
    })
    // this.getFieldAutoComplete('');
  }
  loadImageText: boolean = false;
  loadingContent1: boolean
  imageLoad() {
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
    if (!this.inlineManual.checkVisibility('FACETS')) {
      this.inlineManual.openHelp('FACETS')
      this.inlineManual.visited('FACETS')
    }
  }

  loadfacets() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId) {
        this.getFacts();
        this.getFieldAutoComplete('');
      }
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
      let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
      if (partialElement.length) {
        partialElement[0].classList.add('d-none');
      }
      let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");
      if (selectAllElement.length) {
        selectAllElement[0].classList.remove('d-none');
      }
      $('#selectAllFacets')[0].checked = true;
    } else {
      let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
      let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");

      if (partialElement && (selectedElements.length != 0)) {
        partialElement[0].classList.remove('d-none');
        if (selectAllElement.length) {
          selectAllElement[0].classList.add('d-none');
        }
      }
      else {
        partialElement[0].classList.add('d-none');
        if (selectAllElement.length) {
          selectAllElement[0].classList.remove('d-none');
        }
      }
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
    let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
    if (partialElement.length) {
      partialElement[0].classList.add('d-none');
    }
    let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");
    if (selectAllElement.length) {
      selectAllElement[0].classList.remove('d-none');
    }
    if (unselectAll) {
      $('#selectAllFacets')[0].checked = false;
    }
  }

  selectAllFromPartial() {
    this.selcectionObj.selectAll = true;
    $('#selectAllFacets')[0].checked = true;
    this.selectAll();
  }

  resetPartial() {
    this.selcectionObj.selectAll = false;
    if ($('#selectAllFacets').length) {
      $('#selectAllFacets')[0].checked = false;
    }
    let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
    if (partialElement.length) {
      partialElement[0].classList.add('d-none');
    }
    let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");
    if (selectAllElement.length) {
      selectAllElement[0].classList.remove('d-none');
    }
  }

  drop(event: CdkDragDrop<string[]>, list) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(list, event.previousIndex, event.currentIndex);
      this.saveSortedList();
    }
  }
  saveSortedList() {
    const payload: any = [];
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    this.facets.forEach(face => {
      payload.push(face._id);
    });
    this.service.invoke('reorder.facets', quaryparms, payload).subscribe(res => {
      this.notificationService.notify(' Updated Successfully', 'success')
    }, errRes => {
      this.errorToaster(errRes, 'Failed to update words');
    });
  }
  addRemovefacet
  addRemovefacetFromSelection(facetId?, addtion?, clear?) {
    if (clear) {
      this.resetPartial();
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
  // createNewFacet() {
  //   this.addEditFacetObj = JSON.parse(JSON.stringify(this.facetDefaultValueObj.facet));
  //   if (this.selectedField && this.selectedField.fieldDataType) {
  //     this.selectedField.fieldDataType = null;
  //   }
  //   this.openModal();
  //   this.getFieldAutoComplete('');
  // }
  editFacetModal(facet) {
    this.getRecordDetails(facet)
  }
  getRecordDetails(data) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      // offset: 0,
      // limit: 100
    };
    // let serviceId = 'get.allField';
    let serviceId = 'get.allFieldsData';
    this.service.invoke(serviceId, quaryparms).subscribe(res => {
      this.fieldAutoSuggestion = res.fields || [];
      res.fields.forEach(element => {
        if (element._id === data.fieldId) {
          console.log(element)
          this.addEditFacetObj = JSON.parse(JSON.stringify(data));
          this.selectedFieldId = element._id;
          // this.getFieldAutoComplete(element.fieldName);
          this.selectField(element);
          this.openModal(true);
        }
      });
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get index  stages');
    });
  }
  resetDefaults() {
    this.facetDefaultValueObj = {
      facet: {
        fieldId: '',
        facetName: '',
        facetType: 'value',
        isMultiSelect: true,
        isFacetActive: true,
        facetValue: { asc: true, size: 10 },
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
    if (!query) {
      query = '';
    }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      category: 'facets',
      query
    };
    this.service.invoke('get.getFieldAutocompleteIndices', quaryparms).subscribe(res => {
      this.fieldAutoSuggestion = JSON.parse(JSON.stringify(res)) || [];
      if (this.fieldAutoSuggestion.length) {
        if (!$('#facets-search-with-dropdown-menu').hasClass('show') && $('#facets-search-input').is(':focus')) {
          $('#facets-search-with-dropdown-menu').addClass('show')
        }
      }
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
  // switchType(type) {
  //   if (type === 'value') {
  //     if (this.addEditFacetObj.facetRange) {
  //       delete this.addEditFacetObj.facetRange;
  //     }
  //     this.addEditFacetObj.facetValue = {};
  //   } else {
  //     if (this.addEditFacetObj.facetValue) {
  //       delete this.addEditFacetObj.facetValue;
  //     }
  //     this.addEditFacetObj.facetRange = [];
  //   }
  //   this.addEditFacetObj.facetType = type;
  // }
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
      if (this.facetDefaultValueObj.range.from && this.facetDefaultValueObj.range.to) {
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
  //list of facets method
  getFacts(offset?) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.queryPipelineId,
      offset: offset || 0,
      limit: 100
    };
    this.service.invoke('get.allFacets', quaryparms).subscribe(res => {
      this.facets = [];
      this.statusArr = [];
      this.docTypeArr = [];
      this.selectTypeArr = [];
      this.facets = res || [];
      this.facets.forEach(element => {
        this.statusArr.push(element.isFacetActive);
        this.docTypeArr.push(element.facetType);
        this.selectTypeArr.push(element.isMultiSelect);
      });
      this.statusArr = [...new Set(this.statusArr)];
      this.docTypeArr = [...new Set(this.docTypeArr)];
      this.selectTypeArr = [...new Set(this.selectTypeArr)];
      this.loadingContent = false;
      this.addRemovefacetFromSelection(null, null, true);
      if (res.length > 0) {
        this.loadingContent = false;
        this.loadingContent1 = true;
        if (!this.inlineManual.checkVisibility('FACETS_OVERVIEW')) {
          this.inlineManual.openHelp('FACETS_OVERVIEW')
          this.inlineManual.visited('FACETS_OVERVIEW')
        }
      }
      else {
        this.loadingContent1 = true;
        // if(!this.inlineManual.checkVisibility('FACETS')){
        //   this.inlineManual.openHelp('FACETS')
        //   this.inlineManual.visited('FACETS')
        // }
      }
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

  setFaceName(suggesition) {
    this.addEditFacetObj.facetName = suggesition.fieldName;
  }

  // createFacet() {
  //   const quaryparms: any = {
  //     searchIndexID: this.serachIndexId,
  //     indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
  //     queryPipelineId: this.queryPipelineId
  //   };
  //   const payload = this.addEditFacetObj;
  //   if (this.addEditFacetObj.fieldName) {
  //     delete payload.fieldName;
  //   }
  //   if (!this.selectField) {
  //     this.notificationService.notify('Please select the valid Field', 'erroe');
  //     return
  //   }
  //   // if(this.selectedField.fieldDataType === 'number'){
  //   //   payload.fieldName = parseInt(this.selectedField.fieldName,10);
  //   // } else {
  //   //   payload.fieldName = this.selectedField.fieldName;
  //   // }
  //   payload.fieldId = this.selectedField._id;
  //   payload.isFacetActive = this.addEditFacetObj.isFacetActive || false;
  //   this.service.invoke('create.facet', quaryparms, payload).subscribe(res => {
  //     this.notificationService.notify('Added Successfully', 'success');
  //     if (this.facets.length == 0) { this.appSelectionService.updateTourConfig(this.componentType) }
  //     //this.facets.push(res);
  //     this.getFacts();
  //     this.closeModal();
  //     this.addEditFacetObj = null;
  //     this.selectedFieldId = null;
  //   }, errRes => {
  //     this.getFieldAutoComplete('');
  //     this.errorToaster(errRes, 'Failed to create facet');
  //   });
  // }
  // editFacet() {
  //   const quaryparms: any = {
  //     searchIndexID: this.serachIndexId,
  //     indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
  //     facetId: this.addEditFacetObj._id,
  //     queryPipelineId: this.queryPipelineId
  //   };
  //   const payload = this.addEditFacetObj;
  //   if (this.addEditFacetObj.fieldName) {
  //     delete payload.fieldName;
  //   }
  //   this.service.invoke('update.facet', quaryparms, payload).subscribe(res => {
  //     this.notificationService.notify('Updated Successfully', 'success');
  //     this.getFacts();
  //     this.closeModal();
  //     this.addEditFacetObj = null;
  //     this.selectedFieldId = null;
  //   }, errRes => {
  //     this.getFieldAutoComplete('');
  //     this.errorToaster(errRes, 'Failed to update facet');
  //   });
  // }
  deleteFacets(facet?, bulk?) {
    const modalData: any = {
      newTitle: 'Are you sure you want to delete ?',
      body: 'Selected facet will be deleted.',
      buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
      confirmationPopUp: true
    }
    if (bulk > 1) {
      modalData.newTitle = 'Are you sure you want to delete ?'
      modalData.body = 'Selected facets will be deleted.';
      modalData.buttons[0].label = 'Delete';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: modalData,
    });


    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          if (bulk) {
            this.deleteBulkFacet(dialogRef);
          } else if (facet) {
            this.deleteFacet(facet, dialogRef);
          }
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  deleteBulkFacet(dialogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.queryPipelineId
    };
    const facets = Object.keys(this.selcectionObj.selectedItems);
    const delateitems = {
      facets: []
    };
    if (facets && facets.length) {
      facets.forEach(ele => {
        const obj = {
          _id: ele,
        }
        delateitems.facets.push(obj);
      });
    }
    const payload = delateitems;
    this.service.invoke('delete.bulkFacet', quaryparms, payload).subscribe(res => {
      this.getFacts();
      dialogRef.close();
      this.closeModal();
      this.notificationService.notify('Facets Deleted Successfully', 'success');
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to delete facets');
    });
  }
  deleteFacet(facet, dialogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      facetId: facet._id,
      queryPipelineId: this.queryPipelineId
    };
    const payload = this.addEditFacetObj;
    this.service.invoke('delete.facet', quaryparms, payload).subscribe(res => {
      const deleteIndex = _.findIndex(this.facets, (fct) => {
        return fct._id === facet._id;
      })
      this.facets.splice(deleteIndex, 1);
      dialogRef.close();
      this.closeModal();
      this.notificationService.notify('Deleted Successfully', 'success');
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to delete facet');
    });
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

  // addOrUpdate() {
  //   this.submitted = true;
  //   if (this.validateAddEditFacet()) {
  //     this.addFiled();
  //     if (this.addEditFacetObj && this.addEditFacetObj._id) {
  //       this.editFacet();
  //     } else {
  //       //this.createFacet();
  //     }
  //   }
  //   else {
  //     this.notificationService.notify('Enter the required fields to proceed', 'error');
  //   }
  // }
  openModal(isFields?) {
    this.submitted = false;
    if (!isFields) {
      this.getAllFields();
    }
    this.facetModalRef = this.facetModalPouup.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  closeModal() {
    if (this.facetModalRef && this.facetModalRef.close) {
      this.facetModalRef.close();
    }
    this.submitted = false;
    this.resetDefaults();
    this.addEditFacetObj = null;
    this.selectedFieldId = null;
  }
  getAllFields() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
    };
    let serviceId = 'get.allFieldsData';
    this.service.invoke(serviceId, quaryparms).subscribe(res => {
      this.fieldAutoSuggestion = res.fields || [];
      if (this.fieldAutoSuggestion.length) {
        if (!$('#facets-search-with-dropdown-menu').hasClass('show') && $('#facets-search-input').is(':focus')) {
          $('#facets-search-with-dropdown-menu').addClass('show')
        }
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  toggleSearch() {
    if (this.showSearch && this.searchfacet) {
      this.searchfacet = '';
    }
    this.showSearch = !this.showSearch
  };

  changeFacetSorting(value) {
    this.addEditFacetObj.facetValue.asc = value;
  }

  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "name": {
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
      case "type": {
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
      case "recentStatus": {
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
      case "createdOn": {
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
  sortBy(sort) {
    const data = this.facets.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'type': return this.compare(a.facetType, b.facetType, isAsc);
        case 'status': return this.compare(a.isFacetActive, b.isFacetActive, isAsc);
        case 'name': return this.compare(a.facetName, b.facetName, isAsc);
        case 'select': return this.compare(a.isMultiSelect, b.isMultiSelect, isAsc);
        default: return 0;
      }
    });
    this.facets = sortedData;
  }

  filterTable(source, headerOption) {
    console.log(this.facets, source, headerOption);
    this.filterSystem.typefilter = 'all';
    this.filterSystem.selectFilter = 'all';
    this.filterSystem.statusFilter = 'all';
    this.filterFacets(source, headerOption);
    switch (headerOption) {
      case 'facetType': { this.filterSystem.typefilter = source; return; };
      case 'isMultiSelect': { this.filterSystem.selectFilter = source; return; };
      case 'statusType': { this.filterSystem.statusFilter = source; return; };
    };
  }

  filterFacets(source, headerOption) {
    if (!this.beforeFilterFacets.length) {
      this.beforeFilterFacets = JSON.parse(JSON.stringify(this.facets));
    }
    let tempFacets = this.beforeFilterFacets.filter((facet: any) => {
      if (source !== 'all') {
        if (headerOption === 'facetType') {
          if (facet.facetType === source) {
            return facet;
          }
        }
        if (headerOption === 'isMultiSelect') {
          if (facet.isMultiSelect === source) {
            return facet;
          }
        }
        if (headerOption === 'statusType') {
          if (facet.isFacetActive === source) {
            return facet;
          }
        }
      }
      else {
        return facet;
      }
    });

    this.facets = JSON.parse(JSON.stringify(tempFacets));
  }

  validateFacetSize(event) {
    if (event.target.value && event.target.value > 0) {
      // if(event.target.value > 20){
      //   this.addEditFacetObj.facetValue.size = 20;
      // }
    }
    else {
      this.addEditFacetObj.facetValue.size = 1;
      return;
    }
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchfacet = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
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

  modifyFieldWarningMsg(warningMessage) {
    let index = warningMessage.indexOf("changed");
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }
  //new code from here
  addNewRange(type, index?) {
    if (type === 'add') {
      this.currentFacetObj.ranges.push({ name: "", from: 0, to: 0 });
    }
    else if (type === 'remove') {
      this.currentFacetObj.ranges.splice(index, 1);
    }
  }
  //new modal open
  createNewFacet(data?) {
    if (data) {
      this.currentFacetObj = Object.assign({}, data);
      this.currentFacetTab = data.type;
      this.facetType = this.facetType.filter(ele => ele.type === data.type);
      if (data.type === 'tab') {
        this.configuredTabValues.map(tab => {
          this.currentFacetObj.tabs.map(tab1 => {
            if (tab.fieldValue === tab1.fieldValue) {
              tab.selected = true;
            }
            return tab
          })
        })
      }
    }
    else {
      this.currentTab('filter');
    }
    this.facetModalRef1 = this.facetModalPopupNew.open();
  }
  //new modal close
  closeFacetDialog() {
    if (this.showConfiguredFacet) {
      this.showConfiguredFacet = false;
    }
    else {
      if (this.facetModalRef1 && this.facetModalRef1.close) {
        this.facetModalRef1.close();
        this.currentFacetObj = null;
        this.submitted = false;
        this.facetType = [{ name: 'Filter facet', type: 'filter' }, { name: 'Sortable facet', type: 'sortable' }, { name: 'Tab facet', type: 'tab' }];
      }
    }
  }
  //current tab
  currentTab(type) {
    this.currentFacetTab = type;
    this.currentFacetObj = null;
    this.submitted = false;
    if (type === 'filter') {
      this.currentFacetObj = Object.assign({}, this.filterFacetObj);
    }
    else if (type === 'sortable') {
      this.currentFacetObj = Object.assign({}, this.sortableFacetObj);
    }
    else if (type === 'tab') {
      this.currentFacetObj = Object.assign({}, this.tabFacetObj);
    }
  }
  //selectAll ConfiguredFacets checkbox
  selectAllConfiguredFacets(type) {
    if (type === 'all') {
      setTimeout(() => {
        this.configuredTabValues.forEach(element => {
          return element.selected = this.selectAllConfigure ? true : false
        });
      }, 100)
    }
    else if (type === 'individual') {
      setTimeout(() => {
        const all_checked = this.configuredTabValues.every(element => element.selected === true);
        this.selectAllConfigure = all_checked ? true : false;
      }, 100)
    }
  }
  //sort configured facets array in tabs
  sortConfiguredFacets(event: CdkDragDrop<string[]>, list) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(list, event.previousIndex, event.currentIndex);
    }
  }
  //validate fields
  validateAddEditFacet() {
    if (this.currentFacetTab === 'filter') {
      if (this.currentFacetObj?.subtype === 'value') {
        this.submitted = (this.currentFacetObj.fieldId && this.currentFacetObj.name && this.currentFacetObj?.sortConfig?.sortBy && this.currentFacetObj?.sortConfig?.order) ? false : true;
      }
      else if (this.currentFacetObj?.subtype === 'range') {
        this.submitted = (this.currentFacetObj.fieldId && this.currentFacetObj.name) ? false : true;
      }
    }
    else if (this.currentFacetTab === 'sortable') {
      this.submitted = (this.currentFacetObj.fieldId && this.currentFacetObj.name && this.currentFacetObj?.sortConfig?.sortBy && this.currentFacetObj?.sortConfig?.order) ? false : true;
    }
    else if (this.currentFacetTab === 'tab') {
      this.submitted = (this.currentFacetObj.fieldId && this.currentFacetObj.tabs) ? false : true;
    }
    return this.submitted ? false : true;
  }
  //save facet
  saveFacet() {
    if (this.showConfiguredFacet) {
      this.showConfiguredFacet = false;
      this.currentFacetObj.tabs = [];
      this.configuredTabValues.forEach(element => {
        if (element.selected) {
          this.currentFacetObj.tabs.push({ fieldValue: element.fieldValue, bucketName: element.bucketName });
        }
      });
    } else {
      if (this.validateAddEditFacet()) {
        let quaryparms: any = {
          searchIndexID: this.serachIndexId,
          indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
          queryPipelineId: this.queryPipelineId
        };
        const url = this.currentFacetObj?._id ? 'update.facet' : 'create.facet';
        if (this.currentFacetObj?.type === 'filter') {
          if (this.currentFacetObj?.subtype === 'value') {
            delete this.currentFacetObj?.ranges
          }
          else if (this.currentFacetObj?.subtype === 'range') {
            delete this.currentFacetObj?.sortConfig;
            delete this.currentFacetObj?.size;
          }
        }
        if (this.currentFacetObj?._id) {
          quaryparms = Object.assign({ ...quaryparms, facetId: this.currentFacetObj?._id });
        }
        else {
          delete this.currentFacetObj.fieldName;
        }
        const payload = this.currentFacetObj;
        this.service.invoke(url, quaryparms, payload).subscribe(res => {
          this.notificationService.notify(`${this.currentFacetObj?._id ? 'Updated' : 'Added'} Successfully`, 'success');
          if (this.facets.length == 0) { this.appSelectionService.updateTourConfig(this.componentType) }
          this.getFacts();
          this.closeFacetDialog();
        }, errRes => {
          this.errorToaster(errRes, 'Failed to create facet');
        });
      }
      else {
        this.notificationService.notify('Enter the required fields to proceed', 'error');
      }
    }
  }
  //edit facet for status
  editFacet(data, event) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      facetId: data._id,
      queryPipelineId: this.queryPipelineId
    };
    data.active = event.target.checked;
    this.service.invoke('update.facet', quaryparms, data).subscribe(res => {
      this.notificationService.notify('Updated Successfully', 'success');
      this.getFacts();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to update facet');
    });
  }
  //get values based on field
  getFieldValues(id) {
    const quaryparms: any = {
      sidx: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      fieldId: id
    };
    this.service.invoke('get.facetValues', quaryparms).subscribe(res => {
      console.log("getFieldValues res", res)
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get field values');
    });
  }
}
