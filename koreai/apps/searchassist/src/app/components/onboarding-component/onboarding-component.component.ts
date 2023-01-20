import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { ParentBridgeService } from '@kore.apps/services/parent-bridge.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
declare const $: any;

@Component({
  selector: 'app-onboarding-component',
  templateUrl: './onboarding-component.component.html',
  styleUrls: ['./onboarding-component.component.scss'],
})
export class OnboardingComponentComponent implements OnInit {
  @Output() closeSlid = new EventEmitter();
  @Output() emitStatus = new EventEmitter();
  @Output() openSDK = new EventEmitter();
  @Input() currentRouteData: any;
  @Input() displyStatusBar: any;
  tourConfigData: any = [];
  onBoardingModalPopRef: any;
  element: any;
  appVersion: any;
  checklistCount: number;
  tourData: any;
  statusSlider = true;
  checkList: any = [];
  tourConfigSubscription: Subscription;
  supportChildData: any = [];
  supportParentData = true;
  breadcrumbName: any;
  supportChildfaq: any = [];
  supportParentfaq = true;
  breadcrumbNameFaq: any;
  searchOpen = false;
  searchOpenFaq = false;
  support_Search: any;
  faq_Search: any;
  topicGuideUrl: any;
  topicGuideVideoUrl: SafeResourceUrl;
  showLoader;
  showLoader1;
  supportData = [
    {
      title: 'Getting started',
      desc: 'Explore our Guide on popular topics to start building your own Search Application',
      icon: 'assets/icons/onboarding/getting-started.svg',
      class: 'getting-start',
      arrow: 'up',
      childData: [
        {
          title: 'Adding Content',
          desc: 'Add or Manage content to your Application from various sources available in SearchAssist.',
          icon: 'assets/icons/onboarding/database.svg',
          color: 'Blue',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/introduction-to-content-sources/',
        },
        {
          title: 'Manage Index Configuration',
          desc: 'Configure Index and Organize data to enable quicker search responses to your end users quieries',
          icon: 'assets/icons/onboarding/book.svg',
          color: 'purple',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/introduction-to-indices/',
        },
        {
          title: 'Configure Search Relevance',
          desc: 'Fine tune your search results and add custom ranking to it inorder to better suit your business goals',
          icon: 'assets/icons/onboarding/configure.svg',
          color: 'Orange',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/',
        },
        {
          title: 'Design Search Experience',
          desc: 'Design the look and feel of how your search results are to be displayed to your end user',
          icon: 'assets/icons/onboarding/design-search.svg',
          color: 'Skyblue',
          link: 'https://docs.kore.ai/searchassist/concepts/designing-search-experience/designing-search-experience/',
        },
        {
          title: 'Running Experiments',
          desc: 'Run experiments on multiple variants of index and search configurations to test which variant performs better',
          icon: 'assets/icons/onboarding/acid.svg',
          color: 'Green',
          link: 'https://docs.kore.ai/searchassist/concepts/experimenting-with-search-variants/introduction-to-experiments/',
        },
        {
          title: 'Analyze Search Insights',
          desc: 'Analyze actionable search insights on the performance of your Search Application',
          icon: 'assets/icons/onboarding/search-insights.svg',
          color: 'Skyskybule',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/',
        },
      ],
    },
    // {
    //     title:"What's New",
    //     desc:"Check out what's new in the latest release of SearchAssist",
    //     icon:'assets/icons/onboarding/whatsnew.svg',
    //     class:'whats-new',
    //     arrow:'up',
    //     childData:[{
    //         title:'We have added below features',
    //         desc:'Support to Confluence and ServiceNow Connecters',
    //         icon:'assets/icons/onboarding/database.svg',
    //         color:'Blue',
    //         link:'https://docs.kore.ai/searchassist/searchassist/overview/'
    //     }]
    // },
    {
      title: 'Help and Documentation',
      desc: "Explore our usage guides, in-depth How-to's and API references",
      icon: 'assets/icons/onboarding/helpdoc.svg',
      class: 'help-doc',
      arrow: 'up',
      childData: [
        {
          title: 'Help and Support',
          desc: 'Click here for the documentation link',
          icon: 'assets/icons/onboarding/database.svg',
          color: 'Blue',
          link: 'https://docs.kore.ai/searchassist/searchassist/overview/',
        },
      ],
    },
    {
      title: 'Contact Us',
      desc: 'Contact our support team for quick resolution of your queries',
      icon: 'assets/icons/onboarding/hours.svg',
      class: 'contactus',
      arrow: 'up',
      childData: [
        {
          title: 'Contact Us',
          desc: 'Please contact support@kore.ai for any queries',
          icon: 'assets/icons/onboarding/database.svg',
          color: 'Blue',
          link: '',
        },
      ],
    },
  ];

