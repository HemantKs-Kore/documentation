import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy ,OnChanges, SimpleChanges} from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit , OnChanges{
  recordStr:any= 1;
  pageObj:any = {};
  @Input() totalRecord:any
  @Input() limitpage:any
  @Input() allInOne:any;
  @Input() recordEnd : any;
  @Output() pageChanged = new EventEmitter();
  constructor() { }
  ngOnInit(): void {
    this.pageObj.disableNext = false;
    this.pageObj.disablePrev = true;
    this.recordEnd = this.limitpage;
    if(this.totalRecord < this.limitpage || this.totalRecord < this.recordEnd){
      this.recordEnd = this.totalRecord;
      this.pageObj.disableNext = true;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if(this.totalRecord < this.limitpage || this.totalRecord < this.recordEnd){
      this.recordEnd = this.totalRecord;
      this.pageObj.disableNext = true;
    }
    this.updateFlags();
  }
  updateFlags(){
    if(this.recordStr > this.limitpage && this.recordEnd < this.totalRecord){
      this.pageObj.disableNext = false;
      this.pageObj.disablePrev = false;
      $('.pre-arrow').removeClass('dis-arow');
    }else if(this.recordStr < this.limitpage){
      this.pageObj.disableNext = false;
      this.pageObj.disablePrev = true;
    }else if(this.recordEnd === this.totalRecord){
      this.pageObj.disableNext = true;
      this.pageObj.disablePrev = false;
      $('.pre-arrow').removeClass('dis-arow');
    }
    if(this.allInOne){
      this.pageObj.disableNext = true;
      this.pageObj.disablePrev = true;
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
      this.updateFlags();
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
