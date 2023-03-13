import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';

import { Router } from '@angular/router';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { Store } from '@ngrx/store';
import { selectAppIds } from '@kore.apps/store/app.selectors';

@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss'],
})
export class SearchSettingsComponent implements OnInit, OnDestroy {
  sub: Subscription;
  streamId: any;
  pipeline: any = [];
  selectedComponent = 'weights';
  componentsArray: any[] = [
    { key: 'weights_Weights', value: 'weights' },
    { key: 'search_settings_Presentable', value: 'presentable' },
    { key: 'search_settings_highlighting', value: 'highlighting' },
    { key: 'search_settings_spell_correction', value: 'spell_correction' },
    {
      key: 'search_settings_search_relevance_title',
      value: 'search_relevance',
    },
    { key: 'synonyms_Synonymns', value: 'synonyms' },
    { key: 'stopWords_stop_words', value: 'stop_words' },
    { key: 'botAction_bot_actions', value: 'bot_actions' },
    { key: 'genaralSettings_small_talk', value: 'small_talk' },
    {
      key: 'search_settings_custom_configurations',
      value: 'custom_configurations',
    },
  ];
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    public router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initAppIds();
    this.openWeightsScreen();
  }

  initAppIds() {
    const idsSub = this.store
      .select(selectAppIds)
      .pipe(
        switchMap(({ searchIndexId, indexPipelineId, queryPipelineId }) => {
          return this.service.invoke('get.queryPipeline', {
            searchIndexId,
            indexPipelineId,
            queryPipelineId,
          });
        })
      )
      .subscribe({
        next: (res) => {
          this.pipeline = res;
        },
        error: () => {
          this.notificationService.notify(
            'failed to get querypipeline details',
            'error'
          );
        },
      });
    this.sub?.add(idsSub);
  }

  openWeightsScreen() {
    if (this.router.url === '/search-settings') {
      this.router.navigateByUrl('search-settings/weights', {
        skipLocationChange: true,
      });
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
