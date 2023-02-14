import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, interval, Subject, Subscription } from 'rxjs';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { AuthService } from '@kore.apps/services/auth.service';
import { Store } from '@ngrx/store';
import { selectAppIds } from '@kore.apps/store/app.selectors';
@Component({
  selector: 'app-small-talk',
  templateUrl: './small-talk.component.html',
  styleUrls: ['./small-talk.component.scss'],
})
export class SmallTalkComponent implements OnInit, OnDestroy {
  searchIndexId: any;
  selectedApp: any;
  LinkABot: any;
  streamId: any;
  enableSmallTalk: any;
  sub: Subscription;
  enable = false;
  botLinked = false;
  smallTalkData: any;
  serachIndexId;
  indexPipelineId;
  queryPipelineId;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private appSelectionService: AppSelectionService,
    private store: Store
  ) {}
  ngOnInit(): void {
    // this.selectedApp = this.workflowService?.selectedApp();
    // this.searchIndexId = this.selectedApp?.searchIndexes[0]?._id;
    // this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
    // this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
    //   ? this.workflowService.selectedQueryPipeline()._id
    //   : '';
    // if (this.searchIndexId && this.queryPipelineId && this.queryPipelineId) {
    //   this.getQuerypipeline();
    // }
    // this.querySubscription =
    //   this.appSelectionService.queryConfigSelected.subscribe((res) => {
    //     this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    //     this.queryPipelineId = this.workflowService.selectedQueryPipeline()
    //       ? this.workflowService.selectedQueryPipeline()._id
    //       : '';
    //     this.getQuerypipeline();
    //   });
    this.initAppIds();
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
          this.getQuerypipeline();
        }
      );
    this.sub?.add(idsSub);
  }
  //Open topic slider
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
  getQuerypipeline() {
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId,
    };
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(
      (res) => {
        this.smallTalkData = res?.settings.smallTalk.enable;
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
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    const payload: any = {
      settings: {
        smallTalk: {
          enable: event.target.checked,
        },
      },
    };
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        this.smallTalkData = res?.settings?.smallTalk?.enable;
        this.smallTalkData
          ? this.notificationService.notify('Small talk Enabled', 'success')
          : this.notificationService.notify('Small talk Disabled', 'success');
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
