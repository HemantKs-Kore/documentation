import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
declare const $: any;

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.scss']
})
export class AddResultComponent implements OnInit {
  searchType = '';
  searchRadioType = 'faq';
  selectedApp :any = {};
  extractedResults : any = [];
  serachIndexId;
  queryPipelineId;
  recordArray = [];
  searchTxt = '';
  contentTypeAny = '';
  loadingContent = false;
  @Input() query : any;
  @Input() addNew;
  @Output() closeResult = new EventEmitter()
  constructor(public workflowService: WorkflowService,
    public notificationService: NotificationService,
    private service: ServiceInvokerService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId = this.selectedApp.searchIndexes[0].queryPipelineId;
    this.searchType = this.searchRadioType;
  }
  closeCross(){
    this.closeResult.emit(!this.addNew);
  }
  resultClick(type){
    this.searchRadioType = type;
    this.searchType = this.searchRadioType;
    this.searchTxt ='';
    this.extractedResults = [];
    //this.searchResults(this.searchTxt)
    //type == 'FAQ' ? this.searchType = type : type == 'Content' ? this.searchType = type: this.searchType = type;
  }
  keyFunc(txt){
    this.searchResults(txt)
  }
  addRecord(record,i){
    let duplicate = false;
    if(this.recordArray){
      this.recordArray.forEach((element , index) => {
        if(element._id == record._id){
          this.recordArray.splice(index,1);
          duplicate = true;
        }
      });
    }
    if(!duplicate) this.recordArray.push(record);
    // if(this.searchType == "all" || this.searchRadioType == "all"){
    //   this.checkForContentType(record,i)
    // }
  }
  // checkForContentType(record,i){
  //   this.contentTypeAny = record._source.contentType;
  // }
  pushRecord(){
    let contentType = ""
    let contentTaskFlag = false;
    if(this.searchType == "task" || this.searchRadioType == "task"){
      contentType = this.searchType ||  this.searchRadioType;
      contentTaskFlag = true;
    }
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      queryPipelineId : this.queryPipelineId
    };
    let result :any = [];
    this.recordArray.forEach((element,index) => {
      var obj :any = {};
      obj.contentType = contentTaskFlag ? contentType : element._source.contentType ;
      obj.contentId = element._id;
      // obj.config = {
      //   pinIndex : -1,
      //   //boost: 1.0,
      //   //visible: true,
      // }
      result.push(obj);
    });
    let payload : any = {};
    
    payload.searchQuery = this.query;
    payload.results = result;
    this.service.invoke('update.rankingPinning', quaryparms,payload).subscribe(res => {
      this.recordArray=[];
      this.extractedResults = [];
      this.searchTxt = "";
      contentTaskFlag = false;
      if($('.checkbox-custom')){
        for(let i = 0;i< $('.checkbox-custom').length; i++){
          $('.checkbox-custom')[i].checked =  false;
        }
      }
      this.notificationService.notify('Record Added', 'success');
      //console.log(res);
    }, errRes =>  {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed Standard Publish', 'error');
      }
    });
  
  }
  clearReocrd(){
    //this.searchType = '';
    this.searchTxt ='';
    this.extractedResults = [];
    //this.searchResults(this.searchTxt)
  }
  cancelRecord(){
    //$('.add-result').css('display','none');
    this.closeCross();
    this.addNew = true;
    this.clearReocrd();
    for(let i = 0;i<$('.radio-custom').length;i++){
      $('.radio-custom')[i].checked = false;
    }
  }
  searchResults(search){
    this.loadingContent = true;
    this.recordArray=[];
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      search : search,
      type: this.searchType || this.searchRadioType,
      limit: 50,
      skip: 0
    };
    this.service.invoke('get.extractedResult_RR', quaryparms).subscribe(res => {
      if(this.searchType == "all"){
        this.extractedResults =[];
        this.extractedResults = res.contents[0].results;
        //console.log(this.extractedResults);
        //console.log(res.contents);
      }else{
        this.extractedResults = res;
      }
      this.loadingContent = false;
      
    }, errRes => {
      console.log(errRes);
      this.loadingContent = false;
    });
  }
}
