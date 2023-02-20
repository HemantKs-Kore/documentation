import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  imports:[
    TranslateModule
  ]
})
export class ConfirmationComponent implements OnInit {
  dialogInfo: any = {};
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

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
