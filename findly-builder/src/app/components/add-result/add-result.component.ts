import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { Subscription } from 'rxjs';
declare const $: any;

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.scss']
})
export class AddResultComponent implements OnInit {
  searchType = '';
  positionRecord = 'top'
  searchRadioType = 'all';
  searchRadioTypeTxt = "Any"
  selectedApp :any = {};
  extractedResults : any = [];
  serachIndexId;
  queryPipelineId;
  recordArray = [];
  searchTxt = '';
  contentTypeAny = '';
  loadingContent = false;
  subscription: Subscription;
  @Input() query : any;
  @Input() addNew;
  @Input() structure;
  @Output() closeResult = new EventEmitter();
  constructor(public workflowService: WorkflowService,
    public notificationService: NotificationService,
    private appSelectionService:AppSelectionService,
    private service: ServiceInvokerService) { }

  ngOnInit(): void {
    //this.appDetails();
    this.searchType = this.searchRadioType;
    this.results();
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res=>{
      this.results();
    })
  }
  results(){
    this.queryPipelineId = this.workflowService.selectedQueryPipeline()?this.workflowService.selectedQueryPipeline()._id:this.selectedApp.searchIndexes[0].queryPipelineId;
    if(this.queryPipelineId){
      this.appDetails();
    }
  }
  appDetails(){
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId = this.workflowService.selectedQueryPipeline()._id
  }
  closeCross(){
    this.closeResult.emit(!this.addNew);
  }
  resultClick(type){
    this.searchRadioType = type;
    this.searchType = this.searchRadioType;
    if(this.searchRadioType == 'faq'){
      this.searchRadioTypeTxt = "FAQ"
    }else if(this.searchRadioType == 'content'){
      this.searchRadioTypeTxt = "Content"
    }else if(this.searchRadioType == 'task'){
      this.searchRadioTypeTxt = "Bot Action"
    }else if(this.searchRadioType == 'object'){
      this.searchRadioTypeTxt = "Structured Data"
    }else {
      this.searchRadioTypeTxt = "Any"
    }
    this.searchTxt ='';
    this.extractedResults = [];
    //this.searchResults(this.searchTxt)
    //type == 'FAQ' ? this.searchType = type : type == 'Content' ? this.searchType = type: this.searchType = type;
  }
  keyFunc(txt){
    this.searchResults(txt)
  }
  addRecord(record,i,event){
    let duplicate = false;
    if(!this.positionRecord){
      this.positionRecord = "top"
    }
    if(this.recordArray){
      this.recordArray.forEach((element , index) => {
        if(element.contentId == record.contentId){
          this.recordArray.splice(index,1);
          duplicate = true;
          var id = element.contentId
          $("[custumId="+id+"]").prop('checked', false);
        }
      });
    }
    if(!duplicate) this.recordArray.push(record);
    if(this.recordArray.length){
      this.recordArray.forEach(element => {
        var id = element.contentId
        $("[custumId="+id+"]").prop('checked', true);
      });
      
     // $('#viewTypeCheckboxControl').prop('checked', false);
    }
    // if(this.searchType == "all" || this.searchRadioType == "all"){
    //   this.checkForContentType(record,i)
    // }
  }
  // checkForContentType(record,i){
  //   this.contentTypeAny = record._source.contentType;
  // }
  pushRecord(){
    this.appDetails();
    let contentType = ""
    let contentTaskFlag = false;
    if(this.searchType == "task" || this.searchRadioType == "task"){
      contentType = this.searchType ||  this.searchRadioType;
      contentTaskFlag = true;
    }
    const searchIndex = this.serachIndexId;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      queryPipelineId : this.queryPipelineId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    let result :any = [];
    this.recordArray.forEach((element,index) => {
      var obj :any = {};
      obj.contentType = contentTaskFlag ? contentType : element.__contentType;
      //obj.contentType = contentTaskFlag ? contentType : element._source.contentType ;
      obj.contentId = element.contentId;
      obj.position = this.positionRecord;
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
      this.closeResult.emit({"addNewResult":true});
      if($('.checkbox-custom')){
        for(let i = 0;i< $('.checkbox-custom').length; i++){
          $('.checkbox-custom')[i].checked =  false;
        }
      }
      this.positionRecord = "top"
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
    this.recordArray = [];
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
    this.appDetails();
    this.loadingContent = true;
    this.recordArray=[];
    const searchIndex = this.serachIndexId;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      search : search,
      type: this.searchType || this.searchRadioType,
      limit: 50,
      skip: 0
    };
    const payload = {
      extractionType: this.searchType ||  this.searchRadioType,
      search:search,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    }
    this.service.invoke('get.extractedResult_RR', quaryparms,payload).subscribe(res => {
      if(this.searchType == "all"){
        this.extractedResults =[];
        res.content.document.forEach(element => {
          this.extractedResults.push(element)
        });
        res.content.page.forEach(element => {
          this.extractedResults.push(element)
        });
        res.faq.forEach(element => {
          this.extractedResults.push(element)
        });
        res.task.forEach(element => {
          this.extractedResults.push(element)
        });
        //this.extractedResults = res.contents[0].results;
        console.log(this.extractedResults);
        //console.log(res.contents);
      }else if(this.searchType == "faq"){
        this.extractedResults = res.faq;
      }else if(this.searchType == "content"){
        res.content.document.forEach(element => {
            this.extractedResults.push(element)
        });
        res.content.page.forEach(element => {
          this.extractedResults.push(element)
        });
        console.log(this.extractedResults)
        //this.extractedResults = res.content;
      }else if(this.searchType == "task"){
        this.extractedResults = res.task;
      }
      this.loadingContent = false;
      
    }, errRes => {
      console.log(errRes);
      this.loadingContent = false;
    });
  }
}
