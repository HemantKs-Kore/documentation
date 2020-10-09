import { Component, OnInit, Input } from '@angular/core';
import { EChartOption } from 'echarts';
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
  slider : any;
  filterArray : any = [];
  actionLogData : any;
  actionLogDatBack : any;
  chartOption: EChartOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      scale: true,
		 show:false,
		 splitLine:{//remove grid lines
			show:false
		},
      splitArea : {show : false}// remove the grid area
  },
  yAxis: {
      type: 'value',
      scale: true,
		 show:false,
		 splitLine:{//remove grid lines
			show:false
		},
     splitArea : {show : false}// remove the grid area
  },
  tooltip: {
      axisPointer: {
          label: {
              //backgroundColor: '#6a7985'
          }
      }
  },
  series: [{
      data: [5, 10, 15, 20, 15, 10, 5],
      type: 'line',
      smooth: true
  },
  {
      data: [10, 5, 20, 15, 10, 5, 5],
      type: 'line',
      smooth: true
  }]
  };
  constructor() { }

  ngOnInit(): void {
    (opts?: {
      width?: '50px',
      height?: '37px',
    }) => this.chartOption
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
    //this.actionLogData = [];
    if(type == "all"){
      this.actionLogData = [...this.actionLogDatBack];
    }else{
      this.actionLogData.filter((data) => {
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
    this.graphMode = false;
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
