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
      queryPipelineId:this.workflowService.selectedQueryPipelineId,
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
        title: 'Delete Field',
        text: 'Are you sure you want to delete selected field?',
        newTitle:'Do you really want to delete?',
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
}
