import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { FormControl } from '@angular/forms';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'kr-summary-modal',
  templateUrl: './summary-modal.component.html',
  styleUrls: ['./summary-modal.component.scss']
})
export class SummaryModalComponent implements OnInit {
  loaderFlag: boolean = false;
  noDataFound: boolean = false;
  searchText = new FormControl(null);
  constructor(
    // private _formBuilder: FormBuilder,
    private service: ServiceInvokerService,
    private messageNotify: NotificationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SummaryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit() {
    console.log(this.dialogData);
    this.checkNoDataFound();
  }
  // No data found
  checkNoDataFound() {
    if (!this.dialogData.pdfResponse.title.length && !this.dialogData.pdfResponse.header.length
      && !this.dialogData.pdfResponse.ignoreText.length && !this.dialogData.pdfResponse.footer.length) {
      this.noDataFound = true;
    }
  }
  // delete data
  deleteRow(index, option, selectedText) {
    let obj = {
      title: "Confirmation",
      confirmationMsg: "Are you sure?",
      yes: "Confirm",
      no: "Close",
      type: "removeAnnotation"
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: { info: obj },
      panelClass: 'kr-confirmation-panel',
      disableClose: true,
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (option === 'title') {
          this.dialogData.pdfResponse.title.splice(index, 1);
          this.dialogData.pdfResponse.title_pageno.splice(index, 1);
          this.cancelSerializationData(selectedText);
        } else if (option === 'header') {
          this.dialogData.pdfResponse.header.splice(index, 1);
          this.dialogData.pdfResponse.header_pageno.splice(index, 1);
          this.cancelSerializationData(selectedText);
        } else if (option === 'ignore') {
          this.dialogData.pdfResponse.ignoreText.splice(index, 1);
          this.dialogData.pdfResponse.ignoreTextPageno.splice(index, 1);
          this.cancelSerializationData(selectedText);
        } else if (option === 'footer') {
          this.dialogData.pdfResponse.footer.splice(index, 1);
          this.dialogData.pdfResponse.footer_pageno.splice(index, 1);
          this.cancelSerializationData(selectedText);
        }
        this.checkNoDataFound();
      }
    });

  }
  // canel serilization data
  cancelSerializationData(text: string) {
    if (text && this.dialogData.pdfResponse.serialization && this.dialogData.pdfResponse.serialization.length) {
      let index = this.dialogData.pdfResponse.serialization.findIndex(res => res.selectedText === text);
      this.dialogData.pdfResponse.serialization.splice(index, 1);
    }
  }
  // close modal
  close() {
    this.dialogRef.close();
  }

}
