import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EChartOption } from 'echarts';
import { UpgradePlanComponent } from '../../helpers/components/upgrade-plan/upgrade-plan.component';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
declare var $: any;
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  documentGraph: EChartOption;
  queryGraph: EChartOption;
  addPricing3ModalPopRef: any;
  addOverageModalPopRef: any;
  cancelSubscriptionModelPopRef: any;
  termPlan = "Monthly";
  templateShow: boolean = false;
  currentSubscriptionPlan: any;
  selectedApp;
  serachIndexId;
  totalPlansData: any;
  filterPlansData: any;
  addDocOver = false;
  addQueOver = false;
  numberDoc = 1;
  numberQuery = 1;
  overageDeatils = {
    ingestDocs: {
      amount: 0,
      limit: 0
    },
    searchQueries: {
      amount: 0,
      limit: 0
    }
  }
  plansIdList = {
    free: 'fp_free',
    standardMonth: '65066',
    standardYear: '65451',
    proMonth: '65123',
    proYear: '65453',
    enterpriceMonth: 'fp_enterprise_custom_monthly',
    enterpriceYear: 'fp_enterprise_custom_yearly'
  };
  proInfo: boolean = false;
  currentSubsciptionData: Subscription;
  showUpgradeBtn: boolean;
  usageDetails: any = {};
  monthRange = "Jan - June";
  isyAxisDocumentdata: boolean = true;
  isyAxisQuerydata: boolean = true;
  componentType: string = 'addData';
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService) { }
  // @ViewChild('addPricingModel1') addPricingModel1: KRModalComponent;
  // @ViewChild('addPricingModel2') addPricingModel2: KRModalComponent;
  @ViewChild('addPricingModel3') addPricingModel3: KRModalComponent;
  @ViewChild('addOverageModel') addOverageModel: KRModalComponent;
  @ViewChild('cancelSubscriptionModel') cancelSubscriptionModel: KRModalComponent;
  @ViewChild('plans') plans: UpgradePlanComponent;

  async ngOnInit() {
    //this.pricingChart()
    this.getPlan();
    await this.appSelectionService.getCurrentSubscriptionData();
    this.currentSubsciptionData = this.appSelectionService.currentSubscription.subscribe(res => {
      this.currentSubscriptionPlan = res;
      this.updateUsageDetails();
      this.pricingChart()
      // this.getOverage(overageRes);
      this.showUpgradeBtn = this.currentSubscriptionPlan.subscription.planName != 'Free' ? true : false;
    });
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
  }
  // currentsubscriptionPlan(app, overageRes?) {
  //   const payload = {
  //     streamId: app._id
  //   };
  //   const appObserver = this.service.invoke('get.currentPlans', payload);
  //   appObserver.subscribe(res => {
  //     this.currentSubscriptionPlan = res;
  //     this.updateUsageDetails();
  //     this.getOverage(overageRes);
  //     this.showUpgradeBtn = this.currentSubscriptionPlan.subscription.planName != 'Free' ? true : false;

  //   }, errRes => {
  //     this.errorToaster(errRes, 'failed to get plans');
  //     if (errRes.error.errors[0].code === 'NoActiveSubscription') {
  //       this.showUpgradeBtn = true;
  //     }
  //   });
  // }
  getPlan() {
    this.service.invoke('get.pricingPlans').subscribe(res => {
      this.totalPlansData = res;
      this.typeOfPlan("Monthly");
      this.totalPlansData.forEach(data => {
        let dat = Object.values(data.featureAccess);
        data = Object.assign(data, { "featureData": dat });
      })
      let listData = [...this.totalPlansData]
      let listDataMonthlyFeature = [];
      listData.forEach(data => {
        Object.keys(data.featureAccess);
        Object.values(data.featureAccess);
        Object.entries(data.featureAccess);
        /** Pick only the Month Plans */
        if (data._id == this.plansIdList.free || data._id == this.plansIdList.standardMonth || data._id == this.plansIdList.proMonth || data._id == this.plansIdList.enterpriceMonth) {
          listDataMonthlyFeature.push(Object.entries(data.featureAccess))
        }
      })
      // let maxArr =[]
      // listDataMonthlyFeature.forEach((element,index) => {
      //   maxArr.push(element.length)
      // });
      // let maxRecordIndex = maxArr.indexOf(Math.max(...maxArr));
      //if(listDataMonthlyFeature.length = 4){
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
        //}
      }
      console.log(listDataMonthlyFeature);
      // listDataMonthlyFeature.forEach((parent,i)=> {
      //   parent.forEach((child,j)=> {

      //   });
      // });
      // this.currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
      // if (!this.currentSubscriptionPlan) {
      //   this.currentsubscriptionPlan(this.selectedApp, res);
      // } else {
      // }

    }, errRes => {
      this.errorToaster(errRes, 'failed to get plans');
    });
  }
  getOverage() {
    this.totalPlansData.forEach(element => {
      if (element._id == this.currentSubscriptionPlan.subscription.planId) {
        this.overageDeatils = element.overage;
      }
      if (element._id == this.plansIdList.proMonth) {
        this.overageDeatils = element.overage;
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
  compare(type, data?) {
    if (this.proInfo) {
      this.proInfo = false;
    }
    if (type == 'choosePlans') {
      this.plans.openChoosePlanPopup(data);
    }
    else if (type == 'order') {
      this.plans.openOrderConfPopup(data);
    } else if (type == 'orderOverage') {
      let planData = this.totalPlansData.filter(plan => plan._id == this.currentSubscriptionPlan.subscription.planId);
      let obj = { overageShow: true, docCount: this.addDocOver ? this.numberDoc > 0 ? this.numberDoc : null : null, queryCount: this.addQueOver ? this.numberQuery > 0 ? this.numberQuery : null : null, overageDeatils: this.overageDeatils }
      this.plans.openOrderConfPopup(planData[0], obj);
      // for (let data of this.totalPlansData) {
      //   if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.subscription && this.currentSubscriptionPlan.subscription.planName) {
      //     if (data.name == this.currentSubscriptionPlan.subscription.planName) {
      //       let obj = { overageShow: true, docCount: this.addDocOver ? this.numberDoc : null, queryCount: this.addQueOver ? this.numberQuery : null, overageDeatils: this.overageDeatils }
      //       this.plans.openOrderConfPopup(data, obj);
      //     }
      //   }
      // }
    }
  }
  //open popup1
  // openPopup1() {
  //   this.addPricing1ModalPopRef = this.addPricingModel1.open();
  // }
  //close popup1
  // closePopup1() {
  //   if (this.addPricing1ModalPopRef && this.addPricing1ModalPopRef.close) {
  //     this.addPricing1ModalPopRef.close();
  //   }
  // }

  //open popup1
  // openPopup2() {
  //   this.addPricing2ModalPopRef = this.addPricingModel2.open();
  // }
  //close popup1
  // closePopup2() {
  //   if (this.addPricing2ModalPopRef && this.addPricing2ModalPopRef.close) {
  //     this.addPricing2ModalPopRef.close();
  //   }
  // }

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

  //open popup1
  addOverage() {
    this.getOverage();
    this.addOverageModalPopRef = this.addOverageModel.open();
  }
  //close popup1
  closeOveragePopup() {
    if (this.addOverageModalPopRef && this.addOverageModalPopRef.close) {
      this.addOverageModalPopRef.close();
    }
    this.cancelOveragePopup();
  }
  cancelOveragePopup() {
    this.addDocOver = false;
    this.addQueOver = false;
    this.numberQuery = 1;
    this.numberDoc = 1;
  }
  //open popup1
  openPopup5() {
    this.cancelSubscriptionModelPopRef = this.cancelSubscriptionModel.open();
  }
  //cancel subscription dialog(pro to standard)
  cancelProSubscription() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Are you sure you want to Cancel?',
        body: 'Your change plan request from Pro to Standard will be cancelled and current plan will be retained',
        buttons: [{ key: 'yes', label: 'Proceed', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.cancelDowngradeSubscription(dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }//cancel downgrade subscription
  cancelDowngradeSubscription(dialogRef?) {
    const queryParam = {
      streamId: this.selectedApp._id
    }
    this.service.invoke('post.downgradeCancellation', queryParam, {}).subscribe(res => {
      this.proInfo = true;
      this.appSelectionService.getCurrentSubscriptionData();
      this.notificationService.notify('Cancellation request submitted', 'success');
      if (dialogRef) dialogRef.close();
    }, errRes => {
      this.errorToaster(errRes, 'failed to Cancel subscription');
    });
  }
  //enterpriseContactus method
  enterpriseContactus() {
    this.plans.openContactusModel();
  }
  //close popup1
  cancelSubscription(dialogRef?) {
    const queryParam = {
      streamId: this.selectedApp._id
    }
    const payload = {
      subscriptionId: this.currentSubscriptionPlan.subscription._id,
      status: "success"
    };
    this.service.invoke('put.cancelSubscribtion', queryParam, payload).subscribe(res => {
      this.proInfo = false;
      this.appSelectionService.getCurrentSubscriptionData();
      //this.currentsubscriptionPlan(this.selectedApp)
      this.notificationService.notify('Cancellation request submitted', 'success');
      if (dialogRef) dialogRef.close();
    }, errRes => {
      this.errorToaster(errRes, 'failed to Cancel subscription');
    });
    this.closeCancelSubsPopup();
  }
  closeCancelSubsPopup() {
    if (this.cancelSubscriptionModelPopRef && this.cancelSubscriptionModelPopRef.close) {
      $("input:checkbox").prop('checked', false);
      $("#text_area").val('');
      this.cancelSubscriptionModelPopRef.close();
    }
  }
  addDocument() {
    this.addDocOver = true
    this.numberDoc = 1;
  }
  addQuerry() {
    this.addQueOver = true;
    this.numberQuery = 1;
  }
  count(type, operation) {
    if (type == 'doc') {
      if (operation == 'plus') {
        this.numberDoc = this.numberDoc + 1;
      } else {

        this.numberDoc > 1 ? this.numberDoc = this.numberDoc - 1 : (this.numberDoc = 0, this.addDocOver = false);
      }
    } else {
      if (operation == 'plus') {
        this.numberQuery = this.numberQuery + 1;
      } else {
        this.numberQuery > 1 ? this.numberQuery = this.numberQuery - 1 : (this.numberQuery = 0, this.addQueOver = false);
      }
    }
  }
  //Grap data
  pricingChart() {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let xAxisQueryData = [];
    let xAxisDocumentData = [];
    let yAxisQueryData = [];
    let yAxisDocumentData = [];
    let barDocColor = "#28A745";
    let barQueColor = "#7027E5";
    if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.analytics && this.currentSubscriptionPlan.analytics.search) {
      this.currentSubscriptionPlan.analytics.search.forEach(element => {
        xAxisQueryData.push(element.month)
        yAxisQueryData.push(element.total)
      });
    }
    if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.analytics && this.currentSubscriptionPlan.analytics.content) {
      this.currentSubscriptionPlan.analytics.content.forEach(element => {
        xAxisDocumentData.push(element.month)
        yAxisDocumentData.push(element.total)
      });
    }
    if (xAxisDocumentData.length == 0) {
      xAxisDocumentData = ['Jan', 'Feb', 'Apr', 'May', 'Jun'];
    }
    if (Math.max(...yAxisDocumentData) == 0 || yAxisDocumentData.length == 0) {
      yAxisDocumentData = [120, 200, 150, 80, 70, 110, 130];
      this.isyAxisDocumentdata = false;
      barDocColor = "#EFF0F1";
    } else {
      this.isyAxisDocumentdata = true;
      barDocColor = "#28A745";
    }
    if (xAxisQueryData.length == 0) {
      xAxisQueryData = ['Jan', 'Feb', 'Apr', 'May', 'Jun'];
    }
    if (Math.max(...yAxisQueryData) == 0 || yAxisQueryData.length == 0) {
      yAxisQueryData = [120, 200, 150, 80, 70, 110, 130];
      this.isyAxisQuerydata = false;
      barQueColor = "#EFF0F1";
    } else {
      this.isyAxisQuerydata = true;
      barQueColor = "#7027E5";
    }
    xAxisQueryData.length ? this.monthRange = xAxisQueryData[0] + ' - ' + xAxisQueryData[xAxisQueryData.length - 1] : this.monthRange = "Jan - June";
    this.queryGraph = {

      grid: {
        left: '8%',
        right: '4%',
        bottom: '20%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: `
          <div class="metrics-tooltips-hover agent_drop_tolltip">
          <div class="">
            <div class="main-title">Query Usage on {b0} is {c0}</div>
          </div> 
        </div>
        
        `,
        position: 'top',
        padding: 0

      },

      xAxis: {
        type: 'category',
        name: 'No Data Available',
        nameLocation: 'middle',
        nameGap: 50,
        data: xAxisQueryData, //['Jan', 'Feb', 'Apr', 'May', 'Jun'], //data//
        axisLabel: {
          //margin: 20,
          color: "#9AA0A6",
          fontWeight: "normal",
          fontSize: 12,
          fontFamily: "Inter"
        },
      },
      yAxis: {
        type: 'value',
        name: 'Query Ingested',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: 5,
        nameTextStyle: {
          color: "#9AA0A6",
          fontWeight: "normal",
          fontSize: 12,
          fontFamily: "Inter"
        },
        axisLabel: {
          //margin: 20,
          color: "#9AA0A6",
          fontWeight: "normal",
          fontSize: 12,
          fontFamily: "Inter"
        },
      },
      series: [{
        data: yAxisQueryData, //[120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          normal: {
            color: barQueColor,
            barBorderRadius: [50, 50, 50, 50]
          },
        },
        lineStyle: {
          color: '#0D6EFD',
        },
      }]
    }

    this.documentGraph = {

      grid: {
        left: '10%',
        right: '4%',
        bottom: '20%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: `
          <div class="metrics-tooltips-hover agent_drop_tolltip">
          <div class="">
            <div class="main-title">Document Usage on {b0} is {c0}</div>
          </div> 
        </div>
        
        `,
        position: 'top',
        padding: 0

      },
      xAxis: {
        type: 'category',
        name: 'No Data Available',
        nameLocation: 'middle',
        nameGap: 50,
        data: xAxisDocumentData, //['Jan', 'Feb', 'Apr', 'May', 'Jun'], //data//
        axisLabel: {
          //margin: 20,
          color: "#9AA0A6",
          fontWeight: "normal",
          fontSize: 12,
          fontFamily: "Inter"
        },
      },
      yAxis: {
        type: 'value',
        name: 'Document Ingested',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: 5,
        nameTextStyle: {
          color: "#9AA0A6",
          fontWeight: "normal",
          fontSize: 12,
          fontFamily: "Inter"
        },
        axisLabel: {
          //margin: 20,
          color: "#9AA0A6",
          fontWeight: "normal",
          fontSize: 12,
          fontFamily: "Inter"
        },
      },
      series: [{
        data: yAxisDocumentData, //[120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          normal: {
            color: barDocColor,
            barBorderRadius: [50, 50, 50, 50]
          },
        },
        lineStyle: {
          color: '#0D6EFD',
        },
      }]
    };
    if (Math.max(...yAxisQueryData) > 5) {
      delete this.queryGraph.yAxis.min;
      delete this.queryGraph.yAxis.max;
    }
    if (this.isyAxisQuerydata) {
      delete this.queryGraph.xAxis.name
      delete this.queryGraph.xAxis.nameLocation
      delete this.queryGraph.xAxis.nameGap
      this.queryGraph.grid.bottom = "3%"
    }
    if (Math.max(...yAxisDocumentData) > 5) {
      delete this.documentGraph.yAxis.min;
      delete this.documentGraph.yAxis.max;
    }
    if (this.isyAxisDocumentdata) {
      delete this.documentGraph.xAxis.name
      delete this.documentGraph.xAxis.nameLocation
      delete this.documentGraph.xAxis.nameGap
      this.documentGraph.grid.bottom = "3%"
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
  //revert subscription dialog
  revertCancel() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Are you sure you want to Revert?',
        body: 'Your cancellation request will be reverted and current plan will be retained',
        buttons: [{ key: 'yes', label: 'Revert Cancellation', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.renewSubscription(dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  //renew subscription
  renewSubscription(dialogRef) {
    const queryParam = {
      streamId: this.selectedApp._id
    }
    this.service.invoke('get.renewSubscribtion', queryParam).subscribe(res => {
      setTimeout(() => {
        dialogRef.close();
        this.appSelectionService.getCurrentSubscriptionData();
      }, 2000)
      // this.notificationService.notify('Cancel Subscription', 'success');
    }, errRes => {
      this.errorToaster(errRes, 'failed to renew subscription');
    });
  }
  updateUsageDetails() {
    // console.log("currentSubscriptionPlan", this.currentSubscriptionPlan);
    if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.usage && this.currentSubscriptionPlan.usage.ingestDocs) {
      this.usageDetails.ingestDocs = this.currentSubscriptionPlan.usage.ingestDocs;
      if (this.usageDetails.ingestDocs.percentageUsed >= 80) {
        this.usageDetails.ingestDocs.type = 'danger';
      }
      else {
        this.usageDetails.ingestDocs.type = 'primary';
      }
    }
    else {
      this.usageDetails.ingestDocs = {};
    }

    if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.usage && this.currentSubscriptionPlan.usage.searchQueries) {
      this.usageDetails.searchQueries = this.currentSubscriptionPlan.usage.searchQueries;
      if (this.usageDetails.searchQueries.percentageUsed >= 80) {
        this.usageDetails.searchQueries.type = 'danger';
      }
      else {
        this.usageDetails.searchQueries.type = 'primary';
      }
    }
    else {
      this.usageDetails.searchQueries = {};
    }
  }
  ngOnDestroy() {
    this.currentSubsciptionData ? this.currentSubsciptionData.unsubscribe() : false;
  }
}
