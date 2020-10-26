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
  }
  paginate(event){
    console.log(event)
  }
  getQueries(type){
    const header : any= {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit:20
    };
    let payload : any = {
      type : type,
      filters: {
        from: "2020-10-14T00:29:38.552Z",
        to: "2020-10-21T00:29:38.552Z"
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
        this.topQuriesWithNoResults = res;
        this.tsqNoRtotalRecord = res.length;
        this.tsqNoRlimitpage = 5;
        this.tsqNoRrecordEnd = 5;
      }else if(type == 'MostSearchedQuries'){
        this.mostSearchedQuries = res;
        this.tsqtotalRecord = res.length;
        this.tsqlimitpage = 5;
        this.tsqrecordEnd = 5;
      }else if(type == 'QueriesWithNoClicks'){
        this.queriesWithNoClicks = res;
        this.tsqNoCtotalRecord = res.length;
        this.tsqNoClimitpage = 10;
        this.tsqNoCrecordEnd = 10;
      }else if(type == 'SearchHistogram'){
        this.searchHistogram = res;
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
    var data = [
      ["2000-06-05",127,116,216],
      ["2000-06-06",213,199,229],
      ["2000-06-07",215,201,227],
      ["2000-06-08",245,202,266],
      ["2000-06-09",246,203,267],
      ["2000-06-10",257,204,290],
      ["2000-06-11",267,211,300],
      ["2000-06-12",271,209,301],
      ["2000-06-13",289,321,299],
      ["2000-06-14",291,312,298],
      ["2000-06-15",287,345,297],
      ["2000-06-16",261,346,266],
      ["2000-06-17",267,347,255],
      ["2000-06-18",290,357,233],
      ["2000-06-19",301,366,221],
      ["2000-06-20",311,367,245],
      ["2000-06-21",325,367,376],
      ["2000-06-22",409,366,381],
      ["2000-06-23",401,365,321],
      ["2000-06-24",422,364,300],
      ["2000-06-25",321,363,373],
      ["2000-06-26",311,306,309],
      ["2000-06-27",312,312,324],
      ["2000-06-28",345,301,293],
      ["2000-06-29",290,302,285],
      ["2000-06-30",291,303,273],
      ["2000-07-01",276,299,289],
      ["2000-07-02",241,298,282],
      ["2000-07-03",240,289,287],
      ["2000-07-04",244,277,245],
      ["2000-07-05",246,261,232],
      ["2000-07-06",245,260,235],
      ["2000-07-07",248,255,243],
      ["2000-07-08",254,245,211],
      ["2000-07-09",234,234,198],
      ["2000-07-10",232,211,187],
      ["2000-07-11",267,201,167],
      ["2000-07-12",211,200,177],
      ["2000-07-13",210,107,173],
      ["2000-07-14",208,106,196],
      ["2000-07-15",201,105,207],
      ["2000-07-16",200,104,217],
      ["2000-07-17",199,100,222],
      ["2000-07-18",199,88,231],
      ["2000-07-19",202,77,247],
      ["2000-07-20",211,83,258],
      ["2000-07-21",212,111,261],
      ["2000-07-22",213,57,267]];

var dateList = data.map(function (item) {
  return item[0];
});

var valueList = data.map(function (item) {
  return item[1];
});
var valueList1 = data.map(function (item) {
  return item[2];
});

var valueList2 = data.map(function (item) {
  return item[3];
});
// var totaldata = []
// for(var i = 0 ; i< this.searchHistogram.length; i++){
//   totaldata.push([this.searchHistogram.date,this.searchHistogram.searchesWithClicks,this.searchHistogram.searchesWithResults,this.searchHistogram.totalSearches])
// }

// var searchWithResultdata = []
// var searchWithClickdata = []

// var dateList = totaldata.map(function (item) {
//     return item[0];
// });

// var valueList = totaldata.map(function (item) {
//     return item[1];
// });
// var valueList1 = totaldata.map(function (item) {
//     return item[2];
// });

// var valueList2 = totaldata.map(function (item) {
//     return item[3];
// });
this.chartOption  = {
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
},
    
    tooltip: {
      trigger: 'axis',  
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
    xAxis: [{
        data: dateList,
        minInterval : 7,
         boundaryGap:false,
        show: true,
    }],
    yAxis: [{
        splitLine: {show: false}
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
        formatter: `
        <div class="metrics-tooltips-hover engagement_analysis_tooltip">  
        <div class="data-content"><span class="indication voice"></span><span class="title"><b>20%</b> conversation in voice</span></div>
        <div class="data-content"><span class="indication chat"></span><span class="title"><b>30%</b> conversation in Chat</span></div>  
        <div class="info_message_data">Spent more than 60 Seconds with the bot</div>
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
              data: [320, 302, 301, 334, 390, 330, 320]
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
              data: [120, 132, 101, 134, 90, 230, 210]
          }
      ]
  };
  }
    mostClick(){
        this.mostClickBar  = {
          xAxis: {
              type: 'value'
              
          },
          yAxis: {
            type: 'category',
              data: ['1st ', ' 2nd', '3rd']
          },
          series: [{
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
      this.feedbackPie1 = {
    
            dataset: {
                source: [
                    ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                    ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                    ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                    
                ]
            },
            series: [{
                type: 'pie',
                radius: 60,
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
            }, {
                type: 'pie',
                radius: 60,
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
            }]
        };
      
    }
}
