import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
declare const $: any;

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.scss']
})
export class AddResultComponent implements OnInit {
  searchType = '';
  selectedApp :any = {};
  extractedResults : any = [];
  serachIndexId;
  recordArray = [];
  searchTxt = '';
  
  @Output() closeResult = new EventEmitter()
  constructor(public workflowService: WorkflowService,private service: ServiceInvokerService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
  }
  closeCross(){
    this.closeResult.emit();
  }
  resultClick(type){
    this.searchType = type;
    this.searchTxt ='';
    this.searchResults(this.searchTxt)
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
    if(!duplicate) this.recordArray.push(record)
  }
  pushRecord(){
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      //queryPipelineId : queryPipelineId
    };
    let result :any = [];
    this.recordArray.forEach((element,index) => {
      var obj :any = {};
      obj.contentType = this.searchType;
      obj.contentId = element._id;
      obj.config = {
        pinIndex : 0,
        boost: 0,
        visible: true,
      }
      result.push(obj);
    });
    let payload : any = {};
    
    payload.searchQuery = this.searchTxt;
    payload.result = result
    this.service.invoke('update.rankingPinning', quaryparms).subscribe(res => {
      this.recordArray=[];
      console.log(res);
    }, errRes => {
      console.log(errRes);
     
    });
  
  }
  clearReocrd(){
    //this.searchType = '';
    this.searchTxt ='';
    this.searchResults(this.searchTxt)
  }
  cancelRecord(){
    $('.add-result').css('display','none');
    this.clearReocrd();
    for(let i = 0;i<$('.radio-custom').length;i++){
      $('.radio-custom')[i].checked = false;
    }
  }
  searchResults(search){
    this.recordArray=[];
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      search : search,
      type: this.searchType,
      limit: 50,
      skip: 0
    };
    this.service.invoke('get.extractedResult_RR', quaryparms).subscribe(res => {
      this.extractedResults = res
      console.log(res);
    }, errRes => {
      console.log(errRes);
     
    });
  }
}
