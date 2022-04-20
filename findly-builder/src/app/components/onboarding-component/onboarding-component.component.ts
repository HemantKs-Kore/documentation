import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { Subscription } from 'rxjs';
declare const $: any;

@Component({
  selector: 'app-onboarding-component',
  templateUrl: './onboarding-component.component.html',
  styleUrls: ['./onboarding-component.component.scss']
})
export class OnboardingComponentComponent implements OnInit {
  @Output() closeSlid = new EventEmitter();
  @Output() emitStatus = new EventEmitter();
  @Output() openSDK = new EventEmitter();
  @Input() currentRouteData:any;
  @Input() displyStatusBar:any;
  tourConfigData: any = [];
  onBoardingModalPopRef: any;
  element: any;
  appVersion: any;
  checklistCount: number;
  tourData: any;
  statusSlider:boolean=true;
  checkList:any=[];
  subscription: Subscription;
  supportChildData:any=[];
  supportParentData:boolean=true;
  breadcrumbName:any;
  supportChildfaq:any=[];
  supportParentfaq:boolean=true;
  breadcrumbNameFaq:any;
  searchOpen:boolean=false;
  searchOpenFaq:boolean=false;
  support_Search:any;
  faq_Search:any;
  supportData = [{
    title:'Getting started',
    desc:'Explore our Guide on popular topics to start building your own Search Application',
    icon:'assets/icons/onboarding/getting-started.svg',
    class:'getting-start',
    arrow:'up',
    childData:[{
        title:'Adding Content',
        desc:'Add or Manage content to your Application from various sources available in SearchAssist.',
        icon:'assets/icons/onboarding/database.svg',
        color:'Blue',
        link:''
    },
    {
        title:'Manage Index Configuration',
        desc:'Configure Index and Organize data to enable quicker search responses to your end users quieries',
        icon:'assets/icons/onboarding/book.svg',
        color:'purple',
        link:''
    },
    {
        title:'Configure Search Relevance',
        desc:'Fine tune your search results and add custom ranking to it inorder to better suit your business goals',
        icon:'assets/icons/onboarding/configure.svg',
        color:'Orange',
        link:''
    },
    {
        title:'Design Search Experience',
        desc:'Design the look and feel of how your search results are to be displayed to your end user',
        icon:'assets/icons/onboarding/design-search.svg',
        color:'Skyblue',
        link:''
    },
    {
        title:'Running Experiments',
        desc:'Run experiments on multiple variants of index and search configurations to test which variant performs better',
        icon:'assets/icons/onboarding/acid.svg',
        color:'Green',
        link:''
    },
    {
        title:'Analyze Search Insights',
        desc:'Analyze actionable search insights on the performance of your Search Application',
        icon:'assets/icons/onboarding/search-insights.svg',
        color:'Skyskybule',
        link:''
    }]
},
{
    title:"What's new",
    desc:"Check out what's new in the latest release of SearchAssist",
    icon:'assets/icons/onboarding/whatsnew.svg',
    class:'whats-new',
    arrow:'up',
    childData:[{
        title:'Title',
        desc:'Description',
        icon:'assets/icons/onboarding/database.svg',
        color:'Blue',
        link:''
    }]
},
{
    title:"Help and Documentation",
    desc:"Explore our usage guides, in-depth How-to's and API references",
    icon:'assets/icons/onboarding/helpdoc.svg',
    class:'help-doc',
    arrow:'up',
    childData:[{
        title:'Title',
        desc:'Description',
        icon:'assets/icons/onboarding/database.svg',
        color:'Blue',
        link:''
    }]
},
{
    title:"Contact Us",
    desc:"Contact our support team for quick resolution of your queries",
    icon:'assets/icons/onboarding/hours.svg',
    class:'contactus',
    arrow:'up',
    childData:[{
        title:'Title',
        desc:'Description',
        icon:'assets/icons/onboarding/database.svg',
        color:'Blue',
        link:''
    }]
}];

faqData = [{
  display:"Apps",
  key:"apps",
  icon:"",
  childData:[{
      ques:"What are the Questions?",
      ans:"these are the Answer",
      link:""

  },
  {
    ques:"What are the Questions?",
    ans:"these are the Answer",
    link:""

}]
},
{
   display:"Overview",
   key:"summary",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Source",
   key:"source",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Content",
   key:"content",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"FAQs",
   key:"faqs",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Actions",
   key:"botActions",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Synonyms",
   key:"synonyms",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Traits",
   key:"traits",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Business Rules",
   key:"rules",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Facets",
   key:"facets",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Index",
   key:"index",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Exeriments",
   key:"experiments",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Stopwords",
   key:"stopWords",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Weights",
   key:"weights",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Result Ranking",
   key:"resultranking",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Metrics",
   key:"metrics",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Dash Boards",
   key:"dashboard",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"User Engagment",
   key:"userEngagement",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Search Insights",
   key:"searchInsights",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Results Insights",
   key:"resultInsights",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Settings",
   key:"settings",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Credentials-List",
   key:"credentials-list",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Actions",
   key:"actions",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"SmallTalk",
   key:"smallTalk",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"General Settings",
   key:"generalSettings",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Field Management",
   key:"FieldManagementComponent",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"SearchInterface",
   key:"searchInterface",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Result-Template",
   key:"resultTemplate",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Structured Data",
   key:"structuredData",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Team-Management",
   key:"team-management",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Search Experience",
   key:"search-experience",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Pricing",
   key:"pricing",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"Invoices",
   key:"invoices",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
},
{
   display:"UsageLog",
   key:"usageLog",
   icon:"",
   childData:[{
       ques:"What are the Questions?",
       ans:"these are the answer",
       link:""

   }]
}];

