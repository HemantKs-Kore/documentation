import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-search-experience',
  templateUrl: './search-experience.component.html',
  styleUrls: ['./search-experience.component.scss']
})
export class SearchExperienceComponent implements OnInit {
  selectedTab: string = 'searchwidget';
  selectSearch: string;
  searchObject: any =
    {
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
        "welcomeMsg": "Hi, How can I help you",
        "welcomeMsgMsgColor": "#000080",
        "showSearchesEnabled": false,
        "showSearches": "frequent",
        "autocompleteOpt": false,
        "welcomeMsgEmoji": "6038e58234b5352faa7773b0",
        "querySuggestionsLimit": 5,
        "liveSearchResultsLimit": 10
      }
    }

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
  constructor() { }

  ngOnInit(): void {
  }
  //sequential tabs method
  nextTab(type) {
    if (type === 'pre') {
      if (this.selectedTab === 'searchwidget') {
        this.selectedTab = 'experience';
      }
      else if (this.selectedTab === 'interactions') {
        this.selectedTab = 'searchwidget';
      }
    }
    else {
      if (this.selectedTab === 'experience') {
        this.selectedTab = 'searchwidget';
      }
      else if (this.selectedTab === 'searchwidget') {
        this.selectedTab = 'interactions';
      }
    }
  }
  //select search Icon
  selectIcon(event) {
    console.log("event", event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.searchIcon = reader.result;
      reader.readAsDataURL(file);
    }
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
      this.searchObject.searchWidgetConfig.welcomeMsgMsgColor = event;
    }
  }

  //select search box widget
  testcolor;
  selectSearchBox(type) {
    this.selectSearch = type;
  }
  // //fetch color code 
  // public onEventLog(event: string, data: any): void {
  //   console.log(event, data);
  // }
  //submit search page form
  saveSearchExperience() {
    console.log("this.searchObject", this.searchObject)
  }
}
