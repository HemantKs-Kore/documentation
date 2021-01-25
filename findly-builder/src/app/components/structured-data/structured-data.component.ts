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
import { retryWhen } from 'rxjs/operators';

@Component({
  selector: 'app-structured-data',
  templateUrl: './structured-data.component.html',
  styleUrls: ['./structured-data.component.scss']
})
export class StructuredDataComponent implements OnInit {

  addStructuredDataModalPopRef : any;
  selectedSourceType: any;
  availableSources = [
    {
      name: 'Import Structured Data',
      description: 'Import from JSON or CSV',
      icon: 'assets/icons/content/database-Import.svg',
      id: 'contentStucturedDataImport',
      sourceType: 'object',
      resourceType: 'structuredData'
    },
    {
      name: 'Import Structured Data',
      description: 'Add structured data manually',
      icon: 'assets/icons/content/database-add.svg',
      id: 'contentStucturedDataAdd',
      sourceType: 'object',
      resourceType: 'structuredDataManual'
    }
  ];
  structuredDataItemsList : any = [];
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
    readOnly:'nocursor',
    scrollbarStyle : 'null'
  };
  searchActive: boolean = false;
  searchText : any = '';
  selectedStructuredData : any = [];
  allSelected : boolean = false;
  adwancedSearchModalPopRef: any;
  advancedSearchInput = '';
  appliedAdvancedSearch : any = {};
  isLoading : boolean = false;
  structuredDataStatusModalRef : any;
  structuredDataDocPayload : any;
  noItems : boolean = false;
  emptySearchResults : boolean = false;
  skip : any;
  page : any;
  totalCount : any;
  defaultView : boolean = true;
  fields : any = [];
  searchField;
  advancedSearch : any = {};
  tempAdvancedSearch : any = {};
  disableContainer : any = false;

  @ViewChild('addStructuredDataModalPop') addStructuredDataModalPop: KRModalComponent;
  @ViewChild('advancedSearchModalPop') advancedSearchModalPop: KRModalComponent;
  @ViewChild('structuredDataStatusModalPop') structuredDataStatusModalPop: KRModalComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.getStructuredDataList();
  }

  getStructuredDataList(skip?){
    this.isLoading = true;
    this.noItems = false;
    this.emptySearchResults = false;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit : 20
    };
    if(skip){
      quaryparms.skip = skip;
    }
    this.skip = skip;
    this.service.invoke('get.structuredData', quaryparms).subscribe((res : any) => {
      this.isLoading = false;
      this.totalCount = res.total;
      this.selectedStructuredData = [];
      if(res.data){
        this.structuredDataItemsList = res.data;
      }
      else{
      this.structuredDataItemsList = [];
      }
      this.structuredDataItemsList.forEach(data => {
        data.objectLength =  Object.keys(data._source).length;
        if(data._source){
          if(data._source.contentType){
            delete data._source.contentType;
          }
          data.parsedData = JSON.stringify(data._source, null, 1);
        };
      });
      this.designDefaultData(this.structuredDataItemsList);
      if(this.structuredDataItemsList.length == 0){
        this.noItems = true;
      }
    }, errRes => {
      console.log("error", errRes);
      this.isLoading = false;
      this.notificationService.notify('Fetching Structured Data has gone wrong.', 'error');
    });
  }

  designDefaultData(structuredDataItemsList){
    this.defaultView = this.defaultView;
    structuredDataItemsList.forEach((element : any, index) => {
      element.objectValues = [];
      Object.keys(element._source).forEach((key : any, index) => {
        let nested = false;
        if(key && (typeof element._source[key] === 'object')){
          nested = true;
        }
        else{
          nested = false;
        }
        if(index < 4){
          element.objectValues.push({
            key : key,
            value : nested ? JSON.stringify(element._source[key], null, 2) : element._source[key],
            // var str = JSON.stringify(obj, null, 2);
            expandedValue : element._source[key],
            nested : nested,
            expanded : false
          });
        }
      });
    });
    console.log("structuredDataItemsList", this.structuredDataItemsList);
  }

  getFieldAutoComplete(query){
    if (/^\d+$/.test(this.searchField)) {
      query = parseInt(query,10);
    }
    const quaryparms: any = {
      searchIndexID:this.selectedApp.searchIndexes[0]._id,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.fields = res || [];
     }, errRes => {
      this.notificationService.notify('Failed to get fields', 'error');
     })
  }

  selectedField(suggesition, index){
    console.log("test", suggesition);
    if(this.advancedSearch.rules[index]){
      this.advancedSearch.rules[index].fieldName = suggesition.fieldName;
    }
  }

  paginate(event){
    console.log("event", event);
    if(event.skip){
      this.getStructuredDataList(event.skip);
    }
  }

  editJson(payload){
    this.selectedSourceType = JSON.parse(JSON.stringify(this.availableSources[1]));
    this.selectedSourceType.payload = payload;
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  openAddStructuredData(key){
    this.selectedSourceType = this.availableSources.find((s) =>{ if(s.resourceType === key){ return s}});
    console.log("this.selectedSourceType", this.selectedSourceType);
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  cancleSourceAddition(event?) {
    this.selectedSourceType = null;
    this.closeStructuredDataModal(event);
  }

  closeStructuredDataModal(event?){
    this.selectedSourceType = {};
    if (this.addStructuredDataModalPopRef && this.addStructuredDataModalPopRef.close) {
      this.addStructuredDataModalPopRef.close();
      if(event && event.showStatusModal){
        this.structuredDataDocPayload = event.payload;
        this.openStructuredDataStatusModal();
      }
      else{
        // refresh the data
        if(this.searchText.length){
          this.searchItems();
        }
        else if(Object.keys(this.appliedAdvancedSearch).length){
          this.applyAdvancedSearchCall();
        }
        else{
          if(!event || !(event && event.cancel)){
            this.getStructuredDataList();
          }
        }
      }
    }
  }

  openAdvancedSearch(){
    if(Object.values(this.advancedSearch).length){
      this.tempAdvancedSearch = JSON.parse(JSON.stringify(this.advancedSearch));
    }
    else{
      this.advancedSearch.operand = "and"
      this.advancedSearch.rules = [];
      this.advancedSearch.rules.push({
        fieldName : '',
        operator : '',
        value : '',
        type : ''
      });
      this.tempAdvancedSearch = [];
    }
    this.adwancedSearchModalPopRef = this.advancedSearchModalPop.open();
    // this.advancedSearchInput = '';
  }

  addRule(){
    this.advancedSearch.rules.push({
      fieldName : '',
      operator : '',
      value : '',
      type : ''
    });
    console.log(this.advancedSearch);
  }

  removeRule(index){
    if(index === 0 && this.advancedSearch.rules.length === 1){
      this.advancedSearch.rules[0] ={
        fieldName : '',
        operator : '',
        value : '',
        type : ''
      }
    }
    else{
      this.advancedSearch.rules.splice(index, 1);
    }
  }

  removeAdvancedSearchRule(index){
    this.appliedAdvancedSearch.rules.splice(index, 1);
    this.advancedSearch = this.appliedAdvancedSearch;
    this.applyAdvancedSearchCall();
  }

  setOperator(key, index){
    if(this.advancedSearch.rules[index]){
      this.advancedSearch.rules[index].operator = key;
      if((key === 'exists') || (key === 'notexists')){
        this.advancedSearch.rules[index].type = 'field';
        this.advancedSearch.rules[index].value = '';
      }
      else{
        this.advancedSearch.rules[index].type = 'value';
      }
    }
  }

  cancleAdvansedSearch(){
    if(this.adwancedSearchModalPopRef){
      this.adwancedSearchModalPopRef.close();
    }
    this.advancedSearchInput = '';
    // this.appliedAdvancedSearch = '';
    if(!this.checkAdvancedSearchValidation()){
      if(this.tempAdvancedSearch.rules && this.tempAdvancedSearch.rules.length){
        this.advancedSearch = JSON.parse(JSON.stringify(this.tempAdvancedSearch));
        this.appliedAdvancedSearch = JSON.parse(JSON.stringify(this.advancedSearch));
      }
      else{
        this.advancedSearch = {};
        this.appliedAdvancedSearch = {};
      }
    }
    else{
      this.advancedSearch = JSON.parse(JSON.stringify(this.tempAdvancedSearch));
      this.appliedAdvancedSearch = JSON.parse(JSON.stringify(this.advancedSearch));
    }
  }

  returnOperator(operator){
    switch (operator) {
      case 'exists' : return 'Exists';
      case 'notexists': return 'Does Not Exist';
      case 'equals': return 'Equals To';
      case 'notequals' : return 'Not Equals To'
    }
  }

  applyAdvancedSearch(){
    console.log("advanced Search", this.advancedSearch);
    this.appliedAdvancedSearch = this.advancedSearch;
    if(this.checkAdvancedSearchValidation()){
      this.applyAdvancedSearchCall();
      // if(this.adwancedSearchModalPopRef){
      //   this.adwancedSearchModalPopRef.close();
      // }
    }
    else{
      // inform user
      this.notificationService.notify('Please fill all necessary fields', 'error');
    }
  }

  checkAdvancedSearchValidation(){
    if(this.advancedSearch.operand && this.advancedSearch.operand.length){
      if(this.advancedSearch.rules.length){
        let isPassed : any;
        isPassed = this.advancedSearch.rules.every((rule) => {
          if(rule.fieldName.length && rule.operator.length){
            if((rule.operator !== 'exists') && (rule.operator !== 'notexists')){
              if(rule.value.length){
                return true;
              }
              else{
                return false;
              }
            }
            else{
              return true;
            }
          }
          else{
            return false;
          }
        });
        return isPassed;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }

  applyAdvancedSearchCall(){
    this.isLoading = true;
    this.emptySearchResults = false;
    this.noItems = false;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit : 20,
      searchQuery : this.searchText,
      advanceSearch : true
    };
    if(this.skip){
      quaryparms.skip = this.skip;
    }
    let payload : any = {};
    payload = this.designPayloadForAdvancedSearch();
    if(payload.cond && !payload.cond.length){
      // if no rules, then just refresh
      this.appliedAdvancedSearch = {};
      this.advancedSearch = {};
      this.getStructuredDataList();
      return false;
    }
    this.service.invoke('post.searchStructuredData', quaryparms, payload).subscribe(res => {
      this.isLoading = false;
      this.totalCount = res.total;
      this.selectedStructuredData = [];
      if(this.adwancedSearchModalPopRef){
        this.adwancedSearchModalPopRef.close();
      }
      if(res.data){
        this.structuredDataItemsList = res.data;
        this.structuredDataItemsList.forEach(data => {
          data.objectLength =  Object.keys(data._source).length;
          if(data._source){
            if(data._source.contentType){
              delete data._source.contentType;
            }
            data.parsedData = JSON.stringify(data._source, null, 1);
          };
        });
        this.designDefaultData(this.structuredDataItemsList);
      }
      else{
      this.structuredDataItemsList = [];
      }
      if(this.structuredDataItemsList.length == 0){
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

  designPayloadForAdvancedSearch(){
    let payload : any = {};
    payload.operand = this.advancedSearch.operand;
    payload.cond = [];
    this.advancedSearch.rules.forEach((rule) => {
      payload.cond.push({
        'type' : rule.type,
        'key' : rule.fieldName,
        'op' : rule.operator,
        'value' : rule.value
      })
    });
    return payload; 
  }

  toggleSearch(activate) {
    this.searchActive = activate;
    if (!activate) {
      if(this.searchText.length){
        this.searchText = '';
        if(this.appliedAdvancedSearch && (this.appliedAdvancedSearch.rules && this.appliedAdvancedSearch.rules.length)){
          this.applyAdvancedSearchCall();
        }
        else{
          this.getStructuredDataList();
        }
      }
    }
    else {
      setTimeout(() => {
        let id = 'direct-search';
        let element = document.getElementById(id);
        if(element){
          element.focus();
        }
      }, 100);
    }
  }

  selectData(item, index){
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

  searchItems(){
    this.isLoading = true;
    this.emptySearchResults = false;
    this.noItems = false;
    let payload;
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit : 20,
      searchQuery : this.searchText,
      advanceSearch : false
    };
    if(this.skip){
      quaryparms.skip = this.skip;
    }
    if(this.appliedAdvancedSearch && this.appliedAdvancedSearch.rows && this.appliedAdvancedSearch.rules.length){
      payload = this.appliedAdvancedSearch;
    }
    this.service.invoke('get.searchStructuredData', quaryparms, payload).subscribe(res => {
      this.isLoading = false;
      this.totalCount = res.total;
      this.selectedStructuredData = [];
      if(res.data){
        this.structuredDataItemsList = res.data;
      }
      else{
      this.structuredDataItemsList = [];
      }
      this.selectedStructuredData = [];
      this.structuredDataItemsList.forEach(data => {
        data.objectLength =  Object.keys(data._source).length;
        if(data._source){
          if(data._source.contentType){
            delete data._source.contentType;
          }
          data.parsedData = JSON.stringify(data._source, null, 1);
        };
      });
      this.designDefaultData(this.structuredDataItemsList);
      if(this.structuredDataItemsList.length == 0){
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
          newTitle: 'Do you really want to delete?',
          body: 'Selected data will be permanently deleted.',
          buttons: [{ key: 'yes', label: 'Proceed', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
          confirmationPopUp: true,
        }
      });
      dialogRef.componentInstance.onSelect.subscribe(res => {
        if (res === 'yes') {
          if(!record){
            if(this.selectedStructuredData.length){
              //bulk delete
              dialogRef.close();
              this.deleteBulkStructuredData();
            }
          }
          else{
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

  deleteStructuredData(record){
    let quaryparms : any = {};
    quaryparms.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    quaryparms.sourceId = Math.random().toString(36).substr(7);
    if(record){
      quaryparms.contentId = record._id;
      this.service.invoke('delete.structuredData', quaryparms).subscribe(res => {
        if(res){
          this.selectedStructuredData = [];
          this.getStructuredDataList();
          this.notificationService.notify('Deleted Successfully', 'success');
        }
      }, errRes => {
        console.log("error", errRes);
        this.notificationService.notify('Deletion has gone wrong.', 'error');
      });
    }
  }

  deleteBulkStructuredData(){
    let quaryparms : any = {};
    let payload : any = {};
    quaryparms.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    if(this.selectedStructuredData.length){
      payload.docIds = [];
      this.selectedStructuredData.forEach((data : any) => {
        payload.docIds.push(data._id);
      });
      this.service.invoke('delete.clearAllStructureData', quaryparms, payload).subscribe(res => {
        if(res){
          this.selectedStructuredData = [];
          this.getStructuredDataList();
          this.notificationService.notify('Deleted Successfully', 'success');
        }
      }, errRes => {
        console.log("error", errRes);
        this.notificationService.notify('Deletion has gone wrong.', 'error');
      });
    }
  }

  openStructuredDataStatusModal(){
    this.structuredDataStatusModalRef = this.structuredDataStatusModalPop.open();
  }

  closeStructuredDataStatusModal(){
    if(this.structuredDataStatusModalRef){
      this.structuredDataStatusModalRef.close();
      this.getStructuredDataList();
    }
  }

}
