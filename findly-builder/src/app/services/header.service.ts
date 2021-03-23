import { Injectable, Output, EventEmitter } from '@angular/core'


@Injectable()
export class SideBarService {
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Output() fromCallFlowExpand: EventEmitter<boolean> = new EventEmitter();
  @Output() openSearchSDKFromHeader : EventEmitter<any> = new EventEmitter();
  @Output() resultRankData : EventEmitter<any> = new EventEmitter();
  @Output() resetSearchConfiguration : EventEmitter<any> = new EventEmitter();
  @Output() openFaqExtractsFromDocker : EventEmitter<any> = new EventEmitter();
  isOnboardingPage = false;
  searchConfiguration :any;
  toggle(data) {
    this.change.next(data);
  }

  fromDashboard(data){
    this.fromCallFlowExpand.next(data);
  }

  openSearchSDK(data){
    this.openSearchSDKFromHeader.next(data);
  }

  fromResultRank(data){
    this.resultRankData.next(data);
  }

  updateSearchConfiguration(){
    this.resetSearchConfiguration.next();
  }
  
  openFaqExtracts(){
    this.openFaqExtractsFromDocker.next();
  }
}