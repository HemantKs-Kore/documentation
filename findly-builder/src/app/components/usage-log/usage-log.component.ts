import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import * as moment from 'moment';
import { of, interval, Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-usage-log',
  templateUrl: './usage-log.component.html',
  styleUrls: ['./usage-log.component.scss']
})
export class UsageLogComponent implements OnInit {
  usageLogs = [];
  queryTypeArr = [];
  requestSourceArr = [];
  resultsArr = [];
  showSearch;
  searchUsageLog = '';
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
  loadingLogs = false;
  loading = false;
  selectedSort = '';
  isAsc = true;
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
    if(!this.usageLogs.length){
      this.loadingLogs = true;
    }
    this.service.invoke(serviceId, quaryparms).subscribe(res => {
      this.usageLogs = res.data || [];
      this.totalRecord = res.total;
      this.loadingLogs = false;
      if (this.usageLogs.length) {
        this.usageLogs.forEach(element => {
          this.queryTypeArr.push(element.queryType);
          this.requestSourceArr.push(element.requestSource);
          this.resultsArr.push(element.results);
        });
        this.queryTypeArr = [...new Set(this.queryTypeArr)];
        this.requestSourceArr = [...new Set(this.requestSourceArr)];
        this.resultsArr = [...new Set(this.resultsArr)];
      }
      this.loading = false;
    }, errRes => {
      this.loading = false;
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
      "fileType": "csv"
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
      if (res && res.dockStatuses) {
        res.dockStatuses.forEach((record: any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");
          if (record.status === 'SUCCESS' && record.fileId && !(record.store || {}).toastSeen) {
            if (record.action === 'EXPORT') {
              this.downloadDockFile(record.fileId, (record.store || {}).urlParams, record.streamId, record._id);
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
      dockId: dockId
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

  ngOnDestroy() {
    // this.subscription ? this.subscription.unsubscribe : false;
  }
}
