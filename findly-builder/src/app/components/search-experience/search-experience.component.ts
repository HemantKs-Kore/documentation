import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { RangeSlider } from '../../helpers/models/range-slider.model';
import { WorkflowService } from '@kore.services/workflow.service';
import { AuthService } from '@kore.services/auth.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '../../services/notification.service';
import { JoyrideService } from "ngx-joyride";
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
  suggestions: any = [];
  searchObject: any = {
    "searchExperienceConfig": {
      "searchBarPosition": "bottom"
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
      "searchBarIcon": "6038e58234b5352faa7773b0"
    },
    "searchInteractionsConfig": {
      "feedbackExperience": { resultLevel: true, queryLevel: false },
      "welcomeMsg": "Hi, How can I help you",
      "welcomeMsgMsgColor": "#000080",
      "showSearchesEnabled": false,
      "showSearches": "frequent",
      "autocompleteOpt": false,
      "welcomeMsgEmoji": "6038e58234b5352faa7773b0",
      "querySuggestionsLimit": 2,
      "liveSearchResultsLimit": 4
    }
  };
  inputBox1: boolean = false;
  inputBox2: boolean = false;
  placeholBox: boolean = false;
  buttonFill: boolean = false;
  buttonBorder: boolean = false;
  buttonTextColor: boolean = false;
  msgColor: boolean = false;
  searchIcon: any = 'assets/icons/search_gray.svg';
  //search button disabled
  buttonDisabled: boolean = true;
  public color: string = '#2889e9';
  statusModalPopRef: any = [];
  userInfo: any = {};
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  constructor(public workflowService: WorkflowService, private service: ServiceInvokerService, private authService: AuthService, private notificationService: NotificationService, private joyride: JoyrideService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.userInfo = this.authService.getUserInfo() || {};
    this.getSearchExperience();
  }
  //guide tour in searchwidget
  tour() {
    console.log("tour dtarted")
    this.joyride.startTour({
      steps: ["firstStep", "secondStep", 'thirdStep', 'fourthStep'],
      showPrevButton: true,
      themeColor: "blue"
    });
  }
  //sequential tabs method
  nextTab(type) {
    if (type === 'pre') {
      if (this.selectedTab === 'searchwidget') {
        this.selectedTab = 'experience';
      }
      else if (this.selectedTab === 'interactions') {
        //this.tour();
        this.selectedTab = 'searchwidget';
      }
    }
    else {
      if (this.selectedTab === 'experience') {
        // this.tour();
        this.selectedTab = 'searchwidget';
      }
      else if (this.selectedTab === 'searchwidget') {
        this.selectedTab = 'interactions';
      }
    }
  }
  //based on show searches show slider
  changeSlider(type, data?) {
    this.suggestions = [];
    let queryValue = data === undefined ? 0 : this.searchObject.searchInteractionsConfig.querySuggestionsLimit;
    let recentValue = data === undefined ? 0 : this.searchObject.searchInteractionsConfig.liveSearchResultsLimit;
    if (type == 'frequent') {
      // let queryNumber = this.sliderNumber(3);
      // let liveNumber = this.sliderNumber(5);
      this.suggestions.push({ 'name': 'Query Suggestions', 'sliderObj': new RangeSlider(0, 3, 1, queryValue, 'suggestion') }, { 'name': 'Live Search Results', 'sliderObj': new RangeSlider(0, 5, 1, recentValue, 'live') });
    }
    else {
      this.suggestions.push({ 'name': 'Query Suggestions', 'sliderObj': new RangeSlider(0, 5, 1, queryValue, 'suggestion') }, { 'name': 'Live Search Results', 'sliderObj': new RangeSlider(0, 10, 1, recentValue, 'live') })
    }
    console.log("suggestions", this.suggestions)
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
  selectIcon(event, type) {
    const file = event.target.files[0];
    const _ext = file.name.substring(file.name.lastIndexOf('.'));
    const formData = new FormData();
    formData.set('file', file);
    formData.set('fileContext', 'findly');
    formData.set('Content-Type', file.type);
    formData.set('fileExtension', _ext.replace('.', ''));
    this.fileupload(formData, type);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = e => this.searchIcon = reader.result;
      reader.readAsDataURL(file);
    }
  }
  //fileupload method
  fileupload(data, type) {
    const quaryparms: any = {
      userId: this.userInfo.id
    };
    this.service.invoke('post.fileupload', quaryparms, data).subscribe(
      res => {
        if (type == 'searchIcon') {
          this.searchObject.searchWidgetConfig.searchBarIcon = res.fileId;
        }
        else if (type == 'emoji') {
          this.searchObject.searchInteractionsConfig.welcomeMsgEmoji = res.fileId;
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
      this.inputBox1 = !this.inputBox1;
      this.searchObject.searchWidgetConfig.searchBarFillColor = event;
    }
    else if (type == 'inputbox2') {
      this.inputBox2 = !this.inputBox2;
      this.searchObject.searchWidgetConfig.searchBarBorderColor = event;
    }
    else if (type == 'placeholder') {
      this.placeholBox = !this.placeholBox;
      this.searchObject.searchWidgetConfig.searchBarPlaceholderTextColor = event;
    }
    else if (type == 'placeholderText') {
      this.searchObject.searchWidgetConfig.searchBarPlaceholderText = event;
    }
    else if (type == 'buttonFill') {
      this.buttonFill = !this.buttonFill;
      this.searchObject.searchWidgetConfig.buttonFillColor = event;
    }
    else if (type == 'buttonBorder') {
      this.buttonBorder = !this.buttonBorder;
      this.searchObject.searchWidgetConfig.buttonBorderColor = event;
    }
    else if (type == "buttonEnable") {
      this.searchObject.searchWidgetConfig.searchButtonEnabled = event;
    }
    else if (type == 'buttonTextColor') {
      this.buttonTextColor = !this.buttonTextColor;
      this.searchObject.searchWidgetConfig.buttonTextColor = event;
    }
    else if (type == 'msgColor') {
      this.msgColor = !this.msgColor;
      this.searchObject.searchInteractionsConfig.welcomeMsgMsgColor = event;
    }
  }

  //select search box widget
  testcolor;
  selectSearchBox(type) {
    this.selectSearch = type;
  }
  //get default data
  getSearchExperience() {
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex
    };
    this.service.invoke('get.searchexperience.list', quaryparms).subscribe(res => {
      console.log("search experience data", res);
      this.searchObject = { searchExperienceConfig: res.experienceConfig, searchWidgetConfig: res.widgetConfig, searchInteractionsConfig: res.interactionsConfig }
      this.changeSlider(this.searchObject.searchInteractionsConfig.showSearches, this.searchObject.searchInteractionsConfig);
    }, errRes => {
      console.log(errRes);
    });
  }
  //submit search page form
  saveSearchExperience() {
    let obj = { "experienceConfig": this.searchObject.searchExperienceConfig, "widgetConfig": this.searchObject.searchWidgetConfig, "interactionsConfig": this.searchObject.searchInteractionsConfig };
    console.log("obj", obj);
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex
    };
    this.service.invoke('put.searchexperience', quaryparms, obj).subscribe(res => {
      console.log("search experience saved data", res);
      this.notificationService.notify('Updated successfully', 'success');
      this.statusModalPopRef = this.statusModalPop.open();
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
}
