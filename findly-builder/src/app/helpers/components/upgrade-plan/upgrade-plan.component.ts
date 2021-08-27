import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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
import { LocalStoreService } from '@kore.services/localstore.service';
import * as FileSaver from 'file-saver';
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
  contactusModelPopRef: any;
  contactusSuccessModelPopRef: any;
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
  paymentStatusInterval: any;
  showLoader: boolean;
  btnDisable: boolean;
  invoiceOrderId: any;
  featuresExceededUsage: any;
  count_info: any = { show: false, msg: '' };
  contact_us_planName: string;
  showOverageErrorMsg: boolean = false;
  payementResponse: any = {
    hostedPage: {
      transactionId: "",
      url: "https://store.payproglobal.com/checkout?products[1][id]=65066&products[1][qty]=1&page-template=2339&language=en&currency=USD&x-accountId=5ecfbf1407c1bd2347c4f199&x-resourceId=st-7a270f50-338b-5d82-8022-c2ef8e6b46da&x-transactionId=faTYYAH3g2GsdmthszR5kDT179I4&x-streamName=AmazeBot&exfo=742&use-test-mode=true&secret-key=_npaisT4eQ&emailoverride=akshay.gupta%40kore.com&x-isSearchbot=true"
    }
  };
  plansIdList = {
    free: 'fp_free',
    standardMonth: 'standard_monthly',
    standardYear: 'standard_yearly',
    proMonth: 'pro_monthly',
    proYear: 'pro_yearly',
    enterpriceMonth: 'enterprise_monthly',
    enterpriceYear: 'enterprise_yearly'
  }
  enterpriseForm: any = {
    name: '', email: '', message: '', phone: ''
  }
  @Input() componentType: string;
  @Output() upgradedEvent = new EventEmitter();
  constructor(public dialog: MatDialog,
    private service: ServiceInvokerService,
    private appSelectionService: AppSelectionService,
    public workflowService: WorkflowService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    public localstore: LocalStoreService) { }
  @ViewChild('orderConfirmModel') orderConfirmModel: KRModalComponent;
  @ViewChild('addPricingModel2') addPricingModel2: KRModalComponent;
  @ViewChild('choosePlanModel') choosePlanModel: KRModalComponent;
  @ViewChild('addPricingModel4') addPricingModel4: KRModalComponent;
  @ViewChild('addPricingModel5') addPricingModel5: KRModalComponent;
  @ViewChild('paymentGatewayModel') paymentGatewayModel: KRModalComponent;
  @ViewChild('successFailureModel') successFailureModel: KRModalComponent;
  @ViewChild('changePlanModel') changePlanModel: KRModalComponent;
  @ViewChild('contactUsModel') contactUsModel: KRModalComponent;
  @ViewChild('contactUsSuccessModel') contactUsSuccessModel: KRModalComponent;
  @Output() overageModel = new EventEmitter<string>();
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent;
  ngOnInit(): void {
    this.getPlan();
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    // this.currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
    // if (!this.currentSubscriptionPlan) {
    //   this.currentsubscriptionPlan(this.selectedApp)
    // }
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
  poling(type?) {
    this.paymentStatusInterval = setInterval(() => {
      this.getPayementStatus(type);
    }, 3000)
  }
  getPayementStatus(type?) {
    const queryParams = {
      streamId: this.selectedApp._id,
      transactionId: this.payementResponse.hostedPage.transactionId || this.invoiceOrderId
    };
    this.service.invoke('get.payementStatus', queryParams).subscribe(res => {
      if (res.state == 'success') {
        this.btnDisable = false;
        if (type == 'overage') {
          this.overageModel.emit();
        }
        this.closeChoosePlanPopup();
        this.closeOrderConfPopup();
        this.openSuccessFailurePopup(true);
        this.notificationService.notify(type == "overage" ? res.state : 'Plan Changed successfully', 'success');
        clearInterval(this.paymentStatusInterval);
      } else if (res.state == 'failed') {
        this.closeChoosePlanPopup();
        this.openSuccessFailurePopup(false);
        clearInterval(this.paymentStatusInterval);
      }
    }, errRes => {
      this.errorToaster(errRes, 'failed to payment status');
    });
  }
  //get plans api
  getPlan() {
    this.service.invoke('get.pricingPlans').subscribe(res => {
      this.totalPlansData = res.sort((a, b) => { return a.displayOrder - b.displayOrder });
      this.typeOfPlan("Monthly");
      this.totalPlansData.forEach(data => {
        let dat = Object.values(data.featureAccess);
        data = Object.assign(data, { "featureData": dat });
      });
    }, errRes => {
      if (localStorage.jStorage) {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
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
    if (this.appSelectionService.currentsubscriptionPlanDetails) {
      this.currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
      this.selectedPlan = this.currentSubscriptionPlan.subscription;
    }
    this.orderConfirmModelPopRef = this.orderConfirmModel.open();
  }
  //close order confirm popup
  closeOrderConfPopup() {
    if (this.orderConfirmModelPopRef && this.orderConfirmModelPopRef.close) {
      this.orderConfirmModelPopRef.close();
      this.btnDisable = false;
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
      this.btnDisable = false;
    }
  }
  //open popup1
  openChoosePlanPopup(data?, info?) {
    this.count_info.show = info?.show != undefined ? info?.show : false;
    this.count_info.msg = info?.msg;
    this.choosePlanModalPopRef = this.choosePlanModel.open();
    if (this.appSelectionService.currentsubscriptionPlanDetails) {
      this.currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
      this.selectedPlan = this.currentSubscriptionPlan.subscription;
      if (this.currentSubscriptionPlan.subscription.billingUnit) {
        this.termPlan = this.currentSubscriptionPlan.subscription.billingUnit;
        this.typeOfPlan(this.termPlan);
      }
    }
    else {
      this.selectedPlan = data;
    }
  }
  //close popup1
  closeChoosePlanPopup() {
    if (this.choosePlanModalPopRef && this.choosePlanModalPopRef.close) {
      this.choosePlanModalPopRef.close();
      this.gotoDetails('')
      this.count_info = { show: false, msg: '' };
    }
  }

  //open payment gateway popup
  openPaymentGatewayPopup() {
    this.selectedApp = this.workflowService.selectedApp();
    this.showLoader = true;
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
      let url = this.payementResponse.hostedPage.url;
      this.invoiceOrderId = this.payementResponse.hostedPage.transactionId;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.poling();
    }, errRes => {
      this.errorToaster(errRes, 'failed');
    });
    // this.closeChoosePlanPopup();
    this.closeOrderConfPopup();
    this.paymentGatewayModelPopRef = this.paymentGatewayModel.open();
  }
  //open contact us popup
  openContactusModel(type) {
    this.contact_us_planName = type;
    const userInfo = this.localstore.getAuthInfo();
    this.enterpriseForm.name = userInfo.currentAccount.userInfo.fName;
    this.enterpriseForm.email = userInfo.currentAccount.userInfo.emailId;
    this.contactusModelPopRef = this.contactUsModel.open();
  }
  //close contactus popup
  closeContatcusModel() {
    if (this.contactusModelPopRef && this.contactusModelPopRef.close) {
      this.enterpriseForm = { name: '', email: '', message: '', phone: '' };
      this.contactusModelPopRef.close();
    }
  }
  //open contact us success popup
  openContactusSuccessModel() {
    this.contactusSuccessModelPopRef = this.contactUsSuccessModel.open();
  }
  //close contactus popup
  closeContatcusSuccessModel() {
    if (this.contactusSuccessModelPopRef && this.contactusSuccessModelPopRef.close) {
      this.contactusSuccessModelPopRef.close();
    }
  }
  //submitEnterpriseRequest method
  submitEnterpriseRequest() {
    this.btnDisable = true;
    const queryParams = { "streamId": this.selectedApp._id };
    const enterpriseRequest = this.service.invoke('post.enterpriseRequest', queryParams, this.enterpriseForm);
    enterpriseRequest.subscribe(res => {
      this.btnDisable = false;
      this.closeContatcusModel();
      this.closeChoosePlanPopup();
      this.closeOrderConfPopup();
      this.openContactusSuccessModel();
    }, errRes => {
      this.btnDisable = false;
      this.errorToaster(errRes, errRes.error && errRes.error.errors[0].code);
    });
  }
  //load iframe
  showSpinner() {
    this.showLoader = false;
  }
  //payment plan for upgrade/downgrade
  paymentPlan(show?) {
    this.btnDisable = true;
    this.selectedApp = this.workflowService.selectedApp();
    this.currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
    if (show == undefined) {
      show = this.currentSubscriptionPlan.subscription.planId == this.plansIdList.free ? true : false;
    }
    if (show) {
      this.buyOveragePayment();
    }
    else {
      if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.subscription.planId == this.plansIdList.free || this.selectedPlan && this.selectedPlan.status == 'expired') {
        this.openPaymentGatewayPopup();
      }
      else {
        const payload = { "streamId": this.selectedApp._id, "targetPlanId": this.orderConfirmData._id };
        const upgradePlan = this.service.invoke('put.planChange', {}, payload);
        upgradePlan.subscribe(res => {
          if (res.status == 'success') {
            this.invoiceOrderId = res.orderId;
            this.btnDisable = false;
            this.closeChoosePlanPopup();
            this.closeOrderConfPopup();
            if (res.type == 'downgrade') {
              this.notificationService.notify('Plan Changed successfully', 'success');
              this.appSelectionService.getCurrentSubscriptionData();
            }
            else {
              this.openSuccessFailurePopup(true);
            }
          }
          else if (res.status == "processing") {
            this.payementResponse.hostedPage.transactionId = res.transactionId;
            this.invoiceOrderId = res.orderId;
            this.poling("upgrade");
          }
          else if (res.status == 'failed') {
            this.openChangePlanModel();
            this.featuresExceededUsage = res.featuresExceededUsage;
          }
        }, errRes => {
          if (errRes && errRes.error && errRes.error.errors[0].code == 'ERR_FAILED_ACCESS_EXCEEDED') {
            this.openChangePlanModel();
            this.errorToaster(errRes, errRes.error && errRes.error.errors[0].code);
          }
          else {
            this.btnDisable = false;
            this.errorToaster(errRes, 'failed upgrade');
            this.openSuccessFailurePopup(false);
            this.closeChoosePlanPopup();
            this.closeOrderConfPopup();
          }
        });
      }
    }
  }
  //close payment gateway popup
  closePaymentGatewayPopup() {
    if (this.paymentGatewayModelPopRef && this.paymentGatewayModelPopRef.close) {
      if (this.paymentStatusInterval) {
        clearInterval(this.paymentStatusInterval);
      }
      this.paymentGatewayModelPopRef.close();
      //this.overageData = {};
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
      this.overageData = {};
      if (this.componentType == 'experiment') {
        this.upgradedEvent.emit();
      }
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
      if (data.planId == this.plansIdList.free || data.type == this.plansIdList.standardMonth || data.type == this.plansIdList.proMonth || data.type == this.plansIdList.enterpriceMonth) {
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
  }
  //based on choosePlanType in order confirm popup
  choosePlanType(type) {
    for (let plan of this.totalPlansData) {
      if (plan.name == this.orderConfirmData.name && plan.billingUnit == type) {
        this.orderConfirmData = plan;
      }
    }
  }
  //based on count change cost
  count(type, operator) {
    if (type == 'doc') {
      this.overageData.docCount = operator == 'plus' ? this.overageData.docCount + 1 : this.overageData.docCount >= 1 ? this.overageData.docCount - 1 : this.overageData.docCount = 0;
    }
    else if (type == 'query') {
      this.overageData.queryCount = operator == 'plus' ? this.overageData.queryCount + 1 : this.overageData.queryCount >= 1 ? this.overageData.queryCount - 1 : this.overageData.queryCount = 0;;
    }
  }
  //buy overage payment
  buyOveragePayment() {
    this.selectedApp = this.workflowService.selectedApp();
    let overage = [];
    if (this.overageData.docCount != null && this.overageData.docCount > 0) {
      overage.push({ "feature": "ingestDocs", "quantity": this.overageData.docCount })
    }
    if (this.overageData.queryCount != null && this.overageData.queryCount > 0) {
      overage.push({ "feature": "searchQueries", "quantity": this.overageData.queryCount })
    }
    if (overage.length) {
      this.showOverageErrorMsg = false;
      const queryParams = {
        "streamId": this.selectedApp._id,
        "subscriptionId": this.currentSubscriptionPlan.subscription._id
      }
      const payload = { "overages": overage };
      const buyOverage = this.service.invoke('put.buyOverage', queryParams, payload);
      buyOverage.subscribe(res => {
        this.invoiceOrderId = res.transactionId;
        this.poling("overage");
      }, errRes => {
        this.errorToaster(errRes, 'failed buy overage');
      });
    }
    else {
      this.btnDisable = false;
      this.showOverageErrorMsg = true;
    }
  }
  //gotoDetails
  gotoDetails(name) {
    this.showPlanDetails = name;
    setTimeout(() => {
      this.directiveScroll.directiveRef.scrollTo(420)
    }, 500)
  }
  //download invoice
  downloadInvoice() {
    this.selectedApp = this.workflowService.selectedApp();
    let queryParams = { "streamId": this.selectedApp._id };
    let url;
    if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.subscription.planId == this.plansIdList.free || this.overageData.overageShow || this.currentSubscriptionPlan == undefined) {
      queryParams = Object.assign({ ...queryParams, "transactionId": this.invoiceOrderId });
      url = 'get.getInvoiceDownload';
    }
    else {
      queryParams = Object.assign({ ...queryParams, "orderId": this.invoiceOrderId });
      url = 'get.paidInvoiceDownload';
    }
    const getInvoice = this.service.invoke(url, queryParams);
    getInvoice.subscribe(res => {
      if (this.overageData.overageShow) {
        for (let data of res) {
          FileSaver.saveAs(data.viewInvoice + '&DownloadPdf=true', 'invoice_' + data._id + '.pdf');
        }
      }
      else {
        if (res?.length) {
          FileSaver.saveAs(res[0].viewInvoice + '&DownloadPdf=true', 'invoice_' + res[0]._id + '.pdf');
        }
        else {
          FileSaver.saveAs(res.viewInvoice + '&DownloadPdf=true', 'invoice_' + res._id + '.pdf');
        }
      }
      // this.notificationService.notify('res.status', 'success');
    }, errRes => {
      this.errorToaster(errRes, 'Downloading Invoice failed');
    });
  }
}
