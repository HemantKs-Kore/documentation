import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-record-pagination',
  templateUrl: './record-pagination.component.html',
  styleUrls: ['./record-pagination.component.scss']
})
export class RecordPaginationComponent implements OnInit {
  testRecord = [];
  recordPerPage = 10;
  totalpages = 0;
  endPage = 0;
  startpage = 1;
  inputPage= 1;
  constructor() { }

  ngOnInit(): void {
    for(let i = 1 ; i < 569 ; i++){
      this.testRecord.push({i});
    }
    this.endPage = Number((this.testRecord.length/this.recordPerPage).toFixed());
    if(this.inputPage > this.endPage){
      this.inputPage = this.inputPage - 1;
    }

  }
  inputPageChange(){

  }
  arrowFirst(){
    this.inputPage = this.startpage;
  }
  arrowLast(){
    this.inputPage = this.endPage;
  }
  arrowPrevious(){
    if(this.startpage > this.inputPage ) this.inputPage = this.inputPage - 1;
  }
  arrowNext(){
    if(this.endPage < this.inputPage ) this.inputPage = this.inputPage + 1;
  }
}
