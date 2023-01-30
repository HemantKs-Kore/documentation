import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { Subscription } from 'rxjs';

import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAppIds } from '@kore.apps/store/app.selectors';

@Component({
  selector: 'app-spell-correction',
  templateUrl: './spell-correction.component.html',
  styleUrls: ['./spell-correction.component.scss'],
})
export class SpellCorrectionComponent implements OnInit, OnDestroy {
  selectedApp;
  indexPipelineId;
  streamId: any;
  queryPipelineId: any;
  sub: Subscription;
  more_options = false;
  checksort = 'fieldName';
  isSpinner = false;
  selectedSort = 'asc';
  isSearchable = true;
  limit = 10;
  page = 0;
  allspellCorrect: any = [];
  spellcorrect: any = [];
  max_pageno: any;
  nonspellcorrect: any = [];
  max_threshold = 0;
  min_threshold = 0;
  searchValue = '';
  serachIndexId;
  method_type = '';
  spellcorrectdata: any = {};
  isLoading = false;
  isaddLoading = false;
  searchIndexId;
  @Input() selectedcomponent;
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  //** get Query pipeline API call */
  getQuerypipeline() {
    this.spellcorrectdata = this.route.snapshot.data.queryPipeline;
  }

  ngOnInit(): void {
    this.more_options = false;
    this.max_threshold = 0;
    this.min_threshold = 0;
    this.initAppIds();
    this.getAllspellcorrectFields();
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

  displayFields(isSelected, res) {
    this.isLoading = false;
    this.allspellCorrect = res.data;
    this.max_pageno = Number(Math.ceil(res.totalCount / 10)) - 1;
    if (isSelected) {
      this.spellcorrect = [];
      this.allspellCorrect.forEach((element) => {
        // if (element.spellcorrect.value) {
        this.spellcorrect.push(element);
        // }
      });
    } else {
      this.nonspellcorrect = [];
      this.allspellCorrect.forEach((element) => {
        // if (!element.spellcorrect.value) {
        this.nonspellcorrect.push(element);
        // }
      });
    }
  }

  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(null);
  }

  //**to fetch the fields for spellcorrect table and pop-up */
  getAllspellcorrectFields() {
    const res = this.route.snapshot.data.spells;
    if (res.error) {
      this.displayError();
    } else {
      this.displayFields(true, res);
    }
  }

  /** get highlight fields api call with false value to get data for add pop-up*/
  getAddpopupspellcorrectionField(event) {
    if (!event) {
      this.getSpellcorrect(false);
    }
  }
  //** sort the data for spellcorrect data table and pop-up */
  spellcorrectSort(sortobj) {
    console.log(sortobj);
    this.method_type = 'search';
    if (sortobj.componenttype == 'datatable') {
      this.getSpellcorrect(true, sortobj);
    } else {
      this.getSpellcorrect(false, sortobj);
    }
  }

  //**spellcorrect search function */
  spellcorrectSearch(obj) {
    this.searchValue = obj.searchvalue;
    this.method_type = 'search';
    if (obj.componenttype == 'datatable') {
      this.getSpellcorrect(true);
    } else {
      this.getSpellcorrect(false);
    }
  }

  //**presentable get page */
  spellcorrectPage(pageinfo) {
    this.page = pageinfo;
    this.getSpellcorrect(true);
  }

  displayError() {
    this.notificationService.notify(
      'Failed to get Spellcorrect fields',
      'error'
    );
  }

  //**get api call to fetch the spell correct data */
  getSpellcorrect(isSelected?, sortobj?) {
    const quaryparms: any = {
      isSelected: isSelected,
      sortField:
        sortobj?.fieldname?.length > 0 ? sortobj.fieldname : 'fieldName',
      orderType: sortobj?.type?.length > 0 ? sortobj.type : 'asc', //desc,
      indexPipelineId: this.indexPipelineId,
      streamId: this.streamId,
      queryPipelineId: this.queryPipelineId,
      // isSearchable: this.isSearchable,
      // page: this.page ? this.page : 0,
      // limit: this.limit,
      searchKey: this.searchValue ? this.searchValue : '',
    };
    if (this.method_type !== 'search') {
      this.isLoading = true;
    }
    this.service.invoke('get.spellcorrectFields', quaryparms).subscribe(
      (res) => {
        this.displayFields(isSelected, res);
      },
      () => {
        this.displayError();
      }
    );
  }

