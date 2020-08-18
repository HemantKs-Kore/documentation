import { Component, OnInit, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { AuthService } from '@kore.services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ChatHistoryComponent } from "../chat-history/chat-history.component";
import { PerfectScrollbarComponent  } from 'ngx-perfect-scrollbar';

declare const $: any;

export interface callLogsElements {
  userId: string;
  phNumber: string;
  dateTime: string;
  time: string;
  duration: string;
  status: string;
  messageId: string;
  email: string;
}

@Component({
  selector: 'app-call-logs',
  templateUrl: './call-logs.component.html',
  styleUrls: ['./call-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CallLogsComponent implements OnInit {

  constructor(
    private service: ServiceInvokerService,
    public dialogRef: MatDialogRef<CallLogsComponent>,
    private authService: AuthService,
    public workflowService: workflowService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;


  ngOnInit() {
    this.isInProgress = true;
    const _params = {
      "appId": this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
    };
    const payload = {
      "nodeId": this.data.nodeId,
      "start": this.data.startDate,
      "end": this.data.endDate,
      "limit" : this.showLimit,
      "skip" : this.scrollSkip,
      "sort" : {"date":"desc"}
    }
    const _self = this;
    this.service.invoke('post.callLogs.data',_params, payload).subscribe(
      res => {     
        _self.isInProgress = false;
        let temp1 = [];
        _self.isMoreAvailable = res.hasMore;
        for(let i=0; i<res.data.length; i++) {
          temp1[i] = {};
          temp1[i].userId = res.data[i].userId;
          temp1[i].email =  res.data[i].userDetails.emailId;
          temp1[i].phoneNumber = res.data[i].phoneNumber;
          temp1[i].start = res.data[i].startedOn;
          temp1[i].end = res.data[i].endedOn;
          temp1[i].status = res.data[i].status;
          temp1[i].flowEnd = res.data[i].flowEnd;
          temp1[i].messageId = res.data[i].messageId;
        }
        let temp: callLogsElements[]  = [];
        for(let i=0; i<temp1.length; i++) {
          let date1 = new Date(temp1[i].start).valueOf();
          let date2 = new Date(temp1[i].end).valueOf();
          let diffTime = Math.abs(date2 - date1);
          let diffMins = Math.ceil(diffTime / (1000 * 60)); 
          let diffHours = 0;
          if(diffMins > 59) {
            diffHours = Math.floor(diffMins/60);
            diffMins = diffMins%60;
          }
          let d =  new Date(temp1[i].start);
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
          _self.dataAvailable[i] = {
            userId: temp1[i].userId,
            phNumber: temp1[i].phoneNumber,
            email: temp1[i].email,
            dateTime: dStr,
            time: strTime,
            duration: diffMins + " min(s)",
            status: temp1[i].status,
            messageId: temp1[i].messageId
          };
          if(diffHours != 0) {
            if(diffMins != 0) {
              _self.dataAvailable[i].duration = diffHours + 'Hrs ' + diffMins + 'min(s)';
            }
            else {
              _self.dataAvailable[i].duration = diffHours + 'Hrs';
            }
          }
        }
        _self.dataSourceCount = res.totalCount;
        _self.dataSource = new MatTableDataSource(_self.dataAvailable);
        _self.dataSource.sort = _self.sort;
      }, 
      errRes => {
        _self.isInProgress = false;
      });
  }

  isInProgress:boolean;
  dataSource: any;
  dataSourceCount: number = -1;
  searchCallLogs: string = '';
  isMoreAvailable: boolean = false;
  isMoreAvalLoad: boolean = false;
  dataAvailable: callLogsElements[] = [];
  config: any = {
    suppressScrollX: true
  };
  lastScrollTop: any = 0;
  showLimit: any = 50;
  scrollSkip: any = 0;
  displayedColumns: string[] = ['userId', 'phNumber', 'dateTime', 'duration', 'status'];

  closeModal() {
    this.dialogRef.close();
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
          "nodeId": this.data.nodeId,
          "start": this.data.startDate,
          "end": this.data.endDate,
          "limit" : this.showLimit,
          "skip" : this.scrollSkip,
          "sort" : {"date":"desc"}     
        }
        const _self = this;
        this.service.invoke('post.callLogs.data',_params, payload).subscribe(
          res => {
            this.isMoreAvalLoad = false;
            let temp1 = [];
            let temp = [];
            for(let i=0; i<res.data.length; i++) {
              temp1[i] = {};
              temp1[i].userId = res.data[i].userId;
              temp1[i].email =  res.data[i].userDetails.emailId;
              temp1[i].phoneNumber = res.data[i].phoneNumber;
              temp1[i].start = res.data[i].startedOn;
              temp1[i].end = res.data[i].endedOn;
              temp1[i].status = res.data[i].status;
              temp1[i].flowEnd = res.data[i].flowEnd;
              temp1[i].messageId = res.data[i].messageId;
            }

            for(let i=0; i<temp1.length; i++) {
              let date1 = new Date(temp1[i].start).valueOf();
              let date2 = new Date(temp1[i].end).valueOf();
              let diffTime = Math.abs(date2 - date1);
              let diffMins = Math.ceil(diffTime / (1000 * 60)); 
              let diffHours = 0;
              if(diffMins > 59) {
                diffHours = Math.floor(diffMins/60);
                diffMins = diffMins%60;
              }
              let d =  new Date(temp1[i].start);
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
              temp[i] = {
                userId: temp1[i].userId,
                phNumber: temp1[i].phoneNumber,
                dateTime: dStr,
                time: strTime,
                duration: diffMins + " min(s)",
                status: temp1[i].status,
                email: temp1[i].email
              };
              if(diffHours != 0) {
                if(diffMins != 0) {
                  temp[i].duration = diffHours + 'Hrs ' + diffMins + 'min(s)';
                }
                else {
                  temp[i].duration = diffHours + 'Hrs';
                }
              }
            }
            _self.dataAvailable = _self.dataAvailable.concat(temp);
            _self.dataSource = new MatTableDataSource(_self.dataAvailable);
            _self.dataSource.sort = _self.sort;
            _self.isMoreAvailable = res.hasMore;
            _self.dataSourceCount = res.totalCount + _self.dataSourceCount;
          }, 
          err => {
            this.isMoreAvalLoad = false;
            this.scrollSkip = this.scrollSkip - this.showLimit;
          });
      }
    }
    this.lastScrollTop = st;
  }

  openChat(obj) {
    const dialogRef = this.dialog.open(ChatHistoryComponent, {
      width: '40%',
      height: "100%",
      panelClass: "modal-new-chat-history",
      disableClose: true,
      data: obj
    });
  }

  checkKey(e) {
    return;
    //TO DO ADD A NEW API
  }

}
