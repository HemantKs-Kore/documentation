import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usage-log',
  templateUrl: './usage-log.component.html',
  styleUrls: ['./usage-log.component.scss']
})
export class UsageLogComponent implements OnInit {
  showSearch;
  searchUsageLog = '';
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  searchFocusIn = false;
  constructor() { }

  ngOnInit(): void {
  }
  toggleSearch() {
    if (this.showSearch && this.searchUsageLog) {
      this.searchUsageLog = '';
    }
    this.showSearch = !this.showSearch
  }
  searchItems() { }
}
