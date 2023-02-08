import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';

@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss'],
})
export class SearchSettingsComponent implements OnInit, OnDestroy {
  selectedApp;
  indexPipelineId;
  streamId: any;
  queryPipelineId: any;
  querySubscription: Subscription;
  serachIndexId;
  pipeline: any = [];
  selectedComponent = 'weights';
  componentsArray: any[] = [
    { key: 'Weights', value: 'weights' },
    { key: 'Presentable', value: 'presentable' },
    { key: 'Highlighting', value: 'highlighting' },
    { key: 'Spell Correction', value: 'spell_correction' },
    { key: 'Snippets', value: 'snippets' },
    { key: 'Search Relevance', value: 'search_relevance' },
    { key: 'Synonyms', value: 'synonyms' },
    { key: 'Stop Words', value: 'stop_words' },
    { key: 'Bot Actions', value: 'bot_actions' },
    { key: 'Small Talk', value: 'small_talk' },
    { key: 'Custom Configurations', value: 'custom_configurations' },
  ];
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline()
      ? this.workflowService.selectedQueryPipeline()._id
      : '';
    if (this.indexPipelineId && this.queryPipelineId) {
      this.getQuerypipeline();
    } // Use Async for this
    this.querySubscription =
      this.appSelectionService.queryConfigSelected.subscribe((res) => {
        this.indexPipelineId = this.workflowService.selectedIndexPipeline();
        this.queryPipelineId = this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '';
        this.getQuerypipeline();
      });
    this.openWeightsScreen();
  }
  //** get Query pipeline API call */
  getQuerypipeline() {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(
      (res) => {
        this.pipeline = res;
      },
      (errRes) => {
        this.notificationService.notify(
          'failed to get querypipeline details',
          'error'
        );
      }
    );
  }

  openWeightsScreen() {
    if (this.router.url === '/search-settings') {
      this.router.navigateByUrl('search-settings/weights', {
        skipLocationChange: true,
      });
    }
  }

  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }
}
