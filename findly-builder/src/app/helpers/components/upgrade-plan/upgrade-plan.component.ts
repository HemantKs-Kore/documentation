import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { viewClassName } from '@angular/compiler';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { AuthService } from '@kore.services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
declare const $: any;
@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss']
})
export class UpgradePlanComponent implements OnInit {
  orderConfirmModelPopRef: any;
  choosePlanModalPopRef: any;
  paymentGatewayModelPopRef: any;
  successFailureModelPopRef: any;
  changePlanModelPopRef: any;
  termPlan = "Monthly";
  totalPlansData: any;
  filterPlansData: any;
  showPlanDetails: string = '';
  orderConfirmData: any;
  selectedPlan: any;
  selectedApp: any;
  serachIndexId: any;
  userInfo: any;
  currentSubscriptionPlan: any;
  urlSafe: any;
  transactionId: any;
  payementSuccess: true;
  overageData: any;
  listPlanFeaturesData: any;
  payementResponse: any = {
    hostedPage: {
      transactionId: "",
      url: "https://store.payproglobal.com/checkout?products[1][id]=65066&products[1][qty]=1&page-template=2339&language=en&currency=USD&x-accountId=5ecfbf1407c1bd2347c4f199&x-resourceId=st-7a270f50-338b-5d82-8022-c2ef8e6b46da&x-transactionId=faTYYAH3g2GsdmthszR5kDT179I4&x-streamName=AmazeBot&exfo=742&use-test-mode=true&secret-key=_npaisT4eQ&emailoverride=akshay.gupta%40kore.com&x-isSearchbot=true"
    }
  };
  plansIdList = {
    free: 'free',
    standardMonth: 'standard_monthly',
    standardYear: 'standard_yearly',
    proMonth: 'pro_monthly',
    proYear: 'pro_yearly',
    enterpriceMonth: 'enterprise_monthly',
    enterpriceYear: 'enterprise_yearly'
  }
  constructor(public dialog: MatDialog,
    private service: ServiceInvokerService,
    private appSelectionService: AppSelectionService,
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
  @ViewChild('changePlanModel') changePlanModel: KRModalComponent;
  @Output() overageModel = new EventEmitter<string>();
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent;
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
    if (!this.currentSubscriptionPlan) {
      this.currentsubscriptionPlan(this.selectedApp)
    }
    this.getPlan();
  }
  currentsubscriptionPlan(app) {
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
  poling() {
    setTimeout(() => {
      this.getPayementStatus();
    }, 3000)
  }
  getPayementStatus() {
    const queryParams = {
      streamId: this.selectedApp._id,
      transactionId: this.payementResponse.hostedPage.transactionId
    };
    this.service.invoke('get.payementStatus', queryParams).subscribe(res => {
      if (res.state == 'success') {
        this.openSuccessFailurePopup(true)
      } else if (res.state == 'failed') {
        this.openSuccessFailurePopup(false)
      } else {
        this.poling();
      }
    }, errRes => {
      this.errorToaster(errRes, 'failed to get plans');
    });
  }
  //get plans api
  getPlan() {
    this.service.invoke('get.pricingPlans').subscribe(res => {
      this.totalPlansData = res;
      this.typeOfPlan("Monthly");
      this.totalPlansData.forEach(data => {
        let dat = Object.values(data.featureAccess);
        data = Object.assign(data, { "featureData": dat });
      });
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
  openOrderConfPopup(data?, obj?) {
    this.overageData = obj == undefined ? { overageShow: false } : obj;
    this.orderConfirmData = data;
    this.orderConfirmModelPopRef = this.orderConfirmModel.open();
  }
  //close order confirm popup
  closeOrderConfPopup() {
    if (this.orderConfirmModelPopRef && this.orderConfirmModelPopRef.close) {
      this.orderConfirmModelPopRef.close();
    }
  }
  //open changePlanModel popup
  openChangePlanModel() {
    this.changePlanModelPopRef = this.changePlanModel.open();
  }
  //close changePlanModel popup
  closeChangePlanModel() {
    if (this.changePlanModelPopRef && this.changePlanModelPopRef.close) {
      this.changePlanModelPopRef.close();
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
    const appObserver = this.service.invoke('post.payement', queryParams, payload);
    appObserver.subscribe(res => {
      this.payementResponse = res;
      // this.payementResponse = {
      //    "hostedPage" : {
      //   "transactionId": "faTYYAH3g2GsdmthszR5kDT179I4",
      //   "url": "https://store.payproglobal.com/checkout?products[1][id]=65066&products[1][qty]=1&page-template=2339&language=en&currency=USD&x-accountId=5ecfbf1407c1bd2347c4f199&x-resourceId=st-7a270f50-338b-5d82-8022-c2ef8e6b46da&x-transactionId=faTYYAH3g2GsdmthszR5kDT179I4&x-streamName=AmazeBot&exfo=742&use-test-mode=true&secret-key=_npaisT4eQ&emailoverride=akshay.gupta%40kore.com&x-isSearchbot=true"
      //   }
      // }
      let url = this.payementResponse.hostedPage.url;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.getPayementStatus()
    }, errRes => {
      this.errorToaster(errRes, 'failed to get plans');
    });
    this.closeChoosePlanPopup();
    this.closeOrderConfPopup();
    this.paymentGatewayModelPopRef = this.paymentGatewayModel.open();
  }
  //payment plan for upgrade/downgrade
  paymentPlan(show) {
    if (show) {
      this.buyOveragePayment();
    }
    else {
      if (this.currentSubscriptionPlan.subscription.planId == this.plansIdList.free) {
        this.openPaymentGatewayPopup()
      }
      else {
        const payload = { "streamId": this.selectedApp._id, "targetPlanId": this.orderConfirmData._id };
        const upgradePlan = this.service.invoke('put.planChange', {}, payload);
        upgradePlan.subscribe(res => {
          console.log("upgrade", res);
          if (res.status == 'success') {
            this.openSuccessFailurePopup(true);
            this.closeChoosePlanPopup();
            this.closeOrderConfPopup();
          }
        }, errRes => {
          if (errRes && errRes.error && errRes.error.errors[0].code == 'ERR_FAILED_ACCESS_EXCEEDED') {
            this.openChangePlanModel();
            this.errorToaster(errRes, errRes.error && errRes.error.errors[0].code);
          }
          else {
            this.errorToaster(errRes, 'failed upgrade');
            this.openSuccessFailurePopup(false);
          }
        });
      }
    }
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
    this.appSelectionService.getCurrentSubscriptionData();
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
      if (data.billingUnit && data.billingUnit == type || data.planId == 'fp_free') {
        this.filterPlansData.push(data);
      }
    }
    let listData = [...this.totalPlansData];
    this.listPlanFeaturesData = [];
    let listDataMonthlyFeature = [];
    listData.forEach(data => {
      Object.keys(data.featureAccess);
      Object.values(data.featureAccess);
      Object.entries(data.featureAccess);
      /** Pick only the Month Plans */
      if (data.type == this.plansIdList.free || data.type == this.plansIdList.standardMonth || data.type == this.plansIdList.proMonth || data.type == this.plansIdList.enterpriceMonth) {
        listDataMonthlyFeature.push(Object.entries(data.featureAccess))
      }
    })
    for (let i = 1; i <= listDataMonthlyFeature.length; i++) {
      if (listDataMonthlyFeature[i]) {
        for (let j = 0; j < listDataMonthlyFeature[i].length; j++) {
          if (listDataMonthlyFeature[i][j]) {
            if (listDataMonthlyFeature[i][j][0] == listDataMonthlyFeature[0][j][0]) { //comapre 3 records with 1st record's Key
              listDataMonthlyFeature[0][j].push(listDataMonthlyFeature[i][j][1])       // push the values array in 1st record
            }
          }
        }
      }
    }
    this.listPlanFeaturesData = listDataMonthlyFeature;
    console.log("this.listPlanFeaturesData", this.listPlanFeaturesData)
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
  //based on count change cost
  count(type, operator) {
    if (type == 'doc') {
      this.overageData.docCount = operator == 'plus' ? this.overageData.docCount + 1 : this.overageData.docCount > 1 ? this.overageData.docCount - 1 : this.overageData.docCount = 1;
    }
    else if (type == 'query') {
      this.overageData.queryCount = operator == 'plus' ? this.overageData.queryCount + 1 : this.overageData.queryCount > 1 ? this.overageData.queryCount - 1 : this.overageData.queryCount = 1;
    }
  }
  //buy overage payment
  buyOveragePayment() {
    let overage = [];
    if (this.overageData.docCount != null) {
      overage.push({ "feature": "ingestDocs", "quantity": this.overageData.docCount })
    }
    if (this.overageData.queryCount != null) {
      overage.push({ "feature": "searchQueries", "quantity": this.overageData.queryCount })
    }
    const queryParams = {
      "streamId": this.selectedApp._id,
      "subscriptionId": this.currentSubscriptionPlan.subscription._id
    }
    const payload = { "overages": overage };
    const buyOverage = this.service.invoke('put.buyOverage', queryParams, payload);
    buyOverage.subscribe(res => {
      this.notificationService.notify(res.status, 'success');
      this.overageData = {};
      this.overageModel.emit();
      this.closeOrderConfPopup();
      this.openSuccessFailurePopup(true);
    }, errRes => {
      this.errorToaster(errRes, 'failed buy overage');
    });
  }
  //gotoDetails
  gotoDetails(name) {
    this.showPlanDetails = name;
    setTimeout(() => {
      this.directiveScroll.directiveRef.scrollTo(420)
    }, 500)
  }
}