  /** Emited Value for Operation (Add/Delete)  */
  getRecord(recordData: any) {
    let record = recordData.record;
    if (record?.fieldIds?.length > 0 || record?.length > 0) {
      let deleteData = {
        url: 'delete.spellcorrectFields',
        quaryparms: {
          streamId: this.streamId,
          indexPipelineId: this.indexPipelineId,
          queryPipelineId: this.queryPipelineId,
          fieldId: record[0],
        },
      };
      let addData = {
        url: 'add.spellcorrectFields',
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
  /** remove fromPresentable */
  removeRecord(deleteData) {
    const quaryparms: any = deleteData.quaryparms;
    this.service.invoke(deleteData.url, quaryparms).subscribe(
      (res) => {
        // this.getAllspellcorrectFields();
        this.getSpellcorrect(true);
        //this.getSpellcorrect(true);
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
  /** Add to Prescentable */
  addRecords(addData) {
    this.isaddLoading = true;
    this.service
      .invoke(addData.url, addData.quaryparms, addData.payload)
      .subscribe(
        (res) => {
          this.isaddLoading = false;
          //this.getAllspellcorrectFields();
          this.getSpellcorrect(true);
          //this.getSpellcorrect(true);
          this.notificationService.notify('Field added succesfully', 'success');
        },
        (errRes) => {
          this.notificationService.notify('Failed to add Fields', 'error');
        }
      );
    //
  }
  //**Spell Correct Slider change update query pipeline */
  silderValuechanged(event) {
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    const payload: any = {
      settings: {
        spellCorrect: {
          enable: event.currentTarget.checked,
        },
      },
    };
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        this.spellcorrectdata.settings.spellCorrect.enable =
          res?.settings?.spellCorrect?.enable;
        this.spellcorrectdata.settings.spellCorrect.enable
          ? this.notificationService.notify(
              'Spell Correction Enabled',
              'success'
            )
          : this.notificationService.notify(
              'Spell Correction Disabled',
              'success'
            );
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
  }

  //** to open the more option container */
  openContainer() {
    this.more_options = true;
  }
  //** to close the more option container */
  closeContainer() {
    this.more_options = false;
  }
  //** to decrement the max typo edits value */
  maxdecrementValue(max_val) {
    this.max_threshold = max_val - 1;
    if (this.max_threshold >= 1) {
      const quaryparms: any = {
        indexPipelineId: this.indexPipelineId,
        queryPipelineId: this.queryPipelineId,
        searchIndexId: this.searchIndexId,
      };
      const payload: any = {
        settings: {
          spellCorrect: {
            maxTypoEdits: this.max_threshold,
          },
        },
      };
      this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
        (res) => {
          this.spellcorrectdata.settings.spellCorrect.maxTypoEdits =
            res?.settings?.spellCorrect?.maxTypoEdits;
          if (this.max_threshold > 0) {
            this.notificationService.notify(
              'Maximum Typo Edits updated successfully',
              'success'
            );
          }
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }
  //** to increment the max typo edits value */
  maxincrementValue(max_val) {
    this.max_threshold = max_val + 1;
    if (this.max_threshold >= 2) {
      const quaryparms: any = {
        indexPipelineId: this.indexPipelineId,
        queryPipelineId: this.queryPipelineId,
        searchIndexId: this.searchIndexId,
      };
      const payload: any = {
        settings: {
          spellCorrect: {
            maxTypoEdits: this.max_threshold,
          },
        },
      };
      this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
        (res) => {
          this.spellcorrectdata.settings.spellCorrect.maxTypoEdits =
            res?.settings?.spellCorrect?.maxTypoEdits;
          this.notificationService.notify(
            'Maximum Typo Edits updated successfully',
            'success'
          );
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }
  //** to decrement the minimum character threshold value */
  mindecrementValue(min_val) {
    this.min_threshold = min_val - 1;
    if (this.min_threshold >= 1) {
      const quaryparms: any = {
        indexPipelineId: this.indexPipelineId,
        queryPipelineId: this.queryPipelineId,
        searchIndexId: this.searchIndexId,
      };
      const payload: any = {
        settings: {
          spellCorrect: {
            minCharThreshold: this.min_threshold,
          },
        },
      };
      this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
        (res) => {
          this.spellcorrectdata.settings.spellCorrect.minCharThreshold =
            res?.settings?.spellCorrect?.minCharThreshold;
          if (this.min_threshold > 0) {
            this.notificationService.notify(
              'Minimum Character Threshold updated successfully',
              'success'
            );
          }
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }
  //** to increment the minimum character threshold value */
  minincrementValue(min_val) {
    this.min_threshold = min_val + 1;
    if (this.min_threshold <= 6) {
      const quaryparms: any = {
        indexPipelineId: this.indexPipelineId,
        queryPipelineId: this.queryPipelineId,
        searchIndexId: this.searchIndexId,
      };
      const payload: any = {
        settings: {
          spellCorrect: {
            minCharThreshold: this.min_threshold,
          },
        },
      };
      this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
        (res) => {
          this.spellcorrectdata.settings.spellCorrect.minCharThreshold =
            res?.settings?.spellCorrect?.minCharThreshold;
          this.notificationService.notify(
            'Minimum Character Threshold updated successfully',
            'success'
          );
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }
  //** to unsubcribe the query subscription*/
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
