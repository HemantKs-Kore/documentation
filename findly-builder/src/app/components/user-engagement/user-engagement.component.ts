import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { EChartOption } from 'echarts';
import { NGB_DATEPICKER_18N_FACTORY } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-i18n';

@Component({
  selector: 'app-user-engagement',
  templateUrl: './user-engagement.component.html',
  styleUrls: ['./user-engagement.component.scss']
})
export class UserEngagementComponent implements OnInit {
  selectedApp;
  serachIndexId;
  pageLimit = 5;
  totalSearchSum =0;
  searchesWithClicksSum = 0;
  searchesWithResultsSum = 0;
  tsqtotalRecord = 100;
  tsqlimitpage = 5;
  tsqrecordEnd = 5;

  tsqNoRtotalRecord = 100;
  tsqNoRlimitpage = 5;
  tsqNoRrecordEnd = 5;

  tsqNoCtotalRecord = 100;
  tsqNoClimitpage = 5;
  tsqNoCrecordEnd = 5;

  tsqPtotalRecord = 100;
  tsqPlimitpage = 10;
  tsqPrecordEnd = 10;

  tsqNoRPtotalRecord = 100;
  tsqNoRPlimitpage = 10;
  tsqNoRPrecordEnd = 10;
  
  tsqNoCPtotalRecord = 100;
  tsqNoCPlimitpage = 10;
  tsqNoCPrecordEnd = 10;

