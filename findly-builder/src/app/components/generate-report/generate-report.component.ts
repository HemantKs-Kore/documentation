import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarVerticalPosition} from '@angular/material/';
import * as moment from 'moment';
import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { NotificationMessageComponent } from 'src/app/components/notification-message/notification-message.component';
import { AccountsDataService } from '@kore.services/dataservices/accounts-data.service';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private service: ServiceInvokerService, public snackBar: MatSnackBar,private accountsService : AccountsDataService) { }
  params = {
    startDate : "", endDate : "", reportType : 0
  };
  noReports = false;
  recordAccounts = [];

  reportName : string;
  totalRecords : number;
  periodDate : string;
  generationDate : string;


  selectType : number;
  selectedDate : string;
  pendingState = false;
  showDateRange = false;
  dateString : string;
  currentTask : string;
  showReport = false;
  freeBotReport = false;
  upgradeReport = false;
  downgradeReport = false;
  cancelReport = false;
  paidReport = false;
  onlineUserReport = false;
  downloadUrlLink: string;
  
  configNote = {duration:2500 , panelClass:['background-white'], verticalPosition: this.verticalPosition, data: {msg:"",stat: false}};
  reportTypes = [{'id':4,'val':'Paid Bot'},{'id':1,'val':'Upgrade request'},{'id':2,'val':'Downgrade request'},{'id':3,'val':'Cancellation request'},{'id':5,'val':'Free Bot'},{'id':6,'val':'Online Users'}];

  getReport() : void {
    if(!this.selectType){
      this.notifyMessage("Select report type !!", false);
      return;
    }
    this.params.reportType = this.selectType;
    this.service.invoke('sales.standard.generate.report', {}, this.params).subscribe(
      res => {
        this.currentTask = res.taskId;
        this.downloadReport();
      },
      errRes => {
        this.notifyMessage("Failed to generate report, Try again !!", false);
      }
    );
  }

  receiveMessage($event) {    
    var rangeSelect = $event;
    this.showDateRange = false;
    if(rangeSelect !== "close"){
      var fromD = new Date(rangeSelect.d1.year,rangeSelect.d1.month-1,rangeSelect.d1.day,0,0,0);
      var toD = new Date(rangeSelect.d2.year,rangeSelect.d2.month-1,rangeSelect.d2.day,0,0,0);
      this.dateString =  moment(fromD).format('MM-DD-YYYY') + ' to ' + moment(toD).format('MM-DD-YYYY');
      this.params.startDate = moment(fromD).toISOString();
      this.params.endDate = moment(toD).endOf('day').toISOString();
    }    
  }

  public formatDate(checkTime: string): string {
    var _mmts = new Date(checkTime);    
    if(_mmts.toString() === "Invalid Date"){
      return "N.A.";
    }
    else{
      return moment(_mmts).format('Do MMM YYYY');
    }
  }

  notifyMessage(msg: string, stat: boolean): void {
    this.configNote.data.msg = msg;
    this.configNote.data.stat = stat;
    this.snackBar.openFromComponent(NotificationMessageComponent, this.configNote);
  }

  viewReport() : void {
    if(!this.selectType){
      this.notifyMessage("Select report type !!", false);
      return;
    }
    this.params.reportType = this.selectType;
    this.service.invoke('sales.standard.view.report', {} , this.params).subscribe(
      res => {
        this.showReport = true;
        this.reportName = this.reportTypes.find(element => element.id === this.params.reportType).val;
        this.totalRecords = res.totalRecords;
        this.generationDate = this.formatDate(moment().toISOString());
        this.periodDate = this.formatDate(this.params.startDate) + ' to ' + this.formatDate(this.params.endDate);
        if(res && res.records && res.records.length != 0){
          this.noReports = false;
          this.recordAccounts = res.records;
        }
        else{
          this.noReports = true;
          this.recordAccounts = [];
        }
        if(this.params.reportType === 5){
          this.freeBotReport = true;
        }
        else if(this.params.reportType === 1){
          this.upgradeReport = true;
        }
        else if(this.params.reportType === 2){
          this.downgradeReport = true;
        }
        else if(this.params.reportType === 3){
          this.cancelReport = true;
        }
        else if(this.params.reportType === 4){
          this.paidReport = true;
        }
        else if(this.params.reportType === 6){
          this.onlineUserReport = true;
        }        
      },
      errRes => {
        this.pendingState = false;
        this.notifyMessage("Failed to get report, Try again !!", false);
      }
    );
  }

  downloadReport() : void {
    this.service.invoke('sales.standard.download.report', {} , {taskId: this.currentTask}).subscribe(
      res => {
        if(res.status === "success"){
          this.currentTask = "";
          if(res.downloadURL){
            this.downloadUrlLink = res.downloadURL;
            var reportNav = document.getElementsByClassName('downloadReportUrl') as HTMLCollectionOf<HTMLElement>;
            setTimeout(() => {
              this.pendingState = false;
              reportNav[0].click();
            }, 10);
            //window.open(res.downloadURL, "_blank");          
          }
        }
        else if(res.status === "warning"){
          this.currentTask = "";
          this.pendingState = false;
          this.notifyMessage(res.reason, false);
        }
        else if(res.status === "pending"){
          this.pendingState = true;
          setTimeout(() => {
            this.downloadReport();
          }, 5000);

        }
        else{
          this.currentTask = "";
          this.pendingState = false;
          this.notifyMessage("Failed to download report, Try again !!", false);
        }                
      },
      errRes => {
        this.currentTask = "";
        this.pendingState = false;
        this.notifyMessage("Failed to download report, Try again !!", false);
      }
    );
  }

  backReports() : void {
    this.showReport = false;
    this.freeBotReport = false;
    this.upgradeReport = false;
    this.downgradeReport = false;
    this.cancelReport = false;
    this.paidReport = false;
    this.onlineUserReport = false;
  }

  todayDate() : void {   
    this.dateString =  moment().format('MM-DD-YYYY');
    this.params.startDate = moment().startOf('day').toISOString();
    this.params.endDate = moment().toISOString();
    this.selectedDate = "today";
    this.showDateRange = false;
  }

  selectDateRange() : void {
    this.selectedDate = "custom";
    this.showDateRange = true;
  }

  last7Date() : void {   
    this.dateString =  moment().subtract(7, "days").format('MM-DD-YYYY') + ' to ' + moment().format('MM-DD-YYYY');
    this.params.startDate = moment().subtract(7, "days").startOf('day').toISOString();
    this.params.endDate = moment().toISOString();
    this.selectedDate = "lastSeven";
    this.showDateRange = false;
  }

  ngOnInit() {
    this.accountsService.setAccountsData({});
    this.selectedDate = "today";
    this.dateString =  moment().format('MM-DD-YYYY');
    this.params.startDate = moment().startOf('day').toISOString();
    this.params.endDate = moment().toISOString();
  }

}
