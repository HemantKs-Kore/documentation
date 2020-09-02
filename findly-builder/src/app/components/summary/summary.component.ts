import { Component, OnInit } from '@angular/core';
import { SideBarService } from '@kore.services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { AuthService } from '@kore.services/auth.service';
declare const $: any;
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SummaryComponent implements OnInit {

  selectedApp: any;
  loading = true;
  summary:any;
  showError = false;
  btLogs: any[] = [];
  summaryObj:any ={
    contentDocuments: [],
    contentWebDomains: [],
    faqWebDomains: [],
    faqDocuments: []
  }
  emptySummaryBlocks: any = [
  {
   stepCount: 1,
   stepName: 'Add Source',
   stepDiscription: 'You need to add source such as web pages, documents, FAQs, bot actions'
  },
  {
   stepCount: 2,
   stepName: 'Manage Content',
   stepDiscription: 'You can then review and moidify the added sources if required'
  },
  {
   stepCount: 3,
   stepName: 'Test & Preview',
   stepDiscription: 'You can then check how the serach results or bot actions will be displayed to the end-user'
  },
  {
   stepCount: 4,
   stepName: 'Training',
   stepDiscription: 'You can now train Findly.ai to address the user\'s quaries more effectively'
  },
  {
    stepCount: 5,
    stepName: 'Puublish and Deploy',
   stepDiscription: 'You can now deploye app and allow users to intract  with the searchbot'
  },
  {
    stepCount: 6,
    stepName: 'Analytics and Insignts',
   stepDiscription: 'You can now track real realtime performance, operational, usage metrics of your app'
  }
  ];
  tooltipObj: any = {
    'Total Users': 'Total number of calls received by the app today.',
    'In Progress': 'Number of conversation sessions currently in-progress.',
    'Fulfilled via Automation': 'Number of conversation sessions that are fulfilled by the Chat or Voice Virtual Agents.',
    'Handed-off to Agents': 'Number of conversation sessions that are handed-off Virtual Agents.',
    'Drop offs': 'Number of conversation sessions where the users have dropped-off from the conversation.'
  };

  constructor(
    public workflowService: WorkflowService,
    private headerService: SideBarService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    const toogleObj = {
      title: 'Summary',
      toShowWidgetNavigation: this.workflowService.showAppCreationHeader()
    };
    this.selectedApp = this.workflowService.selectedApp();
    this.headerService.toggle(toogleObj);
    this.getSummary();
  }
  getSummary() {
    this.loading = false;
    // this.loading = true;
    // const params = {
    //   appId: this.selectedApp._id || this.selectedApp[0]._id
    // };
    // this.service.invoke('get.summary', params)
    //   .pipe(
    //     finalize(() => this.loading = false)
    //   )
    //   .subscribe((res: SummaryModel) => {
    //     this.summary = res;
    //   }, err => {
    //     this.showError = true;
    //     this.notificationService.notify('Unable to get summary details', 'error');
    //   });
  }
}
