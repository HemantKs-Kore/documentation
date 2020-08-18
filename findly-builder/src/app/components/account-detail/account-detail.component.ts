import { Component, OnInit, Inject } from '@angular/core';
import {MatSnackBar, MatSnackBarVerticalPosition} from '@angular/material/';
//import { DataService } from "@kore.services/data.service";
import { Router, ActivatedRoute}  from '@angular/router';
//import {trigger,state,style,animate,transition } from '@angular/animations';

import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NotificationMessageComponent } from 'src/app/components/notification-message/notification-message.component';
import * as moment from 'moment';

export interface DialogData {
  currentUtterances: [];
}
export interface ConversationData {
  utterConversation: [];
}

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private service: ServiceInvokerService,
    private http:HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar
  ) { }
  
  botId = "";
  planName = "";
  renewalDate = "";
  allowedSession :  number;
  usedSession : number;
  dealId = "";
  dealName = "";
  accountName = "";
  subscribedDate = "";
  botName = "";
  percUsage : number;
  botLogs = [];
  hubspotUrl = "";
  chargebeeUrl = "";
  skip = 0;
  isdowngraded = false;
  iscancelled = false;
  isexpired = false;
  isFreeExpired = false;
  scheduledBy = "";
  scheduledOn = "";
  toSchedulePlan = "";
  waitLogScroll = false;
  showFull = false;
  
  hasMoreLogs = false;
  loadingLogs = false;
  noLogs = false;
  configNote = {duration:2500 , panelClass:['background-white'], verticalPosition: this.verticalPosition, data: {msg:"",stat: false}};



  previewLoad = true;
  helpMenuOpen: string;

  downloadFile(fileId: string) : void {
    this.service.invoke('sales.standard.log.download', {fileId: fileId}, {}).subscribe(
      res => {
          window.open(res.fileUrl, "_blank");
      },
      errRes => {
          this.notifyMessage("Failed to download invoice, Try again !!", false);
      }
    );
  }

  notifyMessage(msg: string, stat: boolean): void {
    this.configNote.data.msg = msg;
    this.configNote.data.stat = stat;
    this.snackBar.openFromComponent(NotificationMessageComponent, this.configNote);
  }

  openHubspot() : void {
    if(this.hubspotUrl) {
      window.open(this.hubspotUrl, "_blank");
    }
    else{
      this.notifyMessage("Hubspot url not available for this record.", false);
    }
    
  }

  openChargebee() : void {
    if(this.chargebeeUrl){
      window.open(this.chargebeeUrl, "_blank");
    }
    else{
      this.notifyMessage("Chargebee url not available for this record.", false);
    }
    
  }

  public formatDate(checkTime: string): string {
    var _mmts = new Date(checkTime);    
    if(_mmts.toString() === "Invalid Date"){
      return "-";
    }
    else{
      return moment(_mmts).format('Do MMM YYYY');
    }
  }

  onLogScroll(elem): void{
    if(( elem.target.offsetHeight + elem.target.scrollTop) >=  elem.target.scrollHeight && !this.waitLogScroll) {
       this.waitLogScroll = true;
       if(this.hasMoreLogs){
          this.loadingLogs = true;
          this.skip = this.skip + 20;
          this.service.invoke('sales.standard.bot.logs', {streamId: this.botId}, {limit: 20,skip:this.skip}).subscribe(
            res => {
                this.botLogs = this.botLogs.concat(res.logs);
                this.loadingLogs = false;
                this.hasMoreLogs = res.hasMore;
                this.waitLogScroll = false;
            },
            errRes => {
                this.notifyMessage("Failed to get more logs, Try again !!", false);
                this.loadingLogs = false;
                this.waitLogScroll = false;
            }
          );
       }
       else{
          this.notifyMessage("End of logs !!", true);
          this.waitLogScroll = false;
       }
        
    }
    }

  ngOnInit() {
    this.previewLoad = false;
    this.loadingLogs = true;
    this.route.queryParams.subscribe(params => {
    this.botId = params['currentBotId'];
    });

    this.service.invoke('sales.standard.deal.details', {streamId: this.botId}, {}).subscribe(
      res => {
          this.botName = res.botName;
          this.planName = res.planName;
          this.renewalDate = this.formatDate(res.renewalDate);
          this.allowedSession = res.allowedSessions;
          this.usedSession = res.usedSessions;
          this.dealId = res.dealId;
          this.dealName = res.dealName;
          this.accountName = res.accountName;
          this.subscribedDate = this.formatDate(res.subscribedOn);
          this.hubspotUrl = res.hubspotUrl;
          this.chargebeeUrl = res.chargeBeeUrl;
          this.percUsage = Math.ceil(100 * this.usedSession/this.allowedSession);
          if(this.percUsage >= 100) {
            this.percUsage = 100;
            this.showFull = true;
          }
          this.isdowngraded = res.changesScheduledFor === "downgrade";
          this.iscancelled = res.changesScheduledFor === "cancel";
          this.isexpired = res.status === 2;
          if(this.planName === "Free" && this.isexpired){
            this.isFreeExpired = true;
            this.isexpired = false;
          }
        
          if(res.changesScheduledFor && res.changesScheduledFor != "none"){
            this.scheduledBy = res.scheduledChanges.scheduledBy.firstName + ' ' + res.scheduledChanges.scheduledBy.lastName;
            this.scheduledOn = this.formatDate(res.scheduledChanges.scheduledOn);
            this.toSchedulePlan = res.scheduledChanges.scheduledPlan;
          }
      },
      errRes => {
          this.notifyMessage("Failed to get subscription details !!", false);
      }
    );

    this.service.invoke('sales.standard.bot.logs', {streamId: this.botId}, {limit: 20,skip:0}).subscribe(
      res => {          
          this.botLogs = res.logs;
          this.loadingLogs = false;
          this.hasMoreLogs = res.hasMore;
          if(res && res.logs && res.logs.length != 0){
            this.noLogs = false;
          }
          else{
            this.noLogs = true;
          }
      },
      errRes => {
          this.notifyMessage("Unable to fetch log data !!", false);
      }
    );  

  }

}