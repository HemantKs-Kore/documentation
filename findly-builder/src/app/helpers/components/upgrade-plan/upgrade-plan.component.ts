import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { viewClassName } from '@angular/compiler';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { AuthService } from '@kore.services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  paymentGatewayModelPopRef: any;
  successFailureModelPopRef: any;
  termPlan = "Monthly";
  totalPlansData: any;
  filterPlansData: any;
  showPlanDetails: string;
  orderConfirmData: any;
  selectedPlan: any;
  selectedApp : any;
  serachIndexId : any;
  userInfo : any;
  currentSubscriptionPlan : any;
  urlSafe : any;
  transactionId : any;
  payementSuccess : true;
  payementResponse : any = {
    hostedPage : {
      transactionId : "",
      url :"https://store.payproglobal.com/checkout?products[1][id]=65066&products[1][qty]=1&page-template=2339&language=en&currency=USD&x-accountId=5ecfbf1407c1bd2347c4f199&x-resourceId=st-7a270f50-338b-5d82-8022-c2ef8e6b46da&x-transactionId=faTYYAH3g2GsdmthszR5kDT179I4&x-streamName=AmazeBot&exfo=742&use-test-mode=true&secret-key=_npaisT4eQ&emailoverride=akshay.gupta%40kore.com&x-isSearchbot=true"
    }
  };
  constructor(public dialog: MatDialog,
     private service: ServiceInvokerService,
     private appSelectionService : AppSelectionService,
     public workflowService: WorkflowService, 
     private authService: AuthService,
     public sanitizer: DomSanitizer,
     private notificationService: NotificationService) { }
  @ViewChild('orderConfirmModel') orderConfirmModel: KRModalComponent;
  @ViewChild('addPricingModel2') addPricingModel2: KRModalComponent;
  @ViewChild('choosePlanModel') choosePlanModel: KRModalComponent;
  @ViewChild('addPricingModel4') addPricingModel4: KRModalComponent;
  @ViewChild('addPricingModel5') addPricingModel5: KRModalComponent;
  @ViewChild('paymentGatewayModel') paymentGatewayModel: KRModalComponent;
  @ViewChild('successFailureModel') successFailureModel: KRModalComponent;
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
    if(!this.currentSubscriptionPlan){
      this.currentsubscriptionPlan(this.selectedApp)
    }
    this.getPlan();
  }
  currentsubscriptionPlan(app){
    const payload = {
      streamId: app._id
    };
    const appObserver = this.service.invoke('get.currentPlans', payload);
    appObserver.subscribe(res => {
      this.currentSubscriptionPlan = res
    }, errRes => {
      this.errorToaster(errRes, 'failed to get plans');
    });
  }
  poling(){
    setTimeout(()=>{
      this.getPayementStatus();
    },3000)
  }
  getPayementStatus(){
    const queryParams = {
      streamId : this.selectedApp._id,
      transactionId : this.payementResponse.hostedPage.transactionId
    };
    this.service.invoke('get.payementStatus',queryParams).subscribe(res => {
      if(res.state == 'success'){
        this.openSuccessFailurePopup(true)
      }else if(res.state == 'failed'){
        this.openSuccessFailurePopup(false)
      }else{
        this.poling();
      }
    }, errRes => {
      this.errorToaster(errRes, 'failed to get plans');
    });
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
    this.orderConfirmData = data;
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
    this.selectedPlan = data;
    this.choosePlanModalPopRef = this.choosePlanModel.open();
  }
  //close popup1
  closeChoosePlanPopup() {
    if (this.choosePlanModalPopRef && this.choosePlanModalPopRef.close) {
      this.choosePlanModalPopRef.close();
    }
  }
  //open payment gateway popup
  openPaymentGatewayPopup() {
    this.userInfo = this.authService.getUserInfo() || {};
    console.log(this.userInfo)
    const queryParams = {
      planId: this.orderConfirmData._id
    };
    const payload = {
        "streamId": this.selectedApp._id,
        "fName": this.userInfo.fName,
        "lName": this.userInfo.lName,
        "country": "India",
        "city": "Hyd",
        "address": "some address",
        "state": "Tel",
        "zip": 302016,
        "streamName": this.selectedApp.name,
        "quantity": 1
    }
    //let url = "https://store.payproglobal.com/checkout?products[1][id]=65066&products[1][qty]=1&page-template=2339&language=en&currency=USD&x-accountId=5ecfbf1407c1bd2347c4f199&x-resourceId=st-7a270f50-338b-5d82-8022-c2ef8e6b46da&x-transactionId=faTYYAH3g2GsdmthszR5kDT179I4&x-streamName=AmazeBot&exfo=742&use-test-mode=true&secret-key=_npaisT4eQ&emailoverride=akshay.gupta%40kore.com&x-isSearchbot=true" 
    //this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const appObserver = this.service.invoke('post.payement', queryParams ,payload);
    appObserver.subscribe(res => {
      this.payementResponse = res;
      // this.payementResponse = {
      //    "hostedPage" : {
      //   "transactionId": "faTYYAH3g2GsdmthszR5kDT179I4",
      //   "url": "https://store.payproglobal.com/checkout?products[1][id]=65066&products[1][qty]=1&page-template=2339&language=en&currency=USD&x-accountId=5ecfbf1407c1bd2347c4f199&x-resourceId=st-7a270f50-338b-5d82-8022-c2ef8e6b46da&x-transactionId=faTYYAH3g2GsdmthszR5kDT179I4&x-streamName=AmazeBot&exfo=742&use-test-mode=true&secret-key=_npaisT4eQ&emailoverride=akshay.gupta%40kore.com&x-isSearchbot=true"
      //   }
      // }
      let url = this.payementResponse.hostedPage.url;
      this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.getPayementStatus()
    }, errRes => {
      this.errorToaster(errRes, 'failed to get plans');
    });
    
    this.closeChoosePlanPopup();
    this.closeOrderConfPopup();
    this.paymentGatewayModelPopRef = this.paymentGatewayModel.open();

  }
  //close payment gateway popup
  closePaymentGatewayPopup() {
    if (this.paymentGatewayModelPopRef && this.paymentGatewayModelPopRef.close) {
      this.paymentGatewayModelPopRef.close();
    }
  }
  //open payment success/failure popup
  openSuccessFailurePopup(state?) {
    this.payementSuccess = state
    this.closePaymentGatewayPopup();
    this.successFailureModelPopRef = this.successFailureModel.open();
  }
  //close payment success/failure popup
  closeSuccessFailurePopup() {
    if (this.successFailureModelPopRef && this.successFailureModelPopRef.close) {
      this.successFailureModelPopRef.close();
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
  //based on choosePlanType in order confirm popup
  choosePlanType(type) {
    for (let plan of this.totalPlansData) {
      if (plan.type == this.orderConfirmData.type) {
        if (plan.billingUnit == type) {
          this.orderConfirmData = plan;
        }
      }
    }
  }
}