  faqData = [
    //   {
    //   display:"Apps",
    //   key:"apps",
    //   icon:"",
    //   childData:[
    //     {
    //       ques:"What are the Questions?",
    //       ans:"these are the Answer",
    //       link:""

    //   },
    //   {
    //     ques:"What are the Questions?",
    //     ans:"these are the Answer",
    //     link:""

    // }]
    // },
    // {
    //    display:"Overview",
    //    key:"summary",
    //    icon:"",
    //    childData:[{
    //        ques:"What are the Questions?",
    //        ans:"these are the answer",
    //        link:""

    //    }]
    // },
    {
      display: 'Sources',
      key: 'source',
      icon: '',
      childData: [
        {
          ques: 'What are the Questions?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/searchassist/overview/',
        },
        {
          ques: 'What are the content types supported by SearchAssist?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/introduction-to-content-sources/',
        },
      ],
    },
    {
      display: 'Content',
      key: 'content',
      icon: '',
      childData: [
        {
          ques: 'How to add content from your website by crawling?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/crawling-web-pages/',
        },
        {
          ques: 'How to schedule Auto- crawl for your website?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/crawling-web-pages/#Scheduling_Crawls',
        },
        {
          ques: 'How to upload files as content to your App?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-documents/',
        },
      ],
    },
    {
      display: 'FAQs',
      key: 'faqs',
      icon: '',
      childData: [
        {
          ques: 'How to extract FAQ’s from a PDF file?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-faqs/#Extracting_FAQs_From_Files',
        },
        {
          ques: 'What is annotate & extract FAQ’s?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-faqs/#Annotating_Extracting_FAQs',
        },
        {
          ques: ' How to extract FAQ’s from a URL?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-faqs/#Extracting_FAQs_from_a_URL',
        },
        {
          ques: 'How to add FAQ’s manually?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-faqs/#Adding_FAQs_Manually',
        },
        {
          ques: 'How to add conditional responses to FAQ’s',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-faqs/#Managing_Conditional_Responses',
        },
        {
          ques: 'What is a FAQ workflow and how does it work?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-faqs/#FAQ_Review_Workflow',
        },
      ],
    },
    {
      display: 'Actions',
      key: 'botActions',
      icon: '',
      childData: [
        {
          ques: 'What are bot actions?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/introduction-to-content-sources/',
        },
        {
          ques: 'How to integrate a bot to SearchAssist as a content?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/linking-your-virtual-assistant/',
        },
      ],
    },
    {
      display: 'Synonyms',
      key: 'synonyms',
      icon: '',
      childData: [
        {
          ques: 'What are Synonyms and their types?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Adding_Synonyms',
        },
        {
          ques: 'How do I add Synonyms?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Adding_Synonyms-2',
        },
      ],
    },
    {
      display: 'Traits',
      key: 'traits',
      icon: '',
      childData: [
        {
          ques: ' What are traits?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/configuring-traits/',
        },
        {
          ques: 'How to configure traits in SearchAssist?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/configuring-traits/#Adding_Traits',
        },
      ],
    },
    {
      display: 'Business Rules',
      key: 'rules',
      icon: '',
      childData: [
        {
          ques: 'What are Business rules?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/personalizing-results/personalizing-results-ranking/#Configuring_Business_Rules',
        },
        {
          ques: 'How to add conditions and define an outcome?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/personalizing-results/personalizing-results-ranking/#More_About_Business_Rules',
        },
        {
          ques: 'What are contexts in Business rules?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/personalizing-results/personalizing-results-ranking/#Scenarios',
        },
        {
          ques: 'How do I edit/delete Business rules?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/personalizing-results/personalizing-results-ranking/#Applying_Business_Rules',
        },
      ],
    },
    {
      display: 'Facets',
      key: 'facets',
      icon: '',
      childData: [
        {
          ques: 'What are Facets and its types in Search Assist?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Creating_Facets',
        },
        {
          ques: 'How to configure a Filter Facet?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Filter_Facets',
        },
        {
          ques: 'How to configure a sortable Facet?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Sortable_Facets',
        },
        {
          ques: 'How to configure a Tab Facet?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Tab_Facets',
        },
      ],
    },
    {
      display: 'Workbench',
      key: 'index',
      icon: '',
      childData: [
        {
          ques: 'What are the different pipelines available in the workbench?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/managing-index-pipeline/',
        },
        {
          ques: 'How do I map fields using the field mapping stage?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/managing-index-pipeline/#Field_Mapping',
        },
        {
          ques: 'How do I extract keywords using the keyword extraction stage?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/managing-index-pipeline/#Keyword_Extraction',
        },
        {
          ques: 'How do I extract entities  using the field mapping stage?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/managing-index-pipeline/#Entity_Extraction',
        },
        {
          ques: 'How do I map fields using the field mapping stage?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/managing-index-pipeline/#Traits_Extraction',
        },
        {
          ques: ' How to write a custom script as a part of a workbench stage?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/managing-index-pipeline/#Custom_Script',
        },
        {
          ques: 'How do I exclude certain documents from my search index?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/managing-index-pipeline/#Exclude_Documents',
        },
      ],
    },
    {
      display: 'Experiments',
      key: 'experiments',
      icon: '',
      childData: [
        {
          ques: 'What are experiments?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/experimenting-with-search-variants/introduction-to-experiments/',
        },
        {
          ques: 'How do I configure experiments?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/experimenting-with-search-variants/experiments//',
        },
        {
          ques: 'How to check insights after running an experiment?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/experimenting-with-search-variants/experiments/#Getting_Insights_from_Experiments',
        },
      ],
    },
    {
      display: 'Stop Words',
      key: 'stopWords',
      icon: '',
      childData: [
        {
          ques: 'What are Stop words?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Adding_Stop_Words',
        },
        {
          ques: 'How do I add custom Stop words?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Adding_New_Stop_Words',
        },
        {
          ques: 'How do I disable stop words ?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Managing_Stop_Words',
        },
      ],
    },
    {
      display: 'Weights',
      key: 'weights',
      icon: '',
      childData: [
        {
          ques: 'What are weights?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Adding_Weights',
        },
        {
          ques: 'How do I configure weights?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/#Assigning_Weights',
        },
      ],
    },
    {
      display: 'Results Ranking',
      key: 'resultranking',
      icon: '',
      childData: [
        {
          ques: 'What is Results Ranking ?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/personalizing-results/personalizing-results-ranking/#Tuning_Results_Ranking',
        },
        {
          ques: 'How can you simulate your search Application?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/testing-as-you-build/testing-as-you-build/',
        },
        {
          ques: 'How to customize my results?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/personalizing-results/personalizing-results-ranking/#Adding_Personalizations',
        },
        {
          ques: 'How to edit/ delete result customization?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/personalizing-results/personalizing-results-ranking/#Reset_Customization',
        },
      ],
    },
    // {
    //    display:"Metrics",
    //    key:"metrics",
    //    icon:"",
    //    childData:[{
    //        ques:"What are the Questions?",
    //        ans:"these are the answer",
    //        link:""

    //    }]
    // },
    {
      display: 'Dashboards',
      key: 'dashboard',
      icon: '',
      childData: [
        {
          ques: 'How do I check metrics for a particular date range?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/#Accessing_the_SearchAssist_Dashboard',
        },
        {
          ques: 'How to track metrics based on index?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/#Metrics',
        },
      ],
    },
    {
      display: 'User Engagment',
      key: 'userEngagement',
      icon: '',
      childData: [
        {
          ques: 'What metrics that can i track as a part of measuring User Engagement?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/#Metrics-2',
        },
        {
          ques: 'When do I see metrics for user engagement?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/#Filtering-2',
        },
      ],
    },
    {
      display: 'Search Insights',
      key: 'searchInsights',
      icon: '',
      childData: [
        {
          ques: 'How can I use my search insights to improve relevance?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/#Getting_Insights_from_Search_Queries',
        },
        {
          ques: 'What are positive and negative feedback metrics?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/?preview=true#Insights_from_Feedback_on_Results',
        },
        {
          ques: 'How do I enable / disable user feedback for search?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/designing-search-experience/designing-search-experience/#Results_Feedback',
        },
      ],
    },
    {
      display: 'Results Insights',
      key: 'resultInsights',
      icon: '',
      childData: [
        {
          ques: 'What are the metrics that can be tracked as a part of Result Insights?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/#Getting_Insights_from_Results',
        },
        {
          ques: 'When do I see metrics for Result Insights?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/analyzing-performance/analyzing-search-performance/#Filtering-3',
        },
      ],
    },
    {
      display: 'General Settings',
      key: 'generalSettings',
      icon: '',
      childData: [
        {
          ques: 'How do i auto-execute winning intent',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/linking-your-virtual-assistant/#End-Users_Experience_Virtual_Assistant_Actions_From_Search',
        },
        {
          ques: 'How to enable/disable small talk?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/administration/managing-channels-2/#Small_Talk',
        },
      ],
    },
    {
      display: 'Channels',
      key: 'settings',
      icon: '',
      childData: [
        {
          ques: 'How to add/configure channels?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/administration/managing-channels-3/',
        },
      ],
    },
    {
      display: 'Credentials List',
      key: 'credentials-list',
      icon: '',
      childData: [
        {
          ques: 'How do i delete my credential?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/administration/managing-credentials/#Deleting_a_Credential',
        },
      ],
    },
    {
      display: 'Field Management',
      key: 'FieldManagementComponent',
      icon: '',
      childData: [
        {
          ques: 'What are fields in SearchAssist ?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/configuring-search-fields/',
        },
        {
          ques: 'How do i add custom fields?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-indices/configuring-search-fields/#Adding_Fields',
        },
      ],
    },
    {
      display: 'Search Interface',
      key: 'searchInterface',
      icon: '',
      childData: [
        {
          ques: 'How to customize search Experience?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/designing-search-experience/designing-search-experience/',
        },
        {
          ques: 'What is the Search bar and Assistant experience?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/designing-search-experience/designing-search-experience/#Search_Experience',
        },
        {
          ques: 'How to design my search bar experience?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/designing-search-experience/designing-search-experience/#Configuring_Search_Experience',
        },
      ],
    },
    {
      display: 'Result Template',
      key: 'resultTemplate',
      icon: '',
      childData: [
        {
          ques: 'What are Result templates?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/designing-search-experience/designing-search-experience/#Designing_Results_Templates',
        },
        {
          ques: 'How to design templates for the search results?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/designing-search-experience/designing-search-experience/#Configuring_Result_Views',
        },
      ],
    },
    {
      display: 'Structured Data',
      key: 'structuredData',
      icon: '',
      childData: [
        {
          ques: 'How to import structured data from a CSV or JSON file?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-structured-data/#Importing_Structured_Data',
        },
        {
          ques: 'How to add Structured data manually?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/concepts/managing-content/adding-structured-data/#Manually_Adding_Structured_Data',
        },
      ],
    },
    {
      display: 'Team',
      key: 'team-management',
      icon: '',
      childData: [
        {
          ques: 'How do i add members to collaborate?',
          ans: 'these are the answer',
          link: 'https://docs.kore.ai/searchassist/managing-searchassist-apps/collaboration/',
        },
      ],
    },
    // {
    //    display:"Search Experience",
    //    key:"search-experience",
    //    icon:"",
    //    childData:[{
    //     ques:"What are the Questions?",
    //     ans:"these are the answer",
    //     link:""

    // }]
    // },
    {
      display: 'Pricing',
      key: 'pricing',
      icon: '',
      childData: [
        {
          ques: 'How does SearchAssist’s Pricing Work ?',
          ans: 'SearchAssist offers a free and paid subscription plan. You can choose from any of the subscription plans based on your needs. Every subscription comes with a predefined number of documents and number of end-user queries/searches.',
          link: '',
        },
        {
          ques: 'What happens if I exceed the document limit or query limit on the free forever plan?',
          ans: 'We understand that every business is different and their needs will be different. All our subscription plans allow overages and you can pick an overage bundle that suits your needs. You can choose to increase the number of documents or queries or both, while continuing with your subscription.',
          link: '',
        },
        {
          ques: 'How are usage of queries calculated?',
          ans: 'A query in SearchAssist accounts for any search request made to our engine which includes searching for a query, applying for filters and selecting facets. Query Suggestions and Live Results do not count towards the usage of Queries',
          link: '',
        },
      ],
    },
    {
      display: 'Invoices',
      key: 'invoices',
      icon: '',
      childData: [
        {
          ques: 'How does SearchAssist’s Pricing Work ?',
          ans: 'SearchAssist offers a free and paid subscription plan. You can choose from any of the subscription plans based on your needs. Every subscription comes with a predefined number of documents and number of end-user queries/searches.',
          link: '',
        },
        {
          ques: 'What happens if I exceed the document limit or query limit on the free forever plan?',
          ans: 'We understand that every business is different and their needs will be different. All our subscription plans allow overages and you can pick an overage bundle that suits your needs. You can choose to increase the number of documents or queries or both, while continuing with your subscription.',
          link: '',
        },
        {
          ques: 'How are usage of queries calculated?',
          ans: 'A query in SearchAssist accounts for any search request made to our engine which includes searching for a query, applying for filters and selecting facets. Query Suggestions and Live Results do not count towards the usage of Queries',
          link: '',
        },
      ],
    },
    {
      display: 'UsageLog',
      key: 'usageLog',
      icon: '',
      childData: [
        {
          ques: 'How does SearchAssist’s Pricing Work ?',
          ans: 'SearchAssist offers a free and paid subscription plan. You can choose from any of the subscription plans based on your needs. Every subscription comes with a predefined number of documents and number of end-user queries/searches.',
          link: '',
        },
        {
          ques: 'What happens if I exceed the document limit or query limit on the free forever plan?',
          ans: 'We understand that every business is different and their needs will be different. All our subscription plans allow overages and you can pick an overage bundle that suits your needs. You can choose to increase the number of documents or queries or both, while continuing with your subscription.',
          link: '',
        },
        {
          ques: 'How are usage of queries calculated?',
          ans: 'A query in SearchAssist accounts for any search request made to our engine which includes searching for a query, applying for filters and selecting facets. Query Suggestions and Live Results do not count towards the usage of Queries',
          link: '',
        },
      ],
    },
  ];
  topicGuideObj = {
    enableIframe: false,
    selectedContent: '',
  };
  mediaObj: any = {};

