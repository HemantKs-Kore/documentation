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
  fieldsArr_backup:any;
  fieldsArr:any = [{
    field_name: "page_body",
    type: "String",
    isPresentable:"true",
    isSpellcorrect:"true",
    isHighlight:"true"
    },{
    field_name: "page_image_url",
    type: "String",
    isPresentable:"false",
    isSpellcorrect:"true",
    isHighlight:"true"
    },{
      field_name: "page_title",
      type: "String",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },
    {
      field_name: "page_title_keywords",
      type: "Array",
      isPresentable:"true",
      isSpellcorrect:"false",
      isHighlight:"true"
    },{
      field_name: "page_title",
      type: "String",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "page_title_vector",
      type: "Dense Vector",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "page_url",
      type: "String",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
    },{
      field_name: "faq_alt_questions",
      type: "Array",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
    },{
      field_name: "faq_answer",
      type: "String",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "faq_cond_answers",
      type: "Array",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
    },{
      field_name: "faq_question",
      type: "String",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "faq_question_keywords",
      type: "Array",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
      
    },{
      field_name: "faq_question_vector",
      type: "Dense Vector",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "file_content",
      type: "String",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
    },{
      field_name: "file_image_url",
      type: "String",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "file_preview",
      type: "String",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
    },{
      field_name: "file_title",
      type: "String",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "file_url",
      type: "String",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
    },{
      field_name: "file_title_vector",
      type: "Dense Vector",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "sys_content_type",
      type: "String",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
    },{
      field_name: "sys_source_name",
      type: "String",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },{
      field_name: "sys_racl",
      type: "Array",
      isPresentable:"false",
      isSpellcorrect:"false",
      isHighlight:"false"
    },{
      field_name: "confluenceServer_name",
      type: "String",
      isPresentable:"true",
      isSpellcorrect:"true",
      isHighlight:"true"
    },
  ]
   modal_open:boolean=false;


  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  ngOnInit(): void {
    this.fieldsArr_backup=this.fieldsArr
    this.modal_open=false;
  }
  
  openModalPopup() {
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    this.modal_open=true
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
    if(this.search_value){
      this.fieldsArr=this.fieldsArr_backup
    }
  }
}
