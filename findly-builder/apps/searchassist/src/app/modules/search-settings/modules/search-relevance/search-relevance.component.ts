import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take, tap } from 'rxjs';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { RangeSlider } from '@kore.apps/helpers/models/range-slider.model';
import { Store } from '@ngrx/store';
import {
  selectAppIds,
  selectQueryPipelines,
} from '@kore.apps/store/app.selectors';
import { StoreService } from '@kore.apps/store/store.service';

declare const $: any;
@Component({
  selector: 'app-search-relevance',
  templateUrl: './search-relevance.component.html',
  styleUrls: ['./search-relevance.component.scss'],
})
export class SearchRelevanceComponent implements OnInit, OnDestroy {
  searchrelevancedata: any;
  selectedApp;
  indexPipelineId;
  streamId: any;
  searchIndexId;
  queryPipelineId;
  isLoading = false;
  sub: Subscription;
  weightModal = {
    fieldName: '',
    fieldDataType: '',
    fieldId: '',
    sliderObj: {
      minVal: 0,
      maxVal: 100,
      step: 1,
      default: 0,
      id: 'matchThreshold0',
      key: '',
      enable: true,
    },
  };
  searchrelevanceToggle;
  searchRelevanceConfig;
  slider_value_payload: boolean;
  selectedLanguage = 'en';

  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private storeService: StoreService,
    private store: Store
  ) {}
  sliderOpen;
  disableCancle: any = true;

  ngOnInit(): void {
    this.initAppIds();
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
          this.prepareThreshold('menu');
        })
      )
      .subscribe();

    this.sub?.add(idsSub);
  }
  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
  //** to fetch the threshold range slider value */
  prepareThreshold(comingFrom) {
    if (comingFrom == 'menu') {
      this.isLoading = true;
    }

    const queryPipelinesSub = this.store.select(selectQueryPipelines).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.searchrelevancedata = res.settings.searchRelevance;
        this.searchrelevanceToggle = res.settings.searchRelevance.enable;
        this.searchRelevanceConfig =
          res.settings.searchRelevance.languages.find(
            (item) => item.languageCode == this.selectedLanguage
          );
        const name = ('matchThreshold' || '').replace(/[^\w]/gi, '');
        const obj = {
          fieldName: name,
          fieldDataType: 'number',
          fieldId: 'matchThreshold',
          sliderObj: new RangeSlider(
            0,
            100,
            1,
            this.searchrelevancedata.matchThreshold,
            'matchThreshold0',
            '',
            true
          ),
        };
        this.weightModal = obj;
      },
      (errRes) => {
        this.notificationService.notify(
          'failed to get querypipeline details',
          'error'
        );
      }
    );

    this.sub?.add(queryPipelinesSub);
  }

  getUpdateItem(type, event) {
    return this.searchrelevancedata.languages.map((item) => {
      if (item.languageCode === this.selectedLanguage) {
        return {
          ...item,
          [type]: event.target.checked,
        };
      }
      return item;
    });
  }
  //** update query pipeline on toggle button */
  silderValuechanged(event, type) {
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    this.slider_value_payload = $('#sa_slider_enable_disable:checkbox:checked')
      .length
      ? true
      : false;
    const payload: any = {
      settings: {
        searchRelevance: {
          enable: this.slider_value_payload,
          languages: this.getUpdateItem(type, event),
        },
      },
    };
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        this.searchrelevancedata.enable =
          res?.settings?.searchRelevance?.enable;
        if (type === 'enable') {
          this.searchrelevancedata.enable
            ? this.notificationService.notify(
                'Search Relevance Enabled',
                'success'
              )
            : this.notificationService.notify(
                'Search Relevance Disabled',
                'success'
              );
        } else {
          this.notificationService.notify(
            'Search Relevance Language keys updated',
            'success'
          );
        }

        this.prepareThreshold('self');
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
  }

  // to update the  threshold Range slider
  valueEvent(val, outcomeObj) {
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    const payload: any = {
      settings: {
        searchRelevance: {
          matchThreshold: val,
        },
      },
    };
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        //this.notificationService.notify("updated successfully",'success');
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
