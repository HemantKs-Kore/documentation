import { Injectable, Output, EventEmitter } from '@angular/core'


@Injectable()
export class SideBarService {
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Output() fromCallFlowExpand: EventEmitter<boolean> = new EventEmitter();
  isOnboardingPage: boolean = false;
  
  toggle(data) {
    this.change.next(data);
  }

  fromDashboard(data){
    this.fromCallFlowExpand.next(data);
  }

}