  totalRecord = 100;
  limitpage = 5;
  recordEnd = 5;
  topQuriesWithNoResults : any;
  mostSearchedQuries : any = {};
  queriesWithNoClicks : any;
  searchHistogram : any;
  heatMapChartOption : EChartOption;
  feedbackPieSearches : EChartOption;
  feedbackPieResult : EChartOption;
  mostClickBar : EChartOption;
  chartOption : EChartOption;
  chartOption1 : EChartOption;
  userEngagementChartData : EChartOption;
  isAsc = true;
  slider = 1;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    
    this.userEngagementChart();
    this.mostClick();
    //this.feedback();
    this.busyHours();
    this.getQueries("TopQuriesWithNoResults");
    this.getQueries("MostSearchedQuries");
    this.getQueries("QueriesWithNoClicks");
    this.getQueries("SearchHistogram");
    
  }
  tab(index){
    this.slider = index
    if(index == 2){
      this.pageLimit = 10
    }
  }
  paginate(event){
    console.log(event)
  }
  getQueries(type){
    var today = new Date();
    var yesterday = new Date(Date.now() - 864e5);
    const header : any= {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit:this.pageLimit
    };
    let payload : any = {
      type : type,
      filters: {
        from: yesterday.toJSON(),
        to: today.toJSON()
      }
    }
    if(type == "QueriesWithNoClicks"){
      payload.sort = {
        order: "desc", 
        by: "timestamp"
      }
    }
    this.service.invoke('get.queries', quaryparms,payload,header).subscribe(res => {
      if(type == 'TopQuriesWithNoResults'){
        this.topQuriesWithNoResults = res.response;
        this.tsqNoRtotalRecord = res.response.length;
        this.tsqNoRPtotalRecord = res.response.length;
        if(!res.response.length){
          this.tsqNoRtotalRecord = 0
          this.tsqNoRlimitpage = 0;
          this.tsqNoRrecordEnd = 0;
        }
        this.pagination(this.topQuriesWithNoResults,type)
      }else if(type == 'MostSearchedQuries'){
        this.mostSearchedQuries = res.result;
        this.tsqtotalRecord = res.result.length;
        this.tsqPtotalRecord = res.result.length;
        if(!res.result.length){
          this.tsqtotalRecord = 0;
          this.tsqlimitpage = 0;
          this.tsqrecordEnd = 0;
        }
        this.pagination(this.mostSearchedQuries,type)
      }else if(type == 'QueriesWithNoClicks'){
        this.queriesWithNoClicks = res.result;
        this.tsqNoCtotalRecord = res.result.length;
        this.tsqNoCPtotalRecord = res.result.length;
        if(!res.result.length){
            this.tsqNoCtotalRecord = 0
            this.tsqNoClimitpage = 0;
            this.tsqNoCrecordEnd = 0;
          }
          this.pagination(this.queriesWithNoClicks,type)
      }else if(type == 'SearchHistogram'){
        this.searchHistogram = res.result;
        this.summaryChart();
      }
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
  }
  
  
  pagination(data,type){
    if(type == 'MostSearchedQuries'){
      if(data.length <= this.tsqlimitpage){ this.tsqlimitpage = data.length }
      if(data.length <= this.tsqrecordEnd){ this.tsqrecordEnd = data.length }

      if(data.length <= this.tsqPlimitpage){ this.tsqPlimitpage = data.length }
      if(data.length <= this.tsqPrecordEnd){ this.tsqPrecordEnd = data.length }

    }
    if(type == 'TopQuriesWithNoResults'){
      if(data.length <= this.tsqNoRlimitpage){ this.tsqNoRlimitpage = data.length }
      if(data.length <= this.tsqNoRrecordEnd){ this.tsqNoRrecordEnd = data.length }

      if(data.length <= this.tsqNoRPlimitpage){ this.tsqNoRPlimitpage = data.length }
      if(data.length <= this.tsqNoRPrecordEnd){ this.tsqNoRPrecordEnd = data.length }

    }
    if(type == 'QueriesWithNoClicks'){
      if(data.length <= this.tsqNoClimitpage){ this.tsqNoClimitpage = data.length }
      if(data.length <= this.tsqNoCrecordEnd){ this.tsqNoCrecordEnd = data.length }

      if(data.length <= this.tsqNoCPlimitpage){ this.tsqNoCPlimitpage = data.length }
      if(data.length <= this.tsqNoCPrecordEnd){ this.tsqNoCPrecordEnd = data.length }

    }
  }
  
  summaryChart(){
   
var totaldata = [];
this.totalSearchSum = 0;
for(var i = 0 ; i< this.searchHistogram.length; i++){
  totaldata.push([i+'hr',this.searchHistogram[i].totalSearches,this.searchHistogram[i].searchesWithResults,this.searchHistogram[i].searchesWithClicks])
  this.totalSearchSum = this.totalSearchSum + this.searchHistogram[i].totalSearches;
  this.searchesWithResultsSum = this.searchesWithResultsSum + this.searchHistogram[i].searchesWithResults;
  this.searchesWithClicksSum = this.searchesWithClicksSum + this.searchHistogram[i].searchesWithClicks
}

var searchWithResultdata = []
var searchWithClickdata = []

var dateList = totaldata.map(function (item) {
    return item[0];
});

var valueList = totaldata.map(function (item) {
    return item[1];
});
var valueList1 = totaldata.map(function (item) {
    return item[2];
});

var valueList2 = totaldata.map(function (item) {
    return item[3];
});
// this.chartOption  = {
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
// },
//     // 4th August, 2020
//     tooltip: {
//       trigger: 'axis',  
//       formatter: `
//       <div class="metrics-tooltips-hover">
//       <div class="main-title">{b0}</div>
//       <div class="data-content"><span class="indication searches"></span><span class="title">Total Searches
//               :</span><span class="count-data">{c0}</span></div>
//       <div class="data-content"><span class="indication result"></span><span class="title">Searches with Results
//               :</span><span class="count-data">{c1}</span></div>
//       <div class="data-content"><span class="indication clicks"></span><span class="title">Searches with Clicks
//               :</span><span class="count-data">{c2}</span></div>
//   </div>
//       `,
//       position: 'top',
//       padding: 0
//     },
 
//     xAxis: [{
//         data: dateList,
//        // type: 'time',
//         minInterval : 8,
//          boundaryGap:false,
//         show: true,
//         //data: ['1st Aug', '2nd Aug' , '3rd Aug', '4th Aug', '5th Aug', '6th Aug', '7th Aug']
//         //splitLine: {show: true}
//     }],
//     yAxis: [{
//         splitLine: {show: true}
//     }],
    
//     series: [{
//         type: 'line',
//         showSymbol: false,
//         data: valueList,
//         lineStyle: {color: '#0D6EFD'}
//     },{
//         type: 'line',
//         showSymbol: false,
//         data: valueList1,
//         lineStyle: {color: '#28A745'}
//     }
//     ,{
//         type: 'line',
//         showSymbol: false,
//         data: valueList2,
//         lineStyle: {color: '#7027E5'}
//     }]
// };
    /** TEST */
    //     this.chartOption1 = {
    //       grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //       xAxis: {
    //         type: 'category',
    //         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //         scale: true,
    //        show:true,
    //        splitLine:{//remove grid lines
    //       	show:false
    //       },
    //         //splitArea : {show : false}// remove the grid area
    //     },
    //     yAxis: {
    //         type: 'value',
    //         scale: true,
    //       show:true,
    //       splitLine:{
    //         show:true
    //       },
    //       splitArea : {show : false}
    //     },
    //     // tooltip: {
    //     //     axisPointer: {
    //     //         label: {
    //     //             //backgroundColor: '#6a7985'
    //     //         }
    //     //     }
    //     // },
    //     tooltip: {
          
    //       formatter: `
    //       <div class="metrics-tooltips-hover">
    //       <div class="main-title">4th August, 2020</div>
    //       <div class="data-content"><span class="indication searches"></span><span class="title">Total Searches
    //               :</span><span class="count-data">240</span></div>
    //       <div class="data-content"><span class="indication result"></span><span class="title">Searches with Results
    //               :</span><span class="count-data">160</span></div>
    //       <div class="data-content"><span class="indication clicks"></span><span class="title">Searches with Clicks
    //               :</span><span class="count-data">80</span></div>
    //   </div>
    //       `,
    //       position: 'top',
    //       padding: 0
    //     },
    //     series: [{
    //         data: [7, 10, 14, 18, 15, 10, 6],
    //         type: 'line',
    //         lineStyle: {
    //           color: '#202124',
    //         }
    //     },
    //     {
    //         data: [8, 11, 21, 15, 10, 5, 5],
    //         type: 'line',
    //         lineStyle: {
    //           color: '#3368BB',
    //         }
    //     },
    //     {
    //       data: [8, 11, 16, 15, 10, 5, 5],
    //       type: 'line',
    //       lineStyle: {
    //         color: '#009DAB',
    //       }
    //   }
    // ]};
  }
  userEngagementChart(){
    let data = []
    let data1 = [];
    for(let i = 0; i<= 90; i++ ){
      // if(i % 2 == 0){
      //   data.push([[i,i,i]])
      // }else if(i % 3 == 0){
      //   data.push([[i+1,i+4,i+5]])
      // }else if(i % 5 == 0){
      //   data.push([[i+3,i+4,i+2]])
      // }
      
      data.push(i + "Aug")
      data1.push(i)
    }
    this.userEngagementChartData = {
      
      tooltip: {
        trigger: 'axis',
        axisPointer: {            
          type: 'none'        
      },
        formatter:  (params) => `
        <div class="metrics-tooltips-hover userengagment-tooltip">          
        <div class="data-content">
            <div class="main-title">Total Users</div>
            <div class="title total">${params[0].value + params[1].value}</div>
        </div>
        <div class="data-content">
            <div class="main-title">New Users</div>
            <div class="title new">${params[1].value}</div>
        </div>
        <div class="data-content border-0">
            <div class="main-title">Repeat Users</div>
            <div class="title return">${params[0].value}</div>
        </div>
    </div> 
        `,
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
          data: data//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
         
      },
      yAxis: {
           type: 'value'
      },
      series: [
        //barMinWidth = 10;
          {
              name: 'bottom',
              type: 'bar',
              stack: '总量',
              // label: {
              //     show: true,
              //     position: 'insideRight'
              // },
              barWidth: 10,
              itemStyle: {
                
                normal: {
                  color: '#FF784B',
                    barBorderRadius: [0, 0, 50 ,50 ]
                },
                
              },
              data: data1
          },
          {
              name: 'top',
              type: 'bar',
              stack: '总量',
              // label: {
              //     show: true,
              //     position: 'insideRight'
              // },
              barWidth: 10,
              itemStyle: {
                normal: {
                  color: '#0D6EFD',
                    barBorderRadius: [50, 50, 0 ,0 ]
                }
              },
              lineStyle: {
                color: '#0D6EFD',
              },
              data: data1
          }
      ]
  };
  }
    mostClick(){
        this.mostClickBar  = {
          xAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
            },
           // name: "Number  of  Clicks"
          },
          yAxis: {
            type: 'category',
              data: ['1st ', ' 2nd', '3rd']
              
          },
          barWidth: 40,
          series: [{
            label : {
              normal: {
                  show: true,
                  position: 'outside',
                  color : '#202124',
                  //textBorderColor: '#202124',
                  //textBorderWidth: 1
              }
          },
            itemStyle: {
              normal: {
                color: '#B893F2',
              },
            },
              data: [120, 200, 150],
              type: 'bar'
          }]
      };
    
    }
    // feedback(){
    //   var colorPaletteSearch = ['#28A745','#EAF6EC'];
    //   var colorPaletteResult = ['#FF784B','#FFF1ED'];
    //   this.feedbackPieSearches = {
        
    //     series: [{
    //         type: 'pie',
    //         radius: 90,
    //         color: colorPaletteSearch,
    //         hoverAnimation: false,
    //         center: ['50%', '50%'],
    //         data: [30,70],
    //         label: {
    //             show: true,
    //             position: 'inner',
    //             formatter: (params) => {
    //               return params.percent ? params.percent + '%' : '';
    //             },
               
    //       },
    //     } 
    //   ]
    // };
    //   this.feedbackPieResult = {
        
    //         series: [{
    //             type: 'pie',
    //             radius: 90,
    //             color: colorPaletteResult,
    //             hoverAnimation: false,
    //             center: ['50%', '50%'],
    //             data: [30,70],
    //             label: {
    //                 show: true,
    //                 position: 'inner',
    //                 formatter: (params) => {
    //                   return params.percent ? params.percent + '%' : '';
    //                 }
    //           },
    //         } 
    //       ]
    //     };
      
    // }
    busyHours(){
      //let hours = ["1","2"]
      let hours = ["5 am","6 am","7 am","8 am","9 am","10 am","11 am","12 pm","1 pm","2 pm","3 pm","4 pm","5 pm","5 am","6 am","7 am","8 am","9 am","10 am","11 am","12 pm","1 pm","2 pm","3 pm","4 pm","5 pm","5 am","6 am","7 am","8 am","9 am","10 am","11 am","12 pm","1 pm","2 pm","3 pm","4 pm","5 pm"];
    //let days = ["1st Aug","2nd Aug","3rd Aug","4th Aug","5th Aug","6th Aug","7th Aug","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40"]
    let days = [];
    let data = []//[[0,0,1],[0,1,2],[0,2,3],[0,3,4],[0,4,5],[0,5,6],[0,6,7],[1,0,1],[1,1,2],[1,2,3],[1,3,4],[1,4,5],[1,5,6],[1,6,7],[2,0,1],[2,1,2],[2,2,3],[2,3,4],[2,4,5],[2,5,6],[2,6,7],[3,0,1],[3,1,2],[3,2,3],[3,3,4],[3,4,5],[3,5,6],[3,6,7],[4,0,1],[4,1,2],[4,2,3],[4,3,4],[4,4,5],[4,5,6],[4,6,7],[5,0,1],[5,1,2],[5,2,3],[5,3,4],[5,4,5],[5,5,6],[5,6,7],[6,0,1],[6,1,2],[6,2,3],[6,3,4],[6,4,5],[6,5,6],[6,6,7],[7,0,1],[7,1,2],[7,2,3],[7,3,4],[7,4,5],[7,5,6],[7,6,7],[8,0,1],[8,1,2],[8,2,3],[8,3,4],[8,4,5],[8,5,6],[8,6,7],[9,0,1],[9,1,2],[9,2,3],[9,3,4],[9,4,5],[9,5,6],[9,6,7],[10,0,1],[10,1,2],[10,2,3],[10,3,4],[10,4,5],[10,5,6],[10,6,7],[11,0,1],[11,1,2],[11,2,3],[11,3,4],[11,4,5],[11,5,6],[11,6,7],[12,0,1],[12,1,2],[12,2,3],[12,3,4],[12,4,5],[12,5,6],[12,6,7]];
    for(let i = 0; i<= 90; i++ ){
      for(let j = 0; j<= i; j++ ){
        for(let k = 1; k<= j; k++ ){
          data.push([i,j,k])
        }
      }
      // if(i % 2 == 0){
      //   data.push([[i,i,i]])
      // }else if(i % 3 == 0){
      //   data.push([[i+1,i+4,i+5]])
      // }else if(i % 5 == 0){
      //   data.push([[i+3,i+4,i+2]])
      // }
     
      days.push(i + "Aug")
    }  
    this.heatMapChartOption = {
        tooltip: {
          position: 'top'
        },
        animation: false,
        grid: {
          height: '70%',
          top: '10%',
          left: '5%',
          right: 0,
        },
        xAxis: {
          type: 'category',
          data: hours,
          axisLine: {
            show: false
          },
          axisLabel:{
            margin: 20,
            color: "#8a959f",
            fontWeight: "bold",
            fontSize: 12,
            fontFamily: "Lato"
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#FFF",
              width: 5
            }
          },
          splitArea: {
            show: true
          },
          boundaryGap: true,
          position: 'top'
        },
        yAxis: {
          type: 'category',
          data: days,
          axisLine: {
            show: false
          },
          axisLabel:{
            margin: 20,
            color: "#8a959f",
            fontWeight: "bold",
            fontSize: 12,
            fontFamily: "Lato"
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#FFF",
              width: 5
            }
          },
          splitArea: {
            show: true
          },
          boundaryGap: true
        },
  
        visualMap: [{
          show: false,
          min: 0,
          max: 10,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '0',
          inRange : {   
            color: ['rgba(0, 157, 171, 0.1)', '#009dab' ] //From smaller to bigger value ->
          }
        }],
        series: [{
          name: 'Users',
          type: 'heatmap',
          data: data,
          emphasis: {
            itemStyle: {
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 0.1
          }
  
        }]
      };
    }
}
