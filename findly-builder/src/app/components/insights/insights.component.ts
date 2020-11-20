import { Component, OnInit, Input } from '@angular/core';
import { EChartOption } from 'echarts';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
declare const $: any;

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  @Input() data : any;
  @Input() query : any;
  @Input() showInsightFull : any;
  queryPipelineId;
  show = false;
  actionLog_id = 0;
  icontoggle : boolean = false;
  graphMode : boolean = true;
  iconIndex;
  ctrVal;
  slider : any = 1;
  filterArray : any = [];
  actionLogData : any = [];
  actionLogDatBack : any;
  selectedApp: any = {};
  serachIndexId;
  analystic : any = {};
  chartOption: EChartOption;
  staticChartOption : EChartOption = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          scale: true,
       
      },
      yAxis: {
          type: 'value',
          scale: true,
        show:false,
        splitLine:{
          show:false
        },
        splitArea : {show : false}
      },
   
series: [{
  data: [7, 10, 14, 18, 15, 10, 6],
  type: 'line',
  smooth: true,
  lineStyle: {
    color: '#202124',
  }
},
{
  data: [8, 11, 21, 15, 10, 5, 5],
  type: 'line',
  smooth: true,
  lineStyle: {
    color: '#3368BB',
  }
},
{
data: [8, 11, 16, 15, 10, 5, 5],
type: 'line',
smooth: true,
lineStyle: {
  color: '#009DAB',
}
}
]
  }
  
  
  constructor(public workflowService: WorkflowService,private service: ServiceInvokerService,private notificationService: NotificationService) { }
  getQueryLevelAnalytics(){
    // if(window.koreWidgetSDKInstance.vars.searchObject.searchText){
    //    this.query = window.koreWidgetSDKInstance.vars.searchObject.searchText;
    // } 
    //this.query = "Open bank account"
    let date = new Date();
    let _month_old_date =new Date(Date.now() - (30 * 864e5));
    let startDate = date.getFullYear()+ "-" +date.getMonth()+ "-"+ date.getDate();
    let endDate = _month_old_date.getFullYear()+ "-" +_month_old_date.getMonth()+ "-"+ _month_old_date.getDate();
    const quaryparms: any={
      searchIndexId: this.serachIndexId,
      startDate : "2020-10-10",//startDate,
      endDate : "2020-11-10"//endDate,
    }
    var payload = {
      "searchQuery": this.query
    }
    // this.analystic =  {
    //   "searches": 5983,
    //   "clicks": 4254
    // };
     this.ctrVal = Math.floor(this.analystic['clicks'] / this.analystic['searches'] ) * 100;
    
      this.service.invoke('get.QueryLevelAnalytics',quaryparms,payload).subscribe(res => {
        console.log(res)
        this.analyticGraph(res)
        this.analystic =  res;
        if(this.analystic['searches'] == 0 || this.analystic['clicks'] == 0){
          this.ctrVal = 0;
        }else{
          this.ctrVal = Math.floor(this.analystic['clicks'] / this.analystic['searches'] ) * 100;
        }
      },error =>{
        console.log(error);
      });
  }
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId = this.selectedApp.searchIndexes[0].queryPipelineId;
    this.customInit();
    //setTimeout(()=>{
      this.selectedApp = this.workflowService.selectedApp();
      this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
      this.getQueryLevelAnalytics();
    //},5000)
    this.getcustomizeList();

  }
  analyticGraph(responseData){
    let search_x_axis_data = [];
    let click_x_axis_data = [];
    let ctr_x_axis_data = [];
    let _y_axis_data = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    if(responseData.searchesData){
      responseData.searchesData.forEach(element => {
        let date = new Date(element.date);
        _y_axis_data.push(date.getDate() + " " +monthNames[date.getMonth()])
        search_x_axis_data.push(element.searches);
        _y_axis_data.push(element.date);
      });
    }
    if(responseData.clicksData){
      responseData.clicksData.forEach(element => {
        click_x_axis_data.push(element.clicks);
        //_y_axis_data.push(element.date);
      });
    }
    if(responseData.ctrData){
      responseData.ctrData.forEach(element => {
        ctr_x_axis_data.push(element.ctr);
      });
    }
   this.chartOption = {
      xAxis: {
        type: 'category',
        data: _y_axis_data,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        scale: true,
      //  show:false,
      //  splitLine:{//remove grid lines
      // 	show:false
      // },
        //splitArea : {show : false}// remove the grid area
    },
    yAxis: {
        type: 'value',
        scale: true,
       show:false,
       splitLine:{
        show:true
      },
       splitArea : {show : false}
    },
    tooltip: {
        axisPointer: {
            label: {
                //backgroundColor: '#6a7985'
            }
        }
    },
        series: [{
            data: search_x_axis_data,//[7, 10, 14, 18, 15, 10, 6],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#202124',
            }
        },
        {
            data: click_x_axis_data, //[8, 11, 21, 15, 10, 5, 5],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#3368BB',
            }
        },
        {
          data: ctr_x_axis_data, //[8, 11, 17, 15, 35, 5, 5],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#009DAB',
          }
      }]
    };
  }
  customInit(){
   // $("#advanceContainer").delay(800).fadeIn();
   // $('#advanceContainer').animate($('.dis').addClass('adv-opt-mode'), 500 );
    
  //   this.actionLogData = [{
  //     "header" : "Can I make credit card payament via savings account", // and get notifiaction once done?
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "New",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "help",
  //     "status": "Boosted",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "bot",
  //     "status": "Hidden",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },
  //   {
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false
  //   },{
  //     "header" : "Can I make credit card payament via savings account",
  //     "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
  //     "option": "doc",
  //     "status": "Pinned",
  //     "time" : "3h ago",
  //     "selected" : false
  //   }
  // ]
  this.actionLogDatBack = [...this.actionLogData]
  this.actionLogData.forEach(element => {
    this.filterArray.push(element.status)
  });
  this.filterArray = new Set(this.filterArray);
  console.log(this.data)
  }
  filterRecord(type){
    this.actionLogData = [...this.actionLogDatBack];
    if(type == "all"){
      this.actionLogData = [...this.actionLogDatBack];
    }else{
      this.actionLogData = this.actionLogData.filter((data) => {
        return data.status == type
      });
    }
  }
  closeCross(){
    this.graphMode = false;
  }
  mouseEnter(){
    this.graphMode = true;
  }
  mouseLeave(){
    //this.graphMode = false;
  }
  filter(){

  }
  toggle(icontoggle,selected){
    let previousIndex = this.iconIndex
    //previousIndex == index ? this.icontoggle = !icontoggle : this.icontoggle = icontoggle;
    this.icontoggle = !icontoggle; 
    //this.iconIndex  = index;
    //this.actionLogData[index].selected = !selected;
  }
  swapSlider(slide){
    this.slider = slide;
    if(this.slider == 0 && $('.tab-name').length){
      $('.tab-ana').addClass('active')
      $('.tab-act').removeClass('active')
    }else{
      $('.tab-act').addClass('active')
      $('.tab-ana').removeClass('active')
    }
    console.log('button clicked')
  }

  getcustomizeList(){
   
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId
    };
    this.service.invoke('get.queryCustomizeList', quaryparms).subscribe(res => {
      if(res.length){
        this.actionLog_id = res[res.length-1]._id;
        this.clickCustomizeRecord(res[res.length-1]._id);
      }
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
  }
  clickCustomizeRecord(_id){
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      queryPipelineId : this.queryPipelineId,
      rankingAndPinningId : _id
    };
    this.service.invoke('get.customisationLogs', quaryparms).subscribe(res => {
      //this.customizeList = res;
      this.actionLogData = res;
      for(let i =0; i<this.actionLogData.length; i++){
        this.actionLogData[i]["selected"] = false;
        this.actionLogData[i]["drop"] = false;
        // if(this.actionLogData[i].target.contentType == 'faq'){
        //   this.faqDesc = this.actionLogData[i].target.contentInfo.defaultAnswers[0].payload
        // }
      }
      console.log(res);
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed', 'error');
       }
     });
  }

}