  constructor(
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    public router: Router,) {
      
   }

  ngOnInit(): void {
      this.getVersion();
      this.subscription = this.appSelectionService.getTourConfigData.subscribe(res => {
      this.tourConfigData = res;
      this.tourData = res.onBoardingChecklist;
      this.checkList=[{ step: 'Step 1',title:'Add Data',desc:'Data is fetched from various sources and ingested into the application for accurate search results', imgURL:'assets/icons/onboarding/database.svg',route:'/source',tourdata:this.tourData[0].addData, videoUrl:'https://www.w3schools.com/tags/movie.mp4'}, 
      { step: 'Step 2',title:'Review Index configurations',desc:'Index configurations allows you to configure the fields, traits,keywords or create workbench pipelines to suit your business needs.', imgURL: 'assets/icons/onboarding/review-index.svg',route:'/FieldManagementComponent',tourdata:this.tourData[1].indexData, videoUrl:'https://www.w3schools.com/tags/movie.mp4'},
      {step: 'Step 3',title:'Review Search Configurations',desc:'Search Configuration allows you to improve search relevance by configuring  syonyms, weights, stop words, re-ranking results, adding rules or facets.', imgURL: 'assets/icons/onboarding/review-search.svg',route:'/weights',tourdata:this.tourData[2].optimiseSearchResults,  videoUrl:'https://www.w3schools.com/tags/movie.mp4'},
      {step: 'Step 4',title:'Design Search Experience',desc:'SearchAssist allows you to customise the search experiance and design the search interface based on the business context.', imgURL: 'assets/icons/onboarding/search-design.svg',route:'/search-experience',tourdata:this.tourData[3].designSearchExperience,  videoUrl:'https://www.w3schools.com/tags/movie.mp4'}, 
      {step: 'Step 5',title:'Simulate Application',desc:'SearchAssist allows you to validate the configuration and search experience before deploying the app by just clicking on the Preview button.', 
      imgURL: 'assets/icons/onboarding/acid-surface.svg',route:'test' ,tourdata:this.tourData[4].testApp, videoUrl:'https://www.w3schools.com/tags/movie.mp4'}, 
      {step: 'Step 6',title:'Deploy your application',desc:'Configure your application to connect to any of the channels available', 
      imgURL:'assets/icons/onboarding/hand.svg',route:'/settings',tourdata:this.tourData[5].fineTuneRelevance, videoUrl:'https://www.w3schools.com/tags/movie.mp4'}];
      this.trackChecklist();
    })
  }
  triggerFaq() {
    this.currentRouteData=this.currentRouteData.replace("/", "");
    this.faqData.forEach(element => {
      if(this.currentRouteData==element.key){
       this.triggerChildFaq(element);
      }
    });
  }
  triggerChild(data) {
    this.supportParentData = false
    this.supportChildData = data.childData;
     this.breadcrumbName = data.title;
  }
  triggerChildFaq(faq) {
    this.supportParentfaq = false
    this.supportChildfaq = faq.childData;
     this.breadcrumbNameFaq = faq.display;
  }
  // openAccordiandata(index) {
  //   $(document).ready(function(){    
  //     $(".data"+index).mouseenter(function(){
  //        $(".data"+index).trigger( "click" );
  //        $(".video"+index ).trigger( "play" );
  //     });   
  // });
  // }

