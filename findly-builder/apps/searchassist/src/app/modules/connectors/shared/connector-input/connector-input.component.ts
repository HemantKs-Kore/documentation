import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-connector-input',
  templateUrl: './connector-input.component.html',
  styleUrls: ['./connector-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectorInputComponent {
  @Input() properties: any;
  @Input() valueData: any;
  @Output() inputChanges = new EventEmitter();
  isPasswordShow = true;


  //detect input onchange event
  detectInputChanges(event) {
    const obj = { type: this.properties.value, value: event?.target?.value };
    this.inputChanges.emit(obj);
  }
}
