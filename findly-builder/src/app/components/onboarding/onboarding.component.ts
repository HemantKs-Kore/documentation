import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { OnboardingConfig } from 'src/app/data/onboarding.model';
import { SideBarService } from '@kore.services/header.service';
import { NotificationService } from '@kore.services/notification.service';
import { workflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

declare const $: any;
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit , OnDestroy {
  // @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  currentSection = 'section1';
  config: OnboardingConfig;
  saveInProgress: boolean;
  appsData: any;
  constructor(
    private headerService: SideBarService,
    private notificationService: NotificationService,
    private router: Router,
    private service: ServiceInvokerService,
    public workflowService: workflowService
  ) { }

  ngOnInit() {
    this.config = {
      name: '',
      icon: '',
      deflectAppStatus: {
        deflectConfiguration: {
          type: ''
        },
        virtualAssistant: {
          enabled: true,
          type: ''
        },
        handOff: {
          liveAgent: false,
          formSubmission: false
        }
      }
    };

    this.headerService.isOnboardingPage = true;

    this.appsData = this.workflowService.deflectApps();
    if (this.appsData.length) {
      this.router.navigate(['/apps']);
    }
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  onOptionSelect(configuration, property, value?) {
    switch (configuration) {
      case 'deflectConfiguration':
        this.config.deflectAppStatus[configuration][property] = value;
        this.scrollTo('section2');
        break;
      case 'virtualAssistant':
        this.config.deflectAppStatus[configuration][property] = value;
        this.scrollTo('section3');
        break;
      case 'handOff':
        this.config.deflectAppStatus[configuration][property] = !this.config.deflectAppStatus[configuration][property];
        break;
    }
  }

  scrollTo(elementId: string) {
    // this.componentRef.directiveRef.scrollToElement('#' + elementId, 0, 500);
    document.querySelector('#' + elementId).scrollIntoView({
      behavior: 'smooth'
    });
    this.currentSection = elementId;
  }

  onClickUpArrow() {
    if (this.currentSection === 'section2') {
      this.scrollTo('section1');
    } else if (this.currentSection === 'section3') {
      this.scrollTo('section2');
    }
  }

  onClickDownArrow() {
    if (this.currentSection === 'section1') {
      this.scrollTo('section2');
    } else if (this.currentSection === 'section2') {
      this.scrollTo('section3');
    }
  }

  onSubmit() {
    // if (!this.config.deflectAppStatus.deflectConfiguration.type) {
    //   this.scrollTo('section1');
    //   this.notificationService.notify('Please choose an option', 'error');
    //   return;
    // }

    if (this.saveInProgress) { return; }


    const payload = this.config;
    payload.deflectAppStatus.virtualAssistant.enabled = !!this.config.deflectAppStatus.virtualAssistant.type;
    this.saveInProgress = true;
    this.service.invoke('save.deflect.apps', {}, payload).subscribe(
      res => {
        this.workflowService.deflectApps(res);
        this.appsData.push(this.workflowService.deflectApps());
        this.router.navigate(['/config']);
        $('.toShowAppHeader').removeClass('d-none');
        this.saveInProgress = false;
      },
      errRes => {
        this.saveInProgress = false;
      }
    );

  }

  ngOnDestroy() {
    this.headerService.isOnboardingPage = false;
  }

}
