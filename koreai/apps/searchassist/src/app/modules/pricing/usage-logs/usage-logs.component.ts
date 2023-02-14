import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { EMPTY_SCREEN } from '../../empty-screen/empty-screen.constants';
@Component({
  selector: 'app-usage-logs',
  templateUrl: './usage-logs.component.html',
  styleUrls: ['./usage-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsageLogsComponent {
  emptyScreen = EMPTY_SCREEN.MANAGE_USAGE_LOGS;
  usageLogs = [];
  queryTypeArr = ['all'];
  resultsArr = ['all'];
  showSearch: boolean;
  searchUsageLog = '';
  searchLoading = false;
  searchImgSrc = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp: any;
  serachIndexId: string;
  indexPipelineId: string;
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
  beforeFilterUsageLogs: any = [];
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService?.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    const subscription_data = this.appSelectionService?.currentsubscriptionPlanDetails;
    this.current_plan_name = subscription_data?.subscription?.planName;
    this.loadUsageLogs();
  }

  toggleSearch() {
    this.showSearch = !this.showSearch
    if (this.showSearch && this.searchUsageLog) this.searchUsageLog = '';
  }

  loadUsageLogs() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) this.getUsageLogs();

  }
  searchUsageLogs() {
    this.searchLoading = true;
    (this.searchUsageLog) ? this.getUsageLogs(null, this.searchUsageLog) : this.getUsageLogs();
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
          if (element?.results !== null) this.resultsArr.push(element.results);
        });
        this.queryTypeArr = [...new Set(this.queryTypeArr)];
        this.resultsArr = [...new Set(this.resultsArr)];
      }
      this.loading = false;
      this.cd.detectChanges();
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
    const tempUsageLogs = this.beforeFilterUsageLogs.filter((field: any) => {
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
    if (this.selectedSort == sortingField) return ((this.isAsc == false && type == 'down') || (this.isAsc == true && type == 'up')) ? 'display-block' : 'display-none';
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortBy(sort) {
    const data = this.usageLogs.slice();
    this.selectedSort = sort;
    this.isAsc = (this.selectedSort !== sort) ? true : !this.isAsc;
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
      this.errorToaster(errRes, 'Failed');
    });
  }

  checkExportUsagelog() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId
    }
    this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
      if (res) {
        res.forEach((record: any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");
          if ((record.status === 'SUCCESS' || record.status === 'success') && record.fileInfo.fileId && !(record.store || {}).toastSeen) {
            if (record.jobType === "DATA_EXPORT") {
              this.downloadDockFile(record.fileInfo.fileId, (record.store || {}).urlParams, record.streamId, record._id);
              return;
            }
          }
        })
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get Status of Docker');
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
    const payload = {
      "store": {
        "toastSeen": true,
        "urlParams": fileName,
      }
    }
    this.service.invoke('attachment.file', params).subscribe(res => {
      const hrefURL = res.fileUrl + (fileName ? fileName : '');
      window.open(hrefURL, '_self');
      this.service.invoke('put.dockStatus', params, payload).subscribe(res => { });
    }, err => { console.log(err) });
  }

  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
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

  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(null);
  }
}
