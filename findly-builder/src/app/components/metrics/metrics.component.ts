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
  topQuriesWithNoResults : any;
  mostSearchedQuries : any;
  queriesWithNoClicks : any;
  searchHistogram : any;
  chartOption : EChartOption;
  userEngagementChartData : EChartOption;
  isAsc = true;
  slider = 0;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.summaryChart();
    this.userEngagementChart()
    this.getQueries("TopQuriesWithNoResults");
    this.getQueries("MostSearchedQuries");
    this.getQueries("QueriesWithNoClicks");
    this.getQueries("SearchHistogram");
    
  }
  tab(index){
    this.slider = index
  }
  getQueries(type){
   
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
    this.service.invoke('get.queries', quaryparms,payload).subscribe(res => {
      if(type == 'TopQuriesWithNoResults'){
        this.topQuriesWithNoResults = res;
      }else if(type == 'MostSearchedQuries'){
        this.mostSearchedQuries = res;
      }else if(type == 'QueriesWithNoClicks'){
        this.queriesWithNoClicks = res;
      }else if(type == 'SearchHistogram'){
        this.searchHistogram = res;
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
        this.chartOption = {
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
          //trigger: 'axis',
          // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          // }
      },
      // legend: {
      //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      // },
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
}
