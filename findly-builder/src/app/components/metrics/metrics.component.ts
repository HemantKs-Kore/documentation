import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
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
  feedbackPie1 : EChartOption;
  feedbackPie2 : EChartOption;
  mostClickBar : EChartOption;
  chartOption : EChartOption;
  chartOption1 : EChartOption;
  userEngagementChartData : EChartOption;
  isAsc = true;
  slider = 0;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    
    this.userEngagementChart();
    this.mostClick();
    this.feedback();
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
  // compare(a: number | string, b: number | string, isAsc: boolean) {
  //   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  // }
  // sortBy(sort) {
  //   const data = this.resources.slice();
  //   this.selectedSort = sort;
  //   if (this.selectedSort !== sort) {
  //     this.isAsc = true;
  //   } else {
  //     this.isAsc = !this.isAsc;
  //   }
  //   const sortedData = data.sort((a, b) => {
  //     const isAsc = this.isAsc;
  //     switch (sort) {
  //       case 'type': return this.compare(a.type, b.type, isAsc);
  //       case 'recentStatus': return this.compare(a.recentStatus, b.recentStatus, isAsc);
  //       case 'name': return this.compare(a.name, b.name, isAsc);
  //       case 'createdOn': return this.compare(a.createdOn, b.createdOn, isAsc);
  //       default: return 0;
  //     }
  //   });
  //   this.resources = sortedData;
  // }
  summaryChart(){
    /** TEST */
    // let hours = ["5 am","6 am","7 am","8 am","9 am","10 am","11 am","12 pm","1 pm","2 pm","3 pm","4 pm","5 pm"];
    // let days = ["1st Aug","2nd Aug","3rd Aug","4th Aug","5th Aug","6th Aug","7th Aug"]

    // let testdata = [[0,0,1],[0,1,2],[0,2,3],[0,3,4],[0,4,5],[0,5,6],[0,6,7],[1,0,1],[1,1,2],[1,2,3],[1,3,4],[1,4,5],[1,5,6],[1,6,7],[2,0,1],[2,1,2],[2,2,3],[2,3,4],[2,4,5],[2,5,6],[2,6,7],[3,0,1],[3,1,2],[3,2,3],[3,3,4],[3,4,5],[3,5,6],[3,6,7],[4,0,1],[4,1,2],[4,2,3],[4,3,4],[4,4,5],[4,5,6],[4,6,7],[5,0,1],[5,1,2],[5,2,3],[5,3,4],[5,4,5],[5,5,6],[5,6,7],[6,0,1],[6,1,2],[6,2,3],[6,3,4],[6,4,5],[6,5,6],[6,6,7],[7,0,1],[7,1,2],[7,2,3],[7,3,4],[7,4,5],[7,5,6],[7,6,7],[8,0,1],[8,1,2],[8,2,3],[8,3,4],[8,4,5],[8,5,6],[8,6,7],[9,0,1],[9,1,2],[9,2,3],[9,3,4],[9,4,5],[9,5,6],[9,6,7],[10,0,1],[10,1,2],[10,2,3],[10,3,4],[10,4,5],[10,5,6],[10,6,7],[11,0,1],[11,1,2],[11,2,3],[11,3,4],[11,4,5],[11,5,6],[11,6,7],[12,0,1],[12,1,2],[12,2,3],[12,3,4],[12,4,5],[12,5,6],[12,6,7]];
   
    // var data = [
      
    //   ["1",227,166,136],
    //   ["2",313,299,229],
    //   ["3",315,311,227],
    //   ["4",345,282,266],
    //   ["5",346,293,267],
    //   ["6",357,294,290],
    //   ["7",367,311,300],
    //   ["8",371,309,301],
    //   ["9",389,321,299],
    //   ["10",391,312,298],
    //   ["11",387,345,297],
    //   ["12",361,346,266],
    //   ["13",367,347,255],
    //   ["14",390,357,233],
    //   ["15",301,366,221],
    //   ["16",311,307,245],
    //   ["17",325,307,306],
    //   ["18",409,386,381],
    //   ["19",401,365,321],
    //   ["20",422,364,300],
    //   ["21",421,373,363],
    //   ["22",411,366,309],
    //   ["23",312,311,308],
    //  ["24",345,301,293]];
      // ["25",290,288,285],
      // ["26",291,283,273],
      // ["27",276,269,259],
      // ["28",341,298,282],
      // ["29",340,289,287],
      // ["30",344,277,245],
      // ["31",346,261,232],
      // ["32",345,260,235],
      // ["33",348,255,243],
      // ["34",354,345,311],
      // ["35",334,334,298],
      // ["36",332,311,287],
      // ["37",367,301,267],
      // ["38",311,300,277],
      // ["39",310,307,273],
      // ["40",308,306,296],
      // ["41",301,305,299],
      // ["42",309,304,297],
      // ["43",289,260,242],
      // ["44",299,288,231],
      // ["45",252,247,245],
      // ["46",241,183,158],
      // ["47",212,167,161]];
      

//       // var dateList = data.map(function (item) {
//       //   return item[0];
//       // });
//       // var valueList = data.map(function (item) {
//       //   return item[1];
//       // });
//       // var valueList1 = data.map(function (item) {
//       //   return item[2];
//       // });

//       // var valueList2 = data.map(function (item) {
//       //   return item[3];
//       // });

// var dateList = data.map(function (item) {
//   return item[0];
// });

// var valueList = data.map(function (item) {
//   return item[1];
// });
// var valueList1 = data.map(function (item) {
//   return item[2];
// });

// var valueList2 = data.map(function (item) {
//   return item[3];
// });
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
this.chartOption  = {
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
},
    // 4th August, 2020
    tooltip: {
      trigger: 'axis',  
      formatter: `
      <div class="metrics-tooltips-hover">
      <div class="main-title">{b0}</div>
      <div class="data-content"><span class="indication searches"></span><span class="title">Total Searches
              :</span><span class="count-data">{c0}</span></div>
      <div class="data-content"><span class="indication result"></span><span class="title">Searches with Results
              :</span><span class="count-data">{c1}</span></div>
      <div class="data-content"><span class="indication clicks"></span><span class="title">Searches with Clicks
              :</span><span class="count-data">{c2}</span></div>
  </div>
      `,
      position: 'top',
      padding: 0
    },
  //   dataZoom: [{
  //     show: true,
  //     type: 'inside',
  //     filterMode: 'none',
  //     xAxisIndex: [0],
  //     startValue: 0,
  //     endValue: 24
  // }, {
  //     show: true,
  //     type: 'inside',
  //     filterMode: 'none',
  //     yAxisIndex: [0],
  //     startValue: 0,
  //     endValue: 2000
  // }],
    xAxis: [{
        data: dateList,
       // type: 'time',
        minInterval : 8,
         boundaryGap:false,
        show: true,
        //data: ['1st Aug', '2nd Aug' , '3rd Aug', '4th Aug', '5th Aug', '6th Aug', '7th Aug']
        //splitLine: {show: true}
    }],
    yAxis: [{
        splitLine: {show: true}
    }],
    
    series: [{
        type: 'line',
        showSymbol: false,
        data: valueList,
        lineStyle: {color: '#0D6EFD'}
    },{
        type: 'line',
        showSymbol: false,
        data: valueList1,
        lineStyle: {color: '#28A745'}
    }
    ,{
        type: 'line',
        showSymbol: false,
        data: valueList2,
        lineStyle: {color: '#7027E5'}
    }]
};
    /** TEST */
        this.chartOption1 = {
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            scale: true,
           show:true,
           splitLine:{//remove grid lines
          	show:false
          },
            //splitArea : {show : false}// remove the grid area
        },
        yAxis: {
            type: 'value',
            scale: true,
          show:true,
          splitLine:{
            show:true
          },
          splitArea : {show : false}
        },
        // tooltip: {
        //     axisPointer: {
        //         label: {
        //             //backgroundColor: '#6a7985'
        //         }
        //     }
        // },
        tooltip: {
          
          formatter: `
          <div class="metrics-tooltips-hover">
          <div class="main-title">4th August, 2020</div>
          <div class="data-content"><span class="indication searches"></span><span class="title">Total Searches
                  :</span><span class="count-data">240</span></div>
          <div class="data-content"><span class="indication result"></span><span class="title">Searches with Results
                  :</span><span class="count-data">160</span></div>
          <div class="data-content"><span class="indication clicks"></span><span class="title">Searches with Clicks
                  :</span><span class="count-data">80</span></div>
      </div>
          `,
          position: 'top',
          padding: 0
        },
        series: [{
            data: [7, 10, 14, 18, 15, 10, 6],
            type: 'line',
            lineStyle: {
              color: '#202124',
            }
        },
        {
            data: [8, 11, 21, 15, 10, 5, 5],
            type: 'line',
            lineStyle: {
              color: '#3368BB',
            }
        },
        {
          data: [8, 11, 16, 15, 10, 5, 5],
          type: 'line',
          lineStyle: {
            color: '#009DAB',
          }
      }
    ]};
  }
  userEngagementChart(){
    this.userEngagementChartData = {
      
      tooltip: {
        trigger: 'axis',
        axisPointer: {            
          type: 'none'        
      },
        formatter: `
        <div class="metrics-tooltips-hover userengagment-tooltip">          
       
        <div class="data-content">
            <div class="main-title">New Users</div>
            <div class="title new">{c1}</div>
        </div>
        <div class="data-content border-0">
            <div class="main-title">Repeat Users</div>
            <div class="title return">{c0}</div>
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
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
         
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
              data: [7, 6, 8, 6, 9, 5, 13]
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
              data: [3, 4, 2, 4, 1, 5, 7]
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
            }
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
                  color : '#202124',
                  textBorderColor: '#202124',
                  textBorderWidth: 1
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
    feedback(){
      var colorPalette = ['#28A745','#EAF6EC'];
      var colorPalette2 = ['#FF784B','#FFF1ED'];

      this.feedbackPie1 = {
        
            dataset: {
                source: [
                    ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                    ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                    ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                    
                ]
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            series: [{
                type: 'pie',
                radius: 80,
                color: colorPalette,
                center: ['25%', '30%'],
                itemStyle : {
                  normal : {
                             label : {
                                       show : false
                                      },
                             labelLine : {
                                           show : false
                                          }
                             }
                  }
                // No encode specified, by default, it is '2012'.
            }
            , {
                type: 'pie',
                radius: 80,
                color: ['#FF784B','#FFF1ED'],
                center: ['75%', '30%'],
                itemStyle : {
                  normal : {
                             label : {
                                       show : false
                                      },
                             labelLine : {
                                           show : false
                                          }
                             }
                  },
                encode: {
                    itemName: 'product',
                    value: '2013'
                }
            }
          ]
        };
      
    }
}
