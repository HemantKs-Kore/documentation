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
import { TranslationService } from '@kore.libs/shared/src';
import { selectAppIds } from '@kore.apps/store/app.selectors';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
declare let require: any;
const FileSaver = require('file-saver');
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesComponent implements OnInit, OnDestroy {
  invoices = [];
  showSearch = false;
  searchInvoice = '';
  searchImgSrc = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  selectedApp: any;
  totalRecord: number;
  selectedSort = '';
  loading = false;
  streamId;
  sub: Subscription;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService,
    private cd: ChangeDetectorRef,
    private translationService: TranslationService,
    private store: Store
  ) {
    // Load translations for this module
    this.translationService.loadModuleTranslations('pricing');
  }

  ngOnInit(): void {
    this.initAppIds();
  }

  initAppIds() {
    const idsSub = this.store.select(selectAppIds).subscribe(({ streamId }) => {
      this.streamId = streamId;
      this.getInvoices();
    });
    this.sub?.add(idsSub);
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch && this.searchInvoice) this.searchInvoice = '';
  }

  getInvoices(offset?, sortHeaderOption?, sortValue?, navigate?, request?) {
    this.loading = true;
    const quaryparms: any = {
      streamId: this.streamId,
      skip: offset || 0,
      limit: 10,
      sortByInvoiceDate: 1,
    };
    if (sortHeaderOption && sortValue && navigate) {
      quaryparms.sortByInvoiceDate = sortValue;
    }
    this.service.invoke('get.allInvoices', quaryparms).subscribe(
      (res) => {
        this.invoices = res.data || [];
        this.totalRecord = res.total;
        this.loading = false;
        this.cd.detectChanges();
      },
      (errRes) => {
        this.loading = false;
        this.errorToaster(errRes, 'Failed to get invoices');
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
    this.getInvoices(event.skip);
  }

  downloadAll() {
    this.invoices.forEach((item) => {
      this.downloadInvoice(item?.viewInvoice, item?._id);
    });
  }

  downloadInvoice(url, invoiceId) {
    FileSaver.saveAs(
      url + '&DownloadPdf=true',
      'invoice_' + invoiceId + '.pdf'
    );
  }

  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(null);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
