import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-search-experience',
  templateUrl: './search-experience.component.html',
  styleUrls: ['./search-experience.component.scss']
})
export class SearchExperienceComponent implements OnInit {
  selectedTab: string = 'experience';
  selectSearch: string;
  searchObject: any = {
    experience: {
      search_bar: 'topdown'
    }
  }
  public color: string = '#2889e9';
  constructor() { }

  ngOnInit(): void {
  }
  //sequential tabs method
  nextTab() {
    console.log("searchObject", this.searchObject)
    if (this.selectedTab === 'experience') {
      this.selectedTab = 'searchwidget';
    }
    else if (this.selectedTab === 'searchwidget') {
      this.selectedTab = 'interactions';
    }
  }
  //select search box widget
  selectSearchBox(type) {
    console.log("type", type);
    this.selectSearch = type;
  }
  //fetch color code 
  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }
}