  constructor(
    private appSelectionService: AppSelectionService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    public router: Router,
    public parentBridgeService: ParentBridgeService,
    private safePipe: SafePipe
  ) {}

  ngOnInit(): void {
    this.getVersion();
    this.tourConfigSubscription =
      this.appSelectionService.getTourConfigData.subscribe((res) => {
        this.tourConfigData = res;
        this.tourData = res.onBoardingChecklist;
        this.checkList = [
          {
            step: 'Step 1',
            title: 'Add Data',
            desc: 'Data is fetched from various sources and ingested into the application for accurate search results',
            imgURL: 'assets/icons/onboarding/database.svg',
            route: '/sources',
            tourdata: this.tourData[0].addData,
            videoUrl: 'https://www.w3schools.com/tags/movie.mp4',
            docUrl:
              'https://docs.kore.ai/searchassist/concepts/managing-content/introduction-to-content-sources/',
          },
          {
            step: 'Step 2',
            title: 'Review Index Configurations',
            desc: 'Index configurations allows you to configure the fields, traits,keywords or create workbench pipelines to suit your business needs.',
            imgURL: 'assets/icons/onboarding/review-index.svg',
            route: '/FieldManagementComponent',
            tourdata: this.tourData[1].indexData,
            videoUrl: 'https://www.w3schools.com/tags/movie.mp4',
            docUrl:
              'https://docs.kore.ai/searchassist/concepts/managing-indices/introduction-to-indices/',
          },
          {
            step: 'Step 3',
            title: 'Review Search Configurations',
            desc: 'Search Configuration allows you to improve search relevance by configuring  synonyms, weights, stop words, re-ranking results, adding rules or facets.',
            imgURL: 'assets/icons/onboarding/review-search.svg',
            route: '/weights',
            tourdata: this.tourData[2].optimiseSearchResults,
            videoUrl: 'https://www.w3schools.com/tags/movie.mp4',
            docUrl:
              'https://docs.kore.ai/searchassist/concepts/managing-relevance/managing-relevance/',
          },
          {
            step: 'Step 4',
            title: 'Design Search Experience',
            desc: 'SearchAssist allows you to customise the Search Experiance and design the Search Interface based on the business context.',
            imgURL: 'assets/icons/onboarding/search-design.svg',
            route: '/search-experience',
            tourdata: this.tourData[3].designSearchExperience,
            videoUrl: 'https://www.w3schools.com/tags/movie.mp4',
            docUrl:
              'https://docs.kore.ai/searchassist/concepts/designing-search-experience/designing-search-experience/',
          },
          {
            step: 'Step 5',
            title: 'Simulate Application',
            desc: 'SearchAssist allows you to validate the Configuration and Search Experience before deploying the app by just clicking on the Preview button.',
            imgURL: 'assets/icons/onboarding/acid-surface.svg',
            route: 'test',
            tourdata: this.tourData[4].testApp,
            videoUrl: 'https://www.w3schools.com/tags/movie.mp4',
            docUrl:
              'https://docs.kore.ai/searchassist/concepts/testing-as-you-build/testing-as-you-build/',
          },
          {
            step: 'Step 6',
            title: 'Deploy your application',
            desc: 'Configure your application to connect to any of the channels available',
            imgURL: 'assets/icons/onboarding/hand.svg',
            route: '/settings',
            tourdata: this.tourData[5].fineTuneRelevance,
            videoUrl: 'https://www.w3schools.com/tags/movie.mp4',
            docUrl:
              'https://docs.kore.ai/searchassist/deploying-searchassist-app/developers-corner/',
          },
        ];
        this.trackChecklist();
      });
    window.addEventListener(
      'message',
      (event) => {
        this.readEvent(event.data, event.data.action);
      },
      false
    );
  }
  readEvent(data, action) {
    if (action == 'videoModal') {
      this.openMediaModal(data.payload);
    }
  }
  openMediaModal = function (payload) {
    // var med =  mediaObj || {};
    // mediaObj = med;
    // $('#topicGuideVideoModal').modal('show');
    // mediaObj.loadingMedia = true;
    // this.showLoader1 = true;
    // this.topicGuideVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mediaObj.url);
    // mediaObj.title=this.mediaObj.title
    this.mediaObj = payload;
    this.mediaObj.title = payload.title;
    this.mediaObj.description = payload.description;
    $('#topicGuideVideoModal').modal('show');
    this.mediaObj.loadingMedia = true;
    this.showLoader1 = true;
    this.topicGuideVideoUrl = payload.url;
  };

