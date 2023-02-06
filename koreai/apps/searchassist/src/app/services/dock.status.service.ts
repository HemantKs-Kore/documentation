import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class DockStatusService {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  trigger(data?) {
    this.change.next(data);
  }
}
