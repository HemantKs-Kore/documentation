import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { ConstantsService } from '@kore.services/constants.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { AuthService } from '@kore.services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { LocalStoreService } from '@kore.services/localstore.service';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment'
import { KRModalComponent } from '../../../shared/kr-modal/kr-modal.component';
declare const $: any;
@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss']
})
export class UpgradePlanComponent implements OnInit, OnDestroy {
  addOverageModalPopRef: any;
  choosePlanModalPopRef: any;
  paymentGatewayModelPopRef: any;
  contactusModelPopRef: any;
  contactusSuccessModelPopRef: any;
  changePlanModelPopRef: any;
  confirmUpgradeModelPopRef: any;
  freePlanUpgradeModelPopRef: any;

  validations:boolean = false;
  countriesList:any = []
  search_country = '';
  featureLimit: number = 8;
  termPlan = "Monthly";
  featureTypes: any = [];
  frequentFAQs: any = [];
  totalPlansData: Array<any>=[];
  filterPlansData: Array<any>=[];
  showPlanDetails: string = '';
  orderConfirmData: any;
  selectedPlan: any = {};
  selectedApp: any;
  serachIndexId: any;
  urlSafe: any;
  transactionId: any;
  payementSuccess: true;
  listPlanFeaturesData: any;
  paymentStatusInterval: any;
  invoiceOrderId: any;
  featuresExceededUsage: any = [];
  upgradePlanData:any={};
  selectedPaymentPage: string = 'payment_confirm';
  showLoader: boolean;
  payementResponse: any = {
    hostedPage: {
      transactionId: "",
      url: ""
    }
  };
  plansIdList = {
    free: 'fp_free',
    standardMonth: 'standard_monthly',
    standardYear: 'standard_yearly',
    enterpriceMonth: 'enterprise_monthly',
    enterpriceYear: 'enterprise_yearly'
  }
  overageDeatils: any = {}
  currentSubsciptionData: Subscription;
  isOverageShow: boolean = false;
  btnLoader: boolean = false;
  enterpriseForm: any = { name: '', email: '', message: '', phone: '' , company:'',country:''};
  @Input() componentType: string;
  @Output() upgradedEvent = new EventEmitter();

  constructor(public dialog: MatDialog,
    private service: ServiceInvokerService,
    private appSelectionService: AppSelectionService,
    private constantsService: ConstantsService,
    public workflowService: WorkflowService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    public localstore: LocalStoreService) { }

  @ViewChild('addOverageModel') addOverageModel: KRModalComponent;
  @ViewChild('changePlanModel') changePlanModel: KRModalComponent;
  @ViewChild('choosePlanModel') choosePlanModel: KRModalComponent;
  @ViewChild('paymentGatewayModel') paymentGatewayModel: KRModalComponent;
  @ViewChild('contactUsModel') contactUsModel: KRModalComponent;
  @ViewChild('confirmUpgradeModel') confirmUpgradeModel: KRModalComponent;
  @Output() updateBanner = new EventEmitter<{}>();
  @Output() plansData = new EventEmitter<''>();
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent;
  @ViewChild('freePlanUpgradeModel') freePlanUpgradeModel: KRModalComponent;

  ngOnInit(): void {
    this.getAllPlans();
    this.countriesList = this.constantsService.countriesList;
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.typeOfPlan();
    this.currentSubsciptionData = this.appSelectionService.currentSubscription.subscribe(res => {
      this.selectedPlan = res?.subscription;
      const billingUnit = (this.selectedPlan?.billingUnit)?(this.selectedPlan?.billingUnit):'Monthly';
      this.typeOfPlan(billingUnit);
    });
  }

  clearcontent() {
    if ($('#searchBoxId') && $('#searchBoxId').length) {
      $('#searchBoxId')[0].value = "";
      this.search_country = '';
    }
  }

