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
  appliedAdvancedSearch = '';
  isLoading : boolean = false;
  structuredDataStatusModalRef : any;
  structuredDataDocPayload : any;
  noItems : boolean = false;
  emptySearchResults : boolean = false;
  skip : any;
  page : any;
  totalCount : any;

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
      if(this.structuredDataItemsList.length == 0){
        this.noItems = true;
      }
    }, errRes => {
      console.log("error", errRes);
      this.isLoading = false;
      this.notificationService.notify('Fetching Structured Data has gone wrong.', 'error');
    });
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
        this.getStructuredDataList();
      }
    }
  }

  openAdvancedSearch(){
    this.adwancedSearchModalPopRef = this.advancedSearchModalPop.open();
    this.advancedSearchInput = '';
  }

  cancleAdvansedSearch(){
    if(this.adwancedSearchModalPopRef){
      this.adwancedSearchModalPopRef.close();
    }
    this.advancedSearchInput = '';
    this.appliedAdvancedSearch = '';
  }

  applyAdvancedSearch(){
    this.appliedAdvancedSearch = this.advancedSearchInput;
    if(this.adwancedSearchModalPopRef){
      this.adwancedSearchModalPopRef.close();
    }
  }

  toggleSearch(activate) {
    this.searchActive = activate;
    if (!activate) {
      if(this.searchText.length){
        this.searchText = '';
        this.getStructuredDataList();
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
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit : 20,
      searchQuery : this.searchText
    };
    if(this.skip){
      quaryparms.skip = this.skip;
    }
    this.service.invoke('get.searchStructuredData', quaryparms).subscribe(res => {
      this.isLoading = false;
      this.totalCount = res.total;
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
