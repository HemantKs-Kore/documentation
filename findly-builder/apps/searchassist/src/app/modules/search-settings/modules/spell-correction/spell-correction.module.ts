import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpellCorrectionRoutingModule } from './spell-correction-routing.module';
import { SpellCorrectionComponent } from './spell-correction.component';
import { FindlySharedModule } from '../../../findly-shared/findly-shared.module';

@NgModule({
  declarations: [SpellCorrectionComponent],
  imports: [CommonModule, SpellCorrectionRoutingModule, FindlySharedModule],
})
export class SpellCorrectionModule {}
