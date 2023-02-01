import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { RangeSlider } from '../../helpers/models/range-slider.model';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { LocalStoreService } from './../../services/localstore.service';
import { NgbDropdown, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { SideBarService } from '@kore.apps/services/header.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { InlineManualService } from '@kore.apps/services/inline-manual.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { MixpanelServiceService } from '@kore.apps/services/mixpanel-service.service';
import { AuthService } from '@kore.apps/services/auth.service';
declare const $: any;
@Component({
  selector: 'app-search-experience',
  templateUrl: './search-experience.component.html',
  styleUrls: ['./search-experience.component.scss'],
})
export class SearchExperienceComponent implements OnInit, OnDestroy {
  selectedTab = 'experience';
  selectSearch: string;
  selectedApp: any = {};
  serachIndexId: any;
  indexPipelineId: any;
  queryPipelineId: any;
  suggestions: any = [];
  searchObject: any = {
    searchExperienceConfig: {
      searchBarPosition: '',
    },
    searchWidgetConfig: {
      searchBarFillColor: '#FFFFFF',
      searchBarBorderColor: '#E4E5E7',
      searchBarPlaceholderText: 'Search',
      searchBarPlaceholderTextColor: '#BDC1C6',
      searchButtonEnabled: false,
      buttonText: 'Button',
      buttonTextColor: '#BDC1C6',
      buttonFillColor: '#EFF0F1',
      buttonBorderColor: '#EFF0F1',
      searchBarIcon: '6038e58234b5352faa7773b0',
      userSelectedColors: [],
      buttonPlacementPosition: 'inside',
    },
    searchInteractionsConfig: {
      feedbackExperience: { queryLevel: false },
      welcomeMsg: 'Hi, How can I help you',
      welcomeMsgColor: '#000080',
      welcomeMsgFillColor: '#EFF0F1',
      showSearchesEnabled: false,
      showSearches: 'frequent',
      autocompleteOpt: false,
      querySuggestionsLimit: 2,
      liveSearchResultsLimit: 4,
      defaultStatus: 'searchBar',
    },
  };
  inputBox1 = false;
  inputBox2 = false;
  placeholBox = false;
  buttonFill = false;
  buttonBorder = false;
  buttonTextColor = false;
  msgColor = false;
  bgColor = false;
  toggle = false;
  toggle1 = false;
  toggle2 = false;
  toggle3 = false;
  toggle4 = false;
  toggle5 = false;
  toggle6 = false;
  toggle7 = false;
  searchIcon: any = 'assets/images/search_gray.png';
  emojiIcon: any = 'assets/icons/search-experience/emojis/hand.png';
  //search button disabled
  buttonDisabled = true;
  public color = '';
  public color1 = '';
  public color2 = '';
  public color3 = '';
  public color4 = '';
  public color5 = '';
  public color6 = '';
  public color7 = '';
  statusModalPopRef: any = [];
  guideModalPopRef: any;
  userInfo: any = {};
  tourGuide: string;
  show_tab_color = false;
  show_tab_color1 = false;
  show_tab_color2 = false;
  show_tab_color3 = false;
  minWidth = 200;
  width: number = this.minWidth;
  componentType = 'designing';
  subscription: Subscription;
  appSubscription: Subscription;
  queryConfigsSubscription: Subscription;
  tourData: any = [];
  userName: any = '';
  selectedColor = '';
  greeting_msg_index: number;
  configEmoji = {
    categories: {
      people: 'People',
    },
    skintones: {
      1: 'Default Skin Tone',
      2: 'Light Skin Tone',
      3: 'Medium-Light Skin Tone',
      4: 'Medium Skin Tone',
      5: 'Medium-Dark Skin Tone',
      6: 'Dark Skin Tone',
    },
  };

  submitted = false;
  searchSDKSubscription: Subscription;
  @ViewChild('hiddenText') textEl: ElementRef;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild('guideModalPop') guideModalPop: KRModalComponent;
  @ViewChild(NgbDropdownMenu) avatarDropdown: NgbDropdownMenu;
  constructor(
    private http: HttpClient,
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public headerService: SideBarService,
    public localstore: LocalStoreService,
    public inlineManual: InlineManualService,
    public mixpanel: MixpanelServiceService
  ) {}

  ngOnInit(): void {
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.userInfo = this.authService.getUserInfo() || {};
    this.loadSearchExperience();
    // this.appSubscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
    //   this.loadSearchExperience();
    // })
    this.queryConfigsSubscription =
      this.appSelectionService.queryConfigSelected.subscribe((res) => {
        /**
         * res.length > 1 - its only query Details
         *  res.length == 1- its from Index pipeline and then to query Details.
         * **/
        this.indexPipelineId = this.workflowService.selectedIndexPipeline();
        this.queryPipelineId = this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '';
        this.getSearchExperience();
      });
    this.subscription = this.appSelectionService.getTourConfigData.subscribe(
      (res) => {
        this.tourData = res;
        //this.tourGuide = res.searchExperienceVisited ? '' : 'step1';
      }
    );
    this.userName = this.localstore.getAuthInfo()
      ? this.localstore.getAuthInfo().currentAccount.userInfo.fName
      : '';
    this.searchSDKSubscription =
      this.headerService.openSearchSDKFromHeader.subscribe((res: any) => {
        if (res) {
          this.closeAllBoxs('all');
        }
      });
  }
  //validate max length in textarea
  testInputLength(event) {
    if (event.value.length > 150) {
      event.value = event.value.substring(0, 150);
    }
  }
  //select tab on number
  selectTab(type) {
    if (this.selectedTab === 'searchwidget') {
      this.show_tab_color1 = true;
    } else if (this.selectedTab === 'interactions') {
      this.show_tab_color2 = true;
      //this.changeSlider('bottom');
    } else if (this.selectedTab === 'experience') {
      this.show_tab_color = true;
    } else if (this.selectedTab === 'feedback') {
      this.show_tab_color3 = true;
    }
    this.selectedTab = type;
    if (this.selectedTab === 'searchwidget') {
      this.show_tab_color1 = false;
    } else if (this.selectedTab === 'interactions') {
      this.show_tab_color2 = false;
    } else if (this.selectedTab === 'experience') {
      this.show_tab_color = false;
    } else if (this.selectedTab === 'feedback') {
      this.show_tab_color3 = false;
    }
  }
  closeAllBoxs(type) {
    if (type == 'all') {
      this.inputBox1 = false;
      this.inputBox2 = false;
      this.placeholBox = false;
      this.buttonFill = false;
      this.buttonBorder = false;
      this.buttonTextColor = false;
      this.msgColor = false;
      this.toggle = false;
      this.toggle1 = false;
      this.toggle2 = false;
      this.toggle3 = false;
      this.toggle4 = false;
      this.toggle5 = false;
      this.toggle6 = false;
    }
    if (type == 'toggle') {
      this.toggle1 = false;
      this.inputBox2 = false;
    }
    if (type == 'toggle3') {
      this.toggle4 = false;
      this.toggle5 = false;
      this.buttonFill = false;
      this.buttonBorder = false;
    }
    if (type == 'toggle4') {
      this.toggle3 = false;
      this.toggle5 = false;
      this.buttonTextColor = false;
      this.buttonBorder = false;
    }
    if (type == 'toggle5') {
      this.toggle3 = false;
      this.toggle4 = false;
      this.buttonFill = false;
      this.buttonTextColor = false;
    }
    if (type == 'toggle6') {
      this.toggle7 = false;
      this.bgColor = false;
    }
    if (type == 'toggle7') {
      this.toggle6 = false;
      this.msgColor = false;
    }
  }
  loadSearchExperience() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.queryPipelineId = this.workflowService.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()._id
        : this.selectedApp.searchIndexes[0].queryPipelineId;
      if (this.queryPipelineId) {
        this.getSearchExperience();
      }
    }
  }
  //dynamically increse input text
  resize() {
    this.width =
      Math.max(this.minWidth, this.textEl.nativeElement.offsetWidth) + 57;
  }
  //upload search icon image manually from asset folder
  searchIconUpload() {
    let blob = null;
    let file;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.searchIcon);
    xhr.responseType = 'blob'; //force the HTTP response, response-type header to be blob
    xhr.onload = () => {
      blob = xhr.response; //xhr.response is now a blob object
      file = new File([blob], 'searchIcon.png', {
        type: 'image/png',
        lastModified: Date.now(),
      });
      this.searchIcon = file;
      this.selectIcon(file, 'searchIcon', 'manual');
    };
    xhr.send();
  }
  //upload emoji icon image manually from asset folder
  emojiIconUpload(update?) {
    let blob = null;
    let file;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.emojiIcon);
    xhr.responseType = 'blob'; //force the HTTP response, response-type header to be blob
    xhr.onload = () => {
      blob = xhr.response; //xhr.response is now a blob object
      file = new File([blob], 'emoji.png', {
        type: 'image/png',
        lastModified: Date.now(),
      });
      this.emojiIcon = file;
      this.selectIcon(file, 'emoji', 'manual', update ? update : null);
    };
    xhr.send();
  }
  //find index based on keyup or click in input textarea
  findIndex(event) {
    this.greeting_msg_index = event.target.selectionStart;
  }
  //filter emojis
  filterEmojis(data) {
    return !['263A-FE0F', '1F972', '1F978'].includes(data) && data.length <= 5;
  }
  //add emoji based on selection
  addEmoji(event) {
    const emoji = event.emoji.native;
    if (this.searchObject.searchInteractionsConfig.welcomeMsg.length <= 58) {
      if (this.greeting_msg_index) {
        this.searchObject.searchInteractionsConfig.welcomeMsg = [
          this.searchObject.searchInteractionsConfig.welcomeMsg.slice(
            0,
            this.greeting_msg_index
          ),
          emoji,
          this.searchObject.searchInteractionsConfig.welcomeMsg.slice(
            this.greeting_msg_index
          ),
        ].join('');
      } else {
        this.searchObject.searchInteractionsConfig.welcomeMsg =
          this.searchObject.searchInteractionsConfig.welcomeMsg + emoji;
      }
    }
  }
  //sequential tabs method
  nextTab(type) {
    this.submitted = false;
    if (type === 'pre') {
      if (this.selectedTab === 'searchwidget') {
        this.show_tab_color = false;
        this.show_tab_color1 = true;
        this.selectedTab = 'experience';
      } else if (this.selectedTab === 'interactions') {
        this.show_tab_color1 = false;
        this.show_tab_color2 = true;
        this.selectedTab = 'searchwidget';
      } else if (this.selectedTab === 'feedback') {
        this.show_tab_color3 = false;
        this.show_tab_color2 = true;
        this.selectedTab = 'interactions';
      }
    } else {
      if (this.selectedTab === 'experience') {
        this.show_tab_color = true;
        this.show_tab_color1 = false;
        this.selectedTab = 'searchwidget';
      } else if (this.selectedTab === 'searchwidget') {
        this.submitted = true;
        if (this.validateSearchWidget()) {
          this.show_tab_color1 = true;
          this.show_tab_color2 = false;
          this.selectedTab = 'interactions';
        } else {
          this.notificationService.notify(
            'Enter the required fields to proceed',
            'error'
          );
        }
      } else if (this.selectedTab === 'interactions') {
        this.show_tab_color2 = true;
        this.show_tab_color3 = false;
        this.selectedTab = 'feedback';
      }
    }
  }

  validateSearchWidget() {
    if (
      this.searchObject.searchWidgetConfig.searchButtonEnabled &&
      this.searchObject.searchWidgetConfig.buttonText.length
    ) {
      return true;
    } else if (
      this.searchObject.searchWidgetConfig.searchButtonEnabled &&
      !this.searchObject.searchWidgetConfig.buttonText.length
    ) {
      return false;
    } else {
      return true;
    }
  }
  // //change button placement
  // changeButtonPlacement(type) {
  //   this.searchObject.searchWidgetConfig.SearchBox = type;
  // }
  //based on show searches show slider
  changeSlider(type, data?) {
    this.suggestions = [];
    const queryValue =
      data === undefined
        ? type == 'bottom'
          ? 3
          : 5
        : this.searchObject.searchInteractionsConfig.querySuggestionsLimit;
    const recentValue =
      data === undefined
        ? type == 'bottom'
          ? 0
          : 10
        : this.searchObject.searchInteractionsConfig.liveSearchResultsLimit;
    if (type == 'bottom') {
      this.suggestions.push(
        {
          name: 'Query Suggestions',
          sliderObj: new RangeSlider(
            0,
            3,
            1,
            queryValue,
            'suggestion',
            'bottom-up-suggestion'
          ),
        },
        {
          name: 'Live Search Results',
          sliderObj: new RangeSlider(
            0,
            5,
            1,
            recentValue,
            'live',
            'bottom-up-live'
          ),
        }
      );
      this.searchObject.searchInteractionsConfig.querySuggestionsLimit =
        data === undefined
          ? 3
          : this.searchObject.searchInteractionsConfig.querySuggestionsLimit;
      this.searchObject.searchInteractionsConfig.liveSearchResultsLimit =
        data === undefined
          ? 0
          : this.searchObject.searchInteractionsConfig.liveSearchResultsLimit;
      if (
        this.searchObject.searchInteractionsConfig.defaultStatus === undefined
      ) {
        this.searchObject.searchInteractionsConfig.defaultStatus = 'searchBar';
      }
      this.mixpanel.postEvent('Search Interface - Experience - Top Down', {});
    } else {
      this.suggestions.push(
        {
          name: 'Query Suggestions',
          sliderObj: new RangeSlider(
            0,
            5,
            1,
            queryValue,
            'suggestion',
            'top-down-suggestion'
          ),
        },
        {
          name: 'Live Search Results',
          sliderObj: new RangeSlider(
            0,
            10,
            1,
            recentValue,
            'live',
            'top-down-live'
          ),
        }
      );
      this.searchObject.searchInteractionsConfig.querySuggestionsLimit =
        data === undefined
          ? 5
          : this.searchObject.searchInteractionsConfig.querySuggestionsLimit;
      this.searchObject.searchInteractionsConfig.liveSearchResultsLimit =
        data === undefined
          ? 10
          : this.searchObject.searchInteractionsConfig.liveSearchResultsLimit;
      this.mixpanel.postEvent('Search Interface - Experience - Bottom Up', {});
    }
  }
  //slider number method
  sliderNumber(number) {
    const dat = [0];
    let start = 0;
    for (let i = 1; i < number; i++) {
      start = start + 100 / number;
      dat.push(start);
    }
    return dat;
  }
  //app-range slider method
  valueEvent(type, val) {
    if (type == 'Query Suggestions') {
      this.searchObject.searchInteractionsConfig.querySuggestionsLimit = val;
      this.suggestions[0].sliderObj.default = val;
    } else {
      this.searchObject.searchInteractionsConfig.liveSearchResultsLimit = val;
      this.suggestions[1].sliderObj.default = val;
    }
  }

  // valueEvent(type, val) {
  //   if (type == 'Query Suggestions') {
  //     this.searchObject.searchInteractionsConfig.querySuggestionsLimit = val;
  //   }
  //   else {
  //     this.searchObject.searchInteractionsConfig.liveSearchResultsLimit = val;
  //   }
  // }
  //select search Icon
  selectIcon(event, type, icon, update?) {
    const file = icon === 'manual' ? event : event.target.files[0];
    if (file.size < 5000) {
      const _ext = file.name.substring(file.name.lastIndexOf('.'));
      const formData = new FormData();
      formData.set('file', file);
      formData.set('fileContext', 'findly');
      formData.set('Content-Type', file.type);
      formData.set('fileExtension', _ext.replace('.', ''));
      this.fileupload(formData, type, icon, update ? update : null);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type == 'searchIcon') {
            this.searchIcon = reader.result;
          } else {
            this.emojiIcon = reader.result;
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      this.notificationService.notify('Upload file size below 5KB', 'error');
    }
  }
  //fileupload method
  fileupload(data, type, icon, update?) {
    const quaryparms: any = {
      userId: this.userInfo.id,
    };
    this.service.invoke('post.fileupload', quaryparms, data).subscribe(
      (res) => {
        if (type == 'searchIcon') {
          this.searchObject.searchWidgetConfig.searchBarIcon = res.fileId;
          this.selectSearchBox('');
          // if (this.searchObject.searchInteractionsConfig.welcomeMsgEmoji === '' && icon === 'manual') {
          //   this.emojiIconUpload();
          // }
        } else if (type == 'emoji') {
          // this.searchObject.searchInteractionsConfig.welcomeMsgEmoji = res.fileId;
          if (
            this.searchObject.searchWidgetConfig.searchBarIcon === '' &&
            icon === 'manual'
          ) {
            this.searchIconUpload();
          }
        }
        if (icon === 'manual' && !update) {
          if (this.searchObject.searchWidgetConfig.searchBarIcon !== '') {
            this.addSearchExperience();
          }
        }
        if (icon == 'auto' || update) {
          this.selectSearch = '';
          this.notificationService.notify(
            'File uploaded successfully',
            'success'
          );
        }
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to upload file ', 'error');
        }
      }
    );
  }
  //apply text based on input change
  onEventLog(type, text) {
    if (type == 'placeholderText') {
      this.searchObject.searchWidgetConfig.searchBarPlaceholderText = text;
    }
  }
  //apply color based on save button
  applyColor(type, save) {
    if (this.selectedColor != '') {
      if (save) {
        this.saveColor(this.selectedColor);
      }
      if (type == 'inputbox1') {
        this.searchObject.searchWidgetConfig.searchBarFillColor =
          this.selectedColor;
        this.toggle = false;
        this.inputBox1 = false;
      } else if (type == 'inputbox2') {
        this.searchObject.searchWidgetConfig.searchBarBorderColor =
          this.selectedColor;
        this.toggle1 = false;
        this.inputBox2 = false;
      } else if (type == 'placeholder') {
        this.searchObject.searchWidgetConfig.searchBarPlaceholderTextColor =
          this.selectedColor;
        this.toggle2 = false;
        this.placeholBox = false;
      } else if (type == 'buttonFill') {
        this.searchObject.searchWidgetConfig.buttonFillColor =
          this.selectedColor;
        this.toggle4 = false;
        this.buttonFill = false;
      } else if (type == 'buttonBorder') {
        this.searchObject.searchWidgetConfig.buttonBorderColor =
          this.selectedColor;
        this.toggle5 = false;
        this.buttonBorder = false;
      } else if (type == 'buttonEnable') {
        this.searchObject.searchWidgetConfig.searchButtonEnabled =
          this.selectedColor;
      } else if (type == 'buttonTextColor') {
        this.searchObject.searchWidgetConfig.buttonTextColor =
          this.selectedColor;
        this.toggle3 = false;
        this.buttonTextColor = false;
      } else if (type == 'msgColor') {
        this.searchObject.searchInteractionsConfig.welcomeMsgColor =
          this.selectedColor;
        this.toggle6 = false;
        this.msgColor = false;
      } else if (type == 'bgColor') {
        this.searchObject.searchInteractionsConfig.welcomeMsgFillColor =
          this.selectedColor;
        this.toggle7 = false;
        this.bgColor = false;
      }
      this.selectedColor = '';
    }
  }
  //close color pallet box
  closeColorPallete(type) {
    if (type == 'inputbox1') {
      this.toggle = false;
      this.inputBox1 = false;
      this.color = this.searchObject.searchWidgetConfig.searchBarFillColor;
    } else if (type == 'inputBox2') {
      this.toggle1 = false;
      this.inputBox2 = false;
      this.color1 = this.searchObject.searchWidgetConfig.searchBarBorderColor;
    } else if (type == 'placeholBox') {
      this.toggle2 = false;
      this.placeholBox = false;
      this.color2 =
        this.searchObject.searchWidgetConfig.searchBarPlaceholderTextColor;
    } else if (type == 'buttonFill') {
      this.toggle4 = false;
      this.buttonFill = false;
      this.color4 = this.searchObject.searchWidgetConfig.buttonFillColor;
    } else if (type == 'buttonTextColor') {
      this.toggle3 = false;
      this.buttonTextColor = false;
      this.color3 = this.searchObject.searchWidgetConfig.buttonTextColor;
    } else if (type == 'buttonBorder') {
      this.toggle5 = false;
      this.buttonBorder = false;
      this.color5 = this.searchObject.searchWidgetConfig.buttonBorderColor;
    } else if (type == 'msgColor') {
      this.toggle6 = false;
      this.msgColor = false;
      this.color6 = this.searchObject.searchInteractionsConfig.welcomeMsgColor;
    } else if (type == 'bgColor') {
      this.toggle7 = false;
      this.bgColor = false;
      this.color7 =
        this.searchObject.searchInteractionsConfig.welcomeMsgFillColor;
    }
  }
  //select search box widget
  selectSearchBox(type) {
    this.selectSearch = type;
  }
  checkColorPallets(event?) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      this.closeAllColourPallets();
    }
  }
  closeAllColourPallets() {
    this.inputBox1 = false;

    this.toggle1 = false;
    this.inputBox2 = false;
    this.toggle2 = false;
    this.placeholBox = false;
    this.buttonFill = false;
    this.buttonTextColor = false;
    this.buttonBorder = false;
    this.toggle3 = false;
    this.toggle4 = false;
    this.toggle5 = false;
    this.toggle6 = false;
    this.msgColor = false;
    this.bgColor = false;
    this.toggle7 = false;

    this.color = this.searchObject.searchWidgetConfig.searchBarFillColor;
    this.color1 = this.searchObject.searchWidgetConfig.searchBarBorderColor;
    this.color2 =
      this.searchObject.searchWidgetConfig.searchBarPlaceholderTextColor;
    this.color3 = this.searchObject.searchWidgetConfig.buttonTextColor;
    this.color4 = this.searchObject.searchWidgetConfig.buttonFillColor;
    this.color5 = this.searchObject.searchWidgetConfig.buttonBorderColor;
    this.color6 = this.searchObject.searchInteractionsConfig.welcomeMsgColor;
    this.color7 =
      this.searchObject.searchInteractionsConfig.welcomeMsgFillColor;
    setTimeout(() => {
      this.toggle = false;
    }, 100);
  }
  //get default data
  getSearchExperience() {
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
    };
    this.service.invoke('get.searchexperience.list', quaryparms).subscribe(
      (res) => {
        this.searchObject = {
          searchExperienceConfig: res.experienceConfig,
          searchWidgetConfig: res.widgetConfig,
          searchInteractionsConfig: res.interactionsConfig,
        };
        if (this.searchObject.searchWidgetConfig.searchBarIcon !== '') {
          this.searchIcon = this.searchObject.searchWidgetConfig.searchBarIcon;
        }
        // if (this.searchObject.searchInteractionsConfig.welcomeMsgEmoji !== '') {
        //   this.emojiIcon = this.searchObject.searchInteractionsConfig.welcomeMsgEmoji;
        // }
        const fetchInputWidth = document.createElement('span');
        document.body.appendChild(fetchInputWidth);
        fetchInputWidth.innerText =
          this.searchObject.searchWidgetConfig.searchBarPlaceholderText;
        this.width = fetchInputWidth.offsetWidth + 57;
        fetchInputWidth.remove();
        this.changeSlider(
          this.searchObject.searchExperienceConfig.searchBarPosition,
          this.searchObject.searchInteractionsConfig
        );
        this.color = this.searchObject.searchWidgetConfig.searchBarFillColor;
        this.color1 = this.searchObject.searchWidgetConfig.searchBarBorderColor;
        this.color2 =
          this.searchObject.searchWidgetConfig.searchBarPlaceholderTextColor;
        this.color3 = this.searchObject.searchWidgetConfig.buttonTextColor;
        this.color4 = this.searchObject.searchWidgetConfig.buttonFillColor;
        this.color5 = this.searchObject.searchWidgetConfig.buttonBorderColor;
        this.color6 =
          this.searchObject.searchInteractionsConfig.welcomeMsgColor;
        this.color7 =
          this.searchObject.searchInteractionsConfig?.welcomeMsgFillColor;
        if (!this.inlineManual.checkVisibility('SEARCH_INTERFACE')) {
          this.inlineManual.openHelp('SEARCH_INTERFACE');
          this.inlineManual.visited('SEARCH_INTERFACE');
        }
      },
      (errRes) => {
        console.log(errRes);
      }
    );
  }
  //save color method
  saveColor(color) {
    const exist = this.searchObject.searchWidgetConfig.userSelectedColors.some(
      (data) => data == color
    );
    if (!exist) {
      this.searchObject.searchWidgetConfig.userSelectedColors.push(color);
    }
  }
  //submit search page form
  saveSearchExperience() {
    if (this.searchObject.searchWidgetConfig.searchBarIcon === '') {
      this.searchIconUpload();
    }
    // if (this.searchObject.searchInteractionsConfig.welcomeMsgEmoji === '') {
    //   this.emojiIconUpload();
    // }
    if (
      this.searchObject.searchWidgetConfig.searchBarIcon !== '' &&
      this.searchObject.searchInteractionsConfig.welcomeMsgEmoji !== ''
    ) {
      // delete this.searchObject.searchWidgetConfig.searchBarIcon;
      // delete this.searchObject.searchInteractionsConfig.welcomeMsgEmoji;
      this.addSearchExperience();
    }
  }
  //based on searchicon and emoji send data method
  addSearchExperience() {
    this.closeAllBoxs('all');
    this.show_tab_color3 = true;
    if (this.searchObject.searchExperienceConfig.searchBarPosition == 'top') {
      delete this.searchObject.searchInteractionsConfig.defaultStatus;
      delete this.searchObject.searchInteractionsConfig.welcomeMsgFillColor;
    } else if (
      this.searchObject.searchExperienceConfig.searchBarPosition == 'bottom'
    ) {
      if (
        this.searchObject.searchInteractionsConfig.defaultStatus === undefined
      ) {
        this.searchObject.searchInteractionsConfig.defaultStatus = 'searchBar';
      }
      if (
        this.searchObject.searchInteractionsConfig.welcomeMsgFillColor ===
        undefined
      ) {
        this.searchObject.searchInteractionsConfig.welcomeMsgFillColor =
          '#EFF0F1';
      }
    }
    if (
      this.searchObject.searchInteractionsConfig.welcomeMsgEmoji ||
      this.searchObject.searchInteractionsConfig.welcomeMsgEmoji === ''
    ) {
      delete this.searchObject.searchInteractionsConfig.welcomeMsgEmoji;
    }
    const obj = {
      experienceConfig: this.searchObject.searchExperienceConfig,
      widgetConfig: this.searchObject.searchWidgetConfig,
      interactionsConfig: this.searchObject.searchInteractionsConfig,
    };
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
    };
    this.service.invoke('put.searchexperience', quaryparms, obj).subscribe(
      (res) => {
        this.searchIcon = res.widgetConfig.searchBarIcon;
        this.headerService.closeSdk();
        this.headerService.updateSearchConfiguration();
        this.appSelectionService.updateTourConfig(this.componentType);
        this.notificationService.notify('Updated successfully', 'success');
        // this.statusModalPopRef = this.statusModalPop.open();
        this.workflowService.checkTopOrBottom(
          this.searchObject.searchExperienceConfig.searchBarPosition
        );
      },
      (errRes) => {
        if (
          errRes &&
          errRes.error.errors &&
          errRes.error.errors.length &&
          errRes.error.errors[0] &&
          errRes.error.errors[0].msg
        ) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    );
  }
  //close preview popup
  closePreviewPopup() {
    if (this.statusModalPopRef && this.statusModalPopRef.close) {
      this.statusModalPopRef = this.statusModalPopRef.close();
    }
  }

  openSearchInterfaceGuide() {
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
    this.searchSDKSubscription
      ? this.searchSDKSubscription.unsubscribe()
      : false;
    this.queryConfigsSubscription
      ? this.queryConfigsSubscription.unsubscribe()
      : false;
  }

  closeEmojiPicker() {
    if (this.avatarDropdown) {
      this.avatarDropdown.dropdown.close();
    }
  }

  recentSearches() {
    if (
      this.searchObject.searchInteractionsConfig.showSearchesEnabled == true
    ) {
      this.searchObject.searchInteractionsConfig.showSearches = 'recent';
    } else {
      this.searchObject.searchInteractionsConfig.showSearches = 'frequent';
    }
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}
