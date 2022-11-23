import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeightsRoutingModule } from './weights-routing.module';
import { WeightsComponent } from './weights.component';


@NgModule({
  declarations: [WeightsComponent],
  imports: [
    CommonModule,
    WeightsRoutingModule
  ]
})
export class WeightsModule { }
