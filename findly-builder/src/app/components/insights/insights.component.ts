import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  @Input() data : any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
