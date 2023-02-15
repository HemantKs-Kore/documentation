import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { KRModalComponent } from '../../../shared/kr-modal/kr-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';
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
@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailsComponent implements OnInit, OnDestroy {
  queryGraph: EChartsOption;
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
  pageLoading = true;
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
  monthRange = 'Jan - June';
  isyAxisDocumentdata = true;
  isyAxisQuerydata = true;
  planNames: object = plansName;
  currentPlanDetails: Array<object> = [];

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public localstore: LocalStoreService
  ) {}

  @ViewChild('cancelSubscriptionModel')
  cancelSubscriptionModel: KRModalComponent;
  @ViewChild('revertCancelModel') revertCancelModel: KRModalComponent;
  @ViewChild('plans') plans: PlanUpgradeComponent;
  @ViewChild(DaterangepickerDirective, { static: true })
  pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;

  async ngOnInit() {
    await this.appSelectionService.getCurrentUsage();
    this.currentSubscriptionPlan =
      this.appSelectionService?.currentsubscriptionPlanDetails;
    this.currentSubsciptionData =
      this.appSelectionService.currentSubscription.subscribe((res) => {
        this.currentSubscriptionPlan = res;
        this.getSubscriptionData();
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

  //getsubscription data
  getSubscriptionData() {
    this.updateUsageDetails();
    // this.pricingChart()
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
  // pricingChart() {
  //   let xAxisQueryData = [];
  //   let years = [];
  //   let yAxisQueryData = [];
  //   let barQueColor = "#7027E5";
  //   if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.analytics && this.currentSubscriptionPlan.analytics.search) {
  //     this.currentSubscriptionPlan.analytics.search.forEach(element => {
  //       xAxisQueryData.push(element.month)
  //       yAxisQueryData.push(element.total)
  //       years.push(2023);
  //     });
  //   }
  //   if (xAxisQueryData.length == 0) {
  //     xAxisQueryData = ['Jan', 'Feb', 'Apr', 'May', 'Jun'];
  //   }
  //   if (Math.max(...yAxisQueryData) == 0 || yAxisQueryData.length == 0) {
  //     this.isyAxisQuerydata = false;
  //     barQueColor = "#EFF0F1";
  //   } else {
  //     this.isyAxisQuerydata = true;
  //     barQueColor = "#7027E5";
  //   }
  //   xAxisQueryData.length ? this.monthRange = xAxisQueryData[0] + ' - ' + xAxisQueryData[xAxisQueryData.length - 1] : this.monthRange = "Jan - June";
  //   this.queryGraph = {
  //     tooltip: {
  //       trigger: 'item',
  //       axisPointer: {
  //         type: 'none'
  //       },
  //       formatter:
  //         `<div class="pricing-hover-tooltip">
  //       <div class="row-data-info">
  //         <i class="si-interuptions"></i>
  //         <span class="count-text">{c0}</span>
  //         <span class="title">{a0}</span>
  //       </div>
  //     </div>`,
  //     },
  //     grid: {
  //       left: '3%',
  //       right: '4%',
  //       bottom: '3%',
  //       containLabel: true
  //     },
  //     xAxis: [{
  //       type: 'category',
  //       data: xAxisQueryData,
  //       axisLine: {
  //         show: false,
  //       },
  //       axisTick: {
  //         show: false,
  //       },
  //     }, {
  //       position: 'bottom',
  //       offset: 15,
  //       axisLine: {
  //         show: false,
  //       },
  //       axisTick: {
  //         show: false,
  //       },
  //       data: years
  //     }],
  //     yAxis: {
  //       type: 'value',
  //       boundaryGap: [0, 0.01],
  //     },
  //     series: [
  //       {
  //         name: 'Queries',
  //         type: 'bar',
  //         data: yAxisQueryData,
  //         barWidth: 10,
  //         barCategoryGap: '10%',
  //         itemStyle: { normal: { color: '#B893F2' } },
  //         emphasis: { itemStyle: { color: "#7027E5" } },
  //       }
  //     ]
  //   };
  // }

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
    const allPlans: any = this.appSelectionService?.pricingPlansData;
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
  }

  //calling topic guide method using subject
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(null);
  }

  //whenever we refresh we should fetch analytics data
  refreshAnalytics() {
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
