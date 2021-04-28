import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-usage-log',
  templateUrl: './usage-log.component.html',
  styleUrls: ['./usage-log.component.scss']
})
export class UsageLogComponent implements OnInit {
  usageLogs=[];
  queryTypeArr = [];
  requestSourceArr = [];
  isResultArr = [];
  showSearch;
  searchUsageLog = '';
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  subscription: Subscription;
  totalRecord:number;
  filterSystem: any = {
    'queryTypeFilter': 'all',
    'requestSourceFilter': 'all',
    'isResultFilter': 'all'
  }
  selectedSort = '';
  isAsc = true;
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
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.loadUsageLogs();
    })
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
  getUsageLogs(offset?) {
    const quaryparms: any = {
      streamId : this.selectedApp._id,
      skip: offset || 0,
      limit: 10
    };
    this.service.invoke('get.allUsageLogs', quaryparms).subscribe(res => {
      this.usageLogs = res.data || [];
      this.totalRecord = res.total;
      if(this.usageLogs.length){
        this.usageLogs.forEach(element => {
          this.queryTypeArr.push(element.queryType);
          this.requestSourceArr.push(element.requestSource);
          this.isResultArr.push(element.isResult);
        });
        this.queryTypeArr = [...new Set(this.queryTypeArr)];
        this.requestSourceArr = [...new Set(this.requestSourceArr)];
        this.isResultArr = [...new Set(this.isResultArr)];
      }

    }, errRes => {
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

  paginate(event){
    this.getUsageLogs(event.skip)
  }
  filterTable(source, headerOption) {
    console.log(this.usageLogs, source, headerOption);
    this.filterSystem.queryTypeFilter = 'all';
    this.filterSystem.requestSourceFilter = 'all';
    this.filterSystem.isResultFilter = 'all';

    this.filterUsageLogs(source, headerOption);
    switch (headerOption) {
      case 'queryType': { this.filterSystem.queryTypeFilter = source; return; };
      case 'requestSource': { this.filterSystem.requestSourceFilter = source; return; };
      case 'isResult': { this.filterSystem.isResultFilter = source; return; };
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
        if (headerOption === 'isResult') {
          if (field.isResult === source) {
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
    case "isResult": {
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
      case 'isResult': return this.compare(a.isResult, b.isResult, isAsc);
      case 'createdOn': return this.compare(a.createdOn, b.createdOn, isAsc);
      default: return 0;
    }
  });
  this.usageLogs = sortedData;
}
}
