import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kr-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  dialogInfo: any = {};
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
    ) { }

  ngOnInit() {
    this.dialogInfo = this.dialogData.info;
  }
  tryAgain() {
    this.dialogRef.close(true);
  }
  close() {
    this.dialogRef.close(false);
  }
}
