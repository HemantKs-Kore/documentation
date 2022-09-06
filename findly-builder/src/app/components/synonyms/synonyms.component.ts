import { Component, OnDestroy, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SynonymFilterPipe } from './synonym-filter'
import * as _ from 'underscore';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { Observable, of, Subscriber, Subscription } from 'rxjs';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { TmplAstRecursiveVisitor } from '@angular/compiler';
declare const $: any;

@Component({
  selector: 'app-synonyms',
  templateUrl: './synonyms.component.html',
  styleUrls: ['./synonyms.component.scss']
})
export class SynonymsComponent implements OnInit, OnDestroy {
  selectedApp: any = {};
  synonymSearch: any = '';
  showSearch = false;
  synonyms: any = [];
  serachIndexId
  loadingContent = true;
  skip=0;
  filteroneWaySynonym: boolean;
  filterSynonym: boolean;
  haveRecord = false;
  currentEditIndex: any = -1;
  pipeline;
  showFlag;
  totalRecord: number = 0;
  synonymData: any[] = [];
  synonymDataBack: any[] = [];
  synonymArr :any=[];
  synonymTypeArr=[];
  synonymTypeArr$: Observable<any[]>;
  synonymGet: any = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  queryPipelineId;
  // showSynonym:boolean
  indexPipelineId;
  isAsc = true;
  selectedSort = '';
  newSynonymObj: any = {
    type: 'synonym',
    addNew: false,
    values: []
  }
  activeClose = false;
  selectedFilter: any;
  createFromScratch: any;
  synonymObj;
  filterSystem: any = {
    'typefilter': 'all',
  }
  sortedObject = {
    'type': 'fieldName',
    'position':'up',
    "value": 1,
  }
  filterObject={
    'type': '',
    'header':''
  }
  // synonym;
  // showoneWaySynonym:boolean;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  synArr: any[] = [];
  synArrTemp: any[] = [];
  subscription: Subscription;
  componentType: string = 'configure';
  submitted: boolean = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private appSelectionService: AppSelectionService,
    public inlineManual: InlineManualService) {
    this.synonymObj = new SynonymClass();
  }


  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.loadSynonyms();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
      this.loadSynonyms();
    })
  }
  loadImageText: boolean = false;
  loadingContent1: boolean
  imageLoad() {
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
    if (!this.inlineManual.checkVisibility('SYNONYMS')) {
      this.inlineManual.openHelp('SYNONYMS')
      this.inlineManual.visited('SYNONYMS')
    }
  }
  loadSynonyms() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId) {
        this.getDyanmicFilterData();
        // this.getSynonymsApi();
        this.getSynonymOnInit()
        // this.getSynonyms();


      }

    }
  }
  prepareSynonyms() {
    if (this.pipeline.stages && this.pipeline.stages.length) {
      this.pipeline.stages.forEach(stage => {
        if (stage && stage.type === 'synonyms') {
          this.synonymData = JSON.parse(JSON.stringify(stage.synonyms || []));
          console.log(this.synonymData, 'SYNONYMS DATA')
          // this.showSynonym=true
        }
      });
    }
    this.getDyanmicFilterData()
  }
  getSynonyms() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
      this.pipeline = res.pipeline || {};
      this.loadingContent = false;
      this.prepareSynonyms();
      if (res.length > 0) {
        this.loadingContent = false;
        this.loadingContent1 = true;
      }
      else {
        this.loadingContent1 = true;
        // if(!this.inlineManual.checkVisibility('SYNONYMS')){
        //   this.inlineManual.openHelp('SYNONYMS')
        //   this.inlineManual.visited('SYNONYMS')
        // }
      }

      this.pipeline.stages[3].synonyms.forEach(element => {
        if (element.type === 'synonym') {
          this.filterSynonym = true;
        }
        else if (element.type === 'oneWaySynonym') {
          this.filteroneWaySynonym = true;
        }

      });
    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get stop words');
    });
  }
  getSynonymOnInit(){
    this.getSynonymsApi(null,null,null,null,null,null,null,null,'initial')
  }
  getSynonymsApi(searchValue?,searchSource?,source?,headerOption?,sortHeaderOption?,sortValue?,navigate?,request?,initial?){
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      offset: this.skip || 0 ,
      limit:10

    };
    let payload:any = {}
    if(!sortHeaderOption && !headerOption){
       payload ={
        "sort": {
          "type": -1
        }
      }
    }
    else{
      payload = request
    }

    if(this.synonymSearch){
      payload.search = this.synonymSearch
    }
    this.service.invoke('get.synonyms', quaryparms,payload).subscribe(res => {
      this.synonymData = res.synonyms || [];
      if(initial){
        this.synonymArr = res.synonyms;
      }
      console.log(this.synonymData, 'SYNONYMS')
      this.loadingContent = false;
      this.totalRecord = res.totalCount || 0;
      if (res.synonyms.length > 0) {
        this.loadingContent = false;
        this.loadingContent1 = true;
      }
      else {
        this.loadingContent1 = true;
      }
      this.getDyanmicFilterData();

    }, errRes => {
      this.loadingContent = false;
      this.errorToaster(errRes, 'Failed to get stop words');
    });
  }
  getDyanmicFilterData(search?) {
    // this.fieldDataTypeArr = [];
    // this.isMultiValuedArr = [];
    // this.isRequiredArr = [];
    // this.isStoredArr = [];
    // this.isIndexedArr = [];
    const quaryparms: any = {
      searchIndexId: this.serachIndexId
    };
    const request :any = {
      moduleName: "synonyms",
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.queryPipelineId,
    };
    // request.type = this.filterSystem.typefilter;
    request.search= this.synonymSearch;
    if (request.type == 'all') {
     delete  request.type;
    }
    if (this.synonymSearch === '') {
      delete request.search;
     }
    this.service.invoke('post.filters', quaryparms, request).subscribe(res => {
      console.log(res, 'Filters')
      this.synonymTypeArr$ = of([...res.type]);
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get filters');
    });

  }

  filterTable(source, headerOption) {
    switch (headerOption) {
      case 'type': { this.filterSystem.typefilter = source; break; };
    };
    this.filterObject = {
      type: source,
      header: headerOption
    }

    this.synonymFilter(null,null,source, headerOption);
  }
  synonymFilter(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?){
    // fieldsFilter(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?)
    // this.loadingContent = true;
    if(sortValue){
      this.sortedObject = {
        type : sortHeaderOption,
        value : sortValue,
        position: navigate
      }
    }

    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      offset: 0,
      limit: 10
    };
    let request:any={}
    if(!sortValue){
      request = {
        "sort":{
          'type':1
        }
    }
    }
    else if(sortValue){
      const sort :any ={}
      request= {
        sort
      }
    }
    else {
    request={}
    }

    request.type = this.filterSystem.typefilter;
    request.search= this.synonymSearch;
    if (request.type == 'all') {
     delete  request.type;
    }
    if (this.synonymSearch === '') {
     delete request.search;
    }
    if(sortValue){
      this.getSortIconVisibility(sortHeaderOption,navigate);
       //Sort start
       if(sortHeaderOption === 'name' ){
        request.sort.name = sortValue
      }
      if (sortHeaderOption === 'type') {
        request.sort.type = sortValue
      }
    // end
    }
    this.getSynonymsApi(searchValue,searchSource, source,headerOption, sortHeaderOption,sortValue,navigate,request);
  }

  sortByApi(sort){
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var naviagtionArrow ='';
    var checkSortValue= 1;
    if(this.isAsc){
      naviagtionArrow= 'up';
      checkSortValue = 1;
    }
    else{
      naviagtionArrow ='down';
      checkSortValue = -1;
    }
    this.synonymFilter(null,null,null,null,sort,checkSortValue,naviagtionArrow)
  }
  paginate(event) {
    this.skip= event.skip
     this.synonymFilter(this.synonymSearch,'search',this.filterObject.type,this.filterObject.header,this.sortedObject.type,this.sortedObject.value,this.sortedObject.position)
    // this.getFileds(event.skip, this.searchFields)

  }
  selectFilter(type) {
    this.selectedFilter = type;
  }
  validateSynonyms() {
    if (!this.newSynonymObj || (this.newSynonymObj.values && !this.newSynonymObj.values.length)) {
      return false;
    }
    else if ((this.newSynonymObj.type === 'oneWaySynonym') && (!this.newSynonymObj.keyword)) {
      return false;
    }
    else {
      return true;
    }
  }
  addNewSynonyms() {
    this.submitted = true;
    if (this.validateSynonyms()) {
      const obj: any = {
        type: this.newSynonymObj.type,
        values: this.newSynonymObj.values
      }
      if (this.newSynonymObj.type === 'oneWaySynonym') {
        if (!(this.newSynonymObj.values && this.newSynonymObj.values.length)) {
          this.notificationService.notify('Synonyms cannot be empty', 'error');
          return;
        }
        if (!this.newSynonymObj.keyword) {
          this.notificationService.notify('Please enter keyword', 'error');
          return;
        } else {
          obj.keyword = this.newSynonymObj.keyword;
        }
      }
      if (this.newSynonymObj.type === 'oneWaySynonym') {
        this.filteroneWaySynonym = true;

      }
      else if (this.newSynonymObj.type === 'synonym') {
        this.filterSynonym = true;
      }
      this.synonymData.push(obj);
      this.addOrUpddate(this.synonymData);
    }
    else {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }
  synonymChanged() {
    this.newSynonymObj.values = [];
    this.synonymObj.values = [];
    this.newSynonymObj.keyword = [];
  }
  cancleAddEdit() {
    this.currentEditIndex = -1;
    this.newSynonymObj = {
      type: 'synonym',
      addNew: false,
      values: []
    }
    this.synonymObj = new SynonymClass();
    // this.prepareSynonyms();

  }
  addOrUpddate(synonymData, dialogRef?, showFlag?) {
    synonymData = synonymData || this.synonymData;
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    const payload: any = {
      pipeline: {
        synonyms: synonymData
      }
    }
    if (payload.pipeline.stages && payload.pipeline.stages.length) {
      payload.pipeline.stages.forEach(stage => {
        if (stage && stage.type === 'synonyms') {
          stage.synonyms = synonymData || [];
        }
      });
    }
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(res => {
      this.pipeline = res.pipeline || {};
      if (this.newSynonymObj.addNew && !showFlag) {
        this.notificationService.notify(' Added Successfully', 'success');
        this.appSelectionService.updateTourConfig(this.componentType);
      }
      else if (!showFlag) {
        this.notificationService.notify('Updated Successfully', 'success');
      }
      this.prepareSynonyms();
      this.cancleAddEdit();


      if (dialogRef && dialogRef.close) {
        dialogRef.close();
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to add Weight');
    });
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  editSynRecord(record, event, i) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    this.cancleAddEdit();
    this.currentEditIndex = i
  }
  updateSynonm(record, event, i) {
    if (record.type === 'oneWaySynonym') {
      if (!record.keyword) {
        this.notificationService.notify('Please enter keyword', 'error');
        return;
      }
    }
    if (!(record.values && record.values.length)) {
      this.notificationService.notify('Synonyms cannot be empty', 'error');
      return;
    }
    this.addOrUpddate(this.synonymData);
  }
  deleteSynonym(record, event, index) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected Synonym group will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const synonyms = JSON.parse(JSON.stringify(this.synonymArr));
          synonyms.splice(index, 1);
          if (this.showFlag = true) {
            this.addOrUpddate(synonyms, dialogRef, this.showFlag);
            this.notificationService.notify('Deleted Successfully', 'success')
          }
          this.filterSynonym = false;
          this.filteroneWaySynonym = false;
          synonyms.forEach(element => {
            if (element.type === 'oneWaySynonym') {
              this.filteroneWaySynonym = true;
            }
            if (element.type === 'synonym') {
              this.filterSynonym = true;
            }
          });
        } else if (result === 'no') {
          dialogRef.close();
          // console.log('deleted')
        }
      })


  }
  checkDuplicateTags(suggestion: string, alltTags): boolean {
    return alltTags.every((f) => f !== suggestion);
  }
  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.checkDuplicateTags((value || '').trim(), this.newSynonymObj.values)) {
        this.notificationService.notify('Duplicate tags are not allowed', 'warning');
        return;
      } else {
        this.newSynonymObj.values.push(value.trim());
      }
    }
    if (input) {
      input.value = '';
    }
  }
  enableAddNewSynonymBtn() {
    this.currentEditIndex = -1;
    this.submitted = false;
    if (!this.newSynonymObj.addNew) {
      this.newSynonymObj.type = 'synonym'
      this.newSynonymObj.addNew = true;
    }
  }
  cancleAddSynonyms() {
    this.submitted = false;
    this.newSynonymObj.type = 'synonym'
    this.newSynonymObj.addNew = false;
    this.synonymChanged()
  }
  addList(event: MatChipInputEvent, synonymId, i) {
    const input = event.input;
    const value = event.value;
    const synonyms = [...this.synonymData];
    if ((value || '').trim()) {
      if ((value || '').trim()) {
        if (!this.checkDuplicateTags((value || '').trim(), synonyms[i].values)) {
          this.notificationService.notify('Duplicate tags are not allowed', 'warning');
          return;
        } else {
          this.newSynonymObj.values.push(value.trim());
        }
      }
      synonyms[i].values.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }
  removeList(syn, synonymId, i) {
    const synonyms = [...this.synonymData];
    const index = synonyms[i].values.indexOf(syn);
    if (index >= 0) {
      synonyms[i].values.splice(index, 1);
    }
  }
  remove(syn) {
    const index = this.newSynonymObj.values.indexOf(syn);
    if (index >= 0) {
      this.newSynonymObj.values.splice(index, 1);
    }
  }
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "name": {
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
      case "type": {
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
    const data = this.synonymData.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'name': return this.compare(a.values[0], b.values[0], isAsc);
        case 'type': return this.compare(a.type, b.type, isAsc);

        default: return 0;
      }
    });
    this.synonymData = sortedData;
  }
  toggleSearch() {
    if (this.showSearch && this.synonymSearch) {
      this.synonymSearch = '';
    }
    this.showSearch = !this.showSearch
  };
  focusoutSearch() {
    if (this.activeClose) {
      this.synonymSearch = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : false;
  }
}
class SynonymClass {
  name: String
  values: Array<String>
}

