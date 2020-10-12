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
  dummyweights:any = [
    {
     name : 'Proximity',
     description : 'Signifies how near are the matching query words in the records',
     sliderObj :new RangeSlider(0, 10, 1, 2,'proximity')
    },
    {
      name : 'Match Count',
      description : 'Signifies Number of query words matching exactly',
      sliderObj :new RangeSlider(0, 10, 1, 2,'exactMatch')
     },
     {
      name : 'Title Match',
      description : 'Signifies number of words from the query matched at least once',
      sliderObj :new RangeSlider(0, 10, 1, 2,'matchCount')
     },
     {
      name : 'Last Modified',
      description : 'Signifies number of words from the query matched the title of the results',
      sliderObj :new RangeSlider(0, 10, 1, 2,'titleMatch')
     }
  ];
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId = this.selectedApp.searchIndexes[0].queryPipelineId;
    this.getWeights();
    this.getFields();
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
  getFields(){
    const quaryparamats = {
      searchIndexId : this.serachIndexId,
   }
   this.service.invoke('get.groups', quaryparamats).subscribe(
    res => {
      this.fields = _.where(res.groups, {action: 'new'});
    },
    errRes => {
    // this.errorToaster(errRes)
    }
  );
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
      this.errorToaster(errRes,'Failed to get stop words');
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
   }
  }
  setDataToActual(){
    this.prepereWeights();
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
        title: 'Delete Weight',
        text: 'Are you sure you want to delete selected Weight?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.weights.splice(index,1);
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
}
