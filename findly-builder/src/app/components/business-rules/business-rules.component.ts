import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
@Component({
  selector: 'app-business-rules',
  templateUrl: './business-rules.component.html',
  styleUrls: ['./business-rules.component.scss']
})
export class BusinessRulesComponent implements OnInit {
  addBusinessRulesRef:any;
  @ViewChild('addBusinessRules') addBusinessRules: KRModalComponent;
  constructor() { }

  ngOnInit(): void {
  }
  openModalPopup(){
    this.addBusinessRulesRef = this.addBusinessRules.open();
  }
  closeModalPopup(){
    this.addBusinessRulesRef.close();
  }

}
