import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-list-fields',
  templateUrl: './list-fields.component.html',
  styleUrls: ['./list-fields.component.scss']
})
export class ListFieldsComponent implements OnInit {

  constructor() { }

  addFieldModalPopRef: any;
  search_value: any;
  fields:any = [{
    language: "English",
    code: "en"
    }]
  languageList:any = [
    {
      language:'English',
      code:'en',
      selected:false
    },
    {
      language:'Korean',
      code:'ko',
      selected:false
    },
    {
      language:'Japanese',
      code:'ja',
      selected:false
    },
    {
      language:'German',
      code:'ge',
      selected:false
    },
  ];

  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  ngOnInit(): void {
  }
  
  openModalPopup() {
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }

  closeModalPopup() {
    this.addFieldModalPopRef.close();
  }

  getsearchvalue(value){
    this.search_value=value
  }

}
