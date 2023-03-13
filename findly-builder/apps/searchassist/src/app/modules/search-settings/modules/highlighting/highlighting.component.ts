import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { KRModalComponent } from '../../../../shared/kr-modal/kr-modal.component';
import { Subscription } from 'rxjs';
import {
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from 'ngx-perfect-scrollbar';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { Store } from '@ngrx/store';
import { selectAppIds } from '@kore.apps/store/app.selectors';

@Component({
  selector: 'app-highlighting',
  templateUrl: './highlighting.component.html',
  styleUrls: ['./highlighting.component.scss'],
})
export class HighlightingComponent implements OnInit, OnDestroy {
  selectedApp;
  indexPipelineId;
  streamId: any;
  serachIndexId;
  queryPipelineId: any;
  sub: Subscription;
  synonymsHighlight;
  highlightenable;
  highlightdata: any = {};
  @Input() selectedcomponent;
  more_options = false;
  home_pre_tag;
  home_post_tag;
  pre_tag = '';
  post_tag = '';
  pre_tag_flag = false;
  post_tag_flag = false;
  selectedSort = 'asc';
  checksort = 'fieldName';
  selectionflag = true;
  isSpinner = false;
  //  isSearchable:boolean=true;
  page = 0;
  limit = 10;
  max_pageno: any;
  searchValue = '';
  allhighlightFields: any = [];
  highlight: any = [];
  nonhighlight: any = [];
  method_type = '';
  isLoading = false;
  isaddLoading = false;
  searchIndexId;
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  highlightAppearanceModalPopRef: any;

  @ViewChild('highlightAppearanceModalPop')
  highlightAppearanceModalPop: KRModalComponent;
  @ViewChild(PerfectScrollbarComponent)
  perfectScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef: PerfectScrollbarDirective;

  ngOnInit(): void {
    this.more_options = false;
    this.initAppIds();
    this.getAllHighlightFields();
    this.getQuerypipeline();
  }

  initAppIds() {
    const idsSub = this.store
      .select(selectAppIds)
      .subscribe(
        ({ streamId, searchIndexId, indexPipelineId, queryPipelineId }) => {
          this.streamId = streamId;
          this.searchIndexId = searchIndexId;
          this.indexPipelineId = indexPipelineId;
          this.queryPipelineId = queryPipelineId;
        }
      );
    this.sub?.add(idsSub);
  }

  //** get Query pipeline API call */
  getQuerypipeline() {
    this.highlightdata = this.route.snapshot.data.queryPipeline;
    this.home_pre_tag =
      this.highlightdata.settings.highlight.highlightAppearance.preTag;
    this.home_post_tag =
      this.highlightdata.settings.highlight.highlightAppearance.postTag;
    this.pre_tag =
      this.highlightdata.settings.highlight.highlightAppearance.preTag;
    this.post_tag =
      this.highlightdata.settings.highlight.highlightAppearance.postTag;

    // const quaryparms: any = {
    //   searchIndexID: this.searchIndexId,
    //   queryPipelineId: this.queryPipelineId,
    //   indexPipelineId: this.indexPipelineId,
    // };
    // this.service.invoke('get.queryPipeline', quaryparms).subscribe(
    //   (res) => {
    //     this.highlightdata = res;
    //     this.home_pre_tag=this.highlightdata.settings.highlight.highlightAppearance.preTag
    //     this.home_post_tag=this.highlightdata.settings.highlight.highlightAppearance.postTag
    //     this.pre_tag=this.highlightdata.settings.highlight.highlightAppearance.preTag;
    //     this.post_tag=this.highlightdata.settings.highlight.highlightAppearance.postTag;
    //   },
    //   (errRes) => {
    //     this.notificationService.notify(
    //       'failed to get querypipeline details',
    //       'error'
    //     );
    //   }
    // );
  }
  //** to get the data for the highlight table and add highlight pop-up sending true and false for get api */
  getAllHighlightFields() {
    const res = this.route.snapshot.data.highlighting;
    if (res.error) {
      this.displayError();
    } else {
      this.displayFields(true, res.data);
    }
  }
  /** get highlight fields api call with false value to get data for add pop-up*/
  getAddpopuphighlightField(event) {
    if (!event) {
      this.getHighlightFields(false);
    }
  }
  /**highlight sort for data table and pop-up */
  highlightSort(sortobj) {
    this.method_type = 'search';
    console.log(sortobj);
    if (sortobj.componenttype == 'datatable') {
      this.getHighlightFields(true, sortobj);
    } else {
      this.getHighlightFields(false, sortobj);
    }
  }
  //**highlight search function */
  highlightSearch(obj) {
    this.searchValue = obj.searchvalue;
    this.method_type = 'search';
    if (obj.componenttype == 'datatable') {
      this.getHighlightFields(true);
    } else {
      this.getHighlightFields(false);
    }
  }
  //**highlight get page */
  highlightPage(pageinfo) {
    this.page = pageinfo;
    this.getHighlightFields(true);
  }

  displayFields(isSelected, data) {
    this.isLoading = false;
    this.allhighlightFields = data;
    //this.max_pageno=Number(Math.ceil(res.totalCount/10))-1;
    if (isSelected) {
      this.highlight = [];
      this.allhighlightFields.forEach((element) => {
        // if(element.presentable.value){
        this.highlight.push(element);
        // }
      });
    } else {
      this.nonhighlight = [];
      this.allhighlightFields.forEach((element) => {
        // if(!element.presentable.value){
        this.nonhighlight.push(element);
        // }
      });
    }
  }

  displayError() {
    this.notificationService.notify('Failed to get highlight fields', 'error');
  }

  //** get api call to fetch highlight fields */
  getHighlightFields(isSelected?, sortobj?) {
    const quaryparms: any = {
      isSelected: isSelected,
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
    this.service.invoke('get.highlightFields', quaryparms).subscribe(
      (res) => {
        this.displayFields(isSelected, res.data);
      },
      (errRes) => {
        this.notificationService.notify(
          'Failed to get highlight fields',
          'error'
        );
      }
    );
  }

  //**Add highlight modal pop-up */
  openModalPopup() {
    this.highlightAppearanceModalPopRef =
      this.highlightAppearanceModalPop.open();
    setTimeout(() => {
      if (this.perfectScroll?.directiveRef) {
        this.perfectScroll.directiveRef.update();
        this.perfectScroll.directiveRef.scrollToTop();
      }
    }, 500);
  }

  //** close the add pop-up */
  closeModalPopup() {
    this.highlightAppearanceModalPopRef.close();
    this.pre_tag = this.home_pre_tag;
    this.post_tag = this.home_post_tag;
  }
  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(null);
  }
  //** open show more  container */
  openContainer() {
    this.more_options = true;
    this.perfectScroll?.directiveRef?.scrollTo(25, 50, 500);
  }

  //** close the  show more  container */
  closeContainer() {
    this.more_options = false;
    this.perfectScroll?.directiveRef?.scrollTo(25, 50, 500);
  }

  //**Validation Check function */
  tagValidation(pre_tag, post_tag) {}

  //** highlight appearance pre and post tag api call for binding pre and post tag*/
  addTags(pretag, posttag) {
    //validation logic
    if (!pretag?.length && !posttag?.length) {
      this.pre_tag_flag = true;
      this.post_tag_flag = true;
      this.notificationService.notify(
        'Please enter the required fields to proceed',
        'error'
      );
      return;
    } else if (!pretag?.length) {
      this.pre_tag_flag = true;
      this.post_tag_flag = false;
      this.notificationService.notify(
        'Please enter the required fields to proceed',
        'error'
      );
      return;
    } else if (!posttag?.length) {
      this.post_tag_flag = true;
      this.pre_tag_flag = false;
      this.notificationService.notify(
        'Please enter the required fields to proceed',
        'error'
      );
      return;
    } else {
      this.post_tag_flag = false;
      this.pre_tag_flag = false;
    }
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    const payload: any = {
      settings: {
        highlight: {
          highlightAppearance: {
            preTag: pretag,
            postTag: posttag,
          },
        },
      },
    };

    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        this.home_pre_tag =
          res?.settings?.highlight?.highlightAppearance?.preTag;
        this.home_post_tag =
          res.settings?.highlight?.highlightAppearance?.postTag;
        this.notificationService.notify('Tags updated successfully', 'success');

        if (this.highlightdata.highlightAppearance) {
          this.highlightdata.highlightAppearance.preTag =
            res?.settings?.highlight?.highlightAppearance?.preTag;
          this.highlightdata.highlightAppearance.postTag =
            res?.settings?.highlight?.highlightAppearance?.postTag;
        }
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
    this.highlightAppearanceModalPopRef.close();
  }

  /** Emited Value for Operation (Add/Delete)  */
  getRecord(recordData: any) {
    const record = recordData.record;
    if (record?.fieldIds?.length > 0 || record?.length > 0) {
      const deleteData = {
        url: 'delete.highlightFields',
        quaryparms: {
          streamId: this.streamId,
          indexPipelineId: this.indexPipelineId,
          queryPipelineId: this.queryPipelineId,
          fieldId: record[0],
        },
      };
      const addData = {
        url: 'add.highlightFields',
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
  /** remove from highlight */
  removeRecord(deleteData) {
    const quaryparms: any = deleteData.quaryparms;
    this.service.invoke(deleteData.url, quaryparms).subscribe(
      (res) => {
        //this.getAllHighlightFields();
        this.getHighlightFields(true);
        this.notificationService.notify(
          'Field removed successfully',
          'success'
        );
      },
      (errRes) => {
        this.notificationService.notify('Failed to remove fields', 'error');
      }
    );
  }
  /** Add to Highlight */
  addRecords(addData) {
    this.isaddLoading = true;
    this.service
      .invoke(addData.url, addData.quaryparms, addData.payload)
      .subscribe(
        (res) => {
          this.isaddLoading = false;
          //this.getAllHighlightFields();
          this.getHighlightFields(true);
          //this.getPresentableFields(false);
          this.notificationService.notify('Field added succesfully', 'success');
        },
        (errRes) => {
          this.notificationService.notify('Failed to add Fields', 'error');
        }
      );
    //
  }
  //** Change of highlight slider value to call put querypipeline*/
  sildervalueChanged(event, type) {
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    if (type == 'synonyms') {
      const payload: any = {
        settings: {
          highlight: {
            synonymsHighlight: event.currentTarget.checked,
          },
        },
      };
      this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
        (res) => {
          this.highlightdata.synonymsHighlight = res.settings.highlight.enable;
          this.highlightdata.synonymsHighlight
            ? this.notificationService.notify(
                'Synonyms highlighting enabled',
                'success'
              )
            : this.notificationService.notify(
                'Synonyms highlighting disabled',
                'success'
              );
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    } else {
      const payload: any = {
        settings: {
          highlight: {
            enable: event.currentTarget.checked,
          },
        },
      };
      this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
        (res) => {
          this.highlightdata.enable = res.settings.highlight.enable;
          this.highlightdata.enable
            ? this.notificationService.notify('Highlighting Enabled', 'success')
            : this.notificationService.notify(
                'Highlighting Disabled',
                'success'
              );
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }

  //** unsubscribing the query subscription */
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
