import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kr-annotool',
  templateUrl: './annotool.component.html',
  styleUrls: ['./annotool.component.scss']
})
export class AnnotoolComponent implements OnInit {

  constructor() { 
    (window as any).pdfWorkerSrc = 'assets/js/pdf-dist/build/pdf.worker.min.js'; // setup worker path
  }

  ngOnInit() {

  }

}
