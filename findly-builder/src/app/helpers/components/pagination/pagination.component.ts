import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { skip } from 'rxjs/operators';
declare const $: any;
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  recordStr:any= 1;
  recordEnd;
  disableNext = false;
  disablePrev = true;
  @Input() totalRecord:any
  @Input() limitpage:any
  @Input() allInOne:any
  @Output() pageChanged = new EventEmitter();
  constructor() { }
  ngOnInit(): void {
    this.recordEnd = this.limitpage;
    if(this.totalRecord < this.limitpage){
      this.disableNext = true;
    }
  }
  onClickArrow(newStart,newEnd,offset,time){
    const preStart = this.recordStr;
    const preEnd = this.recordEnd;
    if((newStart < 1 )|| newEnd > (this.totalRecord + this.limitpage)){
    }else{
      if(preEnd === this.totalRecord){
        newEnd = newStart + (this.limitpage-1);
      }
      newStart < 0 ? this.recordStr = 1: this.recordStr = newStart;
      newStart > this.totalRecord ? this.recordStr =  this.recordStr - this.limitpage : this.recordStr = newStart;
      newEnd > this.totalRecord ? this.recordEnd = this.totalRecord: this.recordEnd = newEnd;
      if(this.recordStr > this.limitpage && this.recordEnd < this.totalRecord){
        this.disableNext = false;
        this.disablePrev = false;
      }else if(this.recordStr < this.limitpage){
        this.disableNext = false;
        this.disablePrev = true;
      }else if(this.recordEnd === this.totalRecord){
        this.disableNext = true;
        this.disablePrev = false;
      }
      if(this.allInOne){
        this.disableNext = true;
        this.disablePrev = true;
      }
    }
    const eventObj = {
      limit:this.limitpage,
      skip:this.recordStr - 1
    }
    this.pageChanged.emit(eventObj);
  }
  onClickPageNo(noRows,index){
    const eventObj = {
      limit:this.limitpage,
      skip:this.recordStr - 1
    }
    this.pageChanged.emit(eventObj);
  }
}
