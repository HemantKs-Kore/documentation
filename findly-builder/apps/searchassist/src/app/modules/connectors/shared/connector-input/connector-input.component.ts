import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-connector-input',
  templateUrl: './connector-input.component.html',
  styleUrls: ['./connector-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectorInputComponent {}
