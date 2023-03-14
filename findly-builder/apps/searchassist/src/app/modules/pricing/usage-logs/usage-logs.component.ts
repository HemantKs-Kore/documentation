import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { Subscription, tap } from 'rxjs';
import { format } from 'date-fns';
import { TranslationService } from '@kore.libs/shared/src';
import { Store } from '@ngrx/store';
import { selectAppIds } from '@kore.apps/store/app.selectors';
import { StoreService } from '@kore.apps/store/store.service';
@Component({
  selector: 'app-usage-logs',
  templateUrl: './usage-logs.component.html',
  styleUrls: ['./usage-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsageLogsComponent implements OnInit, OnDestroy {
  sub: Subscription;
  usageLogs = [];
  queryTypeArr = ['all'];
  resultsArr = ['all'];
  showSearch: boolean;
  searchUsageLog = '';
  searchLoading = false;
  searchImgSrc = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp: any;
  searchIndexId: string;
  subscription: Subscription;
  totalRecord: number;
  filterSystem: any = {
    queryTypeFilter: 'all',
    resultsFilter: 'all',
  };
  activeClose = false;
  loadingLogs = false;
  loading = false;
  selectedSort = '';
  isAsc = true;
  current_plan_name: string;
  beforeFilterUsageLogs: any = [];
  streamId;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    private cd: ChangeDetectorRef,
    private translationService: TranslationService,
    private storeService: StoreService
  ) {
    // Load translations for this module
    this.translationService.loadModuleTranslations('usage-log');
  }

  ngOnInit(): void {
    this.initAppIds();
    const subscription_data =
      this.appSelectionService?.currentsubscriptionPlanDetails;
    this.current_plan_name = subscription_data?.subscription?.planName;
  }

  initAppIds() {
    const idsSub = this.storeService.ids$
      .pipe(
        tap(({ streamId, searchIndexId }) => {
          this.streamId = streamId;
          this.searchIndexId = searchIndexId;

          this.getUsageLogs();
          this.getDyanmicFilterData();
        })
      )
      .subscribe();

    this.sub?.add(idsSub);
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch && this.searchUsageLog) this.searchUsageLog = '';
  }

  searchUsageLogs() {
    this.searchLoading = true;
    setTimeout(() => {
      this.searchUsageLog
        ? this.getUsageLogs(null, this.searchUsageLog)
        : this.getUsageLogs();
    }, 600);
  }
  //get dynamic filters dropdown data
  getDyanmicFilterData() {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
    };
    const request: any = {
      moduleName: 'usageLog',
    };
    this.service.invoke('post.filters', quaryparms, request).subscribe(
      (res) => {
        if (res) {
          this.queryTypeArr = [...this.queryTypeArr, ...res?.queryType];
          this.resultsArr = [...this.resultsArr, ...res?.results];
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get filters');
      }
    );
  }

  //get list of usage logs data
  getUsageLogs(offset?, query?) {
    this.loading = true;
    const quaryparms: any = {
      streamId: this.streamId,
      skip: offset || 0,
      limit: 10,
    };
    const payload = {
      queryType: this.filterSystem.queryTypeFilter,
      results: this.filterSystem.resultsFilter,
      search: query,
    };
    if (payload?.queryType === 'all') {
      delete payload.queryType;
    }
    if (payload?.results === 'all') {
      delete payload.results;
    }
    if (query === '') {
      delete payload.search;
    }
    let serviceId = 'post.allUsageLogs';
    if (!this.usageLogs.length && !query) {
      this.loadingLogs = true;
    }
    this.service.invoke(serviceId, quaryparms, payload).subscribe(
      (res) => {
        this.usageLogs = res.data || [];
        this.totalRecord = res.total;
        this.loadingLogs = false;
        this.searchLoading = false;
        this.loading = false;
        this.cd.detectChanges();
      },
      (errRes) => {
        this.loading = false;
        this.searchLoading = false;
        this.errorToaster(errRes, 'Failed to get usage logs');
      }
    );
  }

  errorToaster(errRes, message) {
    if (
      errRes &&
      errRes.error &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went wrong', 'error');
    }
  }

  paginate(event) {
    this.getUsageLogs(event.skip);
  }

  getSortIconVisibility(sortingField: string, type: string) {
    if (this.selectedSort == sortingField)
      return (this.isAsc == false && type == 'down') ||
        (this.isAsc == true && type == 'up')
        ? 'display-block'
        : 'display-none';
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortBy(sort) {
    const data = this.usageLogs.slice();
    this.selectedSort = sort;
    this.isAsc = this.selectedSort !== sort ? true : !this.isAsc;
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'queryType':
          return this.compare(a.queryType, b.queryType, isAsc);
        case 'requestSource':
          return this.compare(a.requestSource, b.requestSource, isAsc);
        case 'results':
          return this.compare(a.results, b.results, isAsc);
        case 'createdOn':
          return this.compare(a.createdOn, b.createdOn, isAsc);
        default:
          return 0;
      }
    });
    this.usageLogs = sortedData;
  }

  exportUsageLog() {
    const quaryparms: any = {
      streamId: this.streamId,
    };
    const payload = {
      fileType: 'csv',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    this.service.invoke('post.exportUsageLog', quaryparms, payload).subscribe(
      (res) => {
        this.notificationService.notify(
          'Export to CSV is in progress. You can check the status in the Status Docker',
          'success'
        );
        this.checkExportUsagelog();
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed');
      }
    );
  }

  checkExportUsagelog() {
    const queryParms = {
      searchIndexId: this.searchIndexId,
    };
    this.service.invoke('get.dockStatus', queryParms).subscribe(
      (res) => {
        if (res) {
          res.forEach((record: any) => {
            const createdOnDate = new Date(record.createdOn);
            record.createdOn = format(createdOnDate, 'do MMM yyyy | hh:mm a');
            if (
              (record?.status === 'SUCCESS' || record?.status === 'success') &&
              record?.fileInfo?.fileId &&
              !(record?.store || {})?.toastSeen
            ) {
              if (record?.jobType === 'DATA_EXPORT') {
                this.downloadDockFile(
                  record?.fileInfo?.fileId,
                  (record?.store || {}).urlParams,
                  record?.streamId,
                  record?._id
                );
                return;
              }
            }
          });
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get Status of Docker');
      }
    );
  }

  downloadDockFile(fileId, fileName, streamId, dockId) {
    const params = {
      fileId,
      streamId: streamId,
      dockId: dockId,
      jobId: dockId,
      sidx: this.searchIndexId,
    };
    const payload = {
      store: {
        toastSeen: true,
        urlParams: fileName,
      },
    };
    this.service.invoke('attachment.file', params).subscribe(
      (res) => {
        const hrefURL = res.fileUrl + (fileName ? fileName : '');
        window.open(hrefURL, '_self');
        this.service
          .invoke('put.dockStatus', params, payload)
          .subscribe((res) => {});
      },
      (err) => {
        console.log(err);
      }
    );
  }

  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 500);
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

  //dropdown filter to get dynamic data
  dropdownfilterData(query, type) {
    if (type === 'queryType') {
      this.filterSystem.queryTypeFilter = query;
    } else if (type === 'results') {
      this.filterSystem.resultsFilter = query;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
