import { Component, OnInit, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service'
import { SideBarService } from '@kore.services/header.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { IFilter } from 'src/app/data/filter.model';
import * as moment from 'moment-timezone';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PerfectScrollbarComponent  } from 'ngx-perfect-scrollbar';
import { CallHistoryModel } from '../../data/call-history.model';

declare const $: any;

@Component({
  selector: 'app-call-history',
  templateUrl: './call-history.component.html',
  styleUrls: ['./call-history.component.scss']
})
export class CallHistoryComponent implements OnInit {
  displayedColumns: string[] = ['userId', 'phoneNumber', 'startDateAandTime', 'endDateAandTime', 'status', 'flow'];
  dataSource: any = [];
  selectedApp: any;
  isLoading: boolean;
  filter: IFilter = {
    startDate: moment().subtract({days: 90}),
    endDate: moment(),
    status: '',
    flowType: ''
  }
  showDateRange: boolean;
  isInProgress: boolean;
  chatHistData: any = {
    messages: []
  };
  messageId: string = "";
  showLimit: any = 50;
  scrollSkip: any = 0;
  isMoreAvailable: boolean = false;
  dataAvailable: any = [];
  isMoreAvalLoad: boolean = false;

  constructor(
    public workflowService: workflowService,
    private headerService: SideBarService,
    private service: ServiceInvokerService,
  ) { }

  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;


  config: any = {
    suppressScrollX: true
  };
  lastScrollTop: any = 0;

