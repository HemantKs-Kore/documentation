import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { KRModalComponent } from '../../../shared/kr-modal/kr-modal.component';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AppSelectionService } from '@kore.services/app.selection.service'
@Component({
  selector: 'app-useronboarding-journey',
  templateUrl: './useronboarding-journey.component.html',
  styleUrls: ['./useronboarding-journey.component.scss']
})
export class UseronboardingJourneyComponent implements OnInit, OnChanges {
  onBoardingModalPopRef: any;
  @Input() componentType;
  @Input() showChecklist;
  tourData: any;
  checklistCount: number;
  @ViewChild('onBoardingModalPop') onBoardingModalPop: KRModalComponent;
  constructor(private router: Router, private appSelectionService: AppSelectionService, private service: ServiceInvokerService) { }
  ngOnInit(): void {
    this.appSelectionService.getTourConfig().subscribe(res => {
      this.tourData = res.configurations.onBoardingChecklist;
      console.log(" this.tourData", this.tourData);
      this.trackChecklist();
    })
  }
  ngOnChanges() {
    if (this.componentType != '' && this.componentType != undefined) {
      this.updateChecklist();
    }
    if (this.showChecklist != '' && this.showChecklist != undefined) {
      console.log("showChecklist", this.showChecklist)
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
  //goto Routes
  gotoRoutes(step) {
    this.closeOnBoardingModal();
    this.router.navigate([step], { skipLocationChange: true });
  }
  //update onboarding checklist
  updateChecklist() {
    console.log("checklist type", this.componentType);
  }
  //track checklist count and show count number
  trackChecklist() {
    let count = 0;
    count = this.tourData[0].addDataVisited ? count + 1 : count;
    count = this.tourData[1].indexDataVisited ? count + 1 : count;
    count = this.tourData[2].optimiseSearchResultsVisited ? count + 1 : count;
    count = this.tourData[3].designSearchExperienceVisited ? count + 1 : count;
    count = this.tourData[4].testAppVisited ? count + 1 : count;
    count = this.tourData[5].fineTuneRelevanceVisited ? count + 1 : count;
    this.checklistCount = count;
  }
}
