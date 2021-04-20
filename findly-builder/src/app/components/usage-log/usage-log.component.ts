import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usage-log',
  templateUrl: './usage-log.component.html',
  styleUrls: ['./usage-log.component.scss']
})
export class UsageLogComponent implements OnInit {
  showSearch;
  searchUsageLog = '';
  constructor() { }

  ngOnInit(): void {
  }
  toggleSearch() {
    if (this.showSearch && this.searchUsageLog) {
      this.searchUsageLog = '';
    }
    this.showSearch = !this.showSearch
  }
}
