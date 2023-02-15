import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { EMPTY_SCREEN } from '../../empty-screen/empty-screen.constants';
declare let require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesComponent implements OnInit{
  emptyScreen = EMPTY_SCREEN.MANAGE_ORDERS_INVOICES;
  invoices = [];
  showSearch = false;
  searchInvoice = '';
  searchImgSrc = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp: any;
  serachIndexId: string;
  indexPipelineId: string;
  totalRecord: number;
  selectedSort = '';
  loading = false;

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
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.loadInvoices();
  }

  toggleSearch() {
    this.showSearch = !this.showSearch
    if (this.showSearch && this.searchInvoice) this.searchInvoice = '';
  }

  loadInvoices() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) this.getInvoices();
  }

  getInvoices(offset?, sortHeaderOption?, sortValue?, navigate?, request?) {
    this.loading = true;
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      skip: offset || 0,
      limit: 10,
      sortByInvoiceDate: 1
    };
    if (sortHeaderOption && sortValue && navigate) {
      quaryparms.sortByInvoiceDate = sortValue;
    }
    this.service.invoke('get.allInvoices', quaryparms).subscribe(res => {
      this.invoices = res.data || [];
      this.totalRecord = res.total;
      this.loading = false;
      this.cd.detectChanges();
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

  downloadAll() {
    this.invoices.forEach(item => {
      this.downloadInvoice(item?.viewInvoice, item?._id);
    })
  }

  downloadInvoice(url, invoiceId) {
    FileSaver.saveAs(url + '&DownloadPdf=true', 'invoice_' + invoiceId + '.pdf');
  }

  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(null);
  }
}
