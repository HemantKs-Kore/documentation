import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';
@Component({
  selector: 'app-stop-words',
  templateUrl: './stop-words.component.html',
  styleUrls: ['./stop-words.component.scss']
})
export class StopWordsComponent implements OnInit {
  loadingContent:any = false;
  stopwords:any = [];
  searchStopwords: any = '';
  newStopWord:any = '';
  showSearch = false;
  constructor() { }
  ngOnInit(): void {
  }
  toggleSearch(){
    if(this.showSearch && this.searchStopwords){
      this.searchStopwords = '';
    }
    this.showSearch = !this.showSearch
  }
  addStopWord(){
    const stopwords = (this.newStopWord || '').split(',');
    this.stopwords = _.uniq(this.stopwords.concat(stopwords)).sort();
    this.newStopWord = '';
  }
}
