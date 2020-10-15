import { Component, OnInit, Input } from '@angular/core';
import { EChartOption } from 'echarts';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
declare const $: any;

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  @Input() data : any;
  icontoggle : boolean = false;
  graphMode : boolean = false;
  iconIndex;
  ctrVal;
  slider : any = 1;
  filterArray : any = [];
  actionLogData : any;
  actionLogDatBack : any;
  selectedApp: any = {};
  serachIndexId;
  analystic : any = {};
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
    //   series: [{
    //     data: [400, 400, 450, 450, 450, 400, 400],
    //     type: 'line',
    //     smooth: true
    // },
    // {
    //     data: [350, 390, 450, 400, 350, 380, 350],
    //     type: 'line',
    //     smooth: true
    // },
    //  {
    //     data: [600, 400, 380, 370, 360, 350, 200],
    //     type: 'line',
    //     smooth: true
    // }]
    series: [{
      data: [14, 10, 14, 14, 10, 14, 10],
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#202124',
      }
  },
  {
      data: [14, 11, 21, 17, 13, 5, 5],
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#3368BB',
      }
  },
  {
    data: [13, 11, 16, 15, 12, 11, 13],
    type: 'line',
    smooth: true,
    lineStyle: {
      color: '#009DAB',
    }
}]
  }
  chartOption: EChartOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
			show:false
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
  };
  constructor(public workflowService: WorkflowService,private service: ServiceInvokerService) { }
  getQueryLevelAnalytics(){
    const quaryparms: any={
      searchIndexId: this.serachIndexId,
    }
    var payload = {
      "searchQuery": "Open bank account"
    }
    // this.analystic =  {
    //   "searches": 5983,
    //   "clicks": 4254
    // };
    // this.ctrVal = Math.floor(this.analystic['searches'] / this.analystic['clicks'] ) * 100;
    
      this.service.invoke('get.QueryLevelAnalytics',quaryparms,payload).subscribe(res => {
        console.log(res)
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
    this.getQueryLevelAnalytics();
    $("#advanceContainer").delay(800).fadeIn();
    $('#advanceContainer').animate($('.dis').addClass('adv-opt-mode'), 500 );
    
    this.actionLogData = [{
      "header" : "Can I make credit card payament via savings account", // and get notifiaction once done?
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "New",
      "time" : "3h ago",
      "selected" : false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "help",
      "status": "Boosted",
      "time" : "3h ago",
      "selected" : false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "bot",
      "status": "Hidden",
      "time" : "3h ago",
      "selected" : false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false
    }
  ]
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
  toggle(icontoggle,index,selected){
    let previousIndex = this.iconIndex
    //previousIndex == index ? this.icontoggle = !icontoggle : this.icontoggle = icontoggle;
    this.icontoggle = !icontoggle; 
    this.iconIndex  = index;
    this.actionLogData[index].selected = !selected;
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

}
