import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-simulate',
  templateUrl: './simulate.component.html',
  styleUrls: ['./simulate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulateComponent {}