  // playPause(index) {
  //   $(document).ready(function(){
  //     $(".data"+index).mouseleave(function(){  
  //         $(".data"+index).trigger( "click" );
  //         $(".video"+index ).trigger( "pause" );
  //     });
  // });
  // }
  openAccordianFaq(index) {
    $(document).ready(function(){    
      $(".dataFaq"+index).mouseover(function(){
         $(".dataFaq"+index).trigger( "click" );
      });   
  });
  }

  openSearch(){
    this.searchOpen=true;
  }
  closeSearch(){
    this.searchOpen=false;
    this.support_Search="";
  }
  openFaqSearch(){
    this.searchOpenFaq=true;
  }
  closeFaqSearch(){
    this.searchOpenFaq=false;
    this.faq_Search="";
  }
  toggleSlider(){
    this.emitStatus.emit(this.statusSlider);
  }
  openSdk(){
    this.openSDK.emit();
  }
  checkForStatus(){
      this.statusSlider=this.displyStatusBar;
  }

  openCheckList(){
    $(".nav-link" ).trigger( "click" );
  }


  openAccordiandata2() {
    $(document).ready(function(){
      $(".data2" ).mouseover(function(){
         $(".data2" ).trigger( "click" );
      });
  });
  }

  openAccordiandata3(){
    $(document).ready(function(){
      $(".data3" ).mouseover(function(){
         $(".data3" ).trigger( "click" );
      });
  });
  }
  openAccordiandata4(){
    $(document).ready(function(){
      $(".data4" ).mouseover(function(){
         $(".data4" ).trigger( "click" );
      });
  });
  }
  //track checklist count and show count number
  trackChecklist() {
    let arr = [];
    let Index = [];
    this.tourData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        arr.push(item[key])
      });
    })
    arr.map((item, index) => {
      if (item == false) Index.push(index)
    })
    
    let count = 0;
    for (let key in this.tourData) {
      for (let key1 in this.tourData[key]) {
        if (this.tourData[key][key1]) {
          count = count + 1;
        }
      }
    }
    this.checklistCount = count;    
  }
  closeSupport(){
    this.closeSlid.emit();
    $("#Support" ).trigger( "click" );
  }
  //goto Routes
  gotoRoutes(step,list) {
      this.closeOnBoardingModal();
    if(step == 'test'){
      this.openSdk();
    }
    else {
      this.appSelectionService.routeChanged.next({ name: 'pathchanged', path: step });
    }
    // if (step == '/settings') {
    //   this.appSelectionService.tourConfigCancel.next({ name: false, status: 'pending' });
    // }
    // this.router.navigate([step], { skipLocationChange: true });

  }
  //open useronboard popup
  closeOnBoardingModal() {
    if (!this.tourConfigData.findlyOverviewVisited) {
      this.appSelectionService.updateTourConfig('overview');
      this.closeSupport();
      console.log(this.tourData);
    }
    // if (this.onBoardingModalPopRef && this.onBoardingModalPopRef.close) {
    //   this.onBoardingModalPopRef.close();
    // }
  }
  getVersion(){
    this.service.invoke('get.version').subscribe(res => {
     if(res){
       this.appVersion= res.APP_VERSION;
     }
    }, errRes => {
      this.notificationService.notify('Something has gone wrong.', 'error');
    }); 
  }

}
