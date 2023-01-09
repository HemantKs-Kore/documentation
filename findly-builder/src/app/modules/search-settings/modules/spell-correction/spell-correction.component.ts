import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import {Subscription} from 'rxjs';

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
  isSpinner=false
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
  method_type='';
  spellcorrectdata: any = {};
  isLoading = false;
  isaddLoading = false;
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
    this.isSpinner=true
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(
      (res) => {
        this.isSpinner=false
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
  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }
  //**to fetch the fields for spellcorrect table and pop-up */
  getAllspellcorrectFields() {
    this.getSpellcorrect(true);
    //this.getSpellcorrect(false);
  }
  /** get highlight fields api call with false value to get data for add pop-up*/
  getAddpopupspellcorrectionField(event){
        if(!event){
          this.getSpellcorrect(false);;
        }    
  }
  //** sort the data for spellcorrect data table and pop-up */
  spellcorrectSort(sortobj) {
    console.log(sortobj);
    this.method_type='search'
    if (sortobj.componenttype == 'datatable') {
      this.getSpellcorrect(true, sortobj);
    } else {
      this.getSpellcorrect(false, sortobj);
    }
  }

  //**spellcorrect search function */
  spellcorrectSearch(obj) {
    this.searchValue = obj.searchvalue;
    this.method_type='search';
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

  //**get api call to fetch the spell correct data */
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
    if(this.method_type!=='search') {
      this.isLoading = true;
    }
    this.service.invoke('get.spellcorrectFields', quaryparms).subscribe(
      (res) => {
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
  getRecord(recordData: any) {
    let record = recordData.record;
    if(record?.fieldIds?.length > 0 || (record?.length>0)){
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
    else{
      this.notificationService.notify("Please select the fields to proceed",'error')
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
        this.notificationService.notify("Field removed successfully",'success');
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
      indexPipelineId: this.workflowService.selectedIndexPipeline(),
      queryPipelineId: this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : '',
      searchIndexId: this.serachIndexId,
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
        this.spellcorrectdata.settings.spellCorrect.enable = res?.settings?.spellcorrectdata?.enable;
        this.notificationService.notify('updated successfully', 'success');
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
   //** to increment the max typo edits value */
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
   //** to decrement the minimum character threshold value */
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
  //** to increment the minimum character threshold value */
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
  //** to unsubcribe the query subscription*/
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }
}
