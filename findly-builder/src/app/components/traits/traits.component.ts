import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TraitsComponent implements OnInit {
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  statusModalPopRef: any = [];
  constructor() { }

  ngOnInit(): void {
  }
  openStatusModal() {
    this.statusModalPopRef  = this.statusModalPop.open();
   }
  closeStatusModal() {
    if (this.statusModalPopRef &&  this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
   }
}
