import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RangeSlider } from '../../helpers/models/range-slider.model';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import * as _ from 'underscore';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
@Component({
  selector: 'app-weights',
  templateUrl: './weights.component.html',
  styleUrls: ['./weights.component.scss']
})
export class WeightsComponent implements OnInit {
  addEditWeighObj:any= null;
  loadingContent = true;
  addDditWeightPopRef:any;
  disableCancle:any = true;
  sliderMin = 0;
  sliderMax = 10;
  currentEditIndex: any = -1
  fields:any = [];
  searchModel;
  indexPipelineId;
  searching;
  searchField
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('addDditWeightPop') addDditWeightPop: KRModalComponent;
  constructor(
    public dialog: MatDialog,
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
  ) { }
  selectedApp: any = {};
  serachIndexId;
  queryPipelineId;
  pipeline;
  weights:any = []
  sliderOpen;
  searchFailed;
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId = this.selectedApp.searchIndexes[0].queryPipelineId;
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.getWeights();
  }
  selectedField(event){
      this.addEditWeighObj.name = event.fieldName;
  }
   getFieldAutoComplete(query){
    if (/^\d+$/.test(this.searchField)) {
      query = parseInt(query,10);
    }
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      indexPipelineId:this.indexPipelineId,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.fields = res || [];
     }, errRes => {
       this.errorToaster(errRes,'Failed to get fields');
     })
  }
  prepereWeights(){
    this.weights = [];
    if(this.pipeline.weights){
      this.pipeline.weights.forEach((element,i) => {
         const name = (element.name || '').replace(/[^\w]/gi, '')
         const obj = {
          name : element.name,
          desc : element.desc,
          sliderObj :new RangeSlider(0, 10, 1, element.value,name + i)
         }
         this.weights.push(obj);
      });
    }
    this.loadingContent = false;
  }
  restore(dialogRef?) {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    this.service.invoke('post.restoreWeights', quaryparms).subscribe(res => {
      this.pipeline=  res.pipeline || {};
      this.prepereWeights();
      if(dialogRef && dialogRef.close){
       dialogRef.close();
      }
     }, errRes => {
       this.errorToaster(errRes,'Failed to reset weights');
     });
  }
  restoreWeights(event) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore weights',
        text: 'Are you sure you want to restore weights?',
        buttons: [{ key: 'yes', label: 'Restore'}, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
         this.restore(dialogRef)
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  getWeights(){
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
      this.pipeline=  res.pipeline || {};
      this.prepereWeights();
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes,'Failed to get weights');
    });
  }
  valueEvent(val,weight){
    if(!this.sliderOpen){
      this.disableCancle = false;
    }
   weight.sliderObj.default = val;
  }
  editWeight(weight,index){
    const editWeight = JSON.parse(JSON.stringify(weight));
    editWeight.sliderObj.id = 'editSlider';
    this.addEditWeighObj = editWeight;
    this.currentEditIndex = index;
    this.openAddEditWeight();
  }
  openAddEditWeight() {
   this.searchModel = {};
   this.sliderOpen = true;
   this.addDditWeightPopRef  = this.addDditWeightPop.open();
  }
  openAddNewWeight() {
    this.addEditWeighObj = {
      name : '',
      desc : '',
      sliderObj :new RangeSlider(0, 10, 1, 2,'editSlider')
    };
    this.openAddEditWeight();
  }
  closeAddEditWeight() {
   if(this.addDditWeightPopRef && this.addDditWeightPopRef.close){
    this.addDditWeightPopRef.close();
    this.sliderOpen = false;
    this.currentEditIndex = -1;
    this.addEditWeighObj = null;
   }
  }
  setDataToActual(){
    this.prepereWeights();
    this.disableCancle = true;
  }
  errorToaster (errRes,message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
  }
 }
 addEditWeight(){
   const weights = JSON.parse(JSON.stringify(this.weights));
   if(this.currentEditIndex > -1){
    weights[this.currentEditIndex ] = this.addEditWeighObj;
   } else {
    weights.push(this.addEditWeighObj);
   }
   this.addOrUpddate(weights);
 }
 getWeightsPayload(weights){
   const tempweights= [];
    weights.forEach(weight => {
     const obj = {
      name: weight.name,
      value:weight.sliderObj.default,
      desc:weight.desc,
     }
     tempweights.push(obj);
   });
   return tempweights
 }
 addOrUpddate(weights,dialogRef?) {
  weights = weights || this.weights;
  const quaryparms: any = {
    searchIndexID:this.serachIndexId,
    queryPipelineId:this.queryPipelineId,
  };
  this.pipeline.weights = this.getWeightsPayload(weights);
  const payload: any = {
    pipeline:this.pipeline
  }
  this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(res => {
   this.currentEditIndex = -1;
   this.pipeline=  res.pipeline || {};
   this.prepereWeights();
   this.notificationService.notify('Weight added successfully','success');
   if(dialogRef && dialogRef.close){
    dialogRef.close();
   } else {
      this.closeAddEditWeight();
   }
  }, errRes => {
    this.errorToaster(errRes,'Failed to add Weight');
  });
}
  deleteWeight(record,event,index) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Rankable Field',
        text: 'Are you sure you want to delete selected rankable field?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.weights.splice(index,1);
          this.addOrUpddate(this.weights);
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
}
