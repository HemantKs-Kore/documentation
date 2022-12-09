import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';

import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-spell-correction',
  templateUrl: './spell-correction.component.html',
  styleUrls: ['./spell-correction.component.scss'],
})
export class SpellCorrectionComponent implements OnInit {
  selectedApp;
  indexPipelineId;
  streamId: any;
  queryPipelineId: any;
  querySubscription: Subscription;
  more_options: boolean = false;
  checksort: string = 'fieldName';
  selectedSort: string = 'asc';
  isSearchable: boolean = true;
  limit: number = 10;
  page: number = 0;
  allspellCorrect: any = [];
  spellcorrect: any = [];
  max_pageno: any;
  nonspellcorrect: any = [];
  max_threshold: number = 0;
  min_threshold: number = 0;
  searchValue = '';
  serachIndexId;
  spellcorrectdata: any = {};
  @Input() selectedcomponent;
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService
  ) {}

  //** get Query pipeline API call */
  getQuerypipeline() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(
      (res) => {
        this.spellcorrectdata = res;
      },
      (errRes) => {
        this.notificationService.notify(
          'failed to get querypipeline details',
          'error'
        );
      }
    );
  }

  ngOnInit(): void {
    // this.selectedApp = this.workflowService.selectedApp();
    // this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    // this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    // this.queryPipelineId = this.workflowService.selectedQueryPipeline()
    //   ? this.workflowService.selectedQueryPipeline()._id
    //   : '';
    
    this.more_options = false;
    this.max_threshold = 0;
    this.min_threshold = 0;
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline()
      ? this.workflowService.selectedQueryPipeline()._id
      : '';
    this.getAllspellcorrectFields();
    this.getQuerypipeline();

    this.querySubscription =
      this.appSelectionService.queryConfigSelected.subscribe((res) => {
        this.indexPipelineId = this.workflowService.selectedIndexPipeline();
        this.queryPipelineId = this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '';
        this.getAllspellcorrectFields();
      });
  }
  getAllspellcorrectFields() {
    this.getSpellcorrect(true);
    this.getSpellcorrect(false);
  }

  spellcorrectsort(sortobj) {
    console.log(sortobj);
    if (sortobj.componenttype == 'datatable') {
      this.getSpellcorrect(true, sortobj);
    } else {
      this.getSpellcorrect(false, sortobj);
    }
  }

  //**spellcorrect search function */
  spellcorrectsearch(obj) {
    this.searchValue = obj.searchvalue;
    if (obj.componenttype == 'datatable') {
      this.getSpellcorrect(true);
    } else {
      this.getSpellcorrect(false);
    }
  }

  //**presentable get page */
  spellcorrectpage(pageinfo) {
    this.page = pageinfo;
    this.getSpellcorrect(true);
  }

  getSpellcorrect(isSelected?, sortobj?) {
    const quaryparms: any = {
      isSelected: isSelected,
      sortField:
        sortobj?.fieldname?.length > 0 ? sortobj.fieldname : 'fieldName',
      orderType: sortobj?.type?.length > 0 ? sortobj.type : 'asc', //desc,
      indexPipelineId: this.indexPipelineId,
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      // isSearchable: this.isSearchable,
      // page: this.page ? this.page : 0,
      // limit: this.limit,
      searchKey: this.searchValue ? this.searchValue : '',
    };
    this.service.invoke('get.spellcorrectFields', quaryparms).subscribe(
      (res) => {
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
        // this.allspellCorrect.forEach(element => {
        //   if(element.spellCorrect.value){
        //     this.spellcorrect.push(element)
        //   }else{
        //     this.nonspellcorrect.push(element)
        //   }
        // });
      },
      (errRes) => {
        this.notificationService.notify(
          'Failed to get Spellcorrect fields',
          'error'
        );
      }
    );
  }

  /** Emited Value for Operation (Add/Delete)  */
  getrecord(recordData: any) {
    let record = recordData.record;
    if (record.length > 1) {
    }
    let deleteData = {
      url: 'delete.spellcorrectFields',
      quaryparms: {
        streamId: this.selectedApp._id,
        indexPipelineId: this.indexPipelineId,
        queryPipelineId: this.queryPipelineId,
        fieldId: record[0],
      },
    };
    let addData = {
      url: 'add.spellcorrectFields',
      quaryparms: {
        streamId: this.selectedApp._id,
        indexPipelineId: this.indexPipelineId,
        queryPipelineId: this.queryPipelineId,
      },
      payload: record,
    };
    recordData.type == 'delete'
      ? this.removeRecord(deleteData)
      : this.addRecords(addData);
  }
  /** remove fromPresentable */
  removeRecord(deleteData) {
    const quaryparms: any = deleteData.quaryparms;
    this.service.invoke(deleteData.url, quaryparms).subscribe(
      (res) => {
        this.getAllspellcorrectFields();
      },
      (errRes) => {
        this.notificationService.notify('Failed to remove Fields', 'error');
      }
    );
  }
  /** Add to Prescentable */
  addRecords(addData) {
    this.service
      .invoke(addData.url, addData.quaryparms, addData.payload)
      .subscribe(
        (res) => {
          this.getAllspellcorrectFields();
          this.notificationService.notify('Field added succesfully', 'success');
        },
        (errRes) => {
          this.notificationService.notify('Failed to add Fields', 'error');
        }
      );
    //
  }
  //**Spell Correct Slider change update query pipeline */
  sildervaluechanged(event) {
    const quaryparms: any = {
      indexPipelineId: this.workflowService.selectedIndexPipeline(),
      queryPipelineId: this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : '',
      searchIndexId: this.serachIndexId,
    };
    var payload: any = {
      settings: {
        spellCorrect: {
          enable: event.currentTarget.checked,
        },
      },
    };
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        this.spellcorrectdata.settings.spellCorrect.enable = res?.settings?.spellcorrectdata?.enable;
        this.notificationService.notify('updated successfully', 'success');
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
  }

  openContainer() {
    this.more_options = true;
  }
  closeContainer() {
    this.more_options = false;
  }
  maxdecrementValue(max_val) {
    this.max_threshold = max_val - 1;
    if (this.max_threshold < 0) {
      this.max_threshold = 0;
    }
    if (this.max_threshold >= 0) {
      const quaryparms: any = {
        indexPipelineId: this.workflowService.selectedIndexPipeline(),
        queryPipelineId: this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '',
        searchIndexId: this.serachIndexId,
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
            this.notificationService.notify('updated successfully', 'success');
          }
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }
  maxincrementValue(max_val) {
    this.max_threshold = max_val + 1;
    if (this.max_threshold >= 0) {
      const quaryparms: any = {
        indexPipelineId: this.workflowService.selectedIndexPipeline(),
        queryPipelineId: this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '',
        searchIndexId: this.serachIndexId,
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
          this.notificationService.notify('updated successfully', 'success');
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }
  mindecrementValue(min_val) {
    this.min_threshold = min_val - 1;
    if (this.min_threshold < 0) {
      this.min_threshold = 0;
    }
    if (this.min_threshold >= 0) {
      const quaryparms: any = {
        indexPipelineId: this.workflowService.selectedIndexPipeline(),
        queryPipelineId: this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '',
        searchIndexId: this.serachIndexId,
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
            this.notificationService.notify('updated successfully', 'success');
          }
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }
  minincrementValue(min_val) {
    this.min_threshold = min_val + 1;
    if (this.min_threshold >= 0) {
      const quaryparms: any = {
        indexPipelineId: this.workflowService.selectedIndexPipeline(),
        queryPipelineId: this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '',
        searchIndexId: this.serachIndexId,
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
          this.notificationService.notify('updated successfully', 'success');
        },
        (errRes) => {
          this.notificationService.notify('Failed to update', 'error');
        }
      );
    }
  }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }
}
