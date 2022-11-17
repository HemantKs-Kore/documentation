import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-highlighting',
  templateUrl: './highlighting.component.html',
  styleUrls: ['./highlighting.component.scss']
})
export class HighlightingComponent implements OnInit {
   more_options:boolean=false;
  constructor() { }

  highlightAppearanceModalPopRef: any;

  @ViewChild('highlightAppearanceModalPop') highlightAppearanceModalPop: KRModalComponent;
  @ViewChild(PerfectScrollbarComponent) perfectScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef: PerfectScrollbarDirective;

  ngOnInit(): void {
    this.more_options=false;
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
  openContainer(){
    this.more_options=true;
    this.perfectScroll.directiveRef.scrollTo(25,50,500)
  }
  closeContainer(){
    this.more_options=false;
    this.perfectScroll.directiveRef.scrollTo(25,50,500)
  }

}
