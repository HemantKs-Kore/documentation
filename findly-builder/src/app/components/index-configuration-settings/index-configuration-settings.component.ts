import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-index-configuration-settings',
  templateUrl: './index-configuration-settings.component.html',
  styleUrls: ['./index-configuration-settings.component.scss']
})
export class IndexConfigurationSettingsComponent implements OnInit {

  addLangModalPopRef: any;


  @ViewChild('addLangModalPop') addLangModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor() { }

  ngOnInit(): void {
  }

  openModalPopup() {
    this.addLangModalPopRef = this.addLangModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }

  closeModalPopup() {
    this.addLangModalPopRef.close();
  }

}
