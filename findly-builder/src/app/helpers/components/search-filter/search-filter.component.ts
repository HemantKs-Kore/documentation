import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { ignoreElements } from 'rxjs/operators';

declare const $: any;
@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @Input() set shouldClear(val) {
    if (val) {
      this.searchFields = '';
      this.searchkey.emit('');
    }
  }
  searchFields: any = '';
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  showSearch = false;
  activeClose = false;
  @Output() searchkey = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  filterFields(key){
    this.searchkey.emit(key);
    if(key.length==0){
      $('input').blur()
    }
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }


  // focusoutSearch() {
  //   if (!this.activeClose) {
  //     this.searchFields = '';
  //     this.activeClose = false;
  //   }
  //   this.showSearch = !this.showSearch;
  // }
  focusoutSearch() {
    if (this.activeClose) {
      this.searchFields = '';
      this.activeClose = false;
      this.filterFields(this.searchFields)
      //this.getFileds(this.searchFields)
      
    }
    this.showSearch = !this.showSearch;
  }

}
