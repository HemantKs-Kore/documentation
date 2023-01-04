import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-custom-config-list',
  templateUrl: './custom-config-list.component.html',
  styleUrls: ['./custom-config-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomConfigListComponent implements OnInit {
  @Input() customConfigList;
  @Input() isLoading = false;
  @Output() onDelete = new EventEmitter();
  @Output() onUpdate = new EventEmitter();
  constructor(
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
  }

  //delete the custom config and emit the data*/
  removeCustomConfig(item) {
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
        this.onDelete.emit(item);
      }
      else if (res === 'no') {
        dialogRef.close();
      }
    });
  }
   
  
  //**update the custom config */
  updateCustomConfig(item) {
    this.onUpdate.emit(item);
  }
}