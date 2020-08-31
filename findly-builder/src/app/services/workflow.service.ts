import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  findlyAppsData: any = [];
  appCreationFlow = false;
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

  findlyApps(appData?) {
    if (appData) {
      this.findlyAppsData = appData;
    }
    return this.findlyAppsData;
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
    if (url === 'https://staging-app.findly.ai') { return 'https://staging-bots.korebots.com'; }
    if (url === 'https://pilots-app.findly.ai') { return 'https://pilot-bots.kore.ai'; }
    if (url === 'https://app.findly.ai') { return 'https://bots.kore.ai'; }
    return url;
  }
}
