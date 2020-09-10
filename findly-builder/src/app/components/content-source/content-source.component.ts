import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ServiceInvokerService} from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { AuthService } from '@kore.services/auth.service';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '../../services/notification.service';
import { Router} from '@angular/router';
declare const $: any;
import * as _ from 'underscore';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-content-source',
  templateUrl: './content-source.component.html',
  styleUrls: ['./content-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ContentSourceComponent implements OnInit, OnDestroy {
  loadingSliderContent = false;
  isConfig : boolean = false;
  filterSystem : any = {
    'typeHeader' : 'type',
    'statusHeader' : 'status',
    'typefilter' : 'all',
    'statusFilter' : 'all'
  }
  firstFilter: any = {'header': '' , 'source' : ''};
  currentView = 'list'
  searchSources = '';
  pagesSearch = '';
  selectedApp: any = {};
  resources: any = [];
  polingObj: any = {};
  resourcesObj: any = {};
  loadingContent = true;
  sectionShow = true;
  serachIndexId;
  filterResourcesBack;
  btnCount;
  btnAllCount;
  pagingData : any[] = [];
  statusArr= [];
  docTypeArr =[];
  selectedFilter: any = '' 
  contentTypes= {
    webdomain:'WEB',
    document:'DOC'
  }
  statusObj: any = {
    failed: {name : 'Failed', color: '#DD3646'},
    successfull: {name : 'Successfull', color: '#28A745'},
    success: {name : 'Success', color: '#28A745'},
    queued: {name : 'In Progress', color: '#0D6EFD'},
    running: {name : 'In Progress', color: '#0D6EFD'},
    inprogress: {name :'In Progress', color: '#0D6EFD'},
  };
  sliderStep = 0;
  selectedPage:any={};
  selectedSource: any = {};
  currentStatusFailed: any = false;
  userInfo: any = {};
  sortedData:any = [];
  statusModalPopRef: any = [];
  addSourceModalPopRef: any = [];
  showSourceAddition:any = null;
  isAsc = true;
  selectedSort = '';
  @ViewChild('addSourceModalPop') addSourceModalPop: KRModalComponent;
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild(SliderComponentComponent) sliderComponent: SliderComponentComponent;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getSourceList();
    this.userInfo = this.authService.getUserInfo() || {};
  }
  addNewContentSource(type){
    this.showSourceAddition = type;
    this.openAddSourceModal();
    // this.router.navigate(['/source'], { skipLocationChange: true,queryParams:{ sourceType:type}});
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortBy(sort) {
    const data = this.resources.slice();
    this.selectedSort = sort;
    if(this.selectedSort !== sort){
      this.isAsc = true;
    }else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'type': return this.compare(a.type, b.type, isAsc);
        case 'recentStatus': return this.compare(a.recentStatus, b.recentStatus, isAsc);
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'createdOn': return this.compare(a.createdOn, b.createdOn, isAsc);
        default: return 0;
      }
    });
    this.resources = sortedData;
  }
  getSourceList() {
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      type:'content',
      limit: 50,
      skip: 0
    };
    this.service.invoke('get.source.list', quaryparms).subscribe(res => {
      this.resources = res;
      this.filterResourcesBack = [...res];
      // let noPage = 0;
      // res.forEach(element => {
      //   if(element.recentStatus =="success"){
      //     noPage =  element.numPages;
      //   }
      // });
      if(res.numPages)
        this.pageination(res.numPages,10);
      if(this.resources.length){
        this.resources.forEach(element => {
          this.statusArr.push(element.recentStatus);
          this.docTypeArr.push(element.type);
        });
        this.statusArr = [...new Set(this.statusArr)]
        this.docTypeArr = [...new Set(this.docTypeArr)]
        
      }
      _.map(this.resources, (source)=> {
        source.name = source.name || source.title;
      });
      this.resources =  this.resources.reverse();
      if (this.resources && this.resources.length) {
        this.poling('content')
      }
      this.loadingContent = false;
      setTimeout(()=>{
        $('#searchContentSources').focus();
       },100);
    }, errRes => {
      console.log(errRes);
      this.loadingContent = false;
    });
  }
  poling(type) {
    clearInterval(this.polingObj[type]);
    const self = this;
    this.polingObj[type] = setInterval(() => {
      self.getJobStatus(type);
    }, 10000);
  }
  getJobStatus(type) {
    const quaryparms: any = {
      searchIndexId:this.serachIndexId,
      type
    };
    this.service.invoke('get.job.status', quaryparms).subscribe(res => {
      const queuedJobs = _.filter(res,(source) => {
        return ((source.status === 'running') || (source.status === 'queued'));
      });
      if (queuedJobs && queuedJobs.length) {
        console.log(queuedJobs);
     } else {
       clearInterval(this.polingObj[type]);
     }
    }, errRes => {
      this.errorToaster(errRes,'Failed to fetch job status');
      clearInterval(this.polingObj[type]);
    });
  }
  errorToaster(errRes,message){
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
  }
 }
  getCrawledPages(limit,skip) {
    const searchIndex =  this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      webDomainId: this.selectedSource._id,
      limit: limit,
      skip: skip
    };
    this.service.invoke('get.extracted.pags', quaryparms).subscribe(res => {
      this.selectedSource.pages = res;
      /** Paging */
     
      const data = [...res]
      this.pagingData = data.slice(0,10);
      
    /** Paging */
      this.sliderStep = 0;
      
      
      this.loadingSliderContent = false;
      if(this.isConfig && $('.tabname') && $('.tabname').length){
        $('.tabname')[1].classList.remove('active');
        $('.tabname')[0].classList.add('active');
      }
      this.isConfig = false;
    }, errRes => {
      this.loadingSliderContent = false;
      if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to crawl web page', 'error');
      }
    });
  }
  viewPages() {
    this.sliderStep = 0;
  }
  viewPageDetails() {
    this.sliderStep = 1;
  }
  sliderBack() {
    if(this.sliderStep){
      this.sliderStep =  this.sliderStep - 1;
    }
  }
  swapSlider(){
    $('.tabname').toggleClass("active");
    if(this.isConfig){
      this.isConfig = false;
    }else{
      this.isConfig = true;
    }
  }
  openStatusSlider(source) {
    if(source && ((source.recentStatus === 'running') || (source.recentStatus === 'queued') || (source.recentStatus === 'inprogress'))){
      this.notificationService.notify('Source extraction is still in progress','error');
      return;
      }
    if(source.recentStatus === 'success'){
      
        this.openStatusModal();
        this.selectedSource = source;
        this.pageination(source.numPages,10)
        this.loadingSliderContent = true;
        // this.sliderComponent.openSlider('#sourceSlider', 'right500');
        this.getCrawledPages(10,0);
    }
  }
  pageination(pages,perPage){
    let count = 0;
    
    let divisor = Math.floor(pages/perPage) 
    let remainder = pages%perPage;
    //let btnAllCount = 0;
    if(remainder>0){
      this.btnCount = divisor +1;
      this.btnAllCount = this.btnCount;
    }else{
      this.btnCount =  divisor;
      this.btnAllCount = this.btnCount;
    }

    if(this.btnCount > 5){
      this.btnCount = 5
    }
  }
  numArr(n: number): any[] {
    return Array(n);
  }
  onClickPageNo(noRows,index){
    this.getCrawledPages(noRows,index);
    $('.numbers').each( (key , valyue)=>{
      $('.numbers').removeClass("active")
    })
    $('#number_'+index).addClass("active");
  }
  deletePages(from,record,event) {
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: from == 'source'? 'Delete Source ' :' Delete Page',
        text: 'Are you sure you want to delete selected record?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          if(from == 'source'){
            this.deleteSource(record,dialogRef)
          }  else{
            this.deletePage(record,event,dialogRef)
          }
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }

  closeStatusSlider() {
    this.sliderComponent.closeSlider('#sourceSlider');
  }
  openImageLink(url){
    window.open(url,'_blank');
  }
  deleteSource(record,dialogRef){
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
      type:record.type,
      webDomainId:record._id
    }
    this.service.invoke('delete.content.source', quaryparms).subscribe(res => {
      dialogRef.close();
      this.notificationService.notify('Source deleted successsfully','success');
      const deleteIndex = _.findIndex(this.resources,(pg)=>{
           return pg._id === record._id;
      })
      if (deleteIndex > -1) {
        this.resources.splice(deleteIndex,1);
      }
    }, errRes => {
      this.errorToaster(errRes,'Failed to delete source');
    });
  }
  deletePage(page,event,dialogRef){
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const quaryparms:any = {
      searchIndexId: this.serachIndexId,
      webDomainId:this.selectedSource._id,
      pageId:page._id
    }
    this.service.invoke('delete.content.page', quaryparms).subscribe(res => {
      dialogRef.close();
      this.notificationService.notify('Page deleted successsfully','success');
      const deleteIndex = _.findIndex(this.selectedSource.pages,(pg)=>{
           return pg._id === page._id;
      })
      if (deleteIndex > -1) {
       this.selectedSource.pages.splice(deleteIndex,1);
      }
    }, errRes => {
    });
  }
  filterTableType(){

  }
  filterTable(source,headerOption){
    console.log(this.resources,source)
    let firstFilterDataBack = [];
      //this.resources = [...this.filterResourcesBack]; // For new Filter..
      if(headerOption == "type"){
        this.filterSystem.typeHeader = headerOption;
        this.filterSystem.typefilter = source;
      }else {
        this.filterSystem.statusHeader = headerOption;
        this.filterSystem.statusFilter = source;
      }
      
      //this.filterText  = source;
      /** TYpe */
      // if(this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter == "all"){
      //   this.resources = [...this.filterResourcesBack];
      //   this.firstFilter = {'header': '' , 'source' : ''};
      // } else {
      //  if(this.filterSystem.typefilter == "all" || this.filterSystem.statusFilter == "all"){
      //   if(!this.firstFilter['header'])this.firstFilter = {'header': headerOption , 'source' : source};
      //   if(source == "all") {
      //     firstFilterDataBack = [...this.filterResourcesBack];
      //     const resourceData =  firstFilterDataBack.filter((data)=>{
      //       return data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase();
      //       })
      //     if(resourceData.length)this.resources = [...resourceData];
      //   }else{
      //     firstFilterDataBack = [...this.filterResourcesBack];
      //     const resourceData =  firstFilterDataBack.filter((data)=>{
            
      //       return data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase();
      //       })
      //     if(resourceData.length)this.resources = [...resourceData];
      //   }
       
      //  }else {
      //   this.resources = [...this.filterResourcesBack];
      //   //firstFilter
      //   const firstResourceData =  this.resources.filter((data)=>{
      //     console.log(data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase());
      //     return data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase();
      //     })
      //     const secondResourceData =  firstResourceData.filter((data)=>{
      //       console.log(data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase());
      //       return data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase();
      //       })
      //   if(secondResourceData.length)this.resources = [...secondResourceData];
      //  }
       
      // }

      //a/
      if(this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter == "all"){
        this.resources = [...this.filterResourcesBack];
        this.firstFilter = {'header': '' , 'source' : ''};
      } 
      else if(this.filterSystem.typefilter != "all" && this.filterSystem.statusFilter == "all"){
        if(!this.firstFilter['header']){
          this.firstFilter = {'header': headerOption , 'source' : source};
        } 
        firstFilterDataBack = [...this.filterResourcesBack];
          const resourceData =  firstFilterDataBack.filter((data)=>{
            return data[this.filterSystem.typeHeader].toLocaleLowerCase() === this.filterSystem.typefilter.toLocaleLowerCase();
            })
          if(resourceData.length)this.resources = [...resourceData];
       }
       else if(this.filterSystem.typefilter == "all" && this.filterSystem.statusFilter != "all"){
        if(!this.firstFilter['header']){
          this.firstFilter = {'header': headerOption , 'source' : source};
        } 
        firstFilterDataBack = [...this.filterResourcesBack];
        const resourceData =  firstFilterDataBack.filter((data)=>{
          return data[this.filterSystem.statusHeader].toLocaleLowerCase() === this.filterSystem.statusFilter.toLocaleLowerCase();
          })
        if(resourceData.length)this.resources = [...resourceData];
       
      }
      else if(this.filterSystem.typefilter != "all" && this.filterSystem.statusFilter != "all"){
        this.resources = [...this.filterResourcesBack];
        //firstFilter
        if(this.firstFilter['header'] == headerOption){
          if(headerOption == "type"){
            this.firstFilter = {'header': this.filterSystem.statusHeader , 'source' : this.filterSystem.statusFilter};
          }else {
            this.firstFilter = {'header': this.filterSystem.typeHeader , 'source' : this.filterSystem.typefilter};
          }
        }
        const firstResourceData =  this.resources.filter((data)=>{
          console.log(data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase());
          return data[this.firstFilter['header']].toLocaleLowerCase() === this.firstFilter['source'].toLocaleLowerCase();
          })
          const secondResourceData =  firstResourceData.filter((data)=>{
            console.log(data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase());
            return data[headerOption].toLocaleLowerCase() === source.toLocaleLowerCase();
            })
        if(secondResourceData.length)this.resources = [...secondResourceData];
      }

     
  }
  transform(date: string): any {
    const _date = new Date(date);
    if(_date.toString() === 'Invalid Date'){
        return '-';
    }
    else{
        return moment(_date).format('DD MMM YYYY');
    }
   }
  pushValues(res,index){
    const array = [];
      array.push(this.transform(res[index].createdOn),res[index].desc,res[index].name,res[index].recentStatus,res[index].type)

    return array
  }
  applyFilter(valToSearch){
    if (valToSearch === this.selectedFilter){
      this.getSourceList();
      this.selectedFilter = '';
      return;
    }
    if(valToSearch){
      this.resources = [...this.filterResourcesBack];
    let tableData = [];
    console.log(this.resources)

    for(let i =0 ; i< this.resources.length;i++){
      // console.log(Object.keys(requireddata[i]))
      const requireddata = this.pushValues(this.resources,i);
      const obj : string[] = requireddata;
      // tslint:disable-next-line:prefer-for-of
      for(let j =0 ; j < obj.length; j++){
        if(obj[j].includes(valToSearch)){
          tableData.push(this.resources[i]);
        }
      }
    }
    tableData = [...new Set(tableData)]
    if(tableData.length){
      this.resources = tableData;
      this.sectionShow = true;
    }else{
      this.sectionShow = false;
    }
    console.log( tableData);
    }else{
      this.resources = [...this.filterResourcesBack];
      this.searchSources = '';
      this.sectionShow = true;
    }
  }
  openStatusModal() {
    this.statusModalPopRef  = this.statusModalPop.open();
   }
   closeStatusModal() {
    if (this.statusModalPopRef &&  this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
   }
   openAddSourceModal() {
    this.addSourceModalPopRef  = this.addSourceModalPop.open();
   }
   closeAddsourceModal() {
    if (this.addSourceModalPopRef &&  this.addSourceModalPopRef.close) {
      this.addSourceModalPopRef.close();
    }
   }
   onSourceAdditionClose(){
    this.closeAddsourceModal();
    this.getSourceList();
    this.showSourceAddition = null;
   }
   onSourceAdditionSave(){
    this.closeAddsourceModal();
    this.getSourceList();
    this.showSourceAddition = null;
   }
   allowUrls(allowUrl){
     
   }
  ngOnDestroy() {
   const timerObjects = Object.keys(this.polingObj);
   if (timerObjects && timerObjects.length) {
    timerObjects.forEach(job => {
      clearInterval(this.polingObj[job]);
    });
   }
  }
}
