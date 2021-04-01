import { Component, OnInit, ViewChild, Input, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { KRModalComponent } from '../../../shared/kr-modal/kr-modal.component';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-useronboarding-journey',
  templateUrl: './useronboarding-journey.component.html',
  styleUrls: ['./useronboarding-journey.component.scss']
})
export class UseronboardingJourneyComponent implements OnInit, OnChanges, OnDestroy {
  onBoardingModalPopRef: any;
  @Input() componentType;
  tourData: any;
  tourConfigData: any = [];
  checklistCount: number;
  userInfo: any = {};
  showSteps: boolean;
  showStatusIcon: boolean = true;
  prevStep;
  nextStep;
  subscribedShow: any;
  subscription: Subscription;
  status: string;
  steps: any = [{ name: 'Start by Adding Data', path: '/source' }, { name: 'Index Data', path: '/FieldManagementComponent' }, { name: 'Optimize Search Results', path: '/weights' }, { name: 'Design Search Experience', path: '/searchInterface' }, { name: 'Test the Application', path: '/resultranking' }, { name: 'Fine-Tune Relevance', path: '/resultranking' }];
  @ViewChild('onBoardingModalPop') onBoardingModalPop: KRModalComponent;
  constructor(private router: Router, private appSelectionService: AppSelectionService, private service: ServiceInvokerService, private notificationService: NotificationService, private authService: AuthService) { }
  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo() || {};
    this.appSelectionService.getTourConfig();
    this.subscription = this.appSelectionService.getTourConfigData.subscribe(res => {
      this.tourConfigData = res;
      this.tourData = res.onBoardingChecklist;
      this.trackChecklist();
    })
    this.appSelectionService.tourConfigCancel.subscribe(res => {
      this.subscribedShow = res.name;
      this.status = res.status;
      if (res.name != undefined && this.componentType != 'summary') {
        this.showSteps = res.name;
      }
      else {
        this.showSteps = true;
      }
    })
  }
  ngOnChanges() {
    if (this.componentType != '' && this.componentType != undefined && this.tourConfigData && this.componentType != 'summary') {
      if (this.componentType == 'overview') {
        this.appSelectionService.updateTourConfig('overview');
      }
    }
  }
  //open useronboard popup
  openOnBoardingModal() {
    this.onBoardingModalPopRef = this.onBoardingModalPop.open();
  }
  //open useronboard popup
  closeOnBoardingModal() {
    if (this.onBoardingModalPopRef && this.onBoardingModalPopRef.close) {
      this.onBoardingModalPopRef.close();
    }
  }
  //close checklist button
  closeChecklist(type?) {
    this.appSelectionService.tourConfigCancel.next({ name: false, status: 'pending' });
    if (type == 'self') {
      this.closeOnBoardingModal()
    }
  }
  //goto Routes
  gotoRoutes(step) {
    this.closeOnBoardingModal();
    //this.router.navigate([step], { skipLocationChange: true });
    this.appSelectionService.routeChanged.next({ name: 'pathchanged', path: step });
  }
  //track checklist count and show count number
  trackChecklist() {
    let count = 0;
    for (let key in this.tourData) {
      for (let key1 in this.tourData[key]) {
        if (this.tourData[key][key1]) {
          count = count + 1;
        }
      }
    }
    this.checklistCount = count;
    // let count = 0;
    // count = this.tourData[0].addDataVisited ? count + 1 : count;
    // count = this.tourData[1].indexDataVisited ? count + 1 : count;
    // count = this.tourData[2].optimiseSearchResultsVisited ? count + 1 : count;
    // count = this.tourData[3].designSearchExperienceVisited ? count + 1 : count;
    // count = this.tourData[4].testAppVisited ? count + 1 : count;
    // count = this.tourData[5].fineTuneRelevanceVisited ? count + 1 : count;
    // this.checklistCount = this.checklistCount + count;
    if (this.status == 'pending') {
      this.showSteps = this.checklistCount === 6 ? false : this.subscribedShow == undefined ? true : this.subscribedShow;
      if (this.checklistCount != 6 && this.componentType == 'summary') {
        this.showSteps = true;
      }
    }
    else {
      this.showSteps = true;
    }
    if (this.componentType != 'summary' && this.checklistCount != 6) {
      if (this.componentType == 'addData') {
        this.showStatusIcon = this.tourData[0].addDataVisited ? true : false;
        this.filterSteps(0, 0);
      }
      else if (this.componentType == 'indexing') {
        this.showStatusIcon = this.tourData[1].indexDataVisited ? true : false;
        this.filterSteps(1, 0);
      }
      else if (this.componentType == 'configure') {
        this.showStatusIcon = this.tourData[2].optimiseSearchResultsVisited ? true : false;
        this.filterSteps(2, 0);
      }
      else if (this.componentType == 'designing') {
        this.showStatusIcon = this.tourData[3].designSearchExperienceVisited ? true : false;
        this.filterSteps(3, 0);
      }
      else if (this.componentType == 'test') {
        this.showStatusIcon = this.tourData[4].testAppVisited ? true : false;
        this.filterSteps(4, 0);
      }
      else if (this.componentType == 'optimize') {
        this.showStatusIcon = this.tourData[5].fineTuneRelevanceVisited ? true : false;
        this.filterSteps(5, 0);
      }
    }
    else {
      this.showStatusIcon = true;
    }
  }
  //filter prev and next step
  filterSteps(prev, next) {
    let data = [];
    let pre, nex;
    for (let key in this.tourData) {
      if (key < prev) {
        for (let key1 in this.tourData[key]) {
          if (this.tourData[key][key1]) {
            pre = key;
          }
        }
      }
      if (key >= next) {
        for (let key1 in this.tourData[key]) {
          if (!this.tourData[key][key1]) {
            data.push(key);
            nex = data[0];
          }
        }
      }
    }
    this.prevStep = pre == undefined ? 'undefined' : this.steps[pre];
    this.nextStep = nex == undefined ? 'undefined' : this.steps[parseInt(nex)];
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
