import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ServiceInvokerService } from './service-invoker.service';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  findlyAppsData: any = [];
  appCreationFlow = false;
  completedPercentage = 0;
  _seedData: any;
  selectedIndexPipelineId: any;
  selectedAppForEdit: any;
  selectedSearchIndexId: any;
  selectedQueryPipelineObj: any;
  appQueryPipelineIds: any = [];
  seedData$: BehaviorSubject<any> = new BehaviorSubject(null);
  mainMenuRouter$: BehaviorSubject<any> = new BehaviorSubject(null);
  disablePerfectScroll: boolean;
  linkedBot = '';
  topDownOrBottomUp = '';
  selectedJob_id = '';
  enableDisableSt;
  // supportedLanguages;
  constructor(private service: ServiceInvokerService) {}
  // getSettings(data?) {
  //   if (data) {
  //     this.supportedLanguages = data.language;
  //   }
  //   return this.supportedLanguages;
  // }
  selectedJobId(id?) {
    if (id) {
      this.selectedJob_id = id;
    }
    return this.selectedJob_id;
  }
  linkBot(linkedBot?) {
    if (linkedBot) {
      this.linkedBot = linkedBot;
    } else {
      this.linkedBot = '';
    }
    return this.linkedBot;
  }
  checkTopOrBottom(topDownOrBottomUp?) {
    if (topDownOrBottomUp) {
      this.topDownOrBottomUp = topDownOrBottomUp;
    } else {
      this.topDownOrBottomUp = 'top';
    }

    return this.topDownOrBottomUp;
  }
  smallTalkEnable(enableDisableSt?) {
    if (enableDisableSt || enableDisableSt == false) {
      this.enableDisableSt = enableDisableSt;
    }
    return this.enableDisableSt;
  }

  showAppCreationHeader(value?) {
    if (value === true || value === false) {
      this.appCreationFlow = value;
    }
    return this.appCreationFlow;
  }

  findlyApps(appData?) {
    if (appData) {
      this.findlyAppsData = appData;
    }
    return this.findlyAppsData;
  }
  selectedIndexPipeline(id?) {
    if (id) {
      this.selectedIndexPipelineId = id;
      return;
    }
    return this.selectedIndexPipelineId;
  }
  selectedApp(data?) {
    if (data) {
      this.selectedAppForEdit = data;
      return;
    }
    return this.selectedAppForEdit;
  }
  selectedSearchIndex(data?) {
    if (data) {
      this.selectedSearchIndexId = data;
      return;
    }
    return this.selectedSearchIndexId;
  }
  appQueryPipelines(data?) {
    if (data) {
      this.appQueryPipelineIds = data;
      return;
    }
    return this.appQueryPipelineIds || [];
  }
  selectedQueryPipeline(data?) {
    if (data) {
      this.selectedQueryPipelineObj = data;
      return;
    }
    return this.selectedQueryPipelineObj || {};
  }
  seedData(data?) {
    if (data) {
      this._seedData = data;
      this.seedData$.next(data);
      return;
    }
    return this._seedData;
  }

  loadSeedData() {
    this.service.invoke('findly.seed.data').subscribe({
      next: (res) => {
        this.seedData(res);
      },
    });
  }

  resolveHostUrl(): string {
    const url = window.location.protocol + '//' + window.location.host;
    if (url === 'https://staging-app.findly.ai') {
      return 'https://staging-bots.korebots.com';
    }
    if (url === 'https://pilots-app.findly.ai') {
      return 'https://pilot-bots.kore.ai';
    }
    if (url === 'https://app.findly.ai') {
      return 'https://bots.kore.ai';
    }
    return url;
  }
}