  ngOnInit() {
    let toogleObj = {
      "title": "Conversational Logs",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.headerService.toggle(toogleObj);
    this.selectedApp = this.workflowService.deflectApps();
    this.getCallLogsData();
  }

  durationCalc(resp) {
    let date1 = new Date(resp.startedOn).valueOf();
    let date2 = new Date(resp.endedOn).valueOf();
    let diffTime = Math.abs(date2 - date1);
    let diffMins = Math.ceil(diffTime / (1000 * 60)); 
    let diffHours = 0;
    if(diffMins > 59) {
      diffHours = Math.floor(diffMins/60);
      diffMins = diffMins%60;
    }
    let d =  new Date(resp.startedOn);
    let mon = d.getMonth() + 1;
    let monStr = (mon<10)?'0'+mon:mon;
    let dStr = monStr +"-"+d.getDate() + "-"+d.getFullYear();
    let minutes: any;
    var hours = d.getHours();
    minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    if(diffHours != 0) {
      let duration: any;
      if(diffMins != 0) {
        duration = diffHours + 'Hrs ' + diffMins + 'min(s)';
      }
      else {
        duration = diffHours + 'Hrs';
      }
      return {
        dStr: dStr, strTime: strTime, diffMins: duration
      }
    }
    return {
      dStr: dStr, strTime: strTime, diffMins: diffMins + ' min(s)'
    }
  }


  isScrolling(e) {
    let st = e.target.scrollTop;
    if(Math.ceil(st + e.target.offsetHeight) >= e.target.scrollHeight) {
      if(st > this.lastScrollTop && this.isMoreAvailable) {
        this.scrollSkip = this.scrollSkip + this.showLimit;
        this.isMoreAvalLoad = true;
        const _params = {
          "appId": this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
        };
        const payload = {
          "start": this.filter.startDate,
          "end": this.filter.endDate,
          "limit" : this.showLimit,
          "skip" : this.scrollSkip,
          "sort" : {"date":"desc"}     
        }
        const _self = this;
        this.service.invoke('post.callLogs.data',_params, payload)
        .pipe(finalize(()=>{
          this.isMoreAvalLoad = false;
        }))
        .subscribe(
          res => {
            let temp = [];
            for(let i=0; i<res.data.length; i++) {
              let durObj = this.durationCalc(res.data[i]);
              temp[i] = new CallHistoryModel(res.data[i], durObj.dStr, durObj.strTime, durObj.diffMins)
            }
            _self.dataAvailable = _self.dataAvailable.concat(temp);
            _self.dataSource = new MatTableDataSource(_self.dataAvailable);
            setTimeout(()=>{
              _self.dataSource.sort = _self.sort;
            })
            _self.isMoreAvailable = res.hasMore;
            // _self.dataSourceCount = res.totalCount + _self.dataSourceCount;
          }, 
          err => {
            this.scrollSkip = this.scrollSkip - this.showLimit;
          });
      }
    }
    this.lastScrollTop = st;
  }

  getChatHistory(elem) {
    this.isLoading = true;
    this.isInProgress = true;
    this.messageId = elem.messageId;
    const _params = {
      "msgId": elem.messageId,//this.data.userId, //this.authService.getUserId(),
      "streamId": this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
    };
    const self = this;
    this.service.invoke('get.callflow.chatHistory',_params)
    .pipe(finalize(()=>{
      self.isInProgress = false;
    }))
    .subscribe(
      res => {     
        self.chatHistData = res;
        setTimeout(function(){
          if(document.getElementsByClassName('user-message active').length) {
            document.getElementsByClassName('user-message active')[0].scrollIntoView();
          }
          if(document.getElementsByClassName('bot-message active').length) {
            document.getElementsByClassName('bot-message active')[0].scrollIntoView();
          }
        });
      });

  }

  scrollToActive() {
    setTimeout(function(){
      if(document.getElementsByClassName('user-message active')[0]) {
        document.getElementsByClassName('user-message active')[0].scrollIntoView();
      }
    });
  }

  getCallLogsData() {
    const _self = this;
    let _params = {
      'appId': _self.selectedApp._id || _self.selectedApp[0]._id
    }
    // let phoneNumber;
    // let appData = _self.selectedApp[0];
    // appData.channels.forEach(element => {
    //   if (element.type === 'twiliovoice') {
    //     phoneNumber = element.phoneNumberConfigDetails.phoneNumber;
    //   }
    // });
    let _payload = {
      "start": this.filter.startDate,
      "end": this.filter.endDate,
      "limit" : this.showLimit,
      "skip" : this.scrollSkip,
      "sort" : {"date":"desc"},  
    }
    this.service.invoke('post.callLogs.data', _params, _payload)
    .pipe(finalize(()=>{
      this.isLoading = false;
    }))
    .subscribe(
      res => {
        _self.isInProgress = false;
        _self.isMoreAvailable = res.hasMore;
        let temp: []  = [];
        for(let i=0; i<res.data.length; i++) {
          let durObj = this.durationCalc(res.data[i]);
          _self.dataAvailable[i] = new CallHistoryModel(res.data[i], durObj.dStr, durObj.strTime, durObj.diffMins);
        }
        _self.dataSource = new MatTableDataSource(_self.dataAvailable);
        setTimeout(()=>{
          _self.dataSource.sort = _self.sort;
        })
      });
  }

  getDateRange(range) {
    if (range === -1) {
      this.showDateRange = true;
      return;
    }

    if (range === 7) {
      this.filter.startDate = moment().subtract({ days: 7 });
      this.filter.endDate = moment();
      this.showDateRange = false;
    } else if (range === 1) {
      this.filter.startDate = moment().subtract({ hours: 24 });
      this.filter.endDate = moment();
      this.showDateRange = false;
    }
    $('#filterDate').val(this.filter.startDate.format('MM/DD/YYYY') + ' - ' + this.filter.endDate.format('MM/DD/YYYY'));
  }

  receiveMessage($event) {
    var rangeSelect = $event;
    this.showDateRange = false;
    if (rangeSelect !== "close") {
      const fromD = new Date(rangeSelect.d1.year, rangeSelect.d1.month - 1, rangeSelect.d1.day, 0, 0, 0);
      const toD = new Date(rangeSelect.d2.year, rangeSelect.d2.month - 1, rangeSelect.d2.day, 0, 0, 0);
      this.filter.startDate = moment(fromD);
      this.filter.endDate = moment(toD).endOf('day');
      $('#filterDate').val(this.filter.startDate.format('MM/DD/YYYY') + ' - ' + this.filter.endDate.format('MM/DD/YYYY'));
    }
  }

  openCallHistoryFilter() {
    this.sliderComponent.openSlider("#callHistoryFilter", "right500");
  }

  closeCallHistoryFilter() {
    this.sliderComponent.closeSlider("#callHistoryFilter");
  }

  openCallHistoryDetails(elem) {
    this.getChatHistory(elem);
    this.sliderComponent.openSlider("#callHistoryDetails", "right500");
  }

  closecallHistoryDetails() {
    this.sliderComponent.closeSlider("#callHistoryDetails");
  }

}
