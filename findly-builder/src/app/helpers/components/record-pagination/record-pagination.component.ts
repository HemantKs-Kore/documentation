import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-record-pagination',
  templateUrl: './record-pagination.component.html',
  styleUrls: ['./record-pagination.component.scss']
})
export class RecordPaginationComponent implements OnInit {
  //testRecord = [];
  //limitpage = 10;
  remainder = 0;
  totalpages = 0;
  endPage = 0;
  startpage = 1;
  inputPage= 1;
  @Input() limitpage : any;
  @Input() totalRecord : any;
  @Output() pageChanged = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    // for(let i = 1 ; i < 569 ; i++){
    //   this.testRecord.push({i});
    // }
    this.endPage = Number((this.totalRecord/this.limitpage).toFixed());
    //this.endPage = Number(this.totalRecord/this.limitpage);
    this.remainder =  Number((this.totalRecord % this.limitpage));
    
    if(this.remainder > 0){
      this.endPage = this.endPage - 1;
    }
    if(this.endPage < 0){
      this.inputPage = 1;
      this.endPage = 1;
    }
    if(this.inputPage > this.endPage){
      this.inputPage = this.inputPage - 1;
    }
    

  }
  pageChangeEvent(inputPage){
    let skip = 0 ;
    let limit = this.limitpage;
    if(this.remainder > 0 && inputPage == this.endPage){
      skip = (inputPage - 1)  * this.limitpage;
      limit = this.limitpage + this.remainder;
    }else{
      skip = (inputPage-1) * this.limitpage 
    }
    const eventObj = {
      limit:limit,
      skip: skip
    }
    this.pageChanged.emit(eventObj);
  }
  inputPageChange(event){
    if(Number(event.target.value) <= this.endPage){
      this.inputPage = Number(event.target.value);
    }else{
      this.inputPage = this.endPage
    }
    this.pageChangeEvent(this.inputPage)
    
  }
  arrowFirst(){
    this.inputPage = this.startpage;
    this.pageChangeEvent(this.inputPage)
  }
  arrowLast(){
    this.inputPage = this.endPage;
    this.pageChangeEvent(this.inputPage)
  }
  arrowPrevious(){
    if(this.inputPage > this.startpage ) this.inputPage = this.inputPage - 1;
    this.pageChangeEvent(this.inputPage)
  }
  arrowNext(){
    if(  this.inputPage < this.endPage ) this.inputPage = this.inputPage + 1;
    this.pageChangeEvent(this.inputPage)
  }
}
