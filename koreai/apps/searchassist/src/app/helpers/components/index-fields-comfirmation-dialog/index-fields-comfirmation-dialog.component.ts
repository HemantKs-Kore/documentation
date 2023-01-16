import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-index-fields-comfirmation-dialog',
  templateUrl: './index-fields-comfirmation-dialog.component.html',
  styleUrls: ['./index-fields-comfirmation-dialog.component.scss']
})
export class IndexFieldsComfirmationDialogComponent implements OnInit {
  onSelect = new EventEmitter();
  isSelected: boolean;
  showLearnMore: boolean;
  crossIconItem = {
    "key": "no",
    "label": ""
  }
  constructor(
    public dialogRef: MatDialogRef<IndexFieldsComfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data.resultArr,this.data.tooltipArr)
  }

  onClickOption(item) {
    this.isSelected = item.key === 'save';
    this.onSelect.emit(item.key);
  }

}