  triggerFaq() {
    //added below if condition to prevent the loader multiple times on click of topic guide
    // if(this.topicGuideObj.enableIframe){
    //   return
    // }
    this.currentRouteData = this.currentRouteData.replace('/', '');
    if (this.currentRouteData == '') {
      this.currentRouteData = this.router.url;
      this.currentRouteData = this.currentRouteData.replace('/', '');
    }
    this.triggerChildFaq(this.currentRouteData);
    //let index = this.faqData.findIndex(el => el.key == this.currentRouteData)
    // if(index < 0) {
    //   // this.triggerChild()
    //   this.supportParentfaq=true;
    //   this.closeFaqSearch()    //
    // } else {
    //   this.faqData.forEach(element => {
    //     if(this.currentRouteData==element.key){
    //      this.triggerChildFaq(element);
    //     }
    //   });
    // }
  }
  showHideSpinner() {
    setTimeout(() => {
      this.showLoader = false;
      this.showLoader1 = false;
    }, 2500);
  }
  triggerChild(data) {
    this.supportParentData = false;
    this.supportChildData = data.childData;
    this.breadcrumbName = data.title;
  }
  triggerChildFaq(faq) {
    const topicGuide: any = environment;
    if (
      topicGuide.hasOwnProperty('topicGuideBaseUrl') &&
      topicGuide['topicGuideBaseUrl']
    ) {
      const topicGuideBaseUrl = topicGuide['topicGuideBaseUrl'];
      const version = 'latest';
      const language = 'en';
      const topicId = faq;
      const topicGuideUrl = this.safePipe.transform(
        topicGuideBaseUrl + language + '/' + version + '/' + topicId,
        'resourceUrl'
      );
      this.topicGuideUrl = topicGuideUrl;
      $('.topic-guide-tab').trigger('click');
      if (this.topicGuideObj.enableIframe) {
        this.showLoader = false;
      } else {
        this.showLoader = true;
      }
      this.topicGuideObj.enableIframe = true;
      this.topicGuideObj.selectedContent = topicId;
    } else {
      this.topicGuideObj.enableIframe = false;
    }
    this.supportParentfaq = false;
    this.supportChildfaq = faq.childData;
    this.breadcrumbNameFaq = faq.replace('/', '');
    /**Sources*/
    if (this.breadcrumbNameFaq == 'content') {
      this.breadcrumbNameFaq = 'Content';
    } else if (this.breadcrumbNameFaq == 'faqs') {
      this.breadcrumbNameFaq = 'FAQs';
    } else if (this.breadcrumbNameFaq == 'botActions') {
      this.breadcrumbNameFaq = 'Actions';
    } else if (this.breadcrumbNameFaq == 'structuredData') {
      this.breadcrumbNameFaq = 'Structured Data';
    } else if (this.breadcrumbNameFaq == 'connectors') {
      this.breadcrumbNameFaq = 'Connectors';
    } else if (this.breadcrumbNameFaq == 'summary') {
      /**Overview*/
      this.breadcrumbNameFaq = 'Overview';
    } else if (this.breadcrumbNameFaq == 'FieldManagementComponent') {
      /**Indices */
      this.breadcrumbNameFaq = 'Field Management';
    } else if (this.breadcrumbNameFaq == 'traits') {
      this.breadcrumbNameFaq = 'Traits';
    } else if (this.breadcrumbNameFaq == 'index') {
      this.breadcrumbNameFaq = 'Workbench';
    } else if (this.breadcrumbNameFaq == 'weights') {
      this.breadcrumbNameFaq = 'Weights';
    } else if (this.breadcrumbNameFaq == 'synonyms') {
      this.breadcrumbNameFaq = 'Synonyms';
    } else if (this.breadcrumbNameFaq == 'stopWords') {
      this.breadcrumbNameFaq = 'Stop Words';
    } else if (this.breadcrumbNameFaq == 'resultranking') {
      this.breadcrumbNameFaq = 'Results Ranking';
    } else if (this.breadcrumbNameFaq == 'facets') {
      this.breadcrumbNameFaq = 'Facets';
    } else if (this.breadcrumbNameFaq == 'rules') {
      this.breadcrumbNameFaq = 'Business Rules';
    } else if (this.breadcrumbNameFaq == 'search-experience') {
      this.breadcrumbNameFaq = 'Search Interface';
    } else if (this.breadcrumbNameFaq == 'resultTemplate') {
      this.breadcrumbNameFaq = 'Result Templates';
    } else if (this.breadcrumbNameFaq == 'experiments') {
      /**Analytics*/
      this.breadcrumbNameFaq = 'Experiments';
    } else if (this.breadcrumbNameFaq == 'dashboard') {
      this.breadcrumbNameFaq = 'Dashboard';
    } else if (this.breadcrumbNameFaq == 'userEngagement') {
      this.breadcrumbNameFaq = 'User Engagement';
    } else if (this.breadcrumbNameFaq == 'searchInsights') {
      this.breadcrumbNameFaq = 'Search Insights';
    } else if (this.breadcrumbNameFaq == 'resultInsights') {
      this.breadcrumbNameFaq = 'Results Insights';
    } else if (this.breadcrumbNameFaq == 'generalSettings') {
      /**Manage */
      this.breadcrumbNameFaq = 'General Settings';
    } else if (this.breadcrumbNameFaq == 'settings') {
      this.breadcrumbNameFaq = 'Channels';
    } else if (this.breadcrumbNameFaq == 'credentials-list') {
      this.breadcrumbNameFaq = 'Credentials';
    } else if (this.breadcrumbNameFaq == 'team-management') {
      this.breadcrumbNameFaq = 'Team';
    } else if (this.breadcrumbNameFaq == 'pricing') {
      this.breadcrumbNameFaq = 'Pricing';
    } else if (this.breadcrumbNameFaq == 'usageLog') {
      this.breadcrumbNameFaq = 'Usage Log';
    } else if (this.breadcrumbNameFaq == 'invoices') {
      this.breadcrumbNameFaq = 'Invoices';
    }
  }
  closeMediaModal(event) {
    this.mediaObj = {};
    //console.log(event);
    $(event.target)
      .closest('.videoContainer')
      .find('iframe')
      .attr(
        'src',
        $(event.target).closest('.videoContainer').find('iframe').attr('src')
      );
    // $('.pause-icon').click();
    // $('.rounded-box').click();

    // $('.play').click();
    // $('.rounded-box').ariaLabel = 'Pause'
    // let $frame=$('#topicGuideVideoModal');
    // let vidsrc = $frame.attr('src');
    // $frame.attr('src','');

    //   $("#topicGuideVideoModal").on('hide.bs.modal', function (e) {
    //     $("#topicGuideVideoModal iframe").attr("src", $("#topicGuideVideoModal iframe").attr("src"));
    // });
    // $('iframe').attr('src', $('iframe').attr('src'));
    $('#topicGuideVideoModal').modal('hide');
  }

