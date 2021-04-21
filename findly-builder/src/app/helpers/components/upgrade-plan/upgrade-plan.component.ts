import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss']
})
export class UpgradePlanComponent implements OnInit {

  addPricing1ModalPopRef: any;
  addPricing2ModalPopRef: any;
  addPricing3ModalPopRef: any;
  addPricing4ModalPopRef: any;
  addPricing5ModalPopRef: any;
  termPlan = "monthly";
  constructor(public dialog: MatDialog) { }
  @ViewChild('addPricingModel1') addPricingModel1: KRModalComponent;
  @ViewChild('addPricingModel2') addPricingModel2: KRModalComponent;
  @ViewChild('addPricingModel3') addPricingModel3: KRModalComponent;
  @ViewChild('addPricingModel4') addPricingModel4: KRModalComponent;
  @ViewChild('addPricingModel5') addPricingModel5: KRModalComponent;

  ngOnInit(): void {
  }
  //open popup1
  openPopup3() {
    this.addPricing3ModalPopRef = this.addPricingModel3.open();
  }
  //close popup1
  closePopup3() {
    if (this.addPricing3ModalPopRef && this.addPricing3ModalPopRef.close) {
      this.addPricing3ModalPopRef.close();
    }
  }
}
