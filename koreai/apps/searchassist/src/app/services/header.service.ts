import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Output() fromCallFlowExpand: EventEmitter<boolean> = new EventEmitter();
  @Output() openSearchSDKFromHeader: EventEmitter<any> = new EventEmitter();
  @Output() resultRankData: EventEmitter<any> = new EventEmitter();
  @Output() resetSearchConfiguration: EventEmitter<any> = new EventEmitter();
  @Output() openFaqExtractsFromDocker: EventEmitter<any> = new EventEmitter();
  @Output() showHideMainMenu: EventEmitter<any> = new EventEmitter();
  @Output() showHideSettingsMenu: EventEmitter<any> = new EventEmitter();
  @Output() showHideSourceMenu: EventEmitter<any> = new EventEmitter();
  @Output() headerMainMenuUpdate: EventEmitter<any> = new EventEmitter();
  @Output() hideSDK: EventEmitter<any> = new EventEmitter();
  @Output() savedSearchConfiguration: EventEmitter<any> = new EventEmitter();
  @Output() updatedResultTemplateMapping: EventEmitter<any> =
    new EventEmitter();
  isOnboardingPage = false;
  openJourneyForfirstTime = false;
  searchConfiguration: any;
  isSDKCached: boolean = false;
  isSDKOpen: boolean = false;
  toggle(data) {
    this.change.next(data);
  }

  fromDashboard(data) {
    this.fromCallFlowExpand.next(data);
  }

  openSearchSDK(data) {
    this.openSearchSDKFromHeader.next(data);
  }

  fromResultRank(data) {
    this.resultRankData.next(data);
  }

  updateSearchConfiguration() {
    this.resetSearchConfiguration.next(undefined);
  }

  openFaqExtracts() {
    this.openFaqExtractsFromDocker.next(undefined);
  }

  updateShowHideMainMenu(data) {
    this.showHideMainMenu.next(data);
  }

  updateShowHideSettingsMenu(data) {
    this.showHideSettingsMenu.next(data);
  }

  updateShowHideSourceMenu(data) {
    this.showHideSourceMenu.next(data);
  }

  updateMainMenuInHeader(data) {
    this.headerMainMenuUpdate.next(data);
  }

  updateSearchConfigurationValue(data) {
    this.savedSearchConfiguration.next(data);
  }

  updateResultTemplateMapping(data) {
    this.updatedResultTemplateMapping.next(data);
  }

  closeSdk() {
    this.hideSDK.next(undefined);
  }
}
