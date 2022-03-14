import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { Subscription } from 'rxjs';
declare const $: any;

@Component({
  selector: 'app-onboarding-component',
  templateUrl: './onboarding-component.component.html',
  styleUrls: ['./onboarding-component.component.scss']
})
export class OnboardingComponentComponent implements OnInit {
  @Output() closeSlid = new EventEmitter();
  tourConfigData: any = [];
  onBoardingModalPopRef: any;
  element: any;
  checklistCount: number;
  tourData: any;
  checkList: any = [{ step: 'Step 1',title:'Add Data',desc:'Data is fetched from various sources and ingested into the application for accurate search results', imgURL: '',route:'/source'}, 
{ step: 'Step 2',title:'Review Index configurations',desc:'Index configurations allows you to configure the fields, traits,keywords or create workbench pipelines to suit your business needs.', imgURL: 'assets/icons/onboarding/review-index.svg',route:'/FieldManagementComponent'},
{step: 'Step 3',title:'Review Search Configurations',desc:'Search Configuration allows you to improve search relevance by configuring  syonyms, weights, stop words, re-ranking results, adding rules or facets.', imgURL: 'assets/icons/onboarding/review-search.svg',route:'/weights'},
{step: 'Step 4',title:'Design Search Experience',desc:'SearchAssist allows you to customise the search experiance and design the search interface based on the business context.', imgURL: 'assets/icons/onboarding/search-design.svg',route:'/search-experience'}, 
{step: 'Step 5',title:'Simulate Application',desc:'SearchAssist allows you to validate the configuration and search experience before deploying the app by just clicking on the Preview button.', 
imgURL: 'assets/icons/onboarding/acid-surface.svg',route:'/resultranking'}, 
{step: 'Step 6',title:'Deploy your application',desc:'Configure your application to connect to any of the channels available', 
imgURL: 'assets/icons/onboarding/hand.svg',route:'/resultranking'}];
  subscription: Subscription;
  constructor(private appSelectionService: AppSelectionService) {
    // $(document).ready(function(){
    //   $( ".collapse" ).mouseover(function(){
    //     $( ".collapse" ).trigger( "click" );
    //     // If creating multiple accordion items, use the below to prevent all other
    //     // items with the class "accordion-toggle" triggering a click event
    //     // $(this).trigger("click");
    //   });
    // });    

   }

  ngOnInit(): void {
    
    this.subscription = this.appSelectionService.getTourConfigData.subscribe(res => {
      this.tourConfigData = res;
      this.tourData = res.onBoardingChecklist;
      this.trackChecklist();
    })
    console.log(this.tourData);
  }
  openAccordiandata1(){
    $(document).ready(function(){
      $(".data1" ).mouseover(function(){
         $(".data1" ).trigger( "click" );
      });
  });
  }

  openAccordiandata2(){
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
  }
  //goto Routes
  gotoRoutes(step) {
    this.appSelectionService.routeChanged.next({ name: 'pathchanged', path: step });
    if (step !== '/settings') {
      this.closeOnBoardingModal();
    }
    if (step == '/settings') {
      this.appSelectionService.tourConfigCancel.next({ name: false, status: 'pending' });
    }
    //this.router.navigate([step], { skipLocationChange: true });
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

}
