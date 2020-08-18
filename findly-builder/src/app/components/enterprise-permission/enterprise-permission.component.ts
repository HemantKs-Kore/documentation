import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarVerticalPosition} from '@angular/material/';
import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { NotificationMessageComponent } from 'src/app/components/notification-message/notification-message.component';
import { AccountsDataService } from '@kore.services/dataservices/accounts-data.service';

@Component({
  selector: 'app-enterprise-permission',
  templateUrl: './enterprise-permission.component.html',
  styleUrls: ['./enterprise-permission.component.scss']
})
export class EnterprisePermissionComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private service: ServiceInvokerService,
    public snackBar: MatSnackBar,
    private accountsService : AccountsDataService
  ) { }

  idString: String;
  showEnterprise = true;

  configNote = {duration:2500 , panelClass:['background-white'], verticalPosition: this.verticalPosition, data: {msg:"",stat: false}};

  notifyMessage(msg: string, stat: boolean): void {
    this.configNote.data.msg = msg;
    this.configNote.data.stat = stat;
    this.snackBar.openFromComponent(NotificationMessageComponent, this.configNote);
  }

  checkAccount() : void {
    this.showEnterprise = false;
    if(this.idString === ""){
      this.showEnterprise = true;
    }
  }

  standardToEnt() : void {
    this.service.invoke('sales.standard.standard.toEnterprise', {}, {Id : this.idString}).subscribe(
      res => {
        console.log(res);
        if(res.status === "success"){
          this.notifyMessage("Converted to Enterprise account successfully.", true);
        }
        else{
          this.notifyMessage(res.reason, false);
        }        
      },
      errRes => {
        this.notifyMessage(errRes.error.errors[0].msg, false);
        //this.notifyMessage("Failed to convert to Enterprise account, Try again !!", false);
      }
    );
  }

  ngOnInit() {
    this.accountsService.setAccountsData({});
  }

}
