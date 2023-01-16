import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'underscore';
import { of, interval, Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Router, ActivatedRoute } from '@angular/router';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';
import { RangeSlider } from '../../helpers/models/range-slider.model';

declare const $: any;

@Component({
  selector: 'app-search-field-properties',
  templateUrl: './search-field-properties.component.html',
  styleUrls: ['./search-field-properties.component.scss'],
})
export class SearchFieldPropertiesComponent implements OnInit {
  selectedApp;
  serachIndexId;
  indexPipelineId;
  streamId: any;
  querySubscription: Subscription;
  queryPipelineId: any;
  searchFieldProperties: any = [];
  totalRecord: number = 0;
  skip = 0;
  limit = 10;
  enableIndex = -1;
  defaultIndex = -1;
  propeties: any = {
    highlight: false,
    presentable: false,
    spellCorrect: false,
    weight: 0,
  };
  selectedProperties: any = {};
  showSearch = false;
  searchFields: any = '';
  activeClose = false;
  searchFocusIn = false;
  selectedSort = 'fieldName';
  isAsc = true;
  checksort = 'asc';
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  activeSliderIndex = -1; // Since the array value cannot be -1 , so this can used for any case;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    public inlineManual: InlineManualService,
    private router: Router,
    public mixpanel: MixpanelServiceService
  ) {}

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    // if (this.workflowService.selectedApp()?.configuredBots[0]) {
    //   this.streamId = this.workflowService.selectedApp()?.configuredBots[0]?._id ?? null;
    // }
    // else if (this.workflowService.selectedApp()?.publishedBots && this.workflowService.selectedApp()?.publishedBots[0]) {
    //   this.streamId = this.workflowService.selectedApp()?.publishedBots[0]?._id ?? null
    // }
    // else {
    //   this.streamId = null;
    // }
    this.queryPipelineId = this.workflowService.selectedQueryPipeline()
      ? this.workflowService.selectedQueryPipeline()._id
      : '';
    this.fetchPropeties();
    this.querySubscription =
      this.appSelectionService.queryConfigSelected.subscribe((res) => {
        this.indexPipelineId = this.workflowService.selectedIndexPipeline();
        this.queryPipelineId = this.workflowService.selectedQueryPipeline()
          ? this.workflowService.selectedQueryPipeline()._id
          : '';
        this.fetchPropeties();
      });
  }
  /**   */
  fetchPropeties(search?, type?, skip?) {
    if (this.searchFields || this.searchFields.length > 0) {
      this.skip = 0;
    }
    const quaryparms: any = {
      sortBy: this.selectedSort,
      search: this.searchFields || '',
      page: this.skip / 10,
      limit: this.limit,
      spellCorrect: this.selectedProperties.spellCorrect || true, // Not Required
      presentable: this.selectedProperties.presentable || true, // Not Required
      highlight: this.selectedProperties.highlight || true, // Not Required
      orderBy: this.checksort, //desc,
      indexPipelineId: this.indexPipelineId,
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
    };
    this.service.invoke('get.allsearchFields', quaryparms).subscribe(
      (res) => {
        this.searchFieldProperties = res.data;
        this.searchFieldProperties.forEach((element, index) => {
          const name = element.fieldName.replaceAll('_', '');
          element.properties['slider'] = new RangeSlider(
            0,
            10,
            1,
            element.properties.weight,
            name + index,
            '',
            false
          );
        });
        this.totalRecord = res.totalCount;
        this.enableIndex = this.defaultIndex;
      },
      (errRes) => {
        this.notificationService.notify(errRes, 'error');
      }
    );
  }
  /** Record Pagination's ( Child ) event captured here in SearchFiled ( Parent ) */
  paginate(event) {
    this.skip = event.skip;
    this.fetchPropeties();
  }
  //SearchFiledProperties's Search Event
  focusoutSearch() {
    if (this.activeClose) {
      this.searchFields = '';
      this.activeClose = false;
      this.fetchPropeties(this.searchFields, this.skip);
    }
    this.showSearch = !this.showSearch;
  }
  //SearchFiledProperties's Search Event
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100);
  }
  /** Clear slider  (Author : Sunil Singh) */
  clearSlider(index) {
    if (this.activeSliderIndex > -1 && this.activeSliderIndex != index) {
      this.cancel(
        this.searchFieldProperties[this.activeSliderIndex].properties,
        this.activeSliderIndex
      );
    }
    this.activeSliderIndex = index;
  }
  /** helping Change detection for Slider If edit or Canceled  (Author : Sunil Singh) */
  sliderChange(properties, index, enable) {
    const name = this.searchFieldProperties[index].fieldName.replaceAll(
      '_',
      ''
    );
    this.searchFieldProperties[index].properties['slider'] = new RangeSlider(
      0,
      10,
      1,
      properties.weight,
      name + index,
      '',
      enable
    );
  }
  /** On Edit event  */
  editSearchFiledProperties(searchProperties?, index?) {
    this.clearSlider(index);
    this.sliderChange(
      searchProperties.properties,
      index,
      searchProperties.isSearchable
    ); // if isSearchable == flase Slider should be disabled
    if (!searchProperties.isSearchable) {
      this.notificationService.notify(
        'This field is non Searchable ',
        'warning'
      );
    }
    this.enableIndex = index;
    this.selectedProperties = Object.assign(
      this.selectedProperties,
      searchProperties.properties
    );
  }
  /** On Cancel event  */
  cancel(properties?, index?) {
    this.sliderChange(properties, index, false);
    this.activeSliderIndex = -1;
  }
  /** On Save / Update event for existing SearchFields */
  saveAPI(selectedProperties, fieldId, i?) {
    const quaryparms: any = {
      indexPipelineId: this.indexPipelineId,
      streamId: this.selectedApp._id,
      queryPipelineId: this.queryPipelineId,
      fieldId: fieldId,
    };
    selectedProperties.weight = selectedProperties.slider.default;
    const payload = selectedProperties;
    this.service
      .invoke('put.updatesearchFieldsProperties', quaryparms, payload)
      .subscribe(
        (res) => {
          this.enableIndex = this.defaultIndex;
          this.fetchPropeties();
          console.log(res);
          this.notificationService.notify('Updated Successfully', 'success');
        },
        (errRes) => {
          this.notificationService.notify('Update Failed', 'error');
        }
      );
  }
  /** Function for Icon Visiblity show Up / Show Down */
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case 'fieldName': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'weight': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'presentable': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'highlight': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
      case 'spellCorrect': {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return 'display-block';
          }
          if (this.isAsc == true && type == 'up') {
            return 'display-block';
          }
          return 'display-none';
        }
        break;
      }
    }
  }
  /** Function for sorting Column */
  sortByApi(sort) {
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var naviagtionArrow = '';
    //var checkSortValue= 1;
    if (this.isAsc) {
      naviagtionArrow = 'up';
      this.checksort = 'asc';
    } else {
      naviagtionArrow = 'down';
      //checkSortValue = -1;
      this.checksort = 'desc';
    }
    //this.fieldsFilter(null,null,null,null,sort,checkSortValue,naviagtionArrow)
    this.fetchPropeties();
  }
  /** slider's ( Child ) event captured here in SearchFiled ( Parent ) */
  valueEvent(event, searchProperties) {
    searchProperties.properties.slider.default = event;
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
  ngOnDestroy() {
    this.querySubscription ? this.querySubscription.unsubscribe() : false;
  }
}
