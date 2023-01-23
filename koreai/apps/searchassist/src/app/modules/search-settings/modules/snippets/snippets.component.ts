import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { AuthService } from '@kore.apps/services/auth.service';

@Component({
  selector: 'app-snippets',
  templateUrl: './snippets.component.html',
  styleUrls: ['./snippets.component.scss'],
})
export class SnippetsComponent implements OnInit {
  selectedApp;
  serachIndexId;
  indexPipelineId;
  queryPipelineId;
  querySubscription;
  snippetsData: boolean = false;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private appSelectionService: AppSelectionService
  ) {}

  ngOnInit(): void {
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
      ? this.workflowService.selectedQueryPipeline()?._id
      : '';
    if (this.indexPipelineId && this.queryPipelineId) this.getQuerypipeline();
    this.querySubscription =
      this.appSelectionService.queryConfigSelected.subscribe((res) => {
        this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
        this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()?._id
          : '';
        this.getQuerypipeline();
      });
  }
  //open topic guide
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }

  getQuerypipeline() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(
      (res) => {
        this.snippetsData = res?.settings.snippet.enable;
      },
      (errRes) => {
        this.notificationService.notify(
          'failed to get querypipeline details',
          'error'
        );
      }
    );
  }

  sildervaluechanged(event) {
    const quaryparms: any = {
      indexPipelineId: this.workflowService?.selectedIndexPipeline(),
      queryPipelineId: this.workflowService?.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()?._id
        : '',
      searchIndexId: this.serachIndexId,
    };
    const payload: any = {
      settings: {
        snippet: {
          enable: event.target.checked,
        },
      },
    };
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        this.snippetsData = res.settings.snippet.enable;
        // this.getQuerypipeline();
        this.snippetsData
          ? this.notificationService.notify('Snippets Enabled', 'success')
          : this.notificationService.notify('Snippets Disabled', 'success');
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
  }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }
}
