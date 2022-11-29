import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-screen',
  templateUrl: './empty-screen.component.html',
  styleUrls: ['./empty-screen.component.scss'],
})
export class EmptyScreenComponent implements OnInit {
  @Input() imgName = 'no-data.svg';
  @Input() width = '200';
  @Input() height = '200';
  @Input() title = '';
  @Input() desc = '';
  @Input() isSearch = false;

  constructor() {}

  ngOnInit(): void {}
}