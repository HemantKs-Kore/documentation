import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-search-insights',
  templateUrl: './search-insights.component.html',
  styleUrls: ['./search-insights.component.scss']
})
export class SearchInsightsComponent implements OnInit {
  viewQueriesRef:any;
  constructor() { }

  ngOnInit(): void {
  }
  @ViewChild('viewQueries') viewQueries: KRModalComponent;

  openModalPopup(){
    this.viewQueriesRef = this.viewQueries.open();
  }
  closeModalPopup(){
    this.viewQueriesRef.close();
  }
}
