import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpellCorrectionRoutingModule } from './spell-correction-routing.module';
import { SpellCorrectionComponent } from './spell-correction.component';


@NgModule({
  declarations: [SpellCorrectionComponent],
  imports: [
    CommonModule,
    SpellCorrectionRoutingModule
  ]
})
export class SpellCorrectionModule { }