  onMediaLoadedLoaded() {
    setTimeout(function () {
      this.mediaObj.loadingMedia = false;
    });
  }
  openAccordianFaq(index) {
    $(document).ready(function () {
      $('.dataFaq' + index).mouseover(function () {
        $('.dataFaq' + index).trigger('click');
      });
    });
  }

  openSearch() {
    this.searchOpen = true;
  }
  closeSearch() {
    this.searchOpen = false;
    this.support_Search = '';
  }
  openFaqSearch() {
    this.searchOpenFaq = true;
  }
  closeFaqSearch() {
    this.searchOpenFaq = false;
    this.faq_Search = '';
  }
  toggleSlider() {
    this.emitStatus.emit(this.statusSlider);
  }
  openSdk() {
    this.openSDK.emit();
  }
  checkForStatus() {
    this.statusSlider = this.displyStatusBar;
  }

  openCheckList() {
    $('.nav-link').trigger('click');
  }
  openTopicguide() {
    $('#topicguide').trigger('click');
  }

  openAccordiandata2() {
    $(document).ready(function () {
      $('.data2').mouseover(function () {
        $('.data2').trigger('click');
      });
    });
  }

  openAccordiandata3() {
    $(document).ready(function () {
      $('.data3').mouseover(function () {
        $('.data3').trigger('click');
      });
    });
  }
  openAccordiandata4() {
    $(document).ready(function () {
      $('.data4').mouseover(function () {
        $('.data4').trigger('click');
      });
    });
  }
  //track checklist count and show count number
  trackChecklist() {
    let arr = [];
    let Index = [];
    this.tourData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        arr.push(item[key]);
      });
    });
    arr.map((item, index) => {
      if (item == false) Index.push(index);
    });

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
  closeSupport() {
    this.closeSlid.emit();
    $('#Support').trigger('click');
    this.supportParentData = true;
  }
  //goto Routes
  gotoRoutes(step, list) {
    this.closeOnBoardingModal();
    if (step == 'test') {
      this.openSdk();
    } else {
      this.appSelectionService.routeChanged.next({
        name: 'pathchanged',
        path: step,
      });
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
  getVersion() {
    this.service.invoke('get.version').subscribe(
      (res) => {
        if (res) {
          this.appVersion = res.APP_VERSION;
        }
      },
      (errRes) => {
        //this.notificationService.notify('Something has gone wrong.', 'error');
      }
    );
  }

  goToLink(url: string) {
    if (url.length > 0) {
      window.open(url, '_blank');
    }
  }
}
