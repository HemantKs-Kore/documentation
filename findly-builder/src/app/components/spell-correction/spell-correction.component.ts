import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spell-correction',
  templateUrl: './spell-correction.component.html',
  styleUrls: ['./spell-correction.component.scss']
})
export class SpellCorrectionComponent implements OnInit {
  more_options:boolean=false;
  max_threshold:number=0;
  min_threshold:number=0;
  constructor() { }

  ngOnInit(): void {
    this.more_options=false;
    this.max_threshold=0;
    this.min_threshold=0;
  }

  openContainer(){
    this.more_options=true;
  }
  closeContainer(){
    this.more_options=false;
  }
  maxdecrementValue(){
    this.max_threshold=this.max_threshold-1;
    if(this.max_threshold < 0){
      this.max_threshold=0;
    }
  }
  maxincrementValue(){
    this.max_threshold=this.max_threshold+1;
  }
  mindecrementValue(){
    this.min_threshold=this.min_threshold-1;
    if(this.min_threshold < 0){
      this.min_threshold=0;
    }
  }
  minincrementValue(){
    this.min_threshold=this.min_threshold+1;
  }

}
