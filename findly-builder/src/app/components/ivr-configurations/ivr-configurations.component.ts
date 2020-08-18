import { Component, OnInit, ElementRef } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NotificationService } from '@kore.services/notification.service';
import { SideBarService } from '@kore.services/header.service';

import { Router } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-ivr-configurations',
  templateUrl: './ivr-configurations.component.html',
  styleUrls: ['./ivr-configurations.component.scss']
})
export class IvrConfigurationsComponent implements OnInit {
  defaultValue: string;
  selectedApp: any;
  ipAddressValidator: boolean = true;
  domainNameValidator: boolean = true;
  toShowAppHeader: boolean;
  ivrConfigurationData: any;
  countryCodeDetailsFromSeedData: any;
  countryCodeDataPreparation: any;
  ipAddressEditor: any;
  sipDomainNameEditor: any;
  countryCodeDetails: { name: string; id: string; phoneNumber: string };
  phoneNumber: string;
  sipDomainName: any;
  enableSipConfiguration: boolean = false;
  enablePhoneNumberConfiguration: boolean = false;
  toShowCopyMsg: boolean = false;
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private el: ElementRef,
    private router: Router,
    private NotificationService: NotificationService,
    private headerService: SideBarService
  ) {
    this.phoneNumber = "";
    this.defaultValue = "D1";
    this.countryCodeDetails = {
      "name": "Select a Country",
      "id": "",
      "phoneNumber": ""
    }
  }

  ngOnInit() {
    let toogleObj = {
      "title": "IVR Integration",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.selectedApp = this.workflowService.deflectApps();
    this.headerService.toggle(toogleObj);
    setTimeout(() => {
      this.countryCodeDetailsFromSeedData = this.workflowService.seedData().deflectSeedData.CountryCodeDetails;
    }, 750);
    this.getIVRConfiguration();
    // if (this.toShowAppHeader) {
    //   $('#exampleModalCenter').modal('show');
    // }
  }

  validator(e) {
    if (this.defaultValue = "D1") {
      this.domainNameValidator = true;
      this.ipAddressValidator = true;
      $("#ipAddress").removeClass('validatorBorder');
    }

  }

  getIVRConfiguration() {
    const _self = this;
    let _params = {
      'appId': _self.selectedApp._id || _self.selectedApp[0]._id
    }
    this.service.invoke('get.ivrConfiguration.data', _params).subscribe(
      res => {
        _self.ivrConfigurationData = res;
        if (res.integrationType === 'sipDomainTransfer') {
          _self.defaultValue = "D1";
          _self.enableSipConfiguration = true;
          _self.enablePhoneNumberConfiguration = true;
        } else if (res.integrationType === 'phoneNumberTransfer') {
          _self.defaultValue = "D2";
          _self.enablePhoneNumberConfiguration = true;
          _self.enableSipConfiguration = true;
        }
        if (res && res.sipConfigDetails && res.sipConfigDetails.sipDomainName) {
          _self.sipDomainNameEditor = res.sipConfigDetails.sipDomainName;
          // _self.ipAddressEditor = res.sipConfigDetails.incomingIpAddresses;
        }
        if (res && res.sipConfigDetails && res.sipConfigDetails.incomingIpAddresses) {
          _self.ipAddressEditor = res.sipConfigDetails.incomingIpAddresses;
        }
        if (res && res.phoneNumberConfigDetails && res.phoneNumberConfigDetails.countryCode) {
          this.countryCodeDetails.id = res.phoneNumberConfigDetails.countryCode;
          setTimeout(() => {
            this.countryCodeDetailsFromSeedData.forEach(value => {
              if (value.ISO === this.countryCodeDetails.id) {
                this.countryCodeDetails.name = value.Country
              }
            });
          }, 500);
          _self.countryCodeDetails.phoneNumber = res.phoneNumberConfigDetails.phoneNumber;
          _self.phoneNumber = res.phoneNumberConfigDetails.phoneNumber;
          $(".integrationTypeDropdown").addClass('cursorNotAllowed');
        }
      },
      errRes => {
        console.error('Failed in singing out');
      }
    );
  }

  saveIVRConfigurationData(e, flag) {
    const _self = this;
    let sipDomainName;
    let ipAddress
    let routeFlag = flag;
    let _payload = {};
    let _params = {
      'appId': _self.selectedApp._id || _self.selectedApp[0]._id
    }
    if (_self.defaultValue === "D1") {
      sipDomainName = _self.sipDomainNameEditor;
      ipAddress = this.el.nativeElement.querySelector("#ipAddress").innerText;
      if (ipAddress === "") {
        this.ipAddressValidator = false;
        $("#ipAddress").addClass('validatorBorder');
        return;
      }

    }
    if (_self.defaultValue === "D1") {
      _payload = {
        "isDeflect": true,
        "integrationType": "sipDomainTransfer",
        "sipDomainName": sipDomainName,
        "incomingIpAddresses": [ipAddress],
        "languagePreference": "en_US",

      }
    } else {
      _payload = {
        "isDeflect": true,
        "integrationType": "phoneNumberTransfer",
        "countryCode": this.countryCodeDetails.id,
        "languagePreference": "en_US"
      }
    }


    this.service.invoke('save.ivrConfiguration.data', _params, _payload).subscribe(
      res => {
        if (_self.defaultValue === "D1") {
          res.channels.forEach(value => {
            if (value.type === "twiliovoice") {
              _self.sipDomainNameEditor = value.sipConfigDetails.sipDomainName;
              _self.ipAddressEditor = value.sipConfigDetails.incomingIpAddresses;
            }
          });
        } else {
          res.channels.forEach(value => {
            if (value.type === "twiliovoice") {
              _self.countryCodeDetails.id = value.phoneNumberConfigDetails.countryCode;
              this.countryCodeDetailsFromSeedData.forEach(value => {
                if (value.ISO === _self.countryCodeDetails.id) {
                  this.countryCodeDetails.name = value.Country
                }
              });
              _self.countryCodeDetails.phoneNumber = value.phoneNumberConfigDetails.phoneNumber;
              _self.phoneNumber = value.phoneNumberConfigDetails.phoneNumber;
            }
          });
        }
        this.NotificationService.notify('IVR Integrations are saved successfully', 'success');
        if (routeFlag) {
          $(".progressbarItem").addClass('active');
          $(".progressbarItem1").addClass('default');
          _self.router.navigate(['/callFlow'])
        }
      },
      errRes => {
        this.NotificationService.notify('IVR Integrations are not saved', 'error');
      }
    );
  }

  countryCodeClick(country) {
    this.countryCodeDetails.name = country.Country;
    this.countryCodeDetails.id = country.ISO;
  }

  copyTextFromInput(inputElement) {
    this.toShowCopyMsg = true;
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    setTimeout(() => {
      this.toShowCopyMsg = false;
    }, 950);
  }

  enablingIvr(value) {
    const _self = this;
    let _payload;
    let _params = {
      'appId': _self.selectedApp._id || _self.selectedApp[0]._id
    }
    if (value === "sip") {
      _payload = {
        "integrationType": "sipDomainTransfer",
      }
    } else {
      _payload = {
        "integrationType": "phoneNumberTransfer",
        "countryCode": this.countryCodeDetails.id
      }
    }
    this.service.invoke('enable.ivr.configuration', _params, _payload).subscribe(
      res => {
        if (value === "sip") {
          _self.enableSipConfiguration = true;
          res.channels.forEach(value => {
            if (value.type === "twiliovoice") {
              _self.sipDomainNameEditor = value.sipConfigDetails.sipDomainName;
            }
          });
        } else {
          _self.enablePhoneNumberConfiguration = true;
          res.channels.forEach(value => {
            if (value.type === "twiliovoice") {
              _self.countryCodeDetails.id = value.phoneNumberConfigDetails.countryCode;
              _self.countryCodeDetails.phoneNumber = value.phoneNumberConfigDetails.phoneNumber;
              _self.phoneNumber = value.phoneNumberConfigDetails.phoneNumber;
            }
            $(".integrationTypeDropdown").addClass('cursorNotAllowed');
          });
        }
      },
      errRes => {
      }
    );
  }

}
