import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.scss']
})
export class AddResultComponent implements OnInit {
  searchType = '';
  @Output() closeResult = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }
  closeCross(){
    this.closeResult.emit();
  }
  resultClick(type){
    type == 'FAQ' ? this.searchType = type : type == 'Content' ? this.searchType = type: this.searchType = type;
  }
}
