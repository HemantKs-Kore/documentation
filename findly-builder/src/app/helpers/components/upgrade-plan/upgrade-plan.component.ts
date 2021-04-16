import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss']
})
export class UpgradePlanComponent implements OnInit {
  orderConfirmModelRef: any;
  addPricing2ModalPopRef: any;
  choosePlanModalPopRef: any;
  addPricing4ModalPopRef: any;
  addPricing5ModalPopRef: any;
  termPlan = "Monthly";
  totalPlansData: any;
  filterPlansData: any;
  currentPlan: string = 'Standard';
  showPlanDetails: string;
  constructor(public dialog: MatDialog, private service: ServiceInvokerService, private notificationService: NotificationService) { }
  @ViewChild('orderConfirmModel') orderConfirmModel: KRModalComponent;
  @ViewChild('addPricingModel2') addPricingModel2: KRModalComponent;
  @ViewChild('choosePlanModel') choosePlanModel: KRModalComponent;
  @ViewChild('addPricingModel4') addPricingModel4: KRModalComponent;
  @ViewChild('addPricingModel5') addPricingModel5: KRModalComponent;

  ngOnInit(): void {
    this.getPlan();
  }
  //get plans api
  getPlan() {
    this.service.invoke('get.pricingPlans').subscribe(res => {
      console.log("plans data", res);
      this.totalPlansData = res;
      this.typeOfPlan("Monthly");
    }, errRes => {
      this.errorToaster(errRes, 'failed to get plans');
    });
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  //open order confirm popup
  openOrderConfPopup(data?) {
    console.log("order confie=rm data", data);
    this.orderConfirmModelRef = this.orderConfirmModel.open();
  }
  //close order confirm popup
  closeOrderConfPopup() {
    if (this.orderConfirmModelRef && this.orderConfirmModelRef.close) {
      this.orderConfirmModelRef.close();
    }
  }
  //open popup1
  openChoosePlanPopup(data?) {
    console.log("choose plan data", data);
    this.choosePlanModalPopRef = this.choosePlanModel.open();
  }
  //close popup1
  closePopup3() {
    if (this.choosePlanModalPopRef && this.choosePlanModalPopRef.close) {
      this.choosePlanModalPopRef.close();
    }
  }
  //select type plan like monthly or yearly
  typeOfPlan(type) {
    this.filterPlansData = [];
    this.termPlan = type;
    for (let data of this.totalPlansData) {
      if (data.billingUnit && data.billingUnit == type) {
        this.filterPlansData.push(data);
      }
    }
  }
}
