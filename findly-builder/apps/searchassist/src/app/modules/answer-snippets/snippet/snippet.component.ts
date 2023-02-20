import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ChangeDetectionStrategy, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';
import { RangeSlider } from '../../../helpers/models/range-slider.model';
import { KRModalComponent } from '../../../shared/kr-modal/kr-modal.component';
import { SliderComponentComponent } from '../../../shared/slider-component/slider-component.component';
@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetComponent implements OnInit, OnDestroy {
  isEyeOpen = false;
  selectedApp: any;
  isLoading = false;
  snippetArray: Array<any> = [];
  isWorkbenchSnippetDisabled = false;
  configObj: ConfigObj = { searchIndexId: '', indexPipelineId: '', queryPipelineId: '' };
  selectedSnippetObj: any = { type: 'extractive_model' };
  openAIObj = new openAIObj();
  sliderDefaultConfigs: sliderDefaultObj = { similarity_score: 60, snippet_title: 5, snippet_content: 3 };
  queryDataSubscription: Subscription;
  consentShareModelPopRef: any;

  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  @ViewChild('consentShareModel') consentShareModel: KRModalComponent;

  constructor(private notificationService: NotificationService, private service: ServiceInvokerService, public workflowService: WorkflowService, private appSelectionService: AppSelectionService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getQueryConfigData();
    this.queryDataSubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.getQueryConfigData();
      this.getAnswerSnippets();
      this.getOpenAIKey();
    });
    if (this.configObj.indexPipelineId && this.configObj.queryPipelineId) {
      this.getAnswerSnippets();
      this.getOpenAIKey();
    }
  }

  //get queryPipeline or indexPipeline id's
  getQueryConfigData() {
    this.selectedApp = this.workflowService?.selectedApp();
    this.configObj.searchIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.configObj.indexPipelineId = this.workflowService?.selectedIndexPipeline();
    this.configObj.queryPipelineId = this.workflowService?.selectedQueryPipeline() ? this.workflowService?.selectedQueryPipeline()?._id : '';
  }

  //get Answer snippet Data API method  
  getAnswerSnippets() {
    const quaryparms: any = {
      sidx: this.configObj.searchIndexId,
      indexPipelineId: this.configObj.indexPipelineId,
      queryPipelineId: this.configObj.queryPipelineId
    };
    this.service.invoke('get.answerSnippets', quaryparms).subscribe(
      (res) => {
        if (res) {
          this.snippetArray = res?.config;
          this.selectSnippet(this.snippetArray[0].type);
          const ExtractedData = res?.config?.filter(item => item.type === 'extractive_model');
          this.isWorkbenchSnippetDisabled = (ExtractedData[0]?.active && !ExtractedData[0]?.workBenchStageFound) ? true : false;
          this.cd.detectChanges();
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Get Answer snippet API Failed');
      }
    );
  }

  //get open AI key API method  
  getOpenAIKey() {
    const quaryparms: any = {
      streamId: this.selectedApp?._id
    };
    this.service.invoke('get.openAIKey', quaryparms).subscribe(
      (res) => {
        if (res) {
          if (res?.name === 'openai') {
            this.openAIObj.openAIKey = res?.appConfig?.apiKey;
            this.openAIObj.isOpenAIFirst = res?.appConfig?.apiKey?.length === 0 ? true : false;
          }
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Get Answer snippet API Failed');
      }
    );
  }

  //reset to default for similarity / weights slider
  resetToDeafult(type) {
    const Obj = { ...this.selectedSnippetObj };
    if (type === 'similarity') {
      Obj.similarityScore = this.sliderDefaultConfigs.similarity_score;
      Obj.similarity_slider = new RangeSlider(0, 100, 1, Obj?.similarityScore, 'editSlider', '', true);
    } else if (type === 'weight') {
      Obj.searchFields?.map((item, index) => {
        const score = index === 0 ? this.sliderDefaultConfigs.snippet_title : this.sliderDefaultConfigs.snippet_content;
        item.weight = score;
        item.slider = new RangeSlider(0, 10, 1, score, 'editSlider' + index, '', true);
      })
    }
    this.selectedSnippetObj = Obj;
    this.enableDisableSnippet(Obj, true);
  }

  ///eanble or disable snippet using checkbox event
  enableDisableSnippet(snippet, isSlider?) {
    let message = null;
    if (!isSlider) message = `${snippet?.active ? 'Enabled' : 'Disabled'} successfully`;
    this.snippetArray = this.snippetArray.map(item => {
      if (item?.type === snippet?.type) {
        item = snippet;
      }
      return item;
    });
    this.updateAnswerSnippet(message);
  }

  //update or save answer snippet API
  updateAnswerSnippet(message?) {
    const quaryparms: any = {
      sidx: this.configObj.searchIndexId,
      indexPipelineId: this.configObj.indexPipelineId,
      queryPipelineId: this.configObj.queryPipelineId
    };
    const payload = { config: this.snippetArray };
    this.service.invoke('put.answerSnippets', quaryparms, payload).subscribe(
      (res) => {
        if (res) {
          const msg = message || 'Updated successfully';
          this.notificationService.notify(msg, 'success');
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Update Answer snippet API Failed');
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    const array = this.snippetArray;
    moveItemInArray(this.snippetArray, event.previousIndex, event.currentIndex);
    for (let i = 0; i < this.snippetArray.length; i++) {
      this.snippetArray[i].priority = i + 1;
    }
    this.updateAnswerSnippet();
  }

  //open simulate component using slider component
  openCloseSlider(type) {
    if (type === 'open') {
      this.sliderComponent.openSlider("#simulateSlider", "width500");
    } else {
      this.sliderComponent.closeSlider("#simulateSlider");
    }
  }

  //select particular snippet
  selectSnippet(type) {
    let Obj: any = {};
    const Data = this.snippetArray?.filter(item => item?.type === type);
    if (type === 'extractive_model') {
      Obj = { ...Data[0] };
      Obj.similarity_slider = new RangeSlider(0, 100, 1, Obj?.similarityScore, 'editSlider', '', true);
      Obj?.searchFields?.map((item, index) => {
        item.slider = new RangeSlider(0, 10, 1, item?.weight, 'editSlider' + index, '', true);
        return item;
      });
    } else if (type === 'generative_model') {
      Obj = { ...Data[0] };
    }
    this.selectedSnippetObj = { ...this.selectedSnippetObj, ...Obj };
  }

  //get slider data using event emitter
  getSliderEvent(value, type, index?) {
    if (type === 'similarity_score') {
      this.selectedSnippetObj.similarityScore = value;
    } else if (type === 'weight_score') {
      this.selectedSnippetObj.searchFields[index].weight = value;
    }
    this.enableDisableSnippet(this.selectedSnippetObj, true);
  }

  //save Open AI Key in DB method
  saveOpenAIKey() {
    this.isLoading = true;
    const quaryparms: any = {
      streamId: this.selectedApp?._id
    };
    const payload = {
      "name": "openai",
      "ssoType": "api_key",
      "appConfig": {
        "apiKey": this.openAIObj.openAIKey
      }
    }
    this.service.invoke('post.openAIKey', quaryparms, payload).subscribe(
      (res) => {
        if (res) {
          this.isLoading = false;
          this.openCloseConsentModal('close');
          if (this.openAIObj.isOpenAIFirst) this.getOpenAIKey();
          this.notificationService.notify('Open AI Key updated successfully', 'success');
        }
      },
      (errRes) => {
        this.isLoading = false;
        this.errorToaster(errRes, 'Open AI API Failed');
      }
    );
  }

  //common for toast messages
  errorToaster(errRes, message) {
    let text: string;
    if (errRes?.error?.errors?.length && errRes?.error?.errors[0]?.msg) {
      text = errRes.error.errors[0].msg;
    } else if (message) {
      text = message;
      this.notificationService.notify(message, 'error');
    } else {
      text = 'Somthing went worng';
    }
    this.notificationService.notify(text, 'error');
  }

  //open or close consentShareModel popup
  openCloseConsentModal(type) {
    if (type === 'open') {
      if (this.appSelectionService.validateInputTags(this.openAIObj.openAIKey)) {
        if (this.openAIObj.isOpenAIFirst) {
          this.consentShareModelPopRef = this.consentShareModel.open();
        } else {
          this.saveOpenAIKey();
        }
      }
    } else if (type === 'close') {
      this.isLoading = false;
      if (this.consentShareModelPopRef?.close) this.consentShareModelPopRef?.close();
    }
  }

  //Unmount / clear all subscriptions
  ngOnDestroy() {
    this.queryDataSubscription ? this.queryDataSubscription?.unsubscribe : null;
  }
}


//pipeline id's interface Object
interface ConfigObj {
  searchIndexId: string;
  indexPipelineId: string;
  queryPipelineId: string;
}
interface sliderDefaultObj {
  similarity_score: number;
  snippet_title: number;
  snippet_content: number;
}

class openAIObj {
  openAIKey = '';
  isOpenAIFirst = true;
}