  //get plans api
  getAllPlans() {
    this.service.invoke('get.pricingPlans').subscribe(res => {
      this.featureTypes = res?.featureTypes;
      this.frequentFAQs = res?.FAQS;
      this.totalPlansData = res?.plans?.sort((a, b) => { return a.displayOrder - b.displayOrder });
      this.totalPlansData.forEach(data => {
        let dat = Object.values(data.featureAccess);
        data = Object.assign(data, { "featureData": dat });
      });
      this.plansData.emit();
      this.typeOfPlan();
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

  //open popup based on input parameter
  openSelectedPopup(type) {
    if (type === 'choose_plan') {
      if (this.appSelectionService.currentsubscriptionPlanDetails) {
        const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
        this.selectedPlan = currentSubscriptionPlan?.subscription;
        this.choosePlanModalPopRef = this.choosePlanModel.open();
      }
    }
    else if (type === 'payment_gateway') {
      this.paymentGatewayModelPopRef = this.paymentGatewayModel.open();
    }
    else if (type === 'add_overage') {
      this.overageModal('open');
    }
    else if(type==='free_upgrade'){
      this.freePlanUpgradeModelPopRef = this.freePlanUpgradeModel.open();
    }
  }

  //close popup based on input parameter
  closeSelectedPopup(type) {
    if (type === 'choose_plan') {
      const billingUnit = (this.selectedPlan?.billingUnit)?(this.selectedPlan?.billingUnit):'Monthly';
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
    else if(type==='free_upgrade'){
      if(this.freePlanUpgradeModelPopRef?.close) this.freePlanUpgradeModelPopRef.close();
    }
  }

  //close or open confirmUpgradeModel
  closeConfirmUpgradeModal(type,data?){
   if(type==='open'){
    this.upgradePlanData = data;
    console.log("upgradePlanData",this.upgradePlanData);
     this.confirmUpgradeModelPopRef=this.confirmUpgradeModel.open();
   }
   else if(type==='close'){
    if(this.confirmUpgradeModelPopRef?.close){
       this.btnLoader =false;
       this.confirmUpgradeModelPopRef?.close();
       this.upgradePlanData={};
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
    this.selectedPaymentPage = 'payment_iframe';
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
      let url = this.payementResponse.hostedPage.url;
      this.invoiceOrderId = this.payementResponse.hostedPage.transactionId;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.poling();
    }, errRes => {
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
        const message = this.isOverageShow ? 'Overages added successfully' : 'Plan Changed successfully';
        this.notificationService.notify(message, 'success');
        if (!this.isOverageShow) {
          this.selectedPaymentPage = 'payment_success';
          const obj = { msg: `Your previous payment of $ ${this.orderConfirmData?.planAmount} is processed successfully.`, type: 'success' };
          this.updateBanner.emit(obj);
          this.closeConfirmUpgradeModal('close');
        }
        else {
          if (this.btnLoader) this.btnLoader = false;
          this.overageModal('close');
        }
      } else if (res.state == 'failed') {
        clearInterval(this.paymentStatusInterval);
        const obj = { msg: `Your previous payment of $ ${this.orderConfirmData?.planAmount} was not processed. Please retry to upgrade your plan.`, type: 'failed' };
        this.updateBanner.emit(obj);
        if (this.btnLoader) this.btnLoader = false;
        if (!this.isOverageShow) this.selectedPaymentPage = 'payment_fail';
      }
    }, errRes => {
      this.errorToaster(errRes, 'failed to payment status');
    });
  }

  //open contact us popup
  contactusModel(type,plan?) {
    if (type === 'open') {
      const userInfo = this.localstore.getAuthInfo();
      this.enterpriseForm.name = userInfo.currentAccount.userInfo.fName;
      this.enterpriseForm.email = userInfo.currentAccount.userInfo.emailId;
      this.enterpriseForm.message = (plan?.billingUnit&&plan?.name!=='Enterprise')?`${plan?.name} Plan(${plan?.billingUnit}) -`:(plan?.name+' Plan -');
      this.contactusModelPopRef = this.contactUsModel.open();
    }
    else if (type === 'close') {
      this.enterpriseForm = { name: '', email: '', message: '', phone: '', company:'', country:'' };
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
        // const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
        // const usageData = currentSubscriptionPlan?.usage;
        // const featureArray: any = Object.values(usageData);
        // res?.featuresExceededUsage?.forEach(item => {
        //   const featureData = featureArray?.filter(feature => feature?.name === item);
        //   const obj = { name: item, used: featureData[0]?.used, limit: featureData[0]?.limit };
        //   this.featuresExceededUsage.push(obj);
        // })
        this.openExcessDataPopup('open');
      }
    }), errRes => {
      this.btnLoader =false;
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

  //select type plan like monthly or yearly
  typeOfPlan(type?) {
    const billingUnit = (type)?type:(this.selectedPlan?.billingUnit||'Monthly');
    this.filterPlansData = [];
    this.termPlan = billingUnit;
    if(this.totalPlansData.length>0){
      for (let data of this.totalPlansData) {
        if (data?.billingUnit == billingUnit || data?.planId === 'fp_free') {
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
        if (data.planId == this.plansIdList.free || data.type == this.plansIdList.standardMonth || data.type == this.plansIdList.enterpriceMonth) {
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
  }

  //based on choosePlanType in order confirm popup
  choosePlanType(type) {
    let data = this.totalPlansData.filter(plan => plan.name == this.orderConfirmData.name && plan.billingUnit == type);
    this.orderConfirmData = data[0];
    console.log("this.orderConfirmData",this.orderConfirmData);
  }

  //open | close add overage modal
  overageModal(type) {
    if (type === 'open') {
      const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
      this.selectedPlan = currentSubscriptionPlan;
      this.totalPlansData.forEach(element => {
        if (element._id == currentSubscriptionPlan?.subscription?.planId) {
          this.overageDeatils = element.overage;
          this.overageDeatils = { ...this.overageDeatils, docCount: 0, queriesCount: 0 };
        }
      });
      this.addOverageModalPopRef = this.addOverageModel.open();
    }
    else if (type === 'close') {
      this.overageDeatils = {};
      this.selectedPlan = {};
      this.isOverageShow = false;
      if (this.addOverageModalPopRef?.close) this.addOverageModalPopRef.close();
    }
  }

  //add overage api
  buyOverage() {
    this.btnLoader = true;
    this.selectedApp = this.workflowService.selectedApp();
    const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
    let overage = [];
    if (this.overageDeatils.docCount > 0) {
      overage.push({ "feature": "ingestDocs", "quantity": this.overageDeatils.docCount })
    }
    if (this.overageDeatils.queriesCount > 0) {
      overage.push({ "feature": "searchQueries", "quantity": this.overageDeatils.queriesCount })
    }
    const queryParams = {
      "streamId": this.selectedApp._id,
      "subscriptionId": currentSubscriptionPlan?.subscription?._id
    }
    const payload = { "overages": overage };
    const buyOverage = this.service.invoke('put.buyOverage', queryParams, payload);
    buyOverage.subscribe(res => {
      this.invoiceOrderId = res?.transactionId;
      this.isOverageShow = true;
      this.poling();
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
  freePlanUpgrade(){
    this.closeSelectedPopup('free_upgrade');
    this.openSelectedPopup('choose_plan');
  }

  //clear all subscriptions in below lifecycle
  ngOnDestroy() {
    this.currentSubsciptionData ? this.currentSubsciptionData.unsubscribe() : false;
  }
}
