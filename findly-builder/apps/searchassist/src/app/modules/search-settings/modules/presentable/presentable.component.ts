import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { StoreService } from '@kore.apps/store/store.service';
@Component({
  selector: 'app-presentable',
  templateUrl: './presentable.component.html',
  styleUrls: ['./presentable.component.scss'],
})
export class PresentableComponent implements OnInit, OnDestroy {
  selectedApp;
  indexPipelineId;
  streamId: any;
  queryPipelineId: any;
  sub: Subscription;
  selectedSort = 'asc';
  checksort = 'fieldName';
  selectionflag = true;
  isSearchable = true;
  page = 0;
  max_pageno: any;
  limit = 10;
  searchKey: any;
  searchValue = '';
  allpresentableFields: any = [];
  presentable = [];
  nonPresentable = [];
  isLoading = false;
  loader: any = false;
  method_type = '';
  searchIndexId;
  @Input() presentabledata;
  @Input() selectedcomponent;
  isaddLoading = false;
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.initAppIds();
    this.getAllpresentableFields();
  }

  initAppIds() {
    const idsSub = this.storeService.ids$
      .pipe(
        take(1),
        tap(({ streamId, searchIndexId, indexPipelineId, queryPipelineId }) => {
          this.streamId = streamId;
          this.searchIndexId = searchIndexId;
          this.indexPipelineId = indexPipelineId;
          this.queryPipelineId = queryPipelineId;
        })
      )
      .subscribe();

    this.sub?.add(idsSub);
  }

  displayFields(isSelected, data) {
    this.isLoading = false;
    this.allpresentableFields = data;
    //this.max_pageno=Number(Math.ceil(res.totalCount/10))-1;
    if (isSelected) {
      this.presentable = [];
      this.allpresentableFields.forEach((element) => {
        // if(element.presentable.value){
        this.presentable.push(element);
        // }
      });
    } else {
      this.nonPresentable = [];
      this.allpresentableFields.forEach((element) => {
        // if(!element.presentable.value){
        this.nonPresentable.push(element);
        // }
      });
    }
  }

  /**to fetch the data to table and add pop-up passing true and false*/
  getAllpresentableFields() {
    const res = this.route.snapshot.data.presentables;
    if (res.error) {
      this.displayError();
    } else {
      this.displayFields(true, res.data);
    }
  }
  /** get presentable fields api call with false value to get data for add pop-up*/
  getAddpopuppresentableField(event) {
    if (!event) {
      this.getPresentableFields(false);
    }
  }
  /** Emited Value for Operation (Add/Delete)  */
  getRecord(recordData: any) {
    const record = recordData.record;
    if (record?.fieldIds?.length > 0 || record?.length > 0) {
      const deleteData = {
        url: 'delete.presentableFields',
        quaryparms: {
          streamId: this.streamId,
          indexPipelineId: this.indexPipelineId,
          queryPipelineId: this.queryPipelineId,
          fieldId: record[0],
        },
      };
      const addData = {
        url: 'add.presentableFields',
        quaryparms: {
          streamId: this.streamId,
          indexPipelineId: this.indexPipelineId,
          queryPipelineId: this.queryPipelineId,
        },
        payload: record,
      };
      recordData.type == 'delete'
        ? this.removeRecord(deleteData)
        : this.addRecords(addData);
    } else {
      this.notificationService.notify(
        'Please select the fields to proceed',
        'error'
      );
    }
  }
  /**presentable sort */
  presentableSort(sortobj) {
    this.method_type = 'search';
    if (sortobj.componenttype == 'datatable') {
      this.getPresentableFields(true, sortobj);
    } else {
      this.getPresentableFields(false, sortobj);
    }
  }
  /** remove fromPresentable */
  removeRecord(deleteData) {
    const quaryparms: any = deleteData.quaryparms;
    this.service.invoke(deleteData.url, quaryparms).subscribe(
      (res) => {
        this.getPresentableFields(true);
        this.notificationService.notify('Field removed succesfully', 'success');
      },
      (errRes) => {
        this.notificationService.notify('Failed to remove Fields', 'error');
      }
    );
  }
  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(null);
  }
  /** Add to Prescentable */
  addRecords(addData) {
    this.isaddLoading = true;
    this.service
      .invoke(addData.url, addData.quaryparms, addData.payload)
      .subscribe(
        (res) => {
          this.isaddLoading = false;
          this.getPresentableFields(true);
          this.notificationService.notify('Field added succesfully', 'success');
        },
        (errRes) => {
          this.notificationService.notify('Failed to add Fields', 'error');
        }
      );
    //
  }
  //**Presentable search function */
  presentableSearch(obj) {
    this.searchValue = obj.searchvalue;
    this.method_type = 'search';
    if (obj.componenttype == 'datatable') {
      this.getPresentableFields(true);
    } else {
      this.getPresentableFields(false);
    }
  }
  //**presentable get page */
  presentablepage(pageinfo) {
    this.page = pageinfo;
    this.getPresentableFields(true);
  }

  displayError() {
    this.notificationService.notify(
      'Failed to get presentable fields',
      'error'
    );
  }

  //** get api for retrieving the presentable Fields */
  getPresentableFields(selected?, sortobj?) {
    const quaryparms: any = {
      isSelected: selected,
      sortField:
        sortobj?.fieldname?.length > 0 ? sortobj.fieldname : 'fieldName',
      orderType: sortobj?.type?.length > 0 ? sortobj.type : 'asc', //desc,
      indexPipelineId: this.indexPipelineId,
      streamId: this.streamId,
      queryPipelineId: this.queryPipelineId,
      // isSearchable:this.isSearchable,
      // page:this.page?this.page:0,
      // limit:this.limit,
      searchKey: this.searchValue ? this.searchValue : '',
    };
    if (this.method_type !== 'search') {
      this.isLoading = true;
    }
    this.service.invoke('get.presentableFields', quaryparms).subscribe(
      (res) => {
        this.displayFields(selected, res.data);
      },
      (errRes) => {
        this.displayError();
      }
    );
  }
  //**unsubcribing the query subsciption */
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
