import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef
} from '@angular/core';
import { KRModalComponent } from '../../../shared/kr-modal/kr-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { PlanUpgradeComponent } from '../shared/plan-upgrade/plan-upgrade.component';
import { plansName } from '../plan-names.constants';
import { LocalStoreService } from '@kore.services/localstore.service';
import { MixpanelServiceService } from '@kore.apps/services/mixpanel-service.service';
@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss']
})
export class PlanDetailsComponent implements OnInit, OnDestroy {
  queryGraph: any;
  cancelSubscriptionModelPopRef: any;
  revertCancelModelPopRef: any;
  cancellationCheckboxObj: Array<object> = [
    { selected: false, name: 'It’s too costly', value: 'Its too costly' },
    {
      selected: false,
      name: 'I found another product that fulfils my needs',
      value: 'I found another product that fulfils my needs',
    },
    {
      selected: false,
      name: 'I don’t use it enough',
      value: 'I dont use it enough',
    },
    {
      selected: false,
      name: 'I don’t need it now',
      value: 'I dont need it now',
    },
  ];
  cancellationCheckboxText: any = this.cancellationCheckboxObj;
  termPlan = 'Monthly';
  btnLoader = false;
  bannerObj = { msg: '', show: false, type: '' };
  currentSubscriptionPlan: any = {};
  selectedApp;
  serachIndexId;
  totalPlansData: any;
  filterPlansData: any;
  currentSubsciptionData: Subscription;
  updateUsageData: Subscription;
  usageDetails: any = {};
  planNames: object = plansName;
  currentPlanDetails: Array<object> = [];
  isNoUsageMetricsData: boolean = false;
  usageMetricsData: Array<any> = [];
  isUsageMetricsLoading: Boolean = true;
  avgQueryData: any = { queries: 0, overages: 0 };

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public localstore: LocalStoreService,
    public mixpanel: MixpanelServiceService,
  ) { }

  @ViewChild('cancelSubscriptionModel')
  cancelSubscriptionModel: KRModalComponent;
  @ViewChild('revertCancelModel') revertCancelModel: KRModalComponent;
  @ViewChild('plans') plans: PlanUpgradeComponent;
  @ViewChild(DaterangepickerDirective, { static: true })
  pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;

  async ngOnInit() {
    await this.appSelectionService.getCurrentSubscriptionData();
    this.currentSubscriptionPlan =
      this.appSelectionService?.currentsubscriptionPlanDetails;
    this.currentSubsciptionData =
      this.appSelectionService.currentSubscription.subscribe((res) => {
        this.currentSubscriptionPlan = res;
      });
    this.updateUsageData = this.appSelectionService.updateUsageData.subscribe(
      (res) => {
        if (res === 'updatedUsage') this.getSubscriptionData();
      }
    );
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
  }

  //common method for error toast messages
  errorToaster(errRes, message) {
    if (
      errRes &&
      errRes.error &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }

  //get usage metrics data from API
  getUsageMetricsData() {
    const queryParam = {
      streamId: this.selectedApp._id,
    };
    const payload = {
      "type": "PricingActiveSubscription",
      "group": "date",
      "filters": {
        "from": "2022-01-30T10:10:41.659Z",
        "to": "2023-08-28T10:10:41.660Z"
      }
    };
    this.service.invoke('post.usageMetrics', queryParam, payload).subscribe(
      (res) => {
        if (res) {
          this.usageMetricsData = res?.searchData;
          this.pricingChart();
        }
      },
      (errRes) => {
        this.isUsageMetricsLoading = false;
        this.errorToaster(errRes, 'failed to get usage metrics data');
      }
    );
  }

  //getsubscription data
  getSubscriptionData() {
    this.getUsageMetricsData();
    this.updateUsageDetails();
  }

  //show or hide banner
  showBanner(obj) {
    this.bannerObj = {
      ...this.bannerObj,
      msg: obj?.msg,
      type: obj?.type,
      show: true,
    };
  }

  //clear banner
  clearBanner() {
    this.bannerObj = { msg: '', type: '', show: false };
  }

  //select upgrade component methods
  selectModal(type) {
    this.plans?.openSelectedPopup(type);
    this.mixpanel.postEvent('Enter upgrade plan', {});
  }

  //Open | Close subscription modal
  cancelSubscriptionModal(type) {
    this.cancellationCheckboxText = this.cancellationCheckboxObj;
    if (type === 'open') {
      this.cancelSubscriptionModelPopRef = this.cancelSubscriptionModel.open();
    } else if (type === 'close') {
      const commentInput: any = document.getElementById('cancel_comment_text');
      const checkboxes: any = document.querySelectorAll('.checkbox-custom');
      commentInput.value = '';
      for (const check of checkboxes) {
        check.checked = false;
      }
      if (this.cancelSubscriptionModelPopRef.close)
        this.cancelSubscriptionModelPopRef.close();
    }
  }

  //open | close revert cancel model
  revertCancelModal(type) {
    if (type === 'open') {
      this.revertCancelModelPopRef = this.revertCancelModel.open();
    } else if (type === 'close') {
      if (this.revertCancelModelPopRef.close)
        this.revertCancelModelPopRef.close();
    }
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
        buttons: [
          { key: 'yes', label: 'Proceed', type: 'danger' },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        this.cancelDowngradeSubscription(dialogRef);
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
  }

  //cancel downgrade subscription
  cancelDowngradeSubscription(dialogRef?) {
    const queryParam = {
      streamId: this.selectedApp._id,
    };
    this.service.invoke('post.downgradeCancellation', queryParam, {}).subscribe(
      (res) => {
        this.appSelectionService.getCurrentSubscriptionData();
        this.notificationService.notify(
          'Cancellation request submitted',
          'success'
        );
        if (dialogRef) dialogRef.close();
      },
      (errRes) => {
        this.errorToaster(errRes, 'failed to Cancel subscription');
      }
    );
  }

  //cancel subscription api
  cancelSubscription() {
    this.btnLoader = true;
    const checkedData = [];
    const comment_data: any = document.getElementById('cancel_comment_text');
    for (const data of this.cancellationCheckboxText) {
      if (data.selected) checkedData.push(data.value);
    }
    const queryParam = { streamId: this.selectedApp._id };
    const userInfo = this.localstore.getAuthInfo();
    const emailId = userInfo?.currentAccount?.userInfo?.emailId;
    const currentPlanName =
      this.currentSubscriptionPlan?.subscription?.billing?.unit &&
        this.currentSubscriptionPlan?.subscription?.planName !== 'Enterprise'
        ? `${this.currentSubscriptionPlan?.subscription?.planName} Plan(${this.currentSubscriptionPlan?.subscription?.billing?.unit})`
        : this.currentSubscriptionPlan?.subscription?.planName + ' Plan';
    const payload = {
      subscriptionId: this.currentSubscriptionPlan?.subscription?._id,
      feedback: {
        reasons: checkedData,
        comment: comment_data?.value,
        email: emailId,
        currentPlan: currentPlanName,
      },
    };
    this.service
      .invoke('put.cancelSubscribtion', queryParam, payload)
      .subscribe(
        (res) => {
          this.appSelectionService.getCurrentSubscriptionData();
          this.btnLoader = false;
          this.notificationService.notify(
            'Cancellation Request Submitted',
            'success'
          );
          this.cancelSubscriptionModal('close');
        },
        (errRes) => {
          this.btnLoader = false;
          this.errorToaster(errRes, 'failed to Cancel subscription');
        }
      );
  }

  //Grap data
  pricingChart() {
    let month = [], year = [], queriesData = [], overagesData = [];
    const monthsFull = { "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June", "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December" };
    const months = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" };
    for (let item of this.usageMetricsData) {
      const start_date = item?.startDate?.split(' ');
      const end_date = item?.endDate?.split(' ');
      let startDate = start_date[0]?.split('-');
      let endDate = end_date[0]?.split('-');
      const monthRange = months[startDate[1]] + '-' + months[endDate[1]];
      year.push(startDate[0]);
      month.push(monthRange);
      const monthTo = startDate[2] + ' ' + monthsFull[startDate[1]] + ' to ' + endDate[2] + ' ' + monthsFull[endDate[1]];
      const queriesCountFormat = this.numberFormat(item?.queriesCount);
      const overagesCountFormat = this.numberFormat(item?.overageQueriesCount);
      const total_value = this.numberFormat(item?.total);
      queriesData.push({ value: item?.queriesCount, total: total_value, search: queriesCountFormat, overage: overagesCountFormat, type: "Queries", month: monthTo });
      overagesData.push({ value: item?.overageQueriesCount, total: total_value, search: queriesCountFormat, overage: overagesCountFormat, type: "Queries", month: monthTo });
    }
    this.avgQueryData.queries = (queriesData.reduce((acc, obj) => (acc + obj?.value), 0) / queriesData.length).toFixed(0);
    this.avgQueryData.overage = (overagesData.reduce((acc, obj) => (acc + obj?.value), 0) / overagesData.length).toFixed(0);
    this.isNoUsageMetricsData = this.usageMetricsData.every(item => item.total === 0);
    this.queryGraph = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'none'
        },
        formatter: (param) => {
          return `<div class="pricing-hover-tooltip">
        <div class="row-data-info">
          <i class="si-interuptions"></i>
          <span class="count-text">${param?.data?.search} ${param?.data?.type}</span>
        </div>
        <div class="row-data-info">
          <span class="info-text"><span class="queries-bar"></span> ${param?.data?.total} Queries</span>
          <span class="info-text ${param?.data?.overage === 0 && 'd-none'}"><span class="overages-bar"></span> ${param?.data?.overage} Overages</span>
        </div>
        <div class="row-data-info">
          <span class="info-text">${param?.data?.month}</span>
        </div>
      </div>`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: month,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        {
          position: 'bottom',
          offset: 15,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: year,
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: (value) => {
              return `${this.numberFormat(value)}`
            }
          }
        }
      ],
      series: [
        {
          name: 'Queries',
          type: 'bar',
          stack: 'Ad',
          data: queriesData,
          barWidth: 10,
          itemStyle: { normal: { color: '#B893F2' } },
          emphasis: { itemStyle: { color: '#7027E5' } }
        },
        {
          name: 'Overages',
          type: 'bar',
          stack: 'Ad',
          itemStyle: { normal: { color: '#FF784B' } },
          emphasis: { itemStyle: { color: '#FF784B' } },
          data: overagesData,
          barWidth: 10
        }
      ]
    }
    this.isUsageMetricsLoading = false;
  }

  //convert to number format
  numberFormat(num) {
    const suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];
    if (num < 1000) {
      return num;
    }
    const exp = Math.floor(Math.log(num) / Math.log(1000));
    return (num / Math.pow(1000, exp)) + suffixes[exp - 1];
  }

  //renew | revert cancel subscription
  renewSubscription() {
    this.btnLoader = true;
    const queryParam = {
      streamId: this.selectedApp?._id,
    };
    this.service.invoke('get.renewSubscribtion', queryParam).subscribe(
      (res) => {
        setTimeout(() => {
          this.appSelectionService.getCurrentSubscriptionData();
          if (this.bannerObj.show) this.clearBanner();
          this.btnLoader = false;
          this.revertCancelModal('close');
        }, 2000);
      },
      (errRes) => {
        this.btnLoader = false;
        this.errorToaster(errRes, 'failed to renew subscription');
      }
    );
  }

  //update plan and used queries data
  updateUsageDetails() {
    const allPlansSub = this.appSelectionService
      ?.getAllPlans()
      .subscribe((allPlans) => {
        const currentUsageData = this.appSelectionService?.currentUsageData;
        if (allPlans) {
          const planName = this.currentSubscriptionPlan?.subscription?.planName;
          const totalPlans = allPlans?.plans;
          const billingUnit =
            this.currentSubscriptionPlan?.subscription?.billing?.unit;
          const planData = totalPlans?.filter((plan) =>
            billingUnit
              ? plan?.name === planName && billingUnit === plan?.billing?.unit
              : plan?.name === planName
          );
          if (planData[0]?.featureAccess?.searchQueries?.displayOnBanner)
            planData[0].featureAccess.searchQueries.displayOnBanner = false;

          this.currentPlanDetails = planData;
        }
        if (currentUsageData) {
          this.usageDetails.searchQueriesLimit = currentUsageData?.searchLimit;
          this.usageDetails.searchQueriesUsed = currentUsageData?.searchCount;
          this.usageDetails.searchPercentageUsed =
            currentUsageData?.queryPercentageUsed;
          this.usageDetails.overagePercentageUsed =
            currentUsageData?.overagePercentageUsed;
          this.usageDetails.overageSearchCount =
            currentUsageData?.overageSearchCount;
          this.usageDetails.overageSearchLimit =
            currentUsageData?.overageSearchLimit;
        }
      });

    this.currentSubsciptionData?.add(allPlansSub);
  }

  //calling topic guide method using subject
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(null);
  }

  //whenever we refresh we should fetch analytics data
  refreshAnalytics() {
    this.isUsageMetricsLoading = true;
    this.appSelectionService?.getCurrentSubscriptionData();
  }

  //unsubscribe all the subscriptions
  ngOnDestroy() {
    this.currentSubsciptionData
      ? this.currentSubsciptionData.unsubscribe()
      : false;
    this.updateUsageData ? this.updateUsageData.unsubscribe() : false;
  }
}
