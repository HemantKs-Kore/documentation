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
  @Output() onDelete = new EventEmitter();
  @Output() onUpdate = new EventEmitter();

  ngOnInit(): void {
  }

  removeCustomConfig(item) {
    this.onDelete.emit(item);
  } 

  updateCustomConfig(item) {
    this.onUpdate.emit(item);
  }
}
