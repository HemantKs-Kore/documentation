import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AppSelectionService } from '@kore.services/app.selection.service'
import * as _ from 'underscore';
import { Observable, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';
import { RangeSlider } from 'src/app/helpers/models/range-slider.model';
declare const $: any;
@Component({
  selector: 'app-weights',
  templateUrl: './weights.component.html',
  styleUrls: ['./weights.component.scss']
})
export class WeightsComponent implements OnInit, OnDestroy
{
  pageNumber:number;
  numberofweigths:number;
  selected:boolean = false;
  addEditWeighObj: any = null;
  loadingContent = true;
  addDditWeightPopRef: any;
  disableCancle: any = true;
  sliderMin = 0;
  sliderMax = 10;
  currentEditIndex: any = -1
  selectedSort = 'fieldName';
  isAsc = true;
  checksort='asc'
  fields: any = [];
  weightsList = [];
  fieldsList = [];
  field_name:string;
  searchModel;
  deleteFlag;
  indexPipelineId;
  search_FieldName: any = '';
  searching;
  searchField;
  payloadObj = {};
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  componentType: string = 'configure';
  fieldWarnings: any = {
    NOT_INDEXED: 'Indexed property has been set to False for this field',
    NOT_EXISTS: 'Associated field has been deleted'
  }
  submitted: boolean = false;
  isAddLoading: boolean = false;
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('addDditWeightPop') addDditWeightPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  constructor(
    public dialog: MatDialog,
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public inlineManual: InlineManualService,
    public mixpanel: MixpanelServiceService
  ) { }
  selectedApp: any = {};
  serachIndexId;
  queryPipelineId;
  pipeline;
  weights: any = []
  sliderOpen;
  searchFailed;
  weightsObj: any = {};
  currentEditDesc = '';
  subscription: Subscription;
  ngOnInit(): void
  {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.loadWeights();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res =>
    {
      this.loadWeights();
    })
  }
  loadWeights()
  {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId)
    {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId)
      {
        this.getWeights();
      }
    }

  }
  selectedField(event) {
    this.addEditWeighObj.fieldName = event.fieldName;
    this.addEditWeighObj.fieldId = event._id;
    // this.addEditWeighObj.name = event.fieldName;
  }
  clearField()
  {
    this.addEditWeighObj.fieldName = '';
    this.addEditWeighObj.fieldId = '';
    this.addEditWeighObj.name = '';
  }
  prepereWeights(){
    let weightArr = [];
    if (this.weights){
      this.weights.forEach((element, i) => {
        const name = (element.fieldName || '').replace(/[^\w]/gi, '')
        const obj = {
          fieldName: element.fieldName,
          fieldDataType: element.fieldDataType,
          fieldId: element._id,
          sliderObj: new RangeSlider(0, 10, 1,element.weight.value, name + i,'',true)
        }
        weightArr.push(obj);
      });
      this.weightsList = [...weightArr];
    }
    this.loadingContent = false;
  }
  restore(dialogRef?)
  {
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
    };
    this.service.invoke('put.restoreWeights', quaryparms).subscribe(res =>
    {
      this.notificationService.notify('Updated Successfully', 'success');
      this.getWeights();
      if (dialogRef && dialogRef.close)
      {
        dialogRef.close();
      }
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to reset weights');
    });
  }
  restoreWeights(event)
  {
    if (event)
    {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Restore weights',
        text: 'Are you sure you want to restore weights?',
        newTitle: 'Are you sure you want to continue ?',
        body: 'Reset to default will set the system-defined fields back to their default values',
        buttons: [{ key: 'yes', label: 'Continue' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result =>
      {
        if (result === 'yes')
        {
          this.restore(dialogRef)
        } else if (result === 'no')
        {
          dialogRef.close();
        }
      })
  }
  getWeights(){
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      sortField:this.selectedSort?this.selectedSort:'filedName',
      orderType:this.checksort?this.checksort:'asc',
      // pageNo: 1,
      // pageNo: this.pageNumber, 
      // noOfRecords: 10,
      // noOfRecords: this.numberofweigths,
      isSelected : true
    };
    this.service.invoke('get.weightsList', quaryparms).subscribe(res =>
    {
      this.weights = res.data || {};
      this.prepereWeights();
      if (!this.inlineManual.checkVisibility('WEIGHTS')) {
        this.inlineManual.openHelp('WEIGHTS')
        this.inlineManual.visited('WEIGHTS')
      }
    }, errRes =>
    {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get weights');
    });
  }
  valueEvent(val, weight,index){
    if (!this.sliderOpen)
    {
      this.disableCancle = false;
    }
    if(weight.sliderObj.default != val){
      weight.sliderObj.default = val;
      this.sliderChange(weight,index);
    }
  }
  editWeight(weight, index)
  {
    this.currentEditIndex = index;
    this.currentEditDesc = weight.desc;
    // const editWeight = JSON.parse(JSON.stringify(weight));
    // editWeight.sliderObj.id = 'editSlider';
    // this.addEditWeighObj = editWeight;
    // this.openAddEditWeight();
  }
  getAllFields(){
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      isSearchable: true, 
      isSelected : false
    };
      // pageNo: 1,
      // pageNo: this.pageNumber,
      // noOfRecords: 10,
      // noOfRecords: this.numberofweigths,
    this.service.invoke('get.fieldsList', quaryparms).subscribe(res =>
      {
      this.fieldsList = res.data || [];
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  openAddEditWeight(){
    this.searchModel = {};
    this.sliderOpen = true;
    this.submitted = false;
    this.getAllFields();
    this.addDditWeightPopRef = this.addDditWeightPop.open();
    setTimeout(() =>{
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  openAddNewWeight()
  {
    this.addEditWeighObj = {
      filedName: '',
      fieldId:'',
      sliderObj: new RangeSlider(0, 10, 1, 2, 'editSlider','',true)
    };
    this.openAddEditWeight();
  }
  closeAddEditWeight()
  {
    if (this.addDditWeightPopRef && this.addDditWeightPopRef.close)
    {
      this.addDditWeightPopRef.close();
      this.submitted = false;
      this.sliderOpen = false;
      this.currentEditIndex = -1;
      this.addEditWeighObj = null;
    }
  }
  setDataToActual()
  {
    this.prepereWeights();
    this.disableCancle = true;
    this.currentEditIndex = -1
  }
  errorToaster(errRes, message)
  {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg)
    {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message)
    {
      this.notificationService.notify(message, 'error');
    } else
    {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  validateWeights() {
    if (this.addEditWeighObj.fieldName && this.addEditWeighObj.fieldName.length)
    {
      this.submitted = false;
      return true;
    }
    else
    {
      return false;
    }
  }
  addEditWeight(addEditWeighObj) {
    this.submitted = true;
    if (this.validateWeights())
    {
      this.addOrUpddate(addEditWeighObj, null, 'add');
    }
    else
    {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }
  getWeightsPayload(weight) {
    const tempweights = [];
      const obj = {
        fieldName: weight.fieldName,
        fieldDataType: weight.fieldDataType ,
        fieldId: weight._id,
        value: weight.sliderObj.default,
      }
      this
      tempweights.push(obj);
    return tempweights
  }
  sliderChange(weight,index?){
   if(this.sliderOpen){
    return
   }
   else {
    this.addOrUpddate(weight,null,'edit',index);
   }
  }
  addOrUpddate(weight, dialogRef?, type?,index?) {
    this.isAddLoading = true;
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      fieldId:weight.fieldId
    };
    const payload  = {
        weight:{
          value:weight.sliderObj.default
        }
      }
    this.service.invoke('put.updateWeight', quaryparms,payload).subscribe(res =>
    {
      if(res){
        if (type == 'add')  {
          this.notificationService.notify('Added Successfully', 'success');
          this.getWeights();
        }
      else if (type == 'edit') {
          this.weightsList[index] = this.getWeightsPayload(weight);
          this.notificationService.notify(' Updated Successfully', 'success');
          this.appSelectionService.updateTourConfig(this.componentType);
       }
      }
      if (dialogRef && dialogRef.close) {
        dialogRef.close();
      }
    else  {
          setTimeout(() => { this.isAddLoading = false; }, 200);
          this.closeAddEditWeight();
     }
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to add Weight');
    });
  }
  deleteWeightPopUp(record, event, index)
  {
    if (event)
    {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Rankable Field',
        text: 'Are you sure you want to delete selected rankable field?',
        newTitle:'Are you sure you want to Remove ?',
        body: '"'+'<b>'+record.fieldName+'</b>'+'"'+' searchable field will be removed',
        buttons: [{ key: 'yes', label: 'Remove', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result =>
      {
        if (result === 'yes')
        {
         this.deleteWeight(record,index);
          dialogRef.close();
        } else if (result === 'no')
        {
          dialogRef.close();
        }
      })
  }
  deleteWeight(weight,index){
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      fieldId:weight.fieldId
    };
    this.service.invoke('delete.Weight', quaryparms).subscribe(res => {
     if(res){
         this.weightsList.splice(index, 1);
         this.notificationService.notify('Deleted Successfully', 'success');
        }
      }, errRes => {
         this.loadingContent = false;
         this.errorToaster(errRes, 'Failed to Delete weight');
      });
  }
  modifyFieldWarningMsg(warningMessage)
  {
    let index = warningMessage.indexOf("changed");
    if (index > -1)
    {
      return true;
    } else
    {
      return false;
    }
  }
  clearSearchtext()
  {
    if ($('#searchBoxIdW') && $('#searchBoxIdW').length)
    {
      $('#searchBoxIdW')[0].value = "";
      this.search_FieldName = '';
    }
  }
  sortByApi(sort){
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    let naviagtionArrow ='';
    //var checkSortValue= 1;
    if(this.isAsc){
      naviagtionArrow= 'up';
      this.checksort='asc'
    }
    else{
      naviagtionArrow ='down';
      //checkSortValue = -1;
      this.checksort='desc'
    }
    this.getWeights();
  }
getSortIconVisibility(sortingField: string, type: string,component: string) {
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
          case "weight.value": {
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
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }
  ngOnDestroy()
  {
    this.subscription ? this.subscription.unsubscribe() : false;
  }
}
