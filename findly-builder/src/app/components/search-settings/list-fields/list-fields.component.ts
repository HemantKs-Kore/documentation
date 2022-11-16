import { Component, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { isNgTemplate } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
declare const $: any;

@Component({
  selector: 'app-list-fields',
  templateUrl: './list-fields.component.html',
  styleUrls: ['./list-fields.component.scss']
})
export class ListFieldsComponent implements OnInit {
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild(PerfectScrollbarComponent) perfectScroll?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  constructor(
    public dialog: MatDialog
  ) { }

  addFieldModalPopRef: any;
  search_value: any;
  fieldsArr_backup:any;
  recordArray = [];
  fieldsArr:any = [{
    _id:1,
    field_name: "page_body",
    type: "String",
    isPresentable:false,
    isSpellcorrect:true,
    isHighlight:true
    },{
      _id:2,
    field_name: "page_image_url",
    type: "String",
    isPresentable:false,
    isSpellcorrect:true,
    isHighlight:true
    },{
      _id:3,
      field_name: "page_title",
      type: "String",
      isPresentable:false,
      isSpellcorrect:true,
      isHighlight:true
    },
    {
      _id:4,
      field_name: "page_title_keywords",
      type: "Array",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:true
    },{
      _id:5,
      field_name: "page_title",
      type: "String",
      isPresentable:false,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:6,
      field_name: "page_title_vector",
      type: "Dense Vector",
      isPresentable:false,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:6,
      field_name: "page_url",
      type: "String",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
    },{
      _id:7,
      field_name: "faq_alt_questions",
      type: "Array",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
    },{
      _id:8,
      field_name: "faq_answer",
      type: "String",
      isPresentable:true,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:9,
      field_name: "faq_cond_answers",
      type: "Array",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
    },{
      _id:10,
      field_name: "faq_question",
      type: "String",
      isPresentable:true,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:11,
      field_name: "faq_question_keywords",
      type: "Array",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
      
    },{
      _id:12,
      field_name: "faq_question_vector",
      type: "Dense Vector",
      isPresentable:true,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:13,
      field_name: "file_content",
      type: "String",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
    },{
      _id:14,
      field_name: "file_image_url",
      type: "String",
      isPresentable:true,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:15,
      field_name: "file_preview",
      type: "String",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
    },{
      _id:16,
      field_name: "file_title",
      type: "String",
      isPresentable:true,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:17,
      field_name: "file_url",
      type: "String",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
    },{
      _id:18,
      field_name: "file_title_vector",
      type: "Dense Vector",
      isPresentable:true,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:19,
      field_name: "sys_content_type",
      type: "String",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
    },{
      _id:20,
      field_name: "sys_source_name",
      type: "String",
      isPresentable:true,
      isSpellcorrect:true,
      isHighlight:true
    },{
      _id:21,
      field_name: "sys_racl",
      type: "Array",
      isPresentable:false,
      isSpellcorrect:false,
      isHighlight:false
    },{
      _id:22,
      field_name: "confluenceServer_name",
      type: "String",
      isPresentable:true,
      isSpellcorrect:true,
      isHighlight:true
    },
    {
      _id:1,
      field_name: "page_body",
      type: "String",
      isPresentable:false,
      isSpellcorrect:true,
      isHighlight:true
      },{
        _id:2,
      field_name: "page_image_url",
      type: "String",
      isPresentable:false,
      isSpellcorrect:true,
      isHighlight:true
      },{
        _id:3,
        field_name: "page_title",
        type: "String",
        isPresentable:false,
        isSpellcorrect:true,
        isHighlight:true
      },
      {
        _id:4,
        field_name: "page_title_keywords",
        type: "Array",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:true
      },{
        _id:5,
        field_name: "page_title",
        type: "String",
        isPresentable:false,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:6,
        field_name: "page_title_vector",
        type: "Dense Vector",
        isPresentable:false,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:6,
        field_name: "page_url",
        type: "String",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
      },{
        _id:7,
        field_name: "faq_alt_questions",
        type: "Array",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
      },{
        _id:8,
        field_name: "faq_answer",
        type: "String",
        isPresentable:true,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:9,
        field_name: "faq_cond_answers",
        type: "Array",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
      },{
        _id:10,
        field_name: "faq_question",
        type: "String",
        isPresentable:true,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:11,
        field_name: "faq_question_keywords",
        type: "Array",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
        
      },{
        _id:12,
        field_name: "faq_question_vector",
        type: "Dense Vector",
        isPresentable:true,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:13,
        field_name: "file_content",
        type: "String",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
      },{
        _id:14,
        field_name: "file_image_url",
        type: "String",
        isPresentable:true,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:15,
        field_name: "file_preview",
        type: "String",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
      },{
        _id:16,
        field_name: "file_title",
        type: "String",
        isPresentable:true,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:17,
        field_name: "file_url",
        type: "String",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
      },{
        _id:18,
        field_name: "file_title_vector",
        type: "Dense Vector",
        isPresentable:true,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:19,
        field_name: "sys_content_type",
        type: "String",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
      },{
        _id:20,
        field_name: "sys_source_name",
        type: "String",
        isPresentable:true,
        isSpellcorrect:true,
        isHighlight:true
      },{
        _id:21,
        field_name: "sys_racl",
        type: "Array",
        isPresentable:false,
        isSpellcorrect:false,
        isHighlight:false
      },{
        _id:22,
        field_name: "confluenceServer_name",
        type: "String",
        isPresentable:true,
        isSpellcorrect:true,
        isHighlight:true
      },
  ]
  filteredFieldsArr = [];
   modal_open:boolean=false;

  ngOnInit(): void {
    this.modal_open=false;
  }
  /** On Perfect Scroll Event Y end */
  onYReachEnd(event){
    console.log('Why this is printing multiple times when I reach Bottom, I wanted it to be single fire')
    this.perfectScroll.directiveRef.scrollTo(25,50,500)
  }
  /** On Perfect Scroll Event Y end */
  onYReachStart(){
    console.log('Why this is printing multiple times when I reach TOP, I wanted it to be single fire')
    this.perfectScroll.directiveRef.scrollTo(75,50,500)
  }
  // addRecord(record, i, event) {
  //   let duplicate = false;
  //   // if (!this.positionRecord) {
  //   //   this.positionRecord = "top"
  //   // }
  //   if (this.recordArray) {
  //     this.recordArray.forEach((element, index) => {
  //       if (element._id == record._id) {
  //         this.recordArray.splice(index, 1);
  //         duplicate = true;
  //         var id = element.contentId
  //         $("[custumId=" + id + "]").prop('checked', false);
  //       }
  //     });
  //   }
  //   if (!duplicate) this.recordArray.push(record);
  //   if (this.recordArray.length) {
  //     this.recordArray.forEach(element => {
  //       var id = element._id
  //       $("[custumId=" + id + "]").prop('checked', true);
  //     });
  //     // $('#viewTypeCheckboxControl').prop('checked', false);
  //   }
  //   // if(this.searchType == "all" || this.searchRadioType == "all"){
  //   //   this.checkForContentType(record,i)
  //   // }
  // }
  
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
    this.clearReocrd();
  }

  clearReocrd() {
    //this.searchType = '';
    this.search_value = '';
  }

  getsearchvalue(value){
    this.search_value=value
  }

  deletefieldsDataPopup(record) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected data will be permanently deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true,
      }
    });
    dialogRef.componentInstance.onSelect.subscribe(res => {
      if (res === 'yes') {
        dialogRef.close();
        //this.deleteStructuredData(record);
      }
      else if (res === 'no') {
        dialogRef.close();
      }
    });
  }
}
