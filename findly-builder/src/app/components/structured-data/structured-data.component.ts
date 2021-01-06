import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
      sourceType: 'json',
      resourceType: 'structuredData'
    },
    {
      name: 'Import Structured Data',
      description: 'Add structured data manually',
      icon: 'assets/icons/content/database-add.svg',
      id: 'contentStucturedDataAdd',
      sourceType: 'json',
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
    readOnly:'nocursor'
  };
  searchActive: boolean = false;
  searchText : any = '';
  selectedStructuredData : any = [];
  allSelected : boolean = false;
  adwancedSearchModalPopRef: any;
  advancedSearchInput = '';

  @ViewChild('addStructuredDataModalPop') addStructuredDataModalPop: KRModalComponent;
  @ViewChild('advancedSearchModalPop') advancedSearchModalPop: KRModalComponent;

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
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit : 20
    };
    if(skip){
      quaryparms.skip = skip;
    }
    this.service.invoke('get.structuredData', quaryparms).subscribe(res => {
      console.log("res", res);
      this.structuredDataItemsList = res;
      this.structuredDataItemsList.forEach(data => {
        if(data._source.jsonData){
          data._source.parsedData = JSON.stringify(data._source.jsonData, null, 1);
        }
      });
    }, errRes => {
      console.log("error", errRes);
    });
  }

  paginate(event){
    console.log("event", event);
    if(event.skip){
      this.getStructuredDataList(event.skip);
    }
  }

  editJson(payload){
    console.log("payload", payload._source.parsedData);
    this.selectedSourceType = this.availableSources[1];
    this.selectedSourceType.payload = payload;
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  openAddStructuredData(key){
    this.selectedSourceType = this.availableSources.find((s) =>{ if(s.resourceType === key){ return s}});
    console.log("this.selectedSourceType", this.selectedSourceType);
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  cancleSourceAddition() {
    this.selectedSourceType = null;
    this.closeStructuredDataModal();
  }

  closeStructuredDataModal(){
    if (this.addStructuredDataModalPopRef && this.addStructuredDataModalPopRef.close) {
      this.addStructuredDataModalPopRef.close();
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
  }

  applyAdvancedSearch(){
    console.log("search Input", this.advancedSearchInput);
  }

  toggleSearch(activate) {
    this.searchActive = activate;
    if (!activate) {
      this.searchText = '';
    }
  }

  selectData(item, index){
    if (!item.isChecked) {
      this.selectedStructuredData.push(item);
      item.isChecked = true;
    }
    else {
      for (let i = 0; i < this.selectedStructuredData.length; i++) {
        if (this.selectedStructuredData[i].id === item.id) {
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

    //delete experiment popup
    deleteStructuredDataPopup(record) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '446px',
        height: '306px',
        panelClass: 'delete-popup',
        data: {
          title: 'Do you really want to delete?',
          text: 'Selected data will be permanently deleted.',
          buttons: [{ key: 'yes', label: 'Proceed', type: 'danger' }, { key: 'no', label: 'Cancel' }]
        }
      });
  
      dialogRef.componentInstance.onSelect
        .subscribe(result => {
          if (result === 'yes') {
            // this.deleteStructuredData(record, dialogRef);
          } else if (result === 'no') {
            dialogRef.close();
            console.log('deleted')
          }
        })
    }

}
