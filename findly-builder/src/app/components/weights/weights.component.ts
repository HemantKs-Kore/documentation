import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RangeSlider } from '../../helpers/models/range-slider.model';
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
  fields: any = [];
  weightsList = [];
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
        this.getListOfweigts();
      }
    }

  }
  selectedField(event)
  {
    this.addEditWeighObj.fieldName = event.fieldName;
    this.addEditWeighObj.fieldId = event._id;
    this.addEditWeighObj.name = event.fieldName;
  }
  clearField()
  {
    this.addEditWeighObj.fieldName = '';
    this.addEditWeighObj.fieldId = '';
    this.addEditWeighObj.name = '';
  }
  getFieldAutoComplete(query)
  {
    if (/^\d+$/.test(this.searchField))
    {
      query = parseInt(query, 10);
    }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res =>
    {
      this.fields = res || [];
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to get fields');
    })
  }
  prepereWeights(){
    this.weightsList = []
    if (this.weights){
      this.weights.forEach((element, i) => {
        const name = (element.fieldName || '').replace(/[^\w]/gi, '')
        const obj = {
          fieldName: element.fieldName,
          fieldDataType: element.fieldDataType,
          fieldId: element._id,
          sliderObj: new RangeSlider(0, 10, 1,element.weight.value, name + i,'',true)
        }
        this.weightsList.push(obj);
      });
    }
    this.loadingContent = false;
  }
  restore(dialogRef?)
  {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    this.service.invoke('post.restoreWeights', quaryparms).subscribe(res =>
    {
      this.notificationService.notify('Updated Successfully', 'success');
      this.pipeline = res.pipeline || {};
      this.prepereWeights();
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
      panelClass: 'delete-popup-weights',
      data: {
        title: 'Restore weights',
        text: 'Are you sure you want to restore weights?',
        newTitle: 'Resetting to default will reset the values of System defined fields to default values.',
        body: 'Are you sure you want to continue ?',
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
      pageNo: 1,
      // pageNo: this.pageNumber,
      noOfRecords: 10,
      // noOfRecords: this.numberofweigths,
      isSelected : true
    };
    this.service.invoke('get.weightsList', quaryparms).subscribe(res =>
    {
      this.weights = res.data || {};
      this.prepereWeights();
      if (!this.inlineManual.checkVisibility('WEIGHTS'))
      {
        this.inlineManual.openHelp('WEIGHTS')
        this.inlineManual.visited('WEIGHTS')
      }
    }, errRes =>
    {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get weights');
    });
  }
  valueEvent(val, weight)
  {
    if (!this.sliderOpen)
    {
      this.disableCancle = false;
    }
    if(weight.sliderObj.default != val){
      weight.sliderObj.default = val;
      this.sliderChange(weight);
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
  getAllFields()
  {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
    },
    payload ={
      "sort": {
          "fieldName": 1,
      } 
    }
    // let serviceId = 'get.allFieldsData';
    let serviceId = 'post.allField';
    this.service.invoke(serviceId, quaryparms,payload).subscribe(res =>
    {
      this.fields = res.fields || [];
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  openAddEditWeight()
  {
    this.searchModel = {};
    this.sliderOpen = true;
    this.submitted = false;
    this.getAllFields();
    this.addDditWeightPopRef = this.addDditWeightPop.open();
    setTimeout(() =>
    {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  openAddNewWeight()
  {
    this.addEditWeighObj = {
      name: '',
      desc: '',
      isField: true,
      sliderObj: new RangeSlider(0, 10, 1, 2, 'editSlider','',true)
    };
    // this. getFieldAutoComplete(''); 
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

  validateWeights()
  {
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

  addEditWeight()
  {
    this.submitted = true;
    if (this.validateWeights())
    {
      const weights = JSON.parse(JSON.stringify(this.weights));
      if (this.currentEditIndex > -1)
      {
        weights[this.currentEditIndex] = this.addEditWeighObj;
      } else
      {
        weights.push(this.addEditWeighObj);
      }
      this.addOrUpddate(weights, null, 'add');
    }
    else
    {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }
  getWeightsPayload(weight)
  {
    const tempweights = [];
      const obj = {
        fieldName: weight.fieldName,
        fieldDataType: weight.fieldDataType ,
        fieldId: weight._id,
        value: weight.sliderObj.default,
      }
      tempweights.push(obj);
    return tempweights
  }
  sliderChange(weight){
   if(this.sliderOpen){
    return
   }
   else {
    // const weights = JSON.parse(JSON.stringify(this.weights));
    this.addOrUpddate(weight,null,'edit');
   }
  }
  addOrUpddate(weight, dialogRef?, type?)
  {
    // weights = weights || this.weightsList;
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      fieldId:weight.fieldId
    };
    if(type != 'delete'){
      this.payloadObj  = {
        weight:{
          value:weight.sliderObj.default
        }
      }
    }
    else {
      this.payloadObj = { }  
    }
    const payload = this.payloadObj
    this.weightsList.push(this.getWeightsPayload(weight));
    this.service.invoke('put.updateWeight', quaryparms,payload).subscribe(res =>
    {
      this.prepereWeights();
      if (type == 'add')
      {
        this.notificationService.notify('Added Successfully', 'success');
      // this.mixpanel.postEvent('Save Weights',{});
      }
      else if (type == 'edit')
      {
        this.notificationService.notify(' Updated Successfully', 'success');
        this.appSelectionService.updateTourConfig(this.componentType);
      }
      else if (type == 'delete')
      {
        this.notificationService.notify(' Deleted Successfully', 'success')
      }
      if (dialogRef && dialogRef.close)
      {
        dialogRef.close();
      } else
      {
        this.closeAddEditWeight();
      }
    }, errRes =>
    {
      this.errorToaster(errRes, 'Failed to add Weight');
    });
  }
  deleteWeight(record, event, index)
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
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected Searchable Field will be deleted',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result =>
      {
        if (result === 'yes')
        {
          this.weightsList.splice(index, 1);
          this.addOrUpddate(record, dialogRef, 'delete');
          dialogRef.close();
        } else if (result === 'no')
        {
          dialogRef.close();
          // console.log('deleted')
        }
      })
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
  clearcontentSrcW()
  {
    if ($('#searchBoxIdW') && $('#searchBoxIdW').length)
    {
      $('#searchBoxIdW')[0].value = "";
      this.search_FieldName = '';
    }
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }
  //getting List of Weigths 
  getListOfweigts(){
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      pageNo: 1,
      // pageNo: this.pageNumber,
      noOfRecords: 10,
      // noOfRecords: this.numberofweigths,
      isSelected : true
    };
    this.service.invoke('get.weightsList', quaryparms).subscribe(res =>
      {
        this.weights = res.data || {}; // list of the weights from the responce
        // this.loadingContent = false;
        this.prepereWeights();
      }, errRes =>
      {
        this.loadingContent = false;
        this.errorToaster(errRes, 'Failed to get weights');
      });
  }
  //Slider change method 
  updatedSliderValue(weight){
    if(this.sliderOpen){
     return
    }
    else {
     this.addUpdateWeight(weight);
    }
   }
  // update weight 
  addUpdateWeight(weight){
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      fieldId:weight.fieldId
    };
    this.service.invoke('put.updateWeight', quaryparms).subscribe(res =>
      {
        this.notificationService.notify('Weight Updated Successfully', 'success');
      }, errRes =>
      {
        this.loadingContent = false;
        this.errorToaster(errRes, 'Failed to update weight');
      }); 
  }

// deletes added field weight from only List of weights
  deleteWeightFromList(weight){
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      fieldId:weight.fieldId
    };
    this.service.invoke('delete.weight', quaryparms).subscribe(res =>
      {
        this.notificationService.notify('Weight Deleted Successfully', 'success');
        this.prepereWeights()
      }, errRes =>
      {
        this.loadingContent = false;
        this.errorToaster(errRes, 'Failed To Delete Weight');
      });
  }

  ngOnDestroy()
  {
    this.subscription ? this.subscription.unsubscribe() : false;
  }
}
