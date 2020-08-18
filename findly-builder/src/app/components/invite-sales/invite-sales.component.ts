import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarVerticalPosition} from '@angular/material/';
import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { NotificationMessageComponent } from 'src/app/components/notification-message/notification-message.component';
import { AccountsDataService } from '@kore.services/dataservices/accounts-data.service';

@Component({
  selector: 'app-invite-sales',
  templateUrl: './invite-sales.component.html',
  styleUrls: ['./invite-sales.component.scss']
})
export class InviteSalesComponent implements OnInit {
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private service: ServiceInvokerService,
    public snackBar: MatSnackBar,
    private accountsService : AccountsDataService
  ) { }

  emailString: String;
  showInvite = true;

  configNote = {duration:2500 , panelClass:['background-white'], verticalPosition: this.verticalPosition, data: {msg:"",stat: false}};

  notifyMessage(msg: string, stat: boolean): void {
    this.configNote.data.msg = msg;
    this.configNote.data.stat = stat;
    this.snackBar.openFromComponent(NotificationMessageComponent, this.configNote);
  }

  checkEmail() : void {
    this.showInvite = false;
    if(this.emailString === ""){
      this.showInvite = true;
    }
  }

  provideAccess() : void {
    this.service.invoke('sales.standard.allow.access', {}, {emailId : this.emailString}).subscribe(
      res => {
        console.log(res);
        if(res.status === "success"){
          this.notifyMessage("Sales access provided successfully.", true);
        }
        else{
          this.notifyMessage(res.reason, false);
        }        
      },
      errRes => {
        this.notifyMessage(errRes.error.errors[0].msg, false);
        //this.notifyMessage("Failed to provide access, Try again !!", false);
      }
    );
  }

  ngOnInit() {
    this.accountsService.setAccountsData({});
  }

}
