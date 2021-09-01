import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-result-templates',
  templateUrl: './result-templates.component.html',
  styleUrls: ['./result-templates.component.scss']
})
export class ResultTemplatesComponent implements OnInit {
  customModalRef : any;
  @ViewChild('customModal') customModal: KRModalComponent;
  constructor() { }

  ngOnInit(): void {
  }
  openCustomModal(){
    this.customModalRef = this.customModal.open();
  }
  closeCustomModal() {
    if (this.customModalRef && this.customModalRef.close) {
      this.customModalRef.close();
    }
  }
}
