import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bot-actions',
  templateUrl: './bot-actions.component.html',
  styleUrls: ['./bot-actions.component.scss'],
})
export class BotActionsComponent implements OnInit {
  botactionsdata;
  @Input() selectedcomponent;
  selectedApp;
  indexPipelineId;
  streamId: any;
  serachIndexId;
  queryPipelineId;
  querySubscription: Subscription;
  isLoading = false;

  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService
  ) {}

  ngOnInit(): void {
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
      ? this.workflowService.selectedQueryPipeline()?._id
      : '';
    if (this.indexPipelineId && this.queryPipelineId) this.getQuerypipeline();
    this.querySubscription =
      this.appSelectionService.queryConfigSelected.subscribe((res) => {
        this.indexPipelineId = this.workflowService.selectedIndexPipeline();
        this.queryPipelineId = this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()?._id
          : '';
        this.getQuerypipeline();
      });
  }
  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
  //** get querypipeline API call*/
  getQuerypipeline() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId,
    };
    this.isLoading = true;
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(
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
  }

  //** Change in the Slider state to call put Query Pipeline */
  silderValuechanged(event) {
    console.log(event);
    const quaryparms: any = {
      indexPipelineId: this.workflowService.selectedIndexPipeline(),
      queryPipelineId: this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : '',
      searchIndexId: this.serachIndexId,
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
      indexPipelineId: this.workflowService.selectedIndexPipeline(),
      queryPipelineId: this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : '',
      searchIndexId: this.serachIndexId,
    };
    let payload: any = {
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
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }
}
