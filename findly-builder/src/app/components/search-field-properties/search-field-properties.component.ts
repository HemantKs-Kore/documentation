import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'underscore';
import { of, interval, Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { RangeSlider } from '../../helpers/models/range-slider.model';

declare const $: any;

@Component({
  selector: 'app-search-field-properties',
  templateUrl: './search-field-properties.component.html',
  styleUrls: ['./search-field-properties.component.scss']
})
export class SearchFieldPropertiesComponent implements OnInit {
  selectedApp;
  serachIndexId;
  indexPipelineId;
  streamId: any;
  querySubscription : Subscription;
  queryPipelineId: any;
  searchFieldProperties : any = [];
  totalRecord: number = 0;
  skip = 0;
  limit = 10;
  enableIndex = - 1;
  defaultIndex = -1;
  propeties : any = {
    highlight:false,
    presentable : false,
    spellCorrect : false,
    weight : 0
  };
  selectedProperties : any = {}
  showSearch = false;
  searchFields: any = '';
  activeClose = false;
  searchFocusIn = false;
  selectedSort = 'fieldName';
  isAsc = true;
  checksort='asc'
  searchImgSrc: any = 'assets/icons/search_gray.svg';

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    public inlineManual : InlineManualService,
    private router: Router,
    public mixpanel: MixpanelServiceService
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    // if (this.workflowService.selectedApp()?.configuredBots[0]) {
    //   this.streamId = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
    // }
    // else if (this.workflowService.selectedApp()?.publishedBots && this.workflowService.selectedApp()?.publishedBots[0]) {
    //   this.streamId = this.workflowService.selectedApp()?.publishedBots[0]?._id ?? null
    // }
    // else {
    //   this.streamId = null;
    // }
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';

    this.fetchPropeties();
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.fetchPropeties()      
    })
    
    
  }

  fetchPropeties(search?,type?,skip?){
    if(this.searchFields || this.searchFields.length>0){
      this.skip=0;
    }
    const quaryparms: any = {
      sortBy: this.selectedSort,
      search : this.searchFields || "",
      page:this.skip/10,
      limit:this.limit,
      spellCorrect:this.selectedProperties.spellCorrect || true,
      presentable: this.selectedProperties.presentable || true,
      highlight: this.selectedProperties.highlight || true,
      orderBy: this.checksort, //desc,
      indexPipelineId:this.indexPipelineId,
      streamId:this.selectedApp._id,
      queryPipelineId:this.queryPipelineId
    };
    this.service.invoke('get.allsearchFields', quaryparms).subscribe(res => {
      this.searchFieldProperties = res.data;
      this.searchFieldProperties.forEach((element ,index)=> {
        const name = element.fieldName.replaceAll('_', '')
        // let sliderObj = {
        //   slider: new RangeSlider(0, 10, 1, element.value, name + index)
        // };
        element.properties['slider'] = new RangeSlider(0, 10, 1, element.properties.weight, name + index,'',false)
      });
      this.totalRecord = res.totalCount
      console.log(this.searchFieldProperties);
    }, errRes => {
      this.notificationService.notify(errRes,'failed to get search field propeties');
    });

  }
  paginate(event) {
    this.skip= event.skip
    this.fetchPropeties()
     
    // this.getFileds(event.skip, this.searchFields)

  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchFields = '';
      this.activeClose = false;
      this.fetchPropeties(this.searchFields,this.skip)
    }
    this.showSearch = !this.showSearch;
  }

  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  editSearchFiledProperties(properties?,index?){
    const name = this.searchFieldProperties[index].fieldName.replaceAll('_', '')
    this.searchFieldProperties[index].properties['slider'] = new RangeSlider(0, 10, 1, properties.weight, name + index,'',true)
   
    this.enableIndex = index;
    this.selectedProperties =properties;
  }
  cancel(properties?,index?){
    const name = this.searchFieldProperties[index].fieldName.replaceAll('_', '')
    this.searchFieldProperties[index].properties['slider'] = new RangeSlider(0, 10, 1, properties.weight, name + index,'',false)
   
  }
  saveAPI(selectedProperties, fieldId,i?){
    const quaryparms: any = {
      indexPipelineId:this.indexPipelineId,
      streamId:this.selectedApp._id,
      queryPipelineId:this.queryPipelineId,
      fieldId:fieldId
    };
    const payload = selectedProperties;
    this.service.invoke('put.updatesearchFieldsProperties',quaryparms,payload).subscribe(res => {
      //this.propeties = res;
      this.enableIndex = this.defaultIndex;
      this.fetchPropeties();      
      console.log(res);
      this.notificationService.notify('Updated Successfully', 'success');
    }, errRes => {
      this.notificationService.notify('Updated Successfully', 'error');
    });    

  
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
      case "weight": {
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
      case "presentable": {
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
      case "highlight": {
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
      case "spellCorrect": {
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

  sortByApi(sort){
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var naviagtionArrow ='';
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
    //this.fieldsFilter(null,null,null,null,sort,checkSortValue,naviagtionArrow)
    this.fetchPropeties();
  }
    
  valueEvent(event , searchProperties){
    searchProperties.properties.slider.default = event;
  }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }
}
