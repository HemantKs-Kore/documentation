import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-search-interface',
  templateUrl: './search-interface.component.html',
  styleUrls: ['./search-interface.component.scss']
})
export class SearchInterfaceComponent implements OnInit {
  customModalRef:any;
  @ViewChild('customModal') customModal: KRModalComponent;
  constructor() { }

  ngOnInit(): void {
  }
  openCustomModal() {
    this.customModalRef = this.customModal.open();
  }
  closeCustomModal(){
    if (this.customModalRef && this.customModalRef.close){
      this.customModalRef.close();
    }
  }
}
