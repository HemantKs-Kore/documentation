import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EChartOption } from 'echarts';
import { UpgradePlanComponent } from '../../helpers/components/upgrade-plan/upgrade-plan.component';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  documentGraph: EChartOption;
  queryGraph: EChartOption;
  addPricing1ModalPopRef: any;
  addPricing2ModalPopRef: any;
  addPricing3ModalPopRef: any;
  addOverageModalPopRef: any;
  addPricing5ModalPopRef: any;
  termPlan = "Monthly";
  templateShow: boolean = false;
  currentSubscriptionPlan : any;
  selectedApp;
  serachIndexId;
  totalPlansData: any;
  filterPlansData: any;
  addDocOver = false;
  addQueOver = false;
  numberDoc = 1;
  numberQuery = 1;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService) { }
  @ViewChild('addPricingModel1') addPricingModel1: KRModalComponent;
  @ViewChild('addPricingModel2') addPricingModel2: KRModalComponent;
  @ViewChild('addPricingModel3') addPricingModel3: KRModalComponent;
  @ViewChild('addOverageModel') addOverageModel: KRModalComponent;
  @ViewChild('addPricingModel5') addPricingModel5: KRModalComponent;
  @ViewChild('plans') plans: UpgradePlanComponent;

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.userEngagementChart()
    this.getPlan()
    this.currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
    if(!this.currentSubscriptionPlan){
      this.currentsubscriptionPlan(this.selectedApp)
    }
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
  getPlan() {
    this.service.invoke('get.pricingPlans').subscribe(res => {
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
  compare(type, data?) {
    if (type == 'choosePlans') {
      this.plans.openChoosePlanPopup(data);
    }
    else if (type == 'order') {
      this.plans.openOrderConfPopup(data);
    }else if(type =='orderOverage'){
      for (let data of this.totalPlansData) {
        if(this.currentSubscriptionPlan && this.currentSubscriptionPlan.subscription && this.currentSubscriptionPlan.subscription.planName){
          if (data.name == this.currentSubscriptionPlan.subscription.planName) {
            this.plans.openOrderConfPopup(data);
          }
        }
      }
    }
  }
  //open popup1
  openPopup1() {
    this.addPricing1ModalPopRef = this.addPricingModel1.open();
  }
  //close popup1
  closePopup1() {
    if (this.addPricing1ModalPopRef && this.addPricing1ModalPopRef.close) {
      this.addPricing1ModalPopRef.close();
    }
  }

  //open popup1
  openPopup2() {
    this.addPricing2ModalPopRef = this.addPricingModel2.open();
  }
  //close popup1
  closePopup2() {
    if (this.addPricing2ModalPopRef && this.addPricing2ModalPopRef.close) {
      this.addPricing2ModalPopRef.close();
    }
  }

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
    this.addOverageModalPopRef = this.addOverageModel.open();
  }
  //close popup1
  closeOveragePopup() {
    if (this.addOverageModalPopRef && this.addOverageModalPopRef.close) {
      this.addOverageModalPopRef.close();
    }
   this.cancelOveragePopup();
  }
  cancelOveragePopup(){
    this.addDocOver = false;
    this.addQueOver = false;
    this.numberQuery = 1;
    this.numberDoc = 1;
  }
  //open popup1
  openPopup5() {
    this.addPricing5ModalPopRef = this.addPricingModel5.open();
  }
  //close popup1
  closePopup5() {
    if (this.addPricing5ModalPopRef && this.addPricing5ModalPopRef.close) {
      this.addPricing5ModalPopRef.close();
    }
  }
  addDocument(){
    this.addDocOver = true
  }
  addQuerry(){
    this.addQueOver = true;
  }
  count(type,operation){
    if(type == 'doc'){
      if(operation =='plus'){
        this.numberDoc = this.numberDoc + 1;
      }else{
        this.numberDoc > 1 ? this.numberDoc = this.numberDoc - 1 : this.numberDoc = 1;
      }
    }else{
      if(operation =='plus'){
        this.numberQuery = this.numberQuery + 1;
      }else{
        this.numberQuery > 1 ?  this.numberQuery = this.numberQuery - 1: this.numberQuery = 1;
      }
    }
  }
  //Grap data
  userEngagementChart() {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let xAxisData = [];
    let yAxisRepeatUser = [];
    let yAxisNewUsers = [];
    this.queryGraph = {

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        position: 'top',
        padding: 0

      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Apr', 'May', 'Jun'], //data//
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
        nameGap: 10,
        nameTextStyle: {
          color: "#9AA0A6",
          fontWeight: "normal",
          fontSize: 1,
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
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          normal: {
            color: '#7027E5',
            barBorderRadius: [50, 50, 50, 50]
          },
        },
        lineStyle: {
          color: '#0D6EFD',
        },
      }]
    }
    this.documentGraph = {

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        position: 'top',
        padding: 0

      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Apr', 'May', 'Jun'], //data//
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
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          normal: {
            color: '#28A745',
            barBorderRadius: [50, 50, 50, 50]
          },
        },
        lineStyle: {
          color: '#0D6EFD',
        },
      }]
      // series: [
      //   //barMinWidth = 10;
      //     {
      //         name: 'bottom',
      //         type: 'bar',
      //         stack: '总量',
      //         // label: {
      //         //     show: true,
      //         //     position: 'insideRight'
      //         // },
      //         barWidth: 10,
      //         itemStyle: {

      //           normal: {
      //             color: '#FF784B',
      //               barBorderRadius: [0, 0, 50 ,50 ]
      //           },

      //         },
      //         data: yAxisRepeatUser
      //     },
      //     {
      //         name: 'top',
      //         type: 'bar',
      //         stack: '总量',
      //         // label: {
      //         //     show: true,
      //         //     position: 'insideRight'
      //         // },
      //         barWidth: 10,
      //         itemStyle: {
      //           normal: {
      //             color: '#0D6EFD',
      //               barBorderRadius: [50, 50, 0 ,0 ]
      //           }
      //         },
      //         lineStyle: {
      //           color: '#0D6EFD',
      //         },
      //         data:  yAxisNewUsers
      //     }
      // ]
    };
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
