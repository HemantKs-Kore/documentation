import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { EChartOption } from 'echarts';
import { UpgradePlanComponent } from '../../helpers/components/upgrade-plan/upgrade-plan.component';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  documentGraph: EChartOption;
  queryGraph: EChartOption;
  cancelSubscriptionModelPopRef: any;
  revertCancelModelPopRef: any;
  cancellationCheckboxText: any = [{selected:false,name:'It’s too costly'}, {selected:false,name:'I found another product that fulfils my needs'}, {selected:false,name:'I don’t use it enough'},{selected:false,name:'I don’t need it now'}];
  termPlan = "Monthly";
  pageLoading: boolean = true;
  featureLimit:number=6;
  btnLoader:boolean=false;
  bannerObj={msg:'',show:false,type:''};
  currentSubscriptionPlan: any={};
  selectedApp;
  serachIndexId;
  totalPlansData: any;
  filterPlansData: any;
  currentSubsciptionData: Subscription;
  updateUsageData: Subscription;
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
  @ViewChild('cancelSubscriptionModel') cancelSubscriptionModel: KRModalComponent;
  @ViewChild('revertCancelModel') revertCancelModel: KRModalComponent;
  @ViewChild('plans') plans: UpgradePlanComponent;
  @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
  @ViewChild('datetimeTrigger') datetimeTrigger: ElementRef<HTMLElement>;
  async ngOnInit() {
    await this.appSelectionService.getCurrentSubscriptionData();
    this.currentSubscriptionPlan = this.appSelectionService?.currentsubscriptionPlanDetails;
    this.currentSubsciptionData = this.appSelectionService.currentSubscription.subscribe(res => {
      this.currentSubscriptionPlan = res;
      this.getSubscriptionData();
    });
    this.updateUsageData = this.appSelectionService.updateUsageData.subscribe(res => {
      if (res == 'updatedUsage') {
        this.getSubscriptionData();
      }
    })
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
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
  //getsubscription data
  getSubscriptionData(){
    this.updateUsageDetails();
    this.pricingChart()
    if(['Standard','Enterprise'].includes(this.currentSubscriptionPlan?.subscription?.planName)) this.featureLimit = 100;
  }
  //after plans api called get data from upgrade component
  getPlans(event){
    this.getSubscriptionData();
  }
  //show or hide banner
  showBanner(obj) {
    this.bannerObj = { ...this.bannerObj, msg: obj?.msg, type: obj?.type, show: true };
  }
  //clear banner
  clearBanner() {
    this.bannerObj = { msg: '', type: '', show: false };
  }
  //select upgrade component methods
  selectModal(type) {
    if (type == 'choose_plan') {
      this.plans.openSelectedPopup('choose_plan');
    }
    else if (type === 'add_overage') {
      this.plans.openSelectedPopup('add_overage');
    }
  }
  //open | Cancel subscription modal
  cancelSubscriptionModal(type) {
    if (type === 'open') {
      this.cancelSubscriptionModelPopRef = this.cancelSubscriptionModel.open();
    }
    else if (type === 'close') {
      const commentInput: any = document.getElementById("cancel_comment_text");
      const checkboxes: any = document.querySelectorAll('.checkbox-custom');
      commentInput.value = '';
      for (let check of checkboxes) {
        check.checked = false;
      }
      this.cancelSubscriptionModelPopRef.close();
    }
  }
  //open | close revert cancel model
  revertCancelModal(type) {
    if (type === 'open') {
      this.revertCancelModelPopRef = this.revertCancelModel.open();
    }
    else if (type === 'close') {
      if (this.revertCancelModelPopRef.close) this.revertCancelModelPopRef.close();
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
      this.appSelectionService.getCurrentSubscriptionData();
      this.notificationService.notify('Cancellation request submitted', 'success');
      if (dialogRef) dialogRef.close();
    }, errRes => {
      this.errorToaster(errRes, 'failed to Cancel subscription');
    });
  }
  //cancel subscription api
  cancelSubscription() {
    this.btnLoader = true;
    let checkedData = [];
    const comment_data: any = document.getElementById('cancel_comment_text');
    for (let data of this.cancellationCheckboxText) {
      if (data.selected) checkedData.push(data.name);
    }
    const queryParam = { streamId: this.selectedApp._id };
    const payload = {
      subscriptionId: this.currentSubscriptionPlan?.subscription?._id,
      feedback: {
        reasons: checkedData,
        comment: comment_data?.value
      }
    };
    this.service.invoke('put.cancelSubscribtion', queryParam, payload).subscribe(res => {
      this.appSelectionService.getCurrentSubscriptionData();
      this.btnLoader = false;
      this.notificationService.notify('Cancellation Request Submitted', 'success');
      this.cancelSubscriptionModal('close');
    }, errRes => {
      this.btnLoader = false;
      this.errorToaster(errRes, 'failed to Cancel subscription');
    });
  }
  //Grap data
  pricingChart() {
    let xAxisQueryData = [];
    let years=[];
    let xAxisDocumentData = [];
    let yAxisQueryData = [];
    let yAxisDocumentData = [];
    let barDocColor = "#28A745";
    let barQueColor = "#7027E5";
    if (this.currentSubscriptionPlan && this.currentSubscriptionPlan.analytics && this.currentSubscriptionPlan.analytics.search) {
      this.currentSubscriptionPlan.analytics.search.forEach(element => {
        xAxisQueryData.push(element.month)
        yAxisQueryData.push(element.total)
        years.push(2022);
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
      this.isyAxisQuerydata = false;
      barQueColor = "#EFF0F1";
    } else {
      this.isyAxisQuerydata = true;
      barQueColor = "#7027E5";
    }
    xAxisQueryData.length ? this.monthRange = xAxisQueryData[0] + ' - ' + xAxisQueryData[xAxisQueryData.length - 1] : this.monthRange = "Jan - June";
    this.queryGraph  = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'none'
        },
        formatter:
        `<div class="pricing-hover-tooltip">
        <div class="row-data-info">
          <i class="si-interuptions"></i>
          <span class="count-text">{c0}</span>
          <span class="title">{a0}</span>
        </div>
      </div>`,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: xAxisDocumentData,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
      },{
         position: 'bottom',
            offset: 15,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            data: years
      }],
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      series: [
        {
          name: 'Documents',
          type: 'bar',
          data: yAxisQueryData,
            barWidth: 10,
            barCategoryGap: '10%',
            itemStyle: {normal: {color: '#FFBCA5'}},
            emphasis : {itemStyle : {color: "#ff8000"} },
        },
        {
          name: 'Queries',
          type: 'bar',
          data: yAxisDocumentData,
          barWidth: 10,
            barCategoryGap: '10%',
            itemStyle: {normal: {color: '#B893F2'}},
            emphasis : {itemStyle : {color: "#7027E5"}},
        }
      ]
    };
    this.documentGraph = {

      grid: {
        left: '15%',
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
    // if (Math.max(...yAxisQueryData) > 5) {
    //   delete this.queryGraph.yAxis.min;
    //   delete this.queryGraph.yAxis.max;
    // }
    // if (this.isyAxisQuerydata) {
    //   delete this.queryGraph.xAxis.name
    //   delete this.queryGraph.xAxis.nameLocation
    //   delete this.queryGraph.xAxis.nameGap
    //   this.queryGraph.grid.bottom = "3%"
    // }
    // if (Math.max(...yAxisDocumentData) > 5) {
    //   delete this.documentGraph.yAxis.min;
    //   delete this.documentGraph.yAxis.max;
    // }
    // if (this.isyAxisDocumentdata) {
    //   delete this.documentGraph.xAxis.name
    //   delete this.documentGraph.xAxis.nameLocation
    //   delete this.documentGraph.xAxis.nameGap
    //   this.documentGraph.grid.bottom = "3%"
    // }
  }
  //renew subscription
  renewSubscription() {
    this.btnLoader = true;
    const queryParam = {
      streamId: this.selectedApp?._id
    }
    this.service.invoke('get.renewSubscribtion', queryParam).subscribe(res => {
      setTimeout(() => {
        this.appSelectionService.getCurrentSubscriptionData();
        if (this.bannerObj.show) this.clearBanner();
        this.btnLoader = false;
        this.revertCancelModal('close');
      }, 2000)
      // this.notificationService.notify('Cancel Subscription', 'success');
    }, errRes => {
      this.btnLoader = false;
      this.errorToaster(errRes, 'failed to renew subscription');
    });
  }
  updateUsageDetails() {
    if (this.plans?.totalPlansData) {
      this.usageDetails={};
      const currentUsageData = this.appSelectionService?.currentUsageData
      const planName = this.currentSubscriptionPlan?.subscription?.planName;
      const currentPlan = this.plans?.totalPlansData?.filter(plan => plan?.name === planName);
      this.usageDetails.ingestDocsLimit = currentPlan[0]?.featureAccess?.ingestDocs?.limit;
      this.usageDetails.ingestDocsUsed = (currentUsageData?.ingestCount<=this.usageDetails.ingestDocsLimit)?(currentUsageData?.ingestCount):(this.usageDetails?.ingestDocsLimit)

      this.usageDetails.searchQueriesLimit = currentPlan[0]?.featureAccess?.searchQueries?.limit;
      this.usageDetails.searchQueriesUsed = (currentUsageData?.searchCount<=this.usageDetails.searchQueriesLimit)?(currentUsageData?.searchCount):(this.usageDetails?.searchQueriesLimit)

      this.usageDetails.ingestDocsUsedPercentage = (this.usageDetails.ingestDocsUsed/ this.usageDetails.ingestDocsLimit)*100
      this.usageDetails.searchQueriesUsedPercentage = (this.usageDetails.searchQueriesUsed/ this.usageDetails.searchQueriesLimit)*100
     //overages data
      const ingestDocs = this.currentSubscriptionPlan?.overages?.filter(item=>item.feature==='ingestDocs');
      const searchQueries = this.currentSubscriptionPlan?.overages?.filter(item=>item.feature==='searchQueries');

      this.usageDetails.ingestDocsOverageLimit = (ingestDocs?.length>0)?(ingestDocs.length*ingestDocs[0]?.totalFeatureLimit):0;
      this.usageDetails.ingestDocsOverageUsed = (currentUsageData?.ingestCount<=this.usageDetails.ingestDocsLimit)?0:(currentUsageData?.ingestCount-this.usageDetails.ingestDocsLimit)

      this.usageDetails.searchQueriesOverageLimit = (searchQueries?.length>0)?(searchQueries.length*searchQueries[0]?.totalFeatureLimit):0;
      this.usageDetails.searchQueriesOverageUsed = (currentUsageData?.searchCount<=this.usageDetails.searchQueriesLimit)?0:(currentUsageData?.searchCount-this.usageDetails.searchQueriesLimit)

      this.usageDetails.ingestDocsOverUsedPercentage = (this.usageDetails.ingestDocsOverageUsed/ this.usageDetails.ingestDocsOverageLimit)*100
      this.usageDetails.searchQueriesOverUsedPercentage = (this.usageDetails.searchQueriesOverageUsed/ this.usageDetails.searchQueriesOverageLimit)*100
    }
    this.pageLoading = false;
  }
  ngOnDestroy() {
    this.currentSubsciptionData ? this.currentSubsciptionData.unsubscribe() : false;
    this.updateUsageData ? this.updateUsageData.unsubscribe() : false;
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}
