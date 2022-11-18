import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss']
})
export class SearchSettingsComponent implements OnInit {
  selectedApp;
  indexPipelineId;
  streamId: any;
  queryPipelineId: any;
  querySubscription : Subscription;
  serachIndexId;
  pipeline:any=[];
  selectedComponent: String = 'weights';
  componentsArray: Array<Object> = [
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
    { key: 'Custom Configurations', value: 'custom_configurations' }
  ];
  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '';
    this.getQuerypipeline();
    this.querySubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.getQuerypipeline();
   })
  }
  //** get Query pipeline API call */
  getQuerypipeline(){
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(res => {
      this.pipeline = res;
    },errRes => {
      this.notificationService.notify('failed to get querypipeline details', 'error')
    });
  }

  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }

}
