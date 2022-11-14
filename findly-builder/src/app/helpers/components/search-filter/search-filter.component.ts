import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
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
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }


  focusoutSearch() {
    if (!this.activeClose) {
      this.searchFields = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }

}
