import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { RangeSlider } from '../../helpers/models/range-slider.model';
import { WorkflowService } from '@kore.services/workflow.service';
import { AuthService } from '@kore.services/auth.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { SideBarService } from './../../services/header.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-search-experience',
  templateUrl: './search-experience.component.html',
  styleUrls: ['./search-experience.component.scss']
})
export class SearchExperienceComponent implements OnInit {
  selectedTab: string = 'experience';
  selectSearch: string;
  selectedApp: any = {};
  serachIndexId: any;
  indexPipelineId : any;
  suggestions: any = [];
  searchObject: any = {
    "searchExperienceConfig": {
      "searchBarPosition": ""
    },
    "searchWidgetConfig": {
      "searchBarFillColor": "#FFFFFF",
      "searchBarBorderColor": "#E4E5E7",
      "searchBarPlaceholderText": "Search",
      "searchBarPlaceholderTextColor": "#BDC1C6",
      "searchButtonEnabled": false,
      "buttonText": "Button",
      "buttonTextColor": "#BDC1C6",
      "buttonFillColor": "#EFF0F1",
      "buttonBorderColor": "#EFF0F1",
      "searchBarIcon": "6038e58234b5352faa7773b0",
      "userSelectedColors": [],
      "buttonPlacementPosition": 'inside'
    },
    "searchInteractionsConfig": {
      "feedbackExperience": { resultLevel: true, queryLevel: false },
      "welcomeMsg": "Hi, How can I help you",
      "welcomeMsgColor": "#000080",
      "showSearchesEnabled": false,
      "showSearches": "frequent",
      "autocompleteOpt": false,
      "welcomeMsgEmoji": "6038e58234b5352faa7773b0",
      "querySuggestionsLimit": 2,
      "liveSearchResultsLimit": 4
    }
  };
  inputBox1: boolean;
  inputBox2: boolean = false;
  placeholBox: boolean = false;
  buttonFill: boolean = false;
  buttonBorder: boolean = false;
  buttonTextColor: boolean = false;
  msgColor: boolean = false;
  searchIcon: any = 'assets/images/search_gray.png';
  emojiIcon: any = 'assets/icons/search-experience/emoji.png';
  //search button disabled
  buttonDisabled: boolean = true;
  public color: string = '';
  public color1: string = '';
  public color2: string = '';
  public color3: string = '';
  public color4: string = '';
  public color5: string = '';
  public color6: string = '';
  statusModalPopRef: any = [];
  guideModalPopRef : any;
  userInfo: any = {};
  tourGuide: string;
  show_tab_color: boolean = false;
  show_tab_color1: boolean = false;
  show_tab_color2: boolean = false;
  toggle: boolean = false;
  minWidth: number = 200;
  width: number = this.minWidth;
  componentType: string = 'designing';
  subscription: Subscription;
  appSubscription : Subscription;
  tourData: any = [];
  @ViewChild('hiddenText') textEl: ElementRef;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild('guideModalPop') guideModalPop: KRModalComponent;
  constructor(private http: HttpClient, public workflowService: WorkflowService, private service: ServiceInvokerService, private authService: AuthService, private notificationService: NotificationService, private appSelectionService: AppSelectionService, public headerService: SideBarService) {
  }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.userInfo = this.authService.getUserInfo() || {};
    this.loadSearchExperience();
    this.appSubscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.loadSearchExperience();
    })
    this.subscription = this.appSelectionService.getTourConfigData.subscribe(res => {
      this.tourData = res;
      this.tourGuide = res.searchExperienceVisited ? '' : 'step1';
    })
  }

  loadSearchExperience() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.getSearchExperience();
    }
  }
  //dynamically increse input text 
  resize() {
    setTimeout(() => this.width = Math.max(this.minWidth, this.textEl.nativeElement.offsetWidth));
  }
  //upload search icon image manually from asset folder
  searchIconUpload() {
    let blob = null;
    let file;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.searchIcon);
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = () => {
      blob = xhr.response;//xhr.response is now a blob object
      file = new File([blob], 'searchIcon.png', { type: 'image/png', lastModified: Date.now() });
      this.searchIcon = file;
      this.selectIcon(file, 'searchIcon', 'manual')
    }
    xhr.send();
  }
  //upload emoji icon image manually from asset folder
  emojiIconUpload() {
    let blob = null;
    let file;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.emojiIcon);
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = () => {
      blob = xhr.response;//xhr.response is now a blob object
      file = new File([blob], 'emoji.png', { type: 'image/png', lastModified: Date.now() });
      this.searchIcon = file;
      this.selectIcon(file, 'emoji', 'manual')
    }
    xhr.send();
  }
  //sequential tabs method
  nextTab(type) {
    if (type === 'pre') {
      if (this.selectedTab === 'searchwidget') {
        this.show_tab_color = false;
        this.show_tab_color1 = true;
        this.selectedTab = 'experience';
      }
      else if (this.selectedTab === 'interactions') {
        this.show_tab_color1 = false;
        this.show_tab_color2 = true;
        this.selectedTab = 'searchwidget';
      }
    }
    else {
      if (this.selectedTab === 'experience') {
        this.show_tab_color = true;
        this.show_tab_color1 = false;
        this.selectedTab = 'searchwidget';
      }
      else if (this.selectedTab === 'searchwidget') {
        this.show_tab_color1 = true;
        this.show_tab_color2 = false;
        this.selectedTab = 'interactions';
      }
    }
  }
  // //change button placement
  // changeButtonPlacement(type) {
  //   this.searchObject.searchWidgetConfig.SearchBox = type;
  // }
  //based on show searches show slider
  changeSlider(type, data?) {
    this.suggestions = [];
    let queryValue = data === undefined ? type == 'bottom-up' ? 3 : 5 : this.searchObject.searchInteractionsConfig.querySuggestionsLimit;
    let recentValue = data === undefined ? type == 'bottom-up' ? 5 : 10 : this.searchObject.searchInteractionsConfig.liveSearchResultsLimit;
    if (type == 'bottom-up') {
      this.suggestions.push({ 'name': 'Query Suggestions', 'sliderObj': new RangeSlider(0, 3, 1, queryValue, 'suggestion') }, { 'name': 'Live Search Results', 'sliderObj': new RangeSlider(0, 5, 1, recentValue, 'live') });
      this.searchObject.searchInteractionsConfig.querySuggestionsLimit = data === undefined ? 3 : this.searchObject.searchInteractionsConfig.querySuggestionsLimit;
      this.searchObject.searchInteractionsConfig.liveSearchResultsLimit = data === undefined ? 5 : this.searchObject.searchInteractionsConfig.liveSearchResultsLimit;

    }
    else {
      this.suggestions.push({ 'name': 'Query Suggestions', 'sliderObj': new RangeSlider(0, 5, 1, queryValue, 'suggestion') }, { 'name': 'Live Search Results', 'sliderObj': new RangeSlider(0, 10, 1, recentValue, 'live') });
      this.searchObject.searchInteractionsConfig.querySuggestionsLimit = data === undefined ? 5 : this.searchObject.searchInteractionsConfig.querySuggestionsLimit;
      this.searchObject.searchInteractionsConfig.liveSearchResultsLimit = data === undefined ? 10 : this.searchObject.searchInteractionsConfig.liveSearchResultsLimit;
    }
  }
  //slider number method
  sliderNumber(number) {
    let dat = [0]
    let start = 0;
    for (let i = 1; i < number; i++) {
      start = start + (100 / number);
      dat.push(start)
    }
    return dat
  }
  //app-range slider method
  valueEvent(type, val) {
    if (type == 'Query Suggestions') {
      this.searchObject.searchInteractionsConfig.querySuggestionsLimit = val;
    }
    else {
      this.searchObject.searchInteractionsConfig.liveSearchResultsLimit = val;
    }
  }
  //select search Icon
  selectIcon(event, type, icon) {
    const file = icon === 'manual' ? event : event.target.files[0];
    const _ext = file.name.substring(file.name.lastIndexOf('.'));
    const formData = new FormData();
    formData.set('file', file);
    formData.set('fileContext', 'findly');
    formData.set('Content-Type', file.type);
    formData.set('fileExtension', _ext.replace('.', ''));
    this.fileupload(formData, type, icon);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        if (type == "searchIcon") {
          this.searchIcon = reader.result;
        }
        else {
          this.emojiIcon = reader.result;
        }
      }
      reader.readAsDataURL(file);
    }
  }
  //fileupload method
  fileupload(data, type, icon) {
    const quaryparms: any = {
      userId: this.userInfo.id
    };
    this.service.invoke('post.fileupload', quaryparms, data).subscribe(
      res => {
        if (type == 'searchIcon') {
          this.searchObject.searchWidgetConfig.searchBarIcon = res.fileId;
          if (this.searchObject.searchInteractionsConfig.welcomeMsgEmoji === '' && icon === 'manual') {
            this.emojiIconUpload();
          }
        }
        else if (type == 'emoji') {
          this.searchObject.searchInteractionsConfig.welcomeMsgEmoji = res.fileId;
          if (this.searchObject.searchWidgetConfig.searchBarIcon === '' && icon === 'manual') {
            this.searchIconUpload();
          }
        }
        if (icon === 'manual') {
          if (this.searchObject.searchWidgetConfig.searchBarIcon !== '' && this.searchObject.searchInteractionsConfig.welcomeMsgEmoji !== '') {
            this.addSearchExperience();
          }
        }
        this.notificationService.notify('File uploaded successfully', 'success');
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to upload file ', 'error');
        }
      }
    );
  }
  //on mouse hover in color pallete button
  onEventLog(type, event) {
    if (type == 'inputbox1') {
      this.searchObject.searchWidgetConfig.searchBarFillColor = event;
    }
    else if (type == 'inputbox2') {
      this.searchObject.searchWidgetConfig.searchBarBorderColor = event;
    }
    else if (type == 'placeholder') {
      this.searchObject.searchWidgetConfig.searchBarPlaceholderTextColor = event;
    }
    else if (type == 'placeholderText') {
      this.searchObject.searchWidgetConfig.searchBarPlaceholderText = event;
    }
    else if (type == 'buttonFill') {
      this.searchObject.searchWidgetConfig.buttonFillColor = event;
    }
    else if (type == 'buttonBorder') {
      this.searchObject.searchWidgetConfig.buttonBorderColor = event;
    }
    else if (type == "buttonEnable") {
      this.searchObject.searchWidgetConfig.searchButtonEnabled = event;
    }
    else if (type == 'buttonTextColor') {
      this.searchObject.searchWidgetConfig.buttonTextColor = event;
    }
    else if (type == 'msgColor') {
      this.searchObject.searchInteractionsConfig.welcomeMsgColor = event;
    }
  }
  //select search box widget
  selectSearchBox(type) {
    this.selectSearch = type;
  }
  //put tour config data
  updateTourConfig() {
    const appInfo: any = this.workflowService.selectedApp();
    const quaryparms: any = {
      streamId: appInfo._id
    };
    this.tourData.searchExperienceVisited = true;
    const payload = { "tourConfigurations": this.tourData };
    this.service.invoke('put.tourConfig', quaryparms, payload).subscribe(res => {
      //this.appSelectionService.updateTourConfig(this.componentType);
      this.notificationService.notify('Updated successfully', 'success');
      this.tourGuide = '';
    }, errRes => {
      console.log(errRes);
    });
  }
  //get default data
  getSearchExperience() {
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      indexPipelineId : this.indexPipelineId
    };
    this.service.invoke('get.searchexperience.list', quaryparms).subscribe(res => {
      console.log("search experience data", res);
      this.searchObject = { searchExperienceConfig: res.experienceConfig, searchWidgetConfig: res.widgetConfig, searchInteractionsConfig: res.interactionsConfig }
      if (this.searchObject.searchWidgetConfig.searchBarIcon !== '') {
        this.searchIcon = this.searchObject.searchWidgetConfig.searchBarIcon;
      }
      if (this.searchObject.searchInteractionsConfig.welcomeMsgEmoji !== '') {
        this.emojiIcon = this.searchObject.searchInteractionsConfig.welcomeMsgEmoji;
      }
      this.changeSlider(this.searchObject.searchInteractionsConfig.showSearches, this.searchObject.searchInteractionsConfig);
    }, errRes => {
      console.log(errRes);
    });
  }
  //submit search page form
  saveSearchExperience() {
    if (this.searchObject.searchWidgetConfig.searchBarIcon === '') {
      this.searchIconUpload();
    }
    // if (this.searchObject.searchInteractionsConfig.welcomeMsgEmoji === '') {
    //   this.emojiIconUpload();
    // }
    if (this.searchObject.searchWidgetConfig.searchBarIcon !== '' && this.searchObject.searchInteractionsConfig.welcomeMsgEmoji !== '') {
      // delete this.searchObject.searchWidgetConfig.searchBarIcon;
      // delete this.searchObject.searchInteractionsConfig.welcomeMsgEmoji;
      this.addSearchExperience()
    }
  }
  //based on searchicon and emoji send data method
  addSearchExperience() {
    this.show_tab_color2 = true;
    let obj = { "experienceConfig": this.searchObject.searchExperienceConfig, "widgetConfig": this.searchObject.searchWidgetConfig, "interactionsConfig": this.searchObject.searchInteractionsConfig };
    console.log("obj", obj);
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      indexPipelineId : this.indexPipelineId
    };
    this.service.invoke('put.searchexperience', quaryparms, obj).subscribe(res => {
      console.log("test res", res);
      this.searchIcon = res.widgetConfig.searchBarIcon;
      this.headerService.closeSdk();
      this.headerService.updateSearchConfiguration();
      this.appSelectionService.updateTourConfig(this.componentType);
      this.notificationService.notify('Updated successfully', 'success');
      this.statusModalPopRef = this.statusModalPop.open();
      this.workflowService.checkTopOrBottom(this.searchObject.searchExperienceConfig.searchBarPosition);
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  //close preview popup
  closePreviewPopup() {
    if (this.statusModalPopRef && this.statusModalPopRef.close) {
      this.statusModalPopRef = this.statusModalPopRef.close();
    }
  }

  openSearchInterfaceGuide(){
    this.guideModalPopRef = this.guideModalPop.open();
  }

  closeGuidePopup() {
    if (this.guideModalPopRef && this.guideModalPopRef.close) {
      this.guideModalPopRef = this.guideModalPopRef.close();
    }
  }

  
  ngOnDestroy() {
    this.appSubscription ? this.appSubscription.unsubscribe() : false;
    this.subscription ? this.subscription.unsubscribe() : false;
  }
}
