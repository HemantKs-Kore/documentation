import { Component, OnDestroy, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, OnDestroy {
  invoices = [];
  showSearch;
  searchInvoice = '';
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp;
  serachIndexId;
  indexPipelineId;
  subscription: Subscription;
  totalRecord: number;
  selectedSort = '';
  loading = false;
  isAsc = true;
  current_plan_name;
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
    this.loadInvoices();
    // this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
    //   this.loadInvoices();
    // })
    let subscription_data = this.appSelectionService.currentsubscriptionPlanDetails;
    this.current_plan_name = subscription_data.subscription.planName;
  }
  toggleSearch() {
    if (this.showSearch && this.searchInvoice) {
      this.searchInvoice = '';
    }
    this.showSearch = !this.showSearch
  }
  loadInvoices() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.getInvoices();
    }
  }
  searchItems() { }
  getInvoices(offset?) {
    this.loading = true;
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      skip: offset || 0,
      limit: 10
    };
    this.service.invoke('get.allInvoices', quaryparms).subscribe(res => {
      this.invoices = res.data || [];
      this.totalRecord = res.total;
      this.loading = false;
    }, errRes => {
      this.loading = false;
      this.errorToaster(errRes, 'Failed to get invoices');
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
    this.getInvoices(event.skip)
  }

  downloadInvoice(url, invoiceId) {
    // FileSaver.saveAs("https://httpbin.org/image", "image.jpg");
    FileSaver.saveAs(url + '&DownloadPdf=true', 'invoice_' + invoiceId + '.pdf');
  }

  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "invoiceCreatedDate": {
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
    const data = this.invoices.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'invoiceCreatedDate': return this.compare(a.invoiceCreatedDate, b.invoiceCreatedDate, isAsc);
        default: return 0;
      }
    });
    this.invoices = sortedData;
  }
  ngOnDestroy() {
    //this.subscription ? this.subscription.unsubscribe : false;
  }
}
