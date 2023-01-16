import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  onSelect = new EventEmitter();
  isSelected: boolean;
  showLearnMore: boolean;
  crossIconItem = {
    "key": "no",
    "label": ""
  }
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onClickOption(item) {
    this.isSelected = item.key === 'save';
    this.onSelect.emit(item.key);
  }

  onClickLearnMore() {
    this.onSelect.emit('learnMore');
  }

}
