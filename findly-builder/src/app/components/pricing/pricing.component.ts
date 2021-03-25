import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  addPricing1ModalPopRef: any;
  addPricing2ModalPopRef: any;
  addPricing3ModalPopRef: any;
  constructor(public dialog: MatDialog) { }
  @ViewChild('addPricingModel1') addPricingModel1: KRModalComponent;
  @ViewChild('addPricingModel2') addPricingModel2: KRModalComponent
  @ViewChild('addPricingModel3') addPricingModel3: KRModalComponent
  ngOnInit(): void {
  }
  //open popup1
  openPopup1() {
    this.addPricing1ModalPopRef = this.addPricingModel1.open();
  }
  //close popup1
  closePopup1() {
    if (this.addPricing1ModalPopRef && this.addPricing1ModalPopRef.close) {
      this.addPricing1ModalPopRef.close();
    }
  }

  //open popup1
  openPopup2() {
    this.addPricing2ModalPopRef = this.addPricingModel2.open();
  }
  //close popup1
  closePopup2() {
    if (this.addPricing2ModalPopRef && this.addPricing2ModalPopRef.close) {
      this.addPricing2ModalPopRef.close();
    }
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
