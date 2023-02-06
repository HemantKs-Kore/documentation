import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { selectAppIds } from '@kore.apps/store/app.selectors';
import { Store } from '@ngrx/store';
import { of, interval, Subject, Subscription } from 'rxjs';
import { v4 } from 'uuid';
@Component({
  selector: 'app-custom-configurations',
  templateUrl: './custom-configurations.component.html',
  styleUrls: ['./custom-configurations.component.scss'],
})
export class CustomConfigurationsComponent implements OnInit, OnDestroy {
  formData = {};
  isLoading = false;
  selectedApp;
  indexPipelineId;
  streamId: any;
  searchIndexId;
  queryPipelineId;
  sub: Subscription;
  customConfig: any = [];

  constructor(
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // this.selectedApp = this.workflowService?.selectedApp();
    // this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    // this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
    // this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
    //   ? this.workflowService?.selectedQueryPipeline()?._id
    //   : '';
    // if (this.indexPipelineId && this.queryPipelineId)
    //   this.getcustomConfigList();
    // this.querySubscription =
    //   this.appSelectionService.queryConfigSelected.subscribe((res) => {
    //     this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
    //     this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
    //       ? this.workflowService.selectedQueryPipeline()?._id
    //       : '';
    //     this.getcustomConfigList();
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
          this.getcustomConfigList();
        }
      );
    this.sub?.add(idsSub);
  }
  getcustomConfigList() {
    this.getQuerypipeline();
  }
  //** get querypipeline */
  getQuerypipeline() {
    const quaryparms: any = {
      searchIndexID: this.searchIndexId,
      queryPipelineId: this.queryPipelineId,
      indexPipelineId: this.indexPipelineId,
    };
    this.isLoading = true;
    this.service.invoke('get.queryPipeline', quaryparms).subscribe(
      (res) => {
        this.isLoading = false;
        this.customConfig = res.settings.customConfiguration.values;
        // this.customConfig = [
        //   {
        //     key: 'English', value: 'en',_id:'01'
        //   },
        //   {
        //     key: 'Japanies', value: 'jp',_id:'02'
        //   },
        //   {
        //     key: 'Chinies', value: 'cn',_id:'03'
        //   },
        //   {
        //     key: 'Hindi', value: 'in',_id:'04'
        //   }
        // ]
      },
      (errRes) => {
        this.notificationService.notify(
          'failed to get querypipeline details',
          'error'
        );
      }
    );
  }
  //**update query pipeline */
  sendData(configObj) {
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      searchIndexId: this.searchIndexId,
    };
    const payload: any = {
      settings: {
        customConfiguration: {
          values: configObj,
        },
      },
    };
    this.service.invoke('put.queryPipeline', quaryparms, payload).subscribe(
      (res) => {
        //this.notificationService.notify('updated successfully', 'success');
      },
      (errRes) => {
        this.notificationService.notify('Failed to update', 'error');
      }
    );
  }
  // open Slider
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }

  //**delete the custom config data */
  deleteCustomConfig(data) {
    this.customConfig = this.customConfig.filter((item) => item !== data);
    this.sendData(this.customConfig);
    this.notificationService.notify('deleted succesfully', 'success');
    this.formData = {};
  }
  //**update the custom config data */
  updateCustomConfig(data) {
    this.formData = data;
  }

  //**update the custom config data */
  updateCustomConfigValue(data) {
    console.log('ss', data);
    this.customConfig = this.customConfig.map((item) => {
      if (item._id === data._id) {
        return data;
      }

      return item;
    });
    this.sendData(this.customConfig);
    this.notificationService.notify('Updated successfully', 'success');
  }

  //** Add the custom config data*/
  onFormSubmit(formData) {
    if (formData._id) {
      // Update
      this.updateCustomConfigValue(formData);
    } else {
      // Add
      const isKeyExists = this.customConfig.find(
        (item) => item.key === formData.key
      );

      if (isKeyExists) {
        this.notificationService.notify(
          'duplicate key found try using unique key',
          'error'
        );
      } else {
        this.customConfig = [{ _id: v4(), ...formData }, ...this.customConfig];
        this.sendData(this.customConfig);
        this.notificationService.notify('Added successfully', 'success');
      }
    }
  }

  openCustomConfig() {
    this.formData = {};
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
