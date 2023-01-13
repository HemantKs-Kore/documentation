import { Component, OnDestroy, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { EMPTY_SCREEN } from 'src/app/modules/empty-screen/empty-screen.constants';
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, OnDestroy {
  emptyScreen = EMPTY_SCREEN.MANAGE_ORDERS_INVOICES;
  invoices = [];
  showSearch = false;
  searchInvoice:string='';
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
 sortedObject = {
    type : '',
    value : '',
    position: ''
  }
  componentType: string = 'addData';
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
  getInvoices(offset?,sortHeaderOption?,sortValue?,navigate?,request?) {
    this.loading = true;
    const quaryparms: any = {
      streamId: this.selectedApp._id,
      skip: offset || 0,
      limit: 10,
      sortByInvoiceDate: 1
    };
    if(sortHeaderOption && sortValue && navigate){
      quaryparms.sortByInvoiceDate = sortValue;
    }
   
    this.service.invoke('get.allInvoices', quaryparms).subscribe(res => {
      this.invoices = res.data || [];
      this.totalRecord = res.total;
      this.loading = false;
    }, errRes => {
      this.loading = false;
      this.errorToaster(errRes, 'Failed to get invoices');
    });
  }
  sortInvoices(sortHeaderOption?,sortValue?,navigate?){  
    // fieldsFilter(searchValue?,searchSource?, source?,headerOption?, sortHeaderOption?,sortValue?,navigate?)  
    // this.loadingContent = true;
    if(sortValue){
      this.sortedObject = {
        type : sortHeaderOption,
        value : sortValue,
        position: navigate
      }
    }
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.workflowService.selectedQueryPipeline()._id,
      offset: 0,
      limit: 10
    };
    let request:any={}
    if(!sortValue){
      request = {
        "sort":{
          'fieldName':1
        }    
    }   
    }
    else if(sortValue){
      const sort :any ={}
      request= {
        sort
      }
    }
    else {
    request={}
    }
      
    if(sortValue){  
      this.getSortIconVisibility(sortHeaderOption,navigate);
       //Sort start
    if(sortHeaderOption === 'sortByInvoiceDate' ){
      request.sort.sortByInvoiceDate = sortValue
    }
    // end
    }
    this.getInvoices(null,sortHeaderOption,sortValue,navigate,request);
  }
  sortByApi(sort){
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    var naviagtionArrow ='';
    var checkSortValue= 1;
    if(this.isAsc){
      naviagtionArrow= 'up';
      checkSortValue = 1;
    }
    else{
      naviagtionArrow ='down';
      checkSortValue = -1;
    }
    this.getInvoices(null,sort,checkSortValue,naviagtionArrow)
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

  downloadAll(){
    this.invoices.forEach(item=>{
      this.downloadInvoice(item?.viewInvoice,item?._id);
    })
  }

  downloadInvoice(url, invoiceId) {
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
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next();
  }
}
