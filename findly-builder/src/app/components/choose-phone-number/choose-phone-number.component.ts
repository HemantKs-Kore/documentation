import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { delay, finalize } from 'rxjs/operators';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-choose-phone-number',
  templateUrl: './choose-phone-number.component.html',
  styleUrls: ['./choose-phone-number.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ChoosePhoneNumberComponent implements OnInit {

  @Output() closed = new EventEmitter();
  @Input() phoneNumberType: 'local' | 'tollfree' = 'local';
  loading: boolean = false;
  showErrorScreen: boolean = false;
  phoneNumbers: any[] = [];
  selectedApp: any;
  stateCodes: any[] = [];
  selectedStateCode: any;
  enablingInProgess: boolean = false;
  constructor(
    public workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.selectedApp = this.workflowService.deflectApps();
    this.workflowService.seedData$.subscribe(res => {
      if (!res) return;
      const countryCodeDetails = res.deflectSeedData.CountryCodeDetails;
      const us = countryCodeDetails.find(f => f['ISO'] === 'US');
      const stateCodesObj = us && us.stateCodes;
      if (stateCodesObj) {
        Object.keys(stateCodesObj).forEach(k => {
          this.stateCodes.push({
            stateCode: stateCodesObj[k],
            stateName: k
          })
        })
      }

    });
    this.getPhoneNumbers();
  }

  getPhoneNumbers(stateCode?: string) {
    if (!stateCode) this.loading = true;
    const _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }
    const _payload = {
      "integrationType": "phoneNumberTransfer",
      "countryCode": "US",
      "phoneNumberType": this.phoneNumberType,
      "stateCode": stateCode || ""
    }

    this.service.invoke("get.availableNumbers", _params, _payload)
      .pipe(
        finalize(() => this.loading = false)
      ).subscribe(res => {
        this.phoneNumbers = res;
      }, err => {
        const errMsg = err.error.errors && err.error.errors[0] && err.error.errors[0].msg;
        const msg = errMsg || "Unable to fetch Phone Numbers";

        this.notificationService.notify(msg, 'error');
      });
  }

  onClickGetNumber(data: any) {
    this.phoneNumbers.map(e => {
      if (e.number === data.number) {
        e.showConfirmation = true;
      } else {
        e.showConfirmation = false;
      }
      return e;
    })
    console.log(this.phoneNumbers)
    // this.closed.emit(phoneNumber);
    // this.enableIntegration(phoneNumber);
  }

  onClickCancel() {
    this.phoneNumbers.map(e => {
      e.showConfirmation = false;
      return e;
    })
  }


  enableIntegration(data: any) {
    this.enablingInProgess = true;
    const _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    }
    const _payload = {
      "integrationType": "phoneNumberTransfer",
      "countryCode": "US",
      "phoneNumber": data.number,
      "stateCode": data.stateCode
    }
    this.service.invoke('enable.ivr.configuration', _params, _payload)
      .pipe(finalize(() => this.enablingInProgess = false))
      .subscribe(
        res => {
          this.closed.emit({ phoneNumber: data.number })
        },
        errRes => {
          this.notificationService.notify("Failed to enable Phone Number", 'error');
        }
      );
  }

  onClickStateCode(state) {
    this.selectedStateCode = state;
    this.getPhoneNumbers(state.stateCode)
  }

  onClose() {
    this.closed.emit();
  }

}
