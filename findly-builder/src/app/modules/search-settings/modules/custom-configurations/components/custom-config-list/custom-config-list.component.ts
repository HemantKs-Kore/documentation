import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';

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

  ngOnInit(): void {
  }

  //delete the custom config and emit the data*/
  removeCustomConfig(item) {
    this.onDelete.emit(item);
  } 
  //**update the custom config */
  updateCustomConfig(item) {
    this.onUpdate.emit(item);
  }
}
