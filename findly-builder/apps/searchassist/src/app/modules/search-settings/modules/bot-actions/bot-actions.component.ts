import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { StoreService } from '@kore.apps/store/store.service';

import { Subscription, take, tap } from 'rxjs';

@Component({
  selector: 'app-bot-actions',
  templateUrl: './bot-actions.component.html',
  styleUrls: ['./bot-actions.component.scss'],
})
export class BotActionsComponent implements OnInit, OnDestroy {
  botactionsdata;
  @Input() selectedcomponent;
  selectedApp;
  indexPipelineId;
  streamId: any;
  searchIndexId;
  queryPipelineId;
  sub: Subscription;
  isLoading = false;

  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private storeService: StoreService
  ) {}

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
          this.getQuerypipeline();
        })
      )
      .subscribe();

    this.sub?.add(idsSub);
  }
  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
  //** get querypipeline API call*/
  getQuerypipeline() {
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId,
    };
    this.isLoading = true;
    const queryPipelineSub = this.service
      .invoke('get.queryPipeline', quaryparms)
      .subscribe(
        (res) => {
          this.botactionsdata = res.settings.botActions;
          this.isLoading = false;
        },
        (errRes) => {
          this.notificationService.notify(
            'failed to get querypipeline details',
            'error'
          );
        }
      );

    this.sub?.add(queryPipelineSub);
  }

  //** Change in the Slider state to call put Query Pipeline */
  silderValuechanged(event) {
    console.log(event);
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    const payload: any = {
      settings: {
        botActions: {
          enable: event.currentTarget.checked,
        },
      },
    };
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        this.botactionsdata.enable = res.settings.botActions.enable;
        this.botactionsdata.enable
          ? this.notificationService.notify('Bot Action Enabled', 'success')
          : this.notificationService.notify('Bot Action Disabled', 'success');
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
  }

  //** Selecting the button of winning intent and calling the put query pipeline api */
  selectRadiobutton(type) {
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    const payload: any = {
      settings: {
        botActions: {
          executeIntents: type == 'execute' ? true : false,
        },
      },
    };

    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        this.botactionsdata.enable = res.settings.botActions.enable;
        //this.getQuerypipeline();
        this.notificationService.notify('updated successfully', 'success');
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
  }
  //** unsubscribing the query subscription */
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
