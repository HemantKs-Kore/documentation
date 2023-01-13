import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import * as moment from 'moment';
import { of, interval, Subject, Subscription } from 'rxjs';
import { EMPTY_SCREEN } from 'src/app/modules/empty-screen/empty-screen.constants';
declare const $: any;
@Component({
  selector: 'app-usage-log',
  templateUrl: './usage-log.component.html',
  styleUrls: ['./usage-log.component.scss']
})
export class UsageLogComponent implements OnInit {
  emptyScreen = EMPTY_SCREEN.MANAGE_USAGE_LOGS;
  usageLogs = [];
  queryTypeArr = [];
  requestSourceArr = [];
  resultsArr = [];
  showSearch;
  searchUsageLog = '';
  searchLoading = false;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  subscription: Subscription;
  totalRecord: number;
  filterSystem: any = {
    'queryTypeFilter': 'all',
    'requestSourceFilter': 'all',
    'resultsFilter': 'all'
  }
  activeClose = false;
  loadingLogs = false;
  loading = false;
  selectedSort = '';
  isAsc = true;
  current_plan_name: string;
  componentType: string = 'addData';
  beforeFilterUsageLogs: any = [];
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.loadUsageLogs();
    // this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
    //   this.loadUsageLogs();
    // })
    let subscription_data = this.appSelectionService.currentsubscriptionPlanDetails;
    this.current_plan_name = subscription_data?.subscription.planName;
  }
  toggleSearch() {
    if (this.showSearch && this.searchUsageLog) {
      this.searchUsageLog = '';
    }
    this.showSearch = !this.showSearch
  }
  searchItems() { }
  loadUsageLogs() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.getUsageLogs();
    }
  }
  searchUsageLogs() {
    this.searchLoading = true;
    if (this.searchUsageLog) {
      this.getUsageLogs(null, this.searchUsageLog);
    } else {
      this.getUsageLogs();
    }
  }
  getUsageLogs(offset?, quary?) {
    this.loading = true;
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      skip: offset || 0,
      limit: 10
    };
    let serviceId = 'get.allUsageLogs';
    if (quary) {
      quaryparms.searchQuary = quary;
      serviceId = 'get.usageLogs.search';
    }
    if (!this.usageLogs.length && !quary) {
      this.loadingLogs = true;
    }
    this.service.invoke(serviceId, quaryparms).subscribe(res => {
      this.usageLogs = res.data || [];
      this.totalRecord = res.total;
      this.loadingLogs = false;
      this.searchLoading = false;
      if (this.usageLogs.length) {
        this.usageLogs.forEach(element => {
          this.queryTypeArr.push(element.queryType);
          this.requestSourceArr.push(element.requestSource);
          if (element?.results !== null) this.resultsArr.push(element.results);
        });
        this.queryTypeArr = [...new Set(this.queryTypeArr)];
        this.requestSourceArr = [...new Set(this.requestSourceArr)];
        this.resultsArr = [...new Set(this.resultsArr)];
      }
      this.loading = false;
    }, errRes => {
      this.loading = false;
      this.searchLoading = false;
      this.errorToaster(errRes, 'Failed to get usage logs');
    });
  }

  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went wrong', 'error');
    }
  }

  paginate(event) {
    this.getUsageLogs(event.skip)
  }
  filterTable(source, headerOption) {
    console.log(this.usageLogs, source, headerOption);
    this.filterSystem.queryTypeFilter = 'all';
    this.filterSystem.requestSourceFilter = 'all';
    this.filterSystem.resultsFilter = 'all';

    this.filterUsageLogs(source, headerOption);
    switch (headerOption) {
      case 'queryType': { this.filterSystem.queryTypeFilter = source; return; };
      case 'requestSource': { this.filterSystem.requestSourceFilter = source; return; };
      case 'results': { this.filterSystem.resultsFilter = source; return; };
    };
  }

  filterUsageLogs(source, headerOption) {
    if (!this.beforeFilterUsageLogs.length) {
      this.beforeFilterUsageLogs = JSON.parse(JSON.stringify(this.usageLogs));
    }
    let tempUsageLogs = this.beforeFilterUsageLogs.filter((field: any) => {
      if (source !== 'all') {
        if (headerOption === 'queryType') {
          if (field.queryType === source) {
            return field;
          }
        }
        if (headerOption === 'requestSource') {
          if (field.requestSource === source) {
            return field;
          }
        }
        if (headerOption === 'results') {
          if (field.results === source) {
            return field;
          }
        }

      }
      else {
        return field;
      }
    });

    this.usageLogs = JSON.parse(JSON.stringify(tempUsageLogs));
  }
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "results": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "queryType": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "requestSource": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "createdOn": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
    }
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortBy(sort) {
    const data = this.usageLogs.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'queryType': return this.compare(a.queryType, b.queryType, isAsc);
        case 'requestSource': return this.compare(a.requestSource, b.requestSource, isAsc);
        case 'results': return this.compare(a.results, b.results, isAsc);
        case 'createdOn': return this.compare(a.createdOn, b.createdOn, isAsc);
        default: return 0;
      }
    });
    this.usageLogs = sortedData;
  }

  exportUsageLog() {
    const quaryparms: any = {
      streamId: this.selectedApp._id,
    };
    const payload = {
      "fileType": "csv",
      "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    this.service.invoke('post.exportUsageLog', quaryparms, payload).subscribe(res => {
      this.notificationService.notify('Export to CSV is in progress. You can check the status in the Status Docker', 'success');
      this.checkExportUsagelog()
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }

  checkExportUsagelog() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId
    }
    this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
      /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 280 line*/
      // if (res && res.dockStatuses) {
      if (res) {
        /**made changes on 24/02 as per new api contract in response we no longer use the key
       dockStatuses added updated code in 284 line*/
        // res.dockStatuses.forEach((record: any) => {
        res.forEach((record: any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");
          /**made code updates in line no 288 on 03/01 added new condition for success,since SUCCESS is upadted to success as per new api contract */
          // if (record.status === 'SUCCESS' && record.fileId && !(record.store || {}).toastSeen) {
          if ((record.status === 'SUCCESS' || record.status === 'success') && record.fileInfo.fileId && !(record.store || {}).toastSeen) {
            /**added condition for jobType in 570,since we are no longer recieving action in jobs api response,using the jobType for condition check as per new api contract 10/03 */
            // if (record.action === 'EXPORT') {
            if (record.jobType === "DATA_EXPORT") {
              this.downloadDockFile(record.fileInfo.fileId, (record.store || {}).urlParams, record.streamId, record._id);
              return;
            }
          }
        })

      }
    }, errRes => {
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to get Status of Docker.', 'error');
      }
    });
  }

  downloadDockFile(fileId, fileName, streamId, dockId) {
    const params = {
      fileId,
      streamId: streamId,
      dockId: dockId,
      jobId: dockId,
      sidx: this.serachIndexId
    }
    let payload = {
      "store": {
        "toastSeen": true,
        "urlParams": fileName,
      }
    }
    this.service.invoke('attachment.file', params).subscribe(res => {
      let hrefURL = res.fileUrl + (fileName ? fileName : '');
      window.open(hrefURL, '_self');
      this.service.invoke('put.dockStatus', params, payload).subscribe(res => { });
    }, err => { console.log(err) });
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
      // $('#'+inputSearch).focus();
    }, 500)
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchUsageLog = '';
      this.activeClose = false;
      this.getUsageLogs();
    }
    this.showSearch = !this.showSearch;
  }
  ngOnDestroy() {
    // this.subscription ? this.subscription.unsubscribe : false;
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }
}
