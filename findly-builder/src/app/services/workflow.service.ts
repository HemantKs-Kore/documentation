import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DeflectAppConfig } from '../data/configurations.model';


@Injectable({
  providedIn: 'root'
})
export class workflowService {
  deflectAppsData: any = [];
  appCreationFlow = false;
  configurationData: DeflectAppConfig = null;
  completedPercentage = 0;
  _seedData: any;
  selectedAppForEdit: any;
  seedData$: BehaviorSubject<any> = new BehaviorSubject(null);
  disablePerfectScroll: boolean;
  constructor(
  ) { }

  showAppCreationHeader(value?) {
    if (value === true || value === false) {
      this.appCreationFlow = value;
    }
    return this.appCreationFlow;
  }

  deflectApps(appData?) {
    if (appData) {
      this.deflectAppsData = appData;
    }
    return this.deflectAppsData;
  }
  selectedApp(data?) {
    if (data) {
      this.selectedAppForEdit = data;
      return;
    }
    return this.selectedAppForEdit;
  }
  seedData(data?) {
    if (data) {
      this._seedData = data;
      this.seedData$.next(data);
      return;
    }
    return this._seedData;
  }
  resolveHostUrl(): string {
    const url = window.location.protocol + '//' + window.location.host;
    if (url === 'https://staging-app.deflect.ai') { return 'https://staging-bots.korebots.com'; }
    if (url === 'https://pilots-app.deflect.ai') { return 'https://pilot-bots.kore.ai'; }
    if (url === 'https://app.deflect.ai') { return 'https://bots.kore.ai'; }
    return url;
  }
}
