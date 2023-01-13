import { Injectable, Output, EventEmitter } from '@angular/core'


@Injectable()
export class DockStatusService {
  @Output() change: EventEmitter<boolean> = new EventEmitter();

 trigger(data?) {
    this.change.next(data);
  }
}