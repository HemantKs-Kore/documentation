import { Component, OnInit, ViewChild } from '@angular/core';
import { RangeSlider } from '../../helpers/models/range-slider.model';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import * as _ from 'underscore';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
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
  fields:any ={};
  searchModel;
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
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId = this.selectedApp.searchIndexes[0].queryPipelineId;
    this.getWeights();
    this.getIndexPipeLine();
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.fields.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: {name: string}) => x.name;
  selectedField(){
    this.addEditWeighObj.name = this.searchModel.name;
  }
  prepereWeights(){
    this.weights = [];
    if(this.pipeline.weights){
      this.pipeline.weights.forEach((element,i) => {
         const obj = {
          name : element.name,
          description : element.description,
          sliderObj :new RangeSlider(0, 10, 1, element.value,element.name + i)
         }
         this.weights.push(obj);
      });
    }
  }
  getIndexPipeLine(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId,
   }
   this.service.invoke('get.indexPipeline', quaryparamats).subscribe(
    res => {
      this.fields = _.filter(res.stages, (stage)=>{
        if(stage && (stage.type === 'field_mapping') && stage.index){
          return true;
        }
      });
    },
    errRes => {
    // this.errorToaster(errRes)
    }
  );
  }
  restore(dialogRef?) {
    const quaryparms: any = {
      searchIndexID:this.serachIndexId,
      queryPipelineId:this.queryPipelineId,
    };
    this.service.invoke('post.restoreWeights', quaryparms).subscribe(res => {
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
      this.loadingContent = false;
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
      description : '',
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
      // description:weight.description,
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
