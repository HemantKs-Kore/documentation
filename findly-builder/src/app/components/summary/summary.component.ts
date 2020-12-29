import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { SideBarService } from '@kore.services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
declare const $: any;
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SummaryComponent implements OnInit {
  serachIndexId;
  indices: any;
  experiments : any = [];
  variants : any = [];
  activities: any = [];
  channelExist = false;
  totalUsersStats : any = {};
  totalSearchesStats: any = {};
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
    private router: Router,
  ) { }
  

  ngOnInit() {
    const toogleObj = {
      title: 'Summary',
      toShowWidgetNavigation: this.workflowService.showAppCreationHeader()
    };
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.headerService.toggle(toogleObj);
    this.getSummary();
    this.getQueries("TotalUsersStats");
    this.getQueries("TotalSearchesStats");
    this.getChannel();
    this.getAllOverview();

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
  getQueries(type){
    var today = new Date();
    let from = new Date(Date.now() - (29 * 864e5));
    
    const header : any= {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit:100
    };
    let payload : any = {
      type : type,
      filters: {
        from: from.toJSON(),
        to: today.toJSON()
      },
     
    }
    
   
    this.service.invoke('get.queries', quaryparms,payload,header).subscribe(res => {
      if(type == "TotalUsersStats"){
        this.totalUsersStats = res;
      }else if(type == "TotalSearchesStats"){
        this.totalSearchesStats = res;
      }
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notificationService.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notificationService.notify('Failed ', 'error');
       }
     });
  }

  getChannel(){
    const queryParams = {
      userId:this.authService.getUserId(),
      streamId:this.selectedApp._id
    }
    this.service.invoke('get.credential',queryParams).subscribe(
      res => {
        if(res.apps.length){
          this.channelExist = true;
        }
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  getAllOverview(){
    const queryParams = {
      searchIndexId:this.serachIndexId,
    }
    this.service.invoke('get.overview',queryParams).subscribe(
      res => {
        console.log(res);
        this.experiments = res.experiments;
        this.activities =  res.activities;
        this.indices = res.indices;
        this.experiments.forEach(element => {
          if(element.variants){
            element.variants.forEach(res => {
              if(res.leader){
                element['winner'] = true;
              }
            });  
          }
        });
       console.log(this.experiments)
       this.activities.createdOn = moment(this.activities.createdOn).fromNow();
       this.getChannel();
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }

  
  viewAll(route){
    this.router.navigateByUrl(route, { skipLocationChange: true });
  }
}
