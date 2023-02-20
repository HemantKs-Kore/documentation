import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeightsRoutingModule } from './weights-routing.module';
import { WeightsComponent } from './weights.component';
import { TranslateModule } from '@ngx-translate/core';

import { FindlySharedModule } from '../../../findly-shared/findly-shared.module';

@NgModule({
  declarations: [WeightsComponent],
  imports: [
    CommonModule,
    WeightsRoutingModule,
    FindlySharedModule,
    TranslateModule.forChild(),
  ],
})
export class WeightsModule {}
