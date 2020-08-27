import { Component, OnInit } from '@angular/core';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';

@Component({
  selector: 'app-faq-source',
  templateUrl: './faq-source.component.html',
  styleUrls: ['./faq-source.component.scss'],
  animations: [fadeInOutAnimation]
})
export class FaqSourceComponent implements OnInit {
  loadingFaqs = true
  constructor() { }

  ngOnInit(): void {
    this.loadingFaqs = false
  }

}
