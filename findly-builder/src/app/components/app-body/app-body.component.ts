import { Component, OnInit, Input, EventEmitter, AfterViewInit, Output } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './app-body.component.html',
  styleUrls: ['./app-body.component.scss']
})
export class AppBodyComponent implements OnInit , AfterViewInit {
  @Output() initSearchSDK = new EventEmitter();
  @Input() bridgeData; 
  @Input() query; 
  insights = true;
  constructor() { }
  ngOnInit() {
   
  }
  ngAfterViewInit(){
    setTimeout( (a) => {
      this.initSearchSDK.emit();
    },2000)
  }
}
