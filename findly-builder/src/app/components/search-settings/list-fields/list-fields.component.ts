import { Component, IterableDiffers, OnInit, ViewChild,Output,Input,EventEmitter } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';;
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
  @Input() tablefieldvalues;
  @Input() popupfieldvalues;
  @Input() maxpageno;
  @Output() emitRecord = new EventEmitter();
  @Output() sort=new EventEmitter();
  @Output() searchModel =new EventEmitter();
  @Output() pageno =new EventEmitter();
  @Output() calladdApi = new EventEmitter();
  @Input() isLoading = false;
  @Input() isaddLoading = false;
   page_number=0;
  constructor(
    public dialog: MatDialog
  ) { }

  addFieldModalPopRef: any;
  search_value: any;
  shouldClear = false;
  fieldsArr_backup:any;
  recordArray = [];
  fieldsAr:any = []
  filteredFieldsArr = [];
  modal_open:boolean=false;
  selectedSort = 'fieldName';
  componenttype;
  checksort='asc'
  isAsc = true;
  loadingContent = true;
  selectedList = [];
  ngOnInit(): void {    
    this.modal_open=false;
    console.log(this.tablefieldvalues);
    console.log(this.popupfieldvalues);
    // if(this.tablefieldvalues && this.tablefieldvalues.length){
    //   this.loadingContent = false
    // }
  }
  /** To cehck for the Selected Values */
  checkValues(){
    if(this.selectedList.length){
      this.selectedList.forEach(selectedElement => {
        this.popupfieldvalues.forEach(popupElement => {
          if(selectedElement._id == popupElement._id){
            popupElement.isChecked = true;
          }
        });
      });
    }
    return this.popupfieldvalues;
  }
  //**Sort icon visibility */
  getSortIconVisibility(sortingField: string, type: string,component: string) {
    if(component=="datatable"){
        switch (this.selectedSort) {
          case "fieldName": {
            if (this.selectedSort == sortingField) {
              if (this.isAsc == false && type == 'down') {
                return "display-block";
              }
              if (this.isAsc == true && type == 'up') {
                return "display-block";
              }
              return "display-none"
            }
          }
          case "fieldDataType": {
            if (this.selectedSort == sortingField) {
              if (this.isAsc == false && type == 'down') {
                return "display-block";
              }
              if (this.isAsc == true && type == 'up') {
                return "display-block";
              }
              return "display-none"
            }
          }
        }
      }
      else{
        switch (this.selectedSort) {
          case "fieldName": {
            if (this.selectedSort == sortingField) {
              if (this.isAsc == false && type == 'down') {
                return "display-block";
              }
              if (this.isAsc == true && type == 'up') {
                return "display-block";
              }
              return "display-none"
            }
          }
          case "fieldDataType": {
            if (this.selectedSort == sortingField) {
              if (this.isAsc == false && type == 'down') {
                return "display-block";
              }
              if (this.isAsc == true && type == 'up') {
                return "display-block";
              }
              return "display-none"
            }
          }
        }
      }
    }
  sortByApi(sort,component){
    this.selectedSort = sort;
    this.componenttype=component
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    let naviagtionArrow ='';
    //var checkSortValue= 1;
    if(this.isAsc){
      naviagtionArrow= 'up';
      this.checksort='asc'
    }
    else{
      naviagtionArrow ='down';
      //checkSortValue = -1;
      this.checksort='desc'
    }
    this.sort.emit({
      componenttype:this.componenttype,
      fieldname :this.selectedSort,
      type : this.checksort
    });
  }
  /** On Perfect Scroll Event Y end */
  onYReachEnd(event){
    this.perfectScroll.directiveRef.scrollTo(25,50,500)
    this.nextpage()
  }
  /**increase page number and emit value */
  nextpage(){
    if(this.page_number < 0){
      this.page_number=0;
    }
    this.page_number=this.page_number+1    
    if(this.page_number>=this.maxpageno){
      this.page_number=this.maxpageno;
    }
    this.pageno.emit(this.page_number)

  }
  /** On Perfect Scroll Event Y end */
  onYReachStart(event){
    this.perfectScroll.directiveRef.scrollTo(5,50,500)
    this.previouspage()
  }
  /**reduce the page number and emit value*/
  previouspage(){
    this.page_number=this.page_number-1
    if(this.page_number < 0){
      this.page_number=0;
    }
    this.pageno.emit(this.page_number)
  }
  //** open add field modal pop up */
  openModalPopup() {
    let flag=false;
    this.shouldClear = false;
    this.calladdApi.emit(flag);
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    this.modal_open=true
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500)
  }
  //** to close the modal pop-up */
  closeModalPopup() {
    this.shouldClear = true;
    this.search_value = '';
    this.addFieldModalPopRef.close();
    this.clearReocrd();
  }
 
  //** to clear the search text and the checkbox selections */
  clearReocrd() {
    //this.searchType = '';
    this.search_value = '';
    this.selectedList = [];
    this.popupfieldvalues = this.popupfieldvalues.map(item => {
      item.isChecked = false;
      return item;
    })
  }
    
//** fetch the search value and emit it to the other components */

  getsearchvalue(value,component){
    let component_type
    this.search_value=value;
    component_type=component
    this.searchModel.emit({
      componenttype:component_type,
      searchvalue :this.search_value
    });
  }

  //** Add Fields pass the selected values to the other components */
  add(){
    let record = {};
    let arrayId=[]
    const filteredValues = this.popupfieldvalues.filter(item => item.isChecked);
    filteredValues.forEach(element => {
      arrayId.push(element._id)      
    }); 
    record={
      "fieldIds":arrayId
    }

    this.emitRecord.emit({
      record :record,
      type : 'add'
    });
    if(arrayId.length){
      setTimeout(() => {
        this.closeModalPopup();
      }, 300);      
    }    
  }
  //** for selecting and de selecting the checkboxes*/
  addRecord(fields,event) {
    if (event.target.checked) {
      fields.isChecked = true;
      this.selectedList.push(fields); // this will hold the slected data for the Instance
    } else {
      fields.isChecked = false;
      const objWithIdIndex = this.selectedList.findIndex((obj) => obj._id === fields._id);
      if(objWithIdIndex > -1) this.selectedList.splice(objWithIdIndex, 1);           
    }
  }

  //** to delete the Field modal pop-up */
  deletefieldsDataPopup(record) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected data will be permanently deleted.',
        buttons: [{ key: 'yes', label: 'Remove', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true,
      }
    });
    dialogRef.componentInstance.onSelect.subscribe(res => {
      if (res === 'yes') {
        this.emitRecord.emit({
          record :[record._id],
          type : 'delete'
        });
        //this.deleteStructuredData(record);
      }
      dialogRef.close();
    });
  }
}
