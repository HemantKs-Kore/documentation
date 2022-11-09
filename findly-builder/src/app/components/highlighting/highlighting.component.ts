import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-highlighting',
  templateUrl: './highlighting.component.html',
  styleUrls: ['./highlighting.component.scss']
})
export class HighlightingComponent implements OnInit {

  constructor() { }

  highlightAppearanceModalPopRef: any;

  @ViewChild('highlightAppearanceModalPop') highlightAppearanceModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  ngOnInit(): void {
  }

  openModalPopup() {
    this.highlightAppearanceModalPopRef = this.highlightAppearanceModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }

  closeModalPopup() {
    this.highlightAppearanceModalPopRef.close();
  }

}
