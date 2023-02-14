import { Component, ChangeDetectionStrategy, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { ConstantsService } from '@kore.services/constants.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { AuthService } from '@kore.services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { LocalStoreService } from '@kore.services/localstore.service';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { plansName } from '../../plan-names.constants';
import { KRModalComponent } from '@kore.apps/shared/kr-modal/kr-modal.component';

declare const $: any;

@Component({
  selector: 'app-plan-upgrade',
  templateUrl: './plan-upgrade.component.html',
  styleUrls: ['./plan-upgrade.component.scss']
})
export class PlanUpgradeComponent {
  addOverageModalPopRef: any;
  choosePlanModalPopRef: any;
  paymentGatewayModelPopRef: any;
  contactusModelPopRef: any;
  contactusSuccessModelPopRef: any;
  changePlanModelPopRef: any;
  confirmUpgradeModelPopRef: any;
  freePlanUpgradeModelPopRef: any;
  onboardingJournyModelPopRef: any;

  private _array = Array;
  planNames = plansName;
  overagesObject: any = { isOpted: false, optIn: true, isCheckboxEnabled: true };
  validations = false;
  countriesList: Array<Object> = []
  search_country = '';
  termPlan = "month";
  featureTypes: any = [];
  frequentFAQs: any = [];
  planHoverText: Object = {};
  totalPlansData: Array<any> = [];
  filterPlansData: Array<any> = [];
  orderConfirmData: any;
  selectedPlan: any = {};
  selectedApp: any;
  serachIndexId: any;
  urlSafe: any;
  transactionId: any;
  listPlanFeaturesData: any;
  paymentStatusInterval: any;
  invoiceOrderId: any;
  featuresExceededUsage: any = [];
  upgradePlanData: any = {};
  selectedPaymentPage = 'payment_confirm';
  showLoader: boolean;
  payementResponse: any = {
    hostedPage: {
      transactionId: "",
      url: ""
    }
  };
  plansIdList = {
    standardMonth: 'standard_monthly',
    standardYear: 'standard_yearly',
    enterpriceYear: 'enterprise'
  }
  currentSubsciptionData: Subscription;
  isOverageShow = false;
  btnLoader = false;
  enterpriseForm: any = { name: '', email: '', message: '', phone: '', company: '', country: '', targetPlan: '', currentPlan: '' };
  enterpriseRadioBtnArray: Array<Object> = [{ name: 'plan_modify_plan', value: 'Modify My Current Plan' }, { name: 'plan_downgrade_standard', value: 'Downgrade to Standard Plan' }];


  constructor(public dialog: MatDialog,
    private service: ServiceInvokerService,
    private appSelectionService: AppSelectionService,
    private constantsService: ConstantsService,
    public workflowService: WorkflowService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private notificationService: NotificationService,
    public localstore: LocalStoreService) { }

  @ViewChild('addOverageModel') addOverageModel: KRModalComponent;
  @ViewChild('changePlanModel') changePlanModel: KRModalComponent;
  @ViewChild('choosePlanModel') choosePlanModel: KRModalComponent;
  @ViewChild('paymentGatewayModel') paymentGatewayModel: KRModalComponent;
  @ViewChild('contactUsModel') contactUsModel: KRModalComponent;
  @ViewChild('onboardingJournyModel') onboardingJournyModel: KRModalComponent;
  @ViewChild('confirmUpgradeModel') confirmUpgradeModel: KRModalComponent;
  @Output() updateBanner = new EventEmitter<{}>();
  @Output() upgradedEvent = new EventEmitter();
  @Input() componentType: string;
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent;
  @ViewChild('freePlanUpgradeModel') freePlanUpgradeModel: KRModalComponent;


  async ngOnInit() {
    this.getAllPlans();
    this.countriesList = this.constantsService.countriesList;
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.currentSubsciptionData = this.appSelectionService.currentSubscription.subscribe(res => {
      this.selectedPlan = res?.subscription;
      const billingUnit = (this.selectedPlan?.billing?.unit) || 'month';
      this.typeOfPlan(billingUnit);
    });
  }

  //clear country in contact us form
  clearcontent() {
    if ($('#searchBoxId') && $('#searchBoxId').length) {
      $('#searchBoxId')[0].value = "";
      this.search_country = '';
    }
  }

  //get plans api
  getAllPlans() {
    const allPlans: any = this.appSelectionService?.pricingPlansData;
    if (allPlans) {
      this.featureTypes = allPlans?.featureTypes;
      this.frequentFAQs = allPlans?.FAQS;
      this.totalPlansData = allPlans?.plans;
      this.planHoverText = allPlans?.hoverText;
      this.totalPlansData.forEach(data => {
        const featureData = Object.values(data.featureAccess);
        data = Object.assign(data, { "featureData": featureData });
      });
      this.typeOfPlan();
    }
  }

  //select type plan like monthly or yearly
  typeOfPlan(type?) {
    this.listPlanFeaturesData = [];
    const listDataMonthlyFeature = [];
    const billingUnit = (type) ? type : (this.selectedPlan?.billing?.unit || 'month');
    this.filterPlansData = [];
    this.termPlan = billingUnit;
    if (this.totalPlansData.length > 0) {
      this.totalPlansData?.forEach(data => {
        if (data?.billing?.unit === billingUnit || data?.type === 'enterprise') this.filterPlansData.push(data);
      })
      const listData = [...this.totalPlansData];
      listData.forEach(data => {
        Object.keys(data.featureAccess);
        Object.values(data.featureAccess);
        Object.entries(data.featureAccess);
        /** Pick only the Month Plans */
        if (data.type == this.plansIdList.standardMonth || data.type == this.plansIdList.enterpriceYear) {
          listDataMonthlyFeature.push(Object.entries(data.featureAccess))
        }
      })
      for (let i = 1; i <= listDataMonthlyFeature?.length; i++) {
        if (listDataMonthlyFeature[i]) {
          for (let j = 0; j < listDataMonthlyFeature[i].length; j++) {
            if (listDataMonthlyFeature[i][j]) {
              if (listDataMonthlyFeature[i][j][0] == listDataMonthlyFeature[0][j][0]) {
                const hover_text = this.getHoverText(listDataMonthlyFeature[0][j][0]);
                const Obj = { ...listDataMonthlyFeature[i][j][1], hoverText: hover_text };
                listDataMonthlyFeature[0][j].push(Obj)       // push the values array in 1st record
              }
            }
          }
        }
      }
      this.listPlanFeaturesData = listDataMonthlyFeature;
    }
  }

  //fetch hoverText from HoverText Object
  getHoverText(text) {
    let Text = '';
    const Data = Object.entries(this.planHoverText);
    if (Data?.length) {
      for (const item of Data) {
        if (item[0] === text) Text = item[1];
      }
    }
    return Text
  }

  //trackBy for filterPlansData Array
  trackByPlans(index, item) {
    return item?.planId;
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

  //open popup based on input parameter
  openSelectedPopup(type) {
    if (type === 'choose_plan') {
      if (this.appSelectionService.currentsubscriptionPlanDetails) {
        const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
        this.selectedPlan = currentSubscriptionPlan?.subscription;
        this.getAllPlans();
        this.choosePlanModalPopRef = this.choosePlanModel.open();
      }
    }
    else if (type === 'payment_gateway') {
      this.paymentGatewayModelPopRef = this.paymentGatewayModel.open();
    }
    else if (type === 'add_overage') {
      this.overageModal('open');
    }
    else if (type === 'free_upgrade') {
      this.freePlanUpgradeModelPopRef = this.freePlanUpgradeModel.open();
    }
    else if (type === 'onboardingJourny') {
      this.onboardingJournyModelPopRef = this.onboardingJournyModel.open();
    }
  }

  //close popup based on input parameter
  closeSelectedPopup(type) {
    if (type === 'choose_plan') {
      const billingUnit = (this.selectedPlan?.billing?.unit) || 'month';
      this.termPlan = billingUnit;
      this.typeOfPlan(billingUnit);
      if (this.choosePlanModalPopRef?.close) this.choosePlanModalPopRef.close();
    }
    else if (type === 'payment_gateway') {
      this.selectedPaymentPage = 'payment_confirm';
      this.orderConfirmData = {};
      if (this.paymentStatusInterval) clearInterval(this.paymentStatusInterval);
      if (this.paymentGatewayModelPopRef?.close) this.paymentGatewayModelPopRef.close();
      if (this.componentType == 'experiment') {
        this.upgradedEvent.emit();
      }
    }
    else if (type === 'free_upgrade') {
      if (this.freePlanUpgradeModelPopRef?.close) this.freePlanUpgradeModelPopRef.close();
    }
    else if (type === 'onboardingJourny') {
      if (this.onboardingJournyModelPopRef?.close) this.onboardingJournyModelPopRef.close();
    }
  }

  //let's explore button event
  exploreButton() {
    this.closeSelectedPopup('onboardingJourny');
    //this.openSelectedPopup('choose_plan');
    this.contactusModel('open');
  }

  //close or open confirmUpgradeModel
  closeConfirmUpgradeModal(type, data?) {
    if (type === 'open') {
      this.upgradePlanData = data;
      this.confirmUpgradeModelPopRef = this.confirmUpgradeModel.open();
    }
    else if (type === 'close') {
      if (this.confirmUpgradeModelPopRef?.close) {
        this.btnLoader = false;
        this.confirmUpgradeModelPopRef?.close();
        this.upgradePlanData = {};
      }
    }
  }

  //hide spinner in payment page
  showHideSpinner() {
    setTimeout(() => {
      this.showLoader = false;
    }, 1500)
  }

  //open payment gateway popup
  openPaymentGateway() {
    this.btnLoader = true;
    this.showLoader = true;
    this.selectedApp = this.workflowService.selectedApp();
    const userInfo: any = this.authService.getUserInfo() || {};
    const queryParams = {
      planId: this.orderConfirmData._id
    };
    const payload = {
      "streamId": this.selectedApp._id,
      "fName": userInfo.fName,
      "lName": userInfo.lName,
      "country": "India",
      "city": "Hyd",
      "address": "some address",
      "state": "Tel",
      "zip": 302016,
      "streamName": this.selectedApp.name,
      "quantity": 1
    }
    const appObserver = this.service.invoke('post.payement', queryParams, payload);
    appObserver.subscribe(res => {
      this.payementResponse = res;
      const url = this.payementResponse.hostedPage.url;
      this.invoiceOrderId = this.payementResponse.hostedPage.transactionId;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.btnLoader = false;
      this.selectedPaymentPage = 'payment_iframe';
      this.poling();
    }, errRes => {
      this.btnLoader = false;
      this.errorToaster(errRes, 'failed');
    });
  }

  //status call using poling method
  poling() {
    this.paymentStatusInterval = setInterval(() => {
      this.getPayementStatus();
    }, 3000)
  }

  //payment status api
  getPayementStatus() {
    const queryParams = {
      streamId: this.selectedApp._id,
      transactionId: this.payementResponse.hostedPage.transactionId || this.invoiceOrderId
    };
    this.service.invoke('get.payementStatus', queryParams).subscribe(res => {
      if (res.state == 'success') {
        clearInterval(this.paymentStatusInterval);
        this.appSelectionService.getCurrentSubscriptionData();
        const message = 'Plan Changed successfully';
        this.notificationService.notify(message, 'success');
        this.selectedPaymentPage = 'payment_success';
        const obj = { msg: `Your previous payment of $ ${this.orderConfirmData?.planAmount} is processed successfully.`, type: 'success' };
        this.updateBanner.emit(obj);
        this.closeConfirmUpgradeModal('close');
      } else if (res.state == 'failed') {
        clearInterval(this.paymentStatusInterval);
        const obj = { msg: `Your previous payment of $ ${this.orderConfirmData?.planAmount} was not processed. Please retry to upgrade your plan.`, type: 'failed' };
        this.updateBanner.emit(obj);
        if (this.btnLoader) this.btnLoader = false;
        this.selectedPaymentPage = 'payment_fail';
      }
    }, errRes => {
      this.errorToaster(errRes, 'failed to payment status');
    });
  }

  //open contact us popup
  contactusModel(type, plan?) {
    if (type === 'open') {
      const userInfo = this.localstore.getAuthInfo();
      this.enterpriseForm.name = userInfo?.currentAccount?.userInfo?.fName;
      this.enterpriseForm.email = userInfo?.currentAccount?.userInfo?.emailId;
      if (plan) {
        this.enterpriseForm.targetPlan = (plan?.billingUnit && plan?.name !== 'Enterprise') ? `${plan?.name} Plan(${plan?.billingUnit})` : (plan?.name + ' Plan');
        this.enterpriseForm.currentPlan = this.selectedPlan?.planName + ' Plan: ' + (this.selectedPlan?.billingUnit && (this.selectedPlan?.billingUnit));
      }
      this.contactusModelPopRef = this.contactUsModel.open();
    }
    else if (type === 'close') {
      this.enterpriseForm = { name: '', email: '', message: '', phone: '', company: '', country: '', targetPlan: '', currentPlan: '' };
      if (this.contactusModelPopRef?.close) this.contactusModelPopRef.close();
      this.validations = false;
      this.clearcontent();
    }
  }

  //open or close excess modal popup
  openExcessDataPopup(type) {
    if (type === 'open') {
      this.changePlanModelPopRef = this.changePlanModel.open();
    }
    else if (type === 'close') {
      if (this.changePlanModelPopRef?.close) this.changePlanModelPopRef.close();
    }
  }

  //submitEnterpriseRequest method
  submitEnterpriseRequest() {
    this.btnLoader = true;
    this.validations = true;
    this.selectedApp = this.workflowService.selectedApp();
    const queryParams = { "streamId": this.selectedApp?._id };
    const enterpriseRequest = this.service.invoke('post.enterpriseRequest', queryParams, this.enterpriseForm);
    enterpriseRequest.subscribe(res => {
      this.btnLoader = false;
      this.contactusModel('close');
      this.notificationService.notify('Thanks for providing the details', 'success');
    }, errRes => {
      this.btnLoader = false;
      this.errorToaster(errRes, errRes.error && errRes.error.errors[0].code);
    });
  }

  //payment plan for upgrade/downgrade
  downgradePlan() {
    this.btnLoader = true;
    this.orderConfirmData = this.upgradePlanData;
    this.selectedApp = this.workflowService.selectedApp();
    const payload = { "streamId": this.selectedApp._id, "targetPlanId": this.upgradePlanData?._id };
    const upgradePlan = this.service.invoke('put.planChange', {}, payload);
    upgradePlan.subscribe(res => {
      if (res.status === 'success' && res.type === 'downgrade') {
        this.closeSelectedPopup('choose_plan');
        this.notificationService.notify('Plan Changed successfully', 'success');
        this.appSelectionService.getCurrentSubscriptionData();
        const endDate = moment(this.selectedPlan.endDate).format("Do MMMM YYYY");
        const obj = { msg: `Your plan will be changed from Standard to Free by the end of the billing cycle i.e. ${endDate}.`, type: 'downgrade' };
        this.updateBanner.emit(obj);
        this.closeConfirmUpgradeModal('close');
      }
      else if (res.status === 'processing' && res.type === 'upgrade') {
        this.invoiceOrderId = res.transactionId;
        this.poling();
      }
      else if (res.status === 'failed' && res.code === 'ERR_FAILED_ACCESS_EXCEEDED') {
        this.featuresExceededUsage = res?.featuresExceededUsage;
        this.btnLoader = false;
        this.openExcessDataPopup('open');
      }
    }), errRes => {
      this.btnLoader = false;
      this.errorToaster(errRes, errRes?.error?.errors[0].code);
    };
  }

  //close payment gateway popup
  closePaymentGatewayPopup() {
    if (this.paymentGatewayModelPopRef && this.paymentGatewayModelPopRef.close) {
      if (this.paymentStatusInterval) {
        clearInterval(this.paymentStatusInterval);
      }
      this.paymentGatewayModelPopRef.close();
    }
  }

  //based on choosePlanType in order confirm popup
  choosePlanType(type) {
    const data = this.totalPlansData.filter(plan => plan.name == this.orderConfirmData.name && plan.billing?.unit == type);
    this.orderConfirmData = data[0];
  }

  //open | close add overage modal
  overageModal(type) {
    if (type === 'open') {
      const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
      this.overagesObject.isOpted = (currentSubscriptionPlan?.overage?.isRecurring) ? true : false;
      this.addOverageModalPopRef = this.addOverageModel.open();
    }
    else if (type === 'close') {
      this.selectedPlan = {};
      this.overagesObject = { isOpted: false, optIn: true, isCheckboxEnabled: true };
      this.appSelectionService.getCurrentSubscriptionData();
      if (this.addOverageModalPopRef?.close) this.addOverageModalPopRef.close();
    }
    else if (type === 'close_notification') {
      const element: any = document.getElementsByClassName('current-billing-notification');
      if (element.length) element[0].style.visibility = 'hidden';
    }
  }

  //add overage api
  buyOverage() {
    this.btnLoader = true;
    this.selectedApp = this.workflowService.selectedApp();
    const queryParams = {
      "streamId": this.selectedApp._id
    }
    const payload = { "optIn": !this.overagesObject.isOpted };
    const buyOverage = this.service.invoke('post.buyOverage', queryParams, payload);
    buyOverage.subscribe(res => {
      this.btnLoader = false;
      this.overageModal('close');
    }, errRes => {
      this.btnLoader = false;
      this.errorToaster(errRes, 'failed buy overage');
    });
  }

  //download invoice
  downloadInvoice() {
    this.selectedApp = this.workflowService.selectedApp();
    const queryParams = { "streamId": this.selectedApp?._id, "transactionId": this.invoiceOrderId };
    const getInvoice = this.service.invoke('get.getInvoiceDownload', queryParams);
    getInvoice.subscribe(res => {
      if (res?.length) {
        FileSaver.saveAs(res[0].viewInvoice + '&DownloadPdf=true', 'invoice_' + res[0]._id + '.pdf');
      }
      else {
        FileSaver.saveAs(res.viewInvoice + '&DownloadPdf=true', 'invoice_' + res._id + '.pdf');
      }
      this.notificationService.notify('Invoice Downloaded successfully', 'success');
    }, errRes => {
      this.errorToaster(errRes, 'Downloading Invoice failed');
    });
  }

  //open upgrade plan modal
  freePlanUpgrade() {
    this.closeSelectedPopup('free_upgrade');
    this.openSelectedPopup('choose_plan');
  }

  //redirect to plans page in plan Onboarding modal
  // redirectToPlansPage(){
  //   this.closeSelectedPopup('onboardingJourny');
  //   this.router.navigate(['/pricing'], { skipLocationChange: true });
  // }

  //clear all subscriptions in below lifecycle
  ngOnDestroy() {
    this.currentSubsciptionData ? this.currentSubsciptionData.unsubscribe() : false;
  }
}
