import { Component, ElementRef, OnInit, ViewChild , OnDestroy, AfterViewInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as _ from 'underscore';
import { of, interval, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from '@kore.services/auth.service';
declare const $: any;
@Component({
  selector: 'app-field-management',
  templateUrl: './field-management.component.html',
  styleUrls: ['./field-management.component.scss']
})
export class FieldManagementComponent implements OnInit {
  showSearch;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  searchFields :any = '';
  newFieldObj :any = null
  addFieldModalPopRef:any;
  filelds: any = [];
  loadingContent = true;
  currentfieldUsage:any
  fetchingFieldUsage = false
  selectedSort = '';
  isAsc = true;
  fieldDataTypeArr: any  = [];
  isMultiValuedArr: any  = [];
  isRequiredArr: any  = [];
  isStoredArr: any  = [];
  isIndexedArr: any  = [];
  filterSystem : any = {
    'typefilter' : 'all',
    'isMultiValuedFilter' : 'all',
    'isRequiredFilter' : 'all',
    'isStoredFilter' : 'all',
    'isIndexedFilter' : 'all'
  }
  beforeFilterFields : any = [];
  filterTableheaderOption = "";
  filterResourcesBack:any;
  filterTableSource = "all";
  firstFilter: any = {'header': '' , 'source' : ''};
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService:AuthService
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.getFileds();
  }
  toggleSearch(){
    if(this.showSearch && this.searchFields){
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch
  }
  openModalPopup(){
    this.addFieldModalPopRef = this.addFieldModalPop.open();
  }
  selectFieldType(type){
    // if(type === 'number'){
    //   this.newFieldObj.fieldName = '';
    //   this.newFieldObj.fieldDataType = type
    // } else {
      this.newFieldObj.fieldDataType = type
    // }
  }
  addEditFiled(field?){
    if(field){
      this.newFieldObj = JSON.parse(JSON.stringify(field));
      this.newFieldObj.previousFieldDataType = field.fieldDataType;
    } else{
      this.newFieldObj = {
        fieldName: '',
        fieldDataType: 'string',
        previousFieldDataType:'string',
        isMultiValued: true,
        isRequired: false,
        isStored: true,
        isIndexed: true
      }
    }
    this.openModalPopup();
  }
  closeModalPopup(){
    this.addFieldModalPopRef.close();
  }
  getFieldUsage(record) {
    if(this.fetchingFieldUsage){
      return;
    }
    this.fetchingFieldUsage = true
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.workflowService.selectedQueryPipeline()._id,
      fieldId:record._id,
    };
    this.service.invoke('get.getFieldUsage', quaryparms).subscribe(res => {
     this.currentfieldUsage = res
     this.fetchingFieldUsage = false;
     let usageText = record.fieldName+' will be deleted'
     const deps:any = {
       facets:false,
       rules:false,
       weights:false
     }
     if(res && (res.facets && res.facets.used) || (res.rules && res.rules.used) || (res.weights && res.weights.used)){
      usageText = 'Deleting ' + record.fieldName + 'field will remove the associated '
      if(res && res.facets && res.facets.used){
        deps.facets = true;
        usageText = usageText + 'Facets '
       }
       if(res && res.weights && res.weights.used){
        deps.weights = true;
        if(deps.facets){
          usageText = usageText + '& ' + 'Weights '
        } else {
          usageText = usageText  + 'Weights '
        }
       }
       if(res && res.rules && res.rules.used){
        if(deps.facets ||deps.weights ){
          usageText = usageText + 'and will impact ' + res.records.length +' Business Rules.'
        } else {
          usageText = usageText  + 'will impact ' + res.records.length +' Business Rules.'
        }
       }
     }
     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle:'Are you sure you want to delete?',
        body:usageText,
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp:true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteIndField(record,dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
    }, errRes => {
      this.fetchingFieldUsage = false;
    });
  }
  addField(){
    const temppayload:any = {
      fieldName: this.newFieldObj.fieldName,
      fieldDataType: this.newFieldObj.fieldDataType,
      isMultiValued: this.newFieldObj.isMultiValued,
      isRequired: this.newFieldObj.isRequired,
      isStored: this.newFieldObj.isStored,
      isIndexed: this.newFieldObj.isIndexed,
    }
    let payload:any = {
      fields:[]
    }
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId,
      fieldId:this.newFieldObj._id
    };
    let api  = 'post.createField';
    if(this.newFieldObj && this.newFieldObj._id){
      api = 'put.updateField'
      payload = temppayload;
    } else {
      payload.fields.push(temppayload);
    }
    this.service.invoke(api, quaryparms,payload).subscribe(res => {
      if(this.newFieldObj && this.newFieldObj._id){
        this.notificationService.notify('Field updated successfully','success');
      } else {
        this.notificationService.notify('Field added successfully','success');
      }
      this.getFileds();
      this.closeModalPopup();
    }, errRes => {
      this.errorToaster(errRes,'Failed to create field');
    });
  }
  getFileds(offset?){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId,
      offset: offset || 0,
      limit:100
    };
    this.service.invoke('get.allField', quaryparms).subscribe(res => {
      this.filelds=  res.fields || [];
      this.loadingContent = false;
      if (this.filelds.length) {
        this.filelds.forEach(element => {
          this.fieldDataTypeArr.push(element.fieldDataType);
          this.isMultiValuedArr.push(element.isMultiValued);
          this.isRequiredArr.push(element.isRequired);
          this.isStoredArr.push(element.isStored);
          this.isIndexedArr.push(element.isIndexed);
        });
        this.fieldDataTypeArr = [...new Set(this.fieldDataTypeArr)];
        this.isMultiValuedArr = [...new Set(this.isMultiValuedArr)];
        this.isRequiredArr = [...new Set(this.isRequiredArr)];
        this.isStoredArr = [...new Set(this.isStoredArr)];
        this.isIndexedArr = [...new Set(this.isIndexedArr)];

      }
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get index  stages');
    });
  }
  deleteIndField(record,dialogRef){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      fieldId:record._id,
    };
    this.service.invoke('delete.deleteField', quaryparms).subscribe(res => {
      const deleteIndex = _.findIndex(this.filelds, (pg) => {
        return pg._id === record._id;
      })
      this.filelds.splice(deleteIndex,1);
      dialogRef.close();
    }, errRes => {
      this.errorToaster(errRes,'Failed to delete field');
    });
  }
  deleteFieldPop(record) {
    this.getFieldUsage(record);
  }
  errorToaster(errRes,message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
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
    case "isMultiValued": {
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
    case "isRequired": {
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
    case "isStored": {
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
    case "isIndexed": {
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
      case 'isMultiValued': return this.compare(a.isMultiValued, b.isMultiValued, isAsc);
      case 'fieldName': return this.compare(a.fieldName, b.fieldName, isAsc);
      case 'isRequired': return this.compare(a.isRequired, b.isRequired, isAsc);
      case 'isStored': return this.compare(a.isStored, b.isStored, isAsc);
      case 'isIndexed': return this.compare(a.isIndexed, b.isIndexed, isAsc);
      default: return 0;
    }
  });
  this.filelds = sortedData;
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
  console.log(this.filelds, source, headerOption);
  this.filterSystem.typefilter = 'all';
  this.filterSystem.isMultiValuedFilter = 'all';
  this.filterSystem.isRequiredFilter = 'all';
  this.filterSystem.isStoredFilter = 'all';
  this.filterSystem.isIndexedFilter = 'all';

  this.filterFields(source, headerOption);
  switch (headerOption) {
    case 'fieldDataType' : { this.filterSystem.typefilter = source; return;};
    case 'isMultiValued' : { this.filterSystem.isMultiValuedFilter = source; return;};
    case 'isRequired' : { this.filterSystem.isRequiredFilter = source; return;};
    case 'isStored' : { this.filterSystem.isStoredFilter = source; return;};
    case 'isIndexed' : { this.filterSystem.isIndexedFilter = source; return;};
  };
}
filterFields(source, headerOption){
  if(!this.beforeFilterFields.length){
    this.beforeFilterFields = JSON.parse(JSON.stringify(this.filelds));
  }
  let tempFields = this.beforeFilterFields.filter( (field : any) => {
    if(source !== 'all'){
      if(headerOption === 'fieldDataType'){
        if(field.fieldDataType  === source){
          return field;
        }
      }
      if(headerOption === 'isMultiValued'){
        if(field.isMultiValued === source){
          return field;
        }
      }
      if(headerOption === 'isRequired'){
        if(field.isRequired === source){
          return field;
        }
      }
      if(headerOption === 'isStored'){
        if(field.isStored === source){
          return field;
        }
      }
      if(headerOption === 'isIndexed'){
        if(field.isIndexed === source){
          return field;
        }
      }
    }
    else{
      return field;
    }
  });

  this.filelds = JSON.parse(JSON.stringify(tempFields));
}
}
